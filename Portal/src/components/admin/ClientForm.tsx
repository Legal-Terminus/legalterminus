import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../api/client';

interface Client {
  clientId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  organisation?: string;
  gstNumber?: string;
  panNumber?: string;
  aadharNumber?: string;
  emailIds: string[];
  state?: string;
  businessName?: string;
}

interface ClientFormProps {
  client: Client | null;
  onClose: () => void;
  onSuccess: () => void;
  isFullPage?: boolean;
}

export default function ClientForm({ client, onClose, onSuccess, isFullPage = false }: ClientFormProps) {
  const [formData, setFormData] = useState<Client>(
    client || {
      name: '',
      email: '',
      phone: '',
      address: '',
      emailIds: [],
    }
  );
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: Client) => {
      const url = data.clientId ? `/api/clients/${data.clientId}` : '/api/clients';
      const method = data.clientId ? 'PATCH' : 'POST';
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save client');
      }
      return res.json();
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmail = () => {
    if (secondaryEmail && !formData.emailIds.includes(secondaryEmail)) {
      setFormData(prev => ({
        ...prev,
        emailIds: [...prev.emailIds, secondaryEmail]
      }));
      setSecondaryEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    if (email !== formData.email) {
      setFormData(prev => ({
        ...prev,
        emailIds: prev.emailIds.filter(e => e !== email)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill all required fields');
      return;
    }
    // Ensure primary email is in emailIds
    const allEmails = [formData.email, ...formData.emailIds.filter(e => e !== formData.email)];
    mutation.mutate({ ...formData, emailIds: allEmails });
  };

  return isFullPage ? (
    <div className="w-full">
      <div className="mb-6">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded text-red-700 text-xs md:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            {/* Primary Email */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Primary Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!client}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
              />
              <p className="text-xs text-gray-500 mt-1 md:mt-2">Primary email used for login</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            {/* Secondary Emails */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Emails</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="Add another email..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Add
                </button>
              </div>
              {formData.emailIds.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.emailIds.map((email) => (
                    <div key={email} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                      <span>{email}</span>
                      {email !== formData.email && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Organisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Organisation Name</label>
              <input
                type="text"
                name="organisation"
                value={formData.organisation || ''}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName || ''}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber || ''}
                onChange={handleChange}
                placeholder="XX0000XX00X0Z0"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber || ''}
                onChange={handleChange}
                placeholder="XXXXX0000X"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber || ''}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-2 md:gap-3 ${isFullPage ? 'pt-8 md:pt-10' : 'pt-4 md:pt-6'}`}>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 md:px-4 md:py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium text-sm md:text-base transition-colors"
              >
                {isFullPage ? 'Cancel' : 'Close'}
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 px-4 py-3 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium text-sm md:text-base transition-colors"
              >
                {mutation.isPending ? 'Saving...' : client ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                {client ? 'Edit Client' : 'New Client'}
              </h2>

              {error && (
                <div className="mb-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded text-red-700 text-xs md:text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Primary Email */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Primary Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!client}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
                  />
                </div>

                {/* Secondary Emails */}
                {formData.emailIds.length > 1 && (
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Additional Emails</label>
                    <div className="space-y-1 md:space-y-2">
                      {formData.emailIds.slice(1).map((email, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded">
                          <span className="text-xs md:text-sm text-gray-700 break-all">{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(email)}
                            className="ml-2 text-xs md:text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Secondary Email */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Add Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={secondaryEmail}
                      onChange={(e) => setSecondaryEmail(e.target.value)}
                      placeholder="additional@example.com"
                      className="flex-1 px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    />
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      className="px-4 py-3 md:px-3 md:py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium text-sm md:text-base transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Organisation */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Organisation</label>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber || ''}
                    onChange={handleChange}
                    placeholder="AAAAA0000A"
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber || ''}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 md:gap-3 pt-4 md:pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 md:px-4 md:py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium text-sm md:text-base transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 px-4 py-3 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium text-sm md:text-base transition-colors"
                  >
                    {mutation.isPending ? 'Saving...' : client ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
}
