use anyhow::{Context, Result};
use std::path::{Path, PathBuf};

use crate::config::AppConfig;

pub fn config_path(retroarch_exe: &Path, appdata: Option<&Path>) -> Option<PathBuf> {
    let portable = retroarch_exe.parent()?.join("retroarch.cfg");
    if portable.is_file() {
        return Some(portable);
    }

    let appdata = appdata?;
    [
        appdata.join("retroarch.cfg"),
        appdata.join("RetroArch").join("retroarch.cfg"),
    ]
    .into_iter()
    .find(|path| path.is_file())
}

pub fn configured_path(config: &AppConfig) -> Result<Option<PathBuf>> {
    let Some(exe) = config.emulators.retroarch.as_deref() else {
        return Ok(None);
    };
    if !exe.is_file() {
        return Ok(None);
    }
    let appdata = std::env::var_os("APPDATA").map(PathBuf::from);
    Ok(config_path(exe, appdata.as_deref()))
}

pub fn escape_value(value: &str, label: &str) -> Result<String> {
    if value.chars().any(char::is_control) {
        anyhow::bail!("{label} contains an unsupported control character");
    }
    Ok(value.replace('\\', "\\\\").replace('"', "\\\""))
}

pub fn value(original: &str, name: &str) -> Option<String> {
    original.lines().find_map(|line| {
        let trimmed = line.trim_start();
        if trimmed.starts_with('#') {
            return None;
        }
        let (key, value) = line.split_once('=')?;
        (key.trim() == name).then(|| value.trim().trim_matches('"').to_string())
    })
}

pub fn rewrite(original: &str, replacements: &[(&str, String)]) -> String {
    let newline = if original.contains("\r\n") {
        "\r\n"
    } else {
        "\n"
    };
    let mut seen = std::collections::HashSet::new();
    let mut lines = Vec::new();
    for line in original.lines() {
        let key = line.split_once('=').map(|(key, _)| key.trim());
        if let Some((key, value)) = replacements.iter().find(|(name, _)| Some(*name) == key) {
            if seen.insert(*key) {
                lines.push(format!("{key} = \"{value}\""));
            }
        } else {
            lines.push(line.to_string());
        }
    }
    for (key, value) in replacements {
        if seen.insert(*key) {
            lines.push(format!("{key} = \"{value}\""));
        }
    }
    format!("{}{}", lines.join(newline), newline)
}

pub fn read(path: &Path) -> Result<String> {
    std::fs::read_to_string(path).context("Could not read RetroArch config")
}

pub fn write_if_changed(path: &Path, original: &str, updated: String) -> Result<()> {
    if updated != original {
        std::fs::write(path, updated).context("Could not update RetroArch config")?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn config_location_prefers_portable_then_appdata_layouts() {
        let dir = tempfile::tempdir().unwrap();
        let exe = dir.path().join("retroarch.exe");
        let appdata = dir.path().join("AppData");
        std::fs::create_dir_all(appdata.join("RetroArch")).unwrap();
        let nested = appdata.join("RetroArch").join("retroarch.cfg");
        std::fs::write(&nested, "").unwrap();
        assert_eq!(config_path(&exe, Some(&appdata)), Some(nested));

        let fallback = appdata.join("retroarch.cfg");
        std::fs::write(&fallback, "").unwrap();
        assert_eq!(config_path(&exe, Some(&appdata)), Some(fallback));

        let portable = dir.path().join("retroarch.cfg");
        std::fs::write(&portable, "").unwrap();
        assert_eq!(config_path(&exe, Some(&appdata)), Some(portable));
    }

    #[test]
    fn rewrite_preserves_unrelated_lines_comments_and_newlines() {
        let original = "# cloud_sync_enable = \"false\"\r\nvideo_fullscreen = \"true\"\r\ncloud_sync_enable = \"false\"\r\n";
        let replacements = &[
            ("cloud_sync_enable", "true".to_string()),
            ("cloud_sync_driver", "webdav".to_string()),
        ];
        let updated = rewrite(original, replacements);
        assert!(updated.contains("# cloud_sync_enable = \"false\"\r\n"));
        assert!(updated.contains("video_fullscreen = \"true\"\r\n"));
        assert!(updated.contains("cloud_sync_enable = \"true\"\r\n"));
        assert!(updated.contains("cloud_sync_driver = \"webdav\"\r\n"));
        assert_eq!(rewrite(&updated, replacements), updated);
    }

    #[test]
    fn value_ignores_comments() {
        let config = "# webdav_url = \"old\"\nwebdav_url = \"https://romm.example/api/\"\n";
        assert_eq!(
            value(config, "webdav_url").as_deref(),
            Some("https://romm.example/api/")
        );
    }
}
