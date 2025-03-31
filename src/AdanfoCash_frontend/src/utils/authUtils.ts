
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/authTypes";
import { NavigateFunction } from "react-router-dom";

// Helper function to redirect based on user role
export const redirectBasedOnRole = (role: string, navigate: NavigateFunction): void => {
  if (role === 'borrower') {
    navigate('/borrower-dashboard');
  } else if (role === 'lender') {
    navigate('/lender-dashboard');
  } else if (role === 'unregistered') {
    navigate('/borrower-registration');
  } else {
    navigate('/');
  }
};

// Helper function to check if user has access to the current route
export const checkRouteAccess = (
  currentPath: string,
  user: User,
  navigate: NavigateFunction,
  isLoading: boolean
): void => {
  // Import routes from types
  const protectedRoutes = {
    borrower: ['/borrower-dashboard'],
    lender: ['/lender-dashboard'],
    all: ['/borrower-dashboard', '/lender-dashboard']
  };
  
  const publicRoutes = ['/', '/wallet-connection', '/borrower-registration', '/lender-registration'];
  
  if (isLoading) return;
  
  // Allow public routes for everyone
  if (publicRoutes.includes(currentPath)) {
    return;
  }

  // If user is not authenticated and trying to access a protected route
  if (!user.isAuthenticated && protectedRoutes.all.includes(currentPath)) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
    });
    navigate('/wallet-connection');
    return;
  }

  // If user is authenticated but not registered yet
  if (user.isAuthenticated && user.role === "unregistered" && !currentPath.includes('registration')) {
    toast({
      title: "Registration Required",
      description: "Please complete registration to access this page.",
    });
    navigate('/borrower-registration');
    return;
  }

  // If user is authenticated but trying to access a route they don't have permission for
  if (user.isAuthenticated && user.role !== "unregistered") {
    const userRoleRoutes = protectedRoutes[user.role as keyof typeof protectedRoutes] || [];
    
    if (protectedRoutes.all.includes(currentPath) && !userRoleRoutes.includes(currentPath)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
      });
      
      // Redirect to appropriate dashboard based on role
      redirectBasedOnRole(user.role, navigate);
    }
  }
};
