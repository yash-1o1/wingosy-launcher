//! Background save reconciliation when Wingosy reconnects to RomM.

use anyhow::Result;
use serde::Serialize;
use std::path::Path;

use crate::config::AppConfig;
use crate::database::Database;
use crate::emulators::EmulatorLauncher;

use super::switch_save::DEFAULT_SAVE_SLOT;

#[derive(Debug, Clone, Serialize, Default)]
pub struct StartupSaveReconcileSummary {
    pub enabled: bool,
    pub candidates: usize,
    pub synchronized: usize,
    pub protected: usize,
    pub skipped: usize,
    pub failed: usize,
    pub warnings: Vec<String>,
}

pub async fn reconcile_all() -> Result<StartupSaveReconcileSummary> {
    let mut config = AppConfig::load()?;
    if !config.romm.sync_saves {
        return Ok(StartupSaveReconcileSummary::default());
    }

    let db = Database::open()?;
    let games = db.get_save_sync_candidates()?;
    let launcher = EmulatorLauncher::new(config.clone(), db.clone());
    let mut summary = StartupSaveReconcileSummary {
        enabled: true,
        candidates: games.len(),
        ..StartupSaveReconcileSummary::default()
    };

    tracing::info!(
        "[SaveSync] Startup reconciliation began for {} candidate game(s)",
        summary.candidates
    );

    for game in games {
        let Some(local_path) = game.local_file_path.as_deref() else {
            summary.skipped += 1;
            continue;
        };
        if !Path::new(local_path).exists() {
            tracing::debug!(
                "[SaveSync] Startup skipped {}: local ROM is missing ({})",
                game.name,
                local_path
            );
            summary.skipped += 1;
            continue;
        }

        if db.has_user_selected_restore_point(game.id, DEFAULT_SAVE_SLOT)? {
            tracing::info!(
                "[SaveSync] Startup skipped {}: user-selected restore point is protected",
                game.name
            );
            summary.protected += 1;
            continue;
        }

        let result = if game.platform_id == "switch" {
            super::switch_romm::pre_launch_sync(&game, &mut config).await
        } else {
            match launcher.build_command(&game) {
                Ok(command) if command.emulator_id == "retroarch" => {
                    super::retroarch_romm::pre_launch_sync(
                        &game,
                        &mut config,
                        command.core_name.as_deref(),
                    )
                    .await
                }
                Ok(_) | Err(_) => {
                    summary.skipped += 1;
                    continue;
                }
            }
        };

        match result {
            Ok(()) => {
                summary.synchronized += 1;
                let _ = db.clear_save_sync_failure(game.id);
            }
            Err(error) => {
                summary.failed += 1;
                let warning = format!("{}: {}", game.name, error);
                tracing::warn!("[SaveSync] Startup reconciliation failed: {warning}");
                let _ = db.record_save_sync_failure(game.id, "startup", &error.to_string());
                summary.warnings.push(warning);
            }
        }
    }

    tracing::info!(
        "[SaveSync] Startup reconciliation complete: synchronized={}, protected={}, skipped={}, failed={}",
        summary.synchronized,
        summary.protected,
        summary.skipped,
        summary.failed
    );
    Ok(summary)
}
