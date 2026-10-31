import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SaveSyncConflictDialog from "./SaveSyncConflictDialog";
import { MuiTestProvider } from "../test/muiHarness";

const conflict = {
  game_id: 42,
  game_name: "Conflict Quest",
  reason: "RomM has a newer save after this play session; local upload was blocked",
};

function renderDialog(props = {}) {
  return render(
    <MuiTestProvider>
      <SaveSyncConflictDialog
        conflict={conflict}
        onKeepServer={vi.fn()}
        onOverwrite={vi.fn()}
        {...props}
      />
    </MuiTestProvider>
  );
}

afterEach(cleanup);

describe("SaveSyncConflictDialog", () => {
  it("defaults focus to the non-destructive choice and supports horizontal navigation", async () => {
    renderDialog();
    const keep = screen.getByRole("button", { name: "Keep RomM save" });
    const overwrite = screen.getByRole("button", { name: "Overwrite RomM save" });

    await waitFor(() => expect(keep).toHaveFocus());
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });
    expect(keep).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });
    expect(overwrite).toHaveFocus();
  });

  it("keeps overwrite explicit and disables dismissal while it is running", () => {
    const onKeepServer = vi.fn();
    const onOverwrite = vi.fn();
    renderDialog({ onKeepServer, onOverwrite, overwriting: true });

    expect(screen.getByRole("button", { name: "Overwriting…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Keep RomM save" })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onKeepServer).not.toHaveBeenCalled();
    expect(onOverwrite).not.toHaveBeenCalled();
  });
});
