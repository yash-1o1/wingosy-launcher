import { describe, expect, it } from "vitest";
import { platformBadgeLabel } from "./platformIcons";

describe("platformBadgeLabel", () => {
  it("uses known platform initials instead of truncating ids", () => {
    expect(platformBadgeLabel("xbox360")).toBe("360");
    expect(platformBadgeLabel("psvita")).toBe("Vita");
    expect(platformBadgeLabel("switch")).toBe("NS");
  });

  it("falls back to a compact uppercase id for unknown platforms", () => {
    expect(platformBadgeLabel("superrare")).toBe("SUPERR");
  });

  it("returns an empty label for missing platform ids", () => {
    expect(platformBadgeLabel("")).toBe("");
    expect(platformBadgeLabel(null)).toBe("");
  });
});
