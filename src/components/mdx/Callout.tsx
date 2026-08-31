import type { ReactNode } from "react";

/** A note box for prose content — MDX shortcode: <Callout>...</Callout> */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-border bg-off-white px-5 py-4 font-body text-sm leading-relaxed text-ink">
      {children}
    </div>
  );
}
