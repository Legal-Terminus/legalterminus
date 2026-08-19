import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, CheckCircle2, CircleSlash, Loader2, PlayCircle,
  CreditCard, ShieldCheck, ThumbsUp, ThumbsDown, Landmark, GitBranch,
  ListChecks, FileText, IndianRupee, Paperclip, MessageSquare, Briefcase, Eye, EyeOff,
  ChevronRight, ChevronDown, Flame, Ban, Archive, RotateCcw, Check,
  ChevronsLeft, ChevronsRight, MoreVertical, Users,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import { useToast } from '../../components/common/toastContext';
import DocumentsPanel from '../../components/documents/DocumentsPanel';
import DiscussionPanel from '../../components/messages/DiscussionPanel';
import SendReminderButton from '../../components/tasks/SendReminderButton';
import RichTextEditor from '../../components/common/RichTextEditor';
import RichText from '../../components/common/RichText';
import { getDocuments, openDocument, type TaskDocument } from '../../api/documents';
import { useAuthStore } from '../../store/authStore';
import { getTask, advanceTask, assignStep, assignMatter, getTaskEvents, approveTask, rejectTask, stopTask, restartTask, archiveTask, updatePayment, setMatterProfessional, setMatterOrganisation, setMatterCcEmails, setTaskUrgent, setStepUrgent, reopenStep, updateTask, type WorkflowEventInput, type TaskEvent } from '../../api/tasks';
import { useConfirm } from '../../components/common/confirmContext';
import { useCommentDraft, draftSavedLabel } from '../../hooks/useCommentDraft';
import { useRail, type RailState } from '../../hooks/useResizablePanels';
import { getAllUsers, displayName, type PortalUser } from '../../api/users';
import { getWorkflowDefinition, phaseProgress, deriveOwnerType, type WorkflowStepDef, type WorkflowDefinition } from '../../api/workflowDefinitions';
import type { Task, TaskStep, StepStatus, PaymentStatus } from '../../types/task';
import { PAYMENT_MODES } from '../../lib/paymentModes';
import { getPayments, recordPayment, deletePaymentEntry } from '../../api/payments';
import { parseCcEmails, validateCcEmails, formatCcEmails } from '../../lib/ccEmails';

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
  // #168: an external professional is neither staff nor the client. Anything
  // gated on `isStaff` correctly excludes them, but anything gated on
  // `!isClient` would WRONGLY treat them as internal — so branches that mean
  // "outside party" must use this.
  const isExternalViewer = role === 'client' || role === 'professional';
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
  const { data: assignableUsers = [] } = useQuery({
    queryKey: ['portalUsers', 'staff'],
    queryFn: getAllUsers,
    enabled: canAssign,
    select: (users: PortalUser[]) => users.filter((u) => u.role !== 'client'),
    staleTime: 60_000,
  });

  // #168: STAFF only — who can be given work. A `professional` is view-only, so
  // routing a matter or step to one would assign work to an account that cannot
  // act on it. The one list used to feed both dropdowns.
  const staff = useMemo(
    () => assignableUsers.filter((u: PortalUser) => u.role !== 'professional'),
    [assignableUsers],
  );

  // #85/#168: who may be the matter's Professional — a staff member OR a
  // `professional` account (the latter then gets view-only access to this matter).
  const professionals = assignableUsers;

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

  // #153: correct the organisation name at any point — including AFTER the matter
  // completes. It's a label, so nothing about the workflow, payments, documents or
  // history changes; the matter list and reports pick up the new value on refetch.
  const editOrganisation = useMutation({
    mutationFn: (organisation: string | null) => setMatterOrganisation(taskId!, organisation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Organisation name updated.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not update the organisation name.'),
  });

  // #181: replace the matter's additional-professional list. The backend
  // resolves each email to a Professional account and rejects unknown addresses,
  // so a typo surfaces as an error rather than a silent no-grant.
  const editProEmails = useMutation({
    mutationFn: (emails: string[]) =>
      updateTask(taskId!, { additionalProfessionalEmails: emails } as Partial<Task>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      toast.success('Professional access updated.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not update professional access.'),
  });

  // #167: set or stop the recurring cadence. Setting it (re-)arms the reminder
  // from now; clearing it is the issue's "Stop Recurring".
  const editRecurrence = useMutation({
    mutationFn: (recurrence: 'monthly' | 'quarterly' | null) =>
      updateTask(taskId!, { recurrence } as Partial<Task>),
    onSuccess: (_d, recurrence) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-due'] });
      toast.success(recurrence ? `Repeats ${recurrence}. You'll be reminded when the next one is due.` : 'Recurring stopped.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not update the schedule.'),
  });

  // #149: add / edit / remove the matter's additional email recipients at any
  // time. The client's own address stays the To; these are CC'd on every
  // automated email for this matter (the backend strips the primary if entered).
  const editCcEmails = useMutation({
    mutationFn: (ccEmails: string[]) => setMatterCcEmails(taskId!, ccEmails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      toast.success('Email recipients updated.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not update the email recipients.'),
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

  // #116: reopen a completed step (admin-only). Rewinds the workflow to that step;
  // later steps revert to pending. Confirmed via the styled dialog first.
  const reopen = useMutation({
    mutationFn: (stepNumber: number) => reopenStep(taskId!, stepNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Step reopened — the workflow is back at that step.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not reopen the step.'),
  });
  const onReopen = async (stepNumber: number, stepTitle: string) => {
    const ok = await confirm({
      title: 'Reopen this step?',
      message: `The workflow will move back to "${stepTitle}". Any steps completed after it will return to pending and need to be done again. This is recorded on the activity log.`,
      confirmLabel: 'Reopen step',
      tone: 'danger',
    });
    if (ok) reopen.mutate(stepNumber);
  };

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

  const completed = task.status === 'completed';
  const stepDefs = definition?.steps ?? [];
  // #66: show the current step by its 1,2,3… display POSITION, not the raw
  // stepNumber (which can have gaps from deleted steps). Same position rule the
  // step list uses (displayNumberOf, #55) — just applied to the subtitle too.
  // Fall back to the DEFINITION's steps when the matter has no materialised
  // `steps` (a #94 creation-skipped-machine matter) so the count/position never
  // collapse to 0 ("Step 0 of 0").
  const numberSource = (task.steps && task.steps.length > 0) ? task.steps : stepDefs;
  const total = task.totalSteps ?? numberSource.length ?? 0;
  // #55: position follows the definition's AUTHORED order (the editor's sequence),
  // not the numeric stepNumber sort — steps inserted later keep high identity
  // numbers, so numeric order no longer matches the real flow. Steps missing from
  // the definition sort to the end by number (defensive).
  const authoredIdx = new Map(stepDefs.map((s, i) => [s.stepNumber, i]));
  const authPos = (n: number) => authoredIdx.get(n) ?? 1e9 + n;
  const orderedNums = [...numberSource]
    .sort((a, b) => authPos(a.stepNumber) - authPos(b.stepNumber))
    .map((s) => s.stepNumber);
  const currentDisplayNum = orderedNums.indexOf(task.currentStepNumber) + 1;
  // #139: for a CLIENT, the current step may be hidden ("Show to Client" off) —
  // the server strips it from both the step list and the definition, so it has no
  // position here. Never leak its raw number; say "In progress" instead.
  const progressLabel = completed
    ? `Completed · ${total} of ${total}`
    : currentDisplayNum > 0
      ? `Step ${currentDisplayNum} of ${total}`
      : `In progress · ${total} steps`;
  const currentDef = stepDefs.find((s) => s.stepNumber === task.currentStepNumber);

  // #148: a Team member must not see the Payments tab or ANY payment information.
  // The client keeps their own view of what they owe. The backend refuses the
  // payment endpoints for team_member regardless, so this is presentation only.
  // #168: a professional is an outside referrer — the client's fees are not
  // theirs to see, so Payments is hidden for them too.
  const canSeePayments = role !== 'team_member' && role !== 'professional';

  const TABS: { key: TabKey; label: string; icon: typeof ListChecks }[] = [
    { key: 'steps', label: 'Steps', icon: ListChecks },
    { key: 'documents', label: 'Documents', icon: FileText },
    ...(canSeePayments
      ? [{ key: 'payments' as const, label: 'Payments', icon: IndianRupee }]
      : []),
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
          /* #157: on mobile this cluster sits on its own full-width row under the
             title (see .page-header), so the two selects share the row evenly and
             keep their labels instead of being two unlabelled 140px stubs. */
          <div className="flex items-center gap-1.5 w-full md:w-auto">
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
            <label className="flex items-center gap-2 min-w-0 flex-1 md:flex-none">
              <span className="text-xs text-ink-muted shrink-0 hidden sm:inline">Matter owner</span>
              <span className="relative inline-flex items-center min-w-0 flex-1 md:flex-none">
                <select
                  aria-label="Matter owner"
                  className="input-field py-1.5 pr-8 text-sm w-full md:w-auto md:max-w-[140px]"
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
            <label className="flex items-center gap-2 min-w-0 flex-1 md:flex-none">
              <span className="text-xs text-ink-muted shrink-0 hidden sm:inline">Professional</span>
              <span className="relative inline-flex items-center min-w-0 flex-1 md:flex-none">
                <select
                  aria-label="Professional"
                  className="input-field py-1.5 pr-8 text-sm w-full md:w-auto md:max-w-[140px]"
                  value={task.professionalUid ?? ''}
                  disabled={assignProfessional.isPending}
                  onChange={(e) => assignProfessional.mutate(e.target.value || null)}
                >
                  <option value="">None</option>
                  {professionals.map((u) => (
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

      {/* Tabs — underline style.
          #159/#161: four tabs don't fit 390px side by side, so the row used to clip
          the last one to a sliver. Scrolling fixed the clipping but still hid a tab
          behind a swipe. Instead the row now DISTRIBUTES evenly on mobile: each tab
          is an equal-width cell (~97px of 390px) with the icon above a smaller
          label, so all four are visible at once with a large tap target and nothing
          to scroll. From sm up it returns to the original inline row. */}
      <div className="relative mb-4">
        {/* Column count follows the tab count (a team member has no Payments tab,
            #148), so the row always fills the width with no empty cell. */}
        <div
          className="grid sm:flex sm:items-center sm:gap-1 border-b border-hairline"
          style={{ gridTemplateColumns: `repeat(${TABS.length}, minmax(0, 1fr))` }}
        >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative sm:shrink-0 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-medium transition-colors -mb-px min-w-0 ${
                active ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <t.icon className={`w-4 h-4 shrink-0 ${active ? 'text-ink' : 'text-ink-faint'}`} />
              <span className="truncate max-w-full">{t.label}</span>
              <span
                className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-all ${
                  active ? 'bg-ink' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
        </div>
      </div>

      {tab === 'steps' && (
        <StepsTab
          task={task}
          definition={definition}
          stepDefs={stepDefs}
          currentDef={currentDef}
          completed={completed}
          role={{ isStaff, isClient, isExternalViewer, canOverrideClient: canAssign, isAdmin: role === 'admin', uid: currentUserUid }}
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
          // #116: admins can rewind the workflow to a completed step.
          onReopen={role === 'admin' ? onReopen : undefined}
        />
      )}
      {tab === 'documents' && <DocumentsPanel taskId={taskId!} isStaff={isStaff} workflowType={task.workflowType} />}
      {tab === 'discussion' && <DiscussionPanel taskId={taskId!} isStaff={isStaff} />}
      {tab === 'payments' && <PaymentsTab task={task} canEdit={canAssign} />}
      {/* Matter details (#153 organisation, #149 CC recipients) — admin/manager
          only. Deliberately placed LAST and collapsed by default: anything above
          the step content displaces it, and the #111 reminder picker needs room
          at the bottom of the viewport (it opens downward from the step rail).
          They are also NOT in the header action bar: that is `shrink-0`, so extra
          controls there push the page subtitle off-screen (#118).
          Both fields commit on Enter/blur; Escape reverts. */}
      {canAssign && (
        <CollapsibleSection
          id="matter-details"
          title="Matter details"
          hint="Organisation and additional email recipients"
          defaultOpen={false}
          className="card p-4 mt-4"
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-ink-muted">Organisation</span>
            <span className="relative flex items-center mt-1">
              <input
                type="text"
                aria-label="Organisation"
                className="input-field py-1.5 text-sm w-full"
                placeholder="—"
                maxLength={200}
                defaultValue={task.organisation ?? ''}
                key={`org-${task.organisation ?? ''}`} // resync on server change
                disabled={editOrganisation.isPending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                  else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.currentTarget.value = task.organisation ?? '';
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  const next = e.target.value.trim();
                  if (next === (task.organisation ?? '')) return; // no-op edit
                  editOrganisation.mutate(next || null);
                }}
              />
              {editOrganisation.isPending && <Loader2 className="w-4 h-4 animate-spin text-ink-faint absolute right-2" />}
            </span>
            <span className="block text-xs text-ink-faint mt-1">
              Editable at any time, including after the matter completes.
            </span>
          </label>

          {/* #167: recurring cadence. Nothing is created automatically — staff
              are reminded when the next one is due and duplicate it in one
              click, which rolls this schedule forward. */}
          <label className="block">
            <span className="text-xs text-ink-muted">Repeats</span>
            <span className="relative flex items-center mt-1">
              <select
                aria-label="Repeats"
                className="input-field py-1.5 text-sm w-full"
                value={task.recurrence ?? ''}
                disabled={editRecurrence.isPending}
                onChange={(e) => editRecurrence.mutate((e.target.value || null) as 'monthly' | 'quarterly' | null)}
              >
                <option value="">Does not repeat</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
              {editRecurrence.isPending && <Loader2 className="w-4 h-4 animate-spin text-ink-faint absolute right-8" />}
            </span>
            <span className="block text-xs text-ink-faint mt-1">
              {task.recurrence && task.recurrenceNextDueAt
                ? `Next due ${new Date(task.recurrenceNextDueAt).toLocaleDateString()} — you'll be reminded to duplicate it. Stops after a year.`
                : 'Reminds you to create the next one; nothing is created automatically.'}
            </span>
          </label>

          <label className="block">
            <span className="text-xs text-ink-muted">Additional client email addresses</span>
            <span className="relative flex items-center mt-1">
              <input
                type="text"
                aria-label="Additional client email addresses"
                className="input-field py-1.5 text-sm w-full"
                placeholder="accounts@example.com, cfo@example.com"
                defaultValue={formatCcEmails(task.ccEmails)}
                key={`cc-${formatCcEmails(task.ccEmails)}`} // resync on server change
                disabled={editCcEmails.isPending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                  else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.currentTarget.value = formatCcEmails(task.ccEmails);
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  const next = parseCcEmails(e.target.value);
                  if (formatCcEmails(next) === formatCcEmails(task.ccEmails)) return; // no-op
                  const problem = validateCcEmails(next);
                  if (problem) {
                    toast.error(problem);
                    e.target.value = formatCcEmails(task.ccEmails);
                    return;
                  }
                  editCcEmails.mutate(next);
                }}
              />
              {editCcEmails.isPending && <Loader2 className="w-4 h-4 animate-spin text-ink-faint absolute right-2" />}
            </span>
            <span className="block text-xs text-ink-faint mt-1">
              Copied (CC) on every email for this matter. The client&apos;s own address is the main recipient.
            </span>
          </label>

          {/* #181: additional PROFESSIONALS on this matter. Unlike the CC list
              above, these are not just email recipients — each address must be a
              Professional account, and being listed here grants that person
              view-only access to THIS matter only. */}
          <label className="block">
            <span className="text-xs text-ink-muted">Additional professional email addresses</span>
            <span className="relative flex items-center mt-1">
              <input
                type="text"
                aria-label="Additional professional email addresses"
                className="input-field py-1.5 text-sm w-full"
                placeholder="ca@firm.com, cs@firm.com"
                defaultValue={formatCcEmails(task.additionalProfessionalEmails)}
                key={`pro-${formatCcEmails(task.additionalProfessionalEmails)}`}
                disabled={editProEmails.isPending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                  else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.currentTarget.value = formatCcEmails(task.additionalProfessionalEmails);
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  const next = parseCcEmails(e.target.value);
                  if (formatCcEmails(next) === formatCcEmails(task.additionalProfessionalEmails)) return;
                  const problem = validateCcEmails(next);
                  if (problem) {
                    toast.error(problem);
                    e.target.value = formatCcEmails(task.additionalProfessionalEmails);
                    return;
                  }
                  editProEmails.mutate(next);
                }}
              />
              {editProEmails.isPending && <Loader2 className="w-4 h-4 animate-spin text-ink-faint absolute right-2" />}
            </span>
            <span className="block text-xs text-ink-faint mt-1">
              Each must already be a Professional account. They get view-only access to this matter — and no others.
            </span>
          </label>
        </div>
        </CollapsibleSection>
      )}
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
  task, definition, stepDefs, currentDef, completed, role, pending, onEvent, assignment, events, documents, onAttach, onOpenDoc, onReopen,
}: {
  task: Task;
  definition?: WorkflowDefinition;
  stepDefs: WorkflowStepDef[];
  currentDef?: WorkflowStepDef;
  completed: boolean;
  role: { isStaff: boolean; isClient: boolean; isExternalViewer?: boolean; canOverrideClient?: boolean; isAdmin?: boolean; uid?: string | null };
  pending: boolean;
  onEvent: (e: WorkflowEventInput) => void;
  assignment?: StepAssignment;
  events: TaskEvent[];
  documents: TaskDocument[];
  onAttach: () => void;
  onOpenDoc: (docId: string) => void;
  onReopen?: (stepNumber: number, stepTitle: string) => void; // #116 admin-only
}) {
  // A matter created before its step machine materialised (see #94) can arrive
  // with an EMPTY `steps` array while still having a valid `currentStepNumber`.
  // That produced "CURRENT STEP · 0", every stage "0/0 done", and an empty step
  // list. When `steps` is missing, synthesise the timeline from the workflow
  // DEFINITION instead: every defined step, with a status derived from the
  // matter's position — before current = completed, at current = active, after =
  // pending. The synthetic rows carry no per-step assignee/remark (there are no
  // instance records), which is correct — there's nothing recorded yet.
  const defForSteps = definition?.steps ?? [];
  // #55: the definition's AUTHORED array order is the real flow sequence — steps
  // inserted later in the editor keep high identity numbers, so a numeric sort no
  // longer matches the flow (e.g. the flow runs …3 → 37 → 38 → 4…). Everything
  // below (list order, display numbering, fallback statuses) follows authored
  // position; steps missing from the definition sort to the end by number.
  const authoredIdx = new Map(defForSteps.map((s, i) => [s.stepNumber, i]));
  const authPos = (n: number) => authoredIdx.get(n) ?? 1e9 + n;
  const allSteps: TaskStep[] = (task.steps && task.steps.length > 0)
    ? [...task.steps].sort((a, b) => authPos(a.stepNumber) - authPos(b.stepNumber))
    : defForSteps
        .map((d) => ({
          stepNumber: d.stepNumber,
          title: d.title,
          status: task.status === 'completed'
            || authPos(d.stepNumber) < authPos(task.currentStepNumber)
            ? 'completed'
            : d.stepNumber === task.currentStepNumber
              ? 'active'
              : 'pending',
        } as TaskStep));
  // #135: the CLIENT never sees SKIPPED steps — a step the workflow branched past
  // is internal noise to them. They see completed, current and pending only. Staff
  // still see skipped steps (they need the full trail). Filtering here means the
  // display numbering, stage counts and lists all renumber cleanly around them.
  const steps: TaskStep[] = role.isClient
    ? allSteps.filter((s) => s.status !== 'skipped')
    : allSteps;
  // #55: display steps in clean serial order (1,2,3,4…) by POSITION in the
  // visible, authored-ordered list — the stored `stepNumber` is identity only.
  const orderedStepNumbers = steps.map((s) => s.stepNumber);
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

  // #142 (generalises #105): the info card at the top of the CURRENT step shows
  // the latest comment that ARRIVED here — the previous step's hand-off comment
  // (its completing/approving comment) or a posted step note (from == to). That's
  // the "previous communication" the current owner should read before acting.
  // Visibility is enforced by the events feed itself: a client's feed only
  // carries client-visible comments (internal-only ones surface for staff alone),
  // and a client's own comment ('You') isn't echoed back to them — but it DOES
  // reach the internal team on the next step.
  const approvalNoteFor = (n: number): { text: string; by: string; at: string | null } | undefined => {
    const relevant = events
      .filter((e) => e.comment && e.toStep === n && e.byName !== 'You')
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
  // #120: the step's stage NAME — shown as a small tag on each timeline row so it's
  // clear which stage a step belongs to (the list is one flat timeline, no group
  // headers). Falls back to null when the workflow has no phases.
  const stageNameById = new Map(stages.map((st) => [st.id, st.name]));
  const stageNameOf = (stepNumber: number): string | null => {
    const pid = phaseIdOf.get(stepNumber);
    return pid ? stageNameById.get(pid) ?? null : null;
  };
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
  // #72: collapsible + drag-resizable Stages and Activity rails (persisted).
  // #119/#120: the Stages rail starts COLLAPSED. The step list is now a single
  // continuous timeline regardless of rail state (#120), so the rail is purely a
  // context + jump-to-stage aid — expanding it highlights a stage and its "Jump
  // to stage…" scrolls the timeline there; it no longer slices the list.
  const stagesRail = useRail('matterLayout:stages', { initial: 210, min: 150, max: 340, defaultCollapsed: true });
  const activityRail = useRail('matterLayout:activity', { initial: 320, min: 240, max: 520 });

  // #96/#120: completed/skipped steps can hide behind a "Show completed (N)" toggle.
  // DEFAULT to SHOWN (#120 feedback): with them hidden, a mid-flow matter's timeline
  // started at (say) "37. Checklist Sent to Client", which reads as broken — the
  // continuous 1..N sequence and its green ticks are the whole point. Users can
  // still collapse the done rows with "Hide completed".
  const [showCompleted, setShowCompleted] = useState(true);
  const isDoneStatus = (s: TaskStep) => s.status === 'completed' || s.status === 'skipped';
  // #101: owner (team/client/govt) per step, from the definition — drives the
  // coloured left edge on rows and the hero card tint.
  const ownerOf = (stepNumber: number): 'team' | 'client' | 'govt' => {
    const def = stepDefs.find((d) => d.stepNumber === stepNumber);
    return def ? deriveOwnerType(def) : 'team';
  };

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
      fallbackView={!!task.currentStepFallback}
    />
  ) : completed ? (
    <div className="card p-5 flex items-center gap-2.5 bg-emerald-50 border-emerald-100">
      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      <p className="text-sm text-emerald-700 font-medium">This service is complete.</p>
    </div>
  ) : role.isClient && isAdvanceable && !currentDef ? (
    // #139: the matter sits on a step hidden from the client ("Show to Client"
    // off) — the server strips it from everything the client receives, so there
    // is no currentDef. Show a calm generic card instead of the hidden step.
    <div className="card p-5 flex items-center gap-2.5">
      <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
      <p className="text-sm text-ink-muted">Our team is working on your service — no action is needed from you right now.</p>
    </div>
  ) : null;

  // Quieter sections below the hero — clearly separated by section headers.
  // #132: the step detail now shows only the LATEST comment; the full trail lives
  // here in Activity. The client sees this too now — but their `events` are already
  // filtered server-side to client-visible entries, so their Activity shows exactly
  // the comments marked "Visible to client" (the internal-only ops noise from #42
  // never reaches them).
  const activitySection = events.length > 0 && (
    <Section title="Activity" count={events.length} icon={<MessageSquare className="w-3.5 h-3.5" />}>
      <ActivityThreadCard events={events} definition={definition} currentStep={task.currentStepNumber} flush />
    </Section>
  );
  // #120: shared row renderer. Each row is a prominent status node (filled tick /
  // current ring / hollow pending) plus a small STAGE tag so it's clear which stage
  // the step belongs to in the single flat timeline.
  const renderStepRow = (step: TaskStep) => (
    <ExpandableStepRow
      key={step.stepNumber}
      step={step}
      displayNumber={displayNumberOf(step.stepNumber)}
      stageName={stageNameOf(step.stepNumber)}
      description={descFor(step.stepNumber)}
      statusLabel={statusFor(step.stepNumber)}
      isCurrent={step.stepNumber === task.currentStepNumber && !completed}
      owner={ownerOf(step.stepNumber)}
      ownerLabel={ownerLabel[ownerOf(step.stepNumber)]}
      // #138: a comment belongs to the step it was made ON (fromStep — the step
      // that was completed/acted on), NOT the step the move landed on. Matching
      // toStep too showed the previous step's comment on the current in-progress
      // step. (Comment-only STEP_NOTEs have fromStep === toStep, so they still
      // attach to their own step; the hero info box keeps its own arriving-note
      // logic via approvalNoteFor.)
      comments={events.filter((e) => e.comment && e.fromStep === step.stepNumber)}
      attachments={documents.filter((d) => d.stepNumber === step.stepNumber)}
      onOpenDoc={onOpenDoc}
      onReopen={onReopen}
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

  // #120/#55: the step list is ONE continuous vertical timeline — every step in
  // order, numbered 1..N (a gap-free display position across the whole matter, so
  // no "3 → 37" jumps), with a connecting progress line that runs green through
  // completed steps and dotted-grey ahead. Stage grouping was removed from this
  // list (the stakeholder asked for a single sequential timeline, not stage-wise
  // sections); the Stages rail is kept purely as jump-nav + per-stage progress.
  // A "Jump to stage…" picker scrolls the timeline to the first step of a stage.
  const stepsSection = (
    <Section
      title="All steps"
      icon={<ListChecks className="w-3.5 h-3.5" />}
      action={hasPhases ? (
        <StageJumpDropdown
          stages={stages}
          onJump={(i) => {
            setSelectedStage(i);
            const first = steps.find((s) => phaseIdOf.get(s.stepNumber) === stages[i]?.id);
            if (first != null) document.getElementById(`step-row-${first.stepNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
      ) : undefined}
    >
      {renderStepList(steps)}
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
  // #124/#117: don't nag from step 1. The balance is chased from a specific point
  // in the service — the alert starts only once the step carrying the
  // `REMIND_PART_PAYMENT` effect (the same setting that drives the reminder email,
  // #76) has been COMPLETED (stakeholder: e.g. after "Name Approval Received").
  // Workflows with no such step configured keep the previous always-on behaviour.
  // It stops automatically once the balance is cleared (paymentStatus is no longer
  // part_paid) — and it never shows for Full/No Payment matters, which are not
  // `part_paid` in the first place.
  const partPaymentFromStep = stepDefs.find((s) => (s.effects ?? []).includes('REMIND_PART_PAYMENT'))?.stepNumber;
  const partPaymentDue = partPaymentFromStep == null
    || allSteps.find((s) => s.stepNumber === partPaymentFromStep)?.status === 'completed';
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
  STEP_NOTE: 'shared a note', // #105
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
  // #73/#55: the definition's AUTHORED array order IS the flow sequence. Sorting
  // numerically broke "immediately previous" once steps were rearranged in the
  // editor (they keep their original identity numbers), so the Activity panel
  // defaulted to the wrong step's activity.
  const orderedDefNums = (definition?.steps ?? []).map((s) => s.stepNumber);
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
  taskId, step, role, pending, onEvent, assignment, currentAssignee, currentAssigneeName, displayNumber, turn, stepUrgent, onAttach, statusLabel, description, approvalNote, fallbackView = false,
}: {
  taskId: string;
  step: WorkflowStepDef;
  role: { isStaff: boolean; isClient: boolean; isExternalViewer?: boolean; canOverrideClient?: boolean; isAdmin?: boolean; uid?: string | null };
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
  /** #139: client fallback view — the shown step is the last visible one, not actionable. */
  fallbackView?: boolean;
}) {
  // #144: an AUTHORED final step (real internal work, e.g. "Final Incorporation
  // Master Sheet update") carries NO transitions in the stored definition — the
  // compiler synthesises its COMPLETE_STEP → terminal edge. Mirror that here, or
  // the step would render with no action and staff could never finish it.
  const events = new Set((step.transitions ?? []).map((t) => t.event));
  if (step.type === 'final' && events.size === 0) events.add('COMPLETE_STEP');
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

  // #139: the client is looking at the LAST visible step while the real current
  // step is hidden ("Show to Client" off). The step shows as in progress, but it
  // is not actually actionable — no buttons, just a calm progress note.
  if (fallbackView) {
    actions = null;
    wait = <WaitNote text="Our team is working on your service — no action is needed from you right now." />;
  }

  // Right-side meta block (shared by desktop column + mobile stack). The
  // Step-owner section is INTERNAL — clients never see who on our team owns a
  // step (E12-S01). It only renders for staff.
  const metaBlock = (
    <div className="space-y-4">
      {!role.isExternalViewer && (
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

          {/* #142 (generalises #105): the previous step's latest comment carried
              forward as an info card — the "previous communication" the current
              owner reads before acting. Shown to BOTH roles on ANY step; the
              events feed already enforces visibility (a client only ever receives
              client-visible comments, and a client's own comment reaches the
              team, not themselves). Hidden when there's nothing to show. */}
          {approvalNote && (
            <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50/60 p-4">
              <p className="text-xs font-semibold text-brand-800 inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {role.isClient ? 'Shared by our team' : 'From the previous step'}
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

function ExpandableStepRow({ step, displayNumber, stageName, description, statusLabel, isCurrent, owner, ownerLabel, comments = [], attachments = [], onOpenDoc, onReopen }: {
  step: TaskStep;
  displayNumber: number;
  stageName?: string | null; // #120: which stage this step belongs to (shown as a tag)
  description?: string;
  statusLabel?: string; // #81: audience-specific status text
  isCurrent: boolean;
  owner?: 'team' | 'client' | 'govt'; // #101: ball owner → left-edge colour
  ownerLabel?: string; // #101/#92: audience-aware owner label for the tooltip ("You" for a client)
  comments?: TaskEvent[];
  attachments?: TaskDocument[];
  onOpenDoc?: (docId: string) => void;
  onReopen?: (stepNumber: number, stepTitle: string) => void; // #116 admin-only, completed steps
}) {
  const s = STATUS[step.status] ?? STATUS.pending;
  const skipped = step.status === 'skipped';
  // Expandable when there's anything to show: a remark, completion info, comments,
  // or attachments — on completed AND in-progress steps.
  // #116: an admin can reopen a COMPLETED step (rewind the workflow to it).
  const canReopen = !!onReopen && step.status === 'completed';
  const hasDetails = !!(step.remark || step.completedAt || comments.length || attachments.length);
  const expandable = hasDetails || canReopen;
  const [open, setOpen] = useState(false);
  // #132: only the latest comment shows in the step detail; the rest are in Activity.
  const latestComment = comments.length
    ? [...comments].sort((a, b) => (a.at ?? '').localeCompare(b.at ?? '')).at(-1)
    : undefined;
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
  const isDone = step.status === 'completed';
  // #120: the status node is a prominent CIRCLE, not a small line marker — a filled
  // green disc with a white tick for a completed step, a brand ring with a filled
  // dot for the current step, a muted slash for a skipped step, and a hollow grey
  // ring for a pending step. This is the primary at-a-glance status cue the
  // stakeholder asked for (the connecting line was removed).
  const nodeCls = isDone
    ? 'bg-emerald-500 border-emerald-500 text-white'
    : skipped
      ? 'bg-transparent border-hairline text-ink-faint'
      : isCurrent
        ? 'bg-brand-50 border-brand-500 text-brand-600'
        : 'bg-transparent border-hairline text-transparent';
  return (
    <div
      id={`step-row-${step.stepNumber}`}
      className={`relative ${isCurrent ? 'bg-surface-soft' : ''}`}
      title={edge ? `${ownerLabel ?? edge.label} step` : undefined}
    >
      {edge && <span aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-1 ${edge.dot}`} />}
      <button
        onClick={() => expandable && setOpen((v) => !v)}
        className={`w-full flex items-start gap-3 px-5 py-3 text-left ${expandable ? 'hover:bg-surface-soft/60' : 'cursor-default'}`}
      >
        {/* #120: prominent status node — a 24px circle whose fill/ring encodes the
            step status. Completed shows a bold white tick; current a filled dot. */}
        <span
          aria-hidden="true"
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${nodeCls}`}
        >
          {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} />
            : skipped ? <CircleSlash className="w-3.5 h-3.5" />
            : isCurrent ? <span className="w-2 h-2 rounded-full bg-brand-600" />
            : null}
        </span>
        <div className="min-w-0 flex-1">
          {/* #120: small stage tag so it's clear which stage the step belongs to. */}
          {stageName && (
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint mb-0.5">{stageName}</p>
          )}
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
          {/* #137: step.remark is NOT rendered here — the completing transition
              stores the same text as its event comment, so the remark box showed
              every comment TWICE (once here, once under "Latest comment"). The
              Latest comment section below is the single place a comment renders. */}

          {/* #132: show ONLY the LATEST comment per step (both screens) — the full
              per-step history was cluttered and hard to review. Earlier comments
              live in the Activity history. */}
          {latestComment && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Latest comment</p>
              <div className="text-sm text-ink-muted bg-surface-soft rounded-lg px-3 py-2">
                <RichText html={latestComment.comment ?? ''} className="text-ink-soft" />
                <span className="block text-[11px] text-ink-faint mt-0.5">{latestComment.byName}{latestComment.at ? ` · ${relTime(latestComment.at)}` : ''}</span>
              </div>
              {comments.length > 1 && (
                <p className="text-[11px] text-ink-faint">
                  +{comments.length - 1} earlier {comments.length - 1 === 1 ? 'comment' : 'comments'} in Activity history
                </p>
              )}
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

          {/* #116: admin-only — rewind the workflow back to this completed step. */}
          {canReopen && (
            <button
              onClick={(e) => { e.stopPropagation(); onReopen!(step.stepNumber, step.title); }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reopen step
            </button>
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

// Payment modes offered in the editor (#78) — shared with Create Matter (#145)
// so the two lists cannot drift. See `lib/paymentModes.ts`.

function PaymentsTab({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const p = PAYMENT[task.paymentStatus] ?? PAYMENT.not_paid;

  const [editing, setEditing] = useState(false);
  const [totalCost, setTotalCost] = useState(String(task.totalCost ?? task.amountPaid ?? 0));
  const [amountPaid, setAmountPaid] = useState(String(task.amountPaid ?? 0));
  const [paymentMode, setPaymentMode] = useState(task.paymentMode ?? '');
  const [paymentDescription, setPaymentDescription] = useState(task.paymentDescription ?? ''); // #147

  const startEdit = () => {
    setTotalCost(String(task.totalCost ?? task.amountPaid ?? 0));
    setAmountPaid(String(task.amountPaid ?? 0));
    setPaymentMode(task.paymentMode ?? '');
    setPaymentDescription(task.paymentDescription ?? '');
    setEditing(true);
  };

  const save = useMutation({
    mutationFn: () => updatePayment(task.id, {
      totalCost: Number(totalCost) || 0,
      amountPaid: Number(amountPaid) || 0,
      paymentMode: paymentMode.trim() || null,
      paymentDescription: paymentDescription.trim() || null, // #147
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
    <div className="space-y-4">
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
          {/* #147: how the payment arrived — only shown when recorded. */}
          {task.paymentDescription && (
            <div className="mt-4">
              <p className="text-xs text-ink-muted">Payment description</p>
              <p className="text-sm text-ink whitespace-pre-wrap">{task.paymentDescription}</p>
            </div>
          )}
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
            <select value={(PAYMENT_MODES as readonly string[]).includes(paymentMode) || paymentMode === '' ? paymentMode : 'Other'}
              onChange={(e) => setPaymentMode(e.target.value === 'Other' ? '' : e.target.value)}
              className="input-field mt-1">
              <option value="">— Not set —</option>
              {PAYMENT_MODES.map((m) => <option key={m} value={m === 'Other' ? 'Other' : m}>{m}</option>)}
            </select>
          </label>
          {/* #147: editable note for payments split across modes. */}
          <label className="block">
            <span className="text-xs text-ink-muted">Payment description</span>
            <textarea
              aria-label="Payment description"
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              className="input-field mt-1 w-full resize-y"
              placeholder="e.g. Received ₹1,000 via UPI and ₹500 in Cash."
            />
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

    {/* #148: the payment LEDGER — clients pay in instalments, so every payment
        received is its own record rather than one overwritten latest figure. */}
    <PaymentHistory task={task} canEdit={canEdit} />
    </div>
  );
}

/**
 * #148 — Payment History. Each payment received is recorded separately with its
 * date, amount, mode and the balance remaining after it. The task's amountPaid /
 * amountDue / paymentStatus are rollups the backend recomputes from this ledger,
 * so recording a payment here is what keeps the summary above honest.
 *
 * Admin/manager only: the tab itself is hidden from Team, and the API refuses
 * them regardless.
 */
function paymentDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function PaymentHistory({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<string>(PAYMENT_MODES[0]);
  const [paidAt, setPaidAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['payments', task.id],
    queryFn: () => getPayments(task.id),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['payments', task.id] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['task-events', task.id] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const resetForm = () => {
    setAmount(''); setMode(PAYMENT_MODES[0]);
    setPaidAt(new Date().toISOString().slice(0, 10));
    setReference(''); setNotes('');
  };

  const add = useMutation({
    mutationFn: () => recordPayment(task.id, {
      amount: Number(amount) || 0,
      mode,
      paidAt: new Date(paidAt).toISOString(),
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
    }),
    onSuccess: () => {
      toast.success('Payment recorded.');
      setAdding(false);
      resetForm();
      refresh();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not record the payment.'),
  });

  const remove = useMutation({
    mutationFn: (paymentId: string) => deletePaymentEntry(task.id, paymentId),
    onSuccess: () => { toast.success('Payment removed.'); refresh(); },
    onError: (err: Error) => toast.error(err.message || 'Could not remove the payment.'),
  });

  const payments = data?.payments ?? [];
  const amountNum = Number(amount) || 0;
  const remaining = data?.amountDue ?? 0;
  const exceeds = amountNum > remaining;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Payment history</p>
          <p className="text-xs text-ink-muted mt-0.5">
            Every payment received, in the order it arrived.
          </p>
        </div>
        {canEdit && !adding && (
          <button onClick={() => setAdding(true)} className="btn-secondary text-xs py-1 px-2">
            Record payment
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-4 space-y-3 border-b border-hairline pb-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-ink-muted">Amount received (₹)</span>
              <input
                type="number" min="0" step="0.01" value={amount} aria-label="Amount received"
                onChange={(e) => setAmount(e.target.value)} className="input-field mt-1"
              />
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Payment date</span>
              <input
                type="date" value={paidAt} aria-label="Payment date"
                onChange={(e) => setPaidAt(e.target.value)} className="input-field mt-1"
              />
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Payment mode</span>
              <select
                value={mode} aria-label="Payment mode"
                onChange={(e) => setMode(e.target.value)} className="input-field mt-1"
              >
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Reference (optional)</span>
              <input
                type="text" value={reference} maxLength={200} aria-label="Reference"
                onChange={(e) => setReference(e.target.value)} className="input-field mt-1"
                placeholder="UTR / cheque no."
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-ink-muted">Notes (optional)</span>
            <input
              type="text" value={notes} maxLength={1000} aria-label="Payment notes"
              onChange={(e) => setNotes(e.target.value)} className="input-field mt-1"
            />
          </label>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted">
              Remaining due: <span className="font-semibold text-ink">₹{remaining.toLocaleString('en-IN')}</span>
            </span>
            {exceeds && <span className="text-red-600">Exceeds the amount still due</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={add.isPending || amountNum <= 0 || exceeds}
              onClick={() => add.mutate()}
              className="btn-primary disabled:opacity-50"
            >
              {add.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save payment
            </button>
            <button
              disabled={add.isPending}
              onClick={() => { setAdding(false); resetForm(); }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && <p className="text-sm text-ink-faint mt-4">Loading payment history…</p>}
      {isError && <p className="text-sm text-red-600 mt-4">Could not load the payment history.</p>}

      {!isLoading && !isError && payments.length === 0 && (
        <p className="text-sm text-ink-muted mt-4">No payments recorded yet.</p>
      )}

      {payments.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                <th className="pb-2 pr-3 font-medium">Date</th>
                <th className="pb-2 pr-3 font-medium">Amount</th>
                <th className="pb-2 pr-3 font-medium">Mode</th>
                <th className="pb-2 pr-3 font-medium">Due after</th>
                <th className="pb-2 pr-3 font-medium">Recorded by</th>
                {canEdit && <th className="pb-2 font-medium sr-only">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 pr-3 text-ink-muted whitespace-nowrap">{paymentDate(p.paidAt)}</td>
                  <td className="py-2 pr-3 font-semibold text-ink whitespace-nowrap">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 pr-3 text-ink-muted">{p.mode || '—'}</td>
                  <td className="py-2 pr-3 text-ink-muted whitespace-nowrap">
                    ₹{p.dueAfter.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 pr-3 text-ink-muted truncate max-w-[140px]">
                    {p.recordedByName || '—'}
                    {p.reference && <span className="block text-xs text-ink-faint">{p.reference}</span>}
                  </td>
                  {canEdit && (
                    <td className="py-2 text-right">
                      <button
                        onClick={() => remove.mutate(p.id)}
                        disabled={remove.isPending}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        aria-label={`Remove payment of ₹${p.amount}`}
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-hairline">
                <td className="pt-2 pr-3 text-xs text-ink-muted">Total</td>
                <td className="pt-2 pr-3 text-sm font-semibold text-ink">
                  ₹{(data?.amountPaid ?? 0).toLocaleString('en-IN')}
                </td>
                <td className="pt-2 pr-3" />
                <td className="pt-2 pr-3 text-sm font-semibold text-ink">
                  ₹{(data?.amountDue ?? 0).toLocaleString('en-IN')}
                </td>
                <td className="pt-2 pr-3" />
                {canEdit && <td className="pt-2" />}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
