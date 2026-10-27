import { describe, expect, it } from "vitest";
import {
  calculateDownloadSpeed,
  formatDownloadBytes,
  formatDownloadSpeed,
} from "./downloadProgress";

describe("download progress", () => {
  it("calculates bytes per second from a stable sample window", () => {
    expect(calculateDownloadSpeed(1_000, 5_000, 500)).toBe(8_000);
    expect(calculateDownloadSpeed(1_000, 5_000, 249)).toBeNull();
  });

  it("resets speed when progress restarts or moves backwards", () => {
    expect(calculateDownloadSpeed(5_000, 1_000, 500)).toBe(0);
    expect(calculateDownloadSpeed(5_000, 5_000, 500)).toBe(0);
  });

  it("formats byte totals and transfer rates", () => {
    expect(formatDownloadBytes(1_536)).toBe("1.5 KB");
    expect(formatDownloadSpeed(2 * 1024 * 1024)).toBe("2.00 MB/s");
    expect(formatDownloadSpeed(0)).toBe("");
  });
});
