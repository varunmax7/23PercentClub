/**
 * Inline citation for any specific number, rate, date, or quote — README
 * §11.3. A figure without one of these next to it should not ship.
 */
export function SourceCitation({
  href,
  label,
}: {
  href?: string;
  label: string;
}) {
  const content = (
    <span className="font-body text-xs text-slate">
      Source: {label}
    </span>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-body text-xs text-slate underline decoration-border decoration-1 underline-offset-2 hover:text-sapphire"
    >
      Source: {label}
    </a>
  );
}
