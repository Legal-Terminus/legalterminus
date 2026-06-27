import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, CheckCircle2, Circle, CircleSlash, Loader2, PlayCircle,
  CreditCard, ShieldCheck, ThumbsUp, ThumbsDown, Landmark, GitBranch,
  ListChecks, FileText, IndianRupee, Paperclip, MessageSquare, Briefcase,
  ChevronRight, ChevronDown, Flame, Ban, Archive,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import DocumentsPanel from '../../components/documents/DocumentsPanel';
import { useAuthStore } from '../../store/authStore';
import { getTask, advanceTask, assignStep, assignMatter, getTaskEvents, approveTask, rejectTask, stopTask, archiveTask, setTaskUrgent, setStepUrgent, type WorkflowEventInput, type TaskEvent } from '../../api/tasks';
import { useConfirm } from '../../components/common/confirmContext';
import { getAllUsers, displayName, type PortalUser } from '../../api/users';
import { getWorkflowDefinition, phaseProgress, deriveOwnerType, type WorkflowStepDef, type WorkflowDefinition } from '../../api/workflowDefinitions';
import type { Task, TaskStep, StepStatus, PaymentStatus } from '../../types/task';

type TabKey = 'steps' | 'documents' | 'payments';

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
  const progressLabel = completed ? `Completed · ${total} of ${total}` : `Step ${task.currentStepNumber} of ${total}`;
  const stepDefs = definition?.steps ?? [];
  const currentDef = stepDefs.find((s) => s.stepNumber === task.currentStepNumber);

  const TABS: { key: TabKey; label: string; icon: typeof ListChecks }[] = [
    { key: 'steps', label: 'Steps', icon: ListChecks },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'payments', label: 'Payments', icon: IndianRupee },
  ];

  return (
    <PageShell
      title={task.serviceName || task.workflowType}
      subtitle={isClient ? progressLabel : `${task.clientName ?? ''}${task.clientName ? ' · ' : ''}${progressLabel} · ${task.status}`}
      action={
        canAssign ? (
          <div className="flex items-center gap-2">
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
                  className="input-field py-1.5 pr-8 text-sm max-w-[160px]"
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
          </div>
        ) : undefined
      }
    >
      {/* Back — leading-left, the conventional + thumb-reachable spot (matches
          the reports pages' "← Back" pattern). */}
      <button
        onClick={() => navigate('/tasks')}
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-3 -ml-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {isClient ? 'My Services' : 'Matters'}
      </button>

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

      {/* Stopped/cancelled banner (#41) — terminal state with the reason. */}
      {task.status === 'cancelled' && (
        <div className="card p-4 mb-4 border-red-200 bg-red-50/60">
          <div className="flex items-start gap-2.5">
            <Ban className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800">This matter was stopped</p>
              {task.cancelledReason && <p className="text-sm text-red-700 mt-0.5">{task.cancelledReason}</p>}
            </div>
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

      {/* Stop workflow (#41) + Archive — staff actions on an in-flight matter.
          Stop = client discontinued (cancelled). Archive = non-destructive hide. */}
      {isStaff && (task.status === 'active' || task.status === 'pending') && (
        <StopMatterBanner
          open={stopping}
          pending={stop.isPending}
          archiving={archive.isPending}
          onOpen={() => setStopping(true)}
          onCancel={() => setStopping(false)}
          onStop={(reason) => stop.mutate(reason)}
          onArchive={onArchive}
        />
      )}

      {/* Tabs — underline style */}
      <div className="flex items-center gap-1 border-b border-hairline mb-5">
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
          onAttach={() => setTab('documents')}
        />
      )}
      {tab === 'documents' && <DocumentsPanel taskId={taskId!} isStaff={isStaff} />}
      {tab === 'payments' && <PaymentsTab task={task} />}
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

/* ── Stop matter banner (#41) ──────────────────────────────────────────────── */

function StopMatterBanner({
  open, pending, archiving, onOpen, onCancel, onStop, onArchive,
}: {
  open: boolean;
  pending: boolean;
  archiving: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onStop: (reason: string) => void;
  onArchive: () => void;
}) {
  const [reason, setReason] = useState('');
  if (!open) {
    return (
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={onArchive}
          disabled={archiving}
          className="btn-secondary inline-flex items-center gap-1.5"
        >
          <Archive className="w-4 h-4" /> Archive
        </button>
        <button
          onClick={onOpen}
          className="btn-secondary inline-flex items-center gap-1.5 text-red-600 hover:bg-red-50"
        >
          <Ban className="w-4 h-4" /> Stop workflow
        </button>
      </div>
    );
  }
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
  task, definition, stepDefs, currentDef, completed, role, pending, onEvent, assignment, events, onAttach,
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
  onAttach: () => void;
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
  const descFor = (n: number) => stepDefs.find((s) => s.stepNumber === n)?.description;

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
  const ownerLabel = { team: 'Our team', client: 'Client', govt: 'Registrar' } as const;
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

  // Which stage is shown in the pane. Default to the active one; user can switch.
  const [selectedStage, setSelectedStage] = useState<number>(Math.max(0, activeIndex));
  const shownPhaseId = stages[selectedStage]?.id;
  // Steps belonging to the shown stage (for the step list in the pane).
  const stageSteps = hasPhases
    ? steps.filter((s) => phaseIdOf.get(s.stepNumber) === shownPhaseId)
    : steps;

  // The HERO panel — the one dominant zone: action (left) + meta (right) inside a
  // single elevated, bordered container, so the rail clearly belongs to the step.
  const currentStepUrgent = steps.find((s) => s.stepNumber === task.currentStepNumber)?.isUrgent ?? false;
  const hero = !completed && currentDef ? (
    <StepHeroPanel
      step={currentDef} role={role} pending={pending} turn={currentTurn}
      onEvent={onEvent} assignment={assignment} currentAssignee={currentAssignee}
      currentAssigneeName={currentAssigneeName}
      displayNumber={displayNumberOf(task.currentStepNumber)}
      stepUrgent={currentStepUrgent} onAttach={onAttach}
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
      <ActivityThreadCard events={events} definition={definition} flush />
    </Section>
  );
  const stepsSection = (
    <Section title={hasPhases ? `${stages[selectedStage]?.name} · steps` : 'All steps'} icon={<ListChecks className="w-3.5 h-3.5" />}>
      <div className="card divide-y divide-hairline-soft">
        {stageSteps.map((step) => (
          <ExpandableStepRow
            key={step.stepNumber}
            step={step}
            displayNumber={displayNumberOf(step.stepNumber)}
            description={descFor(step.stepNumber)}
            isCurrent={step.stepNumber === task.currentStepNumber && !completed}
          />
        ))}
      </div>
    </Section>
  );

  // Pending-on summary — remaining steps grouped by who must act. Restores the
  // at-a-glance "ball is with X" overview lost when the KPI tiles were removed.
  const pendingBar = !completed && remainingTotal > 0 && (
    <div className="card px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{remainingTotal} steps remaining</span>
      {(['team', 'client', 'govt'] as const).filter((k) => remaining[k] > 0).map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5 text-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${k === 'team' ? 'bg-brand-600' : k === 'client' ? 'bg-blue-500' : 'bg-violet-500'}`} />
          <span className="font-semibold text-ink">{remaining[k]}</span>
          <span className="text-ink-muted">{ownerLabel[k]}</span>
        </span>
      ))}
    </div>
  );

  // #54: part-payment alert — a blinking banner shown to BOTH client and team when
  // only part payment has been received, replacing the old "Part Payment Due" step.
  const partPaymentAlert = !completed && task.paymentStatus === 'part_paid' && (
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
  const activityAside = activitySection && (
    <aside className="xl:sticky xl:top-4 self-start xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
      {activitySection}
    </aside>
  );

  // No phases → content + sticky Activity sidebar on xl (single column below that).
  if (!hasPhases) {
    return (
      <div className="xl:grid xl:grid-cols-[1fr_320px] xl:gap-6">
        <div className="space-y-7 min-w-0">
          {partPaymentAlert}
          {pendingBar}
          {hero}
          {stepsSection}
        </div>
        {activityAside}
      </div>
    );
  }

  // Phases → timeline-centric (Option 3): stage rail + focused pane + Activity rail.
  return (
    <div className="lg:grid lg:grid-cols-[210px_1fr] xl:grid-cols-[210px_1fr_320px] lg:gap-6">
      {/* Mobile: stage dropdown. Desktop: stage rail. */}
      <MobileStagePicker stages={stages} selected={selectedStage} onSelect={setSelectedStage} countsFor={countsFor} />
      <nav className="hidden lg:block space-y-1 lg:sticky lg:top-4 self-start">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-2 px-2">Stages</p>
        {stages.map((st, i) => {
          const sel = i === selectedStage;
          const { done, total } = countsFor(st.id);
          return (
            <button key={st.id} onClick={() => setSelectedStage(i)}
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
      </nav>

      <div className="space-y-7 min-w-0 mt-5 lg:mt-0">
        {partPaymentAlert}
        {pendingBar}
        {hero}
        {/* On lg (no 3rd column) Activity shows here, below content; on xl it
            moves to the right rail (hidden here to avoid duplication). */}
        <div className="xl:hidden">{activitySection}</div>
        {stepsSection}
      </div>

      {/* Activity right rail — xl+ only (lg shows it inline above). */}
      <div className="hidden xl:block">{activityAside}</div>
    </div>
  );
}

/** A labelled content section — gives the page clear Act → History → Steps zones. */
function Section({ title, count, icon, children }: {
  title: string; count?: number; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-2 flex items-center gap-1.5">
        {icon}{title}{count != null && <span className="text-ink-faint/70 font-normal normal-case">· {count}</span>}
      </p>
      {children}
    </section>
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
function ActivityThreadCard({ events, flush, definition }: { events: TaskEvent[]; flush?: boolean; definition?: WorkflowDefinition }) {
  // Lookups from the pinned definition: stepNumber → title, and → phase name.
  const titleByNum = new Map((definition?.steps ?? []).map((s) => [s.stepNumber, s.title]));
  const phaseNameById = new Map((definition?.phases ?? []).map((p) => [p.id, p.name]));
  const phaseByNum = new Map((definition?.steps ?? []).map((s) => [s.stepNumber, s.phaseId ? phaseNameById.get(s.phaseId) : undefined]));
  // The step acted upon is where the action was taken (fromStep); fall back to toStep.
  const refOf = (e: TaskEvent) => {
    const n = e.fromStep ?? e.toStep;
    if (n == null) return null;
    return { num: n, title: titleByNum.get(n), phase: phaseByNum.get(n) };
  };
  // Most recent first.
  const ordered = [...events].reverse();
  return (
    <div className="card p-5">
      {!flush && (
        <p className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-ink-faint" /> Activity <span className="text-ink-faint font-normal">· {events.length}</span>
        </p>
      )}
      <ol className="space-y-3.5">
        {ordered.map((e, i) => {
          const ref = refOf(e);
          return (
            <li key={i} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-ink-muted">{initialsOf(e.byName)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold text-ink">{e.byName}</span>
                  <span className="text-ink-muted"> {EVENT_VERB[e.type] ?? e.type.toLowerCase().replace(/_/g, ' ')}</span>
                  <span className="text-ink-faint"> · {relTime(e.at)}</span>
                </p>
                {ref && (
                  <p className="text-xs text-ink-muted mt-0.5">
                    {ref.phase && <span className="text-ink-faint">{ref.phase} · </span>}
                    Step {ref.num}{ref.title ? ` · ${ref.title}` : ''}
                  </p>
                )}
                {e.comment && <p className="text-sm text-ink-muted mt-1 bg-surface-soft rounded-lg px-3 py-2">{e.comment}</p>}
              </div>
            </li>
          );
        })}
      </ol>
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
  step, role, pending, onEvent, assignment, currentAssignee, currentAssigneeName, displayNumber, turn, stepUrgent, onAttach,
}: {
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
}) {
  const events = new Set((step.transitions ?? []).map((t) => t.event));
  const spin = <Loader2 className="w-4 h-4 animate-spin" />;
  const isClientStep = events.has('CLIENT_APPROVE');
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
  const canComplete = role.isClient ? false : (!currentAssignee || isAssignee || role.isAdmin);
  const completeIsOverride = role.isAdmin && !!currentAssignee && !isAssignee;
  const assignedToOther = !!currentAssignee && !isAssignee && !role.isAdmin;

  // One comment composer feeds every action on this step. Comment is optional on
  // positive actions, required on rejections. The value rides along as event.remark.
  const [comment, setComment] = useState('');
  const [needComment, setNeedComment] = useState(false);

  const fire = (type: WorkflowEventInput['type'], opts?: { required?: boolean; extra?: Partial<WorkflowEventInput> }) => {
    const c = comment.trim();
    if (opts?.required && !c) { setNeedComment(true); return; }
    setNeedComment(false);
    onEvent({ type, remark: c || undefined, ...opts?.extra });
    setComment('');
  };

  let actions: React.ReactNode = null;     // buttons (actionable)
  let wait: React.ReactNode = null;        // passive "waiting" note for the other role

  if (step.type === 'payment_gate') {
    if (role.isStaff) {
      actions = (
        <div className="flex flex-wrap gap-2">
          <button disabled={pending} onClick={() => fire('RECORD_PAYMENT', { extra: { newStatus: 'fully_paid' } })} className="btn-primary disabled:opacity-50">
            {pending ? spin : <CreditCard className="w-4 h-4" />} Mark as Paid
          </button>
          <button disabled={pending} onClick={() => fire('ADMIN_OVERRIDE_PAYMENT')} className="btn-secondary disabled:opacity-50">
            <ShieldCheck className="w-4 h-4" /> Admin Override
          </button>
        </div>
      );
    } else wait = <WaitNote text="Waiting for payment to be recorded." />;
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
    } else wait = <WaitNote text="Our team is processing the next step." />;
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
    } else if (assignedToOther) {
      wait = <AssignedToOtherNote assignee={assigneeLabel} />;
    } else wait = <WaitNote text="Our team is working on this step." />;
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
    </div>
  );

  return (
    <div className="card overflow-hidden ring-1 ring-ink/5 shadow-card-hover">
      <div className="px-5 py-2.5 bg-surface-soft border-b border-hairline flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted flex items-center gap-1.5">
          <PlayCircle className="w-3.5 h-3.5 text-brand-600" /> Current step · {displayNumber ?? step.stepNumber}
        </span>
        {turn && (
          <span className={`badge ${turn === 'client' ? 'bg-blue-50 text-blue-700' : turn === 'govt' ? 'bg-violet-50 text-violet-700' : 'bg-brand-50 text-brand-700'}`}>
            {turn === 'client' ? 'Waiting on client' : turn === 'govt' ? 'With registrar' : 'With our team'}
          </span>
        )}
      </div>

      {/* Action (left) + meta (right) inside ONE panel. */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
        <div className="p-5">
          <p className="text-base font-semibold text-ink">{step.title}</p>
          {step.description && <p className="text-sm text-ink-muted mt-1">{step.description}</p>}

          {/* #52: per-step checklist (display/tracking aid, generic on any step). */}
          {step.checklistItems && step.checklistItems.length > 0 && (
            <StepChecklist items={step.checklistItems} />
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
                onChange={(v) => { setComment(v); if (v.trim()) setNeedComment(false); }}
                error={needComment ? 'Please add a comment explaining the requested changes.' : null}
                disabled={pending}
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
function ActionComposer({ comment, onChange, error, disabled }: {
  comment: string;
  onChange: (v: string) => void;
  error: string | null;
  disabled: boolean;
}) {
  return (
    <div className="mb-3">
      <textarea
        value={comment}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={2}
        placeholder="Add a comment (optional)…"
        className={`input-field text-sm w-full resize-y ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}


function WaitNote({ text }: { text: string }) {
  return <p className="text-sm text-ink-muted">{text}</p>;
}

// #52: generic per-step checklist. Items come from the workflow definition; check
// state is local (a verification/tracking aid — the step still advances via its
// normal action). A "N of M" counter shows progress at a glance.
function StepChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = items.filter((_, i) => checked[i]).length;
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

/** A step row. Completed/skipped rows expand to reveal details (remark, when). */
function ExpandableStepRow({ step, displayNumber, description, isCurrent }: { step: TaskStep; displayNumber: number; description?: string; isCurrent: boolean }) {
  const s = STATUS[step.status] ?? STATUS.pending;
  const skipped = step.status === 'skipped';
  const Icon = step.status === 'completed' ? CheckCircle2 : skipped ? CircleSlash : isCurrent ? PlayCircle : Circle;
  const hasDetails = !!(step.remark || step.completedAt || step.completedBy);
  const expandable = step.status === 'completed' && hasDetails;
  const [open, setOpen] = useState(false);
  return (
    <div className={isCurrent ? 'bg-surface-soft' : ''}>
      <button
        onClick={() => expandable && setOpen((v) => !v)}
        className={`w-full flex items-start gap-3 px-5 py-3 text-left ${expandable ? 'hover:bg-surface-soft/60' : 'cursor-default'}`}
      >
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${step.status === 'completed' ? 'text-emerald-600' : skipped ? 'text-ink-faint' : isCurrent ? 'text-brand-600' : 'text-ink-faint'}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-sm ${isCurrent ? 'font-semibold text-ink' : 'text-ink-soft'}`}>{displayNumber}. {step.title}</p>
          {description && !open && <p className="text-xs text-ink-muted mt-0.5 truncate">{description}</p>}
        </div>
        <span className={`text-xs font-medium shrink-0 ${s.cls}`}>{s.label}</span>
        {expandable && <ChevronDown className={`w-4 h-4 text-ink-faint shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && expandable && (
        <div className="px-5 pb-4 pl-12 space-y-1.5">
          {description && <p className="text-xs text-ink-muted">{description}</p>}
          {step.completedAt && <p className="text-xs text-ink-faint">Completed {relTime(step.completedAt)}</p>}
          {step.remark && <p className="text-sm text-ink-muted bg-surface-soft rounded-lg px-3 py-2">“{step.remark}”</p>}
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

function PaymentsTab({ task }: { task: Task }) {
  const p = PAYMENT[task.paymentStatus] ?? PAYMENT.not_paid;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Payment status</p>
        <span className={`badge ${p.cls}`}>{p.label}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
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
    </div>
  );
}
