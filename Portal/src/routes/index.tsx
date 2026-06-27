import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import NotFoundPage from '../pages/shared/NotFoundPage';
import RootRedirect from '../pages/shared/RootRedirect';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';
import RouteErrorPage from '../pages/shared/RouteErrorPage';
import { APP_ROUTES } from './appRoutes';
import type { Role } from '../store/authStore';

// Detect basename from current location for runtime flexibility.
// Supports both direct Cloud Run access (/) and Firebase Hosting rewrite (/portal/**).
const getCurrentBasename = (): string => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal')) {
    return '/portal';
  }
  return '';
};

const basename = getCurrentBasename();

// Group routes by identical role-set so each ProtectedRoute guard wraps the
// pages that share its access rule. Driven entirely by APP_ROUTES — adding a
// page or changing its roles never requires touching this file.
const groups = new Map<string, { roles: Role[]; routes: typeof APP_ROUTES }>();
for (const route of APP_ROUTES) {
  const key = [...route.roles].sort().join(',');
  if (!groups.has(key)) groups.set(key, { roles: route.roles, routes: [] });
  groups.get(key)!.routes.push(route);
}

const guardedBlocks = Array.from(groups.values()).map(({ roles, routes }) => ({
  element: <ProtectedRoute allowedRoles={roles} />,
  children: [
    {
      element: <AppLayout />,
      // A page that throws renders a friendly error inside the app shell (never a
      // raw stack trace for end users).
      errorElement: <RouteErrorPage />,
      children: routes.map((r) => ({ path: r.path, element: r.element })),
    },
  ],
}));

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect />, errorElement: <RouteErrorPage /> },
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorPage /> },
  { path: '/signup', element: <SignupPage />, errorElement: <RouteErrorPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage />, errorElement: <RouteErrorPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  ...guardedBlocks,
  { path: '*', element: <NotFoundPage /> },
], { basename });
