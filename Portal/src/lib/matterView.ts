/**
 * E22-S01 — the remembered Board/List preference for the Matters surface.
 *
 * Its own module so `MatterViewToggle.tsx` exports only its component: mixing
 * constant and component exports breaks React Fast Refresh
 * (react-refresh/only-export-components).
 *
 * Wrapped in try/catch throughout: a browser with site data blocked must still
 * render the page, it simply forgets the preference.
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
