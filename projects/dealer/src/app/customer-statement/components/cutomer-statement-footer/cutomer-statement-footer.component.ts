import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "auro-ui";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-cutomer-statement-footer",
  templateUrl: "./cutomer-statement-footer.component.html",
  styleUrl: "./cutomer-statement-footer.component.scss",
})
export class CutomerStatementFooterComponent implements OnInit {
  formConfig: any;
  mainForm: any;
  constructor(
    private router: Router,
    private commonSvc: CommonService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  standarquote() {
    // this.router.navigateByUrl("/dealer/standard-quote");
  }

  cancel() {
    // todo
    this.commonSvc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel? ",
      "Cancel Quote",
      () => {
        this.commonSvc.router.navigateByUrl("/dealer/dashboard");
      }
    ); // Ensure the event is passed here
  }
  previous() {
 this.commonSvc?.ui?.showOkDialog(
      "Are you sure you want to go to Previous Page ",
      "Previous Page",
      () => {
        this.commonSvc.router.navigateByUrl("/dealer/dashboard");
      }
    ); // Ensure the event is passed here
}

  pageCode: string = "";
  modelName: string = "";

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
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "I7",
        });
      }
    }
  }
}
