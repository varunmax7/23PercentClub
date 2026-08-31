import Link from "next/link";

/** Contextual CTA into a related blog post — README §5.1. */
export function BlogCta({ teaser, href = "/learn/blog" }: { teaser: string; href?: string }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-off-white p-6">
      <p className="font-body text-sm text-ink">{teaser}</p>
      <Link href={href} className="font-body text-sm font-medium text-sapphire hover:underline">
        Read more on the blog →
      </Link>
    </div>
  );
}
