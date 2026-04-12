import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

/** Minimal MUI tree for Vitest (avoids ThemeContext / Tauri invoke). */
const testTheme = createTheme({ palette: { mode: "dark" } });

export function MuiTestProvider({ children }) {
  return (
    <ThemeProvider theme={testTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
