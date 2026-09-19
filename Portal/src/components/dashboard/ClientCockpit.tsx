import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getTasks } from '../../api/tasks';
import { stepProgress } from '../../lib/stepProgress';
import type { Task } from '../../types/task';
import CockpitStat, { CockpitSection } from './CockpitStat';

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

const LIVE = new Set(['active', 'pending', 'pending_admin_approval', 'on_hold']);

/**
 * Story 39.1 — a client's dashboard answers one question: where has my work
 * got to, and does it need me?
 *
 * The figures and the list come from the SAME query, which is what makes the
 * old "0 in progress while she has active matters" bug impossible: a count
 * cannot disagree with the rows it is counted from.
 */
export default function ClientCockpit() {
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    staleTime: 5_000,
    refetchInterval: 30_000,
  });

  const live = tasks?.filter((t) => LIVE.has(t.status));
  const needsYou = live?.filter((t) => t.awaitingClient);
  const rest = live?.filter((t) => !t.awaitingClient);
  const amountDue = tasks?.reduce((n, t) => n + (t.paymentStatus === 'fully_paid' ? 0 : (t.amountDue ?? 0)), 0);
  const completed = tasks?.filter((t) => t.status === 'completed').length;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <CockpitStat
          testId="stat-needs-you"
          label="Needs you"
          value={needsYou?.length}
          to="/tasks"
          tone="warning"
          hint="An approval or a payment is waiting"
        />
        <CockpitStat testId="stat-in-progress" label="In progress" value={live?.length} to="/tasks?status=active" />
        <CockpitStat
          testId="stat-amount-due"
          label="Amount due"
          value={amountDue === undefined ? undefined : inr(amountDue)}
          to="/reports/my-services"
          tone="warning"
        />
        <CockpitStat testId="stat-completed" label="Completed" value={completed} to="/tasks?status=completed" />
      </div>

      {needsYou && needsYou.length > 0 && (
        <CockpitSection title="Waiting on you">
          <ul className="flex flex-col gap-2" data-testid="cockpit-needs-you">
            {needsYou.map((t) => <MatterRow key={t.id} task={t} highlight />)}
          </ul>
        </CockpitSection>
      )}

      <CockpitSection title="Your services" to="/tasks" linkLabel="All services">
        {rest === undefined ? (
          <div className="card p-4"><div className="h-5 w-40 rounded bg-surface-strong/70 animate-pulse" /></div>
        ) : rest.length === 0 && (needsYou?.length ?? 0) === 0 ? (
          <div className="card p-6 text-center text-sm text-ink-muted">Nothing in progress right now.</div>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="cockpit-services">
            {rest.map((t) => <MatterRow key={t.id} task={t} />)}
          </ul>
        )}
      </CockpitSection>
    </>
  );
}

/**
 * Where the matter has got to, in the client's words.
 *
 * The client projection drops steps hidden from the client (#139), so the step
 * the matter actually sits on is often absent from `steps` and a naive lookup
 * renders an em dash on every row. Fall back to the last visible step, which
 * is what the client's own tracker shows, and only then to a generic phrase.
 */
function currentStepLabel(task: Task): string | null {
  const steps = task.steps ?? [];
  const exact = steps.find((s) => s.stepNumber === task.currentStepNumber);
  if (exact) return exact.title;
  const visibleBefore = steps
    .filter((s) => s.stepNumber < (task.currentStepNumber ?? 0))
    .sort((a, b) => b.stepNumber - a.stepNumber)[0];
  return visibleBefore ? `After: ${visibleBefore.title}` : null;
}

function MatterRow({ task, highlight = false }: { task: Task; highlight?: boolean }) {
  const p = stepProgress(task);
  const current = currentStepLabel(task);
  const waiting = task.status === 'pending_admin_approval' || task.status === 'pending';
  return (
    <li>
      <Link
        to={`/tasks/${task.id}`}
        className={`group card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all ${highlight ? 'border-amber-100' : ''}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-ink truncate">{task.serviceName ?? task.workflowType}</span>
            {highlight && <span className="badge-amber shrink-0">Needs you</span>}
            {!highlight && waiting && <span className="badge-blue shrink-0">Being set up</span>}
          </div>
          <p className="mt-0.5 text-xs text-ink-muted truncate">
            {current ?? (waiting ? 'Waiting for the firm to start' : 'In progress')}
            {task.organisation ? ` · ${task.organisation}` : ''}
          </p>
          {p.pct != null && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-surface-strong/60 overflow-hidden">
                <div className="h-full rounded-full bg-ink/70" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-[11px] text-ink-muted tabular-nums shrink-0">{p.label}</span>
            </div>
          )}
        </div>
        <ArrowRight className="w-4 h-4 shrink-0 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </li>
  );
}
