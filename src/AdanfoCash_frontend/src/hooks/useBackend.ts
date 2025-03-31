import { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { backendService, User, Loan, Transaction, LoanStats } from "../services/backend";

export function useBackend() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                await backendService.init();
                setIsInitialized(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to initialize backend");
            }
        };
        init();
    }, []);

    const createUser = async (name: string, email: string, phone: string) => {
        try {
            setError(null);
            return await backendService.createUser(name, email, phone);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create user");
            throw err;
        }
    };

    const getUser = async (userId: Principal) => {
        try {
            setError(null);
            return await backendService.getUser(userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get user");
            throw err;
        }
    };

    const applyForLoan = async (amount: number, term: number) => {
        try {
            setError(null);
            return await backendService.applyForLoan(amount, term);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to apply for loan");
            throw err;
        }
    };

    const approveLoan = async (loanId: string) => {
        try {
            setError(null);
            return await backendService.approveLoan(loanId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to approve loan");
            throw err;
        }
    };

    const makePayment = async (loanId: string, amount: number) => {
        try {
            setError(null);
            return await backendService.makePayment(loanId, amount);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to make payment");
            throw err;
        }
    };

    const getLoansByUser = async (userId: Principal) => {
        try {
            setError(null);
            return await backendService.getLoansByUser(userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get user loans");
            throw err;
        }
    };

    const getTransactionsByLoan = async (loanId: string) => {
        try {
            setError(null);
            return await backendService.getTransactionsByLoan(loanId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get loan transactions");
            throw err;
        }
    };

    const getLoanStats = async () => {
        try {
            setError(null);
            return await backendService.getLoanStats();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get loan stats");
            throw err;
        }
    };

    return {
        isInitialized,
        error,
        createUser,
        getUser,
        applyForLoan,
        approveLoan,
        makePayment,
        getLoansByUser,
        getTransactionsByLoan,
        getLoanStats,
    };
} 