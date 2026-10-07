export const LAST_SEEN_APP_VERSION_KEY = "wingosy.lastSeenAppVersion";

export function shouldShowPostUpdateNotice(currentVersion, lastSeenVersion) {
  const current = currentVersion?.trim();
  const lastSeen = lastSeenVersion?.trim();

  return Boolean(current && lastSeen && current !== lastSeen);
}
