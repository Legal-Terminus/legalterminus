import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, type PortalUser } from '../../api/users';
import { useAuthStore } from '../../store/authStore';
import { assignableRolesFor } from '../../lib/roles';
import {
  ArrowLeft, User, Mail, Phone, Briefcase,
  Shield, Calendar, AlertCircle, Save, X,
} from 'lucide-react';

type StaffRole = 'admin' | 'manager' | 'team_member';

interface TeamMember {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: StaffRole;
  joiningDate: string;
  fathersName?: string;
  dateOfBirth?: string;
  address?: string;
}

interface TeamMemberFormProps {
  // Accepts the unified PortalUser shape (role may be 'client'); the form
  // re-derives its own staff-only formData below.
  member: Partial<PortalUser> | null | undefined;
  onClose: () => void;
  onSuccess: () => void;
  isFullPage?: boolean; // kept for API compatibility — always renders full-page
}

const ROLES = [
  { value: 'team_member', label: 'Team Member', desc: 'Can view and work on assigned tasks', color: 'brand' },
  { value: 'manager',     label: 'Manager',     desc: 'Can manage team and task assignments', color: 'amber' },
  { value: 'admin',       label: 'Admin',        desc: 'Full access to all features',          color: 'red' },
] as const;

const COLOR_MAP = {
  brand: { border: 'border-brand-500 bg-brand-50', ring: 'ring-1 ring-brand-500', dot: 'bg-brand-600', label: 'text-brand-700' },
  amber: { border: 'border-amber-400 bg-amber-50', ring: 'ring-1 ring-amber-400', dot: 'bg-amber-500', label: 'text-amber-700' },
  red:   { border: 'border-red-400 bg-red-50',     ring: 'ring-1 ring-red-400',   dot: 'bg-red-500',   label: 'text-red-700'   },
};

export default function TeamMemberForm({ member, onClose, onSuccess }: TeamMemberFormProps) {
  const queryClient = useQueryClient();
  const currentRole = useAuthStore((s) => s.role);
  // Only show roles the current user is allowed to assign (manager can't mint admin/manager).
  const allowedRoleKeys = assignableRolesFor(currentRole);
  const selectableRoles = ROLES.filter((r) => allowedRoleKeys.includes(r.value));

  const incomingRole = member?.role;
  const initialRole: StaffRole =
    incomingRole === 'admin' || incomingRole === 'manager' || incomingRole === 'team_member'
      ? incomingRole
      : 'team_member';

  const [formData, setFormData] = useState<TeamMember>({
    name: member?.name ?? member?.fullName ?? '',
    email: member?.email ?? '',
    phone: member?.phone ?? '',
    designation: member?.designation ?? '',
    role: initialRole,
    joiningDate: member?.joiningDate ?? new Date().toISOString().split('T')[0],
    fathersName: member?.fathersName,
    dateOfBirth: member?.dateOfBirth,
    address: member?.address,
    uid: member?.uid,
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data: TeamMember) => {
      if (data.uid) {
        // PATCH accepts only updatable fields — `uid` is in the URL and `email`
        // is immutable; sending them trips the strict schema ("Unrecognized keys").
        const { uid, email: _email, ...updates } = data;
        void _email; // email is immutable — intentionally dropped from the PATCH payload
        return updateUser(uid, updates);
      }
      return createUser({ ...data, role: data.role });
    },
    onSuccess: () => {
      // Refresh the users grid (and this user's detail) so the new/updated row
      // appears without a manual page refresh.
      queryClient.invalidateQueries({ queryKey: ['portalUsers'] });
      if (member?.uid) queryClient.invalidateQueries({ queryKey: ['portalUser', member.uid] });
      onSuccess();
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.designation) {
      setError('Please fill all required fields');
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
        <h1 className="text-xl font-bold text-gray-900">{member ? 'Edit Team Member' : 'Add Team Member'}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {member ? "Update the member's information and role." : 'Create a new team member account and assign their role.'}
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
                    placeholder="e.g. Priya Sharma"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Email Address <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!member}
                    placeholder="priya@example.com"
                    className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-400"
                    required
                  />
                </div>
                {!!member && <p className="text-xs text-gray-400 mt-1">Email cannot be changed after creation</p>}
              </div>
              <div>
                <label className="input-label">Phone Number <span className="text-red-400">*</span></label>
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
              <div>
                <label className="input-label">Designation <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Legal Analyst"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Joining Date <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-brand-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Role &amp; Access</h3>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectableRoles.map((r) => {
                const isSelected = formData.role === r.value;
                const c = COLOR_MAP[r.color];
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: r.value }))}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      isSelected ? `${c.border} ${c.ring}` : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${c.dot}`} />}
                    <p className={`text-sm font-semibold ${isSelected ? c.label : 'text-gray-700'}`}>{r.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Additional Details</h3>
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Father's Name</label>
                <input
                  type="text"
                  name="fathersName"
                  value={formData.fathersName ?? ''}
                  onChange={handleChange}
                  placeholder="Father's full name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth ?? ''}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address ?? ''}
                  onChange={handleChange}
                  placeholder="Full residential address"
                  className="input-field"
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
              {mutation.isPending ? 'Saving…' : member ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
