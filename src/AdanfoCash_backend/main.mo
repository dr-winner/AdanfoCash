import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Result "mo:base/Result";

actor {
    // Types
    type User = {
        id: Principal;
        name: Text;
        email: Text;
        phone: Text;
        createdAt: Int;
        isActive: Bool;
        creditScore: Nat;
        totalLoans: Nat;
        totalBorrowed: Float;
    };

    type Loan = {
        id: Text;
        userId: Principal;
        amount: Float;
        interestRate: Float;
        term: Nat; // in months
        status: LoanStatus;
        createdAt: Int;
        dueDate: Int;
        monthlyPayment: Float;
        remainingBalance: Float;
        lastPaymentDate: ?Int;
    };

    type Transaction = {
        id: Text;
        loanId: Text;
        userId: Principal;
        amount: Float;
        transactionType: TransactionType;
        timestamp: Int;
        status: TransactionStatus;
    };

    type LoanStatus = {
        #Pending;
        #Approved;
        #Rejected;
        #Active;
        #Completed;
        #Defaulted;
    };

    type TransactionType = {
        #LoanDisbursement;
        #Payment;
        #InterestAccrual;
        #LateFee;
    };

    type TransactionStatus = {
        #Pending;
        #Completed;
        #Failed;
    };

    // State
    private var users = Buffer.Buffer<User>(0);
    private var loans = Buffer.Buffer<Loan>(0);
    private var transactions = Buffer.Buffer<Transaction>(0);
    
    // User Management
    public shared(msg) func createUser(name: Text, email: Text, phone: Text) : async Result.Result<User, Text> {
        let _caller = msg.caller;
        
        // Check if user already exists
        for (user in users.vals()) {
            if (user.id == _caller) {
                return #err("User already exists");
            };
        };
        
        let newUser : User = {
            id = _caller;
            name = name;
            email = email;
            phone = phone;
            createdAt = Time.now();
            isActive = true;
            creditScore = 700; // Default credit score
            totalLoans = 0;
            totalBorrowed = 0;
        };
        
        users.add(newUser);
        #ok(newUser)
    };
    
    public query func getUser(userId: Principal) : async ?User {
        for (user in users.vals()) {
            if (user.id == userId) {
                return ?user;
            };
        };
        null
    };
    
    // Loan Management
    public shared(msg) func applyForLoan(amount: Float, term: Nat) : async Result.Result<Loan, Text> {
        let _caller = msg.caller;
        
        // Find user
        let user = switch (await getUser(_caller)) {
            case (?u) u;
            case null return #err("User not found");
        };
        
        // Basic validation
        if (amount <= 0) return #err("Invalid loan amount");
        if (term < 1 or term > 36) return #err("Invalid loan term");
        
        // Calculate interest rate based on credit score
        let interestRate = calculateInterestRate(user.creditScore);
        
        // Calculate monthly payment
        let monthlyPayment = calculateMonthlyPayment(amount, interestRate, term);
        
        let newLoan : Loan = {
            id = generateId();
            userId = _caller;
            amount = amount;
            interestRate = interestRate;
            term = term;
            status = #Pending;
            createdAt = Time.now();
            dueDate = Time.now() + (term * 30 * 24 * 60 * 60 * 1000000000); // Convert months to nanoseconds
            monthlyPayment = monthlyPayment;
            remainingBalance = amount;
            lastPaymentDate = null;
        };
        
        loans.add(newLoan);
        #ok(newLoan)
    };
    
    public shared(msg) func approveLoan(loanId: Text) : async Result.Result<Loan, Text> {
        let _caller = msg.caller;
        
        // Find loan
        let loan = switch (findLoan(loanId)) {
            case (?l) l;
            case null return #err("Loan not found");
        };
        
        // Update loan status
        let updatedLoan = {
            id = loan.id;
            userId = loan.userId;
            amount = loan.amount;
            interestRate = loan.interestRate;
            term = loan.term;
            status = #Approved;
            createdAt = loan.createdAt;
            dueDate = loan.dueDate;
            monthlyPayment = loan.monthlyPayment;
            remainingBalance = loan.remainingBalance;
            lastPaymentDate = loan.lastPaymentDate;
        };
        
        // Update loan in buffer
        updateLoan(loanId, updatedLoan);
        
        // Create disbursement transaction
        let transaction : Transaction = {
            id = generateId();
            loanId = loanId;
            userId = loan.userId;
            amount = loan.amount;
            transactionType = #LoanDisbursement;
            timestamp = Time.now();
            status = #Completed;
        };
        
        transactions.add(transaction);
        #ok(updatedLoan)
    };
    
    // Payment Processing
    public shared(msg) func makePayment(loanId: Text, amount: Float) : async Result.Result<Transaction, Text> {
        let _caller = msg.caller;
        
        // Find loan
        let loan = switch (findLoan(loanId)) {
            case (?l) l;
            case null return #err("Loan not found");
        };
        
        // Validate payment
        if (amount <= 0) return #err("Invalid payment amount");
        if (amount > loan.remainingBalance) return #err("Payment amount exceeds remaining balance");
        
        // Update loan balance
        let updatedLoan = {
            id = loan.id;
            userId = loan.userId;
            amount = loan.amount;
            interestRate = loan.interestRate;
            term = loan.term;
            status = if (amount >= loan.remainingBalance) #Completed else #Active;
            createdAt = loan.createdAt;
            dueDate = loan.dueDate;
            monthlyPayment = loan.monthlyPayment;
            remainingBalance = loan.remainingBalance - amount;
            lastPaymentDate = ?Time.now();
        };
        
        updateLoan(loanId, updatedLoan);
        
        // Create payment transaction
        let transaction : Transaction = {
            id = generateId();
            loanId = loanId;
            userId = _caller;
            amount = amount;
            transactionType = #Payment;
            timestamp = Time.now();
            status = #Completed;
        };
        
        transactions.add(transaction);
        #ok(transaction)
    };
    
    // Helper Functions
    private func calculateInterestRate(creditScore: Nat) : Float {
        if (creditScore >= 750) 0.05
        else if (creditScore >= 700) 0.07
        else if (creditScore >= 650) 0.09
        else 0.12
    };
    
    private func calculateMonthlyPayment(principal: Float, annualRate: Float, termMonths: Nat) : Float {
        let monthlyRate = annualRate / 12.0;
        let term = Float.fromInt(termMonths);
        let monthlyPayment = principal * (monthlyRate * (1.0 + monthlyRate) ** term) / ((1.0 + monthlyRate) ** term - 1.0);
        monthlyPayment
    };
    
    private func generateId() : Text {
        let time = Int.toText(Time.now());
        let random = Int.toText(Int.abs(Time.now() % 1000));
        time # random
    };
    
    private func findLoan(loanId: Text) : ?Loan {
        for (loan in loans.vals()) {
            if (loan.id == loanId) {
                return ?loan;
            };
        };
        null
    };
    
    private func updateLoan(loanId: Text, updatedLoan: Loan) {
        var i = 0;
        while (i < loans.size()) {
            if (loans.get(i).id == loanId) {
                loans.put(i, updatedLoan);
                return;
            };
            i += 1;
        };
    };
    
    // Query Functions
    public query func getLoansByUser(userId: Principal) : async [Loan] {
        let userLoans = Buffer.Buffer<Loan>(0);
        for (loan in loans.vals()) {
            if (loan.userId == userId) {
                userLoans.add(loan);
            };
        };
        Buffer.toArray(userLoans)
    };
    
    public query func getTransactionsByLoan(loanId: Text) : async [Transaction] {
        let loanTransactions = Buffer.Buffer<Transaction>(0);
        for (transaction in transactions.vals()) {
            if (transaction.loanId == loanId) {
                loanTransactions.add(transaction);
            };
        };
        Buffer.toArray(loanTransactions)
    };
    
    public query func getLoanStats() : async {
        totalLoans: Nat;
        activeLoans: Nat;
        totalDisbursed: Float;
        totalRepaid: Float;
    } {
        var totalLoans = 0;
        var activeLoans = 0;
        var totalDisbursed = 0.0;
        var totalRepaid = 0.0;
        
        for (loan in loans.vals()) {
            totalLoans += 1;
            if (loan.status == #Active) {
                activeLoans += 1;
            };
            totalDisbursed += loan.amount;
            totalRepaid += (loan.amount - loan.remainingBalance);
        };
        
        {
            totalLoans = totalLoans;
            activeLoans = activeLoans;
            totalDisbursed = totalDisbursed;
            totalRepaid = totalRepaid;
        }
    };
};
