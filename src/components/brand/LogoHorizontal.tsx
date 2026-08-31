import { LogoMark } from "./LogoMark";

/** Icon + wordmark, side by side — the default lockup for the Navbar. */
export function LogoHorizontal({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-lg font-semibold leading-none text-ink">
        23<span className="text-sapphire">%</span> Club
      </span>
    </span>
  );
}
