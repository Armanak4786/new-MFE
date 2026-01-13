import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { Validators } from "@angular/forms";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { SoleTradeService } from "../../../services/sole-trade.service";

@Component({
  selector: "app-customer-reference",
  templateUrl: "./customer-reference.component.html",
})
export class SoleCustomerReferenceComponent extends BaseSoleTradeClass  {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: SoleTradeService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "businessDetails",
    goBackRoute: "businessDetails",
    cardType: "non-border",
    fields: [
      {
        type: "phone",
        label: "Your customer reference",
        name: "referenceNumber",
        cols: 2,
        inputType:"vertical"
      },
    ],
  };

  override async onSuccess(data: any) {}

  pageCode: string = "ContactDetailsComponent";
  modelName: string = "SoleCustomerReferenceComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
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
