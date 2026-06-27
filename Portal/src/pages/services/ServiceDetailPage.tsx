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
  getStepSettings, putStepSettings,
  type WorkflowDefinition, type PhaseAssignments, type StepSettingPatch,
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
  const role = useAuthStore((s) => s.role);

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
        <div className="flex items-center gap-2">
          {role === 'admin' && definitionId && (
            <button onClick={() => navigate(`/services/${serviceKey}/edit`)} className="btn-primary">
              <Workflow className="w-4 h-4" /> Edit workflow
            </button>
          )}
          <button onClick={() => navigate('/services')} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
        </div>
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

      {/* Phase default assignees (E11-S02) — one default person per phase; new
          matters route that phase's steps to them unless a step overrides below. */}
      {definitionId && definition && (
        <AssignmentsEditor definitionId={definitionId} definition={definition} />
      )}

      {/* Combined per-step settings (E10-S01): assignee override + ETA + client
          visibility, one block per step, saved together. */}
      {definitionId && (
        <StepSettingsEditor definitionId={definitionId} />
      )}
    </PageShell>
  );
}

/* ── Combined per-step settings: assignee + ETA + client visibility ─────────── */

/**
 * One settings block per step holding all three values an admin tunes per step:
 * the default ASSIGNEE (overrides the phase default), the ETA (days, drives due
 * dates / "running late"), and CLIENT-VISIBLE (whether the step shows in the
 * client's step list). Edits overlay the server value and are saved together in a
 * single version bump via the combined `/step-settings` endpoint. Applies to new
 * matters only (definitions are version-pinned per matter).
 */
function StepSettingsEditor({ definitionId }: { definitionId: string }) {
  const role = useAuthStore((s) => s.role);
  const toast = useToast();
  const queryClient = useQueryClient();
  const canEdit = role === 'admin' || role === 'manager';

  const { data: staff = [] } = useQuery({
    queryKey: ['portalUsers', 'staff'],
    queryFn: getAllUsers,
    select: (users: PortalUser[]) => users.filter((u) => u.role !== 'client'),
    staleTime: 60_000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['step-settings', definitionId],
    queryFn: () => getStepSettings(definitionId),
    staleTime: 30_000,
  });
  const serverSteps = useMemo(() => data?.steps ?? [], [data]);

  // Per-step edit overlay (only changed fields per step are tracked).
  const [edits, setEdits] = useState<Record<number, StepSettingPatch>>({});
  const setField = (n: number, patch: StepSettingPatch) =>
    setEdits((d) => ({ ...d, [n]: { ...d[n], ...patch } }));

  const assigneeVal = (n: number): string => {
    const e = edits[n];
    if (e && 'assigneeUid' in e) return e.assigneeUid ?? '';
    return serverSteps.find((x) => x.stepNumber === n)?.assigneeUid ?? '';
  };
  const etaVal = (n: number): string => {
    const e = edits[n];
    if (e && 'etaDays' in e) return e.etaDays == null ? '' : String(e.etaDays);
    const s = serverSteps.find((x) => x.stepNumber === n);
    return s?.etaDays != null ? String(s.etaDays) : '';
  };
  const visibleVal = (n: number): boolean => {
    const e = edits[n];
    if (e && 'clientVisible' in e) return Boolean(e.clientVisible);
    return serverSteps.find((x) => x.stepNumber === n)?.clientVisible ?? true;
  };

  const save = useMutation({
    mutationFn: () => {
      const settings: Record<string, StepSettingPatch> = {};
      for (const [num, patch] of Object.entries(edits)) {
        const clean: StepSettingPatch = {};
        if ('assigneeUid' in patch) clean.assigneeUid = patch.assigneeUid || null;
        if ('etaDays' in patch) clean.etaDays = patch.etaDays;
        if ('clientVisible' in patch) clean.clientVisible = patch.clientVisible;
        settings[num] = clean;
      }
      return putStepSettings(definitionId, settings);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['step-settings', definitionId], res);
      // The definition changed (version bumped) — drop dependent caches.
      queryClient.invalidateQueries({ queryKey: ['workflow-definition', definitionId] });
      queryClient.invalidateQueries({ queryKey: ['step-assignees', definitionId] });
      queryClient.invalidateQueries({ queryKey: ['step-etas', definitionId] });
      setEdits({});
      toast.success('Step settings saved. Applies to new matters.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save step settings.'),
  });

  const totalDays = useMemo(() =>
    serverSteps.reduce((sum, s) => {
      const v = etaVal(s.stepNumber).trim();
      const n = v === '' ? 0 : Number(v);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serverSteps, edits]);
  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">Step Settings</h2>
      </div>
      <p className="text-sm text-ink-muted mb-3">
        Per step: the default <strong>assignee</strong> (overrides the phase default), the expected
        <strong> ETA</strong> in days (drives due dates and “running late”), and whether the step is
        <strong> visible to the client</strong>. Set <strong>ETA&nbsp;= 0</strong> for a step that
        happens on the <strong>same day</strong> as the previous one (multiple steps can share a day).
        Changes apply to new matters only.
      </p>

      {isLoading ? (
        <div className="card p-8 flex items-center justify-center text-ink-faint">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <>
          {/* Header row */}
          <div className="hidden sm:flex items-center gap-3 px-4 pb-1 text-xs text-ink-faint">
            <span className="flex-1">Step</span>
            <span className="w-[200px]">Assignee</span>
            <span className="w-28 text-right">ETA · 0=same day</span>
            <span className="w-28 text-center">Client-visible</span>
          </div>
          <div className="card divide-y divide-hairline">
            {serverSteps.map((s) => (
              <div key={s.stepNumber} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4">
                <span className="flex-1 text-sm text-ink min-w-0 truncate">
                  <span className="text-ink-faint mr-1.5">{s.stepNumber}.</span>{s.title}
                </span>
                <select
                  className="input-field py-1.5 text-sm sm:w-[200px] shrink-0"
                  value={assigneeVal(s.stepNumber)}
                  disabled={!canEdit || save.isPending}
                  onChange={(e) => setField(s.stepNumber, { assigneeUid: e.target.value || null })}
                  aria-label={`Step ${s.stepNumber} assignee`}
                >
                  <option value="">Inherit from phase</option>
                  {staff.map((u) => <option key={u.uid} value={u.uid}>{displayName(u)}</option>)}
                </select>
                <input
                  type="number"
                  min={0}
                  max={3650}
                  inputMode="numeric"
                  className="input-field py-1.5 text-sm sm:w-28 text-right shrink-0"
                  placeholder="—"
                  value={etaVal(s.stepNumber)}
                  disabled={!canEdit || save.isPending}
                  onChange={(e) => setField(s.stepNumber, { etaDays: e.target.value.trim() === '' ? null : Number(e.target.value) })}
                  aria-label={`Step ${s.stepNumber} ETA in days`}
                />
                <label className="sm:w-28 flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={visibleVal(s.stepNumber)}
                    disabled={!canEdit || save.isPending}
                    onChange={(e) => setField(s.stepNumber, { clientVisible: e.target.checked })}
                    aria-label={`Step ${s.stepNumber} client-visible`}
                  />
                  <span className="sm:hidden text-xs text-ink-muted">Client-visible</span>
                </label>
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
                {save.isPending ? 'Saving…' : 'Save step settings'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Phase default-assignee editor (E11-S02) ────────────────────────────────── */

/**
 * Phase-level default assignees: one default person per phase. New matters route
 * that phase's steps to them, unless a step overrides it in the Step Settings block
 * below (step default wins over phase default; neither set → shared pool). Applies
 * to new matters only (definitions are version-pinned per matter).
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

  const { data: phaseData, isLoading } = useQuery({
    queryKey: ['phase-assignments', definitionId],
    queryFn: () => getPhaseAssignments(definitionId),
    staleTime: 30_000,
  });

  const [phaseEdits, setPhaseEdits] = useState<PhaseAssignments>({});
  const serverPhases = phaseData?.assignments ?? {};
  const phaseValue = (phaseId: string): string =>
    (phaseId in phaseEdits ? phaseEdits[phaseId] : serverPhases[phaseId]) ?? '';

  const save = useMutation({
    mutationFn: () => putPhaseAssignments(definitionId, { ...serverPhases, ...phaseEdits }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['phase-assignments', definitionId] });
      setPhaseEdits({});
      toast.success('Phase assignments saved. Applies to new matters.');
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save assignments.'),
  });

  const hasEdits = Object.keys(phaseEdits).length > 0;
  const staffOptions = staff.map((u) => (
    <option key={u.uid} value={u.uid}>{displayName(u)}</option>
  ));

  if (phases.length === 0) return null; // no phases → nothing to assign at phase level

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">Phase Assignments</h2>
      </div>
      <p className="text-sm text-ink-muted mb-3">
        Set a default assignee per phase. New matters route that phase’s steps to them automatically — a step
        can override this in Step Settings below. Changes apply to new matters only.
      </p>

      {isLoading ? (
        <div className="card p-8 flex items-center justify-center text-ink-faint">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="card divide-y divide-hairline">
            {phases.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm font-semibold text-ink min-w-0 truncate">{p.name}</span>
                <select
                  className="input-field py-1.5 text-sm max-w-[220px] shrink-0"
                  value={phaseValue(p.id)}
                  disabled={!canEdit || save.isPending}
                  onChange={(e) => setPhaseEdits((d) => ({ ...d, [p.id]: e.target.value || null }))}
                  aria-label={`${p.name} default assignee`}
                >
                  <option value="">Unassigned</option>
                  {staffOptions}
                </select>
              </div>
            ))}
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
