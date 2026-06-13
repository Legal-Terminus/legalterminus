import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, CheckCircle2, Circle, CircleSlash, Loader2, PlayCircle,
  CreditCard, ShieldCheck, ThumbsUp, ThumbsDown, Landmark, GitBranch,
  ListChecks, FileText, IndianRupee,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useAuthStore } from '../../store/authStore';
import { getTask, advanceTask, assignStep, type WorkflowEventInput } from '../../api/tasks';
import { getAllUsers, displayName, type PortalUser } from '../../api/users';
import { getWorkflowDefinition, type WorkflowStepDef, type WorkflowDefinition } from '../../api/workflowDefinitions';
import TaskJourneyTracker from './TaskJourneyTracker';
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
  const role = useAuthStore((s) => s.role);
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

  const advance = useMutation({
    mutationFn: (event: WorkflowEventInput) => advanceTask(taskId!, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: Error) => window.alert(err.message || 'Could not advance the task.'),
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
    onError: (err: Error) => window.alert(err.message || 'Could not assign this step.'),
  });

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
        <button onClick={() => navigate('/tasks')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      }
    >
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
          role={{ isStaff, isClient }}
          pending={advance.isPending}
          onEvent={(e) => advance.mutate(e)}
          assignment={canAssign ? {
            staff,
            assigning: assign.isPending,
            onAssign: (stepNumber, assignedTo) => assign.mutate({ stepNumber, assignedTo }),
          } : undefined}
        />
      )}
      {tab === 'documents' && <DocumentsTab />}
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

/* ── Steps tab ─────────────────────────────────────────────────────────────── */

interface StepAssignment {
  staff: PortalUser[];
  assigning: boolean;
  onAssign: (stepNumber: number, assignedTo: string | null) => void;
}

function StepsTab({
  task, definition, stepDefs, currentDef, completed, role, pending, onEvent, assignment,
}: {
  task: Task;
  definition?: WorkflowDefinition;
  stepDefs: WorkflowStepDef[];
  currentDef?: WorkflowStepDef;
  completed: boolean;
  role: { isStaff: boolean; isClient: boolean };
  pending: boolean;
  onEvent: (e: WorkflowEventInput) => void;
  assignment?: StepAssignment;
}) {
  const steps = task.steps ?? [];
  const currentAssignee = steps.find((s) => s.stepNumber === task.currentStepNumber)?.assignedTo ?? null;
  // Lookup description by step number from the definition.
  const descFor = (n: number) => stepDefs.find((s) => s.stepNumber === n)?.description;
  // The tracker owns the completion banner when it renders (phases configured);
  // otherwise fall back to a standalone banner so completion is never hidden.
  const trackerShown = !!definition && (definition.phases?.length ?? 0) > 0;

  return (
    <>
      {/* Journey overview — rail + next-stop + ownership, above the detailed list. */}
      {definition && (
        <TaskJourneyTracker
          task={task}
          definition={definition}
          currentDef={currentDef}
          completed={completed}
          isClient={role.isClient}
        />
      )}

      {completed && !trackerShown && (
        <div className="card p-4 mb-5 flex items-center gap-2.5 bg-emerald-50 border-emerald-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <p className="text-sm text-emerald-700 font-medium">This service is complete.</p>
        </div>
      )}

      {!completed && currentDef ? (
        <CurrentStepActions
          step={currentDef}
          role={role}
          pending={pending}
          onEvent={onEvent}
          assignment={assignment}
          currentAssignee={currentAssignee}
        />
      ) : null}

      <div className="card divide-y divide-hairline-soft">
        {steps.map((step) => (
          <StepRow
            key={step.stepNumber}
            step={step}
            description={descFor(step.stepNumber)}
            isCurrent={step.stepNumber === task.currentStepNumber && !completed}
          />
        ))}
      </div>
    </>
  );
}

/** Action buttons for the current step, derived from the definition. */
function CurrentStepActions({
  step, role, pending, onEvent, assignment, currentAssignee,
}: {
  step: WorkflowStepDef;
  role: { isStaff: boolean; isClient: boolean };
  pending: boolean;
  onEvent: (e: WorkflowEventInput) => void;
  assignment?: StepAssignment;
  currentAssignee?: string | null;
}) {
  const events = new Set((step.transitions ?? []).map((t) => t.event));
  const spin = <Loader2 className="w-4 h-4 animate-spin" />;
  const isClientStep = events.has('CLIENT_APPROVE');
  const isGovtStep = events.has('GOVT_APPROVE');

  // Reject/approve actions can carry a comment.
  const fireWithComment = (type: WorkflowEventInput['type'], promptText: string, required = false) => {
    const c = window.prompt(promptText) ?? '';
    if (required && !c.trim()) return; // cancelled / empty when required
    onEvent({ type, remark: c.trim() || undefined });
  };

  let body: React.ReactNode = null;

  if (step.type === 'payment_gate') {
    body = role.isStaff ? (
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} onClick={() => onEvent({ type: 'RECORD_PAYMENT', newStatus: 'fully_paid' })} className="btn-primary disabled:opacity-50">
          {pending ? spin : <CreditCard className="w-4 h-4" />} Record Payment (stub)
        </button>
        <button disabled={pending} onClick={() => fireWithComment('ADMIN_OVERRIDE_PAYMENT', 'Reason for override (optional):')} className="btn-secondary disabled:opacity-50">
          <ShieldCheck className="w-4 h-4" /> Admin Override
        </button>
      </div>
    ) : <WaitNote text="Waiting for payment to be recorded." />;
  } else if (step.type === 'branch') {
    const branches = [...new Set((step.transitions ?? []).filter((t) => t.branch).map((t) => t.branch!))];
    body = role.isStaff ? (
      <div className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <button key={b} disabled={pending} onClick={() => onEvent({ type: 'BRANCH_DECISION', branch: b })} className="btn-secondary disabled:opacity-50">
            <GitBranch className="w-4 h-4" /> {b.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    ) : <WaitNote text="Our team is processing the next step." />;
  } else if (isClientStep) {
    body = role.isClient ? (
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} onClick={() => onEvent({ type: 'CLIENT_APPROVE' })} className="btn-primary disabled:opacity-50">
          {pending ? spin : <ThumbsUp className="w-4 h-4" />} Approve
        </button>
        <button disabled={pending} onClick={() => fireWithComment('CLIENT_REJECT', 'What changes would you like? (please describe):', true)} className="btn-secondary disabled:opacity-50">
          <ThumbsDown className="w-4 h-4" /> Request Changes
        </button>
      </div>
    ) : <WaitNote text="Waiting for the client to approve." />;
  } else if (isGovtStep) {
    body = role.isStaff ? (
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} onClick={() => onEvent({ type: 'GOVT_APPROVE' })} className="btn-primary disabled:opacity-50">
          {pending ? spin : <Landmark className="w-4 h-4" />} Govt Approved
        </button>
        <button disabled={pending} onClick={() => fireWithComment('GOVT_REJECT', 'Reason / department remarks:', true)} className="btn-secondary disabled:opacity-50">
          <Landmark className="w-4 h-4" /> Govt Rejected
        </button>
      </div>
    ) : <WaitNote text="Awaiting the government department response." />;
  } else if (events.has('COMPLETE_STEP')) {
    body = role.isStaff ? (
      <button disabled={pending} onClick={() => onEvent({ type: 'COMPLETE_STEP' })} className="btn-primary disabled:opacity-50">
        {pending ? spin : <PlayCircle className="w-4 h-4" />} Complete Step
      </button>
    ) : <WaitNote text="Our team is working on this step." />;
  }

  return (
    <div className="card p-5 mb-5">
      <p className="text-xs text-ink-muted">Current step</p>
      <p className="text-sm font-semibold text-ink">{step.stepNumber}. {step.title}</p>
      {step.description && <p className="text-sm text-ink-muted mt-1 mb-3">{step.description}</p>}
      {body}
      {assignment && (
        <AssigneePicker
          stepNumber={step.stepNumber}
          staff={assignment.staff}
          value={currentAssignee ?? null}
          disabled={assignment.assigning}
          onChange={(uid) => assignment.onAssign(step.stepNumber, uid)}
        />
      )}
    </div>
  );
}

/** Assign the current step to a staff member (or unassign). Admin/manager only. */
function AssigneePicker({ stepNumber, staff, value, disabled, onChange }: {
  stepNumber: number;
  staff: PortalUser[];
  value: string | null;
  disabled: boolean;
  onChange: (uid: string | null) => void;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-hairline-soft flex items-center gap-2">
      <label htmlFor={`assignee-${stepNumber}`} className="text-xs text-ink-muted shrink-0">Assigned to</label>
      <select
        id={`assignee-${stepNumber}`}
        className="input-field py-1.5 text-sm max-w-xs"
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Unassigned</option>
        {staff.map((u) => (
          <option key={u.uid} value={u.uid}>{displayName(u)}</option>
        ))}
      </select>
    </div>
  );
}

function WaitNote({ text }: { text: string }) {
  return <p className="text-sm text-ink-muted">{text}</p>;
}

const STATUS: Record<StepStatus, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'text-ink-faint' },
  active:    { label: 'In progress', cls: 'text-brand-700' },
  completed: { label: 'Done',      cls: 'text-emerald-700' },
  blocked:   { label: 'Blocked',   cls: 'text-amber-700' },
  skipped:   { label: 'Skipped',   cls: 'text-ink-faint' },
};

function StepRow({ step, description, isCurrent }: { step: TaskStep; description?: string; isCurrent: boolean }) {
  const s = STATUS[step.status] ?? STATUS.pending;
  const skipped = step.status === 'skipped';
  const Icon = step.status === 'completed' ? CheckCircle2 : skipped ? CircleSlash : isCurrent ? PlayCircle : Circle;
  return (
    <div className={`flex items-start gap-3 px-5 py-3 ${isCurrent ? 'bg-surface-soft' : ''}`}>
      <Icon
        className={`w-4 h-4 mt-0.5 shrink-0 ${
          step.status === 'completed'
            ? 'text-emerald-600'
            : skipped
              ? 'text-ink-faint'
              : isCurrent
                ? 'text-brand-600'
                : 'text-ink-faint'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${isCurrent ? 'font-semibold text-ink' : 'text-ink-soft'}`}>
          {step.stepNumber}. {step.title}
        </p>
        {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
        {step.remark && <p className="text-xs text-amber-700 mt-1">“{step.remark}”</p>}
      </div>
      <span className={`text-xs font-medium shrink-0 ${s.cls}`}>{s.label}</span>
    </div>
  );
}

/* ── Documents tab (scaffold — E05 deferred) ───────────────────────────────── */

function DocumentsTab() {
  return (
    <div className="card p-12 text-center">
      <FileText className="w-10 h-10 text-hairline mx-auto mb-3" />
      <p className="text-sm font-medium text-ink">Documents</p>
      <p className="text-sm text-ink-muted mt-1">
        Uploading and reviewing documents for each step is coming soon.
      </p>
      <button disabled className="btn-secondary mt-4 opacity-50 cursor-not-allowed">
        Attach document (coming soon)
      </button>
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
        Online payment and receipts are coming soon. Payments are currently recorded by the team.
      </p>
    </div>
  );
}
