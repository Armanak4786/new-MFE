import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreditlineSetterGetterService {
  private leaseData: any;
  private loansData: any;
  public navigateToLoan: boolean = false;
  public navigateToLease: boolean = false;
  creditLineDetails;

  constructor() {}

  setLeaseData(data: any) {
    this.leaseData = data;
  }

  getLeaseData() {
    return this.leaseData;
  }

  setLoansData(data: any) {
    this.loansData = data;
  }

  getLoansData() {
    return this.loansData;
  }

  setCreditlinesDetails(data: any) {
    this.creditLineDetails = data;
  }

  getCreditlinesDetails() {
    return this.creditLineDetails;
  }
}
