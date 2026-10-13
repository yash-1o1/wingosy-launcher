use anyhow::{anyhow, Context, Result};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::time::Duration;

use crate::{config::AppConfig, retroarch_config};

const CREDENTIAL_SERVICE: &str = "com.wingosy.launcher.retroachievements";
const CREDENTIAL_ACCOUNT: &str = "current-user";
const LOGIN_URL: &str = "https://retroachievements.org/dorequest.php";

#[derive(Clone, Deserialize, Serialize)]
struct Credentials {
    username: String,
    token: String,
    #[serde(default)]
    synced_configs: Vec<PathBuf>,
}

#[derive(Serialize)]
pub struct Status {
    pub username: Option<String>,
    pub retroarch_config: Option<String>,
}

#[derive(Deserialize)]
struct LoginResponse {
    #[serde(rename = "Success")]
    success: bool,
    #[serde(rename = "User")]
    user: Option<String>,
    #[serde(rename = "Token")]
    token: Option<String>,
    #[serde(rename = "Error")]
    error: Option<String>,
}

#[cfg(target_os = "windows")]
fn load_credentials() -> Result<Option<Credentials>> {
    let entry = keyring::Entry::new(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT)
        .context("Could not open Windows Credential Manager")?;
    match entry.get_password() {
        Ok(value) => Ok(Some(
            serde_json::from_str(&value).context("Saved RetroAchievements login is invalid")?,
        )),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(error) => Err(error).context("Could not read RetroAchievements login"),
    }
}

#[cfg(not(target_os = "windows"))]
fn load_credentials() -> Result<Option<Credentials>> {
    Ok(None)
}

#[cfg(target_os = "windows")]
fn store_credentials(credentials: &Credentials) -> Result<()> {
    let entry = keyring::Entry::new(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT)
        .context("Could not open Windows Credential Manager")?;
    entry
        .set_password(&serde_json::to_string(credentials)?)
        .context("Could not save RetroAchievements login")
}

#[cfg(not(target_os = "windows"))]
fn store_credentials(_credentials: &Credentials) -> Result<()> {
    anyhow::bail!("RetroAchievements login storage is available on Windows only")
}

#[cfg(target_os = "windows")]
fn delete_credentials() -> Result<()> {
    let entry = keyring::Entry::new(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT)
        .context("Could not open Windows Credential Manager")?;
    match entry.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(error) => Err(error).context("Could not remove RetroAchievements login"),
    }
}

#[cfg(not(target_os = "windows"))]
fn delete_credentials() -> Result<()> {
    Ok(())
}

fn configured_retroarch_config() -> Result<Option<PathBuf>> {
    retroarch_config::configured_path(&AppConfig::load()?)
}

pub fn status() -> Result<Status> {
    Ok(Status {
        username: load_credentials()?.map(|credentials| credentials.username),
        retroarch_config: configured_retroarch_config()?
            .map(|path| path.to_string_lossy().into_owned()),
    })
}

pub async fn login(username: String, password: String) -> Result<Status> {
    let username = username.trim();
    if username.is_empty() || password.is_empty() {
        anyhow::bail!("Enter a RetroAchievements username and password");
    }
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(15))
        .build()
        .context("Could not prepare RetroAchievements connection")?;
    let response = client
        .post(LOGIN_URL)
        .form(&[("r", "login2"), ("u", username), ("p", password.as_str())])
        .send()
        .await
        .context("Could not reach RetroAchievements")?;
    if !response.status().is_success() {
        anyhow::bail!("RetroAchievements returned HTTP {}", response.status());
    }
    let response: LoginResponse = response
        .json()
        .await
        .context("Invalid RetroAchievements login response")?;
    if !response.success {
        anyhow::bail!(
            "{}",
            response
                .error
                .unwrap_or_else(|| "RetroAchievements rejected the login".to_string())
        );
    }
    let token = response
        .token
        .filter(|token| !token.is_empty())
        .ok_or_else(|| anyhow!("RetroAchievements did not return a login token"))?;
    let mut credentials = Credentials {
        username: response
            .user
            .filter(|user| !user.is_empty())
            .unwrap_or_else(|| username.to_string()),
        token,
        synced_configs: Vec::new(),
    };
    if let Some(previous) = load_credentials()? {
        clear_synced_configs(&previous)?;
    }
    store_credentials(&credentials)?;
    // A missing config means RetroArch has not been installed or started yet.
    // The saved login will be applied when a RetroArch game is next launched.
    if let Some(path) = configured_retroarch_config()? {
        sync_path(&path, &mut credentials)?;
    }
    status()
}

pub fn logout() -> Result<()> {
    if let Some(credentials) = load_credentials()? {
        clear_synced_configs(&credentials)?;
    }
    delete_credentials()
}

pub fn sync_to_retroarch() -> Result<PathBuf> {
    let mut credentials =
        load_credentials()?.ok_or_else(|| anyhow!("Sign in to RetroAchievements first"))?;
    let path = configured_retroarch_config()?.ok_or_else(|| {
        anyhow!("RetroArch config was not found. Configure and start RetroArch once, then retry.")
    })?;
    sync_path(&path, &mut credentials)?;
    Ok(path)
}

/// Apply the saved account before a RetroArch launch, including installs found
/// by detection that have not yet been persisted in Wingosy's config.
pub fn sync_before_launch(retroarch_exe: &Path) -> Result<()> {
    let Some(mut credentials) = load_credentials()? else {
        return Ok(());
    };
    let appdata = std::env::var_os("APPDATA").map(PathBuf::from);
    let path = retroarch_config::config_path(retroarch_exe, appdata.as_deref()).ok_or_else(|| {
        anyhow!("RetroArch config was not found. Start RetroArch once, then retry.")
    })?;
    sync_path(&path, &mut credentials)
}

fn sync_path(path: &Path, credentials: &mut Credentials) -> Result<()> {
    write_credentials(path, credentials)?;
    if !credentials.synced_configs.iter().any(|saved| saved == path) {
        credentials.synced_configs.push(path.to_path_buf());
        store_credentials(credentials)?;
    }
    Ok(())
}

fn clear_synced_configs(credentials: &Credentials) -> Result<()> {
    let mut paths = credentials.synced_configs.clone();
    if let Some(configured) = configured_retroarch_config()? {
        if !paths.contains(&configured) {
            paths.push(configured);
        }
    }
    for path in paths {
        if path.is_file() {
            clear_credentials_if_owned(&path, &credentials.username)?;
        }
    }
    Ok(())
}

fn write_credentials(path: &Path, credentials: &Credentials) -> Result<()> {
    let original = retroarch_config::read(path)?;
    let updated = retroarch_config::rewrite(
        &original,
        &[
            ("cheevos_enable", "true".to_string()),
            (
                "cheevos_username",
                retroarch_config::escape_value(&credentials.username, "RetroAchievements username")?,
            ),
            (
                "cheevos_token",
                retroarch_config::escape_value(&credentials.token, "RetroAchievements token")?,
            ),
            ("cheevos_password", String::new()),
        ],
    );
    retroarch_config::write_if_changed(path, &original, updated)
}

fn clear_credentials_if_owned(path: &Path, username: &str) -> Result<()> {
    let original = retroarch_config::read(path)?;
    let current_username = original.lines().find_map(|line| {
        let (key, value) = line.split_once('=')?;
        (key.trim() == "cheevos_username").then(|| value.trim().trim_matches('"').to_string())
    });
    if current_username.as_deref() != Some(username) {
        return Ok(());
    }
    let updated = retroarch_config::rewrite(
        &original,
        &[
            ("cheevos_enable", "false".to_string()),
            ("cheevos_username", String::new()),
            ("cheevos_token", String::new()),
            ("cheevos_password", String::new()),
        ],
    );
    retroarch_config::write_if_changed(path, &original, updated)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn config_location_prefers_portable_then_appdata() {
        let dir = tempfile::tempdir().unwrap();
        let exe = dir.path().join("retroarch.exe");
        let appdata = dir.path().join("AppData");
        std::fs::create_dir(&appdata).unwrap();
        let fallback = appdata.join("retroarch.cfg");
        std::fs::write(&fallback, "").unwrap();
        assert_eq!(retroarch_config::config_path(&exe, Some(&appdata)), Some(fallback));
        let portable = dir.path().join("retroarch.cfg");
        std::fs::write(&portable, "").unwrap();
        assert_eq!(retroarch_config::config_path(&exe, Some(&appdata)), Some(portable));
    }

    #[test]
    fn config_update_preserves_unrelated_lines_and_is_idempotent() {
        let original = "# cheevos_token = \"old\"\r\nvideo_fullscreen = \"true\"\r\ncheevos_token = \"old\"\r\n";
        let values = &[
            ("cheevos_token", "new".to_string()),
            ("cheevos_enable", "true".to_string()),
        ];
        let updated = retroarch_config::rewrite(original, values);
        assert!(updated.contains("# cheevos_token = \"old\"\r\n"));
        assert!(updated.contains("video_fullscreen = \"true\"\r\n"));
        assert!(updated.contains("cheevos_token = \"new\"\r\n"));
        assert_eq!(retroarch_config::rewrite(&updated, values), updated);
    }

    #[test]
    fn logout_does_not_clear_a_different_retroarch_account() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("retroarch.cfg");
        let original = "cheevos_username = \"someone-else\"\ncheevos_token = \"theirs\"\n";
        std::fs::write(&path, original).unwrap();
        clear_credentials_if_owned(&path, "mine").unwrap();
        assert_eq!(std::fs::read_to_string(path).unwrap(), original);
    }

    #[test]
    fn credentials_are_applied_and_removed_for_the_same_account() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("retroarch.cfg");
        std::fs::write(&path, "video_fullscreen = \"true\"\n").unwrap();
        write_credentials(
            &path,
            &Credentials {
                username: "PlayerOne".to_string(),
                token: "test-token".to_string(),
                synced_configs: Vec::new(),
            },
        )
        .unwrap();
        let signed_in = std::fs::read_to_string(&path).unwrap();
        assert!(signed_in.contains("cheevos_enable = \"true\""));
        assert!(signed_in.contains("cheevos_username = \"PlayerOne\""));
        assert!(signed_in.contains("cheevos_token = \"test-token\""));
        assert!(signed_in.contains("video_fullscreen = \"true\""));
        clear_credentials_if_owned(&path, "PlayerOne").unwrap();
        let signed_out = std::fs::read_to_string(&path).unwrap();
        assert!(signed_out.contains("cheevos_enable = \"false\""));
        assert!(signed_out.contains("cheevos_token = \"\""));
        assert!(signed_out.contains("video_fullscreen = \"true\""));
    }

    #[test]
    fn rejects_newline_in_config_credentials() {
        assert!(escaped("Player\ncheevos_enable = true").is_err());
    }
}
