import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, ExternalLink, ListFilter, Pencil, Search, Trash2, X,
} from 'lucide-react';
import type { CellValue, MatterRef, WsColumn, WsRecord, WsSheet } from '../../api/worksheets';
import {
  BLANK, displayValue, isRangeColumn, matchesQuery, passesFilter, slugify, sortValue, splitMatches, type ColumnFilter,
} from '../../lib/worksheets';
import { exportToXlsx } from '../../lib/exportXlsx';
import WorksheetImage from './WorksheetImage';

/**
 * #210 / #217 — the sheet itself, Excel-style: a filter on every column, sort
 * ascending/descending, a Ctrl+F search that highlights and narrows to the
 * matching rows, cells edited in place, and "Download Excel" of exactly the
 * rows on screen (after filters, search and sort).
 */

const PAGE_SIZE = 50;
const WIDTH: Record<string, string> = {
  longtext: 'min-w-[16rem]', text: 'min-w-[11rem]', date: 'min-w-[8.5rem]', computed: 'min-w-[8.5rem]',
  number: 'min-w-[8rem]', select: 'min-w-[10rem]', image: 'min-w-[8rem]', matter: 'min-w-[14rem]',
};
const EDITABLE = new Set(['text', 'longtext', 'date', 'number', 'select']);

export interface GridProps {
  sheet: WsSheet;
  records: WsRecord[];
  matters: Record<string, MatterRef>;
  canEdit: boolean;
  canDelete: boolean;
  loadingMore: boolean;
  onSaveCell: (record: WsRecord, key: string, value: CellValue) => Promise<void>;
  onOpen: (record: WsRecord) => void;
  onDelete: (record: WsRecord) => void;
  onImageChanged: (record: WsRecord, field: string, version: string | null) => void;
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  return (
    <>
      {splitMatches(text, q).map((p, i) => (p.hit
        ? <mark key={i} className="bg-amber-100 text-ink rounded-sm">{p.text}</mark>
        : <span key={i}>{p.text}</span>))}
    </>
  );
}

export default function WorksheetGrid({
  sheet, records, matters, canEdit, canDelete, loadingMore, onSaveCell, onOpen, onDelete, onImageChanged,
}: GridProps) {
  const columns = useMemo(() => sheet.columns.filter((c) => !c.hidden), [sheet.columns]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, ColumnFilter>>({});
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const q = search.trim();

  // Ctrl/Cmd+F jumps to the sheet's own search, like Excel. Pressed again while
  // the box is focused, the browser's find works as usual.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const active = Object.entries(filters);
    return records.filter((r) => {
      for (const [key, f] of active) {
        const col = columns.find((c) => c.key === key);
        if (col && !passesFilter(col, r, matters, f)) return false;
      }
      return !q || columns.some((c) => matchesQuery(displayValue(c, r, matters), q));
    });
  }, [records, filters, columns, matters, q]);

  const rows = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = sortValue(col, a, matters);
      const vb = sortValue(col, b, matters);
      // Blanks always last, whichever way the column is sorted.
      if (va === '' && vb === '') return 0;
      if (va === '') return 1;
      if (vb === '') return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
    });
  }, [filtered, sort, columns, matters]);

  const matchCount = useMemo(() => (q
    ? rows.reduce((n, r) => n + columns.filter((c) => matchesQuery(displayValue(c, r, matters), q)).length, 0)
    : 0), [q, rows, columns, matters]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const shown = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const activeFilters = Object.keys(filters).length;

  const toggleSort = (key: string) => setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));
  const setFilter = (key: string, f: ColumnFilter | null) => {
    setPage(0);
    setFilters((all) => {
      const next = { ...all };
      if (f) next[key] = f; else delete next[key];
      return next;
    });
  };

  const download = () => exportToXlsx(
    rows,
    columns.map((c) => ({ header: c.label, value: (r: WsRecord) => (c.type === 'number' && typeof r.values[c.key] === 'number' ? r.values[c.key] as number : displayValue(c, r, matters)) })),
    slugify(sheet.label),
    sheet.label,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            ref={searchRef} type="search" value={search} aria-label="Search this sheet"
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search every column (Ctrl+F)…" className="input-field pl-10 px-4 py-3"
          />
        </div>
        <button type="button" onClick={download} disabled={rows.length === 0} className="btn-secondary inline-flex items-center justify-center gap-1.5 min-h-11">
          <Download className="w-4 h-4" /> Download Excel
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
        <span>{rows.length} of {records.length} {records.length === 1 ? 'record' : 'records'}{loadingMore ? ' (loading more…)' : ''}</span>
        {q && <span aria-live="polite">{matchCount} {matchCount === 1 ? 'match' : 'matches'} for “{q}”</span>}
        {activeFilters > 0 && (
          <button type="button" onClick={() => { setFilters({}); setPage(0); }} className="text-brand-700 hover:underline inline-flex items-center gap-1 py-1">
            <X className="w-3 h-3" /> Clear {activeFilters} {activeFilters === 1 ? 'filter' : 'filters'}
          </button>
        )}
      </div>

      {/* Desktop: the sheet. Scrolls sideways inside its card, never the page. */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="text-sm border-collapse min-w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface-soft">
                <th className="sticky left-0 z-20 bg-surface-soft px-2 py-2 text-left text-xs font-medium text-ink-muted border-b border-hairline w-20">
                  <span className="sr-only">Actions</span>
                </th>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className={`px-3 py-2 text-left text-xs font-semibold text-ink-muted border-b border-hairline align-top ${WIDTH[c.type] ?? ''}`}>
                    <div className="flex items-start gap-1">
                      <button type="button" onClick={() => toggleSort(c.key)} className="text-left uppercase tracking-wide hover:text-ink inline-flex items-start gap-1" aria-label={`Sort by ${c.label}`}>
                        <span>{c.label}</span>
                        {sort?.key === c.key
                          ? (sort.dir === 'asc' ? <ArrowUp className="w-3 h-3 mt-0.5 shrink-0" /> : <ArrowDown className="w-3 h-3 mt-0.5 shrink-0" />)
                          : <ArrowUpDown className="w-3 h-3 mt-0.5 shrink-0 opacity-40" />}
                      </button>
                      {c.type !== 'image' && (
                        <FilterMenu column={c} records={records} matters={matters} value={filters[c.key]} onChange={(f) => setFilter(c.key, f)} />
                      )}
                    </div>
                    {c.type === 'computed' && <span className="block font-normal normal-case text-[10px] text-ink-faint">calculated</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-ink-muted">
                  {records.length === 0 ? 'No records yet.' : 'No record matches the search or filters.'}
                </td></tr>
              )}
              {shown.map((r) => (
                <tr key={r.id} data-record-id={r.id} className="border-b border-hairline-soft hover:bg-surface-soft/50 align-top">
                  <td className="sticky left-0 bg-white px-1 py-1 whitespace-nowrap">
                    <button type="button" onClick={() => onOpen(r)} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-9 min-w-9" aria-label="Open record" title="Open">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {canDelete && (
                      <button type="button" onClick={() => onDelete(r)} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-red-600 min-h-9 min-w-9" aria-label="Delete record" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className="px-1 py-1">
                      <Cell sheet={sheet} column={c} record={r} matters={matters} q={q} canEdit={canEdit}
                        onSave={(v) => onSaveCell(r, c.key, v)} onImageChanged={(v) => onImageChanged(r, c.key, v)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: one card per record; tap to open the full form. */}
      <div className="md:hidden space-y-3">
        {shown.length === 0 && <div className="card p-8 text-center text-sm text-ink-muted">{records.length === 0 ? 'No records yet.' : 'No record matches the search or filters.'}</div>}
        {shown.map((r) => (
          <button key={r.id} type="button" onClick={() => onOpen(r)} className="card p-4 w-full text-left">
            <dl className="space-y-1">
              {columns.filter((c) => c.type !== 'image').slice(0, 5).map((c) => (
                <div key={c.key} className="flex justify-between gap-3 text-sm">
                  <dt className="text-ink-muted shrink-0">{c.label}</dt>
                  <dd className="text-ink text-right min-w-0 wrap-break-word"><Highlight text={displayValue(c, r, matters) || '—'} q={q} /></dd>
                </div>
              ))}
            </dl>
          </button>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>Showing {current * PAGE_SIZE + 1}–{Math.min((current + 1) * PAGE_SIZE, rows.length)} of {rows.length}</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage(current - 1)} disabled={current === 0} aria-label="Previous page" className="p-2.5 rounded-lg hover:bg-surface-soft disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {current + 1} of {pageCount}</span>
            <button type="button" onClick={() => setPage(current + 1)} disabled={current >= pageCount - 1} aria-label="Next page" className="p-2.5 rounded-lg hover:bg-surface-soft disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── One cell ───────────────────────────────────────────────────────────── */

function Cell({ sheet, column, record, matters, q, canEdit, onSave, onImageChanged }: {
  sheet: WsSheet; column: WsColumn; record: WsRecord; matters: Record<string, MatterRef>; q: string; canEdit: boolean;
  onSave: (v: CellValue) => Promise<void>; onImageChanged: (v: string | null) => void;
}) {
  const text = displayValue(column, record, matters);
  if (column.type === 'image') {
    return (
      <div className="flex items-center gap-1 px-2">
        <WorksheetImage sheet={sheet.key} recordId={record.id} field={column.key} version={record.images[column.key]?.v}
          label={column.label} canEdit={canEdit} onChanged={onImageChanged} />
        {text && <span className="text-ink-soft text-xs"><Highlight text={text} q={q} /></span>}
      </div>
    );
  }
  if (column.type === 'matter') {
    const id = record.values[column.key];
    return id ? (
      <Link to={`/tasks/${id}`} className="px-2 py-1.5 inline-flex items-center gap-1 text-brand-700 hover:underline">
        <span><Highlight text={text} q={q} /></span><ExternalLink className="w-3 h-3 shrink-0" />
      </Link>
    ) : <span className="px-2 text-ink-faint">—</span>;
  }
  if (!canEdit || !EDITABLE.has(column.type)) {
    return <div className="px-2 py-1.5 text-ink-soft whitespace-pre-wrap wrap-break-word"><Highlight text={text} q={q} /></div>;
  }
  return <EditableCell column={column} value={record.values[column.key] ?? null} text={text} q={q} onSave={onSave} />;
}

function EditableCell({ column, value, text, q, onSave }: {
  column: WsColumn; value: CellValue; text: string; q: string; onSave: (v: CellValue) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  // Enter commits and closes the editor, and closing it blurs the input: the
  // guard makes that one save, not two.
  const committing = useRef(false);
  const start = () => { committing.current = false; setDraft(value == null ? '' : String(value)); setEditing(true); };
  const commit = async () => {
    if (committing.current) return;
    committing.current = true;
    const trimmed = draft.trim();
    const next: CellValue = trimmed === '' ? null : column.type === 'number' ? Number(trimmed) : trimmed;
    if (column.type === 'number' && next != null && !Number.isFinite(next)) { setEditing(false); return; }
    if (next === value || (next == null && value == null)) { setEditing(false); return; }
    setSaving(true);
    try { await onSave(next); } finally { setSaving(false); setEditing(false); }
  };
  const keys = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { committing.current = true; setEditing(false); }
    if (e.key === 'Enter' && !(column.type === 'longtext' && e.shiftKey)) { e.preventDefault(); void commit(); }
  };
  const editorLabel = `${column.label} value`;

  if (editing) {
    const cls = 'w-full px-2 py-1.5 rounded-sm border border-brand-400 focus:outline-hidden bg-white text-sm';
    if (column.type === 'longtext') {
      return <textarea autoFocus rows={3} aria-label={editorLabel} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={keys} className={cls} disabled={saving} />;
    }
    if (column.type === 'select') {
      const options = column.options ?? [];
      return (
        <select autoFocus aria-label={editorLabel} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={keys} className={cls} disabled={saving}>
          <option value="">—</option>
          {draft && !options.includes(draft) && <option value={draft}>{draft}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    // A date column may hold an imported note ("Awaited"); it stays editable as text.
    const type = column.type === 'number' ? 'number' : column.type === 'date' && (draft === '' || /^\d{4}-\d{2}-\d{2}$/.test(draft)) ? 'date' : 'text';
    return <input autoFocus type={type} aria-label={editorLabel} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={keys} className={cls} disabled={saving} />;
  }
  return (
    <button type="button" onClick={start} aria-label={`Edit ${column.label}`}
      className="w-full min-h-9 px-2 py-1.5 text-left rounded-sm text-ink-soft hover:bg-surface-soft whitespace-pre-wrap wrap-break-word">
      {text ? <Highlight text={text} q={q} /> : <span className="text-ink-faint">&nbsp;</span>}
    </button>
  );
}

/* ── Column filter ──────────────────────────────────────────────────────── */

function FilterMenu({ column, records, matters, value, onChange }: {
  column: WsColumn; records: WsRecord[]; matters: Record<string, MatterRef>;
  value: ColumnFilter | undefined; onChange: (f: ColumnFilter | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [find, setFind] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const range = isRangeColumn(column);
  const distinct = useMemo(() => {
    if (!open || range) return [];
    const set = new Set<string>();
    for (const r of records) set.add(displayValue(column, r, matters) || BLANK);
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [open, range, records, column, matters]);

  const ticked = value?.kind === 'values' ? value.values : [];
  const rangeVal = value?.kind === 'range' ? value : { kind: 'range' as const };
  const listed = find ? distinct.filter((v) => v.toLowerCase().includes(find.toLowerCase())) : distinct;
  const inputType = column.type === 'number' ? 'number' : 'date';
  const setRange = (patch: { min?: string; max?: string }) => {
    const next = { ...rangeVal, ...patch, kind: 'range' as const };
    onChange(!next.min && !next.max ? null : next);
  };

  return (
    <div ref={ref} className="relative normal-case font-normal tracking-normal">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={`Filter ${column.label}`}
        className={`p-0.5 rounded-sm ${value ? 'text-brand-700 bg-brand-50' : 'text-ink-faint hover:text-ink'}`}>
        <ListFilter className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 w-60 bg-white border border-hairline rounded-lg shadow-card p-2 space-y-1.5">
          {range ? (
            <>
              <label className="block text-xs text-ink-muted">From
                <input type={inputType} aria-label={`${column.label} from`} value={rangeVal.min ?? ''} onChange={(e) => setRange({ min: e.target.value })} className="input-field mt-0.5 py-1.5" />
              </label>
              <label className="block text-xs text-ink-muted">To
                <input type={inputType} aria-label={`${column.label} to`} value={rangeVal.max ?? ''} onChange={(e) => setRange({ max: e.target.value })} className="input-field mt-0.5 py-1.5" />
              </label>
            </>
          ) : (
            <>
              <input autoFocus value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search values…" aria-label={`Search ${column.label} values`} className="input-field py-1.5 text-xs" />
              <div className="max-h-56 overflow-y-auto">
                {listed.length === 0 && <p className="px-1 py-2 text-xs text-ink-faint">No values</p>}
                {listed.map((v) => (
                  <label key={v} className="flex items-center gap-2 px-1 py-1 rounded-sm hover:bg-surface-soft cursor-pointer text-xs text-ink">
                    <input type="checkbox" className="h-3.5 w-3.5" checked={ticked.includes(v)}
                      onChange={() => {
                        const next = ticked.includes(v) ? ticked.filter((x) => x !== v) : [...ticked, v];
                        onChange(next.length ? { kind: 'values', values: next } : null);
                      }} />
                    <span className="truncate">{v}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={() => { onChange(null); setFind(''); }} className="text-xs text-ink-muted hover:text-ink inline-flex items-center gap-0.5 py-1">
              <X className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
