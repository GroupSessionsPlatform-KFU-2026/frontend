import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
