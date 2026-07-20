import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, CheckCircle2, Circle, CircleSlash, Loader2, PlayCircle,
  CreditCard, ShieldCheck, ThumbsUp, ThumbsDown, Landmark, GitBranch,
  ListChecks, FileText, IndianRupee, Paperclip, MessageSquare, Briefcase, Eye, EyeOff,
  ChevronRight, ChevronDown, Flame, Ban, Archive, RotateCcw, Check,
  ChevronsLeft, ChevronsRight, MoreVertical, Users,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import DocumentsPanel from '../../components/documents/DocumentsPanel';
import DiscussionPanel from '../../components/messages/DiscussionPanel';
import SendReminderButton from '../../components/tasks/SendReminderButton';
import RichTextEditor from '../../components/common/RichTextEditor';
import RichText from '../../components/common/RichText';
import { getDocuments, openDocument, type TaskDocument } from '../../api/documents';
import { useAuthStore } from '../../store/authStore';
import { getTask, advanceTask, assignStep, assignMatter, getTaskEvents, approveTask, rejectTask, stopTask, restartTask, archiveTask, updatePayment, setMatterProfessional, setTaskUrgent, setStepUrgent, type WorkflowEventInput, type TaskEvent } from '../../api/tasks';
import { useConfirm } from '../../components/common/confirmContext';
import { useCommentDraft, draftSavedLabel } from '../../hooks/useCommentDraft';
import { useRail, type RailState } from '../../hooks/useResizablePanels';
import { getAllUsers, displayName, type PortalUser } from '../../api/users';
import { getWorkflowDefinition, phaseProgress, deriveOwnerType, type WorkflowStepDef, type WorkflowDefinition } from '../../api/workflowDefinitions';
import type { Task, TaskStep, StepStatus, PaymentStatus } from '../../types/task';

type TabKey = 'steps' | 'documents' | 'payments' | 'discussion';

/**
 * Task detail. Staff see an operational view (per-step actions). Clients see their
 * purchased service's progress in a limited, service-framed 3-tab layout
 * (Steps / Documents / Payments) — no internal detail, actions only on their own
 * steps. Step titles + descriptions come from the (pinned) workflow definition.
 */
export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const role = useAuthStore((s) => s.role);
  const currentUserUid = useAuthStore((s) => s.user?.uid ?? null);
  const isStaff = role === 'admin' || role === 'manager' || role === 'team_member';
  const isClient = role === 'client';
  const [tab, setTab] = useState<TabKey>('steps');

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(taskId!),
    enabled: !!taskId,
    // Live-ish: poll so a step advanced by another role (admin↔client) shows up
    // here without a manual refresh; focus-refetch covers tab switching.
    staleTime: 5_000,
    refetchInterval: 10_000,
  });

  const { data: definition } = useQuery({
    queryKey: ['workflow-definition', task?.workflowDefinitionId],
    queryFn: () => getWorkflowDefinition(task!.workflowDefinitionId!),
    enabled: !!task?.workflowDefinitionId,
  });

  // Activity thread (real events). Polls so it reflects actions from other roles.
  const { data: events = [] } = useQuery({
    queryKey: ['task-events', taskId],
    queryFn: () => getTaskEvents(taskId!),
    enabled: !!taskId,
    staleTime: 5_000,
    refetchInterval: 10_000,
  });

  // Documents (per-step attachments). Server scopes to the matter + role, so the
  // client only ever sees what they're allowed to.
  const { data: documents = [] } = useQuery({
    queryKey: ['task-documents', taskId],
    queryFn: () => getDocuments(taskId!),
    enabled: !!taskId,
    staleTime: 10_000,
  });

  const advance = useMutation({
    mutationFn: (event: WorkflowEventInput) => advanceTask(taskId!, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not advance the task.'),
  });

  // Step assignment is an admin/manager action; team members can't reassign.
  const canAssign = role === 'admin' || role === 'manager';
  const { data: staff = [] } = useQuery({
    queryKey: ['portalUsers', 'staff'],
    queryFn: getAllUsers,
    enabled: canAssign,
    select: (users: PortalUser[]) => users.filter((u) => u.role !== 'client'),
    staleTime: 60_000,
  });

  const assign = useMutation({
    mutationFn: ({ stepNumber, assignedTo }: { stepNumber: number; assignedTo: string | null }) =>
      assignStep(taskId!, stepNumber, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['my-steps'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not assign this step.'),
  });

  const assignOwner = useMutation({
    mutationFn: (assignedTo: string | null) => assignMatter(taskId!, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-steps'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not assign this matter.'),
  });

  // #85: set/clear the handling professional. Admin/manager or the matter's
  // assigned member (backend enforces). Snapshot name refreshed on the task read.
  const assignProfessional = useMutation({
    mutationFn: (professionalUid: string | null) => setMatterProfessional(taskId!, professionalUid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not update the professional.'),
  });

  // Urgent flag (E03-S05 UI / Issue 3): admin/manager can flag the whole matter
  // or just the current step. Effective urgency surfaces in My Tasks + dashboard.
  const invalidateTaskViews = () => {
    queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['my-steps'] });
  };
  const toggleMatterUrgent = useMutation({
    mutationFn: (next: boolean) => setTaskUrgent(taskId!, next),
    onSuccess: invalidateTaskViews,
    onError: (err: Error) => toast.error(err.message || 'Could not update urgency.'),
  });
  const toggleStepUrgent = useMutation({
    mutationFn: ({ stepNumber, next }: { stepNumber: number; next: boolean }) =>
      setStepUrgent(taskId!, String(stepNumber), next),
    onSuccess: invalidateTaskViews,
    onError: (err: Error) => toast.error(err.message || 'Could not update step urgency.'),
  });

  // Approval chain (E03-S04). Only admins approve/reject; the controls show only
  // while the matter is `pending_admin_approval`.
  const approve = useMutation({
    mutationFn: () => approveTask(taskId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-steps'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not approve this matter.'),
  });
  const reject = useMutation({
    mutationFn: (reason: string) => rejectTask(taskId!, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not reject this matter.'),
  });

  // Stop/cancel an in-flight matter when a client discontinues (GitHub #41).
  // Staff-only; reason captured via a small inline composer (see StopMatterBanner).
  const [stopping, setStopping] = useState(false);
  const stop = useMutation({
    mutationFn: (reason: string) => stopTask(taskId!, reason),
    onSuccess: () => {
      setStopping(false);
      toast.success('Matter stopped.');
      invalidateTaskViews();
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not stop this matter.'),
  });

  // Restart a stopped matter (GitHub #71). Admin-only; resumes from the saved
  // current step. Confirmed via dialog since it puts the matter back in worklists.
  const restart = useMutation({
    mutationFn: () => restartTask(taskId!),
    onSuccess: () => {
      toast.success('Matter restarted.');
      invalidateTaskViews();
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not restart this matter.'),
  });
  const onRestart = async () => {
    const ok = await confirm({
      title: 'Restart this matter?',
      message: 'It will resume from where it was stopped and return to active worklists. Its full history is kept.',
      confirmLabel: 'Restart',
    });
    if (ok) restart.mutate();
  };

  // Archive — non-destructive alternative to delete (staff). Confirmed via dialog.
  const archive = useMutation({
    mutationFn: () => archiveTask(taskId!),
    onSuccess: () => {
      toast.success('Matter archived.');
      invalidateTaskViews();
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not archive this matter.'),
  });
  const onArchive = async () => {
    const ok = await confirm({
      title: 'Archive this matter?',
      message: 'It will be removed from active lists but its history and documents are kept. Only an admin can permanently delete a matter.',
      confirmLabel: 'Archive',
    });
    if (ok) archive.mutate();
  };

  const noun = isClient ? 'Service' : 'Matter';

  if (isLoading) {
    return (
      <PageShell title={noun}><LoadingCard /></PageShell>
    );
  }
  if (error || !task) {
    return (
      <PageShell title={noun}>
        <div className="card p-12 text-center text-sm text-red-600">
          Failed to load this {noun.toLowerCase()}. {(error as Error)?.message}
        </div>
      </PageShell>
    );
  }

  const total = task.totalSteps ?? task.steps?.length ?? 0;
  const completed = task.status === 'completed';
  // #66: show the current step by its 1,2,3… display POSITION, not the raw
  // stepNumber (which can have gaps from deleted steps). Same position rule the
  // step list uses (displayNumberOf, #55) — just applied to the subtitle too.
  const orderedNums = [...(task.steps ?? [])].sort((a, b) => a.stepNumber - b.stepNumber).map((s) => s.stepNumber);
  const currentDisplayNum = orderedNums.indexOf(task.currentStepNumber) + 1;
  const progressLabel = completed
    ? `Completed · ${total} of ${total}`
    : `Step ${currentDisplayNum > 0 ? currentDisplayNum : task.currentStepNumber} of ${total}`;
  const stepDefs = definition?.steps ?? [];
  const currentDef = stepDefs.find((s) => s.stepNumber === task.currentStepNumber);

  const TABS: { key: TabKey; label: string; icon: typeof ListChecks }[] = [
    { key: 'steps', label: 'Steps', icon: ListChecks },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'payments', label: 'Payments', icon: IndianRupee },
    // #123: per-matter discussion thread (client + internal team).
    { key: 'discussion', label: 'Discussion', icon: MessageSquare },
  ];

  return (
    <PageShell
      title={task.serviceName || task.workflowType}
      // #118: show the matter's ORGANISATION next to the client name — a client can
      // have several matters under different organisations, so the name alone is
      // ambiguous. Clients see it too (they may hold matters for multiple orgs).
      subtitle={[
        ...(isClient ? [] : [task.clientName]),
        task.organisation,
        progressLabel,
        ...(isClient ? [] : [task.status]),
      ].filter(Boolean).join(' · ')}
      back={
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      }
      action={
        canAssign ? (
          <div className="flex items-center gap-1.5">
            {/* Matter-level Urgent flame (Issue 3). Filled red = urgent. */}
            <button
              onClick={() => toggleMatterUrgent.mutate(!task.isUrgent)}
              disabled={toggleMatterUrgent.isPending}
              aria-pressed={!!task.isUrgent}
              title={task.isUrgent ? 'Urgent — click to clear' : 'Mark matter urgent'}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                task.isUrgent
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'text-ink-faint hover:text-ink hover:bg-surface-soft'
              }`}
            >
              <Flame className="w-[18px] h-[18px]" fill={task.isUrgent ? 'currentColor' : 'none'} />
            </button>
            {/* Matter owner — assigns the WHOLE matter (all steps) to one user. */}
            <label className="flex items-center gap-2">
              <span className="text-xs text-ink-muted shrink-0 hidden sm:inline">Matter owner</span>
              <span className="relative inline-flex items-center">
                <select
                  aria-label="Matter owner"
                  className="input-field py-1.5 pr-8 text-sm max-w-[140px]"
                  value={task.assignedTo ?? ''}
                  disabled={assignOwner.isPending}
                  onChange={(e) => assignOwner.mutate(e.target.value || null)}
                >
                  <option value="">Unassigned</option>
                  {staff.map((u) => (
                    <option key={u.uid} value={u.uid}>{displayName(u)}</option>
                  ))}
                </select>
                {assignOwner.isPending && <Loader2 className="w-4 h-4 animate-spin text-ink-faint absolute right-2" />}
              </span>
            </label>
            {/* Professional (#85) — the handling staff member. */}
            <label className="flex items-center gap-2">
              <span className="text-xs text-ink-muted shrink-0 hidden sm:inline">Professional</span>
              <span className="relative inline-flex items-center">
                <select
                  aria-label="Professional"
                  className="input-field py-1.5 pr-8 text-sm max-w-[140px]"
                  value={task.professionalUid ?? ''}
                  disabled={assignProfessional.isPending}
                  onChange={(e) => assignProfessional.mutate(e.target.value || null)}
                >
                  <option value="">None</option>
                  {staff.map((u) => (
                    <option key={u.uid} value={u.uid}>{displayName(u)}</option>
                  ))}
                </select>
                {assignProfessional.isPending && <Loader2 className="w-4 h-4 animate-spin text-ink-faint absolute right-2" />}
              </span>
            </label>
            {/* ⋮ kebab menu — Archive (any live/completed matter) + Stop workflow
                (in-progress only). Admin-only. */}
            {role === 'admin' && (task.status === 'active' || task.status === 'pending' || task.status === 'completed') && (
              <MatterActionsMenu
                archiving={archive.isPending}
                onArchive={onArchive}
                onStop={() => setStopping(true)}
                canStop={task.status === 'active' || task.status === 'pending'}
              />
            )}
          </div>
        ) : undefined
      }
    >
      {/* Approval chain (E03-S04): a matter created by a manager waits for admin
          approval before any work can start. Admins act here; everyone else sees
          the waiting state. A rejected matter shows the reason. */}
      {task.status === 'pending_admin_approval' && (
        <ApprovalBanner
          isAdmin={role === 'admin'}
          approving={approve.isPending}
          rejecting={reject.isPending}
          onApprove={() => approve.mutate()}
          onReject={(reason) => reject.mutate(reason)}
        />
      )}
      {task.status === 'rejected' && (
        <div className="card p-4 mb-4 border-red-200 bg-red-50/60">
          <div className="flex items-start gap-2.5">
            <ThumbsDown className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800">This matter was rejected</p>
              {task.rejectionReason && (
                <p className="text-sm text-red-700 mt-0.5">{task.rejectionReason}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stopped/cancelled banner (#41) — reason + admin-only Restart (#71). */}
      {task.status === 'cancelled' && (
        <div className="card p-4 mb-4 border-red-200 bg-red-50/60">
          <div className="flex items-start gap-2.5">
            <Ban className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-800">This matter was stopped</p>
              {task.cancelledReason && <p className="text-sm text-red-700 mt-0.5">{task.cancelledReason}</p>}
            </div>
            {role === 'admin' && (
              <button
                onClick={onRestart}
                disabled={restart.isPending}
                className="btn-secondary shrink-0 inline-flex items-center gap-1.5 text-sm"
              >
                {restart.isPending
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <RotateCcw className="w-4 h-4" />}
                Restart workflow
              </button>
            )}
          </div>
        </div>
      )}

      {/* Archived banner — non-destructive terminal state. */}
      {task.status === 'archived' && (
        <div className="card p-4 mb-4 border-hairline bg-surface-soft">
          <div className="flex items-start gap-2.5">
            <Archive className="w-4 h-4 text-ink-muted mt-0.5 shrink-0" />
            <p className="text-sm font-semibold text-ink-soft">This matter is archived. Only an admin can permanently delete it.</p>
          </div>
        </div>
      )}

      {/* Stop confirmation form — only shown when admin clicks Stop workflow in the header. */}
      {stopping && (
        <StopMatterBanner
          pending={stop.isPending}
          onCancel={() => setStopping(false)}
          onStop={(reason) => stop.mutate(reason)}
        />
      )}

      {/* Tabs — underline style */}
      <div className="flex items-center gap-1 border-b border-hairline mb-4">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-colors -mb-px ${
                active ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <t.icon className={`w-4 h-4 ${active ? 'text-ink' : 'text-ink-faint'}`} />
              {t.label}
              <span
                className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-all ${
                  active ? 'bg-ink' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {tab === 'steps' && (
        <StepsTab
          task={task}
          definition={definition}
          stepDefs={stepDefs}
          currentDef={currentDef}
          completed={completed}
          role={{ isStaff, isClient, canOverrideClient: canAssign, isAdmin: role === 'admin', uid: currentUserUid }}
          pending={advance.isPending}
          onEvent={(e) => advance.mutate(e)}
          assignment={canAssign ? {
            staff,
            assigning: assign.isPending,
            onAssign: (stepNumber, assignedTo) => assign.mutate({ stepNumber, assignedTo }),
            onToggleUrgent: (stepNumber, next) => toggleStepUrgent.mutate({ stepNumber, next }),
            urgentPending: toggleStepUrgent.isPending,
          } : undefined}
          events={events}
          documents={documents}
          onAttach={() => setTab('documents')}
          onOpenDoc={(docId) => openDocument(taskId!, docId)}
        />
      )}
      {tab === 'documents' && <DocumentsPanel taskId={taskId!} isStaff={isStaff} />}
      {tab === 'discussion' && <DiscussionPanel taskId={taskId!} isStaff={isStaff} />}
      {tab === 'payments' && <PaymentsTab task={task} canEdit={canAssign} />}
    </PageShell>
  );
}

function LoadingCard() {
  return (
    <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
      <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

/* ── Approval banner (E03-S04) ─────────────────────────────────────────────── */

function ApprovalBanner({
  isAdmin, approving, rejecting, onApprove, onReject,
}: {
  isAdmin: boolean;
  approving: boolean;
  rejecting: boolean;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  // Two-step reject: reveal a reason field (the spec requires a reason) before firing.
  const [rejecting2, setRejecting2] = useState(false);
  const [reason, setReason] = useState('');
  const busy = approving || rejecting;

  return (
    <div className="card p-4 mb-4 border-amber-200 bg-amber-50/60">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-900">
            {isAdmin ? 'Awaiting your approval' : 'Awaiting admin approval'}
          </p>
          <p className="text-sm text-amber-800 mt-0.5">
            {isAdmin
              ? 'This matter was created by a manager and needs your approval before work can begin.'
              : 'This matter is pending admin approval. Work will begin once an admin approves it.'}
          </p>

          {isAdmin && !rejecting2 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                className="btn-primary inline-flex items-center gap-1.5 py-1.5"
                disabled={busy}
                onClick={onApprove}
              >
                {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                Approve
              </button>
              <button
                className="btn-secondary inline-flex items-center gap-1.5 py-1.5"
                disabled={busy}
                onClick={() => setRejecting2(true)}
              >
                <ThumbsDown className="w-4 h-4" /> Reject
              </button>
            </div>
          )}

          {isAdmin && rejecting2 && (
            <div className="mt-3 space-y-2">
              <textarea
                className="input-field w-full text-sm"
                rows={2}
                placeholder="Reason for rejection (required)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={rejecting}
                autoFocus
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn-primary inline-flex items-center gap-1.5 py-1.5 bg-red-600 hover:bg-red-700"
                  disabled={rejecting || !reason.trim()}
                  onClick={() => onReject(reason.trim())}
                >
                  {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
                  Confirm rejection
                </button>
                <button
                  className="btn-ghost py-1.5"
                  disabled={rejecting}
                  onClick={() => { setRejecting2(false); setReason(''); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Matter actions kebab menu ─────────────────────────────────────────────── */

function MatterActionsMenu({
  archiving, onArchive, onStop, canStop,
}: {
  archiving: boolean;
  onArchive: () => void;
  onStop: () => void;
  /** Stop workflow only applies to in-progress matters, not completed ones. */
  canStop: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-soft transition-colors"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[170px] bg-white border border-hairline rounded-lg shadow-card py-1">
          <button
            onClick={() => { setOpen(false); onArchive(); }}
            disabled={archiving}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-soft transition-colors"
          >
            <Archive className="w-4 h-4 text-ink-muted shrink-0" /> Archive matter
          </button>
          {canStop && (
            <>
              <div className="my-1 border-t border-hairline" />
              <button
                onClick={() => { setOpen(false); onStop(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Ban className="w-4 h-4 shrink-0" /> Stop workflow
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Stop matter banner (#41) ──────────────────────────────────────────────── */

function StopMatterBanner({
  pending, onCancel, onStop,
}: {
  pending: boolean;
  onCancel: () => void;
  onStop: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <div className="card p-4 mb-4 border-red-200 bg-red-50/60">
      <div className="flex items-start gap-2.5">
        <Ban className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-900">Stop this matter?</p>
          <p className="text-sm text-red-800 mt-0.5">
            Use this when the client discontinues the service. The matter is cancelled and leaves
            active worklists. A reason is required.
          </p>
          <textarea
            className="input-field w-full text-sm mt-2"
            rows={2}
            placeholder="Reason for stopping (required)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={pending}
            autoFocus
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <button
              className="btn-primary inline-flex items-center gap-1.5 py-1.5 bg-red-600 hover:bg-red-700"
              disabled={pending || !reason.trim()}
              onClick={() => onStop(reason.trim())}
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Stop workflow
            </button>
            <button className="btn-ghost py-1.5" disabled={pending} onClick={() => { onCancel(); setReason(''); }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Steps tab ─────────────────────────────────────────────────────────────── */

interface StepAssignment {
  staff: PortalUser[];
  assigning: boolean;
  onAssign: (stepNumber: number, assignedTo: string | null) => void;
  // Urgent toggle for the current step (Issue 3).
  onToggleUrgent: (stepNumber: number, next: boolean) => void;
  urgentPending: boolean;
}

function StepsTab({
  task, definition, stepDefs, currentDef, completed, role, pending, onEvent, assignment, events, documents, onAttach, onOpenDoc,
}: {
  task: Task;
  definition?: WorkflowDefinition;
  stepDefs: WorkflowStepDef[];
  currentDef?: WorkflowStepDef;
  completed: boolean;
  role: { isStaff: boolean; isClient: boolean; canOverrideClient?: boolean; isAdmin?: boolean; uid?: string | null };
  pending: boolean;
  onEvent: (e: WorkflowEventInput) => void;
  assignment?: StepAssignment;
  events: TaskEvent[];
  documents: TaskDocument[];
  onAttach: () => void;
  onOpenDoc: (docId: string) => void;
}) {
  const steps = task.steps ?? [];
  // #55: display steps in clean serial order (1,2,3,4…). The stored `stepNumber`
  // is the internal identity and CAN have gaps — e.g. for clients, steps the
  // workflow hides (clientVisible:false) are filtered out server-side, leaving
  // 1,2,3,5,7. Number by POSITION in the visible, ordered list instead.
  const orderedStepNumbers = [...steps].sort((a, b) => a.stepNumber - b.stepNumber).map((s) => s.stepNumber);
  const displayNumberOf = (stepNumber: number) => orderedStepNumbers.indexOf(stepNumber) + 1;
  const currentStepInstance = steps.find((s) => s.stepNumber === task.currentStepNumber);
  const currentAssignee = currentStepInstance?.assignedTo ?? null;
  // Server-resolved name (#48) — used so team members (who don't fetch the staff
  // list) still see the real assignee instead of a false "Unassigned".
  const currentAssigneeName = currentStepInstance?.assigneeName ?? null;
  // #81/#82: the step's audience-appropriate description text. Staff see internal
  // descriptions/notes; clients see client ones. Falls back to the legacy single
  // `description`. (The backend already strips internal fields for clients.)
  const descFor = (n: number): string | undefined => {
    const s = stepDefs.find((x) => x.stepNumber === n);
    if (!s) return undefined;
    const audience = role.isClient ? 'client' : 'internal';
    const tagged = (s.descriptions ?? []).filter((d) => (d.audience ?? 'client') === audience).map((d) => d.text);
    const notes = role.isClient ? s.clientNote : s.internalNotes;
    const parts = [...tagged, notes, s.description].filter((t): t is string => !!t && t.trim().length > 0);
    // De-dupe (legacy description may already appear as a migrated entry).
    return [...new Set(parts)].join('\n\n') || undefined;
  };
  // #81: the audience-appropriate step STATUS label (shown as a small badge).
  const statusFor = (n: number): string | undefined => {
    const s = stepDefs.find((x) => x.stepNumber === n);
    if (!s) return undefined;
    return role.isClient ? s.clientStatus : s.internalStatus;
  };

  // #105: the info the client should review before Approve / Request Changes on a
  // client-approval step. It's the LATEST comment the internal team left targeting
  // this step (the "Name & Object shared by our team" message). For a client the
  // event feed masks staff as "Our team", so we take the most recent commented
  // event that arrives at (toStep) or sits on (fromStep) this step and was NOT
  // authored by the client themselves.
  const approvalNoteFor = (n: number): { text: string; by: string; at: string | null } | undefined => {
    const relevant = events
      .filter((e) => e.comment && (e.toStep === n || e.fromStep === n) && e.byName !== 'You')
      .sort((a, b) => (a.at ?? '').localeCompare(b.at ?? ''));
    const last = relevant[relevant.length - 1];
    return last?.comment ? { text: last.comment, by: last.byName, at: last.at } : undefined;
  };

  // Stage (phase) data drives the left rail. phaseId comes from the definition.
  const phaseList = definition?.phases ?? [];
  const hasPhases = phaseList.length > 0;
  const stepStatuses = new Map(steps.map((s) => [s.stepNumber, s.status]));
  const { phases: stages, activeIndex } = hasPhases
    ? phaseProgress(definition!, task.currentStepNumber, stepStatuses)
    : { phases: [], activeIndex: -1 };
  const phaseIdOf = new Map((definition?.steps ?? []).map((s) => [s.stepNumber, s.phaseId ?? null]));
  // done/total counts per phase for the rail sub-labels.
  const countsFor = (phaseId: string) => {
    const nums = steps.filter((s) => phaseIdOf.get(s.stepNumber) === phaseId);
    const done = nums.filter((s) => s.status === 'completed' || s.status === 'skipped').length;
    return { done, total: nums.length };
  };

  // Pending-on breakdown: of the remaining (not done/skipped) steps, how many
  // need our team vs the client vs the registrar. Restores the at-a-glance
  // "who's the ball with" overview. Owner derived from the definition.
  // #92 (extended): from the CLIENT's own POV, "Client" reads third-person — show
  // "You" consistently on client views.
  const ownerLabel = { team: 'Our team', client: role.isClient ? 'You' : 'Client', govt: 'Registrar' } as const;
  const remaining = { team: 0, client: 0, govt: 0 };
  for (const s of steps) {
    if (s.status === 'completed' || s.status === 'skipped') continue;
    const def = stepDefs.find((d) => d.stepNumber === s.stepNumber);
    if (!def) continue;
    remaining[deriveOwnerType(def)] += 1;
  }
  const remainingTotal = remaining.team + remaining.client + remaining.govt;
  // Whose turn for the CURRENT step (drives the hero header chip).
  const currentTurn = currentDef ? deriveOwnerType(currentDef) : null;

  // Which stage is shown in the pane. Defaults to the ACTIVE phase and FOLLOWS it
  // as the workflow advances (when completing a step moves the current step into a
  // new phase, the rail pointer advances too). A manual click still works: we only
  // auto-snap when `activeIndex` actually CHANGES, so the user's selection sticks
  // until the next real advance. Reconciled during render (no effect → no
  // cascading-render lint issue), tracking the last activeIndex we synced to.
  const [selectedStage, setSelectedStage] = useState<number>(Math.max(0, activeIndex));
  const [syncedActive, setSyncedActive] = useState<number>(activeIndex);
  if (activeIndex !== -1 && activeIndex !== syncedActive) {
    setSyncedActive(activeIndex);
    setSelectedStage(activeIndex);
  }
  const shownPhaseId = stages[selectedStage]?.id;
  // Steps belonging to the shown stage (for the step list in the pane).
  const stageSteps = hasPhases
    ? steps.filter((s) => phaseIdOf.get(s.stepNumber) === shownPhaseId)
    : steps;

  // #72: collapsible + drag-resizable Stages and Activity rails (persisted).
  // #119/#120: the Stages rail starts COLLAPSED so users land on the continuous
  // all-steps timeline (the collapsed pane shows every step grouped by stage with
  // a "Jump to stage…" picker) instead of one stage at a time. Expanding the rail
  // switches back to per-stage focus — the choice is the user's and is persisted.
  const stagesRail = useRail('matterLayout:stages', { initial: 210, min: 150, max: 340, defaultCollapsed: true });
  const activityRail = useRail('matterLayout:activity', { initial: 320, min: 240, max: 520 });

  // #96: completed/skipped steps hide behind a "Show completed (N)" toggle so a
  // long stage doesn't bury the active step under a wall of Done rows.
  const [showCompleted, setShowCompleted] = useState(false);
  const isDoneStatus = (s: TaskStep) => s.status === 'completed' || s.status === 'skipped';
  // #101: owner (team/client/govt) per step, from the definition — drives the
  // coloured left edge on rows and the hero card tint.
  const ownerOf = (stepNumber: number): 'team' | 'client' | 'govt' => {
    const def = stepDefs.find((d) => d.stepNumber === stepNumber);
    return def ? deriveOwnerType(def) : 'team';
  };
  // #102: when the Stages rail is COLLAPSED, the pane becomes a self-sufficient
  // full timeline (all stages, grouped) with a stage jump-dropdown — otherwise the
  // list would be stranded on one stage with no navigation left.
  const railCollapsed = stagesRail.collapsed && hasPhases;

  // The HERO panel — the one dominant zone: action (left) + meta (right) inside a
  // single elevated, bordered container, so the rail clearly belongs to the step.
  const currentStepUrgent = steps.find((s) => s.stepNumber === task.currentStepNumber)?.isUrgent ?? false;
  // #89: only an ACTIVE (or pending-approval) matter is advanceable. A stopped
  // (cancelled), rejected or archived matter must NOT show the step-action panel,
  // or a non-admin could complete a step and silently re-activate the workflow.
  const isAdvanceable = task.status === 'active' || task.status === 'pending';
  const hero = !completed && isAdvanceable && currentDef ? (
    <StepHeroPanel
      taskId={task.id} step={currentDef} role={role} pending={pending} turn={currentTurn}
      onEvent={onEvent} assignment={assignment} currentAssignee={currentAssignee}
      currentAssigneeName={currentAssigneeName}
      displayNumber={displayNumberOf(task.currentStepNumber)}
      stepUrgent={currentStepUrgent} onAttach={onAttach}
      statusLabel={statusFor(task.currentStepNumber)}
      description={descFor(task.currentStepNumber)}
      approvalNote={approvalNoteFor(task.currentStepNumber)}
    />
  ) : completed ? (
    <div className="card p-5 flex items-center gap-2.5 bg-emerald-50 border-emerald-100">
      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      <p className="text-sm text-emerald-700 font-medium">This service is complete.</p>
    </div>
  ) : null;

  // Quieter sections below the hero — clearly separated by section headers.
  // The workflow Activity stream is an INTERNAL/ops view — clients don't need it
  // on their service screen (GitHub #42), so it's staff-only here.
  const activitySection = !role.isClient && events.length > 0 && (
    <Section title="Activity" count={events.length} icon={<MessageSquare className="w-3.5 h-3.5" />}>
      <ActivityThreadCard events={events} definition={definition} currentStep={task.currentStepNumber} flush />
    </Section>
  );
  // Shared row renderer — used by both the single-stage and grouped views.
  const renderStepRow = (step: TaskStep) => (
    <ExpandableStepRow
      key={step.stepNumber}
      step={step}
      displayNumber={displayNumberOf(step.stepNumber)}
      description={descFor(step.stepNumber)}
      statusLabel={statusFor(step.stepNumber)}
      isCurrent={step.stepNumber === task.currentStepNumber && !completed}
      owner={ownerOf(step.stepNumber)}
      ownerLabel={ownerLabel[ownerOf(step.stepNumber)]}
      comments={events.filter((e) => e.comment && (e.fromStep === step.stepNumber || e.toStep === step.stepNumber))}
      attachments={documents.filter((d) => d.stepNumber === step.stepNumber)}
      onOpenDoc={onOpenDoc}
    />
  );

  // #96: split a step list into (visible = active/pending) + (completed/skipped),
  // rendering the completed set behind a "Show completed (N)" toggle. Ascending
  // order is preserved — the completed rows sit in their normal position once shown.
  const renderStepList = (list: TaskStep[]) => {
    const doneCount = list.filter(isDoneStatus).length;
    const visible = showCompleted ? list : list.filter((s) => !isDoneStatus(s));
    return (
      <>
        <div className="card divide-y divide-hairline-soft">
          {visible.map(renderStepRow)}
          {visible.length === 0 && (
            <p className="px-5 py-4 text-sm text-ink-muted">All steps here are completed.</p>
          )}
        </div>
        {doneCount > 0 && (
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="mt-2 text-xs font-medium text-brand-700 inline-flex items-center gap-1 hover:underline"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
            {showCompleted ? 'Hide completed' : `Show completed (${doneCount})`}
          </button>
        )}
      </>
    );
  };

  // #102: when the rail is collapsed, render EVERY stage's steps grouped with
  // small stage subheaders (self-sufficient full timeline). Otherwise the classic
  // single-stage view. Completed steps still collapse via #96.
  const stepsSection = railCollapsed ? (
    <Section
      title="All steps"
      icon={<ListChecks className="w-3.5 h-3.5" />}
      action={<StageJumpDropdown stages={stages} onJump={(i) => { setSelectedStage(i); document.getElementById(`stage-group-${stages[i]?.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} />}
    >
      <div className="space-y-5">
        {stages.map((st) => {
          const group = steps.filter((s) => phaseIdOf.get(s.stepNumber) === st.id);
          if (group.length === 0) return null;
          const { done, total } = countsFor(st.id);
          return (
            <div key={st.id} id={`stage-group-${st.id}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1.5">
                {st.name} · {done}/{total}
              </p>
              {renderStepList(group)}
            </div>
          );
        })}
      </div>
    </Section>
  ) : (
    <Section title={hasPhases ? `${stages[selectedStage]?.name} · steps` : 'All steps'} icon={<ListChecks className="w-3.5 h-3.5" />}>
      {renderStepList(stageSteps)}
    </Section>
  );

  // Pending-on summary — remaining steps grouped by who must act. Restores the
  // at-a-glance "ball is with X" overview lost when the KPI tiles were removed.
  const pendingBar = !completed && remainingTotal > 0 && (
    <div className="card px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{remainingTotal} steps remaining</span>
      {(['team', 'client', 'govt'] as const).filter((k) => remaining[k] > 0).map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5 text-sm">
          {/* #101: dots match the step-row owner edges (teal / amber / violet). */}
          <span className={`w-1.5 h-1.5 rounded-full ${k === 'team' ? 'bg-teal-500' : k === 'client' ? 'bg-amber-500' : 'bg-violet-500'}`} />
          <span className="font-semibold text-ink">{remaining[k]}</span>
          <span className="text-ink-muted">{ownerLabel[k]}</span>
        </span>
      ))}
    </div>
  );

  // #54: part-payment alert — a blinking banner shown to BOTH client and team when
  // only part payment has been received, replacing the old "Part Payment Due" step.
  //
  // #124: don't nag from step 1. The balance is usually collected at a specific
  // point in the service, so the alert only starts once the matter REACHES the step
  // configured to chase it — the same `REMIND_PART_PAYMENT` effect that drives the
  // reminder email (#76), so one setting controls both. Workflows with no such step
  // configured keep the previous always-on behaviour. It stops automatically once
  // the balance is cleared (paymentStatus is no longer part_paid).
  const partPaymentFromStep = stepDefs.find((s) => (s.effects ?? []).includes('REMIND_PART_PAYMENT'))?.stepNumber;
  const partPaymentDue = partPaymentFromStep == null
    || task.currentStepNumber >= partPaymentFromStep;
  const partPaymentAlert = !completed && task.paymentStatus === 'part_paid' && partPaymentDue && (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex items-start gap-2.5 animate-pulse">
      <CreditCard className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-amber-900">Part payment received</p>
        <p className="text-sm text-amber-800">
          {role.isClient
            ? 'Please make the remaining payment for completion and uploading of the final e-forms for company incorporation.'
            : `Only part payment received${task.amountDue ? ` — ₹${task.amountDue} due` : ''}. Follow up with the client for the balance.`}
        </p>
      </div>
    </div>
  );

  // Activity as a sticky RIGHT sidebar (xl+). Capped height with internal scroll
  // so a long feed never runs past the viewport while sticky.
  // No phases → content + collapsible/resizable Activity rail on xl (#72); below
  // xl it stacks. The Activity column width follows the same persisted rail.
  if (!hasPhases) {
    const activityCol = activityRail.collapsed ? '2.25rem' : `${activityRail.width}px`;
    return (
      <>
        <div
          className="hidden xl:grid items-start"
          style={{ gridTemplateColumns: `1fr auto ${activitySection ? activityCol : '0px'}` }}
        >
          <div className="space-y-7 min-w-0 mr-4">
            {partPaymentAlert}
            {pendingBar}
            {hero}
            {stepsSection}
          </div>
          {activitySection && !activityRail.collapsed
            ? <PanelHandle onPointerDown={activityRail.startDrag('right')} />
            : <div />}
          {activitySection && <ActivityRail rail={activityRail}>{activitySection}</ActivityRail>}
        </div>
        <div className="xl:hidden space-y-7">
          {partPaymentAlert}
          {pendingBar}
          {hero}
          {activitySection}
          {stepsSection}
        </div>
      </>
    );
  }

  // Phases → timeline-centric (Option 3): stage rail + focused pane + Activity rail.
  // #72: at xl the rails are collapsible + drag-resizable (persisted widths), with
  // drag handles between columns. Below xl it stacks (mobile stage dropdown; lg
  // shows a simple 2-col stage rail). Each rail is rendered exactly once.
  const stagesCol = stagesRail.collapsed ? '2.25rem' : `${stagesRail.width}px`;
  const activityCol = activityRail.collapsed ? '2.25rem' : `${activityRail.width}px`;
  return (
    <>
      {/* xl+: resizable 3-column grid. */}
      <div
        className="hidden xl:grid items-start"
        style={{ gridTemplateColumns: `${stagesCol} auto minmax(0,1fr)${activitySection ? ` auto ${activityCol}` : ''}` }}
      >
        <StagesRail stages={stages} selected={selectedStage} onSelect={setSelectedStage} countsFor={countsFor} rail={stagesRail} />
        {!stagesRail.collapsed
          ? <PanelHandle onPointerDown={stagesRail.startDrag('left')} />
          : <div />}
        <div className="space-y-7 min-w-0 mx-4">
          {partPaymentAlert}
          {pendingBar}
          {hero}
          {stepsSection}
        </div>
        {activitySection && (!activityRail.collapsed
          ? <PanelHandle onPointerDown={activityRail.startDrag('right')} />
          : <div />)}
        {activitySection && <ActivityRail rail={activityRail}>{activitySection}</ActivityRail>}
      </div>

      {/* lg (no resize): simple stage rail + content. */}
      <div className="hidden lg:grid xl:hidden lg:grid-cols-[210px_1fr] lg:gap-6 items-start">
        <StagesRail stages={stages} selected={selectedStage} onSelect={setSelectedStage} countsFor={countsFor} rail={stagesRail} />
        <div className="space-y-7 min-w-0">
          {partPaymentAlert}
          {pendingBar}
          {hero}
          {activitySection}
          {stepsSection}
        </div>
      </div>

      {/* Mobile: stage dropdown + stacked content. */}
      <div className="lg:hidden space-y-7">
        <MobileStagePicker stages={stages} selected={selectedStage} onSelect={setSelectedStage} countsFor={countsFor} />
        {partPaymentAlert}
        {pendingBar}
        {hero}
        {activitySection}
        {stepsSection}
      </div>
    </>
  );
}

/** A thin vertical drag handle between two columns (#72). */
function PanelHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onPointerDown={onPointerDown}
      className="w-2 mx-1 self-stretch cursor-col-resize group flex items-center justify-center"
      title="Drag to resize"
    >
      <div className="w-px h-full bg-hairline group-hover:bg-brand-400 transition-colors" />
    </div>
  );
}

/** The Stages rail, collapsible (#72). */
function StagesRail({ stages, selected, onSelect, countsFor, rail }: {
  stages: { id: string; name: string; status: string }[];
  selected: number;
  onSelect: (i: number) => void;
  countsFor: (id: string) => { done: number; total: number };
  rail: RailState;
}) {
  return (
    <nav className="hidden lg:block xl:sticky xl:top-4 self-start">
      {/* #119/#120: this toggle is a VIEW CHOICE, not just show/hide — collapsed
          shows every step in one continuous timeline; expanded focuses one stage
          at a time. Labels say so, and the choice persists per user. */}
      {rail.collapsed ? (
        // Collapsed: a labelled button that switches back to per-stage browsing.
        <button
          onClick={rail.toggle}
          className="w-full flex flex-col items-center gap-1 py-2 text-ink-faint hover:text-ink rounded-lg hover:bg-white/60"
          title="Browse by stage (currently showing all steps)"
          aria-label="Browse by stage"
        >
          <ChevronsRight className="w-4 h-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wide [writing-mode:vertical-rl]">By stage</span>
        </button>
      ) : (
        <div className="flex items-center justify-between mb-2 px-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Stages</p>
          <button
            onClick={rail.toggle}
            className="inline-flex items-center gap-1 text-[11px] text-ink-faint hover:text-ink px-1.5 py-0.5 rounded hover:bg-white/60"
            title="Show all steps in one continuous list"
            aria-label="Show all steps"
          >
            <ChevronsLeft className="w-3.5 h-3.5" /> All steps
          </button>
        </div>
      )}
      {!rail.collapsed && (
        <div className="space-y-1">
          {stages.map((st, i) => {
            const sel = i === selected;
            const { done, total } = countsFor(st.id);
            return (
              <button key={st.id} onClick={() => onSelect(i)}
                className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-left transition-colors ${sel ? 'bg-white border border-hairline font-semibold text-ink shadow-card' : 'text-ink-muted hover:bg-white/60'}`}>
                <StageDot status={st.status} index={i} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{st.name}</span>
                  <span className="text-[11px] text-ink-faint font-normal">{done}/{total} done</span>
                </span>
                {sel && <ChevronRight className="w-4 h-4 text-ink-faint shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

/** The Activity rail, collapsible (#72). */
function ActivityRail({ rail, children }: { rail: RailState; children: React.ReactNode }) {
  return (
    <aside className="xl:sticky xl:top-4 self-start xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
      {rail.collapsed ? (
        <button
          onClick={rail.toggle}
          className="w-full flex flex-col items-center gap-1 py-2 text-ink-faint hover:text-ink rounded-lg hover:bg-white/60"
          title="Expand activity" aria-label="Expand activity"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wide [writing-mode:vertical-rl]">Activity</span>
        </button>
      ) : (
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Activity</p>
          <button
            onClick={rail.toggle}
            className="inline-flex items-center gap-1 text-[11px] text-ink-faint hover:text-ink px-1.5 py-0.5 rounded hover:bg-white/60"
            title="Collapse activity" aria-label="Collapse activity"
          >
            Hide <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {!rail.collapsed && children}
    </aside>
  );
}

/** A labelled content section — gives the page clear Act → History → Steps zones. */
function Section({ title, count, icon, action, children }: {
  title: string; count?: number; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint flex items-center gap-1.5">
          {icon}{title}{count != null && <span className="text-ink-faint/70 font-normal normal-case">· {count}</span>}
        </p>
        {action}
      </div>
      {children}
    </section>
  );
}

// #102: a compact stage jump-dropdown shown in the steps section header while the
// Stages rail is collapsed — quick navigation on long workflows without the rail.
function StageJumpDropdown({ stages, onJump }: {
  stages: { id: string; name: string; status: string }[];
  onJump: (index: number) => void;
}) {
  if (stages.length === 0) return null;
  return (
    <select
      onChange={(e) => { const i = Number(e.target.value); if (!Number.isNaN(i)) onJump(i); e.target.selectedIndex = 0; }}
      defaultValue=""
      aria-label="Jump to stage"
      className="rounded-md border border-hairline bg-white px-2 py-1 text-xs text-ink-muted max-w-[180px]"
    >
      <option value="" disabled>Jump to stage…</option>
      {stages.map((st, i) => <option key={st.id} value={i}>{st.name}</option>)}
    </select>
  );
}

function StageDot({ status, index }: { status: string; index: number }) {
  const cls = status === 'done' ? 'bg-emerald-500 text-white'
    : status === 'now' ? 'bg-brand-600 text-white' : 'bg-surface-card text-ink-faint';
  return <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${cls}`}>{status === 'done' ? '✓' : index + 1}</span>;
}

function MobileStagePicker({ stages, selected, onSelect, countsFor }: {
  stages: { id: string; name: string; status: string }[];
  selected: number;
  onSelect: (i: number) => void;
  countsFor: (id: string) => { done: number; total: number };
}) {
  const [open, setOpen] = useState(false);
  const sel = stages[selected];
  return (
    <div className="lg:hidden mb-1">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 min-w-0">
          <StageDot status={sel?.status ?? 'upcoming'} index={selected} />
          <span className="font-medium text-ink truncate">{sel?.name}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-faint transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="card p-1.5 mt-1.5 space-y-0.5">
          {stages.map((st, i) => {
            const { done, total } = countsFor(st.id);
            return (
              <button key={st.id} onClick={() => { onSelect(i); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-left ${i === selected ? 'bg-surface-soft font-semibold text-ink' : 'text-ink-muted'}`}>
                <StageDot status={st.status} index={i} />
                <span className="flex-1 truncate">{st.name}</span>
                <span className="text-[11px] text-ink-faint">{done}/{total}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EVENT_VERB: Record<string, string> = {
  COMPLETE_STEP: 'completed the step',
  RECORD_PAYMENT: 'recorded payment',
  PAYMENT_UPDATED: 'updated the payment',
  ADMIN_OVERRIDE_PAYMENT: 'overrode the payment gate',
  BRANCH_DECISION: 'made a decision',
  CLIENT_APPROVE: 'approved',
  CLIENT_REJECT: 'requested changes',
  GOVT_APPROVE: 'marked Govt approved',
  GOVT_REJECT: 'marked Govt rejected',
  REWORK: 'sent back for correction',
  STEP_REASSIGNED: 'reassigned the step',
  TASK_APPROVED: 'approved the matter',
  TASK_REJECTED: 'rejected the matter',
  TASK_STOPPED: 'stopped the matter',
  TASK_RESTARTED: 'restarted the matter',
  TASK_ARCHIVED: 'archived the matter',
};

/** Relative time. Module-scope (impure Date.now must not be called in render). */
function relTime(iso: string | null): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Activity thread — who did what, on WHICH step (phase · step N · title), when,
   with their comment. Real events data; step titles/phases come from the
   definition. `flush`: header is provided by the parent Section. */
function ActivityThreadCard({ events, flush, definition, currentStep }: { events: TaskEvent[]; flush?: boolean; definition?: WorkflowDefinition; currentStep?: number }) {
  // #73: default to the current step's activity; older steps behind an expander.
  const [showPrevious, setShowPrevious] = useState(false);

  // Lookups from the pinned definition: stepNumber → title, and → phase name.
  const titleByNum = new Map((definition?.steps ?? []).map((s) => [s.stepNumber, s.title]));
  const phaseNameById = new Map((definition?.phases ?? []).map((p) => [p.id, p.name]));
  const phaseByNum = new Map((definition?.steps ?? []).map((s) => [s.stepNumber, s.phaseId ? phaseNameById.get(s.phaseId) : undefined]));
  // #66: stepNumber → continuous display position (1,2,3…), so the activity
  // header matches the gap-free numbering shown everywhere else. Ordered by the
  // definition's step sequence; raw stepNumber stays the internal identity.
  const orderedDefNums = [...(definition?.steps ?? [])].sort((a, b) => a.stepNumber - b.stepNumber).map((s) => s.stepNumber);
  const displayNumOf = (n: number) => { const i = orderedDefNums.indexOf(n); return i >= 0 ? i + 1 : n; };
  // The step acted upon is where the action was taken (fromStep); fall back to toStep.
  const stepOf = (e: TaskEvent) => e.fromStep ?? e.toStep ?? null;

  // Group events by their reference step; within a group keep chronological order
  // (#73: multiple comments on the same step show oldest→newest).
  const groups = new Map<number | null, TaskEvent[]>();
  for (const e of events) {
    const n = stepOf(e);
    if (!groups.has(n)) groups.set(n, []);
    groups.get(n)!.push(e);
  }
  // Step groups ordered most-recent step first; the current step leads.
  const stepNums = [...groups.keys()].filter((n): n is number => n != null);
  stepNums.sort((a, b) => b - a);
  const orderedStepNums = currentStep != null && groups.has(currentStep)
    ? [currentStep, ...stepNums.filter((n) => n !== currentStep)]
    : stepNums;

  // #73: default view = current step's activity PLUS the immediately-PREVIOUS
  // step's activity (per the clarified requirement — only step N-2 and earlier
  // hide behind "Show previous steps"). "Previous" is the prior step in the
  // ordered DEFINITION sequence (orderedDefNums), not stepNumber-1 — stepNumber
  // can gap (#66) when steps are deleted or hidden from this audience.
  const currentIdx = currentStep != null ? orderedDefNums.indexOf(currentStep) : -1;
  const immediatelyPreviousStep = currentIdx > 0 ? orderedDefNums[currentIdx - 1] : null;

  const defaultGroups = orderedStepNums.filter((n) => n === currentStep || n === immediatelyPreviousStep);
  const olderGroups = orderedStepNums.filter((n) => n !== currentStep && n !== immediatelyPreviousStep);
  // Events with no step reference (task-level) always show at the top.
  const unattached = groups.get(null) ?? [];

  const renderGroup = (n: number) => {
    const list = groups.get(n) ?? [];
    const title = titleByNum.get(n);
    const phase = phaseByNum.get(n);
    return (
      <div key={n} className="space-y-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          {phase ? `${phase} · ` : ''}Step {displayNumOf(n)}{title ? ` · ${title}` : ''}
        </p>
        {list.map((e, i) => <ActivityRow key={`${n}-${i}`} e={e} />)}
      </div>
    );
  };

  const hasDefault = defaultGroups.length > 0 || unattached.length > 0;

  return (
    <div className="card p-5">
      {!flush && (
        <p className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-ink-faint" /> Activity <span className="text-ink-faint font-normal">· {events.length}</span>
        </p>
      )}
      <div className="space-y-4">
        {unattached.length > 0 && <div className="space-y-3.5">{unattached.map((e, i) => <ActivityRow key={`u-${i}`} e={e} />)}</div>}
        {defaultGroups.map(renderGroup)}
        {!hasDefault && olderGroups.length > 0 && !showPrevious && (
          <p className="text-sm text-ink-muted">No activity on the current step yet.</p>
        )}

        {olderGroups.length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setShowPrevious((v) => !v)}
              className="text-xs font-medium text-brand-700 inline-flex items-center gap-1 hover:underline"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPrevious ? 'rotate-180' : ''}`} />
              {showPrevious ? 'Hide previous steps' : `Show previous steps (${olderGroups.length})`}
            </button>
            {showPrevious && <div className="mt-3 space-y-4 border-t border-hairline pt-3">{olderGroups.map(renderGroup)}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/** One activity entry. Comments wrap fully and preserve line breaks (#73). */
function ActivityRow({ e }: { e: TaskEvent }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-bold text-ink-muted">{initialsOf(e.byName)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-semibold text-ink">{e.byName}</span>
          <span className="text-ink-muted"> {EVENT_VERB[e.type] ?? e.type.toLowerCase().replace(/_/g, ' ')}</span>
          <span className="text-ink-faint"> · {relTime(e.at)}</span>
        </p>
        {e.comment && (
          <RichText html={e.comment} className="text-sm text-ink-muted mt-1 bg-surface-soft rounded-lg px-3 py-2" />
        )}
      </div>
    </div>
  );
}

function initialsOf(name: string) {
  const n = (name ?? '').trim();
  if (!n) return '?';
  return n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

/** The HERO panel: action (left) + meta (right) merged into one elevated card. */
function StepHeroPanel({
  taskId, step, role, pending, onEvent, assignment, currentAssignee, currentAssigneeName, displayNumber, turn, stepUrgent, onAttach, statusLabel, description, approvalNote,
}: {
  taskId: string;
  step: WorkflowStepDef;
  role: { isStaff: boolean; isClient: boolean; canOverrideClient?: boolean; isAdmin?: boolean; uid?: string | null };
  pending: boolean;
  onEvent: (e: WorkflowEventInput) => void;
  assignment?: StepAssignment;
  currentAssignee?: string | null;
  currentAssigneeName?: string | null;
  displayNumber?: number;
  turn?: 'team' | 'client' | 'govt' | null;
  stepUrgent?: boolean;
  onAttach: () => void;
  /** #81: audience-specific status label (Internal/Client), shown as a badge. */
  statusLabel?: string;
  /** #81/#82: audience-tagged description text (multi-description + notes, joined). */
  description?: string;
  /** #105: latest internal-team message for the client to review before approving. */
  approvalNote?: { text: string; by: string; at: string | null };
}) {
  const events = new Set((step.transitions ?? []).map((t) => t.event));
  const spin = <Loader2 className="w-4 h-4 animate-spin" />;
  // #90: an admin-approval step (assignedRole === 'admin') is admin-only to act on.
  // Clients never see it (hidden server-side); a manager/team member may VIEW it but
  // gets no approve/complete control — only an admin does.
  const isAdminApprovalStep = step.assignedRole === 'admin';
  const isClientStep = events.has('CLIENT_APPROVE') && !isAdminApprovalStep;
  const isGovtStep = events.has('GOVT_APPROVE');
  const ownerName = assignment?.staff.find((u) => u.uid === currentAssignee);
  // Prefer the staff-list object's name (admins/managers), else the server-resolved
  // name (#48) so team members also see the real assignee. Empty when truly unassigned.
  const assigneeLabel = ownerName ? displayName(ownerName) : (currentAssignee ? (currentAssigneeName ?? '') : '');

  // #49: completion is restricted to the step's assignee. A non-assignee staff
  // member can only reassign (admins/managers via the owner dropdown). ADMIN keeps
  // an explicit override-complete (mirrors the backend gate). An UNASSIGNED step
  // stays completable by any permitted staff (nobody to gate against yet).
  const isAssignee = !!role.uid && currentAssignee === role.uid;
  // #90: on an admin-approval step, only an admin may complete — a manager/team
  // member is view-only regardless of assignment.
  const canComplete = role.isClient ? false
    : isAdminApprovalStep ? !!role.isAdmin
    : (!currentAssignee || isAssignee || role.isAdmin);
  const completeIsOverride = role.isAdmin && !!currentAssignee && !isAssignee;
  const assignedToOther = !!currentAssignee && !isAssignee && !role.isAdmin;

  // One comment composer feeds every action on this step. Comment is optional on
  // positive actions, required on rejections. The value rides along as event.remark.
  // #83: the draft autosaves per matter/step/user and restores on reopen.
  const draft = useCommentDraft(taskId, step.stepNumber, role.uid ?? null);
  const [comment, setComment] = useState('');
  const [needComment, setNeedComment] = useState(false);
  // #115: staff opt-in to share THIS comment with the client. Default OFF so an
  // internal note is never exposed by accident — EXCEPT on a client-approval step,
  // where the comment IS the hand-off the client must read before approving (#105:
  // "Proposed names & objects…"). There, sharing is the obvious intent, so it
  // defaults ON and staff can untick it to keep a note internal.
  const isClientApprovalStep = new Set((step.transitions ?? []).map((t) => t.event)).has('CLIENT_APPROVE');
  const [shareComment, setShareComment] = useState(isClientApprovalStep);

  // Restore the saved draft when it loads (or the step/user changes).
  useEffect(() => { setComment(draft.initial); }, [draft.initial]);

  const onCommentChange = (v: string) => {
    setComment(v);
    if (v.trim()) setNeedComment(false);
    draft.save(v);
  };

  const fire = (type: WorkflowEventInput['type'], opts?: { required?: boolean; extra?: Partial<WorkflowEventInput> }) => {
    const c = comment.trim();
    if (opts?.required && !c) { setNeedComment(true); return; }
    setNeedComment(false);
    // #115: staff comments are internal unless explicitly shared with the client.
    onEvent({ type, remark: c || undefined, commentClientVisible: shareComment, ...opts?.extra });
    setComment('');
    setShareComment(isClientApprovalStep); // back to this step's sensible default
    draft.clear(); // #83: drop the draft once submitted
  };

  // #121: the "waiting" line under the step title was hardcoded ("Our team is
  // working on this step."), so it couldn't be tailored per service/step. When an
  // admin HAS configured a client-facing description for this step (Workflow
  // Settings → Client note / description) that text is already rendered above the
  // actions, so the generic line is redundant noise — suppress it and let the
  // configured copy speak. With nothing configured we keep the generic fallback.
  const hasConfiguredDescription = Boolean((description ?? step.description ?? '').trim());
  const waitingText = (fallback: string) => (hasConfiguredDescription ? '' : fallback);

  let actions: React.ReactNode = null;     // buttons (actionable)
  let wait: React.ReactNode = null;        // passive "waiting" note for the other role

  if (step.type === 'payment_gate') {
    if (role.isStaff) {
      actions = (
        <div className="flex flex-wrap gap-2">
          <button disabled={pending} onClick={() => fire('RECORD_PAYMENT', { extra: { newStatus: 'fully_paid' } })} className="btn-primary disabled:opacity-50">
            {pending ? spin : <CreditCard className="w-4 h-4" />} Mark as Paid
          </button>
          {/* Payment override is admin-only (#74). */}
          {role.isAdmin && (
            <button disabled={pending} onClick={() => fire('ADMIN_OVERRIDE_PAYMENT')} className="btn-secondary disabled:opacity-50">
              <ShieldCheck className="w-4 h-4" /> Admin Override
            </button>
          )}
        </div>
      );
    } else {
      // #93: a client on a payment gate previously saw a bare "Waiting for payment
      // to be recorded." dead-end — no action, no context, and it contradicted the
      // part-payment banner telling them to pay. Give reassuring, non-contradictory
      // copy: recording is our job, nothing is needed from them on THIS step.
      wait = role.isClient
        ? <WaitNote text="Our team will confirm your payment once it's received — nothing is needed from you on this step." />
        : <WaitNote text="Waiting for payment to be recorded." />;
    }
  } else if (step.type === 'branch') {
    const branches = [...new Set((step.transitions ?? []).filter((t) => t.branch).map((t) => t.branch!))];
    if (role.isStaff && canComplete) {
      actions = (
        <div className="space-y-2">
          {completeIsOverride && <OverrideNote assignee={assigneeLabel} />}
          <div className="flex flex-wrap gap-2">
            {branches.map((b) => (
              <button key={b} disabled={pending} onClick={() => fire('BRANCH_DECISION', { extra: { branch: b } })} className="btn-secondary disabled:opacity-50">
                <GitBranch className="w-4 h-4" /> {b.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (assignedToOther) {
      wait = <AssignedToOtherNote assignee={assigneeLabel} />;
    } else wait = <WaitNote text={waitingText('Our team is processing the next step.')} />;
  } else if (isAdminApprovalStep) {
    // #90: admin-approval step — ONLY an admin acts. Fire whichever advancing event
    // the step declares (COMPLETE_STEP or, if configured that way, CLIENT_APPROVE).
    // Managers/team members are view-only; clients never reach here (step hidden).
    const approveEvent = events.has('COMPLETE_STEP') ? 'COMPLETE_STEP'
      : events.has('CLIENT_APPROVE') ? 'CLIENT_APPROVE' : null;
    const rejectEvent = events.has('REWORK') ? 'REWORK'
      : events.has('CLIENT_REJECT') ? 'CLIENT_REJECT' : null;
    if (role.isAdmin && approveEvent) {
      actions = (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button disabled={pending} onClick={() => fire(approveEvent)} className="btn-primary disabled:opacity-50">
              {pending ? spin : <ShieldCheck className="w-4 h-4" />} Approve
            </button>
            {rejectEvent && (
              <button disabled={pending} onClick={() => fire(rejectEvent, { required: true })} className="btn-secondary disabled:opacity-50">
                <ThumbsDown className="w-4 h-4" /> Request Changes
              </button>
            )}
          </div>
        </div>
      );
    } else {
      wait = <WaitNote text="This step requires admin approval. Only an admin can approve or complete it." />;
    }
  } else if (isClientStep) {
    if (role.isClient) {
      actions = (
        <div className="flex flex-wrap gap-2">
          <button disabled={pending} onClick={() => fire('CLIENT_APPROVE')} className="btn-primary disabled:opacity-50">
            {pending ? spin : <ThumbsUp className="w-4 h-4" />} Approve
          </button>
          <button disabled={pending} onClick={() => fire('CLIENT_REJECT', { required: true })} className="btn-secondary disabled:opacity-50">
            <ThumbsDown className="w-4 h-4" /> Request Changes
          </button>
        </div>
      );
    } else if (role.canOverrideClient) {
      // Admin/manager override: advance a client-pending step on the client's
      // behalf (e.g. they approved over phone/email). Recorded as an override.
      actions = (
        <div className="space-y-2">
          <WaitNote text="Waiting for the client to approve — or override on their behalf below." />
          <div className="flex flex-wrap gap-2">
            <button disabled={pending} onClick={() => fire('CLIENT_APPROVE')} className="btn-secondary disabled:opacity-50">
              {pending ? spin : <ShieldCheck className="w-4 h-4" />} Approve for client
            </button>
            <button disabled={pending} onClick={() => fire('CLIENT_REJECT', { required: true })} className="btn-secondary disabled:opacity-50">
              <ThumbsDown className="w-4 h-4" /> Request changes for client
            </button>
          </div>
        </div>
      );
    } else wait = <WaitNote text="Waiting for the client to approve." />;
  } else if (isGovtStep) {
    if (role.isStaff && canComplete) {
      actions = (
        <div className="space-y-2">
          {completeIsOverride && <OverrideNote assignee={assigneeLabel} />}
          <div className="flex flex-wrap gap-2">
            <button disabled={pending} onClick={() => fire('GOVT_APPROVE')} className="btn-primary disabled:opacity-50">
              {pending ? spin : <Landmark className="w-4 h-4" />} Govt Approved
            </button>
            <button disabled={pending} onClick={() => fire('GOVT_REJECT', { required: true })} className="btn-secondary disabled:opacity-50">
              <Landmark className="w-4 h-4" /> Govt Rejected
            </button>
          </div>
        </div>
      );
    } else if (assignedToOther) {
      wait = <AssignedToOtherNote assignee={assigneeLabel} />;
    } else wait = <WaitNote text="Awaiting the government department response." />;
  } else if (events.has('COMPLETE_STEP')) {
    // #56: a step that also has a REWORK transition is an APPROVAL step — render
    // Approve + "Need Correction in Form" (reject reverts to the prior step).
    const hasRework = events.has('REWORK');
    if (role.isStaff && canComplete) {
      actions = (
        <div className="space-y-2">
          {completeIsOverride && <OverrideNote assignee={assigneeLabel} />}
          <div className="flex flex-wrap gap-2">
            <button disabled={pending} onClick={() => fire('COMPLETE_STEP')} className="btn-primary disabled:opacity-50">
              {pending ? spin : (hasRework ? <ThumbsUp className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />)} {hasRework ? 'Approve' : 'Complete Step'}
            </button>
            {hasRework && (
              <button disabled={pending} onClick={() => fire('REWORK', { required: true })} className="btn-secondary disabled:opacity-50">
                <ThumbsDown className="w-4 h-4" /> Need Correction in Form
              </button>
            )}
          </div>
        </div>
      );
    } else if (isAdminApprovalStep) {
      // #90: a manager/team member can view but not act — admin approval required.
      wait = <WaitNote text="This step requires admin approval. Only an admin can approve or complete it." />;
    } else if (assignedToOther) {
      wait = <AssignedToOtherNote assignee={assigneeLabel} />;
    } else wait = <WaitNote text={waitingText('Our team is working on this step.')} />;
  }

  // Right-side meta block (shared by desktop column + mobile stack). The
  // Step-owner section is INTERNAL — clients never see who on our team owns a
  // step (E12-S01). It only renders for staff.
  const metaBlock = (
    <div className="space-y-4">
      {!role.isClient && (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1.5">Step owner</p>
        {assignment ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-ink-muted">{initialsOf(assigneeLabel)}</span>
            </div>
            <div className="min-w-0">
              <select
                className="bg-transparent text-sm font-medium text-ink focus:outline-none cursor-pointer max-w-[150px]"
                value={currentAssignee ?? ''}
                disabled={assignment.assigning}
                onChange={(e) => assignment.onAssign(step.stepNumber, e.target.value || null)}
              >
                <option value="">Unassigned</option>
                {assignment.staff.map((u) => <option key={u.uid} value={u.uid}>{displayName(u)}</option>)}
              </select>
              {step.assignedRole && <p className="text-[11px] text-ink-faint flex items-center gap-1"><Briefcase className="w-3 h-3" /> {step.assignedRole.replace(/_/g, ' ')}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-ink-muted">{assigneeLabel ? initialsOf(assigneeLabel) : '—'}</span></div>
            <div>
              <p className="text-sm font-medium text-ink">{assigneeLabel || 'Unassigned'}</p>
              {step.assignedRole && <p className="text-[11px] text-ink-faint flex items-center gap-1"><Briefcase className="w-3 h-3" /> {step.assignedRole.replace(/_/g, ' ')}</p>}
            </div>
          </div>
        )}
      </div>
      )}
      {assignment && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1.5">Priority</p>
          <button
            onClick={() => assignment.onToggleUrgent(step.stepNumber, !stepUrgent)}
            disabled={assignment.urgentPending}
            aria-pressed={!!stepUrgent}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium w-full justify-center transition-colors ${
              stepUrgent
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'btn-secondary'
            }`}
          >
            <Flame className="w-3.5 h-3.5" fill={stepUrgent ? 'currentColor' : 'none'} />
            {stepUrgent ? 'Urgent — clear' : 'Mark step urgent'}
          </button>
        </div>
      )}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1.5">Documents</p>
        <button onClick={onAttach} title="Open the Documents tab to upload" className="btn-secondary py-1.5 px-3 text-xs w-full inline-flex items-center justify-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5" /> Attach document
        </button>
      </div>
      {/* #111: staff can chase the client from the step. Wording comes from the
          editable templates; repeats are allowed and each send is audited. */}
      {role.isStaff && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1.5">Client reminder</p>
          <SendReminderButton taskId={taskId} stepNumber={step.stepNumber} />
        </div>
      )}
    </div>
  );

  // #101: owner-coloured left edge on the hero card, matching the step-row edges,
  // so staff instantly see whose ball the current step is. team=slate, client=
  // amber, govt=violet (clearly distinct hues).
  const heroEdge = turn === 'client' ? 'border-l-4 border-solid border-l-amber-500'
    : turn === 'govt' ? 'border-l-4 border-solid border-l-violet-500'
    : turn === 'team' ? 'border-l-4 border-solid border-l-teal-500' : '';
  return (
    <div className={`card overflow-hidden ring-1 ring-ink/5 shadow-card-hover ${heroEdge}`}>
      <div className="px-5 py-2.5 bg-surface-soft border-b border-hairline flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted flex items-center gap-1.5">
          <PlayCircle className="w-3.5 h-3.5 text-brand-600" /> Current step · {displayNumber ?? step.stepNumber}
        </span>
        <div className="flex items-center gap-1.5">
          {/* #81: the audience-specific status configured in Step Settings — the
              hero panel is the primary place a user looks, so it must render here
              too (previously only shown in the collapsed step LIST row). */}
          {statusLabel && (
            <span className="badge bg-surface-soft text-ink-muted">{statusLabel}</span>
          )}
          {turn && (
            <span className={`badge ${turn === 'client' ? 'bg-blue-50 text-blue-700' : turn === 'govt' ? 'bg-violet-50 text-violet-700' : 'bg-brand-50 text-brand-700'}`}>
              {/* #92: from the client's own POV, "Waiting on client" reads third-person.
                  Show "Waiting on you" for the client; staff keep "Waiting on client". */}
              {turn === 'client' ? (role.isClient ? 'Waiting on you' : 'Waiting on client')
                : turn === 'govt' ? 'With registrar' : 'With our team'}
            </span>
          )}
        </div>
      </div>

      {/* Action (left) + meta (right) inside ONE panel. */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
        <div className="p-5">
          <p className="text-base font-semibold text-ink">{step.title}</p>
          {/* #81/#82: audience-tagged description (Step Settings' multiple
              descriptions + notes), falling back to the legacy single field. */}
          {(description ?? step.description) && (
            <p className="text-sm text-ink-muted mt-1 whitespace-pre-wrap break-words">{description ?? step.description}</p>
          )}

          {/* #105: read-only info box the client reviews before Approve / Request
              Changes — the latest message the internal team left on this step
              (e.g. the proposed names & objects to review). Client-approval steps
              only; hidden when the team hasn't left anything yet. */}
          {role.isClient && isClientStep && approvalNote && (
            <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50/60 p-4">
              <p className="text-xs font-semibold text-brand-800 inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Shared by our team
              </p>
              <RichText html={approvalNote.text} className="text-sm text-ink mt-1.5" />
              <p className="text-[11px] text-ink-faint mt-2">
                {approvalNote.by}{approvalNote.at ? ` · ${relTime(approvalNote.at)}` : ''}
              </p>
            </div>
          )}

          {/* #52: per-step checklist (display/tracking aid, generic on any step).
              #95: read-only for the client (it's a staff tracking list, not theirs). */}
          {step.checklistItems && step.checklistItems.length > 0 && (
            <StepChecklist items={step.checklistItems} readOnly={role.isClient} />
          )}

          {/* #61: per-step document upload (generic on any step that opts in). */}
          {step.allowDocUpload && (
            <div className="mt-4">
              <button onClick={onAttach} className="btn-secondary py-1.5 px-3 text-sm inline-flex items-center gap-1.5">
                <Paperclip className="w-4 h-4" /> Attach document for this step
              </button>
            </div>
          )}

          {actions && (
            <div className="mt-4">
              <ActionComposer
                comment={comment}
                onChange={onCommentChange}
                error={needComment ? 'Please add a comment explaining the requested changes.' : null}
                disabled={pending}
                savedLabel={comment.trim() ? draftSavedLabel(draft.savedAt) : null}
                showShare={role.isStaff}
                share={shareComment}
                onShareChange={setShareComment}
              />
              {actions}
            </div>
          )}
          {wait && <div className="mt-3">{wait}</div>}
        </div>

        <div className="p-5 border-t md:border-t-0 md:border-l border-hairline bg-surface-soft/40">
          {metaBlock}
        </div>
      </div>
    </div>
  );
}

/**
 * Comment composer for a step action. The comment is optional on positive
 * actions and required on rejections (enforced by the caller via the `error`
 * prop). Document attachment lives in the step's right-hand Documents block.
 */
function ActionComposer({ comment, onChange, error, disabled, savedLabel, showShare, share, onShareChange }: {
  comment: string;
  onChange: (v: string) => void;
  error: string | null;
  disabled: boolean;
  savedLabel?: string | null; // #83: e.g. "Draft saved 2 minutes ago"
  /** #115: staff-only "Visible to client" toggle for this comment. */
  showShare?: boolean;
  share?: boolean;
  onShareChange?: (v: boolean) => void;
}) {
  return (
    <div className="mb-3">
      {/* #122: rich text — paste tables/formatting from Word, Excel or email. */}
      <div className={error ? 'rounded-lg ring-1 ring-red-400' : ''}>
        <RichTextEditor
          value={comment}
          onChange={onChange}
          disabled={disabled}
          placeholder="Add a comment (optional)…"
          ariaLabel="Add a comment"
          rows={2}
        />
      </div>
      {/* #115: comments are internal by default; staff tick this to share one. */}
      {showShare && (
        <label className="mt-1.5 inline-flex items-center gap-2 text-[11px] text-ink-muted cursor-pointer">
          <input
            type="checkbox"
            className="h-3.5 w-3.5"
            checked={!!share}
            disabled={disabled}
            onChange={(e) => onShareChange?.(e.target.checked)}
            aria-label="Visible to client"
          />
          {share
            ? <span className="inline-flex items-center gap-1 text-emerald-700"><Eye className="w-3 h-3" /> Visible to client</span>
            : <span className="inline-flex items-center gap-1"><EyeOff className="w-3 h-3" /> Internal only — tick to share with the client</span>}
        </label>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {!error && savedLabel && (
        <p className="text-[11px] text-ink-faint mt-1 flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-500" /> {savedLabel}
        </p>
      )}
    </div>
  );
}


function WaitNote({ text }: { text: string }) {
  // #121: an empty string means the step's configured client description already
  // covers it — render nothing rather than an empty line.
  if (!text) return null;
  return <p className="text-sm text-ink-muted">{text}</p>;
}

// #52: generic per-step checklist. Items come from the workflow definition; check
// state is local (a verification/tracking aid — the step still advances via its
// normal action). A "N of M" counter shows progress at a glance.
function StepChecklist({ items, readOnly = false }: { items: string[]; readOnly?: boolean }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = items.filter((_, i) => checked[i]).length;

  // #95: for a CLIENT this is a staff-owned tracking list, not the client's to-do.
  // Render it read-only (a plain bulleted status list) so it never implies the
  // client must tick items. The checked state is local-only anyway (never
  // persisted), so there's nothing meaningful to "un-tick" for the client.
  if (readOnly) {
    return (
      <div className="mt-4 rounded-lg border border-hairline bg-surface-soft/40 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-2">
          What we're tracking on this step
        </p>
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink-faint shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-hairline bg-surface-soft/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-2">
        Checklist · {done}/{items.length}
      </p>
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 mt-0.5"
              checked={!!checked[i]}
              onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
            />
            <span className={checked[i] ? 'text-ink-muted line-through' : 'text-ink'}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// #49: a non-assignee staff member can't complete this step — only reassign it.
function AssignedToOtherNote({ assignee }: { assignee?: string }) {
  return (
    <p className="text-sm text-ink-muted">
      Assigned to <span className="font-medium text-ink">{assignee || 'another team member'}</span>.
      Only the assignee can complete this step — reassign it (above) to act.
    </p>
  );
}

// #49: admin completing a step assigned to someone else (audited override).
function OverrideNote({ assignee }: { assignee?: string }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
      <ShieldCheck className="w-3.5 h-3.5" />
      Override: completing on behalf of {assignee || 'the assignee'}.
    </p>
  );
}

const STATUS: Record<StepStatus, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'text-ink-faint' },
  active:    { label: 'In progress', cls: 'text-brand-700' },
  completed: { label: 'Done',      cls: 'text-emerald-700' },
  blocked:   { label: 'Blocked',   cls: 'text-amber-700' },
  skipped:   { label: 'Skipped',   cls: 'text-ink-faint' },
};

/** A step row. Expands to reveal details: the comments and document attachments
 *  recorded against this step (plus completion time / remark). */
// #101: ownership → the page's established colour + a human label (for a11y, so
// the coloured edge isn't colour-alone signalling).
// #101: three CLEARLY DISTINCT hues (not all-blue). Kept consistent with the
// pending-bar dots and hero edge below. team=teal (our active work), client=
// amber (warm — "your action"), govt=violet. Three clearly distinct hues.
const OWNER_EDGE: Record<'team' | 'client' | 'govt', { dot: string; label: string }> = {
  team:   { dot: 'bg-teal-500',   label: 'Our team' },
  client: { dot: 'bg-amber-500',  label: 'Client' },
  govt:   { dot: 'bg-violet-500', label: 'Registrar' },
};

function ExpandableStepRow({ step, displayNumber, description, statusLabel, isCurrent, owner, ownerLabel, comments = [], attachments = [], onOpenDoc }: {
  step: TaskStep;
  displayNumber: number;
  description?: string;
  statusLabel?: string; // #81: audience-specific status text
  isCurrent: boolean;
  owner?: 'team' | 'client' | 'govt'; // #101: ball owner → left-edge colour
  ownerLabel?: string; // #101/#92: audience-aware owner label for the tooltip ("You" for a client)
  comments?: TaskEvent[];
  attachments?: TaskDocument[];
  onOpenDoc?: (docId: string) => void;
}) {
  const s = STATUS[step.status] ?? STATUS.pending;
  const skipped = step.status === 'skipped';
  const Icon = step.status === 'completed' ? CheckCircle2 : skipped ? CircleSlash : isCurrent ? PlayCircle : Circle;
  // Expandable when there's anything to show: a remark, completion info, comments,
  // or attachments — on completed AND in-progress steps.
  const hasDetails = !!(step.remark || step.completedAt || comments.length || attachments.length);
  const expandable = hasDetails;
  const [open, setOpen] = useState(false);
  const countBits = [
    comments.length ? `${comments.length} comment${comments.length > 1 ? 's' : ''}` : '',
    attachments.length ? `${attachments.length} file${attachments.length > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(' · ');
  // #101: owner-coloured left edge on EVERY row, as an absolutely-positioned
  // BACKGROUND bar, not a border — the parent list uses `divide-y
  // divide-hairline-soft`, whose divide-color rule sets the border-color
  // SHORTHAND on every child except the first (higher-specificity
  // `> :not([hidden]) ~ :not([hidden])` selector), which silently wiped a
  // border-left edge on all rows but the first. A bg bar can't be overridden.
  const edge = owner ? OWNER_EDGE[owner] : null;
  return (
    <div
      className={`relative ${isCurrent ? 'bg-surface-soft' : ''}`}
      title={edge ? `${ownerLabel ?? edge.label} step` : undefined}
    >
      {edge && <span aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-1 ${edge.dot}`} />}
      <button
        onClick={() => expandable && setOpen((v) => !v)}
        className={`w-full flex items-start gap-3 px-5 py-3 text-left ${expandable ? 'hover:bg-surface-soft/60' : 'cursor-default'}`}
      >
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${step.status === 'completed' ? 'text-emerald-600' : skipped ? 'text-ink-faint' : isCurrent ? 'text-brand-600' : 'text-ink-faint'}`} />
        <div className="min-w-0 flex-1">
          {/* #69: completed steps get a subtle line-through on the TITLE only (kept
              muted, decoration-1) so "done" reads at a glance without disrupting the
              row layout, icon, or "Done" badge — the checklist cue the client asked
              for, applied lightly to preserve the design language. */}
          <p className={`text-sm ${isCurrent ? 'font-semibold text-ink' : 'text-ink-soft'} ${step.status === 'completed' ? 'line-through decoration-1 decoration-ink-faint/60' : ''}`}>{displayNumber}. {step.title}</p>
          {statusLabel && <p className="text-[11px] text-ink-muted mt-0.5">{statusLabel}</p>}
          {description && !open && <p className="text-xs text-ink-muted mt-0.5 truncate">{description}</p>}
          {!open && countBits && <p className="text-[11px] text-ink-faint mt-0.5">{countBits}</p>}
        </div>
        <span className={`text-xs font-medium shrink-0 ${s.cls}`}>{s.label}</span>
        {expandable && <ChevronDown className={`w-4 h-4 text-ink-faint shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && expandable && (
        <div className="px-5 pb-4 pl-12 space-y-2">
          {description && <p className="text-xs text-ink-muted whitespace-pre-wrap break-words">{description}</p>}
          {step.completedAt && <p className="text-xs text-ink-faint">Completed {relTime(step.completedAt)}</p>}
          {step.remark && <p className="text-sm text-ink-muted bg-surface-soft rounded-lg px-3 py-2">“{step.remark}”</p>}

          {comments.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Comments</p>
              {comments.map((c, i) => (
                <div key={i} className="text-sm text-ink-muted bg-surface-soft rounded-lg px-3 py-2">
                  <span className="text-ink-soft">“{c.comment}”</span>
                  <span className="block text-[11px] text-ink-faint mt-0.5">{c.byName}{c.at ? ` · ${relTime(c.at)}` : ''}</span>
                </div>
              ))}
            </div>
          )}

          {attachments.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Attachments</p>
              {attachments.map((d) => (
                <button
                  key={d.docId}
                  onClick={() => onOpenDoc?.(d.docId)}
                  className="w-full flex items-center gap-2 text-left text-sm text-brand-700 hover:underline bg-surface-soft rounded-lg px-3 py-2"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{d.fileName}</span>
                  <span className="ml-auto text-[11px] text-ink-faint shrink-0">{d.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Payments tab (read-only status) ───────────────────────────────────────── */

const PAYMENT: Record<PaymentStatus, { label: string; cls: string }> = {
  not_paid:   { label: 'Not paid',  cls: 'bg-red-50 text-red-700' },
  part_paid:  { label: 'Part paid', cls: 'bg-amber-50 text-amber-700' },
  fully_paid: { label: 'Fully paid', cls: 'bg-emerald-50 text-emerald-700' },
};

// Payment modes offered in the editor (#78). Free-text is still accepted by the
// API, but these cover the common cases and keep entries consistent.
const PAYMENT_MODES = ['UPI', 'Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'Cheque', 'Other'];

function PaymentsTab({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const p = PAYMENT[task.paymentStatus] ?? PAYMENT.not_paid;

  const [editing, setEditing] = useState(false);
  const [totalCost, setTotalCost] = useState(String(task.totalCost ?? task.amountPaid ?? 0));
  const [amountPaid, setAmountPaid] = useState(String(task.amountPaid ?? 0));
  const [paymentMode, setPaymentMode] = useState(task.paymentMode ?? '');

  const startEdit = () => {
    setTotalCost(String(task.totalCost ?? task.amountPaid ?? 0));
    setAmountPaid(String(task.amountPaid ?? 0));
    setPaymentMode(task.paymentMode ?? '');
    setEditing(true);
  };

  const save = useMutation({
    mutationFn: () => updatePayment(task.id, {
      totalCost: Number(totalCost) || 0,
      amountPaid: Number(amountPaid) || 0,
      paymentMode: paymentMode.trim() || null,
    }),
    onSuccess: () => {
      toast.success('Payment updated.');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task-events', task.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not update the payment.'),
  });

  const totalNum = Number(totalCost) || 0;
  const paidNum = Number(amountPaid) || 0;
  const dueNum = Math.max(0, totalNum - paidNum);
  const overpaid = paidNum > totalNum;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Payment status</p>
        <div className="flex items-center gap-2">
          <span className={`badge ${p.cls}`}>{p.label}</span>
          {canEdit && !editing && (
            <button onClick={startEdit} className="btn-secondary text-xs py-1 px-2">Edit</button>
          )}
        </div>
      </div>

      {!editing ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ink-muted">Total cost</p>
              <p className="text-sm font-semibold text-ink">₹{(task.totalCost ?? task.amountPaid ?? 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Payment mode</p>
              <p className="text-sm font-semibold text-ink">{task.paymentMode || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Amount paid</p>
              <p className="text-sm font-semibold text-ink">₹{(task.amountPaid ?? 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Amount due</p>
              <p className="text-sm font-semibold text-ink">₹{(task.amountDue ?? 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <p className="text-xs text-ink-faint mt-4">
            Payments are recorded by our team as they are received.
          </p>
        </>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-ink-muted">Total cost (₹)</span>
              <input type="number" min="0" value={totalCost} onChange={(e) => setTotalCost(e.target.value)}
                className="input-field mt-1" />
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Amount paid (₹)</span>
              <input type="number" min="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)}
                className="input-field mt-1" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-ink-muted">Payment mode</span>
            <select value={PAYMENT_MODES.includes(paymentMode) || paymentMode === '' ? paymentMode : 'Other'}
              onChange={(e) => setPaymentMode(e.target.value === 'Other' ? '' : e.target.value)}
              className="input-field mt-1">
              <option value="">— Not set —</option>
              {PAYMENT_MODES.map((m) => <option key={m} value={m === 'Other' ? 'Other' : m}>{m}</option>)}
            </select>
          </label>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted">Amount due: <span className="font-semibold text-ink">₹{dueNum.toLocaleString('en-IN')}</span></span>
            {overpaid && <span className="text-red-600">Paid exceeds total cost</span>}
          </div>
          <div className="flex items-center gap-2">
            <button disabled={save.isPending || overpaid} onClick={() => save.mutate()}
              className="btn-primary disabled:opacity-50">
              {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save
            </button>
            <button disabled={save.isPending} onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
