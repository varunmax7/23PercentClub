import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Blog index", () => {
  test("lists posts and category filter is linkable", async ({ page }) => {
    await page.goto("/learn/blog");
    await expect(page.getByRole("heading", { name: "Blog", level: 1 })).toBeVisible();
    await expect(page.getByText("Why Most Investors Stop Their SIP")).toBeVisible();

    await page.getByRole("group", { name: "Filter by category" }).getByRole("link", { name: "Contrarian" }).click();
    await expect(page).toHaveURL(/category=contrarian/);
    await expect(page.getByText("Lumpsum vs SIP")).toBeVisible();
    await expect(page.getByText("Why Most Investors Stop Their SIP")).not.toBeVisible();
  });

  test("zero critical axe violations @a11y", async ({ page }) => {
    await page.goto("/learn/blog");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    if (critical.length > 0) console.log(JSON.stringify(critical, null, 2));
    expect(critical).toEqual([]);
  });
});

test.describe("Blog post page", () => {
  test("renders correct SEO metadata", async ({ page }) => {
    await page.goto("/learn/blog/why-most-investors-stop-sip");
    await expect(page).toHaveTitle(/Why Most Investors Stop Their SIP/);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /loss aversion|SIP|timing/i);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /why-most-investors-stop-sip\.svg/);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Why Most Investors Stop Their SIP/);
  });

  test("renders the CalculatorEmbed linking to the real tool", async ({ page }) => {
    await page.goto("/learn/blog/why-most-investors-stop-sip");
    const embed = page.getByRole("link", { name: /Try the SIP Calculator/ });
    await expect(embed).toBeVisible();
    await expect(embed).toHaveAttribute("href", "/tools/sip-calculator");
  });

  test("shows sources for a post that cites one", async ({ page }) => {
    await page.goto("/learn/blog/why-most-investors-stop-sip");
    await expect(page.getByText("SEBI Investor Charter").first()).toBeVisible();
  });
});

test.describe("Calculator CTA wiring (Phase 3 -> Phase 4)", () => {
  test("SIP calculator's blog CTA resolves to the real post, not a 404", async ({ page }) => {
    await page.goto("/tools/sip-calculator");
    const cta = page.getByRole("link", { name: "Read more on the blog →" });
    await cta.click();
    await expect(page).toHaveURL(/\/learn\/blog\/why-most-investors-stop-sip/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
