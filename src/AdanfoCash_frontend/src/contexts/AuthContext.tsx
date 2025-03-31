
import { AuthProvider, useAuth } from '@/hooks/useAuthContext';
import { protectedRoutes, publicRoutes } from '@/types/auth';

// Re-export everything from the hook
export { AuthProvider, useAuth, protectedRoutes, publicRoutes };
