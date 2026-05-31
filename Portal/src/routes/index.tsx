import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import NotFoundPage from '../pages/shared/NotFoundPage';
import RootRedirect from '../pages/shared/RootRedirect';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';

// Admin pages
import AdminDashboard from '../pages/admin/DashboardPage';
import AdminTasks from '../pages/admin/TasksPage';
import AdminReports from '../pages/admin/ReportsPage';
import AdminUsers from '../pages/admin/UsersPage';
import WorkflowSettings from '../pages/admin/WorkflowSettingsPage';

// Report sub-pages
import AllTasksReport from '../pages/reports/AllTasksReport';
import CompletedTasksReport from '../pages/reports/CompletedTasksReport';
import PendingTasksReport from '../pages/reports/PendingTasksReport';
import MasterSheetReport from '../pages/reports/MasterSheetReport';

// Manager pages
import ManagerDashboard from '../pages/manager/DashboardPage';
import ManagerTasks from '../pages/manager/TasksPage';

// Team pages
import TeamDashboard from '../pages/team/DashboardPage';
import MyTasks from '../pages/team/MyTasksPage';

// Client pages
import ClientDashboard from '../pages/client/DashboardPage';
import TaskDetail from '../pages/client/TaskDetailPage';
import Services from '../pages/client/ServicesPage';

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/tasks', element: <AdminTasks /> },
          { path: '/admin/reports', element: <AdminReports /> },
          { path: '/admin/reports/all-tasks', element: <AllTasksReport /> },
          { path: '/admin/reports/completed', element: <CompletedTasksReport /> },
          { path: '/admin/reports/pending', element: <PendingTasksReport /> },
          { path: '/admin/reports/master-sheet', element: <MasterSheetReport /> },
          { path: '/admin/users', element: <AdminUsers /> },
          { path: '/admin/workflow-settings', element: <WorkflowSettings /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['manager']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/manager', element: <ManagerDashboard /> },
          { path: '/manager/tasks', element: <ManagerTasks /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['team_member']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/team', element: <TeamDashboard /> },
          { path: '/team/tasks', element: <MyTasks /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['client']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/client', element: <ClientDashboard /> },
          { path: '/client/tasks/:taskId', element: <TaskDetail /> },
          { path: '/client/services', element: <Services /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
