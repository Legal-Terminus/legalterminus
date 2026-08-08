import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layers, Pencil, Loader2, Workflow, Search, Plus, CircleSlash } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import { useAuthStore } from '../../store/authStore';
import {
  getServiceCatalog, groupByCategory, updateService,
  type CatalogService,
} from '../../api/services';
import { getWorkflowDefinitions } from '../../api/workflowDefinitions';

/** #155: the bit of a workflow definition a service tile needs to advertise. */
interface ConfiguredWorkflow {
  name: string;
  stepCount: number;
}

/**
 * Service catalog — lists every service Legal Terminus offers, grouped by
 * category. Sourced from the `serviceCategories` Firestore collection via
 * GET /api/service-config (see src/api/services.ts).
 *
 * Staff-only (clients excluded). Each service's display name is editable in
 * place: click a card to edit, Enter/blur to save, Escape to cancel. Each card
 * also shows whether a workflow is configured for it (#155) — a service with no
 * definition cannot start a matter, and that was previously invisible here.
 */
export default function ServicesPage() {
  const [search, setSearch] = useState('');
  // #155: 'unconfigured' surfaces exactly the services still missing a workflow.
  const [filter, setFilter] = useState<'all' | 'configured' | 'unconfigured'>('all');
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000, // backend caches 5 min; mirror it client-side
  });

  // #155: a service is only usable once a workflow definition claims its key.
  // The summary list already carries serviceKeys + stepCount, so one cheap query
  // tells every tile whether it is configured — no per-card fetch.
  const { data: defs } = useQuery({
    queryKey: ['workflow-definitions'],
    queryFn: getWorkflowDefinitions,
    staleTime: 5 * 60 * 1000,
  });

  /** serviceKey → the definition serving it (first match wins, as on the detail page). */
  const workflowByServiceKey = useMemo(() => {
    const map = new Map<string, ConfiguredWorkflow>();
    for (const def of defs ?? []) {
      for (const key of def.serviceKeys ?? []) {
        if (!map.has(key)) map.set(key, { name: def.name, stepCount: def.stepCount });
      }
    }
    return map;
  }, [defs]);

  // Filter by service name / category / key and by workflow state, then group.
  const categories = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const matches = Object.entries(data.services).filter(([key, svc]) => {
      const textMatch = !q ||
        svc.displayName.toLowerCase().includes(q) ||
        svc.category.toLowerCase().includes(q) ||
        key.toLowerCase().includes(q);
      if (!textMatch) return false;
      if (filter === 'all') return true;
      const configured = workflowByServiceKey.has(key);
      return filter === 'configured' ? configured : !configured;
    });
    return groupByCategory(Object.fromEntries(matches));
  }, [data, search, filter, workflowByServiceKey]);

  // Counts drive the filter chips (and tell an admin at a glance how much of the
  // catalog is still unconfigured).
  const counts = useMemo(() => {
    const all = Object.keys(data?.services ?? {});
    const configured = all.filter((k) => workflowByServiceKey.has(k)).length;
    return { all: all.length, configured, unconfigured: all.length - configured };
  }, [data, workflowByServiceKey]);

  return (
    <PageShell
      title="Service Catalog"
      subtitle="Every service Legal Terminus offers, grouped by category. Click a card to rename it."
      action={role === 'admin' ? (
        <button onClick={() => navigate('/workflows/new')} className="btn-primary inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New workflow
        </button>
      ) : undefined}
    >
      {/* Text search */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Search services by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* #155: workflow-state filter — jump straight to the services that still
          need a workflow configured. */}
      <div className="flex items-center gap-2 mb-5">
        {([
          { id: 'all', label: 'All services', count: counts.all },
          { id: 'configured', label: 'Workflow set', count: counts.configured },
          { id: 'unconfigured', label: 'No workflow', count: counts.unconfigured },
        ] as const).map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id)}
            aria-pressed={filter === chip.id}
            className={`badge transition-colors ${
              filter === chip.id
                ? 'bg-ink text-white'
                : 'bg-surface-card text-ink-muted hover:text-ink'
            }`}
          >
            {chip.label} · {chip.count}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="card p-12 text-center text-sm text-red-600">
          Failed to load the service catalog. Please try again.
        </div>
      )}

      {data && categories.length === 0 && (
        <div className="card p-12 text-center text-ink-muted text-sm">
          {search.trim()
            ? `No services match “${search.trim()}”.`
            : filter === 'unconfigured'
              ? 'Every service has a workflow configured.'
              : filter === 'configured'
                ? 'No service has a workflow configured yet.'
                : 'No services are available yet.'}
        </div>
      )}

      {data && categories.length > 0 && (
        <div className="flex flex-col gap-8">
          {categories.map((cat) => (
            <section key={cat.id}>
              <h2 className="text-sm font-semibold text-ink mb-3">{cat.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.services.map((svc) => (
                  <ServiceCard
                    key={svc.key}
                    service={svc}
                    workflow={workflowByServiceKey.get(svc.key)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/**
 * A single service card. Click to edit its display name inline; toggle active.
 * `workflow` is the definition serving this service, or undefined when none is
 * configured (#155) — the card says which, since an unconfigured service looks
 * identical to a working one but cannot start a matter.
 */
function ServiceCard({
  service, workflow,
}: {
  service: CatalogService;
  workflow?: ConfiguredWorkflow;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(service.displayName);
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (displayName: string) =>
      updateService(service.categoryId, service.key, { displayName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-catalog'] });
      setEditing(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to rename service.');
      setValue(service.displayName); // revert
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (active: boolean) =>
      updateService(service.categoryId, service.key, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-catalog'] }),
    onError: (err: Error) => toast.error(err.message || 'Failed to update status.'),
  });

  function startEditing() {
    setValue(service.displayName);
    setEditing(true);
    // Focus after the input mounts.
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function save() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === service.displayName) {
      setEditing(false);
      setValue(service.displayName);
      return;
    }
    mutation.mutate(trimmed);
  }

  function cancel() {
    setEditing(false);
    setValue(service.displayName);
  }

  const inactive = !service.active;

  return (
    <div className={`card p-5 group relative ${inactive ? 'bg-surface-soft' : ''}`}>
      {/* Icon, rename pencil, and inactive badge — dimmed when inactive */}
      <div className={`flex items-start justify-between ${inactive ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-ink" />
          </div>
          {inactive && (
            <span className="badge bg-surface-card text-ink-muted">Inactive</span>
          )}
          {/* #155: workflow state, at a glance. */}
          {workflow ? (
            <span
              className="badge bg-emerald-50 text-emerald-700 inline-flex items-center gap-1"
              title={`${workflow.name} · ${workflow.stepCount} step${workflow.stepCount === 1 ? '' : 's'}`}
            >
              <Workflow className="w-3 h-3" aria-hidden />
              Workflow set
            </span>
          ) : (
            <span className="badge bg-amber-50 text-amber-700 inline-flex items-center gap-1">
              <CircleSlash className="w-3 h-3" aria-hidden />
              No workflow
            </span>
          )}
        </div>
        {mutation.isPending ? (
          <Loader2 className="w-4 h-4 text-ink-faint animate-spin" />
        ) : !editing ? (
          <button
            onClick={startEditing}
            title="Rename"
            className="p-1.5 -m-1.5 rounded-lg text-ink-faint opacity-0 group-hover:opacity-100 hover:text-ink hover:bg-surface-soft transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      <div className={inactive ? 'opacity-50' : ''}>
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            autoFocus
            disabled={mutation.isPending}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); save(); }
              else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
            }}
            className="input-field mt-3 text-sm font-semibold"
          />
        ) : (
          <button
            onClick={startEditing}
            className="mt-3 block w-full text-left text-sm font-semibold text-ink leading-snug hover:text-ink-soft"
          >
            {service.displayName}
          </button>
        )}

        <p className="mt-1 text-xs text-ink-muted">{service.category}</p>
      </div>

      {/* View configured workflow. #155: when nothing is configured the link
          still goes to the detail page, but says so rather than promising a
          diagram that isn't there. */}
      <button
        onClick={() => navigate(`/services/${service.key}`)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
      >
        <Workflow className="w-3.5 h-3.5" />
        {workflow
          ? `View workflow · ${workflow.stepCount} step${workflow.stepCount === 1 ? '' : 's'}`
          : 'Set up workflow'}
        <span aria-hidden>→</span>
      </button>

      {/* Active/inactive toggle */}
      <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">
          {service.active ? 'Active' : 'Inactive'}
        </span>
        <button
          role="switch"
          aria-checked={service.active}
          aria-label={`Set ${service.displayName} ${service.active ? 'inactive' : 'active'}`}
          disabled={toggleMutation.isPending}
          onClick={() => toggleMutation.mutate(!service.active)}
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
            service.active ? 'bg-ink' : 'bg-hairline'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              service.active ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
