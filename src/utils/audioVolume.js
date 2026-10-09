export const AMBIENT_VOLUME_DEFAULT = 35;
export const AMBIENT_VOLUME_MAX = 35;

export function normalizeAmbientVolume(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return AMBIENT_VOLUME_DEFAULT;
  return Math.min(AMBIENT_VOLUME_MAX, Math.max(0, Math.round(numeric)));
}

export function ambientVolumeToGain(value) {
  return normalizeAmbientVolume(value) / 100;
}
