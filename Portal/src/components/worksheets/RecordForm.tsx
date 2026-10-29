import { useState } from 'react';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import type { CellValue, MatterRef, WsRecord, WsSheet } from '../../api/worksheets';
import { formatDate } from '../../lib/worksheets';
import WorksheetImage from './WorksheetImage';
import MatterPicker from './MatterPicker';

/**
 * #210 / #217 — a whole record on one page (adding a record, and editing on a
 * phone, where a wide sheet does not fit). Not a modal: on mobile it takes the
 * full width, with a back button.
 *
 * For the trademark reports it also says which reports the trademark is in —
 * its common details are shared by all of them.
 */
export default function RecordForm({
  sheet, record, matters, canDelete, saving, onSubmit, onDelete, onCancel, onImageChanged,
}: {
  sheet: WsSheet;
  record: WsRecord | null;
  matters: Record<string, MatterRef>;
  canDelete: boolean;
  saving: boolean;
  onSubmit: (values: Record<string, CellValue>, sheets: string[], matterRefs: Record<string, MatterRef>) => void;
  onDelete: () => void;
  onCancel: () => void;
  onImageChanged: (field: string, version: string | null) => void;
}) {
  const columns = sheet.columns.filter((c) => !c.hidden);
  const initial = (key: string) => {
    const v = record?.values[key];
    return v == null ? '' : String(v);
  };
  const [draft, setDraft] = useState<Record<string, string>>(
    () => Object.fromEntries(columns.filter((c) => c.type !== 'computed').map((c) => [c.key, initial(c.key)])),
  );
  const [member, setMember] = useState<string[]>(record?.sheets ?? [sheet.key]);
  const [pickedRefs, setPickedRefs] = useState<Record<string, MatterRef>>({});
  const set = (key: string, v: string) => setDraft((d) => ({ ...d, [key]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: Record<string, CellValue> = {};
    for (const c of columns) {
      if (c.type === 'computed') continue;
      const raw = (draft[c.key] ?? '').trim();
      const next: CellValue = raw === '' ? null : c.type === 'number' && Number.isFinite(Number(raw)) ? Number(raw) : raw;
      const before = record?.values[c.key] ?? null;
      // A new record sends what was filled; an edit sends only what changed.
      if (record ? next !== before : next != null) values[c.key] = next;
    }
    onSubmit(values, member, pickedRefs);
  };

  const multi = sheet.memberships.length > 1;
  return (
    <form onSubmit={submit} className="card p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} aria-label="Back to the sheet" className="p-2 -ml-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-11 min-w-11">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-ink">{record ? 'Edit record' : `New record in ${sheet.label}`}</h2>
      </div>

      {multi && (
        <fieldset className="space-y-2">
          <legend className="input-label">Appears in</legend>
          <p className="text-xs text-ink-muted">The details below are shared: a change here shows in every report the record is in.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {sheet.memberships.map((m) => (
              <label key={m.key} className="inline-flex items-center gap-2 text-sm text-ink min-h-11">
                <input type="checkbox" className="h-4 w-4" checked={member.includes(m.key)}
                  onChange={(e) => setMember((list) => (e.target.checked ? [...list, m.key] : list.filter((k) => k !== m.key)))} />
                {m.label}
              </label>
            ))}
          </div>
          {member.length === 0 && <p className="text-xs text-red-600">Tick at least one report.</p>}
        </fieldset>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map((c) => {
          const id = `ws-${c.key}`;
          if (c.type === 'computed') {
            return (
              <div key={c.key}>
                <span className="input-label">{c.label}</span>
                <p className="text-sm text-ink-soft py-3">{formatDate(record?.values[c.key] ?? null) || '—'} <span className="text-xs text-ink-faint">(calculated)</span></p>
              </div>
            );
          }
          if (c.type === 'matter') {
            return (
              <div key={c.key} className="md:col-span-2">
                <span className="input-label">{c.label}</span>
                <MatterPicker sheet={sheet.key} value={draft[c.key] || null} matter={matters[draft[c.key]] ?? pickedRefs[draft[c.key]]} label={c.label}
                  onChange={(mid, ref) => { set(c.key, mid ?? ''); if (mid && ref) setPickedRefs((p) => ({ ...p, [mid]: ref })); }} />
              </div>
            );
          }
          return (
            <div key={c.key} className={c.type === 'longtext' ? 'md:col-span-2' : ''}>
              <label htmlFor={id} className="input-label">{c.label}</label>
              {c.type === 'longtext' ? (
                <textarea id={id} rows={3} value={draft[c.key] ?? ''} onChange={(e) => set(c.key, e.target.value)} className="input-field px-4 py-3" />
              ) : c.type === 'select' ? (
                <select id={id} value={draft[c.key] ?? ''} onChange={(e) => set(c.key, e.target.value)} className="input-field px-4 py-3">
                  <option value="">—</option>
                  {draft[c.key] && !(c.options ?? []).includes(draft[c.key]) && <option value={draft[c.key]}>{draft[c.key]}</option>}
                  {(c.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input id={id} value={draft[c.key] ?? ''} onChange={(e) => set(c.key, e.target.value)} className="input-field px-4 py-3"
                  type={c.type === 'number' ? 'number' : c.type === 'date' && (!draft[c.key] || /^\d{4}-\d{2}-\d{2}$/.test(draft[c.key])) ? 'date' : 'text'}
                  inputMode={c.type === 'number' ? 'decimal' : undefined} />
              )}
              {c.type === 'image' && (
                <div className="mt-2">
                  {record ? (
                    <WorksheetImage sheet={sheet.key} recordId={record.id} field={c.key} version={record.images[c.key]?.v}
                      label={c.label} canEdit size="lg" onChanged={(v) => onImageChanged(c.key, v)} />
                  ) : <p className="text-xs text-ink-muted">Save the record first, then add the logo image.</p>}
                </div>
              )}
              {sheet.recordKey.includes(c.key) && <p className="text-xs text-ink-muted mt-1">Used to match rows when an Excel file is uploaded.</p>}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:justify-between">
        {record && canDelete ? (
          <button type="button" onClick={onDelete} className="btn-danger inline-flex items-center justify-center gap-1.5 min-h-11">
            <Trash2 className="w-4 h-4" /> Delete record
          </button>
        ) : <span />}
        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary min-h-11">Cancel</button>
          <button type="submit" disabled={saving || member.length === 0} className="btn-primary min-h-11 inline-flex items-center justify-center gap-1.5">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} {record ? 'Save changes' : 'Add record'}
          </button>
        </div>
      </div>
    </form>
  );
}
