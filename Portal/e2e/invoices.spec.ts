import { test, expect } from './fixtures';
import { request, type Page } from '@playwright/test';
import { apiAs, createMatter, createThrowawayClient, deleteMatter, deleteUser, resolveServiceKey } from './api';
import { openMatter, pdfFile } from './helpers';

/**
 * #313 — invoices on a matter's Payments tab.
 *
 * Admin / manager upload PDF invoices (several per matter), each listed with
 * its upload date, and replace or delete one. The matter's client downloads
 * them. Team members are refused everywhere — an invoice is payment
 * information (#148) — and a client of ANOTHER matter gets 404.
 *
 * Uploads go to storage through a signed URL, so the UI upload tests need the
 * real bucket (they fail against the Storage emulator, like documents).
 */

const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';
const PDF_BODY = { fileName: 'e2e-guard.pdf', contentType: 'application/pdf' };

/** The Payments tab renders the card in both screen-size layouts; take the visible one. */
const invoicesCard = (page: Page) => page.getByTestId('invoices').filter({ visible: true });

test.describe.serial('#313 invoices on a matter', () => {
  let taskId: string;
  let otherClient: { uid: string } | null = null;
  let otherMatter: string | null = null;
  let firstName = '';

  test.beforeAll(async () => { taskId = await createMatter(); });
  test.afterAll(async () => {
    await deleteMatter(taskId);
    if (otherMatter) await deleteMatter(otherMatter);
    if (otherClient) await deleteUser(otherClient.uid);
  });

  test('who may do what: admin/manager write, the client reads, team never', async () => {
    const team = await apiAs('team');
    const client = await apiAs('client');
    const manager = await apiAs('manager');
    try {
      expect((await team.get(`/api/tasks/${taskId}/invoices`)).status()).toBe(403);
      expect((await team.post(`/api/tasks/${taskId}/invoices/signed-upload-url`, { data: PDF_BODY })).status()).toBe(403);
      expect((await client.post(`/api/tasks/${taskId}/invoices/signed-upload-url`, { data: PDF_BODY })).status()).toBe(403);
      expect((await client.get(`/api/tasks/${taskId}/invoices`)).status()).toBe(200);
      expect((await manager.get(`/api/tasks/${taskId}/invoices`)).status()).toBe(200);
      const anon = await request.newContext({ baseURL: API() });
      expect((await anon.get(`/api/tasks/${taskId}/invoices`)).status()).toBe(401);
      await anon.dispose();
    } finally { await team.dispose(); await client.dispose(); await manager.dispose(); }
  });

  test('the server refuses anything but a PDF, and unknown fields', async () => {
    const admin = await apiAs('admin');
    try {
      expect((await admin.post(`/api/tasks/${taskId}/invoices/signed-upload-url`, { data: { fileName: 'x.png', contentType: 'image/png' } })).status()).toBe(400);
      expect((await admin.post(`/api/tasks/${taskId}/invoices/signed-upload-url`, { data: { ...PDF_BODY, clientUid: 'x' } })).status()).toBe(400);
      expect((await admin.post(`/api/tasks/${taskId}/invoices/signed-upload-url`, { data: { ...PDF_BODY, replaces: 'f'.repeat(32) } })).status()).toBe(404);
    } finally { await admin.dispose(); }
  });

  test('admin uploads two PDF invoices; each lists with its upload date', async ({ adminPage }) => {
    await openMatter(adminPage, taskId, 'Payments');
    const card = invoicesCard(adminPage);
    await expect(card.getByText('No invoices uploaded yet.')).toBeVisible();

    const a = pdfFile('invoice-a');
    const b = pdfFile('invoice-b');
    firstName = a.name;
    await card.getByTestId('invoice-upload-input').setInputFiles(a);
    await expect(card.getByTestId('invoice-row').filter({ hasText: a.name })).toBeVisible();
    await card.getByTestId('invoice-upload-input').setInputFiles(b);
    await expect(card.getByTestId('invoice-row')).toHaveCount(2);

    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    await expect(card.getByTestId('invoice-row').filter({ hasText: a.name }).getByTestId('invoice-date')).toContainText(`Uploaded ${today}`);
  });

  test('the client sees the invoices on their matter and downloads one', async ({ clientPage }) => {
    await openMatter(clientPage, taskId, 'Payments');
    const card = invoicesCard(clientPage);
    const row = card.getByTestId('invoice-row').filter({ hasText: firstName });
    await expect(row).toBeVisible();
    await expect(card.getByRole('button', { name: /^Upload invoice/ })).toHaveCount(0);
    await expect(row.getByRole('button', { name: /^Replace invoice/ })).toHaveCount(0);
    await expect(row.getByRole('button', { name: /^Delete invoice/ })).toHaveCount(0);

    const [download] = await Promise.all([
      clientPage.waitForEvent('download'),
      row.getByRole('button', { name: `Download invoice ${firstName}` }).click(),
    ]);
    expect(download.suggestedFilename()).toBe(firstName);
  });

  test('the download streams the PDF itself; the client is not told who uploaded', async () => {
    const client = await apiAs('client');
    try {
      const list = (await (await client.get(`/api/tasks/${taskId}/invoices`)).json()).data as Array<Record<string, unknown>>;
      expect(list.length).toBe(2);
      for (const inv of list) {
        expect(inv.uploadedBy).toBeUndefined();
        expect(inv.uploadedByName).toBeUndefined();
        expect(inv.objectPath).toBeUndefined();
      }
      const res = await client.get(`/api/tasks/${taskId}/invoices/${list[0].id}/download`);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('application/pdf');
      expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');
    } finally { await client.dispose(); }
  });

  test('a client gets 404 for another client’s matter, and team cannot download', async () => {
    otherClient = await createThrowawayClient();
    const admin = await apiAs('admin');
    const client = await apiAs('client');
    const team = await apiAs('team');
    try {
      const res = await admin.post('/api/tasks', {
        data: { clientUid: otherClient.uid, serviceKey: await resolveServiceKey(), paymentStatus: 'fully_paid', totalCost: 5000, amountReceived: 5000, paymentMode: 'E2E' },
      });
      expect(res.ok()).toBe(true);
      otherMatter = (await res.json()).id as string;
      expect((await client.get(`/api/tasks/${otherMatter}/invoices`)).status()).toBe(404);

      const mine = (await (await admin.get(`/api/tasks/${taskId}/invoices`)).json()).data as Array<{ id: string }>;
      // Someone else's matter id with a real invoice id from mine: still 404.
      expect((await client.get(`/api/tasks/${otherMatter}/invoices/${mine[0].id}/download`)).status()).toBe(404);
      expect((await team.get(`/api/tasks/${taskId}/invoices/${mine[0].id}/download`)).status()).toBe(403);
      expect((await team.delete(`/api/tasks/${taskId}/invoices/${mine[0].id}`)).status()).toBe(403);
      expect((await client.delete(`/api/tasks/${taskId}/invoices/${mine[0].id}`)).status()).toBe(403);
    } finally { await admin.dispose(); await client.dispose(); await team.dispose(); }
  });

  test('a team member has no Payments tab, so no invoices', async ({ teamPage }) => {
    await openMatter(teamPage, taskId);
    await expect(teamPage.getByRole('button', { name: 'Payments', exact: true })).toHaveCount(0);
    await expect(teamPage.getByTestId('invoices')).toHaveCount(0);
  });

  test('admin replaces one invoice and deletes the other', async ({ adminPage }) => {
    await openMatter(adminPage, taskId, 'Payments');
    const card = invoicesCard(adminPage);
    await expect(card.getByTestId('invoice-row')).toHaveCount(2);

    const replacement = pdfFile('invoice-replacement');
    const firstRow = card.getByTestId('invoice-row').filter({ hasText: firstName });
    await firstRow.getByTestId('invoice-replace-input').setInputFiles(replacement);
    await expect(card.getByTestId('invoice-row').filter({ hasText: replacement.name })).toBeVisible();
    await expect(card.getByTestId('invoice-row').filter({ hasText: firstName })).toHaveCount(0);
    await expect(card.getByTestId('invoice-row')).toHaveCount(2);

    const other = card.getByTestId('invoice-row').filter({ hasNotText: replacement.name });
    await other.getByRole('button', { name: /^Delete invoice/ }).click();
    await adminPage.getByRole('button', { name: 'Delete invoice', exact: true }).click();
    await expect(card.getByTestId('invoice-row')).toHaveCount(1);
    await expect(card.getByTestId('invoice-row').filter({ hasText: replacement.name })).toBeVisible();
  });
});
