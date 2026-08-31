import { describe, it, expect } from "vitest";
import { blogSchema, validateEntry, findDuplicateSlugs } from "@/lib/content-schemas";
import { getAllPosts, getPublishedPosts, getPostsByCategory, paginatePosts } from "@/lib/content";
import { BLOG_CATEGORIES } from "@/lib/content-schemas";

/** Required per README §8 Phase 4. */

describe("frontmatter validation rejects malformed fixtures", () => {
  it("rejects a missing required field", () => {
    const errors = validateEntry(
      "bad.mdx",
      { title: "Missing stuff", slug: "bad" }, // no date, category, etc.
      "some body text",
      "bad",
      blogSchema,
      false,
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects an unknown category", () => {
    const errors = validateEntry(
      "bad.mdx",
      {
        title: "Bad category",
        slug: "bad",
        date: "2026-01-01",
        category: "not-a-real-category",
        readTime: 5,
        author: "Test",
        coverImage: "/x.svg",
        excerpt: "excerpt",
        status: "published",
        sources: [],
      },
      "body",
      "bad",
      blogSchema,
      false,
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it("rejects a slug/filename mismatch", () => {
    const errors = validateEntry(
      "actual-filename.mdx",
      {
        title: "Mismatch",
        slug: "different-slug",
        date: "2026-01-01",
        category: "flagship",
        readTime: 5,
        author: "Test",
        coverImage: "/x.svg",
        excerpt: "excerpt",
        status: "published",
        sources: [],
      },
      "body",
      "actual-filename",
      blogSchema,
      false,
    );
    expect(errors.some((e) => e.message.includes("does not match filename"))).toBe(true);
  });

  it("rejects a published post with a figure and no sources", () => {
    const errors = validateEntry(
      "no-sources.mdx",
      {
        title: "Has a figure",
        slug: "no-sources",
        date: "2026-01-01",
        category: "flagship",
        readTime: 5,
        author: "Test",
        coverImage: "/x.svg",
        excerpt: "excerpt",
        status: "published",
        sources: [],
      },
      "This post claims a 12% return.",
      "no-sources",
      blogSchema,
      true,
    );
    expect(errors.some((e) => e.message.includes("sources"))).toBe(true);
  });

  it("accepts a valid, fully-sourced entry", () => {
    const errors = validateEntry(
      "good.mdx",
      {
        title: "Good post",
        slug: "good",
        date: "2026-01-01",
        category: "flagship",
        readTime: 5,
        author: "Test",
        coverImage: "/x.svg",
        excerpt: "excerpt",
        status: "published",
        sources: ["Some Source"],
      },
      "Mentions 12% here.",
      "good",
      blogSchema,
      true,
    );
    expect(errors).toEqual([]);
  });

  it("flags duplicate slugs", () => {
    expect(findDuplicateSlugs(["a", "b", "a", "c", "c"])).toEqual(["a", "c"]);
    expect(findDuplicateSlugs(["a", "b", "c"])).toEqual([]);
  });
});

describe("content.ts against the real src/content/blog directory", () => {
  it("every post's slug matches its filename (no throw on load)", () => {
    expect(() => getAllPosts()).not.toThrow();
  });

  it("has at least one published post per rotation category", () => {
    const published = getPublishedPosts();
    for (const category of BLOG_CATEGORIES) {
      const inCategory = published.filter((p) => p.category === category);
      expect(inCategory.length, `missing a post in category "${category}"`).toBeGreaterThan(0);
    }
  });

  it("getPostsByCategory returns only that category", () => {
    for (const category of BLOG_CATEGORIES) {
      const posts = getPostsByCategory(category);
      expect(posts.every((p) => p.category === category)).toBe(true);
    }
  });

  it("getPostsByCategory with no argument returns all published posts", () => {
    expect(getPostsByCategory()).toEqual(getPublishedPosts());
  });
});

describe("paginatePosts", () => {
  const fakePosts = Array.from({ length: 25 }, (_, i) => ({
    title: `Post ${i}`,
    slug: `post-${i}`,
    date: "2026-01-01",
    category: "flagship" as const,
    readTime: 5,
    author: "Test",
    coverImage: "/x.svg",
    excerpt: "excerpt",
    status: "published" as const,
    sources: [],
  }));

  it("paginates 12 per page by default", () => {
    const page1 = paginatePosts(fakePosts, 1);
    expect(page1.items).toHaveLength(12);
    expect(page1.totalPages).toBe(3);

    const page3 = paginatePosts(fakePosts, 3);
    expect(page3.items).toHaveLength(1);
  });

  it("clamps an out-of-range page number", () => {
    expect(paginatePosts(fakePosts, 99).currentPage).toBe(3);
    expect(paginatePosts(fakePosts, 0).currentPage).toBe(1);
  });

  it("totalPages is 1 for an empty or small list", () => {
    expect(paginatePosts([], 1).totalPages).toBe(1);
    expect(paginatePosts(fakePosts.slice(0, 3), 1).totalPages).toBe(1);
  });
});
