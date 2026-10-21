import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function NewGameBadge({ side = "left" }) {
  return (
    <Box
      aria-label="New game"
      title="Added within the last 24 hours"
      sx={{
        position: "absolute",
        top: 8,
        left: side === "left" ? 8 : "auto",
        right: side === "right" ? 8 : "auto",
        zIndex: 5,
        px: 0.9,
        py: 0.35,
        borderRadius: 1,
        bgcolor: "warning.main",
        color: "warning.contrastText",
        boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
        pointerEvents: "none",
      }}
    >
      <Typography sx={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.08em", lineHeight: 1 }}>
        NEW
      </Typography>
    </Box>
  );
}
