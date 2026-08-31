import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Not a substitute for actually running Lighthouse — just a guard against
 * someone quietly loosening the §9.3 budget in a future PR without
 * noticing what they changed.
 */
describe("lighthouserc.json", () => {
  const config = JSON.parse(readFileSync(join(process.cwd(), "lighthouserc.json"), "utf-8"));

  it("asserts >=0.9 on all four categories", () => {
    const assertions = config.ci.assert.assertions;
    for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
      const rule = assertions[`categories:${category}`];
      expect(rule[0]).toBe("error");
      expect(rule[1].minScore).toBeGreaterThanOrEqual(0.9);
    }
  });

  it("covers all 5 required key page types (README §8 Phase 7 Gate G7)", () => {
    const urls: string[] = config.ci.collect.url;
    expect(urls).toHaveLength(5);
    expect(urls.some((u) => u.endsWith("/"))).toBe(true); // Home
    expect(urls.some((u) => u.includes("/tools/"))).toBe(true); // a calculator
    expect(urls.some((u) => u.includes("/learn/blog/"))).toBe(true); // a blog post
    expect(urls.some((u) => u.includes("/legends/"))).toBe(true); // a legend page
    // /learn/products doesn't exist — Phase 2 (porting the legacy site) is
    // blocked. Substituted with /learn/money-basics, a real equivalent
    // content-hub page. See BUILD-STATE.md Gate G7 for the full note.
    expect(urls.some((u) => u.includes("/learn/money-basics"))).toBe(true);
  });
});
