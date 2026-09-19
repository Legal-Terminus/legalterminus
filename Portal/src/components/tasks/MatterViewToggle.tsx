import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';

/**
 * Board / List switch for the Matters surface.
 *
 * The two were separate nav entries showing the same data, and the board linked
 * to the list while the list had no way back — a one-way door. They are now one
 * destination with two views, which is what a user means by "Matters".
 *
 * The choice is REMEMBERED (localStorage), because a firm that works from the
 * board wants the board every morning, and one that works from the list wants
 * the list. Wrapped in try/catch: a browser with site data blocked must still
 * render, it simply forgets the preference.
 */

const KEY = 'matters:view';

export type MatterView = 'board' | 'list';

export function readPreferredView(): MatterView | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'board' || v === 'list' ? v : null;
  } catch { return null; }
}

export function rememberView(view: MatterView) {
  try { localStorage.setItem(KEY, view); } catch { /* private mode */ }
}

export default function MatterViewToggle({ current }: { current: MatterView }) {
  const navigate = useNavigate();

  const go = (view: MatterView) => {
    rememberView(view);
    navigate(view === 'board' ? '/matters/board' : '/tasks');
  };

  const cls = (view: MatterView) =>
    `min-h-11 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 ${
      current === view ? 'bg-ink text-white' : 'bg-surface-soft text-ink-muted hover:bg-surface-card'
    }`;

  return (
    <div role="group" aria-label="Matter view" className="inline-flex items-center gap-1">
      <button type="button" onClick={() => go('board')} aria-pressed={current === 'board'} className={cls('board')}>
        <LayoutGrid className="w-4 h-4" aria-hidden="true" /> Board
      </button>
      <button type="button" onClick={() => go('list')} aria-pressed={current === 'list'} className={cls('list')}>
        <List className="w-4 h-4" aria-hidden="true" /> List
      </button>
    </div>
  );
}
