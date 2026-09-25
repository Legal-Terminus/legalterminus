import { test, expect } from './fixtures';
import {
  createClientAssignedMatter, deleteMatter, deleteDefinition, currentStep,
  transition, transitionStatusAs, assignMatter,
} from './api';

/**
 * #204 — "Who does this? → The client" on a step that is not an
 * approval. The client saw "Name & Objects Pending" with no comment box and no
 * Submit, while the internal team got the button as an override. The client now
 * completes such a step themselves, and the workflow moves on.
 *
 * Fixture: 1 client "Split into options" (one option, "Submit") → 2 team step →
 * 3 client plain step → 4 end.
 */

const heroOf = (page: import('@playwright/test').Page) =>
  page.locator('div.card', { has: page.getByText(/current step ·/i) }).first();

test.describe('client-assigned steps (#204)', () => {
  let taskId = '';
  let defId = '';

  test.beforeEach(async () => {
    ({ taskId, defId } = await createClientAssignedMatter());
  });
  test.afterEach(async () => {
    await deleteMatter(taskId);
    await deleteDefinition(defId);
  });

  test('the client answers a "Split into options" step and the workflow advances', async ({ clientPage }) => {
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const hero = heroOf(clientPage);
    await expect(hero.getByText('Name & Objects Pending')).toBeVisible();
    await expect(hero.getByText(/waiting on you/i)).toBeVisible();

    // The comment box and the option button are the client's.
    await hero.locator('[contenteditable="true"]').first().fill('Proposed: Acme Widgets Pvt Ltd — manufacturing of widgets');
    await hero.getByRole('button', { name: 'Submit', exact: true }).click();

    await expect.poll(() => currentStep(taskId)).toBe(2);
  });

  test('the client submits a plain client-assigned step', async ({ clientPage }) => {
    await transition('admin', taskId, { type: 'BRANCH_DECISION', branch: 'Submit' });
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    expect(await currentStep(taskId)).toBe(3);

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await heroOf(clientPage).getByRole('button', { name: 'Submit', exact: true }).click();

    await expect.poll(() => currentStep(taskId)).toBe(4);
  });

  test('staff see the step as the client\'s, with an on-behalf override', async ({ adminPage }) => {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const hero = heroOf(adminPage);
    await expect(hero.getByText(/waiting on client/i)).toBeVisible();
    await expect(hero.getByText(/submit on their behalf/i)).toBeVisible();
    await expect(hero.getByRole('button', { name: 'Submit for client' })).toBeVisible();
  });

  test('guards: a team member cannot act for the client; the client cannot do team work', async () => {
    await assignMatter(taskId, process.env.E2E_TEAM_UID!);
    expect(await transitionStatusAs('team', taskId, { type: 'BRANCH_DECISION', branch: 'Submit' })).toBe(403);
    expect(await currentStep(taskId)).toBe(1);

    // Step 2 is the team's — the client may not complete it.
    await transition('manager', taskId, { type: 'BRANCH_DECISION', branch: 'Submit' });
    expect(await currentStep(taskId)).toBe(2);
    expect(await transitionStatusAs('client', taskId, { type: 'COMPLETE_STEP' })).toBe(403);
    expect(await currentStep(taskId)).toBe(2);
  });
});
