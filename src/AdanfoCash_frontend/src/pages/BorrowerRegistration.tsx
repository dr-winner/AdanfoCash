import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EnhancedButton from '@/components/ui/enhanced-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import { AlertCircle, User, CreditCard, GraduationCap, School } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import ZKPassVerification from '@/components/borrower/ZKPassVerification';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/shared/ParticleBackground';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

const BorrowerRegistration: React.FC = () => {
  const { user, registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  
  useEffect(() => {
    if (user.isAuthenticated && user.role === 'borrower') {
      navigate('/borrower-dashboard');
    }
    
    if (user.isAuthenticated && user.role === 'lender') {
      navigate('/lender-dashboard');
    }
    
    if (!user.isAuthenticated) {
      navigate('/wallet-connection');
    }
  }, [user, navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.id || '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const success = await registerUser('borrower', values.name);
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "You're now registered as a student borrower.",
        });
        navigate('/borrower-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error during registration.",
        variant: "destructive"
      });
    }
  };
  
  const handleVerificationComplete = (success: boolean) => {
    setIsVerifying(false);
    if (success) {
      toast({
        title: "Verification Successful",
        description: "Your student status has been verified using ZKPass.",
      });
    }
  };
  
  if (!user.isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative">
        <ParticleBackground />
        
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Student Borrower Registration
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Register as a student borrower to access loans with competitive rates backed by the security of blockchain technology.
                </p>
              </div>
              
              {isVerifying ? (
                <ZKPassVerification onVerificationComplete={handleVerificationComplete} />
              ) : (
                <Card className="max-w-md mx-auto shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-adanfo-blue" /> 
                      Create Your Student Profile
                    </CardTitle>
                    <CardDescription>
                      Fill in your details to start your student borrowing journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        All student borrowers must complete ZKPass verification before applying for loans. This process verifies your student status without revealing personal information.
                      </AlertDescription>
                    </Alert>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Crypto Learner" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Initial Credit Score: <span className="font-medium">650</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            All new student borrowers start with a base credit score of 650. Your score will improve as you successfully repay loans.
                          </p>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Alert variant="destructive" className="bg-adanfo-blue/5 mb-2">
                      <School className="h-4 w-4 text-adanfo-blue" />
                      <AlertTitle>Student Verification Required</AlertTitle>
                      <AlertDescription className="text-sm">
                        Verification will check:
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Current enrollment at a recognized university</li>
                          <li>Minimum GPA of 1.5/4.0</li>
                          <li>Graduation date at least 5 months away</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                    
                    <EnhancedButton 
                      onClick={() => setIsVerifying(true)}
                      variant="default"
                      className="w-full"
                    >
                      Verify Your Student Status with ZKPass
                    </EnhancedButton>
                    
                    <Button 
                      onClick={form.handleSubmit(onSubmit)} 
                      className="w-full"
                      disabled={!user.isVerified}
                    >
                      Register as Student Borrower
                    </Button>
                    
                    {!user.isVerified && (
                      <p className="text-xs text-amber-500 text-center">
                        You must complete student verification before registration
                      </p>
                    )}
                  </CardFooter>
                </Card>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BorrowerRegistration;
