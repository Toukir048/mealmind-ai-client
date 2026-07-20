import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Loading } from '../components/loaders/Loading';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <Loading label="Checking your session" />;
  if (user === null) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
