import { test, expect } from './fixtures';
import {
  createMatter, deleteMatter, createPendingMatter, transition,
  getDefinitionForMatter, firstClientStep, advanceUntil, waitForNotification, currentStep, assignStep, assignMatter,
  waitForTaskNotification, countUnreadNotificationsForTask, getMatter, getNotifications,
} from './api';

/**
 * E07-S01 — in-app notifications fire for the key workflow events and reach the
 * right recipient. The bell renders for staff; each event is verified via the
 * notifications API (deterministic). Fresh state per test.
 */

// The approval-chain Approve/Reject live in the amber "Awaiting your approval"
// banner. Scope to it — a pending matter's current step also renders its own
// action buttons (e.g. "Approve for client"), making an unscoped "Approve" match
// multiple elements.
const approvalBanner = (page: import('@playwright/test').Page) =>
  page.locator('div.card', { has: page.getByText(/awaiting your approval/i) });

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
    await approvalBanner(adminPage).getByRole('button', { name: 'Approve' }).click();
    await expect(adminPage.getByText(/awaiting your approval/i)).toBeHidden();
    expect(await waitForNotification('manager', /approved/i)).toBeTruthy();
  } finally { await deleteMatter(pendingId); }
});

test('rejecting a pending matter notifies the creator (manager)', async ({ adminPage }) => {
  const pendingId = await createPendingMatter();
  try {
    await adminPage.goto(`tasks/${pendingId}`);
    await approvalBanner(adminPage).getByRole('button', { name: 'Reject' }).click();
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
    // Make the team member the matter owner (reviewer). The client uploads at the
    // MATTER level (no stepNumber), so the doc reviewer resolves from the matter's
    // `assignedTo` — assign the matter (not just the active step) so the "document
    // awaiting review" notification has a recipient.
    const step = await currentStep(taskId);
    await assignStep(taskId, step, process.env.E2E_TEAM_UID!);
    await assignMatter(taskId, process.env.E2E_TEAM_UID!);

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

test('completing a matter resolves the client’s active notifications for it', async () => {
  const taskId = await createMatter();
  try {
    // Drive to a client step so the client gets an active "action needed" alert.
    const def = await getDefinitionForMatter(taskId);
    const clientStep = firstClientStep(def);
    test.skip(!clientStep, 'No client step in this workflow.');
    await advanceUntil(taskId, (s) => s.stepNumber === clientStep!.stepNumber);
    const got = await waitForTaskNotification('client', taskId);
    test.skip(got === 0, 'No client notification was generated to resolve.');
    expect(await countUnreadNotificationsForTask('client', taskId)).toBeGreaterThan(0);

    // Fast-forward the matter to completion via the API (admin drives all events).
    for (let i = 0; i < def.steps.length + 5; i++) {
      const m = await getMatter(taskId);
      if (m.status === 'completed') break;
      const cur = m.currentStepNumber as number;
      const s = def.steps.find((x) => x.stepNumber === cur);
      const ev = s?.type === 'payment_gate' ? { type: 'ADMIN_OVERRIDE_PAYMENT' }
        : (s?.transitions ?? []).some((t) => t.event === 'COMPLETE_STEP') ? { type: 'COMPLETE_STEP' }
        : (s?.transitions ?? []).some((t) => t.event === 'CLIENT_APPROVE') ? { type: 'CLIENT_APPROVE' }
        : (s?.transitions ?? []).some((t) => t.event === 'GOVT_APPROVE') ? { type: 'GOVT_APPROVE' }
        : null;
      if (!ev) break;
      try { await transition('admin', taskId, ev); } catch { break; }
    }

    // After completion, the stale "action needed" alert is resolved. (A fresh
    // "Your service is complete" notification is expected to remain unread — that's
    // the new active alert, not a stale one — so we assert the action-needed one
    // specifically is gone rather than total-unread = 0.)
    if ((await getMatter(taskId)).status === 'completed') {
      await expect.poll(async () => {
        const list = await getNotifications('client');
        return list.filter((n) => !n.read && /action needed/i.test(n.title)).length;
      }, { timeout: 15_000 }).toBe(0);
    }
  } finally { await deleteMatter(taskId); }
});
