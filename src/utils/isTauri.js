/** True when running inside the Tauri webview (not Vite browser dev). */
export function isTauri() {
  return typeof window !== "undefined" && Boolean(window.__TAURI__);
}
