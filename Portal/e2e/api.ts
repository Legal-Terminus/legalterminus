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

/**
 * Exchange a role's email/password for a Firebase ID token — CACHED per role for
 * the process lifetime. Firebase rate-limits password sign-ins ("QUOTA_EXCEEDED"),
 * and ID tokens last ~1h, so we must mint once per role and reuse, not per call.
 */
const _tokenCache = new Map<RoleKey, string>();
export async function idToken(role: RoleKey): Promise<string> {
  const cached = _tokenCache.get(role);
  if (cached) return cached;
  const { email, password } = creds(role);
  const ctx = await request.newContext();
  const res = await ctx.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY()}`,
    { data: { email, password, returnSecureToken: true } },
  );
  if (!res.ok()) throw new Error(`token mint failed for ${role}: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await ctx.dispose();
  _tokenCache.set(role, body.idToken as string);
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

/** Find a user's uid by email (admin), or null. */
export async function findUserByEmail(email: string): Promise<string | null> {
  const api = await apiAs('admin');
  // The users list isn't email-filterable server-side; page through and match.
  const res = await api.get('/api/portal/users?limit=100');
  const body = await res.json();
  await api.dispose();
  const u = (body.data ?? []).find((x: { email?: string }) => (x.email ?? '').toLowerCase() === email.toLowerCase());
  return u?.uid ?? null;
}

/** Delete a user by email (admin). Best-effort cleanup for UI-created users. */
export async function deleteUserByEmail(email: string): Promise<void> {
  try {
    const uid = await findUserByEmail(email);
    if (uid) await deleteUser(uid);
  } catch { /* best-effort */ }
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

/** Resolve a workflow-backed service key dynamically (don't hardcode one —
 *  service catalog + workflows are editable). Returns the first definition's
 *  first serviceKey. */
let _cachedServiceKey: string | null = null;
export async function resolveServiceKey(): Promise<string> {
  if (_cachedServiceKey) return _cachedServiceKey;
  const api = await apiAs('admin');
  const defs = await (await api.get('/api/workflow-definitions')).json();
  await api.dispose();
  const key = (defs ?? []).flatMap((d: { serviceKeys?: string[] }) => d.serviceKeys ?? [])[0];
  if (!key) throw new Error('No workflow-backed service found to create a matter.');
  _cachedServiceKey = key;
  return key;
}

/**
 * Create a fresh matter for the seeded client via the real create endpoint
 * (admin → matter goes active immediately). Service key is resolved from the live
 * workflow definitions unless one is passed. Returns the new task id.
 */
export async function createMatter(opts?: { serviceKey?: string; serviceName?: string }): Promise<string> {
  const serviceKey = opts?.serviceKey ?? (await resolveServiceKey());
  const api = await apiAs('admin');
  // #51: payment status is chosen at creation; 'not_paid' now routes the matter to
  // admin approval instead of going live. Lifecycle tests want an ACTIVE matter, so
  // default to fully_paid here. Use createNoPaymentMatter() for the approval path.
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey, serviceName: opts?.serviceName,
      paymentStatus: 'fully_paid', totalCost: 10000, amountReceived: 10000, paymentMode: 'E2E',
    },
  });
  if (!res.ok()) throw new Error(`createMatter failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return body.id as string;
}

/** Create a matter with NO PAYMENT (admin) → routes to admin approval (#51).
 *  Returns the new task id (status pending_admin_approval). */
export async function createNoPaymentMatter(): Promise<string> {
  const serviceKey = await resolveServiceKey();
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: { clientUid: env('E2E_CLIENT_UID'), serviceKey, paymentStatus: 'not_paid' },
  });
  if (!res.ok()) throw new Error(`createNoPaymentMatter failed: ${res.status()} ${await res.text()}`);
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

/** Read full matter state (status, currentStepNumber, paymentStatus, matterDueAt). */
export async function getMatter(taskId: string): Promise<Record<string, unknown>> {
  const api = await apiAs('admin');
  const res = await api.get(`/api/tasks/${taskId}`);
  const body = await res.json();
  await api.dispose();
  return body;
}

/* ── Workflow DISCOVERY (no hardcoded steps — workflows are editable) ──────────
 * Tests must derive structure from the LIVE definition, never assume step numbers
 * or types. These helpers fetch the matter's pinned definition and answer generic
 * questions ("first payment gate", "first client-approval step", "a plain step").
 */
export interface WfStep {
  stepNumber: number;
  title: string;
  type: 'step' | 'payment_gate' | 'branch' | 'final';
  transitions?: { event: string; to: number; branch?: string }[];
  gate?: { requires: string; onPass: number; onWait: number };
}
export interface WfDef { id: string; initialStep: number; steps: WfStep[] }

/** Fetch the workflow definition a matter is running on. */
export async function getDefinitionForMatter(taskId: string): Promise<WfDef> {
  const api = await apiAs('admin');
  const t = await (await api.get(`/api/tasks/${taskId}`)).json();
  const def = await (await api.get(`/api/workflow-definitions/${t.workflowDefinitionId}`)).json();
  await api.dispose();
  return def as WfDef;
}

const stepEvents = (s: WfStep) => new Set((s.transitions ?? []).map((t) => t.event));

/** First step matching a predicate, in definition order. */
function findStep(def: WfDef, pred: (s: WfStep) => boolean): WfStep | undefined {
  return [...def.steps].sort((a, b) => a.stepNumber - b.stepNumber).find(pred);
}
export const firstPaymentGate = (def: WfDef) => findStep(def, (s) => s.type === 'payment_gate');
export const firstPlainStep = (def: WfDef) => findStep(def, (s) => s.type === 'step' && stepEvents(s).has('COMPLETE_STEP'));
export const firstClientStep = (def: WfDef) => findStep(def, (s) => stepEvents(s).has('CLIENT_APPROVE'));
export const firstGovtStep = (def: WfDef) => findStep(def, (s) => stepEvents(s).has('GOVT_APPROVE'));
export const firstBranchStep = (def: WfDef) => findStep(def, (s) => s.type === 'branch');

/** Fire a workflow transition as a role (used to fast-forward a matter to a
 *  specific step before the UI assertions). */
export async function transition(role: 'admin' | 'manager', taskId: string, event: Record<string, unknown>): Promise<Record<string, unknown>> {
  const api = await apiAs(role);
  const res = await api.post(`/api/tasks/${taskId}/transition`, { data: { event } });
  if (!res.ok()) throw new Error(`transition ${JSON.stringify(event)} failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return body;
}

/** Advance a matter generically, driven by the LIVE definition (no hardcoded
 *  steps). At each step: payment_gate → ADMIN_OVERRIDE_PAYMENT; a step with a
 *  COMPLETE_STEP transition → COMPLETE_STEP. Stops at `targetStepNumber` (if
 *  given) or at the first step needing client/govt/branch input. Returns the
 *  step number it stopped on. */
export async function advanceUntil(
  taskId: string,
  stop?: (s: WfStep) => boolean,
): Promise<number> {
  const def = await getDefinitionForMatter(taskId);
  const byNum = new Map(def.steps.map((s) => [s.stepNumber, s]));
  for (let i = 0; i < def.steps.length + 5; i++) {
    const m = await getMatter(taskId);
    if (m.status === 'completed') return m.currentStepNumber as number;
    const cur = m.currentStepNumber as number;
    const step = byNum.get(cur);
    if (!step) return cur;
    if (stop && stop(step)) return cur;
    let ev: Record<string, unknown> | null = null;
    if (step.type === 'payment_gate') ev = { type: 'ADMIN_OVERRIDE_PAYMENT' };
    else if (stepEvents(step).has('COMPLETE_STEP')) ev = { type: 'COMPLETE_STEP' };
    else return cur; // needs a special event (client/govt/branch) → stop here
    try { await transition('admin', taskId, ev); }
    catch { return cur; }
  }
  return (await getMatter(taskId)).currentStepNumber as number;
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

/** Read the current notifications for a role (via the real API). */
export async function getNotifications(role: RoleKey): Promise<Array<{ title: string; message: string; read: boolean }>> {
  const api = await apiAs(role);
  const res = await api.get('/api/notifications');
  const body = await res.json();
  await api.dispose();
  return body as Array<{ title: string; message: string; read: boolean }>;
}

/** Count a role's notifications that deep-link to a given matter (by taskId). */
export async function countNotificationsForTask(role: RoleKey, taskId: string): Promise<number> {
  const api = await apiAs(role);
  const res = await api.get('/api/notifications');
  const body = (await res.json()) as Array<{ taskId?: string }>;
  await api.dispose();
  return body.filter((n) => n.taskId === taskId).length;
}

/** Count a role's UNREAD (active) notifications for a matter. */
export async function countUnreadNotificationsForTask(role: RoleKey, taskId: string): Promise<number> {
  const api = await apiAs(role);
  const res = await api.get('/api/notifications');
  const body = (await res.json()) as Array<{ taskId?: string; read?: boolean }>;
  await api.dispose();
  return body.filter((n) => n.taskId === taskId && n.read !== true).length;
}

/**
 * Poll a role's notifications until at least one deep-links to `taskId`, or time
 * out. Returns the count seen at resolution (0 on timeout).
 */
export async function waitForTaskNotification(role: RoleKey, taskId: string, timeoutMs = 20_000): Promise<number> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const n = await countNotificationsForTask(role, taskId);
    if (n > 0 || Date.now() > deadline) return n;
    await new Promise((r) => setTimeout(r, 2000));
  }
}

/** Poll a role's notifications until one matches `re` (titles), or time out. */
export async function waitForNotification(role: RoleKey, re: RegExp, timeoutMs = 20_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const list = await getNotifications(role);
    if (list.some((n) => re.test(n.title) || re.test(n.message))) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

/** Archive a matter via API as a role (admin/manager/team). Returns HTTP status. */
export async function archiveMatterAs(role: RoleKey, taskId: string): Promise<number> {
  const api = await apiAs(role);
  const res = await api.post(`/api/tasks/${taskId}/archive`, {});
  const status = res.status();
  await api.dispose();
  return status;
}

/** Count a matter's documents via the API (admin). -1 if the matter is gone. */
export async function countDocuments(taskId: string): Promise<number> {
  const api = await apiAs('admin');
  const res = await api.get(`/api/tasks/${taskId}/documents`);
  const ok = res.ok();
  const body = ok ? await res.json() : null;
  await api.dispose();
  return ok ? (body.data ?? []).length : -1;
}

/** Does a matter still exist (admin GET)? */
export async function matterExists(taskId: string): Promise<boolean> {
  const api = await apiAs('admin');
  const res = await api.get(`/api/tasks/${taskId}`);
  await api.dispose();
  return res.ok();
}

/** Delete a matter as a specific role (to assert admin-only). Returns HTTP status. */
export async function deleteMatterAs(role: RoleKey, taskId: string): Promise<number> {
  const api = await apiAs(role);
  const res = await api.delete(`/api/tasks/${taskId}`);
  const status = res.status();
  await api.dispose();
  return status;
}

/** Create a fresh unregistered contact lead (for E08-S06). Returns id + name + email
 *  (email lets a test that CONVERTS the lead clean up the resulting client). */
export async function createLead(): Promise<{ id: string; fullName: string; email: string }> {
  const api = await apiAs('admin');
  const fullName = `E2E Lead ${Date.now().toString().slice(-6)}`;
  const email = `e2e-lead-${Date.now()}@example.test`;
  const res = await api.post('/api/leads', {
    data: { fullName, email, phone: '9990001112', sourceLabel: 'E2E' },
  });
  if (!res.ok()) throw new Error(`createLead failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return { id: body.id as string, fullName, email };
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
  const serviceKey = await resolveServiceKey();
  // #47 removed manager-created approval; the remaining approval trigger is
  // NO PAYMENT (#51). Omitting paymentStatus defaults to not_paid →
  // pending_admin_approval, which is what these approval tests need.
  const api = await apiAs('manager');
  const res = await api.post('/api/tasks', {
    data: { clientUid: env('E2E_CLIENT_UID'), serviceKey, paymentStatus: 'not_paid' },
  });
  if (!res.ok()) throw new Error(`createPendingMatter failed: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  await api.dispose();
  return body.id as string;
}
