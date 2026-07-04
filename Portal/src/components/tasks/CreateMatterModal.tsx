import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Search, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { assignServiceToClient } from '../../api/tasks';
import { getAllUsers, displayName } from '../../api/users';
import { getServiceCatalog } from '../../api/services';
import { getWorkflowDefinitions } from '../../api/workflowDefinitions';

/**
 * Create Matter (E11-S01) — a modal launched from the Matters page. Pick a client
 * and a workflow-backed service → POST /api/tasks (the same endpoint the client
 * profile's "Assign Service" uses, incl. the E03-S04 approval gate). Chosen as a
 * modal (vs. a dedicated route) for mobile-friendliness.
 */
export default function CreateMatterModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [clientSearch, setClientSearch] = useState('');
  const [clientUid, setClientUid] = useState('');
  const [serviceKey, setServiceKey] = useState('');
  // #51: payment status chosen at creation; part/full reveal amount fields.
  const [paymentStatus, setPaymentStatus] = useState<'not_paid' | 'part_paid' | 'fully_paid'>('not_paid');
  const [totalCost, setTotalCost] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [professionalUid, setProfessionalUid] = useState(''); // #85
  const [error, setError] = useState('');
  const showAmounts = paymentStatus !== 'not_paid';
  const amountDue = Math.max(0, (Number(totalCost) || 0) - (Number(amountReceived) || 0));

  // Clients for the picker.
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['portalUsers', 'all'],
    queryFn: getAllUsers,
    staleTime: 60_000,
  });
  const clients = useMemo(
    () => users.filter((u) => u.role === 'client'),
    [users],
  );
  // #85: professionals = active staff users (never clients).
  const staff = useMemo(
    () => users.filter((u) => u.role !== 'client').sort((a, b) => displayName(a).localeCompare(displayName(b))),
    [users],
  );
  const filteredClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      displayName(c).toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q));
  }, [clients, clientSearch]);

  // Workflow-backed, active services only (services ∩ workflow definitions).
  const { data: catalog } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000,
  });
  const { data: defs } = useQuery({
    queryKey: ['workflow-definitions'],
    queryFn: getWorkflowDefinitions,
    staleTime: 5 * 60 * 1000,
  });
  const services = useMemo(() => {
    if (!catalog) return [];
    const workflowKeys = new Set((defs ?? []).flatMap((d) => d.serviceKeys));
    return Object.values(catalog.services)
      .filter((s) => s.active && workflowKeys.has(s.key))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [catalog, defs]);

  const create = useMutation({
    mutationFn: () => {
      const svc = services.find((s) => s.key === serviceKey)!;
      return assignServiceToClient({
        clientUid, serviceKey: svc.key, serviceName: svc.displayName,
        paymentStatus,
        ...(professionalUid ? { professionalUid } : {}),
        ...(showAmounts ? {
          totalCost: Number(totalCost) || undefined,
          amountReceived: Number(amountReceived) || 0,
          paymentMode: paymentMode || undefined,
        } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to create matter.'),
  });

  function handleSubmit() {
    setError('');
    if (!clientUid) { setError('Please select a client.'); return; }
    if (!serviceKey) { setError('Please select a service.'); return; }
    if (showAmounts && !(Number(amountReceived) >= 0 && amountReceived !== '')) {
      setError('Enter the amount received.'); return;
    }
    create.mutate();
  }

  const selectedClient = clients.find((c) => c.uid === clientUid);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="card w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-b-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-hairline sticky top-0 bg-surface">
          <h2 className="text-base font-semibold text-ink">Create Matter</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Client picker */}
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Client</label>
            {selectedClient ? (
              <div className="flex items-center justify-between gap-2 input-field">
                <span className="truncate text-sm">{displayName(selectedClient)}</span>
                <button
                  className="text-xs text-brand-600 hover:underline shrink-0"
                  onClick={() => { setClientUid(''); setClientSearch(''); }}
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search clients by name or email…"
                    className="input-field pl-9 w-full"
                    autoFocus
                  />
                </div>
                <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-hairline divide-y divide-hairline">
                  {usersLoading ? (
                    <p className="text-sm text-ink-faint p-3">Loading clients…</p>
                  ) : filteredClients.length === 0 ? (
                    <p className="text-sm text-ink-faint p-3">No matching clients.</p>
                  ) : (
                    filteredClients.slice(0, 50).map((c) => (
                      <button
                        key={c.uid}
                        onClick={() => setClientUid(c.uid)}
                        className="w-full text-left px-3 py-2 hover:bg-surface-card transition-colors"
                      >
                        <p className="text-sm text-ink truncate">{displayName(c)}</p>
                        {c.email && <p className="text-xs text-ink-faint truncate">{c.email}</p>}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Service picker */}
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Service</label>
            {services.length === 0 ? (
              <p className="text-sm text-ink-muted">No services with a configured workflow are available yet.</p>
            ) : (
              <select
                value={serviceKey}
                onChange={(e) => setServiceKey(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select a service…</option>
                {services.map((s) => (
                  <option key={s.key} value={s.key}>{s.displayName}</option>
                ))}
              </select>
            )}
          </div>

          {/* Professional (#85) — optional handling staff member. */}
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">
              Professional <span className="text-ink-faint font-normal">(optional)</span>
            </label>
            <select
              aria-label="Professional"
              value={professionalUid}
              onChange={(e) => setProfessionalUid(e.target.value)}
              className="input-field w-full"
            >
              <option value="">— None —</option>
              {staff.map((u) => (
                <option key={u.uid} value={u.uid}>{displayName(u)}</option>
              ))}
            </select>
          </div>

          {/* Payment (#51) */}
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Payment status</label>
            <select
              aria-label="Payment status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as typeof paymentStatus)}
              className="input-field w-full"
            >
              <option value="not_paid">No Payment</option>
              <option value="part_paid">Part Payment</option>
              <option value="fully_paid">Full Payment</option>
            </select>

            {showAmounts && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-sm">
                  <span className="block text-ink-muted mb-1">Total Cost of Work</span>
                  <input type="number" min={0} value={totalCost} onChange={(e) => setTotalCost(e.target.value)} className="input-field w-full" placeholder="0" />
                </label>
                <label className="text-sm">
                  <span className="block text-ink-muted mb-1">Amount Received</span>
                  <input type="number" min={0} value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} className="input-field w-full" placeholder="0" />
                </label>
                <label className="text-sm">
                  <span className="block text-ink-muted mb-1">Mode of Payment</span>
                  <input type="text" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="input-field w-full" placeholder="UPI / NEFT / Cash…" />
                </label>
                <label className="text-sm">
                  <span className="block text-ink-muted mb-1">Amount Due</span>
                  <input type="text" readOnly value={amountDue} className="input-field w-full bg-surface-card text-ink-muted" />
                </label>
              </div>
            )}

            {paymentStatus === 'not_paid' && (
              <div className="mt-3 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-700">
                  With <strong>No Payment</strong>, the matter is sent to the <strong>Admin Approval</strong> box —
                  it is created only after an admin approves/overrides.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-hairline sticky bottom-0 bg-surface">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={create.isPending || !clientUid || !serviceKey}
            className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {create.isPending ? 'Creating…' : 'Create Matter'}
          </button>
        </div>
      </div>
    </div>
  );
}
