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

afterEach(cleanup);

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
