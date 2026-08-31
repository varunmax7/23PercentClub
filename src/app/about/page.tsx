import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "About",
  description: "23% Club — a financial education platform built from Hyderabad. We don't manage your money. We teach you how to manage it.",
};

export default function AboutPage() {
  return (
    <Section>
      <Container className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">About</h1>

        <p className="font-body text-base leading-relaxed text-ink">
          23% Club is a financial education and behavioural-investing
          platform for Indian retail investors, built from Hyderabad. It
          teaches SIP discipline, compounding, and long-term wealth
          building through calculators, structured education content, and
          storytelling — not through managing anyone&apos;s money.
        </p>

        <h2 className="mt-4 font-display text-xl font-semibold text-ink">The founder</h2>
        <p className="font-body text-base leading-relaxed text-ink">
          Saikumar studied at IIT Madras and went through the NISM
          (National Institute of Securities Markets) certification route
          into the markets — the formal path India has built for people
          who want to work seriously in finance. That background is the
          reason 23% Club exists as an education platform rather than an
          advisory or distribution business: the constraint was deliberate
          from the start, not a limitation the platform grew into.
        </p>

        <h2 className="mt-4 font-display text-xl font-semibold text-ink">The boundary</h2>
        <p className="font-body text-base leading-relaxed text-ink">
          23% Club doesn&apos;t manage anyone&apos;s money, and doesn&apos;t
          take a cut from any fund, broker, or insurer for pointing you
          toward them. The calculators on this site don&apos;t recommend an
          instrument — they do the arithmetic on whatever assumptions you
          enter, honestly, whether the number that comes out is encouraging
          or not. Everything published here is educational content, not
          personalised financial advice.
        </p>

        <h2 className="mt-4 font-display text-xl font-semibold text-ink">The mission</h2>
        <p className="font-body text-base leading-relaxed text-ink">
          We don&apos;t manage your money. We teach you how to manage it.
        </p>
      </Container>
    </Section>
  );
}
