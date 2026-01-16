import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperatingLeaseComponentLoaderService {
  private componentSource = new Subject<string>();
  component$ = this.componentSource.asObservable();
  // public navigateToLease: boolean = false;
  // private leaseData: any;

  loadComponent(componentName: string) {
    this.componentSource.next(componentName);
  }

  // setOperatingLeaseData(data: any) {
  //   this.leaseData = data;
  // }

  // getOperatingLeaseData() {
  //   return this.leaseData;
  // }
}
