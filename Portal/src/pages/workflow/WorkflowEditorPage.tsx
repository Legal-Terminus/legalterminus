import { useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import FieldLabel from '../../components/common/FieldLabel';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import { useToast } from '../../components/common/toastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StepListEditor, { type StepCardRegistry } from '../../components/workflow/StepListEditor';
import WorkflowPreviewRail from '../../components/workflow/WorkflowPreviewRail';
import { StagesEditor } from '../../components/workflow/StepSubEditors';
import { inputCls } from '../../components/workflow/stepEditorVocab';
import {
  getWorkflowDefinitions, getWorkflowDefinition, updateWorkflowDefinition, createWorkflowDefinition,
  type WorkflowDefinition,
} from '../../api/workflowDefinitions';
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
 *
 * Story 24.4: the step-editing UI itself now lives in `components/workflow/`
 * (StepListEditor / StepCard / StepSubEditors / WorkflowPreviewRail), shared with
 * the platform library editor. This page keeps only fetching, saving, routing and
 * the workspace-specific meta fields (service binding, copy-from).
 */

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

  // Story 28.3 (S28e): the step card says "only one step should carry this",
  // but nothing enforced it — ticking it on several steps saved cleanly and the
  // balance-due chase then fired from whichever completed first.
  const chasers = def.steps.filter((s) => (s.effects ?? []).includes('REMIND_PART_PAYMENT'));
  if (chasers.length > 1) {
    errors.push(
      `Only one step may chase part payment, but ${chasers.length} do: ${chasers.map((s) => `"${s.title}"`).join(', ')}.`,
    );
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

  // NOTE: Ambyflow also seeds a new workflow from the PLATFORM LIBRARY here.
  // There is no library in this installation, so that path is omitted —
  // `copyFrom` below does the same job from an existing workflow, which is the
  // only source of proven steps here.
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

  /**
   * Story 28.4 (S28h) — the preview FOLLOWS the step you are editing.
   *
   * Until now the chart only moved when you pressed "Locate in chart"; opening a
   * step highlighted its node in colour, which is invisible when that node is
   * off-canvas in a 40-step flow. Activating a card now pans the chart too, so
   * the editor and the diagram always agree on where you are.
   */
  const activateStep = (stepNumber: number) => {
    if (stepNumber === activeStepNumber) return; // don't re-pan on every keystroke
    locateStep(stepNumber);
  };

  // Refs to each step card (filled by StepListEditor) so clicking a node in the
  // preview can scroll its editor into view (reverse of "locate in chart"). Held
  // as state, not a ref, because it is READ during render to hand to the list.
  const [cardRefs] = useState<StepCardRegistry>({});
  const revealStep = (stepNumber: number) => {
    setActiveStepNumber(stepNumber);
    cardRefs[stepNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Working copy. In create mode we seed a blank definition; in edit mode we seed
  // from the server once (tracked by version key, no effect → no cascading renders).
  const [seeded, setSeeded] = useState<{ key: string; draft: WorkflowDefinition } | null>(null);
  const serverKey = isCreate ? 'new' : (serverDef ? `${serverDef.id}@${serverDef.version}` : null);
  if (serverKey && seeded?.key !== serverKey) {
    // #156: creating from a SERVICE page (/services/:key/edit?new=1) pre-attaches
    // that service, so the admin never has to re-pick what they just clicked from.
    // `?service=` stays supported for links that carry it explicitly.
    const initial = isCreate
      ? emptyDefinition(newId, searchParams.get('service') ?? serviceKey ?? undefined)
      : structuredClone(serverDef!);
    setSeeded({ key: serverKey, draft: initial });
  }
  const draft = seeded?.draft ?? null;
  const setDraft = (updater: (d: WorkflowDefinition | null) => WorkflowDefinition | null) =>
    setSeeded((s) => (s ? { ...s, draft: updater(s.draft)! } : s));

  // #130: start a NEW workflow from an existing one. Authoring a 40-step service
  // flow from a blank canvas is impractical, so an admin can copy a proven
  // workflow's steps/phases onto a different service and edit from there. Only
  // the structure is copied — id, name and service binding stay this workflow's
  // own (a service key may power exactly one workflow).
  const copyFrom = async (sourceId: string) => {
    // The list endpoint returns summaries (no steps), so fetch the full source.
    let src: WorkflowDefinition;
    try { src = await getWorkflowDefinition(sourceId); }
    catch { toast.error('Could not load that workflow to copy from.'); return; }
    setDraft((d) => (d ? {
      ...d,
      initialStep: src.initialStep,
      phases: structuredClone(src.phases ?? []),
      steps: structuredClone(src.steps ?? []),
      name: d.name || `${src.name} (copy)`,
    } : d));
    toast.success(`Copied the steps from “${src.name}”. Edit them for this service, then create.`);
  };

  const errors = useMemo(() => {
    if (!draft) return [];
    const base = validate(draft);
    // #2: a new workflow MUST be tied to a service so Create Matter can use it.
    if (isCreate && (draft.serviceKeys ?? []).length === 0) base.push('Choose which service this workflow powers.');
    return base;
  }, [draft, isCreate]);
  const isValid = errors.length === 0;
  // A brand-new workflow is empty by definition, so listing its unfilled fields
  // as "things to fix" the moment the page opens scolds the user for not having
  // typed yet. Hold the banner until they actually try to create/save; the
  // button stays disabled meanwhile, which is the honest signal.
  const [attemptedSave, setAttemptedSave] = useState(false);
  // Shown as soon as the workflow is invalid, not only after a save attempt.
  // Ambyflow waits for `attemptedSave` so a half-built workflow does not nag;
  // this editor replaced one that surfaced problems immediately, and the save
  // button below is disabled meanwhile — a disabled button with no stated
  // reason is worse than the nagging.
  const showErrors = !isValid;

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

  const patch = (next: Partial<WorkflowDefinition>) => setDraft((d) => (d ? { ...d, ...next } : d));

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
          <button onClick={goBack} className="btn-secondary !px-3 !py-1.5 text-sm">Cancel</button>
          <button
            // Clickable while incomplete on purpose: a disabled button cannot
            // tell you WHY it is disabled. Pressing it reveals the checklist.
            onClick={() => {
              setAttemptedSave(true);
              if (isValid) save.mutate();
            }}
            // Disabled while invalid: the old editor blocked the click rather
            // than accepting it and failing server-side.
            disabled={save.isPending || !isValid}
            className="btn-primary inline-flex items-center gap-1.5 !px-3 !py-1.5 text-sm disabled:opacity-50"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isCreate ? 'Create workflow' : 'Save & publish'}
          </button>
        </div>
      }
    >


      {/* A new workflow must attach to a service that has none. When there are
          none free, the whole form is unusable — saying so up front beats fine
          print under a select the user cannot satisfy, with a Create button that
          can never succeed. */}
      {isCreate && availableServices.length === 0 && (
        <div className="mb-4 rounded-md border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            Every service already has a workflow
          </p>
          <p className="text-sm text-amber-800 mt-1">
            A workflow attaches to one service, and none is free. Edit an existing
            service’s workflow, or add a new service first and give it one from there.
          </p>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="btn-secondary mt-3 min-h-11"
          >
            Go to Services
          </button>
        </div>
      )}

      {showErrors && (
        <div className="mb-4 rounded-md border border-red-100 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm font-medium text-red-700 mb-1">
            <AlertTriangle className="w-4 h-4" /> {errors.length} thing{errors.length > 1 ? 's' : ''} to fix before saving
          </p>
          <ul className="list-disc list-inside text-xs text-red-700 space-y-0.5">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="flex flex-col gap-5">
          {/* Workflow meta */}
          <CollapsibleSection id="workflow" title="Workflow">
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
                    <p className="text-[11px] text-amber-800 mt-0.5">Every service already has a workflow. Edit an existing one instead.</p>
                  )}
                </div>
              )}
              {/* #130: copy a proven workflow's steps instead of authoring 40+
                  steps from scratch, then edit them for this service. */}
              {isCreate && (defs ?? []).length > 0 && (
                <div className="flex flex-col gap-0.5">
                  <FieldLabel label="Start from an existing workflow" hint="Copies that workflow's stages and steps into this one so you can edit rather than build from scratch. The service binding and name stay yours — nothing is forked and no service key is claimed." />
                  <select
                    className={inputCls}
                    value=""
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) return;
                      copyFrom(v);
                    }}
                    aria-label="Start from an existing workflow"
                  >
                    <option value="">Start from scratch</option>
                    {(defs ?? []).length > 0 && (
                      <optgroup label="This workspace">
                        {(defs ?? []).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </optgroup>
                    )}
                  </select>
                </div>
              )}
            </div>
          </CollapsibleSection>

          <StagesEditor stages={draft.phases ?? []} onChange={(phases) => patch({ phases })} />

          <StepListEditor
            steps={draft.steps}
            stages={draft.phases ?? []}
            activeStepNumber={activeStepNumber}
            onActivate={activateStep}
            onLocate={locateStep}
            onChange={(steps) => patch({ steps })}
            cardRegistry={cardRefs}
          />
        </div>

        {/* Live preview — drag-resizable + collapsible rail so the editor column
            can widen. On mobile it stacks full-width and skips the drag handle. */}
        <WorkflowPreviewRail
          machine={previewMachine}
          storageKey="wfEditorPreviewRail"
          highlightStepNumber={activeStepNumber}
          centerToken={centerToken}
          steps={draft.steps}
          // Story 28.4 (S10): a blank new workflow is not an ERROR state — it
          // showed "Fix the items above" before the user had typed anything.
          emptyMessage={attemptedSave
            ? 'Fix the items above to see the updated diagram.'
            : 'Add a name and steps to see the diagram.'}
          onStepClick={revealStep}
          displayNumbers={displayNumbers}
        />
      </div>
    </PageShell>
  );
}
