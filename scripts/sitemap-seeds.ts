/**
 * Shared by scripts/check-links.ts and tests/e2e/console-errors.spec.ts —
 * both crawl "every shipped route" starting from the live sitemap plus
 * the two routes it deliberately excludes (the draft legend preview, the
 * /dev gallery). Kept in one place so the two lists can't silently drift:
 * adding a route to one crawl without the other would otherwise leave it
 * unchecked by whichever file wasn't updated, with no signal that they'd
 * diverged.
 */
export const EXTRA_SEEDS = ["/legends/charlie-munger", "/dev/components"];
export const LOC_PATTERN = /<loc>([^<]+)<\/loc>/g;

export function toPath(url: string): string {
  return url.replace(/^https?:\/\/[^/]+/, "") || "/";
}
