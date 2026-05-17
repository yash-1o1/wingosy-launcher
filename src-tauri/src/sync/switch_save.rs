//! Eden / yuzu-style Switch save paths and ZIP layout compatible with Argosy `SwitchSaveHandler`.
use anyhow::{Context, Result, bail};
use regex_lite::Regex;
use std::fs::File;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use zip::read::ZipArchive;
use zip::write::SimpleFileOptions;
use zip::{CompressionMethod, ZipWriter};

use crate::config::AppConfig;

/// Default RomM slot name when none is specified (matches Argosy `SaveSyncApiClient.DEFAULT_SAVE_NAME`).
pub const DEFAULT_SAVE_SLOT: &str = "argosy-latest";

/// RomM `emulator` query value for Eden on desktop (Argosy uses emulator id `eden` for Switch).
pub const EDEN_EMULATOR_ID: &str = "eden";

static TITLE_ID_RE: std::sync::OnceLock<Regex> = std::sync::OnceLock::new();

fn title_id_re() -> &'static Regex {
    TITLE_ID_RE.get_or_init(|| {
        Regex::new(r"(?i)\b(0100[0-9A-F]{12})\b")
            .expect("title id regex")
    })
}

pub fn extract_title_id_from_path(path: &str) -> Option<String> {
    let caps = title_id_re().captures(path)?;
    Some(caps[1].to_ascii_uppercase())
}

pub fn is_valid_title_id(title_id: &str) -> bool {
    title_id.len() == 16
        && title_id.starts_with("01")
        && title_id.chars().all(|c| c.is_ascii_hexdigit())
}

pub fn is_valid_user_folder_id(name: &str) -> bool {
    name.len() == 16 && name.chars().all(|c| c.is_ascii_hexdigit())
}

pub fn is_valid_profile_folder_id(name: &str) -> bool {
    (name.len() == 16 || name.len() == 32) && name.chars().all(|c| c.is_ascii_hexdigit())
}

/// Resolve `.../nand/user/save` for Eden on Windows.
pub fn resolve_eden_save_base(config: &AppConfig) -> PathBuf {
    if let Some(custom) = &config.emulators.eden_save_root {
        return normalize_save_base(custom);
    }

    if let Some(eden_exe) = &config.emulators.eden {
        if let Some(parent) = eden_exe.parent() {
            for candidate in [
                parent.join("user").join("nand").join("user").join("save"),
                parent.join("nand").join("user").join("save"),
            ] {
                if candidate.is_dir() {
                    return candidate;
                }
            }
        }
    }

    if let Some(appdata) = std::env::var_os("APPDATA") {
        return PathBuf::from(appdata)
            .join("Eden")
            .join("nand")
            .join("user")
            .join("save");
    }

    PathBuf::from("Eden").join("nand").join("user").join("save")
}

fn normalize_save_base(path: &Path) -> PathBuf {
    let normalized = path.to_path_buf();
    let s = normalized.to_string_lossy().replace('\\', "/");
    if s.ends_with("/nand/user/save") || s.ends_with("/user/save") {
        return normalized;
    }
    if s.ends_with("/nand/user") {
        return normalized.join("save");
    }
    if s.ends_with("/nand") {
        return normalized.join("user").join("save");
    }
    normalized.join("nand").join("user").join("save")
}

fn newest_mtime(path: &Path) -> u64 {
    let mut newest = 0u64;
    if path.is_file() {
        return path
            .metadata()
            .ok()
            .and_then(|m| m.modified().ok())
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_secs())
            .unwrap_or(0);
    }
    if !path.is_dir() {
        return 0;
    }
    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_type().is_file() {
            if let Ok(m) = entry.metadata() {
                if let Ok(modified) = m.modified() {
                    if let Ok(d) = modified.duration_since(std::time::UNIX_EPOCH) {
                        newest = newest.max(d.as_secs());
                    }
                }
            }
        }
    }
    newest
}

/// Pick the profile folder with the newest save activity (Argosy `findActiveProfileFolder` heuristic).
pub fn find_active_profile_folder(save_base: &Path) -> PathBuf {
    if !save_base.is_dir() {
        return save_base.to_path_buf();
    }

    let mut best_path: Option<PathBuf> = None;
    let mut best_time = 0u64;
    let mut first_non_zero: Option<PathBuf> = None;

    let Ok(entries) = std::fs::read_dir(save_base) else {
        return save_base.to_path_buf();
    };

    for user_entry in entries.flatten() {
        let user_path = user_entry.path();
        if !user_path.is_dir() || !is_valid_user_folder_id(&user_entry.file_name().to_string_lossy()) {
            continue;
        }
        let Ok(profiles) = std::fs::read_dir(&user_path) else {
            continue;
        };
        for profile_entry in profiles.flatten() {
            let profile_path = profile_entry.path();
            if !profile_path.is_dir() {
                continue;
            }
            let name = profile_entry.file_name().to_string_lossy().to_string();
            if !is_valid_profile_folder_id(&name) {
                continue;
            }
            let is_zero = name.chars().all(|c| c == '0');
            if !is_zero && first_non_zero.is_none() {
                first_non_zero = Some(profile_path.clone());
            }
            if !is_zero {
                let t = newest_mtime(&profile_path);
                if t > best_time {
                    best_time = t;
                    best_path = Some(profile_path);
                }
            }
        }
    }

    best_path
        .or(first_non_zero)
        .unwrap_or_else(|| save_base.to_path_buf())
}

pub fn construct_title_save_path(save_base: &Path, title_id: &str) -> PathBuf {
    let profile = find_active_profile_folder(save_base);
    profile.join(title_id.to_ascii_uppercase())
}

pub fn find_title_save_folder(save_base: &Path, title_id: &str) -> Option<PathBuf> {
    let normalized = title_id.to_ascii_uppercase();
    if !save_base.is_dir() {
        return None;
    }

    let mut best: Option<PathBuf> = None;
    let mut best_time = 0u64;

    let Ok(users) = std::fs::read_dir(save_base) else {
        return None;
    };

    for user in users.flatten() {
        let user_path = user.path();
        if !user_path.is_dir() || !is_valid_user_folder_id(&user.file_name().to_string_lossy()) {
            continue;
        }
        let Ok(profiles) = std::fs::read_dir(&user_path) else {
            continue;
        };
        for profile in profiles.flatten() {
            let profile_path = profile.path();
            if !profile_path.is_dir() {
                continue;
            }
            if !is_valid_profile_folder_id(&profile.file_name().to_string_lossy()) {
                continue;
            }
            let candidate = profile_path.join(&normalized);
            if candidate.is_dir() {
                let t = newest_mtime(&candidate);
                if best.is_none() || t > best_time {
                    best_time = t;
                    best = Some(candidate);
                }
            }
        }
    }

    best
}

pub fn resolve_local_title_save_path(
    config: &AppConfig,
    rom_path: &str,
) -> Result<(PathBuf, String)> {
    let title_id = extract_title_id_from_path(rom_path)
        .context("Could not read Switch title ID from ROM filename (expected [0100XXXXXXXXXXXX])")?;
    if !is_valid_title_id(&title_id) {
        bail!("Invalid Switch title ID: {title_id}");
    }
    let save_base = resolve_eden_save_base(config);
    let folder = find_title_save_folder(&save_base, &title_id)
        .unwrap_or_else(|| construct_title_save_path(&save_base, &title_id));
    Ok((folder, title_id))
}

/// Zip `title_dir` so the archive root is `{title_id}/...` (Argosy `zipFolder` layout).
pub fn zip_title_folder(title_dir: &Path, title_id: &str, dest_zip: &Path) -> Result<()> {
    if !title_dir.is_dir() {
        bail!("Save folder does not exist: {}", title_dir.display());
    }
    if let Some(parent) = dest_zip.parent() {
        std::fs::create_dir_all(parent)?;
    }

    let file = File::create(dest_zip)?;
    let mut zip = ZipWriter::new(file);
    let options = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);
    let root = title_id.to_ascii_uppercase();

    for entry in WalkDir::new(title_dir) {
        let entry = entry?;
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        let rel = path
            .strip_prefix(title_dir)
            .context("strip_prefix title_dir")?
            .to_string_lossy()
            .replace('\\', "/");
        let zip_path = format!("{root}/{rel}");
        zip.start_file(zip_path, options)?;
        let mut f = File::open(path)?;
        let mut buffer = Vec::new();
        f.read_to_end(&mut buffer)?;
        zip.write_all(&buffer)?;
    }

    zip.finish()?;
    Ok(())
}

/// Extract a single-root-folder Argosy/Eden zip into `target_title_dir`.
pub fn unzip_into_title_folder(zip_path: &Path, target_title_dir: &Path) -> Result<()> {
    let file = File::open(zip_path)?;
    let mut archive = ZipArchive::new(file)?;
    std::fs::create_dir_all(target_title_dir)?;

    let mut root_folder: Option<String> = None;
    for i in 0..archive.len() {
        let entry = archive.by_index(i)?;
        let name = entry.name().to_string();
        if let Some(seg) = name.split('/').next() {
            if !seg.is_empty() && name.contains('/') {
                root_folder.get_or_insert_with(|| seg.to_string());
            }
        }
    }

    for i in 0..archive.len() {
        let mut entry = archive.by_index(i)?;
        let entry_name = entry.name().to_string();
        let relative = if let Some(ref root) = root_folder {
            if entry_name.starts_with(&format!("{root}/")) {
                entry_name.strip_prefix(&format!("{root}/")).unwrap_or(&entry_name)
            } else {
                entry_name.as_str()
            }
        } else {
            entry_name.as_str()
        };

        if relative.is_empty() {
            continue;
        }

        let out_path = target_title_dir.join(relative);
        if entry.is_dir() {
            std::fs::create_dir_all(&out_path)?;
        } else {
            if let Some(parent) = out_path.parent() {
                std::fs::create_dir_all(parent)?;
            }
            let mut out = File::create(&out_path)?;
            std::io::copy(&mut entry, &mut out)?;
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_title_id_from_nsp_name() {
        let id = extract_title_id_from_path(
            r"C:\roms\switch\The Legend of Zelda Tears of the Kingdom [0100F2C0115B6000][v0].nsp",
        )
        .unwrap();
        assert_eq!(id, "0100F2C0115B6000");
    }

    #[test]
    fn rejects_invalid_title_id() {
        assert!(!is_valid_title_id("0200F2C0115B6000"));
    }
}
