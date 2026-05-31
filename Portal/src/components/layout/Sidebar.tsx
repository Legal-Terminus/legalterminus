import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const navByRole = {
  admin: [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Tasks', to: '/admin/tasks' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Reports', to: '/admin/reports' },
    { label: 'Workflow Settings', to: '/admin/workflow-settings' },
  ],
  manager: [
    { label: 'Dashboard', to: '/manager' },
    { label: 'Tasks', to: '/manager/tasks' },
  ],
  team_member: [
    { label: 'Dashboard', to: '/team' },
    { label: 'My Tasks', to: '/team/tasks' },
  ],
  client: [
    { label: 'Dashboard', to: '/client' },
    { label: 'Services', to: '/client/services' },
  ],
} as const;

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const location = useLocation();
  const links = role ? navByRole[role] ?? [] : [];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 font-bold text-lg text-blue-700 border-b border-gray-200">
        Legal Terminus
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
