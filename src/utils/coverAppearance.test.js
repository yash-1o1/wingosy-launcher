import { describe, expect, it } from "vitest";
import {
  DEFAULT_COVER_APPEARANCE,
  coverAppearanceConfig,
  normalizeCoverAppearance,
  platformBadgeSx,
} from "./coverAppearance";

describe("cover appearance", () => {
  it("preserves the existing card appearance for missing config", () => {
    expect(normalizeCoverAppearance()).toEqual(DEFAULT_COVER_APPEARANCE);
  });

  it("normalizes persisted values and clamps badge inset", () => {
    expect(normalizeCoverAppearance({
      cover_corner_radius: 16,
      cover_frame_style: "glow",
      platform_badge_position: "top-right",
      platform_badge_inset: 99,
    })).toEqual({
      cornerRadius: 16,
      frameStyle: "glow",
      badgePosition: "top-right",
      badgeInset: 16,
    });
  });

  it("serializes only validated display values", () => {
    expect(coverAppearanceConfig({
      cornerRadius: 3,
      frameStyle: "unknown",
      badgePosition: "hidden",
      badgeInset: -4,
    })).toEqual({
      cover_corner_radius: 8,
      cover_frame_style: "minimal",
      platform_badge_position: "hidden",
      platform_badge_inset: 0,
    });
  });

  it("places inset badges without edge-only corner geometry", () => {
    expect(platformBadgeSx({ badgePosition: "top-right", badgeInset: 6 })).toMatchObject({
      top: 6,
      left: "auto",
      right: 6,
      borderRadius: "6px",
    });
    expect(platformBadgeSx({ badgePosition: "hidden", badgeInset: 0 })).toBeNull();
  });
});
