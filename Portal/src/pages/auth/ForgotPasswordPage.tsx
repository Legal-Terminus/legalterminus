import { useState, type FormEvent } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { Scale, AlertCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-ink">Legal Terminus</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-surface-card rounded-full flex items-center justify-center mx-auto mb-5">
              <Mail className="w-6 h-6 text-ink-muted" />
            </div>
            <h1 className="text-xl font-semibold text-ink">Check your email</h1>
            <p className="mt-2 text-sm text-ink-muted">
              We sent a reset link to <span className="font-medium text-ink">{email}</span>.
              The link expires in 1 hour.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="btn-secondary w-full mt-6"
            >
              Try another email
            </button>
            <Link to="/login" className="btn-primary w-full mt-3">Back to Sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-ink">Reset password</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Enter your email and we'll send a reset link.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              <Link to="/login" className="font-medium text-ink hover:underline">Back to Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
