import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";

import { BaseStandardQuoteClass } from "../../../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../../services/standard-quote.service";
import { Subject, takeUntil } from "rxjs";
import {
  BaseFormComponent,
  CommonService,
  GenericFormConfig,
  ValidationService,
} from "auro-ui";
import { DashboardService } from "../../../../../dashboard/services/dashboard.service";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-insurance-requirement",
  templateUrl: "./insurance-requirement.component.html",
  styleUrl: "./insurance-requirement.component.scss",
})
export class InsuranceRequirementComponent extends BaseStandardQuoteClass {
  // destroy$ = new Subject<void>();
  // stepperSubcription: any;
  allowedInsurance: any = [];
  private originalFieldConfigs: { [key: string]: any } = {};

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public validationSvc: ValidationService,
    private cd: ChangeDetectorRef,
    private dashboardSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
  }
  maxTermValidator = (term: number) => {
    return (control: any) => {
      if (
        control.value === null ||
        control.value === undefined ||
        control.value === ""
      ) {
        return null; // let 'required' handle emptiness
      }
      const value = Number(control.value);
      return value > term
        ? { maxTerm: { requiredTerm: term, actual: value } }
        : null;
    };
  };

  pageCode: string = "AddOnAccessoriesComponent";
  modelName: string = "InsuranceRequirementComponent";

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "insuranceRequirement",
    goBackRoute: "insuranceRequirement",
    fields: [
      {
        type: "label-only",
        typeOfLabel: "inline",
        label:
          "Do you want cover for vehicle breakdown outside of manufacturer's warranty?",
        name: "vehicleBreakdown",
        cols: 12,
        className: "my-auto black-label",
        sectionName: "extendedWarrantySection",
      },
      {
        type: "radio",
        name: "extended",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        className: "mt-2",
       // default: "no",
       // validators: [Validators.required],
        cols: 2,
        sectionName: "extendedWarrantySection",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Extended Warranty",
        name: "extendedWarranty",
        cols: 5,
        className: "pt-2 mt-2",
        sectionName: "extendedWarrantySection",
      },
      {
        type: "number",
        label: "Months",
        hidden: true,
        resetOnHidden: true,
        name: "extendedMonths",
      //   validators: [
      //    Validators.required,
      //     
      //    Validators.min(1) 
      //  ],
        default: 0,
        maxLength: 3,
        // errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-5 mt-2",
        inputClass: "col-7",
        sectionName: "extendedWarrantySection",
        toolTip:
          "How much additional cover do you want outside the manufacturer's warranty?",
        toolTipPosition: "top",
      },
      {
        type: "amount",
        label: "Amount",
        hidden: true,
        resetOnHidden: true,
        alwaysPos: true,
        name: "extendedAmount",
        default: 0,
      //  validators: [
      //   Validators.required,
      //   Validators.pattern("^(?!0(\\.0{1,2})?$)[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{1,2})?$"),
      //   Validators.min(1), 
      //   Validators.maxLength(6),
      // ],
        maxLength: 6,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        sectionName: "extendedWarrantySection",
      },
      {
        type: "text",
        label: "Provider",
        hidden: true,
        resetOnHidden: true,
        cols: 2,
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        name: "extendedProvider",
        sectionName: "extendedWarrantySection",
        // maxLength:50,
        // errorMessage: "More than 50 chars.",

        // options: [{ label: 'Provider Name', value: 'Provider Name' }],
      },
      {
        type: "text",
        // styleType: "labelType",
        hidden: true,
        alwaysPos: true,
        name: "extendedWarrantyChangeAction",
        className: "my-auto text-right surface-section",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label:
          "Do you want cover for mechanical breakdown which may cover the repair/replacement of mechanical parts that have failed?",
        name: "mechanicalBreakdown",
        cols: 12,
        className: "my-auto black-label",
        sectionName: "mechanicalBreakdownInsuranceSection",
      },
      {
        type: "radio",
        name: "mechanicalBreakdownInsurance",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        //: [Validators.required],
        //default: "no",
        className: "mt-2",
        cols: 2,
        sectionName: "mechanicalBreakdownInsuranceSection",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Mechanical Breakdown Insurance",
        name: "mechanicalBreakdownInsuranceLabel",
        cols: 5,
        className: "pt-2 mt-2",
        sectionName: "mechanicalBreakdownInsuranceSection",
      },
      {
        type: "number",
        label: "Months",
        hidden: true,
        resetOnHidden: true,
        name: "mechanicalBreakdownInsuranceMonths",
       // validators: [Validators.pattern("^[0-9]{1,3}$"), Validators.required],
        default: 0,
        maxLength: 3,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-5 mt-2",
        inputClass: "col-7",
        sectionName: "mechanicalBreakdownInsuranceSection",
        toolTip: "How long do you want the cover in place for?",
        toolTipPosition: "top",
      },
      {
        type: "amount",
        label: "Amount",
        hidden: true,
        resetOnHidden: true,
        alwaysPos: true,
        name: "mechanicalBreakdownInsuranceAmount",
        default: 0,
      //  validators: [
      //   Validators.required,
      //   Validators.pattern("^(?!0(\\.0{1,2})?$)[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{1,2})?$"),
      //   Validators.min(1), 
      //   Validators.maxLength(6),
      // ],
        maxLength: 6,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        sectionName: "mechanicalBreakdownInsuranceSection",
      },
      {
        type: "text",
        label: "Provider",
        hidden: true,
        resetOnHidden: true,
        cols: 2,
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        name: "mechanicalBreakdownInsuranceProvider",
        sectionName: "mechanicalBreakdownInsuranceSection",
        // options: [{ label: 'Provider Name', value: 'Provider Name' }],
      },
      {
        type: "text",
        // styleType: "labelType",
        hidden: true,
        alwaysPos: true,
        name: "mechanicalBreakdownChangeAction",
        className: "my-auto text-right surface-section",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label:
          "Do you want cover for repayment for any shortfall between a motor vehicle insurance payment and the outstanding balance of your UDC Loan the event the vehicle is written off or stolen?",
        name: "repayment",
        cols: 12,
        className: "my-auto black-label",
        sectionName: "guaranteedAssetProtectionSection",
      },
      {
        type: "radio",
        name: "guaranteedAssetProtection",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        // default: "no",
        cols: 2,
        //validators: [Validators.required],
        className: "mt-2",
        sectionName: "guaranteedAssetProtectionSection",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Guaranteed Asset Protection",
        name: "guaranteedAssetProtectionLabel",
        cols: 5,
        className: "pt-2 mt-2",
        sectionName: "guaranteedAssetProtectionSection",
      },
      {
        type: "label-only",
        label: "",
        typeOfLabel: "inline",
        hidden: true,
        // resetOnHidden: true,
        name: "guaranteedAssetProtectionMonths",
        // inputType: "horizontal",
        // validators: [Validators.pattern('^[0-9]{1,3}$')],
        // maxLength: 3,
        // className:'',
        // errorMessage: "Maximum length should be 3",
        // labelClass: "col-5 mt-2",
        // inputClass: "col-7",
        sectionName: "guaranteedAssetProtectionSection",
      },
      {
        type: "amount",
        label: "Amount",
        hidden: true,
        resetOnHidden: true,
        alwaysPos: true,
        name: "guaranteedAssetProtectionAmount",
        default: 0,
      //  validators: [
      //   Validators.required,
      //   Validators.pattern("^(?!0(\\.0{1,2})?$)[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{1,2})?$"),
      //   Validators.min(1), 
      //   Validators.maxLength(6),
      // ],
        maxLength: 6,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        className: "float-right",
        sectionName: "guaranteedAssetProtectionSection",
        toolTip: "Cover is for the length of time the loan remains active.",
        toolTipPosition: "top",
      },
      {
        type: "text",
        label: "Provider",
        hidden: true,
        resetOnHidden: true,
        cols: 2,
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        name: "guaranteedAssetProtectionProvider",
        sectionName: "guaranteedAssetProtectionSection",
      },
      {
        type: "text",
        // styleType: "labelType",
        hidden: true,
        alwaysPos: true,
        name: "guaranteedAssetChangeAction",
        className: "my-auto text-right surface-section",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Do you want cover for vehicle damage or theft?",
        name: "vehicleDamage",
        cols: 12,
        className: "my-auto black-label",
        sectionName: "motorVehicleInsuranceSection",
      },
      {
        type: "radio",
        name: "motorVehicalInsurance",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        // default: "no",
        cols: 2,
        className: "mt-2",
        //validators: [Validators.required],
        sectionName: "motorVehicleInsuranceSection",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Motor Vehicle Insurance",
        name: "motorVehicalInsuranceLabel",
        cols: 5,
        className: "pt-2 mt-2",
        sectionName: "motorVehicleInsuranceSection",
      },
      {
        type: "number",
        label: "Months",
        hidden: true,
        name: "motorVehicalInsuranceMonths",
        // validators: [
        //   Validators.required,
        //   Validators.max(12),
        //   Validators.min(0),
        // ],
        default: 0,
        max: 12,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        resetOnHidden: true,
        labelClass: "col-5 mt-2",
        inputClass: "col-7",
        sectionName: "motorVehicleInsuranceSection",
        toolTip:
          "How long do you want the cover in place for? (Note: The premium can be financed for the first year of cover only).",
        toolTipPosition: "top",
      },
      {
        type: "amount",
        label: "Amount",
        hidden: true,
        resetOnHidden: true,
        alwaysPos: true,
        name: "motorVehicalInsuranceAmount",
        default: 0,
      //   validators: [
      //   Validators.required,
      //   Validators.pattern("^(?!0(\\.0{1,2})?$)[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{1,2})?$"),
      //   Validators.min(1), 
      //   Validators.maxLength(6),
      // ],
        maxLength: 6,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        sectionName: "motorVehicleInsuranceSection",
      },
      {
        type: "text",
        label: "Provider",
        hidden: true,
        resetOnHidden: true,
        cols: 2,
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        name: "motorVehicalInsuranceProvider",
        sectionName: "motorVehicleInsuranceSection",
        // options: [{ label: 'Provider Name', value: 'Provider Name' }],
      },
      {
        type: "text",
        // styleType: "labelType",
        hidden: true,
        alwaysPos: true,
        name: "motorVehicalInsuranceChangeAction",
        className: "my-auto text-right surface-section",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label:
          "Do you want cover for loan repayment protection in the event of loss of employment or disability or death?",
        name: "repaymentProtection",
        cols: 12,
        className: "my-auto black-label",
        sectionName: "contractInsuranceSection",
      },
      {
        type: "radio",
        name: "contract",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        // default: "no",
        cols: 2,
        className: "mt-2",
        //validators: [Validators.required],
        sectionName: "contractInsuranceSection",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label:
          "Credit Contract Insurance/Payment Protection Insurance (Repayment protection cover solely in connection with this loan agreement)",
        name: "contractLabel",
        cols: 5,
        className: "pt-2 mt-2",
        sectionName: "contractInsuranceSection",
      },
      {
        type: "number",
        label: "Months",
        hidden: true,
        resetOnHidden: true,
        name: "contractMonths",
       // validators: [Validators.pattern("^[0-9]{1,3}$"), Validators.required],
        default: "0",
        maxLength: 3,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-5 mt-2",
        inputClass: "col-7",
        sectionName: "contractInsuranceSection",
        toolTip: "How long do you want the cover in place for ?",
        toolTipPosition: "top",
      },
      {
        type: "amount",
        label: "Amount",
        hidden: true,
        resetOnHidden: true,
        alwaysPos: true,
        name: "contractAmount",
        default: 0,
      //  validators: [
      //   Validators.required,
      //   Validators.pattern("^(?!0(\\.0{1,2})?$)[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{1,2})?$"),
      //   Validators.min(1), 
      //   Validators.maxLength(6),
      // ],
        maxLength: 6,
        errorMessage: "This Field is required",
        inputType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        sectionName: "contractInsuranceSection",
      },

      {
        type: "select",
        label: "Provider",
        hidden: true,
        resetOnHidden: true,
        cols: 2,
        alignmentType: "horizontal",
        labelClass: "col-4 mt-2",
        inputClass: "col-8",
        name: "contractProvider",
       // validators: [Validators.required],
        options: [],
        //[{ label: 'Provider Name', value: 'Provider Name' }],
        sectionName: "contractInsuranceSection",
        nextLine: true,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "",
        name: "contractLabel1",
        // cols: 7,
        sectionName: "contractInsuranceSection",
      },
      {
        type: "textArea",
        label: "Reason",
        hidden: true,
        resetOnHidden: true,
        name: "reason",
        cols: 5,
        textAreaRows: 2,
        textAreaType: "border",
        className: "",
        inputClass: "ml-1 mr-2",
        inputType: "vertical",
        // labelClass:'col-5',
        // validators: [ Validators.required],
        errorMessage: "Please complete details.",
        sectionName: "contractInsuranceSection",
      },
      {
        type: "amount",
        styleType: "labelType",
        disabled: true,
        alwaysPos: true,
        hidden: true,
        name: "subTotalInsuranceRequirementValueLabel",
        className: "my-auto text-right surface-section",
      },
      {
        type: "text",
        // styleType: "labelType",
        hidden: true,
        alwaysPos: true,
        name: "contractInsuranceChangeAction",
        className: "my-auto text-right surface-section",
      },
    ],
    sections: [
      {
        sectionName: "extendedWarrantySection",
        cols: 12,
        sectionClass: "border-1 border-100 border-round bg-gray-100",
      },
      {
        sectionName: "mechanicalBreakdownInsuranceSection",
        cols: 12,
        sectionClass: "border-2 border-100 border-round surface-100",
      },
      {
        sectionName: "guaranteedAssetProtectionSection",
        cols: 12,
        sectionClass: "border-2 border-100 border-round surface-100",
      },
      {
        sectionName: "motorVehicleInsuranceSection",
        cols: 12,
        sectionClass: "border-1 border-100 border-round surface-100",
      },
      {
        sectionName: "contractInsuranceSection",
        cols: 12,
        sectionClass: "border-1 border-100 border-round surface-100",
      },
    ],
  };

  // @ViewChild("insuranseReqForm") insuranseReqForm!: BaseFormComponent;
  applyMaxTermValidators() {
    const term = Number(this.baseFormData?.term || 0);
    const monthsFields = [
      "extendedMonths",
      "mechanicalBreakdownInsuranceMonths",
      "guaranteedAssetProtectionMonths",
      "motorVehicalInsuranceMonths",
      "contractMonths",
    ];

    monthsFields.forEach((field) => {
      const control = this.mainForm.get(field);
      const fieldConfig = this.formConfig.fields.find((f) => f.name === field);
      if (control && fieldConfig) {
        let errorMsg = "";
        if (control.hasError("pattern")) {
          errorMsg = "Maximum length should be 3 digits.";
        } else if (control.hasError("maxTerm")) {
          errorMsg = `Value must be less than or equal to loan term (${term}).`;
        }
        this.mainForm.updateProps(field, { errorMessage: errorMsg });
      }
    });
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.baseSvc.onProductProgramChange?.subscribe((resetData) => {
      this.forceResetInsuranceForm(resetData);
    });
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.baseSvc.shouldResetInsurance) {
          //console.log('Forcing reset of insurance values');
          this.forceResetInsuranceForm();
          this.baseSvc.shouldResetInsurance = false; // Reset the flag
          return; // Don't proceed with normal data setting
        }
        this.baseFormData = res;
        //this.applyMonthsFieldValidators();
       // this.applyMaxTermValidators();
      });

    this.baseSvc.accessoriesFormData.subscribe((data) => {
      if (data) {
         if (this.allowedInsurance && this.allowedInsurance.length > 0) {
        Object.values(this.mainForm.form.controls).forEach((control: any) => {
          // control.markAsTouched();
        });
        
       this.baseSvc.formStatusArr.push(this.mainForm.form.status);
      } 
        else {
        this.baseSvc.formStatusArr.push('VALID');
      }
    }
    });
    this.formConfig.fields.forEach((f) => {
      this.originalFieldConfigs[f.name] = { ...f };
    });
  }
  override ngOnDestroy(): void {
    if (this.mainForm?.form) {
      this.mainForm.form.reset();
      Object.keys(this.mainForm.form.controls).forEach((key) => {
        const control = this.mainForm.form.get(key);
        if (control) {
          control.setErrors(null);
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
    }

    this.baseSvc.shouldResetInsurance = false;

    super.ngOnDestroy();
  }

  override ngAfterViewInit(): void {
    // super.ngAfterViewInit();
    if (this.baseSvc.accessMode == "view") {
      this.mainForm.form.disable();
    }
  }

  mapData() {
    this.setTotal(this.baseFormData);
    // this.cd.detectChanges();
  }
  private forceResetInsuranceForm(resetData?: any): void {
    const resetValues = resetData || {
      extended: null,
      extendedMonths: null,
      extendedAmount: 0,
      extendedProvider: null,
      mechanicalBreakdownInsurance: null,
      mechanicalBreakdownInsuranceMonths: null,
      mechanicalBreakdownInsuranceAmount: 0,
      mechanicalBreakdownInsuranceProvider: null,
      guaranteedAssetProtection: null,
      guaranteedAssetProtectionMonths: null,
      guaranteedAssetProtectionAmount: 0,
      guaranteedAssetProtectionProvider: null,
      motorVehicalInsurance: null,
      motorVehicalInsuranceMonths: null,
      motorVehicalInsuranceAmount: 0,
      motorVehicalInsuranceProvider: null,
      contract: null,
      contractMonths: null,
      contractAmount: 0,
      contractProvider: null,
      reason: null,
    };

    this.mainForm?.form?.patchValue(resetValues, { emitEvent: false });

    this.setTotal(resetValues);

    this.baseFormData = {
      ...this.baseFormData,
      ...resetValues,
      subTotalInsuranceRequirementValue: 0,
    };

    this.previousAmountValues = {};

    this.mainForm?.form?.markAsPristine();
    this.mainForm?.form?.markAsUntouched();

    this.cd.detectChanges();
  }
  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
    if (this.baseSvc.shouldResetInsurance) {
       this.forceResetInsuranceForm();
      this.baseSvc.shouldResetInsurance = false;
      return;
    }
    //  console.log(this.baseFormData)
    if (this.baseFormData) {
      //this.applyMonthsFieldValidators();
      //this.applyMaxTermValidators();
      this.allowedInsurance = this.getDealerInsurance()?.matchedInsurance ?? [];
      const productMap = {
        extendedWarrantySection: "Extended Warranty",
        mechanicalBreakdownInsuranceSection: "Mechanical Breakdown",
        guaranteedAssetProtectionSection: "Guaranteed Asset Protection",
        motorVehicleInsuranceSection: "Motor Vehicle",
        contractInsuranceSection: "Consumer Credit",
      };

      this.formConfig.sections.forEach((section, index) => {
        const product = productMap[section.sectionName];
        const isAllowed = this.allowedInsurance.includes(product);

        if (this.shouldHideInsuranceSections()) {
          section.sectionClass = "border-1 border-100 border-round";
        }

        if (!isAllowed) {
          section.sectionClass += " hidden";
        }
      });

      const hiddenFields = {};

      this.formConfig.fields.forEach((field: any) => {
        const sectionName = field?.sectionName;

        if (sectionName && productMap[sectionName]) {
          const product = productMap[sectionName];
          const isAllowed = this.allowedInsurance.includes(product);
          hiddenFields[field?.name] = !isAllowed;
        } else {
          hiddenFields[field?.name] = false;
        }
      });

      this.mainForm.updateHidden(hiddenFields);

      if (this.shouldHideInsuranceSections()) {
        // this.formConfig.sections.forEach((obj, index) => {
        //   if (index !== 4) {
        //     obj.sectionClass = 'border-1 border-100 border-round';
        //   }
        // });

        this.mainForm.form.patchValue({
          extended: "yes",
          mechanicalBreakdownInsurance: "yes",
          guaranteedAssetProtection: "yes",
          motorVehicalInsurance: "yes",
          contract: "null",
        });
        this.mainForm.updateHidden({
          vehicleBreakdown: true,
          extended: true,
          mechanicalBreakdown: true,
          mechanicalBreakdownInsurance: true,
          repayment: true,
          guaranteedAssetProtection: true,
          motorVehicalInsurance: true,
          vehicleDamage: true,
        });
      }
      // console.log("first",this.mainForm.form)
      Object.keys(this.mainForm.form.controls).forEach((key) => {
        if (key.toLowerCase().includes("months")) {
          const control = this.mainForm.get(key);
          control?.setErrors(null);
          control?.markAsUntouched();
        }
      });
      this.mainForm.form.markAsUntouched();
      this.mainForm.updateProps("contractProvider", {
        options: this.getDealerInsurance().dealerInsuranceProvider,
      });
      this.mapData();
      // console.log("second",this.mainForm.form)
    }

    // this.insuranseReqForm.form.patchValue(this.baseFormData)
  }

  override onFormEvent(event: any): void {
    super.onFormEvent(event);
   if (event.name == "extended") {
  if (event.value == "yes") {
    this.mainForm.updateHidden({
      extendedMonths: false,
      extendedAmount: false,
      extendedProvider: false,
    });
    this.mainForm.form.get("extendedMonths")?.setValidators([
      Validators.required,
      Validators.min(1),
    ]);

    // ✅ amount > 0 and < 100000
    this.mainForm.form.get("extendedAmount")?.setValidators([
      Validators.required,
      Validators.pattern("^(?!0+(\\.0{1,2})?$)(\\d{1,5}(\\.\\d{1,2})?|100000)$"),
      Validators.min(1),
      Validators.max(99999.99), // numerical safety check
    ]);

    this.mainForm.form.get("extendedAmount")?.updateValueAndValidity();
    this.mainForm.form.get("extendedMonths")?.updateValueAndValidity();

    this.mainForm.form.patchValue({
      extendedWarrantyChangeAction: "",
    });
  } else if (
    event.value == "no" &&
    this.baseFormData?.contractId &&
    (this.baseFormData?.extendedMonths > 0 || this.baseFormData?.extendedAmount > 0)
  ) {
    this.mainForm.form.get("extendedMonths")?.clearValidators();
    this.mainForm.form.get("extendedAmount")?.clearValidators();

    const currentData = this.baseFormData || {};
    this.mainForm.updateHidden({
      extendedMonths: true,
      extendedAmount: true,
      extendedProvider: true,
    });
    this.mainForm.form.patchValue({
      extendedMonths: null,
      extendedAmount: currentData.extendedAmount || 0,
      extendedProvider: null,
      extendedWarrantyChangeAction: "Delete",
    });
  } else {
    // for no / null -> remove all validators
    this.mainForm.form.get("extendedMonths")?.clearValidators();
    this.mainForm.form.get("extendedAmount")?.clearValidators();

    if (event.value == "no") {
      this.mainForm.updateHidden({
        extendedMonths: true,
        extendedAmount: true,
        extendedProvider: true,
      });
      this.mainForm.form.patchValue({
        extendedMonths: null,
        extendedAmount: 0,
        extendedProvider: null,
        extendedWarrantyChangeAction: "",
      });
    }

    if(event.value == null || event.value == ""){
          this.mainForm.updateHidden({
          extendedMonths: true,
          extendedAmount: true,
          extendedProvider: true,
        });
        this.mainForm.form.patchValue({
          extendedMonths: null,
          extendedAmount: 0,
          extendedProvider: null
        });
        }
  }
  this.setTotal(this.mainForm.form.value);
}

   if (event.name == "mechanicalBreakdownInsurance") {
  if (event.value == "yes") {
    this.mainForm.updateHidden({
      mechanicalBreakdownInsuranceMonths: false,
      mechanicalBreakdownInsuranceAmount: false,
      mechanicalBreakdownInsuranceProvider: false,
    });
         this.mainForm.form.get("mechanicalBreakdownInsuranceMonths")?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]);

    // ✅ amount > 0 and < 100000
    this.mainForm.form.get("mechanicalBreakdownInsuranceAmount")?.setValidators([
      Validators.required,
      Validators.pattern("^(?!0+(\\.0{1,2})?$)(\\d{1,5}(\\.\\d{1,2})?|100000)$"),
      Validators.min(1),
      Validators.max(99999.99), // numerical safety check
    ]);

    this.mainForm.form.get("mechanicalBreakdownInsuranceMonths")?.updateValueAndValidity();
    this.mainForm.form.get("mechanicalBreakdownInsuranceAmount")?.updateValueAndValidity();
    this.mainForm.form.patchValue({
      mechanicalBreakdownChangeAction: "",
    });
  }else 
  if (event.value == "no" && this.baseFormData?.contractId &&
    (this.baseFormData?.mechanicalBreakdownInsuranceMonths > 0 || this.baseFormData?.mechanicalBreakdownInsuranceAmount > 0)) {
    this.mainForm.form.get("mechanicalBreakdownInsuranceMonths")?.clearValidators();
    this.mainForm.form.get("mechanicalBreakdownInsuranceAmount")?.clearValidators();
    const currentData = this.baseFormData || {};
    this.mainForm.updateHidden({
      mechanicalBreakdownInsuranceMonths: true,
      mechanicalBreakdownInsuranceAmount: true,
      mechanicalBreakdownInsuranceProvider: true,
    });
    this.mainForm.form.patchValue({
      mechanicalBreakdownInsuranceMonths: null,
      mechanicalBreakdownInsuranceAmount: currentData.mechanicalBreakdownInsuranceAmount || 0,
      mechanicalBreakdownInsuranceProvider: null,
      mechanicalBreakdownChangeAction: "Delete",
    });
  } else {
    this.mainForm.form.get("mechanicalBreakdownInsuranceMonths")?.clearValidators();
    this.mainForm.form.get("mechanicalBreakdownInsuranceAmount")?.clearValidators();
   if ((event.value == "no" )) {
      this.mainForm.updateHidden({
        mechanicalBreakdownInsuranceMonths: true,
        mechanicalBreakdownInsuranceAmount: true,
        mechanicalBreakdownInsuranceProvider: true,
      });
      this.mainForm.form.patchValue({
         mechanicalBreakdownInsuranceMonths: null,
         mechanicalBreakdownInsuranceAmount: 0,
         mechanicalBreakdownInsuranceProvider: null,
        mechanicalBreakdownChangeAction: "",
      });
    }
        if(event.value == null || event.value == ""){
         this.mainForm.updateHidden({
         mechanicalBreakdownInsuranceMonths: true,
         mechanicalBreakdownInsuranceAmount: true,
         mechanicalBreakdownInsuranceProvider: true,
       });
       this.mainForm.form.patchValue({
         mechanicalBreakdownInsuranceMonths: null,
         mechanicalBreakdownInsuranceAmount: 0,
         mechanicalBreakdownInsuranceProvider: null
       });
       }
  }
  this.setTotal(this.mainForm.form.value);
}

   if (event.name == "guaranteedAssetProtection") {
  if (event.value == "yes") {
    this.mainForm.updateHidden({
      guaranteedAssetProtectionMonths: false,
      guaranteedAssetProtectionAmount: false,
      guaranteedAssetProtectionProvider: false,
    });
               this.mainForm.form.get("guaranteedAssetProtectionMonths")?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]);

    // ✅ amount > 0 and < 100000
    this.mainForm.form.get("guaranteedAssetProtectionAmount")?.setValidators([
      Validators.required,
      Validators.pattern("^(?!0+(\\.0{1,2})?$)(\\d{1,5}(\\.\\d{1,2})?|100000)$"),
      Validators.min(1),
      Validators.max(99999.99), // numerical safety check
    ]);

    this.mainForm.form.get("guaranteedAssetProtectionMonths")?.updateValueAndValidity();
    this.mainForm.form.get("guaranteedAssetProtectionAmount")?.updateValueAndValidity();

    this.mainForm.form.patchValue({
      guaranteedAssetChangeAction: "",
    });
  }else
  if (event.value == "no" && this.baseFormData?.contractId &&
    (this.baseFormData?.guaranteedAssetProtectionAmount > 0)) {
    this.mainForm.form.get("guaranteedAssetProtectionMonths")?.clearValidators();
    this.mainForm.form.get("guaranteedAssetProtectionAmount")?.clearValidators();
    const currentData = this.baseFormData || {};
    this.mainForm.updateHidden({
      guaranteedAssetProtectionMonths: true,
      guaranteedAssetProtectionAmount: true,
      guaranteedAssetProtectionProvider: true,
    });
    this.mainForm.form.patchValue({
      guaranteedAssetProtectionMonths: null,
      guaranteedAssetProtectionAmount: currentData.guaranteedAssetProtectionAmount || 0,
      guaranteedAssetProtectionProvider: null,
      guaranteedAssetChangeAction: "Delete",
    });
  } else {
  this.mainForm.form.get("guaranteedAssetProtectionMonths")?.clearValidators();
  this.mainForm.form.get("guaranteedAssetProtectionAmount")?.clearValidators();
   if ((event.value == "no" )) {
      this.mainForm.updateHidden({
        guaranteedAssetProtectionMonths: true,
        guaranteedAssetProtectionAmount: true,
        guaranteedAssetProtectionProvider: true,
      });
      this.mainForm.form.patchValue({
         guaranteedAssetProtectionMonths: null,
         guaranteedAssetProtectionAmount: 0,
         guaranteedAssetProtectionProvider: null,
        guaranteedAssetChangeAction: "",
      });
    }

    if(event.value == null || event.value == ""){
         this.mainForm.updateHidden({
        guaranteedAssetProtectionMonths: true,
        guaranteedAssetProtectionAmount: true,
        guaranteedAssetProtectionProvider: true,
       });
       this.mainForm.form.patchValue({
         guaranteedAssetProtectionMonths: null,
         guaranteedAssetProtectionAmount: 0,
         guaranteedAssetProtectionProvider: null
       });
       }
  }
  this.setTotal(this.mainForm.form.value);
}

   if (event.name == "motorVehicalInsurance") {
  if (event.value == "yes") {
    this.mainForm.updateHidden({
      motorVehicalInsuranceMonths: false,
      motorVehicalInsuranceAmount: false,
      motorVehicalInsuranceProvider: false,
    });
    
              this.mainForm.form.get("motorVehicalInsuranceMonths")?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]);

    
    this.mainForm.form.get("motorVehicalInsuranceAmount")?.setValidators([
      Validators.required,
      Validators.pattern("^(?!0+(\\.0{1,2})?$)(\\d{1,5}(\\.\\d{1,2})?|100000)$"),
      Validators.min(1),
      Validators.max(99999.99), // numerical safety check
    ]);

    this.mainForm.form.get("motorVehicalInsuranceAmount")?.updateValueAndValidity();
    this.mainForm.form.get("guaranteedAssetProtectionAmount")?.updateValueAndValidity();

    this.mainForm.form.patchValue({
      motorVehicalInsuranceChangeAction: "",
    });
  }else
  if (event.value == "no" && this.baseFormData?.contractId &&
    (this.baseFormData?.motorVehicalInsuranceMonths > 0 || this.baseFormData?.motorVehicalInsuranceAmount > 0)) {
    this.mainForm.form.get("motorVehicalInsuranceMonths")?.clearValidators();
    this.mainForm.form.get("motorVehicalInsuranceAmount")?.clearValidators();  
    const currentData = this.baseFormData || {};
    this.mainForm.updateHidden({
      motorVehicalInsuranceMonths: true,
      motorVehicalInsuranceAmount: true,
      motorVehicalInsuranceProvider: true,
    });
    this.mainForm.form.patchValue({
      motorVehicalInsuranceMonths: null,
      motorVehicalInsuranceAmount: currentData.motorVehicalInsuranceAmount || 0,
      motorVehicalInsuranceProvider: null,
      motorVehicalInsuranceChangeAction: "Delete",
    });
  } else {
    this.mainForm.form.get("motorVehicalInsuranceMonths")?.clearValidators();
    this.mainForm.form.get("motorVehicalInsuranceAmount")?.clearValidators();
      if ((event.value == "no" )) {
      this.mainForm.updateHidden({
        motorVehicalInsuranceMonths: true,
        motorVehicalInsuranceAmount: true,
        motorVehicalInsuranceProvider: true,
      });
      this.mainForm.form.patchValue({
         motorVehicalInsuranceMonths: null,
         motorVehicalInsuranceAmount: 0,
         motorVehicalInsuranceProvider: null,
        motorVehicalInsuranceChangeAction: "",
      });
    }
       if(event.value == null || event.value == ""){
         this.mainForm.updateHidden({
         motorVehicalInsuranceMonths: true,
        motorVehicalInsuranceAmount: true,
        motorVehicalInsuranceProvider: true,
       });
       this.mainForm.form.patchValue({
         motorVehicalInsuranceMonths: null,
         motorVehicalInsuranceAmount: 0,
         motorVehicalInsuranceProvider: null
       });
       }
  }
  this.setTotal(this.mainForm.form.value);
}

   if (event.name == "contract") {
  if (event.value == "yes") {
    this.mainForm.updateHidden({
      contractMonths: false,
      contractAmount: false,
      contractProvider: false,
      reason: true,
    });
      
      this.mainForm.form.get("contractMonths")?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]);

    // ✅ amount > 0 and < 100000
    this.mainForm.form.get("contractAmount")?.setValidators([
      Validators.required,
      Validators.pattern("^(?!0+(\\.0{1,2})?$)(\\d{1,5}(\\.\\d{1,2})?|100000)$"),
      Validators.min(1),
      Validators.max(99999.99), // numerical safety check
    ]);

    this.mainForm.form.get("contractMonths")?.updateValueAndValidity();
    this.mainForm.form.get("contractAmount")?.updateValueAndValidity();
    this.mainForm.form.patchValue({
      contractInsuranceChangeAction: "",
    });
  }else
  if (event.value == "no" && this.baseFormData?.contractId &&
    ( this.baseFormData?.contractMonths > 0  || this.baseFormData?.contractAmount > 0)) {
    this.mainForm.form.get("contractMonths")?.clearValidators();
    this.mainForm.form.get("contractAmount")?.clearValidators();  
    const currentData = this.baseFormData || {};
    this.mainForm.updateHidden({
      contractMonths: true,
      contractAmount: true,
      contractProvider: true,
      reason: true,
    });
    this.mainForm.form.patchValue({
      contractMonths: null,
      contractAmount: currentData.contractAmount || 0,
      contractProvider: null,
      reason: null,
      contractInsuranceChangeAction: "Delete",
    });
  } else {
    this.mainForm.form.get("contractMonths")?.clearValidators();
    this.mainForm.form.get("contractAmount")?.clearValidators();  
    if ((event.value == "no" )) {
      this.mainForm.updateHidden({
        contractMonths: true,
        contractAmount: true,
        contractProvider: true,
        reason: true,
      });
      this.mainForm.form.patchValue({
         contractMonths: null,
         contractAmount: 0,
         contractProvider: null,
         reason: null,
        contractInsuranceChangeAction: "",
      });
    }

      if(event.value == null || event.value == ""){
         this.mainForm.updateHidden({
        contractMonths: true,
        contractAmount: true,
        contractProvider: true,
        reason: true
       });
       this.mainForm.form.patchValue({
         contractMonths: null,
         contractAmount: 0,
         contractProvider: null,
         reason: null
       });
       }
  }
  this.setTotal(this.mainForm.form.value);
}
  }

  openReason(name, value) {
    if (name == "contractMonths") {
      if (Number(value) < this.baseFormData.term) {
        this.mainForm.updateHidden({ reason: false });
        this.mainForm.updateValidators("reason", Validators.required);
      } else {
        this.mainForm.updateHidden({ reason: true });
        this.mainForm.removeValidators("reason", Validators.required);
      }
    }
  }

  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation("onInit");
    this.openReason(event.name, event.data);
    this.setTotal(this.mainForm.form.value);
    this.setvalidation(event.name, event?.data);
  }

  subTotalInsuranceRequirementValue = 0;
  private previousAmountValues: { [key: string]: any } = {};
  override onValueChanges(event) {
    setTimeout(() => {
      this.setTotal(event);
     // this.applyMonthsFieldValidators();
     // this.applyMaxTermValidators();

      const fieldPairs = [
        ["extendedAmount", "extendedMonths"],
        [
          "mechanicalBreakdownInsuranceAmount",
          "mechanicalBreakdownInsuranceMonths",
        ],
        ["guaranteedAssetProtectionAmount", "guaranteedAssetProtectionMonths"],
        ["motorVehicalInsuranceAmount", "motorVehicalInsuranceMonths"],
        ["contractAmount", "contractMonths"],
      ];

      fieldPairs.forEach(([amountField, monthsField]) => {
        const amountControl = this.mainForm.form.get(amountField);
        const monthsControl = this.mainForm.form.get(monthsField);
        const amountValue = amountControl?.value;
        const prevValue = this.previousAmountValues[amountField];

        // console.log(
        //   `Processing ${amountField}: current=${amountValue}, previous=${prevValue}`
        // );

        const isCurrentEmpty = this.isEmptyOrZero(amountValue);
        const wasPreviousEmpty = this.isEmptyOrZero(prevValue);

        if (isCurrentEmpty && !wasPreviousEmpty) {
          console.log(
            `Resetting ${monthsField} because ${amountField} became empty/zero`
          );

          monthsControl?.patchValue(null, { emitEvent: false });
          monthsControl?.markAsUntouched();
          monthsControl?.setErrors(null);
          monthsControl?.markAsPristine();

          this.cd.detectChanges();
        } else if (!isCurrentEmpty) {
          monthsControl?.enable({ emitEvent: false });
        }

        this.previousAmountValues[amountField] = amountValue;
      });
    }, 0);
  }

  private isEmptyOrZero(value: any): boolean {
    return (
      value === 0 ||
      value === "0" ||
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    );
  }

  setTotal(event) {
    let total =
      (event.extendedAmount || 0) +
      (event.mechanicalBreakdownInsuranceAmount || 0) +
      (event.guaranteedAssetProtectionAmount || 0) +
      (event.motorVehicalInsuranceAmount || 0) +
      (event.contractAmount || 0);

    this.mainForm
      .get("subTotalInsuranceRequirementValueLabel")
      .patchValue(Math.abs(total || 0));
    const storeTotal = this.mainForm.get(
      "subTotalInsuranceRequirementValueLabel"
    )?.value;

    this.subTotalInsuranceRequirementValue = storeTotal;
    this.baseSvc.addsOnAccessoriesData({
      ...event,
      subTotalInsuranceRequirementValue: storeTotal,
    });
    this.cd.detectChanges;
    // }
  }

  override onStepChange(stepperDetails: any) {
    this.mainForm.form.markAllAsTouched();
  }

  shouldHideInsuranceSections(): boolean {
    const purpose = this.baseFormData?.purposeofLoan?.toLowerCase();
    const product = this.baseFormData?.productCode?.toLowerCase();
    const hideProducts = ["csa", "tl", "finance lease", "afv"];
    return purpose === "business" && hideProducts.includes(product);
  }

  applyMonthsFieldValidators() {
    const term = Number(this.baseFormData?.term || 0);
    const monthsFields = [
      "extendedMonths",
      "mechanicalBreakdownInsuranceMonths",
      "guaranteedAssetProtectionMonths",
      "motorVehicalInsuranceMonths",
      "contractMonths",
    ];

    monthsFields.forEach((field) => {
      const control = this.mainForm.get(field);
      if (control) {
        control.setValidators([
          Validators.required,
          Validators.pattern("^[0-9]{1,3}$"),
          this.maxTermValidator(term),
        ]);
        control.updateValueAndValidity();
      }
    });
  }
  getDealerInsurance() {
    // let num = sessionStorage.getItem('dealerPartyNumber');
    // let name = sessionStorage.getItem('dealerPartyName');
    let dealer = this.dashboardSvc.userOptions?.find(
      (obj) => obj.originatorNo == this.baseFormData?.originatorNumber
    );
    let dealerInsuranceProvider =
      dealer?.dealerInsuranceProducts?.map((obj) => ({
        label: obj.companyName,
        value: obj.companyName,
      })) || [];

    let matchedInsurance = dealer?.allowedInsuranceProducts || [];

    // let matchedInsurance = this.baseFormData?.allowedInsuranceProducts?.filter(
    //   (item) => allowedInsurance.includes(item)
    // );
    return {
      dealerInsuranceProvider,
      matchedInsurance,
    };
  }

  submitInsuranceForm(): boolean {
    this.mainForm.form.markAllAsTouched();
    this.mainForm.form.updateValueAndValidity();
    return this.mainForm.form.valid;
  }

  override async onBlurEvent(event): Promise<void> {
    //console.log(this.mainForm)
    await this.updateValidation(event);
    this.setvalidation(event.name, event?.value);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  setvalidation(name: string, value: any) {
    const control = this.mainForm.get(name);
    const original = this.originalFieldConfigs[name];

    let validators: any[] = [];

    validators = this.addUniqueValidator(validators, Validators.required);

    if (!value) {
      this.mainForm.updateProps(name, {
        validators,
        errorMessage: "This field is required.",
      });
    } else if (value < 0) {
      validators = this.addUniqueValidator(validators, Validators.min(0));
      this.mainForm.updateProps(name, {
        validators,
        errorMessage: "Minimum value must be 0.",
      });
    } else if (
      original?.maxLength &&
      value.toString().length > original.maxLength
    ) {
      validators = this.addUniqueValidator(
        validators,
        Validators.maxLength(original.maxLength)
      );
      this.mainForm.updateProps(name, {
        validators,
        errorMessage: `Maximum length should be ${original.maxLength} digits.`,
      });
    } else if (
      original?.name === "motorVehicalInsuranceMonths" &&
      (value < 0 || value > 12)
    ) {
      validators = this.addUniqueValidator(
        validators,
        Validators.max(original.max)
      );
      this.mainForm.updateProps(name, {
        validators,
        errorMessage: `Maximum allowed months is ${original.max}.`,
      });
    } else {
      if (original) {
        validators = (original.validators || []).slice();
        validators = this.addUniqueValidator(validators, Validators.required);

        this.mainForm.updateProps(name, {
          validators,
          errorMessage: original.errorMessage,
          default: original.default,
          maxLength: original.maxLength,
          inputType: original.inputType,
        });
      }
    }

    control?.updateValueAndValidity();
  }

  private addUniqueValidator(validators: any[], newValidator: any) {
    if (!validators.some((v) => v?.toString() === newValidator?.toString())) {
      validators.push(newValidator);
    }
    return validators;
  }

  async updateValidation(event) {
    const value = event?.target?.value ?? event;
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: value,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }
}
