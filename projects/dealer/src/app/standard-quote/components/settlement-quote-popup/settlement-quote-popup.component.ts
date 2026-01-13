import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "auro-ui";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-settlement-quote-popup",
  templateUrl: "./settlement-quote-popup.component.html",
  styleUrl: "./settlement-quote-popup.component.scss",
})
export class SettlementQuotePopupComponent {
  data: any;
  contractId: any;
  mainForm: any;
  formConfig: any;
  constructor(
    public ref: DynamicDialogRef,
    public router: Router,
    public svc: CommonService,
    public baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {}
  async ngOnInit() {
    await this.updateValidation("onInit");
  }
  close() {
    this.ref.close();
  }

  passDataToParent(proceed: string) {
    this.ref.close({ data: proceed });
  }

  pageCode: string = "SettlementQuoteDetailsComponent";
  modelName: string = "SettlementQuoteDetailsComponent";

  async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async onValueEvent(event): Promise<void> {
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
