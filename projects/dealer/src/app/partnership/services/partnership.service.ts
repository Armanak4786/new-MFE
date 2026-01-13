import { Injectable, OnInit } from '@angular/core';
import { BaseDealerService } from '../../base/base-dealer.service';

@Injectable({
  providedIn: 'root',
})
export class PartnershipService extends BaseDealerService implements OnInit {
  override formStatusArr = [];
}
