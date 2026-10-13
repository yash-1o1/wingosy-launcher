use anyhow::{Context, Result};
use std::path::Path;
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

    if !cached_cover_is_valid(&file_path) {
        if file_path.exists() {
            std::fs::remove_file(&file_path).context("Failed to remove invalid cached cover")?;
        }
        let client = RomMClient::new(server_url).with_token(token.to_string());
        let bytes = client
            .download_cover(url)
            .await
            .context("Failed to download cover")?;
        anyhow::ensure!(
            cover_bytes_are_valid(&bytes),
            "Downloaded cover is not a valid image"
        );
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

fn cached_cover_is_valid(path: &Path) -> bool {
    std::fs::read(path).is_ok_and(|bytes| cover_bytes_are_valid(&bytes))
}

fn cover_bytes_are_valid(bytes: &[u8]) -> bool {
    if bytes.len() < 16 {
        return false;
    }

    let jpeg = bytes.starts_with(&[0xff, 0xd8, 0xff]) && bytes.ends_with(&[0xff, 0xd9]);
    let png =
        bytes.starts_with(b"\x89PNG\r\n\x1a\n") && bytes.windows(4).any(|window| window == b"IEND");
    let gif = bytes.starts_with(b"GIF87a") || bytes.starts_with(b"GIF89a");
    let webp = bytes.starts_with(b"RIFF")
        && bytes.get(8..12) == Some(&b"WEBP"[..])
        && bytes
            .get(4..8)
            .and_then(|value| value.try_into().ok())
            .map(u32::from_le_bytes)
            .is_some_and(|declared| declared as usize + 8 <= bytes.len());

    jpeg || png || gif || webp
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
        assert_eq!(
            extension_for_url("https://romm.example/api/roms/1/cover"),
            "jpg"
        );
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

    #[test]
    fn validates_supported_image_signatures() {
        let mut jpeg = vec![0xff, 0xd8, 0xff];
        jpeg.extend([0; 16]);
        jpeg.extend([0xff, 0xd9]);

        let mut png = b"\x89PNG\r\n\x1a\n".to_vec();
        png.extend([0; 16]);
        png.extend(b"IEND");

        let mut webp = b"RIFF".to_vec();
        webp.extend(12_u32.to_le_bytes());
        webp.extend(b"WEBP");
        webp.extend([0; 8]);

        let mut gif = b"GIF89a".to_vec();
        gif.extend([0; 16]);

        assert!(cover_bytes_are_valid(&jpeg));
        assert!(cover_bytes_are_valid(&png));
        assert!(cover_bytes_are_valid(&webp));
        assert!(cover_bytes_are_valid(&gif));
    }

    #[test]
    fn rejects_truncated_or_non_image_cover_data() {
        assert!(!cover_bytes_are_valid(&[0xff, 0xd8, 0xff, 0x00]));
        assert!(!cover_bytes_are_valid(b"<html>server error</html>"));
    }

    #[test]
    fn invalid_existing_cover_is_not_reused() {
        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join("cover.jpg");
        std::fs::write(&path, b"not an image response").unwrap();

        assert!(!cached_cover_is_valid(&path));
    }
}
