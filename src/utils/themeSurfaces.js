import { alpha } from "@mui/material/styles";

export function themedSurfaceGradient(theme) {
  const tint = alpha(
    theme.palette.primary.main,
    theme.palette.mode === "dark" ? 0.1 : 0.06
  );
  return `linear-gradient(135deg, ${tint} 0%, transparent 100%), ${theme.palette.background.paper}`;
}

export function subtleSurfaceColor(theme) {
  return alpha(
    theme.palette.text.primary,
    theme.palette.mode === "dark" ? 0.08 : 0.055
  );
}

export function semanticSurfaceColor(theme, role, opacity) {
  const color = theme.palette[role]?.main;
  if (!color) {
    throw new Error(`Unknown semantic palette role: ${role}`);
  }
  return alpha(color, opacity);
}
