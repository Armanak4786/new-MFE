import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OlSetterGetterService {
  public leaseData: any;
  public navigateToLease: boolean = false;

  constructor() {}

  setLeaseData(data: any) {
    this.leaseData = data;
  }

  getLeaseData() {
    return this.leaseData;
  }
}
