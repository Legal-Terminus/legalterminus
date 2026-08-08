import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter, advanceUntil } from './api';

/**
 * #152 — the Organisation Name column across the five task reports.
 * #153 — the organisation name is editable at ANY time, including after the
 *        matter has completed, and the edit must not disturb workflow state.
 *
 * A client can hold matters for several organisations, so "client name" alone
 * doesn't identify a row — these tests pin the column being present in the API
 * payloads the grids and exports are built from, and pin the edit path.
 */

const ORG = `E2E Org ${Date.now()}`;

/* ── #153: editable during an active matter and after completion ───────────── */

test('#153: organisation is editable on an ACTIVE matter', async () => {
  const taskId = await createMatter({ organisation: ORG });
  const api = await apiAs('admin');
  try {
    expect((await getMatter(taskId)).organisation).toBe(ORG);

    const next = `${ORG} (corrected)`;
    const res = await api.patch(`/api/tasks/${taskId}`, { data: { organisation: next } });
    expect(res.ok()).toBeTruthy();
    expect((await getMatter(taskId)).organisation).toBe(next);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#153: organisation is still editable AFTER the matter completes', async () => {
  const taskId = await createMatter({ organisation: ORG });
  const api = await apiAs('admin');
  try {
    // Drive the matter to completion, then correct a typo in the org name — the
    // exact case the issue describes.
    await advanceUntil(taskId);
    const done = await getMatter(taskId);
    expect(done.status).toBe('completed');

    const corrected = `${ORG} Pvt Ltd`;
    const res = await api.patch(`/api/tasks/${taskId}`, { data: { organisation: corrected } });
    expect(res.ok()).toBeTruthy();

    const after = await getMatter(taskId);
    expect(after.organisation).toBe(corrected);
    // The rename must not disturb workflow progress or payment state.
    expect(after.status).toBe('completed');
    expect(after.currentStepNumber).toBe(done.currentStepNumber);
    expect(after.paymentStatus).toBe(done.paymentStatus);
    expect(after.amountPaid ?? 0).toBe(done.amountPaid ?? 0);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#153: the organisation name can be cleared, and a client cannot edit it', async () => {
  const taskId = await createMatter({ organisation: ORG });
  const admin = await apiAs('admin');
  const client = await apiAs('client');
  try {
    // A client must not be able to rewrite the organisation on their own matter.
    const forbidden = await client.patch(`/api/tasks/${taskId}`, {
      data: { organisation: 'Client Renamed Ltd' },
    });
    expect(forbidden.status()).toBe(403);
    expect((await getMatter(taskId)).organisation).toBe(ORG);

    // Admin may clear it entirely.
    const cleared = await admin.patch(`/api/tasks/${taskId}`, { data: { organisation: '' } });
    expect(cleared.ok()).toBeTruthy();
    expect((await getMatter(taskId)).organisation ?? null).toBeNull();
  } finally {
    await admin.dispose();
    await client.dispose();
    await deleteMatter(taskId);
  }
});

/* ── #152: the organisation reaches every report the issue names ───────────── */

test('#152: all-matters, completed and pending reports carry organisation', async () => {
  const taskId = await createMatter({ organisation: ORG });
  const api = await apiAs('admin');
  try {
    // All Matters — the row for our matter must carry the organisation. These
    // three endpoints return whole task docs, so the field rides along; assert it
    // rather than assuming, since the grids read exactly this.
    const all = await (await api.get('/api/reports/all-tasks')).json();
    const row = all.find((r: { id: string }) => r.id === taskId);
    expect(row, 'new matter should appear in All Matters').toBeTruthy();
    expect(row.organisation).toBe(ORG);

    // Pending — the matter is in flight, so it must be listed here too.
    const pending = await (await api.get('/api/reports/pending')).json();
    const pendingRow = pending.find((r: { id: string }) => r.id === taskId);
    expect(pendingRow, 'new matter should be pending').toBeTruthy();
    expect(pendingRow.organisation).toBe(ORG);

    // Completed — drive it home and confirm the org survives into that report.
    await advanceUntil(taskId);
    const completed = await (await api.get('/api/reports/completed')).json();
    const completedRow = completed.find((r: { id: string }) => r.id === taskId);
    expect(completedRow, 'matter should appear in Completed').toBeTruthy();
    expect(completedRow.organisation).toBe(ORG);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#152: master sheet exposes organisation in JSON and in the CSV export', async () => {
  const taskId = await createMatter({ organisation: ORG });
  const api = await apiAs('admin');
  try {
    const rows = await (await api.get('/api/reports/master-sheet')).json();
    const row = rows.find((r: { taskId: string }) => r.taskId === taskId);
    expect(row, 'new matter should appear in the Master Sheet').toBeTruthy();
    expect(row.organisation).toBe(ORG);

    // The CSV export must carry the column too (header + value), next to Client.
    const csv = await (await api.get('/api/reports/master-sheet?format=csv')).text();
    const header = csv.split(/\r?\n/)[0];
    expect(header).toContain('Organisation');
    // Organisation sits immediately after Client.
    const cols = header.split(',').map((c) => c.replace(/^"|"$/g, ''));
    expect(cols.indexOf('Organisation')).toBe(cols.indexOf('Client') + 1);
    expect(csv).toContain(ORG);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#152: the SLA report carries organisation on each breach row', async () => {
  const api = await apiAs('admin');
  try {
    const r = await (await api.get('/api/reports/sla')).json();
    expect(Array.isArray(r.breaches)).toBeTruthy();
    // The shape is what matters — assert the key exists on whatever rows are
    // present rather than manufacturing an overdue matter.
    for (const b of r.breaches) {
      expect(b).toHaveProperty('organisation');
    }
  } finally {
    await api.dispose();
  }
});

/* ── #153: the matter screen exposes the editor to staff, not to clients ───── */

test('#153: staff see an Organisation editor on the matter screen', async ({ adminPage }) => {
  const taskId = await createMatter({ organisation: ORG });
  try {
    await adminPage.goto(`tasks/${taskId}`);
    const field = adminPage.getByLabel('Organisation', { exact: true });
    await expect(field).toBeVisible();
    await expect(field).toHaveValue(ORG);
  } finally {
    await deleteMatter(taskId);
  }
});

test('#153: a client sees the organisation but gets no editor', async ({ clientPage }) => {
  const taskId = await createMatter({ organisation: ORG });
  try {
    await clientPage.goto(`tasks/${taskId}`);
    // The name is shown (clients may hold matters for several orgs) …
    await expect(clientPage.getByText(ORG, { exact: false }).first()).toBeVisible();
    // … but the editable control is staff-only.
    await expect(clientPage.getByLabel('Organisation', { exact: true })).toHaveCount(0);
  } finally {
    await deleteMatter(taskId);
  }
});
