import { createTheme, alpha } from "@mui/material/styles";

// Argosy-inspired color palette
const colors = {
  // Primary: Cyan (Argosy's signature color)
  cyan: "#00ACC1",
  cyanLight: "#5DDEF4",
  cyanDark: "#007C91",

  // Secondary: Indigo
  indigo: "#5C6BC0",
  indigoLight: "#8E99F3",
  indigoDark: "#26418F",

  // Accent: Teal
  teal: "#26A69A",
  tealLight: "#64D8CB",
  tealDark: "#00766C",

  // Surfaces (Argosy dark theme)
  surfaceDark: "#121212",
  surfaceDarkVariant: "#1E1E1E",
  surfaceElevated: "#252525",

  // Text
  onSurfaceDark: "#E1E1E1",
  onSurfaceSecondary: "#9E9E9E",

  // Status colors
  green: "#66BB6A",
  orange: "#FF7043",
  starGold: "#FFD700",
  trophyAmber: "#FFB300",
  difficultyRed: "#E53935",

  // Focus glow (based on primary/indigo)
  focusGlow: "rgba(92, 107, 192, 0.4)",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.indigo,
      light: colors.indigoLight,
      dark: colors.indigoDark,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.indigo,
      light: colors.indigoLight,
      dark: colors.indigoDark,
    },
    background: {
      default: colors.surfaceDark,
      paper: colors.surfaceDarkVariant,
    },
    success: {
      main: colors.green,
    },
    warning: {
      main: colors.orange,
    },
    error: {
      main: colors.difficultyRed,
    },
    info: {
      main: colors.teal,
    },
    text: {
      primary: colors.onSurfaceDark,
      secondary: colors.onSurfaceSecondary,
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.surfaceElevated} transparent`,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: colors.surfaceElevated,
            borderRadius: 4,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: alpha(colors.indigo, 0.4),
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            background: "transparent",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: `0 4px 12px ${colors.focusGlow}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.surfaceDarkVariant,
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            borderColor: alpha(colors.indigo, 0.3),
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: colors.surfaceDarkVariant,
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 0",
          "&.Mui-selected": {
            backgroundColor: alpha(colors.indigo, 0.15),
            "&:hover": {
              backgroundColor: alpha(colors.indigo, 0.2),
            },
          },
          "&:hover": {
            backgroundColor: alpha(colors.indigo, 0.08),
          },
          "&:focus-visible": {
            outline: `2px solid ${colors.indigo}`,
            outlineOffset: -2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: `2px solid ${colors.indigo}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(colors.indigo, 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.indigo,
            },
          },
        },
      },
    },
  },
});

// Export color constants for use in components
export { colors };
export default theme;
