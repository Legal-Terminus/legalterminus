import { useState, type FormEvent } from 'react';
import { requestPasswordReset } from '../../api/account';
import { Link } from 'react-router-dom';
import { AlertCircle, Mail } from 'lucide-react';
import { LTMark } from '../../components/common/LTLogo';

/**
 * #203: the request goes to our backend, not to Firebase's client SDK, so the
 * email is ours (branded, with a button) and its link opens the portal's
 * /account/action page instead of Firebase's hosted one.
 *
 * The answer is identical whether or not the address has an account, so the
 * confirmation must say "if" — it cannot know, and must not pretend to.
 */
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
      await requestPasswordReset(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      setError(status === 400
        ? 'That email address does not look right.'
        : 'Could not send the reset email. Check your connection and try again.');
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
            <LTMark className="h-7 w-auto text-white" />
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
              If <span className="font-medium text-ink">{email}</span> has an account, a link to
              choose a new password is on its way. It works once and expires after an hour.
              Nothing arrived? Check spam, or ask us to send you a sign-in link.
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
              <div role="alert" className="mt-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="reset-email" className="input-label">Email</label>
                <input
                  id="reset-email"
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
