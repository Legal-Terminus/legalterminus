import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserCircle,
  UserCog,
  BarChart2,
  Settings,
  Scale,
} from 'lucide-react';

const navByRole = {
  admin: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Tasks', to: '/admin/tasks', icon: CheckSquare },
    { label: 'Team Members', to: '/admin/team-members', icon: Users },
    { label: 'Clients', to: '/admin/clients', icon: UserCircle },
    { label: 'Users', to: '/admin/users', icon: UserCog },
    { label: 'Reports', to: '/admin/reports', icon: BarChart2 },
    { label: 'Workflow Settings', to: '/admin/workflow-settings', icon: Settings },
  ],
  manager: [
    { label: 'Dashboard', to: '/manager', icon: LayoutDashboard },
    { label: 'Tasks', to: '/manager/tasks', icon: CheckSquare },
  ],
  team_member: [
    { label: 'Dashboard', to: '/team', icon: LayoutDashboard },
    { label: 'My Tasks', to: '/team/tasks', icon: CheckSquare },
  ],
  client: [
    { label: 'Dashboard', to: '/client', icon: LayoutDashboard },
    { label: 'Services', to: '/client/services', icon: Settings },
  ],
} as const;

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const location = useLocation();
  const links = role ? navByRole[role] ?? [] : [];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white flex flex-col shrink-0 border-r border-gray-100 shadow-sidebar">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">Legal Terminus</p>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Workflow Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="truncate">{link.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer role badge */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-500 capitalize">
            {role?.replace('_', ' ')}
          </span>
        </div>
      </div>
    </aside>
  );
}
