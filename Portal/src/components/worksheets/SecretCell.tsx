import { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import { revealWorksheetSecret, type WsColumn } from '../../api/worksheets';
import { useToast } from '../common/toastContext';

/**
 * #279 (firm, 11 Nov) — the GST portal password in the GST Return Filing sheet.
 *
 * Masked. Clicking it copies the password and opens the GST portal's login page
 * in a new tab, ready to paste. A web page cannot fill in another site's login
 * form (the GST portal is a different site, and its login also asks for a
 * captcha), so the spreadsheet's autofill is not possible here. Each click asks
 * the server for this one row's password; it is never in the page before that.
 * Staff change it through the record's Edit form.
 */
const SHOW_FOR_MS = 20_000;

export default function SecretCell({ sheetKey, recordId, column, isSet, compact = false }: {
  sheetKey: string;
  recordId: string;
  column: WsColumn;
  isSet: boolean;
  compact?: boolean;
}) {
  const toast = useToast();
  // Only when the browser refuses to copy: the password is shown for a moment instead.
  const [shown, setShown] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (shown == null) return;
    const t = setTimeout(() => setShown(null), SHOW_FOR_MS);
    return () => clearTimeout(t);
  }, [shown]);

  if (!isSet) return <span className="px-2 text-ink-faint">—</span>;

  const onLogin = async () => {
    setBusy(true);
    try {
      const r = await revealWorksheetSecret(sheetKey, recordId, column.key);
      let copied = true;
      try { await navigator.clipboard.writeText(r.value); } catch { copied = false; }
      if (!copied) setShown(r.value);
      const opened = window.open(r.loginUrl, '_blank', 'noopener,noreferrer');
      const who = r.userId ? `User ID: ${r.userId}. ` : '';
      toast.success(`${who}${copied ? 'Password copied — paste it on the GST portal.' : 'Copy the password shown in the row.'}${opened ? '' : ' Allow pop-ups to open the GST portal.'}`);
    } catch (e) {
      toast.error((e as Error).message || 'Could not get the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onLogin}
      aria-label="Log in to the GST portal"
      title="Copy the password and open the GST portal"
      className={`inline-flex items-center gap-2 rounded-lg px-2 text-left text-ink-soft hover:bg-surface-soft hover:text-ink disabled:opacity-40 ${compact ? 'min-h-8' : 'min-h-11'}`}
    >
      <span className="font-mono text-sm min-w-[5rem]" aria-live="polite">{shown != null ? shown : '••••••••'}</span>
      <LogIn className="w-4 h-4 shrink-0" aria-hidden="true" />
    </button>
  );
}
