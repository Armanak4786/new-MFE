import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseCommercialService {
  constructor() {}
  private baseCommercialFormData = {}; // do not modify base dealer formdata
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

  removebaseCommercialFormData(key: string) {
    this.baseCommercialFormData = delete this.baseCommercialFormData[key];
    this.baseCommercialFormDataSubject.next(this.baseCommercialFormData);
  }

  resetbaseCommercialFormData() {
    this.baseCommercialFormData = {};
    this.baseCommercialFormDataSubject.next(null);
    this.baseCommercialFormDataSubject.next('');
  }

  getbaseCommercialFormData() {
    return this.baseCommercialFormDataSubject;
  }
}
