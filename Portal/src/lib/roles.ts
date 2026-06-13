/**
 * Role service — single source of truth for all roles in the portal.
 *
 * Adding a new role = add ONE entry to ROLES below. Everything that iterates
 * roles (filter tabs, badges, labels, permission checks) derives from this list,
 * so no role names are hardcoded across the app.
 */

export type Role = 'admin' | 'manager' | 'team_member' | 'client';

export interface RoleDef {
  /** Stable key stored in Firestore `users/{uid}.role`. */
  key: Role;
  /** Human-readable singular label. */
  label: string;
  /** Plural label for tabs/sections. */
  pluralLabel: string;
  /** Whether this is internal staff (vs. external client). */
  staff: boolean;
  /** Tailwind classes for the role badge. */
  badgeClass: string;
  /** Tailwind classes for the avatar chip. */
  avatarClass: string;
  /** Sort/display order. */
  order: number;
}

export const ROLES: RoleDef[] = [
  {
    key: 'client',
    label: 'Client',
    pluralLabel: 'Clients',
    staff: false,
    badgeClass: 'bg-emerald-50 text-emerald-700',
    avatarClass: 'bg-surface-card text-ink-muted',
    order: 1,
  },
  {
    key: 'team_member',
    label: 'Team Member',
    pluralLabel: 'Team Members',
    staff: true,
    badgeClass: 'bg-brand-50 text-brand-700',
    avatarClass: 'bg-brand-50 text-brand-700',
    order: 2,
  },
  {
    key: 'manager',
    label: 'Manager',
    pluralLabel: 'Managers',
    staff: true,
    badgeClass: 'bg-amber-50 text-amber-700',
    avatarClass: 'bg-amber-50 text-amber-700',
    order: 3,
  },
  {
    key: 'admin',
    label: 'Admin',
    pluralLabel: 'Admins',
    staff: true,
    badgeClass: 'bg-red-50 text-red-700',
    avatarClass: 'bg-surface-card text-ink',
    order: 4,
  },
];

const BY_KEY: Record<string, RoleDef> = Object.fromEntries(ROLES.map((r) => [r.key, r]));

export const ALL_ROLE_KEYS: Role[] = ROLES.map((r) => r.key);

export const getRole = (key: string | null | undefined): RoleDef | undefined =>
  key ? BY_KEY[key] : undefined;

export const roleLabel = (key: string | null | undefined): string =>
  getRole(key)?.label ?? (key ?? '—');

export const roleBadgeClass = (key: string | null | undefined): string =>
  getRole(key)?.badgeClass ?? 'bg-surface-card text-ink-muted';

export const roleAvatarClass = (key: string | null | undefined): string =>
  getRole(key)?.avatarClass ?? 'bg-surface-card text-ink-muted';

export const isStaffRole = (key: string | null | undefined): boolean =>
  getRole(key)?.staff ?? false;

/** Roles allowed to manage other users (create/edit). */
export const USER_MANAGER_ROLES: Role[] = ['admin', 'manager'];

/** Roles allowed to delete users. */
export const USER_DELETE_ROLES: Role[] = ['admin'];

export const can = (role: Role | null, allowed: Role[]): boolean =>
  !!role && allowed.includes(role);

/**
 * Roles a given actor may ASSIGN when creating/editing a user. Mirrors the
 * backend `assignableRolesFor` in backend/src/config/roles.js — the backend is
 * the real gate; this is for hiding disallowed options in the UI.
 */
export const assignableRolesFor = (actorRole: Role | null): Role[] => {
  if (actorRole === 'admin') return ALL_ROLE_KEYS;
  if (actorRole === 'manager') return ['team_member', 'client'];
  return [];
};
