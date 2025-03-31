
import { User } from '../services/auth';

export interface AuthContextType {
  user: User;
  isLoading: boolean;
  login: (redirectPath?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  registerUser: (role: "borrower" | "lender", name: string) => Promise<boolean>;
}

// Define protected routes by role
export const protectedRoutes = {
  borrower: ['/borrower-dashboard'],
  lender: ['/lender-dashboard'],
  all: ['/borrower-dashboard', '/lender-dashboard']
};

// Public routes that don't require authentication
export const publicRoutes = ['/', '/wallet-connection', '/borrower-registration', '/lender-registration'];
