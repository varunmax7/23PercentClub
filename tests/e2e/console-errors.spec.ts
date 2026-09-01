import { test, expect } from "@playwright/test";
import { EXTRA_SEEDS, LOC_PATTERN, toPath } from "../../scripts/sitemap-seeds";

/**
 * README §8 Phase 8 step 6: "zero console errors on any route." Visits
 * every URL in the live sitemap (the same real routes check-links.ts
 * crawls from) plus the two routes the sitemap deliberately excludes —
 * the draft legend preview and the /dev gallery — since both still ship
 * and "any route" isn't scoped to just the indexable ones.
 */

test("zero console errors across every shipped route", async ({ page, request, baseURL }) => {
  const res = await request.get(`${baseURL}/sitemap.xml`);
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  const seeds = [...new Set([...[...xml.matchAll(LOC_PATTERN)].map((m) => toPath(m[1]!)), ...EXTRA_SEEDS])];
  expect(seeds.length).toBeGreaterThan(0);

  const errorsByRoute = new Map<string, string[]>();

  for (const route of seeds) {
    const messages: string[] = [];
    const onConsole = (msg: import("@playwright/test").ConsoleMessage) => {
      if (msg.type() === "error") messages.push(msg.text());
    };
    const onPageError = (err: Error) => messages.push(`pageerror: ${err.message}`);

    page.on("console", onConsole);
    page.on("pageerror", onPageError);
    await page.goto(route, { waitUntil: "networkidle" });
    page.off("console", onConsole);
    page.off("pageerror", onPageError);

    if (messages.length > 0) errorsByRoute.set(route, messages);
  }

  if (errorsByRoute.size > 0) {
    const report = [...errorsByRoute.entries()]
      .map(([route, msgs]) => `  ${route}:\n${msgs.map((m) => `    - ${m}`).join("\n")}`)
      .join("\n");
    console.error(`Console errors found on ${errorsByRoute.size} route(s):\n${report}`);
  }
  expect([...errorsByRoute.keys()]).toEqual([]);
});
