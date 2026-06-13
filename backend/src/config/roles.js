/**
 * Role service (backend) — single source of truth for valid roles + permissions.
 *
 * Adding a new role = add ONE entry to ROLES. Everything that validates or
 * authorises by role derives from this, so role names are never hardcoded in
 * controllers/routes. Mirrors Portal/src/lib/roles.ts on the frontend.
 */

export const ROLES = [
  { key: 'admin',       label: 'Admin',       staff: true },
  { key: 'manager',     label: 'Manager',     staff: true },
  { key: 'team_member', label: 'Team Member', staff: true },
  { key: 'client',      label: 'Client',      staff: false },
];

export const VALID_ROLES = ROLES.map((r) => r.key);

export const isValidRole = (role) => VALID_ROLES.includes(role);

export const STAFF_ROLES = ROLES.filter((r) => r.staff).map((r) => r.key);

// Permission groups (referenced by route guards / controllers).
export const USER_MANAGER_ROLES = ['admin', 'manager']; // create/edit users
export const USER_DELETE_ROLES = ['admin'];             // delete users
export const ROLE_CHANGE_ROLES = ['admin'];             // change a user's role

/**
 * Which roles a given actor is allowed to ASSIGN when creating/editing a user.
 * Prevents privilege escalation: a manager must not be able to mint an admin or
 * another manager. Admin can assign any role.
 */
export const assignableRolesFor = (actorRole) => {
  if (actorRole === 'admin') return [...VALID_ROLES];
  if (actorRole === 'manager') return ['team_member', 'client'];
  return [];
};

export const canAssignRole = (actorRole, targetRole) =>
  assignableRolesFor(actorRole).includes(targetRole);
