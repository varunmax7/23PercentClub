import { describe, it, expect } from "vitest";
import { SEBI_DISCLAIMER, CALCULATOR_CAVEAT, BANNED_PHRASES } from "@/lib/compliance";

describe("compliance constants", () => {
  it("exports a non-empty SEBI disclaimer", () => {
    expect(SEBI_DISCLAIMER.length).toBeGreaterThan(0);
    expect(SEBI_DISCLAIMER).toMatch(/not investment advice/i);
  });

  it("exports a non-empty calculator caveat", () => {
    expect(CALCULATOR_CAVEAT).toMatch(/illustrative/i);
  });

  it("has no duplicate banned phrases", () => {
    expect(new Set(BANNED_PHRASES).size).toBe(BANNED_PHRASES.length);
  });
});
