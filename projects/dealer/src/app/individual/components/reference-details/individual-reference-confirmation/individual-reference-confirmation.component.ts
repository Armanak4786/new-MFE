import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { Validators } from "@angular/forms";
import { ToasterService, ValidationService } from "auro-ui";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-individual-reference-confirmation",
  templateUrl: "./individual-reference-confirmation.component.html",
  styleUrl: "./individual-reference-confirmation.component.scss",
})
export class IndividualReferenceConfirmationComponent extends BaseIndividualClass {

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: IndividualService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    cardBgColor: "--primary-light-color",
    api: "",
    goBackRoute: "",
    fields: [
      {
        type: "checkbox",
        label: "I confirm that all customer details are correct.",
        name: "individualDetailsConfirmation",
        className: "mt-3",
        // disabled: true
        // validators: [Validators.required],
        // errorMessage: 'required',
      },
    ],
  };

  override async onSuccess(data: any) {}

  pageCode: string = "ReferenceDetailsComponent";
  modelName: string = "IndividualReferenceConfirmationComponent";

  override async onFormReady(): Promise<void> {
    super.onFormReady();
    let invalidPages = this.checkStepValidity()
    if(invalidPages.length > 0 && this.mainForm){
    this.mainForm.form.get("individualDetailsConfirmation").patchValue(false)
    }

    if(JSON.parse(sessionStorage.getItem("updatedCustomerSummary")).length > 0 || this.baseFormData?.updatedCustomerSummary){
      const updateIconfirmCheckboxAsPerRedIcon = JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))?.find(c => c.customerNo === this.baseFormData?.customerNo)
      if(!updateIconfirmCheckboxAsPerRedIcon?.isConfirmed || updateIconfirmCheckboxAsPerRedIcon?.showInfoIcon){
        this.mainForm.form.get("individualDetailsConfirmation").patchValue(false)
      }
    }

    await this.updateValidation("onInit");
    
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  // override async ngOnInit(): Promise<void> {
  //   super.ngOnInit()
  // }
//   // let invalidPages = this.checkStepValidity()
//   // if(invalidPages.length > 0){
//   //   // this.mainForm.get("individualDetailsConfirmation").markAsTouched()
//   //   // this.mainForm.form.get("individualDetailsConfirmation").patchValue(false)
//   //   this.mainForm.form.value.individualDetailsConfirmation = false
//   //   this.cdr.detectChanges()
//   // }
// }



onCheckboxClick(){
  let invalidPages = this.checkStepValidity()
  if (invalidPages.length > 0) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Please confirm all the mandatory fields",
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.mainForm.get("individualDetailsConfirmation").disable()

      // this.mainForm.get("individualDetailsConfirmation").disable()
      this.mainForm.get("individualDetailsConfirmation").patchValue(false)
      this.baseSvc.showValidationMessage = true;
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
    else{
      this.mainForm.updateDisable({"individualDetailsConfirmation":false})
    }
}

  override onValueTyped(event: any): void {
  // super.onValueTyped(event)
  let invalidPages = this.checkStepValidity()

  // const invalidPages: any[] = [];
  
  // for (const label in this.baseSvc.componentValidity) {
  //   for (const item of this.baseSvc.componentValidity[label]) {
  //     for (const key in item) {
  //       if (item[key] === false) {
  //         // invalidPages.push({ page, component: key, validStatus: item[key] });
  //         invalidPages.push({ label, validStatus: item[key] });
  //         // stop checking further in this page, move to next
  //         break;
  //       }
  //     }
  //     // break the outer loop for this page once one invalid is found
  //     if (invalidPages.some(p => p.label === label)) {
  //       break;
  //     }
  //   }
    
  // }
  // if (invalidPages.length > 0) {
  //     this.toasterSvc.showToaster({
  //       severity: "error",
  //       detail: "Please confirm all the mandatory fields",
  //     });

  //     // this.mainForm.get("individualDetailsConfirmation").disable()
  //     this.mainForm.get("individualDetailsConfirmation").patchValue(false)
  //   }

  this.baseSvc.iconfirmCheckbox.next(invalidPages)
  // return invalidPages;
  
}


  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
  }
}
