import { useEffect, useState } from 'react';
import { Copy, Eye, EyeOff, LogIn } from 'lucide-react';
import { revealWorksheetSecret, type WsColumn } from '../../api/worksheets';
import { useToast } from '../common/toastContext';

/**
 * #279 (firm, 11 Nov) — the GST portal password in the GST Return Filing sheet.
 *
 * Masked by default. Staff can show it for a moment, copy it, or "Log in": the
 * password is copied and the GST portal's login page opens in a new tab, ready
 * to paste. A web page cannot fill in another site's login form (the GST portal
 * is a different site, and its login also asks for a captcha), so the
 * spreadsheet's one-click autofill is not possible here. Each use asks the
 * server for this one row's password, and the server records who asked.
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
  const [shown, setShown] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (shown == null) return;
    const t = setTimeout(() => setShown(null), SHOW_FOR_MS);
    return () => clearTimeout(t);
  }, [shown]);

  if (!isSet) return <span className="px-2 text-ink-faint">—</span>;

  const reveal = async (purpose: 'view' | 'copy' | 'login') => {
    setBusy(true);
    try {
      return await revealWorksheetSecret(sheetKey, recordId, column.key, purpose);
    } catch (e) {
      toast.error((e as Error).message || 'Could not get the password.');
      return null;
    } finally {
      setBusy(false);
    }
  };
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  };

  const onShow = async () => {
    if (shown != null) { setShown(null); return; }
    const r = await reveal('view');
    if (r) setShown(r.value);
  };
  const onCopy = async () => {
    const r = await reveal('copy');
    if (!r) return;
    if (await copy(r.value)) toast.success('Password copied.');
    else { setShown(r.value); toast.error('Could not copy — the password is shown instead.'); }
  };
  const onLogin = async () => {
    const r = await reveal('login');
    if (!r) return;
    const copied = await copy(r.value);
    if (!copied) setShown(r.value);
    const opened = window.open(r.loginUrl, '_blank', 'noopener,noreferrer');
    const who = r.userId ? `User ID: ${r.userId}. ` : '';
    toast.success(`${who}${copied ? 'Password copied — paste it on the GST portal.' : 'Copy the password shown in the row.'}${opened ? '' : ' Allow pop-ups to open the GST portal.'}`);
  };

  const btn = `inline-flex items-center justify-center rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink disabled:opacity-40 ${compact ? 'w-8 h-8' : 'w-11 h-11'}`;
  return (
    <div className="flex items-center gap-0.5 px-1">
      <span className="font-mono text-sm text-ink-soft min-w-[5rem]" aria-live="polite">
        {shown != null ? shown : '••••••••'}
      </span>
      <button type="button" className={btn} disabled={busy} onClick={onShow}
        aria-label={shown != null ? `Hide ${column.label}` : `Show ${column.label}`} title={shown != null ? 'Hide' : 'Show'}>
        {shown != null ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button type="button" className={btn} disabled={busy} onClick={onCopy} aria-label={`Copy ${column.label}`} title="Copy">
        <Copy className="w-4 h-4" />
      </button>
      <button type="button" className={btn} disabled={busy} onClick={onLogin} aria-label="Log in to the GST portal" title="Copy the password and open the GST portal">
        <LogIn className="w-4 h-4" />
      </button>
    </div>
  );
}
