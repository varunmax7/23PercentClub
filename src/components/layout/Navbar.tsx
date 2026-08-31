"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { Container } from "./Container";

const NAV_ITEMS = [
  { label: "Tools", href: "/tools" },
  { label: "Learn", href: "/learn" },
  { label: "Legends", href: "/legends" },
  { label: "Market", href: "/market" },
  { label: "About", href: "/about" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="shrink-0" aria-label="23% Club home">
          <LogoHorizontal />
        </Link>
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-block border-b-2 py-1 font-body text-sm font-medium transition-colors ${
                      isActive
                        ? "border-bright-blue text-sapphire"
                        : "border-transparent text-slate hover:text-sapphire"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <MobileNav pathname={pathname} />
      </Container>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="sm:hidden">
      <ul className="flex items-center gap-4">
        {NAV_ITEMS.slice(0, 3).map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`font-body text-sm font-medium ${
                  isActive ? "text-sapphire" : "text-slate"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
