import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layers, Pencil, Loader2, Workflow, Search, Plus, CircleSlash, ChevronDown, ChevronRight } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import { useAuthStore } from '../../store/authStore';
import {
  getServiceCatalog, groupByCategory, updateService,
  type CatalogService,
} from '../../api/services';
import { getWorkflowDefinitions } from '../../api/workflowDefinitions';
import AddServiceModal from '../../components/services/AddServiceModal';

/** #155: the bit of a workflow definition a service tile needs to advertise. */
interface ConfiguredWorkflow {
  name: string;
  stepCount: number;
}

/** #356: which categories the user opened, kept for the browser session. */
const OPEN_KEY = 'servicesPage:openCategories';
function readOpen(): Set<string> {
  try {
    const raw = sessionStorage.getItem(OPEN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function writeOpen(open: Set<string>) {
  try { sessionStorage.setItem(OPEN_KEY, JSON.stringify([...open])); } catch { /* ignore */ }
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
 *
 * #356: categories start collapsed — rendering every card at once made this the
 * heaviest screen in the app (~2,800 elements). A category's cards mount only
 * when it is open. A search or a workflow filter opens every matching category.
 */
export default function ServicesPage() {
  const [search, setSearch] = useState('');
  // #155: 'unconfigured' surfaces exactly the services still missing a workflow.
  const [filter, setFilter] = useState<'all' | 'configured' | 'unconfigured'>('all');
  const [showAddService, setShowAddService] = useState(false); // #173
  const [openIds, setOpenIds] = useState<Set<string>>(readOpen); // #356
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

  // #173: the ADD modal needs every category, not the filtered view — otherwise a
  // search or filter would hide categories you could add to.
  const allCategories = useMemo(
    () => (data ? groupByCategory(data.services) : []),
    [data],
  );

  // #356: narrowing the list (search or a workflow filter) shows every match;
  // otherwise only the categories the user opened.
  const narrowed = search.trim() !== '' || filter !== 'all';
  const isOpen = (id: string) => narrowed || categories.length === 1 || openIds.has(id);
  const allOpen = categories.length > 0 && categories.every((c) => openIds.has(c.id));
  const setOpen = (next: Set<string>) => { setOpenIds(next); writeOpen(next); };
  const toggleCategory = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setOpen(next);
  };

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
      subtitle="Every service Legal Terminus offers, grouped by category. Open a category to see its services; click a card to rename it."
      /* #156: the button IS attached to a service — the editor makes you pick one
         before saving. It just never said so, which read as "unattached". The
         label and tooltip now state it; per-tile "Create workflow" is the shorter
         path when you already know which service you want. */
      action={role === 'admin' ? (
        <div className="flex items-center gap-2">
          {/* #173: the catalog itself is now editable — adding a service no
              longer needs a seed script. */}
          <button
            onClick={() => setShowAddService(true)}
            title="Add a service to the catalog"
            className="btn-secondary inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add service
          </button>
          <button
            onClick={() => navigate('/workflows/new')}
            title="Build a new workflow and choose which service it powers"
            className="btn-primary inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New workflow for a service
          </button>
        </div>
      ) : undefined}
    >
      {showAddService && (
        <AddServiceModal categories={allCategories} onClose={() => setShowAddService(false)} />
      )}

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
      <div className="flex flex-wrap items-center gap-2 mb-5">
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
        {/* #356: one tap to open or close every category. Hidden while a
            search or filter already shows every match. */}
        {!narrowed && categories.length > 1 && (
          <button
            onClick={() => setOpen(allOpen ? new Set() : new Set(categories.map((c) => c.id)))}
            className="ml-auto text-xs font-medium text-ink-muted hover:text-ink min-h-[44px] px-2"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        )}
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
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const open = isOpen(cat.id);
            const panelId = `services-cat-${cat.id}`;
            return (
              <section key={cat.id}>
                <h2 className="text-sm font-semibold text-ink">
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    disabled={narrowed || categories.length === 1}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-2 min-h-[44px] py-2 text-left hover:text-ink-soft disabled:cursor-default"
                  >
                    {open
                      ? <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
                      : <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />}
                    <span>{cat.name}</span>
                    <span className="badge bg-surface-card text-ink-muted font-medium">{cat.services.length}</span>
                  </button>
                </h2>
                {open && (
                  <div id={panelId} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1 mb-4">
                    {cat.services.map((svc) => (
                      <ServiceCard
                        key={svc.key}
                        service={svc}
                        workflow={workflowByServiceKey.get(svc.key)}
                        canCreate={role === 'admin'}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
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
  service, workflow, canCreate,
}: {
  service: CatalogService;
  workflow?: ConfiguredWorkflow;
  /** #156: admins can create a workflow for a service that has none. */
  canCreate: boolean;
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
            <Layers className="w-6 h-6 text-ink" />
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

      {/* #155: say which state this service is in. #156: when nothing is
          configured, an admin goes STRAIGHT to the editor with this service
          pre-attached — previously the only route was the read-only detail page,
          which offered no way to create one. Non-admins still just view. */}
      <button
        onClick={() => navigate(
          !workflow && canCreate
            ? `/services/${service.key}/edit?new=1`
            : `/services/${service.key}`,
        )}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
      >
        <Workflow className="w-3.5 h-3.5" />
        {workflow
          ? `View workflow · ${workflow.stepCount} step${workflow.stepCount === 1 ? '' : 's'}`
          : canCreate ? 'Create workflow' : 'No workflow yet'}
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
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              service.active ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
