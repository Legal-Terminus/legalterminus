import {
  CheckSquare, Users, BarChart2, Inbox, Layers, type LucideIcon,
} from 'lucide-react';
import type { Role } from '../../store/authStore';

/**
 * Declarative dashboard tiles — single source of truth for what each role sees
 * on the unified /dashboard. A tile shows iff the user's role is in its `roles`.
 * Paths are role-neutral (see routes/appRoutes.tsx).
 *
 * To show a tile to another role → add the role to its `roles` array.
 */
export interface DashboardTileDef {
  title: string;
  desc: string;
  to: string;
  icon: LucideIcon;
  roles: Role[];
}

export const DASHBOARD_TILES: DashboardTileDef[] = [
  // A "Matter" is a client's running workflow instance; clients see theirs as "Services".
  { title: 'Matters',     desc: 'Client matters and their progress through each workflow.', to: '/tasks', icon: CheckSquare, roles: ['admin', 'manager', 'team_member'] },
  { title: 'My Services', desc: 'Track the progress of your purchased services.',            to: '/tasks', icon: CheckSquare, roles: ['client'] },
  { title: 'Contact Leads', desc: 'Website enquiries — see which are already clients.', to: '/reports/leads', icon: Inbox,       roles: ['admin', 'manager', 'team_member'] },

  // Admin + Manager
  { title: 'Users',             desc: 'Manage clients, team members, and roles.', to: '/users',             icon: Users,    roles: ['admin', 'manager'] },
  { title: 'Reports',           desc: 'Operational and lead insights.',           to: '/reports',           icon: BarChart2, roles: ['admin', 'manager'] },

  // Service catalog — staff only (clients excluded). Workflow config (step ETAs,
  // assignments, the visualizer) lives on each service's detail page.
  { title: 'Service Catalog', desc: 'Browse every service Legal Terminus offers.', to: '/services', icon: Layers, roles: ['admin', 'manager', 'team_member'] },
];

export const tilesForRole = (role: Role | null): DashboardTileDef[] =>
  role ? DASHBOARD_TILES.filter((t) => t.roles.includes(role)) : [];

export const dashboardTitle = (role: Role | null): string => {
  switch (role) {
    case 'admin': return 'Admin Dashboard';
    case 'manager': return 'Manager Dashboard';
    case 'team_member': return 'Team Dashboard';
    case 'client': return 'My Services';
    default: return 'Dashboard';
  }
};
