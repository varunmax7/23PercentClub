import type { Metadata } from "next";
import { getPublishedLegends } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LegendCard } from "@/components/cards/LegendCard";

export const metadata: Metadata = {
  title: "Investing Legends",
  description: "Legend stories, taught like a teacher would — the sharper, less obvious version of the lesson everyone already repeats.",
};

export default function LegendsIndexPage() {
  const legends = getPublishedLegends();

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Investing Legends
          </h1>
          <p className="max-w-2xl font-body text-base text-slate">
            Legend stories, taught like a teacher would — the sharper,
            less obvious version of the lesson everyone already repeats,
            and how it actually applies to an Indian retail investor today.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {legends.map((legend) => (
            <LegendCard key={legend.slug} legend={legend} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
