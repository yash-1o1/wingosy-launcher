import { describe, expect, it } from "vitest";
import { filterVisibleGames, sortVisibleGames } from "./gameFilters";

const games = [
  { id: 1, name: "Super Mario Odyssey", platform_id: "switch", is_favorite: true },
  { id: 2, name: "Pokémon Scarlet", platform_id: "switch" },
  { id: 3, name: "Pokémon Pinball", platform_id: "gba" },
  { id: 4, name: "Pokémon White", platform_id: "nds" },
];

describe("filterVisibleGames", () => {
  it("shows only games from the selected platform", () => {
    expect(filterVisibleGames(games, "switch", "")).toEqual([games[0], games[1]]);
  });

  it("combines platform and case-insensitive search filters", () => {
    expect(filterVisibleGames(games, "switch", "POKÉMON")).toEqual([games[1]]);
  });

  it("returns every game when no filters are active", () => {
    expect(filterVisibleGames(games, null, "")).toEqual(games);
  });

  it("shows only favorited games when the favorites filter is active", () => {
    expect(filterVisibleGames(games, null, "", true)).toEqual([games[0]]);
  });
});

describe("sortVisibleGames", () => {
  const sortableGames = [
    { id: 1, name: "Zelda", play_count: 2, last_played_at: "2026-01-01", release_year: 1986 },
    { id: 2, name: "Astro Bot", play_count: 8, last_played_at: "2026-08-01", release_year: 2024 },
    { id: 3, name: "Metroid", play_count: 4, last_played_at: null, release_year: null },
  ];

  it("sorts names alphabetically without mutating the source array", () => {
    const sorted = sortVisibleGames(sortableGames, "name");

    expect(sorted.map((game) => game.name)).toEqual(["Astro Bot", "Metroid", "Zelda"]);
    expect(sortableGames[0].name).toBe("Zelda");
  });

  it("sorts numeric stats from highest to lowest", () => {
    expect(sortVisibleGames(sortableGames, "play_count").map((game) => game.id)).toEqual([2, 3, 1]);
  });

  it("keeps missing values at the end of descending sorts", () => {
    expect(sortVisibleGames(sortableGames, "last_played").map((game) => game.id)).toEqual([2, 1, 3]);
    expect(sortVisibleGames(sortableGames, "release_year").map((game) => game.id)).toEqual([2, 1, 3]);
  });
});
