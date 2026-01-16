import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseEasylinkService {
  private baseEasylinkFormData = {};
  private baseEasylinkFormDataSubject = new BehaviorSubject<any>(
    this.baseEasylinkFormData
  );

  constructor() {}

  setBaseEasylinkFormData(data: any) {
    this.baseEasylinkFormData = {
      ...this.baseEasylinkFormData,
      ...data,
      changeField: data,
    };
    // sessionStorage.setItem("baseAssetlinkFormData", JSON.stringify(this.baseAssetlinkFormData));
    this.baseEasylinkFormDataSubject.next(this.baseEasylinkFormData);
  }

  removeBaseEasylinkFormData(key: string) {
    this.baseEasylinkFormData = delete this.baseEasylinkFormData[key];
    this.baseEasylinkFormDataSubject.next(this.baseEasylinkFormData);
  }

  resetBaseEasylinkFormData() {
    this.baseEasylinkFormData = {};
    this.baseEasylinkFormDataSubject.next(null);
    this.baseEasylinkFormDataSubject.next('');
  }

  getBaseEasylinkFormData() {
    return this.baseEasylinkFormDataSubject;
  }
}
