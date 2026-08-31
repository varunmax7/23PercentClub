import Link from "next/link";
import type { LegendFrontmatter } from "@/lib/types";

/** Leads with era + name — the narrative hook, not a category chip. */
export function LegendCard({
  legend,
}: {
  legend: Pick<LegendFrontmatter, "name" | "slug" | "era" | "oneLineLesson" | "status">;
}) {
  const isDraft = legend.status === "draft";

  return (
    <Link
      href={`/legends/${legend.slug}`}
      aria-disabled={isDraft || undefined}
      data-status={legend.status}
      className={`group flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 transition-colors ${
        isDraft ? "pointer-events-none opacity-60" : "hover:border-sapphire"
      }`}
    >
      <span className="font-body text-xs font-medium uppercase tracking-wide text-slate">
        {legend.era}
      </span>
      <h3 className="font-display text-xl font-semibold text-ink group-hover:text-sapphire">
        {legend.name}
      </h3>
      <p className="font-body text-sm leading-relaxed text-slate">
        {legend.oneLineLesson}
      </p>
      {isDraft && (
        <span className="w-fit rounded-full bg-off-white px-3 py-1 font-body text-xs font-medium text-slate">
          In progress
        </span>
      )}
    </Link>
  );
}
