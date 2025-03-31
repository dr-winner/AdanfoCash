
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuthContext';
import { User, DollarSign, Landmark, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/shared/ParticleBackground';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  lenderType: z.string().min(1, {
    message: 'Please select a lender type.',
  }),
});

const LenderRegistration: React.FC = () => {
  const { user, registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // If user is already registered as a lender, redirect to dashboard
    if (user.isAuthenticated && user.role === 'lender') {
      navigate('/lender-dashboard');
    }
    
    // If user is registered as a borrower, redirect to borrower dashboard
    if (user.isAuthenticated && user.role === 'borrower') {
      navigate('/borrower-dashboard');
    }
    
    // If user is not authenticated, redirect to wallet connection
    if (!user.isAuthenticated) {
      navigate('/wallet-connection');
    }
  }, [user, navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.id || '',
      lenderType: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const success = await registerUser('lender', values.name);
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "You're now registered as a lender.",
        });
        navigate('/lender-dashboard');
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
  
  if (!user.isAuthenticated) {
    return null; // This will redirect in the useEffect
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
                  Lender Registration
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Register as a lender to fund loans and earn yield from interest payments.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="md:col-span-1 space-y-6">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-adanfo-blue" />
                        Lender Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Automated loan matching based on your risk preference</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">View borrower credit scores without personal identifiers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Secure smart contract manages repayments automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Earn competitive yields on provided capital</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Create Your Lender Profile</CardTitle>
                      <CardDescription>
                        Fill in your details to start your lending journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Full Name
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Your name will not be shared with borrowers.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lenderType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Landmark className="h-4 w-4" />
                                  Lender Type
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your lender type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="institutional">Institutional</SelectItem>
                                    <SelectItem value="business">Small Business</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  This helps us customize your lending dashboard.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Separator className="my-4" />
                          
                          <div className="bg-secondary/30 p-4 rounded-lg">
                            <p className="text-sm mb-2 font-medium">Lender Agreement</p>
                            <p className="text-xs text-muted-foreground mb-3">
                              By registering as a lender, you agree to:
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                              <li>Comply with relevant financial regulations</li>
                              <li>Accept that all loan transactions will be recorded on the blockchain</li>
                              <li>Understand that you're funding loans at your own risk</li>
                              <li>Acknowledge that past performance is not indicative of future results</li>
                            </ul>
                          </div>
                          
                          <Button type="submit" className="w-full">Register as Lender</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LenderRegistration;
