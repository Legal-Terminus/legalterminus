import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Users } from 'lucide-react';
import { getInternalReminders, sendInternalReminder } from '../../api/reminders';
import { useToast } from '../common/toastContext';

/**
 * #198 — "Send internal reminder": nudges whoever on the team owns this step
 * (every assignee, when there are several). Separate from the client reminder in
 * every way: its own history, template and cooldown. Recipients are resolved on
 * the server from the step's assignment; this only names the step.
 *
 * The popover is FIXED for the same reason as SendReminderButton: the hero card
 * is `overflow-hidden`, which would clip an absolutely-positioned one.
 */
export default function SendInternalReminderButton({ taskId, stepNumber, assigneeNames }: {
  taskId: string;
  stepNumber: number;
  /** Who will receive it — shown before sending. */
  assigneeNames: string[];
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const W = 280;
  const H = 190; // popover height, near enough to decide which side it fits
  const openMenu = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      // The button sits low in the step's side rail: open UPWARD when there is
      // no room below, or the Send button lands off-screen.
      const below = r.bottom + 4;
      const top = below + H > window.innerHeight ? Math.max(8, r.top - H - 4) : below;
      setPos({ top, left: Math.max(8, Math.min(window.innerWidth - W - 8, r.right - W)) });
    }
    setOpen(true);
  };

  const { data: history = [] } = useQuery({
    queryKey: ['internal-reminders', taskId],
    queryFn: () => getInternalReminders(taskId),
    staleTime: 30_000,
  });
  const forStep = history.filter((h) => h.stepNumber === stepNumber);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const close = () => setOpen(false);
    document.addEventListener('mousedown', h);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', h);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const send = useMutation({
    mutationFn: () => sendInternalReminder(taskId, stepNumber, note.trim() || undefined),
    onSuccess: (r) => {
      setOpen(false);
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['internal-reminders', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      toast.success(`Reminder sent to ${r.recipients.join(', ')}.`);
    },
    onError: (e: Error) => toast.error(e.message || 'Could not send the reminder.'),
  });

  const last = forStep[0];
  const lastLabel = last?.at
    ? new Date(last.at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        disabled={send.isPending}
        className="btn-secondary py-1.5 px-3 text-xs w-full inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
        title="Remind the team member(s) assigned to this step"
      >
        {send.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Users className="w-3.5 h-3.5" />}
        Send internal reminder
      </button>

      {forStep.length > 0 && (
        <p className="text-[10px] text-ink-muted mt-1 text-center" title={last ? `Last to ${last.recipients.join(', ')}` : undefined}>
          {forStep.length} sent{lastLabel ? ` · ${lastLabel}` : ''}
        </p>
      )}

      {open && pos && (
        <div
          role="dialog"
          aria-label="Send internal reminder"
          className="fixed z-50 bg-white border border-hairline rounded-lg shadow-card p-3 space-y-2"
          style={{ top: pos.top, left: pos.left, width: W }}
        >
          <p className="text-xs text-ink-muted">
            To: <span className="text-ink font-medium">{assigneeNames.length ? assigneeNames.join(', ') : 'the step’s assignees'}</span>
          </p>
          <textarea
            aria-label="Reminder note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Add a note (optional)"
            className="input-field w-full resize-y text-sm"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="btn-secondary py-1.5 px-3 text-xs">Cancel</button>
            <button onClick={() => send.mutate()} disabled={send.isPending} className="btn-primary py-1.5 px-3 text-xs disabled:opacity-50">
              {send.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
