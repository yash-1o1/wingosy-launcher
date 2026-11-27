import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGamepadKeyboardMapper } from "./useGamepadKeyboardMapper";

describe("useGamepadKeyboardMapper", () => {
  const pad = { index: 0, id: "Test controller", axes: [0, 0], buttons: [] };
  let getGamepads;
  let nextFrame;
  let now;
  let recordKey;

  function poll(x, y, elapsed = 250) {
    pad.axes = [x, y];
    now += elapsed;
    nextFrame(now);
  }

  beforeEach(() => {
    pad.axes = [0, 0];
    pad.buttons = [];
    now = 1000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
    getGamepads = vi.fn().mockReturnValue([pad]);
    vi.stubGlobal("navigator", { getGamepads });
    vi.stubGlobal("requestAnimationFrame", (frame) => {
      nextFrame = frame;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    recordKey = vi.fn();
    window.addEventListener("keydown", recordKey);
    renderHook(() => useGamepadKeyboardMapper());
  });

  afterEach(() => {
    window.removeEventListener("keydown", recordKey);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("holds a direction through small fluctuations and releases it near center", () => {
    const keys = () => recordKey.mock.calls.map(([event]) => event.key);

    poll(0.5, 0);
    expect(keys()).toEqual([]);
    poll(0.55, 0);
    poll(0.45, 0, 120);
    expect(keys()).toEqual(["ArrowRight", "ArrowRight"]);

    poll(0.39, 0);
    poll(0.5, 0);
    expect(keys()).toEqual(["ArrowRight", "ArrowRight"]);

    poll(0, -0.55);
    expect(keys()).toEqual(["ArrowRight", "ArrowRight", "ArrowUp"]);
  });

  it("clears a held stick on disconnect and still accepts D-pad input", () => {
    poll(-0.7, 0);
    getGamepads.mockReturnValue([null]);
    poll(0, 0);
    getGamepads.mockReturnValue([pad]);
    poll(-0.45, 0);
    expect(recordKey.mock.calls.map(([event]) => event.key)).toEqual(["ArrowLeft"]);

    pad.buttons[13] = { pressed: true };
    poll(-0.45, 0);
    expect(recordKey.mock.calls.map(([event]) => event.key)).toEqual(["ArrowLeft", "ArrowDown"]);
  });
});
