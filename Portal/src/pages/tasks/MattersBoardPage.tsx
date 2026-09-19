import { useEffect, useMemo, useState } from 'react';
import MatterViewToggle, { rememberView } from '../../components/tasks/MatterViewToggle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flame, Info } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { getMattersBoard, type BoardCard, type BoardLane } from '../../api/tasks';
import { OWNER_STYLE, type OwnerType } from '../../api/workflowDefinitions';

/**
 * Story 31.2 — the matters board (Epic 31).
 *
 * Every competitor opens their demo on a kanban; we had none, even though the
 * engine models something none of them can: WHO the ball is with. So the board's
 * primary signal is ownership — "is this on us, the client, or the registrar?" —
 * which a tracker cannot answer.
 *
 * **Additive only** (Epic 31 constraint): this is a NEW route alongside
 * `/tasks`, which is untouched. It reads the same matters endpoint and the
 * cached definitions; it adds no field, changes no engine behaviour, and cannot
 * mutate a matter.
 *
 * **Columns are per-service swimlanes** (decided with the product owner): each
 * service shows its OWN phases. A single shared column set would have to invent
 * labels ("Middle") that no firm's process actually uses, and a union of every
 * workflow's phases would be actively misleading.
 *
 * **No drag-and-drop** (AC6): matters advance through workflow events — gates,
 * approvals, payments. Dragging a card would have to either bypass that engine
 * or silently fail. The card's affordance is *open*, not *move*.
 */

function MatterCard({ card, onOpen }: { card: BoardCard; onOpen: () => void }) {
  const style = OWNER_STYLE[card.owner];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left card p-3 hover:shadow-card-hover transition-shadow relative overflow-hidden"
    >
      {/* Ownership as a left edge — colour PLUS the chip below, so it is never
          colour alone (AC2). */}
      <span aria-hidden="true" className={`absolute left-0 inset-y-0 w-1 ${style.dot}`} />
      <div className="pl-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink truncate">{card.clientName || 'Client unavailable'}</p>
          {card.isUrgent && (
            <span className="badge bg-red-50 text-red-700 inline-flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3" fill="currentColor" aria-hidden="true" /> Urgent
            </span>
          )}
        </div>
        <p className="text-xs text-ink-muted truncate mt-0.5">{card.serviceName}</p>
        <p className="text-xs text-ink mt-1.5 truncate">{card.stepTitle || '—'}</p>

        {/* How far through the workflow. By step POSITION, never stepNumber —
            that is a stable id, so a 14-step workflow can sit on "step 51". */}
        {card.stepPosition != null && card.stepTotal != null && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
              <span>Step {card.stepPosition} of {card.stepTotal}</span>
              <span>{card.progressPct}%</span>
            </div>
            <div className="h-1 rounded-full bg-surface-card overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${card.progressPct ?? 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`badge ${style.chip}`}>{style.label}</span>
          {/* WHO is on it. The lane says which service; the owner chip says
              whose turn; this says the actual person to chase. */}
          {card.assignedToName && (
            <span className="text-[11px] text-ink-muted truncate">{card.assignedToName}</span>
          )}
          {card.daysInStep != null && (
            <span className="text-[11px] text-ink-muted">
              {card.daysInStep === 0 ? 'today' : `${card.daysInStep}d in step`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function MattersBoardPage() {
  const navigate = useNavigate();
  // Arriving here at all — by toggle, bookmark or deep link — is a preference.
  useEffect(() => { rememberView('board'); }, []);
  // Story 39.1: the dashboard's "waiting on clients" figure deep-links here
  // with `?owner=client`; the chips remain the source of truth after arrival.
  const [searchParams] = useSearchParams();
  const initialOwner = searchParams.get('owner');
  const [ownerFilter, setOwnerFilter] = useState<OwnerType | ''>(
    initialOwner === 'client' || initialOwner === 'team' || initialOwner === 'govt' ? initialOwner : '',
  );
  const [serviceFilter, setServiceFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['matters-board'],
    queryFn: getMattersBoard,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  /** Filters are applied to the server's lanes; empty columns/lanes drop out. */
  const lanes: BoardLane[] = useMemo(() => {
    const all = data?.lanes ?? [];
    return all
      .filter((l) => !serviceFilter || l.defId === serviceFilter)
      .map((l) => {
        // Keep EVERY column the server sent, empty or not — that is what makes
        // this a board. The server already decides which columns exist (all
        // authored phases, plus the unphased catch-all only when used); a second
        // filter here silently undid that and rendered 2 of 5 columns.
        const columns = l.columns
          .map((c) => ({ ...c, cards: ownerFilter ? c.cards.filter((k) => k.owner === ownerFilter) : c.cards }));
        return { ...l, columns, total: columns.reduce((n, c) => n + c.cards.length, 0) };
      })
      .filter((l) => l.total > 0);
  }, [data, ownerFilter, serviceFilter]);

  const services = useMemo(
    () => (data?.lanes ?? []).map((l) => [l.defId, l.name] as const),
    [data],
  );

  const totalShown = lanes.reduce((n, l) => n + l.total, 0);
  return (
    <PageShell
      title="Matters"
      subtitle="Live matters by stage — and who each one is waiting on."
      action={<MatterViewToggle current="board" />}
    >
      {/* Filters + legend. Owner is first because "what's stuck on clients?" is
          the question this board exists to answer. */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div role="group" aria-label="Filter by who it is waiting on" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOwnerFilter('')}
            aria-pressed={ownerFilter === ''}
            className={`min-h-11 px-3 rounded-lg text-sm font-medium ${
              ownerFilter === '' ? 'bg-ink text-white' : 'bg-surface-soft text-ink-muted hover:bg-surface-card'
            }`}
          >
            Everyone
          </button>
          {(['team', 'client', 'govt'] as OwnerType[]).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOwnerFilter(o)}
              aria-pressed={ownerFilter === o}
              className={`min-h-11 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 ${
                ownerFilter === o ? 'bg-ink text-white' : 'bg-surface-soft text-ink-muted hover:bg-surface-card'
              }`}
            >
              <span aria-hidden="true" className={`w-2 h-2 rounded-full ${OWNER_STYLE[o].dot}`} />
              {OWNER_STYLE[o].label}
            </button>
          ))}
        </div>
        {services.length > 1 && (
          <select
            aria-label="Filter by service"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="input-field py-1.5 text-sm w-auto min-w-[12rem]"
          >
            <option value="">All services</option>
            {services.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        )}
      </div>

      {isLoading ? (
        <div aria-busy="true" aria-label="Loading board"><SkeletonCards count={6} /></div>
      ) : error ? (
        <div className="alert-danger">{(error as Error).message}</div>
      ) : lanes.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-sm font-medium text-ink">
            {ownerFilter || serviceFilter ? 'Nothing matches these filters' : 'No live matters'}
          </p>
          <p className="text-xs text-ink-muted mt-1">
            {ownerFilter || serviceFilter
              ? 'Clear a filter to see the rest of the board.'
              : 'Matters appear here as soon as they are created.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-ink-muted mb-3">
            {totalShown} live matter{totalShown === 1 ? '' : 's'}
          </p>

          <div className="flex flex-col gap-5">
            {lanes.map((lane) => (
              /* Each service is a bounded LANE. Without the border and tint the
                 columns had no edges, so headers floated and cards drifted into
                 whitespace — it read as a list, not a board. */
              <section
                key={lane.defId}
                className="rounded-xl border border-hairline bg-surface-soft/60 overflow-hidden"
              >
                <h2 className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-white">
                  <span className="text-sm font-semibold text-ink">{lane.name}</span>
                  <span className="badge-gray">{lane.total}</span>
                </h2>
                {/* Columns scroll horizontally INSIDE the lane, so the page
                    itself never scrolls sideways (the repo's layout rule). */}
                <div className="overflow-x-auto p-3">
                  <div className="flex gap-3 min-w-min items-stretch">
                    {lane.columns.map((col) => (
                      /* A column is a visible track, so an EMPTY stage still
                         reads as a stage rather than blank space. */
                      <div
                        key={col.id}
                        className={`w-64 shrink-0 rounded-lg border border-hairline/70 flex flex-col ${
                          col.cards.length ? 'bg-white' : 'bg-surface-card/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-hairline/70">
                          <p className="text-xs font-semibold text-ink-soft truncate">{col.name}</p>
                          <span className={`text-[11px] tabular-nums shrink-0 ${
                            col.cards.length ? 'text-ink' : 'text-ink-faint'
                          }`}>
                            {col.cards.length}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 p-2 min-h-[4.5rem] flex-1">
                          {col.cards.length === 0 ? (
                            /* An empty stage says so quietly. Nothing here IS
                               the information — but it must not shout. */
                            <p className="text-[11px] text-ink-faint text-center py-4">Nothing at this stage</p>
                          ) : col.cards.map((card) => (
                            <MatterCard
                              key={card.id}
                              card={card}
                              onOpen={() => navigate(`/tasks/${card.id}`)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* AC6: say why there is no dragging, before someone tries. */}
          <p className="mt-6 flex items-start gap-1.5 text-xs text-ink-muted">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            Cards open a matter — they don&apos;t drag. Matters move when their
            workflow advances (an approval, a payment, a completed step), so the
            board always reflects what actually happened.
          </p>
        </>
      )}
    </PageShell>
  );
}
