import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BaseCommercialService } from '../../dashboard/services/base-commercial.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditlineDashboardService extends BaseCommercialService {
  private baseCreditlineFormData = {};
  private baseCreditlineFormDataSubject = new BehaviorSubject<any>(
    this.baseCreditlineFormData
  );

  ngOnInit(): void {}

  setBaseCreditlineFormData(data: any) {
    this.baseCreditlineFormData = {
      ...this.baseCreditlineFormData,
      ...data,
      changeField: data,
    };
    // sessionStorage.setItem("baseAssetlinkFormData", JSON.stringify(this.baseAssetlinkFormData));
    this.baseCreditlineFormDataSubject.next(this.baseCreditlineFormData);
  }

  removeBaseCreditlineFormData(key: string) {
    this.baseCreditlineFormData = delete this.baseCreditlineFormData[key];
    this.baseCreditlineFormDataSubject.next(this.baseCreditlineFormData);
  }

  resetBaseCreditlineFormData() {
    this.baseCreditlineFormData = {};
    this.baseCreditlineFormDataSubject.next(null);
    this.baseCreditlineFormDataSubject.next('');
  }

  getBaseCreditlineFormData() {
    return this.baseCreditlineFormDataSubject;
  }

  private baseAssetlinkFormData = {};
  private baseAssetlinkFormDataSubject = new BehaviorSubject<any>(
    this.baseAssetlinkFormData
  );
}
