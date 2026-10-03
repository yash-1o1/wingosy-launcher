import { describe, expect, it, vi } from "vitest";
import {
  activateControllerFocus,
  ensureControllerFocus,
  getControllerFocusableControls,
  moveControllerFocus,
} from "./controllerFocus";

function renderControls() {
  const root = document.createElement("div");
  root.innerHTML = `
    <button data-name="first">First</button>
    <input data-name="editable" />
    <input data-name="readonly" readonly />
    <button data-name="disabled" disabled>Disabled</button>
    <button data-name="last">Last</button>
  `;
  document.body.append(root);
  return root;
}

function activeControlName() {
  return document.activeElement instanceof HTMLElement
    ? document.activeElement.dataset.name
    : undefined;
}

describe("controller focus helpers", () => {
  it("only includes controls that a controller can use", () => {
    const root = renderControls();
    expect(getControllerFocusableControls(root).map((element) => element.dataset.name)).toEqual([
      "first",
      "editable",
      "last",
    ]);
  });

  it("establishes focus and moves it without wrapping", () => {
    const root = renderControls();
    expect(ensureControllerFocus(root)).toBe(true);
    expect(activeControlName()).toBe("first");

    moveControllerFocus(root, 1);
    expect(activeControlName()).toBe("editable");
    moveControllerFocus(root, -1);
    expect(activeControlName()).toBe("first");
    moveControllerFocus(root, -1);
    expect(activeControlName()).toBe("first");
  });

  it("activates focused buttons but leaves text fields editable", () => {
    const root = renderControls();
    const first = /** @type {HTMLButtonElement} */ (root.querySelector('[data-name="first"]'));
    const editable = /** @type {HTMLInputElement} */ (root.querySelector('[data-name="editable"]'));
    const onClick = vi.fn();
    first.addEventListener("click", onClick);

    first.focus();
    expect(activateControllerFocus(root)).toBe(true);
    expect(onClick).toHaveBeenCalledOnce();

    editable.focus();
    expect(activateControllerFocus(root)).toBe(false);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
