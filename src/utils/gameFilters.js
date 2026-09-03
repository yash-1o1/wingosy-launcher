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
