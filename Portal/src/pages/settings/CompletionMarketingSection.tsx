import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Megaphone, Loader2, RotateCcw, Check } from 'lucide-react';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import { useToast } from '../../components/common/toastContext';
import { getCompletionMarketing, putCompletionMarketing, type CompletionMarketing } from '../../api/settings';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/**
 * #310 — the "Explore more services" block added to the end of the email a
 * client receives when their matter completes. One block for every service.
 * Admins and managers edit it; edits auto-save like the templates around it.
 * Switched off, or left empty, the completion email goes out without it.
 */
export default function CompletionMarketingSection() {
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['completion-marketing'],
    queryFn: getCompletionMarketing,
    staleTime: 60_000,
  });

  const [edit, setEdit] = useState<CompletionMarketing | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed local state from the server copy while rendering (no stale first paint).
  const [seededFrom, setSeededFrom] = useState<typeof data>(undefined);
  if (data && data !== seededFrom) {
    setSeededFrom(data);
    setEdit(data.settings);
  }

  const save = useMutation({
    mutationFn: putCompletionMarketing,
    onSuccess: () => {
      setSaveState('saved');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2500);
    },
    onError: (e: Error) => { setSaveState('error'); toast.error(e.message || 'Could not save the block.'); },
  });

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
  }, []);

  const update = (next: CompletionMarketing, delayMs = 800) => {
    setEdit(next);
    setSaveState('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save.mutate(next), delayMs);
  };

  const status = (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted" aria-live="polite">
      {saveState === 'saving' && (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>)}
      {saveState === 'saved' && (<><Check className="w-3.5 h-3.5 text-emerald-500" /> Saved</>)}
      {saveState === 'error' && (<span className="text-red-600">Not saved — retry</span>)}
    </span>
  );

  if (isLoading) {
    return <div className="card p-8 flex justify-center text-ink-faint"><Loader2 className="w-5 h-5 animate-spin" /></div>;
  }
  if (error || !data || !edit) {
    return <div className="card p-6 text-sm text-red-600">{(error as Error | null)?.message || 'Could not load the completion email block.'}</div>;
  }

  const def = data.default;
  const isDefault = edit.enabled === def.enabled && edit.heading === def.heading && edit.body === def.body;
  const empty = !edit.heading.trim() && !edit.body.trim();

  return (
    <CollapsibleSection
      id="email-tpl-completion-marketing"
      defaultOpen
      title={
        <span className="inline-flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-ink-muted shrink-0" />
          <span className="font-semibold text-ink">Client — Service completed: Explore more services</span>
          {!edit.enabled && <span className="badge bg-surface-soft text-ink-muted text-[10px]">Off</span>}
        </span>
      }
      actions={
        <span className="inline-flex items-center gap-3">
          {status}
          <button
            onClick={() => update({ ...def }, 0)}
            disabled={isDefault}
            className="text-xs text-ink-muted hover:text-brand-600 inline-flex items-center gap-1 disabled:opacity-40 min-h-[44px] sm:min-h-0"
            title="Reset to the built-in text"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </span>
      }
    >
      <p className="text-xs text-ink-muted mb-3">
        Added to the end of the email a client receives when their matter is completed — the same
        block for every service. A web address on its own becomes a link; a line starting with “- ”
        becomes a bullet.
      </p>

      <label className="flex items-center justify-between gap-3 mb-4 min-h-[44px]">
        <span className="text-sm text-ink-soft">Add this block to the completion email</span>
        <button
          type="button"
          role="switch"
          aria-checked={edit.enabled}
          aria-label="Add this block to the completion email"
          onClick={() => update({ ...edit, enabled: !edit.enabled }, 0)}
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
            edit.enabled ? 'bg-ink' : 'bg-hairline'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              edit.enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </label>

      <label htmlFor="completion-marketing-heading" className="block text-xs font-medium text-ink-soft mb-1">Heading</label>
      <input
        id="completion-marketing-heading"
        className="input-field w-full mb-3"
        value={edit.heading}
        maxLength={data.limits.heading}
        onChange={(e) => update({ ...edit, heading: e.target.value })}
      />

      <label htmlFor="completion-marketing-body" className="block text-xs font-medium text-ink-soft mb-1">Text</label>
      <textarea
        id="completion-marketing-body"
        className="input-field w-full resize-y font-mono text-xs leading-relaxed"
        rows={12}
        value={edit.body}
        maxLength={data.limits.body}
        onChange={(e) => update({ ...edit, body: e.target.value })}
      />

      {edit.enabled && empty && (
        <p className="bg-amber-50 text-amber-800 border border-amber-200 text-xs mt-2 rounded-md px-3 py-2">
          The block is empty, so the completion email is sent without it.
        </p>
      )}
    </CollapsibleSection>
  );
}
