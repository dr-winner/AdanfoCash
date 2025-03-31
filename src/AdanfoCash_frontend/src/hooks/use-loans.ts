
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLoanRequests,
  getLenderStats,
  getBorrowerStats,
  applyForLoan,
  fundLoan,
  makePayment
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useLoanRequests = (riskFilter?: 'all' | 'low' | 'medium' | 'high') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['loanRequests', riskFilter],
    queryFn: async () => {
      const loans = await getLoanRequests();
      
      if (riskFilter && riskFilter !== 'all') {
        return loans.filter(loan => loan.risk === riskFilter);
      }
      
      return loans;
    },
    enabled: user.isAuthenticated,
  });
};

export const useLenderStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['lenderStats', user.id],
    queryFn: () => getLenderStats(user.id),
    enabled: user.isAuthenticated && user.role === 'lender',
  });
};

export const useBorrowerStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['borrowerStats', user.id],
    queryFn: () => getBorrowerStats(user.id),
    enabled: user.isAuthenticated && user.role === 'borrower',
  });
};

export const useApplyForLoan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ amount, duration, purpose }: { amount: number; duration: number; purpose: string }) => 
      applyForLoan(user.id, amount, duration, purpose),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowerStats'] });
    },
  });
};

export const useFundLoan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ loanId }: { loanId: string }) => 
      fundLoan(user.id, loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lenderStats'] });
      queryClient.invalidateQueries({ queryKey: ['loanRequests'] });
    },
  });
};

export const useMakePayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ loanId, amount }: { loanId: string; amount: number }) => 
      makePayment(user.id, loanId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowerStats'] });
    },
  });
};
