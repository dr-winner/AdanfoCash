
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  CreditCard,
  ChevronDown,
  CheckCircle,
  Coins,
  AlertTriangle
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface LoanPoolProps {
  lenderId: string;
}

interface LoanRequest {
  id: string;
  amount: number;
  purpose: string;
  duration: number;
  description?: string;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
  borrowerId: string;
  borrowerName: string;
  creditScore: number;
  status: string;
  createdAt: string;
}

const LoanPool: React.FC<LoanPoolProps> = ({ lenderId }) => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    minAmount: 0,
    maxAmount: 50000,
    minDuration: 0,
    maxDuration: 60,
    minInterestRate: 0,
    maxInterestRate: 20,
    minCreditScore: 0,
    status: 'pending'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [fundingAmount, setFundingAmount] = useState('');
  const { toast } = useToast();
  
  // Load loan requests from local storage
  useEffect(() => {
    const loadLoanRequests = () => {
      try {
        const storedRequests = localStorage.getItem('loanRequests');
        if (storedRequests) {
          const requests = JSON.parse(storedRequests) as LoanRequest[];
          setLoanRequests(requests);
          
          // Initially filter for pending requests
          const pending = requests.filter(loan => loan.status === 'pending');
          setFilteredRequests(pending);
        }
      } catch (error) {
        console.error('Error loading loan requests:', error);
      }
    };
    
    loadLoanRequests();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(loadLoanRequests, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = loanRequests;
    
    // Filter by status
    if (activeFilters.status) {
      filtered = filtered.filter(loan => loan.status === activeFilters.status);
    }
    
    // Filter by amount range
    filtered = filtered.filter(
      loan => loan.amount >= activeFilters.minAmount && loan.amount <= activeFilters.maxAmount
    );
    
    // Filter by duration range
    filtered = filtered.filter(
      loan => loan.duration >= activeFilters.minDuration && loan.duration <= activeFilters.maxDuration
    );
    
    // Filter by interest rate range
    filtered = filtered.filter(
      loan => loan.interestRate >= activeFilters.minInterestRate && loan.interestRate <= activeFilters.maxInterestRate
    );
    
    // Filter by credit score
    filtered = filtered.filter(
      loan => loan.creditScore >= activeFilters.minCreditScore
    );
    
    // Apply search term (search in amount, purpose, duration)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        loan => 
          loan.amount.toString().includes(term) ||
          loan.purpose.toLowerCase().includes(term) ||
          loan.duration.toString().includes(term) ||
          loan.interestRate.toString().includes(term)
      );
    }
    
    setFilteredRequests(filtered);
  }, [loanRequests, searchTerm, activeFilters]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveFilters({
      ...activeFilters,
      status: value
    });
  };
  
  // Handle funding a loan
  const handleFundLoan = (loan: LoanRequest) => {
    setSelectedLoan(loan);
    setFundingAmount(loan.amount.toString());
    setIsDialogOpen(true);
  };
  
  // Confirm funding
  const confirmFunding = () => {
    if (!selectedLoan) return;
    
    try {
      // Update the loan status in local storage
      const updatedRequests = loanRequests.map(loan => {
        if (loan.id === selectedLoan.id) {
          return {
            ...loan,
            status: 'funded',
            fundedBy: lenderId,
            fundedAmount: parseFloat(fundingAmount),
            fundedAt: new Date().toISOString()
          };
        }
        return loan;
      });
      
      localStorage.setItem('loanRequests', JSON.stringify(updatedRequests));
      setLoanRequests(updatedRequests);
      
      // Show success toast
      toast({
        title: "Loan Funded Successfully",
        description: `You have successfully funded a loan of $${fundingAmount}.`,
      });
      
      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error funding loan:', error);
      toast({
        title: "Funding Failed",
        description: "There was an error processing your funding request.",
        variant: "destructive"
      });
    }
  };
  
  // Get credit score badge color
  const getCreditScoreBadgeColor = (score: number) => {
    if (score >= 750) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 670) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (score >= 580) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };
  
  // Get credit score rating text
  const getCreditScoreRating = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor";
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-adanfo-blue" />
            Loan Pool
          </CardTitle>
          <CardDescription>
            Browse loan requests from verified borrowers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search loans..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Collapsible className="w-full sm:w-auto">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-4 border rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Amount Range</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full"
                        value={activeFilters.minAmount}
                        onChange={(e) => setActiveFilters({...activeFilters, minAmount: parseInt(e.target.value) || 0})}
                      />
                      <span>-</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full"
                        value={activeFilters.maxAmount}
                        onChange={(e) => setActiveFilters({...activeFilters, maxAmount: parseInt(e.target.value) || 50000})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Duration (months)</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full"
                        value={activeFilters.minDuration}
                        onChange={(e) => setActiveFilters({...activeFilters, minDuration: parseInt(e.target.value) || 0})}
                      />
                      <span>-</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full"
                        value={activeFilters.maxDuration}
                        onChange={(e) => setActiveFilters({...activeFilters, maxDuration: parseInt(e.target.value) || 60})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Interest Rate (%)</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full"
                        value={activeFilters.minInterestRate}
                        onChange={(e) => setActiveFilters({...activeFilters, minInterestRate: parseInt(e.target.value) || 0})}
                      />
                      <span>-</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full"
                        value={activeFilters.maxInterestRate}
                        onChange={(e) => setActiveFilters({...activeFilters, maxInterestRate: parseInt(e.target.value) || 20})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Minimum Credit Score</label>
                    <Select 
                      value={activeFilters.minCreditScore.toString()}
                      onValueChange={(value) => setActiveFilters({...activeFilters, minCreditScore: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Score</SelectItem>
                        <SelectItem value="580">Fair (580+)</SelectItem>
                        <SelectItem value="670">Good (670+)</SelectItem>
                        <SelectItem value="750">Excellent (750+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveFilters({
                      minAmount: 0,
                      maxAmount: 50000,
                      minDuration: 0,
                      maxDuration: 60,
                      minInterestRate: 0,
                      maxInterestRate: 20,
                      minCreditScore: 0,
                      status: activeFilters.status
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Tabs for status filtering */}
          <Tabs defaultValue="pending" onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="funded">Funded</TabsTrigger>
              <TabsTrigger value="all">All Loans</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Loan Requests List */}
          <ScrollArea className="h-[600px] pr-4">
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((loan) => (
                  <Collapsible key={loan.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="capitalize">
                              {loan.purpose.replace('_', ' ')}
                            </Badge>
                            <Badge className={getCreditScoreBadgeColor(loan.creditScore)}>
                              <CreditCard className="mr-1 h-3 w-3" />
                              {getCreditScoreRating(loan.creditScore)} ({loan.creditScore})
                            </Badge>
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              {loan.duration} months
                            </Badge>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="font-medium">Amount: ${loan.amount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <TrendingUp className="mr-1 h-3 w-3 text-adanfo-blue" />
                              Rate: {loan.interestRate}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm">View Details</Button>
                          </CollapsibleTrigger>
                          
                          {loan.status === 'pending' && (
                            <Button size="sm" onClick={() => handleFundLoan(loan)}>
                              Fund Loan
                            </Button>
                          )}
                          
                          {loan.status === 'funded' && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Funded
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="p-4 bg-secondary/30 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Loan Details</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="font-medium">${loan.amount.toLocaleString()}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span>{loan.duration} months</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Interest Rate:</span>
                                <span>{loan.interestRate}%</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Monthly Payment:</span>
                                <span>${loan.monthlyPayment.toFixed(2)}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Total Repayment:</span>
                                <span>${loan.totalRepayment.toFixed(2)}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Purpose:</span>
                                <span>{loan.purpose.replace('_', ' ')}</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Borrower Profile</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Credit Score:</span>
                                <span className="font-medium">{loan.creditScore} ({getCreditScoreRating(loan.creditScore)})</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Risk Level:</span>
                                <span>{
                                  loan.creditScore >= 750 ? 'Very Low' :
                                  loan.creditScore >= 670 ? 'Low' :
                                  loan.creditScore >= 580 ? 'Moderate' : 'High'
                                }</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Expected ROI:</span>
                                <span>{(loan.interestRate - 2).toFixed(1)}%</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Requested:</span>
                                <span>{new Date(loan.createdAt).toLocaleDateString()}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        {loan.description && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{loan.description}</p>
                          </div>
                        )}
                        
                        {loan.status === 'pending' ? (
                          <Button onClick={() => handleFundLoan(loan)} className="w-full">
                            Fund This Loan
                          </Button>
                        ) : loan.status === 'funded' ? (
                          <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-400">This loan has been funded!</p>
                              <p className="text-green-700 dark:text-green-500 mt-1">Funded on: {new Date().toLocaleDateString()}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No loan requests found</h3>
                <p className="text-muted-foreground">
                  {activeFilters.status === 'pending' 
                    ? "There are no pending loan requests matching your criteria"
                    : activeFilters.status === 'funded'
                    ? "You haven't funded any loans yet"
                    : "No loans match your current filters"}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilters({
                      ...activeFilters,
                      minAmount: 0,
                      maxAmount: 50000,
                      minDuration: 0,
                      maxDuration: 60,
                      minInterestRate: 0,
                      maxInterestRate: 20,
                      minCreditScore: 0
                    });
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Funding Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund This Loan</DialogTitle>
            <DialogDescription>
              You are about to fund a loan request. Please confirm the details below.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="font-medium">${selectedLoan.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedLoan.duration} months</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{selectedLoan.interestRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expected Return</p>
                  <p className="font-medium">${selectedLoan.totalRepayment.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium">Funding Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="number"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="pl-10"
                    max={selectedLoan.amount}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum amount: ${selectedLoan.amount.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm mb-4 border border-yellow-200 dark:border-yellow-900/50">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Important Notice
                </h4>
                <p className="text-yellow-700 dark:text-yellow-500">
                  By funding this loan, you agree to the terms and conditions of the loan contract. 
                  This action cannot be undone after confirmation.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmFunding}>Confirm Funding</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanPool;

// For the Dialog
const DollarSign = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
