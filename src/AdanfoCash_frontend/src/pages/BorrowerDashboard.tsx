
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Coins,
  TrendingUp,
  Wallet,
  HandCoins,
  Plus,
  Shield
} from 'lucide-react';
import ParticleBackground from '../components/shared/ParticleBackground';
import { useAuth } from '../hooks/useAuthContext';
import WalletDisplay from '../components/shared/WalletDisplay';
import ZKPassVerification from '../components/borrower/ZKPassVerification';
import LoanRequestForm from '../components/borrower/LoanRequestForm';
import LoanHistory from '../components/borrower/LoanHistory';

const BorrowerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isRequestingLoan, setIsRequestingLoan] = useState(false);
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  
  // Mock wallet data - would come from Internet Identity integration
  const walletData = {
    isConnected: true,
    walletAddress: user.principalId?.substring(0, 10) + "..." + user.principalId?.substring(user.principalId.length - 5) || "", 
    balance: 42.89
  };
  
  // Load loan history
  useEffect(() => {
    const loadLoanHistory = () => {
      try {
        const storedLoans = localStorage.getItem('loanRequests');
        if (storedLoans) {
          const allLoans = JSON.parse(storedLoans);
          const userLoans = allLoans.filter((loan: any) => 
            loan.borrowerId === user.principalId
          );
          setLoans(userLoans);
        }
      } catch (error) {
        console.error('Error loading loan history:', error);
      }
    };
    
    loadLoanHistory();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(loadLoanHistory, 30000);
    
    return () => clearInterval(intervalId);
  }, [user.principalId]);
  
  // Handle loan request submission
  const handleLoanRequested = () => {
    setIsRequestingLoan(false);
  };
  
  // Handle verification completion
  const handleVerificationComplete = (success: boolean) => {
    setIsVerifyingStudent(false);
  };
  
  // Calculate total repayment
  const calculateTotalRepayment = (amount: number, interestRate: number, durationMonths: number): number => {
    const monthlyInterest = interestRate / 100 / 12;
    const totalAmount = amount * (1 + (monthlyInterest * durationMonths));
    return parseFloat(totalAmount.toFixed(2));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Student Borrower Dashboard</h1>
                <p className="text-foreground/70">Apply for loans and manage your borrowing</p>
              </motion.div>
              
              {/* Wallet Display */}
              <motion.div variants={itemVariants} className="mb-6">
                <WalletDisplay 
                  isConnected={walletData.isConnected}
                  walletAddress={walletData.walletAddress}
                  balance={walletData.balance}
                />
              </motion.div>
              
              {/* Loan History */}
              <motion.div variants={itemVariants} className="mb-6">
                <LoanHistory 
                  loans={loans} 
                  creditScore={user.creditScore || 0} 
                />
              </motion.div>
              
              {/* Verification Status Card */}
              {!user.isVerified && (
                <motion.div variants={itemVariants} className="mb-6">
                  <Card className="p-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-4">
                        <Shield size={40} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Student Verification Required</h3>
                        <p className="text-muted-foreground mb-4">
                          You need to verify your student status with ZKPass before you can request loans.
                        </p>
                        <Button 
                          onClick={() => setIsVerifyingStudent(true)} 
                          className="w-full md:w-auto"
                        >
                          Verify Student Status
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
              
              {isVerifyingStudent ? (
                <motion.div variants={itemVariants}>
                  <ZKPassVerification onVerificationComplete={handleVerificationComplete} />
                </motion.div>
              ) : (
                <motion.div variants={itemVariants}>
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Request a Loan</h2>
                      
                      {user.isVerified && (
                        <Button 
                          onClick={() => setIsRequestingLoan(true)}
                          className="flex items-center gap-2"
                        >
                          <Plus size={16} />
                          New Loan Request
                        </Button>
                      )}
                    </div>
                    
                    {isRequestingLoan ? (
                      <LoanRequestForm 
                        onCancel={() => setIsRequestingLoan(false)}
                        onRequestSubmitted={handleLoanRequested}
                        studentInfo={user.studentInfo}
                        borrowerId={user.principalId}
                        borrowerName={user.id}
                        creditScore={user.creditScore || 0}
                      />
                    ) : (
                      loans.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                          <HandCoins className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">No Loan Requests Yet</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Start by submitting your first loan request. Once verified, you can request loans for your educational needs.
                          </p>
                          {user.isVerified && (
                            <Button 
                              onClick={() => setIsRequestingLoan(true)}
                              className="flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Create Loan Request
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {loans.map((loan, index) => (
                            <Card key={index} className="p-4 hover:bg-secondary/40 transition-colors">
                              <div className="flex flex-col sm:flex-row justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={
                                      loan.status === 'repaid' ? "success" : 
                                      loan.status === 'funded' ? "default" : 
                                      loan.status === 'pending' ? "outline" : "destructive"
                                    }>
                                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      Requested on {new Date(loan.requestDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="font-medium">${loan.amount} for {loan.purpose}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {loan.durationMonths} months @ {loan.interestRate}% interest
                                  </p>
                                </div>
                                <div className="mt-2 sm:mt-0 text-right">
                                  <p className="text-sm font-medium">
                                    {loan.status === 'funded' ? (
                                      <>Funded by: {loan.fundedBy ? loan.fundedBy.substring(0, 8) + "..." : "Anonymous"}</>
                                    ) : loan.status === 'repaid' ? (
                                      <>Total Repaid: ${loan.totalRepayment}</>
                                    ) : (
                                      <>Expected Repayment: ${calculateTotalRepayment(loan.amount, loan.interestRate, loan.durationMonths)}</>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )
                    )}
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper function to calculate total repayment
const calculateTotalRepayment = (amount: number, interestRate: number, durationMonths: number): number => {
  const monthlyInterest = interestRate / 100 / 12;
  const totalAmount = amount * (1 + (monthlyInterest * durationMonths));
  return parseFloat(totalAmount.toFixed(2));
};

export default BorrowerDashboard;
