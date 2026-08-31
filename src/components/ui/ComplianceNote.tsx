import { CALCULATOR_CAVEAT } from "@/lib/compliance";

/**
 * Renders directly under every calculator result — README §5.7. Not the
 * site-wide footer disclaimer (that lives in <Footer>); this is the
 * per-result illustrative-return caveat required by README §5.1.
 */
export function ComplianceNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-lg bg-alert-amber/10 px-4 py-3 font-body text-xs leading-relaxed text-alert-amber-text ${className}`}
    >
      <span aria-hidden="true">⚠</span>
      <span>{CALCULATOR_CAVEAT}</span>
    </p>
  );
}
