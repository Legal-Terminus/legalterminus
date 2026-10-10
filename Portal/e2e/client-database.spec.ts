import { expect } from '@playwright/test';
import { test } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';
import { env } from './helpers';

/**
 * LT #205 — the client contact record ("client database"), and
 * LT #206 — the client / group work-and-fee report.
 *
 * #205 is deliberately NOT a second screen: the contact record lives on the
 * Clients page and the client form, and Reports only links to it. #206 is a
 * real report and is admin-only — the negative assertions (manager, team
 * member, client all refused) are the ones that matter.
 *
 * The seeded client is given a throwaway group for the run and restored after;
 * nothing else reads its group.
 */

const CLIENT = () => env('E2E_CLIENT_UID');
const GROUP = `E2E Group ${Date.now()}`;
const ALT = '9123456780';

async function patchClient(data: Record<string, unknown>) {
  const admin = await apiAs('admin');
  try {
    const res = await admin.patch(`/api/portal/users/${CLIENT()}`, { data });
    return res.status();
  } finally { await admin.dispose(); }
}

test.describe.serial('LT #205 / #206 — client database and group fee report', () => {
  let taskId = '';

  test.beforeAll(async () => {
    expect(await patchClient({ groupCompany: GROUP, altPhone: ALT, contactDesignation: 'Director' })).toBe(200);
    taskId = await createMatter();
  });

  test.afterAll(async () => {
    await patchClient({ groupCompany: '', altPhone: '', contactDesignation: '' });
    if (taskId) await deleteMatter(taskId);
  });

  test('#205: the new contact fields are stored, validated and returned', async () => {
    const admin = await apiAs('admin');
    try {
      const detail = await (await admin.get(`/api/clients/${CLIENT()}`)).json();
      expect(detail.client.altPhone).toBe(ALT);
      expect(detail.client.contactDesignation).toBe('Director');
      expect(detail.client.groupCompany).toBe(GROUP);

      // Designation is a fixed list; the alternative number must be a number.
      expect(await patchClient({ contactDesignation: 'Chief Wizard' })).toBe(400);
      expect(await patchClient({ altPhone: 'call me maybe' })).toBe(400);

      // The group is offered back to the form, in one spelling.
      const groups = (await (await admin.get('/api/clients/groups')).json()).data as string[];
      expect(groups).toContain(GROUP);

      // The download carries every requested column for this client.
      const contacts = (await (await admin.get('/api/clients/contacts')).json()).data as Array<Record<string, unknown>>;
      const row = contacts.find((c) => c.uid === CLIENT());
      expect(row).toMatchObject({ altPhone: ALT, contactDesignation: 'Director', groupCompany: GROUP });
      for (const key of ['clientName', 'contactPerson', 'phone', 'email', 'altEmails', 'address', 'reference', 'professional']) {
        expect(row, `contact row carries ${key}`).toHaveProperty(key);
      }
    } finally { await admin.dispose(); }
  });

  test('#205: contact endpoints are admin/manager only', async () => {
    for (const role of ['team', 'client', 'pro'] as const) {
      const api = await apiAs(role);
      expect((await api.get('/api/clients/contacts')).status(), `${role} contacts`).toBe(403);
      expect((await api.get('/api/clients/groups')).status(), `${role} groups`).toBe(403);
      await api.dispose();
    }
    const manager = await apiAs('manager');
    expect((await manager.get('/api/clients/contacts')).status()).toBe(200);
    await manager.dispose();
  });

  test('#205: the client page shows the contact record; the form offers the fixed designations', async ({ adminPage: page }) => {
    await page.goto(`clients/${CLIENT()}`);
    const card = page.getByRole('region', { name: 'Contact details' });
    await expect(card).toBeVisible();
    await expect(card.getByText('Director')).toBeVisible();
    await expect(card.getByText(ALT)).toBeVisible();
    await expect(card.getByText(GROUP)).toBeVisible();

    await page.getByRole('button', { name: /Edit profile/ }).click();
    const designation = page.getByLabel('Contact person’s designation');
    await expect(designation).toHaveValue('Director');
    await expect(designation.locator('option')).toHaveText(['Not set', 'Owner', 'Director', 'Accountant', 'Manager']);
    await expect(page.getByLabel('Alternative contact number')).toHaveValue(ALT);
    await expect(page.getByLabel('Group / Parent Company')).toHaveValue(GROUP);
    await expect(page.getByLabel('Professional')).toBeVisible();
  });

  test('#205: Reports links to the client database, which downloads as Excel', async ({ adminPage: page }) => {
    await page.goto('reports');
    await page.getByRole('link', { name: /Client Database/ }).click();
    await expect(page).toHaveURL(/\/clients$/);
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download contacts as Excel' }).click();
    expect((await download).suggestedFilename()).toMatch(/^client-database-.*\.xlsx$/);
  });

  test('#206: works and fees total by group, client, service and financial year', async () => {
    const admin = await apiAs('admin');
    try {
      const all = await (await admin.get('/api/reports/client-group-fees')).json();
      expect(all.financialYears[0]).toBe(all.financialYear);
      expect(all.groups).toContain(GROUP);

      const g = await (await admin.get(`/api/reports/client-group-fees?group=${encodeURIComponent(GROUP)}`)).json();
      const row = g.rows.find((r: { taskId: string }) => r.taskId === taskId);
      expect(row, 'the new matter is listed under its client’s group').toBeTruthy();
      expect(row).toMatchObject({ group: GROUP, charged: 10000, received: 10000, balance: 0, financialYear: all.financialYear });
      expect(g.rows.every((r: { group: string }) => r.group === GROUP)).toBe(true);
      expect(g.totals.works).toBe(g.rows.length);
      expect(g.totals.charged).toBe(g.rows.reduce((a: number, r: { charged: number }) => a + r.charged, 0));

      // Individual clients are a separate selection and exclude grouped ones.
      const ind = await (await admin.get('/api/reports/client-group-fees?group=individual')).json();
      expect(ind.rows.some((r: { taskId: string }) => r.taskId === taskId)).toBe(false);

      // Client and service filters narrow to this matter's client and service.
      const byClient = await (await admin.get(`/api/reports/client-group-fees?clientUid=${CLIENT()}&serviceKey=${encodeURIComponent(row.serviceKey)}`)).json();
      expect(byClient.rows.some((r: { taskId: string }) => r.taskId === taskId)).toBe(true);
      expect(byClient.rows.every((r: { clientUid: string }) => r.clientUid === CLIENT())).toBe(true);

      // A different financial year does not contain a matter created today.
      const lastYear = await (await admin.get(`/api/reports/client-group-fees?fy=${all.financialYears[1]}`)).json();
      expect(lastYear.rows.some((r: { taskId: string }) => r.taskId === taskId)).toBe(false);

      expect((await admin.get('/api/reports/client-group-fees?fy=nonsense')).status()).toBe(400);
    } finally { await admin.dispose(); }
  });

  test('#206: only an admin can read the report — a manager is refused', async () => {
    for (const role of ['manager', 'team', 'client', 'pro'] as const) {
      const api = await apiAs(role);
      expect((await api.get('/api/reports/client-group-fees')).status(), `${role}`).toBe(403);
      await api.dispose();
    }
  });

  test('#206: admin opens the report from Reports and filters by group', async ({ adminPage: page }) => {
    await page.goto('reports');
    await page.getByRole('link', { name: /Client \/ Group Work & Fee/ }).click();
    await expect(page.getByRole('heading', { name: 'Client / Group Work & Fee' })).toBeVisible();
    await expect(page.getByText('Total works')).toBeVisible();

    await page.getByLabel('Group').selectOption(GROUP);
    await expect(page.locator(`a[href$="/tasks/${taskId}"]:visible`)).toBeVisible();
    await expect(page.getByText('Fees charged')).toBeVisible();

    await page.getByLabel('Group').selectOption('individual');
    await expect(page.locator(`a[href$="/tasks/${taskId}"]`)).toHaveCount(0);
  });

  // #208 — the report the firm named: open a matter from it, press Back, and
  // land on the same report with the group still chosen (not on All Matters).
  test('#208: fee report → matter → Back returns to the report with its filter', async ({ adminPage: page }) => {
    await page.goto('reports/client-group-fees');
    await page.getByLabel('Group').selectOption(GROUP);
    await page.locator(`a[href$="/tasks/${taskId}"]:visible`).click();
    await expect(page).toHaveURL(new RegExp(`/tasks/${taskId}`));
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page).toHaveURL(/\/reports\/client-group-fees\?.*group=/);
    await expect(page.getByLabel('Group')).toHaveValue(GROUP);
    await expect(page.locator(`a[href$="/tasks/${taskId}"]:visible`)).toBeVisible();
  });

  test('#206: a manager neither sees the report on Reports nor can open it', async ({ managerPage: page }) => {
    await page.goto('reports');
    await expect(page.getByRole('link', { name: /Client Database/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Client \/ Group Work & Fee/ })).toHaveCount(0);
    await page.goto('reports/client-group-fees');
    await expect(page).toHaveURL(/\/unauthorized/);
  });
});
