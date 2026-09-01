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

  // Regression test for a real bug found in Phase 8 code review:
  // InputSlider.tsx used to call onChange() with every intermediate
  // keystroke value, including out-of-domain ones — src/lib/calculators.ts
  // documents that it assumes already-clamped input, so typing a value
  // above `max` (here 50%) fed a wildly out-of-domain rate straight into
  // the live compute engine before the field was ever blurred. Fixed by
  // buffering the displayed text locally and only committing a keystroke
  // to the engine once it's within [min, max]. "9999" typed digit-by-digit
  // passes through "9" (in-domain, committed), then "99"/"999"/"9999"
  // (all > max, held back) — so the engine's last-seen value is 9%, not
  // 9999%, and this asserts the result panel reflects exactly that.
  test("typing an out-of-domain annual return never feeds the compute engine an out-of-domain value before blur", async ({
    page,
  }) => {
    await page.goto("/tools/sip-calculator");

    function fv(annualReturnPct: number): number {
      const monthly = 10000;
      const years = 10;
      const i = annualReturnPct / 100 / 12;
      let value = 0;
      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          value = (value + monthly) * (1 + i);
        }
      }
      return value;
    }

    const returnInput = page.getByRole("spinbutton", { name: "Expected annual return" });
    await returnInput.click({ clickCount: 3 });
    for (const digit of "9999") {
      await page.keyboard.type(digit);
    }
    await expect(returnInput).toHaveValue("9999");

    // The result's count-up animation (useCountUp, 600ms) is still mid-flight
    // right after the last committed keystroke — wait for it to settle on
    // its target before reading the displayed value.
    const maturityDt = page.getByText("Maturity value", { exact: true });
    const maturityDd = maturityDt.locator("xpath=following-sibling::dd[1]");
    const expected = Math.round(fv(9));
    await expect(async () => {
      const text = await maturityDd.innerText();
      const digitsOnly = Number(text.replace(/[^0-9]/g, ""));
      expect(Math.abs(digitsOnly - expected)).toBeLessThanOrEqual(1);
    }).toPass({ timeout: 2000 });
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

// README §8 Phase 8 step 5: "Calculator sliders are the highest-risk
// element on touch — test them specifically." These only run on the
// ios-safari / android-chrome playwright.config.ts projects (real touch
// viewports, hasTouch: true) — `isMobile` is false on the desktop
// chromium/webkit/firefox projects that also run this file, so the tests
// skip there rather than assert something meaningless on a mouse context.
test.describe("Touch-device slider interaction (iOS Safari / Android Chrome only)", () => {
  test("dragging the range slider on a touch viewport updates its value", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch drag is only meaningful on the touch-emulated projects");
    await page.goto("/tools/sip-calculator");
    const slider = page.locator('input[type="range"]').first();
    await slider.scrollIntoViewIfNeeded();
    const box = await slider.boundingBox();
    if (!box) throw new Error("slider has no bounding box");

    const before = await slider.inputValue();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.15, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.85, y, { steps: 10 });
    await page.mouse.up();
    const after = await slider.inputValue();

    expect(after).not.toBe(before);
  });

  test("no horizontal overflow on the calculator layout at this viewport width", async ({ page, isMobile }) => {
    test.skip(!isMobile, "checks the mobile viewport specifically");
    await page.goto("/tools/sip-calculator");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);
  });
});
