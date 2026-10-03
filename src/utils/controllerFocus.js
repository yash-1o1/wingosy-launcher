const CONTROLLER_FOCUS_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled]):not([readonly])",
  "select:not([disabled])",
  "textarea:not([disabled]):not([readonly])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getControllerFocusableControls(container) {
  if (!container) return [];
  return /** @type {HTMLElement[]} */ (
    Array.from(container.querySelectorAll(CONTROLLER_FOCUS_SELECTOR)).filter(
      (element) => element instanceof HTMLElement && element.getAttribute("aria-hidden") !== "true"
    )
  );
}

export function ensureControllerFocus(container, activeElement = document.activeElement) {
  const controls = getControllerFocusableControls(container);
  if (controls.length === 0) return false;
  if (activeElement instanceof HTMLElement && controls.includes(activeElement)) return true;
  controls[0].focus();
  return true;
}

export function moveControllerFocus(container, direction, activeElement = document.activeElement) {
  const controls = getControllerFocusableControls(container);
  if (controls.length === 0) return false;

  const currentIndex = activeElement instanceof HTMLElement
    ? controls.indexOf(activeElement)
    : -1;
  const nextIndex = currentIndex === -1
    ? 0
    : Math.max(0, Math.min(controls.length - 1, currentIndex + direction));
  controls[nextIndex].focus();
  return true;
}

export function activateControllerFocus(container, activeElement = document.activeElement) {
  if (!container?.contains(activeElement) || !(activeElement instanceof HTMLButtonElement)) {
    return false;
  }
  activeElement.click();
  return true;
}
