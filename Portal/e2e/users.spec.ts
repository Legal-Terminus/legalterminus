import { test, expect } from './fixtures';

/**
 * E09 — User management. Listing, role tabs, the self-role-change guard (E09-S03),
 * and that the create form is reachable. (Bulk reassign E09-S04 is covered via the
 * delete-blocked flow in reassign.spec.ts.)
 */

test('admin sees the Users grid with role filter tabs', async ({ adminPage }) => {
  await adminPage.goto('users');
  await expect(adminPage.getByRole('heading', { name: 'Users' })).toBeVisible();
  for (const tab of ['All', 'Admins', 'Managers', 'Team Members', 'Clients']) {
    await expect(adminPage.getByRole('button', { name: new RegExp(`^${tab}`) }).first()).toBeVisible();
  }
});

test('Add Member + Add Client open the user form', async ({ adminPage }) => {
  await adminPage.goto('users');
  await adminPage.getByRole('button', { name: 'Add Member' }).click();
  await expect(adminPage).toHaveURL(/users\/new\/member/);

  await adminPage.goto('users');
  await adminPage.getByRole('button', { name: 'Add Client' }).click();
  await expect(adminPage).toHaveURL(/users\/new\/client/);
});

test('E09-S03: editing your OWN account locks the role selector', async ({ adminPage }) => {
  // Go straight to the edit form for the logged-in admin's own uid (member type),
  // avoiding a brittle search+row-click. Self-edit must lock the role selector.
  const adminUid = process.env.E2E_ADMIN_UID!;
  await adminPage.goto(`users/edit/member/${adminUid}`);
  await expect(adminPage.getByText(/can't change your own role/i)).toBeVisible();
});
