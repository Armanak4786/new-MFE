import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from 'auro-ui';
import { StandardQuoteService } from "../../services/standard-quote.service";
import { Validators } from "@angular/forms";
import { ToasterService, ValidationService } from "auro-ui";
import configure  from "src/assets/configure.json";

@Component({
  selector: "app-excess-allowance",
  templateUrl: "./excess-allowance.component.html",
  styleUrl: "./excess-allowance.component.scss",
})
export class ExcessAllowanceComponent extends BaseStandardQuoteClass {
  activeIndex: number | undefined = -1;
  commissionSubsidyAmt: any;
  dealerOriginatorFeeAmount: any;
  hidden: boolean = true;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);

    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName,this.pageCode);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };
    console.log('Filtered Validations Excess Allowance:', filteredValidations);
  }

  optionsdata: any = [
    { label: "frequency", value: "FR" },
    { label: "frequency", value: "FR" },
  ];

  // override formConfig: GenericFormConfig = {
  //   cardType: "non-border",
  //   autoResponsive: true,
  //   api: "physicalAddress",
  //   // cardBgColor: '--background-color-secondary-light',
  //   goBackRoute: "physicalAddress",
  //   fields: [
    //   {
    //     type: "select",
    //     alignmentType: "vertical",
    //     label: "Usage Unit ",
    //     name: "usageUnit",
    //     // maxLength: 6,
    //     cols: 3,
    //     nextLine: false,
    //     labelClass: "",
    //     inputClass: "",
    //     list$: "LookUpServices/CustomData",
    //     apiRequest: {
    //       parameterValues: ["Usage Unit"],
    //       procedureName: configure.SPContractCfdLuExtract,
    //     },
    //     idKey: "value_text",
    //     idName: "value_text",
    //     className: "mb-3 ",
    //   },
    //   {
    //     type: "amount",
    //     inputType: "vertical",
    //     label: "Usage Allowance ",
    //     name: "usageAllowance",
    //     maxLength: 6,
    //     // grouping: true,
    //     cols: 3,
    //     nextLine: false,
    //     className: "  ",
    //     labelClass: "mb-3 mt-2",
    //   },
    //   {
    //     type: 'percentage',
    //     inputType: "vertical",
    //     label: "Excess Usage Allowance",
    //     name: "excessUsageAllowancePercentage",
    //     cols:3,
    //     className: "ml-4  pb-1",
    //     labelClass: "mb-3 mt-2",

    //   },
    //   // {
    //   //   type: "label-only",
    //   //   typeOfLabel: "inline",
    //   //   label: "%",
    //   //   name: "excessUsageAllowanceLabel",
    //   //   className: "mt-6 col-fixed mr-1",
    //   // },
    //   {
    //     type: "amount",
    //     inputType: "vertical",
    //     maxLength: 6,
    //     name: "excessUsageAllowance",
    //     cols:2,
    //     className: " mt-4 pt-3 ml-4 no-underline",
    //     nextLine: true,
    //     disabled: true,
    //     mode: Mode.view
    //     // mode: Mode.label
    //   },
    //   {
    //     type: "amount",
    //     inputType: "vertical",
    //     label: "Total Usage Allowance",
    //     name: "totalUsageAllowance",
    //     cols: 3,
    //     maxLength: 8,
    //     disabled: true,       
    //     // grouping: true,
    //     inputClass: "col-12 no-underline mt-2",
    //     className: " pr-4",
    //   },
    //   {
    //     type: "number",
    //     inputType: "vertical",
    //     label: "Excess Usage Charge",
    //     maxLength: 2,
    //     cols: 3,
    //     // grouping: true,
    //     name: "excessUsageCharge",
    //     className: " lg:col-offset-1 col-fixed pb-1 ml-0",
    //     inputClass: "mt-3",
    //   },
    //   {
    //     type: "label-only",
    //     typeOfLabel: "inline",
    //     label: "Cents",
    //     name: "excessUsageChargesCents",
    //     className: "mt-5 col-fixed w-3rem",
    //     nextLine: true,
    //   },
    //   {
    //     type: "label-only",
    //     typeOfLabel: "inline",
    //     label: "Rebate Allowance ",
    //     cols: 12,
    //     name: "rebateAllowance",
    //     className: "mt-3 font-bold text-base mb-2 text-color",
    //     nextLine: true,
    //   },
    //   {
    //     type: "percentage",
    //     inputType: "vertical",
    //     label: "Total Rebate Allowance",
    //     name: "totalRebateAllowancePercent",
    //     cols: 3,
    //     className: " pb-1",
    //   },
    //   // {
    //   //   type: "label-only",
    //   //   typeOfLabel: "inline",
    //   //   label: "%",
    //   //   name: "rebatePercent",
    //   //   className: "mt-4 col-fixed w-2rem mr-1",
    //   // },
    //   {
    //     type: "amount",
    //     inputType: "vertical",
    //     name: "totalRebateAllowance",
    //     maxLength: 6,
    //     cols: 3,
    //     className: "ml-2 mt-3 pt-2 col-fixed no-underline",
    //     nextLine: false,
    //     disabled: true,
    //     mode:Mode.view
    //     // mode:Mode.label
    //   },

    //   {
    //     type: "number",
    //     inputType: "vertical",
    //     label: "Rebate Amount",
    //     name: "rebateAmount",
    //     // grouping: true,
    //     maxLength: 6,
    //     cols: 2,
    //     //prefix: "¢",
    //     className: " lg:col-offset-1 mb-0  col-fixed no-underline",
    //     // inputClass: "mt-2",
    //     // labelClass:"mb-0",
    //     disabled: true,
    //     mode:Mode.view
    //   },
    //   {
    //     type: "label-only",
    //     typeOfLabel: "inline",
    //     label: "Cents",
    //     name: "rebateAmountCents",
    //     className: "mt-4 col-fixed w-3rem",
        
    //     nextLine: true,
    //   },
    // ],
  // };

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "physicalAddress",
    // cardBgColor: '--background-color-secondary-light',
    goBackRoute: "physicalAddress",
    fields: []
    };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

  }
  override onFormDataUpdate(res: any): void {
    // if (res?.changedField?.productId) {
    //   if (res?.productId === 15) {
    //     this.hidden = false;
    //   } else {
    //     this.hidden = true;
    //   }
    // }
  }

  activeIndexChange(index: number) {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }

  override onFormEvent(event: any): void {
    if (
      event.name == "usageAllowance" ||
      event.name == "excessUsageAllowance"
    ) {
      this.mainForm
        .get("totalUsageAllowance")
        .patchValue(
          Number(this.mainForm.get("usageAllowance").value || 0) +
            Number(this.mainForm.get("excessUsageAllowance").value || 0)
        );
    }

    if (event.name == "usageAllowance") {
      this.convertPctToAmounts(
        "excessUsageAllowance",
        this.mainForm.get("excessUsageAllowancePercentage").value,
        event.value
      );
      
    }
     if (event.name == "excessUsageAllowancePercentage") {
      this.convertPctToAmounts(
        "excessUsageAllowance",
        event.value,
        this.mainForm.get("usageAllowance").value
      );
    }

      if (
      event.name == "totalRebateAllowancePercent" ||
      event.name == "excessUsageCharge"
    ) {
      let cents =
        this.mainForm.get("excessUsageCharge").value *
        (this.mainForm.get("totalRebateAllowancePercent").value / 100);
      this.mainForm
        .get("rebateAmount")
        .patchValue(cents);
    }

      if (
      event.name == "totalRebateAllowancePercent" ||
      event.name == "usageAllowance"
    ) {
      let amount =
        this.mainForm.get("usageAllowance").value *
        (this.mainForm.get("totalRebateAllowancePercent").value / 100);
      this.mainForm
        .get("totalRebateAllowance")
        .patchValue(amount);
    }
    super.onFormEvent(event);
  }

  override onValueTyped(event: any): void {
      this.mainForm.form.markAllAsTouched();
      this.updateValidation(event);
      
    // if (event.name == "excessUsageAllowance") {
    //   this.convertAmountToPct(
    //     "excessUsageAllowancePercentage",
    //     event.data.value,
    //     this.mainForm.get("usageAllowance").value
    //   );
    // }
    // if (event.name == "excessUsageAllowancePercentage") {
    //   this.convertPctToAmounts(
    //     "excessUsageAllowance",
    //     event.data.value,
    //     this.mainForm.get("usageAllowance").value
    //   );
    // }

    // if (event.name == "totalRebateAllowance") {
    //   this.convertAmountToPct(
    //     "totalRebateAllowancePercent",
    //     event.data.value,
    //     this.mainForm.get("excessUsageAllowance").value
    //   );
    // }
    // if (event.name == "totalRebateAllowancePercent") {
    //   this.convertPctToAmounts(
    //     "totalRebateAllowance",
    //     event.data.value,
    //     this.mainForm.get("excessUsageAllowance").value
    //   );
    // }
  }

  convertPctToAmounts(name, val?: number, totalVal?: number) {
    let amount = 0;
    if (totalVal > 0 && val > 0) {
      amount = Math.round((val / 100) * totalVal);
      if (this.mainForm.get(name).value !== amount) {
        this.mainForm.get(name).patchValue(amount);
      }
    }
    else{
      this.mainForm.get(name).patchValue(null);
    }
    this.updateValidation(name);
  }

  // convertAmountToPct(name, val?: number, totalVal?: number) {
  //   if (totalVal > 0 && val > 0) {
  //     let pct = (val / totalVal) * 100;
  //     if (this.mainForm.get(name).value !== pct) {
  //       this.mainForm.get(name).patchValue(pct);
  //     }
  //   }
  // }

  pageCode: string = "ExcessAllowanceComponent";
  modelName: string = "ExcessAllowanceComponent";

  override async onFormReady(): Promise<void> {
   this.mainForm.form.markAllAsTouched();
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
        this.mainForm.form.markAllAsTouched();

    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
        // this.mainForm.form.markAllAsTouched();
// this.mainForm.form.markAllAsTouched()
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
