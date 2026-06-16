import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import NotificationBell from '../notifications/NotificationBell';
import { auth } from '../../lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { Menu, LogOut, ChevronDown, Scale } from 'lucide-react';

interface Props {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: Props) {
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
    signOut();
  };

  const initials = (user?.displayName ?? user?.email ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-hairline flex items-center justify-between px-4 shrink-0">
      {/* Left: hamburger + brand lockup — mobile only (desktop has the sidebar) */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-1 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-tight">Legal Terminus</p>
            <p className="text-[10px] text-ink-faint uppercase tracking-wider leading-none">Portal</p>
          </div>
        </div>
      </div>

      {/* Spacer on desktop (sidebar takes the left) */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-1">
        <NotificationBell />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-soft transition-colors"
          >
            <div className="w-7 h-7 bg-ink rounded-full flex items-center justify-center">
              <span className="text-[11px] font-semibold text-white">{initials}</span>
            </div>
            <span className="hidden md:block text-sm font-medium text-ink max-w-[140px] truncate">
              {user?.displayName ?? user?.email}
            </span>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-ink-muted" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-md border border-hairline z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-hairline">
                  <p className="text-sm font-semibold text-ink truncate">
                    {user?.displayName ?? 'User'}
                  </p>
                  <p className="text-xs text-ink-muted truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
