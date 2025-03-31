
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { 
  Coins,
  TrendingUp,
  Wallet,
  PiggyBank,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import ParticleBackground from '../components/shared/ParticleBackground';
import { useAuth } from '../hooks/useAuthContext';
import WalletDisplay from '../components/shared/WalletDisplay';
import LoanPool from '../components/lender/LoanPool';

const LenderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [fundedLoans, setFundedLoans] = useState<any[]>([]);
  
  // Mock wallet data - would come from Internet Identity integration
  const walletData = {
    isConnected: true,
    walletAddress: user.principalId?.substring(0, 10) + "..." + user.principalId?.substring(user.principalId.length - 5) || "", 
    balance: 156.78
  };
  
  // Get funded loans from local storage
  useEffect(() => {
    const loadFundedLoans = () => {
      try {
        const storedLoans = localStorage.getItem('loanRequests');
        if (storedLoans) {
          const loans = JSON.parse(storedLoans);
          const funded = loans.filter((loan: any) => 
            loan.status === 'funded' && loan.fundedBy === user.principalId
          );
          setFundedLoans(funded);
        }
      } catch (error) {
        console.error('Error loading funded loans:', error);
      }
    };
    
    loadFundedLoans();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(loadFundedLoans, 30000);
    
    return () => clearInterval(intervalId);
  }, [user.principalId]);
  
  // Calculate portfolio statistics
  const portfolioStats = {
    totalInvested: fundedLoans.reduce((sum, loan) => sum + (loan.fundedAmount || loan.amount), 0),
    activeLoans: fundedLoans.length,
    avgInterestRate: fundedLoans.length > 0 
      ? fundedLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / fundedLoans.length 
      : 0,
    expectedReturn: fundedLoans.reduce((sum, loan) => sum + (loan.totalRepayment || 0), 0)
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
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Lender Dashboard</h1>
                <p className="text-foreground/70">Monitor your investments and fund new loan requests</p>
              </motion.div>
              
              {/* Wallet Display */}
              <motion.div variants={itemVariants} className="mb-6">
                <WalletDisplay 
                  isConnected={walletData.isConnected}
                  walletAddress={walletData.walletAddress}
                  balance={walletData.balance}
                />
              </motion.div>
              
              {/* Lender Portfolio Stats */}
              <motion.div variants={itemVariants} className="mb-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Portfolio Overview</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        title: 'Total Invested', 
                        value: portfolioStats.totalInvested, 
                        icon: <Wallet size={20} className="text-adanfo-blue" />,
                        change: portfolioStats.totalInvested > 0 ? '+New investment' : 'No investments yet',
                        isAmount: true
                      },
                      { 
                        title: 'Active Loans', 
                        value: portfolioStats.activeLoans, 
                        icon: <Coins size={20} className="text-adanfo-purple" />,
                        change: `${portfolioStats.activeLoans} active investments`
                      },
                      { 
                        title: 'Avg. Interest Rate', 
                        value: portfolioStats.avgInterestRate, 
                        icon: <TrendingUp size={20} className="text-adanfo-green" />,
                        change: 'Based on your portfolio',
                        isPercentage: true
                      },
                      { 
                        title: 'Expected Return', 
                        value: portfolioStats.expectedReturn, 
                        icon: <PiggyBank size={20} className="text-adanfo-orange" />,
                        change: 'Total expected repayment',
                        isAmount: true
                      }
                    ].map((stat, index) => (
                      <div 
                        key={index} 
                        className="bg-secondary/40 dark:bg-secondary/30 rounded-xl p-4 backdrop-blur-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-foreground/70">{stat.title}</p>
                          <div className="p-2 rounded-full bg-background/60">
                            {stat.icon}
                          </div>
                        </div>
                        <p className="text-2xl font-semibold mb-1">
                          {stat.isAmount ? `$${stat.value.toLocaleString(undefined, {maximumFractionDigits: 2})}` : 
                           stat.isPercentage ? `${stat.value.toFixed(1)}%` : 
                           stat.value}
                        </p>
                        <p className="text-xs text-foreground/60">{stat.change}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
              
              {/* Educational Resources Card */}
              {fundedLoans.length === 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="bg-adanfo-blue/10 rounded-full p-4">
                        <BookOpen size={40} className="text-adanfo-blue" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">New to Lending?</h3>
                        <p className="text-muted-foreground mb-4">
                          Lending on AdanfoCash allows you to earn returns while supporting verified borrowers. All loans are secured through our smart contract system.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <ArrowUpRight className="h-5 w-5 text-adanfo-blue mt-0.5" />
                            <p className="text-sm">Browse the loan pool to find matching loan requests</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowUpRight className="h-5 w-5 text-adanfo-blue mt-0.5" />
                            <p className="text-sm">Review borrower credit scores and loan details</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowUpRight className="h-5 w-5 text-adanfo-blue mt-0.5" />
                            <p className="text-sm">Fund loans that match your risk tolerance and preferences</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
              
              {/* Loan Pool */}
              <motion.div variants={itemVariants}>
                <LoanPool lenderId={user.principalId} />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LenderDashboard;
