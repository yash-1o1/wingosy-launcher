import { describe, expect, it } from "vitest";
import { filterVisibleGames } from "./gameFilters";

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
