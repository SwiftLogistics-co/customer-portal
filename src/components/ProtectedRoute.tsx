import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Determine which login page to redirect to based on the current path
    const isDriverRoute = location.pathname.startsWith('/driver');
    const loginPath = isDriverRoute ? '/driver/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Role-based route protection
  const isDriverRoute = location.pathname.startsWith('/driver');
  const isCustomerRoute = !isDriverRoute && location.pathname !== '/';

  if (isDriverRoute && user.role !== 'driver') {
    return <Navigate to="/login" replace />;
  }

  if (isCustomerRoute && user.role !== 'customer') {
    return <Navigate to="/driver/login" replace />;
  }

  return <>{children}</>;
};