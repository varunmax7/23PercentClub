import type { ReactNode } from "react";

/**
 * Minimal structural primitive — a border, a radius, a background. Specific
 * cards (BlogCard, ProductCard, LegendCard) compose this with their own
 * content layout rather than sharing one visual template; see README §3
 * on avoiding identical-card defaults.
 */
export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <As
      className={`rounded-2xl border border-border bg-white ${className}`}
    >
      {children}
    </As>
  );
}
