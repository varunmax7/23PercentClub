import type { ReactNode } from "react";

const TONE = {
  default: "bg-white",
  muted: "bg-off-white",
} as const;

export function Section({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof TONE;
}) {
  return (
    <section className={`${TONE[tone]} py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}
