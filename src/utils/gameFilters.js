export function filterVisibleGames(games, platformId, searchQuery) {
  const normalizedQuery = searchQuery?.trim().toLocaleLowerCase() || "";

  return games.filter((game) => {
    if (platformId && game.platform_id !== platformId) {
      return false;
    }

    if (normalizedQuery && !game.name?.toLocaleLowerCase().includes(normalizedQuery)) {
      return false;
    }

    return true;
  });
}
