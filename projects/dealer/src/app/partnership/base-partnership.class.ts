import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { BaseDealerClass } from '../base/base-dealer.class';
import { PartnershipService } from './services/partnership.service';

@Component({
  template: '',
})
export abstract class BasePartnershipClass
  extends BaseDealerClass
  implements OnInit, OnDestroy
{
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public partnershipSvc: PartnershipService
  ) {
    super(route, svc, partnershipSvc);
  }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.mainForm) {
        formStatus = this.proceed();
        this.partnershipSvc.formStatusArr.push(formStatus);
      }
    }
  }
}
