
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CreditCard, Clock, BadgeCheck, BadgeX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';

interface LoanHistoryProps {
  loans: any[];
  creditScore: number;
}

const LoanHistory: React.FC<LoanHistoryProps> = ({ loans, creditScore }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-adanfo-blue" />
            <span>Loan History & Credit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Credit Score:</span>
            <Badge variant={creditScore > 700 ? "success" : creditScore > 500 ? "default" : "destructive"}>
              {creditScore}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No loan history yet. Start by requesting your first loan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        {new Date(loan.requestDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${loan.amount}</TableCell>
                    <TableCell>{loan.durationMonths} months</TableCell>
                    <TableCell>
                      <Badge variant={
                        loan.status === 'repaid' ? "success" : 
                        loan.status === 'funded' ? "default" : 
                        loan.status === 'pending' ? "outline" : "destructive"
                      }>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {loan.status === 'funded' || loan.status === 'repaid' ? (
                        <div className="flex items-center gap-1">
                          {loan.onTime ? (
                            <BadgeCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <BadgeX className="h-4 w-4 text-red-500" />
                          )}
                          <span className={loan.onTime ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                            {loan.onTime ? "On Time" : "Late"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Pending</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanHistory;
