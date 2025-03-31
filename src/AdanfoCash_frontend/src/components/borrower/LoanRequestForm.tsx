import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Coins, Calendar, Calculator, DollarSign, BadgePercent, HelpCircle, AlertTriangle, GraduationCap, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateStudentEligibility } from "@/services/userService";

// Loan request form schema
const loanRequestSchema = z.object({
  amount: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0 && num <= 10000; // Reduced max loan amount for students
  }, { message: "Amount must be between 1 and 10,000" }),
  purpose: z.string().min(3, { message: "Purpose must be at least 3 characters" }),
  duration: z.string().min(1, { message: "Please select a loan duration" }),
  description: z.string().optional(),
});

type LoanRequestFormValues = z.infer<typeof loanRequestSchema>;

interface LoanRequestFormProps {
  onSubmitSuccess?: () => void;
  onCancel: () => void;
  onRequestSubmitted?: () => void;
  studentInfo?: any;
  borrowerId?: string;
  borrowerName?: string;
  creditScore?: number;
}

const LoanRequestForm: React.FC<LoanRequestFormProps> = ({ 
  onSubmitSuccess,
  onCancel,
  onRequestSubmitted,
  studentInfo,
  borrowerId,
  borrowerName,
  creditScore
}) => {
  const [interestRate, setInterestRate] = useState(12);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<LoanRequestFormValues>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: {
      amount: "2000", // Default lower amount for students
      purpose: "",
      duration: "6", // Default shorter duration for students
      description: "",
    },
  });
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (user.studentInfo && value.duration) {
        const duration = parseInt(value.duration);
        const eligibility = validateStudentEligibility(user.studentInfo, duration);
        
        if (!eligibility.isEligible && eligibility.reason) {
          setEligibilityError(eligibility.reason);
        } else {
          setEligibilityError(null);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, user.studentInfo]);
  
  const calculateLoanDetails = (amount: number, duration: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const n = duration;
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalRepayment = monthlyPayment * n;
    
    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalRepayment: isNaN(totalRepayment) ? 0 : totalRepayment,
    };
  };
  
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "amount" || name === "duration" || name === undefined) {
        const amount = parseFloat(value.amount || "0");
        const duration = parseInt(value.duration || "0");
        
        if (!isNaN(amount) && !isNaN(duration) && duration > 0) {
          let rate = interestRate;
          if (user.creditScore) {
            if (user.creditScore >= 750) {
              rate = 8;
            } else if (user.creditScore >= 650) {
              rate = 10;
            } else {
              rate = 12;
            }
            
            if (duration > 24) {
              rate += 1;
            }
          }
          
          setInterestRate(rate);
          
          const { monthlyPayment, totalRepayment } = calculateLoanDetails(amount, duration, rate);
          setMonthlyPayment(monthlyPayment);
          setTotalRepayment(totalRepayment);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, user.creditScore]);
  
  const onSubmit = async (data: LoanRequestFormValues) => {
    if (user.studentInfo) {
      const duration = parseInt(data.duration);
      const eligibility = validateStudentEligibility(user.studentInfo, duration);
      
      if (!eligibility.isEligible) {
        toast({
          title: "Eligibility Check Failed",
          description: eligibility.reason || "You are not eligible for this loan duration.",
          variant: "destructive"
        });
        return;
      }
    } else if (user.role === "borrower") {
      toast({
        title: "Verification Required",
        description: "You must complete student verification before requesting a loan.",
        variant: "destructive"
      });
      return;
    }
    
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
      duration: parseInt(data.duration),
      interestRate,
      monthlyPayment,
      totalRepayment,
      borrowerId: user.principalId,
      borrowerName: user.id,
      creditScore: user.creditScore || 650,
      status: "pending",
      createdAt: new Date().toISOString(),
      isStudentLoan: true,
      expectedGraduation: user.studentInfo?.graduationDate
    };
    
    try {
      const loanRequests = JSON.parse(localStorage.getItem("loanRequests") || "[]");
      loanRequests.push({
        id: Date.now().toString(),
        ...formattedData
      });
      localStorage.setItem("loanRequests", JSON.stringify(loanRequests));
      
      toast({
        title: "Loan Request Submitted",
        description: "Your student loan request has been added to the pool for lenders to review.",
      });
      
      form.reset();
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your loan request. Please try again.",
        variant: "destructive"
      });
    }
    
    if (onRequestSubmitted) {
      onRequestSubmitted();
    }
  };
  
  const graduationInfo = user.studentInfo?.graduationDate ? 
    new Date(user.studentInfo.graduationDate).toLocaleDateString() : 
    "Not verified";
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-adanfo-blue" />
          Student Loan Request
        </CardTitle>
        <CardDescription>
          Fill out the form below to request a student loan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user.studentInfo && (
          <div className="mb-6 bg-secondary/30 p-4 rounded-lg">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-adanfo-blue" />
              Verified Student Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">University:</p>
                <p className="font-medium">{user.studentInfo.universityName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expected Graduation:</p>
                <p className="font-medium">{graduationInfo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">GPA:</p>
                <p className="font-medium">{user.studentInfo.gpa.toFixed(1)}/4.0</p>
              </div>
            </div>
          </div>
        )}
        
        {eligibilityError && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Eligibility Warning</AlertTitle>
            <AlertDescription>{eligibilityError}</AlertDescription>
          </Alert>
        )}
        
        {!user.studentInfo && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              You must complete student verification before you can request a loan.
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Loan Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="2000" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>Enter an amount between $1 and $10,000</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Loan Duration
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Loan duration must not exceed your graduation date
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="What will you use the loan for?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fees</SelectItem>
                      <SelectItem value="books">Books & Supplies</SelectItem>
                      <SelectItem value="housing">Student Housing</SelectItem>
                      <SelectItem value="technology">Technology & Equipment</SelectItem>
                      <SelectItem value="living">Living Expenses</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="other">Other Educational Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide more details about your student loan request..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This information helps lenders understand your request better
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-secondary/30 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-adanfo-blue" />
                  <span className="font-medium">Interest Rate</span>
                </div>
                <span className="font-medium">{interestRate}%</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your personalized rate based on credit score: {user.creditScore || "N/A"}</p>
                <div className="flex items-center text-sm gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Improve your credit score to receive better rates</span>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Calculator className="h-5 w-5 text-adanfo-blue" />
                Loan Calculator
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-lg font-medium">${monthlyPayment.toFixed(2)}</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Total Repayment</p>
                  <p className="text-lg font-medium">${totalRepayment.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!user.studentInfo || !!eligibilityError}
            >
              Submit Student Loan Request
            </Button>
            
            {!user.studentInfo && (
              <p className="text-center text-sm text-amber-500">
                You must complete student verification before submitting a loan request
              </p>
            )}
            
            {eligibilityError && (
              <p className="text-center text-sm text-red-500">
                {eligibilityError}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoanRequestForm;
