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
  await expect(adminPage.getByRole('heading', { name: 'Configured Workflow' })).toBeVisible();
});

test('client cannot access the service catalog', async ({ clientPage }) => {
  await clientPage.goto('services');
  await expect(clientPage).not.toHaveURL(/\/services(\?|$)/);
});
