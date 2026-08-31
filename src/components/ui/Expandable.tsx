import type { ReactNode } from "react";

/**
 * Native <details>/<summary> — zero-JS, keyboard- and screen-reader-
 * accessible by default. Used for "How this is calculated" and similar
 * progressive-disclosure content.
 */
export function Expandable({
  title,
  children,
  className = "",
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className={`group rounded-xl border border-border bg-off-white ${className}`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-body text-sm font-medium text-sapphire">
        {title}
        <span
          aria-hidden="true"
          className="text-slate transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-border px-4 py-4 font-body text-sm leading-relaxed text-ink">
        {children}
      </div>
    </details>
  );
}
