import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import FieldLabel from './FieldLabel';

/**
 * #68 — a card section that can be collapsed to free up screen space. Collapsed
 * state is remembered per section via localStorage (keyed by `id`) so a page
 * stays the way the user left it. `actions` (e.g. an "Add" / "Save" button)
 * render on the header row and are click-shielded from the collapse toggle.
 */
export default function CollapsibleSection({
  id, title, hint, actions, defaultOpen = true, className = 'card p-4', collapsedOrientation = 'horizontal', children,
}: {
  id: string;
  title: ReactNode;
  hint?: string;
  actions?: ReactNode;
  defaultOpen?: boolean;
  /** Wrapper classes; defaults to a standard card. */
  className?: string;
  /**
   * How the header looks WHEN COLLAPSED. 'horizontal' (default) keeps a full-width
   * header bar. 'vertical' shrinks the card to a slim rail with the title rotated
   * 90°, so a side-column section (e.g. Live preview) frees its horizontal space.
   */
  collapsedOrientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}) {
  const storageKey = `collapsibleSection:${id}`;
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw == null ? defaultOpen : raw === '1';
    } catch {
      return defaultOpen;
    }
  });
  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(storageKey, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  };

  // Collapsed + vertical → render a slim rail with a rotated title.
  if (!open && collapsedOrientation === 'vertical') {
    return (
      <section className="card p-2 w-11 shrink-0 self-start">
        <button
          onClick={toggle}
          className="flex flex-col items-center gap-2 py-1 text-sm font-semibold text-ink hover:text-brand-600"
          aria-expanded={false}
          title="Expand"
        >
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap tracking-wide">{title}</span>
        </button>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        {/* Toggle + hint are SIBLINGS — the hint is itself a <button> (FieldLabel),
            so it must not nest inside the toggle button (invalid HTML). */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-600"
            aria-expanded={open}
          >
            {open ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
            <span>{title}</span>
          </button>
          {hint && <FieldLabel label="" hint={hint} />}
        </div>
        {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>
      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}
