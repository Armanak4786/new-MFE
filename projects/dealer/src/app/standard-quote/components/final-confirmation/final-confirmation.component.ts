import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-final-confirmation",
  templateUrl: "./final-confirmation.component.html",
  styleUrl: "./final-confirmation.component.scss",
})
export class FinalConfirmationComponent implements OnInit {
  mainForm: any;
  formConfig: any;
  constructor(
    public router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {}

  borrowerName = "";

  ngOnInit(): void {
    if (this.config?.data?.data?.customerSummary?.length > 0) {
      // debugger;
      let borrowerList = this.config?.data?.data?.customerSummary.filter(
        (item) => item?.customerRole === 1
      );
      if (borrowerList?.[0]) {
        this.borrowerName = borrowerList[0]?.customerName;
      }
    }
  }

  redirectToDashBoard() {
    this.ref.close({
      btnType: "submit",
    });
  }

  pageCode: string = "FinalConfirmationComponent";
  modelName: string = "FinalConfirmationComponent";

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
