use anyhow::{bail, Context, Result};
use reqwest::{Method, StatusCode};
use serde::Serialize;
use std::path::Path;
use std::time::Duration;

use crate::{config::AppConfig, retroarch_config};

const RETROARCH_SYNC_PATH: &str = "/api/sync/retroarch/";

#[derive(Debug, Serialize)]
pub struct RetroArchCloudSyncStatus {
    pub available: bool,
    pub configured: bool,
    pub native_save_sync_active: bool,
    pub config_path: Option<String>,
    pub endpoint: Option<String>,
    pub username: Option<String>,
    pub message: String,
}

fn endpoint_for_server(server_url: &str) -> Result<String> {
    let base = server_url.trim().trim_end_matches('/');
    let parsed = url::Url::parse(base).context("RomM server URL is invalid")?;
    if !matches!(parsed.scheme(), "http" | "https") {
        bail!("RomM server URL must use HTTP or HTTPS");
    }
    Ok(format!("{base}{RETROARCH_SYNC_PATH}"))
}

fn enabled(value: Option<String>) -> bool {
    value
        .as_deref()
        .is_some_and(|value| value.eq_ignore_ascii_case("true"))
}

fn same_endpoint(left: &str, right: &str) -> bool {
    left.trim().trim_end_matches('/') == right.trim().trim_end_matches('/')
}

fn native_save_sync_active(contents: &str) -> bool {
    enabled(retroarch_config::value(contents, "cloud_sync_enable"))
        && retroarch_config::value(contents, "cloud_sync_driver")
            .as_deref()
            .is_some_and(|driver| driver.eq_ignore_ascii_case("webdav"))
        && retroarch_config::value(contents, "cloud_sync_sync_saves")
            .map(|value| value.eq_ignore_ascii_case("true"))
            .unwrap_or(true)
}

fn targets_endpoint(contents: &str, endpoint: &str) -> bool {
    retroarch_config::value(contents, "webdav_url")
        .as_deref()
        .is_some_and(|configured| same_endpoint(configured, endpoint))
}

pub fn native_save_sync_enabled_for_executable(retroarch_exe: &Path) -> Result<bool> {
    let appdata = std::env::var_os("APPDATA").map(std::path::PathBuf::from);
    let Some(path) = retroarch_config::config_path(retroarch_exe, appdata.as_deref()) else {
        return Ok(false);
    };
    Ok(native_save_sync_active(&retroarch_config::read(&path)?))
}

pub fn status() -> Result<RetroArchCloudSyncStatus> {
    let config = AppConfig::load()?;
    let endpoint = config
        .romm
        .server_url
        .as_deref()
        .map(endpoint_for_server)
        .transpose()?;
    let config_path = retroarch_config::configured_path(&config)?;

    let Some(path) = config_path else {
        return Ok(RetroArchCloudSyncStatus {
            available: false,
            configured: false,
            native_save_sync_active: false,
            config_path: None,
            endpoint,
            username: None,
            message: if config.emulators.retroarch.is_some() {
                "Start RetroArch once to create retroarch.cfg, then close it and retry.".to_string()
            } else {
                "Install or configure RetroArch 1.22 or newer first.".to_string()
            },
        });
    };

    let contents = retroarch_config::read(&path)?;
    let active = native_save_sync_active(&contents);
    let configured = endpoint
        .as_deref()
        .is_some_and(|expected| active && targets_endpoint(&contents, expected));
    let username = retroarch_config::value(&contents, "webdav_username")
        .filter(|username| !username.is_empty());
    let message = if configured {
        "RetroArch owns save and state sync; Wingosy pre/post-launch RetroArch sync is bypassed."
            .to_string()
    } else if active {
        "RetroArch save sync is already active for another WebDAV target; Wingosy will not run its competing RetroArch sync."
            .to_string()
    } else if endpoint.is_none() {
        "Connect Wingosy to RomM before configuring RetroArch Cloud Sync.".to_string()
    } else {
        "Ready to configure RomM as RetroArch's native save and state sync target.".to_string()
    };

    Ok(RetroArchCloudSyncStatus {
        available: endpoint.is_some(),
        configured,
        native_save_sync_active: active,
        config_path: Some(path.to_string_lossy().into_owned()),
        endpoint,
        username,
        message,
    })
}

fn validate_local_layout(contents: &str) -> Result<()> {
    if enabled(retroarch_config::value(
        contents,
        "savefiles_in_content_dir",
    )) || enabled(retroarch_config::value(
        contents,
        "savestates_in_content_dir",
    )) {
        bail!(
            "RetroArch is writing saves or states beside ROM files, which Cloud Sync cannot see. Turn off both content-directory save options in RetroArch, move any existing files into its saves/states folders, then retry."
        );
    }
    Ok(())
}

#[cfg(target_os = "windows")]
fn ensure_retroarch_closed(executable: &Path) -> Result<()> {
    use std::os::windows::process::CommandExt;

    let image_name = executable
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("retroarch.exe");
    let filter = format!("IMAGENAME eq {image_name}");
    let output = std::process::Command::new("tasklist")
        .args(["/FI", &filter, "/FO", "CSV", "/NH"])
        .creation_flags(0x08000000)
        .output();
    if let Ok(output) = output {
        let stdout = String::from_utf8_lossy(&output.stdout).to_lowercase();
        let quoted_name = format!("\"{}\"", image_name.to_lowercase());
        if stdout.contains(&quoted_name) {
            bail!("Close RetroArch before changing Cloud Sync settings");
        }
    }
    Ok(())
}

#[cfg(not(target_os = "windows"))]
fn ensure_retroarch_closed(_executable: &Path) -> Result<()> {
    Ok(())
}

async fn verify_endpoint(endpoint: &str, username: &str, password: &str) -> Result<()> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(15))
        .build()
        .context("Could not prepare the RetroArch Cloud Sync check")?;
    let response = client
        .request(Method::from_bytes(b"PROPFIND")?, endpoint)
        .basic_auth(username, Some(password))
        .header("Depth", "0")
        .header("Content-Type", "application/xml; charset=utf-8")
        .body(r#"<?xml version="1.0"?><propfind xmlns="DAV:"><prop><resourcetype/></prop></propfind>"#)
        .send()
        .await
        .context("Could not reach RomM's RetroArch Cloud Sync endpoint")?;

    if response.status().is_success() {
        return Ok(());
    }
    match response.status() {
        StatusCode::UNAUTHORIZED | StatusCode::FORBIDDEN => {
            bail!("RomM rejected the username or password, or this account lacks asset read/write access")
        }
        StatusCode::NOT_FOUND => {
            bail!("RomM does not expose RetroArch Cloud Sync at this URL; RomM 5.4 or newer is required")
        }
        status => bail!(
            "RomM's RetroArch Cloud Sync check returned HTTP {status}; verify that the reverse proxy allows WebDAV methods"
        ),
    }
}

fn configured_contents(
    original: &str,
    endpoint: &str,
    username: &str,
    password: &str,
) -> Result<String> {
    Ok(retroarch_config::rewrite(
        original,
        &[
            ("cloud_sync_enable", "true".to_string()),
            ("cloud_sync_driver", "webdav".to_string()),
            ("cloud_sync_destructive", "false".to_string()),
            ("cloud_sync_sync_saves", "true".to_string()),
            ("cloud_sync_sync_configs", "false".to_string()),
            ("cloud_sync_sync_thumbs", "false".to_string()),
            ("cloud_sync_sync_system", "false".to_string()),
            (
                "webdav_url",
                retroarch_config::escape_value(endpoint, "RomM Cloud Sync URL")?,
            ),
            (
                "webdav_username",
                retroarch_config::escape_value(username, "RomM username")?,
            ),
            (
                "webdav_password",
                retroarch_config::escape_value(password, "RomM password")?,
            ),
        ],
    ))
}

pub async fn configure(username: String, password: String) -> Result<RetroArchCloudSyncStatus> {
    let username = username.trim();
    if username.is_empty() || password.is_empty() {
        bail!("Enter your RomM username and password");
    }

    let config = AppConfig::load()?;
    let server_url = config
        .romm
        .server_url
        .as_deref()
        .context("Connect Wingosy to RomM first")?;
    let endpoint = endpoint_for_server(server_url)?;
    let executable = config
        .emulators
        .retroarch
        .as_deref()
        .context("Install or configure RetroArch 1.22 or newer first")?;
    let path = retroarch_config::configured_path(&config)?
        .context("Start RetroArch once to create retroarch.cfg, then close it and retry")?;
    let original = retroarch_config::read(&path)?;

    validate_local_layout(&original)?;
    if native_save_sync_active(&original) && !targets_endpoint(&original, &endpoint) {
        bail!(
            "RetroArch already syncs saves to another WebDAV target. Disable that target in RetroArch before switching it to RomM."
        );
    }

    verify_endpoint(&endpoint, username, &password).await?;
    ensure_retroarch_closed(executable)?;

    let updated = configured_contents(&original, &endpoint, username, &password)?;
    retroarch_config::write_if_changed(&path, &original, updated)?;
    status()
}

pub fn disable() -> Result<RetroArchCloudSyncStatus> {
    let config = AppConfig::load()?;
    let endpoint = config
        .romm
        .server_url
        .as_deref()
        .map(endpoint_for_server)
        .transpose()?
        .context("No RomM server is configured")?;
    let executable = config
        .emulators
        .retroarch
        .as_deref()
        .context("RetroArch is not configured")?;
    let path =
        retroarch_config::configured_path(&config)?.context("RetroArch config was not found")?;
    let original = retroarch_config::read(&path)?;
    if !targets_endpoint(&original, &endpoint) {
        bail!("RetroArch is not configured for this RomM server; no settings were changed");
    }
    ensure_retroarch_closed(executable)?;
    let updated = retroarch_config::rewrite(
        &original,
        &[
            ("cloud_sync_enable", "false".to_string()),
            ("webdav_url", String::new()),
            ("webdav_username", String::new()),
            ("webdav_password", String::new()),
        ],
    );
    retroarch_config::write_if_changed(&path, &original, updated)?;
    status()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builds_the_romm_retroarch_endpoint() {
        assert_eq!(
            endpoint_for_server("https://romm.example/base/").unwrap(),
            "https://romm.example/base/api/sync/retroarch/"
        );
    }

    #[test]
    fn detects_native_save_sync_without_requiring_a_romm_target() {
        let config = r#"
cloud_sync_enable = "true"
cloud_sync_driver = "webdav"
cloud_sync_sync_saves = "true"
webdav_url = "https://other.example/dav/"
"#;
        assert!(native_save_sync_active(config));
        assert!(!targets_endpoint(
            config,
            "https://romm.example/api/sync/retroarch/"
        ));
    }

    #[test]
    fn inactive_or_non_save_cloud_sync_does_not_block_wingosy() {
        assert!(!native_save_sync_active(
            "cloud_sync_enable = \"false\"\ncloud_sync_driver = \"webdav\"\ncloud_sync_sync_saves = \"true\"\n"
        ));
        assert!(!native_save_sync_active(
            "cloud_sync_enable = \"true\"\ncloud_sync_driver = \"webdav\"\ncloud_sync_sync_saves = \"false\"\n"
        ));
        assert!(native_save_sync_active(
            "cloud_sync_enable = \"true\"\ncloud_sync_driver = \"webdav\"\n"
        ));
    }

    #[test]
    fn rejects_content_directory_save_layouts() {
        assert!(validate_local_layout("savefiles_in_content_dir = \"true\"\n").is_err());
        assert!(validate_local_layout("savestates_in_content_dir = \"true\"\n").is_err());
        assert!(validate_local_layout(
            "savefiles_in_content_dir = \"false\"\nsavestates_in_content_dir = \"false\"\n"
        )
        .is_ok());
    }

    #[test]
    fn configures_only_safe_native_sync_categories() {
        let updated = configured_contents(
            "video_fullscreen = \"true\"\ncloud_sync_sync_configs = \"true\"\n",
            "https://romm.example/api/sync/retroarch/",
            "player",
            "secret",
        )
        .unwrap();
        assert!(updated.contains("cloud_sync_enable = \"true\""));
        assert!(updated.contains("cloud_sync_driver = \"webdav\""));
        assert!(updated.contains("cloud_sync_destructive = \"false\""));
        assert!(updated.contains("cloud_sync_sync_saves = \"true\""));
        assert!(updated.contains("cloud_sync_sync_configs = \"false\""));
        assert!(updated.contains("cloud_sync_sync_thumbs = \"false\""));
        assert!(updated.contains("cloud_sync_sync_system = \"false\""));
        assert!(updated.contains("webdav_username = \"player\""));
        assert!(updated.contains("webdav_password = \"secret\""));
        assert!(updated.contains("video_fullscreen = \"true\""));
    }
}
