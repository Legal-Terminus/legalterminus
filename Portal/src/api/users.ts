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

/** List users, optionally filtered by a single role. */
export const getUsers = (role?: Role) =>
  apiFetch<PortalUser[]>(role ? `${BASE}?role=${role}` : BASE);

export const getUser = (uid: string) => apiFetch<PortalUser>(`${BASE}/${uid}`);

export const createUser = (body: Partial<PortalUser> & { role: Role }) =>
  apiFetch<UpsertUserResult>(BASE, { method: 'POST', body: JSON.stringify(body) });

export const updateUser = (uid: string, body: Partial<PortalUser>) =>
  apiFetch<UpsertUserResult>(`${BASE}/${uid}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteUser = (uid: string) =>
  apiFetch<void>(`${BASE}/${uid}`, { method: 'DELETE' });
