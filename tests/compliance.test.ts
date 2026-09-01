import { describe, it, expect } from "vitest";
import { SEBI_DISCLAIMER, CALCULATOR_CAVEAT, BANNED_PHRASES, BANNED_PRODUCT_NAMES } from "@/lib/compliance";

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

  it("has no duplicate banned product names", () => {
    expect(new Set(BANNED_PRODUCT_NAMES).size).toBe(BANNED_PRODUCT_NAMES.length);
  });

  it("never bans a regulator, only commercial brands", () => {
    const regulators = ["sebi", "rbi", "amfi", "irdai", "nism", "income tax"];
    for (const name of BANNED_PRODUCT_NAMES) {
      for (const regulator of regulators) {
        expect(name.includes(regulator), `"${name}" should not match regulator "${regulator}"`).toBe(false);
      }
    }
  });
});
