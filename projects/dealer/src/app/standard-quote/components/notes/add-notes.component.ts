import { ChangeDetectorRef, Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-add-notes",
  template: `
    <div class="grid">
      <div class="col-12 p-fluid">
        <textarea
          rows="5"
          cols="20"
          pInputTextarea
          class="text-sm"
          [autoResize]="true"
          [(ngModel)]="noteText"
          (input)="update()"
        ></textarea>
        <label class="text-xs text-red-500">{{ errorMsg }}</label>
      </div>
    </div>
    <div class="flex w-full justify-content-between">
      <gen-button
        btnLabel="{{ 'Cancel' | translate }}"
        (onClick)="closeDialog('cancel')"
        [btnType]="'border-btn'"
      ></gen-button>
      <gen-button
        btnLabel="{{ 'Submit' | translate }}"
        (onClick)="closeDialog('submit')"
      ></gen-button>
    </div>
  `,
})
export class AddNotesComponent {
  noteText: any;
  errorMsg: string;
  formConfig: any;
  mainForm: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {}

  update() {
    if(this.noteText == "" || !this.noteText){
      this.errorMsg = "Note can not be empty";
      return;
    }
    if (this.noteText?.trimStart().trimEnd().length > 1000) {
      this.errorMsg = "The length of the note should no be greater than 1000";
    } else if (this.noteText?.trim().length == 0) {
      this.errorMsg = "Note can not be empty";
    } else {
      this.errorMsg = null;
    }
  }

  closeDialog(btnType: "submit" | "cancel") {
    // if (this.noteText && this.noteText.trim().length > 0) {
    //   this.config.data = this.noteText;
    //   this.errorMsg = null;
    // } else {
    //   this.errorMsg = 'Note can not be empty';
    // }
    this.update();

    if ((btnType == "submit" && !this.errorMsg) || btnType == "cancel") {
      this.ref.close({
        data: this.noteText,
        btnType: btnType,
      });
    }
  }

  pageCode: string = "AddNotesComponent";
  modelName: string = "AddNotesComponent";

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
