import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../../../declarations/AdanfoCash_backend";

export interface User {
    id: Principal;
    name: string;
    email: string;
    phone: string;
    createdAt: bigint;
    isActive: boolean;
    creditScore: number;
    totalLoans: number;
    totalBorrowed: number;
}

export interface Loan {
    id: string;
    userId: Principal;
    amount: number;
    interestRate: number;
    term: number;
    status: "Pending" | "Approved" | "Rejected" | "Active" | "Completed" | "Defaulted";
    createdAt: bigint;
    dueDate: bigint;
    monthlyPayment: number;
    remainingBalance: number;
    lastPaymentDate: [] | [bigint];
}

export interface Transaction {
    id: string;
    loanId: string;
    userId: Principal;
    amount: number;
    transactionType: "LoanDisbursement" | "Payment" | "InterestAccrual" | "LateFee";
    timestamp: bigint;
    status: "Pending" | "Completed" | "Failed";
}

export interface LoanStats {
    totalLoans: number;
    activeLoans: number;
    totalDisbursed: number;
    totalRepaid: number;
}

class BackendService {
    private actor: any;
    private agent: HttpAgent;

    constructor() {
        this.agent = new HttpAgent();
        // In development, we need to fetch the root key
        if (process.env.NODE_ENV === "development") {
            this.agent.fetchRootKey().catch(console.error);
        }
    }

    async init() {
        const canisterId = process.env.VITE_BACKEND_CANISTER_ID;
        if (!canisterId) {
            throw new Error("Backend canister ID not found in environment variables");
        }

        this.actor = Actor.createActor(idlFactory, {
            agent: this.agent,
            canisterId: canisterId,
        });
    }

    // User Management
    async createUser(name: string, email: string, phone: string): Promise<User> {
        const result = await this.actor.createUser(name, email, phone);
        if ("err" in result) {
            throw new Error(result.err);
        }
        return result.ok;
    }

    async getUser(userId: Principal): Promise<User | null> {
        return await this.actor.getUser(userId);
    }

    // Loan Management
    async applyForLoan(amount: number, term: number): Promise<Loan> {
        const result = await this.actor.applyForLoan(amount, term);
        if ("err" in result) {
            throw new Error(result.err);
        }
        return result.ok;
    }

    async approveLoan(loanId: string): Promise<Loan> {
        const result = await this.actor.approveLoan(loanId);
        if ("err" in result) {
            throw new Error(result.err);
        }
        return result.ok;
    }

    // Payment Processing
    async makePayment(loanId: string, amount: number): Promise<Transaction> {
        const result = await this.actor.makePayment(loanId, amount);
        if ("err" in result) {
            throw new Error(result.err);
        }
        return result.ok;
    }

    // Query Functions
    async getLoansByUser(userId: Principal): Promise<Loan[]> {
        return await this.actor.getLoansByUser(userId);
    }

    async getTransactionsByLoan(loanId: string): Promise<Transaction[]> {
        return await this.actor.getTransactionsByLoan(loanId);
    }

    async getLoanStats(): Promise<LoanStats> {
        return await this.actor.getLoanStats();
    }

    async verifyStudent(studentInfo: { name: string; studentId: string; university: string }): Promise<boolean> {
        try {
            const result = await this.actor.verifyStudent({
                name: studentInfo.name,
                studentId: studentInfo.studentId,
                university: studentInfo.university
            });
            return result;
        } catch (error) {
            console.error('Error verifying student:', error);
            return false;
        }
    }
}

export const backendService = new BackendService(); 