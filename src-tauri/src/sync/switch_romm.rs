//! Argosy-compatible Switch (Eden) save sync via RomM device-aware API.
use anyhow::{Context, Result};
use serde::Serialize;
use std::path::PathBuf;

use crate::api::RomMClient;
use crate::api::RomMSave;
use crate::config::AppConfig;
use crate::models::Game;

use super::switch_save::{
    resolve_local_title_save_path, unzip_into_title_folder, zip_title_folder,
    ARGOSY_LATEST_SAVE_NAME, DEFAULT_SAVE_SLOT, EDEN_EMULATOR_ID,
};

#[derive(Debug, Clone, Serialize)]
pub struct SwitchSaveSyncResult {
    pub success: bool,
    pub message: String,
    pub local_path: Option<String>,
    pub romm_save_id: Option<i32>,
    pub slot: Option<String>,
}

pub fn ensure_device_id(config: &mut AppConfig) -> String {
    if let Some(id) = config.romm.device_id.clone() {
        if !id.trim().is_empty() {
            return id;
        }
    }
    let host = std::env::var("COMPUTERNAME")
        .or_else(|_| std::env::var("HOSTNAME"))
        .unwrap_or_else(|_| "wingosy".to_string());
    let id = format!("wingosy-{}", host.to_lowercase().replace(' ', "-"));
    config.romm.device_id = Some(id.clone());
    let _ = config.save();
    id
}

fn romm_client(config: &AppConfig) -> Result<RomMClient> {
    let url = config
        .romm
        .server_url
        .as_deref()
        .context("RomM server URL not configured")?;
    let token = crate::romm_credentials::load_device_token(url)?
        .or_else(|| config.romm.auth_token.clone())
        .context("RomM not connected")?;
    Ok(RomMClient::new(url).with_token(token))
}

fn slot_name(slot: Option<&str>) -> &str {
    slot.filter(|s| !s.trim().is_empty())
        .unwrap_or(DEFAULT_SAVE_SLOT)
}

fn is_latest_slot_name(slot: &str) -> bool {
    slot.eq_ignore_ascii_case(DEFAULT_SAVE_SLOT)
        || slot.eq_ignore_ascii_case(ARGOSY_LATEST_SAVE_NAME)
}

fn is_latest_save(save: &RomMSave, rom_base_name: Option<&str>) -> bool {
    if let Some(slot) = save.slot.as_deref() {
        if is_latest_slot_name(slot) {
            return true;
        }
    }

    let stem = save
        .file_name
        .rsplit_once('.')
        .map(|(name, _)| name)
        .unwrap_or(save.file_name.as_str());
    if is_latest_slot_name(stem) {
        return true;
    }

    rom_base_name
        .map(|base| stem.eq_ignore_ascii_case(base))
        .unwrap_or(false)
}

fn safe_file_stem(name: &str) -> String {
    let stem = std::path::Path::new(name)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or(name)
        .trim();
    let cleaned: String = stem
        .chars()
        .map(|c| match c {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => '_',
            _ => c,
        })
        .collect();
    let cleaned = cleaned.trim_matches(|c| c == ' ' || c == '.');
    if cleaned.is_empty() {
        ARGOSY_LATEST_SAVE_NAME.to_string()
    } else {
        cleaned.to_string()
    }
}

fn rom_base_name(game: &Game) -> String {
    let candidate = if !game.name.trim().is_empty() {
        game.name.as_str()
    } else {
        game.file_path.as_str()
    };
    safe_file_stem(candidate)
}

fn upload_filename(slot: &str, rom_base_name: &str) -> String {
    let stem = if is_latest_slot_name(slot) {
        rom_base_name
    } else {
        slot.strip_suffix(".zip").unwrap_or(slot)
    };
    format!("{}.zip", safe_file_stem(stem))
}

fn pick_save_for_slot<'a>(
    saves: &'a [RomMSave],
    slot: &str,
    rom_base_name: Option<&str>,
) -> Option<&'a RomMSave> {
    saves
        .iter()
        .filter(|s| {
            s.slot
                .as_deref()
                .map(|x| x.eq_ignore_ascii_case(slot))
                .unwrap_or(false)
                || (is_latest_slot_name(slot) && is_latest_save(s, rom_base_name))
        })
        .max_by(|a, b| a.updated_at.cmp(&b.updated_at))
}

pub async fn upload_switch_save_from_eden(
    game: &Game,
    config: &mut AppConfig,
    slot: Option<String>,
) -> Result<SwitchSaveSyncResult> {
    let romm_id = game.romm_id.context("Game is not linked to RomM")?;
    let rom_path = game
        .local_file_path
        .as_deref()
        .or(Some(game.file_path.as_str()))
        .context("No local ROM path")?;

    let (title_dir, title_id) = resolve_local_title_save_path(config, rom_path)?;
    let slot_s = slot_name(slot.as_deref()).to_string();
    let rom_base = rom_base_name(game);

    let cache_dir = AppConfig::data_dir()
        .map(|d| d.join("save_sync_cache"))
        .unwrap_or_else(|_| PathBuf::from("save_sync_cache"));
    std::fs::create_dir_all(&cache_dir)?;
    let zip_path = cache_dir.join(format!("upload_{romm_id}_{}.zip", safe_file_stem(&slot_s)));
    zip_title_folder(&title_dir, &title_id, &zip_path)?;

    let zip_bytes = std::fs::read(&zip_path)?;
    let client = romm_client(config)?;
    let device_id = ensure_device_id(config);
    let uploaded = client
        .upload_save_device(
            romm_id,
            EDEN_EMULATOR_ID,
            &device_id,
            Some(&slot_s),
            zip_bytes,
            &upload_filename(&slot_s, &rom_base),
            false,
        )
        .await?;

    let _ = std::fs::remove_file(&zip_path);

    Ok(SwitchSaveSyncResult {
        success: true,
        message: format!("Uploaded Switch save for {title_id} to RomM (slot: {slot_s})"),
        local_path: Some(title_dir.to_string_lossy().into_owned()),
        romm_save_id: Some(uploaded.id),
        slot: Some(slot_s),
    })
}

pub async fn download_switch_save_to_eden(
    game: &Game,
    config: &mut AppConfig,
    slot: Option<String>,
    save_id: Option<i32>,
) -> Result<SwitchSaveSyncResult> {
    let romm_id = game.romm_id.context("Game is not linked to RomM")?;
    let rom_path = game
        .local_file_path
        .as_deref()
        .or(Some(game.file_path.as_str()))
        .context("No local ROM path")?;

    let (title_dir, title_id) = resolve_local_title_save_path(config, rom_path)?;
    let slot_s = slot_name(slot.as_deref()).to_string();
    let rom_base = rom_base_name(game);

    let client = romm_client(config)?;
    let device_id = ensure_device_id(config);

    let save = if let Some(id) = save_id {
        client
            .get_saves_for_rom_device(romm_id, &device_id)
            .await?
            .into_iter()
            .find(|s| s.id == id)
            .context("Save not found on server")?
    } else {
        let saves = client.get_saves_for_rom_device(romm_id, &device_id).await?;
        let picked = pick_save_for_slot(&saves, &slot_s, Some(&rom_base))
            .or_else(|| saves.iter().max_by(|a, b| a.updated_at.cmp(&b.updated_at)));
        picked
            .cloned()
            .context(format!("No save found on RomM for slot {slot_s}"))?
    };

    let bytes = client
        .download_save_content_device(&save, &device_id)
        .await?;

    let cache_dir = AppConfig::data_dir()
        .map(|d| d.join("save_sync_cache"))
        .unwrap_or_else(|_| PathBuf::from("save_sync_cache"));
    std::fs::create_dir_all(&cache_dir)?;
    let zip_path = cache_dir.join(format!("download_{romm_id}_{}.zip", save.id));
    std::fs::write(&zip_path, bytes)?;

    if title_dir.exists() {
        let backup = cache_dir.join(format!(
            "backup_{}_{}.zip",
            title_id,
            chrono::Utc::now().timestamp()
        ));
        let _ = zip_title_folder(&title_dir, &title_id, &backup);
    }

    unzip_into_title_folder(&zip_path, &title_dir)?;
    client.confirm_save_downloaded(save.id, &device_id).await?;
    let _ = std::fs::remove_file(&zip_path);

    Ok(SwitchSaveSyncResult {
        success: true,
        message: format!(
            "Restored Switch save {title_id} from RomM (slot: {}, save id: {})",
            save.slot.as_deref().unwrap_or(&slot_s),
            save.id
        ),
        local_path: Some(title_dir.to_string_lossy().into_owned()),
        romm_save_id: Some(save.id),
        slot: save.slot.or(Some(slot_s)),
    })
}

pub async fn pre_launch_sync(game: &Game, config: &mut AppConfig) -> Result<()> {
    if !config.romm.sync_saves {
        return Ok(());
    }
    if game.platform_id != "switch" {
        return Ok(());
    }
    let result = negotiated_launch_sync(game, config, true).await;
    match result {
        Ok(r) => tracing::info!("[SaveSync] Pre-launch: {}", r.message),
        Err(e) => {
            tracing::warn!("[SaveSync] Pre-launch sync skipped: {e}");
            return Err(e);
        }
    }
    Ok(())
}

pub async fn post_launch_sync(game: &Game, config: &mut AppConfig) -> Result<()> {
    if !config.romm.sync_saves {
        return Ok(());
    }
    if game.platform_id != "switch" {
        return Ok(());
    }
    let result = negotiated_launch_sync(game, config, false).await;
    match result {
        Ok(r) => tracing::info!("[SaveSync] Post-launch: {}", r.message),
        Err(e) => {
            tracing::warn!("[SaveSync] Post-launch sync failed: {e}");
            return Err(e);
        }
    }
    Ok(())
}

async fn negotiated_launch_sync(
    game: &Game,
    config: &mut AppConfig,
    allow_download: bool,
) -> Result<SwitchSaveSyncResult> {
    let romm_id = game.romm_id.context("Game is not linked to RomM")?;
    let rom_path = game
        .local_file_path
        .as_deref()
        .unwrap_or(game.file_path.as_str());
    let slot = slot_name(None).to_string();
    let rom_base = rom_base_name(game);
    let client = romm_client(config)?;
    let device_id = ensure_device_id(config);

    let client_saves = match resolve_local_title_save_path(config, rom_path) {
        Ok((title_dir, title_id)) if title_dir.exists() => {
            let cache_dir = AppConfig::data_dir()
                .map(|dir| dir.join("save_sync_cache"))
                .unwrap_or_else(|_| PathBuf::from("save_sync_cache"));
            std::fs::create_dir_all(&cache_dir)?;
            let snapshot = cache_dir.join(format!("negotiate_{romm_id}.zip"));
            zip_title_folder(&title_dir, &title_id, &snapshot)?;
            let bytes = std::fs::read(&snapshot)?;
            let _ = std::fs::remove_file(&snapshot);
            let modified = walkdir::WalkDir::new(&title_dir)
                .into_iter()
                .filter_map(|entry| entry.ok())
                .filter_map(|entry| entry.metadata().ok()?.modified().ok())
                .max()
                .unwrap_or(std::time::SystemTime::UNIX_EPOCH);
            vec![crate::sync::negotiation::client_save_state(
                romm_id,
                upload_filename(&slot, &rom_base),
                slot.clone(),
                EDEN_EMULATOR_ID,
                &bytes,
                modified,
            )]
        }
        _ => vec![],
    };

    let plan = client.negotiate_sync(&device_id, client_saves).await?;
    let operation = crate::sync::negotiation::operation_for(&plan, romm_id, &slot).cloned();
    let result = match operation.as_ref().map(|operation| operation.action.as_str()) {
        Some("upload") => upload_switch_save_from_eden(game, config, Some(slot.clone())).await,
        Some("download") if allow_download => {
            let save_id = operation.as_ref().and_then(|operation| operation.save_id);
            download_switch_save_to_eden(game, config, Some(slot.clone()), save_id).await
        }
        Some("download") => Err(anyhow::anyhow!(
            "RomM has a newer save after this play session; local upload was blocked"
        )),
        Some("conflict") => Err(anyhow::anyhow!(
            "Save conflict: {}",
            operation.as_ref().map(|op| op.reason.as_str()).unwrap_or("both saves changed")
        )),
        Some("no_op") | None => Ok(SwitchSaveSyncResult {
            success: true,
            message: "Switch save is already synchronized".to_string(),
            local_path: None,
            romm_save_id: operation.as_ref().and_then(|operation| operation.save_id),
            slot: Some(slot),
        }),
        Some(other) => Err(anyhow::anyhow!("Unsupported sync action: {other}")),
    };

    let operation_was_planned = matches!(
        operation.as_ref().map(|operation| operation.action.as_str()),
        Some("upload" | "download" | "conflict")
    );
    let (completed, failed) = match (operation_was_planned, result.is_ok()) {
        (false, _) => (0, 0),
        (true, true) => (1, 0),
        (true, false) => (0, 1),
    };
    client
        .complete_sync_session(plan.session_id, completed, failed)
        .await?;
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    fn save(id: i32, file_name: &str, slot: Option<&str>, updated_at: &str) -> RomMSave {
        RomMSave {
            id,
            rom_id: 7,
            file_name: file_name.to_string(),
            file_size_bytes: 128,
            emulator: Some(EDEN_EMULATOR_ID.to_string()),
            created_at: updated_at.to_string(),
            updated_at: updated_at.to_string(),
            slot: slot.map(|s| s.to_string()),
        }
    }

    #[test]
    fn default_slot_matches_argosy_autosave() {
        assert_eq!(slot_name(None), "autosave");
        assert_eq!(slot_name(Some("")), "autosave");
    }

    #[test]
    fn latest_detection_accepts_argosy_and_wingosy_names() {
        assert!(is_latest_save(
            &save(1, "The Game.zip", Some("autosave"), "2026-01-01"),
            Some("The Game")
        ));
        assert!(is_latest_save(
            &save(2, "argosy-latest.zip", None, "2026-01-01"),
            Some("The Game")
        ));
        assert!(is_latest_save(
            &save(3, "The Game.zip", None, "2026-01-01"),
            Some("The Game")
        ));
    }

    #[test]
    fn pick_latest_slot_prefers_newest_compatible_save() {
        let saves = vec![
            save(1, "manual.zip", Some("manual"), "2026-01-03"),
            save(2, "argosy-latest.zip", None, "2026-01-01"),
            save(3, "The Game.zip", Some("autosave"), "2026-01-02"),
        ];

        let picked = pick_save_for_slot(&saves, "autosave", Some("The Game")).unwrap();
        assert_eq!(picked.id, 3);
    }

    #[test]
    fn latest_upload_filename_uses_rom_base_name() {
        assert_eq!(upload_filename("autosave", "The Game"), "The Game.zip");
        assert_eq!(upload_filename("argosy-latest", "The Game"), "The Game.zip");
        assert_eq!(upload_filename("slot-1", "The Game"), "slot-1.zip");
    }
}
