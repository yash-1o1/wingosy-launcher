import { describe, expect, it } from "vitest";
import { scrollFocusedTileIntoView } from "./scrollFocusedTile";

function elementRect(top, bottom) {
  return { getBoundingClientRect: () => ({ top, bottom }) };
}

describe("scrollFocusedTileIntoView", () => {
  it("scrolls down when the focused tile passes the visible bottom", () => {
    const container = { ...elementRect(100, 700), scrollTop: 200 };

    expect(scrollFocusedTileIntoView(container, elementRect(620, 760), 24)).toBe(true);
    expect(container.scrollTop).toBe(284);
  });

  it("scrolls up when the focused tile passes the visible top", () => {
    const container = { ...elementRect(100, 700), scrollTop: 200 };

    expect(scrollFocusedTileIntoView(container, elementRect(80, 220), 24)).toBe(true);
    expect(container.scrollTop).toBe(156);
  });

  it("does not scroll a fully visible tile", () => {
    const container = { ...elementRect(100, 700), scrollTop: 200 };

    expect(scrollFocusedTileIntoView(container, elementRect(200, 500), 24)).toBe(false);
    expect(container.scrollTop).toBe(200);
  });
});
