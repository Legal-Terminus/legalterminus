import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Redirects the root path `/` to the unified dashboard once the role resolves,
 * or to /login if unauthenticated. All roles share /dashboard — tiles within it
 * are filtered by role.
 */
export default function RootRedirect() {
  const { user, role, isLoading } = useAuthStore();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/unauthorized" replace />;
  return <Navigate to="/dashboard" replace />;
}
