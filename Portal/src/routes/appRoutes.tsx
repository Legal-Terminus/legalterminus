import type { ReactElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, CheckSquare, Users, BarChart2, Settings, Layers, User, Package,
} from 'lucide-react';
import type { Role } from '../store/authStore';

// Pages are organised by FEATURE, never by role (role-neutral architecture).
import DashboardPage from '../pages/dashboard/DashboardPage';
import TasksPage from '../pages/tasks/TasksPage';
import TaskDetail from '../pages/tasks/TaskDetailPage';
import UsersPage from '../pages/users/UsersPage';
import UserFormPage from '../pages/users/UserFormPage';
import WorkflowSettings from '../pages/workflow/WorkflowSettingsPage';
import Services from '../pages/services/ServicesPage';
import ServiceDetail from '../pages/services/ServiceDetailPage';
import ProfilePage from '../pages/profile/ProfilePage';
import OrdersPage from '../pages/orders/OrdersPage';

// Reports
import ReportsPage from '../pages/reports/ReportsPage';
import AllTasksReport from '../pages/reports/AllTasksReport';
import CompletedTasksReport from '../pages/reports/CompletedTasksReport';
import PendingTasksReport from '../pages/reports/PendingTasksReport';
import MasterSheetReport from '../pages/reports/MasterSheetReport';
import ContactLeadsReport from '../pages/reports/ContactLeadsReport';

/**
 * SINGLE SOURCE OF TRUTH for every authenticated route, who can access it, and
 * whether/how it appears in navigation.
 *
 * Access control is declarative: a page is reachable iff the current user's role
 * is in its `roles` array. The router (routes/index.tsx) groups routes by
 * role-set and wraps each group in one <ProtectedRoute allowedRoles> guard.
 * Navigation (components/layout/navConfig.ts) derives sidebar + bottom-nav from
 * the optional `nav` block on each route.
 *
 * URLs are ROLE-NEUTRAL by design — there are no /admin/*, /team/*, /client/*
 * prefixes. A path names the FEATURE, not the role; the `roles` array is the
 * access mechanism, and pages adapt their view to the current role internally.
 * This avoids leaking the role in the URL and prevents per-role route duplication.
 *
 * To open a page to another role: add the role to `roles`. One line.
 */
export interface RouteNav {
  label: string;
  mobileLabel?: string;
  icon: LucideIcon;
  mobile?: boolean;   // surface in the mobile bottom nav
  order?: number;     // optional explicit ordering within a role's nav
}

export interface AppRoute {
  path: string;
  element: ReactElement;
  roles: Role[];
  nav?: RouteNav;     // omit for routes that aren't nav links (edit forms, detail pages)
}

const ALL_ROLES: Role[] = ['admin', 'manager', 'team_member', 'client'];

export const APP_ROUTES: AppRoute[] = [
  // ── Shared across roles — one path, view adapts to role ──
  { path: '/dashboard', element: <DashboardPage />, roles: ALL_ROLES, nav: { label: 'Dashboard', mobileLabel: 'Home', icon: LayoutDashboard, mobile: true, order: -2 } },
  { path: '/tasks',     element: <TasksPage />,     roles: ALL_ROLES, nav: { label: 'Tasks', icon: CheckSquare, mobile: true, order: -1 } },
  { path: '/tasks/:taskId', element: <TaskDetail />, roles: ALL_ROLES },

  // ── Admin + Manager (per BMAD E08-S01 reports, E09-S02 user/client mgmt) ──
  { path: '/users',             element: <UsersPage />,     roles: ['admin', 'manager'], nav: { label: 'Users', icon: Users, mobile: true } },
  { path: '/reports',           element: <ReportsPage />,   roles: ['admin', 'manager'], nav: { label: 'Reports', icon: BarChart2, mobile: true } },
  { path: '/reports/all-tasks',    element: <AllTasksReport />,       roles: ['admin', 'manager'] },
  { path: '/reports/completed',    element: <CompletedTasksReport />, roles: ['admin', 'manager'] },
  { path: '/reports/pending',      element: <PendingTasksReport />,   roles: ['admin', 'manager'] },
  { path: '/reports/master-sheet', element: <MasterSheetReport />,    roles: ['admin', 'manager'] },
  { path: '/users/new/:type',      element: <UserFormPage />,         roles: ['admin', 'manager'] },
  { path: '/users/edit/:type/:uid',element: <UserFormPage />,         roles: ['admin', 'manager'] },

  // ── Admin-only (per BMAD E10-S01 workflow config) ──
  { path: '/workflow-settings', element: <WorkflowSettings />, roles: ['admin'], nav: { label: 'Workflow Settings', mobileLabel: 'Settings', icon: Settings } },

  // ── Service catalog — staff only (clients excluded; staff can customise table fields) ──
  { path: '/services', element: <Services />, roles: ['admin', 'manager', 'team_member'], nav: { label: 'Services', icon: Layers, mobile: true } },
  { path: '/services/:serviceKey', element: <ServiceDetail />, roles: ['admin', 'manager', 'team_member'] },

  // ── Self-service (all roles) — own profile + order history (migrated from the
  //    marketing site's /my-profile, which is now a redirect into the portal) ──
  { path: '/profile', element: <ProfilePage />, roles: ALL_ROLES, nav: { label: 'My Profile', icon: User, order: 10 } },
  { path: '/orders',  element: <OrdersPage />,  roles: ALL_ROLES, nav: { label: 'My Orders', icon: Package, order: 11 } },

  // ── Shared (multi-role) — reached via Reports tile / dashboard tile; no sidebar entry ──
  { path: '/reports/leads', element: <ContactLeadsReport />, roles: ['admin', 'manager', 'team_member'] },
];
