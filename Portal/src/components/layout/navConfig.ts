import type { LucideIcon } from 'lucide-react';
import type { Role } from '../../store/authStore';
import { APP_ROUTES } from '../../routes/appRoutes';

/**
 * Navigation is DERIVED from APP_ROUTES (routes/appRoutes.tsx) — the single
 * source of truth for routes + access + nav. This module only shapes that data
 * for the Sidebar and BottomNav. To add/change a nav link or its access, edit
 * the route's `nav` block and `roles` in appRoutes.tsx, never here.
 */
export interface NavItem {
  label: string;
  mobileLabel?: string;
  to: string;
  icon: LucideIcon;
  roles: Role[];
  mobile: boolean;
  order: number;
}

const NAV_ITEMS: NavItem[] = APP_ROUTES
  .filter((r) => r.nav)
  .map((r) => ({
    label: r.nav!.label,
    mobileLabel: r.nav!.mobileLabel,
    to: r.path,
    icon: r.nav!.icon,
    roles: r.roles,
    mobile: r.nav!.mobile ?? false,
    order: r.nav!.order ?? 0,
  }));

/** Nav items visible to a given role, sorted by `order` then declaration. */
export const navForRole = (role: Role | null): NavItem[] =>
  role ? NAV_ITEMS.filter((i) => i.roles.includes(role)).sort((a, b) => a.order - b.order) : [];

/** Mobile bottom-nav items for a given role (max ~5 looks best). */
export const mobileNavForRole = (role: Role | null): NavItem[] =>
  navForRole(role).filter((i) => i.mobile).slice(0, 5);

// Dashboard root matches exactly; everything else matches on path prefix.
const EXACT_MATCH_PATHS = new Set(['/dashboard']);

export const isNavActive = (to: string, pathname: string): boolean => {
  if (EXACT_MATCH_PATHS.has(to)) return pathname === to;
  return pathname === to || pathname.startsWith(to + '/');
};
