import type {
  SipInput,
  StepUpInput,
  LumpsumInput,
  InflationInput,
  YearPoint,
  ProjectionResult,
  StepUpResult,
  InflationResult,
} from "./types";

/**
 * Calculator compute engine — README §5.1 / §6.1. Pure functions only:
 * no rounding, no Intl, no React, no DOM. Callers (UI) format and clamp
 * inputs to the documented domain (duration 1–50yr, return −20%–50%);
 * this file assumes that domain and stays total within it. years = 0
 * returns a zero result rather than throwing.
 *
 * See README §5.1 for the formulas as presented to users and
 * src/lib/methodology.ts for the user-facing explanation of each.
 */

/**
 * Simulates a monthly SIP-style annuity-due: a contribution is added at
 * the start of each month, then the whole balance compounds for that
 * month. This is the same recurrence that produces the closed-form
 * formula FV = P × [((1+i)^n − 1)/i] × (1+i) for a constant P — computing
 * it month-by-month (rather than via the closed form) means SIP and
 * step-up SIP share one code path, so a 0% step-up run is bit-identical
 * to a flat SIP run, not just approximately equal.
 */
function simulateMonthly(
  monthlyContributionForYear: (year: number) => number,
  annualReturnPct: number,
  years: number,
): YearPoint[] {
  const monthlyRate = annualReturnPct / 100 / 12;
  const series: YearPoint[] = [];
  let value = 0;
  let invested = 0;

  for (let year = 1; year <= years; year++) {
    const contribution = monthlyContributionForYear(year);
    for (let month = 0; month < 12; month++) {
      invested += contribution;
      value = (value + contribution) * (1 + monthlyRate);
    }
    series.push({ year, invested, value, gain: value - invested });
  }

  return series;
}

function toProjectionResult(series: YearPoint[]): ProjectionResult {
  const final = series[series.length - 1];
  return {
    totalInvested: final?.invested ?? 0,
    maturityValue: final?.value ?? 0,
    wealthGained: final?.gain ?? 0,
    series,
  };
}

export function calculateSip(input: SipInput): ProjectionResult {
  const years = Math.max(0, Math.trunc(input.years));
  const series = simulateMonthly(() => input.monthlyAmount, input.annualReturnPct, years);
  return toProjectionResult(series);
}

export function calculateStepUpSip(input: StepUpInput): StepUpResult {
  const years = Math.max(0, Math.trunc(input.years));
  const stepUpFactor = 1 + input.annualStepUpPct / 100;

  const series = simulateMonthly(
    (year) => input.monthlyAmount * Math.pow(stepUpFactor, year - 1),
    input.annualReturnPct,
    years,
  );

  const result = toProjectionResult(series);
  const flatComparison = calculateSip({
    monthlyAmount: input.monthlyAmount,
    annualReturnPct: input.annualReturnPct,
    years: input.years,
  });

  return {
    ...result,
    flatComparison,
    advantage: result.maturityValue - flatComparison.maturityValue,
  };
}

export function calculateLumpsum(input: LumpsumInput): ProjectionResult {
  const years = Math.max(0, Math.trunc(input.years));
  const rate = input.annualReturnPct / 100;
  const series: YearPoint[] = [];

  for (let year = 1; year <= years; year++) {
    const value = input.principal * Math.pow(1 + rate, year);
    series.push({ year, invested: input.principal, value, gain: value - input.principal });
  }

  return toProjectionResult(series);
}

export function calculateInflation(input: InflationInput): InflationResult {
  const years = Math.max(0, Math.trunc(input.years));
  const rate = input.inflationPct / 100;
  const series: YearPoint[] = [];

  for (let year = 1; year <= years; year++) {
    const value = input.currentAmount * Math.pow(1 + rate, year);
    series.push({
      year,
      invested: input.currentAmount,
      value,
      gain: value - input.currentAmount,
    });
  }

  const futureCost = input.currentAmount * Math.pow(1 + rate, years);
  const realValue = years === 0 ? input.currentAmount : input.currentAmount / Math.pow(1 + rate, years);
  const erosionPct =
    input.currentAmount === 0 ? 0 : ((input.currentAmount - realValue) / input.currentAmount) * 100;

  return { futureCost, realValue, erosionPct, series };
}
