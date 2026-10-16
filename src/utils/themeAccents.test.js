import { describe, expect, it } from "vitest";
import { normalizeAccentHue, resolveAccentPalettes } from "./themeAccents";

const defaults = {
  main: "#5C6BC0",
  light: "#8E99F3",
  dark: "#26418F",
};

describe("theme accent palettes", () => {
  it("uses the primary accent for cloud activity until a secondary is selected", () => {
    const { primary, secondary } = resolveAccentPalettes(120, null, defaults);

    expect(primary).toEqual({ main: "#26d926", light: "#67e467", dark: "#1b981b" });
    expect(secondary).toEqual(primary);
  });

  it("keeps an explicitly selected secondary accent independent", () => {
    const { primary, secondary } = resolveAccentPalettes(null, 0, defaults);

    expect(primary).toEqual(defaults);
    expect(secondary).toEqual({ main: "#d92626", light: "#e46767", dark: "#981b1b" });
  });

  it("falls back safely when persisted hues are invalid", () => {
    const { primary, secondary } = resolveAccentPalettes(Number.NaN, Infinity, defaults);

    expect(primary).toEqual(defaults);
    expect(secondary).toEqual(defaults);
  });

  it("normalizes persisted values to the supported slider range", () => {
    expect(normalizeAccentHue(-5)).toBe(0);
    expect(normalizeAccentHue(361)).toBe(360);
    expect(normalizeAccentHue(42.6)).toBe(43);
    expect(normalizeAccentHue("43")).toBeNull();
  });
});
