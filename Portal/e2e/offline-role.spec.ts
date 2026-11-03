import { test, expect } from './fixtures';

/**
 * A signed-in person whose role cannot be read (no connection) must NOT be shown a
 * guessed role. It used to fall back to 'client' for the whole session, so an Admin
 * opening the app with a bad signal saw the Client screens with no hint why.
 *
 * The connection is simulated by refusing every Firestore request; the Portal reads
 * the role from Firestore at start-up.
 */
test('role unreadable: a "try again" screen, not the Client view; recovers when the connection returns', async ({ adminPage }) => {
  test.setTimeout(120_000);
  const blockFirestore = (route: { abort: () => Promise<void> }) => route.abort();
  await adminPage.route(/firestore\.googleapis\.com/, blockFirestore);

  await adminPage.goto('dashboard');

  // The Firestore client waits ~10s before it reports the backend unreachable.
  await expect(adminPage.getByRole('heading', { name: /can.t load your account/i })).toBeVisible({ timeout: 60_000 });
  await expect(adminPage.getByRole('button', { name: 'Try again' })).toBeVisible();
  // Still signed in, and NOT shown another role's screens.
  await expect(adminPage.getByRole('heading', { name: 'My Services' })).toHaveCount(0);
  await expect(adminPage).not.toHaveURL(/login|unauthorized/);

  // Connection back: "Try again" loads the real role and the Admin dashboard.
  await adminPage.unroute(/firestore\.googleapis\.com/, blockFirestore);
  await adminPage.getByRole('button', { name: 'Try again' }).click();
  await expect(adminPage.getByRole('heading', { name: /admin dashboard/i })).toBeVisible({ timeout: 30_000 });
});
