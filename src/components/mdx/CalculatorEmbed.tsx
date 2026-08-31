import Link from "next/link";
import { METHODOLOGY, type Methodology } from "@/lib/methodology";

const TOOL_HREF: Record<Methodology["slug"], string> = {
  sip: "/tools/sip-calculator",
  "step-up-sip": "/tools/step-up-sip-calculator",
  lumpsum: "/tools/lumpsum-calculator",
  inflation: "/tools/inflation-calculator",
};

/**
 * Links out to a calculator from inside blog prose — never duplicates the
 * calculator itself. MDX shortcode: <CalculatorEmbed tool="sip" />
 */
export function CalculatorEmbed({ tool }: { tool: Methodology["slug"] }) {
  const methodology = METHODOLOGY[tool];

  return (
    <Link
      href={TOOL_HREF[tool]}
      className="group my-6 flex items-center justify-between gap-4 rounded-xl border border-sapphire bg-off-white px-5 py-4 no-underline transition-colors hover:bg-white"
    >
      <span className="font-body text-sm font-medium text-ink">
        Try the {methodology.name} →
      </span>
      <span className="font-body text-xs text-slate group-hover:text-sapphire">
        Free, no signup
      </span>
    </Link>
  );
}
