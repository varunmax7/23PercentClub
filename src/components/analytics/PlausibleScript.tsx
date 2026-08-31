import Script from "next/script";
import { isAnalyticsEnabled } from "@/lib/analytics";

const QUEUE_SHIM =
  "window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }";

/**
 * Plausible — no cookie banner needed (README §2, §13). Renders nothing
 * unless NEXT_PUBLIC_ANALYTICS_ENABLED=true and a domain is configured,
 * so local/dev/preview environments don't pollute production analytics.
 *
 * The inline shim (a plain <script>, not next/script — beforeInteractive
 * is restricted to the root layout itself in the App Router) defines
 * window.plausible as a queue before the external script loads, so a
 * trackEvent() call that fires on a fast first interaction queues
 * instead of silently no-oping.
 */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!isAnalyticsEnabled() || !domain) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: QUEUE_SHIM }} />
      <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
    </>
  );
}
