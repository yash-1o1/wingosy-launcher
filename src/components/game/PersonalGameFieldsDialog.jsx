import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { invoke } from "@tauri-apps/api/core";
import { LIBRARY_STATUS_OPTIONS } from "./personalGameFields";

export default function PersonalGameFieldsDialog({ open, game, onClose, onSaved }) {
  const [libraryStatus, setLibraryStatus] = useState("");
  const [personalRating, setPersonalRating] = useState(0);
  const [personalDifficulty, setPersonalDifficulty] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLibraryStatus(game?.library_status || "");
    setPersonalRating(Number(game?.personal_rating) || 0);
    setPersonalDifficulty(Number(game?.personal_difficulty) || 0);
    setError("");
  }, [game, open]);

  async function handleSave() {
    if (!game?.id || saving) return;
    setSaving(true);
    setError("");
    try {
      const updated = await invoke("update_game_personal_fields", {
        gameId: game.id,
        libraryStatus: libraryStatus || null,
        personalRating,
        personalDifficulty,
      });
      await onSaved?.(updated);
      onClose();
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Ratings &amp; status</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="library-status-label">Library status</InputLabel>
            <Select
              labelId="library-status-label"
              label="Library status"
              value={libraryStatus}
              onChange={(event) => setLibraryStatus(event.target.value)}
            >
              {LIBRARY_STATUS_OPTIONS.map(([value, label]) => (
                <MenuItem key={value || "unset"} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography component="legend" gutterBottom>My rating</Typography>
            <Rating
              aria-label="My rating"
              value={personalRating}
              onChange={(_event, value) => setPersonalRating(value || 0)}
              size="large"
            />
          </Box>

          <Box>
            <Typography component="legend" gutterBottom>Difficulty</Typography>
            <Rating
              aria-label="Difficulty"
              value={personalDifficulty}
              onChange={(_event, value) => setPersonalDifficulty(value || 0)}
              icon={<WhatshotIcon fontSize="inherit" color="error" />}
              emptyIcon={<WhatshotIcon fontSize="inherit" sx={{ opacity: 0.3 }} />}
              size="large"
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            These values are saved locally on this PC.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
