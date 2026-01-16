import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseCommercialService {
  constructor() {}
  private baseCommercialFormData = {}; // do not modify base dealer
  public formStatusArr = [];
  public changeDetectionForUpdate = new BehaviorSubject<any>(null);
  private baseCommercialFormDataSubject = new BehaviorSubject<any>(
    this.baseCommercialFormData
  );
  setBaseCommercialFormData(data: any) {
    this.baseCommercialFormData = {
      ...this.baseCommercialFormData,
      ...data,
      changedField: data,
    };
    this.baseCommercialFormDataSubject.next(this.baseCommercialFormData);
  }

  setbaseCommercialFormData(data: any) {
    this.baseCommercialFormData = {
      ...this.baseCommercialFormData,
      ...data,
      changeField: data,
    };
    // sessionStorage.setItem("baseDealerFormData", JSON.stringify(this.baseDealerFormData));
    this.baseCommercialFormDataSubject.next(this.baseCommercialFormData);
  }

  removeBaseDealerFormData(key: string) {
    this.baseCommercialFormData = delete this.baseCommercialFormData[key];
    this.baseCommercialFormDataSubject.next(this.baseCommercialFormData);
  }

  resetBaseDealerFormData() {
    this.baseCommercialFormData = {};
    this.baseCommercialFormDataSubject.next(null);
    this.baseCommercialFormDataSubject.next('');
  }

  getBaseCommercialFormData() {
    return this.baseCommercialFormDataSubject;
  }
}
