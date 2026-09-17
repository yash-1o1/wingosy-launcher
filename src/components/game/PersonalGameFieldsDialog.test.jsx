import { describe, expect, it } from "vitest";
import { formatPersonalFieldsSummary } from "./personalGameFields";

describe("formatPersonalFieldsSummary", () => {
  it("describes unset personal fields", () => {
    expect(formatPersonalFieldsSummary({})).toBe("Add status, rating, and difficulty");
  });

  it("combines status, rating, and difficulty", () => {
    expect(formatPersonalFieldsSummary({
      library_status: "on_hold",
      personal_rating: 4,
      personal_difficulty: 3,
    })).toBe("On hold · 4/5 stars · 3/5 difficulty");
  });
});
