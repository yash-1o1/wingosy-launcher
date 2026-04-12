/**
 * Sidebar: bundled console icon pack (`src/data/consoleIconSet.json`, Simple Icons-derived, CC0).
 * Regenerate: `npm i -D @iconify-json/simple-icons` then `node scripts/extract-console-icons.mjs`.
 * RomM logos are only used when a platform has no entry here.
 */

export const PLATFORM_COLORS = {
  nes: "#e60012",
  snes: "#7b5aa6",
  n64: "#00a651",
  gc: "#6a5acd",
  wii: "#00a4e4",
  wiiu: "#009ac7",
  switch: "#e60012",
  gb: "#8b956d",
  gbc: "#8b008b",
  gba: "#6b5a9e",
  nds: "#b8b8b8",
  "3ds": "#d12228",
  psx: "#003087",
  ps2: "#003087",
  ps3: "#003087",
  ps4: "#003087",
  ps5: "#003087",
  psp: "#003087",
  psvita: "#003087",
  genesis: "#1a5c9b",
  saturn: "#0072c6",
  dreamcast: "#f47920",
  xbox: "#107c10",
  xbox360: "#107c10",
  arcade: "#ff6b00",
  pc: "#00bcf2",
  default: "#6366f1",
};

/** Short labels when no bundled icon and RomM logo missing or failed (clearer than slicing names). */
export const PLATFORM_INITIALS = {
  nes: "NES",
  snes: "SNES",
  n64: "N64",
  gc: "GC",
  wii: "Wii",
  wiiu: "Wii U",
  switch: "NS",
  gb: "GB",
  gbc: "GBC",
  gba: "GBA",
  nds: "DS",
  "3ds": "3DS",
  psx: "PS1",
  ps2: "PS2",
  ps3: "PS3",
  ps4: "PS4",
  ps5: "PS5",
  psp: "PSP",
  psvita: "Vita",
  genesis: "MD",
  saturn: "SAT",
  dreamcast: "DC",
  xbox: "XB",
  xbox360: "360",
  arcade: "ARC",
  pc: "PC",
};

/**
 * Icon slug in `consoleIconSet.json` (Simple Icons names). Same glyph can repeat
 * (e.g. `nintendo` for NES/SNES); tint comes from `PLATFORM_COLORS`.
 */
export const PLATFORM_PACK_SLUG = {
  nes: "nintendo",
  snes: "nintendo",
  n64: "nintendo",
  gc: "nintendogamecube",
  wii: "nintendo",
  wiiu: "nintendo",
  switch: "nintendoswitch",
  gb: "nintendo",
  gbc: "nintendo",
  gba: "nintendo",
  nds: "nintendo",
  "3ds": "nintendo3ds",
  psx: "playstation",
  ps2: "playstation2",
  ps3: "playstation3",
  ps4: "playstation4",
  ps5: "playstation5",
  psp: "playstationportable",
  psvita: "playstationvita",
  genesis: "sega",
  saturn: "sega",
  dreamcast: "sega",
  xbox: "xbox",
  xbox360: "xbox",
  arcade: "retroarch",
  pc: "windows",
};

const PACK_PREFIX = "wingosy-console";

/** Iconify id for the bundled pack, or null if unknown. */
export function packIconId(platformId) {
  const slug = PLATFORM_PACK_SLUG[platformId];
  if (!slug) return null;
  return `${PACK_PREFIX}:${slug}`;
}

export function platformInitials(platform) {
  const id = platform.id;
  if (PLATFORM_INITIALS[id]) return PLATFORM_INITIALS[id];
  const raw = (platform.short_name || platform.name || id).trim();
  if (raw.length <= 4) return raw.toUpperCase();
  const parts = raw.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return raw.slice(0, 3).toUpperCase();
}
