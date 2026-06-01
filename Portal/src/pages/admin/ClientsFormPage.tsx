import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageShell from '../../components/common/PageShell';
import ClientForm from '../../components/admin/ClientForm';
import { apiFetch } from '../../api/client';

interface Client {
  clientId?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  organisation?: string;
  businessName?: string;
  gstNumber?: string;
  panNumber?: string;
  aadharNumber?: string;
  state?: string;
  emailIds: string[];
}

export default function ClientsFormPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // Fetch client if editing
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const res = await apiFetch(`/api/clients/${clientId}`);
      if (!res.ok) throw new Error('Failed to fetch client');
      return res.json();
    },
    enabled: !!clientId,
  });

  const handleClose = () => {
    navigate('/admin/clients');
  };

  const handleSuccess = () => {
    navigate('/admin/clients');
  };

  return (
    <PageShell title={clientId ? 'Edit Client' : 'New Client'}>
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <ClientForm
              client={client || null}
              onClose={handleClose}
              onSuccess={handleSuccess}
              isFullPage={true}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
