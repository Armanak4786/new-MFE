import { ChangeDetectorRef, Component, effect, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CloseDialogData, CommonService } from "auro-ui";
import { AddAssetService } from "./services/addAsset.service";
import { skip, Subject, takeUntil } from "rxjs";
import { AssetTradeSummaryService } from "../standard-quote/components/asset-insurance-summary/asset-trade.service";
import {
  Insurance,
  PhysicalAsset,
  TradeAsset,
  TradeInAssetChangeActions,
} from "../standard-quote/models/assetsTrade";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";
import { SearchAssetComponent } from "../standard-quote/components/search-asset/search-asset.component";
import { AssetInsuranceSummaryComponent } from "../standard-quote/components/asset-insurance-summary/asset-insurance-summary.component";
import { DashboardService } from "../dashboard/services/dashboard.service";
import configure from "src/assets/configure.json";
import { isWorkflowStatusInViewOrEdit } from "../standard-quote/utils/workflow-status.utils";


export class Vehicle {
  vinNo: string = "";
  commNo: string = "";
  registrationNo: string = "";
  registrationType: string = " ";
  isPersonalisedPlates: boolean = false;
  productionDt: string = "2024-07-19T00:00:00";
  firstRegistrationDt: string = "2024-07-19T00:00:00";
  ownershipDt: string = "2024-07-19T00:00:00";
  makeCode: string = "";
  model: string = "";
  modelCode: string = "";
  subModel: string = "";
  subModelYear: string = "";
  derivative: string = "";
  badge: string = "";
  monthOfManufacture: number = 0;
  chassisNo: string = "";
  engineNo: string = "";
  engineCapacity: string = "";
  enginePower: string = "";
  weight: number = 0.0;
  weightUnit: string = "kg";
  payloadWeight: number = 0.0;
  payloadWeightUnit: string = " ";
  bodyGroupCode: string = "";
  bodyStyle: string = " ";
  bodyType: string = "";
  doors: number = 0;
  seatCapacity: number = 0;
  wheelbase: string = "";
  isModified: boolean = false;
  isTurbo: boolean = false;
  transmission: string = " ";
  speeds: string = "";
  driveTrain: string = " ";
  fuelType: string = " ";
  fuelEconomy: string = "";
  emissionRating: string = "";
  taxListPrice: number = 0.0;
  importFlag: string = "";
  countryOfAssembly: string = "";
  odometer: number = 0;
  annualMileage: number = 0;
  dealerStockNo: string = "";
  manufacturerStockNo: string = "";
  assetAge: number = 0;
  colour: string = "";
  keyCode: string = "";
  make: string = "";
  engineType: string = " ";
  amtDealerInvoice: number = 0.0;
  amtAssetOriginalCost: number = 0.0;
  amtDealerWholesale: number = 0.0;
}

export class PhysicalAssetClass {
  model?: string = "";
  assetClassEnum?: string = "Vehicle";
  reference?: string = "";
  originalPurchasePrice?: number = 0;
  originalPurchaseDt?: string = "2024-07-19T00:00:00";
  assetCondition?: string = "New";
  assetCheckStatus1?: string = "None";
  assetCheckStatus2?: string = "None";
  vehicle?: Vehicle = new Vehicle();
  aircraft?: any = {
    assetClassId: 0,
  };
  other?: any = {
    assetClassId: 0,
  };
  customFields?: any[] = [];
  customFieldGroups?: any[] = [];
}

export class FinancialAssetLease {
  scheduleTerm?: number = 0;
  pctResidualValue?: number = 0;
}

export class FinancialAsset {
  assetName?: string = "";
  assetType = {
    assetTypeId: 29,
  };
  cost?: number = 0;
  financialAssetLease?: FinancialAssetLease = new FinancialAssetLease();
  physicalAsset?: PhysicalAssetClass = new PhysicalAssetClass();
}

export class TaxProfile {
  id?: number = 0;
  name?: string = "Finance Lease";
  code?: string = "FL";
}

export class Product {
  productId?: number = 24;
}

export class Program {
  programId?: number = 126;
}

export class Contract {
  isDraft?: boolean = false;
  product?: Product = new Product();
  program?: Program = new Program();
  financialAssets?: FinancialAsset[] = [new FinancialAsset()];
  taxProfile?: TaxProfile = new TaxProfile();
}

@Component({
  selector: "app-asset",
  templateUrl: "./asset.component.html",
  styleUrl: "./asset.component.scss",
})
export class AssetComponent implements OnInit {
  destroy$ = new Subject<void>();
  formData: any;
  mode: any;
  addType: any;
  mainForm: any;
  formConfig: any;

  constructor(
    public route: ActivatedRoute,
    public svc: CommonService,
    public baseSvc: AddAssetService,
    private tradeSvc: AssetTradeSummaryService,
    private standardQuoteSvc: StandardQuoteService,
    public toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public dashboardService : DashboardService
  ) {

    effect(() => {
  
    if(this.dashboardService.isDealerCalculated)
      {
              this.toasterSvc.showToaster({
                severity: "error",
                detail:"err_calculateMsg",
              });
      }
        
    });

   }

  standardQuoteData: any;

  async ngOnInit(): Promise<void> {
    this.baseSvc.addAssetFormDataSubject.next(false);
    let params: any = this.route.snapshot.params;
    this.addType = params?.type;
    this.mode = params?.mode || "create";
    if (this.mode == "edit" && this.addType == "addAsset") {
     let policyExpiryDate = null;
    
    if (this.tradeSvc?.assetEditData?.policyExpiryDate) {
      const dateValue = new Date(this.tradeSvc.assetEditData.policyExpiryDate);
      
      if (!isNaN(dateValue.getTime())) {
        policyExpiryDate = dateValue;
      }
    }
      let hin = this.tradeSvc?.assetEditData?.vin
      
      this.baseSvc.setBaseDealerFormData({
        ...this.tradeSvc.assetEditData,
        policyExpiryDate: policyExpiryDate,
        hin: hin,
          assetType: {
      assetTypeId: this.tradeSvc.assetEditData?.assetType?.assetTypeId || this.tradeSvc.assetEditData?.assetTypeId,
      assetTypeName: this.tradeSvc.assetEditData?.assetType?.assetTypeName || this.tradeSvc.assetEditData?.assetName,
      assetTypePath: this.tradeSvc.assetEditData?.assetType?.assetTypePath || this.tradeSvc.assetEditData?.assetPath,
    }

      });
    }
    if (this.mode == "edit" && this.addType == "addTrade") {
      let data = {
        assetId : this.tradeSvc.tradeEditData?.tradeId,
        // assetName: this.tradeSvc?.tradeEditData?.tradeName,
        // assetType: {
        //     //////
        //     assetTypeId: this.tradeSvc?.tradeEditData?.tradeType?.tradeTypeId || 0,
        //     assetTypeName: this.tradeSvc?.tradeEditData?.tradeType?.tradeTypeName,
        //     assetTypePath: this.tradeSvc?.tradeEditData?.tradeType?.tradeTypePath,
        //   },
        costOfAsset: this.tradeSvc?.tradeEditData?.tradeAssetValue,
        // conditionOfGood: this.tradeSvc?.tradeEditData?.conditionOfGood,
        year: Number(this.tradeSvc?.tradeEditData?.tradeYear),
        make: this.tradeSvc?.tradeEditData?.tradeMake,
        model: this.tradeSvc?.tradeEditData?.tradeModel,
        colour: this.tradeSvc?.tradeEditData?.tradeColour,
        variant: this.tradeSvc?.tradeEditData?.tradeVariant,
        regoNumber: this.tradeSvc?.tradeEditData?.tradeRegoNo,
        vin: this.tradeSvc?.tradeEditData?.tradeVinNo,
        odometer: Number(this.tradeSvc?.tradeEditData?.tradeOdometer || 0),
        color: this.tradeSvc?.tradeEditData?.tradeColour,
        serialChassisNumber:
          this.tradeSvc?.tradeEditData?.tradeSerialOrChassisNo || "",
        engineNumber: this.tradeSvc?.tradeEditData?.tradeEngineNo,
        ccRating: this.tradeSvc?.tradeEditData?.tradeCCNo,
        assetPath: this.tradeSvc?.tradeEditData?.tradePath,
        motivePower: this.tradeSvc?.tradeEditData?.tradeMotivePower,
        supplierName : this.tradeSvc?.tradeEditData?.tradeSupplierName,
        isExist : this.tradeSvc?.tradeEditData?.isExist,
        rowNo : this.tradeSvc?.tradeEditData?.rowNo

      };
      this.baseSvc.setBaseDealerFormData({ ...data });
    }

    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.standardQuoteData = res;
        
        // For AFV in create mode, map afvMake/Model/Variant/Year to asset-details fields
        if (this.mode === 'create' && res?.productCode === 'AFV' && this.addType === 'addAsset') {
          this.baseSvc.setBaseDealerFormData({
            make: res?.afvMake || res?.physicalAsset?.[0]?.make || '',
            model: res?.afvModel || res?.physicalAsset?.[0]?.model || '',
            variant: res?.afvVariant || res?.physicalAsset?.[0]?.variant || '',
            year: res?.afvYear || res?.physicalAsset?.[0]?.year || '',
          });
        }
      });

    await this.baseSvc
      .getBaseDealerFormData()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
      });
      //  this.dashboardService?.onOriginatorChange.pipe(takeUntil(this.destroy$),skip(1)).subscribe(async (dealer) => {
      //                   if(this.dashboardService.isDealerCalculated)
      //                     {
      //                             this.toasterSvc.showToaster({
      //                               severity: "error",
      //                               detail:"err_calculateMsg",
      //                             });
      //                     }
        
      //       })
  }


  isDisabled(){
    return isWorkflowStatusInViewOrEdit(this.standardQuoteData?.AFworkflowStatus);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  redirectToHome() {
    this.baseSvc.resetBaseDealerFormData();

    this.svc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Cancel Asset",
      () => {
        if (this.standardQuoteData?.contractId) {
          this.standardQuoteSvc.isAssetSearch = false;
          this.svc?.router?.navigateByUrl(
            `/dealer/standard-quote/edit/${this.standardQuoteData?.contractId}`
          );
        } else {
          this.svc?.router?.navigateByUrl("/dealer/standard-quote");
        }
      }
    ); // Ensure the event is passed here
  }

  async redirectToAssetDetails() {
    const params: any = {};
    if (this.formData.vin) {
      params.vinNumber = this.formData.vin;
    }
    if (this.formData.regoNumber) {
      params.plateNumber = this.formData.regoNumber;
    }
    await this.svc.data
      .post(`Motocheck/get_evaluation`, params)
      .subscribe((res) => {
        if (res.data) {
          this.tradeSvc.assetSearchResult = res.data || res.items;
          let vehicleDescription = res?.data?.bcAservice?.bcAserviceData?.response.motoChekReport.vehicleDescription;
          // console.log(res?.data?.bcAservice?.bcAserviceData?.response.
          //   motoChekReport.vehicleDescription?.vinnumber, "asset search result");

          let asset = {
            make: vehicleDescription?.model || '',
            model: vehicleDescription?.model || '',
            year: Number(vehicleDescription?.yearOfManufacture) || null,
            variant: vehicleDescription?.submodel || '',
            regoNumber: vehicleDescription?.plateNumber || '',
            vin: vehicleDescription?.vinnumber || '',
            //serialChassisNumber: data.vehicleDescription?.enginenumber || '',
            costOfAsset: 0,
            ccRating: String(vehicleDescription?.ccRating || 0),
            engineNumber: vehicleDescription?.enginenumber || '',
            //chassisNumber: data.vehicleDescription?.enginenumber || '',
            colour: vehicleDescription?.maincolour || '',
            motivePower: vehicleDescription?.fueltype || '',
            odometer: Number(
              vehicleDescription?.latestOdometerReading || null
            ),
          };
          this.baseSvc.setBaseDealerFormData({
            motocheckApiResponse: asset
          })
          this.baseSvc.changeDetectionForUpdate.next('motocheckApiResponse')
        }
      });
  }

  async submitData() {
    this.baseSvc.formStatusArr = [];
    this.baseSvc.addAssetFormDataSubject.next(true);
    const statusInvalid = this.baseSvc.formStatusArr.includes("INVALID");
    this.baseSvc.formStatusArr = [];
    this.tradeSvc.assetEditData = null;
    this.tradeSvc.tradeEditData = null;
    // debugger;
    if (!statusInvalid) {
      if (this.addType == "addAsset") {
        let validateAsset = this.validate(
          this.formData?.regoNumber,
          this.formData?.vin,
          this.formData?.serialChassisNumber,
          "asset"
        );
        if (!validateAsset) {
          return;
        }
    const vin = this.formData?.assetCategory === 'Marine'
                        ? String(this.formData?.hin) || ""
                        : String(this.formData?.vin) || "";
        let asset: PhysicalAsset = {
          id: 0,
          assetId: this.formData?.assetId || 0,
          assetPath: this.formData?.assetPath,
          // assetName: this.formData?.assetName,
          assetName: `${this.formData?.year || '-'} ${this.formData?.make || '-'} ${this.formData?.model || '-'} ${this.formData?.variant || '-'}`.trim(),
          assetType: {
            //////
            assetTypeId: this.formData?.assetTypeId || 0,
            assetTypeName: this.formData?.assetName,
            assetTypePath: this.formData?.assetPath,
          },
          make: this.formData?.make,
          model: this.formData?.model,
          vehicleClassId: this?.formData?.vehicleClassId,
          year: this.formData?.year,
          conditionOfGood: String(this.formData?.conditionOfGood),
          variant: this.formData?.variant,
          regoNumber: this.formData?.regoNumber,
          vin: vin,
          serialChassisNumber: this.formData?.serialChassisNumber == null ? "" : String(this.formData?.serialChassisNumber),
          costOfAsset: this.formData?.costOfAsset,
          odometer: this.formData?.odometer,
          insurer: this.formData?.insurer,
          colour: this.formData?.colour,
          ccRating: String(this.formData?.ccRating || 0),
          engineNumber: String(this.formData?.engineNumber || 0),
          chassisNumber: String(this.formData?.serialChassisNumber || 0),
          motivePower: String(this.formData?.motivePower || 0),
          assetLocationOfUse: this.formData?.assetLocationOfUse || "",
          supplierName: this.formData?.supplierName || "",
          assetLeased: this.formData?.assetLeased,
          countryFirstRegistered: this.formData?.countryFirstRegistered,
          features: this.formData?.features,
          description: this.formData?.description,
          copyasset: this.formData?.copyasset || false,
          isEdited: this.formData?.isEdited || false,
        };
        // let cashPrice = this.standardQuoteData?.cashPriceValue || 0;

        // if (this.formData?.costOfAsset > cashPrice) {
        //   this.standardQuoteSvc.setBaseDealerFormData({
        //     cashPriceValue: this.formData?.costOfAsset,
        //   });
        // }
        let insurance: Insurance = {
          id: 0,
          insurer: this.formData?.insurer || "",
          broker: this.formData?.broker || "",
          sumInsured: this.formData?.sumInsured || 0,
          policyNumber: String(this.formData?.policyNumber || 0),
        policyExpiryDate: this.formData?.policyExpiryDate && 
                        !isNaN(new Date(this.formData.policyExpiryDate).getTime())
                        ? String(this.formData.policyExpiryDate) 
                        : null,
          email:this.formData?.email || '',
          localNumber:this.formData?.localNumber || '',
          phoneCode: this.formData?.phoneCode || '',
          partyId: this.formData?.partyNo ,
          partyNo :this.formData?.partyNo,
          assetHdrInsuranceId:this.formData?.assetHdrInsuranceId,
          amtNetAnnualPremium: this.formData?.amtNetAnnualPremium || 0,
          amtTaxOnAnnualPremium: this.formData?.amtTaxOnAnnualPremium || 0,
          grossAnnualPremium: this.formData?.grossAnnualPremium || 0,
          currency: {
            id: 105,
            name: "New Zealand Dollars",
            code: "NZD",
          },
        };
        if (this.mode != "edit") {
         
          this.tradeSvc.assetList.push({
            ...asset,
            actions: this.tradeSvc?.actions,
          });

          this.tradeSvc.insuranceList.push({
            ...insurance,
          });
        }

        if (this.mode == "edit" && !this.standardQuoteSvc.isAssetSearch) {
          
          this.tradeSvc.assetList[this.tradeSvc.assetEditIndex] = {
            ...asset,
            actions: this.tradeSvc?.actions,
          };
          this.tradeSvc.insuranceList[this.tradeSvc.assetEditIndex] = {
            ...insurance,
          };
        }
         else if (this.mode == "edit" && this.standardQuoteSvc.isAssetSearch) {
           
           this.tradeSvc.assetList.push({
            ...asset,
            actions: this.tradeSvc?.actions,
          });

          this.tradeSvc.insuranceList.push({
            ...insurance,
          });
        }
        else if (this.standardQuoteSvc.isAssetSearch) {
        
          this.tradeSvc.assetList.push({
            ...asset,
            actions: this.tradeSvc?.actions,
          });

          this.tradeSvc.insuranceList.push({
            ...insurance,
          });
        }

        let sessionWorkFlowState = sessionStorage?.getItem("workFlowStatus");
        // if(this.formData?.costOfAsset > this.formData?.apicostOfAsset && sessionWorkFlowState == "Approved"){
        if(this.formData?.costOfAsset > this.formData?.selectedApiAssetAmount && sessionWorkFlowState == "Approved"){
        this.toasterService.showToaster({
            severity: "error",
            detail: "Cost of Asset cannot be increased in Ready for Documentation state.",
          });
          return;
        }

        if(this.formData?.year < this.formData?.selectedApiAssetYear && sessionWorkFlowState == "Approved"){
          this.toasterService.showToaster({
            severity: "error",
            detail: "Year cannot be decreased in Ready for Documentation state.",
          });
          return;
        }

        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
        
        this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
        this.redirectToAssetSummery();
      }

      if (this.addType == "addTrade") {
        let validateTrade = this.validate(
          this.formData?.regoNumber,
          this.formData?.vin,
          this.formData?.serialChassisNumber,
          "trade"
        );
        if (!validateTrade) {
          return;
        }
// Only use service value as fallback when EDITING and no trades exist yet

        // For NEW trades, only use formData.costOfAsset (what user entered)

        let tradeAssetValue = this.formData?.costOfAsset || 0;

        if (this.mode !== "edit" && this.tradeSvc.tradeList.length === 0) {

          // First trade being added - can use less-deposit value as fallback

          tradeAssetValue = this.formData?.costOfAsset || this.tradeSvc.getCurrentTradeAmountForAddTrade() || 0;

        }
 
        let sessionWorkFlowState = sessionStorage?.getItem("workFlowStatus");

        if(this.formData?.costOfAsset < this.formData?.selectedApiTradeAmount && sessionWorkFlowState == "Approved"){
          this.toasterService.showToaster({
            severity: "error",
            detail: "Cost of Trade-in cannot be decreased in Ready for Documentation state.",
          });
          return;
        }
        let trade: TradeAsset = {
           id: 0,
          tradeId: this.formData.assetId || 0,
          tradeName:  `${this.formData?.year || '-'} ${this.formData?.make || '-'} ${this.formData?.model || '-'} ${this.formData?.variant || '-'}`.trim(),
          tradePath: this.formData?.assetPath || "",
          tradeAssetValue: String(tradeAssetValue),
          tradeCCNo: String(this.formData?.ccRating || 0),
          tradeColour: this.formData?.colour || "",
          // conditionOfGood: this.formData?.conditionOfGood,
          tradeEngineNo: String(this.formData?.engineNumber || 0),
          tradeMake: this.formData?.make || "",
          tradeModel: this.formData?.model || "",
          tradeMotivePower: String(this.formData?.motivePower),
          tradeOdometer: String(this.formData?.odometer || ""),
          tradeRegoNo: this.formData?.regoNumber || "",
          tradeSerialOrChassisNo: String(
            this.formData?.serialChassisNumber || ""
          ),
          tradeVariant: this.formData?.variant || "",
          tradeVinNo: String(this.formData?.vin || ""),
          tradeYear: String(this.formData?.year || ""),
          tradeSupplierName :this.formData?.supplierName || "",
          changeAction: this.mode === "edit" && !this.standardQuoteSvc.isAssetSearch
                ? TradeInAssetChangeActions.update : this.mode == "edit" && this.standardQuoteSvc.isAssetSearch ?   TradeInAssetChangeActions.create 
                : TradeInAssetChangeActions.create,
          isExist : this.formData?.isExist  ?? false, 
          rowNo : this.formData?.rowNo ?? -1        
                };

        if (this.mode != "edit") {
          this.tradeSvc.tradeList.push({
            ...trade,
            actions: this.tradeSvc?.actions,
          });
        } else if (this.mode == "edit" && !this.standardQuoteSvc.isAssetSearch) {
          this.tradeSvc.tradeList[this.tradeSvc.tradeEditIndex] = {
            ...trade,
            actions: this.tradeSvc?.actions,
          }
;
        }else if (this.standardQuoteSvc.isAssetSearch) {
          this.tradeSvc.tradeList.push({
            ...trade,
            actions: this.tradeSvc?.actions,
          });
        }
      this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);

      }
      this.standardQuoteSvc.isFinancialAssetPriceValueDetails = true
      this.standardQuoteSvc.isAssetSubmit = true;
      this.baseSvc.resetBaseDealerFormData();
      this.svc.router.navigateByUrl("/dealer/standard-quote");
    }
  }

  validate(rego, vin, chassis, type) {
    if (type == "trade") {
      let existingTrades = [...this.tradeSvc.tradeList.filter(
  t => t.changeAction !== 'delete'
        )];
      if (this.mode == "edit") {
        existingTrades.splice(this.tradeSvc.tradeEditIndex, 1);
      }
      let match;
      let matchFound = existingTrades.find((ele) => {
        if (ele.tradeVinNo && ele.tradeVinNo == vin) match = "vin";
        if (ele.tradeRegoNo && ele.tradeRegoNo == rego) match = "regoNumber";
        if (ele.tradeSerialOrChassisNo && ele.tradeSerialOrChassisNo == chassis)
          match = "chassisNumber";

        return (
          (ele.tradeVinNo && ele.tradeVinNo == vin) ||
          (ele.tradeRegoNo && ele.tradeRegoNo == rego) ||
          (ele.tradeSerialOrChassisNo && chassis == ele.tradeSerialOrChassisNo)
        );
      });

      let assetmatch;
      let assetmatchFound = this.tradeSvc.assetList.find((ele) => {
        if (ele.vin && ele.vin == vin) assetmatch = "vin";
        if (ele.regoNumber && ele.regoNumber == rego) assetmatch = "regoNumber";
        if (ele.chassisNumber && ele.chassisNumber == chassis)
          assetmatch = "chassisNumber";

        return (
          (ele.vin && ele.vin == vin) ||
          (ele.regoNumber && ele.regoNumber == rego) ||
          (ele.chassisNumber && chassis == ele.chassisNumber)
        );
      });

      if (matchFound) {
        if (match == "vin") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Trade with same vin cannot be added.",
          });
        }
        if (match == "regoNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Trade with same rego number cannot be added.",
          });
        }
        if (match == "chassisNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Trade with same chassis number cannot be added.",
          });
        }
        return false;
      } else if (assetmatchFound) {
        if (assetmatch == "vin") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Asset already added with the selected vin",
          });
        }
        if (assetmatch == "regoNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Asset already added with the selected rego number",
          });
        }
        if (assetmatch == "chassisNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Asset already added with the selected chassis number",
          });
        }
        return false;
      } else {
        return true;
      }
    } else {
      let existingAssets = [...this.tradeSvc.assetList];
      if (this.mode == "edit") {
        existingAssets.splice(this.tradeSvc.assetEditIndex, 1);
      }
      let match;
      let matchFound = existingAssets.find((ele) => {
        if (ele.vin && ele.vin == vin) match = "vin";
        if (ele.regoNumber && ele.regoNumber == rego) match = "regoNumber";
        if (ele.chassisNumber && ele.chassisNumber == chassis)
          match = "chassisNumber";

        return (
          (ele.vin && ele.vin == vin) ||
          (ele.regoNumber && ele.regoNumber == rego) ||
          (chassis && chassis == ele.chassisNumber)
        );
      });

      let tradematch;
      let tradematchFound = this.tradeSvc.tradeList.find((ele) => {
        if (ele.tradeVinNo && ele.tradeVinNo == vin) tradematch = "vin";
        if (ele.tradeRegoNo && ele.tradeRegoNo == rego)
          tradematch = "regoNumber";
        if (ele.tradeSerialOrChassisNo && ele.tradeSerialOrChassisNo == chassis)
          tradematch = "chassisNumber";

        return (
          (ele.tradeVinNo && ele.tradeVinNo == vin) ||
          (ele.tradeRegoNo && ele.tradeRegoNo == rego) ||
          (chassis && chassis == ele.tradeSerialOrChassisNo)
        );
      });

      if (matchFound) {
        if (match == "vin") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Asset with same vin cannot be added.",
          });
        }
        if (match == "regoNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Asset with same rego number cannot be added.",
          });
        }
        if (match == "chassisNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Asset with same chassis number cannot be added.",
          });
        }
        return false;
      } else if (tradematchFound) {
        if (tradematch == "vin") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Trade already added with the selected vin",
          });
        }
        if (tradematch == "regoNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Trade already added with the selected rego number",
          });
        }
        if (tradematch == "chassisNumber") {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Trade already added with the selected chassis number",
          });
        }
        return false;
      } else {
        return true;
      }
    }
  }

  pageCode: string = "";
  modelName: string = "";

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

  // async onStepChange(quotesDetails: any): Promise<void> {
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


  openSearchAsset(header) {
    this.svc.dialogSvc
      .show(SearchAssetComponent, header, {
        templates: {
          footer: null,
        },
        data: {
          modalType: header,
          hideAddButton: true,
        },

        width: "55vw",
      })
      .onClose.subscribe((data: CloseDialogData) => { });
  }

  redirectToAssetSummery() {
    this.svc.router.navigateByUrl('/dealer/standard-quote');
   this.svc.dialogSvc
         .show(AssetInsuranceSummaryComponent, "Asset & Insurance Summary", {
           templates: {
             footer: null,
           },
           width: "60vw",
         })
   .onClose.subscribe((data: any) => {
        if (data?.submitType == "submit") {
          console.log("submit data mainform", this.mainForm);
            this.svc.dialogSvc
              .show(SearchAssetComponent, data.submitFor, {
                templates: {
                  footer: null,
                },
                data: {
                  modalType: data?.submitFor,
                },
                width: "55vw",
              })
              .onClose.subscribe((data) => {
                if (data?.action != "closeAssetInsuranceSummaryTable") {
                  this.redirectToAssetSummery();
                }
              });
        }
      });
    }

}
