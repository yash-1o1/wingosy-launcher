export const LIBRARY_STATUS_OPTIONS = [
  ["", "Not set"],
  ["backlog", "Backlog"],
  ["playing", "Playing"],
  ["completed", "Completed"],
  ["on_hold", "On hold"],
  ["dropped", "Dropped"],
];

const STATUS_LABELS = Object.fromEntries(LIBRARY_STATUS_OPTIONS);

export function formatPersonalFieldsSummary(game) {
  const parts = [];
  if (game?.library_status) {
    parts.push(STATUS_LABELS[game.library_status] || game.library_status);
  }
  if (Number(game?.personal_rating) > 0) {
    parts.push(`${game.personal_rating}/5 stars`);
  }
  if (Number(game?.personal_difficulty) > 0) {
    parts.push(`${game.personal_difficulty}/5 difficulty`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Add status, rating, and difficulty";
}
