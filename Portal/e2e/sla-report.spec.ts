import { test, expect } from './fixtures';
import { apiAs } from './api';

/**
 * E13-S04 — SLA / Delay report. Verifies the report page loads with its summary
 * chips, the backend aggregation endpoint returns the documented shape, the
 * at-risk window control re-queries, and clients are blocked. We don't assert a
 * specific breach row (whether a fresh matter is "overdue" depends on the seeded
 * workflow's ETAs), but we DO assert the aggregation contract end-to-end.
 */

test('SLA report page loads with summary chips and is linked from the hub', async ({ adminPage }) => {
  await adminPage.goto('reports');
  await expect(adminPage.getByRole('link', { name: /SLA \/ Delay/ })).toBeVisible();

  await adminPage.goto('reports/sla');
  await expect(adminPage.getByRole('heading', { name: 'SLA / Delay Report' })).toBeVisible();
  // Summary chips render once the query resolves.
  await expect(adminPage.getByText('Overdue', { exact: true })).toBeVisible();
  await expect(adminPage.getByText('At risk', { exact: true })).toBeVisible();
});

test('at-risk window control re-queries the report', async ({ adminPage }) => {
  await adminPage.goto('reports/sla');
  await expect(adminPage.getByRole('heading', { name: 'SLA / Delay Report' })).toBeVisible();

  const windowInput = adminPage.getByLabel('At-risk window in days');
  await expect(windowInput).toBeVisible();
  // Widening the window to 30 days should not error and should keep the page healthy.
  await windowInput.fill('30');
  await expect(adminPage.getByText('Failed to load report.')).toHaveCount(0);
  await expect(adminPage.getByRole('heading', { name: 'SLA / Delay Report' })).toBeVisible();
});

test('GET /api/reports/sla returns the documented aggregation shape', async ({ adminPage }) => {
  // adminPage just ensures the auth setup ran; the assertion is a direct API call.
  void adminPage;
  const api = await apiAs('admin');
  const res = await api.get('/api/reports/sla?atRiskDays=2');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  await api.dispose();

  expect(Array.isArray(body.breaches)).toBeTruthy();
  expect(typeof body.summary.overdue).toBe('number');
  expect(typeof body.summary.atRisk).toBe('number');
  expect(Array.isArray(body.onTimeByService)).toBeTruthy();
  expect(Array.isArray(body.onTimeByPhase)).toBeTruthy();
  expect(body.atRiskDays).toBe(2);

  // Every breach row carries the fields the grid renders.
  for (const b of body.breaches) {
    expect(typeof b.taskId).toBe('string');
    expect(['overdue', 'at_risk']).toContain(b.severity);
    expect(typeof b.stepTitle).toBe('string');
    expect(typeof b.dueAt).toBe('string');
  }
  // On-time rate rows are well-formed (rate is a 0–100 number or null).
  for (const r of [...body.onTimeByService, ...body.onTimeByPhase]) {
    expect(typeof r.total).toBe('number');
    if (r.rate !== null) {
      expect(r.rate).toBeGreaterThanOrEqual(0);
      expect(r.rate).toBeLessThanOrEqual(100);
    }
  }
});

test('client cannot reach the SLA report (UI route + API)', async ({ clientPage }) => {
  await clientPage.goto('reports/sla');
  await expect(async () => {
    expect(/\/reports\/sla(\?|$)/.test(new URL(clientPage.url()).pathname)).toBe(false);
  }).toPass({ timeout: 15_000 });

  // API is admin/manager-only too.
  const api = await apiAs('client');
  const res = await api.get('/api/reports/sla');
  expect(res.status()).toBe(403);
  await api.dispose();
});
