import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { mobileNavForRole, isNavActive } from './navConfig';

export default function BottomNav() {
  const role = useAuthStore((s) => s.role);
  const location = useLocation();
  const links = mobileNavForRole(role);

  if (!role || links.length === 0) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-hairline flex">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isNavActive(link.to, location.pathname);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              active ? 'text-ink' : 'text-ink-faint'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-ink' : 'text-ink-faint'}`} />
            {link.mobileLabel ?? link.label}
          </Link>
        );
      })}
    </nav>
  );
}
