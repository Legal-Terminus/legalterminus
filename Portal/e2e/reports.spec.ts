import { test, expect } from './fixtures';

/**
 * E08 — Reports hub + individual report pages render for staff and are blocked
 * for clients. Smoke-level: each report loads its grid/heading without error.
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

test('client cannot reach any report', async ({ clientPage }) => {
  for (const route of ['reports', 'reports/all-tasks', 'reports/master-sheet']) {
    await clientPage.goto(route);
    await expect(clientPage).not.toHaveURL(new RegExp(route));
  }
});
