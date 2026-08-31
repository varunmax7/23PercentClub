import { describe, it, expect } from "vitest";
import { formatINR, formatPercent, formatYears } from "@/lib/formatters";

describe("formatINR", () => {
  it("formats zero", () => {
    expect(formatINR(0)).toBe("₹0");
  });

  it("formats sub-thousand amounts", () => {
    expect(formatINR(999)).toBe("₹999");
  });

  it("formats lakh grouping", () => {
    expect(formatINR(100000)).toBe("₹1,00,000");
  });

  it("formats crore grouping", () => {
    expect(formatINR(12345678)).toBe("₹1,23,45,678");
  });

  it("formats negative amounts", () => {
    expect(formatINR(-500)).toBe("-₹500");
  });

  it("formats fractional amounts when precise is requested", () => {
    expect(formatINR(1234.5, { precise: true })).toBe("₹1,234.50");
  });

  it("falls back to zero for non-finite input", () => {
    expect(formatINR(NaN)).toBe("₹0");
    expect(formatINR(Infinity)).toBe("₹0");
  });
});

describe("formatPercent", () => {
  it("formats with one decimal by default", () => {
    expect(formatPercent(12)).toBe("12.0%");
    expect(formatPercent(12.55)).toBe("12.6%");
  });

  it("respects a custom digit count", () => {
    expect(formatPercent(12.345, 2)).toBe("12.35%");
  });

  it("falls back to zero for non-finite input", () => {
    expect(formatPercent(NaN)).toBe("0.0%");
  });
});

describe("formatYears", () => {
  it("pluralizes correctly", () => {
    expect(formatYears(0)).toBe("0 years");
    expect(formatYears(1)).toBe("1 year");
    expect(formatYears(25)).toBe("25 years");
  });

  it("rounds fractional years and clamps negatives to zero", () => {
    expect(formatYears(4.6)).toBe("5 years");
    expect(formatYears(-3)).toBe("0 years");
  });
});
