import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { putWorksheetColumns, type ColumnEdit, type FieldType, type WsColumn, type WsSheet } from '../../api/worksheets';
import { getServiceCatalog } from '../../api/services';
import { useToast } from '../common/toastContext';

/**
 * #210 / #217 — admin: rename, re-order, add, hide or delete a sheet's columns,
 * and choose the services whose matters a record may link to.
 *
 * Hiding never loses data: the values stay on every record and return when the
 * column is shown again. Deleting a built-in column hides it; deleting a column
 * the firm added takes it off the sheet (its values are kept, unseen).
 */

const TYPE_LABEL: Record<FieldType, string> = {
  text: 'Text', longtext: 'Long text', date: 'Date', number: 'Number', select: 'Choice list',
  computed: 'Calculated', image: 'Image + text', matter: 'Matter link',
};
const ADDABLE: FieldType[] = ['text', 'longtext', 'date', 'number', 'select', 'image'];

interface Row extends ColumnEdit { builtIn: boolean; typeLabel: string; optionsText?: string }

const toRow = (c: WsColumn): Row => ({
  key: c.key, label: c.label, hidden: c.hidden, builtIn: c.builtIn, type: c.type,
  typeLabel: TYPE_LABEL[c.type], options: c.options, optionsText: c.options?.join(', '),
});

export default function ColumnEditor({ sheet, bookColumns, onSaved, onCancel }: {
  sheet: WsSheet;
  /** Columns of the same book shown on OTHER reports — addable here. */
  bookColumns: WsColumn[];
  onSaved: (sheet: WsSheet) => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>(() => sheet.columns.map(toRow));
  const [linked, setLinked] = useState<string[]>(sheet.linkedServices);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<string>('text');
  const [newOptions, setNewOptions] = useState('');
  const { data: catalog } = useQuery({ queryKey: ['service-catalog-all'], queryFn: getServiceCatalog, staleTime: 60_000 });
  const services = useMemo(() => Object.values(catalog?.services ?? {}).sort((a, b) => a.displayName.localeCompare(b.displayName)), [catalog]);
  const addable = bookColumns.filter((c) => !rows.some((r) => r.key === c.key));

  const patch = (i: number, p: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...p } : r)));
  const move = (i: number, d: -1 | 1) => setRows((rs) => {
    const j = i + d;
    if (j < 0 || j >= rs.length) return rs;
    const next = [...rs];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  const remove = (i: number) => setRows((rs) => (rs[i].builtIn ? rs.map((r, j) => (j === i ? { ...r, hidden: true } : r)) : rs.filter((_, j) => j !== i)));

  const addColumn = () => {
    const label = newLabel.trim();
    if (!label) return;
    if (newType.startsWith('field:')) {
      const col = bookColumns.find((c) => c.key === newType.slice(6));
      if (col) setRows((rs) => [...rs, { ...toRow(col), label, hidden: false }]);
    } else {
      const type = newType as FieldType;
      setRows((rs) => [...rs, {
        label, type, builtIn: false, typeLabel: TYPE_LABEL[type], hidden: false,
        ...(type === 'select' ? { options: newOptions.split(',').map((s) => s.trim()).filter(Boolean), optionsText: newOptions } : {}),
      }]);
    }
    setNewLabel(''); setNewOptions(''); setNewType('text');
  };

  const save = useMutation({
    mutationFn: () => putWorksheetColumns(sheet.key, rows.map((r) => ({
      ...(r.key ? { key: r.key } : { type: r.type }),
      label: r.label,
      hidden: !!r.hidden,
      ...(r.type === 'select' && !r.builtIn ? { options: (r.optionsText ?? '').split(',').map((s) => s.trim()).filter(Boolean) } : {}),
    })), linked),
    onSuccess: (s) => { toast.success('Columns saved.'); onSaved(s); },
    onError: (e: Error) => toast.error(e.message || 'Could not save the columns.'),
  });

  return (
    <div className="card p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} aria-label="Back to the sheet" className="p-2 -ml-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-11 min-w-11">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-ink">Columns of {sheet.label}</h2>
      </div>
      <p className="text-xs text-ink-muted">Hiding a column keeps its values on every record; show it again and they come back. Deleting one of the standard columns hides it.</p>

      <ul className="space-y-2" aria-label="Columns">
        {rows.map((r, i) => (
          <li key={`${r.key ?? 'new'}-${i}`} className={`flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg border border-hairline-soft ${r.hidden ? 'bg-surface-soft' : ''}`}>
            <input aria-label="Column name" value={r.label} maxLength={80} onChange={(e) => patch(i, { label: e.target.value })} className="input-field flex-1 px-4 py-3" />
            <span className="badge-gray self-start sm:self-center">{r.typeLabel}{r.key ? '' : ' · new'}</span>
            {r.type === 'select' && !r.builtIn && (
              <input aria-label="Choices" value={r.optionsText ?? ''} onChange={(e) => patch(i, { optionsText: e.target.value })} placeholder="Choices, comma-separated" className="input-field sm:w-56 px-4 py-3" />
            )}
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} aria-label={`Move ${r.label} up`} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft min-h-11 min-w-11"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => move(i, 1)} aria-label={`Move ${r.label} down`} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft min-h-11 min-w-11"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => patch(i, { hidden: !r.hidden })} aria-label={r.hidden ? `Show ${r.label}` : `Hide ${r.label}`} aria-pressed={!!r.hidden}
                className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft min-h-11 min-w-11" title={r.hidden ? 'Hidden — click to show' : 'Hide'}>
                {r.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => remove(i)} aria-label={`Delete ${r.label}`} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-red-600 min-h-11 min-w-11">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-hairline-soft pt-4">
        <p className="text-sm font-semibold text-ink">Add a column</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input aria-label="New column name" value={newLabel} maxLength={80} onChange={(e) => setNewLabel(e.target.value)} placeholder="Column name" className="input-field flex-1 px-4 py-3" />
          <select aria-label="New column type" value={newType} onChange={(e) => {
            setNewType(e.target.value);
            const col = bookColumns.find((c) => `field:${c.key}` === e.target.value);
            if (col && !newLabel) setNewLabel(col.label);
          }} className="input-field sm:w-64 px-4 py-3">
            {ADDABLE.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            {addable.length > 0 && (
              <optgroup label="From the other reports">
                {addable.map((c) => <option key={c.key} value={`field:${c.key}`}>{c.label}</option>)}
              </optgroup>
            )}
          </select>
          <button type="button" onClick={addColumn} disabled={!newLabel.trim()} className="btn-secondary inline-flex items-center justify-center gap-1.5 min-h-11">
            <Plus className="w-4 h-4" /> Add column
          </button>
        </div>
        {newType === 'select' && (
          <input aria-label="New column choices" value={newOptions} onChange={(e) => setNewOptions(e.target.value)} placeholder="Choices, comma-separated" className="input-field px-4 py-3" />
        )}
      </div>

      <div className="space-y-2 border-t border-hairline-soft pt-4">
        <p className="text-sm font-semibold text-ink">Linked services</p>
        <p className="text-xs text-ink-muted">A record's Matter column offers matters of these services only.</p>
        <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {services.map((s) => (
            <label key={s.key} className="flex items-center gap-2 text-sm text-ink min-h-11">
              <input type="checkbox" className="h-4 w-4" checked={linked.includes(s.key)}
                onChange={(e) => setLinked((l) => (e.target.checked ? [...l, s.key] : l.filter((k) => k !== s.key)))} />
              {s.displayName}
            </label>
          ))}
          {/* A linked key no longer in the catalog stays visible so it can be removed. */}
          {linked.filter((k) => !services.some((s) => s.key === k)).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm text-ink-muted min-h-11">
              <input type="checkbox" className="h-4 w-4" checked onChange={() => setLinked((l) => l.filter((x) => x !== k))} /> {k}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary min-h-11">Cancel</button>
        <button type="button" onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary min-h-11">
          {save.isPending ? 'Saving…' : 'Save columns'}
        </button>
      </div>
    </div>
  );
}
