import { expect } from '@playwright/test';
import { test } from './fixtures';
import { apiAs, createThrowawayClient, deleteUser } from './api';

/**
 * LT #205 — the Client Database, as the firm specified it on 6 Oct: a screen
 * of its own (Reports → Client Database), nine fields per client, starting
 * from the client's creation data, edited in place on that screen. Saving
 * never changes the client's profile or login email, and never creates a
 * second record. Admin and manager only.
 *
 * The spec provisions its own client and deletes it afterwards.
 */

type Client = Awaited<ReturnType<typeof createThrowawayClient>>;
const stamp = Date.now();
const NEW_EMAIL = `e2e-db-${stamp}@legalterminus.test`;
const NEW_ALT = '9123456789';
const NEW_PERSON = `Changed Person ${stamp.toString().slice(-4)}`;

test.describe.serial('LT #205 — Client Database', () => {
  let client: Client;

  test.beforeAll(async () => { client = await createThrowawayClient(); });
  test.afterAll(async () => { if (client?.uid) await deleteUser(client.uid); });

  test('a new client has a record, filled from its creation data', async () => {
    const admin = await apiAs('admin');
    try {
      const res = await admin.get(`/api/client-database/${client.uid}`);
      expect(res.status()).toBe(200);
      const { data } = await res.json();
      expect(data).toMatchObject({
        uid: client.uid,
        clientName: client.organisation,
        contactPerson: client.name,
        contactDesignation: 'Owner',
        phone: client.phone,
        altPhone: '',
        email: client.email,
        address: '1 Test Street',
      });
      expect(data.clientSince).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // The list is paginated and searchable, and holds the client once.
      const list = await (await admin.get(`/api/client-database?search=${encodeURIComponent(client.organisation)}&limit=10`)).json();
      expect(list.data.filter((r: { uid: string }) => r.uid === client.uid)).toHaveLength(1);
      expect(list).toHaveProperty('nextCursor');
    } finally { await admin.dispose(); }
  });

  test('admin picks the client, edits in place, and the values persist', async ({ adminPage: page }) => {
    await page.goto('reports');
    await page.getByRole('link', { name: /Client Database/ }).click();
    await expect(page).toHaveURL(/\/reports\/client-database/);
    await expect(page.getByRole('heading', { name: 'Client Database' })).toBeVisible();

    // Client Name is the primary filter: picking one shows only that client.
    await page.getByLabel('Client Name', { exact: true }).selectOption(client.uid);
    const record = page.getByRole('region', { name: `Client Database record: ${client.organisation}` });
    await expect(record).toBeVisible();
    await expect(record.getByText(client.email)).toBeVisible();

    await record.getByRole('button', { name: `Edit ${client.organisation}` }).click();
    // Editing happens on this screen — never the client form.
    await expect(page).toHaveURL(/\/reports\/client-database/);
    const form = record.getByRole('form', { name: `Edit ${client.organisation}` });

    const designation = form.getByLabel('Contact Person Designation');
    await expect(designation.locator('option')).toHaveText(['Not set', 'Owner', 'Director', 'Accountant', 'Manager']);
    await designation.selectOption('Director');
    await form.getByLabel('Contact Person Name', { exact: true }).fill(NEW_PERSON);
    await form.getByLabel('Alternative Number', { exact: true }).fill(NEW_ALT);
    await form.getByLabel('Email ID', { exact: true }).fill(NEW_EMAIL);
    await form.getByLabel('Client Since', { exact: true }).fill('2020-04-01');
    await form.getByRole('button', { name: 'Save' }).click();

    await expect(form).toHaveCount(0);
    await expect(record.getByText(NEW_EMAIL)).toBeVisible();
    await expect(record.getByText('Director')).toBeVisible();

    // A reload reads them back from the server.
    await page.reload();
    const again = page.getByRole('region', { name: `Client Database record: ${client.organisation}` });
    await expect(again.getByText(NEW_EMAIL)).toBeVisible();
    await expect(again.getByText(NEW_ALT)).toBeVisible();
    await expect(again.getByText(NEW_PERSON)).toBeVisible();
    await expect(again.getByText('Director')).toBeVisible();

    const admin = await apiAs('admin');
    try {
      const { data } = await (await admin.get(`/api/client-database/${client.uid}`)).json();
      expect(data).toMatchObject({
        contactDesignation: 'Director', contactPerson: NEW_PERSON, altPhone: NEW_ALT,
        email: NEW_EMAIL, clientSince: '2020-04-01',
      });
    } finally { await admin.dispose(); }
  });

  test('the client profile and login email are NOT changed by the database', async ({ adminPage: page }) => {
    const admin = await apiAs('admin');
    try {
      const { client: profile } = await (await admin.get(`/api/clients/${client.uid}`)).json();
      expect(profile.email).toBe(client.email);
      expect(profile.name).toBe(client.name);
      expect(profile.altPhone).toBe('');
      expect(profile.contactDesignation).toBe('Owner');
    } finally { await admin.dispose(); }

    // And the client form still opens with the profile's values.
    await page.goto(`users/edit/client/${client.uid}`);
    await expect(page.locator('input[name="email"]')).toHaveValue(client.email);
    await expect(page.locator('input[name="name"]')).toHaveValue(client.name);
  });

  test('editing from the list updates the one record — no duplicate', async ({ adminPage: page }) => {
    await page.goto('reports/client-database');
    await page.getByLabel('Search', { exact: true }).fill(client.organisation);
    const row = page.getByRole('list', { name: 'Client Database' }).getByRole('listitem', { name: client.organisation });
    await expect(row).toHaveCount(1);

    await row.getByRole('button', { name: `Edit ${client.organisation}` }).click();
    await expect(page).toHaveURL(/\/reports\/client-database/);
    await row.getByLabel('Business Address', { exact: true }).fill('22 New Road, Pune');
    await row.getByRole('button', { name: 'Save' }).click();
    await expect(row.getByText('22 New Road, Pune')).toBeVisible();
    // The earlier edit is still there: a save updates, it does not replace.
    await expect(row.getByText(NEW_EMAIL)).toBeVisible();
    await expect(row).toHaveCount(1);

    const admin = await apiAs('admin');
    try {
      const names = (await (await admin.get('/api/client-database/names')).json()).data as Array<{ uid: string }>;
      expect(names.filter((n) => n.uid === client.uid)).toHaveLength(1);
    } finally { await admin.dispose(); }
  });

  test('the API rejects a designation outside the list, bad formats and other fields', async () => {
    const admin = await apiAs('admin');
    try {
      const put = (data: Record<string, unknown>) => admin.put(`/api/client-database/${client.uid}`, { data });
      expect((await put({ contactDesignation: 'Chief Wizard' })).status()).toBe(400);
      expect((await put({ phone: 'call me maybe' })).status()).toBe(400);
      expect((await put({ email: 'not-an-email' })).status()).toBe(400);
      expect((await put({ clientSince: '2023-02-30' })).status()).toBe(400);
      expect((await put({ role: 'admin' })).status(), 'unknown fields are refused').toBe(400);
      // The record is untouched by the refused saves.
      const { data } = await (await admin.get(`/api/client-database/${client.uid}`)).json();
      expect(data.contactDesignation).toBe('Director');
      // Staff are not clients.
      const me = await (await admin.get('/api/auth/me')).json();
      expect((await admin.get(`/api/client-database/${me.user.uid}`)).status()).toBe(404);
      expect((await admin.put(`/api/client-database/${me.user.uid}`, { data: { contactDesignation: 'Owner' } })).status()).toBe(404);
    } finally { await admin.dispose(); }
  });

  test('a manager can open and edit the Client Database', async ({ managerPage: page }) => {
    const manager = await apiAs('manager');
    try {
      expect((await manager.get('/api/client-database?limit=1')).status()).toBe(200);
      expect((await manager.put(`/api/client-database/${client.uid}`, { data: { contactDesignation: 'Manager' } })).status()).toBe(200);
    } finally { await manager.dispose(); }
    await page.goto('reports/client-database');
    await expect(page.getByRole('heading', { name: 'Client Database' })).toBeVisible();
  });

  test('team members, clients and professionals get no access', async ({ teamPage, clientPage }) => {
    for (const role of ['team', 'client', 'pro'] as const) {
      const api = await apiAs(role);
      try {
        expect((await api.get('/api/client-database')).status(), `${role} list`).toBe(403);
        expect((await api.get('/api/client-database/names')).status(), `${role} names`).toBe(403);
        expect((await api.get(`/api/client-database/${client.uid}`)).status(), `${role} read`).toBe(403);
        expect((await api.put(`/api/client-database/${client.uid}`, { data: { contactDesignation: 'Owner' } })).status(), `${role} save`).toBe(403);
      } finally { await api.dispose(); }
    }
    for (const page of [teamPage, clientPage]) {
      await page.goto('reports/client-database');
      await expect(page).not.toHaveURL(/\/reports\/client-database/);
    }
  });
});
