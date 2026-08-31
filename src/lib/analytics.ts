/**
 * Plausible wiring — README §8 Phase 7 step 5. Exactly four custom
 * events, no more: calculator_used, blog_read_complete, tool_cta_clicked,
 * newsletter_signup. No personal data in any event payload — props are
 * limited to which page/calculator/post, never anything about the visitor.
 *
 * newsletter_signup is declared here but not wired to any component:
 * there is no newsletter feature yet (README §15 D5 — explicitly out of
 * scope for v1). Declaring it now means the event name is reserved and
 * typed before the feature exists, rather than invented ad hoc later.
 */

export type AnalyticsEvent =
  | "calculator_used"
  | "blog_read_complete"
  | "tool_cta_clicked"
  | "newsletter_signup";

export type CalculatorSlug = "sip" | "step-up-sip" | "lumpsum" | "inflation";

interface EventProps {
  calculator_used: { calculator: CalculatorSlug };
  blog_read_complete: { slug: string };
  tool_cta_clicked: { from: string; to: string };
  newsletter_signup: Record<string, never>;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent<E extends AnalyticsEvent>(event: E, props: EventProps[E]): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, { props: props as Record<string, string> });
}

export function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
}
