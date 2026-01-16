import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditlinesFacilityAssetsService {
  public facilityAssetToRelease = new Subject<string>();
  facilityComponent$ = this.facilityAssetToRelease.asObservable();

  public facilityAssetToConfirm = new Subject<string>();
  facilityConfirmComponent$ = this.facilityAssetToConfirm.asObservable();

  public currentAccount = new Subject<string>();
  currentAccountComponent$ = this.currentAccount.asObservable();

  public data: any[] = [];
  constructor() {}

  actionForActivatedContractList = [
    {
      icon: 'fa-solid fa-ellipsis',
    },
  ];

  pushDataToRelease(event: any) {
    this.facilityAssetToRelease.next(event);
  }

  pushDataToConfirm(event: any) {
    this.facilityAssetToConfirm.next(event);
  }

  pushCurrentDataComponent(event: any) {
    this.currentAccount.next(event);
  }
}
