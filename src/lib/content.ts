import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import type { BlogFrontmatter, BlogCategory } from "./types";
import { blogSchema } from "./content-schemas";
import { mdxComponents } from "@/components/mdx/MdxComponents";

const BLOG_DIR = join(process.cwd(), "src", "content", "blog");

interface RawPost {
  frontmatter: BlogFrontmatter;
  body: string;
}

function readAllRawPosts(): RawPost[] {
  if (!existsSync(BLOG_DIR)) return [];

  return readdirSync(BLOG_DIR)
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => {
      const raw = readFileSync(join(BLOG_DIR, entry), "utf-8");
      const { data, content } = matter(raw);
      const result = blogSchema.safeParse(data);

      if (!result.success) {
        const messages = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        throw new Error(`Invalid frontmatter in ${entry}: ${messages}`);
      }

      const expectedSlug = basename(entry, ".mdx");
      if (result.data.slug !== expectedSlug) {
        throw new Error(`${entry}: slug "${result.data.slug}" does not match filename "${expectedSlug}"`);
      }

      return { frontmatter: result.data, body: content };
    });
}

function byDateDesc(a: RawPost, b: RawPost): number {
  return b.frontmatter.date.localeCompare(a.frontmatter.date);
}

/** All posts regardless of status, newest first — used for static params so drafts still render on preview deployments. */
export function getAllPosts(): BlogFrontmatter[] {
  return readAllRawPosts().sort(byDateDesc).map((p) => p.frontmatter);
}

/** Published posts only, newest first — what the public index and sitemap use. */
export function getPublishedPosts(): BlogFrontmatter[] {
  return getAllPosts().filter((p) => p.status === "published");
}

export function getPostsByCategory(category?: BlogCategory): BlogFrontmatter[] {
  const published = getPublishedPosts();
  return category ? published.filter((p) => p.category === category) : published;
}

export interface PaginatedPosts {
  items: BlogFrontmatter[];
  currentPage: number;
  totalPages: number;
}

export function paginatePosts(posts: BlogFrontmatter[], page: number, perPage = 12): PaginatedPosts {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return { items: posts.slice(start, start + perPage), currentPage, totalPages };
}

export interface CompiledPost {
  frontmatter: BlogFrontmatter;
  content: ReactElement;
}

export async function getPostBySlug(slug: string): Promise<CompiledPost | null> {
  const raw = readAllRawPosts().find((p) => p.frontmatter.slug === slug);
  if (!raw) return null;

  const { content } = await compileMDX({
    source: raw.body,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  return { frontmatter: raw.frontmatter, content };
}
