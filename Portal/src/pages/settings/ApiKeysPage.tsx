import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Copy, Check } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import { useConfirm } from '../../components/common/confirmContext';
import { getApiTokens, createApiToken, revokeApiToken } from '../../api/settings';

/**
 * Story 33.1 — API keys (Epic 33).
 *
 * The screen's one unusual responsibility: the secret is returned exactly once,
 * at creation, because only a hash is stored. So a freshly created key is held
 * in component state and shown prominently until dismissed — there is no later
 * screen, and no support process, that can recover it.
 */

const SCOPE_COPY: Record<string, string> = {
  'read:matters': 'Read matters',
  'read:clients': 'Read clients',
  'read:documents_meta': 'Read document details (never file contents)',
};

function when(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export default function ApiKeysPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();

  const { data, isLoading, isError } = useQuery({ queryKey: ['api-tokens'], queryFn: getApiTokens });
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<string[]>(['read:matters']);
  const [fresh, setFresh] = useState<{ secret: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const create = useMutation({
    mutationFn: () => createApiToken(name.trim() || 'Untitled key', scopes),
    onSuccess: (res) => {
      setFresh({ secret: res.secret, id: res.token.id });
      setName('');
      qc.invalidateQueries({ queryKey: ['api-tokens'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Could not create the key'),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeApiToken(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['api-tokens'] });
      toast.success('Key revoked');
    },
    onError: (e: Error) => toast.error(e.message || 'Could not revoke the key'),
  });

  const onRevoke = async (id: string, label: string) => {
    const ok = await confirm({
      title: 'Revoke this key?',
      message: `Anything using "${label}" will stop working immediately. This cannot be undone.`,
      confirmLabel: 'Revoke',
      tone: 'danger',
    });
    if (ok) revoke.mutate(id);
  };

  const toggleScope = (s: string) =>
    setScopes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <PageShell
      title="API keys"
      subtitle="Let your own systems read this firm’s data."
    >
      {isLoading ? <SkeletonCards count={2} /> : isError ? (
        <div className="alert-danger">API keys could not be loaded.</div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {/* Shown once. There is no way to see this again. */}
          {fresh && (
            <div className="alert-warning space-y-2">
              <p className="font-medium">Copy this key now — it will not be shown again.</p>
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
                    } catch { toast.error('Could not copy — select the key and copy it manually.'); }
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <button type="button" className="text-sm underline" onClick={() => setFresh(null)}>
                I have saved it
              </button>
            </div>
          )}

          <div className="card p-4 space-y-3">
            <p className="text-sm font-medium text-ink">Create a key</p>
            <input
              className="w-full rounded-md border border-hairline px-3 py-2 text-sm min-h-11"
              placeholder="What is this key for? (e.g. Billing sync)"
              aria-label="Key name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="space-y-1.5">
              {(data?.scopes ?? []).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-ink min-h-11">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={scopes.includes(s)}
                    onChange={() => toggleScope(s)}
                  />
                  {SCOPE_COPY[s] ?? s}
                </label>
              ))}
            </div>
            <button
              type="button"
              className="btn-primary min-h-11"
              disabled={create.isPending || scopes.length === 0}
              onClick={() => create.mutate()}
            >
              {create.isPending ? 'Creating…' : 'Create key'}
            </button>
            {scopes.length === 0 && (
              <p className="text-xs text-ink-muted">Choose at least one thing this key may read.</p>
            )}
          </div>

          {(data?.data ?? []).length === 0 ? (
            <div className="card p-8 text-center">
              <KeyRound className="w-8 h-8 mx-auto text-ink-muted mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-ink">No API keys yet</p>
            </div>
          ) : (
            <div className="card divide-y divide-hairline">
              {(data?.data ?? []).map((t) => (
                <div key={t.id} className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {t.name}
                      {t.revokedAt && <span className="badge-gray ml-2">Revoked</span>}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      <code>{t.prefix}</code> · created {when(t.createdAt)} · last used {when(t.lastUsedAt)}
                    </p>
                    <p className="text-xs text-ink-muted mt-1">
                      {t.scopes.map((s) => SCOPE_COPY[s] ?? s).join(' · ')}
                    </p>
                  </div>
                  {!t.revokedAt && (
                    <button
                      type="button"
                      className="text-sm text-red-700 hover:underline shrink-0 min-h-11"
                      disabled={revoke.isPending}
                      onClick={() => onRevoke(t.id, t.name ?? 'this key')}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-ink-muted">
            A key carries only the scopes you grant it — a read-only key can never write.
            Document contents are never available over the API.
          </p>
        </div>
      )}
    </PageShell>
  );
}
