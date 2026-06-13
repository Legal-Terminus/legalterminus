import { apiFetch } from './client';

export type Role = 'admin' | 'manager' | 'team_member' | 'client';

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

export const getUser = (uid: string) => apiFetch<PortalUser>(`${BASE}/${uid}`);

export const createUser = (body: Partial<PortalUser> & { role: Role }) =>
  apiFetch<UpsertUserResult>(BASE, { method: 'POST', body: JSON.stringify(body) });

export const updateUser = (uid: string, body: Partial<PortalUser>) =>
  apiFetch<UpsertUserResult>(`${BASE}/${uid}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteUser = (uid: string) =>
  apiFetch<void>(`${BASE}/${uid}`, { method: 'DELETE' });
