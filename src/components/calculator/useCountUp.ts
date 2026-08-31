"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Animates a number from its previous value to `target` over `durationMs`.
 * Collapses to a single frame under prefers-reduced-motion — this is the
 * one signature motion moment on a calculator page, so it must be easy to
 * opt out of. See README §3.3.
 */
export function useCountUp(target: number, durationMs = 600): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const effectiveDuration = prefersReducedMotion ? 0 : durationMs;
    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) return;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress =
        effectiveDuration === 0 ? 1 : Math.min(1, elapsed / effectiveDuration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + delta * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, durationMs, prefersReducedMotion]);

  return display;
}
