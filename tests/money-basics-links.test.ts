import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getMoneyBasicsTopics } from "@/lib/content";

/**
 * Required per README §8 Phase 5: every Money Basics page cross-links at
 * least one calculator and at least one blog post. Checked against the
 * raw MDX source rather than rendered output — cheaper, and the link
 * targets are the same either way.
 */
describe("Money Basics cross-linking", () => {
  const topics = getMoneyBasicsTopics();

  it("all five topics exist", () => {
    expect(topics.map((t) => t.topic).sort()).toEqual(
      ["credit-cards", "debt", "insurance", "loans", "taxes"].sort(),
    );
  });

  it.each(topics.map((t) => t.topic))("%s links to at least one /tools/ page and one /learn/blog/ post", (topic) => {
    const raw = readFileSync(join(process.cwd(), "src", "content", "money-basics", `${topic}.mdx`), "utf-8");

    const hasToolLink = /\/tools\/[a-z-]+/.test(raw);
    const hasBlogLink = /\/learn\/blog\/[a-z-]+/.test(raw);

    expect(hasToolLink, `${topic}.mdx has no /tools/ link`).toBe(true);
    expect(hasBlogLink, `${topic}.mdx has no /learn/blog/ link`).toBe(true);
  });

  it("no page names a specific lender, card, or insurance product", () => {
    const bannedProductWords = ["hdfc", "icici", "sbi card", "axis bank", "policybazaar"];
    for (const topic of topics) {
      const raw = readFileSync(
        join(process.cwd(), "src", "content", "money-basics", `${topic.topic}.mdx`),
        "utf-8",
      ).toLowerCase();
      for (const word of bannedProductWords) {
        expect(raw.includes(word), `${topic.topic}.mdx mentions "${word}"`).toBe(false);
      }
    }
  });
});
