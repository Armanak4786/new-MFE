import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";
import { Validators } from "@angular/forms";
import { takeUntil } from "rxjs";

@Component({
  selector: "app-additional-funds",
  templateUrl: "./additional-funds.component.html",
  styleUrl: "./additional-funds.component.scss",
})
export class AdditionalFundsComponent extends BaseStandardQuoteClass {
  // showCard: boolean = false;
  formData: any;
  customFlowId: number;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override title: string = "Less Deposit";
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "non-border",
    cardBgColor: "--primary-lighter-color",
    fields: [
      {
        type: "amount",
        label: "Additional Fund",
        name: "additionalFund",
        className: "pb-0",
        cols: 12,
        inputType: "horizontal",
        labelClass: "col-6 mt-2",
        inputClass: "col-3",
        maxLength: 12,
        validators: [Validators.min(0)],
        errorMessage: "Value should be greater than 0",
      },

      // {
      //   type: "text",
      //   label: "Additional Fund Purpose",
      //   name: "additionalFundPurpose",
      //   styleType: "labelType",
      //   className: "pb-0",
      //   cols: 12,
      //   // inputType: "horizontal",
      //   labelClass: " py-0 col-9 mt-2",
      //   inputClass: " py-0 col-3",
      //   // disabled: true,
      //   maxLength: 12,
      // },

      {
        type: "textArea",
        label: "Additional Fund Purpose",
        name: "additionalfundPurpose",
        cols: 12,
        className: "py-0 mt-3",

        inputType: "vertical",
        // validators: [Validators.required],
        textAreaType: "border",
        nextLine: true,
        autoResize: true,
        errorMessage: "Please complete details",
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
        this.customFlowId = this.formData?.customFlowID || 0;
      });
  }

  // override onFormDataUpdate(res: any): void {
  //   if (res?.changedField?.productId) {
  //     if (res?.productId === 59) {
  //       this.showCard = true;
  //     } else {
  //       this.showCard = false;
  //     }
  //   }
  // }

  pageCode: string = "";
  modelName: string = "";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    super.onBlurEvent(event);
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    super.onValueEvent(event);
    await this.updateValidation(event);
  }

  override async onFormEvent(event) {
    super.onFormEvent(event);
  }

  override async onValueChanges(event: any) {
    super.onValueChanges(event);
    // this.customFlowId = this.formData?.customflowID
    const additionalFund = { customflowID: 0, amount: 0, reference: "" };
    const amount =
      event?.additionalFund?.amount ?? Number(event?.additionalFund) ?? 0;
    if (amount > 0) {
      this.mainForm?.updateValidators("additionalfundPurpose", [
        Validators.required,
      ]);
      additionalFund.amount =
        event.additionalFund?.amount || +event?.additionalFund || 0;
    } else {
      this.mainForm
        .get("additionalfundPurpose")
        .removeValidators(Validators.required);
      this.mainForm.clearInput("additionalFund");
      // this.mainForm.clearInput("additionalfundPurpose");
    }

    additionalFund.customflowID = this.customFlowId;

    additionalFund.reference = event?.additionalfundPurpose || "";

    if (this.formData?.financialAssetLease?.additionalFund) {
      this.formData.financialAssetLease.additionalFund = additionalFund;
    } else {
      this.baseSvc.setBaseDealerFormData({
        additionalFund: additionalFund,
      });
      this.mainForm.get("additionalFund").patchValue(additionalFund.amount);
    }
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

  // override async onStepChange(quotesDetails: any): Promise<void> {
  //   if (quotesDetails.type !== "tabNav") {
  //     var result: any = await this.updateValidation("onSubmit");
  //     if (!result?.status) {
  //       // this.toasterSvc.showToaster({
  //       //   severity: "error",
  //       //   detail: "I7",
  //       // });
  //     }
  //   }
  // }
}
