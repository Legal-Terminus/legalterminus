import { test, expect } from './fixtures';
import { apiAs, apiAsCredentials, createThrowawayStaff, createGappedDefinition, deleteUser, deleteDefinition } from './api';

/**
 * E-23 — the quality fixes ported from the cometflow portal.
 *
 * E23-S01 is unit-tested (stepProgress is a pure function); what needs an e2e is
 * the NEW HELPERS themselves — a helper that silently does not work would make
 * every spec built on it worthless.
 */

test('E23-S03: a throwaway user can sign in and act as themselves', async () => {
  const password = `Lt-e2e-${Date.now()}aA1!`;
  const staff = await createThrowawayStaff({ password });
  try {
    // The whole point: a token minted from THEIR credentials, not a shared role.
    const api = await apiAsCredentials(staff.email, password);
    const res = await api.get('/api/tasks?limit=5');
    expect(res.status(), 'the throwaway user is authenticated staff').toBe(200);
    await api.dispose();
  } finally { await deleteUser(staff.uid); }
});

test('E23-S03: a throwaway user is a team member, not an admin', async () => {
  const password = `Lt-e2e-${Date.now()}aA1!`;
  const staff = await createThrowawayStaff({ password });
  try {
    const api = await apiAsCredentials(staff.email, password);
    // Guards the fixture itself: if this silently minted an admin, every
    // permission test built on it would pass for the wrong reason.
    const res = await api.get('/api/portal/users');
    expect([403, 401], 'a team member cannot list portal users').toContain(res.status());
    await api.dispose();
  } finally { await deleteUser(staff.uid); }
});

test('E23-S03: the gapped definition really is gapped', async () => {
  const defId = await createGappedDefinition();
  try {
    const api = await apiAs('admin');
    const def = await (await api.get(`/api/workflow-definitions/${defId}`)).json();
    await api.dispose();

    const nums = (def.steps as Array<{ stepNumber: number }>).map((s) => s.stepNumber);
    expect(nums, 'ids are non-contiguous').toEqual([5, 17, 31, 46]);
    // The property that matters: the largest id is far beyond the step count, so
    // any code treating the id as a position produces nonsense.
    expect(Math.max(...nums)).toBeGreaterThan(nums.length);
    expect(def.initialStep, 'the flow starts at 5, not 1').toBe(5);
  } finally { await deleteDefinition(defId); }
});

test('E23-S02: the editor toolbar survives re-renders with focus intact', async ({ adminPage }) => {
  // Btn is now module-scope, so toggling a mark must not remount the toolbar and
  // steal focus from the editor. Typing after a toolbar click is the observable.
  // Open a matter via the API so this test does not depend on the list's
  // layout (it renders CARDS, not table rows, at the default viewport).
  const { apiAs } = await import('./api');
  const api = await apiAs('admin');
  const list = await (await api.get('/api/tasks?limit=1')).json();
  await api.dispose();
  const taskId = (list.data ?? [])[0]?.id;
  test.skip(!taskId, 'no matters available to open');
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.waitForTimeout(2000);

  const editor = adminPage.locator('[role="textbox"]').first();
  if (await editor.count() === 0) {
    test.skip(true, 'no rich-text editor on this matter view');
  }
  await editor.click();
  await editor.pressSequentially('before');
  const bold = adminPage.getByRole('button', { name: 'Bold' }).first();
  if (await bold.count() > 0) {
    await bold.click();
    await editor.pressSequentially('after');
    // If the toolbar remounted, focus would be lost and 'after' would go nowhere.
    await expect(editor).toContainText('beforeafter');
  }
});
