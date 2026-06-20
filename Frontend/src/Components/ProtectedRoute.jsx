import { Navigate } from 'react-router-dom';
import { useUser } from '@/Context/UserContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useUser();

  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;
  if (role && user.role !== role) return <Navigate to="/*" />;

  return children;
}