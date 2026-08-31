import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getMoneyBasicsTopics } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { BlogCard } from "@/components/cards/BlogCard";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Education content, structured: the blog, Money Basics explainer hub, and the site's other learning modules.",
};

export default function LearnHubPage() {
  const latestPosts = getPublishedPosts().slice(0, 3);
  const topics = getMoneyBasicsTopics();

  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Learn</h1>
          <p className="max-w-2xl font-body text-base text-slate">
            Everything on this site that isn&apos;t a calculator lives here:
            the blog, the Money Basics explainer hub, and the site&apos;s
            other education modules as they ship.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink">Blog</h2>
            <Link href="/learn/blog" className="font-body text-sm font-medium text-sapphire hover:underline">
              View all posts →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink">Money Basics</h2>
            <Link
              href="/learn/money-basics"
              className="font-body text-sm font-medium text-sapphire hover:underline"
            >
              View all topics →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            {topics.map((topic) => (
              <Link key={topic.topic} href={`/learn/money-basics/${topic.topic}`}>
                <Card className="p-4 text-center transition-colors hover:border-sapphire">
                  <span className="font-body text-sm font-medium text-ink">{topic.title}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
