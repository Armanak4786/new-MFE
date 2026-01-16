import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BailmentSetterGetterService {
  bailmentDetails;
  private swapRequest = new BehaviorSubject<any>(null);
  swapRequestData = this.swapRequest.asObservable();
  private purchaseRequest = new BehaviorSubject<any>(null);
  purchaseRequestData = this.purchaseRequest.asObservable();
  private sameDayPayout = new BehaviorSubject<any>(null);
  sameDayPayoutData = this.sameDayPayout.asObservable();
  reqHisSwapRow = new BehaviorSubject<{}>(null);
  reqHisSwapRowData = this.reqHisSwapRow.asObservable();

  constructor() {}

  setBailmentDetails(data: any) {
    this.bailmentDetails = data;
  }

  getBailmentDetails() {
    return this.bailmentDetails;
  }

  setswapRequest(data) {
    this.swapRequest.next(data);
  }
  setPurchaseRequest(data) {
    this.purchaseRequest.next(data);
  }
  setsameDaytPayout(data) {
    this.sameDayPayout.next(data);
  }

  setReqHisSwapRowData(data) {
    this.reqHisSwapRow.next(data);
  }
}
