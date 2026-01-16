import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseAssetlinkService {
  private baseAssetlinkFormData = {};
  private baseAssetlinkFormDataSubject = new BehaviorSubject<any>(
    this.baseAssetlinkFormData
  );

  constructor() {}

  setBaseAssetlinkFormData(data: any) {
    this.baseAssetlinkFormData = {
      ...this.baseAssetlinkFormData,
      ...data,
      changeField: data,
    };
    this.baseAssetlinkFormDataSubject.next(this.baseAssetlinkFormData);
  }

  removeBaseAssetlinkFormData(key: string) {
    this.baseAssetlinkFormData = delete this.baseAssetlinkFormData[key];
    this.baseAssetlinkFormDataSubject.next(this.baseAssetlinkFormData);
  }

  resetBaseAssetlinkFormData() {
    this.baseAssetlinkFormData = {};
    this.baseAssetlinkFormDataSubject.next(null);
    this.baseAssetlinkFormDataSubject.next('');
  }

  getBaseAssetlinkFormData() {
    return this.baseAssetlinkFormDataSubject;
  }
}
