import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FixedFloorPlanComponentLoaderService {
  public data: any[] = [];
  private fixedFloorComponentSource = new Subject<string>();
  component$ = this.fixedFloorComponentSource.asObservable();

  loadComponent(componentName: string) {
    this.fixedFloorComponentSource.next(componentName);
  }

  private fixedFloorDashboardSource = new Subject<string>();
  bailmentDashboardComponent$ = this.fixedFloorDashboardSource.asObservable();

  loadFixedFloorDashboard(componentName: string) {
    this.fixedFloorDashboardSource.next(componentName);
  }
  getData() {
    return this.data;
  }

  setData(data: any) {
    this.data = data;
  }
}
