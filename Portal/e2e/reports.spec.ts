import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getMatter } from './api';

/**
 * E08 — Reports. Beyond "page loads": with a known fresh matter for the seeded
 * client (E2E Client), the All Tasks report shows that row, search filters it,
 * and clients are blocked from every report.
 */

test('admin reaches the Reports hub and each report page', async ({ adminPage }) => {
  await adminPage.goto('reports');
  await expect(adminPage.getByRole('heading', { name: 'Reports' })).toBeVisible();
  const pages: [string, string][] = [
    ['reports/all-tasks', 'All Matters'],
    ['reports/pending', 'Pending Matters'],
    ['reports/unassigned', 'Unassigned Tasks'],
    ['reports/master-sheet', 'Master Sheet'],
    ['reports/leads', 'Contact Leads'],
  ];
  for (const [route, heading] of pages) {
    await adminPage.goto(route);
    await expect(adminPage.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('All Tasks report shows a real matter row and search filters it', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto('reports/all-tasks');
    await expect(adminPage.getByRole('heading', { name: 'All Matters' })).toBeVisible();

    // The seeded client's matter appears in the grid.
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();

    // Searching a non-matching term filters the row out.
    const search = adminPage.getByPlaceholder(/search by client/i);
    await search.fill('zzz-no-such-client-xyz');
    await expect(adminPage.getByText('E2E Client')).toHaveCount(0);
    // Clearing brings it back.
    await search.fill('E2E Client');
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('#91: All Tasks supports multiple filter criteria combined with AND', async ({ adminPage }) => {
  const taskId = await createMatter();
  // Filter by the matter's ACTUAL status (a fresh paid matter is `pending`, not
  // necessarily `active`) so the assertions test the filter, not a wrong assumption.
  const realStatus = (await getMatter(taskId)).status as string;
  const otherStatus = realStatus === 'completed' ? 'active' : 'completed';
  try {
    await adminPage.goto('reports/all-tasks');
    await expect(adminPage.getByRole('heading', { name: 'All Matters' })).toBeVisible();
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();

    const statusFilter = adminPage.getByLabel('Filter by status');
    const serviceFilter = adminPage.getByLabel('Filter by service');

    // A NON-matching status hides the matter.
    await statusFilter.selectOption(otherStatus);
    await expect(adminPage.getByText('E2E Client')).toHaveCount(0);

    // The MATCHING status brings it back…
    await statusFilter.selectOption(realStatus);
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();

    // …AND a second criterion that does NOT match removes it again (AND semantics).
    // Pick some service option other than the matter's; if only one exists, skip.
    const serviceValues = await serviceFilter.locator('option').evaluateAll(
      (opts) => (opts as HTMLOptionElement[]).map((o) => o.value).filter(Boolean),
    );
    test.skip(serviceValues.length < 2, 'Need ≥2 services to prove AND across two criteria.');
    const otherService = serviceValues.find((v) => !/incorpor/i.test(v))!;
    await serviceFilter.selectOption(otherService);
    await expect(adminPage.getByText('E2E Client')).toHaveCount(0);

    // Clear resets every criterion → the row is back.
    await adminPage.getByRole('button', { name: 'Clear' }).click();
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('#91: the free-text search composes on top of the structured filters', async ({ adminPage }) => {
  const taskId = await createMatter();
  const realStatus = (await getMatter(taskId)).status as string;
  try {
    await adminPage.goto('reports/all-tasks');
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();

    // Structured: status = the matter's real status (matches). Then a non-matching
    // client in the search box → gone (search composes on top of the filter).
    await adminPage.getByLabel('Filter by status').selectOption(realStatus);
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();
    await adminPage.getByPlaceholder(/search by client/i).fill('zzz-no-such-client');
    await expect(adminPage.getByText('E2E Client')).toHaveCount(0);
  } finally { await deleteMatter(taskId); }
});

test('Master Sheet report renders rows for the client', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto('reports/master-sheet');
    await expect(adminPage.getByRole('heading', { name: 'Master Sheet' })).toBeVisible();
    await expect(adminPage.getByText('E2E Client').first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('client cannot reach any report', async ({ clientPage }) => {
  for (const route of ['reports', 'reports/all-tasks', 'reports/master-sheet']) {
    await clientPage.goto(route);
    // ProtectedRoute redirects unauthorized roles away — allow a tick for it to
    // settle, then assert we did NOT stay on the report route.
    await expect(async () => {
      expect(new RegExp(`/${route}(\\?|$)`).test(new URL(clientPage.url()).pathname)).toBe(false);
    }).toPass({ timeout: 15_000 });
  }
});
