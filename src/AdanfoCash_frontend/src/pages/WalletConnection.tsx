
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/shared/ParticleBackground';

const WalletConnection: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (user.isAuthenticated) {
      if (user.role === 'unregistered') {
        navigate('/borrower-registration');
      } else if (user.role === 'borrower') {
        navigate('/borrower-dashboard');
      } else if (user.role === 'lender') {
        navigate('/lender-dashboard');
      }
    }
  }, [user, navigate]);
  
  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    
    try {
      const success = await login();
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "Your Internet Identity wallet is now connected.",
        });
      } else {
        setError('Failed to connect Internet Identity. Please try again.');
        toast({
          title: "Connection Failed",
          description: "There was a problem connecting to Internet Identity.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError('An unexpected error occurred. Please try again later.');
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred while connecting to Internet Identity.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen relative overflow-hidden">
        <ParticleBackground />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container max-w-6xl mx-auto px-4 pt-20 pb-20"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect Your Internet Identity</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Securely connect your wallet to access lending and borrowing features
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg overflow-hidden border-2 border-adanfo-blue/20">
                <CardHeader className="bg-gradient-to-r from-adanfo-blue/10 to-adanfo-purple/10">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-adanfo-blue" />
                    Internet Identity Connection
                  </CardTitle>
                  <CardDescription>
                    Connect your Internet Identity to use AdanfoCash
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Secure Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Your Internet Identity provides a secure way to authenticate without sharing personal information.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Ownership & Control</h3>
                        <p className="text-sm text-muted-foreground">
                          You maintain full control of your identity and data with no third-party access.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Smart Contract Integration</h3>
                        <p className="text-sm text-muted-foreground">
                          Your identity is linked to smart contracts, ensuring transparent and secure transactions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-400">Connection Error</p>
                        <p className="text-sm text-red-700 dark:text-red-500 mt-1">{error}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleConnect}
                    disabled={connecting || isLoading}
                  >
                    {connecting || isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Connect Internet Identity
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By connecting, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="borrower" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="borrower">For Borrowers</TabsTrigger>
                  <TabsTrigger value="lender">For Lenders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="borrower" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Access Capital for Your Needs</CardTitle>
                      <CardDescription>
                        Get loans directly from lenders with fair rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-blue/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Fast Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Complete ZKPass verification to access loans quickly
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-blue/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Collateral-Free Options</h3>
                          <p className="text-sm text-muted-foreground">
                            Build your credit score to access larger loans
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-blue/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Smart Contract Protection</h3>
                          <p className="text-sm text-muted-foreground">
                            Secure loans with clear terms and automatic processing
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="lender" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Earn Returns on Your Capital</CardTitle>
                      <CardDescription>
                        Fund loans and earn competitive interest rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-purple/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Diversified Portfolio</h3>
                          <p className="text-sm text-muted-foreground">
                            Fund multiple borrowers based on risk tolerance
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-purple/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Transparent Scoring</h3>
                          <p className="text-sm text-muted-foreground">
                            Make informed decisions with our auto credit scoring
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-adanfo-purple/10 rounded-full p-2">
                          <ShieldCheck className="h-4 w-4 text-adanfo-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Automated Returns</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive repayments automatically through smart contracts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-950">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-400">Important Notice</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                      After connecting your Internet Identity, you'll need to register as either a 
                      borrower or lender to use the platform. This registration will be permanently 
                      linked to your Internet Identity.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
};

export default WalletConnection;
