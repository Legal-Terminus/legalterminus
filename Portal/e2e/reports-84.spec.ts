import { test, expect } from './fixtures';
import { apiAs } from './api';

/**
 * #84 — the new report endpoints: revenue, team-performance, storage (admin/
 * manager only) and my-services (client-scoped).
 */
test('#84: revenue analytics returns totals + breakdowns (admin)', async () => {
  const api = await apiAs('admin');
  const r = await (await api.get('/api/reports/revenue')).json();
  for (const k of ['collected', 'outstanding', 'totalFees', 'monthly', 'services', 'team']) {
    expect(r).toHaveProperty(k);
  }
  expect(Array.isArray(r.services)).toBeTruthy();
  await api.dispose();
});

test('#84 / #216: team performance returns the overview and every section (admin)', async () => {
  // The full arithmetic is asserted in employee-performance.spec.ts; this keeps
  // the shape of the whole-team response honest.
  const api = await apiAs('admin');
  const r = await (await api.get('/api/reports/team-performance')).json();
  for (const k of ['range', 'staff', 'overview', 'summary', 'time', 'deadlines', 'trend', 'quality', 'history']) {
    expect(r).toHaveProperty(k);
  }
  expect(Array.isArray(r.overview)).toBeTruthy();
  if (r.overview.length) {
    for (const k of ['name', 'assigned', 'completed', 'inProgress', 'overdue', 'onTimePct', 'firstTimeRightPct']) {
      expect(r.overview[0]).toHaveProperty(k);
    }
  }
  await api.dispose();
});

test('#84: storage report returns totals + per-client rollup (admin)', async () => {
  const api = await apiAs('admin');
  const r = await (await api.get('/api/reports/storage')).json();
  for (const k of ['totalBytes', 'remaining', 'usedPct', 'alertLevel', 'perClient']) {
    expect(r).toHaveProperty(k);
  }
  await api.dispose();
});

test('#84: my-services is client-scoped and forbidden report data is not exposed', async () => {
  // A client can read their OWN services.
  const client = await apiAs('client');
  const mine = await (await client.get('/api/reports/my-services')).json();
  expect(Array.isArray(mine)).toBeTruthy();
  // A client is refused the internal reports.
  expect((await client.get('/api/reports/revenue')).status()).toBe(403);
  expect((await client.get('/api/reports/master-sheet')).status()).toBe(403);
  await client.dispose();
});
