import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuybackComponentLoaderService {
  private componentSource = new Subject<string>();
  component$ = this.componentSource.asObservable();

  loadComponent(componentName: string) {
    this.componentSource.next(componentName);
  }
}
