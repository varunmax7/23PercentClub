import Link from "next/link";

/**
 * Contextual CTA into a related blog post — README §5.1. The target post
 * doesn't exist until Phase 4 ships it, so this points at the blog index
 * for now. TODO(phase-4): point each calculator at its specific post and
 * remove this fallback.
 */
export function BlogCta({ teaser }: { teaser: string }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-off-white p-6">
      <p className="font-body text-sm text-ink">{teaser}</p>
      <Link href="/learn/blog" className="font-body text-sm font-medium text-sapphire hover:underline">
        Read more on the blog →
      </Link>
    </div>
  );
}
