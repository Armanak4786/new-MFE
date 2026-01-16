import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NonFacilityGetterSetterService {
  private loansData: any;
  private afvLoan: any;
  private leaseData: any;
  public navigateToLoan = false;
  public NonFacilityLoanDetails;
  constructor() {}

  setLoansData(data: any) {
    this.loansData = data;
  }

  getLoansData() {
    return this.loansData;
  }

  setLeaseData(data: any) {
    this.leaseData = data;
  }

  getLeaseData() {
    return this.leaseData;
  }

  setAfvLoanData(data: any) {
    this.afvLoan = data;
  }

  getAfvLoanData() {
    return this.afvLoan;
  }

  setNonFacilityLoanDetails(data: any) {
    this.NonFacilityLoanDetails = data;
  }

  getNonFacilityLoanDetails() {
    return this.NonFacilityLoanDetails;
  }
}
