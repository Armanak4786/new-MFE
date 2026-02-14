import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { Validators } from "@angular/forms";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-finance-lease",
  templateUrl: "./finance-lease.component.html",
  styleUrl: "./finance-lease.component.scss",
})
export class FinanceLeaseComponent extends BaseStandardQuoteClass {
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
  hidden: boolean = false;
  productCode : string;
  isTaxinclusive: boolean = false;
  private savedRetailPriceValue: any = null;

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
     this.productCode = sessionStorage.getItem('productCode');
    // if(this.baseFormData?.residualValue || this.baseFormData?.residualAmount)
    // {
    //   this.mainForm.form.get("pctResidualValue").patchValue(this.baseFormData?.residualValue)
    //   this.mainForm.form.get("residualValue").patchValue(this.baseFormData?.residualAmount)
    // }

    this.productCode = sessionStorage.getItem("productCode");
    if (this.productCode == "FL" || this.productCode == "OL") {
      this.hidden = true;
    } else {
      this.hidden = false;
    }

    // Initialize saved value from baseFormData if it exists
    if (this.baseFormData?.retailPriceValue) {
      this.savedRetailPriceValue = this.baseFormData.retailPriceValue;
    }

    this.updateRetailPriceVisibility();
    
    await this.updateValidation("onInit");
  }

  updateRetailPriceVisibility() {
    const condition =
      this.baseFormData?.conditionDDValue ?? this.baseFormData?.conditionDD;
    
    if (this.productCode === "FL" || this.productCode === "OL") {
      const retailPriceControl = this.mainForm?.form?.get("retailPriceValue");
      
      const isNew =
        condition === 781 ||
        condition === "New" ||
        condition?.value === 781 ||
        condition?.label === "New";
      if (isNew) { // New condition - SHOW field
        // First save current value if field is currently hidden but has a value
        if (retailPriceControl && !this.savedRetailPriceValue && retailPriceControl.value) {
          this.savedRetailPriceValue = retailPriceControl.value;
        }
        
        // Show the field
        this.mainForm?.updateHidden({ retailPriceValue: false });
        
        
       
        
      } else { // Used condition or other - HIDE field
        // Save current value before hiding (if it has a value)
        
        if (retailPriceControl && retailPriceControl.value !== null && retailPriceControl.value !== undefined && retailPriceControl.value !== '') {
          this.savedRetailPriceValue = retailPriceControl.value;
        }
        
        // Hide the field
        this.mainForm?.updateHidden({ retailPriceValue: true });
        
        // Clear the form control value only for display purposes (but keep saved value)
        if (retailPriceControl) {
          retailPriceControl.patchValue(null);
        }
      }
      
      this.cdr.detectChanges();
    }
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "leaseDetails",
    goBackRoute: "leaseDetails",
    cardType: "non-border",
    // cardBgColor: " ",
    cardBgColor: "--primary-lighter-color",
    fields: [
      {
        type: "amount",
        label: "Cash Price of Assets (GST Inclusive)",
        name: "cashPriceValue",
        resetOnHidden: false,

        className: "pb-0",
        cols: 12,
        maxLength: 12,
        inputType: "horizontal",
        labelClass: "col-9 mt-2",
        inputClass: "col-3",
        // validators: [
        //   Validators.max(9999999),
        //   Validators.min(20000),
        //   Validators.required,
        // ],
      },
      {
        type: "amount",
        label: "Recommended Retail Price",
        name: "retailPriceValue",
        resetOnHidden: false,

        className: "pb-0",
        cols: 12,
        maxLength: 12,
        inputType: "horizontal",
        labelClass: "col-9 mt-2",
        inputClass: "col-3",
        // validators: [Validators.max(999999999), Validators.min(0)],
         hidden: true,
      },
      {
        // type: "number",
        type: "percentage",
        label: "Residual Value",
        name: "pctResidualValue",
        className: "pb-0",
        cols: 7,

        inputType: "horizontal",
        default: 0,
        // suffix: "%",
        labelClass: "col-7 mt-2",
        inputClass: "col-5 ",

        disabled: false,
      },
      {
        type: "amount",
        label: "OR",
        name: "residualValue",
        className: "pb-0",
        cols: 5,

        inputType: "horizontal",
        labelClass: "col-4 px-0 mt-2 text-center",
        inputClass: "col-8 pl-1",

        default: 0,
        maxLength: 12,
      },
      // {
      //   type: "amount",
      //   label: "Residual Value",
      //   name: "residualValue",
      //   className: "pb-0",
      //   cols: 7,
      //   inputType: "horizontal",
      //   labelClass: "col-7 mt-2",
      //   inputClass: "col-5 ",
      //   default: 0,
      //   maxLength: 12,
      // },
      // {
      //   type: "number",
      //   label: "Or",
      //   name: "pctResidualValue",
      //   className: "pb-0",
      //   cols: 5,
      //   inputType: "horizontal",
      //   default: 0,
      //   suffix: "%",
      //   labelClass: "col-5 px-0 mt-2 text-center",
      //   inputClass: "col-7 pl-1",
      //   disabled: false,
      // },
    ],
  };

  onLeaseCheckboxChange(event: any) {
  this.baseFormData.isTaxinclusive = this.isTaxinclusive;
  
  this.baseSvc.setBaseDealerFormData({
    ...this.baseFormData,
    isTaxinclusive: this.isTaxinclusive
  });
  
  this.cdr.detectChanges();
}


  override onFormDataUpdate(res: any): void {
    super.onFormDataUpdate(res);

    const nextCondition =
      res?.conditionDDValue ?? res?.conditionDD;
    if (
      nextCondition !== undefined &&
      nextCondition !== null &&
      (nextCondition !== this.baseFormData?.conditionDDValue ||
        nextCondition !== this.baseFormData?.conditionDD)
    ) {
      this.baseFormData.conditionDDValue = nextCondition;
      this.baseFormData.conditionDD = nextCondition;
      this.updateRetailPriceVisibility();
    }

    // Update saved value if retail price comes in the update and we don't have one saved
    if (res?.retailPriceValue !== undefined && !this.savedRetailPriceValue) {
      this.savedRetailPriceValue = res.retailPriceValue;
    }
  }

  convertPctToAmount(name, val, type?: string) {
    let cashPriceValue = this.mainForm?.get("cashPriceValue").value || 0;
    let amount = (val / 100) * cashPriceValue;

    this.mainForm.get(name).patchValue(amount > 0 ? amount : null);
  }
getLeaseDetailsLabel(): string {
  if (this.productCode === 'OL') {
    return this.isTaxinclusive 
      ? 'lbl_leaseDetails_gst_inclusive' 
      : 'lbl_leaseDetails_gst_exclusive';
  }
  return 'Lease Details';
}
  convertAmountToPct(name, val, type?: string) {
    let cashPriceValue = this.mainForm?.get("cashPriceValue").value || 0;

    let pct = (val / cashPriceValue) * 100;

    this.mainForm.get(name).patchValue(pct > 0 ? pct : null);
  }

  override async onValueTyped(event) {
    // Update saved value when user types in retail price field (only when field is visible)
    if (event.name === "retailPriceValue" && this.baseFormData?.conditionDD === 781) {
      this.savedRetailPriceValue = event.value;
      // Also update baseFormData to persist the value
      this.baseFormData.retailPriceValue = event.value;
    }

    if (this.mainForm?.get("cashPriceValue").value > 0) {
      if (event.name == "pctResidualValue") {
        this.convertPctToAmount(
          "residualValue",
          this.mainForm.get("pctResidualValue").value
        );
      }
      if (event.name == "residualValue") {
        this.convertAmountToPct(
          "pctResidualValue",
          this.mainForm.get("residualValue").value
        );
      }
    }
     await this.updateValidation(event);
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "FinanceLeaseComponent";

  override async onFormReady(): Promise<void> {
    if (this.baseFormData?.residualValue || this.baseFormData?.residualAmount) {
      // this.mainForm.form.get("pctResidualValue").patchValue(this.baseFormData?.pctResidualValue)
      // this.mainForm.form.get("residualValue").patchValue(this.baseFormData?.residualValue)

      const pctVal = this.baseFormData?.pctResidualValue || 0;
      const resVal = this.baseFormData?.residualValue || 0;

      this.mainForm.form.get("pctResidualValue").patchValue(pctVal);
      this.mainForm.form.get("residualValue").patchValue(resVal);
    }

    // Initialize saved retail price value from baseFormData if it exists
    if (this.baseFormData?.retailPriceValue && !this.savedRetailPriceValue) {
      this.savedRetailPriceValue = this.baseFormData.retailPriceValue;
    }

    // Also check if the form control already has a value
    const currentRetailPrice = this.mainForm?.form?.get("retailPriceValue")?.value;
    if (currentRetailPrice && !this.savedRetailPriceValue) {
      this.savedRetailPriceValue = currentRetailPrice;
    }

    if (this.productCode == "OL") {

      // this.mainForm.updateValidators('cashPriceValue', [Validators.required]);
      // this.mainForm.updateProps('cashPriceValue', { required: true });

      this.mainForm.updateHidden({ pctResidualValue: true });
      this.mainForm.updateProps("cashPriceValue", {
        label: "Cash Price of Asset",
      });
      this.mainForm.updateProps("cashPriceValue", { labelClass: "col-5" });
      this.mainForm.updateProps("cashPriceValue", { inputClass: "col-4" });
      this.mainForm.updateProps("retailPriceValue", { labelClass: "col-5" });
      this.mainForm.updateProps("retailPriceValue", { inputClass: "col-4" });
      this.mainForm.updateProps("residualValue", { className: "pb-0 col-12" });
      this.mainForm.updateProps("residualValue", { labelClass: "col-5 mt-2" });
      this.mainForm.updateProps("residualValue", { inputClass: "col-4" });
      this.mainForm.updateProps("residualValue", { label : "Residual Value" });

      this.isTaxinclusive = this.baseFormData?.isTaxinclusive || false;
      this.updateRetailPriceVisibility();
    }
    await this.updateValidation("onInit");
    super.onFormReady();
    

    if (this.productCode == "FL") {
  //     this.mainForm.updateProps("cashPriceValue", {
  //   label: "Cash Price of Assets<br>(GST Inclusive)",
  //   labelClass: "col-6 mt-2",
  //   inputClass: "col-6",
    
  // });
    this.mainForm.updateProps("cashPriceValue", { labelClass: "col-6 mt-2", inputClass: "col-6" });
    this.mainForm.updateProps("retailPriceValue", { labelClass: "col-6 mt-2", inputClass: "col-6" });
    this.mainForm.updateProps("pctResidualValue", { labelClass: "col-6 mt-2", inputClass: "col-6" });
    this.mainForm.updateProps("residualValue", { labelClass: "col-4 mt-2", inputClass: "col-8 mt-1" });

    //Recommended Retail Price blank if Condition is 'USED'
    if (this.baseFormData?.conditionDD === 782) {
      this.mainForm.form.get("retailPriceValue")?.patchValue(null);
    }
  }
  }

  override async onBlurEvent(event): Promise<void> {
    // Update saved value when user leaves retail price field (only when field is visible)
    if (event.name === "retailPriceValue" && this.baseFormData?.conditionDD === 781) {
      const currentValue = this.mainForm?.form?.get("retailPriceValue")?.value;
      if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
        this.savedRetailPriceValue = currentValue;
        // Also update baseFormData to persist the value
        this.baseFormData.retailPriceValue = currentValue;
      }
    }

    if(event?.name == "cashPriceValue" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      // let APicashPriceValue = this.baseSvc.workflowIncreaseDecreaseValidation()?.find(item => item.cashPriceofAsset != undefined)?.cashPriceofAsset;
      let currentCashPriceValue = this.mainForm.get("cashPriceValue").value;
      if(currentCashPriceValue > this.baseFormData?.apicashPriceValue){
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Cash Price of Asset cannot be increased in Ready for Documentation state.",
        });
        // return;
      }
    }

    await this.updateValidation(event);
  }

  // override async onValueEvent(event): Promise<void> {
  //   await this.updateValidation(event);
  // }

  override async onValueEvent(event): Promise<void> {
    if (this.mainForm?.get("cashPriceValue").value > 0) {
      if (event.name === "pctResidualValue") {
        this.convertPctToAmount("residualValue", event.data.value);
      }
      if (event.name === "residualValue") {
        this.convertAmountToPct("pctResidualValue", event.data.value);
      }
    }

    // still run validation updates
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
