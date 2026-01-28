import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CloseDialogData, CommonService, GenericFormConfig, Mode } from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { SettlementPopupComponent } from "../settlement-popup/settlement-popup.component";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { SettlementDisclosureComponent } from "../settlement-disclosure/settlement-disclosure.component";
import { Validators } from "@angular/forms";
import { SettlementQuotePopupComponent } from "../settlement-quote-popup/settlement-quote-popup.component";
import { ToasterService, ValidationService } from "auro-ui";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-less-deposit",
  templateUrl: "./less-deposit.component.html",
  styleUrls: ["./less-deposit.component.scss"],
})
export class LessDepositComponent extends BaseStandardQuoteClass {
  @Output() updateAmount: EventEmitter<number> = new EventEmitter();
  cashPrice: any;
  contractactivationStatus:boolean=true;
  override title: string = "Less Deposit";
  private userModifiedSettlement = false;

// Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   // headerTitle: "Less Deposit",
  //   autoResponsive: true,
  //   api: "lessDeposit",
  //   goBackRoute: "lessDeposit",
  //   cardType: "non-border",
  //   cardBgColor: "--primary-lighter-color",
  //   fields: [
      // {
      //   type: "number",
      //   label: "Cash Deposit",
      //   name: "depositPct",
      //   className: "pb-0",
      //   suffix: "%",
      //   maxFractionDigits: 2,
      //   cols: 6,
      //   inputType: "horizontal",
      //   labelClass: " mt-2 col-7",
      //   inputClass: "col-5 pr-0",
      //   default: 0,
      //   ////validators: [validators.max(999999)], // validation change
      // },
  //     {
  //       type: "label-only",
  //       name: "orLabel",
  //       typeOfLabel: "inline",
  //       label: "OR",
  //       className: "mt-2",
  //       cols: 1,
  //       nextLine: false,
  //     },
  //     {
  //       type: "amount",
  //       name: "deposit",
  //       cols: 2,
  //       nextLine: false,
  //       className: "pl-0",
  //       // //validators: [validators.min(0), validators.max(99)],  // validation change
  //     },

  //     {
  //       type: "amount",
  //       label: "Trade Amount",
  //       name: "tradeAmountPrice",
  //       className: "pb-0",
  //       cols: 9,
  //       styleType: "labelType",
  //       inputType: "horizontal",
  //       labelClass: " mt-2 col-9",
  //       inputClass: "col-3",
  //       //validators: [],
       
  //     },
  //     {
  //       type: "amount",
  //       label: "Settlement Amount",
  //       name: "settlementAmount",
  //       default: 0,
  //       className: "pb-0",
  //       labelClass: " mt-2 col-9 pr-0 ",
  //       inputClass: "col-3 pr-2 ",
  //       cols: 9,
  //       maxLength: 12,
  //       inputType: "horizontal",
  //       // //validators: [validators.min(0), validators.pattern('^[0-9]{1,10}$')],   // validation change
  //     },
  //     {
  //       type: "button",
  //       label: "Settlement",
  //       name: "settlementButton",
        
  //       className: "pb-0",
  //       submitType: "internal",
  //       cols: 3,
  //       mode: Mode.view,
  //       btnType: "border-btn",
  //       disabled:true,
  //     },
  //     {
  //       type: "amount",
  //       label: "Net Trade Amount",
  //       name: "netTradeAmount",
         
  //       className: "pb-0",
  //       styleType: "labelType",
  //       labelClass: " mt-2 col-9 pr-0 -ml-2",
  //       inputClass: "col-3 pr-0 px-2",
  //       cols: 9,
  //        default: 0,
  //       inputType: "horizontal",
  //       // //validators: [validators.min(0), validators.pattern('^[0-9]{1,10}$')],  // validation change
  //       mode: Mode.label,
  //     },
  //     {
  //       type: "amount",
  //       label: "Sub Total",
  //       name: "subTotal",
  //       className: "pb-0",
  //       labelClass: " mt-2 col-9 pr-0",
  //       inputClass: "col-3 pr-0 ",
  //       cols: 9,
  //       inputType: "horizontal",
  //       disabled: false,
  //       // //validators: [validators.min(0), validators.pattern('^[0-9]{1,10}$')],   // validation change
  //       hidden: true,
  //     },
  //   ],
  // };

    override formConfig: any = {
    autoResponsive: true,
    api: "lessDeposit",
    goBackRoute: "lessDeposit",
    cardType: "non-border",
    cardBgColor: "--primary-lighter-color",
    fields: [],
  };
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private changeDetectorRef: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public tradeSvc : AssetTradeSummaryService
  ) {
    super(route, svc, baseSvc);

    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName, this.pageCode);
    console.log('Filtered Validations:less deposit', filteredValidations);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };

  }
  //  @Output() updateAmount = new EventEmitter();
  hideCard: boolean = true;
   override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
       if (this.baseFormData && this.mainForm?.form) {
      this.cashPrice =
        this.baseFormData?.cashPriceValue || this.baseFormData.cashPriceamount;
         const depositCents = Math.round(Math.abs(this.baseFormData?.deposit) * 100);
const cashPriceCents = Math.round(this.cashPrice * 100);
const cashPerInHundredths = Math.floor((depositCents * 10000) / cashPriceCents);
const roundedCashPer = cashPerInHundredths / 100;

        this.mainForm.get("depositPct").patchValue(isNaN(roundedCashPer) ? "" : roundedCashPer);
        this.tradeSvc.tradeListSubject.subscribe((res)=>{
      if (this.baseFormData.tradeInAssetRequest) {
        let totalTradeAssetValue = 0; 
       const tradeInAssetRequest = res.filter(t => t.changeAction !== 'delete');       
        tradeInAssetRequest.forEach((asset: any) => {
          if (asset.tradeAssetValue) {
            totalTradeAssetValue += Number(asset.tradeAssetValue); // Convert to number and add
          }
        });
        if(this.baseSvc.isAssetTrade){
          this.mainForm.get("tradeAmountPrice").patchValue(totalTradeAssetValue);
          this.baseFormData.tradeAmountPrice = totalTradeAssetValue;
          this.baseFormData.netTradeAmount = totalTradeAssetValue
        }else{
           this.mainForm.get("tradeAmountPrice").patchValue(this.baseFormData?.tradeAmount || 0);
        }
        
        //comented as per new calcualtion that net trade amount value is not depend on cash deposit value
        // if (totalTradeAssetValue > 0) {
        //   console.log("totalTradeAssetValue ---------------",this.baseFormData)
        //   this.mainForm.get("netTradeAmount").patchValue(Math.abs(totalTradeAssetValue) - 
        //       (this.mainForm.get("deposit").value > 1 ? this.mainForm.get("deposit").value: 0)
        //     );
        //     this.baseFormData.netTradeAmount = Math.abs(totalTradeAssetValue) -
        //         (this.mainForm.get("deposit").value > 1
        //           ? this.mainForm.get("deposit").value
        //           : 0);

        // }
      } 
      else {
         this.mainForm
          .get("tradeAmountPrice")
          .patchValue(0);
        this.mainForm.get("netTradeAmount").patchValue(0);
      }
    })
// this.baseSvc.getBaseDealerFormData().subscribe((res) => {
//     let amount =res?.getSettlementAmountDetails?.settlementAmount;
//       this.mainForm.get("settlementAmount").patchValue(amount);
        
//   //       if (res?.getSettlementAmountDetails?.settlementAmount !== amount) {
//   //         console.log("inside")
//   //   this.baseSvc.setBaseDealerFormData({
//   //     ...res?.getSettlementAmountDetails,
//   //     settlementAmount: amount
//   //   });
//   // }
          
//         });

this.baseSvc.getBaseDealerFormData().subscribe((res) => {
    if (this.userModifiedSettlement) {
      return; 
    }
    
    let amount = res?.getSettlementAmountDetails?.settlementAmount;
    
    if (amount !== undefined && amount !== null && this.mainForm?.get('settlementAmount')) {
      this.mainForm.get("settlementAmount").patchValue(amount, { emitEvent: false });
      this.baseFormData.settlementAmount = amount;
    }
  });



           

      if (this.baseFormData?.settlementType == "Standard") {
        this.mainForm
          .get("settlementAmount")
          .patchValue(
            this.baseFormData?.getSettlementAmountData?.Data
              ?.standardSettlementAmount?.Total
          );
      } else if (this.baseFormData.settlementType == "Refinancing") {
        this.mainForm
          .get("settlementAmount")
          .patchValue(
            this.baseFormData?.getSettlementAmountData?.Data
              ?.refinancingSettlemntAmount?.Total
          );
      } else {
      }
    }
    if (
      this.baseFormData?.productCode == "FL" ||
      this.baseFormData?.productCode == "OL"
    ) {
      this.hideCard = false;
    } else {
      this.hideCard = true;
    }
    await this.updateValidation("onInit");
 this.baseSvc.getBaseDealerFormData().subscribe((res) => {
    const newCashPrice = res?.cashPriceValue;
    const currentDepositPct = this.mainForm?.get("depositPct")?.value;
    
    
    if (newCashPrice && newCashPrice !== this.cashPrice && currentDepositPct > 0) {

      this.cashPrice = newCashPrice;
      
     
      this.convertPctToAmount("deposit", currentDepositPct);
    }
  });
    this.init();
	this.settlementValidationCheck();
  }

  override onStatusChange(statusDetails: any): void {
    // if (statusDetails?.currentState == "Contract Activation") {
    //   this.mainForm.updateDisable({
    //     settlementButton: false,
    //   });
    // }

    if((configure?.workflowStatus?.view?.includes(statusDetails?.currentState)) || (configure?.workflowStatus?.edit?.includes(statusDetails?.currentState))){
          this.settlementButtonClickable = false;
            this.mainForm.updateDisable({
              settlementButton: true,
            });
          }
  }

  async init() {
    this.baseSvc.getBaseDealerFormData().subscribe((res) => {
      this.getMax(res?.cashPriceValue || 0);
      const depositAmount =
        ((res?.depositPct || 0) / 100) * (res?.cashPriceValue || 0);
      if (
        (this.cashPrice === undefined ||
          this.cashPrice === null ||
          this.cashPrice !== res?.cashPriceValue) &&
        res?.cashPriceValue
      ) {
        this.cashPrice = res?.cashPriceValue;
         const roundedDepositAmount = parseFloat(depositAmount.toFixed(2));
      this.mainForm?.get("deposit").patchValue(roundedDepositAmount);
      }
    });
  }

  override onCalledPreview(mode): void {
    if (mode == "update") {
      this.mainForm?.form?.patchValue(this.baseFormData);
    }
  }

  override onButtonClick(event: any) {
    
    if(!this.baseFormData?.contractId){
      return;
    }
    if (event.field.name == "settlementButton") {
      if(!this.settlementButtonClickable){
        return;
      }
      // this.showDialog();
      this.settlementQuateDialog();
    }
  }
  getMax(number) {
    // this.mainForm?.updatevalidators('deposit', [validators.max(number - 1 || 0)]);
  }

  // showDialog() {
  //   this.svc.dialogSvc
  //     .show(SettlementQuotePopupComponent, "Settlement Quote", {
  //       templates: {
  //         footer: null,
  //       },
  //       width: "30vw",
  //     })
  //     .onClose.subscribe((data: CloseDialogData) => {
  //       if (data.data == "proceed") {
  //         this.settlementQuateDialog();
  //       }
  //     });
  // }

  settlementQuateDialog() {
    this.svc.dialogSvc
      .show(SettlementPopupComponent, "Settlement Quote", {
        templates: {
          footer: null,
        },

        width: "60vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {
        if (data) {
          this.baseSvc.setBaseDealerFormData({
            getSettlementAmountData: data?.data,
          });
          this.svc.router.navigateByUrl(
            "/dealer/standard-quote/settlement-quote-details"
          );
        }

        if (data.btnType == "submit") {
          this.svc.dialogSvc
            .show(SettlementDisclosureComponent, "Calculate Settlement", {
              data: {
                // okBtnLabel: 'Next',
              },
              width: "60vw",
            })
            .onClose.subscribe((data: CloseDialogData) => {
              this.svc.router.navigateByUrl(
                "/dealer/standard-quote/settlement-quote-details"
              );
              // if(data?.data?.checkboxs)
              // {
              //   this.baseFormData.settlementAmount=data?.data?.checkboxs;
              //   this.mainForm
              //   .get('settlementAmount')
              //   .patchValue(data?.data?.checkboxs);

              //   if(this.baseFormData.netTradeAmount>data?.data?.checkboxs){
              //   this.mainForm
              //   .get('netTradeAmount')
              //   .patchValue(
              //     this.baseFormData?.netTradeAmount - this.baseFormData?.settlementAmount || 0
              //   );
              // }}

              SettlementDisclosureComponent;
            });
        }
      });
  }

 override onValueTyped(event: any) {
  this.baseSvc?.forceToClickCalculate.next(true);
  if (event.name == "deposit" && this.baseFormData?.cashPriceValue > 0) {
    this.convertAmountToPct("depositPct", event.data);
    this.baseSvc?.forceCalculateBeforeSchedule.next(true);
  }
  
  if (event.name == "depositPct" && this.baseFormData?.cashPriceValue > 0) {
    this.baseSvc?.forceCalculateBeforeSchedule.next(true);
    this.convertPctToAmount("deposit", event.data);
  }
  
  
  if (event.name == "cashPriceValue" || event.name == "cashPrice") {
    const currentPct = this.mainForm?.get("depositPct")?.value;
    if (currentPct && currentPct > 0 && event.data > 0) {

      this.cashPrice = event.data;
      this.convertPctToAmount("deposit", currentPct);
    }
  }
  if (event.name == "tradeAmountPrice" ) {
        let tradeAmountPrice = this.mainForm.get("tradeAmountPrice").value || 0;
      if ( tradeAmountPrice >= 0 ) {
      this.baseFormData.netTradeAmount = this.mainForm.get("netTradeAmount").patchValue(
            Math.abs(
              tradeAmountPrice - 0
            )
          );
          this.tradeSvc.updateTradeAmountForAddTrade(tradeAmountPrice);
          ;
      }
    }

    if (event.name === "settlementAmount") {
    this.userModifiedSettlement = true; // Set flag when user modifies
    this.baseFormData.settlementAmount = event.data;
    this.baseSvc.setBaseDealerFormData({
      settlementAmount: event.data
    });
  }
 
}


 convertPctToAmount(name: string, val: number) {
  if (this.baseFormData?.cashPriceValue > 0) {
    
    const cashPrice = this.baseFormData.cashPriceValue;
    const percentage = val;

   
    const cashPriceCents = Math.round(cashPrice * 100);
    const percentageCents = Math.round(percentage * 100);
    
   
    const amountInCents = Math.floor((percentageCents * cashPriceCents) / 10000);
    
    
    const finalAmount = amountInCents / 100;

    this.mainForm.get(name).patchValue(finalAmount || 0);
  } else {
    this.mainForm.get(name).patchValue(0);
  }
}

convertAmountToPct(name: string, val: number) {
  if (this.baseFormData?.cashPriceValue > 0) {
   
    const cashPrice = this.baseFormData.cashPriceValue;
    const amount = val;

    
    const amountCents = Math.round(amount * 100);
    const cashPriceCents = Math.round(cashPrice * 100);
    
    
    const pctInHundredths = Math.floor((amountCents * 10000) / cashPriceCents);
    
   
    const finalPct = pctInHundredths / 100;

    this.mainForm.get(name).patchValue(finalPct || 0);
  } else {
    this.mainForm.get(name).patchValue(0);
  }
}




  override onFormEvent(event: any): void {
    // if (event.name == "depositPct" || event.name == "deposit") {
    //   if (
    //     this.baseFormData?.tradeAmountPrice > 0 &&
    //     this.baseFormData?.deposit
    //   ) {
    //     this.mainForm
    //       .get("netTradeAmount")
    //       .patchValue(
    //         Math.abs(
    //           this.baseFormData.tradeAmountPrice - this.baseFormData?.deposit
    //         )
    //       );
    //   }
    // }

    if(event.field.name == "settlementButton")
    {
     this.settlementValidationCheck();
    }

    super.onFormEvent(event);
  }

  // override onFormDataUpdate(res: any): void {
    
  //   // if (
  //   //   this.baseFormData?.netTradeAmount != res?.netTradeAmount &&
  //   //   res?.totalBorrowedAmount
  //   // ) {
  //   //   res.totalBorrowedAmount = res?.totalAmountBorrowed;
  //   // }
  //   // if (res?.changedField?.productId) {
  //   //   if (res?.productId == 9 || res?.productId == 53 || res?.productId == 14) {
  //   //     this.hideCard = true;
  //   //   } else if (res.productId == 59) {
  //   //     this.hideCard = true;
  //   //     this.mainForm?.updateHidden({ subTotal: false });
  //   //   } else {
  //   //     this.mainForm?.updateHidden({ subTotal: true });
  //   //   }
  //   // }
  // }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "LessDepositComponent";

  override async onFormReady(): Promise<void> {
  //  if (this.baseFormData && this.mainForm?.form) {
  //     this.cashPrice =
  //       this.baseFormData?.cashPriceValue || this.baseFormData.cashPriceamount;
  //     const cashPer =
  //       (Math.abs(this.baseFormData?.deposit) / this.cashPrice) * 100;
  //     this.mainForm.get("depositPct").patchValue(isNaN(cashPer) ? "" : cashPer);
  //       this.tradeSvc.tradeListSubject.subscribe((res)=>{
  //     if (this.baseFormData.tradeInAssetRequest) {
  //       let totalTradeAssetValue = 0;        
  //       this.baseFormData.tradeInAssetRequest.forEach((asset: any) => {
  //         if (asset.tradeAssetValue) {
  //           totalTradeAssetValue += Number(asset.tradeAssetValue); // Convert to number and add
  //         }
  //       });
  //       this.mainForm
  //         .get("tradeAmountPrice")
  //         .patchValue(totalTradeAssetValue);
  //         this.baseFormData.tradeAmountPrice =totalTradeAssetValue;

  //       if (totalTradeAssetValue > 0) {
  //         this.mainForm
  //           .get("netTradeAmount")
  //           .patchValue(
  //             Math.abs(totalTradeAssetValue) -
  //               (this.mainForm.get("deposit").value > 1
  //                 ? this.mainForm.get("deposit").value
  //                 : 0)
  //           );
  //           this.baseFormData.netTradeAmount =Math.abs(totalTradeAssetValue) -
  //               (this.mainForm.get("deposit").value > 1
  //                 ? this.mainForm.get("deposit").value
  //                 : 0);

  //       }
  //     } else {
  //       this.mainForm.get("netTradeAmount").patchValue(0);
  //     }
  //   })
  //     if (this.baseFormData?.settlementType == "Standard") {
  //       this.mainForm
  //         .get("settlementAmount")
  //         .patchValue(
  //           this.baseFormData?.getSettlementAmountData?.Data
  //             ?.standardSettlementAmount?.Total
  //         );
  //     } else if (this.baseFormData.settlementType == "Refinancing") {
  //       this.mainForm
  //         .get("settlementAmount")
  //         .patchValue(
  //           this.baseFormData?.getSettlementAmountData?.Data
  //             ?.refinancingSettlemntAmount?.Total
  //         );
  //     } else {
  //     }
  //   }


    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    // console.log(this.baseFormData);

    if(event.name == "deposit" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentDeposit = this.mainForm.get("deposit").value;
      if(currentDeposit < this.baseFormData?.apideposit){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Deposit cannot be decreased in Ready for Documentation state.",
        });
      }
    }

    if(event.name == "depositPct" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentDepositPct = this.mainForm.get("depositPct").value;
      if(currentDepositPct < this.baseFormData?.apidepositPct){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Deposit Percent cannot be decreased in Ready for Documentation state.",
        });
      }
    }
    if(event.name == "tradeAmountPrice" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currenttradeAmountPrice = this.mainForm.get("tradeAmountPrice").value;
      if(currenttradeAmountPrice < this.baseFormData?.apinetTradeAmount){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Trade amount cannot be decreased in Ready for Documentation state.",
        });
      }
    }
    if(event.name == "settlementAmount" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentsettlementAmount = this.mainForm.get("settlementAmount").value;
      if(currentsettlementAmount > this.baseFormData?.apisettlementAmount){        
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Settlement amount cannot be decreased in Ready for Documentation state.",
        });
      }
    }


    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }
  private settlementButtonClickable:boolean=false;
  settlementValidationCheck()
  {
    if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus)))
     {
       this.settlementButtonClickable = false;
     this.mainForm.updateDisable({
        settlementButton: true,
      });
      return;
     }

   if(this.baseFormData.hasOwnProperty('contractId') && this.baseFormData.contractId != undefined)//'contractId' in this.baseFormData  !=undefined 
     {
      this.settlementButtonClickable = true;
      this.mainForm.updateDisable({
        settlementButton: false,
      });
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

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.changeDetectorRef.detectChanges();
      return false;
    }
    return true;
  }

  // override async onStepChange(quotesDetails: any): Promise<void> {
  //   if (quotesDetails.type !== 'tabNav') {
  //     var result: any = await this.updateValidation('onSubmit');
  //     // if (!result?.status) {
  //     //   this.toasterSvc.showToaster({
  //     //     severity: 'error',
  //     //     detail: 'I7',
  //     //   });
  //     // }
  //   }
  // }
}
