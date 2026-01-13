import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CloseDialogData, CommonService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-settlement-disclosure",
  templateUrl: "./settlement-disclosure.component.html",
  styleUrl: "./settlement-disclosure.component.scss",
})
export class SettlementDisclosureComponent extends BaseStandardQuoteClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "settlement",
    goBackRoute: "lessDeposite",
    fields: [
      {
        type: "checkbox",
        label: " ",
        name: "checkboxs",
        className: "pb-0",
        cols: 1,
      },
      {
        type: "label-only",
        className: "  text-center ",
        label:
          "A settlement amount of  NZD$5000 is available for this vehicle. As the vehicle was originally purchased from another dealer, the customer must consent to this settlement request.",
        name: "settlementDisclouser",
        cols: 11,
        typeOfLabel: "inline",
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    await this.updateValidation("onInit");
  }

  override onFormEvent(event: any): void {
    this.config.data = { [event?.name]: 5000 };
  }

  pageCode: string = "SettlementDisclosureComponent";
  modelName: string = "SettlementDisclosureComponent";

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
