export interface LoanDetails {
  product: string;
  term: number;
  interestRate: number;
  loanDate: Date;
  maturityDate: Date;
  loanAmount: number;
  interestCharge: number;
}

export interface AssuredFuture {
  futureValue: number;
  futureDate: Date;
}


export interface OperatingLease {
  residualValueIncl: number;
  residualValueExcl: number;
  gst:number;
  endDate:Date;
}

export interface currentPosition {
  grossBalance: number;
  loanBalance: number;
  currentIntresetRate: number;
  nextRepriceDate: Date;
  remainingTerm: number;
}

export interface PayementSchedule {
  paymentDate: Date;
  principalAmount: number;
  interestPayment: number;
  paymentAmount: number;
  principalBalance: number;
  remainingInterest: number;
}
