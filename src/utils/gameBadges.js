const RECENTLY_ADDED_WINDOW_MS = 24 * 60 * 60 * 1000;

function timestampValue(value) {
  if (typeof value !== "string" || !value.trim()) return Number.NaN;
  const trimmed = value.trim();
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed)
    ? trimmed
    : `${trimmed.replace(" ", "T")}Z`;
  return Date.parse(normalized);
}

export function isRecentlyAddedUnplayed(game, now = Date.now()) {
  const localPath = typeof game?.local_file_path === "string"
    ? game.local_file_path.trim()
    : "";
  if (!localPath || game?.last_played_at || Number(game?.play_count) > 0) {
    return false;
  }

  const addedAt = timestampValue(game?.created_at);
  const age = now - addedAt;
  return Number.isFinite(addedAt) && age >= 0 && age <= RECENTLY_ADDED_WINDOW_MS;
}
