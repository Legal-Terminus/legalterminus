import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Workflow } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import WorkflowDiagram from '../../components/workflow/WorkflowDiagram';
import { getServiceCatalog } from '../../api/services';
import { getWorkflowForServiceKey } from '../../workflows/registry';

/**
 * Service detail — reached by clicking a service card on /services. Shows the
 * service's configured workflow as a read-only visual diagram (derived from its
 * XState machine), or an empty state if no workflow is configured yet.
 */
export default function ServiceDetailPage() {
  const { serviceKey } = useParams<{ serviceKey: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000,
  });

  const service = useMemo(
    () => (serviceKey && data ? data.services[serviceKey] : undefined),
    [data, serviceKey]
  );

  const machine = getWorkflowForServiceKey(serviceKey);

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

      {isLoading ? (
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
