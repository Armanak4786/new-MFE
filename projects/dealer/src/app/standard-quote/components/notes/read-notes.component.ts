import { ChangeDetectorRef, Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-read-notes",
  template: `
    <p style='overflow-wrap: break-word;'>
      {{ note?.addNote }}
    </p>
  `,
})
export class ReadNotesComponent {
  note: any;
  mainForm: any;
  formConfig: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    JSON.stringify(config.data);
    this.note = config.data;
  }

  pageCode: string = "ReadNotesComponent";
  modelName: string = "ReadNotesComponent";

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
