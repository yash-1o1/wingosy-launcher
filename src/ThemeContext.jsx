import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, alpha, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { invoke } from "@tauri-apps/api/core";

// Base color palette (from Argosy)
const baseColors = {
  // Default accent: Indigo
  indigo: "#5C6BC0",
  indigoLight: "#8E99F3",
  indigoDark: "#26418F",

  // Other accents available
  cyan: "#00ACC1",
  teal: "#26A69A",
  orange: "#FF7043",
  green: "#66BB6A",

  // Surfaces
  surfaceDark: "#121212",
  surfaceDarkVariant: "#1E1E1E",
  surfaceElevated: "#252525",
  surfaceLight: "#FFFBFE",
  surfaceLightVariant: "#F5F5F5",

  // Text
  onSurfaceDark: "#E1E1E1",
  onSurfaceLight: "#1C1B1F",
  onSurfaceSecondary: "#9E9E9E",

  // Status
  difficultyRed: "#E53935",
  starGold: "#FFD700",
  trophyAmber: "#FFB300",
};

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function createAppTheme(mode, accentHue) {
  const isDark = mode === "dark";

  // Generate accent color from hue, or use default indigo
  let primaryMain, primaryLight, primaryDark;
  if (accentHue !== null && accentHue !== undefined) {
    primaryMain = hslToHex(accentHue, 70, 50);
    primaryLight = hslToHex(accentHue, 70, 65);
    primaryDark = hslToHex(accentHue, 70, 35);
  } else {
    primaryMain = baseColors.indigo;
    primaryLight = baseColors.indigoLight;
    primaryDark = baseColors.indigoDark;
  }

  const focusGlow = alpha(primaryMain, 0.4);

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
      },
      background: {
        default: isDark ? baseColors.surfaceDark : baseColors.surfaceLight,
        paper: isDark ? baseColors.surfaceDarkVariant : baseColors.surfaceLightVariant,
      },
      success: {
        main: baseColors.green,
      },
      warning: {
        main: baseColors.orange,
      },
      error: {
        main: baseColors.difficultyRed,
      },
      info: {
        main: baseColors.teal,
      },
      text: {
        primary: isDark ? baseColors.onSurfaceDark : baseColors.onSurfaceLight,
        secondary: baseColors.onSurfaceSecondary,
      },
      divider: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
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
            scrollbarColor: `${baseColors.surfaceElevated} transparent`,
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              backgroundColor: baseColors.surfaceElevated,
              borderRadius: 4,
              border: "2px solid transparent",
              backgroundClip: "content-box",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: alpha(primaryMain, 0.4),
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
              boxShadow: `0 4px 12px ${focusGlow}`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isDark ? baseColors.surfaceDarkVariant : baseColors.surfaceLightVariant,
            borderRadius: 12,
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
            transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              borderColor: alpha(primaryMain, 0.3),
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backgroundColor: isDark ? baseColors.surfaceDarkVariant : baseColors.surfaceLightVariant,
            borderRight: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 0",
            "&.Mui-selected": {
              backgroundColor: alpha(primaryMain, 0.15),
              "&:hover": {
                backgroundColor: alpha(primaryMain, 0.2),
              },
            },
            "&:hover": {
              backgroundColor: alpha(primaryMain, 0.08),
            },
            "&:focus-visible": {
              outline: `2px solid ${primaryMain}`,
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
              outline: `2px solid ${primaryMain}`,
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
                borderColor: alpha(primaryMain, 0.5),
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryMain,
              },
            },
          },
        },
      },
    },
  });
}

const ThemeContext = createContext({
  themeMode: "dark",
  accentHue: null,
  setThemeMode: (_mode) => {},
  setAccentHue: (_hue) => {},
  colors: baseColors,
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("dark");
  const [accentHue, setAccentHue] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const cfg = await invoke("get_config");
        if (cfg.display?.theme_mode) {
          setThemeMode(cfg.display.theme_mode);
        }
        if (cfg.display?.accent_hue !== undefined) {
          setAccentHue(cfg.display.accent_hue);
        }
      } catch {
        // Config may not exist yet
      }
      setLoaded(true);
    }
    loadThemeSettings();
  }, []);

  const effectiveMode = useMemo(() => {
    if (themeMode === "system") {
      return prefersDark ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, prefersDark]);

  const theme = useMemo(() => {
    return createAppTheme(effectiveMode, accentHue);
  }, [effectiveMode, accentHue]);

  const colors = useMemo(() => {
    let primaryMain, primaryLight, primaryDark;
    if (accentHue !== null && accentHue !== undefined) {
      primaryMain = hslToHex(accentHue, 70, 50);
      primaryLight = hslToHex(accentHue, 70, 65);
      primaryDark = hslToHex(accentHue, 70, 35);
    } else {
      primaryMain = baseColors.indigo;
      primaryLight = baseColors.indigoLight;
      primaryDark = baseColors.indigoDark;
    }
    return {
      ...baseColors,
      primary: primaryMain,
      primaryLight,
      primaryDark,
      focusGlow: alpha(primaryMain, 0.4),
    };
  }, [accentHue]);

  const contextValue = useMemo(
    () => ({
      themeMode,
      accentHue,
      setThemeMode,
      setAccentHue,
      colors,
    }),
    [themeMode, accentHue, colors]
  );

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export { baseColors };
