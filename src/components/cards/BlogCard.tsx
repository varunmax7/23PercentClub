import Link from "next/link";
import type { BlogFrontmatter } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  "behavioural-finance": "Behavioural Finance",
  "case-studies": "Case Studies",
  "founder-journey": "Founder Journey",
  "wealth-frameworks": "Wealth Frameworks",
  contrarian: "Contrarian",
  "personal-stories": "Personal Stories",
  flagship: "Flagship",
};

/**
 * Leads with category + date as a real editorial eyebrow (the 7-day
 * rotation is genuine structure) — not a numbered marker, this grid isn't
 * a sequence. See README §11.1.
 */
export function BlogCard({
  post,
}: {
  post: Pick<
    BlogFrontmatter,
    "title" | "slug" | "date" | "category" | "readTime" | "excerpt"
  >;
}) {
  return (
    <Link
      href={`/learn/blog/${post.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 transition-colors hover:border-sapphire"
    >
      <div className="flex items-center gap-2 font-body text-xs font-medium uppercase tracking-wide text-sapphire">
        <span>{CATEGORY_LABEL[post.category] ?? post.category}</span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <time dateTime={post.date} className="text-slate normal-case tracking-normal">
          {new Date(post.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink group-hover:text-sapphire">
        {post.title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-slate">
        {post.excerpt}
      </p>
      <span className="font-body text-xs text-slate">
        {post.readTime} min read
      </span>
    </Link>
  );
}
