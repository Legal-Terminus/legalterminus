import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { ArrowLeft, Plus, Settings2, Upload } from 'lucide-react';
import {
  createWorksheetRecord, deleteWorksheetRecord, getWorksheetModule, listWorksheetRecords, updateWorksheetRecord,
  type CellValue, type MatterRef, type ModuleKey, type WsPage, type WsRecord, type WsSheet,
} from '../../api/worksheets';
import type { ApiError } from '../../api/client';
import { useToast } from '../../components/common/toastContext';
import { useConfirm } from '../../components/common/confirmContext';
import WorksheetGrid from '../../components/worksheets/WorksheetGrid';
import RecordForm from '../../components/worksheets/RecordForm';
import ColumnEditor from '../../components/worksheets/ColumnEditor';
import ImportPanel from '../../components/worksheets/ImportPanel';

/**
 * #210 / #217 — one page for a module of worksheets: a dropdown of sheets (the
 * Marketing Reports pattern), and under it the chosen sheet as an Excel-like
 * grid. Used by Trademark Reports (/reports/trademark) and Worksheets
 * (/worksheets).
 *
 * A sheet is loaded in bounded pages (500 records each) until it is complete,
 * so filters, sort and search work over the whole sheet, as in Excel.
 */

const MAX_RECORDS = 5000;
type View = { kind: 'grid' } | { kind: 'form'; id: string | null } | { kind: 'columns' } | { kind: 'import' };

export default function WorksheetModulePage({ module, title, subtitle, pickerLabel, back }: {
  module: ModuleKey;
  title: string;
  subtitle: string;
  pickerLabel: string;
  back?: { to: string; label: string };
}) {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<View>({ kind: 'grid' });
  const [saving, setSaving] = useState(false);
  const [extraMatters, setExtraMatters] = useState<Record<string, MatterRef>>({});

  const { data: mod, isLoading, isError } = useQuery({ queryKey: ['worksheet-module', module], queryFn: () => getWorksheetModule(module) });
  const sheetKey = params.get('sheet') && mod?.sheets.some((s) => s.key === params.get('sheet')) ? params.get('sheet')! : mod?.sheets[0]?.key ?? '';
  const sheet = mod?.sheets.find((s) => s.key === sheetKey);
  const recordsKey = ['worksheet-records', sheetKey];

  const records = useInfiniteQuery({
    queryKey: recordsKey,
    queryFn: ({ pageParam }) => listWorksheetRecords(sheetKey, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: !!sheetKey,
  });
  const all = useMemo(() => records.data?.pages.flatMap((p) => p.data) ?? [], [records.data]);
  const matters = useMemo(
    () => Object.assign({}, ...(records.data?.pages.map((p) => p.matters) ?? []), extraMatters) as Record<string, MatterRef>,
    [records.data, extraMatters],
  );
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = records;
  // Keep reading pages until the sheet is complete (bounded).
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && all.length < MAX_RECORDS) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, all.length, fetchNextPage]);

  /* Local cache updates: no refetch of a whole sheet after one cell. */
  const patchCache = (fn: (list: WsRecord[]) => WsRecord[]) => {
    qc.setQueryData<InfiniteData<WsPage, string | null>>(recordsKey, (d) => {
      if (!d) return d;
      // Rewrites page by page so cursors stay valid; a new record joins the last page.
      const flat = fn(d.pages.flatMap((p) => p.data));
      let i = 0;
      const pages = d.pages.map((p, pi) => {
        const n = pi === d.pages.length - 1 ? flat.length - i : p.data.length;
        const data = flat.slice(i, i + n);
        i += n;
        return { ...p, data };
      });
      return { ...d, pages };
    });
  };
  // The other sheets of the same book show the same records: re-read them when next opened.
  const invalidateSiblings = () => qc.invalidateQueries({
    predicate: (q) => q.queryKey[0] === 'worksheet-records' && q.queryKey[1] !== sheetKey,
  });
  const replaceRecord = (rec: WsRecord) => patchCache((list) => (rec.sheets.includes(sheetKey)
    ? list.map((r) => (r.id === rec.id ? rec : r))
    : list.filter((r) => r.id !== rec.id)));

  const pickSheet = (key: string) => { setParams({ sheet: key }, { replace: true }); setView({ kind: 'grid' }); };

  const saveCell = async (rec: WsRecord, key: string, value: CellValue) => {
    try {
      const saved = await updateWorksheetRecord(sheetKey, rec.id, { values: { [key]: value } });
      replaceRecord(saved);
      invalidateSiblings();
    } catch (e) {
      toast.error((e as Error).message || 'Could not save.');
    }
  };

  const remove = async (rec: WsRecord) => {
    const others = sheet && sheet.memberships.length > 1 ? ' It is removed from every report it is in.' : '';
    if (!(await confirm({ title: 'Delete this record?', message: `This cannot be undone.${others}`, confirmLabel: 'Delete', tone: 'danger' }))) return;
    try {
      await deleteWorksheetRecord(sheetKey, rec.id);
      patchCache((list) => list.filter((r) => r.id !== rec.id));
      invalidateSiblings();
      setView({ kind: 'grid' });
      toast.success('Record deleted.');
    } catch (e) {
      toast.error((e as Error).message || 'Could not delete the record.');
    }
  };

  const submitForm = async (id: string | null, values: Record<string, CellValue>, sheets: string[], refs: Record<string, MatterRef>) => {
    setSaving(true);
    setExtraMatters((m) => ({ ...m, ...refs }));
    try {
      if (id) {
        const saved = await updateWorksheetRecord(sheetKey, id, { values, sheets });
        replaceRecord(saved);
      } else {
        const created = await createWorksheetRecord(sheetKey, values, sheets);
        patchCache((list) => [...list, created]);
      }
      invalidateSiblings();
      setView({ kind: 'grid' });
      toast.success(id ? 'Record saved.' : 'Record added.');
    } catch (e) {
      const err = e as ApiError;
      const body = err.body as { code?: string; existingId?: string; existingSheets?: string[] } | undefined;
      // The same trademark is already recorded — offer to put it in this report too.
      if (!id && err.status === 409 && body?.code === 'DUPLICATE_KEY' && body.existingId && sheet) {
        const inHere = body.existingSheets?.includes(sheetKey);
        const where = sheet.memberships.filter((m) => body.existingSheets?.includes(m.key)).map((m) => m.label).join(', ');
        if (!inHere && await confirm({
          title: `Already recorded${where ? ` in ${where}` : ''}`,
          message: `A record with this ${sheet.recordKeyLabel} exists. Add it to ${sheet.label} and save what you entered on it?`,
          confirmLabel: `Add to ${sheet.label}`,
        })) {
          try {
            const saved = await updateWorksheetRecord(sheetKey, body.existingId, {
              values: Object.fromEntries(Object.entries(values).filter(([, v]) => v != null)),
              sheets: [...new Set([...(body.existingSheets ?? []), sheetKey, ...sheets])],
            });
            patchCache((list) => [...list.filter((r) => r.id !== saved.id), saved]);
            invalidateSiblings();
            setView({ kind: 'grid' });
            toast.success(`Added to ${sheet.label}.`);
          } catch (e2) { toast.error((e2 as Error).message || 'Could not save.'); }
        } else if (inHere) {
          toast.error(`This ${sheet.recordKeyLabel} is already in ${sheet.label}.`);
        }
      } else {
        toast.error(err.message || 'Could not save.');
      }
    } finally {
      setSaving(false);
    }
  };

  const imageChanged = (rec: WsRecord, field: string, v: string | null) => {
    const images = { ...rec.images };
    if (v) images[field] = { v }; else delete images[field];
    patchCache((list) => list.map((r) => (r.id === rec.id ? { ...r, images } : r)));
    invalidateSiblings();
  };

  const columnsSaved = (s: WsSheet) => {
    qc.setQueryData(['worksheet-module', module], (d: typeof mod) => (d ? { ...d, sheets: d.sheets.map((x) => (x.key === s.key ? s : x)) } : d));
    setView({ kind: 'grid' });
  };

  const bookColumns = useMemo(() => {
    if (!mod || !sheet) return [];
    const seen = new Set<string>();
    return mod.sheets.filter((s) => s.book === sheet.book && s.key !== sheet.key).flatMap((s) => s.columns)
      .filter((c) => !c.hidden && c.type !== 'computed' && !seen.has(c.key) && seen.add(c.key));
  }, [mod, sheet]);

  const editing = view.kind === 'form' && view.id ? all.find((r) => r.id === view.id) ?? null : null;

  return (
    <div className="flex flex-col min-h-full">
      <div className="page-header">
        <div className="flex items-center gap-3 min-w-0">
          {back && (
            <Link to={back.to} aria-label={back.label} className="p-1.5 -ml-1.5 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-ink">{title}</h1>
            <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="page-content flex-1 space-y-4">
        {isLoading ? (
          <div className="card p-10 text-center text-sm text-ink-muted">Loading…</div>
        ) : isError || !mod || !sheet ? (
          <div className="card p-10 text-center text-sm text-red-600">Could not load these sheets.</div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <label className="block sm:w-72">
                <span className="input-label">{pickerLabel}</span>
                <select aria-label={pickerLabel} value={sheetKey} onChange={(e) => pickSheet(e.target.value)} className="input-field px-4 py-3">
                  {mod.sheets.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
              {view.kind === 'grid' && (
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  {mod.canEdit && (
                    <button type="button" onClick={() => setView({ kind: 'form', id: null })} className="btn-primary inline-flex items-center gap-1.5 min-h-11">
                      <Plus className="w-4 h-4" /> Add record
                    </button>
                  )}
                  {mod.canEdit && (
                    <button type="button" onClick={() => setView({ kind: 'import' })} className="btn-secondary inline-flex items-center gap-1.5 min-h-11">
                      <Upload className="w-4 h-4" /> Upload Excel
                    </button>
                  )}
                  {mod.canManageColumns && (
                    <button type="button" onClick={() => setView({ kind: 'columns' })} className="btn-secondary inline-flex items-center gap-1.5 min-h-11">
                      <Settings2 className="w-4 h-4" /> Edit columns
                    </button>
                  )}
                </div>
              )}
            </div>

            {view.kind === 'grid' && (
              records.isLoading ? <div className="card p-10 text-center text-sm text-ink-muted">Loading records…</div>
                : records.isError ? <div className="card p-10 text-center text-sm text-red-600">Could not load the records.</div>
                : (
                  <>
                    {all.length >= MAX_RECORDS && hasNextPage && (
                      <p className="text-xs text-ink-muted">Showing the first {MAX_RECORDS} records of this sheet.</p>
                    )}
                    <WorksheetGrid
                      key={sheetKey}
                      sheet={sheet} records={all} matters={matters} canEdit={mod.canEdit} canDelete={mod.canDelete}
                      loadingMore={isFetchingNextPage}
                      onSaveCell={saveCell}
                      onOpen={(r) => setView({ kind: 'form', id: r.id })}
                      onDelete={remove}
                      onImageChanged={imageChanged}
                    />
                  </>
                )
            )}
            {view.kind === 'form' && (view.id === null || editing) && (
              <RecordForm
                key={view.id ?? 'new'}
                sheet={sheet} record={editing} matters={matters} canDelete={mod.canDelete} saving={saving}
                onSubmit={(values, sheets, refs) => submitForm(view.id, values, sheets, refs)}
                onDelete={() => editing && remove(editing)}
                onCancel={() => setView({ kind: 'grid' })}
                onImageChanged={(field, v) => editing && imageChanged(editing, field, v)}
              />
            )}
            {view.kind === 'columns' && (
              <ColumnEditor key={sheetKey} sheet={sheet} bookColumns={bookColumns} onSaved={columnsSaved} onCancel={() => setView({ kind: 'grid' })} />
            )}
            {view.kind === 'import' && (
              <ImportPanel key={sheetKey} sheet={sheet} onCancel={() => setView({ kind: 'grid' })}
                onDone={() => { void qc.invalidateQueries({ queryKey: ['worksheet-records'] }); setView({ kind: 'grid' }); }} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
