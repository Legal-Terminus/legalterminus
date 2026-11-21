import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import {
  startGoogleSignIn, finishGoogleRedirect, authErrorCode, googleSignInMessage, UNSUPPORTED_BROWSER_MESSAGE,
} from '../../lib/googleSignIn';
import { startAppleSignIn, appleSignInAvailable, appleSignInMessage } from '../../lib/appleSignIn';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { apiFetch, type ApiError } from '../../api/client';
import { AlertCircle, Mail } from 'lucide-react';
import { requestSignInLink, EMAIL_FOR_SIGN_IN_KEY } from '../../api/account';
import { LTMark, LTLockup } from '../../components/common/LTLogo';
import { GoogleTermsNote } from '../../components/auth/PasswordChecklist';

/** Set just before leaving for Google, so the return is recognised (#213). */
const GOOGLE_RETURN_KEY = 'lt.googleSignInReturning';

/** True when this page load is the return leg of a Google redirect sign-in. */
const isReturningFromGoogle = () => {
  try { return window.sessionStorage.getItem(GOOGLE_RETURN_KEY) === '1'; } catch { return false; }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // #213: coming back from Google, the form starts as "Signing in…" rather than
  // looking, for a moment, as if nothing had happened.
  const [loading, setLoading] = useState(isReturningFromGoogle);
  const [linkSentTo, setLinkSentTo] = useState('');
  const navigate = useNavigate();
  // E29-S08: shown once after a deletion request signed the person out.
  const [params] = useSearchParams();
  const deletionRequested = params.get('notice') === 'deletion-requested';
  const showApple = appleSignInAvailable();

  /**
   * #203 — passwordless: email a one-time link that signs the person in. For
   * clients who do not use Google and do not want (or keep losing) a password.
   * The server answers the same for any address, so the confirmation says "if".
   */
  const handleEmailLink = async () => {
    setError('');
    setLinkSentTo('');
    const address = email.trim().toLowerCase();
    if (!/.+@.+\..+/.test(address)) {
      setError('Enter your email address above, then ask for a sign-in link.');
      document.getElementById('login-email')?.focus();
      return;
    }
    setLoading(true);
    try {
      await requestSignInLink(address);
      // Lets the link, opened on this device, finish without asking again.
      try { window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, address); } catch { /* private mode */ }
      setLinkSentTo(address);
    } catch {
      setError('Could not send the sign-in link. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      try {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ fullName: userCredential.user.displayName || email, provider: 'email' }),
        });
      } catch (regErr) {
        console.error('Registration error:', regErr);
      }
      navigate('/');
    } catch (err) {
      let msg = 'Sign-in failed. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('invalid-credential') || err.message.includes('user-not-found') || err.message.includes('wrong-password'))
          msg = 'Invalid email or password.';
        // E29-S08: an account whose deletion was requested is disabled.
        else if (err.message.includes('user-disabled'))
          msg = 'This account has been disabled. Contact your firm.';
        else if (err.message.includes('too-many-requests'))
          msg = 'Too many attempts. Try again later.';
        else msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Make sure the Google or Apple account has a portal profile, then go in.
   * E29-S11: Apple sends the name on the first sign-in only, so `name` is passed here.
   */
  const completeProviderSignIn = async (user: User, provider: 'google' | 'apple' = 'google', name?: string | null) => {
    const idToken = await user.getIdToken();
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
        // #35: the agreement line sits under the Google and Apple buttons.
        body: JSON.stringify({ fullName: name || user.displayName || user.email, provider, termsAccepted: true }),
      });
    } catch (err) {
      // The server refuses accounts this deployment does not accept (QA takes only test accounts,
      // production refuses test accounts). Do not leave that person half signed in: sign out and
      // say why. Any other registration failure keeps the old behaviour (carry on).
      const body = (err as ApiError).body as { code?: string } | undefined;
      if ((err as ApiError).status === 403 && (body?.code === 'TEST_ENVIRONMENT' || body?.code === 'TEST_ACCOUNT')) {
        await signOut(auth).catch(() => undefined);
        setError((err as ApiError).message);
        return;
      }
      console.error('Registration error:', err);
    }
    navigate('/');
  };

  /** #213: say what happened, and keep the real code for whoever investigates. */
  const reportGoogleError = (err: unknown) => {
    const code = authErrorCode(err);
    console.error('[google-sign-in]', code, err);
    const msg = googleSignInMessage(code);
    if (msg) setError(msg);
  };

  // #213: on a phone Google sign-in leaves this page and comes back. Finish it
  // here. `GOOGLE_RETURN_KEY` is set just before leaving, so the form shows
  // "Signing in…" on the way back instead of looking as if nothing happened.
  useEffect(() => {
    const returning = isReturningFromGoogle();
    let cancelled = false;
    finishGoogleRedirect(auth)
      .then(async (result) => {
        if (cancelled) return;
        if (result?.user) await completeProviderSignIn(result.user);
        else if (returning) setError('Google sign-in did not complete. Please try again, or use "Email me a sign-in link".');
      })
      .catch((err) => { if (!cancelled) reportGoogleError(err); })
      .finally(() => {
        try { window.sessionStorage.removeItem(GOOGLE_RETURN_KEY); } catch { /* private mode */ }
        if (!cancelled && returning) setLoading(false);
      });
    return () => { cancelled = true; };
    // Runs once: it reads the result of a sign-in that started before this page loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      try { window.sessionStorage.setItem(GOOGLE_RETURN_KEY, '1'); } catch { /* private mode */ }
      const result = await startGoogleSignIn(auth);
      if (result === 'redirecting') return; // leaving for Google — stay "loading"
      try { window.sessionStorage.removeItem(GOOGLE_RETURN_KEY); } catch { /* private mode */ }
      if (result === 'unsupported') {
        setError(UNSUPPORTED_BROWSER_MESSAGE);
        setLoading(false);
        return;
      }
      await completeProviderSignIn(result.user);
      setLoading(false);
    } catch (err) {
      try { window.sessionStorage.removeItem(GOOGLE_RETURN_KEY); } catch { /* private mode */ }
      reportGoogleError(err);
      setLoading(false);
    }
  };

  /** E29-S11: Sign in with Apple (the iPhone app always; the website when switched on). */
  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { result, name } = await startAppleSignIn(auth);
      await completeProviderSignIn(result.user, 'apple', name);
    } catch (err) {
      const code = authErrorCode(err);
      console.error('[apple-sign-in]', code, err);
      const msg = appleSignInMessage(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-safe-page min-h-dvh bg-white flex flex-col md:flex-row">
      {/* Left panel — branding (desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-ink flex-col justify-between p-10">
        {/* #110: on this DARK panel we use the vector mark plus live text rather
            than the raster lockup. The lockup's "TERMINUS" is black, and
            recolouring a flattened PNG to white wrecks the anti-aliased edges —
            the mark is true vector and adapts cleanly via currentColor. */}
        <div className="flex items-center gap-3 text-white">
          <LTMark className="h-11 w-auto shrink-0" />
          <span className="text-lg font-semibold tracking-tight text-white">Legal Terminus</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-white leading-snug">
            Your workflow,<br />streamlined.
          </h2>
          <p className="mt-3 text-sm text-white/50">
            Manage incorporation tasks, documents, and client communication — all in one place.
          </p>
        </div>
        <p className="text-xs text-white/30">© {new Date().getFullYear()} Legal Terminus</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20">
        {/* Mobile logo */}
        <div className="mb-10 md:hidden">
          <LTLockup className="h-10" />
        </div>

        <div className="w-full max-w-sm mx-auto md:mx-0">
          <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-muted">Welcome back — enter your details below.</p>

          {deletionRequested && (
            <div role="status" className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-3.5 text-sm text-blue-800">
              Your deletion request was received. The firm will delete your account within 30 days
              and email you when it is done.
            </div>
          )}

          {linkSentTo && (
            <div role="status" className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-3.5 text-sm text-blue-800">
              If <span className="font-medium">{linkSentTo}</span> has an account, a sign-in link is on
              its way. Open it on this device — it works once and expires after a few hours.
            </div>
          )}

          {error && (
            <div role="alert" className="mt-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="login-email" className="input-label">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0!">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-ink-muted hover:text-ink transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-hairline" />
            <span className="text-xs text-ink-faint uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-hairline" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-secondary w-full py-2.5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          {showApple && (
            <>
              {/* Apple's Human Interface Guidelines: black button, Apple logo, "Sign in with Apple". */}
              <p className="mt-4 text-xs text-ink-muted">
                Use the email your firm has for you — a hidden email creates a new account.
              </p>
              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={loading}
                className="mt-2 w-full min-h-11 py-2.5 rounded-lg bg-black text-white text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                </svg>
                Sign in with Apple
              </button>
            </>
          )}
          <GoogleTermsNote withApple={showApple} />

          <button
            type="button"
            onClick={handleEmailLink}
            disabled={loading}
            className="btn-secondary w-full py-2.5 mt-3"
          >
            <Mail className="w-4 h-4 shrink-0" />
            Email me a sign-in link
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-ink hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
