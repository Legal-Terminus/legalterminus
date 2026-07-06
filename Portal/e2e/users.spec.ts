import { test, expect } from './fixtures';
import { deleteUserByEmail } from './api';

/**
 * E09 — User management: grid + role tabs, the self-role-change guard (E09-S03),
 * and END-TO-END create of a team member (E09-S01) and a client (E09-S02). Created
 * users are deleted afterward.
 */

test('admin sees the Users grid with role filter tabs', async ({ adminPage }) => {
  await adminPage.goto('users');
  await expect(adminPage.getByRole('heading', { name: 'Users' })).toBeVisible();
  for (const tab of ['All', 'Admins', 'Managers', 'Team Members', 'Clients']) {
    await expect(adminPage.getByRole('button', { name: new RegExp(`^${tab}`) }).first()).toBeVisible();
  }
});

test('E09-S06: clicking a user row opens a read-only detail view with an Edit action', async ({ adminPage }) => {
  await adminPage.goto('users');
  await expect(adminPage.getByRole('heading', { name: 'Users' })).toBeVisible();
  // Click the first DATA row — a clickable row contains an "Edit" action (sortable
  // column HEADERS are also .cursor-pointer, so don't just take the first one).
  // Click the row's leading avatar/name area (position: left) so we don't land on
  // the trailing Edit/Delete buttons (which navigate instead of opening the drawer).
  const firstRow = adminPage.locator('.cursor-pointer', { has: adminPage.getByRole('button', { name: /^edit$/i }) }).first();
  await firstRow.click({ position: { x: 20, y: 20 } });
  const dialog = adminPage.getByRole('dialog', { name: /user details/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('User details')).toBeVisible();
  // The detail view exposes an Edit button; clicking it navigates to the edit form.
  await dialog.getByRole('button', { name: /^edit$/i }).click();
  await expect(adminPage).toHaveURL(/\/users\/edit\//);
});

test('E09-S03: editing your OWN account locks the role selector', async ({ adminPage }) => {
  const adminUid = process.env.E2E_ADMIN_UID!;
  await adminPage.goto(`users/edit/member/${adminUid}`);
  await expect(adminPage.getByText(/can't change your own role/i)).toBeVisible();
});

test('E09-S01: admin creates a team member end-to-end', async ({ adminPage }) => {
  const email = `e2e-newmember-${Date.now()}@legalterminus.test`;
  try {
    await adminPage.goto('users');
    await adminPage.getByRole('button', { name: 'Add Member' }).click();
    await expect(adminPage).toHaveURL(/users\/new\/member/);

    await adminPage.locator('input[name="name"]').fill('E2E New Member');
    await adminPage.locator('input[name="email"]').fill(email);
    await adminPage.locator('input[name="phone"]').fill('9876500001');
    await adminPage.locator('input[name="designation"]').fill('QA Tester');
    await adminPage.getByRole('button', { name: /create member/i }).click();

    // Back to the users list; the new member is findable via search.
    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });
    await adminPage.getByPlaceholder(/search users/i).fill('E2E New Member');
    await expect(adminPage.getByText('E2E New Member').first()).toBeVisible();
  } finally {
    await deleteUserByEmail(email);
  }
});

test('E09-S02: admin creates a client end-to-end', async ({ adminPage }) => {
  const email = `e2e-newclient-${Date.now()}@legalterminus.test`;
  try {
    await adminPage.goto('users');
    await adminPage.getByRole('button', { name: 'Add Client' }).click();
    await expect(adminPage).toHaveURL(/users\/new\/client/);

    await adminPage.locator('input[name="name"]').fill('E2E New Client');
    await adminPage.locator('input[name="email"]').fill(email);
    await adminPage.locator('input[name="phone"]').fill('9876500002');
    await adminPage.locator('input[name="address"]').fill('123 E2E Street, Test City'); // required for clients
    await adminPage.getByRole('button', { name: /create client/i }).click();

    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });
    await adminPage.getByPlaceholder(/search users/i).fill('E2E New Client');
    await expect(adminPage.getByText('E2E New Client').first()).toBeVisible();
  } finally {
    await deleteUserByEmail(email);
  }
});
