import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createUser, updateUser, type PortalUser } from '../../api/users';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building2,
  FileText, AlertCircle, Save, X, Plus,
} from 'lucide-react';

interface Client {
  clientId?: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  organisation?: string;
  businessName?: string;
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
  const id = client?.uid;

  const [formData, setFormData] = useState<Client>({
    name: client?.name ?? client?.fullName ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
    organisation: client?.organisation,
    businessName: client?.businessName,
    gstNumber: client?.gstNumber,
    panNumber: client?.panNumber,
    aadharNumber: client?.aadhaarNumber,
    state: client?.state,
    emailIds: client?.emailIds ?? [],
    uid: client?.uid,
  });
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: Client) => {
      const allEmails = [data.email, ...data.emailIds.filter((e) => e !== data.email)];
      const payload = { ...data, emailIds: allEmails, role: 'client' as const };
      return id ? updateUser(id, payload) : createUser(payload);
    },
    onSuccess: () => onSuccess(),
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
    </div>
  );
}
