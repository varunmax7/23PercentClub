import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * The one e2e check that actually matters for a finance calculator: the
 * number the user sees must equal the number the tested engine produces
 * for the same inputs, and the compliance disclaimer must be on screen.
 * See README §9.1 / §10.1.
 */

test.describe("SIP calculator", () => {
  test("on-screen maturity value matches the engine's default-input output", async ({ page }) => {
    await page.goto("/tools/sip-calculator");

    // Defaults: monthly ₹10,000, 12% return, 10 years.
    // FV computed independently below and asserted against the DOM.
    const monthly = 10000;
    const annualReturnPct = 12;
    const years = 10;
    const i = annualReturnPct / 100 / 12;
    let value = 0;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        value = (value + monthly) * (1 + i);
      }
    }

    const maturityDt = page.getByText("Maturity value", { exact: true });
    await expect(maturityDt).toBeVisible();
    const maturityDd = maturityDt.locator("xpath=following-sibling::dd[1]");

    const text = await maturityDd.innerText();
    const digitsOnly = Number(text.replace(/[^0-9]/g, ""));

    // Allow ±1 rupee for the count-up animation mid-flight / rounding.
    expect(Math.abs(digitsOnly - Math.round(value))).toBeLessThanOrEqual(1);
  });

  test("compliance note is present under the result", async ({ page }) => {
    await page.goto("/tools/sip-calculator");
    await expect(
      page.getByText("Assumed return is illustrative only, not a promise or guarantee."),
    ).toBeVisible();
  });

  test("zero critical axe violations @a11y", async ({ page }) => {
    await page.goto("/tools/sip-calculator");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (critical.length > 0) console.log(JSON.stringify(critical, null, 2));
    expect(critical).toEqual([]);
  });
});

test.describe("Step-up SIP calculator", () => {
  test("comparison callout shows a positive advantage with default inputs", async ({ page }) => {
    await page.goto("/tools/step-up-sip-calculator");
    await expect(page.getByText("The step-up is worth")).toBeVisible();

    const advantageText = await page
      .getByText("The step-up is worth")
      .locator("xpath=following-sibling::p[1]")
      .innerText();
    const advantage = Number(advantageText.replace(/[^0-9]/g, ""));
    expect(advantage).toBeGreaterThan(0);
  });

  test("compliance note is present under the result", async ({ page }) => {
    await page.goto("/tools/step-up-sip-calculator");
    await expect(
      page.getByText("Assumed return is illustrative only, not a promise or guarantee."),
    ).toBeVisible();
  });
});

test.describe("Lumpsum calculator", () => {
  test("compliance note is present under the result", async ({ page }) => {
    await page.goto("/tools/lumpsum-calculator");
    await expect(
      page.getByText("Assumed return is illustrative only, not a promise or guarantee."),
    ).toBeVisible();
  });
});

test.describe("Inflation calculator", () => {
  test("compliance note is present under the result", async ({ page }) => {
    await page.goto("/tools/inflation-calculator");
    await expect(
      page.getByText("Assumed return is illustrative only, not a promise or guarantee."),
    ).toBeVisible();
  });
});

test.describe("Tools index", () => {
  test("links to all four calculators", async ({ page }) => {
    await page.goto("/tools");
    await expect(page.getByRole("link", { name: /^SIP Calculator/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Step-up SIP Calculator/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Lumpsum Calculator/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Inflation Calculator/ })).toBeVisible();
  });
});
