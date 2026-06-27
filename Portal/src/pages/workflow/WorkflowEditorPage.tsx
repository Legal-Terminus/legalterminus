import { useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Save, AlertTriangle, Loader2, ChevronRight, Crosshair,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import FieldLabel from '../../components/common/FieldLabel';
import { useToast } from '../../components/common/toastContext';
import { useConfirm } from '../../components/common/confirmContext';
import WorkflowDiagram from '../../components/workflow/WorkflowDiagram';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  getWorkflowDefinitions, getWorkflowDefinition, updateWorkflowDefinition, createWorkflowDefinition,
  type WorkflowDefinition, type WorkflowStepDef, type PhaseDef,
} from '../../api/workflowDefinitions';
import { outcomeColor } from '../../workflows/machineToGraph';
import { getServiceCatalog } from '../../api/services';
import { compileDefinition } from '@shared/workflows/compileDefinition.js';

/**
 * Workflow Editor (E10-S01) — plain-language authoring for non-technical admins.
 * The UI talks in human terms ("What kind of step?", "What happens next?",
 * automatic-action toggles, named step pickers) and GENERATES the engine model
 * (transitions/effects/types) underneath — so nobody edits raw event codes or step
 * numbers. A collapsed "Advanced (raw)" panel per step exposes the underlying data
 * for power users. Supports both EDITING an existing workflow (/services/:key/edit)
 * and CREATING a new one (?new=1&service=<key> or ?new=1).
 */

// ─── Plain-language vocab ──────────────────────────────────────────────────────
// "Step kind" is a friendly grouping over the engine `type` + the transition events
// a step uses. We DERIVE kind from the step's shape, and changing kind rewires the
// step's default transitions appropriately.
type StepKind = 'work' | 'client' | 'govt' | 'payment' | 'branch' | 'final';

const KIND_LABEL: Record<StepKind, string> = {
  work: 'Work step (our team)',
  client: 'Client action (approve / sign / upload)',
  govt: 'Government / department wait',
  payment: 'Payment checkpoint',
  branch: 'Split into options',
  final: 'Final step (workflow ends)',
};

const KIND_HINT: Record<StepKind, string> = {
  work: 'Your team does something, then the workflow moves on.',
  client: 'The client approves, signs, or uploads. They can usually Approve or Request changes.',
  govt: 'Waiting on a government department to approve or reject.',
  payment: 'Pause until payment is received before continuing.',
  branch: 'The step splits into named options, each going to a different next step.',
  final: 'The last step — the workflow is complete here.',
};

function stepKindOf(s: WorkflowStepDef): StepKind {
  if (s.type === 'payment_gate') return 'payment';
  if (s.type === 'branch') return 'branch';
  if (s.type === 'final') return 'final';
  const events = new Set((s.transitions ?? []).map((t) => t.event));
  if (events.has('CLIENT_APPROVE')) return 'client';
  if (events.has('GOVT_APPROVE')) return 'govt';
  return 'work';
}

// Curated "automatic actions" (effects) with human labels. Unknown/legacy effects
// are preserved (shown read-only in Advanced) so nothing is silently dropped.
const KNOWN_EFFECTS: { id: string; label: string; hint: string }[] = [
  { id: 'SEND_EMAIL', label: 'Email the client when this step starts', hint: 'Sends the client an email as soon as this step becomes active.' },
  { id: 'NOTIFY_CLIENT_RESUBMISSION', label: 'Notify the client of a resubmission requirement', hint: 'Alerts the client that the department asked for a resubmission (info/documents).' },
];

// ─── Local validation (plain-language; mirrors shared validateDefinition) ──────
function validate(def: WorkflowDefinition): string[] {
  const errors: string[] = [];
  const titleOf = (n: number) => def.steps.find((s) => s.stepNumber === n)?.title ?? `step ${n}`;
  if (!def.name?.trim()) errors.push('Give the workflow a name.');
  if (!def.steps.length) errors.push('Add at least one step.');

  const numbers = new Set<number>();
  for (const s of def.steps) {
    if (numbers.has(s.stepNumber)) errors.push(`Two steps share the same number (${s.stepNumber}).`);
    numbers.add(s.stepNumber);
    if (!s.title?.trim()) errors.push(`A step is missing a title.`);
    if (s.type === 'payment_gate' && s.gate) {
      if (!def.steps.some((x) => x.stepNumber === s.gate!.onPass))
        errors.push(`"${s.title}": the "if paid" step doesn't exist — pick a valid step.`);
      if (!def.steps.some((x) => x.stepNumber === s.gate!.onWait))
        errors.push(`"${s.title}": the "if not paid" step doesn't exist — pick a valid step.`);
    }
  }
  for (const s of def.steps) {
    for (const t of s.transitions ?? []) {
      if (!def.steps.some((x) => x.stepNumber === t.to))
        errors.push(`"${s.title}" points to a step that doesn't exist — pick a valid next step.`);
    }
  }
  if (!def.steps.some((x) => x.stepNumber === def.initialStep))
    errors.push(`The starting step (${titleOf(def.initialStep)}) isn't in the list.`);

  const phaseIds = new Set((def.phases ?? []).map((p) => p.id));
  for (const s of def.steps) {
    if (s.phaseId && !phaseIds.has(s.phaseId))
      errors.push(`"${s.title}" is in a stage that no longer exists — pick a stage or none.`);
  }
  return errors;
}

const emptyDefinition = (id: string, serviceKey?: string): WorkflowDefinition => ({
  id,
  name: '',
  version: 1,
  initialStep: 1,
  serviceKeys: serviceKey ? [serviceKey] : [],
  phases: [],
  steps: [
    { stepNumber: 1, title: 'First step', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
    { stepNumber: 2, title: 'Done', type: 'final' },
  ],
});

export default function WorkflowEditorPage() {
  const { serviceKey } = useParams<{ serviceKey: string }>();
  const [searchParams] = useSearchParams();
  // Create mode: the dedicated /workflows/new route (no serviceKey) or ?new=1.
  const isCreate = !serviceKey || searchParams.get('new') === '1';
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: defs } = useQuery({
    queryKey: ['workflow-definitions'],
    queryFn: getWorkflowDefinitions,
    staleTime: 5 * 60 * 1000,
  });
  const definitionId = useMemo(
    () => defs?.find((d) => d.serviceKeys.includes(serviceKey ?? ''))?.id,
    [defs, serviceKey],
  );

  // Service catalog — for the required "which service?" picker in create mode. Only
  // offer services that don't already have a workflow (one workflow per service).
  const { data: catalog } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    enabled: isCreate,
    staleTime: 5 * 60 * 1000,
  });
  const takenServiceKeys = useMemo(
    () => new Set((defs ?? []).flatMap((d) => d.serviceKeys)),
    [defs],
  );
  const availableServices = useMemo(() => {
    if (!catalog) return [];
    return Object.values(catalog.services)
      .filter((s) => s.active && !takenServiceKeys.has(s.key))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [catalog, takenServiceKeys]);

  const { data: serverDef, isLoading } = useQuery({
    queryKey: ['workflow-definition', definitionId],
    queryFn: () => getWorkflowDefinition(definitionId!),
    enabled: !isCreate && Boolean(definitionId),
  });

  // A stable id for a newly-created workflow (generated once, not during render).
  const [newId] = useState(() => `wf-${Date.now()}`);

  // The step currently being edited — highlights (colour only) in the live preview.
  const [activeStepNumber, setActiveStepNumber] = useState<number | null>(null);
  // One-shot "centre the chart on this step" request (locate-in-chart button). The
  // nonce lets the same step be re-located on repeated clicks.
  const [centerToken, setCenterToken] = useState<{ step: number; nonce: number } | null>(null);
  const locateStep = (stepNumber: number) => {
    setActiveStepNumber(stepNumber);
    setCenterToken((prev) => ({ step: stepNumber, nonce: (prev?.nonce ?? 0) + 1 }));
  };

  // Refs to each step card so clicking a node in the preview can scroll its editor
  // into view (reverse of "locate in chart").
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const revealStep = (stepNumber: number) => {
    setActiveStepNumber(stepNumber);
    cardRefs.current[stepNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Working copy. In create mode we seed a blank definition; in edit mode we seed
  // from the server once (tracked by version key, no effect → no cascading renders).
  const [seeded, setSeeded] = useState<{ key: string; draft: WorkflowDefinition } | null>(null);
  const serverKey = isCreate ? 'new' : (serverDef ? `${serverDef.id}@${serverDef.version}` : null);
  if (serverKey && seeded?.key !== serverKey) {
    const initial = isCreate
      ? emptyDefinition(newId, searchParams.get('service') ?? undefined)
      : structuredClone(serverDef!);
    setSeeded({ key: serverKey, draft: initial });
  }
  const draft = seeded?.draft ?? null;
  const setDraft = (updater: (d: WorkflowDefinition | null) => WorkflowDefinition | null) =>
    setSeeded((s) => (s ? { ...s, draft: updater(s.draft)! } : s));

  const errors = useMemo(() => {
    if (!draft) return [];
    const base = validate(draft);
    // #2: a new workflow MUST be tied to a service so Create Matter can use it.
    if (isCreate && (draft.serviceKeys ?? []).length === 0) base.push('Choose which service this workflow powers.');
    return base;
  }, [draft, isCreate]);
  const isValid = errors.length === 0;

  const previewMachine = useMemo(() => {
    if (!draft || !isValid) return null;
    try { return compileDefinition(draft); } catch { return null; }
  }, [draft, isValid]);

  const goBack = () => navigate(serviceKey ? `/services/${serviceKey}` : '/services');

  const save = useMutation({
    mutationFn: () => {
      if (!draft) throw new Error('Nothing to save.');
      const body = {
        name: draft.name,
        initialStep: draft.initialStep,
        serviceKeys: draft.serviceKeys,
        steps: draft.steps,
        phases: draft.phases,
      };
      return isCreate
        ? createWorkflowDefinition({ id: draft.id, ...body })
        : updateWorkflowDefinition(definitionId!, body);
    },
    onSuccess: (updated) => {
      toast.success(isCreate ? 'Workflow created.' : `Workflow saved (v${updated.version}).`);
      queryClient.invalidateQueries({ queryKey: ['workflow-definition', definitionId] });
      queryClient.invalidateQueries({ queryKey: ['workflow-definitions'] });
      goBack();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save workflow.'),
  });

  if (!isCreate && (isLoading || !draft)) {
    return (
      <PageShell title="Edit Workflow">
        {definitionId ? <LoadingSpinner /> : <p className="text-sm text-ink-muted">No workflow is configured for this service yet.</p>}
      </PageShell>
    );
  }
  if (!draft) return <PageShell title="New Workflow"><LoadingSpinner /></PageShell>;

  // ─── Draft mutators ─────────────────────────────────────────────────────────
  const patch = (next: Partial<WorkflowDefinition>) => setDraft((d) => (d ? { ...d, ...next } : d));
  const patchStep = (stepNumber: number, next: Partial<WorkflowStepDef>) =>
    setDraft((d) => d ? { ...d, steps: d.steps.map((s) => (s.stepNumber === stepNumber ? { ...s, ...next } : s)) } : d);
  const addStep = () => setDraft((d) => {
    if (!d) return d;
    const nextNum = d.steps.reduce((m, s) => Math.max(m, s.stepNumber), 0) + 1;
    const step: WorkflowStepDef = { stepNumber: nextNum, title: `Step ${nextNum}`, type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: nextNum }] };
    return { ...d, steps: [...d.steps, step] };
  });
  // Insert a new step right AFTER `index` (the "add next step" button on a card),
  // and point it at the step the inserted-after one currently leads to.
  const insertStepAfter = (index: number) => setDraft((d) => {
    if (!d) return d;
    const newNum = d.steps.reduce((m, s) => Math.max(m, s.stepNumber), 0) + 1;
    const after = d.steps[index];
    const leadsTo = after?.transitions?.find((t) => t.event === 'COMPLETE_STEP')?.to
      ?? d.steps[index + 1]?.stepNumber ?? newNum;
    const step: WorkflowStepDef = { stepNumber: newNum, title: 'New step', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: leadsTo }] };
    const steps = [...d.steps];
    steps.splice(index + 1, 0, step);
    return { ...d, steps };
  });
  const removeStep = (stepNumber: number) =>
    setDraft((d) => d ? { ...d, steps: d.steps.filter((s) => s.stepNumber !== stepNumber) } : d);
  const moveStep = (index: number, dir: -1 | 1) => setDraft((d) => {
    if (!d) return d;
    const steps = [...d.steps];
    const j = index + dir;
    if (j < 0 || j >= steps.length) return d;
    [steps[index], steps[j]] = [steps[j], steps[index]];
    return { ...d, steps };
  });

  // stepNumber → display position (1-based), so the chart can show the SAME numbers
  // as the editor cards.
  const displayNumbers: Record<number, number> = {};
  draft.steps.forEach((s, i) => { displayNumbers[s.stepNumber] = i + 1; });

  return (
    <PageShell
      title={isCreate ? 'New Workflow' : 'Edit Workflow'}
      subtitle={isCreate ? 'Build a workflow your team and clients will follow.' : `${draft.name} · v${draft.version}`}
      action={
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-ink-muted hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => save.mutate()}
            disabled={!isValid || save.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isCreate ? 'Create workflow' : 'Save & publish'}
          </button>
        </div>
      }
    >
      <button onClick={goBack} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {!isValid && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm font-medium text-red-700 mb-1">
            <AlertTriangle className="w-4 h-4" /> {errors.length} thing{errors.length > 1 ? 's' : ''} to fix before saving
          </p>
          <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="flex flex-col gap-5">
          {/* Workflow meta */}
          <section className="card p-4">
            <h2 className="text-sm font-semibold text-ink mb-3">Workflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <FieldLabel label="Name" hint="The service this workflow is for, e.g. “Company Incorporation”." />
                <input className={inputCls} value={draft.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Company Incorporation" />
              </div>
              <div className="flex flex-col gap-0.5">
                <FieldLabel label="Starts at" hint="The first step every new matter begins on." />
                <select className={inputCls} value={draft.initialStep} onChange={(e) => patch({ initialStep: Number(e.target.value) })}>
                  {draft.steps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.title}</option>)}
                </select>
              </div>
              {isCreate && (
                <div className="flex flex-col gap-0.5">
                  <FieldLabel label="Powers which service? *" hint="A new workflow must be tied to a service so it can be used when creating matters for that service." />
                  <select
                    className={inputCls}
                    value={draft.serviceKeys?.[0] ?? ''}
                    onChange={(e) => patch({ serviceKeys: e.target.value ? [e.target.value] : [] })}
                  >
                    <option value="">Select a service…</option>
                    {availableServices.map((s) => <option key={s.key} value={s.key}>{s.displayName}</option>)}
                    {/* keep an already-selected service visible even if filtered out */}
                    {draft.serviceKeys?.[0] && !availableServices.some((s) => s.key === draft.serviceKeys![0]) && (
                      <option value={draft.serviceKeys[0]}>{draft.serviceKeys[0]}</option>
                    )}
                  </select>
                  {availableServices.length === 0 && (
                    <p className="text-[11px] text-amber-700 mt-0.5">Every service already has a workflow. Edit an existing one instead.</p>
                  )}
                </div>
              )}
            </div>
          </section>

          <StagesEditor stages={draft.phases ?? []} onChange={(phases) => patch({ phases })} />

          {/* Steps */}
          <section className="card p-4">
            <h2 className="text-sm font-semibold text-ink mb-3">Steps ({draft.steps.length})</h2>
            <div className="flex flex-col gap-3">
              {draft.steps.map((s, i) => (
                <StepCard
                  key={s.stepNumber}
                  step={s}
                  index={i}
                  total={draft.steps.length}
                  stages={draft.phases ?? []}
                  allSteps={draft.steps}
                  cardRef={(el) => { cardRefs.current[s.stepNumber] = el; }}
                  isActive={activeStepNumber === s.stepNumber}
                  onActivate={() => setActiveStepNumber(s.stepNumber)}
                  onLocate={() => locateStep(s.stepNumber)}
                  onAddAfter={() => insertStepAfter(i)}
                  onPatch={(next) => patchStep(s.stepNumber, next)}
                  onRemove={() => removeStep(s.stepNumber)}
                  onMove={(dir) => moveStep(i, dir)}
                />
              ))}
            </div>
            {/* Add step lives at the BOTTOM — you append the next step after the list. */}
            <div className="flex justify-end mt-3">
              <button onClick={addStep} className="btn-secondary inline-flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add step
              </button>
            </div>
          </section>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-4 self-start w-full">
          <section className="card p-3">
            <h2 className="text-sm font-semibold text-ink mb-2 px-1 inline-flex items-center gap-1">
              Live preview
              <FieldLabel label="" hint="A diagram of the workflow as you’re building it. Boxes are steps; arrows are where it goes next." />
            </h2>
            {previewMachine ? (
              <div className="h-[520px] rounded-md border border-gray-100 overflow-hidden">
                <WorkflowDiagram machine={previewMachine} highlightStepNumber={activeStepNumber} centerToken={centerToken} onStepClick={revealStep} displayNumbers={displayNumbers} />
              </div>
            ) : (
              <p className="text-xs text-ink-muted p-4">Fix the items above to see the updated diagram.</p>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Reusable bits ────────────────────────────────────────────────────────────
const inputCls = 'w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

function LabeledField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel label={label} hint={hint} />
      {children}
    </div>
  );
}

function StepNumberSelect({ value, steps, onChange, label, hint }: {
  value: number | undefined; steps: WorkflowStepDef[]; onChange: (n: number) => void; label: string; hint?: string;
}) {
  return (
    <LabeledField label={label} hint={hint}>
      <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))}>
        {steps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.title}</option>)}
      </select>
    </LabeledField>
  );
}

function StagesEditor({ stages, onChange }: { stages: PhaseDef[]; onChange: (p: PhaseDef[]) => void }) {
  const add = () => onChange([...stages, { id: `stage-${Date.now()}`, name: `Stage ${stages.length + 1}`, order: stages.length + 1 }]);
  const patch = (idx: number, next: Partial<PhaseDef>) => onChange(stages.map((p, i) => (i === idx ? { ...p, ...next } : p)));
  const remove = (idx: number) => onChange(stages.filter((_, i) => i !== idx));
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-ink inline-flex items-center gap-1">
          Stages
          <FieldLabel label="" hint="Big-picture groupings shown on the client’s progress tracker, e.g. “Name Reservation”, “Filing”. Optional." />
        </h2>
        <button onClick={add} className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          <Plus className="w-4 h-4" /> Add stage
        </button>
      </div>
      {stages.length === 0 ? (
        <p className="text-xs text-ink-muted">No stages yet — steps won’t group on the client’s progress tracker.</p>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          {stages.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputCls} value={p.name} onChange={(e) => patch(i, { name: e.target.value })} placeholder="Stage name" aria-label="Stage name" />
              <button onClick={() => remove(i)} className="text-ink-faint hover:text-red-600 shrink-0" aria-label="Remove stage"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StepCard({ step, index, total, stages, allSteps, isActive, cardRef, onActivate, onLocate, onAddAfter, onPatch, onRemove, onMove }: {
  step: WorkflowStepDef;
  index: number;
  total: number;
  stages: PhaseDef[];
  allSteps: WorkflowStepDef[];
  isActive?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  onActivate?: () => void;
  onLocate?: () => void;
  onAddAfter?: () => void;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const confirm = useConfirm();
  const handleRemove = async () => {
    const ok = await confirm({
      title: 'Delete this step?',
      message: `“${step.title || 'Untitled step'}” will be removed from the workflow. Other steps pointing to it will need their outcomes updated.`,
      tone: 'danger',
      confirmLabel: 'Delete step',
    });
    if (ok) onRemove();
  };
  const kind = stepKindOf(step);
  const events = step.transitions ?? [];
  const firstTo = (event: string) => events.find((t) => t.event === event)?.to;
  // Default routing target = the NEXT step in the list (common case), else the
  // first other step. Avoids new outcomes jumping to the last/Done step.
  const nextStepNum = allSteps[index + 1]?.stepNumber
    ?? allSteps.find((s) => s.stepNumber !== step.stepNumber)?.stepNumber
    ?? step.stepNumber;
  const otherStepNum = nextStepNum;

  // Change step KIND → set engine `type` and PRE-FILL sensible default outcomes
  // (which the user can then freely edit/add/remove via OutcomeRows). Existing
  // matching outcomes are preserved so changing kind doesn't lose wiring.
  const setKind = (k: StepKind) => {
    const next = otherStepNum;
    if (k === 'final') { onPatch({ type: 'final', transitions: [], gate: undefined }); return; }
    if (k === 'payment') {
      onPatch({ type: 'payment_gate', transitions: [], gate: step.gate ?? { requires: 'fully_paid', onPass: next, onWait: step.stepNumber } });
      return;
    }
    if (k === 'branch') {
      const existing = events.filter((t) => t.event === 'BRANCH_DECISION');
      onPatch({ type: 'branch', gate: undefined, transitions: existing.length ? existing : [{ event: 'BRANCH_DECISION', to: next, branch: 'option_1' }] });
      return;
    }
    if (k === 'client') { onPatch({ type: 'step', gate: undefined, transitions: [{ event: 'CLIENT_APPROVE', to: firstTo('CLIENT_APPROVE') ?? next }, { event: 'CLIENT_REJECT', to: firstTo('CLIENT_REJECT') ?? step.stepNumber }] }); return; }
    if (k === 'govt') { onPatch({ type: 'step', gate: undefined, transitions: [{ event: 'GOVT_APPROVE', to: firstTo('GOVT_APPROVE') ?? next }, { event: 'GOVT_REJECT', to: firstTo('GOVT_REJECT') ?? step.stepNumber }] }); return; }
    onPatch({ type: 'step', gate: undefined, transitions: events.length ? events : [{ event: 'COMPLETE_STEP', to: firstTo('COMPLETE_STEP') ?? next }] }); // work
  };

  // Who-does-this select value.
  const whoValue = step.defaultAssigneeUid === '__CLIENT__' ? 'client' : (step.assignedRole ? 'role' : 'team');

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border bg-surface-soft/40 p-4 transition-shadow scroll-mt-4 ${isActive ? 'border-brand-400 ring-1 ring-brand-300' : 'border-hairline'}`}
      onFocusCapture={onActivate}
      onClick={onActivate}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-xs font-semibold text-brand-700 shrink-0">{index + 1}</span>
        <input className={`${inputCls} font-medium`} value={step.title} onChange={(e) => onPatch({ title: e.target.value })} aria-label={`Step ${step.stepNumber} title`} placeholder="What is this step called?" />
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onLocate} className="text-ink-faint hover:text-brand-600" aria-label="Locate in chart" title="Locate in chart"><Crosshair className="w-4 h-4" /></button>
          <button onClick={() => onMove(-1)} disabled={index === 0} className="text-ink-faint hover:text-ink disabled:opacity-30" aria-label="Move up"><ChevronUp className="w-4 h-4" /></button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="text-ink-faint hover:text-ink disabled:opacity-30" aria-label="Move down"><ChevronDown className="w-4 h-4" /></button>
          <button onClick={handleRemove} className="text-ink-faint hover:text-red-600" aria-label="Remove step"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">
        <LabeledField label="What kind of step?" hint={KIND_HINT[kind]}>
          <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as StepKind)}>
            {(Object.keys(KIND_LABEL) as StepKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
          </select>
        </LabeledField>

        <LabeledField label="Who does this?" hint="Who owns the step: your team (by role), or the client.">
          <select className={inputCls} value={whoValue} onChange={(e) => {
            const v = e.target.value;
            if (v === 'client') onPatch({ defaultAssigneeUid: '__CLIENT__', assignedRole: undefined });
            else if (v === 'role') onPatch({ defaultAssigneeUid: undefined, assignedRole: step.assignedRole || 'team_member' });
            else onPatch({ defaultAssigneeUid: undefined, assignedRole: undefined });
          }}>
            <option value="team">Our team (anyone)</option>
            <option value="role">Our team (specific role)</option>
            <option value="client">The client</option>
          </select>
        </LabeledField>

        {whoValue === 'role' && (
          <LabeledField label="Which role?" hint="e.g. team_member, manager, admin.">
            <input className={inputCls} value={step.assignedRole ?? ''} onChange={(e) => onPatch({ assignedRole: e.target.value || undefined })} placeholder="team_member" />
          </LabeledField>
        )}

        <LabeledField label="Stage" hint="Which big-picture stage this step belongs to (for the client tracker).">
          <select className={inputCls} value={step.phaseId ?? ''} onChange={(e) => onPatch({ phaseId: e.target.value || undefined })}>
            <option value="">— none —</option>
            {stages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </LabeledField>

        <LabeledField label="Expected time (days)" hint="How long this step usually takes. Drives due dates and “running late”. Use 0 for same-day.">
          <input className={inputCls} type="number" min={0} value={step.typicalDurationDays ?? ''} onChange={(e) => onPatch({ typicalDurationDays: e.target.value === '' ? undefined : Number(e.target.value) })} />
        </LabeledField>

        <label className="flex items-center gap-2 self-end pb-1.5 cursor-pointer">
          <input type="checkbox" className="h-4 w-4" checked={step.clientVisible !== false} onChange={(e) => onPatch({ clientVisible: e.target.checked })} aria-label="Visible to client" />
          <FieldLabel label="Visible to the client" hint="If on, the client sees this step on their progress view. Turn off for internal-only steps." />
        </label>
      </div>

      {/* What happens next? — payment checkpoints are a gate (special); every other
          kind uses freely-editable OUTCOME ROWS so you can define any number of
          future states to any steps. */}
      {kind === 'payment' ? (
        <WhatHappensNext>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <LabeledField label="Continue when" hint="The payment level required before the workflow may continue.">
              <select className={inputCls} value={step.gate?.requires ?? 'fully_paid'} onChange={(e) => onPatch({ gate: { requires: e.target.value as 'fully_paid' | 'part_paid', onPass: step.gate?.onPass ?? otherStepNum, onWait: step.gate?.onWait ?? step.stepNumber } })}>
                <option value="fully_paid">Fully paid</option>
                <option value="part_paid">Part paid</option>
              </select>
            </LabeledField>
            <StepNumberSelect label="If paid → go to" hint="Where it goes once payment is satisfied."
              value={step.gate?.onPass} steps={allSteps} onChange={(n) => onPatch({ gate: { requires: step.gate?.requires ?? 'fully_paid', onPass: n, onWait: step.gate?.onWait ?? step.stepNumber } })} />
            <StepNumberSelect label="If not paid, wait at" hint="Usually this same step — the matter waits here until paid."
              value={step.gate?.onWait} steps={allSteps} onChange={(n) => onPatch({ gate: { requires: step.gate?.requires ?? 'fully_paid', onPass: step.gate?.onPass ?? otherStepNum, onWait: n } })} />
          </div>
        </WhatHappensNext>
      ) : kind !== 'final' ? (
        <WhatHappensNext>
          <OutcomeRows step={step} allSteps={allSteps} otherStepNum={otherStepNum} onPatch={onPatch} showColors={!!isActive} />
          {kind === 'client' && (
            <div className="mt-2">
              <LabeledField label="Button the client sees" hint="The label on the client’s action button, e.g. “Please Proceed”.">
                <input className={inputCls} value={step.clientActionLabel ?? ''} onChange={(e) => onPatch({ clientActionLabel: e.target.value || undefined })} placeholder="Approve" />
              </LabeledField>
            </div>
          )}
        </WhatHappensNext>
      ) : null}

      {/* Automatic actions */}
      {kind !== 'final' && (
        <div className="mt-3">
          <FieldLabel label="Automatic actions" hint="Things the system does on its own when this step runs." />
          <div className="flex flex-col gap-1.5 mt-1.5">
            {KNOWN_EFFECTS.map((eff) => {
              const on = (step.effects ?? []).includes(eff.id);
              return (
                <label key={eff.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4" checked={on} onChange={(e) => {
                    const set = new Set(step.effects ?? []);
                    if (e.target.checked) set.add(eff.id); else set.delete(eff.id);
                    onPatch({ effects: set.size ? [...set] : undefined });
                  }} />
                  <span className="text-xs text-ink-muted inline-flex items-center gap-1">{eff.label}
                    <FieldLabel label="" hint={eff.hint} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3">
        <LabeledField label="Description (optional)" hint="A short note shown to staff/clients explaining this step.">
          <textarea className={`${inputCls} resize-y mt-1`} rows={2} value={step.description ?? ''} onChange={(e) => onPatch({ description: e.target.value || undefined })} />
        </LabeledField>
      </div>

      {/* Advanced (raw) — power users */}
      <div className="mt-3 pt-2 border-t border-hairline-soft" />
      <button onClick={() => setShowAdvanced((v) => !v)} className="inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ink">
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} /> Advanced (raw)
      </button>
      {showAdvanced && (
        <div className="mt-1 rounded-md bg-surface-card p-2 text-[11px] text-ink-muted font-mono whitespace-pre-wrap break-all">
          {JSON.stringify({ stepNumber: step.stepNumber, type: step.type, transitions: step.transitions, gate: step.gate, effects: step.effects }, null, 2)}
        </div>
      )}

      {/* Quick "insert a step right after this one" — easier than scrolling to the
          bottom "Add step" when building a flow in order. */}
      {onAddAfter && (
        <div className="mt-3 flex justify-center">
          <button onClick={onAddAfter} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add step below
          </button>
        </div>
      )}
    </div>
  );
}

function WhatHappensNext({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md bg-surface-card p-3">
      <p className="text-xs font-semibold text-ink-muted mb-2 inline-flex items-center gap-1">
        What happens next?
        <FieldLabel label="" hint="The possible outcomes of this step and where each one goes. Add as many as you need." />
      </p>
      {children}
    </div>
  );
}

// Friendly outcome types ↔ engine events. A "Branch option" carries a free-text
// option name (the `branch` value); the rest are single fixed events.
const OUTCOME_TYPES: { event: string; label: string; needsName?: boolean }[] = [
  { event: 'COMPLETE_STEP', label: 'When done / completed' },
  { event: 'CLIENT_APPROVE', label: 'Client approves' },
  { event: 'CLIENT_REJECT', label: 'Client requests changes' },
  { event: 'GOVT_APPROVE', label: 'Government approves' },
  { event: 'GOVT_REJECT', label: 'Government rejects' },
  { event: 'REWORK', label: 'Sent back for correction' },
  { event: 'BRANCH_DECISION', label: 'Option (you name it)', needsName: true },
];

/**
 * Freely-editable list of step OUTCOMES — each row is "[outcome] → [go to step]".
 * Replaces the old hardcoded per-kind routing so any step can define any number of
 * future states to any steps. Maps 1:1 to the engine's `transitions[]`.
 */
function OutcomeRows({ step, allSteps, otherStepNum, onPatch, showColors }: {
  step: WorkflowStepDef;
  allSteps: WorkflowStepDef[];
  otherStepNum: number;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
  showColors?: boolean;
}) {
  const rows = step.transitions ?? [];
  // Persist transitions AND keep the engine `type` consistent: a step that has any
  // "Option (you name it)" (BRANCH_DECISION) outcome must be a branch, otherwise a
  // plain step — so a named option always compiles + renders correctly (auto-switch).
  const commit = (transitions: { event: string; to: number; branch?: string }[]) => {
    const hasBranch = transitions.some((t) => t.event === 'BRANCH_DECISION');
    const patch: Partial<WorkflowStepDef> = { transitions };
    if (step.type !== 'final' && step.type !== 'payment_gate') {
      patch.type = hasBranch ? 'branch' : 'step';
    }
    onPatch(patch);
  };
  const setRow = (i: number, next: Partial<{ event: string; to: number; branch?: string }>) =>
    commit(rows.map((t, idx) => (idx === i ? { ...t, ...next } : t)));
  const addRow = () => commit([...rows, { event: 'COMPLETE_STEP', to: otherStepNum }]);
  const removeRow = (i: number) => commit(rows.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {rows.map((t, i) => {
        const isBranch = t.event === 'BRANCH_DECISION';
        // Colour dot matching this outcome's arrow in the live chart (only while
        // this step is focused, so the editor row and its arrow line up visually).
        const dot = showColors ? outcomeColor(t.event, t.branch, t.to) : null;
        return (
          <div key={i} className="rounded-md border border-hairline bg-white p-2">
            <div className="flex items-end gap-2">
              {dot && <span className="w-2.5 h-2.5 rounded-full shrink-0 mb-2.5" style={{ backgroundColor: dot }} title="Matches this arrow's colour in the chart" />}
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] text-ink-faint mb-0.5">Outcome</span>
                <select
                  className={inputCls}
                  value={OUTCOME_TYPES.some((o) => o.event === t.event) ? t.event : 'COMPLETE_STEP'}
                  onChange={(e) => {
                    const ev = e.target.value;
                    const needsName = OUTCOME_TYPES.find((o) => o.event === ev)?.needsName;
                    setRow(i, { event: ev, branch: needsName ? (t.branch || `option_${i + 1}`) : undefined });
                  }}
                  aria-label="Outcome"
                >
                  {OUTCOME_TYPES.map((o) => <option key={o.event} value={o.event}>{o.label}</option>)}
                </select>
              </div>
              <span className="text-ink-faint shrink-0 pb-1.5">→</span>
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] text-ink-faint mb-0.5">Go to step</span>
                <select className={inputCls} value={t.to} onChange={(e) => setRow(i, { to: Number(e.target.value) })} aria-label="Go to step">
                  {allSteps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.title}</option>)}
                </select>
              </div>
              <button onClick={() => removeRow(i)} className="text-ink-faint hover:text-red-600 shrink-0 pb-1.5" aria-label="Remove outcome"><Trash2 className="w-4 h-4" /></button>
            </div>
            {isBranch && (
              <div className="mt-2">
                <span className="block text-[11px] text-ink-faint mb-0.5">Option name (shown to the team)</span>
                <input className={inputCls} value={t.branch ?? ''} onChange={(e) => setRow(i, { branch: e.target.value })} placeholder="e.g. New name required" aria-label="Option name" />
              </div>
            )}
          </div>
        );
      })}
      {rows.length === 0 && <p className="text-xs text-amber-700">No outcomes yet — this step can’t advance. Add one below.</p>}
      <button onClick={addRow} className="self-start inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
        <Plus className="w-3.5 h-3.5" /> Add outcome
      </button>
    </div>
  );
}
