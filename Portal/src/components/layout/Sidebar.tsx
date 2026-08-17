import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { navForRole, isNavActive } from './navConfig';
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { LTMark } from '../common/LTLogo';

interface Props {
  onClose: () => void;
  collapsed?: boolean;           // #72: desktop icon-rail mode
  onToggleCollapse?: () => void;
}

export default function Sidebar({ onClose, collapsed = false, onToggleCollapse }: Props) {
  const role = useAuthStore((s) => s.role);
  const location = useLocation();
  const links = navForRole(role);

  return (
    <aside className="flex flex-col h-full">
      {/* Logo row */}
      <div className={`h-14 flex items-center border-b border-hairline shrink-0 ${collapsed ? 'md:justify-center px-2' : 'justify-between px-4'}`}>
        <div className="flex items-center gap-2.5">
          {/* #110: the real LT mark. Collapsed shows the mark alone; expanded
              pairs it with the name, which the mark's aria-label already carries
              — so the text is decorative here. */}
          <LTMark className="h-8 w-auto shrink-0 text-ink" />
          {!collapsed && (
            <div aria-hidden>
              <p className="text-sm font-semibold text-ink leading-tight">Legal Terminus</p>
              <p className="text-[10px] text-ink-faint uppercase tracking-wider">Portal</p>
            </div>
          )}
        </div>
        {/* Desktop collapse toggle */}
        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:inline-flex p-1.5 rounded-lg text-ink-muted hover:bg-surface-soft transition-colors"
            title="Collapse menu" aria-label="Collapse menu"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-ink-muted hover:bg-surface-soft transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Expand toggle when collapsed (desktop) */}
      {onToggleCollapse && collapsed && (
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center py-2 text-ink-muted hover:bg-surface-soft transition-colors border-b border-hairline"
          title="Expand menu" aria-label="Expand menu"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = isNavActive(link.to, location.pathname);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              title={collapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 group ${collapsed ? 'md:justify-center' : ''} ${
                isActive
                  ? 'bg-ink text-white'
                  : 'text-ink-muted hover:bg-surface-soft hover:text-ink'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role indicator */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-hairline shrink-0">
          <div className="flex items-center gap-2 px-2 py-2 bg-surface-soft rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-ink-muted capitalize">
              {role?.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
