import { test, expect } from './fixtures';
import {
  createMatter, deleteMatter, createPendingMatter, transition,
  getDefinitionForMatter, firstClientStep, advanceUntil, waitForNotification, currentStep, assignStep,
} from './api';

/**
 * E07-S01 — in-app notifications fire for the key workflow events and reach the
 * right recipient. The bell renders for staff; each event is verified via the
 * notifications API (deterministic). Fresh state per test.
 */

test('notification bell is present for staff', async ({ adminPage }) => {
  await adminPage.goto('dashboard');
  await expect(adminPage.getByRole('button', { name: 'Notifications' })).toBeVisible();
});

test('the full /notifications page renders for all roles', async ({ adminPage, clientPage }) => {
  await adminPage.goto('notifications');
  await expect(adminPage.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  // Reachable from the bell dropdown's "View all" link too.
  await adminPage.goto('dashboard');
  await adminPage.getByRole('button', { name: 'Notifications' }).click();
  await adminPage.getByRole('button', { name: /view all notifications/i }).click();
  await expect(adminPage).toHaveURL(/\/notifications/);

  // Clients have a notifications page as well.
  await clientPage.goto('notifications');
  await expect(clientPage.getByRole('heading', { name: 'Notifications' })).toBeVisible();
});

test('approving a pending matter notifies the creator (manager)', async ({ adminPage }) => {
  const pendingId = await createPendingMatter(); // manager-created
  try {
    await adminPage.goto(`tasks/${pendingId}`);
    await adminPage.getByRole('button', { name: 'Approve' }).click();
    await expect(adminPage.getByText(/awaiting your approval/i)).toBeHidden();
    expect(await waitForNotification('manager', /approved/i)).toBeTruthy();
  } finally { await deleteMatter(pendingId); }
});

test('rejecting a pending matter notifies the creator (manager)', async ({ adminPage }) => {
  const pendingId = await createPendingMatter();
  try {
    await adminPage.goto(`tasks/${pendingId}`);
    await adminPage.getByRole('button', { name: 'Reject' }).click();
    await adminPage.getByPlaceholder(/reason for rejection/i).fill('E2E reject reason');
    await adminPage.getByRole('button', { name: /confirm rejection/i }).click();
    await expect(adminPage.getByText(/this matter was rejected/i)).toBeVisible();
    expect(await waitForNotification('manager', /rejected/i)).toBeTruthy();
  } finally { await deleteMatter(pendingId); }
});

test('reassigning a step notifies the new assignee (UI-driven)', async ({ adminPage, managerPage }) => {
  const taskId = await createMatter();
  try {
    const managerUid = process.env.E2E_MANAGER_UID!;
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const ownerSelect = adminPage.locator(`select:has(option[value="${managerUid}"])`).last();
    await ownerSelect.selectOption(managerUid);

    // Verify via API (fast) AND that the bell surfaces it in the UI.
    expect(await waitForNotification('manager', /(step|matter) assigned to you/i)).toBeTruthy();
    await managerPage.goto('dashboard');
    await managerPage.getByRole('button', { name: 'Notifications' }).click();
    await expect(managerPage.getByText(/(step|matter) assigned to you/i).first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('client document upload notifies the reviewer; review notifies the client', async ({ adminPage, clientPage }) => {
  const taskId = await createMatter();
  try {
    // Route the active step to the team member so they are the reviewer.
    const step = await currentStep(taskId);
    await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

    // Client uploads a doc → reviewer (team) gets "Document awaiting review".
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Documents', exact: true }).click();
    await expect(clientPage.getByText('Upload a document', { exact: true })).toBeVisible();
    await clientPage.locator('input[type="file"]').first().setInputFiles({
      name: `notif-${Date.now()}.pdf`, mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\ntrailer<</Root 1 0 R>>\n%%EOF', 'utf8'),
    });
    await expect(clientPage.getByText(/awaiting review|uploaded/i)).toBeVisible();
    expect(await waitForNotification('team', /document awaiting review/i)).toBeTruthy();

    // Staff approves → client gets "Document approved".
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Documents', exact: true }).click();
    await adminPage.getByRole('button', { name: 'Approve' }).first().click();
    await expect(adminPage.getByText('Approved').first()).toBeVisible();
    expect(await waitForNotification('client', /document approved/i)).toBeTruthy();
  } finally { await deleteMatter(taskId); }
});

test('advancing past a client step notifies the client it is their turn', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const def = await getDefinitionForMatter(taskId);
    const clientStep = firstClientStep(def);
    test.skip(!clientStep, 'No client step in this workflow.');
    // Advance to the step just before the client step, then complete into it.
    await advanceUntil(taskId, (s) => s.stepNumber === clientStep!.stepNumber);
    expect(await waitForNotification('client', /action needed on your service/i)).toBeTruthy();
    void adminPage;
  } finally { await deleteMatter(taskId); }
});
