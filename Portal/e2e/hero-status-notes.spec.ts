import { test, expect } from './fixtures';
import { createStatusNotesMatter, deleteMatter, deleteDefinition } from './api';

/**
 * #81/#82 — the current-step HERO panel (the primary place a user looks and
 * acts) previously never rendered the audience-specific status/notes or the
 * multi-description text configured in Step Settings — those only rendered in
 * the collapsed step LIST row, which most users never open for the active step.
 * That's why "the status isn't showing/updating" even though the data saved
 * correctly. Fixed by passing statusFor()/descFor() into StepHeroPanel too.
 */

let taskId: string;
let defId: string;
test.beforeEach(async () => { ({ taskId, defId } = await createStatusNotesMatter()); });
test.afterEach(async () => { await deleteMatter(taskId); await deleteDefinition(defId); });

test('#81: staff see the INTERNAL status + notes + description on the current-step hero panel', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

  // Scope to the hero panel (the "Current step ·" card) — the status/description
  // legitimately also appears in the step LIST row below, so an unscoped text
  // locator is ambiguous. Proving it in the HERO is the point of this test (#81).
  const hero = adminPage.locator('div.card', { has: adminPage.getByText(/current step ·/i) }).first();
  await expect(hero.getByText('INTERNAL-ABCD')).toBeVisible();
  await expect(hero.getByText(/only staff see this note/i)).toBeVisible();
  await expect(hero.getByText(/internal description text/i)).toBeVisible();
  await expect(hero.getByText('CLIENT-ABCD')).toHaveCount(0);
  await expect(hero.getByText(/shown to the client/i)).toHaveCount(0);
});

test('#81: the client sees the CLIENT status + note + description, never the internal ones', async ({ clientPage }) => {
  await clientPage.goto(`tasks/${taskId}`);
  await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();

  const hero = clientPage.locator('div.card', { has: clientPage.getByText(/current step ·/i) }).first();
  await expect(hero.getByText('CLIENT-ABCD')).toBeVisible();
  await expect(hero.getByText(/shown to the client/i)).toBeVisible();
  await expect(hero.getByText(/client description text/i)).toBeVisible();
  await expect(hero.getByText('INTERNAL-ABCD')).toHaveCount(0);
  await expect(hero.getByText(/only staff see this note/i)).toHaveCount(0);
  await expect(hero.getByText(/internal description text/i)).toHaveCount(0);
});
