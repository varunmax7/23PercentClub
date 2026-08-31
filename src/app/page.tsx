import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { BlogCard } from "@/components/cards/BlogCard";
import { HomeHero } from "@/components/home/HomeHero";

const PILLARS = [
  {
    href: "/tools",
    title: "Tools",
    body: "Four calculators — SIP, step-up SIP, lumpsum, inflation — that do the arithmetic on your assumptions and never recommend a fund.",
  },
  {
    href: "/learn",
    title: "Learn",
    body: "A structured blog and a Money Basics hub covering loans, credit cards, debt, taxes, and insurance. Education, never advice.",
  },
  {
    href: "/legends",
    title: "Legends",
    body: "Investing legend stories, taught like a teacher would — the sharper, less obvious version of the lesson, not the easy one.",
  },
] as const;

export default function Home() {
  const latestPost = getPublishedPosts()[0];

  return (
    <div className="flex flex-col">
      <Section tone="muted">
        <Container>
          <HomeHero />
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Three pillars, one boundary
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <Link key={pillar.href} href={pillar.href} className="group">
                <Card className="flex h-full flex-col gap-3 p-6 transition-colors group-hover:border-sapphire">
                  <h3 className="font-display text-lg font-semibold text-ink group-hover:text-sapphire">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-slate">{pillar.body}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {latestPost && (
        <Section tone="muted">
          <Container className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-ink">Latest from the blog</h2>
              <Link href="/learn/blog" className="font-body text-sm font-medium text-sapphire hover:underline">
                View all posts →
              </Link>
            </div>
            <div className="max-w-xl">
              <BlogCard post={latestPost} />
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
