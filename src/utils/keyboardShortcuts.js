export function isLibrarySearchShortcut(event) {
  const key = event.key?.toLowerCase();

  if (key === "f" && (event.ctrlKey || event.metaKey) && !event.altKey) {
    return true;
  }

  return key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !isEditableTarget(event.target);
}

function isEditableTarget(target) {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || Boolean(target?.isContentEditable);
}
