import { apiFetch } from './client';

/**
 * Service catalog — sourced from the `serviceCategories` Firestore collection,
 * exposed by the backend at GET /api/service-config as a flat map keyed by the
 * internal serviceKey. See backend/src/routes/serviceConfig.routes.js.
 */
export interface CatalogService {
  key: string;
  displayName: string;
  category: string;
  categoryId: string;
  active: boolean;
}

interface ServiceConfigResponse {
  services: Record<string, CatalogService>;
}

/** A category with its services, grouped for display. */
export interface CatalogCategory {
  id: string;
  name: string;
  services: CatalogService[];
}

/**
 * Staff catalog view — includes inactive services and the `active` flag.
 * (The plain /api/service-config endpoint returns active services only and
 * powers public dropdowns.)
 */
export const getServiceCatalog = () =>
  apiFetch<ServiceConfigResponse>('/api/service-config/all');

/** Editable per-service fields (identity fields key/category/categoryId are immutable). */
export interface ServiceUpdate {
  displayName?: string;
  active?: boolean;
}

export const updateService = (
  categoryId: string,
  key: string,
  body: ServiceUpdate
) =>
  apiFetch<CatalogService>(
    `/api/service-config/${categoryId}/${encodeURIComponent(key)}`,
    { method: 'PATCH', body: JSON.stringify(body) }
  );

/** Group the flat service map into ordered categories for the catalog screen. */
export function groupByCategory(
  services: Record<string, CatalogService>
): CatalogCategory[] {
  const byId = new Map<string, CatalogCategory>();
  for (const svc of Object.values(services)) {
    let cat = byId.get(svc.categoryId);
    if (!cat) {
      cat = { id: svc.categoryId, name: svc.category, services: [] };
      byId.set(svc.categoryId, cat);
    }
    cat.services.push(svc);
  }
  // Sort services alphabetically within each category; categories by name.
  const cats = Array.from(byId.values());
  cats.forEach((c) => c.services.sort((a, b) => a.displayName.localeCompare(b.displayName)));
  cats.sort((a, b) => a.name.localeCompare(b.name));
  return cats;
}
