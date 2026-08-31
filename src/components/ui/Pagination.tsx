import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 font-body text-sm"
    >
      {prevDisabled ? (
        <span className="text-slate/50" aria-disabled="true">
          Previous
        </span>
      ) : (
        <Link href={buildHref(currentPage - 1)} className="text-sapphire hover:underline">
          Previous
        </Link>
      )}

      <span className="text-slate tabular-nums">
        Page {currentPage} of {totalPages}
      </span>

      {nextDisabled ? (
        <span className="text-slate/50" aria-disabled="true">
          Next
        </span>
      ) : (
        <Link href={buildHref(currentPage + 1)} className="text-sapphire hover:underline">
          Next
        </Link>
      )}
    </nav>
  );
}
