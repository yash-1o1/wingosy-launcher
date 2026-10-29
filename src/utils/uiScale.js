export const DEFAULT_UI_SCALE = 100;
export const MIN_UI_SCALE = 75;
export const MAX_UI_SCALE = 150;
export const UI_SCALE_STEP = 5;

export function normalizeUiScale(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_UI_SCALE;

  const stepped = Math.round(numeric / UI_SCALE_STEP) * UI_SCALE_STEP;
  return Math.min(MAX_UI_SCALE, Math.max(MIN_UI_SCALE, stepped));
}

export function uiScaleFactor(value) {
  return normalizeUiScale(value) / 100;
}
