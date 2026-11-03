import { useState } from 'react';
import { retryRole } from '../../hooks/useAuth';

/**
 * Shown when the user is signed in but their role could not be read (no
 * connection). Better than guessing a role: showing an Admin the Client screens
 * looked like the account had changed.
 */
export default function RoleUnavailable() {
  const [busy, setBusy] = useState(false);
  const retry = async () => {
    setBusy(true);
    try { await retryRole(); } finally { setBusy(false); }
  };
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center bg-white">
      <h1 className="text-xl font-semibold text-ink">We can&apos;t load your account</h1>
      <p className="text-sm text-ink-muted max-w-xs">
        Check your internet connection and try again. You are still signed in.
      </p>
      <button type="button" onClick={retry} disabled={busy} className="btn-primary min-h-11 px-6">
        {busy ? 'Trying…' : 'Try again'}
      </button>
    </div>
  );
}
