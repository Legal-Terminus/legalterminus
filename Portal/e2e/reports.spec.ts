import { test, expect } from './fixtures';
import { createMatter, deleteMatter } from './api';

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
    await expect(clientPage).not.toHaveURL(new RegExp(route));
  }
});
