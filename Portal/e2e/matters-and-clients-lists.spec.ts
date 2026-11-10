import { test, expect } from './fixtures';
import {
  apiAs, createMatter, deleteMatter, assignMatter, advanceUntil, getMatter,
  createThrowawayClient, deleteUser, deleteDefinition, resolveServiceKey,
} from './api';
import { env } from './helpers';
import type { Page } from '@playwright/test';

/**
 * #275 — completed matters disappeared from the Matters list.
 *   The page loaded only the FIRST page of /api/tasks (the 25 most recently
 *   updated matters) and filtered that in the browser. A completed matter fell
 *   off as soon as 25 other matters were touched after it, and "Status:
 *   Completed" found only the few still inside that page.
 *
 * #277 — the Clients list, and a client's name on their matters.
 *   The Clients page loaded one page of the roster and cached it without being
 *   told about a new client; a rename never reached the matters, which carry a
 *   copy of the name.
 *
 * Every spec provisions its own data and deletes it.
 */

/** Search the grid and expect a row carrying `text`. */
async function expectRowWith(page: Page, text: string) {
  await page.getByPlaceholder(/^Search by/).fill(text);
  await expect(page.getByText(text).first()).toBeVisible();
}

test.describe('#275: a completed matter stays on the Matters list', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now();
  const org = `E2E 275 Completed ${stamp}`;
  const newer: string[] = [];
  let completedId = '';
  let defId = '';

  test.beforeAll(async () => {
    test.setTimeout(300_000);
    // A short, dedicated workflow so the matter can be finished quickly.
    const api = await apiAs('admin');
    defId = `e2e-275-${stamp}`;
    const serviceKey = `e2e-svc-275-${stamp}`;
    try {
      const dres = await api.post('/api/workflow-definitions', {
        data: {
          id: defId, name: `E2E 275 ${stamp}`, initialStep: 1, serviceKeys: [serviceKey],
          steps: [
            { stepNumber: 1, title: 'Only step', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
            { stepNumber: 2, title: 'Done', type: 'final' },
          ],
        },
      });
      expect(dres.ok(), await dres.text()).toBeTruthy();
    } finally { await api.dispose(); }

    completedId = await createMatter({ serviceKey, organisation: org });
    // The team member is on it, so their view is checked too.
    await assignMatter(completedId, env('E2E_TEAM_UID'));
    await advanceUntil(completedId);
    expect((await getMatter(completedId)).status).toBe('completed');

    // 25 matters touched AFTER it push it off the first page of the API — the
    // exact state in which it used to vanish.
    for (let i = 0; i < 25; i += 1) newer.push(await createMatter({ organisation: `E2E 275 filler ${stamp}` }));
  });

  test.afterAll(async () => {
    for (const id of [completedId, ...newer]) await deleteMatter(id);
    if (defId) await deleteDefinition(defId);
  });

  test('the API really pages it beyond the first 25', async () => {
    const api = await apiAs('admin');
    try {
      const first = await (await api.get('/api/tasks?limit=25')).json();
      expect(first.nextCursor).toBeTruthy();
      expect((first.data as Array<{ id: string }>).some((t) => t.id === completedId)).toBe(false);
    } finally { await api.dispose(); }
  });

  test('admin: All statuses AND the Completed filter both show it', async ({ adminPage }) => {
    await adminPage.goto('tasks');
    await expectRowWith(adminPage, org);

    await adminPage.goto('tasks');
    await adminPage.getByLabel('Filter by status').selectOption('completed');
    await expectRowWith(adminPage, org);
  });

  test('the dashboard link ?status=completed opens the list already filtered', async ({ adminPage }) => {
    await adminPage.goto('tasks?status=completed');
    await expect(adminPage.getByLabel('Filter by status')).toHaveValue('completed');
    await expectRowWith(adminPage, org);
    // A filler (active) matter is NOT listed under Completed.
    await adminPage.getByPlaceholder(/^Search by/).fill(`E2E 275 filler ${stamp}`);
    await expect(adminPage.getByText(`E2E 275 filler ${stamp}`)).toHaveCount(0);
  });

  test('manager sees it under Completed', async ({ managerPage }) => {
    await managerPage.goto('tasks?status=completed');
    await expectRowWith(managerPage, org);
  });

  test('team member it was assigned to sees it under Completed', async ({ teamPage }) => {
    await teamPage.goto('tasks?status=completed');
    await expectRowWith(teamPage, org);
  });
});

test.describe('#277: Clients list and client names on matters', () => {
  let client: Awaited<ReturnType<typeof createThrowawayClient>> | null = null;
  let taskId = '';

  test.afterEach(async () => {
    if (taskId) await deleteMatter(taskId);
    if (client) await deleteUser(client.uid);
    taskId = '';
    client = null;
  });

  test('a client added while the Clients list is cached appears on it straight away', async ({ adminPage }) => {
    const stamp = Date.now();
    const name = `E2E 277 New Client ${stamp}`;
    const email = `e2e-277-${stamp}@legalterminus.test`;

    // Load the roster first, so it is cached in the page.
    await adminPage.goto('clients');
    await expect(adminPage.getByPlaceholder(/^Search by name/)).toBeVisible();

    // Add the client through the form, within the page's cache window. Every
    // move is IN-APP navigation: a page.goto would reload and drop the cache.
    await adminPage.getByRole('link', { name: 'Users', exact: true }).first().click();
    await adminPage.getByRole('button', { name: 'Add Client' }).click();
    await expect(adminPage).toHaveURL(/users\/new\/client/);
    await adminPage.locator('input[name="name"]').fill(name);
    await adminPage.locator('input[name="email"]').fill(email);
    await adminPage.locator('input[name="phone"]').fill('9876500277');
    await adminPage.locator('input[name="address"]').fill('277 E2E Street, Test City');
    await adminPage.locator('input[name="professionalName"]').fill('E2E Referrer');
    await adminPage.getByRole('button', { name: /create client/i }).click();
    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });

    const api = await apiAs('admin');
    try {
      const list = await (await api.get('/api/clients?limit=500')).json();
      const row = (list.data as Array<{ uid: string; name: string }>).find((c) => c.name === name);
      expect(row, 'the roster API lists the new client').toBeTruthy();
      client = { uid: row!.uid, name, email, phone: '', organisation: '' };
    } finally { await api.dispose(); }

    // In-app navigation (no reload): the cached roster must have been refreshed.
    await adminPage.getByRole('link', { name: 'Clients', exact: true }).first().click();
    await expect(adminPage).toHaveURL(/\/clients$/);
    await expectRowWith(adminPage, name);
  });

  test('renaming a client renames their existing matters', async ({ adminPage }) => {
    client = await createThrowawayClient();
    const api = await apiAs('admin');
    const renamed = `E2E 277 Renamed ${Date.now()}`;
    try {
      const res = await api.post('/api/tasks', {
        data: {
          clientUid: client.uid, serviceKey: await resolveServiceKey(), organisation: client.organisation,
          paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
        },
      });
      expect(res.ok(), await res.text()).toBeTruthy();
      taskId = (await res.json()).id;
      expect((await getMatter(taskId)).clientName).toBe(client.name);
    } finally { await api.dispose(); }

    // Look at the matter first so the old name is in the page's cache.
    await adminPage.goto('tasks');
    await expectRowWith(adminPage, client.organisation);
    await expect(adminPage.getByText(client.name).first()).toBeVisible();

    // Rename through the client form, reached in-app so the cached list stays.
    await adminPage.getByRole('link', { name: 'Users', exact: true }).first().click();
    await adminPage.getByPlaceholder(/search users/i).fill(client.email);
    await adminPage.getByRole('button', { name: 'Edit', exact: true }).first().click();
    await expect(adminPage).toHaveURL(new RegExp(`users/edit/client/${client.uid}`));
    await adminPage.locator('input[name="name"]').fill(renamed);
    await adminPage.getByRole('button', { name: 'Update Client' }).click();
    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });

    // Stored on the matter, not only displayed: emails, reports and exports
    // read the same field.
    expect((await getMatter(taskId)).clientName).toBe(renamed);

    // The Matters list (in-app navigation, no reload) and the matter itself.
    await adminPage.getByRole('link', { name: 'Matters', exact: true }).first().click();
    await expectRowWith(adminPage, client.organisation);
    await expect(adminPage.getByText(renamed).first()).toBeVisible();
    await expect(adminPage.getByText(client.name, { exact: true })).toHaveCount(0);
    await adminPage.goto(`tasks/${taskId}`);
    await expect(adminPage.getByText(renamed).first()).toBeVisible();
  });
});
