import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { listen } from "@tauri-apps/api/event";
import { isTauri } from "./utils/isTauri";
import {
  calculateDownloadSpeed,
  formatDownloadBytes,
  formatDownloadSpeed,
} from "./utils/downloadProgress";

const RomDownloadsContext = createContext({
  activeByGameId: {},
  activeDownloads: [],
  recentDownloads: [],
  getProgress: (_gameId) => null,
  activeCount: 0,
});

export function useRomDownloads() {
  return useContext(RomDownloadsContext);
}

export function formatDownloadLabel(progress) {
  if (!progress) return "";
  const { downloaded, total, percent, bytesPerSecond } = progress;
  const speed = formatDownloadSpeed(bytesPerSecond);
  let progressLabel;
  if (total != null && total > 0) {
    const pct = percent != null ? `${percent}% · ` : "";
    progressLabel = `${pct}${formatDownloadBytes(downloaded)} / ${formatDownloadBytes(total)}`;
  } else {
    progressLabel = formatDownloadBytes(downloaded);
  }
  return speed ? `${progressLabel} · ${speed}` : progressLabel;
}

export function RomDownloadsProvider({ children }) {
  const [activeByGameId, setActiveByGameId] = useState({});
  const [recentDownloads, setRecentDownloads] = useState([]);
  const activeRef = useRef({});

  useEffect(() => {
    activeRef.current = activeByGameId;
  }, [activeByGameId]);

  useEffect(() => {
    if (!isTauri()) return undefined;

    let cancelled = false;
    const unlisteners = [];

    (async () => {
      const safeListen = async (event, handler) => {
        const unlisten = await listen(event, handler);
        if (cancelled) {
          unlisten();
          return;
        }
        unlisteners.push(unlisten);
      };

      await safeListen("rom-download-started", (event) => {
        const { game_id, game_name } = event.payload;
        const now = Date.now();
        setActiveByGameId((prev) => ({
          ...prev,
          [game_id]: {
            gameId: game_id,
            gameName: game_name,
            downloaded: 0,
            total: null,
            percent: null,
            bytesPerSecond: 0,
            speedSampleAt: now,
            speedSampleBytes: 0,
          },
        }));
      });

      await safeListen("rom-download-progress", (event) => {
        const { game_id, game_name, downloaded, total, percent } = event.payload;
        const now = Date.now();
        setActiveByGameId((prev) => {
          const cur = prev[game_id];
          if (!cur) {
            return {
              ...prev,
              [game_id]: {
                gameId: game_id,
                gameName: game_name || `Game #${game_id}`,
                downloaded,
                total,
                percent,
                bytesPerSecond: 0,
                speedSampleAt: now,
                speedSampleBytes: downloaded,
              },
            };
          }
          const speed = calculateDownloadSpeed(
            cur.speedSampleBytes ?? cur.downloaded ?? 0,
            downloaded,
            now - (cur.speedSampleAt ?? now)
          );
          return {
            ...prev,
            [game_id]: {
              ...cur,
              downloaded,
              total,
              percent,
              bytesPerSecond: speed ?? cur.bytesPerSecond ?? 0,
              speedSampleAt: speed == null ? cur.speedSampleAt ?? now : now,
              speedSampleBytes:
                speed == null ? cur.speedSampleBytes ?? cur.downloaded ?? 0 : downloaded,
            },
          };
        });
      });

      await safeListen("rom-download-complete", (event) => {
        const { game_id, game_name, path } = event.payload;
        const cur = activeRef.current[game_id];
        const gameName = game_name || cur?.gameName || `Game #${game_id}`;
        setActiveByGameId((prev) => {
          const next = { ...prev };
          delete next[game_id];
          return next;
        });
        setRecentDownloads((r) =>
          [
            {
              kind: "complete",
              gameId: game_id,
              gameName,
              path,
              at: Date.now(),
            },
            ...r.filter(
              (item) =>
                !(
                  item.kind === "complete" &&
                  item.gameId === game_id &&
                  item.path === path
                )
            ),
          ].slice(0, 25)
        );
      });

      await safeListen("rom-download-error", (event) => {
        const { game_id, game_name, message } = event.payload;
        const cur = activeRef.current[game_id];
        const gameName = game_name || cur?.gameName || `Game #${game_id}`;
        setActiveByGameId((prev) => {
          const next = { ...prev };
          delete next[game_id];
          return next;
        });
        setRecentDownloads((r) =>
          [
            {
              kind: "error",
              gameId: game_id,
              gameName,
              message,
              at: Date.now(),
            },
            ...r.filter(
              (item) =>
                !(
                  item.kind === "error" &&
                  item.gameId === game_id &&
                  item.message === message
                )
            ),
          ].slice(0, 25)
        );
      });
    })();

    return () => {
      cancelled = true;
      unlisteners.forEach((u) => u());
    };
  }, []);

  const activeDownloads = useMemo(
    () => Object.values(activeByGameId),
    [activeByGameId]
  );

  const getProgress = useCallback(
    (gameId) => activeByGameId[gameId] ?? null,
    [activeByGameId]
  );

  const value = useMemo(
    () => ({
      activeByGameId,
      activeDownloads,
      recentDownloads,
      getProgress,
      activeCount: activeDownloads.length,
    }),
    [activeByGameId, activeDownloads, recentDownloads, getProgress]
  );

  return (
    <RomDownloadsContext.Provider value={value}>
      {children}
    </RomDownloadsContext.Provider>
  );
}
