import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Workflow } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import WorkflowDiagram from '../../components/workflow/WorkflowDiagram';
import { getServiceCatalog } from '../../api/services';
import { getWorkflowDefinitions, getWorkflowDefinition } from '../../api/workflowDefinitions';
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
    </PageShell>
  );
}
