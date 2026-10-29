import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, alpha, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import {
  DEFAULT_COVER_APPEARANCE,
  normalizeCoverAppearance,
} from "./utils/coverAppearance";
import { normalizeAccentHue, resolveAccentPalettes } from "./utils/themeAccents";
import { DEFAULT_UI_SCALE, normalizeUiScale, uiScaleFactor } from "./utils/uiScale";

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

const defaultAccentPalette = {
  main: baseColors.indigo,
  light: baseColors.indigoLight,
  dark: baseColors.indigoDark,
};

function createAppTheme(mode, accentHue, secondaryAccentHue) {
  const isDark = mode === "dark";
  const { primary, secondary } = resolveAccentPalettes(
    accentHue,
    secondaryAccentHue,
    defaultAccentPalette
  );
  const primaryMain = primary.main;

  const focusGlow = alpha(primaryMain, 0.4);
  const scrollbarThumb = alpha(
    isDark ? baseColors.onSurfaceDark : baseColors.onSurfaceLight,
    0.22
  );

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: primaryMain,
        light: primary.light,
        dark: primary.dark,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: secondary.main,
        light: secondary.light,
        dark: secondary.dark,
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
            scrollbarColor: `${scrollbarThumb} transparent`,
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              backgroundColor: scrollbarThumb,
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
  secondaryAccentHue: null,
  uiScale: DEFAULT_UI_SCALE,
  coverAppearance: DEFAULT_COVER_APPEARANCE,
  setThemeMode: (_mode) => {},
  setAccentHue: (_hue) => {},
  setSecondaryAccentHue: (_hue) => {},
  setUiScale: (_scale) => {},
  setCoverAppearance: (_appearance) => {},
  colors: baseColors,
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("dark");
  const [accentHue, setAccentHue] = useState(null);
  const [secondaryAccentHue, setSecondaryAccentHue] = useState(null);
  const [uiScale, setUiScale] = useState(DEFAULT_UI_SCALE);
  const [coverAppearance, setCoverAppearance] = useState(DEFAULT_COVER_APPEARANCE);
  const [loaded, setLoaded] = useState(false);
  
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const cfg = await invoke("get_config");
        if (cfg.display?.theme) {
          setThemeMode(cfg.display.theme.toLowerCase());
        }
        if (cfg.display?.accent_hue !== undefined) {
          setAccentHue(normalizeAccentHue(cfg.display.accent_hue));
        }
        if (cfg.display?.secondary_accent_hue !== undefined) {
          setSecondaryAccentHue(normalizeAccentHue(cfg.display.secondary_accent_hue));
        }
        setUiScale(normalizeUiScale(cfg.display?.ui_scale));
        setCoverAppearance(normalizeCoverAppearance(cfg.display));
      } catch {
        // Config may not exist yet
      }
      setLoaded(true);
    }
    loadThemeSettings();
  }, []);

  useEffect(() => {
    getCurrentWebview().setZoom(uiScaleFactor(uiScale)).catch((error) => {
      console.error("Failed to apply UI scale:", error);
    });
  }, [uiScale]);

  const effectiveMode = useMemo(() => {
    if (themeMode === "system") {
      return prefersDark ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, prefersDark]);

  const theme = useMemo(() => {
    return createAppTheme(effectiveMode, accentHue, secondaryAccentHue);
  }, [effectiveMode, accentHue, secondaryAccentHue]);

  const colors = useMemo(() => {
    const { primary, secondary } = resolveAccentPalettes(
      accentHue,
      secondaryAccentHue,
      defaultAccentPalette
    );
    return {
      ...baseColors,
      primary: primary.main,
      primaryLight: primary.light,
      primaryDark: primary.dark,
      secondary: secondary.main,
      secondaryLight: secondary.light,
      secondaryDark: secondary.dark,
      focusGlow: alpha(primary.main, 0.4),
    };
  }, [accentHue, secondaryAccentHue]);

  const contextValue = useMemo(
    () => ({
      themeMode,
      accentHue,
      secondaryAccentHue,
      uiScale,
      coverAppearance,
      setThemeMode,
      setAccentHue,
      setSecondaryAccentHue,
      setUiScale,
      setCoverAppearance,
      colors,
    }),
    [themeMode, accentHue, secondaryAccentHue, uiScale, coverAppearance, colors]
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
