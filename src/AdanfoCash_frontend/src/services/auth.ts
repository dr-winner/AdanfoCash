
// Re-export everything from refactored files
import { anonymousUser, StudentInfo } from "../types/authTypes";
import { getHost } from "./authConfig";
import { isAuthenticated, getIdentity } from "./authClient";
import { 
  getCurrentUser, 
  updateCreditScore, 
  recordLoanRepayment, 
  validateStudentEligibility, 
  saveStudentVerification,
  getStudentVerification
} from "./userService";
import { login, logout } from "./authOperations";

// Re-export types with the 'export type' syntax
export type { User, UserRole } from "../types/authTypes";

// Export all auth-related functionality
export {
  // Values
  anonymousUser,
  
  // Auth status and identity
  isAuthenticated,
  getIdentity,
  
  // User data
  getCurrentUser,
  updateCreditScore,
  recordLoanRepayment,
  
  // Student verification
  validateStudentEligibility,
  saveStudentVerification,
  getStudentVerification,
  
  // Auth operations
  login,
  logout,
  
  // Config
  getHost
};
