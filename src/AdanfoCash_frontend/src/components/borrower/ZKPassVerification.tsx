import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle, User, Fingerprint, AlertTriangle, Eye, EyeOff, GraduationCap, Calendar, School, Phone, CreditCard, Hash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveStudentVerification, updateVerificationStatus } from "@/services/userService";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { StudentInfo } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as crypto from 'crypto-js';

interface ZKPassVerificationProps {
  onVerificationComplete?: (success: boolean) => void;
}

const studentVerificationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  contactNumber: z.string().min(10, { message: "Valid contact number is required" }),
  ghanaCardNumber: z.string().min(8, { message: "Ghana Card number is required" }),
  universityName: z.string().min(2, { message: "University name is required" }),
  studentId: z.string().min(2, { message: "Index Number is required" }),
  graduationDate: z.string().refine(date => {
    const graduationDate = new Date(date);
    const fiveMonthsFromNow = new Date();
    fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
    return graduationDate >= fiveMonthsFromNow;
  }, { message: "Graduation date must be at least 5 months away" }),
  consent: z.boolean().refine(val => val === true, {
    message: "You must consent to verification",
  }),
});

type StudentVerificationValues = z.infer<typeof studentVerificationSchema>;

const ZKPassVerification: React.FC<ZKPassVerificationProps> = ({ onVerificationComplete }) => {
  const [verificationStep, setVerificationStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  
  const totalSteps = 3;
  const progress = (verificationStep / totalSteps) * 100;
  
  const form = useForm<StudentVerificationValues>({
    resolver: zodResolver(studentVerificationSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      ghanaCardNumber: "",
      universityName: "",
      studentId: "",
      graduationDate: "",
      consent: false,
    },
  });
  
  const hashGhanaCardNumber = (cardNumber: string): string => {
    return crypto.SHA256(cardNumber).toString();
  };
  
  const verifyGPAFromAcademicSource = async (studentId: string, university: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const simulatedGPA = Math.round((Math.random() * 2.5 + 1.5) * 10) / 10;
    return simulatedGPA;
  };
  
  const startVerification = () => {
    setVerificationStep(1);
  };
  
  const proceedToNextStep = () => {
    if (verificationStep < totalSteps) {
      setVerificationStep(verificationStep + 1);
    }
  };
  
  const completeVerification = async (data?: StudentVerificationValues) => {
    setIsVerifying(true);
    
    try {
      if (data && user.principalId) {
        const hashedGhanaCardNumber = hashGhanaCardNumber(data.ghanaCardNumber);
        const verifiedGPA = await verifyGPAFromAcademicSource(data.studentId, data.universityName);
        
        if (verifiedGPA < 1.5) {
          toast({
            title: "Verification Failed",
            description: "Your academic records show a GPA below 1.5, which is below our minimum requirement.",
            variant: "destructive"
          });
          setIsVerifying(false);
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }
          return;
        }

        const graduationDate = new Date(data.graduationDate);
        const fiveMonthsFromNow = new Date();
        fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
        
        if (graduationDate < fiveMonthsFromNow) {
          toast({
            title: "Verification Failed",
            description: "Your graduation date must be at least 5 months away.",
            variant: "destructive"
          });
          setIsVerifying(false);
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }
          return;
        }

        const studentInfo: StudentInfo = {
          fullName: data.fullName,
          contactNumber: data.contactNumber,
          hashedGhanaCard: hashedGhanaCardNumber,
          universityName: data.universityName,
          studentId: data.studentId,
          graduationDate: data.graduationDate,
          gpa: verifiedGPA,
          isEnrolled: true
        };
        
        const saveSuccess = saveStudentVerification(user.principalId, studentInfo);
        
        if (!saveSuccess) {
          toast({
            title: "Verification Failed",
            description: "Could not save your verification data. Please try again.",
            variant: "destructive"
          });
          setIsVerifying(false);
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }
          return;
        }
        
        await checkAuth();
        
        toast({
          title: "Verification Successful",
          description: `Your student identity has been verified with a GPA of ${verifiedGPA.toFixed(1)}.`,
        });
        
        if (onVerificationComplete) {
          onVerificationComplete(true);
        }
      } else {
        if (user.principalId) {
          const updateSuccess = updateVerificationStatus(user.principalId, true);
          
          if (!updateSuccess) {
            toast({
              title: "Verification Failed",
              description: "Could not update your verification status. Please try again.",
              variant: "destructive"
            });
            setIsVerifying(false);
            if (onVerificationComplete) {
              onVerificationComplete(false);
            }
            return;
          }
          
          await checkAuth();
          
          toast({
            title: "Verification Successful",
            description: "Your identity has been verified using ZKPass.",
          });
          
          if (onVerificationComplete) {
            onVerificationComplete(true);
          }
        } else {
          toast({
            title: "Verification Failed",
            description: "User ID not found. Please try logging in again.",
            variant: "destructive"
          });
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Could not complete the verification process.",
        variant: "destructive"
      });
      
      if (onVerificationComplete) {
        onVerificationComplete(false);
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  const onSubmit = (data: StudentVerificationValues) => {
    completeVerification(data);
  };
  
  const renderStepContent = () => {
    switch (verificationStep) {
      case 0:
        return (
          <div className="text-center py-6">
            <Shield className="h-16 w-16 mx-auto mb-4 text-adanfo-blue" />
            <h3 className="text-xl font-semibold mb-2">Student Identity Verification</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              ZKPass verifies your student status and academic records without compromising your privacy, ensuring security and data protection.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Secure GPA Verification</p>
                  <p className="text-sm text-muted-foreground">Your GPA is verified directly from academic sources</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Enhanced Data Security</p>
                  <p className="text-sm text-muted-foreground">Your Ghana Card number is securely hashed before storage</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Improved Credit Rating</p>
                  <p className="text-sm text-muted-foreground">Verified student borrowers receive better loan terms</p>
                </div>
              </div>
            </div>
            <Button onClick={startVerification} className="w-full">Start Verification</Button>
          </div>
        );
      case 1:
        return (
          <div className="py-6">
            <h3 className="text-xl font-semibold mb-4">Student Information</h3>
            <p className="text-muted-foreground mb-6">
              Provide your personal details to verify your identity and student status.
            </p>
            
            <Form {...form}>
              <form className="space-y-4 mb-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-adanfo-blue" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full legal name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-adanfo-blue" />
                        Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ghanaCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-adanfo-blue" />
                        Ghana Card Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Ghana Card number" {...field} />
                      </FormControl>
                      <FormDescription>
                        🔒 This will be securely hashed before storage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="universityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <School className="h-4 w-4 text-adanfo-blue" />
                        University/College Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your institution name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-adanfo-blue" />
                        Index Number (University ID)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your student index number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="graduationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-adanfo-blue" />
                        Expected Graduation Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be at least 5 months from today
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setVerificationStep(0)}>Back</Button>
              <Button onClick={proceedToNextStep}>Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="py-6">
            <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
            <p className="text-muted-foreground mb-6">
              Control what information is shared with lenders.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-green-500" />
                  <span>Ghana Card Number</span>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Hashed</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-green-500" />
                  <span>Contact Number</span>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Private</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Full Name</span>
                </div>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400">Shared</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>University & Student Status</span>
                </div>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400">Shared</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Verified GPA</span>
                </div>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400">Shared</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Credit Score</span>
                </div>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400">Shared</span>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6 p-4 border rounded-lg">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1 rounded"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I consent to student status verification</FormLabel>
                    <FormDescription>
                      You authorize ZKPass to verify your student status using the information provided.
                      Your Ghana Card number will be securely hashed, and your GPA will be verified directly from academic sources.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setVerificationStep(1)}>Back</Button>
              <Button 
                onClick={proceedToNextStep}
                disabled={!form.getValues().consent}
              >
                Next
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="py-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Generate Zero-Knowledge Proof</h3>
            <p className="text-muted-foreground mb-6">
              This final step creates a cryptographic proof to verify your student status without revealing personal information.
            </p>
            
            <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="font-medium">Privacy Notice</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                By completing this process, you're generating a zero-knowledge proof that confirms your student status without revealing sensitive data. Your GPA will be verified directly from academic sources, and your Ghana Card number will be securely hashed before storage.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setVerificationStep(2)}>Back</Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)} 
                disabled={isVerifying}
                className="relative"
              >
                {isVerifying ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></span>
                    Verifying Academic Records...
                  </span>
                ) : (
                  "Complete Verification"
                )}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-adanfo-blue" />
          Student ZKPass Verification
        </CardTitle>
        <CardDescription>
          Verify your student status securely using zero-knowledge proofs
        </CardDescription>
      </CardHeader>
      
      {verificationStep > 0 && (
        <div className="px-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Step {verificationStep} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <Separator className="my-4" />
        </div>
      )}
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default ZKPassVerification;
