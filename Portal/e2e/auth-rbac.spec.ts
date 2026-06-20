import { test, expect } from './fixtures';

/**
 * E01 — Auth + role-based routing/RBAC. Each role logs in and lands in the app;
 * role-restricted routes are reachable for allowed roles and blocked for others.
 * Routes are role-neutral (no /admin/* etc.) — access is the `roles` array.
 */

test('admin sees Users, Reports, Services nav', async ({ adminPage }) => {
  await adminPage.goto('dashboard');
  // Sidebar nav labels (desktop). Admin has the widest set.
  for (const label of ['Dashboard', 'Matters', 'Users', 'Reports', 'Services']) {
    await expect(adminPage.getByRole('link', { name: label }).first()).toBeVisible();
  }
});

test('manager can reach Users + Reports', async ({ managerPage }) => {
  await managerPage.goto('users');
  await expect(managerPage.getByRole('heading', { name: 'Users' })).toBeVisible();
  await managerPage.goto('reports');
  await expect(managerPage.getByRole('heading', { name: 'Reports' })).toBeVisible();
});

test('team member is blocked from Users + Reports', async ({ teamPage }) => {
  await teamPage.goto('users');
  await expect(teamPage).not.toHaveURL(/\/users(\?|$)/);
  await teamPage.goto('reports');
  await expect(teamPage).not.toHaveURL(/\/reports(\?|$)/);
});

test('client is blocked from staff areas (Users, Reports, Services, My Tasks)', async ({ clientPage }) => {
  for (const route of ['users', 'reports', 'services', 'my-tasks']) {
    await clientPage.goto(route);
    await expect(clientPage, `client must not reach /${route}`).not.toHaveURL(new RegExp(`/${route}(\\?|$)`));
  }
});

test('client sees their own areas (Matters as "My Services", Dashboard)', async ({ clientPage }) => {
  await clientPage.goto('tasks');
  await expect(clientPage.getByRole('heading', { name: 'My Services' })).toBeVisible();
});
