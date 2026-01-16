import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseCommercialService } from '../../dashboard/services/base-commercial.service';

@Injectable({
  providedIn: 'root',
})
export class NonFacilityLoanService extends BaseCommercialService {
  private baseNonFacilityLoanFormData = {};
  private baseNonFacilityLoanFormDataSubject = new BehaviorSubject<any>(
    this.baseNonFacilityLoanFormData
  );

  ngOnInit(): void {}

  setbaseNonFacilityLoanFormData(data: any) {
    this.baseNonFacilityLoanFormData = {
      ...this.baseNonFacilityLoanFormData,
      ...data,
      changeField: data,
    };
    // sessionStorage.setItem("baseAssetlinkFormData", JSON.stringify(this.baseAssetlinkFormData));
    this.baseNonFacilityLoanFormDataSubject.next(
      this.baseNonFacilityLoanFormData
    );
  }

  removeBaseNonFacilityLoanFormData(key: string) {
    this.baseNonFacilityLoanFormData =
      delete this.baseNonFacilityLoanFormData[key];
    this.baseNonFacilityLoanFormDataSubject.next(
      this.baseNonFacilityLoanFormData
    );
  }

  resetNonFacilityLoanFormData() {
    this.baseNonFacilityLoanFormData = {};
    this.baseNonFacilityLoanFormDataSubject.next(null);
    this.baseNonFacilityLoanFormDataSubject.next('');
  }

  getBaseNonFacilityLoanFormData() {
    return this.baseNonFacilityLoanFormDataSubject;
  }

  // private baseFormData = {};
  // private baseAssetlinkFormDataSubject = new BehaviorSubject<any>(
  //   this.baseAssetlinkFormData
  // );
}
