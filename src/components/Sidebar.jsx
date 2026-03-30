import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const PLATFORM_COLORS = {
  nes: "#e60012",
  snes: "#7b5aa6", 
  n64: "#00a651",
  gc: "#6a5acd",
  wii: "#00a4e4",
  wiiu: "#009ac7",
  switch: "#e60012",
  gb: "#8b956d",
  gbc: "#8b008b",
  gba: "#6b5a9e",
  nds: "#b8b8b8",
  "3ds": "#d12228",
  psx: "#003087",
  ps2: "#003087",
  ps3: "#003087",
  ps4: "#003087",
  ps5: "#003087",
  psp: "#003087",
  psvita: "#003087",
  genesis: "#1a5c9b",
  saturn: "#0072c6",
  dreamcast: "#f47920",
  xbox: "#107c10",
  xbox360: "#107c10",
  arcade: "#ff6b00",
  pc: "#00bcf2",
  default: "#6366f1",
};

function PlatformIcon({ platform, size = 24 }) {
  const logoPath = platform.logo_path;
  const color = PLATFORM_COLORS[platform.id] || PLATFORM_COLORS.default;
  
  if (logoPath) {
    return (
      <Avatar
        src={logoPath}
        alt={platform.name}
        variant="rounded"
        sx={{
          width: size,
          height: size,
          bgcolor: "transparent",
          "& img": {
            objectFit: "contain",
          },
        }}
      >
        <SportsEsportsIcon sx={{ fontSize: size * 0.7, color }} />
      </Avatar>
    );
  }
  
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: size,
        height: size,
        bgcolor: `${color}22`,
        color: color,
        fontSize: size * 0.5,
        fontWeight: 700,
      }}
    >
      {(platform.short_name || platform.name || platform.id).substring(0, 2).toUpperCase()}
    </Avatar>
  );
}

export default function Sidebar({
  platforms,
  selectedPlatform,
  onSelectPlatform,
  onNavigate,
  currentView,
  drawerWidth,
}) {
  return (
    <Box
      sx={{
        width: drawerWidth,
        minWidth: drawerWidth,
        height: "100vh",
        bgcolor: "#1a1a22",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2.5, pb: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #4a90e2 0%, #8c5cc5 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          Wingosy
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Game Launcher
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, my: 1 }} />

      <List sx={{ px: 1 }}>
        <ListItemButton
          selected={currentView === "library" && !selectedPlatform}
          onClick={() => onSelectPlatform(null)}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="All Games" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            onSelectPlatform(null);
            onNavigate("library");
          }}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <FavoriteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItemButton>
      </List>

      <Divider sx={{ mx: 2, my: 1 }} />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 2.5, py: 0.5 }}
      >
        Platforms
      </Typography>

      <List
        sx={{
          px: 1,
          flex: 1,
          overflow: "auto",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
          },
        }}
      >
        {platforms.map(([platform, count]) => (
          <ListItemButton
            key={platform.id}
            selected={selectedPlatform === platform.id}
            onClick={() => onSelectPlatform(platform.id)}
            sx={{ borderRadius: 2, mb: 0.25, py: 0.75 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PlatformIcon platform={platform} size={22} />
            </ListItemIcon>
            <ListItemText
              primary={platform.short_name || platform.name}
              primaryTypographyProps={{ fontSize: "0.875rem" }}
            />
            <Typography variant="caption" color="text.secondary">
              {count}
            </Typography>
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      <List sx={{ px: 1, pb: 1 }}>
        <ListItemButton
          selected={currentView === "settings"}
          onClick={() => onNavigate("settings")}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Box>
  );
}
