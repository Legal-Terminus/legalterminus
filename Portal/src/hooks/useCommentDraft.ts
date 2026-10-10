import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * #83 — Autosave a comment/remark draft to localStorage, scoped per matter, per
 * step, and per user, so drafts never leak across steps or users and only the
 * owner can restore their own. The draft restores automatically on mount and is
 * cleared once the comment is submitted.
 *
 * Storage key: `commentDraft:{taskId}:{stepNumber}:{uid}`. A `null` uid (not
 * logged in) disables persistence entirely.
 */
const DEBOUNCE_MS = 800;

function keyFor(taskId: string, stepNumber: number | string, uid: string | null): string | null {
  if (!uid) return null;
  return `commentDraft:${taskId}:${stepNumber}:${uid}`;
}

/** The stored draft for a key; empty when there is none or storage is unavailable. */
function readDraft(storageKey: string | null): { value: string; at: string | null } {
  if (!storageKey) return { value: '', at: null };
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as { value: string; at: string };
      return { value: parsed.value ?? '', at: parsed.at ?? null };
    }
  } catch { /* unreadable or disabled storage — treat as no draft */ }
  return { value: '', at: null };
}

export interface CommentDraft {
  /** The restored draft value (empty string if none). */
  initial: string;
  /** null while never saved; otherwise the ISO time of the last autosave. */
  savedAt: string | null;
  /** Persist a value (debounced). Empty/whitespace clears the draft. */
  save: (value: string) => void;
  /** Remove the draft immediately (call on successful submit). */
  clear: () => void;
}

export function useCommentDraft(
  taskId: string,
  stepNumber: number | string,
  uid: string | null,
): CommentDraft {
  const storageKey = keyFor(taskId, stepNumber, uid);
  // Restore on mount, and again when the key changes (another step or user).
  // Read while rendering rather than in an effect: the caller gets the saved
  // draft on its FIRST render instead of an empty box that fills in a moment
  // later, and a key change is picked up before anything is painted.
  const [loadedKey, setLoadedKey] = useState(storageKey);
  const [initial, setInitial] = useState(() => readDraft(storageKey).value);
  const [savedAt, setSavedAt] = useState<string | null>(() => readDraft(storageKey).at);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  if (loadedKey !== storageKey) {
    const stored = readDraft(storageKey);
    setLoadedKey(storageKey);
    setInitial(stored.value);
    setSavedAt(stored.at);
  }

  const clear = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setSavedAt(null);
    if (storageKey) { try { localStorage.removeItem(storageKey); } catch { /* ignore */ } }
  }, [storageKey]);

  const save = useCallback((value: string) => {
    if (!storageKey) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        if (!value.trim()) {
          localStorage.removeItem(storageKey);
          setSavedAt(null);
        } else {
          const at = new Date().toISOString();
          localStorage.setItem(storageKey, JSON.stringify({ value, at }));
          setSavedAt(at);
        }
      } catch { /* storage full / disabled — best-effort */ }
    }, DEBOUNCE_MS);
  }, [storageKey]);

  // Flush any pending timer on unmount.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { initial, savedAt, save, clear };
}

/** "Last saved: 2 minutes ago" style label from an ISO time. */
export function draftSavedLabel(savedAt: string | null): string | null {
  if (!savedAt) return null;
  const diff = Date.now() - new Date(savedAt).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Draft saved just now';
  if (mins === 1) return 'Draft saved 1 minute ago';
  if (mins < 60) return `Draft saved ${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? 'Draft saved 1 hour ago' : `Draft saved ${hrs} hours ago`;
}
