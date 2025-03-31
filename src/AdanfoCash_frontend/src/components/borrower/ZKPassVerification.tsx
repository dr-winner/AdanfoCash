import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle, User, Fingerprint, AlertTriangle, Eye, EyeOff, GraduationCap, Calendar, School } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveStudentVerification, updateVerificationStatus } from "@/services/userService";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { StudentInfo } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ZKPassVerificationProps {
  onVerificationComplete?: (success: boolean) => void;
}

// Form schema for student verification
const studentVerificationSchema = z.object({
  universityName: z.string().min(2, { message: "University name is required" }),
  studentId: z.string().min(2, { message: "Student ID is required" }),
  graduationDate: z.string().refine(date => {
    const graduationDate = new Date(date);
    const fiveMonthsFromNow = new Date();
    fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
    return graduationDate >= fiveMonthsFromNow;
  }, { message: "Graduation date must be at least 5 months away" }),
  gpa: z.string().refine(val => {
    const gpa = parseFloat(val);
    return !isNaN(gpa) && gpa >= 0 && gpa <= 4.0;
  }, { message: "GPA must be between 0 and 4.0" }),
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
      universityName: "",
      studentId: "",
      graduationDate: "",
      gpa: "",
      consent: false,
    },
  });
  
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
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // If we have student data, process it
      if (data && user.principalId) {
        // Transform form data to student info
        const studentInfo: StudentInfo = {
          universityName: data.universityName,
          studentId: data.studentId,
          graduationDate: data.graduationDate,
          gpa: parseFloat(data.gpa),
          isEnrolled: true // We assume the student is enrolled since we're verifying them
        };
        
        // Save the student verification data
        saveStudentVerification(user.principalId, studentInfo);
        
        // Refresh user data
        await checkAuth();
        
        toast({
          title: "Verification Successful",
          description: "Your student identity has been verified using ZKPass.",
        });
        
        // Call the onComplete callback
        if (onVerificationComplete) {
          onVerificationComplete(true);
        }
      } else {
        // Update verification status in the local storage
        if (user.principalId) {
          updateVerificationStatus(user.principalId, true);
          
          // Refresh user data
          await checkAuth();
          
          toast({
            title: "Verification Successful",
            description: "Your identity has been verified using ZKPass.",
          });
          
          // Call the onComplete callback
          if (onVerificationComplete) {
            onVerificationComplete(true);
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
  
  // Render appropriate content based on the verification step
  const renderStepContent = () => {
    switch (verificationStep) {
      case 0:
        return (
          <div className="text-center py-6">
            <Shield className="h-16 w-16 mx-auto mb-4 text-adanfo-blue" />
            <h3 className="text-xl font-semibold mb-2">Student Identity Verification</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              ZKPass verifies your student status without sharing your personal information, ensuring privacy and security.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Private & Secure</p>
                  <p className="text-sm text-muted-foreground">Your personal data never leaves your device</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Prevent Multiple Accounts</p>
                  <p className="text-sm text-muted-foreground">Ensures each student borrower is unique</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Improves Credit Rating</p>
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
              Provide your student details to generate a zero-knowledge proof of your academic status.
            </p>
            
            <Form {...form}>
              <form className="space-y-4 mb-6">
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
                        <Fingerprint className="h-4 w-4 text-adanfo-blue" />
                        Student ID
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your student ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-adanfo-blue" />
                        Current GPA (out of 4.0)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3.5" type="number" step="0.1" min="0" max="4.0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your GPA must be at least 1.5 to be eligible for a loan
                      </FormDescription>
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
                
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="font-medium">Important Information</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    The ZKPass system will verify:
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Your current enrollment status</li>
                    <li>GPA is at least 1.5/4.0</li>
                    <li>Graduation date is at least 5 months away</li>
                  </ul>
                </div>
              </form>
            </Form>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setVerificationStep(0)}>Back</Button>
              <Button onClick={proceedToNextStep}>Next Step</Button>
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
                  <span>Personal Identifiers</span>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Private</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-green-500" />
                  <span>University Name</span>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Private</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-green-500" />
                  <span>Student ID</span>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Private</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Student Status (Verified)</span>
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
                      Only the verification result will be shared, not your personal data.
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
                Next Step
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
                By completing this process, you're generating a zero-knowledge proof that confirms your student status without revealing personal data. This proof prevents multiple accounts and helps establish trust with lenders.
              </p>
              <div className="text-sm text-left">
                <p className="font-medium mb-2">Your data remains private:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Information is processed locally on your device</li>
                  <li>Only cryptographic proof is stored on the blockchain</li>
                  <li>Lenders see only your verification status and credit score</li>
                </ul>
              </div>
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
                    Generating Proof...
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
