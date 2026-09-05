export function filterVisibleGames(
  games,
  platformId,
  searchQuery,
  favoritesOnly = false,
  availability = "all"
) {
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

    const remoteOnly =
      String(game.sync_state).toLowerCase().replace(/[^a-z]/g, "") === "remoteonly";
    if (availability === "installed" && remoteOnly) {
      return false;
    }
    if (availability === "remote" && !remoteOnly) {
      return false;
    }

    return true;
  });
}

export function sortVisibleGames(
  games,
  sortBy = "name",
  descending = sortBy !== "name"
) {
  const sorted = [...games];

  sorted.sort((left, right) => {
    switch (sortBy) {
      case "last_played":
        return compareValues(left.last_played_at, right.last_played_at, descending);
      case "play_count":
        return compareValues(left.play_count, right.play_count, descending);
      case "play_time":
        return compareValues(left.play_time_minutes, right.play_time_minutes, descending);
      case "release_year":
        return compareValues(left.release_year, right.release_year, descending);
      default:
        return compareValues(left.name, right.name, descending, (first, second) => first.localeCompare(second, undefined, {
          sensitivity: "base",
        }));
    }
  });

  return sorted;
}

function compareValues(left, right, descending, compare = defaultCompare) {
  if (left == null) return right == null ? 0 : 1;
  if (right == null) return -1;
  const result = compare(left, right);
  return descending ? -result : result;
}

function defaultCompare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
