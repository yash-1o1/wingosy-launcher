/**
 * @typedef {Object} CoverAppearance
 * @property {"vertical" | "square" | "horizontal"} aspectRatio
 * @property {number} cornerRadius
 * @property {"minimal" | "border" | "glow"} frameStyle
 * @property {"hidden" | "top-left" | "top-right"} badgePosition
 * @property {number} badgeInset
 */

/** @type {Readonly<CoverAppearance>} */
export const DEFAULT_COVER_APPEARANCE = Object.freeze({
  aspectRatio: "vertical",
  cornerRadius: 8,
  frameStyle: "minimal",
  badgePosition: "top-left",
  badgeInset: 0,
});

const CORNER_RADII = new Set([0, 8, 16]);
const ASPECT_RATIOS = new Set(["vertical", "square", "horizontal"]);
const FRAME_STYLES = new Set(["minimal", "border", "glow"]);
const BADGE_POSITIONS = new Set(["hidden", "top-left", "top-right"]);

const ASPECT_RATIO_CSS = Object.freeze({
  vertical: "3 / 4",
  square: "1 / 1",
  horizontal: "4 / 3",
});

const ASPECT_RATIO_CONFIG = Object.freeze({
  vertical: "Vertical",
  square: "Square",
  horizontal: "Horizontal",
});

/**
 * @param {Record<string, unknown>} [value]
 * @returns {CoverAppearance}
 */
export function normalizeCoverAppearance(value = {}) {
  const rawAspectRatio = value.aspectRatio ?? value.cover_aspect_ratio;
  const aspectRatio = typeof rawAspectRatio === "string" ? rawAspectRatio.toLowerCase() : undefined;
  const cornerRadius = Number(value.cornerRadius ?? value.cover_corner_radius);
  const rawFrameStyle = value.frameStyle ?? value.cover_frame_style;
  const frameStyle = typeof rawFrameStyle === "string" ? rawFrameStyle : undefined;
  const rawBadgePosition = value.badgePosition ?? value.platform_badge_position;
  const badgePosition = typeof rawBadgePosition === "string" ? rawBadgePosition : undefined;
  const badgeInset = Number(value.badgeInset ?? value.platform_badge_inset);

  return {
    aspectRatio: /** @type {CoverAppearance["aspectRatio"]} */ (ASPECT_RATIOS.has(aspectRatio)
      ? aspectRatio
      : DEFAULT_COVER_APPEARANCE.aspectRatio),
    cornerRadius: CORNER_RADII.has(cornerRadius)
      ? cornerRadius
      : DEFAULT_COVER_APPEARANCE.cornerRadius,
    frameStyle: /** @type {CoverAppearance["frameStyle"]} */ (FRAME_STYLES.has(frameStyle)
      ? frameStyle
      : DEFAULT_COVER_APPEARANCE.frameStyle),
    badgePosition: /** @type {CoverAppearance["badgePosition"]} */ (BADGE_POSITIONS.has(badgePosition)
      ? badgePosition
      : DEFAULT_COVER_APPEARANCE.badgePosition),
    badgeInset: Number.isFinite(badgeInset)
      ? Math.min(16, Math.max(0, Math.round(badgeInset)))
      : DEFAULT_COVER_APPEARANCE.badgeInset,
  };
}

/** @param {CoverAppearance | Record<string, unknown>} appearance */
export function coverAppearanceConfig(appearance) {
  const normalized = normalizeCoverAppearance(appearance);
  return {
    cover_aspect_ratio: ASPECT_RATIO_CONFIG[normalized.aspectRatio],
    cover_corner_radius: normalized.cornerRadius,
    cover_frame_style: normalized.frameStyle,
    platform_badge_position: normalized.badgePosition,
    platform_badge_inset: normalized.badgeInset,
  };
}

/** @param {Pick<CoverAppearance, "aspectRatio">} appearance */
export function coverAspectRatioCss(appearance) {
  return ASPECT_RATIO_CSS[appearance.aspectRatio] ?? ASPECT_RATIO_CSS.vertical;
}

/**
 * @param {CoverAppearance} appearance
 * @param {Record<string, string>} colors
 * @param {boolean} active
 */
export function coverFrameShadow(appearance, colors, active) {
  if (active) {
    return `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${colors.focusGlow}`;
  }
  if (appearance.frameStyle === "glow") {
    return `0 2px 10px rgba(0,0,0,0.35), 0 0 14px ${colors.focusGlow}`;
  }
  return "0 2px 8px rgba(0,0,0,0.3)";
}

/** @param {Pick<CoverAppearance, "badgePosition" | "badgeInset">} appearance */
export function platformBadgeSx(appearance) {
  if (appearance.badgePosition === "hidden") return null;
  const rightAligned = appearance.badgePosition === "top-right";
  const inset = appearance.badgeInset;
  return {
    top: inset,
    left: rightAligned ? "auto" : inset,
    right: rightAligned ? inset : "auto",
    borderRadius: inset > 0 ? "6px" : 0,
    borderBottomLeftRadius: rightAligned && inset === 0 ? "8px" : undefined,
    borderBottomRightRadius: !rightAligned && inset === 0 ? "8px" : undefined,
  };
}
