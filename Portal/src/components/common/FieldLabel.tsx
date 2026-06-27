import { useId, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

/**
 * A field label with an optional ⓘ info tooltip. The tooltip is keyboard- and
 * screen-reader-accessible (focusable trigger, `aria-describedby`), not hover-only,
 * so non-technical users can learn what each field does without leaving the form.
 */
export default function FieldLabel({
  label,
  hint,
  htmlFor,
  className = '',
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <label htmlFor={htmlFor} className="text-xs text-ink-muted">{label}</label>
      {hint && (
        <span className="relative inline-flex">
          <button
            type="button"
            aria-label="More info"
            aria-describedby={open ? id : undefined}
            className="text-ink-faint hover:text-ink focus:text-ink focus:outline-none"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {open && (
            <span
              role="tooltip"
              id={id}
              className="absolute left-0 top-5 z-20 w-60 rounded-md border border-hairline bg-white p-2 text-[11px] leading-snug text-ink shadow-card"
            >
              {hint}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
