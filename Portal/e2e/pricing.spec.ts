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
type Product = { key: string; code: string; label: string; serviceKey: string | null; pages: { path: string; title: string }[]; plans: Plan[] };

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
    // +1 keeps the price below any crossed-out price, which must stay higher.
    const raised = plan.price + 1;
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

  test('an admin or a manager may change prices; nobody else may read or change them', async () => {
    const manager = await apiAs('manager');
    const anon = await request.newContext({ baseURL: API() });
    try {
      expect((await manager.get('/api/pricing')).status()).toBe(200);
      // #241: a manager's change reaches the website like an admin's.
      const put = await manager.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: plan.price + 1 }] } });
      expect(put.status()).toBe(200);
      const pub = (await (await anon.get('/api/public/pricing')).json()).products;
      expect(pub[product.key].plans.find((p: Plan) => p.id === plan.id).price).toBe(plan.price + 1);
    } finally {
      await manager.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: plan.price }] } });
      await manager.dispose(); await anon.dispose();
    }
    for (const role of ['team', 'client', 'pro'] as const) {
      const api = await apiAs(role);
      expect((await api.get('/api/pricing')).status(), `${role} read`).toBe(403);
      expect((await api.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: 1 }] } })).status(), `${role} write`).toBe(403);
      await api.dispose();
    }
  });
});

test.describe.serial('E24-S01 Website prices screen', () => {
  let product: Product;
  let plan: Plan;

  test.beforeAll(async () => {
    const products = await catalogue();
    test.skip(products.length === 0, 'the price catalogue is not seeded in this database');
    product = products.find((p) => p.plans.length > 1) ?? products[0];
    [plan] = product.plans;
  });

  test('an admin finds a service, changes a price and saves it', async ({ adminPage: page }) => {
    const raised = plan.price + 1;
    try {
      await page.goto('settings/pricing');
      await expect(page.getByRole('heading', { name: 'Website prices' })).toBeVisible();
      await page.getByLabel('Search services').fill(product.code);
      const card = page.getByRole('region', { name: `${product.code} ${product.label}`, exact: true });
      await card.getByRole('button', { expanded: false }).click();

      const group = card.getByRole('group', { name: plan.name }).first();
      // Each service says which page of the website it is, and links to it.
      await expect(card.getByText(product.code, { exact: true })).toBeVisible();
      await expect(card.locator(`a[href$="${product.pages[0].path}"]`)).toBeVisible();

      const price = group.getByLabel('Price (₹)', { exact: true });
      await expect(price).toHaveValue(String(plan.price));
      const save = card.getByRole('button', { name: 'Save prices' });
      await expect(save).toBeDisabled();

      // A crossed-out price that is not higher than the price is refused before saving.
      await price.fill(String(plan.price + 5));
      await group.getByLabel('Crossed-out price (₹)').fill(String(plan.price));
      await expect(card.getByRole('alert')).toContainText('must be higher than the price');
      await expect(save).toBeDisabled();
      await card.getByRole('button', { name: 'Undo changes' }).click();
      await expect(price).toHaveValue(String(plan.price));

      await price.fill(String(raised));
      await save.click();
      await expect(page.getByText(/prices saved/)).toBeVisible();
      const after = (await catalogue()).find((p) => p.key === product.key)!;
      expect(after.plans.find((p) => p.id === plan.id)?.price).toBe(raised);
    } finally {
      const admin = await apiAs('admin');
      await admin.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: plan.price }] } });
      await admin.dispose();
    }
  });

  test('the last plan on sale cannot be switched off', async ({ adminPage: page }) => {
    await page.goto('settings/pricing');
    await page.getByLabel('Search services').fill(product.code);
    const card = page.getByRole('region', { name: `${product.code} ${product.label}`, exact: true });
    await card.getByRole('button', { expanded: false }).click();
    for (const box of await card.getByLabel('On sale').all()) await box.uncheck();
    await expect(card.getByRole('alert')).toContainText('Keep at least one plan on sale');
    await expect(card.getByRole('button', { name: 'Save prices' })).toBeDisabled();
  });

  test('a manager can change prices too; a team member cannot open the screen', async ({ managerPage, teamPage }) => {
    const raised = plan.price + 1;
    try {
      await managerPage.goto('settings/pricing');
      await expect(managerPage.getByText('Only an admin or a manager can change them.')).toHaveCount(0);
      await managerPage.getByLabel('Search services').fill(product.code);
      const card = managerPage.getByRole('region', { name: `${product.code} ${product.label}`, exact: true });
      await card.getByRole('button', { expanded: false }).click();
      const price = card.getByRole('group', { name: plan.name }).first().getByLabel('Price (₹)', { exact: true });
      await price.fill(String(raised));
      await card.getByRole('button', { name: 'Save prices' }).click();
      await expect(managerPage.getByText(/prices saved/)).toBeVisible();
      const after = (await catalogue()).find((p) => p.key === product.key)!;
      expect(after.plans.find((p) => p.id === plan.id)?.price).toBe(raised);
    } finally {
      const admin = await apiAs('admin');
      await admin.put(`/api/pricing/${product.key}`, { data: { plans: [{ id: plan.id, price: plan.price }] } });
      await admin.dispose();
    }

    await teamPage.goto('settings/pricing');
    await expect(teamPage).toHaveURL(/\/unauthorized/);
  });
});

/**
 * #221 — the trademark page's required "Proposed to be Used" / "Prior User"
 * question. The browser sends the ANSWER; the server adds its surcharge to the
 * plan before GST. No answer, or an unknown one, is a 400. The surcharge is
 * edited under Website Prices (admin and manager) and is put back here.
 */
type Choice = { label: string; options: { id: string; name: string; surcharge: number }[] };
type Quote = { price: number; gst: number; amount: number; lines: { planName: string }[] };

test.describe.serial('#221 trademark user type', () => {
  let product: Product & { choice: Choice };
  let plan: Plan;
  let prior: Choice['options'][number];
  let proposed: Choice['options'][number];
  let gstPercent = 0;
  const withGst = (price: number) => Math.round(price * (100 + gstPercent)) / 100;

  test.beforeAll(async () => {
    const products = await catalogue() as (Product & { choice?: Choice })[];
    const tm = products.find((p) => p.key === 'trademark-application' && p.choice);
    test.skip(!tm, 'the trademark product is not in this catalogue');
    product = tm as Product & { choice: Choice };
    plan = product.plans.find((p) => p.active !== false)!;
    prior = product.choice.options.find((o) => o.surcharge > 0)!;
    proposed = product.choice.options.find((o) => o.surcharge === 0)!;
    const anon = await request.newContext({ baseURL: API() });
    try { gstPercent = (await (await anon.get('/api/public/pricing')).json()).gstPercent; } finally { await anon.dispose(); }
  });

  test('the website is told the question; the price is the plan plus the answer’s surcharge, GST on top', async () => {
    const anon = await request.newContext({ baseURL: API() });
    const client = await apiAs('client');
    try {
      const pub = (await (await anon.get('/api/public/pricing')).json()).products[product.key];
      expect(pub.choice.options.map((o: { id: string }) => o.id)).toEqual(product.choice.options.map((o) => o.id));

      const quote = async (data: Record<string, unknown>) => client.post('/api/orders/quote', { data });
      const one = { productKey: product.key, planId: plan.id };
      const p = await (await quote({ ...one, optionId: proposed.id })).json() as Quote;
      expect(p.price).toBe(plan.price);
      expect(p.amount).toBe(withGst(plan.price));
      const q = await (await quote({ ...one, optionId: prior.id })).json() as Quote;
      expect(q.price).toBe(plan.price + prior.surcharge);
      expect(q.amount).toBe(withGst(plan.price + prior.surcharge));
      expect(q.lines[0].planName).toContain(prior.name);
      // The same in a cart line.
      const cart = await (await quote({ items: [{ ...one, optionId: prior.id }] })).json() as Quote;
      expect(cart.amount).toBe(q.amount);

      // No answer, an unknown answer, or a surcharge from the browser: refused.
      const none = await quote(one);
      expect(none.status()).toBe(400);
      expect((await none.json()).message).toMatch(new RegExp(prior.name));
      expect((await quote({ ...one, optionId: 'no-such-user-type' })).status()).toBe(400);
      expect((await quote({ items: [{ ...one, optionId: 'no-such-user-type' }] })).status()).toBe(400);
      expect((await quote({ ...one, optionId: prior.id, surcharge: 0 })).status()).toBe(400);
    } finally { await anon.dispose(); await client.dispose(); }
  });

  test('a manager changes the Prior User surcharge on Website Prices; the price follows; it is put back', async ({ managerPage: page }) => {
    const raised = prior.surcharge + 100;
    const client = await apiAs('client');
    try {
      await page.goto('settings/pricing');
      await page.getByLabel('Search services').fill(product.code);
      const card = page.getByRole('region', { name: `${product.code} ${product.label}`, exact: true });
      await card.getByRole('button', { expanded: false }).click();
      const field = card.getByLabel(`${prior.name} (₹)`);
      await expect(field).toHaveValue(String(prior.surcharge));
      await field.fill('2.5');
      await expect(card.getByRole('alert')).toContainText('whole rupees');
      await field.fill(String(raised));
      await card.getByRole('button', { name: 'Save prices' }).click();
      await expect(page.getByText(/prices saved/)).toBeVisible();

      const q = await (await client.post('/api/orders/quote', { data: { productKey: product.key, planId: plan.id, optionId: prior.id } })).json() as Quote;
      expect(q.price).toBe(plan.price + raised);
    } finally {
      const admin = await apiAs('admin');
      await admin.put(`/api/pricing/${product.key}`, { data: { choice: { options: [{ id: prior.id, surcharge: prior.surcharge }] } } });
      await admin.dispose(); await client.dispose();
    }
    const after = (await catalogue() as (Product & { choice?: Choice })[]).find((p) => p.key === product.key)!;
    expect(after.choice!.options.find((o) => o.id === prior.id)!.surcharge).toBe(prior.surcharge);
  });
});
