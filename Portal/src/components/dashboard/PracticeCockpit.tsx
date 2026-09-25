import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTasks, getMattersBoard } from '../../api/tasks';
import { getSlaReport, getUnassignedReport, getRevenueReport } from '../../api/reports';
import CockpitStat, { CockpitSection } from './CockpitStat';
import MyWorkWidget from './MyWorkWidget';

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

/** Days a step may still have before it counts as "due soon" here. */
const AT_RISK_DAYS = 2;

/**
 * Story 39.1 — what an admin or manager sees first: the practice at a glance.
 *
 * Composes the endpoints the reports already own (SLA, unassigned, revenue,
 * the board's ownership read-model, the matter list). Nothing is fetched that
 * a report cannot already answer, and every figure links to the rows behind
 * it. Sections are ordered by who has to move: the firm, then others, then
 * money and the calendar.
 */
export default function PracticeCockpit() {
  const { data: sla } = useQuery({
    queryKey: ['report-sla', { atRiskDays: AT_RISK_DAYS }],
    queryFn: () => getSlaReport({ atRiskDays: AT_RISK_DAYS }),
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
  const { data: unassigned } = useQuery({
    queryKey: ['report-unassigned'],
    queryFn: getUnassignedReport,
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
  const { data: board } = useQuery({
    queryKey: ['matters-board'],
    queryFn: getMattersBoard,
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    staleTime: 5_000,
  });
  const { data: revenue } = useQuery({
    queryKey: ['report-revenue'],
    queryFn: getRevenueReport,
    staleTime: 60_000,
  });

  const cards = board?.lanes.flatMap((l) => l.columns.flatMap((c) => c.cards));
  const onClients = cards?.filter((c) => c.owner === 'client').length;
  const withRegistrar = cards?.filter((c) => c.owner === 'govt').length;
  const awaitingApproval = tasks?.filter((t) => t.status === 'pending_admin_approval').length;
  const active = tasks?.filter((t) => t.status === 'active').length;

  // The SLA report counts every late step whoever holds it. "Needs the firm"
  // is the team's share; a client sitting on an approval is the client's
  // lateness and belongs under "waiting on others".
  const onUs = sla?.breaches.filter((b) => b.owner === 'team');
  const overdueOnUs = onUs?.filter((b) => b.severity === 'overdue').length;
  const dueSoonOnUs = onUs?.filter((b) => b.severity === 'at_risk').length;
  const overdueOnClients = sla?.breaches.filter((b) => b.owner === 'client' && b.severity === 'overdue').length;

  const worstOverdue = (onUs ?? [])
    .filter((b) => b.severity === 'overdue')
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, 5);

  return (
    <>
      <CockpitSection title="Needs the firm" to="/reports/sla" linkLabel="SLA report">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CockpitStat
            testId="stat-overdue"
            label="Overdue steps"
            value={overdueOnUs}
            to="/reports/sla"
            tone="danger"
            hint="Past their due date, on the team"
          />
          <CockpitStat
            testId="stat-due-soon"
            label={`Due within ${AT_RISK_DAYS} days`}
            value={dueSoonOnUs}
            to="/reports/sla"
            tone="warning"
            hint="On the team, not yet late"
          />
          <CockpitStat
            testId="stat-unassigned"
            label="Unassigned work"
            value={unassigned?.length}
            to="/reports/unassigned"
            tone="warning"
            hint="Active steps with no owner"
          />
          <CockpitStat
            testId="stat-approval"
            label="Awaiting approval"
            value={awaitingApproval}
            to="/tasks?status=pending_admin_approval"
            tone="info"
            hint="New matters waiting for sign-off"
          />
        </div>
      </CockpitSection>

      <CockpitSection title="Waiting on others" to="/matters/board" linkLabel="Board">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CockpitStat
            testId="stat-on-clients"
            label="Waiting on clients"
            value={onClients}
            to="/matters/board?owner=client"
            hint={
              overdueOnClients
                ? `${overdueOnClients} past due — worth a nudge`
                : 'Payments and approvals with the client'
            }
          />
          <CockpitStat
            testId="stat-with-registrar"
            label="With the registrar"
            value={withRegistrar}
            to="/matters/board?owner=govt"
            hint="Filed, awaiting a government response"
          />
          <CockpitStat
            testId="stat-open"
            label="Open matters"
            value={active}
            to="/tasks?status=active"
          />
          <CockpitStat
            testId="stat-outstanding"
            label="Fees outstanding"
            value={revenue ? inr(revenue.outstanding) : undefined}
            to="/reports/revenue"
            tone="warning"
            hint="Billed, not yet collected"
          />
        </div>
      </CockpitSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
        <CockpitSection title="Most overdue" to="/reports/sla">
          <div className="card p-4" data-testid="cockpit-overdue-list">
            {sla === undefined ? (
              <div className="h-5 w-40 rounded bg-surface-strong/70 animate-pulse" />
            ) : worstOverdue.length === 0 ? (
              <p className="text-sm text-ink-muted">Nothing is overdue. Good.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-hairline">
                {worstOverdue.map((b) => (
                  <li key={`${b.taskId}:${b.stepNumber}`} className="py-2 first:pt-0 last:pb-0">
                    <Link to={`/tasks/${b.taskId}`} className="group flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate text-ink group-hover:text-red-700">{b.stepTitle}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {b.clientName} · {b.serviceName}
                          {b.assigneeName ? ` · ${b.assigneeName}` : ' · unassigned'}
                        </span>
                      </span>
                      <span className="badge-red shrink-0">{b.daysOverdue}d late</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CockpitSection>
        {/* E20-S02: the statutory-deadlines panel is deliberately omitted — it
            belongs to the statutory-calendar feature, which is not part of this
            epic. The panel slots in here when that feature lands. */}
      </div>

      {/* Story 39.2: the manager's own queue, rendered whenever there is one. */}
      <MyWorkWidget />
    </>
  );
}
