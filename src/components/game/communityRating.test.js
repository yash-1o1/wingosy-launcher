import { describe, expect, it } from "vitest";
import { formatCommunityRating } from "./communityRating";

describe("formatCommunityRating", () => {
  it("formats a rating on the 0-100 scale", () => {
    expect(formatCommunityRating({ user_rating: 88 })).toBe("88.0 / 100");
    expect(formatCommunityRating({ user_rating: 64.54 })).toBe("64.5 / 100");
  });

  it("hides the field when no source supplied a rating", () => {
    expect(formatCommunityRating({})).toBeNull();
    expect(formatCommunityRating({ user_rating: null })).toBeNull();
    expect(formatCommunityRating({ user_rating: undefined })).toBeNull();
    expect(formatCommunityRating(undefined)).toBeNull();
  });

  it("treats zero and negative values as unrated", () => {
    expect(formatCommunityRating({ user_rating: 0 })).toBeNull();
    expect(formatCommunityRating({ user_rating: -1 })).toBeNull();
  });

  it("ignores non-numeric values", () => {
    expect(formatCommunityRating({ user_rating: "not a number" })).toBeNull();
    expect(formatCommunityRating({ user_rating: Number.NaN })).toBeNull();
  });
});
