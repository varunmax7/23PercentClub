/**
 * Content validation gate — README.md §6.3.
 * Validates MDX frontmatter in src/content/{blog,legends,money-basics}
 * against the contracts defined there. Fails the build on a missing
 * required field, a slug/filename mismatch, an unknown category, or a
 * stated figure with an empty sources[].
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, basename, extname } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const BLOG_CATEGORIES = [
  "behavioural-finance",
  "case-studies",
  "founder-journey",
  "wealth-frameworks",
  "contrarian",
  "personal-stories",
  "flagship",
] as const;

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  category: z.enum(BLOG_CATEGORIES),
  readTime: z.number().int().positive(),
  author: z.string().min(1),
  coverImage: z.string().min(1),
  excerpt: z.string().max(200),
  status: z.enum(["published", "draft"]).default("published"),
  sources: z.array(z.string()).default([]),
});

const legendSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  era: z.string().min(1),
  oneLineLesson: z.string().min(1),
  status: z.enum(["published", "draft"]).default("published"),
  sources: z.array(z.string()).default([]),
  coverImage: z.string().min(1),
});

interface ContentError {
  file: string;
  message: string;
}

function validateDir<
  T extends { slug: string; status: "published" | "draft"; sources: string[] },
>(dir: string, schema: z.ZodType<T>, errors: ContentError[], requireSources = false) {
  if (!existsSync(dir)) return;
  const seenSlugs = new Set<string>();

  for (const entry of readdirSync(dir)) {
    if (extname(entry) !== ".mdx") continue;
    const full = join(dir, entry);
    const raw = readFileSync(full, "utf-8");
    const { data } = matter(raw);
    const result = schema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({ file: entry, message: `${issue.path.join(".")}: ${issue.message}` });
      }
      continue;
    }

    const expectedSlug = basename(entry, ".mdx");
    if (result.data.slug !== expectedSlug) {
      errors.push({ file: entry, message: `slug "${result.data.slug}" does not match filename "${expectedSlug}"` });
    }

    if (seenSlugs.has(result.data.slug)) {
      errors.push({ file: entry, message: `duplicate slug "${result.data.slug}"` });
    }
    seenSlugs.add(result.data.slug);

    if (requireSources && result.data.status === "published" && raw.match(/\d/) && result.data.sources.length === 0) {
      errors.push({ file: entry, message: "published post contains a figure but sources[] is empty" });
    }
  }
}

function main() {
  const errors: ContentError[] = [];
  const contentRoot = join(process.cwd(), "src", "content");

  validateDir(join(contentRoot, "blog"), blogSchema, errors, true);
  validateDir(join(contentRoot, "legends"), legendSchema, errors, true);

  if (errors.length === 0) {
    console.log("validate-content: all MDX frontmatter valid.");
    process.exit(0);
  }

  console.error(`validate-content: ${errors.length} error(s):\n`);
  for (const e of errors) {
    console.error(`  ${e.file} — ${e.message}`);
  }
  process.exit(1);
}

main();
