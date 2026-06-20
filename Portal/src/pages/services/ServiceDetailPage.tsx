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

      {/* Per-phase default assignees (E11-S02) — configure once per service; every
          new matter pre-routes each phase's steps to the configured person. */}
      {definitionId && definition && (definition.phases?.length ?? 0) > 0 && (
        <PhaseAssignmentsEditor definitionId={definitionId} definition={definition} />
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

/* ── Per-phase default assignees editor (E11-S02) ──────────────────────────── */

function PhaseAssignmentsEditor({
  definitionId, definition,
}: {
  definitionId: string;
  definition: WorkflowDefinition;
}) {
  const role = useAuthStore((s) => s.role);
  const toast = useToast();
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

  const queryClient = useQueryClient();
  const { data: saved } = useQuery({
    queryKey: ['phase-assignments', definitionId],
    queryFn: () => getPhaseAssignments(definitionId),
    staleTime: 30_000,
  });

  // Local edits overlay the server value (no effect-driven sync). `edits` holds
  // only phases the user changed this session; everything else reads from server.
  const [edits, setEdits] = useState<PhaseAssignments>({});
  const serverAssignments = saved?.assignments ?? {};
  const valueFor = (phaseId: string): string =>
    (phaseId in edits ? edits[phaseId] : serverAssignments[phaseId]) ?? '';

  const save = useMutation({
    mutationFn: () => putPhaseAssignments(definitionId, { ...serverAssignments, ...edits }),
    onSuccess: (res) => {
      // Write the server's canonical result straight into the cache so the UI
      // reflects the save WITHOUT a hard refresh (was relying on stale data).
      queryClient.setQueryData(['phase-assignments', definitionId], res);
      setEdits({});
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save phase assignments.'),
  });

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">Phase Assignments</h2>
      </div>
      <p className="text-sm text-ink-muted mb-3">
        Pre-assign each phase to a team member. New matters route that phase’s steps to them automatically.
        {' '}Changes apply to new matters only.
      </p>

      <div className="card divide-y divide-hairline">
        {phases.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-4">
            <span className="text-sm font-medium text-ink min-w-0 truncate">{p.name}</span>
            <select
              className="input-field py-1.5 text-sm max-w-[220px]"
              value={valueFor(p.id)}
              disabled={!canEdit || save.isPending}
              onChange={(e) => setEdits((d) => ({ ...d, [p.id]: e.target.value || null }))}
            >
              <option value="">Unassigned</option>
              {staff.map((u) => (
                <option key={u.uid} value={u.uid}>{displayName(u)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="btn-primary inline-flex items-center gap-1.5"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {save.isPending ? 'Saving…' : 'Save assignments'}
          </button>
          {save.isSuccess && !save.isPending && (
            <span className="text-sm text-emerald-600 inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
