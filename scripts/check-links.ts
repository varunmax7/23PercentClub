/**
 * Internal link checker — README §8 Phase 8 step 6 ("zero broken
 * internal links"). Crawls the site starting from every URL in the
 * live sitemap.xml plus a couple of real routes the sitemap
 * deliberately excludes (the draft legend preview, the /dev gallery),
 * following every same-origin link it finds, and fails if any 404s.
 *
 * Fetches sitemap.xml over HTTP rather than importing src/app/sitemap.ts
 * directly — that module pulls in next-mdx-remote/rsc, which isn't safe
 * to execute outside Next's own bundler/runtime (fails resolving
 * estree-walker's package exports under plain tsx).
 *
 * Self-contained: spawns `next start` if nothing is already listening
 * on the target port, waits for it to be ready, runs the crawl, then
 * tears it down — so this composes into `npm run audit:full` as one
 * command rather than needing an externally-managed server.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { EXTRA_SEEDS, LOC_PATTERN, toPath } from "./sitemap-seeds";

const PORT = process.env.LINK_CHECK_PORT ?? "3000";
const BASE = process.env.LINK_CHECK_BASE_URL ?? `http://localhost:${PORT}`;
const HREF_PATTERN = /href="(\/[^"#?]*)"/g;

async function isServerUp(): Promise<boolean> {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(1000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(child: ChildProcess, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp()) return;
    if (child.exitCode !== null) throw new Error(`server process exited early with code ${child.exitCode}`);
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not become ready within ${timeoutMs}ms`);
}

async function fetchSitemapSeeds(): Promise<string[]> {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(LOC_PATTERN)].map((m) => toPath(m[1]!));
}

async function fetchPage(path: string): Promise<{ status: number; links: string[] }> {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return { status: res.status, links: [] };

  const html = await res.text();
  const links = new Set<string>();
  for (const match of html.matchAll(HREF_PATTERN)) {
    const href = match[1];
    if (href && !href.startsWith("/_next") && !href.startsWith("//")) {
      links.add(href.split("?")[0] ?? href);
    }
  }
  return { status: res.status, links: [...links] };
}

async function crawl(): Promise<number> {
  const sitemapSeeds = await fetchSitemapSeeds();
  const seeds = [...new Set([...sitemapSeeds, ...EXTRA_SEEDS])];
  const visited = new Set<string>();
  const queue = [...seeds];
  const broken: { path: string; status: number; referrers: Set<string> }[] = [];
  const referrersByPath = new Map<string, Set<string>>();

  for (const seed of seeds) referrersByPath.set(seed, new Set(["(sitemap/seed)"]));

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    let result: { status: number; links: string[] };
    try {
      result = await fetchPage(path);
    } catch (err) {
      broken.push({ path, status: -1, referrers: referrersByPath.get(path) ?? new Set() });
      console.error(`  fetch error on ${path}: ${err}`);
      continue;
    }

    if (result.status >= 400) {
      broken.push({ path, status: result.status, referrers: referrersByPath.get(path) ?? new Set() });
      continue;
    }

    for (const link of result.links) {
      const existing = referrersByPath.get(link) ?? new Set();
      existing.add(path);
      referrersByPath.set(link, existing);
      if (!visited.has(link)) queue.push(link);
    }
  }

  console.log(`check-links: crawled ${visited.size} internal route(s) from ${seeds.length} seed(s).`);

  if (broken.length === 0) {
    console.log("check-links: 0 broken links.");
    return 0;
  }

  console.error(`check-links: ${broken.length} broken link(s):\n`);
  for (const b of broken) {
    console.error(`  ${b.path} — status ${b.status} — linked from: ${[...b.referrers].join(", ")}`);
  }
  return 1;
}

async function main() {
  const alreadyUp = await isServerUp();
  let child: ChildProcess | null = null;

  if (!alreadyUp) {
    console.log(`check-links: no server on port ${PORT}, starting one via 'npm run start'...`);
    child = spawn("npm", ["run", "start", "--", "-p", PORT], {
      stdio: "ignore",
      detached: true,
    });
    await waitForServer(child);
  } else {
    console.log(`check-links: reusing existing server on port ${PORT}.`);
  }

  let exitCode = 1;
  try {
    exitCode = await crawl();
  } finally {
    if (child?.pid) {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {
        // already gone
      }
    }
  }

  process.exit(exitCode);
}

main();
