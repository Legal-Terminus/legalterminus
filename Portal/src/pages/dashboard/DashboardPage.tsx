import PageShell from '../../components/common/PageShell';
import DashboardTile from '../../components/dashboard/DashboardTile';
import ClientCockpit from '../../components/dashboard/ClientCockpit';
import PracticeCockpit from '../../components/dashboard/PracticeCockpit';
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

  return (
    <PageShell title={dashboardTitle(role)} subtitle="Quick actions and overview.">
      {/* E-20: the cockpits state the POSITION before the navigation tiles.
          A client's dashboard answers "where has my work got to, and does it
          need me?"; admins and managers get "what needs the firm" and "what are
          we waiting on". Every figure links to the rows it was counted from. */}
      {role === 'client' && <ClientCockpit />}
      {(role === 'admin' || role === 'manager') && <PracticeCockpit />}

      {/* A team member's own queue. The cockpit above reads admin/manager reports
          they are refused, and it already includes this widget for those roles. */}
      {role === 'team_member' && <MyWorkWidget />}
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
