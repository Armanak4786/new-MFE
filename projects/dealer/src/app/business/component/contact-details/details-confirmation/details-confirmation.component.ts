import { Component } from "@angular/core";
import { BaseBusinessClass } from "../../../base-business.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { BusinessService } from "../../../services/business";

@Component({
  selector: "app-details-confirmation",
  templateUrl: "./details-confirmation.component.html",
})
export class DetailsConfirmationComponent extends BaseBusinessClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: BusinessService,
    public toasterSvc: ToasterService,
  ) {
    super(route, svc, baseSvc);
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    cardBgColor: "--primary-light-color",
    api: "businessDetails",
    goBackRoute: "businessDetails",
    fields: [
      {
        type: "checkbox",
        label: "I confirm that all customer details are correct.",
        name: "detailsConfirmation",
        className: 'mt-3'
      },
    ],
  };

  override async onSuccess(data: any) {}

  override async onFormReady(): Promise<void> {
    super.onFormReady();
    let invalidPages = this.checkStepValidity()
    if(invalidPages.length > 0 && this.mainForm){
    this.mainForm.form.get("detailsConfirmation").patchValue(false)
    }

    let sessionUpdatedCustomerSummary = JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))
    if(sessionUpdatedCustomerSummary?.length > 0 || this.baseFormData?.updatedCustomerSummary){
    const updateIconfirmCheckboxAsPerRedIcon = sessionUpdatedCustomerSummary?.find(c => c.customerNo === this.baseFormData?.customerNo)
    if(!updateIconfirmCheckboxAsPerRedIcon?.isConfirmed || updateIconfirmCheckboxAsPerRedIcon?.showInfoIcon){
      this.mainForm.form.get("detailsConfirmation").patchValue(false)
    }
  }

    // await this.updateValidation("onInit");
    
  }

  onCheckboxClick(){
  let invalidPages = this.checkStepValidity()
  if (invalidPages.length > 0) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Please confirm all the mandatory fields",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.mainForm.get("detailsConfirmation").disable()

      // this.mainForm.get("detailsConfirmation").disable()
      this.mainForm.get("detailsConfirmation").patchValue(false)
      this.baseSvc.showValidationMessage = true;
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
    else{
      this.mainForm.updateDisable({"detailsConfirmation":false})
    }
}

  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);
    this.baseSvc.updateComponentStatus("Contact Details", "DetailsConfirmationComponent", this.mainForm.form.valid)
  }

   override onValueTyped(event: any): void {
    let invalidPages = this.checkStepValidity()
    this.baseSvc.iconfirmCheckbox.next(invalidPages)
  }
}
