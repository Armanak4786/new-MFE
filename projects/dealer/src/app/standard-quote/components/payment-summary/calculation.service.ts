import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  constructor() {}

  calculateEMI(
    totalBorrowedAmount: number,
    interestRate: number,
    term: number
  ): number {
    const monthlyInterestRate = interestRate / (12 * 100);
    const totalPayments = term;
    const emi =
      (totalBorrowedAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    return Math.round(emi * 100) / 100;
  }

  calculateWeeklyEquivalent(
    totalBorrowedAmount: number,
    interestRate: number,
    term: number
  ): number {
    const monthlyEMI = this.calculateEMI(
      totalBorrowedAmount,
      interestRate,
      term
    );
    const weeklyEquivalentForTerm = monthlyEMI / 4; // Assuming 4 weeks in a month
    return Math.round(weeklyEquivalentForTerm * 100) / 100;
  }

  calculateInterest(
    totalBorrowedAmount: number,
    interestRate: number,
    term: number
  ): number {
    const emi = this.calculateEMI(totalBorrowedAmount, interestRate, term);
    return Math.round((emi * term - totalBorrowedAmount) * 100) / 100;
  }

  totalAmountToRepay(
    totalBorrowedAmount: number,
    calculatedInterest: number
  ): number {
    return Math.round((totalBorrowedAmount + calculatedInterest) * 100) / 100;
  }

  getDefaultDate(): string {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to midnight to only compare dates
        if (selectedDate < today) {
          return { pastDate: true };
        }
      }
      return null;
    };
  }
  firstPaymentAfterLoanDateValidator(loanDateControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const loanDateControl = control.root.get(loanDateControlName);
      if (!loanDateControl) {
        return null; // Form is not yet initialized or no loan date provided
      }

      const firstPaymentDate = new Date(control.value);
      const loanDate = new Date(loanDateControl.value);

      // Reset hours to 0 to only compare dates
      firstPaymentDate.setHours(0, 0, 0, 0);
      loanDate.setHours(0, 0, 0, 0);

      if (firstPaymentDate < loanDate) {
        return { firstPaymentBeforeLoan: true };
      }

      return null;
    };
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  formatDateString(dateString: any): any {
    const date = new Date(dateString);

    return date;
  }
}
