import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

// White text on Bright Blue is 2.12:1 — fails WCAG AA (4.5:1). Ink on
// Bright Blue is 8.24:1, so the primary variant uses text-ink, not
// text-white. Caught by the Gate G1 axe check on /dev/components.
const VARIANT = {
  primary:
    "bg-bright-blue text-ink hover:opacity-90 focus-visible:outline-offset-4",
  secondary:
    "bg-transparent text-sapphire border border-sapphire hover:bg-off-white",
} as const;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

type Variant = keyof typeof VARIANT;

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      className={`${BASE} ${VARIANT[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <a className={`${BASE} ${VARIANT[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
