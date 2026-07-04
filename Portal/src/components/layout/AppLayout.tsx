import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // #72: desktop collapse to an icon rail, persisted.
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('sidebarCollapsed') === '1'; } catch { return false; }
  });
  const toggleCollapsed = () => setCollapsed((v) => {
    const next = !v;
    try { localStorage.setItem('sidebarCollapsed', next ? '1' : '0'); } catch { /* ignore */ }
    return next;
  });

  return (
    <div className="flex h-dvh bg-white overflow-hidden">
      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open; collapsible to an icon rail on desktop. */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 bg-white border-r border-hairline
          transform transition-all duration-200 ease-out
          md:relative md:translate-x-0 md:flex md:flex-col md:shrink-0
          ${collapsed ? 'md:w-16' : 'md:w-64'} w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
