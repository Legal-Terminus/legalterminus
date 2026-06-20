import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Workflow, Users, Check, Loader2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import WorkflowDiagram from '../../components/workflow/WorkflowDiagram';
import { useAuthStore } from '../../store/authStore';
import { getServiceCatalog } from '../../api/services';
import {
  getWorkflowDefinitions, getWorkflowDefinition,
  getPhaseAssignments, putPhaseAssignments, getWorkflowSyncCheck,
  getStepEtas, putStepEtas,
  getStepAssignees, putStepAssignees,
  type WorkflowDefinition, type PhaseAssignments,
} from '../../api/workflowDefinitions';
import { getAllUsers, displayName, type PortalUser } from '../../api/users';
import { compileDefinition } from '@shared/workflows/compileDefinition.js';

/**
 * Service detail — reached by clicking a service card on /services. Shows the
 * service's configured workflow as a read-only diagram. The workflow is a DATA
 * definition (workflowDefinitions) fetched from the backend and compiled to an
 * XState machine client-side via the shared compiler — no hardcoded machine.
 */
export default function ServiceDetailPage() {
  const { serviceKey } = useParams<{ serviceKey: string }>();
  const navigate = useNavigate();

  const { data: catalog, isLoading: catalogLoading } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000,
  });
  const service = serviceKey && catalog ? catalog.services[serviceKey] : undefined;

  // Resolve which definition serves this service key.
  const { data: defs, isLoading: defsLoading } = useQuery({
    queryKey: ['workflow-definitions'],
    queryFn: getWorkflowDefinitions,
    staleTime: 5 * 60 * 1000,
  });
  const definitionId = useMemo(
    () => defs?.find((d) => d.serviceKeys.includes(serviceKey ?? ''))?.id,
    [defs, serviceKey]
  );

  // Fetch + compile the full definition.
  const { data: definition, isLoading: defLoading } = useQuery({
    queryKey: ['workflow-definition', definitionId],
    queryFn: () => getWorkflowDefinition(definitionId!),
    enabled: Boolean(definitionId),
    staleTime: 5 * 60 * 1000,
  });

  const machine = useMemo(
    () => (definition ? compileDefinition(definition) : undefined),
    [definition]
  );

  // Config sync / health check (E10-S02) — flag a misconfigured workflow.
  const { data: sync } = useQuery({
    queryKey: ['workflow-sync-check', definitionId],
    queryFn: () => getWorkflowSyncCheck(definitionId!),
    enabled: Boolean(definitionId),
    staleTime: 60_000,
  });

  const loading = catalogLoading || defsLoading || (Boolean(definitionId) && defLoading);

  return (
    <PageShell
      title={service?.displayName ?? 'Service'}
      subtitle={service?.category}
      action={
        <button onClick={() => navigate('/services')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <Workflow className="w-4 h-4 text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">Configured Workflow</h2>
      </div>

      {/* Config sync warning (E10-S02): hard errors block new matters; warnings
          are advisory. Shown only when there's something to report. */}
      {sync && !sync.inSync && (
        <div className="card p-4 mb-4 border-red-200 bg-red-50/60">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800">
                Workflow is out of sync — new matters are blocked until fixed.
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-1 space-y-0.5">
                {sync.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
      {sync && sync.inSync && sync.warnings.length > 0 && (
        <div className="card p-4 mb-4 border-amber-200 bg-amber-50/60">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-amber-900">Workflow warnings</p>
              <ul className="list-disc list-inside text-sm text-amber-800 mt-1 space-y-0.5">
                {sync.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : machine ? (
        <WorkflowDiagram machine={machine} />
      ) : (
        <div className="card p-12 text-center text-ink-muted text-sm">
          No workflow configured yet for this service.
        </div>
      )}

      {/* Assignments (E11-S02 + per-step) — phase defaults with per-step overrides
          nested under each phase; new matters pre-route work to the configured staff. */}
      {definitionId && definition && (
        <AssignmentsEditor definitionId={definitionId} definition={definition} />
      )}

      {/* Per-step ETAs (E13-S01) — configure expected duration per step; new
          matters derive per-step + whole-matter due dates from these. */}
      {definitionId && definition && (
        <StepEtaEditor definitionId={definitionId} />
      )}
    </PageShell>
  );
}

/* ── Per-step ETA editor (E13-S01) ─────────────────────────────────────────── */

function StepEtaEditor({ definitionId }: { definitionId: string }) {
  const role = useAuthStore((s) => s.role);
  const toast = useToast();
  const queryClient = useQueryClient();
  const canEdit = role === 'admin' || role === 'manager';

  const { data, isLoading } = useQuery({
    queryKey: ['step-etas', definitionId],
    queryFn: () => getStepEtas(definitionId),
    staleTime: 30_000,
  });

  // Edits overlay the server value (no effect-driven sync). Keyed by stepNumber;
  // value is the raw input string ('' = cleared/untracked).
  const [edits, setEdits] = useState<Record<number, string>>({});
  const serverSteps = useMemo(() => data?.steps ?? [], [data]);
  const valueFor = (stepNumber: number): string => {
    if (stepNumber in edits) return edits[stepNumber];
    const s = serverSteps.find((x) => x.stepNumber === stepNumber);
    return s?.typicalDurationDays != null ? String(s.typicalDurationDays) : '';
  };

  const save = useMutation({
    mutationFn: () => {
      // Build the etas map from edits only (server keeps the rest). '' → null (clear).
      const etas: Record<string, number | null> = {};
      for (const [num, raw] of Object.entries(edits)) {
        etas[num] = raw.trim() === '' ? null : Number(raw);
      }
      return putStepEtas(definitionId, etas);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['step-etas', definitionId], res);
      // The definition itself changed (version bumped) — drop its cache so the
      // diagram/detail refetch the new version.
      queryClient.invalidateQueries({ queryKey: ['workflow-definition', definitionId] });
      setEdits({});
      toast.success('Step ETAs saved. Applies to new matters.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save step ETAs.'),
  });

  // Total expected duration across steps that have an ETA (live, incl. edits).
  const totalDays = useMemo(() => {
    return serverSteps.reduce((sum, s) => {
      const v = valueFor(s.stepNumber).trim();
      const n = v === '' ? 0 : Number(v);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSteps, edits]);

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">Step ETAs</h2>
      </div>
      <p className="text-sm text-ink-muted mb-3">
        Set an expected duration (in days) per step. New matters use these to compute per-step and
        whole-matter due dates, and to flag work that’s running late. Leave blank to leave a step untracked.
        {' '}Changes apply to new matters only.
      </p>

      {isLoading ? (
        <div className="card p-8 flex items-center justify-center text-ink-faint">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="card divide-y divide-hairline">
            {serverSteps.map((s) => (
              <div key={s.stepNumber} className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm text-ink min-w-0 truncate">
                  <span className="text-ink-faint mr-1.5">{s.stepNumber}.</span>{s.title}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={3650}
                    inputMode="numeric"
                    className="input-field py-1.5 text-sm w-24 text-right"
                    placeholder="—"
                    value={valueFor(s.stepNumber)}
                    disabled={!canEdit || save.isPending}
                    onChange={(e) => setEdits((d) => ({ ...d, [s.stepNumber]: e.target.value }))}
                  />
                  <span className="text-xs text-ink-faint w-8">days</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-ink-muted">
              Total expected: <span className="font-semibold text-ink">{totalDays}</span> day{totalDays === 1 ? '' : 's'}
            </span>
            {canEdit && (
              <button
                onClick={() => save.mutate()}
                disabled={save.isPending || !hasEdits}
                className="btn-primary inline-flex items-center gap-1.5 ml-auto"
              >
                {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {save.isPending ? 'Saving…' : 'Save ETAs'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Assignments editor (E11-S02 phase defaults + per-step overrides) ───────── */

/**
 * One "Assignments" section: each phase carries a default-assignee dropdown, with
 * its steps nested below. A step defaults to "Inherit from phase" and can override
 * to a specific person (matching the backend precedence: step default wins over
 * phase default; neither set → shared pool). Steps with no phase render under an
 * "Unphased steps" group. Saving persists BOTH phase assignments and step
 * assignees (each only if changed). Applies to new matters only (version-pinned).
 */
function AssignmentsEditor({
  definitionId, definition,
}: {
  definitionId: string;
  definition: WorkflowDefinition;
}) {
  const role = useAuthStore((s) => s.role);
  const toast = useToast();
  const queryClient = useQueryClient();
  const canEdit = role === 'admin' || role === 'manager';

  const phases = useMemo(
    () => [...(definition.phases ?? [])].sort((a, b) => a.order - b.order),
    [definition],
  );

  const { data: staff = [] } = useQuery({
    queryKey: ['portalUsers', 'staff'],
    queryFn: getAllUsers,
    select: (users: PortalUser[]) => users.filter((u) => u.role !== 'client'),
    staleTime: 60_000,
  });

  const { data: phaseData } = useQuery({
    queryKey: ['phase-assignments', definitionId],
    queryFn: () => getPhaseAssignments(definitionId),
    staleTime: 30_000,
  });
  const { data: stepData, isLoading } = useQuery({
    queryKey: ['step-assignees', definitionId],
    queryFn: () => getStepAssignees(definitionId),
    staleTime: 30_000,
  });

  // Separate edit overlays for phases (by phaseId) and steps (by stepNumber).
  const [phaseEdits, setPhaseEdits] = useState<PhaseAssignments>({});
  const [stepEdits, setStepEdits] = useState<Record<number, string>>({});

  const serverPhases = phaseData?.assignments ?? {};
  const serverSteps = useMemo(() => stepData?.steps ?? [], [stepData]);

  const phaseValue = (phaseId: string): string =>
    (phaseId in phaseEdits ? phaseEdits[phaseId] : serverPhases[phaseId]) ?? '';
  const stepValue = (stepNumber: number): string => {
    if (stepNumber in stepEdits) return stepEdits[stepNumber];
    return serverSteps.find((x) => x.stepNumber === stepNumber)?.defaultAssigneeUid ?? '';
  };

  // Group steps under their phase (preserving the definition's step order); steps
  // without a phaseId fall into a trailing "unphased" bucket.
  const stepsByPhase = useMemo(() => {
    const map = new Map<string, typeof serverSteps>();
    const unphased: typeof serverSteps = [];
    for (const s of serverSteps) {
      if (!s.phaseId) { unphased.push(s); continue; }
      const arr = map.get(s.phaseId) ?? [];
      arr.push(s);
      map.set(s.phaseId, arr);
    }
    return { map, unphased };
  }, [serverSteps]);

  const save = useMutation({
    mutationFn: async () => {
      const tasks: Promise<unknown>[] = [];
      if (Object.keys(phaseEdits).length > 0) {
        tasks.push(putPhaseAssignments(definitionId, { ...serverPhases, ...phaseEdits }));
      }
      if (Object.keys(stepEdits).length > 0) {
        const assignees: Record<string, string | null> = {};
        for (const [num, uid] of Object.entries(stepEdits)) assignees[num] = uid === '' ? null : uid;
        tasks.push(putStepAssignees(definitionId, assignees));
      }
      await Promise.all(tasks);
    },
    onSuccess: async () => {
      // Both writes bump/replace cached config — refetch the canonical values.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['phase-assignments', definitionId] }),
        queryClient.invalidateQueries({ queryKey: ['step-assignees', definitionId] }),
        queryClient.invalidateQueries({ queryKey: ['workflow-definition', definitionId] }),
      ]);
      setPhaseEdits({});
      setStepEdits({});
      toast.success('Assignments saved. Applies to new matters.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save assignments.'),
  });

  const hasEdits = Object.keys(phaseEdits).length > 0 || Object.keys(stepEdits).length > 0;

  const staffOptions = staff.map((u) => (
    <option key={u.uid} value={u.uid}>{displayName(u)}</option>
  ));

  const stepRow = (s: typeof serverSteps[number]) => (
    <div key={s.stepNumber} className="flex items-center justify-between gap-3 py-2.5 pl-9 pr-4">
      <span className="text-sm text-ink-muted min-w-0 truncate">
        <span className="text-ink-faint mr-1.5">{s.stepNumber}.</span>{s.title}
      </span>
      <select
        className="input-field py-1.5 text-sm max-w-[220px] shrink-0"
        value={stepValue(s.stepNumber)}
        disabled={!canEdit || save.isPending}
        onChange={(e) => setStepEdits((d) => ({ ...d, [s.stepNumber]: e.target.value }))}
      >
        <option value="">Inherit from phase</option>
        {staffOptions}
      </select>
    </div>
  );

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">Assignments</h2>
      </div>
      <p className="text-sm text-ink-muted mb-3">
        Set a default assignee per phase. New matters route that phase’s steps to them automatically. Override
        an individual step below to route it to someone else — a step set to “Inherit from phase” uses its
        phase default (or the shared pool if the phase is unassigned). Changes apply to new matters only.
      </p>

      {isLoading ? (
        <div className="card p-8 flex items-center justify-center text-ink-faint">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="card divide-y divide-hairline">
            {phases.map((p) => (
              <div key={p.id}>
                {/* Phase header row: the phase default assignee. */}
                <div className="flex items-center justify-between gap-3 p-4 bg-surface-soft/40">
                  <span className="text-sm font-semibold text-ink min-w-0 truncate">{p.name}</span>
                  <select
                    className="input-field py-1.5 text-sm max-w-[220px] shrink-0"
                    value={phaseValue(p.id)}
                    disabled={!canEdit || save.isPending}
                    onChange={(e) => setPhaseEdits((d) => ({ ...d, [p.id]: e.target.value || null }))}
                  >
                    <option value="">Unassigned</option>
                    {staffOptions}
                  </select>
                </div>
                {/* Nested step overrides for this phase. */}
                {(stepsByPhase.map.get(p.id) ?? []).map(stepRow)}
              </div>
            ))}

            {/* Steps with no phase (rare) get their own group. */}
            {stepsByPhase.unphased.length > 0 && (
              <div>
                <div className="flex items-center gap-3 p-4 bg-surface-soft/40">
                  <span className="text-sm font-semibold text-ink-muted">Unphased steps</span>
                </div>
                {stepsByPhase.unphased.map(stepRow)}
              </div>
            )}
          </div>

          {canEdit && (
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => save.mutate()}
                disabled={save.isPending || !hasEdits}
                className="btn-primary inline-flex items-center gap-1.5 ml-auto"
              >
                {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {save.isPending ? 'Saving…' : 'Save assignments'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
