import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Redirects the root path `/` to the correct dashboard based on the
 * authenticated user's role. Redirects to /login if unauthenticated.
 */
export default function RootRedirect() {
  const { user, role, isLoading } = useAuthStore();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'team_member':
      return <Navigate to="/team" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}
