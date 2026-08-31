import { test, expect } from "@playwright/test";

/**
 * Required per README §8 Phase 7 Gate G7: "Analytics fires on a real
 * interaction." NEXT_PUBLIC_ANALYTICS_ENABLED/DOMAIN aren't set in this
 * test run, so no real request goes to plausible.io — instead this
 * stubs window.plausible before navigation and asserts trackEvent()
 * actually calls it with the right event name and props, which is the
 * part of the wiring that's ours to get right (the script tag itself is
 * checked separately, gated on env vars).
 */

test.describe("Analytics wiring", () => {
  test("calculator_used fires once on first slider interaction, not on mount", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls = [];
      (window as unknown as { plausible: (...args: unknown[]) => void }).plausible = (...args: unknown[]) => {
        (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls.push(args);
      };
    });

    await page.goto("/tools/sip-calculator");

    let calls = await page.evaluate(() => (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls);
    expect(calls).toEqual([]);

    const slider = page.getByRole("slider", { name: "Monthly investment" });
    await slider.fill("50000");

    calls = await page.evaluate(() => (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(["calculator_used", { props: { calculator: "sip" } }]);

    // A second interaction should not fire it again.
    await slider.fill("75000");
    calls = await page.evaluate(() => (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls);
    expect(calls).toHaveLength(1);
  });

  test("tool_cta_clicked fires when the blog CTA is clicked", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls = [];
      (window as unknown as { plausible: (...args: unknown[]) => void }).plausible = (...args: unknown[]) => {
        (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls.push(args);
      };
    });

    await page.goto("/tools/sip-calculator");
    await page.getByRole("link", { name: "Read more on the blog →" }).click();

    const calls = await page.evaluate(() => (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual([
      "tool_cta_clicked",
      { props: { from: "/tools/sip-calculator", to: "/learn/blog/why-most-investors-stop-sip" } },
    ]);
  });

  test("blog_read_complete fires once the end-of-article sentinel scrolls into view", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls = [];
      (window as unknown as { plausible: (...args: unknown[]) => void }).plausible = (...args: unknown[]) => {
        (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls.push(args);
      };
    });

    await page.goto("/learn/blog/why-most-investors-stop-sip");

    let calls = await page.evaluate(() => (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls);
    expect(calls).toEqual([]);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    calls = await page.evaluate(() => (window as unknown as { __plausibleCalls: unknown[] }).__plausibleCalls);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(["blog_read_complete", { props: { slug: "why-most-investors-stop-sip" } }]);
  });
});
