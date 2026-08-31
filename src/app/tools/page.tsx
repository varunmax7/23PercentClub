import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Financial Tools",
  description:
    "Four calculators for SIP, step-up SIP, lumpsum, and inflation — arithmetic on your own assumptions, never a fund recommendation.",
};

const TOOLS = [
  {
    href: "/tools/sip-calculator",
    name: "SIP Calculator",
    why: "The number that tells you whether your monthly discipline is actually adding up, before the market does it for you.",
  },
  {
    href: "/tools/step-up-sip-calculator",
    name: "Step-up SIP Calculator",
    why: "A small yearly increase, tied to a raise you already have, compounds into a very different outcome than staying flat.",
  },
  {
    href: "/tools/lumpsum-calculator",
    name: "Lumpsum Calculator",
    why: "Bonus, inheritance, or a maturing FD — see what a one-time amount could become versus spreading it out.",
  },
  {
    href: "/tools/inflation-calculator",
    name: "Inflation Calculator",
    why: "A return that doesn't beat this number isn't growth — it's a slower loss. This is the number every other calculator has to outrun.",
  },
] as const;

export default function ToolsIndexPage() {
  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Financial Tools
          </h1>
          <p className="max-w-2xl font-body text-base text-slate">
            Four calculators, one shared engine. Every result is arithmetic
            on the assumptions you enter — never a fund, AMC, or product
            recommendation.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="flex h-full flex-col gap-3 p-6 transition-colors group-hover:border-sapphire">
                <h2 className="font-display text-xl font-semibold text-ink group-hover:text-sapphire">
                  {tool.name}
                </h2>
                <p className="font-body text-sm leading-relaxed text-slate">
                  {tool.why}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
