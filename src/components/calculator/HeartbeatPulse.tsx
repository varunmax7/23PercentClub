/**
 * The result panel's signature moment: the brand's ECG-into-cross line,
 * stretched full-width, sweeping in once on mount. Purely decorative —
 * aria-hidden, and the pulse-sweep animation collapses to 0.01ms under
 * prefers-reduced-motion (see globals.css).
 */
export function HeartbeatPulse({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 32"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <polyline
        points="0,16 60,16 70,16 76,8 82,24 88,2 94,30 100,16 200,16"
        fill="none"
        stroke="var(--color-bright-blue)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pulse-sweep"
        style={{ ["--pulse-length" as string]: 260 }}
      />
    </svg>
  );
}
