import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import GameCard from "./GameCard";
import { MuiTestProvider } from "../test/muiHarness";

const game = {
  id: 1,
  name: "Super Mario World",
  platform_id: "snes",
  cover_path: null,
  sync_state: "synced",
  local_file_path: "C:\\ROMs\\Super Mario World.sfc",
};

function renderCard(showPlatformBadge) {
  return render(
    <MuiTestProvider>
      <GameCard
        game={game}
        onClick={vi.fn()}
        onToggleFavorite={vi.fn()}
        onLaunch={vi.fn()}
        showPlatformBadge={showPlatformBadge}
      />
    </MuiTestProvider>
  );
}

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe("GameCard platform badge", () => {
  it("shows the platform in mixed-platform views", () => {
    renderCard(true);
    expect(screen.getByText("SNES")).toBeInTheDocument();
  });

  it("hides the platform in a single-platform view", () => {
    renderCard(false);
    expect(screen.queryByText("SNES")).not.toBeInTheDocument();
  });
});

describe("GameCard new badge", () => {
  it("shows NEW for an installed, newly added, unplayed game", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-21T16:00:00Z"));
    render(
      <MuiTestProvider>
        <GameCard
          game={{ ...game, created_at: "2026-10-21T04:00:00Z", play_count: 0, last_played_at: null }}
          onClick={vi.fn()}
          onToggleFavorite={vi.fn()}
          onLaunch={vi.fn()}
        />
      </MuiTestProvider>
    );
    expect(screen.getByLabelText("New game")).toBeInTheDocument();
  });
});
