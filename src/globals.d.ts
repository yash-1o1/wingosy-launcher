export {};

declare global {
  interface Window {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: object;
  }

  var isTauri: boolean | undefined;
}
