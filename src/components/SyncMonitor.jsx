import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import RefreshIcon from "@mui/icons-material/Refresh";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  failPlatformSync,
  finishPlatformSync,
  initializeSyncRows,
  updateSyncProgress,
} from "../utils/syncMonitor";
import { tauriDragRegionProps, tauriDragRegionSx } from "../utils/isTauri";

const STATUS_LABELS = {
  idle: "Ready",
  queued: "Queued",
  syncing: "Syncing",
  complete: "Complete",
  failed: "Failed",
};

function statusColor(status) {
  if (status === "complete") return "success";
  if (status === "failed") return "error";
  if (status === "syncing") return "primary";
  if (status === "queued") return "warning";
  return "default";
}

function resultLabel(result) {
  if (!result) return null;
  return `${result.games_added} new · ${result.games_updated} updated · ${result.games_deleted} removed`;
}

export default function SyncMonitor({
  rommUrl,
  rommToken,
  onBack = null,
  onLibraryChange,
  immersive = false,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const loadPlatforms = useCallback(async () => {
    if (!rommUrl || !rommToken) {
      setRows([]);
      setError("Connect Wingosy to RomM before syncing your library.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const platforms = await invoke("list_romm_sync_platforms", {
        serverUrl: rommUrl,
        token: rommToken,
      });
      setRows(initializeSyncRows(platforms));
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [rommToken, rommUrl]);

  useEffect(() => {
    loadPlatforms();
  }, [loadPlatforms]);

  useEffect(() => {
    let unlisten = () => {};
    let cancelled = false;
    listen("romm-platform-sync-progress", (event) => {
      setRows((current) => updateSyncProgress(current, event.payload));
    }).then((dispose) => {
      if (cancelled) dispose();
      else unlisten = dispose;
    });
    return () => {
      cancelled = true;
      unlisten();
    };
  }, []);

  async function syncPlatform(row) {
    setRows((current) =>
      current.map((item) =>
        item.romm_platform_id === row.romm_platform_id
          ? { ...item, status: "syncing", processed: 0, error: null, result: null }
          : item
      )
    );
    try {
      const result = await invoke("sync_romm_platform", {
        serverUrl: rommUrl,
        token: rommToken,
        rommPlatformId: row.romm_platform_id,
      });
      setRows((current) => finishPlatformSync(current, row.romm_platform_id, result));
      return true;
    } catch (err) {
      const message = err?.message || String(err);
      setRows((current) => failPlatformSync(current, row.romm_platform_id, message));
      return false;
    }
  }

  async function handleSyncOne(row) {
    if (running) return;
    setRunning(true);
    await syncPlatform(row);
    setRunning(false);
    onLibraryChange?.();
  }

  async function handleSyncAll() {
    if (running || rows.length === 0) return;
    setRunning(true);
    setRows((current) =>
      current.map((row) => ({ ...row, status: "queued", error: null, result: null }))
    );
    for (const row of rows) {
      await syncPlatform(row);
    }
    setRunning(false);
    onLibraryChange?.();
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto", width: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        {onBack ? (
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ flexShrink: 0 }}>
            Back
          </Button>
        ) : null}
        <Box {...tauriDragRegionProps()} sx={{ flex: 1, minWidth: 0, ...tauriDragRegionSx }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CloudSyncIcon color="primary" />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Library Sync
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Sync and inspect each RomM platform independently.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          disabled={loading || running}
          onClick={loadPlatforms}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudSyncIcon />}
          disabled={loading || running || rows.length === 0}
          onClick={handleSyncAll}
        >
          Sync all
        </Button>
      </Stack>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 && !error ? (
        <Alert severity="info">No RomM platforms were found.</Alert>
      ) : (
        <Stack spacing={1.5}>
          {rows.map((row) => {
            const percent = row.total > 0 ? Math.min(100, (row.processed / row.total) * 100) : 0;
            return (
              <Paper
                key={row.romm_platform_id}
                variant="outlined"
                sx={{ p: 2, borderRadius: immersive ? 3 : 2 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="h6" noWrap>{row.name}</Typography>
                      <Chip
                        size="small"
                        label={STATUS_LABELS[row.status] || row.status}
                        color={statusColor(row.status)}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {row.server_games} on RomM · {row.local_games} indexed · {row.installed_games} installed
                    </Typography>
                    {row.status === "syncing" ? (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant={row.total > 0 ? "determinate" : "indeterminate"}
                          value={percent}
                          sx={{ height: 7, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {row.processed} / {row.total || "?"} games
                        </Typography>
                      </Box>
                    ) : null}
                    {row.result ? (
                      <Typography variant="caption" color="success.main">
                        {resultLabel(row.result)}
                      </Typography>
                    ) : null}
                    {row.error ? (
                      <Typography variant="caption" color="error.main" sx={{ display: "block" }}>
                        {row.error}
                      </Typography>
                    ) : null}
                    {row.syncedAt ? (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Last synced {new Date(row.syncedAt).toLocaleTimeString()}
                      </Typography>
                    ) : null}
                  </Box>
                  <Button
                    variant={row.status === "failed" ? "contained" : "outlined"}
                    disabled={running}
                    onClick={() => handleSyncOne(row)}
                  >
                    {row.status === "failed" ? "Retry" : "Sync"}
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
