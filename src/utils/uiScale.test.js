import { describe, expect, it } from "vitest";
import {
  DEFAULT_UI_SCALE,
  normalizeUiScale,
  uiScaleFactor,
} from "./uiScale";

describe("UI scale", () => {
  it("uses the existing 100% appearance for missing or invalid config", () => {
    expect(normalizeUiScale()).toBe(DEFAULT_UI_SCALE);
    expect(normalizeUiScale("not-a-number")).toBe(DEFAULT_UI_SCALE);
  });

  it("rounds to supported steps and clamps the safe range", () => {
    expect(normalizeUiScale(73)).toBe(75);
    expect(normalizeUiScale(112)).toBe(110);
    expect(normalizeUiScale(113)).toBe(115);
    expect(normalizeUiScale(152)).toBe(150);
  });

  it("converts percentages to webview zoom factors", () => {
    expect(uiScaleFactor(75)).toBe(0.75);
    expect(uiScaleFactor(125)).toBe(1.25);
  });
});
