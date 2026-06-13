import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { Scale, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ fullName, mobile, businessName }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-surface-card rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink">Account created</h1>
          <p className="mt-2 text-sm text-ink-muted">
            You can now sign in with your email and password.
          </p>
          <Link to="/login" className="btn-primary mt-6 w-full">Go to Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col md:flex-row">
      {/* Left branding panel */}
      <div className="hidden md:flex md:w-1/2 bg-ink flex-col justify-between p-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Legal Terminus</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-white leading-snug">
            Get started<br />in minutes.
          </h2>
          <p className="mt-3 text-sm text-white/50">
            Create your account and start tracking your legal services today.
          </p>
        </div>
        <p className="text-xs text-white/30">© {new Date().getFullYear()} Legal Terminus</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20">
        <div className="flex items-center gap-2.5 mb-10 md:hidden">
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-ink">Legal Terminus</span>
        </div>

        <div className="w-full max-w-sm mx-auto md:mx-0">
          <h1 className="text-2xl font-semibold text-ink">Create account</h1>
          <p className="mt-1 text-sm text-ink-muted">Fill in your details to get started.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="input-label">Full Name <span className="text-red-400">*</span></label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Ankit Sharma" className="input-field" />
            </div>
            <div>
              <label className="input-label">Email <span className="text-red-400">*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="input-label">Password <span className="text-red-400">*</span></label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min. 6 characters" className="input-field" />
            </div>
            <div>
              <label className="input-label">Mobile <span className="text-ink-faint font-normal">(optional)</span></label>
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 98765 43210" className="input-field" />
            </div>
            <div>
              <label className="input-label">Business Name <span className="text-ink-faint font-normal">(optional)</span></label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Pvt Ltd" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-ink hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
