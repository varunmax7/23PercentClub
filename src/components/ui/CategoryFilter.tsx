import Link from "next/link";

export interface CategoryOption {
  slug: string;
  label: string;
}

export function CategoryFilter({
  options,
  active,
  buildHref,
}: {
  options: CategoryOption[];
  active?: string;
  buildHref: (slug?: string) => string;
}) {
  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      <Link
        href={buildHref(undefined)}
        aria-current={!active ? "true" : undefined}
        className={`rounded-full px-4 py-1.5 font-body text-sm transition-colors ${
          !active
            ? "bg-sapphire text-white"
            : "bg-off-white text-slate hover:text-sapphire"
        }`}
      >
        All
      </Link>
      {options.map((option) => {
        const isActive = active === option.slug;
        return (
          <Link
            key={option.slug}
            href={buildHref(option.slug)}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full px-4 py-1.5 font-body text-sm transition-colors ${
              isActive
                ? "bg-sapphire text-white"
                : "bg-off-white text-slate hover:text-sapphire"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
