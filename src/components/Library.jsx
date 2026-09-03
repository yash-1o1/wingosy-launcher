import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import GameCard from "./GameCard";
import { tauriDragRegionProps, tauriDragRegionSx, tauriNoDragProps, tauriNoDragSx } from "../utils/isTauri";
import { useRomDownloads } from "../RomDownloadsContext";

export default function Library({
  games,
  loading,
  searchQuery,
  favoritesOnly,
  sortBy,
  onSearchChange,
  onSortChange,
  onSelectGame,
  onToggleFavorite,
  onLaunchGame,
  onNavigateLibrarySettings,
  onNavigateRommSettings,
  error,
  onDismissError,
}) {
  const { getProgress } = useRomDownloads();

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" onClose={onDismissError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box
          {...tauriDragRegionProps()}
          sx={{ flexShrink: 0, ...tauriDragRegionSx }}
        >
          <Typography variant="h4" component="h1" sx={{ lineHeight: 1.2 }}>
            {favoritesOnly ? "Favorites" : "Library"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {games.length} {games.length === 1 ? "game" : "games"}
          </Typography>
        </Box>
        <Box
          {...tauriDragRegionProps()}
          sx={{
            display: { xs: "none", sm: "block" },
            flex: 1,
            minWidth: 16,
            minHeight: 40,
            alignSelf: "stretch",
            ...tauriDragRegionSx,
          }}
        />
        <FormControl
          {...tauriNoDragProps()}
          size="small"
          sx={{ minWidth: 160, flexShrink: 0, ...tauriNoDragSx }}
        >
          <InputLabel id="library-sort-label">Sort by</InputLabel>
          <Select
            labelId="library-sort-label"
            value={sortBy}
            label="Sort by"
            onChange={(event) => onSortChange(event.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="last_played">Recently played</MenuItem>
            <MenuItem value="play_count">Most played</MenuItem>
            <MenuItem value="play_time">Playtime</MenuItem>
            <MenuItem value="release_year">Release year</MenuItem>
          </Select>
        </FormControl>
        <TextField
          {...tauriNoDragProps()}
          size="small"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: { sm: 360 },
            flexShrink: 0,
            ...tauriNoDragSx,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={() => onSearchChange("")}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Stack>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            Loading your library...
          </Typography>
        </Box>
      ) : games.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {favoritesOnly ? "No favorites yet" : "No games found"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {favoritesOnly
              ? "Favorite a game to keep it close at hand."
              : "Scan a local ROM folder or sync from your RomM server."}
          </Typography>
          {!favoritesOnly && <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<FolderOpenIcon />}
              onClick={onNavigateLibrarySettings}
            >
              Scan ROM Folder
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudSyncIcon />}
              onClick={onNavigateRommSettings}
              color="info"
            >
              Sync from RomM
            </Button>
          </Box>}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(6, 1fr)",
            },
            gap: 2.5,
            pb: 4,
          }}
        >
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => onSelectGame(game)}
              onToggleFavorite={() => onToggleFavorite(game.id)}
              onLaunch={() => onLaunchGame(game.id)}
              downloadProgress={getProgress(game.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
