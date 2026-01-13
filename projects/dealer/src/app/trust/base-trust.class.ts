import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { BaseDealerClass } from '../base/base-dealer.class';
import { TrustService } from './services/trust.service';

@Component({
  template: '',
})
export abstract class BaseTrustClass
  extends BaseDealerClass
  implements OnInit, OnDestroy
{
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public trustSvc: TrustService
  ) {
    super(route, svc, trustSvc);
  }

  customForm: { form: any };
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

  }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.mainForm) {
        // formStatus = this.proceed();
        // this.trustSvc.formStatusArr.push(formStatus);
      }
    }
  }

checkStepValidity(){
  const invalidPages: any[] = [];
  
  for (const label in this.trustSvc.componentValidity) {
    for (const item of this.trustSvc.componentValidity[label]) {
      for (const key in item) {
        if (item[key] === false) {
          // invalidPages.push({ page, component: key, validStatus: item[key] });
          invalidPages.push({ label, validStatus: item[key] });
          // stop checking further in this page, move to next
          break;
        }
      }
      // break the outer loop for this page once one invalid is found
      if (invalidPages.some(p => p.label === label)) {
        break;
      }
    }
    
  }
  // this.baseSvc.iconfirmCheckbox.next(invalidPages)
  return invalidPages;
  }
}
