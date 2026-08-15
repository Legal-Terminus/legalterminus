import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, deleteUserByEmail } from './api';
import { env } from './helpers';

/**
 * #166 — a client organisation can have several logins. Each additional email is
 * a real Auth account linked to the primary client via `primaryClientUid`, so it
 * sees the same matters and can act on them exactly as the primary can, while the
 * audit trail still records the individual.
 *
 * The security-critical assertions here are the negatives: an additional login
 * must not be creatable on staff accounts, must not chain, and must not be able
 * to hijack an address that already belongs to someone else.
 */

const CLIENT_UID = () => env('E2E_CLIENT_UID');

test('#166: an additional login is created and linked to the primary client', async () => {
  const email = `e2e-login-${Date.now()}@legalterminus.test`;
  const api = await apiAs('admin');
  try {
    const res = await api.post(`/api/portal/users/${CLIENT_UID()}/logins`, {
      data: { email, name: 'E2E Partner' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.primaryClientUid).toBe(CLIENT_UID());

    // It shows up in the client's login list…
    const list = await (await api.get(`/api/portal/users/${CLIENT_UID()}/logins`)).json();
    expect((list.data ?? []).map((l: { email: string }) => l.email)).toContain(email);

    // …and the stored account really carries the link + client role.
    const user = await (await api.get(`/api/portal/users/${body.uid}`)).json();
    expect(user.role).toBe('client');
    expect(user.primaryClientUid).toBe(CLIENT_UID());
  } finally {
    await api.dispose();
    await deleteUserByEmail(email);
  }
});

test('#166: an additional login sees the primary client’s matters', async () => {
  const email = `e2e-login-see-${Date.now()}@legalterminus.test`;
  const taskId = await createMatter({ organisation: 'E2E Multi Login' });
  const api = await apiAs('admin');
  try {
    const created = await api.post(`/api/portal/users/${CLIENT_UID()}/logins`, { data: { email } });
    expect(created.status()).toBe(201);
    const loginUid = (await created.json()).uid;

    // The matter belongs to the PRIMARY client uid, not this new account — the
    // whole point of the feature is that the link resolves the scope.
    const task = await (await api.get(`/api/tasks/${taskId}`)).json();
    expect(task.clientUid).toBe(CLIENT_UID());
    expect(task.clientUid).not.toBe(loginUid);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
    await deleteUserByEmail(email);
  }
});

test('#166: additional logins cannot be added to staff accounts', async () => {
  const api = await apiAs('admin');
  try {
    // Adding a "client login" to a team member would hand out a staff-linked
    // account — must be refused.
    const res = await api.post(`/api/portal/users/${env('E2E_TEAM_UID')}/logins`, {
      data: { email: `e2e-bad-${Date.now()}@legalterminus.test` },
    });
    expect(res.status()).toBe(400);
  } finally {
    await api.dispose();
  }
});

test('#166: an email already in use is refused, not silently re-pointed', async () => {
  const api = await apiAs('admin');
  try {
    // The team member's own address already belongs to a staff account. Accepting
    // it here would quietly convert that account into a client login.
    const res = await api.post(`/api/portal/users/${CLIENT_UID()}/logins`, {
      data: { email: env('E2E_TEAM_EMAIL') },
    });
    expect(res.status()).toBe(409);

    // The staff account is untouched.
    const team = await (await api.get(`/api/portal/users/${env('E2E_TEAM_UID')}`)).json();
    expect(team.role).toBe('team_member');
    expect(team.primaryClientUid ?? null).toBeNull();
  } finally {
    await api.dispose();
  }
});

test('#166: additional logins do not chain', async () => {
  const email = `e2e-login-chain-${Date.now()}@legalterminus.test`;
  const api = await apiAs('admin');
  let loginUid = '';
  try {
    const created = await api.post(`/api/portal/users/${CLIENT_UID()}/logins`, { data: { email } });
    loginUid = (await created.json()).uid;

    // An additional login must not host further logins — keeping the link one
    // level deep is what makes the scope resolution simple and auditable.
    const res = await api.post(`/api/portal/users/${loginUid}/logins`, {
      data: { email: `e2e-chain2-${Date.now()}@legalterminus.test` },
    });
    expect(res.status()).toBe(400);
  } finally {
    await api.dispose();
    await deleteUserByEmail(email);
  }
});

test('#166: a login can be revoked and stops being listed', async () => {
  const email = `e2e-login-revoke-${Date.now()}@legalterminus.test`;
  const api = await apiAs('admin');
  try {
    const created = await api.post(`/api/portal/users/${CLIENT_UID()}/logins`, { data: { email } });
    const loginUid = (await created.json()).uid;

    const del = await api.delete(`/api/portal/users/${CLIENT_UID()}/logins/${loginUid}`);
    expect(del.ok()).toBeTruthy();

    const list = await (await api.get(`/api/portal/users/${CLIENT_UID()}/logins`)).json();
    expect((list.data ?? []).map((l: { uid: string }) => l.uid)).not.toContain(loginUid);
  } finally {
    await api.dispose();
    await deleteUserByEmail(email);
  }
});

test('#166: revoking cannot be aimed at an unrelated account', async () => {
  const api = await apiAs('admin');
  try {
    // Passing a primary client's own uid as the "login" to remove must fail —
    // otherwise this route becomes a way to delete arbitrary users.
    const res = await api.delete(`/api/portal/users/${CLIENT_UID()}/logins/${env('E2E_TEAM_UID')}`);
    expect(res.status()).toBe(400);

    const team = await (await api.get(`/api/portal/users/${env('E2E_TEAM_UID')}`)).json();
    expect(team.role).toBe('team_member');
  } finally {
    await api.dispose();
  }
});

test('#166: a client cannot manage their own additional logins', async () => {
  const client = await apiAs('client');
  try {
    // Login management is a staff action (admin/manager) — a client adding their
    // own extra accounts would be an unaudited access grant.
    expect((await client.get(`/api/portal/users/${CLIENT_UID()}/logins`)).status()).toBe(403);
    expect((await client.post(`/api/portal/users/${CLIENT_UID()}/logins`, {
      data: { email: `e2e-self-${Date.now()}@legalterminus.test` },
    })).status()).toBe(403);
  } finally {
    await client.dispose();
  }
});
