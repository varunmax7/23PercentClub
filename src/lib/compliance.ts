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
