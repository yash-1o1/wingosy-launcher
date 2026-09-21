/**
 * Community rating shown alongside the player's own rating.
 *
 * The backend resolves this from RomM metadata in priority order — IGDB
 * aggregated score, IGDB total score, then RomM's own community average — and
 * exposes it as `user_rating` on a 0-100 scale. A missing or zero value means
 * no source supplied a rating, so the field is hidden rather than shown as 0.
 */
export function formatCommunityRating(game) {
  const rating = Number(game?.user_rating);
  if (!Number.isFinite(rating) || rating <= 0) return null;
  return `${rating.toFixed(1)} / 100`;
}
