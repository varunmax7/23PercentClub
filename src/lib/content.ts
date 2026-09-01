import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache, type ReactElement } from "react";
import type {
  BlogFrontmatter,
  BlogCategory,
  MoneyBasicsFrontmatter,
  MoneyBasicsTopicSlug,
  LegendFrontmatter,
} from "./types";
import { blogSchema, moneyBasicsSchema, legendSchema, MONEY_BASICS_TOPICS } from "./content-schemas";
import { mdxComponents } from "@/components/mdx/MdxComponents";

const BLOG_DIR = join(process.cwd(), "src", "content", "blog");
const MONEY_BASICS_DIR = join(process.cwd(), "src", "content", "money-basics");
const LEGENDS_DIR = join(process.cwd(), "src", "content", "legends");

interface RawPost {
  frontmatter: BlogFrontmatter;
  body: string;
}

// Wrapped in React's cache() so generateMetadata and the page component —
// which each independently need the full parsed post list to find one
// slug — read and parse every .mdx file's frontmatter only once per
// render pass instead of twice, per README §5.2/§6.3's content pipeline.
const readAllRawPosts = cache((): RawPost[] => {
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
});

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

// cache()'d so a route's generateMetadata and page component — which
// each need this same slug's compiled content — only pay for one
// compileMDX call per render pass, not two.
export const getPostBySlug = cache(async (slug: string): Promise<CompiledPost | null> => {
  const raw = readAllRawPosts().find((p) => p.frontmatter.slug === slug);
  if (!raw) return null;

  const { content } = await compileMDX({
    source: raw.body,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  return { frontmatter: raw.frontmatter, content };
});

// ---- Money Basics ----------------------------------------------------------

interface RawMoneyBasicsTopic {
  frontmatter: MoneyBasicsFrontmatter;
  body: string;
}

const readAllRawMoneyBasicsTopics = cache((): RawMoneyBasicsTopic[] => {
  if (!existsSync(MONEY_BASICS_DIR)) return [];

  return readdirSync(MONEY_BASICS_DIR)
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => {
      const raw = readFileSync(join(MONEY_BASICS_DIR, entry), "utf-8");
      const { data, content } = matter(raw);
      const result = moneyBasicsSchema.safeParse(data);

      if (!result.success) {
        const messages = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        throw new Error(`Invalid frontmatter in ${entry}: ${messages}`);
      }

      const expectedTopic = basename(entry, ".mdx");
      if (result.data.topic !== expectedTopic) {
        throw new Error(`${entry}: topic "${result.data.topic}" does not match filename "${expectedTopic}"`);
      }

      return { frontmatter: result.data, body: content };
    });
});

const TOPIC_ORDER: readonly MoneyBasicsTopicSlug[] = MONEY_BASICS_TOPICS;

/** Fixed order per README §5.3: loans, credit cards, debt, taxes, insurance. */
export function getMoneyBasicsTopics(): MoneyBasicsFrontmatter[] {
  const all = readAllRawMoneyBasicsTopics().map((t) => t.frontmatter);
  return TOPIC_ORDER.map((slug) => all.find((t) => t.topic === slug)).filter(
    (t): t is MoneyBasicsFrontmatter => t !== undefined,
  );
}

export interface CompiledMoneyBasicsTopic {
  frontmatter: MoneyBasicsFrontmatter;
  content: ReactElement;
}

export const getMoneyBasicsTopic = cache(async (topic: string): Promise<CompiledMoneyBasicsTopic | null> => {
  const raw = readAllRawMoneyBasicsTopics().find((t) => t.frontmatter.topic === topic);
  if (!raw) return null;

  const { content } = await compileMDX({
    source: raw.body,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  return { frontmatter: raw.frontmatter, content };
});

// ---- Legends -----------------------------------------------------------

interface RawLegend {
  frontmatter: LegendFrontmatter;
  body: string;
}

const readAllRawLegends = cache((): RawLegend[] => {
  if (!existsSync(LEGENDS_DIR)) return [];

  return readdirSync(LEGENDS_DIR)
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => {
      const raw = readFileSync(join(LEGENDS_DIR, entry), "utf-8");
      const { data, content } = matter(raw);
      const result = legendSchema.safeParse(data);

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
});

/** All legends regardless of status — used for static params so drafts still render on preview deployments. */
export function getAllLegends(): LegendFrontmatter[] {
  return readAllRawLegends().map((l) => l.frontmatter);
}

/** Published legends only — what the index and sitemap use. Draft legends (e.g. Munger) are excluded. */
export function getPublishedLegends(): LegendFrontmatter[] {
  return getAllLegends().filter((l) => l.status === "published");
}

export interface CompiledLegend {
  frontmatter: LegendFrontmatter;
  content: ReactElement;
}

export const getLegendBySlug = cache(async (slug: string): Promise<CompiledLegend | null> => {
  const raw = readAllRawLegends().find((l) => l.frontmatter.slug === slug);
  if (!raw) return null;

  const { content } = await compileMDX({
    source: raw.body,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  return { frontmatter: raw.frontmatter, content };
});
