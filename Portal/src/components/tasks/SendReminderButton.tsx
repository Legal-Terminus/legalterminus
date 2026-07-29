import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BellRing, Loader2, Check } from 'lucide-react';
import { getReminders, sendReminder, REMINDER_OPTIONS, type ReminderTemplate } from '../../api/reminders';
import { useToast } from '../common/toastContext';

/**
 * #111 — "Send reminder" for staff on a workflow step. Offers the editable
 * reminder templates (gentle → follow-up → urgent) so the team can escalate tone;
 * a reminder may be sent more than once and every send is audited. The wording
 * itself lives in Settings → Email Templates, so admins change it without code.
 */
export default function SendReminderButton({ taskId, stepNumber }: {
  taskId: string;
  stepNumber?: number | null;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  // #111: the menu is rendered FIXED (not absolutely inside this component), because
  // the hero card that hosts this button is `overflow-hidden` for its rounded edge —
  // an absolutely-positioned dropdown was CLIPPED by that card, so the reminder
  // options never appeared. A fixed menu anchored to the button escapes the clip.
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const MENU_W = 240;
  const openMenu = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setMenuPos({ top: r.bottom + 4, left: Math.max(8, r.right - MENU_W) });
    setOpen(true);
  };

  const { data: history = [] } = useQuery({
    queryKey: ['reminders', taskId],
    queryFn: () => getReminders(taskId),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    // Any scroll/resize would detach the fixed menu from the button → just close it.
    const close = () => setOpen(false);
    document.addEventListener('mousedown', h);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', h);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const send = useMutation({
    mutationFn: (template: ReminderTemplate) => sendReminder(taskId, template, stepNumber ?? null),
    onSuccess: (r) => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['reminders', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      toast.success(r.emailed
        ? 'Reminder sent to the client.'
        : 'Reminder recorded (email is disabled in this environment).');
    },
    onError: (e: Error) => toast.error(e.message || 'Could not send the reminder.'),
  });

  const last = history[0];
  const lastLabel = last?.at
    ? `Last reminder ${new Date(last.at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        disabled={send.isPending}
        className="btn-secondary py-1.5 px-3 text-xs w-full inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
        title={lastLabel ?? 'Send a reminder email to the client'}
      >
        {send.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BellRing className="w-3.5 h-3.5" />}
        Send reminder
      </button>

      {/* Count of previous sends — makes repeat chasing visible at a glance. */}
      {history.length > 0 && (
        <p className="text-[10px] text-ink-faint mt-1 text-center">
          {history.length} sent{lastLabel ? ` · ${lastLabel.replace('Last reminder ', '')}` : ''}
        </p>
      )}

      {open && menuPos && (
        <div
          className="fixed z-50 w-60 bg-white border border-hairline rounded-lg shadow-card py-1"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Choose a reminder
          </p>
          {REMINDER_OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => send.mutate(o.key)}
              disabled={send.isPending}
              className="w-full text-left px-3 py-2 hover:bg-surface-soft transition-colors disabled:opacity-50"
            >
              <span className="block text-sm text-ink">{o.label}</span>
              <span className="block text-[11px] text-ink-muted">{o.hint}</span>
            </button>
          ))}
          <p className="px-3 pt-1.5 pb-1 text-[10px] text-ink-faint border-t border-hairline mt-1 inline-flex items-start gap-1">
            <Check className="w-3 h-3 mt-0.5 shrink-0" />
            Wording is editable in Settings → Email Templates.
          </p>
        </div>
      )}
    </div>
  );
}
