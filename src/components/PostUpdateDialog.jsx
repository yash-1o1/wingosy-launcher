import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function PostUpdateDialog({ version, onClose, onViewReleases }) {
  const releasesButtonRef = useRef(null);
  const continueButtonRef = useRef(null);
  const open = Boolean(version);

  useEffect(() => {
    if (open) continueButtonRef.current?.focus();
  }, [open]);

  function handleKeyDown(event) {
    event.stopPropagation();

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      releasesButtonRef.current?.focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      continueButtonRef.current?.focus();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-describedby="post-update-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Wingosy was updated</DialogTitle>
      <DialogContent>
        <DialogContentText id="post-update-description">
          You are now running Wingosy {version}. Review the release notes for changes and any
          setup guidance.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button ref={releasesButtonRef} onClick={onViewReleases}>
          View releases
        </Button>
        <Button ref={continueButtonRef} variant="contained" onClick={onClose} autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
