import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * #84 — the Master Sheet is the central report. It now carries the operational /
 * payment / workflow columns and supports .xlsx (client-side) + CSV export.
 * Here we assert the API returns the expanded row shape and CSV has the columns.
 */
test('#84: master-sheet rows include the expanded columns', async () => {
  const taskId = await createMatter();
  try {
    const api = await apiAs('admin');
    const rows = await (await api.get('/api/reports/master-sheet')).json();
    expect(Array.isArray(rows)).toBeTruthy();
    const row = rows.find((r: { taskId: string }) => r.taskId === taskId);
    expect(row, 'created matter should appear in the master sheet').toBeTruthy();
    // New #84 fields are present.
    for (const key of ['createdAt', 'totalFees', 'paymentMode', 'professional', 'priority', 'pendingReason', 'pendingFrom', 'approvalPendingFrom', 'referralSource']) {
      expect(row, `row should have ${key}`).toHaveProperty(key);
    }
    await api.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#84: master-sheet CSV export includes the new headers', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/reports/master-sheet?format=csv');
  expect(res.ok()).toBeTruthy();
  expect(res.headers()['content-type']).toContain('text/csv');
  const text = await res.text();
  const header = text.split('\r\n')[0];
  for (const label of ['Created', 'Priority', 'Professional', 'Pending Reason', 'Pending From', 'Total Fees', 'Payment Mode', 'Referral Source']) {
    expect(header).toContain(label);
  }
  await api.dispose();
});

test('#84: clients cannot access the master sheet', async () => {
  const client = await apiAs('client');
  const res = await client.get('/api/reports/master-sheet');
  expect(res.status()).toBe(403);
  await client.dispose();
});

test('#88: master-sheet columns are user-resizable and the width persists', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto('reports/master-sheet');
    // At least one column resize handle is present (shared DataGrid affordance).
    const handle = adminPage.getByRole('separator', { name: /resize column/i }).first();
    await expect(handle).toBeVisible();

    // The first column's header cell (the div wrapping the "Client" title + handle).
    const firstHeaderCell = adminPage.locator('div:has(> [aria-label="Resize column"])').first();
    const before = (await firstHeaderCell.boundingBox())!.width;

    // The resize handle uses onMouseDown → drive it with the low-level mouse API.
    const box = (await handle.boundingBox())!;
    await adminPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await adminPage.mouse.down();
    await adminPage.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 8 });
    await adminPage.mouse.up();

    const after = (await firstHeaderCell.boundingBox())!.width;
    expect(after).toBeGreaterThan(before + 40);

    // Width persists across reload (localStorage-backed, keyed by tableId).
    await adminPage.reload();
    const persistedCell = adminPage.locator('div:has(> [aria-label="Resize column"])').first();
    const persisted = (await persistedCell.boundingBox())!.width;
    expect(persisted).toBeGreaterThan(before + 40);
  } finally { await deleteMatter(taskId); }
});
