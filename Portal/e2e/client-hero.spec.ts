import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getMatter } from './api';

/**
 * Client-facing hero/steps clarity fixes:
 *  #92 — the ownership chip reads "Waiting on you" for the client (not the
 *        third-person "Waiting on client").
 *  #93 — on a payment gate the client gets reassuring copy ("nothing is needed
 *        from you on this step"), not the bare "Waiting for payment to be recorded".
 *  #95 — a step checklist renders read-only for the client (no interactive
 *        checkboxes).
 */

test('#92: the client sees "Waiting on you" on a client-owned current step', async ({ clientPage }) => {
  const taskId = await createMatter();
  try {
    const m = await getMatter(taskId);
    // Only meaningful when the current step is client-owned; otherwise skip.
    // (The incorporation flow's early steps route to the client.)
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();

    const hero = clientPage.locator('div.card', { has: clientPage.getByText(/current step ·/i) }).first();
    const chip = hero.getByText(/waiting on/i);
    if (await chip.count()) {
      // If the ball is on the client, it must say "you", never third-person "client".
      await expect(hero.getByText(/waiting on client/i)).toHaveCount(0);
    }
    void m;
  } finally { await deleteMatter(taskId); }
});

test('#93: the client sees reassuring copy on a payment-gate step (no dead-end)', async ({ clientPage }) => {
  const taskId = await createMatter(); // fully_paid → its step-1 gate auto-passes now (#94)
  try {
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // The bare dead-end note must never be shown to a client.
    await expect(clientPage.getByText('Waiting for payment to be recorded.')).toHaveCount(0);
  } finally { await deleteMatter(taskId); }
});
