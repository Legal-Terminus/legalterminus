import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, ShieldCheck } from 'lucide-react';
import { saveAdminRemarks, saveAudit } from '../../api/tasks';
import { useToast } from '../common/toastContext';

/**
 * LT #368 / #369 — the admin's review marks on a matter: its audit status and
 * remarks. Shown in the reports and (audit) on the matter page. Staff only:
 * the server never sends either to a client or professional.
 */

export const auditLabel = (s?: string | null) => (s === 'audited' ? 'Audited' : 'Un-audited');

/** LT #368: Audited (green) / Un-audited (neutral). */
export function AuditBadge({ status }: { status?: string | null }) {
  return (
    <span className={status === 'audited' ? 'badge-green' : 'badge-gray'} data-testid="audit-status">
      {auditLabel(status)}
    </span>
  );
}

/** LT #369: the Admin Remarks cell. The admin clicks to edit; Enter or leaving the box saves, Esc cancels. Others read it. */
export function AdminRemarksCell({ taskId, value, canEdit, onSaved }: {
  taskId: string; value: string; canEdit: boolean; onSaved?: () => void;
}) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const save = useMutation({
    mutationFn: (text: string) => saveAdminRemarks(taskId, text),
    onSuccess: () => { setEditing(false); onSaved?.(); },
    onError: (e: Error) => toast.error(e.message || 'Could not save the remarks.'),
  });
  const commit = () => {
    if (draft.trim() === value.trim()) { setEditing(false); return; }
    save.mutate(draft.trim());
  };

  if (!canEdit) return <span className="text-xs text-ink-muted truncate" title={value}>{value || '—'}</span>;
  if (editing) {
    return (
      <input
        autoFocus
        aria-label="Admin remarks"
        className="input-field py-1 text-xs w-full"
        value={draft}
        maxLength={2000}
        disabled={save.isPending}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
      />
    );
  }
  return (
    <button
      type="button"
      className="group flex items-center gap-1 min-h-[32px] w-full text-left text-xs text-ink-muted hover:text-ink"
      aria-label={value ? `Edit admin remarks: ${value}` : 'Add admin remarks'}
      onClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true); }}
    >
      <span className="truncate" title={value}>{value || 'Add remark'}</span>
      <Pencil className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
    </button>
  );
}

/**
 * LT #368: the matter page's audit control. An admin or manager (owner, 28 Nov)
 * marks it Audited (once the payment is fully received) or Un-audited.
 */
export function AuditControl({ taskId, status, auditedByName, auditedAt, fullyPaid, canMark }: {
  taskId: string; status?: string | null; auditedByName?: string | null; auditedAt?: string | null; fullyPaid: boolean; canMark: boolean;
}) {
  const toast = useToast();
  const qc = useQueryClient();
  const audited = status === 'audited';
  const save = useMutation({
    mutationFn: (next: boolean) => saveAudit(taskId, next),
    onSuccess: (r) => {
      toast.success(r.auditStatus === 'audited' ? 'Matter marked Audited.' : 'Matter marked Un-audited.');
      qc.invalidateQueries({ queryKey: ['task', taskId] });
      qc.invalidateQueries({ queryKey: ['task-events', taskId] });
    },
    onError: (e: Error) => toast.error(e.message || 'Could not save the audit status.'),
  });
  const when = auditedAt ? new Date(auditedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="audit-control">
      <AuditBadge status={status} />
      {audited && (auditedByName || when) && (
        <span className="text-xs text-ink-faint">{[auditedByName, when].filter(Boolean).join(' · ')}</span>
      )}
      {canMark && (audited ? (
        <button type="button" className="btn-secondary min-h-[44px] text-sm" disabled={save.isPending} onClick={() => save.mutate(false)}>
          Mark Un-audited
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary min-h-[44px] text-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={save.isPending || !fullyPaid}
          title={fullyPaid ? undefined : 'A matter can be marked Audited only once its payment is fully received.'}
          onClick={() => save.mutate(true)}
        >
          <ShieldCheck className="w-4 h-4" /> Mark Audited
        </button>
      ))}
      {canMark && !audited && !fullyPaid && (
        <span className="text-xs text-ink-faint">Available once the payment is fully received.</span>
      )}
    </div>
  );
}
