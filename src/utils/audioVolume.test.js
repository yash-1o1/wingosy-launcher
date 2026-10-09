import { describe, expect, it } from "vitest";
import {
  AMBIENT_VOLUME_DEFAULT,
  AMBIENT_VOLUME_MAX,
  ambientVolumeToGain,
  normalizeAmbientVolume,
} from "./audioVolume";

describe("ambient volume", () => {
  it("keeps ordinary ambient levels unchanged", () => {
    expect(normalizeAmbientVolume(20)).toBe(20);
    expect(ambientVolumeToGain(20)).toBe(0.2);
  });

  it("caps legacy high values at the ambient ceiling", () => {
    expect(normalizeAmbientVolume(100)).toBe(AMBIENT_VOLUME_MAX);
    expect(ambientVolumeToGain(100)).toBe(0.35);
  });

  it("normalizes invalid and negative values", () => {
    expect(normalizeAmbientVolume(-10)).toBe(0);
    expect(normalizeAmbientVolume("invalid")).toBe(AMBIENT_VOLUME_DEFAULT);
  });
});
