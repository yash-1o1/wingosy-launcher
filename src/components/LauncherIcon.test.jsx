import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LauncherIcon from "./LauncherIcon";
import { MuiTestProvider } from "../test/muiHarness";

describe("LauncherIcon", () => {
  it("renders the launcher image", () => {
    const { container } = render(
      <MuiTestProvider>
        <LauncherIcon size={48} />
      </MuiTestProvider>
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icon.svg");
    expect(img).toHaveAttribute("draggable", "false");
  });
});
