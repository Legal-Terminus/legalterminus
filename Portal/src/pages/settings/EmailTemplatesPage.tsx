import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mail, Save, Loader2, RotateCcw } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import { getEmailTemplates, putEmailTemplates, type EmailTemplate } from '../../api/settings';

/**
 * #107/#108/#109 — admin-editable email templates. Each template has a subject +
 * body with {{placeholder}} tokens; a per-template "Reset to default" restores the
 * built-in copy. Grouped by audience (client vs internal).
 */
export default function EmailTemplatesPage() {
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['email-templates'],
    queryFn: getEmailTemplates,
    staleTime: 60_000,
  });

  const [edits, setEdits] = useState<Record<string, EmailTemplate>>({});
  // Seed local edit state once the server templates load.
  useEffect(() => { if (data) setEdits(data.templates); }, [data]);

  const save = useMutation({
    mutationFn: () => putEmailTemplates(edits),
    onSuccess: () => toast.success('Email templates saved.'),
    onError: (e: Error) => toast.error(e.message || 'Could not save templates.'),
  });

  const groups = useMemo(() => {
    const defs = data?.defs ?? {};
    const keys = Object.keys(defs);
    return {
      client: keys.filter((k) => defs[k].audience === 'client'),
      internal: keys.filter((k) => defs[k].audience === 'internal'),
    };
  }, [data]);

  const setField = (key: string, field: keyof EmailTemplate, value: string) =>
    setEdits((e) => ({ ...e, [key]: { ...e[key], [field]: value } }));

  const resetOne = (key: string) => {
    const def = data?.defs[key]?.default;
    if (def) setEdits((e) => ({ ...e, [key]: { ...def } }));
  };

  const dirty = useMemo(() => {
    if (!data) return false;
    return Object.keys(edits).some((k) =>
      edits[k]?.subject !== data.templates[k]?.subject || edits[k]?.body !== data.templates[k]?.body);
  }, [edits, data]);

  return (
    <PageShell
      title="Email Templates"
      subtitle="Customise the subject and message of the automated emails the portal sends."
      action={
        <button
          onClick={() => save.mutate()}
          disabled={!dirty || save.isPending}
          className="btn-primary inline-flex items-center gap-2"
        >
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {save.isPending ? 'Saving…' : 'Save changes'}
        </button>
      }
    >
      {isLoading ? (
        <div className="card p-16 flex justify-center text-ink-faint"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : error ? (
        <div className="card p-12 text-center text-sm text-red-600">{(error as Error).message}</div>
      ) : (
        <div className="space-y-8">
          {(['client', 'internal'] as const).map((audience) => (
            <section key={audience}>
              <h2 className="text-sm font-semibold text-ink mb-3">
                {audience === 'client' ? 'Client emails' : 'Internal team emails'}
              </h2>
              <div className="space-y-4">
                {groups[audience].map((key) => {
                  const def = data!.defs[key];
                  const t = edits[key] ?? def.default;
                  return (
                    <div key={key} className="card p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <Mail className="w-4 h-4 text-ink-muted mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink">{def.label}</p>
                            <p className="text-xs text-ink-muted">{def.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => resetOne(key)}
                          className="text-xs text-ink-muted hover:text-brand-600 inline-flex items-center gap-1 shrink-0"
                          title="Reset to the built-in default"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                      </div>

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
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
