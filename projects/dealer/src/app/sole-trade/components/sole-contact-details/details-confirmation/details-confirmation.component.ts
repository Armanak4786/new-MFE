import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SoleTradeService } from "../../../services/sole-trade.service";

@Component({
  selector: "app-sole-trade-details-confirmation",
  templateUrl: "./details-confirmation.component.html",
})
export class SoleDetailsConfirmationComponent extends BaseSoleTradeClass  {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: SoleTradeService,
    public toasterSvc: ToasterService
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
        name: "soleTradeConfirmation",
        className: 'mt-3'
      },
    ],
  };

  override async onSuccess(data: any) {}

   override async onFormReady(): Promise<void> {
    super.onFormReady();
    let invalidPages = this.checkStepValidity()
    if(invalidPages.length > 0 && this.mainForm){
    this.mainForm.form.get("soleTradeConfirmation").patchValue(false)
    }

    let sessionUpdatedCustomerSummary = JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))

    if(sessionUpdatedCustomerSummary?.length > 0 || this.baseFormData?.updatedCustomerSummary){
    const updateIconfirmCheckboxAsPerRedIcon = sessionUpdatedCustomerSummary?.find(c => c.customerNo === this.baseFormData?.customerNo)
    if(!updateIconfirmCheckboxAsPerRedIcon?.isConfirmed || updateIconfirmCheckboxAsPerRedIcon?.showInfoIcon){
      this.mainForm.form.get("soleTradeConfirmation").patchValue(false)
    }
  }

    // Disable checkbox if workflow status requires it
    if (this.isDisabled()) {
      this.mainForm?.updateDisable({ "soleTradeConfirmation": true });
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
      this.mainForm.get("soleTradeConfirmation").disable()

      // this.mainForm.get("soleTradeConfirmation").disable()
      this.mainForm.get("soleTradeConfirmation").patchValue(false)
      this.baseSvc.showValidationMessage = true;
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
    else{
      this.mainForm.updateDisable({"soleTradeConfirmation":false})
    }
}

  override onValueTyped(event: any): void {
  // super.onValueTyped(event)
  let invalidPages = this.checkStepValidity()
  this.baseSvc.iconfirmCheckbox.next(invalidPages)
  }

  isDisabled(): boolean {
    const baseFormDataStatus = this.baseFormData?.AFworkflowStatus;
    const sessionStorageStatus = sessionStorage.getItem('workFlowStatus');
    return !(
      baseFormDataStatus === 'Quote' ||
      sessionStorageStatus === 'Open Quote'
    );
  }
}
