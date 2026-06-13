import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TeamMemberForm from '../../components/users/TeamMemberForm';
import ClientForm from '../../components/users/ClientForm';
import { getUser } from '../../api/users';

/**
 * Unified form page for creating/editing any user role.
 * Route params:
 *   type = "member" | "client"
 *   uid  = existing user id (omitted for create)
 *
 * All user data comes from the single /api/portal/users endpoint regardless of
 * role; the `type` param only selects which form layout to render.
 */
export default function UserFormPage() {
  const { type, uid } = useParams<{ type: 'member' | 'client'; uid?: string }>();
  const navigate = useNavigate();
  const backTo = '/users';

  const { data: user, isLoading } = useQuery({
    queryKey: ['portalUser', uid],
    queryFn: () => getUser(uid!),
    enabled: !!uid,
  });

  const member = type === 'member' ? user : undefined;
  const client = type === 'client' ? user : undefined;

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

  if (type === 'client') {
    return (
      <ClientForm
        client={client ?? null}
        onClose={() => navigate(backTo)}
        onSuccess={() => navigate(backTo)}
        isFullPage
      />
    );
  }

  return (
    <TeamMemberForm
      member={member ?? null}
      onClose={() => navigate(backTo)}
      onSuccess={() => navigate(backTo)}
      isFullPage
    />
  );
}
