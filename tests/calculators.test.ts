import { describe, it, expect } from "vitest";
import {
  calculateSip,
  calculateStepUpSip,
  calculateLumpsum,
  calculateInflation,
} from "@/lib/calculators";

/**
 * Required cases per README §10.2. This suite must be green before any
 * calculator page is wired to the engine — a wrong number on a finance
 * site is the one unrecoverable bug.
 */

describe("calculateSip", () => {
  it("matches a hand-computed known value: ₹10,000/mo, 12%, 1yr", () => {
    // FV = 10000 * [((1.01)^12 - 1)/0.01] * 1.01 = 128093.2804...
    const result = calculateSip({ monthlyAmount: 10000, annualReturnPct: 12, years: 1 });
    expect(result.maturityValue).toBeCloseTo(128093.2804, 3);
    expect(result.totalInvested).toBe(120000);
    expect(result.wealthGained).toBeCloseTo(8093.2804, 3);
  });

  it("0% return: maturity equals total invested exactly", () => {
    const result = calculateSip({ monthlyAmount: 5000, annualReturnPct: 0, years: 5 });
    expect(result.maturityValue).toBeCloseTo(result.totalInvested, 8);
    expect(result.totalInvested).toBe(5000 * 60);
    expect(result.wealthGained).toBeCloseTo(0, 8);
  });

  it("0 years: zero result, no throw", () => {
    expect(() => calculateSip({ monthlyAmount: 5000, annualReturnPct: 12, years: 0 })).not.toThrow();
    const result = calculateSip({ monthlyAmount: 5000, annualReturnPct: 12, years: 0 });
    expect(result).toEqual({ totalInvested: 0, maturityValue: 0, wealthGained: 0, series: [] });
  });

  it("50 years: finite, series length 50", () => {
    const result = calculateSip({ monthlyAmount: 5000, annualReturnPct: 12, years: 50 });
    expect(result.series).toHaveLength(50);
    expect(Number.isFinite(result.maturityValue)).toBe(true);
    expect(result.maturityValue).toBeGreaterThan(0);
  });

  it("minimum input (₹1/mo) does not collapse to zero", () => {
    const result = calculateSip({ monthlyAmount: 1, annualReturnPct: 12, years: 1 });
    expect(result.maturityValue).toBeGreaterThan(0);
    expect(result.maturityValue).toBeCloseTo(12.80932804, 4);
  });

  it("large input (₹10,00,000/mo) has no precision loss", () => {
    const result = calculateSip({ monthlyAmount: 1000000, annualReturnPct: 12, years: 1 });
    expect(result.maturityValue).toBeCloseTo(12809328.04, 1);
    expect(result.totalInvested).toBe(12000000);
  });

  it("series is strictly ascending in invested and ends at maturityValue", () => {
    const result = calculateSip({ monthlyAmount: 5000, annualReturnPct: 10, years: 10 });
    for (let i = 1; i < result.series.length; i++) {
      expect(result.series[i]!.invested).toBeGreaterThan(result.series[i - 1]!.invested);
    }
    expect(result.series[result.series.length - 1]!.value).toBeCloseTo(result.maturityValue, 8);
  });

  it("negative return within the clamp: value declines relative to a flat run", () => {
    const negative = calculateSip({ monthlyAmount: 5000, annualReturnPct: -10, years: 10 });
    const flat = calculateSip({ monthlyAmount: 5000, annualReturnPct: 0, years: 10 });
    expect(negative.maturityValue).toBeLessThan(flat.maturityValue);
    // gain should be negative and not improving over time
    expect(negative.wealthGained).toBeLessThan(0);
    for (let i = 1; i < negative.series.length; i++) {
      expect(negative.series[i]!.gain).toBeLessThanOrEqual(negative.series[i - 1]!.gain + 1e-6);
    }
  });
});

describe("calculateStepUpSip", () => {
  it("0% step-up produces a result identical to calculateSip with the same inputs", () => {
    const input = { monthlyAmount: 5000, annualReturnPct: 11, years: 8, annualStepUpPct: 0 };
    const stepUp = calculateStepUpSip(input);
    const flat = calculateSip(input);

    expect(stepUp.maturityValue).toBe(flat.maturityValue);
    expect(stepUp.totalInvested).toBe(flat.totalInvested);
    expect(stepUp.series).toEqual(flat.series);
    expect(stepUp.advantage).toBe(0);
  });

  it("a positive step-up beats the flat comparison", () => {
    const result = calculateStepUpSip({
      monthlyAmount: 5000,
      annualReturnPct: 12,
      years: 10,
      annualStepUpPct: 10,
    });
    expect(result.maturityValue).toBeGreaterThan(result.flatComparison.maturityValue);
    expect(result.advantage).toBeGreaterThan(0);
    expect(result.advantage).toBeCloseTo(result.maturityValue - result.flatComparison.maturityValue, 6);
  });

  it("0 years: zero result, no throw", () => {
    const result = calculateStepUpSip({
      monthlyAmount: 5000,
      annualReturnPct: 12,
      years: 0,
      annualStepUpPct: 10,
    });
    expect(result.series).toEqual([]);
    expect(result.maturityValue).toBe(0);
  });

  it("50 years: finite, series length 50", () => {
    const result = calculateStepUpSip({
      monthlyAmount: 5000,
      annualReturnPct: 12,
      years: 50,
      annualStepUpPct: 5,
    });
    expect(result.series).toHaveLength(50);
    expect(Number.isFinite(result.maturityValue)).toBe(true);
  });
});

describe("calculateLumpsum", () => {
  it("matches a hand-computed known value: ₹1,00,000, 10%, 5yr", () => {
    // FV = 100000 * 1.10^5 = 161051
    const result = calculateLumpsum({ principal: 100000, annualReturnPct: 10, years: 5 });
    expect(result.maturityValue).toBeCloseTo(161051, 4);
    expect(result.totalInvested).toBe(100000);
    expect(result.wealthGained).toBeCloseTo(61051, 4);
  });

  it("0% return: maturity equals principal exactly", () => {
    const result = calculateLumpsum({ principal: 50000, annualReturnPct: 0, years: 20 });
    expect(result.maturityValue).toBe(50000);
    expect(result.wealthGained).toBe(0);
  });

  it("0 years: zero result, no throw", () => {
    const result = calculateLumpsum({ principal: 50000, annualReturnPct: 10, years: 0 });
    expect(result).toEqual({ totalInvested: 0, maturityValue: 0, wealthGained: 0, series: [] });
  });

  it("50 years: finite, series length 50", () => {
    const result = calculateLumpsum({ principal: 50000, annualReturnPct: 10, years: 50 });
    expect(result.series).toHaveLength(50);
    expect(Number.isFinite(result.maturityValue)).toBe(true);
  });

  it("minimum input (₹1) does not collapse to zero", () => {
    const result = calculateLumpsum({ principal: 1, annualReturnPct: 10, years: 5 });
    expect(result.maturityValue).toBeGreaterThan(1);
  });

  it("large input has no precision loss", () => {
    const result = calculateLumpsum({ principal: 10000000, annualReturnPct: 10, years: 5 });
    expect(result.maturityValue).toBeCloseTo(16105100, 0);
  });

  it("series is strictly ascending in value and ends at maturityValue", () => {
    const result = calculateLumpsum({ principal: 100000, annualReturnPct: 8, years: 10 });
    for (let i = 1; i < result.series.length; i++) {
      expect(result.series[i]!.value).toBeGreaterThan(result.series[i - 1]!.value);
    }
    expect(result.series[result.series.length - 1]!.value).toBeCloseTo(result.maturityValue, 8);
  });

  it("negative return within the clamp declines monotonically", () => {
    const result = calculateLumpsum({ principal: 100000, annualReturnPct: -10, years: 10 });
    for (let i = 1; i < result.series.length; i++) {
      expect(result.series[i]!.value).toBeLessThan(result.series[i - 1]!.value);
    }
    expect(result.maturityValue).toBeLessThan(result.totalInvested);
  });
});

describe("calculateInflation", () => {
  it("matches a hand-computed known value: ₹1,00,000, 6%, 10yr", () => {
    // futureCost = 100000 * 1.06^10 = 179084.7697...
    // realValue   = 100000 / 1.06^10 = 55839.4777...
    const result = calculateInflation({ currentAmount: 100000, inflationPct: 6, years: 10 });
    expect(result.futureCost).toBeCloseTo(179084.7697, 3);
    expect(result.realValue).toBeCloseTo(55839.4777, 3);
  });

  it("invariant: futureCost × realValue ≈ currentAmount² (catches an inverted formula)", () => {
    const result = calculateInflation({ currentAmount: 100000, inflationPct: 6, years: 10 });
    expect(result.futureCost * result.realValue).toBeCloseTo(100000 * 100000, -2);
  });

  it("0% inflation: futureCost and realValue equal currentAmount, erosion is 0", () => {
    const result = calculateInflation({ currentAmount: 50000, inflationPct: 0, years: 15 });
    expect(result.futureCost).toBe(50000);
    expect(result.realValue).toBe(50000);
    expect(result.erosionPct).toBe(0);
  });

  it("0 years: futureCost and realValue equal currentAmount, no throw", () => {
    expect(() => calculateInflation({ currentAmount: 50000, inflationPct: 6, years: 0 })).not.toThrow();
    const result = calculateInflation({ currentAmount: 50000, inflationPct: 6, years: 0 });
    expect(result.futureCost).toBe(50000);
    expect(result.realValue).toBe(50000);
    expect(result.series).toEqual([]);
  });

  it("50 years: finite, series length 50", () => {
    const result = calculateInflation({ currentAmount: 50000, inflationPct: 6, years: 50 });
    expect(result.series).toHaveLength(50);
    expect(Number.isFinite(result.futureCost)).toBe(true);
    expect(Number.isFinite(result.realValue)).toBe(true);
  });

  it("currentAmount of 0 does not divide by zero", () => {
    expect(() => calculateInflation({ currentAmount: 0, inflationPct: 6, years: 10 })).not.toThrow();
    const result = calculateInflation({ currentAmount: 0, inflationPct: 6, years: 10 });
    expect(result.erosionPct).toBe(0);
    expect(Number.isFinite(result.erosionPct)).toBe(true);
  });

  it("erosionPct increases with more years at a fixed rate", () => {
    const shorter = calculateInflation({ currentAmount: 100000, inflationPct: 6, years: 5 });
    const longer = calculateInflation({ currentAmount: 100000, inflationPct: 6, years: 15 });
    expect(longer.erosionPct).toBeGreaterThan(shorter.erosionPct);
  });
});
