import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  confirmPasswordReset,
  isSignInWithEmailLink,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { LTMark } from '../../components/common/LTLogo';
import { useAuthStore } from '../../store/authStore';
import { EMAIL_FOR_SIGN_IN_KEY } from '../../api/account';
import { apiFetch } from '../../api/client';

/**
 * #203 — where every emailed account link lands: "create your password",
 * "choose a new password" and the one-time sign-in link.
 *
 * These links used to open Firebase's own page on `<project>.firebaseapp.com`
 * — unbranded, titled "Reset your password" even for an account the person
 * had never had, and a dead end afterwards. A client took it for phishing.
 * Now the link is on the firm's own domain, says what it is for, and signs the
 * person straight in when they are done.
 *
 * Query: `mode` (`resetPassword` | `signIn`), `oobCode`, and for passwords an
 * `intent` (`setup` | `reset`) that only changes the wording. The same shape as
 * Firebase's custom action handler, so the Firebase console's "action URL" can
 * point here too.
 */

const MIN_PASSWORD = 8;

/**
 * The same post-sign-in call LoginPage makes, so every way in leaves the
 * profile in the same state. Best effort, as there: a failure here must not
 * undo a sign-in that has already succeeded.
 */
async function registerSession(name: string) {
  try {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName: auth.currentUser?.displayName || name, provider: 'email' }),
    });
  } catch (err) {
    console.error('Registration error:', err);
  }
}

type Phase =
  | { kind: 'checking' }
  | { kind: 'password'; email: string }
  | { kind: 'confirm-email' }
  | { kind: 'working' }
  | { kind: 'done' }
  | { kind: 'failed'; message: string };

/** Firebase error codes → something a client can act on. Never the raw code. */
function friendly(err: unknown, mode: string): string {
  const code = (err as { code?: string })?.code ?? '';
  if (code === 'auth/expired-action-code' || code === 'auth/invalid-action-code') {
    return mode === 'signIn'
      ? 'This sign-in link has expired or has already been used. Ask for a new one from the sign-in page.'
      : 'This link has expired or has already been used. Ask for a new one below.';
  }
  if (code === 'auth/invalid-email' || code === 'auth/missing-email') {
    return 'That email address does not match the one this link was sent to.';
  }
  if (code === 'auth/user-disabled') return 'This account has been switched off. Contact your firm.';
  if (code === 'auth/weak-password') return `Choose a longer password — at least ${MIN_PASSWORD} characters.`;
  if (code === 'auth/network-request-failed') return 'No connection. Check your internet and try again.';
  return 'Something went wrong with this link. Ask for a new one from the sign-in page.';
}

export default function AccountActionPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get('mode') ?? '';
  const oobCode = params.get('oobCode') ?? '';
  const isSetup = params.get('intent') === 'setup';

  const [phase, setPhase] = useState<Phase>({ kind: 'checking' });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const started = useRef(false);

  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);

  /**
   * The emailed link carries only the code; Firebase's client SDK wants the
   * full action URL (with the project's public API key) to recognise a
   * sign-in link. Rebuild it here rather than putting the key in the email.
   */
  const signInUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('mode', 'signIn');
    url.searchParams.set('oobCode', oobCode);
    url.searchParams.set('apiKey', auth.app.options.apiKey ?? '');
    return url.toString();
  }, [oobCode]);

  const finishEmailLink = async (address: string) => {
    setPhase({ kind: 'working' });
    try {
      await signInWithEmailLink(auth, address.trim().toLowerCase(), signInUrl);
      await registerSession(address);
      try { window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY); } catch { /* private mode */ }
      setPhase({ kind: 'done' });
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/invalid-email') {
        setFormError(friendly(err, 'signIn'));
        setPhase({ kind: 'confirm-email' });
        return;
      }
      setPhase({ kind: 'failed', message: friendly(err, 'signIn') });
    }
  };

  useEffect(() => {
    // StrictMode runs effects twice in development; a code is single-use.
    if (started.current) return;
    started.current = true;

    if (!oobCode) {
      setPhase({ kind: 'failed', message: 'This link is incomplete. Copy the whole link from the email, or ask for a new one.' });
      return;
    }
    if (mode === 'resetPassword') {
      verifyPasswordResetCode(auth, oobCode)
        .then((address) => setPhase({ kind: 'password', email: address }))
        .catch((err) => setPhase({ kind: 'failed', message: friendly(err, mode) }));
      return;
    }
    if (mode === 'signIn') {
      if (!isSignInWithEmailLink(auth, signInUrl)) {
        setPhase({ kind: 'failed', message: friendly({ code: 'auth/invalid-action-code' }, mode) });
        return;
      }
      let saved: string | null = null;
      try { saved = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY); } catch { /* private mode */ }
      if (saved) void finishEmailLink(saved);
      else setPhase({ kind: 'confirm-email' });
      return;
    }
    setPhase({ kind: 'failed', message: 'This link is not one we recognise. Ask for a new one from the sign-in page.' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Signed in → hand over to the normal role routing once the session loads.
  useEffect(() => {
    if (phase.kind === 'done' && user && !authLoading) navigate('/', { replace: true });
  }, [phase.kind, user, authLoading, navigate]);

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (phase.kind !== 'password') return;
    setFormError('');
    if (password.length < MIN_PASSWORD) {
      setFormError(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setFormError('The two passwords do not match.');
      return;
    }
    const address = phase.email;
    setPhase({ kind: 'working' });
    try {
      await confirmPasswordReset(auth, oobCode, password);
      await signInWithEmailAndPassword(auth, address, password);
      await registerSession(address);
      setPhase({ kind: 'done' });
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/weak-password') {
        setFormError(friendly(err, mode));
        setPhase({ kind: 'password', email: address });
        return;
      }
      setPhase({ kind: 'failed', message: friendly(err, mode) });
    }
  };

  const title = mode === 'signIn'
    ? 'Signing you in'
    : isSetup ? 'Create your password' : 'Choose a new password';

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 text-ink mb-6">
          <LTMark className="h-9 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Legal Terminus</span>
        </div>

        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>

          {(phase.kind === 'checking' || phase.kind === 'working' || phase.kind === 'done') && (
            <div className="flex items-center gap-2 text-sm text-ink-muted mt-4" role="status">
              <Loader2 className="w-4 h-4 animate-spin" />
              {phase.kind === 'checking' ? 'Checking your link…' : 'Signing you in…'}
            </div>
          )}

          {phase.kind === 'failed' && (
            <>
              <p className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">{phase.message}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-5">
                {mode === 'resetPassword' && (
                  <Link to="/forgot-password" className="btn-primary justify-center">Send a new link</Link>
                )}
                <Link to="/login" className="btn-secondary justify-center">Go to sign in</Link>
              </div>
            </>
          )}

          {phase.kind === 'password' && (
            <form onSubmit={submitPassword} className="mt-4 space-y-4" noValidate>
              <p className="text-sm text-ink-muted">
                {isSetup
                  ? 'Your account is ready. Choose a password for '
                  : 'Choose a new password for '}
                <span className="font-medium text-ink">{phase.email}</span>.
                You will be signed in straight away.
              </p>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-ink mb-1">Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full pr-12"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-ink-muted hover:text-ink"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-ink-muted mt-1">At least {MIN_PASSWORD} characters.</p>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-ink mb-1">Confirm password</label>
                <input
                  id="confirm-password"
                  type={show ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              {formError && <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">{formError}</p>}
              <button type="submit" className="btn-primary w-full justify-center">
                {isSetup ? 'Create password and sign in' : 'Save password and sign in'}
              </button>
            </form>
          )}

          {phase.kind === 'confirm-email' && (
            <form
              onSubmit={(e) => { e.preventDefault(); setFormError(''); void finishEmailLink(email); }}
              className="mt-4 space-y-4"
              noValidate
            >
              <p className="text-sm text-ink-muted">
                You opened this link on a different device or browser from the one you asked on.
                Confirm the email address it was sent to.
              </p>
              <div>
                <label htmlFor="confirm-email" className="block text-sm font-medium text-ink mb-1">Email address</label>
                <input
                  id="confirm-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                  autoFocus
                />
              </div>
              {formError && <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">{formError}</p>}
              <button type="submit" disabled={!/.+@.+\..+/.test(email.trim())} className="btn-primary w-full justify-center disabled:opacity-50">
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
