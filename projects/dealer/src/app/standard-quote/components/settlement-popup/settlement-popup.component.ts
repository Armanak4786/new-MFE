import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService, DataService, GenericFormConfig } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Validators } from "@angular/forms";
import { ToasterService, ValidationService } from "auro-ui";
import { forkJoin, map, switchMap } from "rxjs";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";

@Component({
  selector: "app-settlement-popup",
  templateUrl: "./settlement-popup.component.html",
  styleUrl: "./settlement-popup.component.scss",
})
export class SettlementPopupComponent extends BaseStandardQuoteClass {
  next: boolean = false;
  contractId: any;
  disabled: boolean = true;
  regoNumber: any = "";
  vinNumber: any = "";
  checkBoxEvent: any;
  settlementContractId:any;
 settlementDate:Date;
 
  @Input() rowData: any;  

   override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "settlement",
    goBackRoute: "lessDeposite",
    fields: [
      {
        type: "label-only",
        className: "text-left text-sm custom-line-spacing mb-5",         
        label:
          "Please complete the details below to view a settlement quote. As this settlement quote is for the purpose of refinancing, a date for the new loan must also be entered.",
        name: "nettrade",
        cols: 12,
        typeOfLabel: "inline",
      },
      {
        type: "text",
        label: "Rego Number",
        name: "regoNumber",
        className: "pb-0",
        //options: [{ label: 'IcashPro', name: 'icp' }],
        cols: 4,
        // //validators:[validators.required]
      },
      {
        type: "text",
        label: "VIN",
        name: "vinNumber",
        className: "pb-0",
        cols: 4,
        // //validators:[validators.required]
      },
      {
        type: "date",
        label: "Settlement Date",
        name: "settlementDate",
        className: "pb-0",
        cols: 4,
        // default: new Date(),
         minDate: new Date(),
        validators: [Validators.required, ],
      },
      {
        type: "label-only",
        className: "quote-name mt-4 text-sm",
        label: `A settlement quote is avalable for this vechile.As the vechile was originally purchased from another
           dealer, the customer must consent to this settlement request.`,
        name: "settlementQuoteName",
        typeOfLabel: "inline",
        cols: 12,
      },
      {
        type: "label-only",
        className: "mt-2 bold-label font-bold text-black-alpha-90	",
        label: "Privacy Waiver",
        name: "privacyWaiverLabel",
        typeOfLabel: "inline",
        isRequired: true,
      },
      {
        type: "checkbox",
        label: `Yes, I have obtained the customer's consent to proceed with the settlement quote request.`,
        name: "privacyWaiver",
        className: "pb-0",
        cols: 12,
        default: false,
      },
      {
        type: "label-only",
        className: "mt-3 text-sm text-red-500",
        label: `A settlement quote cannot be completed. Please contact UDC Finance on 0800 500 832 for assistance`,
        name: "settlementQuoteError",
        typeOfLabel: "inline",
        cols: 12,
      },
      {
        type: "label-only",
        className: "mt-3 text-sm text-red-500",
        label: `The vehicle details supplied do not match any existing financed vehicles with UDC. Please contact UDC finance on 
          0800 500 832 for assistance`,
        name: "settlementQuoteVechileError",
        typeOfLabel: "inline",
        cols: 11,
      },
    ],
  };


  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    override baseSvc: StandardQuoteService,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public dataSvc: DataService,
    private dashboardSvc: DashboardService,
    public tradeSvc: AssetTradeSummaryService

  ) {
    super(route, svc, baseSvc);
  }
  // override async ngOnInit() {
  //   await super.ngOnInit();
  //   this.contractId = this.baseFormData?.contractId;
  //   this.mainForm.updateHidden({
  //     settlementQuoteName: true,
  //     settlementQuoteError: true,
  //     settlementQuoteVechileError: true,
  //     privacyWaiver: true,
  //     privacyWaiverLabel: true,
  //   });
  // }
  // Update the ngOnInit method in SettlementPopupComponent

// override async ngOnInit() {
//   await super.ngOnInit();
  
//     // Get contractId from multiple sources in order of preference
//     this.contractId = 
//       this.config.data?.contractId ||           // From dialog data
//       this.baseFormData?.contractId ||          // From base form data
//       // this.baseSvc.getBaseDealerFormData()?.contractId; // From service

//     console.log('Settlement Popup - Contract ID:', this.contractId);
//     console.log('Settlement Popup - Dialog Data:', this.config.data);

//     // Pre-populate VIN and Registration Number from API data
//     if (this.config.data?.vinNumber) {
//       this.vinNumber = this.config.data.vinNumber;
//       this.mainForm.get('vinNumber')?.patchValue(this.config.data.vinNumber);
//     }

//     if (this.config.data?.regoNumber) {
//       this.regoNumber = this.config.data.regoNumber;
//       this.mainForm.get('regoNumber')?.patchValue(this.config.data.regoNumber);
//     }

//     // If we have both VIN and Rego from API, pre-populate and show settlement quote section
//     if (this.config.data?.vinNumber || this.config.data?.regoNumber) {
//       // If we have API data, show the settlement quote section immediately
//       this.mainForm.updateHidden({
//         settlementQuoteName: false,
//         privacyWaiver: false,
//         privacyWaiverLabel: false,
//         settlementQuoteError: true,
//         settlementQuoteVechileError: true,
//       });
    
//     // Enable the form if we have the required data
//     if (this.contractId) {
//       this.disabled = true; // Keep disabled until privacy waiver is checked
//     }
    
//     console.log('Pre-populated from API - VIN:', this.vinNumber, 'Rego:', this.regoNumber);
//   } else {
//     // Original behavior - hide everything initially
//     this.mainForm.updateHidden({
//       settlementQuoteName: true,
//       settlementQuoteError: true,
//       settlementQuoteVechileError: true,
//       privacyWaiver: true,
//       privacyWaiverLabel: true,
//     });
//   }

//   // Additional pre-population from row data if available
//   if (this.config.data?.rowData) {
//     const rowData = this.config.data.rowData;
    
//     // If API didn't provide regNo but row data has it, use that as fallback
//     if (!this.regoNumber && rowData.regNo) {
//       this.regoNumber = rowData.regNo;
//       this.mainForm.get('regoNumber')?.patchValue(rowData.regNo);
//     }
//   }
// }

override async ngOnInit() {
  await super.ngOnInit();

    // Standard Quote flow
  if (this.baseFormData?.financialAssets) {
    this.contractId = this.baseFormData?.contractId;
    this.vinNumber = this.baseFormData?.financialAssets[0]?.physicalAsset?.vin || "";
    // this.regoNumber = this.baseFormData?.financialAssets[0]?.physicalAsset?.regoNumber || "";

   // Dashboard flow
  } else {

    // const currentData = this.dashboardSvc.getCurrentRowData();
    const currentData = this.config.data;
    if (currentData) {
      this.rowData = currentData;
    }

  this.vinNumber =
    this.rowData?.vin || ""; 

  this.regoNumber =
    this.rowData?.regNo || ""; 

    //patch from contractData if available
     if (this.rowData) {
      this.contractId = this.rowData.contractId;
      this.vinNumber =
        this.rowData?.financialAssets[0]?.physicalAsset?.vin ||
        this.vinNumber; // fallback to rowData if not found
      this.regoNumber =
        this.rowData?.financialAssets[0]?.physicalAsset?.regoNumber ||
        this.regoNumber;
    }


  }

  // Patch
  if (this.vinNumber) {
    this.mainForm.get("vinNumber")?.patchValue(this.vinNumber);
  }
  if (this.regoNumber) {
    this.mainForm.get("regoNumber")?.patchValue(this.regoNumber);
  }

  this.mainForm.get("settlementDate")?.patchValue((new Date()));


  // Show/hide settlement quote section based on availability
  if (this.vinNumber || this.regoNumber) {
    this.mainForm.updateHidden({
      settlementQuoteName: false,
      privacyWaiver: false,
      privacyWaiverLabel: false,
      settlementQuoteError: true,
      settlementQuoteVechileError: true,
    });
    this.disabled = !!this.contractId;
  } else {
    this.mainForm.updateHidden({
      settlementQuoteName: true,
      settlementQuoteError: true,
      settlementQuoteVechileError: true,
      privacyWaiver: true,
      privacyWaiverLabel: true,
    });
  }

}

 

  override onValueChanges(event: any) {
    this.config.data = event;
    if (event?.settlementDate) 
      {
       this.settlementDate = new Date(event.settlementDate);
    }
  }

  close() {
    this.ref.close();
  }

  override  onFormEvent(event: any):void{
    this.checkBoxEvent = event;
    if (event.name == "privacyWaiver") {
      if (event.value) {
        this.disabled = false;
      }
      else
      {
         this.disabled = true;
      }
    }

    if (event.name == "regoNumber" || event.name == "vinNumber") {
      this.disabled = false;
      this.regoNumber =
        event.name == "regoNumber" ? event?.value : this.regoNumber;
      this.vinNumber =
        event.name == "vinNumber" ? event?.value : this.vinNumber;
      this.mainForm.updateHidden({
        settlementQuoteName: true,
        privacyWaiver: true,
        privacyWaiverLabel: true,
      });
    }
    
   
  }

  passDataToParent() {
  if (this.tradeSvc.tradeList && this.tradeSvc.tradeList.length > 0) {
    const hasMismatch = this.tradeSvc.tradeList.some(trade => 
      trade.tradeRegoNo !== this.regoNumber || trade.tradeVinNo !== this.vinNumber
    );
    
    if (hasMismatch) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Multiple activated contract cannot settled in a single quote",
      });
      return; 
    }
  }
   
    if (this.checkBoxEvent.name != "privacyWaiver") {
      let params = {
        registrationNo: this.regoNumber,
        vinNo: this.vinNumber,
      };   
      this.dataSvc
        .get(`AssetType/search_activatedloans`, params)
        .pipe(
          map((res) => {           
            if (
              res?.items?.length > 0 &&
              (res?.items[0]?.registrationNo == this.regoNumber ||
                res?.items[0]?.vinNo == this.vinNumber)
            ) {
              this.mainForm.updateHidden({
                settlementQuoteName: false,
                privacyWaiver: false,
                privacyWaiverLabel: false,
              });
              this.settlementContractId=res.items[0].contractId;
              this.disabled = true;
              this.mainForm.updateHidden({ settlementQuoteVechileError: true });
            } else {
              this.mainForm.updateHidden({
                settlementQuoteVechileError: false,
              });
              this.disabled = true;
            }
          })
        )
        .toPromise();
    }



    if (
      this.checkBoxEvent.name === "privacyWaiver" &&
      this.checkBoxEvent.value === true
    ) {
      let SettlementContractId= this.settlementContractId;
      let creationMode = this.mainForm.mode;
      let currentData = this.config.data;
      
      let contractID = { 
        contractId: this.settlementContractId ,
        terminationReason:"",
         calcDt: this.settlementDate
      };

      let refinancingSettlementRequest = {
        contractId: SettlementContractId,
        terminationReason: "Refinanced: UDC",
        calcDt:  this.settlementDate

      };

       if (this.contractId || contractID?.contractId) {
      // First POST request
      this.svc.data.post("Settlement/create_settlementquote", contractID)
        .pipe(
          // After first POST completes, make the GET request
          switchMap((standardSettlementResponse) => {
            return this.svc.data.get(`Contract/get_contract?contractId=${SettlementContractId}`)
              .pipe(
                // After GET completes, make the second POST request
                switchMap((contractData) => {
                  return this.svc.data.post(
                    "Settlement/create_settlementquote",
                    refinancingSettlementRequest
                  ).pipe(
                    map((refinancingSettlementResponse) => ({
                      standardSettlementResponse,
                      contractData,
                      refinancingSettlementResponse
                    }))
                  );
                })
              );
          })
        )
        .subscribe({
          next: (result) => {
            this.ref.close({
              data: {
                standardSettlementResponse: result.standardSettlementResponse,
                contractData: result.contractData,
                refinancingSettlementResponse: result.refinancingSettlementResponse,
                SettlementContractId,
                creationMode          
              },
            });
          },
          error: (error) => {
            this.mainForm.updateHidden({
              settlementQuoteError: false,
              settlementQuoteName: true,
              privacyWaiver: true,
              privacyWaiverLabel: true,
            });
            this.disabled = true;
          },
        });
    }
  }
}

  override onStatusChange(statusDetails: any): void {}

  pageCode: string = "SettlementPopupComponent";
  modelName: string = "SettlementPopupComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
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
