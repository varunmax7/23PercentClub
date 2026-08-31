"use client";

import { useRef, useCallback } from "react";
import { trackEvent, type CalculatorSlug } from "@/lib/analytics";

/**
 * Fires `calculator_used` once per mount, on the visitor's first
 * interaction with any input — not on page view (that's a pageview,
 * which Plausible already tracks automatically) and not on every
 * keystroke/slider drag (that would be event spam).
 *
 * Returns an onChangeCapture handler: attach to a wrapping element so it
 * fires from any descendant input without touching each one individually.
 */
export function useTrackCalculatorUsed(calculator: CalculatorSlug) {
  const firedRef = useRef(false);

  return useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackEvent("calculator_used", { calculator });
  }, [calculator]);
}
