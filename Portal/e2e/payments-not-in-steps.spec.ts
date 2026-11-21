import { test, expect } from './fixtures';
import { apiAs, assignMatter, createPartPaidMatter, deleteMatter } from './api';
import { env, openMatter } from './helpers';

/**
 * #296 (supersedes #293 part 2) — payment messages are not shown in the Steps
 * tab, to anyone.
 *
 * Two things used to appear there:
 *  - a blinking amber "Part payment received" banner, for the client and staff;
 *  - the payment entry ("Payment received: ₹2500 via UPI. ₹3500 remaining of
 *    ₹10000.") as the current step's "From the previous step" note — shown to
 *    team members too, who must never see a matter's figures (#148).
 *
 * Payments stay on the Payments tab, and the activity history of admins and
 * managers keeps the entry. The API no longer returns payment entries in a
 * team member's activity feed at all.
 */

const PAYMENT_NOTE = /Payment received: ₹2500/;

test('#296: no part-payment banner and no payment note in Steps; Payments tab unchanged', async ({ adminPage, teamPage, clientPage }) => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    const paid = await api.post(`/api/tasks/${taskId}/payments`, { data: { amount: 2500, mode: 'UPI' } });
    expect(paid.status()).toBe(201);
    await assignMatter(taskId, env('E2E_TEAM_UID'));

    // Admin: the Steps tab carries no banner and no payment note…
    await openMatter(adminPage, taskId);
    await expect(adminPage.getByText('Current step', { exact: false }).first()).toBeVisible();
    await expect(adminPage.getByText('Part payment received')).toHaveCount(0);
    await expect(adminPage.getByText(/Only part payment received/)).toHaveCount(0);
    await expect(adminPage.getByText('From the previous step')).toHaveCount(0);
    // …but the Payments tab still lists the payment.
    await openMatter(adminPage, taskId, 'Payments');
    await expect(adminPage.getByText('₹2,500').or(adminPage.getByText('₹2500')).first()).toBeVisible();

    // Team member: nothing about payments on the Steps tab.
    await openMatter(teamPage, taskId);
    await expect(teamPage.getByText('Current step', { exact: false }).first()).toBeVisible();
    await expect(teamPage.getByText(PAYMENT_NOTE)).toHaveCount(0);
    await expect(teamPage.getByText('Part payment received')).toHaveCount(0);

    // Client: no blinking banner.
    await openMatter(clientPage, taskId);
    await expect(clientPage.getByText('Current step', { exact: false }).first()).toBeVisible();
    await expect(clientPage.getByText('Part payment received')).toHaveCount(0);
    await expect(clientPage.locator('.animate-pulse')).toHaveCount(0);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#293/#296: the activity feed holds payment entries for admin and manager only', async () => {
  const taskId = await createPartPaidMatter();
  const admin = await apiAs('admin');
  try {
    expect((await admin.post(`/api/tasks/${taskId}/payments`, { data: { amount: 2500, mode: 'UPI' } })).status()).toBe(201);
    await assignMatter(taskId, env('E2E_TEAM_UID'));

    const typesFor = async (role: 'admin' | 'manager' | 'team') => {
      const api = role === 'admin' ? admin : await apiAs(role);
      const res = await api.get(`/api/tasks/${taskId}/events`);
      expect(res.ok(), `${role} reads the activity`).toBeTruthy();
      const body = await res.json();
      const list = (Array.isArray(body) ? body : body.data ?? body.events ?? []) as Array<{ type: string; comment?: string | null }>;
      if (api !== admin) await api.dispose();
      return list;
    };

    expect((await typesFor('admin')).some((e) => e.type === 'PAYMENT_RECORDED')).toBe(true);
    expect((await typesFor('manager')).some((e) => e.type === 'PAYMENT_RECORDED')).toBe(true);
    const team = await typesFor('team');
    expect(team.some((e) => e.type.startsWith('PAYMENT_') || e.type.startsWith('REFUND_')), 'team sees no payment entries').toBe(false);
    expect(team.some((e) => /₹/.test(e.comment ?? '')), 'team sees no amounts').toBe(false);
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});
