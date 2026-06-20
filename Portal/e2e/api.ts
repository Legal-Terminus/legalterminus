import { request, type APIRequestContext } from '@playwright/test';
import { creds, env, type RoleKey } from './helpers';

/**
 * Backend API helpers for tests that need to PROVISION their own state — chiefly
 * "create a fresh matter per run, then delete it" so specs never share mutable
 * fixtures. Tokens are minted from the seeded role credentials via the Firebase
 * Auth REST API; backend calls go through a Playwright APIRequestContext.
 */
const API_BASE = process.env.E2E_API_BASE ?? 'http://localhost:5001';
const API_KEY = () => env('E2E_FIREBASE_API_KEY');

/** Exchange a role's email/password for a Firebase ID token. */
export async function idToken(role: RoleKey): Promise<string> {
  const { email, password } = creds(role);
  const ctx = await request.newContext();
  const res = await ctx.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY()}`,
    { data: { email, password, returnSecureToken: true } },
  );
  if (!res.ok()) throw new Error(`token mint failed for ${role}: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await ctx.dispose();
  return body.idToken as string;
}

/** An APIRequestContext that sends the role's bearer token on every request. */
export async function apiAs(role: RoleKey): Promise<APIRequestContext> {
  const token = await idToken(role);
  return request.newContext({
    baseURL: API_BASE,
    extraHTTPHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
}

export interface CreatedMatter { id: string }

/** Create a throwaway team_member user (for the reassign/offboard test) and return
 *  its uid. Created via the real user endpoint as admin. */
export async function createThrowawayStaff(): Promise<{ uid: string; name: string; email: string }> {
  const api = await apiAs('admin');
  const email = `e2e-temp-${Date.now()}@legalterminus.test`;
  const name = `E2E Temp ${Date.now().toString().slice(-5)}`;
  const res = await api.post('/api/portal/users', {
    data: { name, email, phone: '9990000000', role: 'team_member', designation: 'E2E Temp' },
  });
  if (!res.ok()) throw new Error(`createThrowawayStaff failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return { uid: body.uid as string, name, email };
}

/** Delete a user by uid (admin). Best-effort. May 409 if they still hold work —
 *  callers should reassign first. */
export async function deleteUser(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const api = await apiAs('admin');
    await api.delete(`/api/portal/users/${uid}`);
    await api.dispose();
  } catch { /* best-effort */ }
}

/**
 * Create a fresh matter for the seeded client via the real create endpoint
 * (admin → matter goes active immediately). Returns the new task id.
 */
export async function createMatter(opts?: { serviceKey?: string; serviceName?: string }): Promise<string> {
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'),
      serviceKey: opts?.serviceKey ?? 'incorporation',
      serviceName: opts?.serviceName ?? 'Company Incorporation',
    },
  });
  if (!res.ok()) throw new Error(`createMatter failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return body.id as string;
}

/** Assign a matter (and its active step) to a staff user via PATCH. */
export async function assignMatter(taskId: string, toUid: string): Promise<void> {
  const api = await apiAs('admin');
  const res = await api.patch(`/api/tasks/${taskId}`, { data: { assignedTo: toUid } });
  if (!res.ok()) throw new Error(`assignMatter failed: ${res.status()} ${await res.text()}`);
  await api.dispose();
}

/** Assign a specific STEP to a staff user (routes it into their My Tasks). The
 *  active step of a fresh matter may be pre-owned by a phase-default assignee
 *  (E11-S02), so matter-level assign doesn't always surface it — assign the step. */
export async function assignStep(taskId: string, stepNumber: number, toUid: string): Promise<void> {
  const api = await apiAs('admin');
  const res = await api.patch(`/api/tasks/${taskId}/steps/${stepNumber}`, { data: { assignedTo: toUid } });
  if (!res.ok()) throw new Error(`assignStep failed: ${res.status()} ${await res.text()}`);
  await api.dispose();
}

/** Read a matter's current (active) step number. */
export async function currentStep(taskId: string): Promise<number> {
  const api = await apiAs('admin');
  const res = await api.get(`/api/tasks/${taskId}`);
  const body = await res.json();
  await api.dispose();
  return body.currentStepNumber as number;
}

/** Delete a matter (admin only). Best-effort — never throws in teardown. */
export async function deleteMatter(taskId: string): Promise<void> {
  if (!taskId) return;
  try {
    const api = await apiAs('admin');
    await api.delete(`/api/tasks/${taskId}`);
    await api.dispose();
  } catch { /* teardown best-effort */ }
}

/** Delete the most recently-created matter for the seeded client (cleans up a
 *  matter created through the UI where the test never learned its id). */
export async function deleteNewestClientMatter(): Promise<void> {
  try {
    const api = await apiAs('admin');
    const res = await api.get('/api/tasks?limit=25');
    if (res.ok()) {
      const { data } = await res.json();
      const clientUid = env('E2E_CLIENT_UID');
      const mine = (data ?? []).filter((t: { clientUid?: string }) => t.clientUid === clientUid);
      // List is ordered by updatedAt desc → first is newest.
      if (mine[0]?.id) await api.delete(`/api/tasks/${mine[0].id}`);
    }
    await api.dispose();
  } catch { /* best-effort */ }
}

/** Create a fresh unregistered contact lead (for E08-S06). Returns its id + name. */
export async function createLead(): Promise<{ id: string; fullName: string }> {
  const api = await apiAs('admin');
  const fullName = `E2E Lead ${Date.now().toString().slice(-6)}`;
  const res = await api.post('/api/leads', {
    data: { fullName, email: `e2e-lead-${Date.now()}@example.test`, phone: '9990001112', sourceLabel: 'E2E' },
  });
  if (!res.ok()) throw new Error(`createLead failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return { id: body.id as string, fullName };
}

/** Delete a lead by id (admin). Best-effort. */
export async function deleteLead(id: string): Promise<void> {
  if (!id) return;
  try {
    const api = await apiAs('admin');
    await api.delete(`/api/leads/${id}`);
    await api.dispose();
  } catch { /* best-effort */ }
}

/** Create a manager-owned matter that is pending admin approval (for approval tests). */
export async function createPendingMatter(): Promise<string> {
  const api = await apiAs('manager'); // manager-created → pending_admin_approval
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'),
      serviceKey: 'incorporation',
      serviceName: 'Company Incorporation',
    },
  });
  if (!res.ok()) throw new Error(`createPendingMatter failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return body.id as string;
}
