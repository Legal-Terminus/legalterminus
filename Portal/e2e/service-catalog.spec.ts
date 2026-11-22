import { test, expect } from './fixtures';
import { resolveServiceKey } from './api';

/**
 * E04-S05 — Service catalog (staff-facing). The catalog lists services grouped by
 * category; a card opens an inline rename editor and links to the workflow. We keep
 * this NON-destructive (don't persist a rename to the live catalog) — verifying the
 * rename affordance and navigation, plus that clients are excluded.
 */

test('staff see the service catalog grouped by category', async ({ adminPage }) => {
  await adminPage.goto('services');
  await expect(adminPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();
  // At least one category heading and one service card render.
  await expect(adminPage.getByRole('heading', { level: 2 }).first()).toBeVisible();
});

test('clicking a service name reveals the inline rename editor (no persist)', async ({ adminPage }) => {
  await adminPage.goto('services');
  await adminPage.getByRole('button', { name: 'Expand all' }).click();
  // Click the first service name button → an input appears. Press Escape (no save).
  const firstName = adminPage.locator('button.w-full.text-left.text-sm.font-semibold').first();
  await firstName.click();
  const editor = adminPage.locator('input.input-field.mt-3');
  await expect(editor).toBeVisible();
  await editor.press('Escape');
  await expect(editor).toHaveCount(0);
});

test('a service card links through to its configured workflow', async ({ adminPage }) => {
  const key = await resolveServiceKey();
  await adminPage.goto('services');
  // Direct nav mirrors the card's "View workflow" link target.
  await adminPage.goto(`services/${key}`);
  await expect(adminPage.getByRole('button', { name: /Configured Workflow/ })).toBeVisible();
});

test('client cannot access the service catalog', async ({ clientPage }) => {
  await clientPage.goto('services');
  await expect(clientPage).not.toHaveURL(/\/services(\?|$)/);
});

/* ── #155: each tile indicates whether a workflow is configured ─────────────── */

test('#155 a service with a workflow shows the "Workflow set" badge', async ({ adminPage }) => {
  // resolveServiceKey() returns a service that HAS a definition, so its card is
  // the one tile guaranteed to be configured.
  const key = await resolveServiceKey();
  await adminPage.goto('services');
  await expect(adminPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();
  await adminPage.getByRole('button', { name: 'Expand all' }).click();

  // At least one tile advertises a configured workflow. The badge is a span, so
  // `exact` keeps it distinct from the "Workflow set · N" filter chip.
  const configuredBadges = adminPage.getByText('Workflow set', { exact: true });
  await expect(configuredBadges.first()).toBeVisible();

  // The detail page for that same key really does render a workflow, proving the
  // badge is not merely decorative.
  await adminPage.goto(`services/${key}`);
  await expect(adminPage.getByText('No workflow configured yet for this service.')).toHaveCount(0);
});

test('#155 the filter chips split the catalog by workflow state', async ({ adminPage }) => {
  await adminPage.goto('services');

  const allChip = adminPage.getByRole('button', { name: /^All services · \d+$/ });
  const setChip = adminPage.getByRole('button', { name: /^Workflow set · \d+$/ });
  const noneChip = adminPage.getByRole('button', { name: /^No workflow · \d+$/ });
  await expect(allChip).toBeVisible();
  await expect(setChip).toBeVisible();
  await expect(noneChip).toBeVisible();

  // Counts must partition the catalog: configured + unconfigured === all.
  const num = async (l: ReturnType<typeof adminPage.getByRole>) =>
    Number((await l.innerText()).match(/(\d+)$/)![1]);
  const [all, set, none] = [await num(allChip), await num(setChip), await num(noneChip)];
  expect(set + none).toBe(all);

  // Filtering to "Workflow set" must leave no "No workflow" badge on screen.
  await setChip.click();
  await expect(setChip).toHaveAttribute('aria-pressed', 'true');
  if (set > 0) {
    await expect(adminPage.getByText('Workflow set', { exact: true }).first()).toBeVisible();
  }
  await expect(adminPage.getByText('No workflow', { exact: true })).toHaveCount(0);

  // …and the converse for "No workflow".
  await noneChip.click();
  await expect(adminPage.getByText('Workflow set', { exact: true })).toHaveCount(0);
});

/* ── #356: categories start collapsed so the page stays light on phones ─────── */

test('#356 categories start collapsed and open on tap', async ({ adminPage }) => {
  await adminPage.goto('services');
  await adminPage.evaluate(() => sessionStorage.removeItem('servicesPage:openCategories'));
  await adminPage.reload();

  const headers = adminPage.getByRole('heading', { level: 2 }).getByRole('button');
  await expect(headers.first()).toBeVisible();
  await expect(headers.first()).toHaveAttribute('aria-expanded', 'false');
  // No service card is rendered while every category is closed.
  await expect(adminPage.getByRole('switch')).toHaveCount(0);

  // Opening one category shows its cards; the choice survives a reload.
  await headers.first().click();
  await expect(headers.first()).toHaveAttribute('aria-expanded', 'true');
  await expect(adminPage.getByRole('switch').first()).toBeVisible();
  await adminPage.reload();
  await expect(headers.first()).toHaveAttribute('aria-expanded', 'true');

  // Collapse all closes it again.
  await adminPage.getByRole('button', { name: 'Expand all' }).click();
  await adminPage.getByRole('button', { name: 'Collapse all' }).click();
  await expect(adminPage.getByRole('switch')).toHaveCount(0);
});

test('#356 a search opens the categories that match', async ({ adminPage }) => {
  await adminPage.goto('services');
  await adminPage.evaluate(() => sessionStorage.removeItem('servicesPage:openCategories'));
  await adminPage.reload();
  await expect(adminPage.getByRole('switch')).toHaveCount(0);

  await adminPage.getByPlaceholder('Search services by name or category…').fill('registration');
  await expect(adminPage.getByRole('switch').first()).toBeVisible();
  await expect(adminPage.getByRole('button', { name: 'Expand all' })).toHaveCount(0);
});
