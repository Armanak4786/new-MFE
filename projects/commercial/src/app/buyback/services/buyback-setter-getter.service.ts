import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BuybackSetterGetterService {
  private leaseData;
  constructor() {}

  setLeaseData(data: any) {
    this.leaseData = data;
  }

  getLeaseData() {
    return this.leaseData;
  }
}
