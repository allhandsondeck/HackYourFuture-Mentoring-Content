/*
  Your task: complete the missing tests below.

  When you run `npm test`, one test should already be failing.
  Use that failure as a clue to find and fix the bug in portfolioUtils.js.

  Once the bug is fixed, fill in the remaining TODO tests.
*/

import { describe, it, expect } from "vitest";
import { formatDate, calculateReadingTime, slugify } from "./portfolioUtils.js";

describe("formatDate", () => {
  it("formats a date string into a human-readable format", () => {
    expect(formatDate("2024-01-15")).toEqual("January 15, 2024");
  });

  it("handles dates in December correctly", () => {
    expect(formatDate("2024-12-25")).toEqual("December 25, 2024");
  });
});

describe("calculateReadingTime", () => {
  it("returns 1 minute for a short text of 100 words", () => {
    const text = "word ".repeat(100).trim();
    expect(calculateReadingTime(text)).toEqual(1);
  });

  it("always rounds up — 201 words should be 2 minutes", () => {
    const text = "word ".repeat(201).trim();
    expect(calculateReadingTime(text)).toEqual(2);
  });

  // TODO: write a test — what should happen with exactly 200 words?
  it("returns 1 minute for exactly 200 words", () => {});

  // TODO: write a test — what should happen with 400 words?
  it("returns 2 minutes for 400 words", () => {});
});

describe("slugify", () => {
  it("converts a title to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toEqual("hello-world");
  });

  // TODO: write a test — what should slugify do with special characters?
  it("removes special characters from the title", () => {});

  // TODO: write a test — what should slugify do with multiple spaces?
  it("collapses multiple spaces into a single hyphen", () => {});
});
