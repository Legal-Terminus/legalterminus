import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
      <Link to="/login" className="text-blue-600 hover:underline">Return to login</Link>
    </div>
  );
}
