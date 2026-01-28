import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  input,
  Output,
} from "@angular/core";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CalculationService } from "./calculation.service";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { catchError, lastValueFrom, map, of } from "rxjs";
import configure from "../../../../../public/assets/configure.json";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import { effect } from '@angular/core';
import { DealerUdcDeclarationComponent } from "../dealer-udc-declaration/dealer-udc-declaration.component";
import { Message } from "primeng/api";
import { FinalConfirmationComponent } from "../final-confirmation/final-confirmation.component";
import { BusinessService } from "../../../business/services/business";
import { IndividualService } from "../../../individual/services/individual.service";
import { SoleTradeService } from "../../../sole-trade/services/sole-trade.service";
import { TrustService } from "../../../trust/services/trust.service";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { QuickQuoteService } from "../../../quick-quote/services/quick-quote.service";

@Component({
  selector: "app-payment-summary",
  templateUrl: "./payment-summary.component.html",
  styleUrl: "./payment-summary.component.scss",
})
export class PaymentSummaryComponent extends BaseStandardQuoteClass {
  today = new Date();
  allowedDate = new Date(new Date().setDate(this.today.getDate() + 42));
  configuredLoanPurpose = configure.LoanPurpose;
  //Start:all fields are used in component itself
  //showResult: boolean = false;
  isKeyInfo: boolean = true;
  totalBorrowedAmount: number = 10000;
  interestRate: number;
  term: any;
  paymentAmount: number;
  calculatedInterest: number;
  totalAmountToRepay: number;
  defaultTodayDate?: string;
  frequencyValue: number;
  repaymentFrequency: any;
  totalNumberOfPayments: number;
  // loanDate?: string;
  firstPaymentDate?: string;
  cashPrice: number;
  minDate?: any;
  initialLeasePayment: any;
  //End:all fields are used in component itself
  // constructor(
  //   public override route: ActivatedRoute,
  //   public override svc: CommonService,
  //   override baseSvc: StandardQuoteService,
  //   public cdr: ChangeDetectorRef,
  //   public calculationSvc: CalculationService
  // ) {
  //   super(route, svc, baseSvc);
  //   this.minDate = new Date();
  //   this.minDate.setHours(0, 0, 0, 0);

  //   // this.defaultTodayDate = this.calculationSvc?.getDefaultDate();
  //   this.formConfig.createData.loanDate = new Date();
  // }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    if (this.mode === Mode.create) {
      this.mainForm?.get("balloonAmount").patchValue(0);
    }
    this.mainForm?.updateProps("loanDate", { minDate: this.minDate });
    this.mainForm?.updateProps("firstPaymentDate", { minDate: this.minDate, 
            maxDate: new Date(new Date().setDate(new Date().getDate() + 42)) });
    // this.mainForm?.updateProps("firstPaymentDate", {
    //   maxDate: this.allowedDate,
    // });
    if (
      !this.baseFormData?.contractId &&
      !this.mainForm?.get("loanDate").value
    ) {
      let todayDate = new Date();
      let afterDate = new Date();
      afterDate.setDate(todayDate.getDate() + 30);
      this.mainForm?.get("leaseDate").patchValue(new Date());
      this.mainForm?.get("loanDate").patchValue(new Date());

      // this.mainForm?.get("firstPaymentDate").patchValue(afterDate);
    }

    if (this.baseFormData && this.mainForm?.form) {
      this.initialLeasePayment = this.baseFormData?.initialLeasePayment;
      // this.mainForm.form
      // .get('initialLeasePayment')
      // .patchValue(this.baseFormData?.initialLeasePayment);
      if (this.baseFormData?.financialAssetLease) {
        this.baseSvc.showResult = true;
        const balloonPct = this.baseFormData?.financialAssetLease?.balloonPct;
        const fixed = this.baseFormData?.financialAssetLease?.fixed;
        const loanDate = this.baseFormData?.loanDate || this.baseFormData?.financialAssetLease?.startDate;    //Subhashish
        const firstPaymentDate = this.baseFormData?.firstPaymentDate;

        // if (balloonAmount) {
        //   this.mainForm
        //     .get('balloonAmount')
        //     .patchValue(balloonAmount, { emitEvent: false });
        // }
        if (firstPaymentDate) {
          // this.mainForm.updateProps("firstPaymentDate", {
          //   minDate: new Date(firstPaymentDate),
          // this.mainForm.form.get("firstPaymentDate").patchValue(firstPaymentDate);
          // this.allowedDate = firstPaymentDate;

          // let newLoanDate = new Date(loanDate);
          let newPaymentDate = new Date(loanDate)
          newPaymentDate.setDate(newPaymentDate.getDate() + 42);
          this.mainForm?.updateProps("firstPaymentDate", {
            minDate: new Date(loanDate),
            maxDate: newPaymentDate,
            // maxDate: this.allowedDate, 
            // minDate:new Date(loanDate),
          });

          this.mainForm.form.get("firstPaymentDate").patchValue(firstPaymentDate);
        }

        if (loanDate) {
          if (new Date(loanDate) > new Date()) {
            this.mainForm.updateProps("loanDate", {
              minDate: new Date(),
            });
          } else {
            this.mainForm.updateProps("loanDate", {
              minDate: new Date(loanDate),
            });
          }

          this.mainForm.form.get("loanDate").patchValue(loanDate);
        }

        if (balloonPct) {
          this.mainForm
            .get("balloonPct")
            .patchValue(balloonPct, { emitEvent: false });
        }
        if (fixed) {
          this.mainForm.get("fixed").patchValue(fixed, { emitEvent: false });
        }
      }
    }

    if (this.baseFormData?.productCode == "FL") {
      this.mainForm?.updateHidden({
        paymentStructure: true,
        balloonAmount: true,
        orLabel: true,
        balloonPct: true,
        fixed: true,
        loanDate: true,
        initialLeasePayment: false,
        leaseDate: false,
        noOfRentalsInAdvance: true,
      });

      // this.mainForm.updateClass({ paymentCalculatebtn: "col-3" }, "className");

      this.mainForm.form
        ?.get("initialLeasePayment")
        // .patchValue(this.baseFormData?.initialLeasePayment);
        .patchValue(this.baseFormData?.firstLeasePayment);
      // this.mainForm
      //   .get("leaseDate")
      //   .setValidators(this.calculationSvc.pastDateValidator());
    } else if (this.baseFormData?.productCode == "OL") {
      this.mainForm.updateCols({ firstPaymentDate: null, leaseDate: null });
      this.mainForm?.updateHidden({
        paymentStructure: true,
        balloonAmount: true,
        orLabel: true,
        balloonPct: true,
        fixed: true,
        loanDate: true,
        initialLeasePayment: true,
        noOfRentalsInAdvance: false,
        leaseDate: false,
      });
      this.mainForm
        .get("leaseDate")
        .setValidators(this.calculationSvc.pastDateValidator());
        this.mainForm.updateProps("noOfRentalsInAdvance", {
        label: "No. of Payment in Advance",
         cols: 3,
        className: 'mt-1',
        labelClass: 'mb-0 mt-1',
      })
      this.mainForm.updateProps("paymentCalculatebtn", { className: "mt-2 ml-4"});
    } else if (this.baseFormData?.productCode == "AFV") {
      this.mainForm?.updateHidden({
        paymentStructure: true,
        balloonAmount: true,
        orLabel: true,
        balloonPct: true,
        fixed: true,
        loanDate: false,
        initialLeasePayment: true,
        noOfRentalsInAdvance: true,
        leaseDate: true,
      });
      this.mainForm.removeValidators("balloonAmount", Validators.required);
    } else {
      this.mainForm?.updateHidden({
        paymentStructure: false,
        balloonAmount: false,
        orLabel: false,
        balloonPct: false,
        fixed: false,
        loanDate: false,
        initialLeasePayment: true,
        noOfRentalsInAdvance: true,
        leaseDate: true,
      });
    }
  }
  override onStatusChange(statusDetails: any): void {
    super.onStatusChange(statusDetails);

    if((configure?.workflowStatus?.view?.includes(statusDetails?.currentState)) || (configure?.workflowStatus?.edit?.includes(statusDetails?.currentState))){
      this.isDisable = true;
    }
    if (this.isDisable) {
      this.mainForm?.updateDisable({ paymentCalculatebtn: true });
    } else {
      this.mainForm?.updateDisable({ paymentCalculatebtn: false });
    }
  }
  paymentStructureOptions: any = [];
// Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   autoResponsive: true,
  //   cardType: "non-border",
  //   api: "",
  //   goBackRoute: "",
  //   createData: {
  //     // loanDate: this.loanDate,
  //   },
  //   fields: [
  //     {
  //       type: "date",
  //       label: "Loan Date",
  //       name: "loanDate",
  //       // validators: [this.calculationSvc.pastDateValidator()],
  //       // cols: 3,
  //       className: "ml-2 mr-3 col-fixed w-11rem",
  //       nextLine: false,
  //       inputClass:"mt-3",
  //       // errorMessage: "Loan date must not be in past",
  //       hidden: false,
  //       inputType: "vertical",
  //       // dateFormat: 'mm/dd/yy',
  //       minDate: new Date(),
  //     },
  //     {
  //       type: "date",
  //       label: "Lease Date",
  //       name: "leaseDate",

  //       // cols: 3,
  //       className: "mr-4 col-fixed w-11rem",
  //       nextLine: false,
  //       errorMessage: "Lease date must not be in past",
  //       inputType: "vertical",
  //       inputClass:"mt-3",
  //       hidden: true,
  //     },
  //     {
  //       type: "date",
  //       label: "First Payment",
  //       name: "firstPaymentDate",
  //       //  validators: [Validators.required,this.calculationSvc.firstPaymentAfterLoanDateValidator('loanDate'),//  validation comment
  //       // ],
  //       // cols: 3,
  //       className: "mr-4 col-fixed w-11rem",
  //       inputClass:"mt-3",
  //       inputType: "vertical",
  //       // errorMessage: "First Payment Date must be after Loan Date ",
  //       nextLine: false,
  //       // disabled: true,
  //       // mode: Mode.view,
  //     },
  //     {
  //       type: "amount",
  //       label: "Initial Lease Amount",
  //       name: "initialLeasePayment",
  //       // cols: 3,
  //       className: "mr-4 col-fixed w-11rem",
  //       nextLine: false,
  //       hidden: true,
  //       inputType: "vertical",
  //       // dateFormat: 'MM.dd.yy',
  //     },
  //     {
  //       type: "number",
  //       label: "No. of Rentals in Advance",
  //       name: "noOfRentalsInAdvance",
  //       // validators: [Validators.max(11), Validators.min(0)], //  validation comment
  //       cols: 4,
  //       hidden: true,
  //       inputType: "vertical",
  //     },
  //     {
  //       type: "button",
  //       label: "Calculate",
  //       submitType: "internal",
  //       name: "paymentCalculatebtn",
  //       disabled: this.baseSvc.accessMode == "view",
       
  //       btnType: "border-btn",
  //       className: "col-2",
  //       nextLine: true,
  //       isVibrate: false,
  //     },
  //     {
  //       type: "select",
  //       label: "Payment Structure",
  //       name: "paymentStructure",
  //       alignmentType: "vertical",
  //       cols: 3,
  //       className: "mr-3",
  //       inputClass:"mt-3",
  //       // list$: "LookUpServices/lookups?LookupSetName=PaymentStructure",\
  //       options: this.paymentStructureOptions,
  //     },
  //     {
  //       type: "amount",
  //       label: "Balloon Amount",
  //       name: "balloonAmount",
  //       maxLength: 12,
  //       className: "mt-2 balloonInput col-fixed w-11rem",
  //       labelClass: " blnInput -mt-3 py-2 ",
  //       disabled: true,
  //       inputType: "vertical",
  //       inputClass:"mt-2",
  //       default: 0,
  //       // validators: [Validators.required],//  validation comment
  //     },
  //     {
  //       type: "label-only",
  //       name: "orLabel",
  //       typeOfLabel: "inline",
  //       label: "OR",

  //       className: "mt-6 text-center col-fixed w-2rem",
  //     },
  //     {
  //       type: "percentage",
  //       name: "balloonPct",
  //       cols: 2,
  //       className: "mt-5 balloonInput col-fixed w-6rem ml-3",
  //       labelClass: "labels pb-8",
  //       default: 0,
  //       // suffix: '%',
  //       // maxFractionDigits: 2,
  //       disabled: true,
  //       // validators: [Validators.max(99), Validators.maxLength(2)], //  validation comment
  //     },

  //     {
  //       type: "checkbox",
  //       label: "Fixed",
  //       name: "fixed",
  //       cols: 3,
  //       className: "mt-6",
  //       // disabled :true,
  //       mode: Mode.view,
  //     },

  //     //start:hidden variables
  //     {
  //       type: "currency-label",
  //       className: "text-right",
  //       typeOfLabel: "inline",
  //       label: "0",
  //       name: "readOnlyPaymentAmount",
  //       hidden: true,
  //       // cols: 3,
  //     },
  //     {
  //       type: "currency-label",
  //       className: "text-right",
  //       typeOfLabel: "inline",
  //       label: "0",
  //       name: "readOnlyLastPayment",
  //       hidden: true,
  //       // cols: 3,
  //     },

  //     {
  //       type: "currency-label",
  //       className: "text-right",
  //       typeOfLabel: "inline",
  //       label: "0",
  //       name: "readOnlytotalAmountToRepay",
  //       hidden: true,
  //       // cols: 3,
  //     },
  //     {
  //       type: "number",
  //       className: "text-right",
  //       label: "0",
  //       name: "readOnlyTotalNumberOfPayments",
  //       hidden: true,
  //       // cols: 3,
  //     },
  //     {
  //       type: "number",
  //       className: "text-right",
  //       label: "0",
  //       name: "readOnlyfirstLeasePayment",
  //       hidden: true,
  //       // cols: 3,
  //     },
  //     {
  //       type: "date",
  //       label: "0",
  //       name: "readOnlylastPaymentDate",
  //       hidden: true,
  //       // cols: 3,
  //     },
  //     //end:hidden variables
  //   ],
  // };

   override formConfig: any = {
    autoResponsive: true,
    cardType: "non-border",
    api: "",
    goBackRoute: "",
    createData: {
    },
    fields: [],
  }
  
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public cdr: ChangeDetectorRef,
    public calculationSvc: CalculationService,
    public toasterSvc: ToasterService,
    private validationSvc: ValidationService,
    private dashBoardSvc: DashboardService,
    private router: Router,
    public tradeSvc: AssetTradeSummaryService,
    public indSvc : IndividualService,
    public businessSvc : BusinessService,
    public trustSvc : TrustService,
    public soleTradeSvc : SoleTradeService,
    public quickquoteService : QuickQuoteService
  ) {
    super(route, svc, baseSvc);

    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName, this.pageCode);
    console.log('payment-summary.component ts', filteredValidations);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };


    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.formConfig.createData.loanDate = new Date();
effect(() => {
  const triggeredLoanDate = this.baseSvc.loanDateSignal();
  if (!triggeredLoanDate || !this.mainForm) return;

  const updatedLoanDate = new Date(triggeredLoanDate);

  const currentLoanDate = this.mainForm.get("loanDate")?.value;
  const currentFirstPayment = this.mainForm.get("firstPaymentDate")?.value;

  let dayGap = 0;

  if (currentLoanDate && currentFirstPayment) {
    dayGap = Math.floor(
      (new Date(currentFirstPayment).getTime() -
        new Date(currentLoanDate).getTime()) /
        (24 * 60 * 60 * 1000)
    );
  }

  const newFirstPaymentDate = new Date(updatedLoanDate);
  newFirstPaymentDate.setDate(newFirstPaymentDate.getDate() + dayGap);

  const maxFirstPaymentDate = new Date(updatedLoanDate);
  maxFirstPaymentDate.setDate(maxFirstPaymentDate.getDate() + 42);

  this.mainForm.updateProps("firstPaymentDate", {
    minDate: updatedLoanDate,
    maxDate: maxFirstPaymentDate
  });

  this.mainForm.get("loanDate")?.patchValue(updatedLoanDate);

  const fpControl = this.mainForm.get("firstPaymentDate");
  fpControl?.patchValue(null);
  this.cdr.detectChanges();
  fpControl?.patchValue(newFirstPaymentDate);

  this.baseFormData.loanDate = this.baseSvc.createDateFormat(updatedLoanDate);
  this.baseFormData.firstPaymentDate = this.baseSvc.createDateFormat(newFirstPaymentDate);

  this.baseSvc.setBaseDealerFormData({
    loanDate: this.baseSvc.createDateFormat(updatedLoanDate),
    firstPaymentDate: this.baseSvc.createDateFormat(newFirstPaymentDate),
    financialAssetPriceSegments: []
  });

  (async () => {
    await this.onButtonClick({ field: { name: "paymentCalculatebtn" } });

    if (this.baseFormData?.contractId && this.baseFormData?.AFworkflowStatus == 'Quote') {
      // await this.baseSvc.contractModification(this.baseFormData, false);

      await this.getDeclaration()
    }
  })();

  this.baseSvc.loanDateSignal.set(null);
}, { allowSignalWrites: true });
  }

  previousDate: any = null;
  currentDate: any = null;
  // loanDatePopup() {}
  program: any;

   async getDeclaration() {
      // todo
  
      let params: any = this.route.snapshot.params;
      let additionalData: any = await this.svc.data
        .get(
          `WorkFlows/get_workflowstate?ContractId=${this.baseFormData?.contractId}&workflowName=Application`
        )
        .pipe(
          map((res) => {
            return res?.items;
          })
        )
        .toPromise();
  
      if (additionalData.length > 0) {
        let customerSummaryData;
        customerSummaryData = this.baseFormData?.customerSummary?.find((ele) => {
          return ele?.customerRole == 1;
        });
  
        if (!customerSummaryData) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: "At least one Borrower must have been added to the quote.",
          });
          return;
        }
  
        let todoObj = additionalData.find((ele) => {
          return ele?.mandetory && !ele.status;
        });
  
        if (todoObj) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: "Please Complete the To-Dos",
          });
          return;
        }
      }
  
      if (
        this.baseFormData?.workFlowStatus == "Open Quote" ||
        this.baseFormData?.AFworkflowStatus == "Quote"
        ) {
        this.svc.dialogSvc
          .show(DealerUdcDeclarationComponent, "Originator Declaration", {
            templates: {
              footer: null,
            },
            data: {
              // okBtnLabel: 'Proceed',
              // cancelBtnLabel: 'Cancel',
            },
            width: "80vw",
          })
          ?.onClose.subscribe(async (data: CloseDialogData) => {
            if (data?.btnType == "submit") {
            let updateContractRes = await this.baseSvc.contractModification(this.baseFormData, false);
          
            if(updateContractRes?.apiError || updateContractRes?.Error?.Message){
              return;
            }

            else {

               let updateWorkflow = await this.updateState("Submitted");

              if (
                updateWorkflow !== false &&
                this.baseFormData.contractId &&
                data?.btnType == "submit" &&
                data?.data?.formData &&
                data?.data?.formData?.isPrivacyAuthorization &&
                data?.data?.formData?.isFinancialAdvise
              ) {
                // alert(JSON.stringify(data?.data?.formData));
                // todo proceed api
                this.svc.dialogSvc
                  .show(FinalConfirmationComponent, "", {
                    data: this.baseFormData,
                  })
                  ?.onClose.subscribe((data: CloseDialogData) => {
                    if (data?.btnType == "submit") {
                      this.baseSvc.resetBaseDealerFormData();
                      this.indSvc.resetBaseDealerFormData();
                      this.businessSvc.resetBaseDealerFormData();
                      this.trustSvc.resetBaseDealerFormData();
                      this.baseSvc.individualDataSubject.unsubscribe();
                      this.tradeSvc.resetData();
                      this.quickquoteService.resetData();
                      this.router.navigateByUrl("/dealer");
                      this.baseSvc.activeStep = 0;
                    }
                  });
              } 
              else if (data?.btnType == "submit" && this.baseFormData.contractId) {

                await this.baseSvc.contractModification(this.baseFormData, false);
                this.svc.dialogSvc
                  .show(FinalConfirmationComponent, "", {
                    data: {
                      data: this.baseFormData,
                    },
                    templates: {
                      footer: null,
                    },
                    width: "60vw",
                  })
                  ?.onClose.subscribe((data: CloseDialogData) => {
                    if (data?.btnType == "submit") {
                      this.baseSvc.resetBaseDealerFormData();
                      this.indSvc.resetBaseDealerFormData();
                      this.businessSvc.resetBaseDealerFormData();
                      this.trustSvc.resetBaseDealerFormData();
                      this.baseSvc.individualDataSubject.unsubscribe();
                      this.tradeSvc.resetData();
                      this.quickquoteService.resetData();
                      this.router.navigateByUrl("/dealer");
                      this.baseSvc.activeStep = 0;
                    }
                  });
                // alert('Declaration form is unchecked!');
              }
            }
              //  else if (!(data?.btnType == "cancel") && !this.id) {
              //   // this.toasterService.showToaster({
              //   //   severity: 'error',
              //   //   detail: 'Quote Id Not Found',
              //   // });
              // }
              // else {
              //   this.toasterService.showToaster({
              //     severity: 'error',
              //     detail: 'Quote Id Not Found',
              //   });
              // }
            }
          });
      } else {
        this.router.navigateByUrl("/dealer");
      }
    }

    //  async updateState(nextState) {
    //       let request = {
    //         nextState: nextState,
    //         isForced: false,
    //       };
    //       let state = await this.svc.data
    //         .put(
    //           `WorkFlows/update_workflowstate?contractId=${this.baseFormData?.contractId}&workflowName=Application&WorkFlowId=${this.baseFormData?.AFworkflowId}`,
    //           request
    //         )
    //         .pipe(
    //           map((res) => {
    //             if(res?.data?.data){
    //             return res?.data?.data;
    //           }
    //           else if(res?.apiError?.errors.length > 0){
    
    //             let errors = res?.apiError?.errors
    
    //              const messages: Message[] = errors.map((err) => ({
    //                 severity: "error",
    //                 detail: err?.message,
    //               }));
    //               this.toasterSvc.showMultiple(messages);
    //               return;
    //           }
    //           })
    //         )
    //         .toPromise();
    
    //         if(state){
    //         this.baseSvc?.appStatus?.next({
    //           currentState: state?.currentState?.name,
    //           nextState: state?.defaultNextState?.name,
    //         });
    //       }
    //     }
      async updateState(nextState): Promise<any | false> {
      try {
        const request = {
          nextState: nextState,
          isForced: false,
        };
        
        const response = await this.svc.data
          .put(
            `WorkFlows/update_workflowstate?contractId=${this.baseFormData?.contractId}&workflowName=Application&WorkFlowId=${this.baseFormData?.AFworkflowId}`,
            request
          )
          .pipe(
            catchError(() => of(null)) // Convert errors to null
          )
          .toPromise();
    
        // Check for API-level errors
        if ((response?.apiError?.errors?.length > 0 ) || (response?.Error?.Message )) {
          return false;
        }
        
        const stateData = response?.data?.data;
        
        // If successful response with data
        if (stateData) {
          this.baseSvc?.appStatus?.next({
            currentState: stateData?.currentState?.name,
            nextState: stateData?.defaultNextState?.name,
          });
          return stateData;
        }
        
        return false;
        
      } catch (error) {
        return false;
      }
    }

  override async onFormDataUpdate(res: any): Promise<void> {
    if (res?.programId && this.program !== res?.programId) {
      this.program = res.programId;
      await this.setTermOverride(res);
    }

    const paymentStructureValue =
    this.mainForm?.get("paymentStructure")?.value ?? res?.paymentStructure;

  if (paymentStructureValue === "None" && this.baseFormData?.workFlowStatus == 'Open Quote') {
    this.mainForm?.get("balloonAmount")?.enable();
    this.mainForm?.get("balloonPct")?.enable();
    this.mainForm?.get("fixed")?.enable();
  } else {
    this.mainForm?.get("balloonAmount")?.disable();
    this.mainForm?.get("balloonPct")?.disable();
    this.mainForm?.get("fixed")?.disable();
    this.mainForm?.get("balloonAmount")?.patchValue(0);
    this.mainForm?.get("balloonPct")?.patchValue(0);
    this.mainForm?.get("fixed")?.patchValue(false);
  }
    // if (res?.productCode === "FL") {
    //   setTimeout(() => {
    //     const leaseDate = this.mainForm.form.get("leaseDate")?.value;
    //      if (leaseDate) {
    //       const control = this.mainForm.form.get("firstPaymentDate");

    //       if (control) {
    //         // set value without events
    //         control.patchValue(leaseDate, { emitEvent: false });

    //         // clearing validations
    //         // control.clearValidators();
    //         // control.setErrors(null);
    //         // control.updateValueAndValidity({ emitEvent: false });
    //       }

    //       this.mainForm.updateProps("firstPaymentDate", {
    //   readOnly: true,
    //   required: true
    // });

    //     }
    //   });
    // }

    // if (res?.productCode === "FL")
    //   {
    //   setTimeout(() => {
    //      const leaseDate = this.mainForm.form.get("leaseDate")?.value;
    //       if (leaseDate) { this.mainForm.form.patchValue( {
    //          firstPaymentDate: leaseDate
    //         },
    //          { emitEvent: false }
    //         );
    //         this.mainForm.updateProps("firstPaymentDate", { readOnly: true, required: true });
    //       )
    //     }

    if (res?.productCode === "FL") {
      this.mainForm.get("firstPaymentDate").disable()
        const leaseDate = this.mainForm.form.get("leaseDate")?.value;
        if (leaseDate) {
          this.mainForm.form.patchValue(
            { firstPaymentDate: leaseDate },
          );
        }
    }
    
    if (
      this.baseFormData?.loanDate !== res?.loanDate &&
      res?.loanDate &&
      this.mode == "create"
    ) {
      if (this.previousDate) {
        this.previousDate = this.baseFormData?.loanDate;
      }

      this.currentDate = res.loanDate;
      if (
        this.mainForm.get("loanDate")?.value &&
        new Date(this.mainForm.get("loanDate")?.value) > new Date()
      ) {
        const dialogRef = null;
        // this.svc.dialogSvc.show(
        //   LoanDateValidationPopupComponent,
        //   '',
        //   {
        //     templates: {
        //       footer: null,
        //     },
        //     data: {
        //       previousLoanDate:
        //         this.previousDate || this.baseFormData?.loanDate,
        //       currentSelected: this.currentDate,
        //     },
        //     width: '40vw',
        //   }
        // );
        if (dialogRef) {
          dialogRef.onClose.subscribe((data: CloseDialogData) => {
            if (data?.data.updateLoanDate) {
              this.mainForm
                .get("loanDate")
                .patchValue(data?.data?.updateLoanDate);
              this.previousDate = this.baseFormData?.loanDate;
            } else if (data?.data.loanDate) {
              this.mainForm.get("loanDate").patchValue(data?.data.loanDate);
              this.currentDate = this.baseFormData?.loanDate;
            }
          });
        }
      }
    }

    // if (
    //   this.mainForm.get('loanDate')?.value &&
    //   new Date(this.mainForm.get('loanDate')?.value) > new Date()
    // ) {
    //   const dialogRef = this.svc.dialogSvc.show(
    //     LoanDateValidationPopupComponent,
    //     '',
    //     {
    //       templates: {
    //         footer: null,
    //       },
    //       data: {
    //         previousLoanDate: this.previousDate,
    //         currentSelected: this.currentDate,
    //       },
    //       width: '40vw',
    //     }
    //   );
    //   if (dialogRef) {
    //     dialogRef.onClose.subscribe((data: CloseDialogData) => {

    //       if (data?.data.updateLoanDate) {
    //         this.mainForm
    //           .get('loanDate')
    //           .patchValue(data?.data?.updateLoanDate);
    //         this.previousDate = this.baseFormData?.loanDate;
    //       } else if (data?.data.loanDate) {
    //         this.mainForm.get('loanDate').patchValue(data?.data.loanDate);
    //         this.currentDate = this.baseFormData?.loanDate;
    //       }
    //     });
    //   }
    // }

    if (res?.cashPriceValue !== this.cashPrice) {
      this.cashPrice = res?.cashPriceValue;
    }

    if (
      this.baseFormData?.cashPriceValue != res?.cashPriceValue &&
      res?.cashPriceValue
    ) {
      this.cashPrice = res?.cashPriceValue;
      this.convertPctToAmount(
        "balloonAmount",
        this.mainForm?.get("balloonPct")?.value
      );
      // this.convertAmountToPct("balloonPct", event.data.value);
    }

    if (res?.fixed == true) {
      this.mainForm.form.get("balloonAmount").disabled;
      this.mainForm.form.get("balloonPct").disabled;
    }
    this.isKeyInfo = true;
    

    //  if (this.paymentStructureOptions.length === 1 &&  this.paymentStructureOptions[0].value === "None") 
    //   {        
    //   this.mainForm.form.get("balloonAmount").disable();
    //   this.mainForm.form.get("balloonPct").disable();              
    //    }
  }

async setTermOverride(res) {
  await this.svc.data
    .post("LookUpServices/CustomData", {
      parameterValues: ["Payment Structure Override", String(res.programId)],
      procedureName: configure.SPProgramListExtract,
    })
    .pipe(
      map(
        async (response) => {
          if (response?.data?.table && Array.isArray(response?.data?.table)) {
            if (
              response?.data?.table?.length === 1 &&
              response?.data?.table[0]?.value_text === "None"
            ) {
              // Using await to wait for the response
              const lookupRes = await lastValueFrom(
                this.svc.data.get(
                  "LookUpServices/lookups?LookupSetName=PaymentStructure"
                )
              );

              if (lookupRes?.data && Array.isArray(lookupRes.data)) {
                this.paymentStructureOptions = lookupRes.data.map((item) => ({
                  label: item.lookupValue,
                  value: item.lookupValue,
                }));

                this.mainForm.updateList(
                  "paymentStructure",
                  this.paymentStructureOptions
                );
                
                // Disable dropdown if only "None" option exists
                if (this.paymentStructureOptions.length === 1 && 
                    this.paymentStructureOptions[0].value === "None") {
                  setTimeout(() => {
                    this.mainForm.form.get('paymentStructure')?.disable();
                    this.mainForm.updateProps('paymentStructure', {
                      readOnly: true,
                      mode: Mode.view
                    });
                  });
                }
                
                this.cdr.detectChanges();
              }
            } else if (response?.data?.table?.length >= 1) {
              // Map the response data to options
              // this.mainForm.updateProps("term", { type: "select" });
              this.paymentStructureOptions = response?.data?.table.map(
                (item) => ({
                  label: item.value_text,
                  value: item.value_text,
                })
              );
              
              let obj = this.paymentStructureOptions?.find(
                (ele) => ele?.value == "None"
              );
              if (!obj) {
                this.paymentStructureOptions?.push({
                  label: "None",
                  value: "None",
                });
              }

              this.mainForm?.updateList(
                "paymentStructure",
                this.paymentStructureOptions
              );
              
              // Disable dropdown if only "None" option exists
              if (this.paymentStructureOptions.length === 1 && 
                  this.paymentStructureOptions[0].value === "None") {
                setTimeout(() => {
                  this.mainForm.form.get('paymentStructure')?.disable();
                  this.mainForm.updateProps('paymentStructure', {
                    readOnly: true,
                    mode: Mode.view
                  });
                });
              } else {
                // Enable dropdown if multiple options exist
                setTimeout(() => {
                  this.mainForm.form.get('paymentStructure')?.enable();
                  this.mainForm.updateProps('paymentStructure', {
                    readOnly: false,
                    mode: Mode.edit
                  });
                });
              }
              
            } else if (response?.data?.table?.length === 0) {
              this.paymentStructureOptions = [
                {
                  label: "None",
                  value: "None",
                },
              ];
              this.mainForm?.updateList(
                "paymentStructure",
                this.paymentStructureOptions
              );
              
              // Disable since only "None" option exists
              setTimeout(() => {
                this.mainForm.form.get('paymentStructure')?.disable();
                this.mainForm.updateProps('paymentStructure', {
                  readOnly: true,
                  mode: Mode.view
                });
              });
              
              this.cdr.detectChanges();
            }
          }
        },
        (error) => {
          // console.error('Error fetching term options:', error);
        }
      )
    )
    .toPromise();
}




  fieldValidations() {
    // Program & Product
    if (!(this.baseFormData?.productId && this.baseFormData?.programId)) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Select Program and Product",
      });
      return true;
    }

    // Term
    if (!this.baseFormData?.term) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Please add term",
      });
      return true;
    }

    // Asset Type
    if (!this.baseFormData?.assetTypeDD) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `Please fill Financial Asset!`,
      });
      return true;
    }

    // Cash Price
    if (
      !this.baseFormData?.cashPriceValue ||
      this.baseFormData?.cashPriceValue <= 0
    ) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `Please add cash price`,
      });
      return true;
    }

    // First Payment Date
    if (
      !this.baseFormData?.firstPaymentDate &&
      this.baseFormData?.productCode !== "FL"
    ) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `First payment date is required`,
      });
      return true;
    }

    // Loan Date
    if (!this.baseFormData?.loanDate) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `Loan date is required`,
      });
      return true;
    }

    // Physical Asset
    if (
      !this.baseFormData?.physicalAsset ||
      this.baseFormData.physicalAsset.length === 0
    ) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `Please add at least one physical asset!`,
      });
      return true;
    }

    // Validate each physical asset
    let isEveryAssetValid = this.baseFormData?.physicalAsset?.every(
      (ele) => ele?.assetName
    );

    if (!isEveryAssetValid) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `Please add asset in physical asset!`,
      });
      return true;
    }

    // Trade-in validation
    if (
      this.baseFormData?.tradeInAssetRequest?.length == 0 &&
      this.baseFormData?.tradeAmountPrice > 0
    ) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `Please add asset in trade-in!`,
      });
      return true;
    }

    // If everything is valid
    return false;
  }


  override async onButtonClick(event: any): Promise<void> {
    if (event?.field?.name == "paymentCalculatebtn") {
      if(this.isDisable || ((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus)))){
        return;
      }
      if (!(this.baseFormData?.productId && this.baseFormData?.programId)) {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Select Program and Product",
        });
        return null;
      } else if (!this.baseFormData?.term) {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "Please add term",
        });
        return null;
      } else {
        if (!this.baseFormData?.assetTypeDD) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: `Please fill Financial Asset!`,
          });
          return;
        }

        if (
          !this.baseFormData?.cashPriceValue ||
          this.baseFormData?.cashPriceValue <= 0
        ) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: `Please add cash price`,
          });
          return;
        }

        if (
          !this.baseFormData?.firstPaymentDate &&
          this.baseFormData?.productCode !== "FL"
        ) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: `First payment date is required`,
          });
          return;
        }

        if (!this.baseFormData?.loanDate) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: `Loan date is required`,
          });
          return;
        }

        if (
          !this.baseFormData?.physicalAsset ||
          this.baseFormData.physicalAsset.length === 0
        ) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: `Please add at least one physical asset!`,
          });
          return;
        }
        let isEveryAssetValid = this.baseFormData?.physicalAsset?.every(
          (ele) => {
            return ele?.assetName;
          }
        );
        if (!isEveryAssetValid) {
          this.toasterSvc.showToaster({
            severity: "error",
            detail: `Please add asset in phyical asset!`,
          });
          return;
        }
        let defaults = [];
        if (this.baseSvc.changedDefaults?.term) {
          // defaults.push("term");
        }
        if (this.baseSvc.changedDefaults?.asset) {
          // defaults.push("asset type");
        }
        // }

        //check for the trad in amount check
        // if (
        //   this.baseFormData?.tradeInAssetRequest?.length == 0 &&
        //   this.baseFormData?.tradeAmountPrice > 0
        // ) {
        //   this.toasterSvc.showToaster({
        //     severity: "error",
        //     detail: `Please add asset in trade-in!`,
        //   });
        //   return;
        // }

        //Increase Decreasew Validations:

        if(this.baseFormData?.AFworkflowStatus === "Ready for Documentation") {
      
          const errors = [];
    
          if(this.baseFormData?.cashPriceValue > this.baseFormData?.apicashPriceValue) {
            errors.push("Cash Price cannot increase in Ready for Documentation stage.");
          }
          if(this.baseFormData?.udcEstablishmentFee > this.baseFormData?.apiudcEstablishmentFee) {
            errors.push("UDC Establishment Fee cannot increase in Ready for Documentation stage.");
          }
          if(this.baseFormData?.dealerOriginationFee > this.baseFormData?.apidealerOriginationFee) {
            errors.push("Dealer Origination Fee cannot increase in Ready for Documentation stage.");
          }
         if (this.baseFormData?.tradeAmountPrice < this.baseFormData?.apitradeAmount) {
            errors.push("Trade-in Amount cannot decrease in Ready for Documentation stage.");
          }
          if(this.baseFormData?.settlementAmount > this.baseFormData?.apisettlementAmount) {
            errors.push("Settlement Amount cannot increase in Ready for Documentation stage.");
          }
          if(this.baseFormData?.interestRate > this.baseFormData?.apiinterestRate) {
            errors.push("Interest Rate cannot increase in Ready for Documentation stage.");
          }
          if(this.baseFormData?.deposit < this.baseFormData?.apideposit){
            errors.push("Deposit cannot decrease in Ready for Documentation stage.");
          }
          if(this.baseFormData?.depositPct < this.baseFormData?.apidepositPct){
            errors.push("Deposit % cannot decrease in Ready for Documentation stage.");
          }
          if(this.baseFormData?.ppsrCount > this.baseFormData?.apippsrCount && this.baseFormData?.productCode == "AFV"){
            errors.push("PPSR Count cannot increase in Ready for Documentation stage.");
          }
          if(this.baseFormData?.maintainanceCost > this.baseFormData?.apimaintainanceCost && this.baseFormData?.productCode == "OL"){
            errors.push("Maintenance Cost cannot increase in Ready for Documentation stage.");
          }
          if(this.baseFormData?.financedMaintainanceCharge > this.baseFormData?.apifinancedMaintainanceCharge && this.baseFormData?.productCode == "OL"){
            errors.push("Financed Maintenance Charge cannot increase in Ready for Documentation stage.");
          }
    
          if (errors.length) {
            const messages: Message[] = errors.map((err) => ({
              severity: "error",
              detail: err,
            }));
            this.toasterSvc.showMultiple(messages);
            return;
          }
        }


const firstPaymentDateValue = this.mainForm?.form?.get('firstPaymentDate')?.value;
this.baseFormData.firstPaymentDate = firstPaymentDateValue
  ? this.baseSvc.createDateFormat(firstPaymentDateValue)
  : null;
await this.baseSvc.contractPreview(this.baseFormData, defaults);
this.baseFormData.firstPaymentDate = firstPaymentDateValue;
if (firstPaymentDateValue) {
  this.mainForm?.form?.get('firstPaymentDate')?.patchValue(firstPaymentDateValue, { emitEvent: false });
}
        this.baseSvc.udcAndDealerFeeChanged.next({
          udcEstablishmentFee: this.baseFormData?.udcEstablishmentFee,
          dealerOriginationFee: this.baseFormData?.dealerOriginationFee,
        });

        this.baseSvc.forceToClickCalculate.next(false);
        this.dashBoardSvc.isDealerCalculated = false;
        this.baseSvc.calculatedOnce = true;
        this.baseSvc.changedDefaults = {
          product: false,
          program: false,
          term: false,
          asset: false,
          paymentStructure: false,
        };

        const flow = this.baseSvc.getFirstInstallmentFlow(this.baseFormData);

        if (this.baseFormData?.productCode == "FL") {
          this.mainForm.form
            ?.get("initialLeasePayment")
            ?.patchValue(
              this.baseFormData?.initialLeasePayment
                ? this.baseFormData?.initialLeasePayment
                : flow?.amtGross
            );
        }

        this.mainForm.updateProps("fixed", { mode: Mode.edit });
      }
    }
  }

  override onCalledPreview(mode: any): void {
    super.onCalledPreview(mode);
    // this?.mainForm?.updateProps('firstPaymentDate', {
    //   minDate: this?.baseSvc?.convertStringToDate(this?.baseFormData?.firstPaymentDate)
    // })
  }

  // createQuick(productId?: number, programId?: number) {
  //   // Validation: Check for required fields
  //   if (!productId || !programId || !this.baseFormData) {
  //     console.error(
  //       "Missing required fields: productId, programId, or baseFormData"
  //     );
  //     return null;
  //   }

  //   const request = {
  //     queryArgs: {
  //       contractDefaultingCriteria: [],
  //     },
  //     Data: {
  //       isDraft: false,
  //       ...(productId ? { product: { productId } } : {}),
  //       program: {
  //         programId,
  //       },
  //       installmentFrequency: this.baseFormData.frequency,
  //       paymentStructure: this.baseFormData.paymentStructure,
  //       lessorRate: this.baseFormData.interestRate ?? 0,
  //       financialAssets: [
  //         {
  //           assetName: "Asset1",
  //           assetType: { assetTypeId: 29 },
  //           cost: this.baseFormData.cashPriceValue ?? 0,
  //           financialAssetLease: {
  //             scheduleTerm:
  //               this.baseFormData?.termOptions ?? this.baseFormData?.term,
  //             pctResidualValue: Number(
  //               (this.baseFormData.residualValue ?? 0).toFixed(2)
  //             ),
  //             balloonDt: new Date(Date.now() + 86400000).toISOString(),
  //             residualValue: this.baseFormData.residualAmount ?? 0,
  //             amtBalloon: this.baseFormData.balloonAmount ?? 0,
  //             pctBalloon: Number(
  //               (this.baseFormData.balloonPct ?? 0).toFixed(2)
  //             ),
  //             financialAssetPriceSegments: [{ amtSegment: 0 }],
  //           },
  //           physicalAsset: {
  //             model: "",
  //             assetClassEnum: "Vehicle",
  //             originalPurchasePrice: 0,
  //             originalPurchaseDt: "2025-07-21T00:00:00",
  //             assetCondition: "New",
  //             vehicle: {
  //               productionDt: "2025-07-20T00:00:00",
  //               firstRegistrationDt: "2025-07-20T00:00:00",
  //               ownershipDt: "2025-07-20T00:00:00",
  //             },
  //           },
  //           customFlows: [
  //             {
  //               amount: this.mainForm?.form?.get("deposit")?.value ?? 0,
  //               isInputAsPercent: false,
  //               customFlowHdr: {
  //                 name:
  //                   this.baseFormData?.productCode === "FL"
  //                     ? "Deposit to Supplier"
  //                     : "Deposit to UDC",
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //       taxProfile: {
  //         id: 3,
  //         name: "Finance Lease",
  //         code: "FL",
  //       },
  //       customFieldGroups: [
  //         {
  //           name: "Standard Payment Option",
  //           items: [
  //             {
  //               rowNo: 0,
  //               customFields: [
  //                 {
  //                   name: "KM Allowance",
  //                   value: this.baseFormData.kmAllownace ?? 0,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //       flows: [{ amount: this.baseFormData.flowAmount ?? 0 }],
  //     },
  //   };

  //   return request;
  // }

  getAFVQuickQuoteData() {
    let payload = {
      queryArgs: {
        contractDefaultingCriteria: [],
      },
      Data: {
        isDraft: false,
        product: {
          productId: this.baseFormData?.productId,
        },
        program: {
          programId: this.baseFormData?.programId,
        },
        lessorRate: this.baseFormData?.interestRate,
        financialAssets: [
          {
            assetName: this.baseFormData?.assetTypeDD,
            assetType: {
              assetTypeId: this.baseFormData?.assetTypeId,
            },
            cost: this.baseFormData?.cashPriceValue,
            financialAssetLease: {
              scheduleTerm: this.baseFormData?.term,
              residualValue: 0,

              pctResidualValue: this.baseFormData.assuredFutureValue || 0,
              balloonDt: "2024-11-07T11:55:40.653Z",
              financialAssetPriceSegments: [
                {
                  amtSegment: 3000,
                },
              ],
            },
            physicalAsset: {
              model: "",
              assetClassEnum: "Vehicle",
              reference: "",
              originalPurchasePrice: 500000.0,
              originalPurchaseDt: "2024-07-19T00:00:00",
              assetCondition: "New",
              assetCheckStatus1: "None",
              assetCheckStatus2: "None",
              vehicle: {
                vinNo: "",
                commNo: "",
                registrationNo: "",
                registrationType: "",
                isPersonalisedPlates: false,
                productionDt: "2024-07-19T00:00:00",
                firstRegistrationDt: "2024-07-19T00:00:00",
                ownershipDt: "2024-07-19T00:00:00",
                makeCode: "",
                model: "",
                modelCode: "",
                subModel: "",
                subModelYear: "",
                derivative: "",
                badge: "",
                monthOfManufacture: 0,
                chassisNo: "",
                engineNo: "",
                engineCapacity: "",
                enginePower: "",
                weight: 0.0,
                weightUnit: "kg",
                payloadWeight: 0.0,
                payloadWeightUnit: " ",
                bodyGroupCode: "",
                bodyStyle: " ",
                bodyType: "",
                doors: 0,
                seatCapacity: 0,
                wheelbase: "",
                isModified: false,
                isTurbo: false,
                transmission: " ",
                speeds: "",
                driveTrain: " ",
                fuelType: " ",
                fuelEconomy: "",
                emissionRating: "",
                taxListPrice: 0.0,
                importFlag: "",
                countryOfAssembly: "",
                odometer: 0,
                annualMileage: 0,
                dealerStockNo: "",
                manufacturerStockNo: "",
                assetAge: 0,
                colour: "",
                keyCode: "",
                make: "",
                engineType: " ",
                amtDealerInvoice: 0.0,
                amtAssetOriginalCost: 0.0,
                amtDealerWholesale: 0.0,
              },
              aircraft: {
                assetClassId: 0,
              },
              other: {
                assetClassId: 0,
              },
              customFields: [],
              customFieldGroups: [],
            },
            customFlows: [
              {
                amount: this.baseFormData?.deposit,
                isInputAsPercent: false,
                customFlowHdr: {
                  name: "Deposit to Supplier",
                },
              },
            ],
          },
        ],
        installmentFrequency: this.baseFormData?.frequency,
        paymentStructure: this.baseFormData?.paymentStructure,
        taxProfile: { code: "ASAFV", id: 27, name: "Asset Sale for AFV" },
        customFieldGroups: [
          {
            name: "Standard Payment Option",
            items: [
              {
                rowNo: 0,
                customFields: [
                  {
                    name: "KM Allowance",
                    value: String(this.baseFormData?.kmAllowance),
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    return payload;
  }

  //Start:Component Functions
  calculateLastPaymentDate() {
    if (this.firstPaymentDate && this.term) {
      const firstPaymentDate = new Date(this.firstPaymentDate);
      const lastPaymentDate = new Date(
        firstPaymentDate.setMonth(
          firstPaymentDate.getMonth() + parseInt(this.term)
        )
      );
      this.mainForm
        .get("readOnlylastPaymentDate")
        ?.patchValue(lastPaymentDate.toISOString().split("T")[0]);
    }
  }
  calculateTotalNoOfPayments() {
    let paymentsPerYear;

    switch (this.repaymentFrequency) {
      case "Weekly":
        paymentsPerYear = 52;
        break;
      case "Fortnightly":
        paymentsPerYear = 26;
        break;
      case "Monthly":
        paymentsPerYear = 12;
        break;
      case "Quarterly":
        paymentsPerYear = 4;
        break;
      case "Semi Annual":
        paymentsPerYear = 2;
        break;
      case "Annual":
        paymentsPerYear = 1;
        break;
      case "Four Weekly":
        paymentsPerYear = 13;
        break;
      case "Semi Monthly":
        paymentsPerYear = 24;
        break;
      case "Daily":
        paymentsPerYear = 365;
        break;
      case "On Maturity":
      case "None":
      case "Synch with installment":
        this.totalNumberOfPayments = 0; // or handle accordingly
        return;
      default:
        this.totalNumberOfPayments = 0; // handle unknown frequency
        return;
    }

    let years = this.term / 12;
    this.totalNumberOfPayments = years * paymentsPerYear;
  }

  formatDateToLongFormat(dateString: string): string {
    const date = new Date(dateString);

    // Check for invalid date
    if (isNaN(date.getTime())) {
      return "";
    }

    // Convert to local date string
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    // Format the date
    return date.toLocaleString("en-IN", options);
  }

  override onValueTyped(event) { 
    if (event.name === "paymentStructure") {
      const isNone = event.data === "None";
      if (isNone) {
        this.mainForm.get("balloonAmount").enable();
        this.mainForm.get("balloonPct").enable();
        this.mainForm.get("fixed").enable();
      } else {
        this.mainForm.get("balloonAmount").disable();
        this.mainForm.get("balloonPct").disable();
        this.mainForm.get("fixed").disable();
        // this.mainForm.updateProps("balloonAmount", {
        //   mode: Mode.label,
        // });
        // this.mainForm.updateProps("balloonPct", {
        //   mode: Mode.label,
        // });
      }

      if (!isNone) {
        this.mainForm.get("balloonAmount").patchValue(0);
        this.mainForm.get("balloonPct").patchValue(0);
        this.mainForm.get("fixed").patchValue(false);
      }
      this.baseSvc.changedDefaults = {
        ...this.baseSvc.changedDefaults,
        paymentStructure: true,
      };
      this.baseSvc.forceToClickCalculate.next(true);
    }

    // if (event.name === "paymentStructure") {
    //   this.mainForm.get("balloonAmount").disable();
    //   this.mainForm.get("balloonPct").disable();
    //   this.mainForm.get("fixed").disable();

    //   this.mainForm.get("balloonAmount").patchValue(0);
    //   this.mainForm.get("balloonPct").patchValue(0);
    //   this.mainForm.get("fixed").patchValue(false);
    
    //   this.baseSvc.changedDefaults = {
    //     ...this.baseSvc.changedDefaults,
    //     paymentStructure: true,
    //   };
    //   this.baseSvc.forceToClickCalculate.next(true);
    // }
    if (
      event.name == "balloonPct" ||
      event.name == "balloonAmount" ||
      event.name == "paymentStructure" ||
      event.name == "firstPaymentDate" ||
      event.name == "loanDate" ||
      event.name == " leaseDate" ||
      event.name == "initialLeasePayment" ||
      event.name == "noOfRentalsInAdvance" ||
      event.name == "fixed"
    ) {
      this.baseSvc.forceToClickCalculate.next(true);
      this.baseSvc?.forceCalculateBeforeSchedule.next(true);
    }

    if (event.name == "firstPaymentDate") {
      // this.baseSvc.forceToClickCalculate.next(true);
      // this.baseSvc?.forceCalculateBeforeSchedule.next(true);
      if (this?.baseFormData?.financialAssetPriceSegments?.length > 0) {
        this?.baseSvc?.reCustomScheduleDate(this?.baseFormData, event?.data);
      }
    }

    if (event.name == "loanDate") {
      let newLoanDate = new Date(event.data);
      let firstPaymentDate = new Date(this?.baseFormData?.firstPaymentDate);
      // if (newLoanDate > firstPaymentDate) {
      //   this.mainForm?.get("firstPaymentDate")?.reset();
      // }
      this.mainForm?.get("firstPaymentDate")?.reset();

      let newPaymentDate = new Date(newLoanDate)
        newPaymentDate.setDate(newPaymentDate.getDate() + 42);
      
      this.mainForm?.updateProps("firstPaymentDate", {
        minDate: new Date(event.data),
        maxDate: newPaymentDate,
      });
    }
    if (event.name == "leaseDate") {
  const leaseControl = this.mainForm.get("leaseDate");

  leaseControl.setValidators(this.calculationSvc.pastDateValidator());
  leaseControl.updateValueAndValidity(); // force validation immediately

  if (leaseControl.value) {
    const leaseDate = new Date(leaseControl.value);
    this.mainForm.get("firstPaymentDate").patchValue(leaseDate);
  }
}

    
    //changes not commented
    //   if (event.name == "loanDate") {
    //   let newLoanDate = new Date(event.data);
    //   let firstPaymentDate = new Date(this?.baseFormData?.firstPaymentDate);
    //   if (newLoanDate > firstPaymentDate) {
    //     this.mainForm?.get("firstPaymentDate")?.reset();
    //   }
    //   let newPaymentDate = new Date(
    //     newLoanDate.setDate(newLoanDate.getDate() + 42)
    //   );

    //    let previousFirstpaymentDat = this.mainForm?.get("firstPaymentDate")?.value;
    //    if(previousFirstpaymentDat > newPaymentDate){
    //       this.mainForm?.get("firstPaymentDate")?.reset();
    //    }

    //   this.mainForm?.updateProps("firstPaymentDate", {
    //     minDate: new Date(event.data),
    //     maxDate: newPaymentDate,
    //   });
    // }

    if (event.name == "balloonPct" && this.cashPrice > 0) {
      this.convertPctToAmount("balloonAmount", event?.data?.value);
    }
    if (event.name == "balloonAmount") {
      this.convertAmountToPct("balloonPct", event?.data);
    }
  }

  convertPctToAmount(name, val) {
    if (this.cashPrice > 0) {
      let amount = (val / 100) * this.cashPrice;
      if (this.mainForm.get(name).value != amount) {
        this.mainForm.get(name).patchValue(amount);
      }
    } else {
      this.mainForm.get(name).patchValue(0);
    }
  }

  convertAmountToPct(name, val) {
    if (this.cashPrice > 0) {
      let pct = (val / this.cashPrice) * 100;
      this.mainForm.get(name).patchValue(pct);
    } else {
      this.mainForm.get(name).patchValue(0);
    }
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "PaymentSummaryComponent";
  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");

    
  // this.mainForm?.get("balloonAmount")?.disable();
  // this.mainForm?.get("balloonPct")?.disable();
  // this.mainForm?.get("fixed")?.disable();
    super.onFormReady();
  }

  override async onBlurEvent(event) {
    await this.updateValidation(event);
  }

  // override async onValueEvent(event) {
  //   await this.updateValidation(event);
  // }

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

  //  override async onStepChange(quotesDetails: any): Promise<void> {
  //   if(quotesDetails.type !== "tabNav"){

  //  var result:any =  await this.updateValidation('onSubmit')

  // // if(!result?.status){
  // //   this.toasterSvc.showToaster({
  // //     severity: 'error',
  // //     detail: 'I7'
  // //    })
  // // }

  // //  this.checkValidate()
  // }
  //   super.onStepChange(quotesDetails);
  // }
  //End: Component Functions
}
