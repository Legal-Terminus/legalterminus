import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TeamMemberForm from '../../components/admin/TeamMemberForm';
import { apiFetch } from '../../api/client';

interface TeamMember {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: 'admin' | 'manager' | 'team_member';
  joiningDate: string;
  fathersName?: string;
  dateOfBirth?: string;
  address?: string;
}

export default function TeamMembersFormPage() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const { data: member, isLoading } = useQuery({
    queryKey: ['teamMember', uid],
    queryFn: async () => {
      if (!uid) return null;
      return await apiFetch<TeamMember>(`/api/team-members/${uid}`);
    },
    enabled: !!uid,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <TeamMemberForm
      member={member || null}
      onClose={() => navigate('/admin/team-members')}
      onSuccess={() => navigate('/admin/team-members')}
      isFullPage={true}
    />
  );
}
