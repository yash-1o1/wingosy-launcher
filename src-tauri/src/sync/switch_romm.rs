//! Argosy-compatible Switch (Eden) save sync via RomM device-aware API.
use anyhow::{Context, Result};
use serde::Serialize;
use std::path::PathBuf;

use crate::api::RomMClient;
use crate::api::RomMSave;
use crate::config::AppConfig;
use crate::models::Game;

use super::switch_save::{
    DEFAULT_SAVE_SLOT, EDEN_EMULATOR_ID, resolve_local_title_save_path, unzip_into_title_folder,
    zip_title_folder,
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
    let token = config
        .romm
        .auth_token
        .as_deref()
        .context("RomM not connected")?;
    Ok(RomMClient::new(url).with_token(token.to_string()))
}

fn slot_name(slot: Option<&str>) -> &str {
    slot.filter(|s| !s.trim().is_empty())
        .unwrap_or(DEFAULT_SAVE_SLOT)
}

fn upload_filename(slot: &str) -> String {
    if slot.ends_with(".zip") {
        slot.to_string()
    } else {
        format!("{slot}.zip")
    }
}

fn pick_save_for_slot<'a>(saves: &'a [RomMSave], slot: &str) -> Option<&'a RomMSave> {
    saves
        .iter()
        .filter(|s| {
            s.slot
                .as_deref()
                .map(|x| x.eq_ignore_ascii_case(slot))
                .unwrap_or(false)
                || (slot == DEFAULT_SAVE_SLOT
                    && s.file_name
                        .to_ascii_lowercase()
                        .contains("argosy-latest"))
        })
        .max_by(|a, b| a.updated_at.cmp(&b.updated_at))
}

pub async fn upload_switch_save_from_eden(
    game: &Game,
    config: &mut AppConfig,
    slot: Option<String>,
) -> Result<SwitchSaveSyncResult> {
    let romm_id = game
        .romm_id
        .context("Game is not linked to RomM")?;
    let rom_path = game
        .local_file_path
        .as_deref()
        .or(Some(game.file_path.as_str()))
        .context("No local ROM path")?;

    let (title_dir, title_id) = resolve_local_title_save_path(config, rom_path)?;
    let slot_s = slot_name(slot.as_deref()).to_string();

    let cache_dir = AppConfig::data_dir()
        .map(|d| d.join("save_sync_cache"))
        .unwrap_or_else(|_| PathBuf::from("save_sync_cache"));
    std::fs::create_dir_all(&cache_dir)?;
    let zip_path = cache_dir.join(format!("upload_{romm_id}_{slot_s}.zip"));
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
            &upload_filename(&slot_s),
            true,
        )
        .await?;

    let _ = std::fs::remove_file(&zip_path);

    Ok(SwitchSaveSyncResult {
        success: true,
        message: format!(
            "Uploaded Switch save for {title_id} to RomM (slot: {slot_s})"
        ),
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
    let romm_id = game
        .romm_id
        .context("Game is not linked to RomM")?;
    let rom_path = game
        .local_file_path
        .as_deref()
        .or(Some(game.file_path.as_str()))
        .context("No local ROM path")?;

    let (title_dir, title_id) = resolve_local_title_save_path(config, rom_path)?;
    let slot_s = slot_name(slot.as_deref()).to_string();

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
        let picked = pick_save_for_slot(&saves, &slot_s)
            .or_else(|| saves.iter().max_by(|a, b| a.updated_at.cmp(&b.updated_at)));
        picked
            .cloned()
            .context(format!("No save found on RomM for slot {slot_s}"))?
    };

    let bytes = client.download_save_content_device(&save, &device_id).await?;

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
    let result = download_switch_save_to_eden(game, config, None, None).await;
    match result {
        Ok(r) => tracing::info!("[SaveSync] Pre-launch: {}", r.message),
        Err(e) => tracing::warn!("[SaveSync] Pre-launch download skipped: {e}"),
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
    let result = upload_switch_save_from_eden(game, config, None).await;
    match result {
        Ok(r) => tracing::info!("[SaveSync] Post-launch: {}", r.message),
        Err(e) => tracing::warn!("[SaveSync] Post-launch upload failed: {e}"),
    }
    Ok(())
}
