function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function paletteFromHue(hue) {
  return {
    main: hslToHex(hue, 70, 50),
    light: hslToHex(hue, 70, 65),
    dark: hslToHex(hue, 70, 35),
  };
}

export function normalizeAccentHue(hue) {
  return typeof hue === "number" && Number.isFinite(hue)
    ? Math.min(360, Math.max(0, Math.round(hue)))
    : null;
}

function resolvePalette(hue, fallback) {
  const normalizedHue = normalizeAccentHue(hue);
  return normalizedHue === null ? fallback : paletteFromHue(normalizedHue);
}

export function resolveAccentPalettes(primaryHue, secondaryHue, defaultPrimary) {
  const primary = resolvePalette(primaryHue, defaultPrimary);
  const secondary = resolvePalette(secondaryHue, primary);
  return { primary, secondary };
}
