export function filterVisibleGames(
  games,
  platformId,
  searchQuery,
  favoritesOnly = false,
  availability = "all"
) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  return games.filter((game) => {
    if (platformId && game.platform_id !== platformId) {
      return false;
    }

    if (normalizedQuery && !matchesSearch(game.name, normalizedQuery)) {
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

function matchesSearch(value, normalizedQuery) {
  const normalizedValue = normalizeSearchText(value);
  if (!normalizedValue) return false;
  if (normalizedValue.includes(normalizedQuery)) return true;

  const valueWords = normalizedValue.split(" ");
  return normalizedQuery
    .split(" ")
    .every((queryWord) => valueWords.some((valueWord) => wordsMatch(queryWord, valueWord)));
}

function wordsMatch(queryWord, valueWord) {
  if (valueWord.startsWith(queryWord)) return true;
  if (queryWord.length >= 3 && valueWord.includes(queryWord)) return true;
  if (queryWord.length >= 3 && isSubsequence(queryWord, valueWord)) return true;

  const allowedEdits = queryWord.length >= 7 ? 2 : queryWord.length >= 4 ? 1 : 0;
  return allowedEdits > 0 && editDistanceWithin(queryWord, valueWord, allowedEdits);
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isSubsequence(query, value) {
  let queryIndex = 0;
  for (const character of value) {
    if (character === query[queryIndex]) queryIndex += 1;
    if (queryIndex === query.length) return true;
  }
  return false;
}

function editDistanceWithin(left, right, limit) {
  if (Math.abs(left.length - right.length) > limit) return false;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    let rowMinimum = current[0];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost
      );
      rowMinimum = Math.min(rowMinimum, current[rightIndex]);
    }

    if (rowMinimum > limit) return false;
    previous = current;
  }

  return previous[right.length] <= limit;
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

export function selectRecentPlayableGames(games, limit = 24) {
  return games
    .filter((game) => game.last_played_at && game.local_file_path)
    .sort((left, right) =>
      String(right.last_played_at).localeCompare(String(left.last_played_at))
    )
    .slice(0, limit);
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
