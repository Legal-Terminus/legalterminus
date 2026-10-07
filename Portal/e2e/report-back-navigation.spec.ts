import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getMatter } from './api';

/**
 * #208 — Back from a matter returns to where it was opened from.
 *
 * The matter page's Back button was hardcoded to the matters list, so a matter
 * opened from a report (or the dashboard, a client's page, search…) came back to
 * All Matters, and the report's filters — held in component state — were gone.
 *
 * Two halves, both asserted through the UI as a real user would do it:
 *   1. Back goes to the previous in-app page;
 *   2. a report's filters live in the URL, so they are still applied on return.
 */

let taskId = '';
/** The status the fresh matter is actually in — never assumed (it differs by workflow). */
let status = '';

test.beforeAll(async () => {
  taskId = await createMatter({ organisation: `E2E BackNav ${Date.now()}` });
  status = String((await getMatter(taskId)).status);
});
test.afterAll(async () => { if (taskId) await deleteMatter(taskId); });

/** The first clickable matter row of a report's grid. */
const firstRow = (page: import('@playwright/test').Page) => page.locator('div.cursor-pointer.group').first();

test('report → matter → Back returns to the same report with its filters', async ({ adminPage: p }) => {
  await p.goto('reports/all-tasks');
  const filter = p.getByLabel('Filter by status');
  await expect(filter).toBeVisible({ timeout: 20_000 });

  // Choosing a filter writes it to the URL (and does not add a history entry).
  // Filter by the status our own matter is in, so the report cannot be empty.
  await filter.selectOption(status);
  await expect(p).toHaveURL(new RegExp(`/reports/all-tasks\\?.*status=${status}`));

  await expect(firstRow(p)).toBeVisible({ timeout: 20_000 });
  await firstRow(p).click();
  await expect(p).toHaveURL(/\/tasks\/[^/?]+/);

  await p.getByRole('button', { name: 'Back', exact: true }).click();

  await expect(p, 'back on the report, not All Matters').toHaveURL(new RegExp(`/reports/all-tasks\\?.*status=${status}`));
  await expect(p.getByLabel('Filter by status'), 'the filter is still applied').toHaveValue(status);
});

test('a filter in the URL is applied on load, and clearing it cleans the URL', async ({ adminPage: p }) => {
  await p.goto('reports/master-sheet?status=active&paymentStatus=not_paid');
  await expect(p.getByLabel('Filter by status')).toHaveValue('active', { timeout: 20_000 });
  await expect(p.getByLabel('Filter by payment')).toHaveValue('not_paid');

  await p.getByLabel('Filter by status').selectOption('');
  await expect(p).not.toHaveURL(/status=/);
  await expect(p, 'the other filter is untouched').toHaveURL(/paymentStatus=not_paid/);
});

test('changing filters does not pile up history: one Back leaves the report', async ({ adminPage: p }) => {
  await p.goto('reports');
  await p.goto('reports/all-tasks');
  const status = p.getByLabel('Filter by status');
  await expect(status).toBeVisible({ timeout: 20_000 });
  await status.selectOption('active');
  await status.selectOption('completed');
  await status.selectOption('active');
  await expect(p).toHaveURL(/status=active/);

  await p.goBack();
  await expect(p, 'three filter changes, one step back').toHaveURL(/\/reports\/?$/);
});

test('the SLA report keeps its numeric filter in the URL and omits the default', async ({ adminPage: p }) => {
  await p.goto('reports/sla?atRiskDays=5');
  await expect(p.getByText(/SLA/i).first()).toBeVisible({ timeout: 20_000 });
  await expect(p).toHaveURL(/atRiskDays=5/);
  await p.goto('reports/sla');
  await expect(p.getByText(/SLA/i).first()).toBeVisible({ timeout: 20_000 });
  await expect(p, 'the default is not written into the URL').not.toHaveURL(/atRiskDays=/);
});

test('matters list → matter → Back still returns to the matters list', async ({ adminPage: p }) => {
  await p.goto('tasks');
  await expect(p).toHaveURL(/\/tasks\/?(\?.*)?$/);
  await p.goto(`tasks/${taskId}`); // a fresh load: no in-app history behind it
  await expect(p.getByRole('button', { name: 'Back', exact: true })).toBeVisible({ timeout: 20_000 });
  await p.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(p, 'with nothing to go back to, Back falls back to the matters list').toHaveURL(/\/tasks\/?(\?.*)?$/);
});

test('it is not special to one report: master sheet → matter → Back returns to the master sheet', async ({ adminPage: p }) => {
  await p.goto('reports/master-sheet');
  await expect(firstRow(p)).toBeVisible({ timeout: 20_000 });
  await firstRow(p).click();
  await expect(p).toHaveURL(/\/tasks\/[^/?]+/);
  await p.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(p).toHaveURL(/\/reports\/master-sheet/);
});
