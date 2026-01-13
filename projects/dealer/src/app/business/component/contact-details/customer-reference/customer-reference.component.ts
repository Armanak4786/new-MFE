import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseBusinessClass } from "../../../base-business.class";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { BusinessService } from "../../../services/business";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-customer-reference",
  templateUrl: "./customer-reference.component.html",
})
export class CustomerReferenceComponent extends BaseBusinessClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: BusinessService,
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
        inputType:'vertical',
        cols: 2,
      },
    ],
  };

  override async onSuccess(data: any) {}

  pageCode: string = "ContactDetailsComponent";
  modelName: string = "CustomerReferenceComponent";

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
