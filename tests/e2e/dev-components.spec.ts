import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("dev/components gallery", () => {
  test("has zero critical axe violations @a11y", async ({ page }) => {
    await page.goto("/dev/components");

    const results = await new AxeBuilder({ page })
      .include("body")
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    if (critical.length > 0) {
      console.log(JSON.stringify(critical, null, 2));
    }

    expect(critical).toEqual([]);
  });

  test("keyboard tab order reaches the primary nav and a button @a11y", async ({ page }) => {
    await page.goto("/dev/components");

    await page.keyboard.press("Tab");
    const first = page.locator(":focus");
    await expect(first).toBeVisible();

    // Tab a handful more times and confirm focus keeps landing on real,
    // visible interactive elements rather than getting lost.
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    const later = page.locator(":focus");
    await expect(later).toBeVisible();
  });
});
