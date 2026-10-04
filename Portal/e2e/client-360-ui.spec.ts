import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * E19-S02/S03 — the Client 360 screens render and are reachable.
 *
 * The API is covered in client-360.spec.ts; this checks the pages actually
 * mount with real data, because a ported page can typecheck and still blow up
 * on a field this repo shapes differently.
 */

test('E19-S02: the clients roster renders', async ({ adminPage }) => {
  await adminPage.goto('clients');
  await expect(adminPage.getByRole('heading', { name: /Clients/i }).first()).toBeVisible({ timeout: 20_000 });
  // Prove real rows rendered, not just the page chrome — the roster's own
  // subtitle plus the count chip the DataGrid renders from live data.
  await expect(adminPage.getByText(/Every client relationship/i)).toBeVisible({ timeout: 15_000 });
  await expect(adminPage.getByText(/All clients ·/i)).toBeVisible();
  await expect(adminPage.getByText(/something went wrong/i).first()).toBeHidden();
});

test('E19-S03: a client detail screen renders with its KPIs', async ({ adminPage }) => {
  const taskId = await createMatter({ organisation: `UI${Date.now()}` });
  try {
    await adminPage.goto('clients');
    // The roster renders MOBILE CARDS at the default viewport, not a table, so
    // getByRole('row') finds nothing. Click the client by name instead — that
    // works whichever layout is active.
    await expect(adminPage.getByText(/Every client relationship/i)).toBeVisible({ timeout: 20_000 });
    // The seeded test client — this used to click a REAL client of the firm by
    // name, which only worked while the suite ran against live data.
    const firstClient = adminPage.getByText('E2E Client', { exact: true }).first();
    await expect(firstClient).toBeVisible({ timeout: 15_000 });
    await firstClient.click();

    // The KPI strip is the screen's signature — if the rollup shape were wrong,
    // this is where it would fail.
    await expect(adminPage.getByText(/Active matters/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(adminPage.getByText(/Outstanding/i).first()).toBeVisible();
    await expect(adminPage.getByText(/something went wrong/i).first()).toBeHidden();
  } finally { await deleteMatter(taskId); }
});

test('E19-S02: a client cannot reach the roster page', async ({ browser }) => {
  // Route-level role guard: the nav entry is hidden, but the URL must be too.
  const ctx = await browser.newContext({ storageState: 'e2e/.auth/client.json' });
  const page = await ctx.newPage();
  await page.goto('/portal/clients').catch(() => {});
  await page.waitForTimeout(2000);
  const url = page.url();
  const body = await page.locator('body').innerText().catch(() => '');
  const blocked = !url.includes('/clients') || /not authorized|forbidden|not found/i.test(body);
  expect(blocked, 'a client is kept out of the client book').toBe(true);
  await ctx.close();
});
