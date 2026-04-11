import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { alpha } from "@mui/material/styles";
import { invoke } from "@tauri-apps/api/tauri";

export default function BpGameDetails({
  game,
  platformLabel,
  onBack,
  onLaunch,
  onToggleFavorite,
  onGameUpdate,
  rommToken,
  rommUrl,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);

  // Check if ROM is available locally
  const isRemoteOnly = (game.sync_state === "remote_only" || game.sync_state === "RemoteOnly") && !justDownloaded;
  const hasLocalFile = (game.local_file_path && game.local_file_path.length > 0) || justDownloaded;
  const isSynced = game.sync_state === "synced" || game.sync_state === "Synced";
  const isLocalGame = !game.romm_id && game.source !== "RomM";
  // Can play if: has local file, is synced, is a local game, or not remote-only
  const canPlay = hasLocalFile || isSynced || isLocalGame || !isRemoteOnly;
  const canDownload = game.romm_id && rommToken && rommUrl;

  async function handleDownloadRom() {
    if (!rommToken || !rommUrl) return;
    try {
      setDownloading(true);
      setDownloadStatus(null);
      await invoke("download_rom", {
        gameId: game.id,
        serverUrl: rommUrl,
        token: rommToken,
      });
      setJustDownloaded(true);
      setDownloadStatus({ type: "success", message: "Downloaded! Ready to play." });
      if (onGameUpdate) onGameUpdate(game.id);
    } catch (err) {
      setDownloadStatus({ type: "error", message: err.message || String(err) });
    } finally {
      setDownloading(false);
    }
  }

  async function handleDeleteDownload() {
    try {
      setDeleteDialogOpen(false);
      setActionStatus({ type: "info", message: "Deleting ROM..." });
      await invoke("delete_local_rom", { gameId: game.id });
      setActionStatus({ type: "success", message: "ROM deleted successfully" });
      setJustDownloaded(false);
      if (onGameUpdate) onGameUpdate(game.id);
    } catch (err) {
      setActionStatus({ type: "error", message: err.message || String(err) });
    }
  }
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onBack();
      }
      if (e.key === "Enter") {
        // Enter = primary action
        onLaunch(game.id);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.id, onBack, onLaunch]);

  return (
    <Box sx={{ height: "100vh", overflow: "auto", p: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        color="inherit"
        sx={{ mb: 3, borderRadius: 999, px: 2.5 }}
      >
        Back
      </Button>

      <Paper
        sx={(t) => ({
          borderRadius: 4,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(30,30,38,1) 0%, rgba(18,18,24,1) 100%)",
          boxShadow: `0 20px 70px ${alpha("#000", 0.6)}`,
          border: `1px solid ${alpha(t.palette.common.white, 0.06)}`,
        })}
      >
        <Box
          sx={{
            p: 4,
            background:
              "radial-gradient(1200px 500px at 15% 0%, rgba(99,102,241,0.35) 0%, transparent 55%), radial-gradient(900px 450px at 85% 10%, rgba(139,92,246,0.25) 0%, transparent 60%)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap" }}>
            {platformLabel ? (
              <Chip
                label={platformLabel}
                sx={{
                  fontWeight: 900,
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "#fff",
                }}
              />
            ) : null}
            {game.is_favorite ? (
              <Chip
                label="Favorite"
                sx={{
                  fontWeight: 900,
                  bgcolor: "rgba(239,68,68,0.18)",
                  color: "#fff",
                }}
              />
            ) : null}
          </Stack>

          <Typography variant="h3" sx={{ fontWeight: 950, letterSpacing: "-0.9px", mb: 1 }}>
            {game.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 1100, lineHeight: 1.8 }}>
            {game.summary || "No description available."}
          </Typography>

          <Divider sx={{ my: 3, opacity: 0.12 }} />

          {downloading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
          {downloadStatus && (
            <Alert severity={downloadStatus.type} sx={{ mb: 2 }} onClose={() => setDownloadStatus(null)}>
              {downloadStatus.message}
            </Alert>
          )}
          {actionStatus && (
            <Alert severity={actionStatus.type} sx={{ mb: 2 }} onClose={() => setActionStatus(null)}>
              {actionStatus.message}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            {/* Show Play button if ROM is available locally */}
            {canPlay && (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => onLaunch(game.id)}
                sx={{ borderRadius: 3, px: 4, py: 1.6, fontSize: "1.1rem" }}
              >
                Play
              </Button>
            )}

            {/* Download button - for RomM games that aren't downloaded */}
            {game.romm_id && !canPlay && (
              <Tooltip 
                title={!rommToken || !rommUrl ? "Connect to RomM server in Settings to download" : ""}
                arrow
              >
                <span>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={downloading ? null : <CloudDownloadIcon />}
                    onClick={handleDownloadRom}
                    disabled={downloading || !rommToken || !rommUrl}
                    sx={{ borderRadius: 3, px: 4, py: 1.6, fontSize: "1.1rem" }}
                  >
                    {downloading ? "Downloading..." : "Download"}
                  </Button>
                </span>
              </Tooltip>
            )}

            {/* Re-download option for already downloaded RomM games */}
            {canDownload && canPlay && (
              <Button
                variant="outlined"
                size="large"
                startIcon={downloading ? null : <CloudDownloadIcon />}
                onClick={handleDownloadRom}
                disabled={downloading}
                sx={{ borderRadius: 3, px: 3, py: 1.6 }}
              >
                {downloading ? "Downloading..." : "Re-download"}
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              startIcon={game.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => onToggleFavorite(game.id)}
              sx={{ borderRadius: 3, px: 4, py: 1.6, fontSize: "1.1rem" }}
            >
              {game.is_favorite ? "Unfavorite" : "Favorite"}
            </Button>

            {/* Delete button - only if has local file */}
            {hasLocalFile && (
              <Button
                variant="outlined"
                size="large"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ borderRadius: 3, px: 3, py: 1.6 }}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Downloaded ROM?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will delete the local ROM file for "{game.name}".
            {game.romm_id ? " The game will remain in your library (from RomM) and can be re-downloaded." 
              : " This will remove the game from your library completely."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteDownload} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

