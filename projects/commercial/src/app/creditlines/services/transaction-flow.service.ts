import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionFlowService {
  constructor() { }
  public transactionFlowSource = new Subject<string>();
  component$ = this.transactionFlowSource.asObservable();
 
  transactionFlowData(componentName: string) {
    this.transactionFlowSource.next(componentName);
  }

}
