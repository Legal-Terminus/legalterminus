import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import NotificationBell from '../notifications/NotificationBell';
import { auth } from '../../lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function TopBar() {
  const { user, signOut } = useAuthStore();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
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
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <NotificationBell />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-brand-700">{initials}</span>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[140px] truncate">
              {user?.displayName ?? user?.email}
            </span>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-1.5 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.displayName ?? 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
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

