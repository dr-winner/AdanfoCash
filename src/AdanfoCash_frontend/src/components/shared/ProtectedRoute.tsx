
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { redirectBasedOnRole } from '@/utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user.isAuthenticated) {
    return <Navigate to="/wallet-connection" replace />;
  }
  
  // If user is authenticated but not registered yet
  if (user.role === "unregistered") {
    return <Navigate to="/borrower-registration" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'borrower') {
      return <Navigate to="/borrower-dashboard" replace />;
    } else if (user.role === 'lender') {
      return <Navigate to="/lender-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
