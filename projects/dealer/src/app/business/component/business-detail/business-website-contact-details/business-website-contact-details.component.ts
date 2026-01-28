import { Component } from "@angular/core";
import { BaseBusinessClass } from "../../../base-business.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ValidationService } from "auro-ui";
import { BusinessService } from "../../../services/business";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-business-website-contact-details",

  templateUrl: "./business-website-contact-details.component.html",
  styleUrl: "./business-website-contact-details.component.scss",
})
export class BusinessWebsiteContactDetailsComponent extends BaseBusinessClass {

    override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
    fields: [
      {
        type: "text",
        name: "website",
        label: "Website",
        inputType: 'vertical',
        cols: 10,
        //validators: [validators.required, validators.maxLength(20)],
        className: " web pt-2 mt-2",
        labelClass: "mt-0 mb-0",
      },
    ],
  };
  
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
    public validationSvc : ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
    if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
    this.mainForm?.form?.disable();
    }
    else{ this.mainForm?.form?.enable();}

    if (this.mode == "edit") {
      this.mainForm
        .get("website")
        .patchValue(this.baseFormData?.business?.website);
    }
  await this.updateValidation("onInit");

  }

  pageCode: string = "BusinessContactDeatilComponent";
  modelName: string = "BusinessWebsiteContactDetailsComponent";

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

   override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);
    this.baseSvc.updateComponentStatus("Business Details", "BusinessWebsiteContactDetailsComponent", this.mainForm.form.valid)
  }
}
