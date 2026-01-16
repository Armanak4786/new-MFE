import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacilityAssetsService {
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
  // facilityAsssetsDatalist = new BehaviorSubject<any>([
  //   {assetNo:'44444', Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000',ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  //   {assetNo:'7724',Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000', ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  //   {assetNo:'9824',Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000', ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  //   {assetNo:'0524',Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000', ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  //   {assetNo:'0524',Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000', ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  //   {assetNo:'0524',Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000', ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  //   {assetNo:'0524',Description: 'Sample Description Here',regVINSerialChassis: 'ABC123456789123456',lastValuedDate: '05-05-2024',valuation: '2355000', ssv: '2355000', costPrice: '2355000',actions: this.actionForActivatedContractList},
  // ]);

  pushDataToRelease(event: any) {
    this.facilityAssetToRelease.next(event);
  }

  pushDataToConfirm(event: any) {
    this.facilityAssetToConfirm.next(event);
  }

  pushCurrentDataComponent(event: any) {
    this.currentAccount.next(event);
  }

  getData() {
    return this.data;
  }

  setData(newData): void {
    this.data = newData;
  }
}
