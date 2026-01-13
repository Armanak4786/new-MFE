import { Component } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { BusinessService } from "../../../../business/services/business";
import { TrustService } from "../../../services/trust.service";

@Component({
  selector: "app-trust-details-confirmation",
  templateUrl: "./trust-details-confirmation.component.html",
  styleUrl: "./trust-details-confirmation.component.scss",
})
export class TrustDetailsConfirmationComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: TrustService,
    public toasterSvc: ToasterService
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
        name: "trustDetailsConfirmation",
        className: 'mt-3'
      },
    ],
  };

  override async onSuccess(data: any) {}

  override async onFormReady(): Promise<void> {
    super.onFormReady();
    let invalidPages = this.checkStepValidity()
    if(invalidPages.length > 0 && this.mainForm){
    this.mainForm.form.get("trustDetailsConfirmation").patchValue(false)
    }

    let sessionUpdatedCustomerSummary = JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))

    if(sessionUpdatedCustomerSummary?.length > 0 || this.baseFormData?.updatedCustomerSummary){
    const updateIconfirmCheckboxAsPerRedIcon = sessionUpdatedCustomerSummary?.find(c => c.customerNo === this.baseFormData?.customerNo)
    if(!updateIconfirmCheckboxAsPerRedIcon?.isConfirmed || updateIconfirmCheckboxAsPerRedIcon?.showInfoIcon){
      this.mainForm.form.get("trustDetailsConfirmation").patchValue(false)
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
        this.mainForm.get("trustDetailsConfirmation").disable()

        // this.mainForm.get("trustDetailsConfirmation").disable()
        this.mainForm.get("trustDetailsConfirmation").patchValue(false)
        this.baseSvc.showValidationMessage = true;
        this.baseSvc.iconfirmCheckbox.next(invalidPages)
      }
      else{
        this.mainForm.updateDisable({"trustDetailsConfirmation":false})
      }
  }

  override onValueTyped(event: any): void {
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
      
    }
}
