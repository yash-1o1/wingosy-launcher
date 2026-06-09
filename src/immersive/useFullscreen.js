import { useCallback, useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { setFullscreenReliable } from "../windowFullscreen";
import { isTauri } from "../utils/isTauri";

const appWindow = isTauri() ? getCurrentWindow() : null;

export function useFullscreen({ enabled, onChange } = {}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sync = useCallback(async () => {
    try {
      if (!appWindow) return;
      const v = await appWindow.isFullscreen();
      setIsFullscreen(Boolean(v));
    } catch {
      // ignore (e.g. in non-tauri web preview)
    }
  }, []);

  const setFullscreen = useCallback(
    async (next) => {
      const value = Boolean(next);
      try {
        await setFullscreenReliable(value);
      } catch {
        // ignore
      } finally {
        try {
          if (!appWindow) throw new Error("Tauri window unavailable");
          const v = await appWindow.isFullscreen();
          setIsFullscreen(Boolean(v));
          if (onChange) onChange(Boolean(v));
        } catch {
          setIsFullscreen(value);
          if (onChange) onChange(value);
        }
      }
    },
    [onChange]
  );

  const toggleFullscreen = useCallback(async () => {
    const next = !isFullscreen;
    await setFullscreen(next);
  }, [isFullscreen, setFullscreen]);

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    if (typeof enabled === "boolean") {
      setFullscreen(enabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { isFullscreen, setFullscreen, toggleFullscreen, sync };
}
