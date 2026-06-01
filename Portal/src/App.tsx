import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAuthListener } from './hooks/useAuth';

export default function App() {
  useAuthListener();
  return <RouterProvider router={router} />;
}
