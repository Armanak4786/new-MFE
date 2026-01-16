import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssetlinkSetterGetterService {
  private loanData;
  private assetLinkDetails;
  constructor() {}

  setLoanData(data: any) {
    this.loanData = data;
  }

  getLoanData() {
    return this.loanData;
  }

  setAssetLinkDetails(data: any) {
    this.assetLinkDetails = data;
  }

  getAssetLinkDetails() {
    return this.assetLinkDetails;
  }
}
