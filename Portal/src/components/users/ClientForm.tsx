import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, type PortalUser } from '../../api/users';
import { getServiceCatalog } from '../../api/services';
import { assignServiceToClient } from '../../api/tasks';
import { getWorkflowDefinitions } from '../../api/workflowDefinitions';
import { useAuthStore } from '../../store/authStore';
import { assignableRolesFor, isStaffRole, roleLabel, type Role } from '../../lib/roles';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building2, Briefcase, Shield,
  FileText, AlertCircle, Save, X, Plus, Workflow, CheckCircle2,
} from 'lucide-react';

interface Client {
  clientId?: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  designation?: string;
  organisation?: string;
  businessName?: string;
  professionalName?: string;
  groupCompany?: string;
  gstNumber?: string;
  panNumber?: string;
  aadharNumber?: string;
  state?: string;
  emailIds: string[];
}

interface ClientFormProps {
  // Accepts the unified PortalUser shape; the form re-derives its own formData.
  client: Partial<PortalUser> | null | undefined;
  onClose: () => void;
  onSuccess: () => void;
  isFullPage?: boolean;
}

export default function ClientForm({ client, onClose, onSuccess }: ClientFormProps) {
  const queryClient = useQueryClient();
  const id = client?.uid;
  const currentRole = useAuthStore((s) => s.role);

  // Roles the current user may assign. Role changes are only offered when
  // editing an existing user and the actor can assign more than just 'client'
  // (e.g. promote a client to team_member). Mirrors the backend authz gate.
  const assignableRoles = assignableRolesFor(currentRole);
  const canChangeRole = !!id && assignableRoles.filter((r) => r !== 'client').length > 0;

  const [formData, setFormData] = useState<Client>({
    name: client?.name ?? client?.fullName ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
    role: client?.role ?? 'client',
    designation: client?.designation,
    organisation: client?.organisation,
    businessName: client?.businessName,
    professionalName: client?.professionalName,
    groupCompany: client?.groupCompany,
    gstNumber: client?.gstNumber,
    panNumber: client?.panNumber,
    aadharNumber: client?.aadhaarNumber,
    state: client?.state,
    emailIds: client?.emailIds ?? [],
    uid: client?.uid,
  });
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [error, setError] = useState('');

  const promotingToStaff = isStaffRole(formData.role);

  const mutation = useMutation({
    mutationFn: async (data: Client) => {
      const allEmails = [data.email, ...data.emailIds.filter((e) => e !== data.email)];
      if (id) {
        // PATCH accepts only updatable fields — `uid` is in the URL and `email`
        // is immutable; sending them trips the strict schema ("Unrecognized keys").
        const { uid: _uid, email: _email, role, designation, ...rest } = data;
        void _uid; void _email; // intentionally dropped from the PATCH payload
        // Only send `role` when it can be changed; only send `designation` for
        // staff roles (backend requires it for staff, ignores it for clients).
        return updateUser(id, {
          ...rest,
          emailIds: allEmails,
          ...(canChangeRole ? { role } : {}),
          ...(canChangeRole && isStaffRole(role) ? { designation } : {}),
        });
      }
      // Create is always a client here; promotion happens on a later edit.
      return createUser({ ...data, emailIds: allEmails, role: 'client' as const });
    },
    onSuccess: () => {
      // Refresh the users grid (and this user's detail) so the new/updated row
      // appears without a manual page refresh.
      queryClient.invalidateQueries({ queryKey: ['portalUsers'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['portalUser', id] });
      onSuccess();
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmail = () => {
    const trimmed = secondaryEmail.trim();
    if (trimmed && trimmed !== formData.email && !formData.emailIds.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, emailIds: [...prev.emailIds, trimmed] }));
      setSecondaryEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormData((prev) => ({ ...prev, emailIds: prev.emailIds.filter((e) => e !== email) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill all required fields');
      return;
    }
    if (canChangeRole && promotingToStaff && !formData.designation?.trim()) {
      setError('Designation is required when assigning a staff role.');
      return;
    }
    setError('');
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{id ? 'Edit Client' : 'Add Client'}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {id ? "Update the client's profile and contact details." : 'Create a new client account.'}
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-brand-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Basic Information</h3>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Full Name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Mehta"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Primary Email <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!id}
                    placeholder="rahul@example.com"
                    className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-400"
                    required
                  />
                </div>
                {!!id && <p className="text-xs text-gray-400 mt-1">Email cannot be changed after creation</p>}
              </div>
              <div>
                <label className="input-label">Phone <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Address <span className="text-red-400">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="input-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state ?? ''}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Role & Access — only when editing, and only if the actor can promote */}
          {canChangeRole && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Role &amp; Access</h3>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Role <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as Role }))}
                      className="input-field pl-10"
                    >
                      {assignableRoles.map((r) => (
                        <option key={r} value={r}>{roleLabel(r)}</option>
                      ))}
                    </select>
                  </div>
                  {promotingToStaff && formData.role !== client?.role && (
                    <p className="text-xs text-amber-600 mt-1">
                      Promoting to staff grants access to internal portal areas.
                    </p>
                  )}
                </div>
                {promotingToStaff && (
                  <div>
                    <label className="input-label">Designation <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation ?? ''}
                        onChange={handleChange}
                        placeholder="e.g. Legal Analyst"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Emails */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Additional Emails</h3>
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEmail(); } }}
                  placeholder="secondary@example.com"
                  className="input-field pl-10"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEmail}
                className="btn-secondary shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {formData.emailIds.filter((e) => e !== formData.email).length > 0 && (
              <div className="space-y-2">
                {formData.emailIds.filter((e) => e !== formData.email).map((email) => (
                  <div key={email} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl text-sm">
                    <span className="text-gray-700 truncate">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="ml-3 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Business Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Business Details</h3>
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Organisation Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation ?? ''}
                    onChange={handleChange}
                    placeholder="e.g. Mehta Enterprises"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName ?? ''}
                  onChange={handleChange}
                  placeholder="Trade / brand name"
                  className="input-field"
                />
              </div>
              {/* #62: map this client to a reference and/or group company.
                  #150: the LABEL is "Reference" — the stored field stays
                  `professionalName` so existing client records and the mapping
                  report keep working without a data migration. */}
              <div>
                <label className="input-label">Reference</label>
                <input
                  type="text"
                  name="professionalName"
                  value={formData.professionalName ?? ''}
                  onChange={handleChange}
                  placeholder="Who referred this client"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Group / Parent Company</label>
                <input
                  type="text"
                  name="groupCompany"
                  value={formData.groupCompany ?? ''}
                  onChange={handleChange}
                  placeholder="Parent / group entity"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">GST Number</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber ?? ''}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="input-field pl-10 font-mono uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">PAN Number</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber ?? ''}
                    onChange={handleChange}
                    placeholder="AAAAA0000A"
                    className="input-field pl-10 font-mono uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber ?? ''}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  className="input-field font-mono"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 sm:flex-none sm:px-6">
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              <Save className="w-4 h-4" />
              {mutation.isPending ? 'Saving…' : id ? 'Update Client' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>

      {/* Assign a service workflow — only for existing clients */}
      {id && <AssignServiceSection clientUid={id} clientName={formData.name} />}
    </div>
  );
}

/**
 * Assign a workflow-backed service to a client → creates a task. Lists only
 * services that have a configured workflow (registry ∩ catalog).
 */
function AssignServiceSection({ clientUid, clientName }: { clientUid: string; clientName: string }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: catalog } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000,
  });

  // Which service keys have a configured workflow definition (data-driven).
  const { data: defs } = useQuery({
    queryKey: ['workflow-definitions'],
    queryFn: getWorkflowDefinitions,
    staleTime: 5 * 60 * 1000,
  });
  const workflowServiceKeys = new Set((defs ?? []).flatMap((d) => d.serviceKeys));

  // Workflow-backed, active services only.
  const services = catalog
    ? Object.values(catalog.services)
        .filter((s) => s.active && workflowServiceKeys.has(s.key))
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
    : [];

  const assignMutation = useMutation({
    mutationFn: (svc: { key: string; displayName: string }) =>
      assignServiceToClient({ clientUid, serviceKey: svc.key, serviceName: svc.displayName }),
    onSuccess: (_task, svc) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDone(svc.displayName);
      setSelected('');
    },
    onError: (err: Error) => setError(err.message || 'Failed to assign service.'),
  });

  function handleAssign() {
    setError('');
    const svc = services.find((s) => s.key === selected);
    if (!svc) { setError('Please select a service.'); return; }
    assignMutation.mutate({ key: svc.key, displayName: svc.displayName });
  }

  return (
    <div className="card p-6 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
          <Workflow className="w-3.5 h-3.5 text-brand-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">Assign Service</h3>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {done && (
        <div className="mb-3 flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-700">
            “{done}” assigned to {clientName}. A task has been created.
          </p>
        </div>
      )}
      {error && (
        <div className="mb-3 flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {services.length === 0 ? (
        <p className="text-sm text-ink-muted">No services with a configured workflow are available yet.</p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="input-field flex-1"
          >
            <option value="">Select a service…</option>
            {services.map((s) => (
              <option key={s.key} value={s.key}>{s.displayName}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAssign}
            disabled={assignMutation.isPending || !selected}
            className="btn-primary sm:w-auto disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {assignMutation.isPending ? 'Assigning…' : 'Assign'}
          </button>
        </div>
      )}
    </div>
  );
}
