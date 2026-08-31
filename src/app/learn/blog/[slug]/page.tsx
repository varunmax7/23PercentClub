import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SourceCitation } from "@/components/ui/SourceCitation";

const CATEGORY_LABEL: Record<string, string> = {
  "behavioural-finance": "Behavioural Finance",
  "case-studies": "Case Studies",
  "founder-journey": "Founder Journey",
  "wealth-frameworks": "Wealth Frameworks",
  contrarian: "Contrarian",
  "personal-stories": "Personal Stories",
  flagship: "Flagship",
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    robots: post.frontmatter.status === "draft" ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: [post.frontmatter.coverImage],
      type: "article",
      publishedTime: post.frontmatter.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;

  return (
    <Section>
      <Container className="mx-auto max-w-3xl">
        {frontmatter.status === "draft" && (
          <p className="mb-6 w-fit rounded-full bg-off-white px-4 py-1.5 font-body text-xs font-medium text-slate">
            Draft — preview only
          </p>
        )}

        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-2 font-body text-xs font-medium uppercase tracking-wide text-sapphire">
            <span>{CATEGORY_LABEL[frontmatter.category] ?? frontmatter.category}</span>
            <span aria-hidden="true" className="text-border">·</span>
            <time dateTime={frontmatter.date} className="text-slate normal-case tracking-normal">
              {new Date(frontmatter.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {frontmatter.title}
          </h1>
          <p className="font-body text-sm text-slate">
            {frontmatter.author} · {frontmatter.readTime} min read
          </p>
        </div>

        <article>{content}</article>

        {frontmatter.sources.length > 0 && (
          <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6">
            <p className="font-body text-xs font-medium uppercase tracking-wide text-slate">Sources</p>
            {frontmatter.sources.map((source) => (
              <SourceCitation key={source} label={source} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
