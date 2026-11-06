import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { getTasks } from '../../api/tasks';
import { getMyServiceRequests, MY_SERVICE_REQUESTS_KEY, type ServiceRequest } from '../../api/websiteOrders';
import { REFUND_STATUS, type RefundSummary } from '../../api/refunds';
import { stepProgress } from '../../lib/stepProgress';
import type { Task } from '../../types/task';
import CockpitStat, { CockpitSection } from './CockpitStat';

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const LIVE = new Set(['active', 'pending', 'pending_admin_approval', 'on_hold']);

/**
 * Story 39.1 — a client's dashboard answers one question: where has my work
 * got to, and does it need me?
 *
 * The figures and the list come from the SAME query, which is what makes the
 * old "0 in progress while she has active matters" bug impossible: a count
 * cannot disagree with the rows it is counted from.
 *
 * #242: a client who bought on the website has PAID, but no matter exists until
 * the firm approves the order. Until they have a matter the same four cards
 * show the request instead (Payment status, Matter status, Amount paid, Service
 * requests) with a Pending Approval notice — never "₹0 due" or workflow
 * progress. It follows the data: once an order is approved its matter appears
 * in the tasks query and the usual cards return, on the next refetch.
 *
 * #240: a fifth "Refund" card appears beside the four only when the client has
 * a refund — colour marks the exception, and a zero is never shown.
 */
export default function ClientCockpit() {
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    staleTime: 5_000,
    refetchInterval: 30_000,
  });
  const { data: requestsRes } = useQuery({
    queryKey: MY_SERVICE_REQUESTS_KEY,
    queryFn: getMyServiceRequests,
    staleTime: 5_000,
    refetchInterval: 30_000,
  });
  // Orders still without a matter: waiting for approval, or refunded before it.
  const requests = requestsRes?.data.filter((o) => o.stage !== 'approved');
  const refund = refundCard(tasks ?? [], requestsRes?.data ?? []);

  // Before approval: paid on the website, and no matter yet.
  if (tasks && tasks.length === 0 && requests && requests.length > 0) {
    return <PreApprovalCockpit requests={requests} refund={refund} />;
  }
  const waiting = requests?.filter((o) => o.stage !== 'refunded') ?? [];

  const live = tasks?.filter((t) => LIVE.has(t.status));
  const needsYou = live?.filter((t) => t.awaitingClient);
  const rest = live?.filter((t) => !t.awaitingClient);
  const amountDue = tasks?.reduce((n, t) => n + (t.paymentStatus === 'fully_paid' ? 0 : (t.amountDue ?? 0)), 0);
  const completed = tasks?.filter((t) => t.status === 'completed').length;

  return (
    <>
      <div className={`grid grid-cols-2 ${refund ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 mb-6`}>
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
        {refund && <RefundStat refund={refund} />}
      </div>

      {/* #242: a new purchase waiting for approval, beside matters already open. */}
      {waiting.length > 0 && (
        <CockpitSection title="Waiting for approval">
          <ul className="flex flex-col gap-2" data-testid="cockpit-awaiting-approval">
            {waiting.map((o) => <RequestRow key={o.orderId} request={o} />)}
          </ul>
        </CockpitSection>
      )}

      {needsYou && needsYou.length > 0 && (
        <CockpitSection title="Waiting on you">
          <ul className="flex flex-col gap-2" data-testid="cockpit-needs-you">
            {needsYou.map((t) => <MatterRow key={t.id} task={t} highlight />)}
          </ul>
        </CockpitSection>
      )}

      <CockpitSection title="Your services" to="/tasks" linkLabel="All services">
        {rest === undefined ? (
          <div className="card p-4"><div className="h-5 w-40 rounded-sm bg-surface-strong/70 animate-pulse" /></div>
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
  // #195: "before" means earlier in AUTHORED order, never a lower step NUMBER —
  // `steps` already arrives in flow order, so take the last one preceding the
  // current step's position. Sorting by number names the wrong step on any
  // workflow whose ids don't ascend with its flow.
  const idx = steps.findIndex((s) => s.stepNumber === task.currentStepNumber);
  const visibleBefore = idx > 0
    ? steps[idx - 1]
    : (idx === -1 ? steps[steps.length - 1] : undefined);
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

/* ───────────── #242 before approval · #240 the Refund card ───────────── */

interface RefundCardData { total: number; latest: NonNullable<RefundSummary['latest']>; to: string }

/** Every refund the client has — on matters and on orders never approved. */
function refundCard(tasks: Task[], requests: ServiceRequest[]): RefundCardData | null {
  const sources: { summary: RefundSummary; to: string }[] = [
    ...tasks.filter((t) => t.refundSummary?.count).map((t) => ({ summary: t.refundSummary!, to: `/tasks/${t.id}` })),
    ...requests.filter((o) => o.refund?.count).map((o) => ({ summary: o.refund!, to: '/orders' })),
  ];
  if (sources.length === 0) return null;
  const withLatest = sources.filter((x) => x.summary.latest)
    .sort((a, b) => String(b.summary.latest!.initiatedAt).localeCompare(String(a.summary.latest!.initiatedAt)));
  if (withLatest.length === 0) return null;
  return {
    total: sources.reduce((n, x) => n + (x.summary.activeTotal ?? 0), 0),
    latest: withLatest[0].summary.latest!,
    to: withLatest[0].to,
  };
}

function RefundStat({ refund }: { refund: RefundCardData }) {
  const st = refund.latest.status;
  return (
    <CockpitStat
      testId="stat-refund"
      label="Refund"
      value={inr(refund.total)}
      to={refund.to}
      tone={st === 'failed' ? 'danger' : st === 'credited' ? 'success' : 'info'}
      hint={`${REFUND_STATUS[st].label} · ${refund.latest.reason}`}
    />
  );
}

const STAGE: Record<ServiceRequest['stage'], { label: string; cls: string }> = {
  awaiting_approval: { label: 'Pending approval', cls: 'badge-blue' },
  under_review: { label: 'Payment under review', cls: 'badge-amber' },
  refund_in_progress: { label: 'Refund in progress', cls: 'badge-blue' },
  refunded: { label: 'Refunded', cls: 'badge-gray' },
  approved: { label: 'Approved', cls: 'badge-gray' },
};

function PreApprovalCockpit({ requests, refund }: { requests: ServiceRequest[]; refund: RefundCardData | null }) {
  const live = requests.filter((o) => o.stage !== 'refunded' && o.stage !== 'refund_in_progress');
  const allRefunded = live.length === 0;
  const underReview = requests.some((o) => o.stage === 'under_review');
  const paid = requests.reduce((n, o) => n + (o.amountPaid ?? 0), 0);

  const payment = allRefunded
    ? (requests.every((o) => o.stage === 'refunded') ? 'Refunded' : 'Refund in progress')
    : underReview ? 'Under review' : 'Paid';
  const matter = allRefunded ? 'Cancelled' : 'Pending approval';

  return (
    <>
      <div
        role="status"
        data-testid="pending-approval-notice"
        className={`mb-4 rounded-lg border p-4 flex gap-3 ${allRefunded ? 'border-hairline bg-surface-card' : 'border-blue-100 bg-blue-50'}`}
      >
        <Clock className={`w-5 h-5 shrink-0 mt-0.5 ${allRefunded ? 'text-ink-muted' : 'text-blue-700'}`} aria-hidden="true" />
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${allRefunded ? 'text-ink' : 'text-blue-800'}`}>
            {allRefunded ? 'Service cancelled' : 'Pending approval'}
          </p>
          <p className={`text-sm mt-0.5 ${allRefunded ? 'text-ink-muted' : 'text-blue-800'}`}>
            {allRefunded
              ? 'Your request was cancelled before work began, and your payment is being refunded. The details are below.'
              : 'We have received your payment. Our team is reviewing your request, and your matter will appear here once it is approved.'}
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-2 ${refund ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 mb-6`}>
        <CockpitStat testId="stat-payment-status" label="Payment status" value={payment} to="/orders"
          tone={underReview ? 'warning' : undefined} hint={underReview ? 'We are checking the amount received' : undefined} />
        <CockpitStat testId="stat-matter-status" label="Matter status" value={matter} to="/dashboard"
          tone={allRefunded ? undefined : 'info'} hint={allRefunded ? undefined : 'Waiting for our team to approve'} />
        <CockpitStat testId="stat-amount-paid" label="Amount paid" value={inr(paid)} to="/orders" />
        <CockpitStat testId="stat-service-requests" label="Service requests" value={requests.length} to="/orders" />
        {refund && <RefundStat refund={refund} />}
      </div>

      <CockpitSection title="Your service requests" to="/orders" linkLabel="My orders">
        <ul className="flex flex-col gap-2" data-testid="cockpit-service-requests">
          {requests.map((o) => <RequestRow key={o.orderId} request={o} />)}
        </ul>
      </CockpitSection>
    </>
  );
}

/** One paid website order with no matter yet. No progress bar: there is no workflow to show. */
function RequestRow({ request: o }: { request: ServiceRequest }) {
  const stage = STAGE[o.stage];
  const r = o.refund?.latest;
  return (
    <li className="card p-4" data-testid="service-request">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-ink truncate">{o.label}{o.planName ? ` — ${o.planName}` : ''}</span>
        <span className={`${stage.cls} shrink-0`}>{stage.label}</span>
      </div>
      <p className="mt-0.5 text-xs text-ink-muted">
        Paid {inr(o.amountPaid)} · Order {o.orderId}
        {o.paidAt ? ` · ${new Date(o.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
      </p>
      {r && (
        <p className="mt-1 text-xs text-ink" data-testid="service-request-refund">
          Refund {inr(r.refundAmount)} · {REFUND_STATUS[r.status].label} · {r.reason}
          {r.transactionId ? ` · Ref ${r.transactionId}` : ''}
        </p>
      )}
    </li>
  );
}
