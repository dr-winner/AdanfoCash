import { User, UserRole, anonymousUser, StudentInfo } from "../types/authTypes";
import { getIdentity, isAuthenticated } from "./authClient";

// Local storage key for registration status
const REGISTRATION_KEY = "adanfocash_user_registration";
const LOAN_HISTORY_KEY = "adanfocash_loan_history";
const STUDENT_VERIFICATION_KEY = "adanfocash_student_verification";

// Get current user information
export const getCurrentUser = async (): Promise<User> => {
  if (!(await isAuthenticated())) {
    return anonymousUser;
  }

  const identity = await getIdentity();
  
  if (!identity) {
    return anonymousUser;
  }
  
  // Get principal ID from identity
  const principalId = identity.getPrincipal().toString();
  
  // Check if user is registered
  const registrationData = getRegistration(principalId);
  
  if (!registrationData) {
    // User is authenticated but not registered
    return {
      id: generateNameFromPrincipal(principalId),
      principalId,
      role: "unregistered",
      isAuthenticated: true,
      creditScore: 0,
      isVerified: false
    };
  }
  
  // Get student verification data if it exists
  const studentInfo = getStudentVerification(principalId);
  
  // User is registered
  return {
    id: registrationData.name || generateNameFromPrincipal(principalId),
    principalId,
    role: registrationData.role,
    isAuthenticated: true,
    creditScore: registrationData.role === "borrower" ? registrationData.creditScore || 0 : 0,
    isVerified: registrationData.isVerified || false,
    studentInfo: studentInfo || undefined
  };
};

// Register user as borrower or lender
export const registerUser = (principalId: string, role: "borrower" | "lender", name: string): boolean => {
  try {
    const registrations = getRegistrations();
    
    // Generate anonymous name instead of using user's real name
    const anonymousName = generateNameFromPrincipal(principalId);
    
    registrations[principalId] = {
      role,
      name: anonymousName, // Use anonymous name
      registeredAt: new Date().toISOString(),
      creditScore: role === "borrower" ? 0 : 0, // Start credit score at 0
      isVerified: false
    };
    
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};

// Update borrower verification status
export const updateVerificationStatus = (principalId: string, isVerified: boolean): boolean => {
  try {
    const registrations = getRegistrations();
    if (registrations[principalId]) {
      registrations[principalId].isVerified = isVerified;
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Verification update error:", error);
    return false;
  }
};

// Save student verification information
export const saveStudentVerification = (
  principalId: string, 
  studentInfo: StudentInfo
): boolean => {
  try {
    const verifications = getStudentVerifications();
    verifications[principalId] = {
      ...studentInfo,
      verifiedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STUDENT_VERIFICATION_KEY, JSON.stringify(verifications));
    
    // Also mark user as verified in registration
    updateVerificationStatus(principalId, true);
    
    return true;
  } catch (error) {
    console.error("Student verification error:", error);
    return false;
  }
};

// Get student verification for a principal
export const getStudentVerification = (principalId: string): StudentInfo | null => {
  const verifications = getStudentVerifications();
  return verifications[principalId] || null;
};

// Helper function to get all student verifications
const getStudentVerifications = (): Record<string, any> => {
  const verificationsJson = localStorage.getItem(STUDENT_VERIFICATION_KEY);
  return verificationsJson ? JSON.parse(verificationsJson) : {};
};

// Validate student loan eligibility
export const validateStudentEligibility = (
  studentInfo: StudentInfo,
  loanDurationMonths: number
): { isEligible: boolean, reason?: string } => {
  // Check if student is enrolled
  if (!studentInfo.isEnrolled) {
    return { isEligible: false, reason: "Student is not currently enrolled" };
  }
  
  // Check minimum GPA requirement (1.5/4.0)
  if (studentInfo.gpa < 1.5) {
    return { isEligible: false, reason: "GPA does not meet minimum requirement of 1.5" };
  }
  
  // Check graduation date is at least 5 months away
  const graduationDate = new Date(studentInfo.graduationDate);
  const fiveMonthsFromNow = new Date();
  fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
  
  if (graduationDate < fiveMonthsFromNow) {
    return { 
      isEligible: false, 
      reason: "Graduation date must be at least 5 months away" 
    };
  }
  
  // Check that loan duration doesn't exceed graduation date
  const loanEndDate = new Date();
  loanEndDate.setMonth(loanEndDate.getMonth() + loanDurationMonths);
  
  if (loanEndDate > graduationDate) {
    return { 
      isEligible: false, 
      reason: "Loan repayment period exceeds graduation date" 
    };
  }
  
  return { isEligible: true };
};

// Update borrower credit score
export const updateCreditScore = (principalId: string, newScore: number): boolean => {
  try {
    const registrations = getRegistrations();
    if (registrations[principalId] && registrations[principalId].role === "borrower") {
      registrations[principalId].creditScore = newScore;
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Credit score update error:", error);
    return false;
  }
};

// Record loan repayment for credit score calculation
export const recordLoanRepayment = (
  borrowerId: string, 
  loanId: string, 
  onTime: boolean
): boolean => {
  try {
    // Get borrower's registration
    const registrations = getRegistrations();
    const borrower = registrations[borrowerId];
    
    if (!borrower || borrower.role !== "borrower") {
      return false;
    }
    
    // Get loan repayment history
    const loanHistory = getLoanHistory(borrowerId);
    
    // Add this repayment to history
    loanHistory.push({
      loanId,
      repaymentDate: new Date().toISOString(),
      onTime,
    });
    
    // Save history
    saveLoanHistory(borrowerId, loanHistory);
    
    // Calculate new credit score based on payment history
    const newScore = calculateCreditScore(borrower.creditScore || 650, loanHistory);
    
    // Update borrower's credit score
    borrower.creditScore = newScore;
    registrations[borrowerId] = borrower;
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
    
    return true;
  } catch (error) {
    console.error("Loan repayment recording error:", error);
    return false;
  }
};

// Calculate credit score based on repayment history
const calculateCreditScore = (baseScore: number, repaymentHistory: any[]): number => {
  if (repaymentHistory.length === 0) {
    return baseScore;
  }
  
  // Calculate on-time payment percentage
  const totalPayments = repaymentHistory.length;
  const onTimePayments = repaymentHistory.filter(payment => payment.onTime).length;
  const onTimePercentage = onTimePayments / totalPayments;
  
  // Determine score adjustments
  let scoreAdjustment = 0;
  
  // Reward for perfect payment history
  if (onTimePercentage === 1 && totalPayments >= 3) {
    scoreAdjustment += 30;
  } 
  // Good payment history (85%+ on time)
  else if (onTimePercentage >= 0.85) {
    scoreAdjustment += 15;
  } 
  // Average payment history (70-85% on time)
  else if (onTimePercentage >= 0.7) {
    scoreAdjustment += 0;
  } 
  // Poor payment history (below 70% on time)
  else {
    scoreAdjustment -= 25;
  }
  
  // Recent payment behavior has more weight
  const recentPayments = repaymentHistory.slice(-3);
  const recentOnTimePayments = recentPayments.filter(payment => payment.onTime).length;
  
  if (recentPayments.length === 3) {
    if (recentOnTimePayments === 3) {
      scoreAdjustment += 10; // All recent payments on time
    } else if (recentOnTimePayments === 0) {
      scoreAdjustment -= 20; // All recent payments late
    }
  }
  
  // Calculate new score with limits
  let newScore = baseScore + scoreAdjustment;
  
  // Cap score between 300 and 850 (typical credit score range)
  newScore = Math.max(300, Math.min(850, newScore));
  
  return newScore;
};

// Helper functions for loan history
const getLoanHistory = (borrowerId: string): any[] => {
  try {
    const historyJson = localStorage.getItem(LOAN_HISTORY_KEY);
    const allHistory = historyJson ? JSON.parse(historyJson) : {};
    return allHistory[borrowerId] || [];
  } catch (error) {
    console.error("Error getting loan history:", error);
    return [];
  }
};

const saveLoanHistory = (borrowerId: string, history: any[]): void => {
  try {
    const historyJson = localStorage.getItem(LOAN_HISTORY_KEY);
    const allHistory = historyJson ? JSON.parse(historyJson) : {};
    allHistory[borrowerId] = history;
    localStorage.setItem(LOAN_HISTORY_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error("Error saving loan history:", error);
  }
};

// Helper function to get all registrations
const getRegistrations = (): Record<string, any> => {
  const registrationsJson = localStorage.getItem(REGISTRATION_KEY);
  return registrationsJson ? JSON.parse(registrationsJson) : {};
};

// Helper function to get registration for a principal
const getRegistration = (principalId: string): any => {
  const registrations = getRegistrations();
  return registrations[principalId];
};

// Generate a realistic anonymous name based on the principal
const generateNameFromPrincipal = (principalId: string): string => {
  const localNames = [
    "Anon Student",
    "Mystery Borrower",
    "Crypto Learner",
    "Web3 Scholar",
    "Blockchain User",
    "Digital Student",
    "Crypto Explorer",
    "DeFi Scholar",
    "Anonymous Learner",
    "Tech Student"
  ];

  // Use the principalId to deterministically select a name
  const nameIndex = Array.from(principalId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % localNames.length;
  return localNames[nameIndex];
};
