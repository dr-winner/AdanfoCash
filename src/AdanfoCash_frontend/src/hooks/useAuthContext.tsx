
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, anonymousUser } from '../types/authTypes';
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType } from '@/types/auth';
import { redirectBasedOnRole, checkRouteAccess } from '@/utils/authUtils';
import { getCurrentUser } from '../services/userService';
import { isAuthenticated } from '../services/authClient';
import { login as authLogin, logout as authLogout } from '../services/authOperations';
import { registerUser as registerUserService } from '../services/userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(anonymousUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      setIsRegistered(currentUser.isAuthenticated && currentUser.role !== "unregistered");
      
      if (currentUser.isAuthenticated) {
        if (redirectPath) {
          navigate(redirectPath);
          setRedirectPath(null);
        } else if (location.pathname === '/wallet-connection') {
          if (currentUser.role === "unregistered") {
            navigate('/borrower-registration');
          } else {
            redirectBasedOnRole(currentUser.role, navigate);
          }
        }
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      toast({
        title: "Authentication Error",
        description: "There was a problem checking your authentication status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (returnToPath?: string) => {
    setIsLoading(true);
    try {
      if (returnToPath) {
        console.log("Saving redirect path:", returnToPath);
        setRedirectPath(returnToPath);
      }
      
      const success = await authLogin();
      if (success) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        setIsRegistered(currentUser.role !== "unregistered");
        
        toast({
          title: "Login Successful",
          description: "You're now signed in with Internet Identity.",
        });
        
        if (redirectPath) {
          console.log("Redirecting to:", redirectPath);
          navigate(redirectPath);
          setRedirectPath(null);
        } else {
          if (currentUser.role === "unregistered") {
            navigate('/borrower-registration');
          } else {
            redirectBasedOnRole(currentUser.role, navigate);
          }
        }
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Could not sign in with Internet Identity.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "There was a problem during the login process.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authLogout();
      setUser(anonymousUser);
      setIsRegistered(false);
      toast({
        title: "Logged Out",
        description: "You've been successfully signed out of Internet Identity.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was a problem during the logout process.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const registerUserHandler = async (role: "borrower" | "lender", name: string) => {
    try {
      if (!user.isAuthenticated || !user.principalId) {
        toast({
          title: "Registration Error",
          description: "You must be logged in to register.",
          variant: "destructive"
        });
        return false;
      }
      
      if (role === "borrower" && !user.isVerified) {
        toast({
          title: "Verification Required",
          description: "You must complete student verification before registering as a borrower.",
          variant: "destructive"
        });
        return false;
      }
      
      const success = registerUserService(user.principalId, role, name);
      
      if (success) {
        await checkAuth();
        
        toast({
          title: "Registration Successful",
          description: `You are now registered as a ${role === "borrower" ? "student borrower" : "lender"}.`,
        });
        
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: "Could not complete registration.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "There was a problem during the registration process.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    checkRouteAccess(location.pathname, user, navigate, isLoading);
  }, [location.pathname, user, isLoading, navigate]);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        checkAuth,
        isRegistered,
        setIsRegistered,
        registerUser: registerUserHandler
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
