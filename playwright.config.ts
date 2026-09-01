import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Chromium runs the full suite (fast default CI signal). Desktop WebKit
  // and Firefox are scoped to just the calculator flow — README §8 Phase 8
  // step 5 calls out "calculator sliders are the highest-risk element
  // on touch, test them specifically," not a full 3x sitewide run.
  // "iOS Safari, Android Chrome" (§8 step 5, literally) means real touch
  // device emulation, not desktop Safari/Firefox with a mouse — those two
  // projects below cover mouse/keyboard cross-engine only. iPhone 14 and
  // Pixel 7 add actual touch input (hasTouch, mobile viewport, no hover)
  // and are scoped to calculators.spec.ts, the highest-risk surface.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: ["calculators.spec.ts", "a11y-sweep.spec.ts"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: ["calculators.spec.ts", "a11y-sweep.spec.ts"],
    },
    {
      name: "ios-safari",
      use: { ...devices["iPhone 14"] },
      testMatch: ["calculators.spec.ts"],
    },
    {
      name: "android-chrome",
      use: { ...devices["Pixel 7"] },
      testMatch: ["calculators.spec.ts"],
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
