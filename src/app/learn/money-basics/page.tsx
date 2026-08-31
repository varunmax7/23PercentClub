import type { Metadata } from "next";
import Link from "next/link";
import { getMoneyBasicsTopics } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Money Basics",
  description:
    "Loans, credit cards, debt, taxes, and insurance — explained plainly, without selling you a product.",
};

export default function MoneyBasicsIndexPage() {
  const topics = getMoneyBasicsTopics();

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Money Basics
          </h1>
          <p className="max-w-2xl font-body text-base text-slate">
            The five topics that quietly shape every other financial decision.
            Explainer hubs, not product comparisons — we don&apos;t name a
            lender, card, or policy here.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {topics.map((topic) => (
            <Link key={topic.topic} href={`/learn/money-basics/${topic.topic}`} className="group">
              <Card className="flex h-full flex-col gap-3 p-6 transition-colors group-hover:border-sapphire">
                <h2 className="font-display text-xl font-semibold text-ink group-hover:text-sapphire">
                  {topic.title}
                </h2>
                <p className="font-body text-sm leading-relaxed text-slate">{topic.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
