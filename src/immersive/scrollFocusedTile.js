export function scrollFocusedTileIntoView(container, tile, padding = 24) {
  if (!container || !tile) return false;

  const containerRect = container.getBoundingClientRect();
  const tileRect = tile.getBoundingClientRect();
  const visibleTop = containerRect.top + padding;
  const visibleBottom = containerRect.bottom - padding;

  if (tileRect.bottom > visibleBottom) {
    container.scrollTop += tileRect.bottom - visibleBottom;
    return true;
  }

  if (tileRect.top < visibleTop) {
    container.scrollTop -= visibleTop - tileRect.top;
    return true;
  }

  return false;
}
