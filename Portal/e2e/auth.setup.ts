import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import { login, type RoleKey } from './helpers';
import { AUTH_DIR, statePath } from './paths';

/**
 * Auth setup — runs ONCE before the suite (a Playwright "setup" project). Logs in
 * each role through the real Firebase form and saves its session to
 * .auth/<role>.json. Every test then reuses that storageState instead of logging
 * in itself — far fewer logins (no Firebase throttling) and much faster.
 */
fs.mkdirSync(AUTH_DIR, { recursive: true });

// Run the role logins serially — parallel logins race each other and the backend.
// Retry each setup step: the FIRST cold-boot login (Firebase + backend role lookup
// on a freshly-started server) is occasionally slow enough to exceed the redirect
// wait; a retry against the now-warm server reliably succeeds. Without this, one
// slow login fails setup and cascades to skip the entire suite.
setup.describe.configure({ mode: 'serial', retries: 2 });

// The Playwright webServer only waits on the PORTAL url; the backend (which the
// login redirect needs for role resolution) may still be starting. Gate on it.
setup('backend is ready', async ({ request }) => {
  await expect(async () => {
    const res = await request.get('http://localhost:5001/health');
    expect(res.ok()).toBeTruthy();
  }).toPass({ timeout: 90_000, intervals: [1000] });
});

const roles: RoleKey[] = ['admin', 'manager', 'team', 'client'];

for (const role of roles) {
  setup(`authenticate ${role}`, async ({ page }) => {
    await login(page, role);
    // Firebase persists auth in IndexedDB — capture it too (Playwright ≥1.51),
    // or the restored context would be logged out (cookies/localStorage alone
    // don't hold the Firebase session).
    await page.context().storageState({ path: statePath(role), indexedDB: true });
  });
}
