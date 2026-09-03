export function filterVisibleGames(games, platformId, searchQuery, favoritesOnly = false) {
  const normalizedQuery = searchQuery?.trim().toLocaleLowerCase() || "";

  return games.filter((game) => {
    if (platformId && game.platform_id !== platformId) {
      return false;
    }

    if (normalizedQuery && !game.name?.toLocaleLowerCase().includes(normalizedQuery)) {
      return false;
    }

    if (favoritesOnly && !game.is_favorite) {
      return false;
    }

    return true;
  });
}

export function sortVisibleGames(games, sortBy = "name") {
  const sorted = [...games];

  sorted.sort((left, right) => {
    switch (sortBy) {
      case "last_played":
        return compareDescending(left.last_played_at, right.last_played_at);
      case "play_count":
        return compareDescending(left.play_count, right.play_count);
      case "play_time":
        return compareDescending(left.play_time_minutes, right.play_time_minutes);
      case "release_year":
        return compareDescending(left.release_year, right.release_year);
      default:
        return (left.name || "").localeCompare(right.name || "", undefined, {
          sensitivity: "base",
        });
    }
  });

  return sorted;
}

function compareDescending(left, right) {
  if (left == null) return right == null ? 0 : 1;
  if (right == null) return -1;
  return left < right ? 1 : left > right ? -1 : 0;
}
