export const idlFactory = ({ IDL }) => {
  const LoanStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Defaulted' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Loan = IDL.Record({
    'id' : IDL.Text,
    'status' : LoanStatus,
    'userId' : IDL.Principal,
    'lastPaymentDate' : IDL.Opt(IDL.Int),
    'createdAt' : IDL.Int,
    'term' : IDL.Nat,
    'dueDate' : IDL.Int,
    'interestRate' : IDL.Float64,
    'remainingBalance' : IDL.Float64,
    'monthlyPayment' : IDL.Float64,
    'amount' : IDL.Float64,
  });
  const Result_2 = IDL.Variant({ 'ok' : Loan, 'err' : IDL.Text });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'isActive' : IDL.Bool,
    'email' : IDL.Text,
    'totalLoans' : IDL.Nat,
    'creditScore' : IDL.Nat,
    'totalBorrowed' : IDL.Float64,
    'phone' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const TransactionStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const TransactionType = IDL.Variant({
    'InterestAccrual' : IDL.Null,
    'LateFee' : IDL.Null,
    'Payment' : IDL.Null,
    'LoanDisbursement' : IDL.Null,
  });
  const Transaction = IDL.Record({
    'id' : IDL.Text,
    'status' : TransactionStatus,
    'transactionType' : TransactionType,
    'userId' : IDL.Principal,
    'loanId' : IDL.Text,
    'timestamp' : IDL.Int,
    'amount' : IDL.Float64,
  });
  const Result = IDL.Variant({ 'ok' : Transaction, 'err' : IDL.Text });
  return IDL.Service({
    'applyForLoan' : IDL.Func([IDL.Float64, IDL.Nat], [Result_2], []),
    'approveLoan' : IDL.Func([IDL.Text], [Result_2], []),
    'createUser' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_1], []),
    'getLoanStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalDisbursed' : IDL.Float64,
            'totalLoans' : IDL.Nat,
            'totalRepaid' : IDL.Float64,
            'activeLoans' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getLoansByUser' : IDL.Func([IDL.Principal], [IDL.Vec(Loan)], ['query']),
    'getTransactionsByLoan' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'getUser' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'makePayment' : IDL.Func([IDL.Text, IDL.Float64], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
