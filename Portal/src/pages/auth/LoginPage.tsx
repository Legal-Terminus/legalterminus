import { useState } from 'react';
import type { FormEvent } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../api/client';
import { Scale, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Register/sync user in Firestore with provider='email'
      const idToken = await userCredential.user.getIdToken();
      try {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ 
            fullName: userCredential.user.displayName || email,
            provider: 'email',  // ← Track email signin
          }),
        });
      } catch (regErr) {
        console.error('Registration error:', regErr);
        // Continue anyway - auth listener will handle redirect
      }
      
      // Auth listener will now read role from Firestore and trigger redirect
    } catch (err) {
      console.error('Email sign-in error:', err);
      let msg = 'Sign-in failed. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('invalid-credential') || err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
          msg = 'Invalid email or password. Please try again.';
        } else if (err.message.includes('too-many-requests')) {
          msg = 'Too many failed login attempts. Please try again later.';
        } else {
          msg = err.message;
        }
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
      
      // Register/sync Google user in Firestore with provider='google'
      // Scenario 2 & 3: If admin created this user by email, it will be synced and role preserved
      try {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ 
            fullName: userCredential.user.displayName || userCredential.user.email,
            provider: 'google',  // ← Track Google signin
          }),
        });
      } catch (err) {
        console.error('Registration error:', err);
        // Continue anyway - auth listener will handle redirect
      }
      
      // Auth listener will read role from Firestore and trigger redirect
    } catch (err) {
      console.error('Google sign-in error:', err);
      let msg = 'Google sign-in failed. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('popup-closed') || err.message.includes('cancelled')) {
          msg = 'Sign-in was cancelled. Please try again.';
        } else if (err.message.includes('account-exists-with-different-credential')) {
          msg = 'This email is already registered with a different sign-in method.';
        } else if (err.message.includes('auth/popup-blocked')) {
          msg = 'Sign-in popup was blocked. Please allow popups and try again.';
        } else {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  if (role) {
    const destinations: Record<string, string> = {
      admin: '/admin',
      manager: '/manager',
      team_member: '/team',
      client: '/client',
    };
    navigate(destinations[role] ?? '/client');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-brand-100/50 border border-gray-100 p-8">
          {/* Logo & heading */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Legal Terminus</h1>
            <p className="text-sm text-gray-500 mt-1">Workflow Management Portal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-3"
            >
              {loading ? 'Signing in…' : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-secondary w-full py-3"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
