import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { putWorksheetOptions, type WsSheet } from '../../api/worksheets';
import { useToast } from '../common/toastContext';

/**
 * #280 / #279 — the choices of a sheet's dropdown columns (the yellow columns
 * of the firm's Excel files: Assigned to, Checker, Client, Constitution, Assign
 * Person…). Admins, managers and team members add, rename, re-order and remove
 * them; a saved list is offered at once when adding or editing a record.
 *
 * Records keep what they hold: renaming or removing a choice does not change a
 * row that already uses it — that row shows its old value until someone picks
 * another.
 */
export default function OptionsEditor({ sheet, onSaved, onCancel }: {
  sheet: WsSheet;
  onSaved: (sheet: WsSheet) => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const selects = sheet.columns.filter((c) => c.type === 'select' && !c.hidden);
  const [field, setField] = useState(selects[0]?.key ?? '');
  const column = selects.find((c) => c.key === field);
  const [lists, setLists] = useState<Record<string, string[]>>(() => Object.fromEntries(selects.map((c) => [c.key, c.options ?? []])));
  const [adding, setAdding] = useState('');
  const options = lists[field] ?? [];
  const setOptions = (next: string[]) => setLists((l) => ({ ...l, [field]: next }));
  const saved = column?.options ?? [];
  const dirty = JSON.stringify(options.map((o) => o.trim())) !== JSON.stringify(saved);

  const add = () => {
    const v = adding.trim();
    if (!v) return;
    if (options.some((o) => o.trim().toLowerCase() === v.toLowerCase())) { toast.error(`"${v}" is already in the list.`); return; }
    setOptions([...options, v]);
    setAdding('');
  };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= options.length) return;
    const next = [...options];
    [next[i], next[j]] = [next[j], next[i]];
    setOptions(next);
  };

  const save = useMutation({
    mutationFn: () => putWorksheetOptions(sheet.key, field, options.map((o) => o.trim()).filter(Boolean)),
    onSuccess: (s) => {
      const fresh = s.columns.find((c) => c.key === field)?.options ?? [];
      setLists((l) => ({ ...l, [field]: fresh }));
      toast.success(`Choices for ${column?.label ?? 'the column'} saved.`);
      onSaved(s);
    },
    onError: (e: Error) => toast.error(e.message || 'Could not save the choices.'),
  });

  return (
    <div className="card p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} aria-label="Back to the sheet" className="p-2 -ml-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-11 min-w-11">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-ink">Dropdown choices of {sheet.label}</h2>
      </div>

      {selects.length === 0 ? (
        <p className="text-sm text-ink-muted">This sheet has no dropdown columns.</p>
      ) : (
        <>
          <label className="block sm:w-80">
            <span className="input-label">Column</span>
            <select aria-label="Dropdown column" value={field} onChange={(e) => { setField(e.target.value); setAdding(''); }} className="input-field px-4 py-3">
              {selects.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </label>
          <p className="text-xs text-ink-muted">
            The list is offered when adding or editing a record. Renaming or removing a choice does not change records that already use it.
          </p>

          <ul className="space-y-2" aria-label={`Choices for ${column?.label ?? ''}`}>
            {options.length === 0 && <li className="text-sm text-ink-muted">No choices yet — add the first one below.</li>}
            {options.map((o, i) => (
              <li key={i} className="flex items-center gap-1">
                <input aria-label={`Choice ${i + 1}`} value={o} maxLength={80}
                  onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
                  className="input-field flex-1 px-4 py-3" />
                <button type="button" onClick={() => move(i, -1)} aria-label={`Move ${o} up`} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft min-h-11 min-w-11"><ArrowUp className="w-4 h-4" /></button>
                <button type="button" onClick={() => move(i, 1)} aria-label={`Move ${o} down`} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft min-h-11 min-w-11"><ArrowDown className="w-4 h-4" /></button>
                <button type="button" onClick={() => setOptions(options.filter((_, j) => j !== i))} aria-label={`Remove ${o}`}
                  className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-red-600 min-h-11 min-w-11">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={(e) => { e.preventDefault(); add(); }} className="flex flex-col sm:flex-row gap-2 border-t border-hairline-soft pt-4">
            <input aria-label="New choice" value={adding} maxLength={80} onChange={(e) => setAdding(e.target.value)} placeholder="New choice" className="input-field flex-1 px-4 py-3" />
            <button type="submit" disabled={!adding.trim()} className="btn-secondary inline-flex items-center justify-center gap-1.5 min-h-11">
              <Plus className="w-4 h-4" /> Add choice
            </button>
          </form>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button type="button" onClick={onCancel} className="btn-secondary min-h-11">Back</button>
            <button type="button" onClick={() => save.mutate()} disabled={save.isPending || !dirty} className="btn-primary min-h-11">
              {save.isPending ? 'Saving…' : 'Save choices'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
