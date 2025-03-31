
// Integration with Motoko backend on Internet Computer Protocol
import { Actor, HttpAgent } from "@dfinity/agent";
import { getIdentity, getHost } from "./auth";

// Types
export interface Loan {
  id: string;
  borrowerId: string;
  lenderId: string | null;
  amount: number;
  duration: number; // in months
  purpose: string;
  roi: number; // rate of interest
  creditScore: number;
  risk: "low" | "medium" | "high";
  status: "pending" | "funded" | "active" | "repaid" | "defaulted";
  createdAt: string;
  repaidAmount?: number;
  dueDate?: string;
}

export interface LenderStats {
  totalLent: number;
  interestEarned: number;
  activeLoans: number;
  averageROI: number;
}

export interface BorrowerStats {
  creditScore: number;
  totalBorrowed: number;
  activeLoans: Loan[];
}

// Import declarations for the canisters
// These would be auto-generated by dfx and stored in a declarations directory
// For now, we'll define basic interfaces that match our expected canister methods
interface LoanCanister {
  getLoanRequests: () => Promise<Array<Loan>>;
  getLenderStats: (lenderId: string) => Promise<LenderStats>;
  getBorrowerStats: (borrowerId: string) => Promise<BorrowerStats>;
  applyForLoan: (borrowerId: string, amount: number, duration: number, purpose: string) => Promise<{ success: boolean; loanId?: string; error?: string }>;
  fundLoan: (lenderId: string, loanId: string) => Promise<{ success: boolean; error?: string }>;
  makePayment: (borrowerId: string, loanId: string, amount: number) => Promise<{ success: boolean; error?: string }>;
}

// Canister IDs - these would come from environment variables in a real setup
const getCanisterIds = () => {
  if (import.meta.env.MODE === 'development') {
    return {
      LOAN_CANISTER_ID: import.meta.env.VITE_LOAN_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
      USER_CANISTER_ID: import.meta.env.VITE_USER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai'
    };
  }
  
  // Production canister IDs
  return {
    LOAN_CANISTER_ID: import.meta.env.VITE_LOAN_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    USER_CANISTER_ID: import.meta.env.VITE_USER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai'
  };
};

// Create HTTP agent for canister communication
const createAgent = async () => {
  const identity = await getIdentity();
  const host = getHost();
  
  const agent = new HttpAgent({
    identity,
    host
  });
  
  // When in development, need to fetch root key
  if (import.meta.env.MODE === 'development') {
    await agent.fetchRootKey().catch(err => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }
  
  return agent;
};

// Create actor for a specific canister
const createActor = async <T>(canisterId: string, idlFactory: any): Promise<T> => {
  const agent = await createAgent();
  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
};

// Mock IDL factory for loan canister - this would be replaced by the actual generated IDL
const mockLoanIdlFactory = () => ({ IDL: {} });

// Get loan actor - in production, this would use the actual IDL factory
const getLoanActor = async (): Promise<LoanCanister> => {
  const { LOAN_CANISTER_ID } = getCanisterIds();
  
  try {
    // In a real app, we would use the imported IDL factory from generated declarations
    return await createActor<LoanCanister>(LOAN_CANISTER_ID, mockLoanIdlFactory());
  } catch (error) {
    console.error("Error creating loan actor:", error);
    
    // Return a mock implementation for development
    return {
      getLoanRequests: mockGetLoanRequests,
      getLenderStats: mockGetLenderStats,
      getBorrowerStats: mockGetBorrowerStats,
      applyForLoan: mockApplyForLoan,
      fundLoan: mockFundLoan,
      makePayment: mockMakePayment
    };
  }
};

// Mock implementations for development and testing
// These would be replaced with actual canister calls in production

const mockGetLoanRequests = async (): Promise<Loan[]> => {
  // Mock implementation
  return [
    {
      id: "1",
      borrowerId: "user1",
      lenderId: null,
      amount: 2000,
      duration: 6,
      purpose: "Tuition Fees",
      roi: 12,
      creditScore: 760,
      risk: "low",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      borrowerId: "user2",
      lenderId: null,
      amount: 1500,
      duration: 3,
      purpose: "Textbooks",
      roi: 15,
      creditScore: 680,
      risk: "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      borrowerId: "user3",
      lenderId: null,
      amount: 3000,
      duration: 12,
      purpose: "Laptop Purchase",
      roi: 18,
      creditScore: 620,
      risk: "high",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      borrowerId: "user4",
      lenderId: null,
      amount: 800,
      duration: 2,
      purpose: "Course Materials",
      roi: 10,
      creditScore: 790,
      risk: "low",
      status: "pending",
      createdAt: new Date().toISOString(),
    }
  ];
};

const mockGetLenderStats = async (lenderId: string): Promise<LenderStats> => {
  // Mock implementation
  return {
    totalLent: 12500,
    interestEarned: 1875,
    activeLoans: 5,
    averageROI: 15
  };
};

const mockGetBorrowerStats = async (borrowerId: string): Promise<BorrowerStats> => {
  // Mock implementation
  return {
    creditScore: 780,
    totalBorrowed: 4500,
    activeLoans: [
      { 
        id: "1", 
        borrowerId: borrowerId,
        lenderId: "lender1",
        amount: 1500, 
        repaidAmount: 500, 
        dueDate: '2023-12-15', 
        status: "active",
        purpose: 'Textbooks',
        duration: 6,
        roi: 12,
        creditScore: 760,
        risk: "low",
        createdAt: new Date().toISOString(),
      },
      { 
        id: "2", 
        borrowerId: borrowerId,
        lenderId: "lender2",
        amount: 3000, 
        repaidAmount: 1000, 
        dueDate: '2024-02-20', 
        status: "active",
        purpose: 'Tuition',
        duration: 12,
        roi: 15,
        creditScore: 780,
        risk: "medium",
        createdAt: new Date().toISOString(),
      }
    ]
  };
};

const mockApplyForLoan = async (
  borrowerId: string, 
  amount: number, 
  duration: number, 
  purpose: string
): Promise<{ success: boolean; loanId?: string; error?: string }> => {
  // Mock implementation
  return { 
    success: true, 
    loanId: Math.random().toString(36).substring(2, 9)
  };
};

const mockFundLoan = async (
  lenderId: string, 
  loanId: string
): Promise<{ success: boolean; error?: string }> => {
  // Mock implementation
  return { success: true };
};

const mockMakePayment = async (
  borrowerId: string, 
  loanId: string, 
  amount: number
): Promise<{ success: boolean; error?: string }> => {
  // Mock implementation
  return { success: true };
};

// API wrapper functions - these provide a clean interface that can be easily swapped
// between mock and real implementations

export const getLoanRequests = async (): Promise<Loan[]> => {
  const actor = await getLoanActor();
  return actor.getLoanRequests();
};

export const getLenderStats = async (lenderId: string): Promise<LenderStats> => {
  const actor = await getLoanActor();
  return actor.getLenderStats(lenderId);
};

export const getBorrowerStats = async (borrowerId: string): Promise<BorrowerStats> => {
  const actor = await getLoanActor();
  return actor.getBorrowerStats(borrowerId);
};

export const applyForLoan = async (
  borrowerId: string, 
  amount: number, 
  duration: number, 
  purpose: string
): Promise<{ success: boolean; loanId?: string; error?: string }> => {
  const actor = await getLoanActor();
  return actor.applyForLoan(borrowerId, amount, duration, purpose);
};

export const fundLoan = async (
  lenderId: string, 
  loanId: string
): Promise<{ success: boolean; error?: string }> => {
  const actor = await getLoanActor();
  return actor.fundLoan(lenderId, loanId);
};

export const makePayment = async (
  borrowerId: string, 
  loanId: string, 
  amount: number
): Promise<{ success: boolean; error?: string }> => {
  const actor = await getLoanActor();
  return actor.makePayment(borrowerId, loanId, amount);
};
