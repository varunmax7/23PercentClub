import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMoneyBasicsTopics, getMoneyBasicsTopic } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SourceCitation } from "@/components/ui/SourceCitation";

export function generateStaticParams() {
  return getMoneyBasicsTopics().map((t) => ({ topic: t.topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const page = await getMoneyBasicsTopic(topic);
  if (!page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.excerpt,
  };
}

export default async function MoneyBasicsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const page = await getMoneyBasicsTopic(topic);
  if (!page) notFound();

  const { frontmatter, content } = page;

  return (
    <Section>
      <Container className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {frontmatter.title}
        </h1>

        <article>{content}</article>

        {frontmatter.sources.length > 0 && (
          <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6">
            <p className="font-body text-xs font-medium uppercase tracking-wide text-slate">Sources</p>
            {frontmatter.sources.map((source) => (
              <SourceCitation key={source} label={source} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
