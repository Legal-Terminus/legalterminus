import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Lock, Eye, Settings2, Plus, Loader2 } from 'lucide-react';
import {
  getMyReportingAccess, getSheet, putSheetDay, putSheetColumns, getReporting,
  type SheetKey, type SectionKey, type SheetView, type SheetGroup, type SheetColumn, type DayValues,
} from '../../api/marketing';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/common/toastContext';

/**
 * #197 — DM Cost, DM Income, Cold Calling Income and the consolidated monthly
 * Reporting, in place of the Excel workbooks. Pick the sheet from the dropdown;
 * each sheet is a month of days with the firm's columns, and every total —
 * per group, combined, the month and the financial year to date — is
 * calculated, never typed.
 *
 * Only the sections an admin has granted appear (Settings → Reporting access);
 * with view access the cells are read-only.
 */

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const fmt = (n: number | null | undefined) => (n == null ? '—' : inr.format(n));
const thisMonth = () => new Date().toISOString().slice(0, 7);
const todayISO = () => new Date().toISOString().slice(0, 10);
const dayLabel = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const monthLabel = (m: string) => new Date(`${m}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

const ORDER: SectionKey[] = ['dm_cost', 'dm_income', 'cold_calling', 'reporting'];

export default function MarketingReportsPage() {
  const role = useAuthStore((s) => s.role);
  const { data: access, isLoading } = useQuery({ queryKey: ['reporting-access-me'], queryFn: getMyReportingAccess, staleTime: 30_000 });
  const available = useMemo(
    () => ORDER.filter((k) => access?.levels[k]).map((k) => ({ key: k, label: access!.sections.find((s) => s.key === k)!.label })),
    [access],
  );
  const [section, setSection] = useState<SectionKey | ''>('');
  useEffect(() => { if (!section && available.length) setSection(available[0].key); }, [available, section]);
  const [month, setMonth] = useState(thisMonth());

  return (
    <div className="flex flex-col min-h-full">
      <div className="page-header">
        <div className="flex items-center gap-3">
          {(role === 'admin' || role === 'manager') && (
            <Link to="/reports" aria-label="Back to reports" className="p-1.5 -ml-1.5 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div>
            <h1 className="text-base font-semibold text-ink">Marketing Reports</h1>
            <p className="text-sm text-ink-muted mt-0.5">DM cost, DM income, cold calling and the monthly report</p>
          </div>
        </div>
      </div>

      <div className="page-content flex-1 space-y-4">
        {isLoading ? (
          <div className="card p-10 text-center text-sm text-ink-muted">Loading…</div>
        ) : available.length === 0 ? (
          <div className="card p-10 text-center">
            <Lock className="w-8 h-8 text-ink-faint mx-auto" />
            <p className="text-sm font-medium text-ink mt-3">You don't have access to any marketing report</p>
            <p className="text-sm text-ink-muted mt-1">An admin can grant it under Settings → Reporting access.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <label className="block sm:w-64">
                <span className="input-label">Report</span>
                <select aria-label="Report" value={section} onChange={(e) => setSection(e.target.value as SectionKey)} className="input-field">
                  {available.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
              {section !== 'reporting' && (
                <label className="block sm:w-48">
                  <span className="input-label">Month</span>
                  <input aria-label="Month" type="month" value={month} max={thisMonth()} onChange={(e) => e.target.value && setMonth(e.target.value)} className="input-field" />
                </label>
              )}
            </div>
            {section === 'reporting'
              ? <ReportingView />
              : section && <SheetPanel sheetKey={section as SheetKey} month={month} isAdmin={role === 'admin'} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ── One sheet (DM Cost / DM Income / Cold Calling) ─────────────────────── */

function SheetPanel({ sheetKey, month, isAdmin }: { sheetKey: SheetKey; month: string; isAdmin: boolean }) {
  const toast = useToast();
  const qc = useQueryClient();
  const key = ['marketing-sheet', sheetKey, month];
  const { data, isLoading, isError } = useQuery({ queryKey: key, queryFn: () => getSheet(sheetKey, month) });
  const [editingColumns, setEditingColumns] = useState(false);

  const save = useMutation({
    mutationFn: ({ date, values }: { date: string; values: DayValues }) => putSheetDay(sheetKey, date, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketing-sheet', sheetKey] }),
    onError: (e: Error) => toast.error(e.message || 'Could not save.'),
  });

  if (isLoading) return <div className="card p-10 text-center text-sm text-ink-muted">Loading…</div>;
  if (isError || !data) return <div className="card p-10 text-center text-sm text-red-600">Could not load this report.</div>;

  const groups = data.sheet.groups.map((g) => ({ ...g, columns: g.columns.filter((c) => !c.hidden) }));
  const multi = groups.length > 1;
  const commit = (date: string, group: string, col: string, raw: string, current: number) => {
    const v = raw === '' ? 0 : Number(raw);
    if (!Number.isFinite(v) || v < 0 || v === current) return;
    save.mutate({ date, values: { [group]: { [col]: v } } });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {data.canEdit ? (
          <p className="text-xs text-ink-muted">Enter the day's figures; totals and the cumulative update themselves. {save.isPending && <Loader2 className="inline w-3 h-3 animate-spin" />}</p>
        ) : (
          <p className="text-xs text-ink-muted flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> View only</p>
        )}
        {isAdmin && (
          <button onClick={() => setEditingColumns((v) => !v)} className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5" /> {editingColumns ? 'Close column editor' : 'Edit columns'}
          </button>
        )}
      </div>

      {editingColumns && <ColumnEditor view={data} onSaved={() => { setEditingColumns(false); qc.invalidateQueries({ queryKey: ['marketing-sheet', sheetKey] }); }} />}

      {/* Summary tiles — month and financial year at a glance, all sizes. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SummaryTile title={`${monthLabel(month)} total`} totals={data.monthTotal} groups={groups} grandLabel={data.sheet.grandTotalLabel} multi={multi} />
        <SummaryTile title={`Cumulative since ${dayLabel(data.cumulative.from)} ${data.cumulative.from.slice(0, 4)}`} totals={data.cumulative} groups={groups} grandLabel={data.sheet.grandTotalLabel} multi={multi} />
      </div>

      {/* Desktop grid — the sheet itself. */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse min-w-full">
            <thead>
              <tr className="bg-surface-soft">
                <th rowSpan={2} className="sticky left-0 bg-surface-soft px-3 py-2 text-left text-xs font-medium text-ink-muted border-b border-hairline">Date</th>
                {groups.map((g) => (
                  <th key={g.key} colSpan={g.columns.length + 1} className="px-3 py-2 text-center text-xs font-semibold text-ink border-b border-l border-hairline">{g.label}</th>
                ))}
                {multi && <th rowSpan={2} className="px-3 py-2 text-right text-xs font-semibold text-ink border-b border-l border-hairline max-w-[140px]">{data.sheet.grandTotalLabel}</th>}
              </tr>
              <tr className="bg-surface-soft">
                {groups.map((g) => [
                  ...g.columns.map((c, i) => (
                    <th key={`${g.key}-${c.key}`} className={`px-3 py-2 text-right text-xs font-medium text-ink-muted border-b border-hairline whitespace-nowrap ${i === 0 ? 'border-l' : ''}`}>
                      {c.label}{c.kind === 'count' && <span className="block font-normal text-[10px]">clients</span>}
                    </th>
                  )),
                  <th key={`${g.key}-total`} className="px-3 py-2 text-right text-xs font-semibold text-ink border-b border-hairline max-w-[130px]">{g.totalLabel}</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => {
                const future = r.date > todayISO();
                return (
                  <tr key={r.date} className="border-b border-hairline-soft">
                    <td className="sticky left-0 bg-white px-3 py-1.5 text-ink-soft whitespace-nowrap">{dayLabel(r.date)}</td>
                    {groups.map((g) => [
                      ...g.columns.map((c, i) => {
                        const v = r.values?.[g.key]?.[c.key] ?? 0;
                        return (
                          <td key={`${g.key}-${c.key}`} className={`px-1 py-1 text-right ${i === 0 ? 'border-l border-hairline' : ''}`}>
                            {data.canEdit && !future ? (
                              <input
                                aria-label={`${c.label} (${g.label}) on ${r.date}`}
                                type="number" min={0} step={c.kind === 'count' ? 1 : 'any'}
                                defaultValue={v || ''}
                                key={`${r.date}-${g.key}-${c.key}-${v}`}
                                onBlur={(e) => commit(r.date, g.key, c.key, e.target.value, v)}
                                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                                className="w-24 text-right px-2 py-1 rounded border border-transparent hover:border-hairline focus:border-brand-400 focus:outline-none bg-transparent"
                              />
                            ) : <span className="px-2 text-ink-soft">{v ? fmt(v) : ''}</span>}
                          </td>
                        );
                      }),
                      <td key={`${g.key}-total`} className="px-3 py-1.5 text-right font-medium text-ink bg-surface-soft/60">{r.groupTotals[g.key] ? fmt(r.groupTotals[g.key]) : ''}</td>,
                    ])}
                    {multi && <td className="px-3 py-1.5 text-right font-semibold text-ink border-l border-hairline bg-surface-soft/60">{r.total ? fmt(r.total) : ''}</td>}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <FooterRow label={`${monthLabel(month)} total`} totals={data.monthTotal} groups={groups} multi={multi} />
              <FooterRow label="Cumulative (FY)" totals={data.cumulative} groups={groups} multi={multi} />
            </tfoot>
          </table>
        </div>
      </div>

      {/* Mobile — one day at a time. */}
      <MobileDayForm view={data} groups={groups} onSave={(date, values) => save.mutate({ date, values })} saving={save.isPending} />
    </div>
  );
}

function FooterRow({ label, totals, groups, multi }: {
  label: string; totals: SheetView['monthTotal']; groups: SheetGroup[]; multi: boolean;
}) {
  return (
    <tr className="bg-surface-soft font-semibold text-ink border-t border-hairline">
      <td className="sticky left-0 bg-surface-soft px-3 py-2 whitespace-nowrap">{label}</td>
      {groups.map((g) => [
        ...g.columns.map((c, i) => (
          <td key={`${g.key}-${c.key}`} className={`px-3 py-2 text-right ${i === 0 ? 'border-l border-hairline' : ''}`}>{fmt(totals.values?.[g.key]?.[c.key] ?? 0)}</td>
        )),
        <td key={`${g.key}-t`} className="px-3 py-2 text-right">{fmt(totals.groupTotals[g.key] ?? 0)}</td>,
      ])}
      {multi && <td className="px-3 py-2 text-right border-l border-hairline">{fmt(totals.total)}</td>}
    </tr>
  );
}

function SummaryTile({ title, totals, groups, grandLabel, multi }: {
  title: string; totals: SheetView['monthTotal']; groups: SheetGroup[]; grandLabel: string; multi: boolean;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-ink-muted">{title}</p>
      <dl className="mt-2 space-y-1 text-sm">
        {groups.map((g) => (
          <div key={g.key} className="flex justify-between gap-3">
            <dt className="text-ink-soft">{g.totalLabel}</dt>
            <dd className="font-medium text-ink">
              ₹{fmt(totals.groupTotals[g.key] ?? 0)}
              {(totals.groupCounts[g.key] ?? 0) > 0 && <span className="text-ink-muted font-normal"> · {totals.groupCounts[g.key]} clients</span>}
            </dd>
          </div>
        ))}
        {multi && (
          <div className="flex justify-between gap-3 border-t border-hairline-soft pt-1">
            <dt className="font-medium text-ink">{grandLabel}</dt>
            <dd className="font-semibold text-ink">₹{fmt(totals.total)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function MobileDayForm({ view, groups, onSave, saving }: {
  view: SheetView; groups: SheetGroup[]; onSave: (date: string, values: DayValues) => void; saving: boolean;
}) {
  const editableDays = view.rows.filter((r) => r.date <= todayISO());
  const [date, setDate] = useState(editableDays[editableDays.length - 1]?.date ?? view.rows[0].date);
  const row = view.rows.find((r) => r.date === date) ?? view.rows[0];
  const [draft, setDraft] = useState<DayValues>(row.values ?? {});
  useEffect(() => { setDraft(row.values ?? {}); }, [row]);

  return (
    <div className="md:hidden card p-4 space-y-3">
      <label className="block">
        <span className="input-label">Day</span>
        <select value={date} onChange={(e) => setDate(e.target.value)} className="input-field">
          {editableDays.map((r) => <option key={r.date} value={r.date}>{dayLabel(r.date)}{r.total ? ` · ₹${fmt(r.total)}` : ''}</option>)}
        </select>
      </label>
      {groups.map((g) => (
        <fieldset key={g.key} disabled={!view.canEdit} className="space-y-2">
          <legend className="text-xs font-semibold text-ink">{g.label}</legend>
          {g.columns.map((c) => (
            <label key={c.key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink-soft">{c.label}{c.kind === 'count' ? ' (clients)' : ''}</span>
              <input type="number" min={0} step={c.kind === 'count' ? 1 : 'any'} inputMode="decimal"
                value={draft?.[g.key]?.[c.key] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [g.key]: { ...(d?.[g.key] ?? {}), [c.key]: e.target.value === '' ? 0 : Number(e.target.value) } }))}
                className="input-field w-32 text-right px-4 py-3" />
            </label>
          ))}
          <p className="text-xs text-ink-muted text-right">{g.totalLabel}: ₹{fmt(row.groupTotals[g.key] ?? 0)}</p>
        </fieldset>
      ))}
      {view.canEdit && (
        <button onClick={() => onSave(date, draft)} disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving…' : `Save ${dayLabel(date)}`}
        </button>
      )}
    </div>
  );
}

/* ── Admin: edit a sheet's columns ─────────────────────────────────────── */

function ColumnEditor({ view, onSaved }: { view: SheetView; onSaved: () => void }) {
  const toast = useToast();
  const [groups, setGroups] = useState<SheetGroup[]>(view.sheet.groups);
  const save = useMutation({
    mutationFn: () => putSheetColumns(view.sheet.key, Object.fromEntries(groups.map((g) => [g.key, { columns: g.columns }]))),
    onSuccess: () => { toast.success('Columns saved.'); onSaved(); },
    onError: (e: Error) => toast.error(e.message || 'Could not save the columns.'),
  });
  const patch = (gi: number, ci: number, p: Partial<SheetColumn>) => setGroups((gs) => gs.map((g, i) => (
    i !== gi ? g : { ...g, columns: g.columns.map((c, j) => (j === ci ? { ...c, ...p } : c)) })));
  const add = (gi: number) => setGroups((gs) => gs.map((g, i) => (
    i !== gi ? g : { ...g, columns: [...g.columns, { key: '', label: 'New column', kind: 'money' }] })));

  return (
    <div className="card p-4 space-y-4">
      <p className="text-xs text-ink-muted">Rename, add or hide columns. A hidden column leaves the sheet and its totals, but its figures are kept and come back if you show it again.</p>
      {groups.map((g, gi) => (
        <div key={g.key} className="space-y-2">
          <p className="text-sm font-semibold text-ink">{g.label}</p>
          {g.columns.map((c, ci) => (
            <div key={`${c.key}-${ci}`} className="flex flex-wrap items-center gap-2">
              <input aria-label="Column name" value={c.label} maxLength={40} onChange={(e) => patch(gi, ci, { label: e.target.value })} className="input-field flex-1 min-w-[160px]" />
              <select aria-label="Column type" value={c.kind} onChange={(e) => patch(gi, ci, { kind: e.target.value as SheetColumn['kind'] })} className="input-field w-auto">
                <option value="money">Amount (₹)</option>
                <option value="count">Clients (count)</option>
              </select>
              <label className="inline-flex items-center gap-1.5 text-xs text-ink-muted py-2">
                <input type="checkbox" checked={!!c.hidden} onChange={(e) => patch(gi, ci, { hidden: e.target.checked })} className="h-4 w-4" /> Hidden
              </label>
            </div>
          ))}
          <button onClick={() => add(gi)} className="text-xs text-brand-700 inline-flex items-center gap-1 py-2"><Plus className="w-3.5 h-3.5" /> Add column</button>
        </div>
      ))}
      <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary">{save.isPending ? 'Saving…' : 'Save columns'}</button>
    </div>
  );
}

/* ── Reporting (consolidated, monthly) ─────────────────────────────────── */

function fyStartMonth(m: string) {
  const [y, mo] = m.split('-').map(Number);
  return `${mo >= 4 ? y : y - 1}-04`;
}

function ReportingView() {
  const [to, setTo] = useState(thisMonth());
  const [from, setFrom] = useState(fyStartMonth(thisMonth()));
  const { data, isLoading, isError } = useQuery({ queryKey: ['marketing-reporting', from, to], queryFn: () => getReporting(from, to) });

  const cols: { key: string; label: string; money?: boolean; ratio?: boolean }[] = [
    { key: 'spentGoogle', label: 'Total Spent in Google Ads', money: true },
    { key: 'spentFb', label: 'Total Spent in FB/Insta Ads', money: true },
    { key: 'spentBoth', label: 'Total Spent in Both', money: true },
    { key: 'incomeGoogle', label: 'Total Income from Google Ads', money: true },
    { key: 'incomeFb', label: 'Total Income from FB/Insta Ads', money: true },
    { key: 'incomeBoth', label: 'Total Income from Both', money: true },
    { key: 'clientsGoogle', label: 'Clients from Google Ads' },
    { key: 'clientsFb', label: 'Clients from FB/Insta Ads' },
    { key: 'clientsTotal', label: 'Total Clients' },
    { key: 'cac', label: 'CAC', money: true },
    { key: 'revenueToCost', label: 'Revenue to Cost Ratio', ratio: true },
    { key: 'coldCallingIncome', label: 'Cold Calling Income', money: true },
    { key: 'convertedLeads', label: 'Converted Leads' },
  ];
  const cell = (row: Record<string, unknown>, c: typeof cols[number]) => {
    const v = row[c.key] as number | null;
    if (v == null) return '—';
    return c.ratio ? `${v}×` : c.money ? `₹${fmt(v)}` : fmt(v);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <label className="block"><span className="input-label">From</span>
          <input aria-label="From month" type="month" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className="input-field" /></label>
        <label className="block"><span className="input-label">To</span>
          <input aria-label="To month" type="month" value={to} min={from} max={thisMonth()} onChange={(e) => e.target.value && setTo(e.target.value)} className="input-field" /></label>
      </div>
      <p className="text-xs text-ink-muted">Calculated from DM Cost, DM Income, Cold Calling Income and converted leads. CAC = ad spend ÷ clients from ads; Revenue to Cost = ad income ÷ ad spend.</p>
      {isLoading ? <div className="card p-10 text-center text-sm text-ink-muted">Loading…</div>
        : isError || !data ? <div className="card p-10 text-center text-sm text-red-600">Could not load the report.</div>
        : (
          <>
            <div className="card overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="text-sm min-w-full">
                  <thead><tr className="bg-surface-soft">
                    <th className="sticky left-0 bg-surface-soft px-3 py-2 text-left text-xs font-medium text-ink-muted">Month</th>
                    {cols.map((c) => <th key={c.key} className="px-3 py-2 text-right text-xs font-medium text-ink-muted max-w-[120px]">{c.label}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {data.rows.map((r) => (
                      <tr key={r.month}>
                        <td className="sticky left-0 bg-white px-3 py-2 whitespace-nowrap text-ink">{monthLabel(r.month)}</td>
                        {cols.map((c) => <td key={c.key} className="px-3 py-2 text-right text-ink-soft whitespace-nowrap">{cell(r as unknown as Record<string, unknown>, c)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="bg-surface-soft font-semibold text-ink border-t border-hairline">
                    <td className="sticky left-0 bg-surface-soft px-3 py-2">Total</td>
                    {cols.map((c) => <td key={c.key} className="px-3 py-2 text-right whitespace-nowrap">{cell(data.totals as unknown as Record<string, unknown>, c)}</td>)}
                  </tr></tfoot>
                </table>
              </div>
            </div>
            <div className="md:hidden space-y-3">
              {[...data.rows, { ...data.totals, month: 'Total' }].map((r) => (
                <div key={r.month} className="card p-4">
                  <p className="text-sm font-semibold text-ink">{r.month === 'Total' ? 'Total' : monthLabel(r.month)}</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    {cols.map((c) => [
                      <dt key={`${c.key}-t`} className="text-ink-muted">{c.label}</dt>,
                      <dd key={`${c.key}-d`} className="text-right text-ink">{cell(r as unknown as Record<string, unknown>, c)}</dd>,
                    ])}
                  </dl>
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
