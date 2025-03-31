import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Loan {
  'id' : string,
  'status' : LoanStatus,
  'userId' : Principal,
  'lastPaymentDate' : [] | [bigint],
  'createdAt' : bigint,
  'term' : bigint,
  'dueDate' : bigint,
  'interestRate' : number,
  'remainingBalance' : number,
  'monthlyPayment' : number,
  'amount' : number,
}
export type LoanStatus = { 'Active' : null } |
  { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Defaulted' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export type Result = { 'ok' : Transaction } |
  { 'err' : string };
export type Result_1 = { 'ok' : User } |
  { 'err' : string };
export type Result_2 = { 'ok' : Loan } |
  { 'err' : string };
export interface Transaction {
  'id' : string,
  'status' : TransactionStatus,
  'transactionType' : TransactionType,
  'userId' : Principal,
  'loanId' : string,
  'timestamp' : bigint,
  'amount' : number,
}
export type TransactionStatus = { 'Failed' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export type TransactionType = { 'InterestAccrual' : null } |
  { 'LateFee' : null } |
  { 'Payment' : null } |
  { 'LoanDisbursement' : null };
export interface User {
  'id' : Principal,
  'name' : string,
  'createdAt' : bigint,
  'isActive' : boolean,
  'email' : string,
  'totalLoans' : bigint,
  'creditScore' : bigint,
  'totalBorrowed' : number,
  'phone' : string,
}
export interface _SERVICE {
  'applyForLoan' : ActorMethod<[number, bigint], Result_2>,
  'approveLoan' : ActorMethod<[string], Result_2>,
  'createUser' : ActorMethod<[string, string, string], Result_1>,
  'getLoanStats' : ActorMethod<
    [],
    {
      'totalDisbursed' : number,
      'totalLoans' : bigint,
      'totalRepaid' : number,
      'activeLoans' : bigint,
    }
  >,
  'getLoansByUser' : ActorMethod<[Principal], Array<Loan>>,
  'getTransactionsByLoan' : ActorMethod<[string], Array<Transaction>>,
  'getUser' : ActorMethod<[Principal], [] | [User]>,
  'makePayment' : ActorMethod<[string, number], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
