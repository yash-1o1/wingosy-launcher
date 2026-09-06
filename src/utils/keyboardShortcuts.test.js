import { describe, expect, it } from "vitest";
import { isLibrarySearchShortcut } from "./keyboardShortcuts";

describe("isLibrarySearchShortcut", () => {
  it("accepts Ctrl+F and Command+F", () => {
    expect(isLibrarySearchShortcut({ key: "f", ctrlKey: true })).toBe(true);
    expect(isLibrarySearchShortcut({ key: "F", metaKey: true })).toBe(true);
  });

  it("accepts slash outside editable controls", () => {
    expect(isLibrarySearchShortcut({ key: "/", target: { tagName: "DIV" } })).toBe(true);
  });

  it("does not steal slash while the user is typing", () => {
    expect(isLibrarySearchShortcut({ key: "/", target: { tagName: "INPUT" } })).toBe(false);
    expect(isLibrarySearchShortcut({ key: "/", target: { isContentEditable: true } })).toBe(false);
  });

  it("ignores unrelated and modified shortcuts", () => {
    expect(isLibrarySearchShortcut({ key: "g", ctrlKey: true })).toBe(false);
    expect(isLibrarySearchShortcut({ key: "/", altKey: true })).toBe(false);
  });
});
