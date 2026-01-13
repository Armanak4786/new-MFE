import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { CommonService, GenericFormConfig } from "auro-ui";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-originator-reference",
  templateUrl: "./originator-reference.component.html",
  styleUrl: "./originator-reference.component.scss",
})
export class OriginatorReferenceComponent extends BaseStandardQuoteClass {
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "assetSummary",
    goBackRoute: "",
    cardType: "non-border",
    fields: [
      {
        type: "text",
        label: "Originator Reference",
        name: "originatorReferencee",
        className: "pb-0 col-offset-3",
        //validators: [validators.required],
        //regexPattern: "[^a-zA-Z]*",
        maxLength: 20,
        cols: 6,
        inputType: "horizontal",
        labelClass: " mt-2 col text-right",
        inputClass: "col pr-0",
        nextLine: true,
      },
      {
        type: "button",
        label: "Save",
        name: "saveBtn",
        cols: 2,
        className: "col-offset-4 mt-5",
        submitType: "submit",
      },
      {
        type: "button",
        label: "Exit",
        name: "exitBtn",
        btnType: "border-btn",
        className: "mt-5",
        cols: 2,
        submitType: "internal",
        nextLine: true,
      },
    ],
  };
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private cd: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  override onButtonClick(event: any): void {
    this.ref.close({
      btnType: event.field?.name,
    });
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.mainForm
      .get("originatorReferencee")
      .patchValue(this.baseFormData.originatorReference);
    await this.updateValidation("onInit");
  }

  pageCode: string = "OriginatorReferenceComponent";
  modelName: string = "OriginatorReferenceComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override onFormEvent(event: any): void {
    super.onFormEvent(event);
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

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.cd.detectChanges();
    }
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: 'error',
        //   detail: 'I7',
        // });
      }
    }
  }
}
