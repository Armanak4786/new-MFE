import { Injectable } from '@angular/core';
import {
  LoanDetails,
  AssuredFuture,
  currentPosition,
  PayementSchedule,
  OperatingLease,
} from '../model/customer-statment';

@Injectable({
  providedIn: 'root',
})
export class CustomerStatementService {
  loanDetails: LoanDetails[] = [
    {
      product: 'Credit Sales Agreement',
      term: 48,
      interestRate: 10.07,
      loanDate: new Date(
        'Sun Feb 18 2024 05:30:00 GMT+0530 (India Standard Time)'
      ),
      maturityDate: new Date(
        'Sun Feb 22 2024 05:30:00 GMT+0530 (India Standard Time)'
      ),
      loanAmount: 1724.66,
      interestCharge: 14783.47,
    },
  ];

  assuredFuture: AssuredFuture[] = [
    {
      futureValue: 10000,
      futureDate: new Date(
        'Sun Feb 22 2024 05:30:00 GMT+0530 (India Standard Time)'
      ),
    },
  ];
  operatingLease: OperatingLease[] = [
    {
      residualValueExcl: 10000,
      residualValueIncl: 10000,
      gst:100,
      endDate: new Date(
        'Sun Feb 22 2024 05:30:00 GMT+0530 (India Standard Time)'
      ),
    },
  ];

  currentPosition: currentPosition[] = [
    {
      grossBalance: 10724.66,
      loanBalance: 1724.66,
      currentIntresetRate: 10.07,
      nextRepriceDate: new Date(
        'Sun Mar 18 2024 05:30:00 GMT+0530 (India Standard Time)'
      ),
      remainingTerm: 24,
    },
  ];

  payementSchedule: PayementSchedule[] = [
    {
      paymentDate: new Date(
        'May 05 2023 05:30:00 GMT+0530 (India Standard Time)'
      ),
      principalAmount: 13653,
      interestPayment: 13653,
      paymentAmount: 13653,
      principalBalance: 13653,
      remainingInterest: 13653,
    },
    {
      paymentDate: new Date(
        'May 05 2023 05:30:00 GMT+0530 (India Standard Time)'
      ),
      principalAmount: 13653,
      interestPayment: 13653,
      paymentAmount: 13653,
      principalBalance: 13653,
      remainingInterest: 13653,
    },
    {
      paymentDate: new Date(
        'May 05 2023 05:30:00 GMT+0530 (India Standard Time)'
      ),
      principalAmount: 13653,
      interestPayment: 13653,
      paymentAmount: 13653,
      principalBalance: 13653,
      remainingInterest: 13653,
    },
    {
      paymentDate: new Date(
        'May 05 2023 05:30:00 GMT+0530 (India Standard Time)'
      ),
      principalAmount: 13653,
      interestPayment: 13653,
      paymentAmount: 13653,
      principalBalance: 13653,
      remainingInterest: 13653,
    },
    {
      paymentDate: new Date(
        'May 05 2023 05:30:00 GMT+0530 (India Standard Time)'
      ),
      principalAmount: 13653,
      interestPayment: 13653,
      paymentAmount: 13653,
      principalBalance: 13653,
      remainingInterest: 13653,
    },
    {
      paymentDate: new Date(
        'May 05 2023 05:30:00 GMT+0530 (India Standard Time)'
      ),
      principalAmount: 13653,
      interestPayment: 13653,
      paymentAmount: 13653,
      principalBalance: 13653,
      remainingInterest: 13653,
    },
  ];

  constructor() {}
}
