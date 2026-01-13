import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { BaseDealerClass } from "../base/base-dealer.class";
import { BusinessService } from "./services/business";
import { Subscription, takeUntil } from "rxjs";

@Component({
  template: "",
})
export abstract class BaseBusinessClass extends BaseDealerClass {
  patchFormOnPreviewSubscription?: Subscription;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: BusinessService
  ) {
    super(route, svc, baseSvc);
    this.accessGranted = this.baseSvc?.accessGranted;
    this.mode = this.baseSvc?.mode;
    this.accessMode = this.baseSvc?.accessMode;
  }
  customForm: { form: any };

  ngAfterViewInit(): void {
    if (this.baseSvc.standardQuoteSvc.activeStep == 2) {
      this.mainForm?.form?.disable();
      if (this.customForm?.form) {
        this.customForm?.form?.disable();
      }
    }
    if (this.accessMode == "view") {
      if (this.mainForm) {
        this.mainForm.formViewMode = true;
      }
      this.mainForm?.form?.disable();
    } else {
      if (this.mainForm) {
        this.mainForm.formViewMode = false;
      }
    }
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.statusSubcription = this.baseSvc?.appStatus
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((statusDetails) => {
        this.onStatusChange(statusDetails);
      });

    this.patchFormOnPreviewSubscription = this.baseSvc?.patchDataOnPreview
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.onCalledPreview(data);
        }
      });
  }

  onStatusChange(statusDetails) {
    if (statusDetails?.currentState) {
      if (
        statusDetails?.currentState != "Open Quote" &&
        statusDetails?.currentState != "Quote" &&
        statusDetails?.currentState != "Draft"
      ) {
        // this?.mainForm?.form?.disable();
      }
    }
  }

  onCalledPreview(formData) {
    if (this?.mainForm) {
      this.mainForm?.form?.patchValue(this.baseFormData);
    }
  }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.mainForm) {
        // formStatus = this.proceed();
        // this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
  }

  checkStepValidity(){
  const invalidPages: any[] = [];
  
  for (const label in this.baseSvc.componentValidity) {
    for (const item of this.baseSvc.componentValidity[label]) {
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
