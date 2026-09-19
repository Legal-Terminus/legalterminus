import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Webhook, Copy, Check, ChevronDown } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import { useConfirm } from '../../components/common/confirmContext';
import {
  getWebhooks, createWebhook, setWebhookEnabled, deleteWebhook, getWebhookDeliveries,
} from '../../api/settings';

/**
 * Story 33.2 — outbound webhooks (Epic 33).
 *
 * Two things this screen must communicate honestly:
 *
 * 1. The signing secret is shown ONCE. Only a consumer that stores it can
 *    verify a delivery, and we cannot re-issue it.
 * 2. An AUTO-DISABLED subscription needs a human. Ten consecutive failures
 *    switch it off, and if the page did not say so a firm would simply stop
 *    receiving events and never learn why.
 */

function when(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

function Deliveries({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['webhook-deliveries', id],
    queryFn: () => getWebhookDeliveries(id),
  });
  if (isLoading) return <p className="text-xs text-ink-muted mt-2">Loading deliveries…</p>;
  const rows = data?.data ?? [];
  if (rows.length === 0) return <p className="text-xs text-ink-muted mt-2">No deliveries yet.</p>;
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full min-w-[420px] text-xs">
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-t border-hairline">
              <td className="py-1.5 pr-3 text-ink-muted whitespace-nowrap">{when(d.at)}</td>
              <td className="py-1.5 pr-3 text-ink">{d.event}</td>
              <td className="py-1.5 pr-3">
                <span className={d.ok ? 'badge-green' : 'badge-red'}>
                  {d.ok ? `${d.status ?? 'OK'}` : (d.error ?? 'failed')}
                </span>
              </td>
              <td className="py-1.5 text-ink-muted whitespace-nowrap">{d.ms != null ? `${d.ms}ms` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WebhooksPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const { data, isLoading, isError } = useQuery({ queryKey: ['webhooks'], queryFn: getWebhooks });

  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [fresh, setFresh] = useState<{ secret: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['webhooks'] });

  const create = useMutation({
    mutationFn: () => createWebhook(url.trim(), events),
    onSuccess: (res) => { setFresh({ secret: res.secret }); setUrl(''); setEvents([]); invalidate(); },
    onError: (e: Error) => toast.error(e.message || 'Could not create the webhook'),
  });
  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => setWebhookEnabled(id, enabled),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message || 'Could not update the webhook'),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteWebhook(id),
    onSuccess: () => { invalidate(); toast.success('Webhook deleted'); },
    onError: (e: Error) => toast.error(e.message || 'Could not delete the webhook'),
  });

  const onDelete = async (id: string, label: string) => {
    const ok = await confirm({
      title: 'Delete this webhook?',
      message: `Cometflow will stop sending events to ${label}.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (ok) remove.mutate(id);
  };

  return (
    <PageShell
      title="Webhooks"
      subtitle="Send this firm’s events to your own systems."
    >
      {isLoading ? <SkeletonCards count={2} /> : isError ? (
        <div className="alert-danger">Webhooks could not be loaded.</div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {fresh && (
            <div className="alert-warning space-y-2">
              <p className="font-medium">Copy this signing secret now — it will not be shown again.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-white rounded-lg px-3 py-2 break-all border border-hairline">
                  {fresh.secret}
                </code>
                <button
                  type="button"
                  className="rounded-md border border-hairline px-3 py-2 text-sm min-h-11 bg-white inline-flex items-center gap-1.5"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(fresh.secret);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch { toast.error('Could not copy — select it and copy manually.'); }
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs">
                Verify each delivery with it — see the API reference for the signature format.
              </p>
              <button type="button" className="text-sm underline" onClick={() => setFresh(null)}>
                I have saved it
              </button>
            </div>
          )}

          <div className="card p-4 space-y-3">
            <p className="text-sm font-medium text-ink">Add a webhook</p>
            <input
              className="w-full rounded-md border border-hairline px-3 py-2 text-sm min-h-11"
              placeholder="https://your-system.example.com/cometflow"
              aria-label="Webhook URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-1.5">
              {(data?.events ?? []).map((ev) => (
                <label key={ev} className="flex items-center gap-2 text-sm text-ink min-h-11">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={events.includes(ev)}
                    onChange={() => setEvents((p) => (p.includes(ev) ? p.filter((x) => x !== ev) : [...p, ev]))}
                  />
                  <code className="text-xs">{ev}</code>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="btn-primary min-h-11"
              disabled={create.isPending || !url.trim() || events.length === 0}
              onClick={() => create.mutate()}
            >
              {create.isPending ? 'Adding…' : 'Add webhook'}
            </button>
            <p className="text-xs text-ink-muted">
              Must be an https:// address reachable from the internet.
            </p>
          </div>

          {(data?.data ?? []).length === 0 ? (
            <div className="card p-8 text-center">
              <Webhook className="w-8 h-8 mx-auto text-ink-muted mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-ink">No webhooks yet</p>
            </div>
          ) : (
            <div className="card divide-y divide-hairline">
              {(data?.data ?? []).map((w) => (
                <div key={w.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink break-all">{w.url}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {w.events.join(' · ')}
                      </p>
                      <p className="text-xs text-ink-muted mt-1">
                        last success {when(w.lastSuccessAt)} · last failure {when(w.lastFailureAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        className="text-sm text-brand-700 hover:underline min-h-11"
                        onClick={() => toggle.mutate({ id: w.id, enabled: !w.enabled })}
                      >
                        {w.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        className="text-sm text-red-700 hover:underline min-h-11"
                        onClick={() => onDelete(w.id, w.url ?? 'this endpoint')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* An auto-disabled endpoint must SAY so: otherwise a firm
                      silently stops receiving events and never learns why. */}
                  {!w.enabled && w.disabledReason && (
                    <div className="alert-warning mt-2 text-xs">
                      Switched off automatically after {w.disabledReason}. Fix the endpoint, then Enable.
                    </div>
                  )}

                  <button
                    type="button"
                    className="mt-2 text-xs text-ink-muted inline-flex items-center gap-1 hover:text-ink min-h-11"
                    onClick={() => setOpen(open === w.id ? null : w.id)}
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open === w.id ? 'rotate-180' : ''}`} />
                    Recent deliveries
                  </button>
                  {open === w.id && <Deliveries id={w.id} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
