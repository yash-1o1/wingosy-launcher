export function initializeSyncRows(platforms) {
  return platforms.map((platform) => ({
    ...platform,
    status: "idle",
    processed: 0,
    total: platform.server_games,
    result: null,
    error: null,
  }));
}

export function updateSyncProgress(rows, progress) {
  return rows.map((row) =>
    row.romm_platform_id === progress.romm_platform_id
      ? {
          ...row,
          status: "syncing",
          processed: progress.processed,
          total: progress.total,
          error: null,
        }
      : row
  );
}

export function finishPlatformSync(rows, rommPlatformId, result, syncedAt = new Date().toISOString()) {
  return rows.map((row) =>
    row.romm_platform_id === rommPlatformId
      ? {
          ...row,
          status: "complete",
          processed: result.total_games,
          total: result.total_games,
          server_games: result.total_games,
          local_games: result.total_games,
          result,
          error: null,
          syncedAt,
        }
      : row
  );
}

export function failPlatformSync(rows, rommPlatformId, error) {
  return rows.map((row) =>
    row.romm_platform_id === rommPlatformId
      ? { ...row, status: "failed", error, result: null }
      : row
  );
}
