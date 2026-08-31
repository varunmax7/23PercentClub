import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("excludes the draft legend (Munger)", () => {
    expect(urls.some((u) => u.includes("charlie-munger"))).toBe(false);
  });

  it("excludes /dev routes", () => {
    expect(urls.some((u) => u.includes("/dev"))).toBe(false);
  });

  it("includes all published legends", () => {
    expect(urls.some((u) => u.endsWith("/legends/benjamin-graham"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/legends/peter-lynch"))).toBe(true);
  });

  it("includes all 7 blog posts and all 5 money-basics topics", () => {
    expect(urls.filter((u) => u.includes("/learn/blog/")).length).toBe(7);
    expect(urls.filter((u) => u.includes("/learn/money-basics/")).length).toBe(5);
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  it("disallows /dev/ and points at the sitemap", () => {
    const result = robots();
    expect(result.rules).toMatchObject({ disallow: ["/dev/"] });
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
