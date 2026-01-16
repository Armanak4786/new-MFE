import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardSetterGetterService {
  public financialSummaryData = new BehaviorSubject<any>(null);
  public financialList$ = this.financialSummaryData.asObservable();
  setFinanacialSummary(list) {
    this.financialSummaryData.next(list);
  }
}
