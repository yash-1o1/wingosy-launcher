import { describe, expect, it } from "vitest";
import { shouldShowPostUpdateNotice } from "./postUpdateNotice";

describe("shouldShowPostUpdateNotice", () => {
  it("stays quiet on first install", () => {
    expect(shouldShowPostUpdateNotice("0.0.164", null)).toBe(false);
  });

  it("stays quiet when the recorded version matches", () => {
    expect(shouldShowPostUpdateNotice("0.0.164", "0.0.164")).toBe(false);
  });

  it("shows after the app version changes", () => {
    expect(shouldShowPostUpdateNotice("0.0.164", "0.0.163")).toBe(true);
  });

  it("ignores empty version values", () => {
    expect(shouldShowPostUpdateNotice("", "0.0.163")).toBe(false);
    expect(shouldShowPostUpdateNotice("0.0.164", "   ")).toBe(false);
  });
});
