import { describe, expect, it } from "vitest";
import {
  failPlatformSync,
  finishPlatformSync,
  initializeSyncRows,
  updateSyncProgress,
} from "./syncMonitor";

const platforms = [
  { romm_platform_id: 1, platform_id: "gba", name: "Game Boy Advance", server_games: 12 },
  { romm_platform_id: 2, platform_id: "snes", name: "Super Nintendo", server_games: 8 },
];

describe("sync monitor row state", () => {
  it("initializes idle rows from the platform overview", () => {
    const rows = initializeSyncRows(platforms);
    expect(rows[0]).toMatchObject({ status: "idle", processed: 0, total: 12 });
  });

  it("updates only the platform named by a progress event", () => {
    const rows = updateSyncProgress(initializeSyncRows(platforms), {
      romm_platform_id: 2,
      processed: 5,
      total: 8,
    });
    expect(rows[0].status).toBe("idle");
    expect(rows[1]).toMatchObject({ status: "syncing", processed: 5, total: 8 });
  });

  it("records successful and failed terminal states", () => {
    const initial = initializeSyncRows(platforms);
    const completed = finishPlatformSync(
      initial,
      1,
      { games_added: 2, games_updated: 9, games_deleted: 1, total_games: 11 },
      "2026-09-09T12:00:00.000Z"
    );
    expect(completed[0]).toMatchObject({
      status: "complete",
      local_games: 11,
      syncedAt: "2026-09-09T12:00:00.000Z",
    });

    const failed = failPlatformSync(initial, 2, "Server unavailable");
    expect(failed[1]).toMatchObject({ status: "failed", error: "Server unavailable" });
  });
});
