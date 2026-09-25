import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import SendReminderButton from '../../../components/tasks/SendReminderButton';
import type { AttentionItem } from '../../../api/clients';

/**
 * Story 30.5 (CM-FR6) — the actionable list: everything about this client that
 * is waiting on a human, oldest first.
 *
 * The ONE action offered here is the nudge, because "waiting on the client" is
 * the one problem the firm solves by asking rather than by doing. It reuses the
 * existing `SendReminderButton` (#106) — same throttling, same copy. Every other
 * row is a link to the matter, where the work lives.
 */

function waitedFor(iso: string | null): string {
  if (!iso) return '';
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '';
  const days = Math.floor((Date.now() - ms) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return '1 day';
  return `${days} days`;
}

const KIND = {
  stuck_on_client: {
    icon: Clock,
    cls: 'text-amber-800',
    label: 'Waiting on client',
    verb: 'waiting',
  },
  overdue: {
    icon: AlertTriangle,
    cls: 'text-red-700',
    label: 'Overdue',
    verb: 'late',
  },
} as const;

export default function AttentionFeed({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="card p-6 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-ink">Nothing needs attention</p>
          <p className="text-xs text-ink-muted mt-0.5">
            No overdue steps, and nothing is waiting on this client.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card divide-y divide-hairline overflow-hidden">
      {items.map((item, i) => {
        const meta = KIND[item.kind];
        const waited = waitedFor(item.since);
        return (
          <div key={`${item.taskId}-${item.kind}-${i}`} className="flex items-center gap-3 p-4">
            <meta.icon className={`w-4 h-4 shrink-0 ${meta.cls}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink truncate">
                <span className="font-medium">{meta.label}</span>
                {item.stepTitle && <span className="text-ink-muted"> · {item.stepTitle}</span>}
              </p>
              <p className="text-xs text-ink-muted truncate">
                {item.serviceName}
                {waited && ` · ${meta.verb} ${waited}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {item.kind === 'stuck_on_client' && (
                <SendReminderButton taskId={item.taskId} stepNumber={item.stepNumber} />
              )}
              <Link
                to={`/tasks/${item.taskId}`}
                className="btn-secondary !px-3 !py-1.5 text-xs"
              >
                Open
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
