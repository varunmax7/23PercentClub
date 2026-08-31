import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Money Basics index", () => {
  test("lists all five topics", async ({ page }) => {
    await page.goto("/learn/money-basics");
    await expect(page.getByRole("heading", { name: "Money Basics", level: 1 })).toBeVisible();
    for (const title of ["Loans", "Credit Cards", "Debt", "Taxes", "Insurance"]) {
      await expect(page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
    }
  });

  test("zero critical axe violations @a11y", async ({ page }) => {
    await page.goto("/learn/money-basics");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    if (critical.length > 0) console.log(JSON.stringify(critical, null, 2));
    expect(critical).toEqual([]);
  });
});

test.describe("Money Basics topic page", () => {
  for (const topic of ["loans", "credit-cards", "debt", "taxes", "insurance"]) {
    test(`${topic} page renders and links to a tool and a blog post`, async ({ page }) => {
      await page.goto(`/learn/money-basics/${topic}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const toolLink = page.locator('a[href^="/tools/"]').first();
      await expect(toolLink).toBeVisible();

      const blogLink = page.locator('a[href^="/learn/blog/"]').first();
      await expect(blogLink).toBeVisible();
    });
  }

  test("taxes page states the Section 50AA debt fund change with a citation", async ({ page }) => {
    await page.goto("/learn/money-basics/taxes");
    await expect(page.getByText("Section 50AA")).toBeVisible();
    await expect(page.getByText("1 April 2023")).toBeVisible();
    await expect(page.getByText("Income Tax Act, 1961").first()).toBeVisible();
  });
});
