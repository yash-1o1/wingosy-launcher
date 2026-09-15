import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockIcon from "@mui/icons-material/Lock";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import AchievementListOverlay from "./AchievementListOverlay";

const TROPHY_AMBER = "#FFB300";

/**
 * Argosy-style ACHIEVEMENTS header + (unlocked/total) + horizontal strip of badges.
 * Shows 0/0 until RetroAchievements is enabled; still 0/0 until real data exists.
 */
export default function GameAchievementsSection({
  gameName,
  rommId = null,
  rommUrl = null,
  rommToken = null,
  retroAchievementsEnabled,
}) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const loadAchievements = useCallback(async (refreshProgression = false) => {
    const requestId = ++requestIdRef.current;
    if (!retroAchievementsEnabled || !rommId || !rommUrl || !rommToken) {
      setAchievements([]);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await invoke("get_romm_retroachievements", {
        serverUrl: rommUrl,
        token: rommToken,
        romId: rommId,
        refreshProgression,
      });
      if (requestId === requestIdRef.current) {
        setAchievements(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err?.message || String(err));
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [retroAchievementsEnabled, rommId, rommUrl, rommToken]);

  useEffect(() => {
    loadAchievements(false);
  }, [loadAchievements]);
  const total = achievements.length;
  const uCount = achievements.filter((a) => a.unlocked).length;
  const displayUnlocked = retroAchievementsEnabled ? uCount : 0;
  const displayTotal = retroAchievementsEnabled ? total : 0;
  const progress = total > 0 ? Math.round((uCount / total) * 100) : 0;
  const earnedPoints = achievements.reduce(
    (sum, achievement) => sum + (achievement.unlocked ? (achievement.points ?? 0) : 0),
    0,
  );
  const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement.points ?? 0), 0);

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmojiEventsIcon sx={{ color: TROPHY_AMBER, fontSize: 22 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, letterSpacing: 0.8, color: "primary.main" }}
            >
              ACHIEVEMENTS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({displayUnlocked}/{displayTotal})
            </Typography>
            {total > 0 ? (
              <Typography variant="caption" color="text.secondary">
                {earnedPoints}/{totalPoints} pts
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {retroAchievementsEnabled && rommId ? (
              <Button size="small" disabled={loading} onClick={() => loadAchievements(true)} aria-label="Refresh achievement progress">
                Refresh
              </Button>
            ) : null}
            <Button size="small" variant="outlined" onClick={() => setOverlayOpen(true)}>
              View all
            </Button>
          </Box>
        </Box>

        {!retroAchievementsEnabled ? (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Enable RetroAchievements in Settings → Integrations to track progress.
          </Typography>
        ) : null}

        {retroAchievementsEnabled && !rommId ? (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Achievement data is available for games synced from RomM.
          </Typography>
        ) : null}
        {error ? (
          <Typography variant="caption" color="error" display="block" sx={{ mb: 1 }}>
            Could not load achievements: {error}
          </Typography>
        ) : null}

        {total > 0 ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Achievement completion"
              sx={{ flex: 1, height: 7, borderRadius: 999 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 34, textAlign: "right" }}>
              {progress}%
            </Typography>
          </Box>
        ) : null}

        {/* Argosy-style horizontal badge strip */}
        <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 0.5 }}>
          {total > 0
            ? achievements.slice(0, 12).map((a) => (
                <Box
                  key={a.id}
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 1,
                    bgcolor: a.unlocked ? "action.selected" : "action.hover",
                    border: 1,
                    borderColor: a.unlocked ? "warning.main" : "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {a.badge_url || a.badge_url_lock ? (
                    <Tooltip title={`${a.title} · ${a.points ?? 0} pts`}>
                      <Box
                        component="img"
                        src={a.unlocked ? (a.badge_url || a.badge_url_lock) : (a.badge_url_lock || a.badge_url)}
                        alt={a.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1, opacity: a.unlocked ? 1 : 0.65 }}
                      />
                    </Tooltip>
                  ) : a.unlocked ? (
                    <EmojiEventsIcon sx={{ color: TROPHY_AMBER }} />
                  ) : (
                    <LockIcon fontSize="small" color="disabled" />
                  )}
                </Box>
              ))
            : loading ? (
                <Box sx={{ width: 72, height: 72, display: "grid", placeItems: "center" }}>
                  <CircularProgress size={28} />
                </Box>
              ) : retroAchievementsEnabled && rommId && !error ? (
                <Typography variant="caption" color="text.secondary">
                  No achievements are available for this game.
                </Typography>
              ) : Array.from({ length: 6 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                    border: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    opacity: retroAchievementsEnabled ? 0.5 : 0.35,
                  }}
                >
                  <LockIcon fontSize="small" color="disabled" />
                </Box>
              ))}
        </Box>
      </Box>

      <AchievementListOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        gameTitle={gameName}
        retroAchievementsEnabled={retroAchievementsEnabled}
        achievements={achievements}
      />
    </>
  );
}
