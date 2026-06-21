import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Portal E2E (document cycle, E-05).
 *
 * Auth uses real test accounts supplied via env (never hardcoded). Copy
 * e2e/.env.e2e.example → e2e/.env.e2e and fill in throwaway dev/QA accounts.
 * The dev server is auto-started against the same Firebase project the app uses.
 *
 * Run:  npx playwright test            (headless)
 *       npx playwright test --ui       (interactive)
 *       npx playwright test --headed   (watch the browser)
 */

// Load e2e/.env.e2e if present (test creds + base URL overrides).
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, 'e2e', '.env.e2e') });

// The app is served under the /portal base path (see vite.config + router).
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173/portal/';

export default defineConfig({
  testDir: './e2e',
  // Documents are mutating, cross-user flows — keep them serial & predictable.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // Retry transient flakes everywhere (not just CI): the first interactive test
  // after a cold server start can be slow, and a few specs poll the 30s
  // notification cycle — both are timing flakes that pass on a warm retry, not
  // logic failures. One retry keeps the suite deterministic without masking real
  // bugs (a genuine failure fails both attempts).
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? 'github' : [['list'], ['html', { open: 'never' }]],
  // Generous per-test timeout: provisioning-heavy specs mint a token + create/
  // assign a fresh matter (and sometimes a user) before the UI assertions, plus
  // some assertions poll the 30s notification/my-steps cycle.
  timeout: 120_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Logs in each role once and saves storageState (.auth/*.json). Generous
    // timeout — the first cold-boot login (Firestore role lookup) can be slow.
    // Always retry setup (even locally): a single slow cold-boot login otherwise
    // fails setup and cascades to skip the whole suite.
    { name: 'setup', testMatch: /auth\.setup\.ts/, timeout: 150_000, retries: 2 },
    // All feature specs run after auth is established.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
  ],

  // Start the stack the suite needs via the repo's `dev:e2e` (port cleanup +
  // backend + portal, run with concurrently --kill-others). We deliberately do NOT
  // use `dev:all` for tests — it also boots the marketing Frontend app, whose
  // startup/crashes can take down the whole process tree mid-run. We point
  // Playwright at the Portal URL for readiness and the backend `auth.setup.ts`
  // gate confirms the API is up before logins.
  webServer: {
    command: 'npm run dev:e2e',
    cwd: path.join(__dirname, '..'),
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
