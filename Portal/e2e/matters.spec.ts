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
