import { test, expect } from './fixtures';
import { apiAs } from './api';

/**
 * #173 — adding a service (or category) to the catalog from the app, rather than
 * by running a seed script.
 *
 * The key is the identity a workflow binds to through its `serviceKeys`, so the
 * assertions that matter most are the ones protecting it: unique across the WHOLE
 * catalog, well-formed, and admin-only to create.
 */

const CAT_ID = 'tax-compliance'; // seeded category

/** Remove a service added by a test so the shared catalog stays clean. */
async function removeService(categoryId: string, key: string) {
  const api = await apiAs('admin');
  // There is no DELETE (deliberately — matters pin serviceKey), so deactivate.
  await api.patch(`/api/service-config/${categoryId}/${key}`, { data: { active: false } }).catch(() => {});
  await api.dispose();
}

test('#173: an admin can add a service and it appears in the catalog', async () => {
  const key = `e2e-svc-${Date.now()}`;
  const api = await apiAs('admin');
  try {
    const res = await api.post(`/api/service-config/${CAT_ID}`, {
      data: { key, displayName: 'E2E Trademark Renewal' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.key).toBe(key);
    expect(body.categoryId).toBe(CAT_ID);
    expect(body.active).toBe(true);

    // It is immediately readable — the 5-minute catalog cache must be invalidated
    // on write, or a newly added service would be invisible for minutes.
    const catalog = await (await api.get('/api/service-config/all')).json();
    expect(catalog.services[key]).toBeTruthy();
    expect(catalog.services[key].displayName).toBe('E2E Trademark Renewal');
  } finally {
    await api.dispose();
    await removeService(CAT_ID, key);
  }
});

test('#173: a duplicate key is refused across the WHOLE catalog', async () => {
  const api = await apiAs('admin');
  try {
    // 'gst-returns' is seeded in tax-compliance. Adding it to a DIFFERENT category
    // must still fail: a duplicate key would make getCompiledForServiceKey resolve
    // the wrong workflow and silently mis-route matters.
    const res = await api.post('/api/service-config/company-registration', {
      data: { key: 'gst-returns', displayName: 'Duplicate GST' },
    });
    expect(res.status()).toBe(409);
  } finally {
    await api.dispose();
  }
});

test('#173: a malformed key is rejected', async () => {
  const api = await apiAs('admin');
  try {
    for (const bad of ['Has Spaces', 'UPPERCASE', 'trailing-', 'double--hyphen', 'a']) {
      const res = await api.post(`/api/service-config/${CAT_ID}`, {
        data: { key: bad, displayName: 'Bad key' },
      });
      expect(res.status(), `key "${bad}" should be rejected`).toBe(400);
    }
  } finally {
    await api.dispose();
  }
});

test('#173: adding to a category that does not exist is a 404', async () => {
  const api = await apiAs('admin');
  try {
    const res = await api.post('/api/service-config/no-such-category', {
      data: { key: `e2e-orphan-${Date.now()}`, displayName: 'Orphan' },
    });
    expect(res.status()).toBe(404);
  } finally {
    await api.dispose();
  }
});

test('#173: only an admin can add services or categories', async () => {
  for (const role of ['manager', 'team', 'client'] as const) {
    const api = await apiAs(role);
    const svc = await api.post(`/api/service-config/${CAT_ID}`, {
      data: { key: `e2e-${role}-${Date.now()}`, displayName: 'Nope' },
    });
    expect(svc.status(), `${role} must not add a service`).toBe(403);

    const cat = await api.post('/api/service-config', {
      data: { id: `e2e-cat-${role}-${Date.now()}`, name: 'Nope' },
    });
    expect(cat.status(), `${role} must not add a category`).toBe(403);
    await api.dispose();
  }
});

test('#173: an admin can add a category, and a duplicate id is refused', async () => {
  const id = `e2e-cat-${Date.now()}`;
  const api = await apiAs('admin');
  try {
    const res = await api.post('/api/service-config', { data: { id, name: 'E2E Category' } });
    expect(res.status()).toBe(201);

    // Same id twice must not silently overwrite an existing category and its
    // services.
    const dup = await api.post('/api/service-config', { data: { id, name: 'E2E Category Again' } });
    expect(dup.status()).toBe(409);
  } finally {
    await api.dispose();
  }
});

test('#173: a new service can then be given a workflow (#156 flow)', async () => {
  const key = `e2e-flow-${Date.now()}`;
  const api = await apiAs('admin');
  try {
    await api.post(`/api/service-config/${CAT_ID}`, { data: { key, displayName: 'E2E Needs Workflow' } });

    // The point of adding a service is to run matters on it, which needs a
    // workflow — so it must show up as unconfigured and be bindable.
    const defs = await (await api.get('/api/workflow-definitions')).json();
    const taken = new Set(defs.flatMap((d: { serviceKeys?: string[] }) => d.serviceKeys ?? []));
    expect(taken.has(key)).toBe(false);
  } finally {
    await api.dispose();
    await removeService(CAT_ID, key);
  }
});

/* ── UI ─────────────────────────────────────────────────────────────────────── */

test('#173: the catalog offers Add service to an admin only', async ({ adminPage, teamPage }) => {
  await adminPage.goto('services');
  await expect(adminPage.getByRole('button', { name: /add service/i })).toBeVisible();

  await teamPage.goto('services');
  await expect(teamPage.getByRole('button', { name: /add service/i })).toHaveCount(0);
});

test('#173: the Add service form suggests a key from the name', async ({ adminPage }) => {
  await adminPage.goto('services');
  await adminPage.getByRole('button', { name: /add service/i }).click();

  await adminPage.getByLabel('Service name').fill('Trademark Renewal');
  // The key is derived rather than hidden — it is immutable once created and is
  // what a workflow binds to, so the admin gets to see and adjust it.
  await expect(adminPage.getByLabel('Service key')).toHaveValue('trademark-renewal');
});
