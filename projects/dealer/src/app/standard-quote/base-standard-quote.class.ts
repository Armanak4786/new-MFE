import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { StandardQuoteService } from "./services/standard-quote.service";
import { CommonService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { BaseDealerClass } from "../base/base-dealer.class";
import { Subscription, takeUntil } from "rxjs";

@Component({
  template: "",
})
export class BaseStandardQuoteClass
  extends BaseDealerClass
  implements AfterViewInit
{
  viewGranted = true;
  addGranted = true;
  editGranted = true;
  roleBasedFunctionName = [];
  override isDisable: boolean;
  // accessGranted: any;

  patchFormOnPreviewSubscription?: Subscription;
  changedProgramSubscription?: Subscription;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
  ) {
    super(route, svc, baseSvc);
    this.accessGranted = this.baseSvc?.accessGranted;
    this.mode = this.baseSvc?.mode;
    this.accessMode = this.baseSvc?.accessMode;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.baseSvc?.changedProgram.next(null);
    this.changedProgramSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
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

    this.patchFormOnPreviewSubscription = this.baseSvc.patchDataOnPreview
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.onCalledPreview(data?.mode);
        }
      });
      this.baseSvc?.onDealerChange.subscribe((dealer)=>{
        if(dealer){
          if(this.mainForm)
             { 
             this.mainForm?.form?.reset();   

            }
          
          }

})
  }

  onStatusChange(statusDetails) {
    if (statusDetails?.currentState) {
      if (
        statusDetails?.currentState != "Open Quote" &&
        statusDetails?.currentState != "Quote" &&
        statusDetails?.currentState != "Draft"
      ) {
        // this?.mainForm?.form?.disable();
        // this.isDisable = true;
      } else {
        this.isDisable = false;
      }
    }
  }

  onCalledPreview(mode) {
    if (this?.mainForm?.form) {
      this.mainForm?.form?.patchValue(this.baseFormData);
    }
  }

  // validateAction(functionName: string): any {
  //   let accessTypes = ['View', 'Add', 'Update'];
  //   const parameter: any = this.route.snapshot.params;
  //   this.mode = parameter && parameter.mode ? parameter.mode : '';
  //   const userRole = this.svc.data.rolePermissions;

  //   if (this.mode == 'edit' && userRole?.functions?.[functionName]?.includes('Update') && accessTypes.includes('Update')) {
  //     this.accessGranted
  //     return true;
  //   } else if ((this.mode === 'create' || this.mode === '') && userRole?.functions?.[functionName]?.includes('Add') && accessTypes.includes('Add')) {
  //     return true;
  //   } else if (this.mode === 'View' && userRole?.functions?.[functionName]?.includes('View') && accessTypes.includes('View')) {
  //     return true;
  //   }
  // }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.mainForm) {
        formStatus = this.proceed();
        if (formStatus == "INVALID") {
        }
        this.baseSvc.formStatusArr.push(formStatus);
      }
    }
  }

  validateForm() {
    let formStatus;
    if (this.mainForm) {
      formStatus = this.proceed();
      this.baseSvc.formStatusArr.push(formStatus);
    }
  }

}
