export function formatDownloadBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatDownloadSpeed(bytesPerSecond) {
  const formatted = formatDownloadBytes(bytesPerSecond);
  return formatted && Number(bytesPerSecond) > 0 ? `${formatted}/s` : "";
}

export function calculateDownloadSpeed(previousBytes, nextBytes, elapsedMs) {
  const previous = Number(previousBytes);
  const next = Number(nextBytes);
  const elapsed = Number(elapsedMs);
  if (![previous, next, elapsed].every(Number.isFinite) || elapsed < 250) {
    return null;
  }
  if (next <= previous) return 0;
  return Math.round(((next - previous) * 1000) / elapsed);
}
