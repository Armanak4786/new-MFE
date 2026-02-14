import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseFormClass, CommonService, GenericFormConfig } from "auro-ui";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-insurance-requirement",

  templateUrl: "./insurance-requirement.component.html",
  styleUrls: ["./insurance-requirement.component.scss"],
})
export class StandardInsuranceRequirementComponent extends BaseFormClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc);
  }

  override formConfig: GenericFormConfig = {
    headerTitle: "My Insurance Requirements",
    autoResponsive: true,
    api: "addOnAccessories",
    goBackRoute: "addOnAccessories",

    fields: [
      {
        type: "label-only",
        label: "Registration",
        name: "Registration",
        cols: 1,
      },
      {
        type: "text",
        label: "Amount",
        name: "amount",
        placeholder: "Enter Amount here",
        cols: 1,
      },

      {
        type: "text",
        label: "Months",
        name: "months",
        placeholder: "Enter Month here",
        cols: 1,
      },
      {
        type: "label-only",
        label: "Service Plan",
        name: "servicePlan",
        cols: 1,
      },
      {
        type: "text",
        label: "Amount",
        name: "amountForSer",
        placeholder: "Enter Amount here",
        cols: 1,
      },

      {
        type: "text",
        label: "Months",
        name: "monthforSer",
        placeholder: "Enter Month here",
        cols: 1,
      },

      {
        type: "select",
        name: "Other",
        options: [{ label: "Other", value: "Other" }],
        cols: 1,
      },

      {
        type: "text",
        label: "Amount",
        name: "amountForOther",
        placeholder: "Enter Amount here",
        cols: 1,
      },

      {
        type: "text",
        label: "Months",
        name: "monthForOther",
        placeholder: "Enter Month here",
        cols: 1,
      },

      {
        type: "button",
        label: "Save",
        name: "submit",
        submitType: "internal",
        cols: 1,
      },

      {
        type: "radio",
        label: "Some Title",
        name: "radio",
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
        cols: 4,
      },
    ],
  };

  pageCode: string = "AddOnAccessoriesComponent";
  modelName: string = "InsuranceRequirementComponent";

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

  async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
