import { test, expect } from './fixtures';
import { createMatter, deleteMatter, deleteNewestClientMatter } from './api';

/**
 * E11 — Matters grid + Create Matter, on fresh matters (cleaned up after).
 * E13-S03 — the staff Matters grid shows a Due column (clients don't).
 */

test('staff Matters grid renders; client grid is framed as My Services', async ({ adminPage, clientPage }) => {
  // Create a fresh matter so the grid has a row — the Due column header only
  // renders when the grid is non-empty (an empty DB shows the empty state).
  const taskId = await createMatter();
  try {
    await adminPage.goto('tasks');
    await expect(adminPage.getByRole('heading', { name: 'All Matters' })).toBeVisible();
    await expect(adminPage.getByText('Due', { exact: true }).first()).toBeVisible(); // E13-S03 staff-only column

    await clientPage.goto('tasks');
    await expect(clientPage.getByRole('heading', { name: 'My Services' })).toBeVisible();
  } finally {
    await deleteMatter(taskId);
  }
});

test('client does NOT see a Create Matter button', async ({ clientPage }) => {
  await clientPage.goto('tasks');
  await expect(clientPage.getByRole('button', { name: /Create Matter/ })).toHaveCount(0);
});

test('admin creates a matter via the modal, then it can be deleted', async ({ adminPage }) => {
  await adminPage.goto('tasks');
  await adminPage.getByRole('button', { name: /Create Matter|Create/ }).first().click();
  await expect(adminPage.getByRole('heading', { name: 'Create Matter' })).toBeVisible();

  await adminPage.getByPlaceholder(/search clients/i).fill('E2E Client');
  await adminPage.getByRole('button', { name: /E2E Client/ }).first().click();
  // #104: Organisation is required on the matter (prefilled from the client, but
  // fill it explicitly so the test doesn't depend on the client's profile org).
  await adminPage.getByLabel('Organisation name').fill('E2E Test Org');
  // Service is the first select; the payment-status select (#51) is separate.
  await adminPage.locator('select').first().selectOption({ index: 1 });
  // #51: choose Full Payment so the matter is created active (not sent to approval).
  await adminPage.getByLabel('Payment status').selectOption('fully_paid');
  await adminPage.getByRole('spinbutton').first().fill('10000'); // Total Cost
  await adminPage.getByRole('spinbutton').nth(1).fill('10000');  // Amount Received

  const submit = adminPage.getByRole('button', { name: 'Create Matter' }).last();
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(adminPage.getByRole('heading', { name: 'Create Matter' })).toBeHidden();
  // Clean up the matter we just created through the UI (newest for the client).
  await deleteNewestClientMatter();
});

test('matter detail opens with Steps/Documents/Payments tabs', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await expect(adminPage.getByRole('button', { name: 'Steps', exact: true })).toBeVisible();
    await expect(adminPage.getByRole('button', { name: 'Documents', exact: true })).toBeVisible();
    await expect(adminPage.getByRole('button', { name: 'Payments', exact: true })).toBeVisible();
  } finally {
    await deleteMatter(taskId);
  }
});

test('#91: Matters grid supports multi-criteria filtering (Status + Payment, AND)', async ({ adminPage }) => {
  const taskId = await createMatter(); // active/pending, fully_paid
  try {
    await adminPage.goto('tasks');
    await expect(adminPage.getByRole('heading', { name: 'All Matters' })).toBeVisible();

    // Rows render as nested divs with `.cursor-pointer` on BOTH an outer wrapper
    // and an inner div, so counting `.cursor-pointer` counted elements, not rows.
    // `.border-b` isolates the outer row wrapper.
    const rows = adminPage.locator('.cursor-pointer.border-b');
    const totalBefore = await rows.count();
    expect(totalBefore).toBeGreaterThan(0);

    const statusFilter = adminPage.getByLabel('Filter by status');
    const paymentFilter = adminPage.getByLabel('Filter by payment');
    await expect(statusFilter).toBeVisible();
    await expect(paymentFilter).toBeVisible();

    // Assert the FILTER's effect rather than the presence of one specific matter:
    // every e2e matter shares the seeded client, and the grid row does not render
    // the organisation, so a row cannot be pinned to this test's matter. Other
    // specs leave matters in various states (the #94 payment-gate ones are
    // deliberately not_paid), which made the old "expect 0 rows" assertion depend
    // on suite order and cleanup instead of on filtering working.
    await statusFilter.selectOption('completed');
    await expect.poll(() => rows.count()).toBeLessThan(totalBefore);
    const completedOnly = await rows.count();
    // Every surviving row really is completed.
    for (let i = 0; i < completedOnly; i++) {
      await expect(rows.nth(i)).toContainText(/completed/i);
    }

    // AND semantics: adding a second criterion can only narrow further.
    await paymentFilter.selectOption('not_paid');
    await expect.poll(() => rows.count()).toBeLessThanOrEqual(completedOnly);

    // Clear resets everything.
    await adminPage.getByRole('button', { name: 'Clear' }).click();
    await expect.poll(() => rows.count()).toBe(totalBefore);
  } finally {
    await deleteMatter(taskId);
  }
});

test('#91: Excel-style column filter — tick a status value to filter, clear to reset', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto('tasks');
    // Scope to grid rows (see note above) so dropdown <option>s can't match.
    const clientRow = adminPage.locator('.cursor-pointer').filter({ hasText: 'E2E Client' });
    await expect(clientRow.first()).toBeVisible();

    // Open the Status column's funnel menu.
    await adminPage.getByRole('button', { name: 'Filter status' }).click();
    // The popover lists the column's distinct values with checkboxes. Tick a value
    // that does NOT match the fresh matter ('completed' — the new matter is
    // active/pending), which filters the grid down to only completed rows.
    const popover = adminPage.locator('div').filter({ has: adminPage.getByPlaceholder('Search values…') }).last();
    const completedOption = popover.locator('label', { hasText: /^completed$/ });
    test.skip(!(await completedOption.count()), 'No completed matters in the grid to filter by.');
    await completedOption.locator('input[type="checkbox"]').check();

    // The fresh (non-completed) matter's row disappears.
    await expect(clientRow).toHaveCount(0);

    // Clear inside the popover restores it.
    await popover.getByRole('button', { name: /clear/i }).click();
    await expect(clientRow.first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

/* ── #177: the browser tab identifies the current page ──────────────────────── */

test('#177: tab titles follow the route, and a matter names itself', async ({ adminPage }) => {
  const taskId = await createMatter({ organisation: 'E2E Title Org' });
  try {
    // Every page used to read "Legal Terminus Portal", so several open matters
    // were indistinguishable in the tab bar.
    await adminPage.goto('tasks');
    await expect.poll(() => adminPage.title()).toContain('Matters');

    await adminPage.goto('users');
    await expect.poll(() => adminPage.title()).toContain('Users');

    // The matter tab carries enough to tell it apart from another matter.
    await adminPage.goto(`tasks/${taskId}`);
    await expect.poll(() => adminPage.title(), { timeout: 15_000 }).toContain('E2E Title Org');
    expect(await adminPage.title()).toContain('Legal Terminus');
  } finally {
    await deleteMatter(taskId);
  }
});

test('#177: a client sees their own vocabulary in the tab', async ({ clientPage }) => {
  // The nav says "My Services" to a client, not "Matters" — the title follows
  // the same per-role wording rather than restating it.
  await clientPage.goto('tasks');
  await expect.poll(() => clientPage.title()).toContain('My Services');
});
