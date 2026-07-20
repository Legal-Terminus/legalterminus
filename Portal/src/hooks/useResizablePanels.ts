import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * #72 — Persisted collapsible + drag-resizable side rails for the matter detail
 * layout (Stages rail on the left, Activity rail on the right). Widths and
 * collapsed flags persist in localStorage so the layout sticks across reloads.
 * Desktop-only (the caller gates on `xl`); mobile keeps its own stacked layout.
 */

export interface RailState {
  width: number;
  collapsed: boolean;
  setWidth: (w: number) => void;
  toggle: () => void;
  /** Pointer-down handler for a divider that resizes this rail. `side` says
   *  whether the rail is to the LEFT or RIGHT of the handle (drag direction). */
  startDrag: (side: 'left' | 'right') => (e: React.PointerEvent) => void;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function usePersisted<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  const set = useCallback((v: T) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
  }, [key]);
  return [val, set];
}

export function useRail(
  storageKey: string,
  { initial, min, max, defaultCollapsed = false }:
    { initial: number; min: number; max: number; defaultCollapsed?: boolean },
): RailState {
  const [width, setWidthRaw] = usePersisted(`${storageKey}:w`, initial);
  // `defaultCollapsed` only sets the FIRST-RUN state — a user's own choice is
  // persisted and always wins on later visits (#119).
  const [collapsed, setCollapsed] = usePersisted(`${storageKey}:c`, defaultCollapsed);
  const drag = useRef<{ startX: number; startW: number; side: 'left' | 'right' } | null>(null);

  const setWidth = useCallback((w: number) => setWidthRaw(clamp(w, min, max)), [setWidthRaw, min, max]);
  const toggle = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.startX;
      // A right-side rail grows when dragging left (negative dx), a left-side rail
      // grows when dragging right (positive dx).
      const delta = drag.current.side === 'right' ? -dx : dx;
      setWidth(drag.current.startW + delta);
    };
    const onUp = () => {
      drag.current = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [setWidth]);

  const startDrag = useCallback((side: 'left' | 'right') => (e: React.PointerEvent) => {
    e.preventDefault();
    drag.current = { startX: e.clientX, startW: width, side };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [width]);

  return { width, collapsed, setWidth, toggle, startDrag };
}
