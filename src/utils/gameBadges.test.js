import { describe, expect, it } from "vitest";
import { isRecentlyAddedUnplayed } from "./gameBadges";

const now = Date.parse("2026-10-21T16:00:00Z");

function game(overrides = {}) {
  return {
    created_at: "2026-10-21T04:00:00Z",
    last_played_at: null,
    play_count: 0,
    local_file_path: "C:\\ROMs\\game.gba",
    ...overrides,
  };
}

describe("isRecentlyAddedUnplayed", () => {
  it("marks an installed, unplayed game added within 24 hours", () => {
    expect(isRecentlyAddedUnplayed(game(), now)).toBe(true);
  });

  it("accepts SQLite timestamps as UTC", () => {
    expect(isRecentlyAddedUnplayed(game({ created_at: "2026-10-21 04:00:00" }), now)).toBe(true);
  });

  it("excludes old, played, remote-only, future, and invalid records", () => {
    expect(isRecentlyAddedUnplayed(game({ created_at: "2026-10-20T15:59:59Z" }), now)).toBe(false);
    expect(isRecentlyAddedUnplayed(game({ last_played_at: "2026-10-21T10:00:00Z" }), now)).toBe(false);
    expect(isRecentlyAddedUnplayed(game({ play_count: 1 }), now)).toBe(false);
    expect(isRecentlyAddedUnplayed(game({ local_file_path: null }), now)).toBe(false);
    expect(isRecentlyAddedUnplayed(game({ created_at: "2026-10-21T16:00:01Z" }), now)).toBe(false);
    expect(isRecentlyAddedUnplayed(game({ created_at: "not-a-date" }), now)).toBe(false);
  });
});
