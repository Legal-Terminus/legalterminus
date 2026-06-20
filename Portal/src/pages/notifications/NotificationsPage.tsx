import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useNotifications } from '../../hooks/useNotifications';
import type { NotificationType } from '../../types/notification';

/**
 * Full notifications page (E07-S01) — the complete list behind the topbar bell.
 * Clicking a notification marks it read and deep-links to its matter (when set).
 */
const ICON: Record<NotificationType, { Icon: typeof Info; cls: string }> = {
  info:    { Icon: Info,          cls: 'text-ink-muted' },
  success: { Icon: CheckCircle2,  cls: 'text-emerald-600' },
  warning: { Icon: AlertTriangle, cls: 'text-amber-600' },
  error:   { Icon: AlertCircle,   cls: 'text-red-600' },
};

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading, markRead, markAllRead, unreadCount } = useNotifications();

  return (
    <PageShell
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up.'}
      action={
        notifications.some((n) => !n.read) ? (
          <button onClick={() => markAllRead()} className="btn-secondary inline-flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="card p-16 flex justify-center text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Bell className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">No notifications yet.</p>
        </div>
      ) : (
        <div className="card divide-y divide-hairline-soft">
          {notifications.map((n) => {
            const meta = ICON[n.type] ?? ICON.info;
            return (
              <button
                key={n.id}
                onClick={() => { markRead(n.id); if (n.taskId) navigate(`/tasks/${n.taskId}`); }}
                className={`w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-surface-soft transition-colors ${!n.read ? 'bg-brand-50/40' : ''}`}
              >
                <meta.Icon className={`w-4 h-4 mt-0.5 shrink-0 ${meta.cls}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  {n.message && <p className="text-sm text-ink-muted mt-0.5">{n.message}</p>}
                  <p className="text-[11px] text-ink-faint mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />}
              </button>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
