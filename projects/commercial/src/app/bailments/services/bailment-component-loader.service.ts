import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BailmentComponentLoaderService {
  public data: any[] = [];
  private bailmentComponentSource = new Subject<string>();
  component$ = this.bailmentComponentSource.asObservable();

  loadComponent(componentName: string) {
    this.bailmentComponentSource.next(componentName);
  }

  private bailmentDashboardSource = new Subject<string>();
  bailmentDashboardComponent$ = this.bailmentDashboardSource.asObservable();

  loadBailmentDashboard(componentName: string) {
    this.bailmentDashboardSource.next(componentName);
  }

  getData() {
    return this.data;
  }

  setData(data: any) {
    this.data = data;
  }
}
