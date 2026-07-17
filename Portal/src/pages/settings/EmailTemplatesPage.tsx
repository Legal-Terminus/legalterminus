import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mail, Loader2, RotateCcw, Check, Users, User } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import { useToast } from '../../components/common/toastContext';
import { getEmailTemplates, putEmailTemplates, type EmailTemplate } from '../../api/settings';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/**
 * #107/#108/#109 — admin-editable email templates. Each template is a collapsible
 * card (grouped by audience) so the list stays scannable; edits AUTO-SAVE
 * (debounced) with a live "Saving… / Saved" status, so there's no Save button.
 */
export default function EmailTemplatesPage() {
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['email-templates'],
    queryFn: getEmailTemplates,
    staleTime: 60_000,
  });

  const [edits, setEdits] = useState<Record<string, EmailTemplate>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed local edit state once the server templates load.
  useEffect(() => { if (data) setEdits(data.templates); }, [data]);

  const save = useMutation({
    mutationFn: (templates: Record<string, EmailTemplate>) => putEmailTemplates(templates),
    onSuccess: () => {
      setSaveState('saved');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2500);
    },
    onError: (e: Error) => { setSaveState('error'); toast.error(e.message || 'Could not save templates.'); },
  });

  // Debounced auto-save: schedule a save ~800ms after the last keystroke.
  const scheduleSave = (next: Record<string, EmailTemplate>) => {
    setSaveState('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save.mutate(next), 800);
  };
  // Flush on unmount so an in-flight edit isn't lost when navigating away.
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const groups = useMemo(() => {
    const defs = data?.defs ?? {};
    const keys = Object.keys(defs);
    return {
      client: keys.filter((k) => defs[k].audience === 'client'),
      internal: keys.filter((k) => defs[k].audience === 'internal'),
    };
  }, [data]);

  const setField = (key: string, field: keyof EmailTemplate, value: string) => {
    setEdits((e) => {
      const next = { ...e, [key]: { ...e[key], [field]: value } };
      scheduleSave(next);
      return next;
    });
  };

  const resetOne = (key: string) => {
    const def = data?.defs[key]?.default;
    if (!def) return;
    setEdits((e) => {
      const next = { ...e, [key]: { ...def } };
      scheduleSave(next);
      return next;
    });
  };

  const statusPill = (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      {saveState === 'saving' && (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>)}
      {saveState === 'saved' && (<><Check className="w-3.5 h-3.5 text-emerald-500" /> Saved</>)}
      {saveState === 'error' && (<span className="text-red-600">Not saved — retry</span>)}
      {saveState === 'idle' && (<span className="text-ink-faint">Changes save automatically</span>)}
    </span>
  );

  const renderCard = (key: string) => {
    const def = data!.defs[key];
    const t = edits[key] ?? def.default;
    const isDefault = t.subject === def.default.subject && t.body === def.default.body;
    return (
      <CollapsibleSection
        key={key}
        id={`email-tpl-${key}`}
        defaultOpen={false}
        title={
          <span className="inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-ink-muted shrink-0" />
            <span className="font-semibold text-ink">{def.label}</span>
            {!isDefault && <span className="badge bg-brand-50 text-brand-700 text-[10px]">Customised</span>}
          </span>
        }
        actions={
          <button
            onClick={() => resetOne(key)}
            disabled={isDefault}
            className="text-xs text-ink-muted hover:text-brand-600 inline-flex items-center gap-1 disabled:opacity-40"
            title="Reset to the built-in default"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        }
      >
        <p className="text-xs text-ink-muted mb-3">{def.description}</p>

        <label className="block text-xs font-medium text-ink-soft mb-1">Subject</label>
        <input
          className="input-field w-full mb-3"
          value={t.subject}
          onChange={(e) => setField(key, 'subject', e.target.value)}
          aria-label={`${def.label} subject`}
        />

        <label className="block text-xs font-medium text-ink-soft mb-1">Message</label>
        <textarea
          className="input-field w-full resize-y font-mono text-xs leading-relaxed"
          rows={7}
          value={t.body}
          onChange={(e) => setField(key, 'body', e.target.value)}
          aria-label={`${def.label} body`}
        />

        {def.placeholders.length > 0 && (
          <p className="text-[11px] text-ink-faint mt-2">
            Placeholders you can use:{' '}
            {def.placeholders.map((p) => (
              <code key={p} className="mx-0.5 px-1 py-0.5 rounded bg-surface-soft text-ink-muted">{`{{${p}}}`}</code>
            ))}
          </p>
        )}
      </CollapsibleSection>
    );
  };

  return (
    <PageShell
      title="Email Templates"
      subtitle="Customise the subject and message of the automated emails the portal sends."
      action={statusPill}
    >
      {isLoading ? (
        <div className="card p-16 flex justify-center text-ink-faint"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : error ? (
        <div className="card p-12 text-center text-sm text-red-600">{(error as Error).message}</div>
      ) : (
        <div className="space-y-8">
          {([
            ['client', 'Client emails', <Users key="c" className="w-4 h-4 text-ink-muted" />],
            ['internal', 'Internal team emails', <User key="i" className="w-4 h-4 text-ink-muted" />],
          ] as const).map(([audience, label, icon]) => (
            <section key={audience}>
              <h2 className="text-sm font-semibold text-ink mb-3 inline-flex items-center gap-2">{icon}{label}</h2>
              <div className="space-y-3">
                {groups[audience].map(renderCard)}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
