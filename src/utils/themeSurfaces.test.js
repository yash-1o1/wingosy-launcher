import { describe, expect, it } from "vitest";
import {
  semanticSurfaceColor,
  subtleSurfaceColor,
  themedSurfaceGradient,
} from "./themeSurfaces";

const darkTheme = {
  palette: {
    mode: "dark",
    primary: { main: "#5c6bc0" },
    success: { main: "#66bb6a" },
    background: { paper: "#1e1e1e" },
    text: { primary: "#e1e1e1" },
  },
};

const lightTheme = {
  palette: {
    ...darkTheme.palette,
    mode: "light",
    background: { paper: "#f5f5f5" },
    text: { primary: "#1c1b1f" },
  },
};

describe("theme surface helpers", () => {
  it("keeps raised surfaces anchored to the active paper color", () => {
    expect(themedSurfaceGradient(darkTheme)).toContain("#1e1e1e");
    expect(themedSurfaceGradient(lightTheme)).toContain("#f5f5f5");
  });

  it("uses a gentler text tint for light surfaces", () => {
    expect(subtleSurfaceColor(darkTheme)).toBe("rgba(225, 225, 225, 0.08)");
    expect(subtleSurfaceColor(lightTheme)).toBe("rgba(28, 27, 31, 0.055)");
  });

  it("derives status surfaces from semantic palette roles", () => {
    expect(semanticSurfaceColor(darkTheme, "success", 0.12)).toBe(
      "rgba(102, 187, 106, 0.12)"
    );
  });

  it("rejects unknown semantic roles", () => {
    expect(() => semanticSurfaceColor(darkTheme, "unknown", 0.1)).toThrow(
      "Unknown semantic palette role"
    );
  });
});
