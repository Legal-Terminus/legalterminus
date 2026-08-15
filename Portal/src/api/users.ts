import { apiFetch } from './client';
// Single source of truth for roles is lib/roles.ts — re-exported here so existing
// importers keep working while there is only ONE definition of the union (#168
// added 'professional' and three separate copies of this type had drifted).
export type { Role } from '../lib/roles';
import type { Role } from '../lib/roles';

/** Unified user shape across all roles (backed by the `users` collection). */
export interface PortalUser {
  uid: string;
  name?: string;       // may be absent on older/Google-only docs → use displayName()
  fullName?: string;   // legacy/alternate name field
  email: string;
  phone?: string;
  role: Role;
  createdAt: string;
  // team-member / staff fields
  designation?: string;
  joiningDate?: string;
  fathersName?: string;
  dateOfBirth?: string;
  address?: string;
  // client fields
  organisation?: string;
  businessName?: string;
  /** #62/#150: the client's free-text "Reference". Distinct from professionalUid. */
  professionalName?: string;
  /** #151: staff professional this user is assigned under (Role & Access). */
  professionalUid?: string | null;
  /** #151: snapshot of that professional's display name, for lists/exports. */
  professionalTitle?: string | null;
  groupCompany?: string;
  gstNumber?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  state?: string;
  emailIds?: string[];
}

export interface UpsertUserResult {
  uid: string;
  email: string;
  name: string;
  role: Role;
  isUpdate?: boolean;
  scenario?: string;
  message?: string;
}

/** Best display name for a user, tolerating missing/legacy fields. */
export const displayName = (u: Pick<PortalUser, 'name' | 'fullName' | 'email'>): string =>
  (u.name?.trim() || u.fullName?.trim() || u.email || 'Unknown');

const BASE = '/api/portal/users';

/** One page of users + an opaque cursor for the next page (null = last page). */
export interface UsersPage {
  data: PortalUser[];
  nextCursor: string | null;
}

/** Per-role counts for the role tabs (server-side aggregation). */
export type UserCounts = { all: number } & Partial<Record<Role, number>>;

/**
 * Fetch one page of users. Pass a `role` to filter server-side, `cursor` to
 * continue after a previous page, and `limit` for page size.
 */
export const getUsersPage = (params: { role?: Role; cursor?: string; limit?: number } = {}) => {
  const q = new URLSearchParams();
  if (params.role) q.set('role', params.role);
  if (params.cursor) q.set('cursor', params.cursor);
  q.set('limit', String(params.limit ?? 25));
  return apiFetch<UsersPage>(`${BASE}?${q.toString()}`);
};

/** Role tab counts — one cheap aggregation call, accurate at any scale. */
export const getUserCounts = () => apiFetch<UserCounts>(`${BASE}/counts`);

/**
 * Fetch ALL users (follows the cursor until exhausted). Used by the client-side
 * data grid, which does its own sorting/filtering/pagination. Fine at the
 * current scale; if the collection grows very large, switch the grid to a
 * server-side row model instead of loading everything.
 */
export const getAllUsers = async (): Promise<PortalUser[]> => {
  const all: PortalUser[] = [];
  let cursor: string | undefined;
  // Safety cap so a bad cursor can never loop forever.
  for (let i = 0; i < 100; i++) {
    const page = await getUsersPage({ cursor, limit: 100 });
    all.push(...page.data);
    if (!page.nextCursor) break;
    cursor = page.nextCursor;
  }
  return all;
};

export const getUser = (uid: string) => apiFetch<PortalUser>(`${BASE}/${uid}`);

export const createUser = (body: Partial<PortalUser> & { role: Role }) =>
  apiFetch<UpsertUserResult>(BASE, { method: 'POST', body: JSON.stringify(body) });

export const updateUser = (uid: string, body: Partial<PortalUser>) =>
  apiFetch<UpsertUserResult>(`${BASE}/${uid}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteUser = (uid: string) =>
  apiFetch<void>(`${BASE}/${uid}`, { method: 'DELETE' });

/** Result of a bulk reassignment of a user's work to another user (E09-S04). */
export interface ReassignWorkResult {
  message: string;
  mattersMoved: number;
  stepsMoved: number;
}

/**
 * Move ALL of one user's work (matter ownership + step ownership) to another
 * staff user. Used when offboarding: reassign, then the user becomes deletable
 * (the delete guard blocks while they still hold work).
 */
export const reassignUserWork = (uid: string, toUid: string) =>
  apiFetch<ReassignWorkResult>(`${BASE}/${uid}/reassign`, {
    method: 'POST',
    body: JSON.stringify({ toUid }),
  });

/* ── #166: additional logins for a client organisation ────────────────────── */

/**
 * An extra person who can sign in on a client's account. Each is a real auth
 * account with its own password and audit trail — NOT the same thing as the
 * "Additional Emails" contact list, which grants no access.
 */
export interface ClientLogin {
  uid: string;
  email: string;
  name: string | null;
  status: string;
  createdAt: string | null;
}

export const getClientLogins = (uid: string) =>
  apiFetch<{ data: ClientLogin[] }>(`${BASE}/${uid}/logins`).then((r) => r.data);

export const addClientLogin = (uid: string, body: { email: string; name?: string }) =>
  apiFetch<ClientLogin>(`${BASE}/${uid}/logins`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const removeClientLogin = (uid: string, loginUid: string) =>
  apiFetch<{ message: string }>(`${BASE}/${uid}/logins/${loginUid}`, { method: 'DELETE' });
