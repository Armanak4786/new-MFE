import { ChangeDetectorRef, Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-edit-notes",
  template: `
    <div class="grid">
      <div class="col-12 p-fluid">
        <textarea
          rows="5"
          pInputTextarea
          class="text-sm"
          [(ngModel)]="note"
        ></textarea>
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
export class EditNotesComponent {
  note: any;
  errorMsg: string;
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

    this.note = config.data.addNote;
  }

  update() {
    if (this.note.trimStart().trimEnd().length > 500) {
      this.errorMsg = "The length of the note should no be greater than 500";
    } else if (this.note.trim == 0) {
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
        data: {
          note: this.note,
          noteId: this.config?.data?.noteId,
          index: this.config?.data?.index,
        },
        btnType: btnType,
      });
    }
  }

  pageCode: string = "EditNotesComponent";
  modelName: string = "EditNotesComponent";

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
