import Link from "next/link";
import { SEBI_DISCLAIMER } from "@/lib/compliance";
import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { Container } from "./Container";

const FOOTER_LINKS = [
  { label: "Tools", href: "/tools" },
  { label: "Learn", href: "/learn" },
  { label: "Legends", href: "/legends" },
  { label: "Market", href: "/market" },
  { label: "About", href: "/about" },
  { label: "Disclosures", href: "/disclosures" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <LogoHorizontal />
            <p className="max-w-xs font-body text-sm text-slate">
              We don&apos;t manage your money. We teach you how to manage it.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-slate hover:text-sapphire"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="border-t border-border pt-6 font-body text-xs leading-relaxed text-slate">
          {SEBI_DISCLAIMER}
        </p>
      </Container>
    </footer>
  );
}
