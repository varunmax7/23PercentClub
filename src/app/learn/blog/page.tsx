import type { Metadata } from "next";
import { getPostsByCategory, paginatePosts } from "@/lib/content";
import { BLOG_CATEGORIES } from "@/lib/content-schemas";
import type { BlogCategory } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BlogCard } from "@/components/cards/BlogCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Behavioural finance, case studies, wealth frameworks, and the founder journey — education, never advice.",
};

const CATEGORY_LABEL: Record<BlogCategory, string> = {
  "behavioural-finance": "Behavioural Finance",
  "case-studies": "Case Studies",
  "founder-journey": "Founder Journey",
  "wealth-frameworks": "Wealth Frameworks",
  contrarian: "Contrarian",
  "personal-stories": "Personal Stories",
  flagship: "Flagship",
};

function isBlogCategory(value: string | undefined): value is BlogCategory {
  return !!value && (BLOG_CATEGORIES as readonly string[]).includes(value);
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = isBlogCategory(params.category) ? params.category : undefined;
  const page = Number(params.page ?? "1") || 1;

  const posts = getPostsByCategory(category);
  const { items, currentPage, totalPages } = paginatePosts(posts, page);

  function buildCategoryHref(slug?: string): string {
    return slug ? `/learn/blog?category=${slug}` : "/learn/blog";
  }

  function buildPageHref(targetPage: number): string {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    qs.set("page", String(targetPage));
    return `/learn/blog?${qs.toString()}`;
  }

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Blog</h1>
          <p className="max-w-2xl font-body text-base text-slate">
            Behavioural finance, real case studies, wealth frameworks, and the
            build-in-public founder journey. Education, never advice.
          </p>
        </header>

        <CategoryFilter
          options={BLOG_CATEGORIES.map((slug) => ({ slug, label: CATEGORY_LABEL[slug] }))}
          active={category}
          buildHref={buildCategoryHref}
        />

        {items.length === 0 ? (
          <p className="font-body text-sm text-slate">No posts in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildPageHref} />
      </Container>
    </Section>
  );
}
