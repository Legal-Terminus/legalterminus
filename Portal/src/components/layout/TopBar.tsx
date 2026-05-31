import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import NotificationBell from '../notifications/NotificationBell';
import { auth } from '../../lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';

export default function TopBar() {
  const { user, signOut } = useAuthStore();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
    signOut();
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <span className="text-sm text-gray-600">{user?.displayName ?? user?.email}</span>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-500 hover:underline"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
