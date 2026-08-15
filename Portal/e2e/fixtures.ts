import { test as base, type Page, type Browser } from '@playwright/test';
import { statePath } from './paths';
import type { RoleKey } from './helpers';

/**
 * Per-role page fixtures backed by saved storageState (see auth.setup.ts). Each
 * fixture opens a context pre-authenticated as that role — NO per-test login, so
 * the suite is fast and never hits Firebase auth throttling. Separate contexts
 * keep role sessions isolated within a test.
 */
type RoleFixtures = {
  adminPage: Page;
  managerPage: Page;
  teamPage: Page;
  clientPage: Page;
  /** #168: external professional — view-only, allowlisted matters only. */
  proPage: Page;
};

async function rolePage(browser: Browser, role: RoleKey) {
  const context = await browser.newContext({ storageState: statePath(role) });
  return { context, page: await context.newPage() };
}

export const test = base.extend<RoleFixtures>({
  adminPage: async ({ browser }, use) => {
    const { context, page } = await rolePage(browser, 'admin');
    await use(page); await context.close();
  },
  managerPage: async ({ browser }, use) => {
    const { context, page } = await rolePage(browser, 'manager');
    await use(page); await context.close();
  },
  teamPage: async ({ browser }, use) => {
    const { context, page } = await rolePage(browser, 'team');
    await use(page); await context.close();
  },
  proPage: async ({ browser }, use) => {
    const { context, page } = await rolePage(browser, 'pro');
    await use(page);
    await context.close();
  },

  clientPage: async ({ browser }, use) => {
    const { context, page } = await rolePage(browser, 'client');
    await use(page); await context.close();
  },
});

export { expect } from '@playwright/test';
