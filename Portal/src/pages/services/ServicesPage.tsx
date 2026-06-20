import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layers, Pencil, Loader2, Workflow, Search } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useToast } from '../../components/common/toastContext';
import {
  getServiceCatalog, groupByCategory, updateService,
  type CatalogService,
} from '../../api/services';

/**
 * Service catalog — lists every service Legal Terminus offers, grouped by
 * category. Sourced from the `serviceCategories` Firestore collection via
 * GET /api/service-config (see src/api/services.ts).
 *
 * Staff-only (clients excluded). Each service's display name is editable in
 * place: click a card to edit, Enter/blur to save, Escape to cancel.
 */
export default function ServicesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000, // backend caches 5 min; mirror it client-side
  });

  // Filter by service name / category / key, then group the matches.
  const categories = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const services = !q
      ? data.services
      : Object.fromEntries(
          Object.entries(data.services).filter(([key, svc]) =>
            svc.displayName.toLowerCase().includes(q) ||
            svc.category.toLowerCase().includes(q) ||
            key.toLowerCase().includes(q)
          )
        );
    return groupByCategory(services);
  }, [data, search]);

  return (
    <PageShell
      title="Service Catalog"
      subtitle="Every service Legal Terminus offers, grouped by category. Click a card to rename it."
    >
      {/* Text search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Search services by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
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
                  <ServiceCard key={svc.key} service={svc} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/** A single service card. Click to edit its display name inline; toggle active. */
function ServiceCard({ service }: { service: CatalogService }) {
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

      {/* View configured workflow */}
      <button
        onClick={() => navigate(`/services/${service.key}`)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
      >
        <Workflow className="w-3.5 h-3.5" /> View workflow
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
