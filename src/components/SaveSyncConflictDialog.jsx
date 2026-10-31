import { useEffect, useRef } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";

export default function SaveSyncConflictDialog({
  conflict,
  overwriting = false,
  error = "",
  onKeepServer,
  onOverwrite,
}) {
  const keepButtonRef = useRef(null);
  const overwriteButtonRef = useRef(null);
  const open = Boolean(conflict);

  useEffect(() => {
    if (open && !overwriting) keepButtonRef.current?.focus();
  }, [open, overwriting]);

  function handleKeyDown(event) {
    event.stopPropagation();
    if (overwriting) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      keepButtonRef.current?.focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      overwriteButtonRef.current?.focus();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={overwriting ? undefined : onKeepServer}
      onKeyDown={handleKeyDown}
      aria-describedby="save-sync-conflict-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Save sync needs your choice</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText id="save-sync-conflict-description">
            RomM has a newer or conflicting save for <strong>{conflict?.game_name}</strong>.
            Wingosy kept both copies unchanged and blocked the automatic upload.
          </DialogContentText>
          <DialogContentText>
            Keep the RomM copy, or explicitly replace it with the local save from this PC.
            Your local save remains on this PC either way.
          </DialogContentText>
          {conflict?.reason ? <Alert severity="warning">{conflict.reason}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          ref={overwriteButtonRef}
          color="error"
          disabled={overwriting}
          onClick={onOverwrite}
        >
          {overwriting ? "Overwriting…" : "Overwrite RomM save"}
        </Button>
        <Button
          ref={keepButtonRef}
          variant="contained"
          disabled={overwriting}
          onClick={onKeepServer}
          autoFocus
        >
          Keep RomM save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
