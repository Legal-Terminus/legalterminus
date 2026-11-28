import { test, expect } from './fixtures';
import { apiAs, createMatter, createPartPaidMatter, deleteMatter } from './api';
import { openMatter } from './helpers';

/**
 * LT #368 — Audit: the admin marks a matter Audited (only once fully paid) on
 * its Payments tab; the Master Sheet and the matter reports show Audit Status.
 * LT #369 — Admin Remarks: the admin types remarks straight into the Master
 * Sheet's last column; they persist and are in the CSV.
 * LT #366 — the Master Sheet's filters above the table apply together.
 * Clients never receive either mark.
 */
test.describe.configure({ mode: 'serial' });

const ORG = `E2E Review ${Date.now().toString(36).toUpperCase()}`;
let paidId = '';
let partId = '';

test.beforeAll(async () => {
  paidId = await createMatter({ organisation: ORG });
  partId = await createPartPaidMatter();
});
test.afterAll(async () => {
  if (paidId) await deleteMatter(paidId);
  if (partId) await deleteMatter(partId);
});

type Row = { taskId: string; auditStatus: string; adminRemarks: string; paymentStatus: string };
async function sheet(query = ''): Promise<Row[]> {
  const api = await apiAs('admin');
  const rows = await (await api.get(`/api/reports/master-sheet${query}`)).json();
  await api.dispose();
  return rows as Row[];
}

test('#368 audit: admin only, only once fully paid; Un-audited again; clients never see it', async ({ adminPage }) => {
  const admin = await apiAs('admin');
  // Not fully paid: refused.
  const early = await admin.put(`/api/tasks/${partId}/audit`, { data: { audited: true } });
  expect(early.status()).toBe(409);
  expect((await early.json()).message).toBe('A matter can be marked Audited only once its payment is fully received.');
  // A team member may not set it (admin and manager may — owner, 28 Nov).
  const team = await apiAs('team');
  expect((await team.put(`/api/tasks/${paidId}/audit`, { data: { audited: true } })).status()).toBe(403);
  await team.dispose();
  await admin.dispose();

  // From the matter's Payments tab.
  await openMatter(adminPage, paidId, 'Payments');
  const control = adminPage.getByTestId('audit-control').filter({ visible: true });
  await expect(control.getByTestId('audit-status')).toHaveText('Un-audited', { timeout: 20_000 });
  await control.getByRole('button', { name: 'Mark Audited' }).click();
  await expect(control.getByTestId('audit-status')).toHaveText('Audited', { timeout: 20_000 });
  expect((await sheet()).find((r) => r.taskId === paidId)?.auditStatus).toBe('audited');

  // The client's view of the matter has no audit fields.
  const client = await apiAs('client');
  const seen = await (await client.get(`/api/tasks/${paidId}`)).json();
  expect(seen.auditStatus).toBeUndefined();
  expect(seen.auditedBy).toBeUndefined();
  await client.dispose();

  await control.getByRole('button', { name: 'Mark Un-audited' }).click();
  await expect(control.getByTestId('audit-status')).toHaveText('Un-audited', { timeout: 20_000 });
});

test('#368 a manager marks a matter Audited too', async ({ managerPage }) => {
  await openMatter(managerPage, paidId, 'Payments');
  const control = managerPage.getByTestId('audit-control').filter({ visible: true });
  await control.getByRole('button', { name: 'Mark Audited' }).click();
  await expect(control.getByTestId('audit-status')).toHaveText('Audited', { timeout: 20_000 });
  await control.getByRole('button', { name: 'Mark Un-audited' }).click();
  await expect(control.getByTestId('audit-status')).toHaveText('Un-audited', { timeout: 20_000 });
});

test('#369 Admin Remarks: typed into the Master Sheet, kept after a reload, in the CSV; admin only', async ({ adminPage }) => {
  const remark = `Checked ${ORG}`;
  await adminPage.goto('reports/master-sheet');
  await adminPage.getByPlaceholder(/Search client, organisation/).fill(ORG);
  // The grid's rows are not <tr>s; after the search, this matter is the only row.
  await expect(adminPage.getByText(ORG).filter({ visible: true }).first()).toBeVisible({ timeout: 30_000 });
  await adminPage.getByRole('button', { name: 'Add admin remarks' }).filter({ visible: true }).first().click();
  const box = adminPage.getByRole('textbox', { name: 'Admin remarks' });
  await box.fill(remark);
  await box.press('Enter');
  await expect(adminPage.getByRole('button', { name: `Edit admin remarks: ${remark}` }).filter({ visible: true })).toBeVisible({ timeout: 20_000 });
  await adminPage.reload();
  await adminPage.getByPlaceholder(/Search client, organisation/).fill(ORG);
  await expect(adminPage.getByText(remark).filter({ visible: true }).first()).toBeVisible({ timeout: 30_000 });

  const admin = await apiAs('admin');
  const csv = await (await admin.get('/api/reports/master-sheet?format=csv')).text();
  expect(csv.split('\r\n')[0]).toContain('Audit Status,Admin Remarks');
  expect(csv).toContain(remark);
  // Only the admin writes; clients never receive it.
  const manager = await apiAs('manager');
  expect((await manager.put(`/api/tasks/${paidId}/admin-remarks`, { data: { adminRemarks: 'no' } })).status()).toBe(403);
  await manager.dispose();
  const client = await apiAs('client');
  expect((await (await client.get(`/api/tasks/${paidId}`)).json()).adminRemarks).toBeUndefined();
  await client.dispose();
  // Blank clears it.
  expect((await admin.put(`/api/tasks/${paidId}/admin-remarks`, { data: { adminRemarks: '' } })).ok()).toBeTruthy();
  await admin.dispose();
  expect((await sheet()).find((r) => r.taskId === paidId)?.adminRemarks).toBe('');
});

test('#366 Master Sheet: Status, Service, Payment and the dates apply together; To includes that day', async () => {
  const today = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
  const all = await sheet();
  expect(all.some((r) => r.taskId === paidId)).toBeTruthy();
  const paid = await sheet('?paymentStatus=fully_paid');
  expect(paid.every((r) => r.paymentStatus === 'fully_paid')).toBeTruthy();
  expect(paid.some((r) => r.taskId === paidId)).toBeTruthy();
  expect(paid.some((r) => r.taskId === partId)).toBeFalsy();
  // A matter created today is inside From = To = today.
  const day = await sheet(`?startDate=${today}&endDate=${today}&paymentStatus=part_paid`);
  expect(day.some((r) => r.taskId === partId)).toBeTruthy();
  expect(day.some((r) => r.taskId === paidId)).toBeFalsy();
  // Combined with a status that does not match: gone.
  const none = await sheet(`?status=completed&endDate=${today}`);
  expect(none.some((r) => r.taskId === partId || r.taskId === paidId)).toBeFalsy();
});

test('#370 / #365 "Has amount due", Revenue cards open the Master Sheet, Due by client, Excel of what is on screen', async ({ adminPage }) => {
  // The API: due = something to collect; received = any money in.
  const due = await sheet('?paymentStatus=due');
  expect(due.some((r) => r.taskId === partId)).toBeTruthy();
  expect(due.some((r) => r.taskId === paidId)).toBeFalsy();
  const received = await sheet('?paymentStatus=received');
  expect(received.some((r) => r.taskId === paidId) && received.some((r) => r.taskId === partId)).toBeTruthy();

  // Revenue Analytics: Outstanding opens the Master Sheet on "Has amount due"; no Pending card.
  await adminPage.goto('reports/revenue');
  await expect(adminPage.getByText('Pending', { exact: true })).toHaveCount(0);
  await adminPage.getByRole('link', { name: /^Outstanding:/ }).click();
  await expect(adminPage).toHaveURL(/reports\/master-sheet\?paymentStatus=due/);
  await expect(adminPage.getByLabel('Filter by payment')).toHaveValue('due');
  await expect(adminPage.getByTestId('master-sheet-totals')).toContainText('Due ₹', { timeout: 30_000 });
  await expect(adminPage.getByTestId('due-by-client')).toContainText('E2E Client');

  // Download Excel exports what the search left on screen.
  await adminPage.getByPlaceholder(/Search client, organisation/).fill('no-such-client-zzz');
  await expect(adminPage.getByRole('button', { name: 'Download Excel' }).first()).toBeDisabled();
  await adminPage.getByPlaceholder(/Search client, organisation/).fill('');
  const [download] = await Promise.all([
    adminPage.waitForEvent('download'),
    adminPage.getByRole('button', { name: 'Download Excel' }).filter({ visible: true }).first().click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^(master-sheet|due-by-client)-\d{4}-\d{2}-\d{2}\.xlsx$/);
});
