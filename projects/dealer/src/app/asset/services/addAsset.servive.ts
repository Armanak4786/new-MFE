import { Injectable, OnInit } from '@angular/core';
import { BaseDealerService } from '../../base/base-dealer.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddAssetService extends BaseDealerService implements OnInit {
  addAssetFormDataSubject = new Subject<any>();
  addAssetFormData$ = this.addAssetFormDataSubject.asObservable();
  
}
