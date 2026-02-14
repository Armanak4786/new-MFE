import { ChangeDetectorRef, Component, effect, Input, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { Validators } from "@angular/forms";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-quote-details",
  templateUrl: "./quote-details.component.html",
  styleUrls: ["./quote-details.component.scss"],
})
export class QuoteDetailsComponent extends BaseStandardQuoteClass {
  override title: string = "Quote Details";
  udcEstablishMentFeeFromApi: any = 0;
  productCode : any;
  isTaxinclusive: boolean = false;
  @Input() conditionDDValue !: any;

  // Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   autoResponsive: true,
  //   api: "quotedetails",
  //   goBackRoute: "quotedetails",
  //   cardType: "non-border",
  //   cardBgColor: "--primary-lighter-color",
  // fields: [
  //     // {
  //     //   type: "label-only",
  //     //   typeOfLabel: "inline",
  //     //   label: "Cash Price of Assets",
  //     //   name: "cashPrice",
  //     //   accessDenied: !(
  //     //     this.accessGranted?.["financial_asset"] &&
  //     //     this.accessGranted?.["cash_price"]
  //     //   ),
  //     //   cols: 5,
  //     //   className: "my-auto  pr-0 --primary-light-color",
  //     //   hidden: false,
  //     //   isRequired: true,
  //     // },
  //     {
  //       type: "amount",
  //       name: "cashPriceValue",
  //       label: "Cash Price of Asset",
  //       cols: 9,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
       
  //       // resetOnHidden: false,
  //       maxLength: 15,
  //       hidden: false,
  //       default: 0,
  //       //validators: [validators.max(9999999), validators.min(20000)],

  //       // errorMessage: 'Cash price should be less than 99,99,99,999',
  //     },
  //     {
  //       type: "amount",
  //       label: "Recommended Retail Price",
  //       name: "retailPriceValue",
  //       className: "py-1 mb-1",
  //       cols: 9,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
  //       default: 0,
  //       hidden: true,
  //       maxLength: 12,
  //       //validators: [Validators.required, Validators.min(0)],
  //     },

  //     {
  //       type: "number",
  //       label: "PPSR Count",
  //       name: "ppsrCount",
  //       className: "pb-1",
  //       cols: 4,
  //       inputType: "horizontal",
  //       labelClass: "col-8 mt-2",
  //       inputClass: "col-4 pr-0",
  //       //default: 0,
  //       maxLength: 3,
  //       hidden: false,
  //       //validators: [Validators.required],
  //     },
  //     {
  //       type: "amount",
  //       label: "@",
  //       name: "ppsrPercentRate",
  //       className: "ppsramont",
  //       cols: 2,
  //       inputType: "horizontal",
  //       labelClass: "col-4 px-0 text-right",
  //       inputClass: "col-8 px-0",
  //       styleType: "labelType",
  //       disabled: true,
  //       hidden: false,
  //       // //validators:[Validators.pattern()]
  //     },
  //     {
  //       type: "amount",
  //       // label: '@ $10.35',
  //       name: "ppsrPercentage",
  //       className: "pb-1 mr-0 mt-2 p-0",
  //       cols: 3,
  //       // inputType: 'horizontal',
  //       // labelClass: 'col-5 px-0 mt-1 text-center',
  //       // inputClass: 'col-7 pl-1',
  //       disabled: true,
  //       hidden: false,
  //       default: 0,
  //       //validators: [Validators.min(0)],
  //     },
  //     {
  //       type: "amount",
  //       label: "UDC Establishment Fee",
  //       name: "udcEstablishmentFee",
  //       className: "py-1",
  //       cols: 9,
  //       inputType: "horizontal",
  //       labelClass: "col-9 mt-2",
  //       inputClass: "col-3 px-1",
  //       // alwaysPos: true,
  //       default: 0,
  //       hidden: false,
  //       maxLength: 12,
  //       hintClass: "text-yellow-400",
  //       // hint: 'The set fee will be charged from commission',
  //       //validators: [Validators.required, Validators.min(0)],
  //     },
  //     {
  //       type: "amount",
  //       label: "Dealer Origination Fee",
  //       name: "dealerOriginationFee",
  //       className: "py-1",
  //       labelClass: "col-9 mt-2",
  //       inputClass: "col-3 px-1",
  //       cols: 9,
  //       inputType: "horizontal",
  //       default: 0,
  //       maxLength: 12,
  //       hidden: false,
  //       mode: Mode.edit,
  //       //validators: [Validators.required, Validators.min(0)],
  //     },
  //     {
  //       type: "amount",
  //       label: "Total Establishment Fee",
  //       name: "totalEstablishmentFee",
  //       cols: 9,
  //       mode: Mode.label,
  //       className: " py-1",
  //       inputType: "horizontal",
  //       labelClass: "col-9 mt-2 font-bold -ml-2",
  //       disabled: true,
  //       default: 0,
  //       inputClass: "col-3 px-1",

  //       hidden: false,
  //       //validators: [Validators.required, Validators.min(0)],
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Additional Charges",
  //       name: "additionalChargesHeader",
  //       cols: 9,
  //       hidden: true,
  //       className: "text-base font-bold text-black-alpha-90 mt-3 mb-2",
  //     },
  //     {
  //       type: "amount",
  //       label: "Maintenance Cost",
  //       name: "maintainanceCost",
  //       cols: 9,
  //       className: "py-1 -mb-1",
  //       inputType: "horizontal",
  //       labelClass: "col-9 ",
  //       inputClass: "col-3",
  //       default: 0,
  //       maxLength: 12,
  //       hidden: true,
  //       //validators: [Validators.min(0)],
  //     },
  //     {
  //       type: "amount",
  //       label: "Financed Maintenance Charge",
  //       name: "financedMaintainanceCharge",
  //       cols: 9,
  //       className: " py-1 -mb-2 mt-2",
  //       inputType: "horizontal",
  //       labelClass: "col-9 ",
  //       inputClass: "col-3",
  //       maxLength: 12,
  //       hidden: true,
  //       default: 0,
  //       //validators: [Validators.min(0)],
  //     },
  //     {
  //       type: "amount",
  //       label: "Charges",
  //       name: "totalCharge",
  //       maxLength: 12,
  //       cols: 9,
  //       inputType: "horizontal",
  //       className: "pb-0 -mb-2 mt-2",
  //       labelClass: "col-9  -ml-2",
  //       inputClass: "col-3 px-1 mt-1",
  //       disabled: true,
  //       styleType: "labelType",
  //       default: 0,
  //       mode: Mode.label,
  //       //validators: [Validators.min(0)],
  //     },
  //     {
  //       type: "button",
  //       btnType: "plus-btn",
  //       cols: 3,
        
  //       label: "Add Ons & Accessories",
  //       name: "adsOnAccessories",
  //       submitType: "internal",
  //       className: "px-0",
  //     },
  //     // {
  //     //   type: "amount",
  //     //   label: "Additional Funds",
  //     //   name: "additionalFunds",
  //     //   maxLength: 12,
  //     //   cols: 9,
  //     //   inputType: "horizontal",
  //     //   className: "pb-0",
  //     //   labelClass: "col-8 mt-2",
  //     //   inputClass: "col-4 ",
  //     //   styleType: "labelType",
  //     //   default: 0,
  //     // },
  //     // {
  //     //   type: "textArea",
  //     //   label: "Additional Funds Purpose",
  //     //   name: "additionalFundsPurpose",
  //     //   textAreaType: "border",
  //     //   placeholder: "Type Here",
  //     //   cols: 12,
  //     //   textAreaRows: 3,
  //     //   inputType: "vertical",
  //     //   className: "pb-0",
  //     //   labelClass: "col-7 mt-2 pl-0 ",
  //     //   inputClass: "col-12 ",
  //     // },
  //   ],
  // };

  override formConfig: any = {
    autoResponsive: true,
    api: "quotedetails",
    goBackRoute: "quotedetails",
    cardType: "non-border",
    cardBgColor: "--primary-lighter-color",
    fields: [],
  };

  filteredValidations: any = [];
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,

    public tradeSvc: AssetTradeSummaryService,
    public standardQuoteSvc: StandardQuoteService,
    private cd: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, standardQuoteSvc);

    effect(async () => {
      const trigger = this.standardQuoteSvc.triggerAllComponentsDuringWorkflowChange();
      if(trigger > 0){
        await this.updateValidation("onInit");
      }
    }, { allowSignalWrites: true });

    
    const config = this.validationSvc?.validationConfigSubject.getValue();
    this.filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName,this.pageCode);
     console.log('Filtered Validations quote details componets:', this.filteredValidations);
    this.formConfig = { ...this.formConfig, fields: this.filteredValidations };

  }
override async ngOnInit(): Promise<void> {
  await super.ngOnInit();
  this.subscribeToTaxInclusiveChanges();
  // this.subscribeToPpsrRateChanges();
  // this.standardQuoteSvc
  //     .getBaseDealerFormData()
  //     .pipe()
  //     .subscribe((res) => {
  //     });

  this.standardQuoteSvc.setBaseDealerFormData({
    productCode: sessionStorage.getItem("productCode"),
  });

  this.mainForm.get("ppsrPercentRate")?.patchValue(this.baseFormData?.ppsrPercentRate || 10.35);
      
      
  if (this.baseFormData && this.mainForm?.form) {
      this.tradeSvc.assetListSubject.subscribe((res) => {
        if (res?.length > 0) {
          if (this.baseFormData?.physicalAsset) {
            let totalAssetValue = 0;
            this.baseFormData?.physicalAsset.forEach((asset: any) => {
              if (asset.costOfAsset) {
                totalAssetValue += asset.costOfAsset;
              }
            });
            let draftCashPriceValue = this.baseFormData?.cashPriceValue;           
            //  Only update cashPriceValue when assets are modified (flag is true)
            // If flag is false, preserve the manually entered or saved value
            if (this.standardQuoteSvc.isFinancialAssetPriceValueDetails == true) {
              // Assets were modified, update with calculated total
              this.mainForm?.get("cashPriceValue")?.patchValue(totalAssetValue);
              this.baseFormData.cashPriceValue = totalAssetValue;
            } else if (draftCashPriceValue > 0) {
              // Preserve manually entered or saved value
              this.mainForm?.get("cashPriceValue")?.patchValue(draftCashPriceValue);
            } else {
              // Fallback for new quotes with no saved value
              this.mainForm?.get("cashPriceValue")?.patchValue(totalAssetValue);
              this.baseFormData.cashPriceValue = totalAssetValue;
            }

            // if(this.baseFormData?.contractId && res?.length == 1 && this.baseFormData?.physicalAsset && totalAssetValue == 0 && draftCashPriceValue > 0){
            //  this.mainForm.get("cashPriceValue").patchValue(draftCashPriceValue || totalAssetValue);
            // }
          }
        }
      });
    this.mainForm
      ?.get("ppsrCount")
      ?.patchValue(this.baseFormData.ppsrCount || 1);
    this.mainForm
      .get("ppsrPercentage")
      .patchValue(this.baseFormData.ppsrPercentage);
    // this.mainForm
    //   .get("udcEstablishmentFee")
    //   ?.patchValue(
    //     Math.abs(
    //       this.baseFormData?.financialAssetLease?.udcEstablishmentFee ??
    //         this.baseFormData?.udcEstablishmentFee ??
    //         0
    //     )
    //   );

    // this.mainForm
    //   .get("dealerOriginationFee")
    //   ?.patchValue(
    //     Math.abs(
    //       this.baseFormData?.financialAssetLease?.dealerOriginationFee ??
    //         this.baseFormData?.dealerOriginationFee ??
    //         0
    //     )
    //   );

    // this.mainForm
    //   .get("totalEstablishmentFee")
    //   ?.patchValue(Math.abs(this.baseFormData?.totalEstablishmentFee ?? 0));
  }

  if (this.baseFormData?.productCode == "OL") {
    this.hidden = false;
    this.mainForm.updateHidden({
      ppsrPercentRate: true,
      ppsrPercentage: true,
      ppsrCount: true,
      dealerOriginationFee: true,
      udcEstablishmentFee: true,
      totalEstablishmentFee: true,
      additionalChargesHeader: true,
      financedMaintainanceCharge: false,
      maintainanceCost: false,
      cashPriceValue: true
    });
  } else if (this.baseFormData?.productCode == "AFV") {
    //AFV

    this.hidden = true;
    this.mainForm.updateHidden({
      // ppsrPercent: false,
      ppsrCount: false,
      udcEstablishmentFee: false,
      dealerOriginationFee: false,
      totalEstablishmentFee: false,
      additionalChargesHeader: false,
      financedMaintainanceCharge: true,
      maintainanceCost: true,
    });
    this.mainForm.get("cashPriceValue").clearValidators();
  } else if (this.baseFormData?.productCode == "FL") {
    this.hidden = false;
    this.mainForm?.updateHidden({
      ppsrPercentRate: true,
      ppsrPercentage: true,
      ppsrCount: true,
      dealerOriginationFee: true,
      udcEstablishmentFee: true,
      totalEstablishmentFee: true,
      additionalChargesHeader: true,
      cashPriceValue: true,

      });
    } else if (this.baseFormData?.productCode == "TL") {
      this.hidden = true;
      this.mainForm.updateHidden({
        cashPriceValue: false,
      });
      this.mainForm.updateValidators("cashPriceValue", [
        Validators.required,
        Validators.min(20000),
      ]);
      if (this.baseFormData.conditionDDValue == 781) {
        this.mainForm.updateHidden({
          retailPriceValue: false,
        });
      } else {
        this.mainForm.updateHidden({
          retailPriceValue: true,
        });
      }
    } 
    else if (this.baseFormData?.productCode == "CSA") {
      this.hidden = true;
    } 
    else {
      this.hidden = false;
      this.mainForm?.updateHidden({
        // ppsrPercent: false,
        ppsrCount: false,
        udcEstablishmentFee: false,
        dealerOriginationFee: false,
        totalEstablishmentFee: false,
        additionalChargesHeader: true,
        financedMaintainanceCharge: true,
        maintainanceCost: true,
        retailPriceValue: false,
      });
    }

    // let sessionWorkflowState = sessionStorage.getItem("workFlowStatus");
    // let retailPriceValueField = this.formConfig.fields.find((item => item.name == 'retailPriceValue'));
    // let retailPriceMappingMasterData = retailPriceValueField?.validationMappingMaster?.validationsMapping.find((obj => (obj.productCode == this.baseFormData?.productCode) && (obj.workFlowStateName == sessionWorkflowState)));
    // if(retailPriceMappingMasterData?.disabled == true){
    //   this.mainForm.updateProps("retailPriceValue", { disabled: true });
    //   // this.cd.detectChanges();
    // }
    await this.updateValidation("onInit");

    this.productCode = sessionStorage.getItem("productCode");
  }

  async ngOnChanges(changes: SimpleChanges){
    if(changes['conditionDDValue']){
      if (
      // event.name == "conditionDD" &&
      this.baseFormData?.productCode == "CSA" ||
      this.baseFormData?.productCode == "TL"
    ) {
      if (this.conditionDDValue == 781) {
        this.mainForm.updateHidden({
          retailPrice: false,
          retailPriceValue: false,
        });
      } else {
        this.mainForm.updateHidden({
          retailPrice: true,
          retailPriceValue: true,
        });
      }
    }
    }

        await this.updateValidation("onInit");

  }
 subscribeToTaxInclusiveChanges(): void {
    this.standardQuoteSvc.getBaseDealerFormData().subscribe((data) => {
      if (data?.isTaxinclusive !== undefined) {
        this.isTaxinclusive = data.isTaxinclusive;
        this.updateChargesLabel();
      }
    });
  }

  private updateMaintenanceFieldsState(): void {
  const maintainanceCost = this.mainForm.get("maintainanceCost")?.value || 0;
  const financedMaintainanceCharge = this.mainForm.get("financedMaintainanceCharge")?.value || 0;

  if (maintainanceCost != 0) {
    this.mainForm.get("financedMaintainanceCharge")?.patchValue(0);
    this.mainForm.updateProps("financedMaintainanceCharge", { mode: Mode.label });
  } else if (financedMaintainanceCharge != 0) {
    this.mainForm.get("maintainanceCost")?.patchValue(0);
    this.mainForm.updateProps("maintainanceCost", { mode: Mode.label });
  } else {
    this.mainForm.updateProps("maintainanceCost", { mode: Mode.edit });
    this.mainForm.updateProps("financedMaintainanceCharge", { mode: Mode.edit });
  }
}
  updateChargesLabel(): void {
    if (this.productCode === 'OL' && this.mainForm) {
      const label = this.isTaxinclusive 
        ? 'Charges (GST Inclusive)' 
        : 'Charges (GST Exclusive)';
      
      this.mainForm.updateProps('totalCharge', { label });
      this.cd.detectChanges();
    }
  }
  override onButtonClick(event: any) {
   const { productId, programId, physicalAsset } = this.baseFormData || {};

if (!productId || !programId || !physicalAsset?.length || !physicalAsset[0]?.assetType?.assetTypeId) {
  this.toasterSvc.showToaster({
    severity: "error",
    detail: "Please select Product, Program, and Assets to proceed further.",
  });
  return;
}

    if (event.field.name == "adsOnAccessories") {
      this.route.paramMap.subscribe((params) => {
        let id = params.get("id");
        if (id) {
          this.svc.router.navigateByUrl(
            "/dealer/standard-quote/add-on-accessories"
          );
        } else {
          this.svc.router.navigateByUrl(
            `/dealer/standard-quote/add-on-accessories`
          );
        }
      });
    }
  }

  hidden: boolean = false;
  override onFormDataUpdate(res: any): void {
    if(res?.productId && (sessionStorage.getItem("externalUserType") == "Internal" )){
      if(res?.businessModel === "Introduced"){
        this.mainForm?.updateProps("dealerOriginationFee", {mode: Mode.edit})
      }
      else{
        this.mainForm?.updateProps("dealerOriginationFee", {mode: Mode.view})
      }
    }
    
    if (
      this.udcEstablishMentFeeFromApi === 0 ||
      this.udcEstablishMentFeeFromApi === null
    ) {
      this.udcEstablishMentFeeFromApi =
        this.baseFormData?.udcEstablishmentFee || 0;
    }

    // if (
    //   // event.name == "conditionDD" &&
    //   this.baseFormData?.productCode == "CSA" ||
    //   this.baseFormData?.productCode == "TL"
    // ) {
    //   if (this.baseFormData.conditionDDValue == 781) {
    //     this.mainForm.updateHidden({
    //       retailPrice: false,
    //       retailPriceValue: false,
    //     });
    //   } else {
    //     this.mainForm.updateHidden({
    //       retailPrice: true,
    //       retailPriceValue: true,
    //     });
    //   }
    // }
    super.onFormDataUpdate(res);
  }

  // override async onValueChanges(event: any) {

  // super.onValueChanges(event)
  // if (event.udcEstablishmentFee < this.udcEstablishMentFeeFromApi || event.udcEstablishmentFee===0 ) {
  //    await this.updateValidation(event);
  //   this.mainForm.updateProps("udcEstablishmentFee",{hint:'The set fee will be charged from commission',})
  //   this.mainForm?.updateValidators("udcEstablishmentFee", [
  //     Validators.min(this.udcEstablishMentFeeFromApi),
  //     Validators.required,
  //   ]);
  // }
  // }
  override async onValueTyped(event: any) {
    this.baseSvc.forceToClickCalculate.next(true);
    if (event.name == "cashPriceValue") {
      this.updateValidation(event);
      this.baseSvc.forceToClickCalculate.next(true);
    }
      //  this.updateValidation(event);
    if (event.name == "udcEstablishmentFee") {
      if (event.data < this.udcEstablishMentFeeFromApi || event.data === 0) {
        await this.updateValidation(event);
        this.mainForm.updateProps("udcEstablishmentFee", {
          hint: "The set fee will be charged from commission",
        });
      } else {
        this.mainForm.updateProps("udcEstablishmentFee", { hint: "" });
      }
    }

    if(event.name == "maintainanceCost"){
      if(event.data != 0){
      this.mainForm.get("financedMaintainanceCharge").patchValue(0);
      this.mainForm.updateProps("financedMaintainanceCharge",{mode : Mode.label});
      }
      else{
        this.mainForm.updateProps("financedMaintainanceCharge",{mode : Mode.edit});
      }
    }
     if(event.name == "financedMaintainanceCharge"){
      if(event.data != 0){
      this.mainForm.get("maintainanceCost").patchValue(0);
      this.mainForm.updateProps("maintainanceCost",{mode : Mode.label});
      }
      else{
        this.mainForm.updateProps("maintainanceCost",{mode : Mode.edit});
      }
    }
  }

override onFormEvent(event: any): void {
  if (
    (event.name == "conditionDD" &&
      this.baseFormData?.productCode == "CSA") ||
    this.baseFormData?.productCode == "TL"
  ) {
    if (this.baseFormData.conditionDD == 781) {
      this.mainForm.updateHidden({
        retailPrice: false,
        retailPriceValue: false,
      });
    } else {
      this.mainForm.updateHidden({
        retailPrice: true,
        retailPriceValue: true,
      });
    }
  }

  if (event?.name == "ppsrCount") {
    let totalppsrCount = this.mainForm.get("ppsrCount").value * 10.35;
    this.mainForm
      .get("ppsrPercentage")
      .patchValue(isNaN(totalppsrCount) ? "" : Number(totalppsrCount));
  }

  if (
    event?.name == "udcEstablishmentFee" ||
    event?.name == "dealerOriginationFee"
  ) {
    const total =
      this.mainForm.get("udcEstablishmentFee").value +
      this.mainForm.get("dealerOriginationFee").value;

    this.mainForm
      .get("totalEstablishmentFee")
      .patchValue(isNaN(total) ? "" : Number(total));
  }
      
  //  Reset flag when user manually changes cash price
  if (event?.name == "cashPriceValue") {
    this.standardQuoteSvc.isFinancialAssetPriceValueDetails = false;
  }
  super.onFormEvent(event);
}

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "QuoteDetailsComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();

    if(this.productCode === "FL") {
      this.mainForm.updateProps("totalCharge", { inputClass: "col-3 px-4", });
    }
if (this.productCode === 'OL') {
      this.isTaxinclusive = this.baseFormData?.isTaxinclusive || false;
      this.updateChargesLabel();
      this.updateMaintenanceFieldsState();
    }
    if(this.productCode == "OL"){
      this.mainForm?.updateProps?.("adsOnAccessories", {label: "Add Maintenance & Charges"})
    }
  }

  override async onBlurEvent(event): Promise<void> {
    
    if(event.name == "cashPriceValue" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
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
    

    if(event.name == "udcEstablishmentFee" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentEstablishmentFee = this.mainForm.get("udcEstablishmentFee").value;
      let currentCashPriceValue = this.mainForm.get("cashPriceValue").value;
      if(currentEstablishmentFee > this.baseFormData?.apiudcEstablishmentFee){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "UDC Establishment Fee cannot be increased in Ready for Documentation state.",
        });
        // return;
      
      }
    }

    if(event.name == "dealerOriginationFee" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentDealerOriginationFee = this.mainForm.get("dealerOriginationFee").value;
      if(currentDealerOriginationFee > this.baseFormData?.apidealerOriginationFee){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Dealer Origination Fee cannot be increased in Ready for Documentation state.",
        });
        // return;
      }
    }

    if(event.name == "ppsrCount" && this.baseFormData?.productCode == "AFV" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentppsrCount = this.mainForm.get("ppsrCount").value;
      if(currentppsrCount > this.baseFormData?.apippsrCount){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "PPSR count cannot be increased in Ready for Documentation state.",
        });
        // return;
      }
    }

    if(event.name == "maintainanceCost" && this.baseFormData?.productCode == "OL" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentmaintainanceCost = this.mainForm.get("maintainanceCost").value;
      if(currentmaintainanceCost > this.baseFormData?.apimaintainanceCost){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "PPSR count cannot be increased in Ready for Documentation state.",
        });
        // return;
      }
    }
    if(event.name == "financedMaintainanceCharge" && this.baseFormData?.productCode == "OL" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentfinancedMaintainanceCharge = this.mainForm.get("financedMaintainanceCharge").value;
      if(currentfinancedMaintainanceCharge > this.baseFormData?.apifinancedMaintainanceCharge){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Financed maintainance charge cannot be increased in Ready for Documentation state.",
        });
        // return;
      }
    }

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
        //   severity: 'error',
        //   detail: 'I7',
        // });
      }
    }
}
}
