import { test, expect } from './fixtures';
import { request } from '@playwright/test';
import { apiAs } from './api';

/**
 * E24-S01 — the price catalogue. The server, not the browser, decides what a
 * plan costs; the website reads its prices from a public endpoint; only an
 * admin may change them.
 *
 * The catalogue is seeded with `npm run db:seed:pricing`. Where it has not
 * been (the tests skip rather than fail) there is nothing to assert against.
 * Every price this suite changes is put back.
 */

const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';
type Plan = { id: string; name: string; price: number; oldPrice: number | null; active?: boolean };
type Product = { key: string; label: string; serviceKey: string | null; plans: Plan[] };

async function catalogue(): Promise<Product[]> {
  const admin = await apiAs('admin');
  try {
    const res = await admin.get('/api/pricing');
    expect(res.status()).toBe(200);
    return (await res.json()).products as Product[];
  } finally { await admin.dispose(); }
}

test.describe.serial('E24-S01 price catalogue', () => {
  let product: Product;
  let plan: Plan;

  test.beforeAll(async () => {
    const products = await catalogue();
    test.skip(products.length === 0, 'the price catalogue is not seeded in this database');
    product = products.find((p) => p.plans.length > 1) ?? products[0];
    [plan] = product.plans;
  });

  test('the website can read prices with no sign-in, and sees only what it needs', async () => {
    const anon = await request.newContext({ baseURL: API() });
    try {
      const res = await anon.get('/api/public/pricing');
      expect(res.status()).toBe(200);
      expect(res.headers()['cache-control']).toContain('max-age=60');
      const pub = (await res.json()).products as Record<string, { label: string; plans: Plan[] }>;
      const shown = pub[product.key];
      expect(shown.plans.find((p) => p.id === plan.id)?.price).toBe(plan.price);
      // The portal-service link and the on-sale flag are internal.
      expect(shown).not.toHaveProperty('serviceKey');
      expect(shown.plans[0]).not.toHaveProperty('active');
      // It is read-only: there is nothing to post to.
      expect((await anon.put(`/api/public/pricing/${product.key}`, { data: {} })).status()).toBe(404);
      // The full catalogue and the update route need a signed-in member of staff.
      expect((await anon.get('/api/pricing')).status()).toBe(401);
      expect((await anon.put(`/api/pricing/${product.key}`, { data: {} })).status()).toBe(401);
    } finally { await anon.dispose(); }
  });

  test('an admin changes a price and the website sees it; it is then put back', async () => {
    const admin = await apiAs('admin');
    const anon = await request.newContext({ baseURL: API() });
    const raised = plan.price + 1000;
    try {
      const put = await admin.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: raised }] } });
      expect(put.status()).toBe(200);
      const saved = (await put.json()).product as Product;
      expect(saved.plans.find((p) => p.id === plan.id)?.price).toBe(raised);
      // The other plans are untouched.
      for (const other of product.plans.filter((p) => p.id !== plan.id)) {
        expect(saved.plans.find((p) => p.id === other.id)?.price).toBe(other.price);
      }
      const pub = (await (await anon.get('/api/public/pricing')).json()).products;
      expect(pub[product.key].plans.find((p: Plan) => p.id === plan.id).price).toBe(raised);
    } finally {
      await admin.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: plan.price }] } });
      await admin.dispose(); await anon.dispose();
    }
    const after = (await catalogue()).find((p) => p.key === product.key)!;
    expect(after.plans.find((p) => p.id === plan.id)?.price).toBe(plan.price);
  });

  test('a plan taken off sale disappears from the website, and comes back', async () => {
    const admin = await apiAs('admin');
    const anon = await request.newContext({ baseURL: API() });
    try {
      expect((await admin.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, active: false }] } })).status()).toBe(200);
      const pub = (await (await anon.get('/api/public/pricing')).json()).products;
      expect((pub[product.key]?.plans ?? []).some((p: Plan) => p.id === plan.id)).toBe(false);
    } finally {
      await admin.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, active: true }] } });
      await admin.dispose(); await anon.dispose();
    }
  });

  test('bad edits are refused: unknown plan, zero price, unknown field, unknown product', async () => {
    const admin = await apiAs('admin');
    try {
      const put = (key: string, data: unknown) => admin.put(`/api/pricing/${key}`, { data }).then((r) => r.status());
      expect(await put(product.key, { plans: [{ id: 'no-such-plan', price: 500 }] })).toBe(400);
      expect(await put(product.key, { plans: [{ id: plan.id, price: 0 }] })).toBe(400);
      expect(await put(product.key, { plans: [{ id: plan.id, price: 1.5 }] })).toBe(400);
      expect(await put(product.key, { amount: 1 })).toBe(400);
      expect(await put('no-such-product', { plans: [{ id: plan.id, price: 500 }] })).toBe(404);
    } finally { await admin.dispose(); }
  });

  test('only an admin may change prices; a manager may read them; nobody else may', async () => {
    const manager = await apiAs('manager');
    expect((await manager.get('/api/pricing')).status()).toBe(200);
    expect((await manager.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: 1 }] } })).status()).toBe(403);
    await manager.dispose();
    for (const role of ['team', 'client', 'pro'] as const) {
      const api = await apiAs(role);
      expect((await api.get('/api/pricing')).status(), `${role} read`).toBe(403);
      expect((await api.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: 1 }] } })).status(), `${role} write`).toBe(403);
      await api.dispose();
    }
  });
});
