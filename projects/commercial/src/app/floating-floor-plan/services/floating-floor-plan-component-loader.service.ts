import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FloatingFloorPlanComponentLoaderService {
  public data: any[] = [];
  private floatingFloorComponentSource = new Subject<string>();
  component$ = this.floatingFloorComponentSource.asObservable();

  loadComponent(componentName: string) {
    this.floatingFloorComponentSource.next(componentName);
  }

  private floatingFloorDashboardSource = new Subject<string>();
  floatingFloorComponent$ = this.floatingFloorDashboardSource.asObservable();

  loadFloatingFloorDashboard(componentName: string) {
    this.floatingFloorDashboardSource.next(componentName);
  }
  getData() {
    return this.data;
  }

  setData(data: any) {
    this.data = data;
  }
}
