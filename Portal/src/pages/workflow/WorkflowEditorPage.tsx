import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Save, AlertTriangle, Loader2,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import WorkflowDiagram from '../../components/workflow/WorkflowDiagram';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  getWorkflowDefinitions, getWorkflowDefinition, updateWorkflowDefinition,
  type WorkflowDefinition, type WorkflowStepDef, type PhaseDef,
} from '../../api/workflowDefinitions';
import { compileDefinition } from '@shared/workflows/compileDefinition.js';

/**
 * Workflow Editor (E10-S01 — write side). Admins author and edit a service's
 * workflow as DATA: add/remove/reorder steps, edit each step's metadata, wire
 * transitions and payment gates, and group steps into journey phases. The editor
 * validates locally (mirroring the shared `validateDefinition`) and renders a LIVE
 * diagram preview via the same compiler the runtime uses, so what you see is what
 * new matters will run. Saving bumps the definition version; in-flight matters are
 * version-pinned and unaffected.
 *
 * Reached from a service detail page → "Edit workflow". v1 assumption: edits an
 * EXISTING definition (creation of brand-new flows from scratch is a later phase).
 */

const STEP_TYPES: WorkflowStepDef['type'][] = ['step', 'payment_gate', 'branch', 'final'];

// ─── Local validation (typed mirror of shared/workflows/definitionSchema.js) ──
// The backend's validateDefinition is the authoritative gate on save; this gives
// instant inline feedback so the admin fixes issues before submitting.
function validate(def: WorkflowDefinition): string[] {
  const errors: string[] = [];
  if (!def.name?.trim()) errors.push('Workflow name is required.');
  if (!def.steps.length) errors.push('At least one step is required.');

  const numbers = new Set<number>();
  for (const s of def.steps) {
    if (numbers.has(s.stepNumber)) errors.push(`Duplicate step number ${s.stepNumber}.`);
    numbers.add(s.stepNumber);
    if (!s.title?.trim()) errors.push(`Step ${s.stepNumber} needs a title.`);
    if (s.type === 'payment_gate') {
      if (!s.gate) errors.push(`Payment gate step ${s.stepNumber} needs gate targets.`);
      else {
        if (!numbers.has(s.gate.onPass) && !def.steps.some((x) => x.stepNumber === s.gate!.onPass))
          errors.push(`Step ${s.stepNumber} gate "on pass" → unknown step ${s.gate.onPass}.`);
        if (!def.steps.some((x) => x.stepNumber === s.gate!.onWait))
          errors.push(`Step ${s.stepNumber} gate "on wait" → unknown step ${s.gate.onWait}.`);
      }
    }
  }
  for (const s of def.steps) {
    for (const t of s.transitions ?? []) {
      if (!def.steps.some((x) => x.stepNumber === t.to))
        errors.push(`Step ${s.stepNumber} transition "${t.event}" → unknown step ${t.to}.`);
      if (!t.event?.trim()) errors.push(`Step ${s.stepNumber} has a transition with no event name.`);
    }
  }
  if (!def.steps.some((x) => x.stepNumber === def.initialStep))
    errors.push(`Initial step ${def.initialStep} is not a defined step.`);

  const phaseIds = new Set((def.phases ?? []).map((p) => p.id));
  for (const s of def.steps) {
    if (s.phaseId && !phaseIds.has(s.phaseId))
      errors.push(`Step ${s.stepNumber} references unknown phase "${s.phaseId}".`);
  }
  return errors;
}

export default function WorkflowEditorPage() {
  const { serviceKey } = useParams<{ serviceKey: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Resolve which definition serves this service key (same lookup as ServiceDetailPage).
  const { data: defs } = useQuery({
    queryKey: ['workflow-definitions'],
    queryFn: getWorkflowDefinitions,
    staleTime: 5 * 60 * 1000,
  });
  const definitionId = useMemo(
    () => defs?.find((d) => d.serviceKeys.includes(serviceKey ?? ''))?.id,
    [defs, serviceKey],
  );

  const { data: serverDef, isLoading } = useQuery({
    queryKey: ['workflow-definition', definitionId],
    queryFn: () => getWorkflowDefinition(definitionId!),
    enabled: Boolean(definitionId),
  });

  // Working copy (the edit buffer). Seeded from the server definition once loaded.
  // We seed during render (not in an effect) by tracking which definition version
  // the current draft was cloned from; when the server delivers a new one (initial
  // load, or after a save re-fetch), we re-seed exactly once — no cascading renders.
  const [seeded, setSeeded] = useState<{ key: string; draft: WorkflowDefinition } | null>(null);
  const serverKey = serverDef ? `${serverDef.id}@${serverDef.version}` : null;
  if (serverDef && serverKey && seeded?.key !== serverKey) {
    setSeeded({ key: serverKey, draft: structuredClone(serverDef) });
  }
  const draft = seeded?.draft ?? null;
  const setDraft = (updater: (d: WorkflowDefinition | null) => WorkflowDefinition | null) =>
    setSeeded((s) => (s ? { ...s, draft: updater(s.draft)! } : s));

  const errors = useMemo(() => (draft ? validate(draft) : []), [draft]);
  const isValid = errors.length === 0;

  // Live diagram preview — only compile a valid draft (compiler throws on bad data).
  const previewMachine = useMemo(() => {
    if (!draft || !isValid) return null;
    try { return compileDefinition(draft); } catch { return null; }
  }, [draft, isValid]);

  const save = useMutation({
    mutationFn: () => {
      if (!draft || !definitionId) throw new Error('Nothing to save.');
      // Send only the editable body — the write schema is strict, so server-managed
      // fields (id/version/timestamps) must be stripped or the PATCH 400s.
      const body = {
        name: draft.name,
        initialStep: draft.initialStep,
        serviceKeys: draft.serviceKeys,
        steps: draft.steps,
        phases: draft.phases,
      };
      return updateWorkflowDefinition(definitionId, body);
    },
    onSuccess: (updated) => {
      toast.success(`Workflow saved (v${updated.version}). New matters use this version.`);
      queryClient.invalidateQueries({ queryKey: ['workflow-definition', definitionId] });
      queryClient.invalidateQueries({ queryKey: ['workflow-definitions'] });
      navigate(`/services/${serviceKey}`);
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save workflow.'),
  });

  if (isLoading || !draft) {
    return (
      <PageShell title="Edit Workflow">
        {definitionId ? <LoadingSpinner /> : <p className="text-sm text-ink-muted">No workflow is configured for this service yet.</p>}
      </PageShell>
    );
  }

  // ─── Mutators on the draft (immutable updates) ──────────────────────────────
  const patch = (next: Partial<WorkflowDefinition>) => setDraft((d) => (d ? { ...d, ...next } : d));
  const patchStep = (stepNumber: number, next: Partial<WorkflowStepDef>) =>
    setDraft((d) => d ? { ...d, steps: d.steps.map((s) => (s.stepNumber === stepNumber ? { ...s, ...next } : s)) } : d);

  const addStep = () => setDraft((d) => {
    if (!d) return d;
    const nextNum = d.steps.reduce((m, s) => Math.max(m, s.stepNumber), 0) + 1;
    const step: WorkflowStepDef = { stepNumber: nextNum, title: `Step ${nextNum}`, type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: nextNum }] };
    return { ...d, steps: [...d.steps, step] };
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

  return (
    <PageShell
      title="Edit Workflow"
      subtitle={`${draft.name} · v${draft.version} → saving creates v${draft.version + 1}`}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/services/${serviceKey}`)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-ink-muted hover:bg-gray-50"
          >Cancel</button>
          <button
            onClick={() => save.mutate()}
            disabled={!isValid || save.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & publish
          </button>
        </div>
      }
    >
      <button onClick={() => navigate(`/services/${serviceKey}`)} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to service
      </button>

      {/* Validation banner */}
      {!isValid && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm font-medium text-red-700 mb-1">
            <AlertTriangle className="w-4 h-4" /> {errors.length} issue{errors.length > 1 ? 's' : ''} to fix before saving
          </p>
          <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* ── Left: structured editor ── */}
        <div className="flex flex-col gap-5">
          {/* Definition meta */}
          <section className="card p-4">
            <h2 className="text-sm font-semibold text-ink mb-3">Workflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name">
                <input className={inputCls} value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
              </Field>
              <Field label="Initial step">
                <select className={inputCls} value={draft.initialStep} onChange={(e) => patch({ initialStep: Number(e.target.value) })}>
                  {draft.steps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.stepNumber} — {s.title}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* Phases */}
          <PhasesEditor phases={draft.phases ?? []} onChange={(phases) => patch({ phases })} />

          {/* Steps */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-ink">Steps ({draft.steps.length})</h2>
              <button onClick={addStep} className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
                <Plus className="w-4 h-4" /> Add step
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {draft.steps.map((s, i) => (
                <StepCard
                  key={s.stepNumber}
                  step={s}
                  index={i}
                  total={draft.steps.length}
                  phases={draft.phases ?? []}
                  allSteps={draft.steps}
                  onPatch={(next) => patchStep(s.stepNumber, next)}
                  onRemove={() => removeStep(s.stepNumber)}
                  onMove={(dir) => moveStep(i, dir)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ── Right: live preview ── */}
        <div className="xl:sticky xl:top-4 self-start w-full">
          <section className="card p-3">
            <h2 className="text-sm font-semibold text-ink mb-2 px-1">Live preview</h2>
            {previewMachine ? (
              <div className="h-[520px] rounded-md border border-gray-100 overflow-hidden">
                <WorkflowDiagram machine={previewMachine} />
              </div>
            ) : (
              <p className="text-xs text-ink-muted p-4">Fix the issues above to see the updated diagram.</p>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Reusable bits ────────────────────────────────────────────────────────────
const inputCls = 'w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-xs text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function PhasesEditor({ phases, onChange }: { phases: PhaseDef[]; onChange: (p: PhaseDef[]) => void }) {
  const add = () => onChange([...phases, { id: `phase-${phases.length + 1}`, name: `Phase ${phases.length + 1}`, order: phases.length + 1 }]);
  const patch = (idx: number, next: Partial<PhaseDef>) => onChange(phases.map((p, i) => (i === idx ? { ...p, ...next } : p)));
  const remove = (idx: number) => onChange(phases.filter((_, i) => i !== idx));
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink">Phases (journey stations)</h2>
        <button onClick={add} className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          <Plus className="w-4 h-4" /> Add phase
        </button>
      </div>
      {phases.length === 0 ? (
        <p className="text-xs text-ink-muted">No phases — steps won't group on the client journey tracker.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {phases.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={`${inputCls} w-32`} value={p.id} onChange={(e) => patch(i, { id: e.target.value })} placeholder="id" aria-label="Phase id" />
              <input className={inputCls} value={p.name} onChange={(e) => patch(i, { name: e.target.value })} placeholder="name" aria-label="Phase name" />
              <input className={`${inputCls} w-20`} type="number" value={p.order} onChange={(e) => patch(i, { order: Number(e.target.value) })} aria-label="Phase order" />
              <button onClick={() => remove(i)} className="text-ink-faint hover:text-red-600" aria-label="Remove phase"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StepCard({ step, index, total, phases, allSteps, onPatch, onRemove, onMove }: {
  step: WorkflowStepDef;
  index: number;
  total: number;
  phases: PhaseDef[];
  allSteps: WorkflowStepDef[];
  onPatch: (next: Partial<WorkflowStepDef>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const otherSteps = allSteps.filter((s) => s.stepNumber !== step.stepNumber || true);
  const setTransition = (ti: number, next: Partial<{ event: string; to: number; branch?: string }>) =>
    onPatch({ transitions: (step.transitions ?? []).map((t, i) => (i === ti ? { ...t, ...next } : t)) });
  const addTransition = () => onPatch({ transitions: [...(step.transitions ?? []), { event: 'COMPLETE_STEP', to: step.stepNumber }] });
  const removeTransition = (ti: number) => onPatch({ transitions: (step.transitions ?? []).filter((_, i) => i !== ti) });

  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-card text-xs font-semibold text-ink shrink-0">{step.stepNumber}</span>
        <input className={inputCls} value={step.title} onChange={(e) => onPatch({ title: e.target.value })} aria-label={`Step ${step.stepNumber} title`} />
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="text-ink-faint hover:text-ink disabled:opacity-30" aria-label="Move up"><ChevronUp className="w-4 h-4" /></button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="text-ink-faint hover:text-ink disabled:opacity-30" aria-label="Move down"><ChevronDown className="w-4 h-4" /></button>
          <button onClick={onRemove} className="text-ink-faint hover:text-red-600" aria-label="Remove step"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
        <Field label="Type">
          <select className={inputCls} value={step.type} onChange={(e) => onPatch({ type: e.target.value as WorkflowStepDef['type'] })}>
            {STEP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Assigned role">
          <input className={inputCls} value={step.assignedRole ?? ''} onChange={(e) => onPatch({ assignedRole: e.target.value || undefined })} />
        </Field>
        <Field label="Phase">
          <select className={inputCls} value={step.phaseId ?? ''} onChange={(e) => onPatch({ phaseId: e.target.value || undefined })}>
            <option value="">— none —</option>
            {phases.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="ETA (days)">
          <input className={inputCls} type="number" min={0} value={step.typicalDurationDays ?? ''} onChange={(e) => onPatch({ typicalDurationDays: e.target.value === '' ? undefined : Number(e.target.value) })} />
        </Field>
        <Field label="Client CTA label">
          <input className={inputCls} value={step.clientActionLabel ?? ''} onChange={(e) => onPatch({ clientActionLabel: e.target.value || undefined })} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-1.5 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={step.clientVisible !== false}
            onChange={(e) => onPatch({ clientVisible: e.target.checked })}
            aria-label={`Step ${step.stepNumber} client-visible`}
          />
          <span className="text-xs text-ink-muted">Visible to client</span>
        </label>
        <Field label="Effects (comma-sep)">
          <input className={inputCls} value={(step.effects ?? []).join(', ')} onChange={(e) => onPatch({ effects: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
        </Field>
      </div>

      <Field label="Description">
        <textarea className={`${inputCls} resize-y`} rows={2} value={step.description ?? ''} onChange={(e) => onPatch({ description: e.target.value || undefined })} />
      </Field>

      {/* Payment gate config */}
      {step.type === 'payment_gate' && (
        <div className="mt-2 rounded-md bg-surface-card p-2">
          <p className="text-xs font-medium text-ink-muted mb-1">Payment gate</p>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Requires">
              <select className={inputCls} value={step.gate?.requires ?? 'fully_paid'} onChange={(e) => onPatch({ gate: { requires: e.target.value as 'fully_paid' | 'part_paid', onPass: step.gate?.onPass ?? step.stepNumber, onWait: step.gate?.onWait ?? step.stepNumber } })}>
                <option value="fully_paid">fully_paid</option>
                <option value="part_paid">part_paid</option>
              </select>
            </Field>
            <Field label="On pass → step">
              <select className={inputCls} value={step.gate?.onPass ?? ''} onChange={(e) => onPatch({ gate: { requires: step.gate?.requires ?? 'fully_paid', onPass: Number(e.target.value), onWait: step.gate?.onWait ?? step.stepNumber } })}>
                {allSteps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.stepNumber} — {s.title}</option>)}
              </select>
            </Field>
            <Field label="On wait → step">
              <select className={inputCls} value={step.gate?.onWait ?? ''} onChange={(e) => onPatch({ gate: { requires: step.gate?.requires ?? 'fully_paid', onPass: step.gate?.onPass ?? step.stepNumber, onWait: Number(e.target.value) } })}>
                {allSteps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.stepNumber} — {s.title}</option>)}
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* Transitions */}
      {step.type !== 'final' && step.type !== 'payment_gate' && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-ink-muted">Transitions</p>
            <button onClick={addTransition} className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"><Plus className="w-3 h-3" /> Add</button>
          </div>
          <div className="flex flex-col gap-1.5">
            {(step.transitions ?? []).map((t, ti) => (
              <div key={ti} className="flex items-center gap-2">
                <input className={`${inputCls} flex-1`} value={t.event} onChange={(e) => setTransition(ti, { event: e.target.value })} placeholder="EVENT" aria-label="Transition event" />
                {step.type === 'branch' && (
                  <input className={`${inputCls} w-28`} value={t.branch ?? ''} onChange={(e) => setTransition(ti, { branch: e.target.value || undefined })} placeholder="branch" aria-label="Transition branch" />
                )}
                <span className="text-xs text-ink-faint">→</span>
                <select className={`${inputCls} w-40`} value={t.to} onChange={(e) => setTransition(ti, { to: Number(e.target.value) })} aria-label="Transition target">
                  {otherSteps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{s.stepNumber} — {s.title}</option>)}
                </select>
                <button onClick={() => removeTransition(ti)} className="text-ink-faint hover:text-red-600" aria-label="Remove transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {(step.transitions ?? []).length === 0 && <p className="text-xs text-ink-faint">No transitions — this step can't advance.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
