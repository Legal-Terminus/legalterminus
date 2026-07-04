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
