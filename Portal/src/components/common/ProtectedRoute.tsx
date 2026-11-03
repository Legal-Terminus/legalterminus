import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../store/authStore';
import LoadingSpinner from './LoadingSpinner';
import RoleUnavailable from './RoleUnavailable';

interface Props {
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, role, isLoading, roleUnavailable } = useAuthStore();
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roleUnavailable) return <RoleUnavailable />;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
