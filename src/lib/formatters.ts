/**
 * Indian currency and number formatting. Every visible number on the site
 * passes through here — never call Intl directly in a component, its
 * default grouping is US-style (1,234,567) not Indian (12,34,567).
 */

const inrGrouper = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrGrouperPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/** ₹1,23,45,678 — whole rupees, lakh/crore grouping. */
export function formatINR(amount: number, options: { precise?: boolean } = {}): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return options.precise ? inrGrouperPrecise.format(safe) : inrGrouper.format(safe);
}

/** 12.5% — one decimal place, no more, no less-precise trailing zeros dropped inconsistently. */
export function formatPercent(pct: number, digits = 1): string {
  const safe = Number.isFinite(pct) ? pct : 0;
  return `${safe.toFixed(digits)}%`;
}

/** "1 year" / "25 years" — singular/plural aware. */
export function formatYears(years: number): string {
  const safe = Math.max(0, Math.round(Number.isFinite(years) ? years : 0));
  return `${safe} ${safe === 1 ? "year" : "years"}`;
}
