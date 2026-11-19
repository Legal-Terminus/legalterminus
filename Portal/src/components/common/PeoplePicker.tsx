import { ChevronDown } from 'lucide-react';

export interface PickablePerson {
  uid: string;
  name: string;
}

/**
 * #192 — pick ONE OR SEVERAL people (a step's assignees).
 *
 * A native `<select multiple>` needs ctrl/shift-clicking and shows no state at a
 * glance, and a plain `<select>` can hold only one person — which is how the
 * matter screen's "Step owner" kept collapsing a shared step to one assignee.
 * This is a details/summary popover of checkboxes with a summary label ("Asha",
 * "Asha + 2"). The first person picked is the primary; order is preserved.
 *
 * `selected` uids that are not in `people` (a former member, the client on a
 * client-owned step) are kept untouched unless the user clears the list.
 */
export default function PeoplePicker({
  label, selected, people, onChange, disabled = false, emptyLabel = 'Unassigned', className = '',
}: {
  /** Accessible name of the control, e.g. "Step 2 owners". */
  label: string;
  selected: string[];
  people: PickablePerson[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  /** Summary text, and the clear option, when nobody is picked. */
  emptyLabel?: string;
  className?: string;
}) {
  const nameOf = (uid: string) => people.find((p) => p.uid === uid)?.name ?? null;
  const known = selected.filter((u) => nameOf(u) != null);
  const summary = known.length === 0
    ? (selected.length ? `${selected.length} assigned` : emptyLabel)
    : known.length === 1
      ? nameOf(known[0])!
      : `${nameOf(known[0])} + ${known.length - 1}`;

  const toggle = (uid: string) =>
    onChange(selected.includes(uid) ? selected.filter((u) => u !== uid) : [...selected, uid]);

  return (
    <details className={`relative ${className}`}>
      <summary
        className={`input-field py-1.5 text-sm cursor-pointer list-none flex items-center justify-between gap-1 min-h-[44px] sm:min-h-0 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        aria-label={label}
        title={known.length > 1 ? known.map((u) => nameOf(u)).join(', ') : summary}
      >
        <span className="truncate">{summary}</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 text-ink-faint" />
      </summary>
      <div className="absolute z-30 mt-1 w-[240px] max-w-[80vw] max-h-64 overflow-y-auto rounded-lg border border-hairline bg-white shadow-card p-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange([])}
          className={`w-full text-left text-sm px-2 py-2 rounded-sm hover:bg-surface-soft ${selected.length === 0 ? 'text-brand-700 font-medium' : 'text-ink-muted'}`}
        >
          {emptyLabel}
        </button>
        <div className="my-1 h-px bg-hairline" />
        {people.map((p) => (
          <label key={p.uid} className="flex items-center gap-2 text-sm px-2 py-2 rounded-sm hover:bg-surface-soft cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={selected.includes(p.uid)}
              disabled={disabled}
              onChange={() => toggle(p.uid)}
              aria-label={p.name}
            />
            <span className="truncate text-ink-soft">{p.name}</span>
          </label>
        ))}
      </div>
    </details>
  );
}
