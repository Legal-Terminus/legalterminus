import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Plus, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { useAuthStore } from '../../store/authStore';
import { getClientLogins, addClientLogin, removeClientLogin } from '../../api/users';

/**
 * #166 — additional people who can SIGN IN on a client's account.
 *
 * Deliberately separate from the "Additional Emails" list above: those are
 * contact addresses that receive mail, these are real accounts with their own
 * password. Each sees the same matters as the main client and can approve,
 * reject, upload and download exactly as they can — the audit trail still
 * records the individual, which is the whole reason not to share one password.
 *
 * Only shown when editing an existing client: a login has to attach to a saved
 * account, so there is nothing to attach to on the create form.
 */
export default function ClientLoginsPanel({ clientUid }: { clientUid: string }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const role = useAuthStore((s) => s.role);
  const canRevoke = role === 'admin'; // adding is admin+manager; revoking is admin-only

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const { data: logins = [], isLoading } = useQuery({
    queryKey: ['client-logins', clientUid],
    queryFn: () => getClientLogins(clientUid),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['client-logins', clientUid] });

  const add = useMutation({
    mutationFn: () => addClientLogin(clientUid, {
      email: email.trim().toLowerCase(),
      ...(name.trim() ? { name: name.trim() } : {}),
    }),
    onSuccess: () => {
      invalidate();
      setEmail('');
      setName('');
      toast.success('Login added. They will get an email to set their password.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not add that login.'),
  });

  const revoke = useMutation({
    mutationFn: (loginUid: string) => removeClientLogin(clientUid, loginUid),
    onSuccess: () => { invalidate(); toast.success('Login removed.'); },
    onError: (err: Error) => toast.error(err.message || 'Could not remove that login.'),
  });

  const canSubmit = /.+@.+\..+/.test(email.trim()) && !add.isPending;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
          <KeyRound className="w-3.5 h-3.5 text-brand-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">Additional Logins</h3>
        <span className="text-xs text-gray-400 font-normal">(can sign in)</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <p className="text-xs text-ink-muted mb-3">
        Give a partner or team member their own sign-in for this client. They see the same
        matters and can approve, reject and upload just like the main contact — with their
        own password, so you can tell who did what and remove one person without affecting
        the others.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          type="email"
          aria-label="Login email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) { e.preventDefault(); add.mutate(); } }}
          placeholder="partner@example.com"
          className="input-field flex-1"
        />
        <input
          type="text"
          aria-label="Login name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="input-field sm:w-44"
        />
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => add.mutate()}
          className="btn-secondary shrink-0 disabled:opacity-50"
        >
          {add.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add login
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading logins…
        </div>
      ) : logins.length === 0 ? (
        <p className="text-xs text-ink-faint">
          No additional logins. Only the main email above can sign in.
        </p>
      ) : (
        <div className="space-y-2">
          {logins.map((l) => (
            <div key={l.uid} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl text-sm">
              <div className="min-w-0">
                <span className="text-gray-700 truncate">{l.email}</span>
                {l.name && <span className="text-ink-faint ml-2 text-xs">{l.name}</span>}
              </div>
              {canRevoke && (
                <button
                  type="button"
                  aria-label={`Remove login ${l.email}`}
                  disabled={revoke.isPending}
                  onClick={() => revoke.mutate(l.uid)}
                  className="ml-3 text-gray-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
