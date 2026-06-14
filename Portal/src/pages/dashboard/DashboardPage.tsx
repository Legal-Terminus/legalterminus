import PageShell from '../../components/common/PageShell';
import DashboardTile from '../../components/dashboard/DashboardTile';
import MyWorkWidget from '../../components/dashboard/MyWorkWidget';
import { useAuthStore } from '../../store/authStore';
import { tilesForRole, dashboardTitle } from './dashboardConfig';

/**
 * Unified dashboard for every role. Tiles are filtered from DASHBOARD_TILES by
 * the current role — there is no per-role dashboard component. Role-specific
 * rich widgets, when needed, can be added here behind a `role === …` guard.
 */
export default function DashboardPage() {
  const role = useAuthStore((s) => s.role);
  const tiles = tilesForRole(role);
  const isStaff = role === 'admin' || role === 'manager' || role === 'team_member';

  return (
    <PageShell title={dashboardTitle(role)} subtitle="Quick actions and overview.">
      {/* What's waiting on you — urgent assigned steps + approvals (staff only). */}
      {isStaff && <MyWorkWidget />}
      {tiles.length === 0 ? (
        <div className="card p-12 text-center text-ink-muted text-sm">
          Nothing to show here yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tiles.map((tile) => (
            <DashboardTile
              key={tile.to + tile.title}
              to={tile.to}
              title={tile.title}
              desc={tile.desc}
              icon={tile.icon}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
