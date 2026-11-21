import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { auth } from '../../lib/firebase';
import { requestAccountDeletion } from '../../api/account';
import { useAuthStore } from '../../store/authStore';

/**
 * E29-S08 — ask for your own account to be deleted (App Store 5.1.1(v); Play's Data
 * safety answer). A full page, not a modal (mobile pattern). The firm completes the
 * deletion; the records it must keep by law are kept, as the privacy policy says.
 * Reached from the account menu and My Profile; every role but admin (appRoutes.tsx).
 */
export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.signOut);
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      await requestAccountDeletion(reason);
      // The server has disabled the sign-in; leave the session now.
      await signOut(auth).catch(() => undefined);
      clearSession();
      navigate('/login?notice=deletion-requested', { replace: true });
    } catch {
      setError('We could not send your request. Check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <PageShell
      title="Delete my account"
      back={(
        <button type="button" onClick={() => navigate(-1)} className="btn-ghost min-h-11 px-2" aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}
    >
      <div className="card p-5 md:p-6 max-w-2xl space-y-4 text-sm text-ink">
        <p>
          You can ask the firm to delete your Legal Terminus account. When you send the request:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
          <li>you are signed out at once, and you cannot sign in again with this account;</li>
          <li>the firm is told, and deletes your account within 30 days;</li>
          <li>
            the records the firm must keep by law — your matters, invoices, payments and the
            documents filed for you — are kept, as our Privacy Policy explains. Everything
            else linked to your sign-in is removed.
          </li>
        </ul>
        <p className="text-ink-muted">
          If you only want to stop receiving emails, or to change your details, contact the firm
          instead — a deleted account cannot be restored.
        </p>

        <div>
          <label htmlFor="deletion-reason" className="input-label">Reason (optional)</label>
          <textarea
            id="deletion-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 500))}
            rows={3}
            maxLength={500}
            className="input-field px-4 py-3"
            placeholder="Anything the firm should know"
          />
        </div>

        <label htmlFor="deletion-confirm" className="flex items-start gap-3 min-h-11 cursor-pointer">
          <input
            id="deletion-confirm"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
          />
          <span>I understand that I will be signed out and my account will be deleted.</span>
        </label>

        {error && (
          <div role="alert" className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary min-h-11 sm:px-6" disabled={busy}>
            Cancel
          </button>
          <button type="button" onClick={submit} disabled={!confirmed || busy} className="btn-danger min-h-11 flex-1 sm:flex-none sm:px-6">
            <Trash2 className="w-4 h-4" /> {busy ? 'Sending…' : 'Delete my account'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
