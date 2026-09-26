import { useMutation } from '@tanstack/react-query';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { sendSignInLink } from '../../api/users';

/**
 * #203 — email a person a one-time link that signs them straight in.
 *
 * For the client who cannot use Google and is stuck on a password: staff help
 * in one click without ever seeing, setting or reading out a password. The
 * backend decides the kind of link (passwordless, or "choose a password" where
 * passwordless is switched off) and the toast says which went out.
 */
export default function SendSignInLinkButton({
  uid,
  email,
  compact = false,
}: {
  uid: string;
  email?: string;
  /** Icon-only, for a row inside a list. */
  compact?: boolean;
}) {
  const toast = useToast();
  const send = useMutation({
    mutationFn: () => sendSignInLink(uid),
    onSuccess: (r) => {
      if (!r.sent) {
        toast.error('Email is not set up for this workspace, so the link could not be sent.');
        return;
      }
      toast.success(r.method === 'link'
        ? `Sign-in link sent to ${r.email}. It works once.`
        : `Link sent to ${r.email}. They will choose a password and be signed in.`);
    },
    onError: (err: Error) => toast.error(err.message || 'Could not send the sign-in link.'),
  });

  const label = email ? `Send sign-in link to ${email}` : 'Send sign-in link';

  if (compact) {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        disabled={send.isPending}
        onClick={() => send.mutate()}
        className="inline-flex items-center justify-center w-11 h-11 -my-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-soft shrink-0 disabled:opacity-50"
      >
        {send.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={send.isPending}
      onClick={() => send.mutate()}
      className="btn-secondary inline-flex items-center gap-1.5 disabled:opacity-50"
    >
      {send.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      <span className="hidden sm:inline">Send sign-in link</span>
    </button>
  );
}
