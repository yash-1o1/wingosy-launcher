use crate::{
    api::{RomMClient, RomMFirmware},
    config::{AppConfig, EmulatorPaths},
};
use anyhow::{Context, Result};
use serde::Serialize;
use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};
use tokio::io::AsyncWriteExt;

#[derive(Debug, Clone)]
struct FirmwareRecord {
    platform_slug: String,
    platform_name: String,
    firmware: RomMFirmware,
}

#[derive(Debug, Clone, Serialize)]
pub struct BiosFirmwareStatus {
    pub id: i64,
    pub platform_slug: String,
    pub platform_name: String,
    pub file_name: String,
    pub file_size_bytes: u64,
    pub md5_hash: Option<String>,
    pub missing_from_fs: bool,
    pub is_downloaded: bool,
    pub local_path: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct BiosDownloadSummary {
    pub downloaded: usize,
    pub skipped: usize,
    pub paths: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct BiosDistributionResult {
    pub emulator_id: String,
    pub target_path: String,
    pub files_copied: usize,
}

#[derive(Debug)]
struct BiosTarget {
    emulator_id: &'static str,
    path: PathBuf,
    platform_slugs: &'static [&'static str],
    rename_for_retroarch: bool,
}

fn configured_client(config: &AppConfig) -> Result<RomMClient> {
    let server_url = config
        .romm
        .server_url
        .clone()
        .context("RomM server is not configured")?;
    let token = crate::romm_credentials::load_device_token(&server_url)?
        .or_else(|| config.romm.auth_token.clone())
        .context("RomM access token is not configured; reconnect in Settings")?;
    Ok(RomMClient::new(server_url).with_token(token))
}

fn safe_component(value: &str, label: &str) -> Result<String> {
    let path = Path::new(value);
    if path.components().count() != 1 {
        anyhow::bail!("Invalid {label}");
    }
    let component = path
        .file_name()
        .and_then(|value| value.to_str())
        .context(format!("Invalid {label}"))?;
    if component.is_empty() || component == "." || component == ".." {
        anyhow::bail!("Invalid {label}");
    }
    Ok(component.to_string())
}

fn target_path(root: &Path, record: &FirmwareRecord) -> Result<PathBuf> {
    let platform = safe_component(&record.platform_slug, "platform slug")?;
    let file_name = safe_component(&record.firmware.file_name, "firmware filename")?;
    Ok(root.join(platform).join(file_name))
}

async fn fetch_firmware(config: &AppConfig) -> Result<(RomMClient, Vec<FirmwareRecord>)> {
    let client = configured_client(config)?;
    let platforms = client.get_platforms().await?;
    let mut records = Vec::new();

    for platform in platforms {
        let platform_name = platform
            .display_name
            .clone()
            .unwrap_or_else(|| platform.name.clone());
        for firmware in platform.firmware {
            records.push(FirmwareRecord {
                platform_slug: platform.slug.clone(),
                platform_name: platform_name.clone(),
                firmware,
            });
        }
    }

    records.sort_by(|a, b| {
        a.platform_name
            .cmp(&b.platform_name)
            .then_with(|| a.firmware.file_name.cmp(&b.firmware.file_name))
    });
    Ok((client, records))
}

fn status_for(root: &Path, record: &FirmwareRecord) -> Result<BiosFirmwareStatus> {
    let path = target_path(root, record)?;
    let is_downloaded = path.is_file();
    Ok(BiosFirmwareStatus {
        id: record.firmware.id,
        platform_slug: record.platform_slug.clone(),
        platform_name: record.platform_name.clone(),
        file_name: record.firmware.file_name.clone(),
        file_size_bytes: record.firmware.file_size_bytes,
        md5_hash: record.firmware.md5_hash.clone(),
        missing_from_fs: record.firmware.missing_from_fs,
        is_downloaded,
        local_path: is_downloaded.then(|| path.to_string_lossy().into_owned()),
    })
}

fn md5_file(path: &Path) -> Result<String> {
    let mut file = File::open(path)?;
    let mut context = md5::Context::new();
    let mut buffer = [0_u8; 64 * 1024];
    loop {
        let read = file.read(&mut buffer)?;
        if read == 0 {
            break;
        }
        context.consume(&buffer[..read]);
    }
    Ok(format!("{:x}", context.finalize()))
}

fn file_is_current(path: &Path, expected_md5: Option<&str>) -> bool {
    if !path.is_file() {
        return false;
    }
    match expected_md5 {
        Some(expected) => md5_file(path)
            .map(|actual| actual.eq_ignore_ascii_case(expected))
            .unwrap_or(false),
        None => true,
    }
}

async fn download_record(
    client: &RomMClient,
    root: &Path,
    record: &FirmwareRecord,
) -> Result<PathBuf> {
    if record.firmware.missing_from_fs {
        anyhow::bail!(
            "{} is missing from the RomM server filesystem",
            record.firmware.file_name
        );
    }

    let target = target_path(root, record)?;
    if file_is_current(&target, record.firmware.md5_hash.as_deref()) {
        return Ok(target);
    }

    let parent = target
        .parent()
        .context("Firmware destination has no parent")?;
    tokio::fs::create_dir_all(parent).await?;
    let file_name = target
        .file_name()
        .and_then(|value| value.to_str())
        .context("Invalid firmware destination")?;
    let partial = target.with_file_name(format!("{file_name}.part"));

    let stream_result: Result<()> = async {
        let mut response = client
            .download_firmware(record.firmware.id, &record.firmware.file_name)
            .await?;
        let mut output = tokio::fs::File::create(&partial).await?;
        while let Some(chunk) = response.chunk().await? {
            output.write_all(&chunk).await?;
        }
        output.flush().await?;
        Ok(())
    }
    .await;
    if let Err(error) = stream_result {
        let _ = tokio::fs::remove_file(&partial).await;
        return Err(error);
    }

    if let Some(expected) = record.firmware.md5_hash.as_deref() {
        let actual = md5_file(&partial)?;
        if !actual.eq_ignore_ascii_case(expected) {
            let _ = tokio::fs::remove_file(&partial).await;
            anyhow::bail!(
                "MD5 mismatch for {}: expected {}, got {}",
                record.firmware.file_name,
                expected,
                actual
            );
        }
    }

    if target.exists() {
        tokio::fs::remove_file(&target).await?;
    }
    tokio::fs::rename(&partial, &target).await?;
    Ok(target)
}

#[tauri::command]
pub fn get_bios_directory() -> Result<String, String> {
    let config = AppConfig::load().unwrap_or_default();
    Ok(config.bios_dir().to_string_lossy().into_owned())
}

#[tauri::command]
pub fn set_bios_directory(path: Option<String>) -> Result<String, String> {
    let mut config = AppConfig::load().unwrap_or_default();
    config.library.bios_directory = path
        .filter(|value| !value.trim().is_empty())
        .map(PathBuf::from);
    let root = config.bios_dir();
    std::fs::create_dir_all(&root).map_err(|error| error.to_string())?;
    config.save().map_err(|error| error.to_string())?;
    Ok(root.to_string_lossy().into_owned())
}

#[tauri::command]
pub async fn list_bios_firmware() -> Result<Vec<BiosFirmwareStatus>, String> {
    let config = AppConfig::load().unwrap_or_default();
    let root = config.bios_dir();
    let (_, records) = fetch_firmware(&config)
        .await
        .map_err(|error| error.to_string())?;
    records
        .iter()
        .map(|record| status_for(&root, record).map_err(|error| error.to_string()))
        .collect()
}

#[tauri::command]
pub async fn download_bios_firmware(firmware_id: i64) -> Result<String, String> {
    let config = AppConfig::load().unwrap_or_default();
    let root = config.bios_dir();
    let (client, records) = fetch_firmware(&config)
        .await
        .map_err(|error| error.to_string())?;
    let record = records
        .iter()
        .find(|record| record.firmware.id == firmware_id)
        .context("Firmware is no longer available from RomM")
        .map_err(|error| error.to_string())?;
    download_record(&client, &root, record)
        .await
        .map(|path| path.to_string_lossy().into_owned())
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn download_all_bios_firmware() -> Result<BiosDownloadSummary, String> {
    let config = AppConfig::load().unwrap_or_default();
    let root = config.bios_dir();
    let (client, records) = fetch_firmware(&config)
        .await
        .map_err(|error| error.to_string())?;
    let mut summary = BiosDownloadSummary {
        downloaded: 0,
        skipped: 0,
        paths: Vec::new(),
    };

    for record in records
        .iter()
        .filter(|record| !record.firmware.missing_from_fs)
    {
        let path = target_path(&root, record).map_err(|error| error.to_string())?;
        let existed = file_is_current(&path, record.firmware.md5_hash.as_deref());
        let downloaded_path = download_record(&client, &root, record)
            .await
            .map_err(|error| error.to_string())?;
        if existed {
            summary.skipped += 1;
        } else {
            summary.downloaded += 1;
        }
        summary
            .paths
            .push(downloaded_path.to_string_lossy().into_owned());
    }
    Ok(summary)
}

fn executable_parent(path: &Option<PathBuf>) -> Option<PathBuf> {
    path.as_ref()?.parent().map(Path::to_path_buf)
}

fn configured_targets(paths: &EmulatorPaths) -> Vec<BiosTarget> {
    let mut targets = Vec::new();
    if let Some(parent) = executable_parent(&paths.retroarch) {
        targets.push(BiosTarget {
            emulator_id: "retroarch",
            path: parent.join("system"),
            platform_slugs: &[],
            rename_for_retroarch: true,
        });
    }
    if let Some(parent) = executable_parent(&paths.duckstation) {
        targets.push(BiosTarget {
            emulator_id: "duckstation",
            path: parent.join("bios"),
            platform_slugs: &["psx"],
            rename_for_retroarch: false,
        });
    }
    if let Some(parent) = executable_parent(&paths.pcsx2) {
        targets.push(BiosTarget {
            emulator_id: "pcsx2",
            path: parent.join("bios"),
            platform_slugs: &["ps2"],
            rename_for_retroarch: false,
        });
    }
    if let Some(parent) = executable_parent(&paths.melonds) {
        targets.push(BiosTarget {
            emulator_id: "melonds",
            path: parent,
            platform_slugs: &["nds"],
            rename_for_retroarch: false,
        });
    }
    if let Some(parent) = executable_parent(&paths.flycast) {
        targets.push(BiosTarget {
            emulator_id: "flycast",
            path: parent.join("data"),
            platform_slugs: &["dreamcast", "dc"],
            rename_for_retroarch: false,
        });
    }
    if let Some(parent) = executable_parent(&paths.mgba) {
        targets.push(BiosTarget {
            emulator_id: "mgba",
            path: parent,
            platform_slugs: &["gba"],
            rename_for_retroarch: false,
        });
    }
    targets
}

fn retroarch_filename(path: &Path) -> String {
    let original = path
        .file_name()
        .and_then(|value| value.to_str())
        .unwrap_or("firmware.bin")
        .to_string();
    let Ok(hash) = md5_file(path) else {
        return original;
    };
    match hash.as_str() {
        "924e392ed05558ffdb115408c263dccf" => "scph1001.bin",
        "8dd7d5296a650fac7319bce665a6a53c" => "scph5500.bin",
        "490f666e1afb15b7362b406ed1cea246" => "scph5501.bin",
        "32736f17079d0b2b7024407c39bd3050" => "scph5502.bin",
        "a860e8c0b6d573d191e4ec7db1b1e4f6" => "gba_bios.bin",
        "24f67bdea115a2c847c8813a628571b3" | "df692a80a5b1bc90728bc3dfc76cd948" => "bios7.bin",
        "a392174eb3e572fed6447e956bde4b25" => "bios9.bin",
        "145eaef5bd3037cbc247c213bb3da1b3" | "94bc5094607c5e6598d50472c52f27f2" => "firmware.bin",
        "2efd74e3232ff260e371b99f84024f7f" | "854b9150240a198070150e4566ae1290" => "bios_CD_U.bin",
        "e66fa1dc5820d254611fdcdba0662372" => "bios_CD_E.bin",
        "278a9397d192149e84e820ac621a8edd" => "bios_CD_J.bin",
        _ => return original,
    }
    .to_string()
}

#[tauri::command]
pub fn distribute_bios_firmware() -> Result<Vec<BiosDistributionResult>, String> {
    let config = AppConfig::load().unwrap_or_default();
    let root = config.bios_dir();
    if !root.is_dir() {
        return Ok(Vec::new());
    }

    let mut platform_files = Vec::new();
    for entry in std::fs::read_dir(&root).map_err(|error| error.to_string())? {
        let entry = entry.map_err(|error| error.to_string())?;
        if !entry.path().is_dir() {
            continue;
        }
        let slug = entry.file_name().to_string_lossy().into_owned();
        for file in std::fs::read_dir(entry.path()).map_err(|error| error.to_string())? {
            let file = file.map_err(|error| error.to_string())?;
            if file.path().is_file()
                && file.path().extension().and_then(|ext| ext.to_str()) != Some("part")
            {
                platform_files.push((slug.clone(), file.path()));
            }
        }
    }

    let mut results = Vec::new();
    for target in configured_targets(&config.emulators) {
        std::fs::create_dir_all(&target.path).map_err(|error| error.to_string())?;
        let mut copied = 0;
        for (slug, source) in &platform_files {
            if !target.platform_slugs.is_empty() && !target.platform_slugs.contains(&slug.as_str())
            {
                continue;
            }
            let target_name = if target.rename_for_retroarch {
                retroarch_filename(source)
            } else {
                source
                    .file_name()
                    .and_then(|value| value.to_str())
                    .unwrap_or("firmware.bin")
                    .to_string()
            };
            std::fs::copy(source, target.path.join(target_name))
                .map_err(|error| error.to_string())?;
            copied += 1;
        }
        results.push(BiosDistributionResult {
            emulator_id: target.emulator_id.to_string(),
            target_path: target.path.to_string_lossy().into_owned(),
            files_copied: copied,
        });
    }
    Ok(results)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn safe_component_rejects_parent_traversal() {
        assert!(safe_component("../firmware.bin", "filename").is_err());
        assert!(safe_component("..", "filename").is_err());
    }

    #[test]
    fn target_path_is_scoped_to_platform() {
        let record = FirmwareRecord {
            platform_slug: "psx".to_string(),
            platform_name: "PlayStation".to_string(),
            firmware: RomMFirmware {
                id: 1,
                file_name: "scph1001.bin".to_string(),
                file_path: String::new(),
                full_path: String::new(),
                file_size_bytes: 0,
                md5_hash: None,
                sha1_hash: None,
                missing_from_fs: false,
            },
        };
        assert_eq!(
            target_path(Path::new("C:/bios"), &record).unwrap(),
            PathBuf::from("C:/bios/psx/scph1001.bin")
        );
    }
}
