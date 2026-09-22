use anyhow::{Context, Result};
use tauri::{AppHandle, Emitter};

use crate::api::RomMClient;
use crate::config::AppConfig;
use crate::database::Database;

/// Downloads a game's remote cover image to disk and points its `cover_path`
/// at the cached file, so the UI loads it via `convertFileSrc` instead of
/// refetching it from RomM/IGDB on every render.
async fn cache_cover(
    app: &AppHandle,
    server_url: &str,
    token: &str,
    game_id: i64,
    romm_id: i32,
    url: &str,
) -> Result<()> {
    let covers_dir = AppConfig::covers_dir().context("Failed to resolve covers directory")?;
    std::fs::create_dir_all(&covers_dir).context("Failed to create covers directory")?;

    let file_name = format!(
        "cover_{romm_id}_{:x}.{}",
        md5::compute(url.as_bytes()),
        extension_for_url(url)
    );
    let file_path = covers_dir.join(file_name);

    if !file_path.exists() {
        let client = RomMClient::new(server_url).with_token(token.to_string());
        let bytes = client
            .download_cover(url)
            .await
            .context("Failed to download cover")?;
        std::fs::write(&file_path, &bytes).context("Failed to write cached cover")?;
    }

    let local_path = file_path.to_string_lossy().to_string();
    let db = Database::open().context("Failed to open database")?;
    db.update_cover_path(game_id, &local_path)
        .context("Failed to update cover path")?;

    let _ = app.emit(
        "romm-cover-cached",
        serde_json::json!({ "game_id": game_id, "cover_path": local_path }),
    );

    Ok(())
}

/// Fire-and-forget cover caching so sync isn't slowed down by image downloads.
pub fn spawn_cover_cache(
    app: AppHandle,
    server_url: String,
    token: String,
    game_id: i64,
    romm_id: i32,
    url: String,
) {
    tauri::async_runtime::spawn(async move {
        if let Err(error) = cache_cover(&app, &server_url, &token, game_id, romm_id, &url).await {
            tracing::warn!("[Covers] Failed to cache cover for game {game_id}: {error}");
        }
    });
}

/// Queues caching for every synced game whose cover still points at a remote
/// URL. Covers a prior run that was interrupted before its downloads finished,
/// since a full library sync calls this after upserting.
pub fn queue_pending_covers(app: &AppHandle, server_url: &str, token: &str, db: &Database) {
    let Ok(games) = db.get_games_with_uncached_covers() else {
        return;
    };
    for game in games {
        let (Some(romm_id), Some(cover_path)) = (game.romm_id, game.cover_path.clone()) else {
            continue;
        };
        spawn_cover_cache(
            app.clone(),
            server_url.to_string(),
            token.to_string(),
            game.id,
            romm_id,
            cover_path,
        );
    }
}

fn extension_for_url(url: &str) -> &'static str {
    let lower = url.to_ascii_lowercase();
    if lower.contains(".png") {
        "png"
    } else if lower.contains(".webp") {
        "webp"
    } else {
        "jpg"
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extension_defaults_to_jpg() {
        assert_eq!(extension_for_url("https://romm.example/api/roms/1/cover"), "jpg");
    }

    #[test]
    fn extension_detects_png() {
        assert_eq!(
            extension_for_url("https://images.igdb.com/igdb/image/upload/t_cover_big/abc.png"),
            "png"
        );
    }

    #[test]
    fn extension_detects_webp() {
        assert_eq!(extension_for_url("https://romm.example/cover.webp"), "webp");
    }
}
