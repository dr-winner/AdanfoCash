import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import EnhancedButton from '../ui/enhanced-button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CallToAction: React.FC = () => {
  const { login, user, isRegistered } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleButtonClick = async (userType: 'borrower' | 'lender') => {
    const currentPath = location.pathname;
    
    // If not authenticated, trigger login first
    if (!user.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in with Internet Identity to continue.",
      });
      
      const loginSuccess = await login(currentPath);
      if (!loginSuccess) {
        toast({
          title: "Authentication Failed",
          description: "Please try again or contact support if the issue persists.",
          variant: "destructive"
        });
        return; // Stop if login failed
      }
      
      toast({
        title: "Authentication Successful",
        description: "You're now signed in with Internet Identity.",
      });
    }
    
    // Now user is authenticated, check if registered
    if (isRegistered) {
      // If registered, go to dashboard
      if (userType === 'borrower') {
        navigate('/borrower-dashboard');
      } else {
        navigate('/lender-dashboard');
      }
    } else {
      // Not registered, redirect to registration form
      toast({
        title: "Registration Required",
        description: `Please complete your ${userType} registration to continue.`,
      });
      
      if (userType === 'borrower') {
        navigate('/borrower-registration');
      } else {
        navigate('/lender-registration');
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-adanfo-blue/10 via-transparent to-adanfo-purple/10 -z-10" />
      
      {/* Radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-adanfo-blue/5 via-transparent to-transparent -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="p-10 rounded-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-adanfo-blue/20 to-adanfo-purple/20 rounded-2xl blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-adanfo-blue/20 via-transparent to-adanfo-purple/20 rounded-2xl" />
            </div>
            
            <div className="glass-card p-8 text-center md:p-12">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Ready to Transform Your Financial Future?
              </motion.h2>
              
              <motion.p
                className="text-lg mb-8 text-foreground/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Whether you're looking for a loan or wanting to invest, AdanfoCash provides a secure, transparent platform to help you achieve your goals.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EnhancedButton
                  variant="gradient"
                  size="lg"
                  onClick={() => handleButtonClick('borrower')}
                  className="group min-w-[200px]"
                >
                  <span className="mr-2">Apply for a Loan</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
                
                <EnhancedButton
                  variant="glass"
                  size="lg"
                  onClick={() => handleButtonClick('lender')}
                  className="group min-w-[200px]"
                >
                  <span className="mr-2">Start Lending</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
