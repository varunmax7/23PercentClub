import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Market",
  description: "Live market data — coming soon.",
  robots: { index: false, follow: true },
};

/**
 * Placeholder only — not the Phase 2 deliverable. README §5.6 specifies
 * carrying over the existing TradingView embeds from the legacy static
 * site "as-is, re-skinned in the new nav shell." That legacy site
 * doesn't exist in this repo (Phase 2 is blocked — see BUILD-STATE.md).
 *
 * This page exists only so the sitewide Navbar's "Market" link (part of
 * the fixed IA — README §4.1 — not something to remove over a temporary
 * content gap) doesn't 404, per the Phase 8 "zero broken links" gate.
 * Replace this file with the real ported market.html content once the
 * legacy assets are available; don't fabricate market data or widgets
 * in the meantime.
 */
export default function MarketPage() {
  return (
    <Section>
      <Container className="mx-auto flex max-w-2xl flex-col items-start gap-4 text-left">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Market</h1>
        <p className="font-body text-base leading-relaxed text-slate">
          Live market data is coming to this page. We&apos;re not
          publishing anything here until it&apos;s the real, working
          integration — not a placeholder chart or invented numbers.
        </p>
        <p className="font-body text-sm text-slate">
          In the meantime, the{" "}
          <Link href="/tools" className="text-sapphire underline decoration-border hover:decoration-sapphire">
            calculators
          </Link>{" "}
          and the{" "}
          <Link href="/learn/blog" className="text-sapphire underline decoration-border hover:decoration-sapphire">
            blog
          </Link>{" "}
          are live.
        </p>
      </Container>
    </Section>
  );
}
