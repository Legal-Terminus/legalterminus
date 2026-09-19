import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { AlertTriangle, ChevronRight, Clock, FileText, Moon, UserPlus } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import DataGrid from '../../components/common/DataGrid';
import {
  getClients, needsAttention, CLIENTS_QUERY_KEY,
  type ClientRollup,
} from '../../api/clients';

/**
 * Story 30.2 — the client roster (Epic 30).
 *
 * Cometflow is matter-centric, so "which client relationships need me today?"
 * had no home. This page answers exactly that: rows are clients, ordered
 * attention-first by the server, and every row is a door into that client's 360.
 *
 * It does NOT manage people — `/users` remains the CRUD surface. The two
 * cross-link; neither duplicates the other.
 */

/** ₹ with the Indian grouping every other money surface uses. */
const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

/**
 * Money for a client with NO priced matter is unknown, not zero. Rendering ₹0
 * would assert something false about the relationship's value (the S12 lesson).
 */
const money = (value: number, hasPriced: boolean) => (hasPriced ? inr(value) : '—');

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function relativeDays(iso: string | null): string {
  if (!iso) return '—';
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';
  const days = Math.floor((Date.now() - ms) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return shortDate(iso);
}

/**
 * The attention badges. Colour marks the EXCEPTION only — a healthy client shows
 * nothing at all rather than a row of green "0"s (the S8 lesson: 49 amber badges
 * for the normal state made the one that mattered invisible).
 */
function AttentionBadges({ c }: { c: ClientRollup }) {
  const badges = [
    c.overdue > 0 && {
      key: 'overdue',
      cls: 'bg-red-50 text-red-700',
      icon: AlertTriangle,
      text: `${c.overdue} overdue`,
      title: 'Steps past their due date — we are late',
    },
    c.stuckOnClient > 0 && {
      key: 'stuck',
      cls: 'bg-amber-50 text-amber-800',
      icon: Clock,
      text: `${c.stuckOnClient} with client`,
      title: 'Waiting on the client to approve, sign or upload',
    },
    c.docsPending > 0 && {
      key: 'docs',
      cls: 'bg-blue-50 text-blue-800',
      icon: FileText,
      text: `${c.docsPending} to review`,
      title: 'Documents the client submitted, awaiting our review',
    },
    c.isQuiet && {
      key: 'quiet',
      cls: 'bg-surface-card text-ink-muted',
      icon: Moon,
      text: `quiet ${c.quietDays}d`,
      title: 'Live work, but no activity for a while',
    },
  ].filter(Boolean) as { key: string; cls: string; icon: typeof Clock; text: string; title: string }[];

  if (badges.length === 0) {
    return <span className="text-xs text-ink-muted">—</span>;
  }
  return (
    <span className="flex flex-wrap items-center gap-1">
      {badges.map((b) => (
        <span key={b.key} className={`badge ${b.cls} inline-flex items-center gap-1`} title={b.title}>
          <b.icon className="w-3 h-3" aria-hidden="true" />
          {b.text}
        </span>
      ))}
    </span>
  );
}

const col = createColumnHelper<ClientRollup>();

export default function ClientsPage() {
  const navigate = useNavigate();
  const [attentionOnly, setAttentionOnly] = useState(false);
  // E01-S34-1 (AC1): filter the roster by tag.
  const [tagFilter, setTagFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: () => getClients({ limit: 100 }),
    staleTime: 30_000,
  });

  const rows = useMemo(() => {
    let all = data?.data ?? [];
    if (attentionOnly) all = all.filter(needsAttention);
    if (tagFilter) all = all.filter((c) => (c.tags ?? []).includes(tagFilter));
    return all;
  }, [data, attentionOnly, tagFilter]);

  // Offered from the tags clients ACTUALLY carry, so the filter can never
  // present an option that returns nothing.
  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of data?.data ?? []) for (const t of c.tags ?? []) set.add(t);
    return [...set].sort();
  }, [data]);

  const attentionCount = useMemo(
    () => (data?.data ?? []).filter(needsAttention).length,
    [data],
  );

  const columns = useMemo(() => [
    col.accessor('name', {
      header: 'Client',
      size: 220,
      cell: (ctx) => {
        const c = ctx.row.original;
        // The organisation matters: one client can hold matters under several
        // (#118), and the firm files under the org, not the person.
        const org = c.organisation || c.businessName;
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{c.name}</p>
            {org && <p className="text-xs text-ink-muted truncate">{org}</p>}
          </div>
        );
      },
    }),
    col.accessor('attentionScore', {
      header: 'Attention',
      size: 260,
      cell: (ctx) => <AttentionBadges c={ctx.row.original} />,
    }),
    col.accessor('activeMatters', {
      header: 'Active',
      size: 90,
      cell: (ctx) => {
        const c = ctx.row.original;
        return (
          <span className="text-sm text-ink">
            {c.activeMatters}
            {c.completedMatters > 0 && (
              <span className="text-xs text-ink-muted"> · {c.completedMatters} done</span>
            )}
          </span>
        );
      },
    }),
    col.accessor('outstanding', {
      header: 'Outstanding',
      size: 120,
      cell: (ctx) => {
        const c = ctx.row.original;
        return (
          <span className={`text-sm ${c.outstanding > 0 ? 'text-amber-800 font-medium' : 'text-ink-muted'}`}>
            {money(c.outstanding, c.hasPricedMatter)}
          </span>
        );
      },
    }),
    col.accessor('nextRenewalAt', {
      header: 'Next renewal',
      size: 120,
      cell: (ctx) => <span className="text-sm text-ink-muted">{shortDate(ctx.getValue())}</span>,
    }),
    col.accessor('lastActivityAt', {
      header: 'Last activity',
      size: 120,
      cell: (ctx) => <span className="text-sm text-ink-muted">{relativeDays(ctx.getValue())}</span>,
    }),
  ], []);

  return (
    <PageShell
      title="Clients"
      subtitle="Every client relationship, and what needs you today."
      action={(
        <button onClick={() => navigate('/users/new/client')} className="btn-primary inline-flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Add Client</span><span className="sm:hidden">Add</span>
        </button>
      )}
    >
      <DataGrid<ClientRollup>
        tableId="clients"
        data={rows}
        columns={columns}
        getRowId={(c) => c.uid}
        onRowClick={(c) => navigate(`/clients/${c.uid}`)}
        isLoading={isLoading}
        error={error as Error | null}
        loadingLabel="Loading clients…"
        searchPlaceholder="Search by name, email or organisation…"
        globalFilterFn={(row, _id, q) => {
          const c = row.original;
          const s = q.toLowerCase();
          return c.name.toLowerCase().includes(s)
            || c.email.toLowerCase().includes(s)
            || c.organisation.toLowerCase().includes(s)
            || c.businessName.toLowerCase().includes(s);
        }}
        toolbar={(
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setAttentionOnly(false)}
              aria-pressed={!attentionOnly}
              className={`min-h-11 px-3 rounded-lg text-sm font-medium ${
                !attentionOnly ? 'bg-ink text-white' : 'bg-surface-soft text-ink-muted hover:bg-surface-card'
              }`}
            >
              All clients {data ? `· ${data.data.length}` : ''}
            </button>
            <button
              type="button"
              onClick={() => setAttentionOnly(true)}
              aria-pressed={attentionOnly}
              className={`min-h-11 px-3 rounded-lg text-sm font-medium ${
                attentionOnly ? 'bg-ink text-white' : 'bg-surface-soft text-ink-muted hover:bg-surface-card'
              }`}
            >
              Needs attention {data ? `· ${attentionCount}` : ''}
            </button>
            {/* E01-S34-1: only shown once tags exist — an empty dropdown is
                clutter that teaches nothing. */}
            {tagOptions.length > 0 && (
              <select
                aria-label="Filter by tag"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="min-h-11 rounded-lg border border-hairline px-3 text-sm bg-white"
              >
                <option value="">All tags</option>
                {tagOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>
        )}
        emptyLabel={attentionOnly ? 'Nothing needs attention' : 'No clients yet'}
        emptyAction={attentionOnly ? (
          <p className="text-xs text-ink-muted">Every client relationship is on track.</p>
        ) : (
          <button onClick={() => navigate('/users/new/client')} className="btn-primary">
            Add your first client
          </button>
        )}
        renderMobileCard={(c) => (
          <div className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{c.name}</p>
                {(c.organisation || c.businessName) && (
                  <p className="text-xs text-ink-muted truncate">{c.organisation || c.businessName}</p>
                )}
              </div>
              <ChevronRight aria-hidden="true" className="w-4 h-4 text-ink-muted shrink-0" />
            </div>
            <div className="mt-2"><AttentionBadges c={c} /></div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span>{c.activeMatters} active</span>
              <span>Outstanding {money(c.outstanding, c.hasPricedMatter)}</span>
              <span>{relativeDays(c.lastActivityAt)}</span>
            </div>
          </div>
        )}
      />
    </PageShell>
  );
}
