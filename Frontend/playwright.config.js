// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Run in headed mode:   HEADED=1 npx playwright test
 * Run in headless mode: npx playwright test  (default)
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  workers: 1, // sequential so we don't hammer the dev server

  use: {
    baseURL: "http://localhost:5174",
    headless: process.env.HEADED !== "1",
    screenshot: "only-on-failure",
    video: "off",
    // Ignore console errors that come from Firebase / external SDKs
    ignoreHTTPSErrors: true,
  },

  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
