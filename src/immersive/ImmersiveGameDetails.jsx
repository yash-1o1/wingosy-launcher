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
import { useAppTheme } from "../ThemeContext";

export default function ImmersiveGameDetails({
  game,
  platformLabel,
  onBack,
  onLaunch,
  onToggleFavorite,
  onGameUpdate,
  rommToken,
  rommUrl,
}) {
  const { colors } = useAppTheme();
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);

  const isRemoteOnly = (game.sync_state === "remote_only" || game.sync_state === "RemoteOnly") && !justDownloaded;
  const hasLocalFile = (game.local_file_path && game.local_file_path.length > 0) || justDownloaded;
  const isSynced = game.sync_state === "synced" || game.sync_state === "Synced";
  const isLocalGame = !game.romm_id && game.source !== "RomM";
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
        onLaunch(game.id);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.id, onBack, onLaunch]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        p: 5,
        bgcolor: "background.default",
        backgroundImage: `radial-gradient(1000px 380px at 10% -5%, ${alpha(colors.primary, 0.12)} 0%, transparent 52%),
          radial-gradient(800px 320px at 92% 5%, ${alpha(colors.primaryLight, 0.07)} 0%, transparent 48%)`,
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        color="inherit"
        sx={{ mb: 3, borderRadius: 2, px: 2.5, textTransform: "none", fontWeight: 700 }}
      >
        Back
      </Button>

      <Paper
        elevation={0}
        sx={(t) => ({
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: t.palette.mode === "dark" ? alpha(t.palette.background.paper, 0.98) : t.palette.background.paper,
          boxShadow: `0 20px 56px ${alpha("#000", t.palette.mode === "dark" ? 0.55 : 0.12)}`,
          border: `1px solid ${t.palette.divider}`,
        })}
      >
        <Box
          sx={{
            p: 4,
            background: `radial-gradient(1200px 500px at 15% 0%, ${alpha(colors.primary, 0.22)} 0%, transparent 55%),
              radial-gradient(900px 450px at 85% 10%, ${alpha(colors.primaryLight, 0.14)} 0%, transparent 58%)`,
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

          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: "-0.5px", mb: 1, color: "text.primary" }}>
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
            {canPlay && (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => onLaunch(game.id)}
                sx={{ borderRadius: 2, px: 4, py: 1.6, fontSize: "1.05rem", textTransform: "none", fontWeight: 700 }}
              >
                Play
              </Button>
            )}

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
                    sx={{ borderRadius: 2, px: 4, py: 1.6, fontSize: "1.05rem", textTransform: "none", fontWeight: 700 }}
                  >
                    {downloading ? "Downloading..." : "Download"}
                  </Button>
                </span>
              </Tooltip>
            )}

            {canDownload && canPlay && (
              <Button
                variant="outlined"
                size="large"
                startIcon={downloading ? null : <CloudDownloadIcon />}
                onClick={handleDownloadRom}
                disabled={downloading}
                sx={{ borderRadius: 2, px: 3, py: 1.6, textTransform: "none", fontWeight: 700 }}
              >
                {downloading ? "Downloading..." : "Re-download"}
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              startIcon={game.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => onToggleFavorite(game.id)}
              sx={{ borderRadius: 2, px: 4, py: 1.6, fontSize: "1.05rem", textTransform: "none", fontWeight: 700 }}
            >
              {game.is_favorite ? "Unfavorite" : "Favorite"}
            </Button>

            {hasLocalFile && (
              <Button
                variant="outlined"
                size="large"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ borderRadius: 2, px: 3, py: 1.6, textTransform: "none", fontWeight: 700 }}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

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
