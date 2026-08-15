import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Plus } from 'lucide-react';
import { useToast } from '../common/toastContext';
import {
  createService, createServiceCategory, slugifyServiceKey,
  type CatalogCategory,
} from '../../api/services';

/**
 * #173 — add a service (or a whole category) to the catalog.
 *
 * Until now the catalog could only be changed by running a seed script, so
 * offering a new kind of filing needed a developer. This is the admin-facing way
 * in; the service then gets a workflow through the #156 flow.
 *
 * The KEY is surfaced rather than hidden: it is what a workflow binds to via
 * `serviceKeys`, it must be unique across the whole catalog, and it cannot be
 * changed afterwards — so it is suggested from the name and left editable.
 */
export default function AddServiceModal({
  categories, onClose,
}: {
  categories: CatalogCategory[];
  onClose: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<'service' | 'category'>('service');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [displayName, setDisplayName] = useState('');
  const [key, setKey] = useState('');
  const [keyTouched, setKeyTouched] = useState(false);

  // Category mode
  const [categoryName, setCategoryName] = useState('');

  const onNameChange = (v: string) => {
    setDisplayName(v);
    if (!keyTouched) setKey(slugifyServiceKey(v));
  };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['service-catalog'] });

  const addService = useMutation({
    mutationFn: () => createService(categoryId, { key: key.trim(), displayName: displayName.trim() }),
    onSuccess: (svc) => {
      invalidate();
      toast.success(`“${svc.displayName}” added. Give it a workflow to start using it.`);
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not add that service.'),
  });

  const addCategory = useMutation({
    mutationFn: () => createServiceCategory({
      id: slugifyServiceKey(categoryName),
      name: categoryName.trim(),
    }),
    onSuccess: () => {
      invalidate();
      toast.success('Category added.');
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not add that category.'),
  });

  const keyValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(key.trim()) && key.trim().length >= 2;
  const canSubmitService = Boolean(categoryId) && displayName.trim().length > 0 && keyValid;
  const canSubmitCategory = categoryName.trim().length > 0;
  const pending = addService.isPending || addCategory.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-ink">
            {mode === 'service' ? 'Add a service' : 'Add a category'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('service')}
            aria-pressed={mode === 'service'}
            className={`badge ${mode === 'service' ? 'bg-ink text-white' : 'bg-surface-card text-ink-muted'}`}
          >
            Service
          </button>
          <button
            onClick={() => setMode('category')}
            aria-pressed={mode === 'category'}
            className={`badge ${mode === 'category' ? 'bg-ink text-white' : 'bg-surface-card text-ink-muted'}`}
          >
            Category
          </button>
        </div>

        {mode === 'service' ? (
          <div className="flex flex-col gap-3">
            <label className="block">
              <span className="text-xs text-ink-muted">Category</span>
              <select
                aria-label="Category"
                className="input-field mt-1 w-full"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs text-ink-muted">Service name</span>
              <input
                type="text"
                aria-label="Service name"
                className="input-field mt-1 w-full"
                placeholder="e.g. Trademark Renewal"
                value={displayName}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs text-ink-muted">Key</span>
              <input
                type="text"
                aria-label="Service key"
                className="input-field mt-1 w-full font-mono text-sm"
                placeholder="trademark-renewal"
                value={key}
                onChange={(e) => { setKeyTouched(true); setKey(e.target.value); }}
              />
              <span className="block text-xs text-ink-faint mt-1">
                {keyValid || key.trim() === ''
                  ? 'Used internally to link this service to its workflow. Cannot be changed later.'
                  : 'Lowercase letters, numbers and single hyphens only.'}
              </span>
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="text-xs text-ink-muted">Category name</span>
            <input
              type="text"
              aria-label="Category name"
              className="input-field mt-1 w-full"
              placeholder="e.g. Intellectual Property"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </label>
        )}

        <div className="flex items-center justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={() => (mode === 'service' ? addService.mutate() : addCategory.mutate())}
            disabled={pending || !(mode === 'service' ? canSubmitService : canSubmitCategory)}
            className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {mode === 'service' ? 'Add service' : 'Add category'}
          </button>
        </div>
      </div>
    </div>
  );
}
