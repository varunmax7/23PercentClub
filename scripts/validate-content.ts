/**
 * Content validation gate — README.md §6.3. Fails the build on a missing
 * required field, a slug/filename mismatch, an unknown category, or a
 * stated figure with an empty sources[]. Schemas live in
 * src/lib/content-schemas.ts, shared with tests/content-validation.test.ts.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, basename, extname } from "node:path";
import matter from "gray-matter";
import {
  blogSchema,
  legendSchema,
  moneyBasicsSchema,
  validateEntry,
  validateMoneyBasicsEntry,
  findDuplicateSlugs,
  type ContentError,
} from "../src/lib/content-schemas";

function validateDir<
  T extends { slug: string; status: "published" | "draft"; sources: string[] },
>(dir: string, schema: import("zod").ZodType<T>, errors: ContentError[], requireSources: boolean) {
  if (!existsSync(dir)) return;

  const slugs: string[] = [];

  for (const entry of readdirSync(dir)) {
    if (extname(entry) !== ".mdx") continue;
    const full = join(dir, entry);
    const raw = readFileSync(full, "utf-8");
    const { data, content } = matter(raw);
    const expectedSlug = basename(entry, ".mdx");

    errors.push(...validateEntry(entry, data, content, expectedSlug, schema, requireSources));

    const parsed = schema.safeParse(data);
    if (parsed.success) slugs.push(parsed.data.slug);
  }

  for (const dup of findDuplicateSlugs(slugs)) {
    errors.push({ file: dir, message: `duplicate slug "${dup}"` });
  }
}

function validateMoneyBasicsDir(dir: string, errors: ContentError[]) {
  if (!existsSync(dir)) return;

  const topics: string[] = [];

  for (const entry of readdirSync(dir)) {
    if (extname(entry) !== ".mdx") continue;
    const full = join(dir, entry);
    const raw = readFileSync(full, "utf-8");
    const { data, content } = matter(raw);
    const expectedTopic = basename(entry, ".mdx");

    errors.push(...validateMoneyBasicsEntry(entry, data, content, expectedTopic));

    const parsed = moneyBasicsSchema.safeParse(data);
    if (parsed.success) topics.push(parsed.data.topic);
  }

  for (const dup of findDuplicateSlugs(topics)) {
    errors.push({ file: dir, message: `duplicate topic "${dup}"` });
  }
}

function main() {
  const errors: ContentError[] = [];
  const contentRoot = join(process.cwd(), "src", "content");

  validateDir(join(contentRoot, "blog"), blogSchema, errors, true);
  validateDir(join(contentRoot, "legends"), legendSchema, errors, true);
  validateMoneyBasicsDir(join(contentRoot, "money-basics"), errors);

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
