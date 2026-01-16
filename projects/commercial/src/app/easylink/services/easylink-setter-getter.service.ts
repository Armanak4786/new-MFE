import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EasylinkSetterGetterService {
  private loanData;
  private easyLinkDetails;
  constructor() {}

  setLoanData(data: any) {
    this.loanData = data;
  }

  getLoanData() {
    return this.loanData;
  }

  setEasyLinkDetails(data: any) {
    this.easyLinkDetails = data;
  }

  getEasyLinkDetails() {
    return this.easyLinkDetails;
  }
}
