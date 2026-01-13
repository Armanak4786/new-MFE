import { Component } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService, ValidationService } from "auro-ui";
import { BusinessService } from "../../../../business/services/business";
import { TrustService } from "../../../services/trust.service";

@Component({
  selector: "app-trust-customer-reference",
  templateUrl: "./trust-customer-reference.component.html",
  styleUrl: "./trust-customer-reference.component.scss",
})
export class TrustCustomerReferenceComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: TrustService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "non-border",
    fields: [
      {
        type: "phone",
        label: "Your customer reference",
        name: "trustReferenceNumber",
        cols: 2,
        inputType:'vertical',
      },
    ],
  };
   
  pageCode: string = "TrustContactDetailComponent";
  modelName: string = "TrustCustomerReferenceComponent";

  override async onFormReady(): Promise<void> {
    // await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    // await this.updateValidation(event);
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
      // var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
  }

  override async onSuccess(data: any) {}
}
