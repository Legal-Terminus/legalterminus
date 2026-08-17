import { useState } from 'react';
import type { FormEvent } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { AlertCircle } from 'lucide-react';
import { LTMark, LTLockup } from '../../components/common/LTLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        else if (err.message.includes('too-many-requests'))
          msg = 'Too many attempts. Try again later.';
        else msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      try {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({
            fullName: userCredential.user.displayName || userCredential.user.email,
            provider: 'google',
          }),
        });
      } catch (err) {
        console.error('Registration error:', err);
      }
      navigate('/');
    } catch (err) {
      let msg = 'Google sign-in failed.';
      if (err instanceof Error) {
        if (err.message.includes('popup-closed') || err.message.includes('cancelled'))
          msg = 'Sign-in cancelled.';
        else if (err.message.includes('popup-blocked'))
          msg = 'Popup blocked — please allow popups and try again.';
        else msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col md:flex-row">
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

          {error && (
            <div className="mt-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input
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
                <label className="input-label !mb-0">Password</label>
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

          <p className="mt-6 text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-ink hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
