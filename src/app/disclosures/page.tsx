import type { Metadata } from "next";
import { SEBI_DISCLAIMER } from "@/lib/compliance";
import { METHODOLOGY } from "@/lib/methodology";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Expandable } from "@/components/ui/Expandable";

export const metadata: Metadata = {
  title: "Disclosures",
  description: "The SEBI disclaimer, every calculator's methodology, and this site's data sources — in one place.",
};

const METHODOLOGY_ORDER = ["sip", "step-up-sip", "lumpsum", "inflation"] as const;

export default function DisclosuresPage() {
  return (
    <Section>
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Disclosures</h1>

        <div className="rounded-xl border border-alert-amber/30 bg-alert-amber/10 px-5 py-4">
          <p className="font-body text-sm leading-relaxed text-alert-amber-text">{SEBI_DISCLAIMER}</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">Calculator methodology</h2>
          <p className="font-body text-sm text-slate">
            Every formula below is the exact same one used on the
            corresponding calculator page — this is the single source both
            read from, so they can never state it differently.
          </p>
          <div className="flex flex-col gap-3">
            {METHODOLOGY_ORDER.map((slug) => {
              const m = METHODOLOGY[slug];
              return (
                <Expandable key={slug} title={m.name}>
                  <code className="mb-3 block rounded-md bg-white px-3 py-2 font-mono text-xs text-sapphire">
                    {m.formula}
                  </code>
                  <p className="mb-3">{m.explanation}</p>
                  <p className="text-alert-amber-text">{m.assumptionCaveat}</p>
                </Expandable>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">Data sources</h2>
          <p className="font-body text-sm leading-relaxed text-slate">
            Calculator output is pure arithmetic on the numbers you enter —
            it doesn&apos;t depend on any external data source. Education
            content (blog posts, Money Basics, Investing Legends) cites its
            sources inline and in a &quot;Sources&quot; list at the end of
            each page; nothing on this site states a specific figure,
            rate, or quote without one.
          </p>
        </div>
      </Container>
    </Section>
  );
}
