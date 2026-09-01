/**
 * Single source of truth for the SEBI disclaimer and banned-phrase list.
 * Never retype this string inline — import it. See README.md §5.7, §9.2.
 */

export const SEBI_DISCLAIMER =
  "Educational content only. Not investment advice. Please consult a SEBI-registered investment adviser before making investment decisions.";

export const CALCULATOR_CAVEAT =
  "Assumed return is illustrative only, not a promise or guarantee.";

/** Case-insensitive, word-boundary matched. Checked by scripts/compliance-check.ts. */
export const BANNED_PHRASES = [
  "guaranteed return",
  "assured return",
  "risk-free return",
  "we recommend",
  "you should buy",
  "you should invest in",
  "target price",
  "best fund",
  "top fund to buy",
  "investment thesis",
  "portfolio review",
  "multibagger",
  "sure shot",
] as const;

/**
 * Real fund houses, brokers, banks, and insurers — README §5 "no fund,
 * AMC, broker, or product recommended anywhere." Multi-word or otherwise
 * unambiguous names only (excludes single ambiguous words like "Axis"
 * that could collide with ordinary usage — none currently exist in this
 * content, but the list stays defensive against future additions).
 * Case-insensitive. Regulators (SEBI, RBI, AMFI, IRDAI, NISM, Income Tax
 * Department) are correctly cited throughout and are never on this list.
 */
export const BANNED_PRODUCT_NAMES = [
  "hdfc bank",
  "hdfc mutual fund",
  "hdfc life",
  "icici bank",
  "icici direct",
  "icici prudential",
  "sbi mutual fund",
  "sbi card",
  "axis bank",
  "axis mutual fund",
  "kotak mahindra",
  "zerodha",
  "groww",
  "upstox",
  "angel one",
  "policybazaar",
  "nippon india mutual fund",
  "franklin templeton",
  "bajaj allianz",
  "max life insurance",
  "lic of india",
] as const;
