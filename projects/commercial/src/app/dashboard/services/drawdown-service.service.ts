import { Injectable } from '@angular/core';
import { BaseCommercialService } from './base-commercial.service';

@Injectable({
  providedIn: 'root',
})
export class DrawdownServiceService extends BaseCommercialService {
  constructor() {
    super();
  }
}
