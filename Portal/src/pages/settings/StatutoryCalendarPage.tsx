import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import { useAuthStore } from '../../store/authStore';
import { getStatutoryCalendar, setStatutoryOverride, type CalendarRow } from '../../api/settings';

/**
 * Story 35.3 — the statutory calendar, and the compliance-calendar view (AC4).
 *
 * One screen serves both purposes deliberately: the same table that an admin
 * edits is the list every staff member consults for "when is GSTR-1 due?". A
 * separate read-only page would be a second thing to keep true.
 *
 * Every row says where its date came from, because a firm cannot decide whether
 * to revert something without knowing whether they changed it.
 */

const SOURCE_COPY: Record<string, string> = {
  platform: 'Standard',
  workspace: 'Your firm’s date',
  period: 'Extended for this period',
};

function thisMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function StatutoryCalendarPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const role = useAuthStore((s) => s.role);
  const canEdit = role === 'admin';

  const [month, setMonth] = useState(thisMonth());
  const { data, isLoading, isError } = useQuery({
    queryKey: ['statutory-calendar', month],
    queryFn: () => getStatutoryCalendar(month),
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [day, setDay] = useState('');

  const save = useMutation({
    mutationFn: ({ key, entry }: { key: string; entry: Record<string, unknown> | null }) =>
      setStatutoryOverride(key, entry),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['statutory-calendar'] });
      setEditing(null);
      toast.success('Calendar updated');
    },
    onError: (e: Error) => toast.error(e.message || 'Could not update the calendar'),
  });

  const rowValue = (r: CalendarRow) => {
    if (r.kind === 'day_of_month') return `Day ${r.day} of the following month`;
    if (r.kind === 'fixed_date') return r.date ?? '—';
    if (r.kind === 'anchor_offset') return `${r.offsetDays} days after the matter’s key date`;
    return '—';
  };

  return (
    <PageShell
      title="Statutory calendar"
      subtitle="The dates your firm files to. Change one here and every deadline that uses it moves."
    >
      {isLoading ? <SkeletonCards count={3} /> : isError || !data ? (
        <div className="alert-danger">The statutory calendar could not be loaded.</div>
      ) : (
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <label htmlFor="cal-month" className="text-sm text-ink-muted">Showing dates for</label>
            <input
              id="cal-month"
              type="month"
              className="rounded-md border border-hairline px-3 py-2 text-sm min-h-11"
              value={month}
              onChange={(e) => setMonth(e.target.value || thisMonth())}
            />
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="text-left text-xs text-ink-muted">
                  <th className="px-3 py-2 font-medium">Filing</th>
                  <th className="px-3 py-2 font-medium">Rule</th>
                  <th className="px-3 py-2 font-medium">Due</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                  {canEdit && <th className="px-3 py-2" />}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.key} className="border-t border-hairline align-top">
                    <td className="px-3 py-2">
                      <p className="text-sm text-ink">{r.label}</p>
                      <code className="text-xs text-ink-muted">{r.key}</code>
                    </td>
                    <td className="px-3 py-2 text-sm text-ink-muted">{rowValue(r)}</td>
                    <td className="px-3 py-2 text-sm text-ink">
                      {/* An anchored rule has no date until a matter supplies
                          its key date, which is worth saying rather than
                          showing a bare dash. */}
                      {r.resolved ?? (r.kind === 'anchor_offset' ? 'Depends on the matter' : '—')}
                    </td>
                    <td className="px-3 py-2">
                      <span className={r.source === 'platform' ? 'badge-gray' : 'badge-blue'}>
                        {SOURCE_COPY[r.source] ?? r.source}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {editing === r.key ? (
                          <span className="inline-flex items-center gap-1.5">
                            <input
                              type="number"
                              min={1}
                              max={28}
                              aria-label={`${r.label}: day of month`}
                              className="w-16 rounded-md border border-hairline px-2 py-1 text-sm min-h-11"
                              value={day}
                              onChange={(e) => setDay(e.target.value)}
                            />
                            <button
                              type="button"
                              className="text-sm text-brand-700 hover:underline min-h-11"
                              onClick={() => save.mutate({
                                key: r.key,
                                entry: { kind: 'day_of_month', day: Number(day) },
                              })}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="text-sm text-ink-muted hover:underline min-h-11"
                              onClick={() => setEditing(null)}
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            {r.kind === 'day_of_month' && (
                              <button
                                type="button"
                                className="text-sm text-brand-700 hover:underline min-h-11"
                                onClick={() => { setEditing(r.key); setDay(String(r.day ?? '')); }}
                              >
                                Change
                              </button>
                            )}
                            {r.source !== 'platform' && (
                              <button
                                type="button"
                                className="text-sm text-ink-muted hover:underline min-h-11"
                                onClick={() => save.mutate({ key: r.key, entry: null })}
                              >
                                Revert
                              </button>
                            )}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="alert-info flex items-start gap-2">
            <CalendarDays className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Changing a date here affects matters raised <strong>afterwards</strong>. Deadlines
              already stamped on in-flight matters are left as they are.
            </span>
          </div>
        </div>
      )}
    </PageShell>
  );
}
