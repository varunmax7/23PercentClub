import type { ReactNode } from "react";

/**
 * The shared shell for all four calculators — README §5.1. Inputs stay
 * quiet and narrower; the result is the wide, crafted half of the page.
 * Stacks result-first on mobile since that's what the visitor came for.
 */
export function CalculatorLayout({
  title,
  description,
  inputs,
  result,
  belowFold,
}: {
  title: string;
  description: string;
  inputs: ReactNode;
  result: ReactNode;
  belowFold?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl font-body text-base text-slate">
          {description}
        </p>
      </header>

      <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-5 lg:sticky lg:top-24">{inputs}</div>
        <div>{result}</div>
      </div>

      {belowFold}
    </div>
  );
}
