import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { BaseCommercialClass } from '../../base-commercial.class';
import { CreditlineDashboardService } from '../services/creditline-dashboard.service';

@Component({
  template: '',
})
export class BaseCreditlineClass extends BaseCommercialClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: CreditlineDashboardService
  ) {
    super(route, svc, baseSvc);
    // this.accessGranted = this.credServ?.accessGranted;
    //this.mode = this.credServ?.mode;
    //this.accessMode = this.credServ?.accessMode;
  }

  // setFormData(data: any) {
  //   let sanitizedData = this.sanitizeInput(data);
  //   this.baseSvc.setBaseCreditlineFormData(sanitizedData);
  // }
}
