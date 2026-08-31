import { describe, it, expect } from "vitest";
import { getAllLegends, getPublishedLegends, getLegendBySlug } from "@/lib/content";

/**
 * Required per README §8 Phase 6: a status: draft legend (Munger) is
 * absent from the index data source and carries a draft status through
 * to the page (checked for noindex + sitemap exclusion at the e2e/route
 * level in tests/e2e/legends.spec.ts).
 */
describe("legends content", () => {
  it("getAllLegends includes all three, regardless of status", () => {
    const all = getAllLegends();
    expect(all.map((l) => l.slug).sort()).toEqual(
      ["benjamin-graham", "charlie-munger", "peter-lynch"].sort(),
    );
  });

  it("getPublishedLegends excludes the draft (Munger)", () => {
    const published = getPublishedLegends();
    expect(published.some((l) => l.slug === "charlie-munger")).toBe(false);
    expect(published.map((l) => l.slug).sort()).toEqual(["benjamin-graham", "peter-lynch"].sort());
  });

  it("every published legend has at least one source", () => {
    for (const legend of getPublishedLegends()) {
      expect(legend.sources.length, `${legend.slug} has no sources`).toBeGreaterThan(0);
    }
  });

  it("getLegendBySlug resolves the draft legend too (for preview)", async () => {
    const munger = await getLegendBySlug("charlie-munger");
    expect(munger).not.toBeNull();
    expect(munger?.frontmatter.status).toBe("draft");
  });

  it("getLegendBySlug returns null for an unknown slug", async () => {
    const result = await getLegendBySlug("not-a-real-legend");
    expect(result).toBeNull();
  });
});
