import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public transformFinancialSummary = new Subject<string>();
  financial = this.transformFinancialSummary.asObservable();
  public financialSummary: any;
  public userInfo: any;
  public facilityType;

  setFinancialSummaryData(data: any) {
    this.financialSummary = data;
  }

  getFinancialSummaryData() {
    return this.financialSummary;
  }

  setUserInfoData(data: any) {
    this.userInfo = data;
  }

  getUserInfoData() {
    return this.userInfo;
  }

  setFacilityTpe(data: any) {
    this.facilityType = data;
  }

  getFacilityTpe() {
    return this.facilityType;
  }
  setTransformFinancialSummary(data) {
    this.transformFinancialSummary.next(data);
  }
}
