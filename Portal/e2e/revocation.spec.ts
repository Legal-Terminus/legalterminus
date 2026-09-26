import { test, expect } from './fixtures';
import { request } from '@playwright/test';
import { createThrowawayStaff, deleteUser, mintIdTokenDirect } from './api';

/**
 * NFR3 — a DELETED member's still-valid ID token must stop working at once.
 *
 * The middleware used to fall back to the role in the token when the user's
 * record was missing, so a deleted admin kept admin access for the token's
 * remaining lifetime (~1h). Asserted on an ordinary (non-strict) route, which is
 * exactly where that fallback applied.
 *
 * The token is minted directly for a throwaway account — never a cached seeded
 * token, which would belong to a user who still exists.
 */
test('a deleted user\'s live ID token is refused', async () => {
  const password = `Lt-e2e-${Date.now()}aA1!`;
  const staff = await createThrowawayStaff({ password });
  const token = await mintIdTokenDirect(staff.email, password);

  const ctx = await request.newContext({
    baseURL: process.env.E2E_API_BASE ?? 'http://localhost:5001',
    extraHTTPHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  try {
    // Works while the account exists…
    expect((await ctx.get('/api/tasks?limit=1')).status()).toBe(200);

    await deleteUser(staff.uid);

    // …and is refused straight after deletion, not an hour later.
    const res = await ctx.get('/api/tasks?limit=1');
    expect(res.status()).toBe(401);
    expect((await res.json()).code).toBe('TOKEN_REVOKED');
  } finally {
    await ctx.dispose();
  }
});
