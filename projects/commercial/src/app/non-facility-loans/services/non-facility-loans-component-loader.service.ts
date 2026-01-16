import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonFacilityLoansComponentLoaderService {

  constructor() { }
    private componentSource = new Subject<string>();
    component$ = this.componentSource.asObservable();
    private facilityComponentSource = new Subject<string>();
    facilityComponent$ = this.facilityComponentSource.asObservable();
  
    loadComponent(componentName: string) {
      this.componentSource.next(componentName);
    }
  
    loadComponentOnFacilitySelection(componentName: string) {
      this.facilityComponentSource.next(componentName);
    }
  
}
