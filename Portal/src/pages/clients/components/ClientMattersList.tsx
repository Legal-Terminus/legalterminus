import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { stepProgress } from '../../../lib/stepProgress';
import type { ClientMatter } from '../../../api/clients';

/**
 * Story 30.3 (CM-FR7) — every matter this client has, each one a door.
 *
 * Workbench-by-navigation: this list NEVER mutates a matter. Rows link to
 * `/tasks/:id`, where the work actually happens.
 */

const LIVE = new Set(['pending', 'active', 'on_hold', 'pending_admin_approval']);

/** Matches the Matters list vocabulary (Story 29.2 / S5) — one casing everywhere. */
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  active: 'Active',
  completed: 'Completed',
  pending_admin_approval: 'Awaiting approval',
  cancelled: 'Stopped',
  archived: 'Archived',
  on_hold: 'On hold',
};

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-surface-card text-ink-muted',
  active: 'bg-brand-50 text-brand-700',
  completed: 'bg-emerald-50 text-emerald-800',
  cancelled: 'bg-red-50 text-red-700',
  archived: 'bg-surface-card text-ink-muted',
};

const PAYMENT: Record<string, { label: string; cls: string }> = {
  not_paid: { label: 'Unpaid', cls: 'bg-red-50 text-red-700' },
  part_paid: { label: 'Part paid', cls: 'bg-amber-50 text-amber-800' },
  fully_paid: { label: 'Paid', cls: 'bg-emerald-50 text-emerald-800' },
};

function MatterRow({ m }: { m: ClientMatter }) {
  const pay = PAYMENT[m.paymentStatus] ?? PAYMENT.not_paid;
  // Progress uses the shared helper: `currentStepNumber` is a step ID, not a
  // position (see lib/stepProgress).
  const prog = stepProgress({ status: m.status, currentStepNumber: m.currentStepNumber ?? 0, totalSteps: m.totalSteps });

  return (
    <Link
      to={`/tasks/${m.id}`}
      className="flex items-center gap-3 p-4 hover:bg-surface-soft transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{m.serviceName || 'Untitled service'}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <span className={`badge ${STATUS_BADGE[m.status] ?? 'bg-surface-card text-ink-muted'}`}>
            {STATUS_LABEL[m.status] ?? m.status}
          </span>
          <span className={`badge ${pay.cls}`}>{pay.label}</span>
          {m.organisation && <span className="text-xs text-ink-muted truncate">{m.organisation}</span>}
        </div>
      </div>
      {prog.label && (
        <div className="hidden sm:flex items-center gap-2 w-32 shrink-0">
          <div className="h-1.5 flex-1 rounded-full bg-surface-card overflow-hidden">
            <div className="h-full accent-progress rounded-full" style={{ width: `${prog.pct ?? 0}%` }} />
          </div>
          <span className="text-[11px] text-ink-muted shrink-0">{prog.label}</span>
        </div>
      )}
      <ChevronRight aria-hidden="true" className="w-4 h-4 text-ink-muted shrink-0" />
    </Link>
  );
}

export default function ClientMattersList({ matters }: { matters: ClientMatter[] }) {
  const live = matters.filter((m) => LIVE.has(m.status));
  const closed = matters.filter((m) => !LIVE.has(m.status));
  // Finished work is history, not the point of the page — it stays one click away
  // so the active set leads.
  const [showClosed, setShowClosed] = useState(false);

  if (matters.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-ink-muted">No matters yet for this client.</p>
      </div>
    );
  }

  return (
    <>
      <div className="card divide-y divide-hairline overflow-hidden">
        {live.length > 0
          ? live.map((m) => <MatterRow key={m.id} m={m} />)
          : <p className="p-4 text-sm text-ink-muted">No active matters.</p>}
      </div>

      {closed.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowClosed((v) => !v)}
            aria-expanded={showClosed}
            className="mt-2 text-xs font-medium text-brand-600 hover:underline"
          >
            {showClosed ? 'Hide' : 'Show'} {closed.length} completed / closed
          </button>
          {showClosed && (
            <div className="card divide-y divide-hairline overflow-hidden mt-2">
              {closed.map((m) => <MatterRow key={m.id} m={m} />)}
            </div>
          )}
        </>
      )}
    </>
  );
}
