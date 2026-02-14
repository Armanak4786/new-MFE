import { Injectable, OnInit, signal } from "@angular/core";
import { BaseDealerService } from "../../base/base-dealer.service";
import { BehaviorSubject, map, ReplaySubject, Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { cloneDeep } from "lodash";
import { AssetTradeSummaryService } from "../components/asset-insurance-summary/asset-trade.service";
import { DataService, StorageService, ToasterService } from "auro-ui";
import { DatePipe } from "@angular/common";
import configure from "src/assets/configure.json";

@Injectable({
  providedIn: "root",
})
export class StandardQuoteService extends BaseDealerService implements OnInit {
  program: any;
  isAssetSelection: boolean = false;
  product: any;
  productCode: any;
  calculatedOnce: boolean;
  changedDefaults: any = {
    term: false,
    program: false,
    product: false,
    asset: false,
    paymentStructure: false,
  };
  defautltUDCEstablishmentFee: {
    defaultudcEstablishmentFee?: any;
    defaultDealerOriginationFee?: any;
    defaultEstablishmentFeeShare?: any;
  };
  dealerOriginationFeeopenOnEdit: boolean = false;
  termFrequencyMultiplier = {
    Monthly: 1,
    "Semi Monthly": 2.0,
    Fortnightly: 2.166,
    Quarterly: 1.0 / 3,
    "Semi Annual": 1.0 / 6,
    Annual: 1.0 / 12,
    Weekly: 4.33,
    "Four Weekly": 1.0833,
  };

  showResult: boolean;
  standardQuoteSvc: any;
  isAssetSearch: boolean = false;
  isAssetSubmit: boolean = false;
  isFinancialAssetPriceValueDetails: boolean = false;
  isAssetTrade: boolean = false;
  assetTypeData: any = [];
  updateIndividualCustomerWarning: boolean = false;
  contractId: any;
  isProgramChanged = false;
  productBusinessModel:any;
  internalSalesDealers:any;
  loanDateSignal = signal<Date | null>(null);

  constructor(
    public override data: DataService,
    public override route: ActivatedRoute,
    public tradeSvc: AssetTradeSummaryService,
    private datePipe: DatePipe,
    private stoteSvc: StorageService,
    private toasterService: ToasterService,
  ) {
    super(data, route);
    let params: any = this.route.snapshot?.params;
  }

  public patchDataOnPreview = new BehaviorSubject<any>(null);
  public standardPaymentOptionsTable = new Subject<any>();
  public isDocumentData = new BehaviorSubject<boolean>(false);
  public programChange = new BehaviorSubject<any>(null);
  public onDealerChange = new BehaviorSubject<boolean>(false);
  public updateSignatories = new ReplaySubject<void>(1);
  public onLoanPurposeChange = new BehaviorSubject<any>(null);
  onProductProgramChange = new Subject<any>();
  shouldResetInsurance: boolean = false;
  shouldResetServicePlan: boolean = false;
  resetServicePlanForm = new Subject<boolean>();
  afvProgramsLoaded = new Subject<any[]>();
  expectedUsagesLoaded = new Subject<any[]>();
  shouldResetAccessories: boolean = false;
  
  // Store AFV user-selected asset type to preserve across preview calls
  afvUserSelectedAssetType: {
    assetTypeDD?: string;
    assetTypeId?: number;
    assetTypeModalValues?: string;
  } = {};
  
  
  kmAllowanceOptions: { label: string; value: string }[] = [];
  kmAllowanceDefaultValue: string = '';
  searchResultForSupplier = signal<any[]>([])

  public customerRowData = signal<any>(null); //Implemented Signal for passing customer row data to party verification overlay component
  updatedCustomerSummary: Map<number, any> = new Map(); //shifted from borrower/guarantor componet to sevices for multiple component updates
  partyStatusListforIconDisable: string[] = [];
  public triggerAfterPartyWorkflowChange = new BehaviorSubject<any>(null);
  triggerAllComponentsDuringWorkflowChange = signal<number>(0);

  override formStatusArr = [];
  individualData: any[] = [];
  businessData: any[] = [];
  trustData: any[] = [];
  accessoriesData: any = {};
  taxProfile: any;
  searchCustomerData: any = [];
  // accessGranted: any = {};
  internalSalesDealersList: any[] = [];

  //   private _updatedFieldValue = [
  //   {"cashPriceofAsset": 0},
  //   {"udcEstablishmentFee": 0},
  //   {"dealerOriginationFee": 0},
  //   {"cashDeposit": 0},
  //   {"tradeAmount": 0},
  //   {"settleAmount": 0}
  // ];

  // updateFieldValuesFromApi(apiResponse: any) {
  //   if (!apiResponse) return;
  //   console.log('API Response for updating field values:', apiResponse);
  //   // Update each field based on the API response structure
  //   // Adjust the property names according to your actual API response
  //   this._updatedFieldValue = [
  //     {"cashPriceofAsset": apiResponse?.financialAssets?.[0]?.cost || 0},
  //     {"udcEstablishmentFee": apiResponse?.financialAssets?.[0]?.udcEstablishmentFee || 0},
  //     {"dealerOriginationFee": apiResponse?.financialAssets?.[0]?.dealerOriginationFee || 0},
  //     {"cashDeposit": apiResponse?.financialAssets?.[0]?.cashDeposit || 0},
  //     {"tradeAmount": apiResponse?.financialAssets?.[0]?.tradeAmount || 0},
  //     {"settleAmount": apiResponse?.financialAssets?.[0]?.settlementAmount || 0}
  //   ];
  //   console.log('Updated field values:', this._updatedFieldValue);
  // }

  // workflowIncreaseDecreaseValidation() {
  //   return this._updatedFieldValue;
  // }

  addsOnAccessoriesData(data) {
    this.accessoriesData = {
      ...this.accessoriesData,
      ...data,
    };
    this.accessoriesSubject.next(this.accessoriesData);
  }

  accessoriesSubject = new BehaviorSubject<any>(this.accessoriesData);
  accessoriesFormDataSubject = new Subject<any>();
  accessoriesFormData = this.accessoriesFormDataSubject.asObservable();
  standardValueAccordianValue;

  // = new BehaviorSubject<any>([individualData]);
  individualDataSubject = new BehaviorSubject<any>(this.individualData);
  businessDataSubject = new BehaviorSubject<any>(this.businessData);
  forceToClickCalculate = new BehaviorSubject<any>(false);
  forceCalculateBeforeSchedule = new BehaviorSubject<any>(false);
  udcAndDealerFeeChanged = new Subject<{
    udcEstablishmentFee?: number;
    dealerOriginationFee?: number;
  }>();
  changedProgram = new BehaviorSubject<any>(false);
  setStandardOptions = new BehaviorSubject<any>(false);

  trustDataSubject = new BehaviorSubject<any>(this.trustData);

  dataList = [];
  changedOriginator = new BehaviorSubject<any>(false);
  mapConfigData(contractData) {
    let productCode = "";
    let taxProfile: any;
    let servicePlanAndOtherData: any[] = [];
    const servicePlan = contractData?.financialAssetLease?.servicePlan || [];
    const others = contractData?.financialAssetLease?.others || [];
    const sortedOthers = [...others].sort((a, b) => a?.rowNo - b?.rowNo);
    servicePlanAndOtherData.push(...servicePlan, ...sortedOthers);
    const combinedData = servicePlanAndOtherData;
    [
      { code: "CSA", id: 5, name: "Credit Sale Agreement" },
      { code: "AFV", id: 27, name: "Assured Future Value" },
      { code: "FL", id: 3, name: "Finance Lease" },
      { code: "TL", id: 10, name: "Term Loan" },
      { code: "OL", id: 4, name: "Operating Lease" },
    ];

    if (contractData?.product?.productCode?.startsWith("FL")) {
      productCode = "FL";
      taxProfile = { code: "FL", id: 3, name: "Finance Lease" };
    }
    if (contractData?.product?.productCode?.startsWith("TL")) {
      productCode = "TL";
      taxProfile = { code: "TL", id: 10, name: "Term Loan" };
    }
    if (contractData?.product?.productCode?.startsWith("AFV")) {
      productCode = "AFV";
      taxProfile = { code: "AFV", id: 27, name: "Assured Future Value" };
    }
    // if (contractData?.product?.productCode?.startsWith("CSA")) {
    //   productCode = "CSA";
    //   taxProfile = { code: "CSA", id: 5, name: "Credit Sale Agreement" };
    // }
    if (contractData?.product?.productCode?.startsWith("OL")) {
      productCode = "OL";
      taxProfile = { code: "OL", id: 4, name: "Operating Lease" };
    }

    if (contractData?.product?.productCode?.startsWith("CSA")) {
      productCode = "CSA";
      taxProfile = {
        code: contractData?.taxProfile?.code,
        id: contractData?.taxProfile?.id,
        name: contractData?.taxProfile?.name,
      };
    }

    sessionStorage.setItem("productCode", productCode);
    this.contractId = contractData?.contractId;
    this.productCode = productCode;
    let internalSalesPerson;


  if((sessionStorage.getItem("externalUserType") == "Internal" )){
    internalSalesPerson = contractData?.contractPartyRoles?.find(role=>role.partyRole === "Salesperson")
    }
    let DataMapper = {
      // quode Details (Additional Charges and Less Deposit )
      // contractId: null,
      udcEstablishmentFee: Math.abs(
        contractData?.financialAssets[0]?.udcEstablishmentFee || 0
      ),
      apiudcEstablishmentFee: Math.abs(
        contractData?.financialAssets[0]?.udcEstablishmentFee || 0    // To store updated, api values for increase decrease validations
      ),
      dealerOriginationFee: Math.abs(
        contractData?.financialAssets[0]?.dealerOriginationFee || 0
      ),
      apidealerOriginationFee: Math.abs(
        contractData?.financialAssets[0]?.dealerOriginationFee || 0
      ),
      apisettlementAmount: Math.abs(contractData?.financialAssets[0]?.settlementAmount || 0),
      termMonthAndDays: contractData?.termMonthAndDays,
      paymentStructure: contractData?.paymentStructure,
      udcEstablishmentFeeId:
        contractData?.financialAssets[0]?.udcEstablishmentFeeId,
      dealerOriginationFeeId:
        contractData?.financialAssets[0]?.dealerOriginationFeeId,
      deposit: contractData?.financialAssets[0]?.cashDeposit || 0,
      apideposit: contractData?.financialAssets[0]?.cashDeposit || 0,
      depositPct:
        ((contractData?.financialAssets?.[0]?.cashDeposit || 0) /
          (contractData?.financialAssets?.[0]?.cost || 0)) *
        100 || 0,
      cashDepositId: contractData?.financialAssets[0]?.cashDepositId || 0,
      apidepositPct:
        ((contractData?.financialAssets?.[0]?.cashDeposit || 0) /
          (contractData?.financialAssets?.[0]?.cost || 0)) *
        100 || 0,

      isDraft: contractData?.isDraft,

      //payment summary
      amtFinancedTotal: contractData?.financialAssetLease?.amtFinancedTotal,
      amtTotalInterest: contractData?.financialAssetLease?.amtTotalInterest,
      balloonAmount: contractData?.financialAssetLease.balloonAmount,
      firstPaymentDate:
        new Date(
          contractData?.financialAssetLease?.financialAssetPriceSegments?.[0]?.paymentScheduleDate
        ) || null,
      paymentAmount: contractData?.financialAssetLease.paymentAmount,
      paymentAmountIrregular: this?.getIrregular(
        contractData?.financialAssetLease?.financialAssetPriceSegments,
        contractData?.isFixed,
        contractData?.financialAssetLease.balloonAmount
      ),
      loanDate: new Date(contractData?.financialAssetLease.startDate) || null,
      firstLeaseDate: contractData?.firstPaymentDate,
      leaseDate: new Date(contractData?.financialAssetLease.startDate) || null,
      productId: contractData?.product?.productId,
      programId: contractData?.program?.programId,
      firstLeasePayment: contractData?.financialAssetLease.paymentAmount,
      numberofPayments: contractData?.financialAssetLease?.numberofPayments,
      numberofFlows:
        contractData?.financialAssetLease?.financialAssetPriceSegments?.reduce(
          (sum, ele) => sum + ele?.installments,
          0
        ),
      totalEstablishmentFee:
        contractData?.financialAssetLease?.totalEstablishmentFee,
      assetTypeId: contractData?.financialAssets[0]?.assetType?.assetTypeId,
      assetTypeDD: contractData?.financialAssets[0]?.assetType?.assetTypeName,
      assetTypeModalValues: contractData?.financialAssets[0]?.assetType?.assetTypePath,
      productName: contractData?.product?.name || contractData?.product?.extName,
      productExtName: contractData?.product?.extName,
      /// Asset Summary
      cashPriceValue: contractData?.financialAssets[0]?.cost,
      apicashPriceValue: contractData?.financialAssets[0]?.cost,
      cashPriceFinanceLease: contractData?.financialAssets[0]?.cost,
       conditionDD: contractData?.financialAssets[0]?.condition == 0 ? 782 : 781,
      productCode: productCode,
      taxProfile: taxProfile,
      retailPriceValue:
        contractData?.financialAssetLease?.amtRecommendedRetailPriceCost,
      additionalFundType: contractData?.additionalfundType,

      // New Additional Fund
      additionalFund: Math.abs(
        contractData?.financialAssetLease?.additionalFund?.amount
      ),
      additionalfundPurpose:
        contractData?.financialAssetLease?.additionalFund?.reference,

      customFlowID:
        contractData?.financialAssetLease?.additionalFund?.customFlowID,
      /// Adds On Accessories
      accessories: contractData?.financialAssetLease?.accessories,
      servicePlan:combinedData || contractData?.financialAssetLease?.servicePlan,
      other:contractData?.financialAssetLease?.others ,
      registrations: contractData?.financialAssetLease?.registrations,
      financialAssetPriceSegments:contractData?.financialAssetLease?.financialAssetPriceSegments,
      financialAssetPriceSegmentsUpdatedId: contractData?.financialAssetLease || null,
      extended:
        contractData?.financialAssetLease?.extendedWarranty == null
          ? ""
          : contractData?.financialAssetLease?.extendedWarranty?.months ||
            contractData?.financialAssetLease?.extendedWarranty?.amount
            ? "yes"
            : "no",
      extendedMonths:
        contractData?.financialAssetLease?.extendedWarranty?.months,
      extendedAmount: Math.abs(
        contractData?.financialAssetLease?.extendedWarranty?.amount || 0
      ),
      extendedProvider:
        contractData?.financialAssetLease?.extendedWarranty?.provider,
      extendedId:
        contractData?.financialAssetLease?.extendedWarranty?.customFlowID,

      mechanicalBreakdownInsurance:
        contractData?.financialAssetLease?.mechanicalBreakdownInsurance == null
          ? ""
          : contractData?.financialAssetLease?.mechanicalBreakdownInsurance
            ?.months ||
            contractData?.financialAssetLease?.mechanicalBreakdownInsurance
              ?.amount
            ? "yes"
            : "no",
      mechanicalBreakdownInsuranceMonths:
        contractData?.financialAssetLease?.mechanicalBreakdownInsurance?.months,
      mechanicalBreakdownInsuranceAmount: Math.abs(
        contractData?.financialAssetLease?.mechanicalBreakdownInsurance
          ?.amount || 0
      ),
      mechanicalBreakdownInsuranceProvider:
        contractData?.financialAssetLease?.mechanicalBreakdownInsurance
          ?.provider,
      mechanicalBreakdownInsuranceId:
        contractData?.financialAssetLease?.mechanicalBreakdownInsurance
          ?.customFlowID,

      guaranteedAssetProtection:
        contractData?.financialAssetLease?.guaranteeAssetProtection == null
          ? ""
          : contractData?.financialAssetLease?.guaranteeAssetProtection
            ?.months ||
            contractData?.financialAssetLease?.guaranteeAssetProtection?.amount
            ? "yes"
            : "no",
      guaranteedAssetProtectionMonths:
        contractData?.financialAssetLease?.guaranteeAssetProtection?.months,
      guaranteedAssetProtectionAmount: Math.abs(
        contractData?.financialAssetLease?.guaranteeAssetProtection?.amount || 0
      ),
      guaranteedAssetProtectionProvider:
        contractData?.financialAssetLease?.guaranteeAssetProtection?.provider,
      guaranteedAssetProtectionId:
        contractData?.financialAssetLease?.guaranteeAssetProtection
          ?.customFlowID,
      motorVehicalInsurance:
        contractData?.financialAssetLease?.motorVehicleInsurance == null
          ? ""
          : contractData?.financialAssetLease?.motorVehicleInsurance?.months ||
            contractData?.financialAssetLease?.motorVehicleInsurance?.amount
            ? "yes"
            : "no",
      motorVehicalInsuranceMonths:
        contractData?.financialAssetLease?.motorVehicleInsurance?.months,
      motorVehicalInsuranceAmount: Math.abs(
        contractData?.financialAssetLease?.motorVehicleInsurance?.amount || 0
      ),
      motorVehicalInsuranceProvider:
        contractData?.financialAssetLease?.motorVehicleInsurance?.provider,
      motorVehicalInsuranceId:
        contractData?.financialAssetLease?.motorVehicleInsurance?.customFlowID,
      contract:
        contractData?.financialAssetLease?.consumerCreditInsurance == null ||
          contractData?.financialAssetLease?.consumerCreditInsurance?.months == ""
          ? ""
          : contractData?.financialAssetLease?.consumerCreditInsurance
            ?.months ||
            contractData?.financialAssetLease?.consumerCreditInsurance?.amount
            ? "yes"
            : "no",
      consumerCreditInsurance:
        contractData?.financialAssetLease?.consumerCreditInsurance == null ||
          contractData?.financialAssetLease?.consumerCreditInsurance?.months == ""
          ? ""
          : contractData?.financialAssetLease?.consumerCreditInsurance
            ?.months ||
            contractData?.financialAssetLease?.consumerCreditInsurance?.amount
            ? "yes"
            : "no",
      contractMonths:
        contractData?.financialAssetLease?.consumerCreditInsurance?.months,
      contractAmount: Math.abs(
        contractData?.financialAssetLease?.consumerCreditInsurance?.amount
      ),
      contractProvider:
        contractData?.financialAssetLease?.consumerCreditInsurance?.provider,
      consumerCreditInsuranceId:
        contractData?.financialAssetLease?.consumerCreditInsurance
          ?.customFlowID,
      residualValue: contractData?.financialAssetLease?.residualValue || 0,
      assuredFutureValue: contractData?.financialAssetLease?.residualValue ,
  afvaPaymentSummaryAmount: contractData?.financialAssetLease?.residualValue || 0,
      afvModel: contractData?.financialAssets[0]?.physicalAsset?.model,
      afvMake: contractData?.financialAssets[0]?.physicalAsset?.make,
      afvYear: contractData?.financialAssets[0]?.physicalAsset?.year,
      afvVariant: contractData?.financialAssets[0]?.physicalAsset?.variant,
      description: contractData?.financialAssets[0]?.physicalAsset?.description,
      features: contractData?.financialAssets[0]?.physicalAsset?.features,
      afvProvider: "UDC Finance Ltd.",
      pctResidualValue:
        (contractData?.financialAssetLease?.residualValue /
          contractData?.financialAssets?.[0]?.cost) *
        100 || 0,
      ...contractData?.usageandExcessAllowanceRequest?.[0],
      // Extract kmAllowance - check top level first (AFV), then usageandExcessAllowanceRequest (OL)
      kmAllowance: Array.isArray(contractData?.kmAllowance) 
        ? contractData?.kmAllowance?.[0] 
        : (Array.isArray(contractData?.usageandExcessAllowanceRequest?.[0]?.kmAllowance) 
          ? contractData?.usageandExcessAllowanceRequest?.[0]?.kmAllowance?.[0] 
          : contractData?.usageandExcessAllowanceRequest?.[0]?.kmAllowance || contractData?.kmAllowance),
      flows: contractData?.flows,
      totalCost: contractData?.financialAssetLease?.totalCost,
      term: contractData?.financialAssetLease?.term,
      finId: contractData?.financialAssets?.[0]?.id,
      phyId: contractData?.financialAssets?.[0]?.physicalAsset?.id,
      vehicleId:
        contractData?.financialAssets?.[0]?.physicalAsset?.vehicle
          ?.assetClassId,
      totalAmountBorrowed:
        sessionStorage.getItem("productCode") === "FL" || (sessionStorage.getItem("productCode") === "OL" && contractData?.isTaxinclusive)
          ? (contractData?.financialAssetLease?.totalAmountBorrowed || 0) +
          (contractData?.financialAssets?.[0]?.taxesAmt || 0)
          : contractData?.financialAssetLease?.totalAmountBorrowed || 0,
      includeGst: contractData?.financialAssets?.[0]?.taxesAmt || 0,
      interestCharges: contractData?.financialAssetLease?.interestCharge || 0,
      
      actualMaintenanceFee: contractData?.loanMaintenanceFee || 0,
      loanMaintenceFee:contractData?.isDraft == true 
      ? (contractData?.loanMaintenanceFee || 0) * (contractData?.financialAssetLease?.term || 0)
      : contractData?.lMFTotalAmount || 0,
      apiLoanMaintenceFee:contractData?.isDraft == true 
      ? (contractData?.loanMaintenanceFee || 0) * (contractData?.financialAssetLease?.term || 0)
      : contractData?.lMFTotalAmount || 0,
      //loanMaintenceFee: contractData?.lMFTotalAmount || 0,
      //apiLoanMaintenceFee: contractData?.lMFTotalAmount || 0,
      originatorName: contractData?.originatorName,
      fixed: contractData?.isFixed,
      taxOnAsset: contractData?.financialAssets?.[0]?.taxesAmt,
      salesPerson: Number(
        contractData?.contractPartyRoles?.[0]?.party?.partyId
      ),
      internalSalesperson: internalSalesPerson ? internalSalesPerson?.party?.partyId : "",
      //Dealer Finance
      dealerSubsidy: contractData?.financialAssets[0]?.dealerSubsidy,
      dealerCommission: contractData?.financialAssets[0]?.dealerCommission,
      privateSales: contractData?.financialAssetLease?.privateSale || false,
      // establishmentFeeShare: Math.abs(contractData?.financialAssetLease?.establishmentFeeShare)
      ppsrPercentage: Math.abs(contractData?.ppsrPercentage || 0),
      ppsrPercentageId: contractData?.ppsrPercentageId || 0,
      ppsrCount: contractData?.ppsrPercentage
        ? Math.abs(contractData?.ppsrPercentage || 0) / 10.35
        : 0,
      apippsrCount: contractData?.ppsrPercentage
        ? Math.abs(contractData?.ppsrPercentage || 0) / 10.35
        : 0,
      netTradeAmount: Math.abs(contractData?.tradeAmount || 0),
      // apinetTradeAmount: Math.abs(contractData?.tradeAmount || 0),
      apitradeAmount: Math.abs(contractData?.tradeAmount || 0),
      totalMaintenanceHdrId: contractData?.totalMaintenanceHdrId,
      // totalMaintenanceAmount: contractData?.maintainanceCost,
      maintainanceCost: contractData?.totalMaintenanceAmount,           // Changed key as per formConfig
      apimaintainanceCost: contractData?.maintainanceCost,        // To store updated, api values for increase decrease validations
      financedMaintenanceHdrId: contractData?.financedMaintenanceHdrId,
      // financedMaintenanceAmount: contractData?.financedMaintainanceCharge,
      financedMaintainanceCharge: contractData?.financedMaintenanceAmount,
      apifinancedMaintainanceCharge: contractData?.financedMaintainanceCharge,
      tracksorTyres: contractData?.tracksorTyres,
      serviceAgent: contractData?.serviceAgent,
      maintenanceRequirement: contractData?.maintenanceRequirement,
      baseRate: contractData?.baseInterestRate,
      interestRate: contractData?.interestRate,
      apiinterestRate: contractData?.interestRate,
      apiPhysicalAssetData : (() => {
        const childItems = contractData?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems;
        const physicalAsset = contractData?.financialAssets[0]?.physicalAsset;
        if (childItems && childItems.length > 0) {
          return childItems;
        } else if (physicalAsset) {
          return Array.isArray(physicalAsset) ? physicalAsset : [physicalAsset];
        }
        return [];
      })(),
      apiTradeAssetData : contractData?.tradeInAssetRequest,
    };
    return DataMapper;
  }

  getIrregular(segments, fixed, balloonAmount) {
    let Amount = 0;
    let isIrregular: boolean = false;
    for (let i = 0; i < segments?.length; i++) {
      if (i == 0) {
        Amount = segments[i]?.paymentSchedulePayment;
        if (i == segments?.length - 1) {
          if (
            Amount ==
            segments[i]?.paymentSchedulePayment + (balloonAmount || 0)
          ) {
          } else {
            isIrregular = true;
            break;
          }
        }
      } else {
        if (
          Amount == segments[i]?.paymentSchedulePayment &&
          i != segments?.length - 1
        ) {
        } else {
          if (i == segments?.length - 1) {
            if (
              Amount ==
              segments[i]?.paymentSchedulePayment + (balloonAmount || 0)
            ) {
            } else {
              isIrregular = true;
              break;
            }
          } else {
            isIrregular = true;
            break;
          }
        }
      }
    }

    return isIrregular;
  }

  loadStandardOptions: boolean;
  async createQuick(formData?: any, programChanged?: boolean) {
    // Validation: Check for required fields
    let contractId = formData?.contractId;
    if (!formData) {
      return null;
    }
    let accCustomFlows = [];
    formData?.accessories?.forEach((ele) => {
      let obj = {
        customFlowId: ele?.customflowID,
        amount: ele?.amount || 0,
        customFlowHdr: {
          id: 32,
          name: "Accessories",
        },
      };

      accCustomFlows.push(obj);
    });

    let serviceCustomFlows = [];

    formData?.servicePlan?.forEach((ele) => {
      let obj = {
        customFlowId: ele?.customflowID,
        amount: ele?.amount || 0,
        customFlowHdr: {
          id: 73,
          name: "Service Plan",
        },
      };

      serviceCustomFlows.push(obj);
    });

    let registrationsCustomFlows = [];
    formData?.registrations?.forEach((ele) => {
      let obj = {
        customFlowId: ele?.customflowID,
        amount: ele?.amount || 0,
        customFlowHdr: {
          id: 66,
          name: "Registration Fee",
        },
      };

      registrationsCustomFlows.push(obj);
    });

    let cashDeposit =
      formData?.deposit > 0
        ? [
          {
            amount: formData?.deposit || 0,
            customFlowId: formData?.cashDepositId,
            isInputAsPercent: false,
            customFlowHdr: {
              id: 69,
              name:
                formData?.productCode === "FL"
                  ? "Deposit to Supplier"
                  : "Deposit to Supplier",
            },
          },
        ]
        : [];
    let tradeCustom =
      formData?.tradeAmountPrice > 0
        ? [
          {
            amount: formData?.tradeAmountPrice || 0,
            customFlowId: formData.tradeAmountId,
            customFlowHdr: {
              id: 68,
              name: "Trade-In",
            },
          },
        ]
        : [];

    let udcEstablishmentFeeCustom =
      formData?.udcEstablishmentFee > 0
        ? [
          {
            amount: formData?.udcEstablishmentFee || 0,
            customFlowId: formData?.udcEstablishmentFeeId,
            customFlowHdr: {
              id: 29,
              name: "UDC Establishment Fee",
            },
          },
        ]
        : [];

    let dealerOriginationFeeCustom =
      formData?.dealerOriginationFee > 0
        ? [
          {
            amount: formData?.dealerOriginationFee || 0,
            customFlowId: formData?.dealerOriginationFeeId,
            customFlowHdr: {
              id: 8,
              name: "Dealer Establishment Fee",
            },
          },
        ]
        : [];
    let request = {
      queryArgs: {
        contractDefaultingCriteria: [],
      },
      Data: {
        isDraft: false,
        contractId: contractId || undefined,
        product: { productId: formData?.productId },
        program: { programId: formData?.programId },
        installmentFrequency: 'Monthly',//formData?.frequency,
        paymentStructure: formData?.paymentStructure,
        lessorRate: formData?.interestRate ?? 0,
        financialAssets: [
          {
            assetName: "Asset1",
            assetId: contractId ? formData?.finId : undefined,
            assetType: { assetTypeId: formData?.assetTypeId },
            cost: formData?.cashPriceValue ?? 0,
            financialAssetLease: {
              scheduleTerm: formData?.termOptions ?? formData?.term,
              pctResidualValue: Number((formData?.pctResidualValue ?? 0).toFixed(2)),
              balloonDt: new Date(Date.now() + 86400000).toISOString(),
              residualValue: formData?.residualValue ?? 0,
              amtBalloon: formData?.balloonAmount ?? 0,
              pctBalloon: Number((formData?.balloonPct ?? 0).toFixed(2)),
            },
            physicalAsset: {
              assetHdrId: contractId ? formData?.phyId : undefined,
              model: "",
              assetClassEnum: "Vehicle",
              originalPurchasePrice: 0,
              originalPurchaseDt: "2025-07-21T00:00:00",
              assetCondition: "New",
              vehicle: {
                productionDt: "2025-07-20T00:00:00",
                firstRegistrationDt: "2025-07-20T00:00:00",
                ownershipDt: "2025-07-20T00:00:00",
              },
            },
            // customFlows: contractId
            customFlows: [
              // Conditionally add only if value > 0
              formData?.extendedAmount > 0 && {
                customFlowId: formData?.extendedId || 0,
                amount: formData?.extendedAmount || 0,
                customFlowHdr: {
                  id: 72,
                  name: "Extended Warranty",
                },
              },
              formData?.mechanicalBreakdownInsuranceAmount > 0 && {
                customFlowId: formData?.mechanicalBreakdownInsuranceId || 0,
                amount: formData?.mechanicalBreakdownInsuranceAmount || 0,
                customFlowHdr: {
                  id: 74,
                  name: "Mechanical Breakdown",
                },
              },
              formData?.guaranteedAssetProtectionAmount > 0 && {
                customFlowId: formData?.guaranteedAssetProtectionId || 0,
                amount: formData?.guaranteedAssetProtectionAmount || 0,
                customFlowHdr: {
                  id: 57,
                  name: "Guaranteed Asset Protection",
                },
              },
              formData?.motorVehicalInsuranceAmount > 0 && {
                customFlowId: formData?.mechanicalBreakdownInsuranceId || 0,
                amount: formData?.motorVehicalInsuranceAmount || 0,
                customFlowHdr: {
                  id: 75,
                  name: "Motor Vehicle Insurance",
                },
              },
            ]
              .filter(Boolean)
              .concat(
                cashDeposit,
                accCustomFlows,
                serviceCustomFlows,
                registrationsCustomFlows,
                tradeCustom,
                udcEstablishmentFeeCustom,
                dealerOriginationFeeCustom
              ),
          },
        ],
        taxProfile: formData?.taxProfile,
        customFieldGroups: [
          {
            name: "Standard Payment Option",
            items: [
              {
                rowNo: 0,
                customFields: [
                  {
                    name: "KM Allowance",
                    value: formData?.kmAllownace ?? 0,
                  },
                ],
              },
            ],
          },
        ],
        flows: [{ amount: formData?.flowAmount ?? 0 }],
      },
    };
    // let qqrequest = this.baseSvc?.createQuick(
    //   this.baseFormData, isProgramChanged
    // );
    this.loadStandardOptions = true;
    await this.data
      .post("QuickQuote/get_quote_preview", request, null, true)
      .pipe(
        map(async (res) => {
          if (res?.data) {
            this.setBaseDealerFormData({
              standardPaymentOptionValue: res.data.sort(
                (a, b) => a.months - b.months
              ),
            });
            this.loadStandardOptions = false;
          }
        })
      )
      .toPromise();
    this.standardPaymentOptionsTable.next(true);
  }

  private buildFinancialAssetLease(productCode: string, formData: any) {
    //FL product - add residual, remove balloon
    if (productCode === "FL") {
      return {
        fixed: formData?.isFixed || false,
        isFixed: formData?.isFixed || false,
        term: formData?.term,
        pctResidualValue: formData?.pctResidualValue || 0,
        residualValue: formData?.residualValue || 0,
        financialAssetPriceSegments: this.mapPriceSegments(
          "preview",
          [],
          undefined,
          formData
        ),
      };
    }

    // NON FL product - keep balloon
    return {
      balloonAmount: formData?.balloonAmount || 0,
      fixed: formData?.isFixed || false,
      isFixed: formData?.isFixed || false,
      balloonPct: formData?.balloonPct || 0,
      term: formData?.term,
      financialAssetPriceSegments: this.mapPriceSegments(
        "preview",
        [],
        undefined,
        formData
      ),
    };
  }
  async contractPreview(

    formData,
    defaulting,
    onChange?: any,
    resetSchedule?: any,
    restrictRebinding?: boolean
  ) {

    const allServicePlans = formData?.servicePlan || [];
    const servicePlanItems = allServicePlans
      .filter(sp => sp.name === "Service Plan")
      .map(sp => ({
        ...sp,
        amount: sp.amount ?? 0
      }));
    const otherItemsObject = allServicePlans.filter(sp => sp.name === "Other Service Plan");
    const firstOtherId = otherItemsObject[0]?.id;
    const other = otherItemsObject.map(item => ({
      ...item,
      id: firstOtherId,
      amount: item.amount ?? 0
    }));

    const newRegistration = formData?.registrations?.map((reg: any) => ({
      ...reg,
      name: "Registration",
      amount: reg.amount ?? 0
    })) || [];


    if (formData?.contractId) {
      this.defautltUDCEstablishmentFee = {
        defaultudcEstablishmentFee: Math.abs(
          formData?.financialAssets[0]?.udcEstablishmentFee
        ),
        defaultDealerOriginationFee: Math.abs(
          formData?.financialAssets[0]?.dealerOriginationFee
        ),
      };
    }
    let request: any = {};
    if (onChange != "program") {
      request = {
        contractId: formData?.contractId || undefined,
        additionalFundType: formData?.additionalFundType || null,
        apiLoanMaintenceFee: formData.apiLoanMaintenceFee,
        amoutFinanced: 0,
        asset: "",
        assetInsuranceAmount: 0,
        assetInsuranceMonths: 0,
        assetInsuranceName: "",
        assetInsuranceProvider: "",
        assetLocationOfUse:
          formData?.physicalAsset?.[0]?.assetLocationOfUse || "",
        baseInterestRate: formData?.isDealerChange
          ? null
          : formData?.baseInterestRate,
        marginRate: formData?.isDealerChange ? null : formData?.marginRate,
        calcDt: new Date().toISOString(),
        calculateSettlement: 0,
         cashDeposit: Number(formData?.deposit || 0).toFixed(2),
        conditionOfGood: "",
        countryFirstRegistered:
          formData?.physicalAsset?.[0]?.countryFirstRegistered || "New Zealand",
        dealerOriginationFee: formData?.dealerOriginationFee || 0,
        deposit: Number(formData?.deposit || 0).toFixed(2) || 0,
        estimatedCommissionSubsidy: formData?.estimateCommissions || 0,
        extendedWarrantyMonth: 0,
        financialAssetInsurance:
          sessionStorage.getItem("productCode") === "OL"
            ? formData?.financialAssetInsurance?.partyNo
              ? formData?.financialAssetInsurance
              : []
            : formData?.financialAssetInsurance || [],
        financialAssetLease: {
          additionalFund:
            formData?.financialAssetLease?.additionalFund ||
            formData?.additionalFund,
          amtBaseRepayment: 0,
          amtFinancedTotal: 0,
          amtTotalInterest: 0,
          balloonAmount: formData?.balloonAmount || 0,
          balloonDate: new Date().toISOString(),
          balloonPct: formData?.balloonPct || 0,
          charges: 0,
          dealerOriginationFee: formData?.dealerOriginationFee || 0,
          establishmentFeeShare: 0,
          estimatedCommissionSubsidy: 0,
          accessories: (formData?.accessories || []).map(acc => ({ ...acc, amount: acc?.amount || 0 })),
          consumerCreditInsurance:
            formData?.contractAmount && formData?.contractId
              ? {
                amount: formData?.contractAmount || 0,
                months: String(formData?.contractMonths || 0),
                provider: formData?.contractProvider || "",
                customFlowID: formData?.consumerCreditInsuranceId,
              }
              : {
                customFlowID: formData?.consumerCreditInsuranceId,
                changeAction:
                  formData?.productCode === "OL" &&
                    (!formData?.consumerCreditInsuranceId ||
                      formData?.consumerCreditInsuranceId === 0)
                    ? ""
                    : formData?.contractInsuranceChangeAction,
              },
          extendedWarranty:
            formData?.extendedAmount && formData?.contractId
              ? {
                amount: formData?.extendedAmount || 0,
                months: String(formData?.extendedMonths || 0),
                provider: formData?.extendedProvider || "",
                customFlowID: formData?.extendedId,
              }
              : {
                customFlowID: formData?.extendedId,
                changeAction: formData?.extendedWarrantyChangeAction,
              },
          guaranteeAssetProtection:
            formData?.guaranteedAssetProtectionAmount && formData?.contractId
              ? {
                amount: formData?.guaranteedAssetProtectionAmount || 0,
                months: String(
                  formData?.guaranteedAssetProtectionMonths || 0
                ),
                provider: formData?.guaranteedAssetProtectionProvider || "",
                customFlowID: formData?.guaranteedAssetProtectionId,
              }
              : {
                customFlowID: formData?.guaranteedAssetProtectionId,
                changeAction: formData?.guaranteedAssetChangeAction,
              },
          mechanicalBreakdownInsurance:
            formData?.mechanicalBreakdownInsuranceAmount && formData?.contractId
              ? {
                months: String(
                  formData?.mechanicalBreakdownInsuranceMonths || 0
                ),
                amount: formData?.mechanicalBreakdownInsuranceAmount || 0,
                provider:
                  formData?.mechanicalBreakdownInsuranceProvider || "",
                customFlowID: formData?.mechanicalBreakdownInsuranceId,
              }
              : {
                customFlowID: formData?.mechanicalBreakdownInsuranceId,
                changeAction: formData?.mechanicalBreakdownChangeAction,
              },
          motorVehicleInsurance:
            formData?.motorVehicalInsuranceAmount && formData?.contractId
              ? {
                months: String(formData?.motorVehicalInsuranceMonths || 0),
                amount: formData?.motorVehicalInsuranceAmount || 0,
                provider: formData?.motorVehicalInsuranceProvider || "",
                customFlowID: formData?.motorVehicalInsuranceId,
              }
              : {
                customFlowID: formData?.motorVehicalInsuranceId,
                changeAction: formData?.motorVehicalInsuranceChangeAction,
              },
          servicePlan: servicePlanItems|| [],
          registrations: newRegistration || [],
          other: other || [],
          fixed: formData?.fixed || false,
          isFixed: formData?.fixed || false,
          interestCharge: 0,
          firstLeasePayment: 0, // For FL, OL
          firstLeasePaymentAmount: 0, // For OL
          lastLeasePayment: 0, // For FL
          totalNoofpaymnets: 0, // For FL
          numberofPayments: 0,
          matureDate: new Date().toISOString(),
          netTradeAmount: 0,
          paymentAmount: formData?.paymentAmount || 0,
          paymentSchedule: 0,
          residualValue: formData?.residualValue || 0,
          pctResidualValue: formData?.pctResidualValue || 0,
          SettlementUDCHdrId: formData?.SettlementUDCHdrId || 0,
          settlementAmount: formData?.settlementAmount || 0,
          startDate: String(formData?.loanDate || new Date().toISOString()),
          term: formData?.term || formData?.terms,
          totalAmountBorrowed: 0,
          totalAmountBorrowedIncGST: 0,
          totalAmtFinancedTax: 0,
          totalCost: formData?.retailPriceValue || 0,
          totalEstablishmentFee: formData?.totalEstablishmentFee || 0,
          totalInterest: 0,
          tradeAmount: formData?.tradeAmountPrice || 0,
          ...(formData?.financialAssetPriceSegments?.length >= 0
            ? {
              financialAssetPriceSegments:
                this.isProgramChanged && formData?.contractId
                  ? []
                  : resetSchedule ||
                    (this?.changedDefaults?.asset && !formData?.contractId)
                    ? undefined
                    : this.mapPriceSegments(
                      "preview",
                      formData?.financialAssetPriceSegments,
                      //formData?.contractId ? formData?.financialAssetLease ?.financialAssetPriceSegments : null,
                      formData?.contractId ? formData?.financialAssetPriceSegmentsUpdatedId?.financialAssetPriceSegments:null,
                      formData
                    ),
            }
            : null),
        },
        financialAssets: this.getFinancialAsset(formData),
        firstPaymentDate: formData?.firstPaymentDate
          ? new Date(formData.firstPaymentDate).toISOString()
          : null,
        frequency: formData?.frequency,
        inclOfGST: 0,
        insurer: "",
        interestRate: formData?.interestRate || 0,
        isDraft: false,
        lastPayment: "",
        loanAmount: 0,
        loanDate: String(
          formData?.productCode === "FL" || formData?.productCode === "OL"
            ? formData?.leaseDate || new Date().toISOString()
            : formData?.loanDate || new Date().toISOString()
        ),
        loanMaintenanceFee: 0,
        location: {
          extName: "New Zealand",
          locationId: 176,
          locationType: "Country",
        },
        mechanicalBreakdownMonth: 0,
        motivePower: "",
        netTradeAmount: 0,
        originatorNumber: formData?.originatorNumber?.toString() || null,
        originatorReference: formData?.originatorReference,
        paymentStructure: formData?.paymentStructure || "None",
        ppsrPercentage: formData.ppsrPercentage || 0,
        ppsrPercentageId: formData.ppsrPercentageId || 0,
        product: {
          productId: formData?.productId,
          productCode: sessionStorage.getItem("productCode") || "",
          extName: "",
        },
        program: {
          programId: formData?.programId,
          programCode: "",
          lookupName: "",
          extName: formData?.programExtName || formData?.program?.extName,
        },
        promotionQuote: String(formData?.promotionQuote ?? ""),
        purposeofLoan: formData?.purposeofLoan || "",
        quoteType: "",
        regoVIN: "",
        salesPerson: "",
        servicePlanMonths: 0,
        SettlementUDCHdrId: formData?.SettlementUDCHdrId || 0,
        settlementAmount: formData?.settlementAmount || 0,
        taxProfile: formData?.taxProfile,
        totalAmountBorrowed: 0,
        totalTermDays: 0,
        totalTermMonths: 0,
        totalAmountToRepay: String(0), // AFV
        kmAllowance: String(formData?.kmAllowance || ""), // AFV
        tradeAmount: formData?.tradeAmountPrice || 0,
        tradeInAssetRequest: formData?.tradeInAssetRequest || [],
        noOfRentalsInAdvance: Number(formData?.noOfRentalsInAdvance || 0),
        usageands: [
          {
            // OL
            usageUnit: formData?.usageUnit,
            excessUsageAllowance: formData?.excessUsageAllowance
              ? String(formData?.excessUsageAllowance)
              : null,
            excessUsageAllowancePercentage:
              formData?.excessUsageAllowancePercentage
                ? String(formData?.excessUsageAllowancePercentage)
                : null,
            excessUsageCharge: formData?.excessUsageCharge
              ? String(formData?.excessUsageCharge)
              : null,
            rebateAmount: formData?.rebateAmount
              ? String(formData?.rebateAmount)
              : null,
            totalRebateAllowance: formData?.totalRebateAllowance
              ? String(formData?.totalRebateAllowance)
              : null,
            totalRebateAllowancePercent: formData?.totalRebateAllowancePercent
              ? String(formData?.totalRebateAllowancePercent)
              : null,
            totalUsageAllowance: formData?.totalUsageAllowance
              ? String(formData?.totalUsageAllowance)
              : null,
            usageAllowance: formData?.usageAllowance
              ? String(formData?.usageAllowance)
              : null,
          },
        ],
        termMonthAndDays: formData?.term ? formData?.term + " months" : "null", // OL
        value: "0",
        variant: "Car",
        weiveLMF: formData?.weiveLMF,
        //  usefulLife:  formData?.usefulLife ? Math.round(Number(formData.usefulLife)) : null,
        // For FL // For FL
        isStructured:
          formData?.paymentStructure == "None" || !formData?.paymentStructure
            ? true
            : false,
        totalMaintenanceHdrId: formData?.totalMaintenanceHdrId || 0,
        totalMaintenanceAmount: formData?.maintainanceCost,
        financedMaintenanceHdrId: formData?.financedMaintenanceHdrId || 0,
        financedMaintenanceAmount: formData?.financedMaintainanceCharge,
        tracksorTyres: formData?.tracksorTyres
          ? String(formData?.tracksorTyres)
          : "",
        serviceAgent: formData?.serviceAgent,
        maintenanceRequirement: formData?.maintenanceRequirement,
        isTaxInclusive: formData?.isTaxinclusive,
      };

      if (onChange == "asset") {
        request = {
          ...request,
          financialAssets: [
            {
              assetType: {
                assetTypeId: formData?.assetTypeId || 0,
                assetTypePath: formData?.assetTypeModalValues || "",
                assetTypeName: formData?.assetTypeDD || "",
              },
            },
          ],
        };
      }
    } else if (onChange == "program") {
      request = {
        financialAssetLease: {},
        financialAssets: [],
        contractId: formData?.contractId || null,
        product: {
          productId: formData?.productId,
          productCode: sessionStorage.getItem("productCode") || "",
          extName: "",
        },
        program: {
          programId: formData?.programId,
          programCode: "",
          lookupName: "",
          extName: "",
        },
        weiveLMF: formData.weiveLMF,
      };
    }

    this.changedProgram?.pipe().subscribe((res) => {
      // formData.isDealerChange = true;
    });

    let previewRequest = {
      queryArgs: formData?.isDealerChange
        ? {
          contractDefaultingCriteria: [],
          contractDefaultedDetails: ["Rates"],
        }
        : {
          contractDefaultingCriteria: defaulting,
          contractDefaultedDetails: [],
        },
      data: {
        ...request,
        PRCode: sessionStorage.getItem("productCode"),
      },
    };

    let previewRes = await this.data
      .post("Contract/contract_preview", previewRequest)
      .pipe(
        map(async (res) => {
          return res?.data;
        })
      )
      .toPromise();

    if (onChange != "program" && onChange != "asset") {
      this.standardValueAccordianValue = 0;
      let currentData;
      this.getBaseDealerFormData()
        .pipe(
          map((res) => {
            currentData = res;
          })
        )
        .toPromise();

      if (previewRes) {
        let dataMapped = this.mapPreviewConfigData(
          previewRes,
          previewRes,
          formData
        );

        let data = {
          ...formData,
          ...dataMapped,
        };

        if (!restrictRebinding) {
          this?.loadContractPreviewResToSystem(data);
        } else {
          return data;
        }
      }
    } else {
      if (previewRes) {
        let dataMapped = this.mapPreviewConfigData(
          previewRes,
          previewRes,
          formData,
          onChange
        );
        let data = {
          ...formData,
          ...dataMapped,
        };

        this.setBaseDealerFormData(data);

        this.assetSummaryData(previewRes, "preview");
        // this.showResult = true;
        this.forceToClickCalculate.next(true);
        this?.forceCalculateBeforeSchedule.next(false);

        this.patchDataOnPreview.next("preview");
      }
    }
    return previewRes;
  }

  loadContractPreviewResToSystem(data) {
    this?.forceCalculateBeforeSchedule.next(false);
    this.setBaseDealerFormData(data);
    this.showResult = true;
    this.patchDataOnPreview.next("preview");
    this?.createQuick(data);
    // if (data.contractId) {
    //   this.assetSummaryData(data);
    // }
  }

  getFinancialAsset(
    formData: any,
    finAssetId?: any,
    phyAssetId?: any,
    vehicleAssetId?: any
  ) {
    console.log(
      "getFinancialAsset",
      formData,
      finAssetId,
      phyAssetId,
      vehicleAssetId
    );

    let financialAsset = [];

    let finId =
      finAssetId >= 0 ? finAssetId : formData?.finId ? formData?.finId : 0;
    let phyId =
      phyAssetId >= 0 ? phyAssetId : formData?.phyId ? formData?.phyId : 0;
    let vehicleId =
      vehicleAssetId >= 0
        ? vehicleAssetId
        : formData?.vehicleId
          ? formData?.vehicleId
          : 0;

    if (formData?.productCode == "AFV") {
      let obj = {
        id: finId || formData?.finId || 0,
        amtFinancedTotal: 0,
        assetDescription: "",
        assetId: finId || formData?.finId || 0,
        assetName: formData?.assetTypeDD,
        assetType: {
          assetTypeId: formData?.assetTypeId || 0,
          assetTypePath: formData?.assetTypeModalValues || "",
          assetTypeName: formData?.assetTypeDD || "",
        },
        cashPriceofAnAsset: formData?.cashPriceValue || 0,
        cashDeposit: formData?.deposit || 0,
        cashDepositId: formData?.cashDepositId || undefined,
         udcEstablishmentFee: formData?.udcEstablishmentFee || 0,
        udcEstablishmentFeeId: formData?.udcEstablishmentFeeId || undefined,
        colour: "",
        condition: formData?.conditionDD,
        cost: formData?.cashPriceValue || formData?.cashPriceFinanceLease || 0,
        serialNo: "",
        taxesAmt: 0,
        yearOfManufacture: formData?.afvYear,
        assetLeased: "0",
        physicalAsset: {
          id: phyId || formData?.phyId || 0,
          assetId: null,
          assetName: formData?.assetTypeDD,
          assetType: {
            assetTypeId: formData?.assetTypeId || 0,
            assetTypePath: formData?.assetTypeModalValues || "",
            assetTypeName: formData?.assetTypeDD || "",
          },
          assetTypes: {
            assetTypeId: formData?.assetTypeId || 0,
            assetTypePath: formData?.assetTypeModalValues || "",
            assetTypeName: formData?.assetTypeDD || "",
          },
          make: formData?.afvMake || "",
          model: formData?.afvModel || "",
          category: "",
          bodyInfo: "",
          year: formData.afvYear || 0,
          conditionOfGood: "",
          variant: formData?.afvVariant || "",
          regoNumber: "",
          vin: "",
          odometer: 0,
          serialChassisNumber: "",
          costOfAsset: formData?.cashPriceValue || 0,
          ccRating: "",
          engineNumber: "",
          motivePower: "",
          chassisNumber: "",
          assetLocationOfUse: "",
          vehicle: {
            assetClassId: vehicleId || formData?.vehicleId || 0,
          },
          features: formData?.features,
          description: formData?.description,
        },
      };
      financialAsset.push(obj);
      return financialAsset;
      // }
    }

    if (formData?.physicalAsset?.length > 0) {
      // formData.physicalAsset?.forEach((ele, index) => {
      let phyAsset = formData?.physicalAsset[0];
      let obj = {
        id: finId,
        amtFinancedTotal: 0,
        assetDescription: "",
        assetId: finId,
        assetName: formData?.assetTypeDD,
        assetType: {
          assetTypeId: formData?.assetTypeId || 0,
          assetTypePath: formData?.assetTypeModalValues || "",
          assetTypeName: formData?.assetTypeDD || "",
        },
        cashPriceofAnAsset: formData?.cashPriceValue || 0,
        colour: phyAsset?.colour,
        condition: formData?.conditionDD,
        cost: formData?.cashPriceValue || formData?.cashPriceFinanceLease || 0,
        serialNo: "",
        taxesAmt: 0,
        yearOfManufacture: phyAsset?.year,
        //assetLeased: phyAsset?.assetLeased ? "1" : "0",
        cashDepositId: formData?.cashDepositId || undefined,
        cashDeposit: formData?.deposit || undefined,
        udcEstablishmentFee: formData?.udcEstablishmentFee || 0,
        udcEstablishmentFeeId: formData?.udcEstablishmentFeeId || undefined,
        dealerOriginationFee: formData?.dealerOriginationFee || 0,
        dealerOriginationFeeId: formData?.dealerOriginationFeeId || undefined,
        physicalAsset: {
          id: phyId,
          assetId: null,
          // assetId: 0,
          assetName: phyAsset?.assetName,
          assetType: phyAsset?.assetType,
          assetTypes: phyAsset?.assetType,
          make: phyAsset?.make || "",
          model: phyAsset?.model || "",
          category: phyAsset?.category || "",
          bodyInfo: "",
          year: phyAsset?.year,
          conditionOfGood: phyAsset?.conditionOfGood || "",
          variant: phyAsset?.variant || "",
          regoNumber: phyAsset?.regoNumber || "",
          vin: phyAsset?.vin || "",
          odometer: phyAsset?.odometer || 0,
          serialChassisNumber: phyAsset?.serialChassisNumber || "",
          costOfAsset: phyAsset?.costOfAsset || 0,
          ccRating: phyAsset?.ccRating || "",
          engineNumber: phyAsset?.engineNumber || "",
          motivePower: phyAsset?.motivePower || "",
          chassisNumber: phyAsset?.serialChassisNumber || "",
          assetLocationOfUse: phyAsset?.assetLocationOfUse || "",
          vehicle: {
            assetClassId: vehicleId,
            colour: phyAsset?.colour || "",
            odometer: phyAsset?.odometer || 0,
          },
          insuranceDetails:
            formData?.financialAssetInsurance[0]?.insurer == null ? null
              : {
                assetHdrInsuranceId:
                  formData?.physicalAsset[0]?.insuranceDetails?.assetHdrInsuranceId ||formData?.financialAssetInsurance?.[0]
                    ?.assetHdrInsuranceId|| 0,
                insuranceParty: {
                  partyNo:
                    formData?.financialAssetInsurance?.[0]?.partyId || 0,
                },
                broker: formData?.financialAssetInsurance?.[0]?.broker || "",
                sumInsured:
                  formData?.financialAssetInsurance?.[0]?.sumInsured || 0,
                policyNumber:
                  formData?.financialAssetInsurance?.[0]?.policyNumber || "",
                policyExpiryDate:
                  formData?.financialAssetInsurance?.[0]?.policyExpiryDate ||
                  null,
                mobileNumber:
                  formData?.financialAssetInsurance?.[0]?.mobileNumber || "",
                email: formData?.financialAssetInsurance?.[0]?.email || "",
              },
          features: phyAsset?.features || "",
          description: phyAsset?.description || "",
          assetLeased: phyAsset?.assetLeased ? "1" : "0",
        },
      };

      financialAsset.push(obj);
      // });
    } else {
      let obj = {
        id: finId || formData?.finId || 0,
        amtFinancedTotal: 0,
        assetDescription: "",
        assetId: finId || formData?.finId || 0,
        assetName: formData?.assetTypeDD,
        assetType: {
          assetTypeId: formData?.assetTypeId || 0,
          assetTypePath: formData?.assetTypeModalValues || "",
          assetTypeName: formData?.assetTypeDD || "",
        },
        cashPriceofAnAsset: formData?.cashPriceValue || 0,
        colour: "",
        condition: formData?.conditionDD,
        cost: formData?.cashPriceValue || 0,
        serialNo: "",
        taxesAmt: 0,
        yearOfManufacture: 0,
        assetLeased: "0",
        physicalAsset: {},
      };
      financialAsset.push(obj);
    }

    return financialAsset;
  }

  getFirstInstallmentFlow(baseFormData: any) {
    return (
      baseFormData?.flows?.find(
        (f) => f.flowType === "Installment" && f.installmentNo === 2
      ) || null
    );
  }

  getSecondInstallmentFlow(baseFormData: any, index: number) {
    return (
      baseFormData?.flows?.find(
        (f) => f.flowType === "Installment" && f.installmentNo === index + 1
      ) || null
    );
  }

  //   getInstallmentFlowData(baseFormData: any, productCode: string, installmentNo: number) {
  //   // if (productCode !== 'FL') return { paymentScheduleGST: 0, paymentScheduleTotal: 0 };

  //   const flow = baseFormData?.flows?.find(
  //     f => f.flowType === 'Installment' && f.installmentNo === 1
  //   );

  //   return {
  //     paymentScheduleGST: flow?.amtTax ?? 0,
  //     paymentScheduleTotal: flow?.amtGross ?? 0
  //   };
  // }

  mapPreviewConfigData(
    contractData,
    secContractData,
    formData,
    onChange?: any
  ) {
    let productCode = "";
    let taxProfile: any;

    [
      { code: "CSA", id: 5, name: "Credit Sale Agreement" },
      { code: "AFV", id: 27, name: "Assured Future Value" },
      { code: "FL", id: 3, name: "Finance Lease" },
      { code: "TL", id: 10, name: "Term Loan" },
      { code: "OL", id: 4, name: "Operating Lease" },
    ];

    if (contractData?.product?.productCode?.startsWith("FL")) {
      productCode = "FL";
      taxProfile = { code: "FL", id: 3, name: "Finance Lease" };
    }
    if (contractData?.product?.productCode?.startsWith("TL")) {
      productCode = "TL";
      taxProfile = { code: "TL", id: 10, name: "Term Loan" };
    }
    if (contractData?.product?.productCode?.startsWith("AFV")) {
      productCode = "AFV";
      taxProfile = { code: "AFV", id: 27, name: "Assured Future Value" };
    }
    // if (contractData?.product?.productCode?.startsWith("CSA")) {
    //   productCode = "CSA";
    //   taxProfile = { code: "CSA", id: 5, name: "Credit Sale Agreement" };
    // }
    if (contractData?.product?.productCode?.startsWith("OL")) {
      productCode = "OL";
      taxProfile = { code: "OL", id: 4, name: "Operating Lease" };
    }

    if (contractData?.product?.productCode?.startsWith("CSA")) {
      productCode = "CSA";
      taxProfile = {
        code: contractData?.taxProfile?.code,
        id: contractData?.taxProfile?.id,
        name: contractData?.taxProfile?.name,
      };
    }
    this.contractId = contractData?.contractId;

    let servicePlanAndOtherData: any[] = [];
    const servicePlan = contractData?.financialAssetLease?.servicePlan || [];
    const others = contractData?.financialAssetLease?.others || [];
    const sortedOthers = [...others].sort((a, b) => a?.rowNo - b?.rowNo);
    servicePlanAndOtherData.push(...servicePlan, ...sortedOthers);
    const combinedData = servicePlanAndOtherData;

    let DataMapper = {
      // quode Details (Additional Charges and Less Deposit )
      location: contractData?.location,
      locationId: contractData?.location?.locationId,
      operatingUnit: contractData?.operatingUnit,
      paymentStructure: contractData?.paymentStructure,
      termMonthAndDays: contractData?.termMonthAndDays,
      udcEstablishmentFee: Math.abs(
        contractData?.financialAssets[0]?.udcEstablishmentFee || 0
      ),
      udcEstablishmentFeeId:
        contractData?.financialAssets[0]?.udcEstablishmentFeeId,
      dealerOriginationFee: Math.abs(
        contractData?.financialAssets[0]?.dealerOriginationFee || 0
      ),
      apidealerOriginationFee: Math.abs(
        contractData?.financialAssets[0]?.dealerOriginationFee || 0
      ),
      dealerOriginationFeeId:
        contractData?.financialAssets[0]?.dealerOriginationFeeId,
      deposit: contractData?.financialAssets[0]?.cashDeposit || 0,
      depositPct:
        ((contractData?.financialAssets?.[0]?.cashDeposit || 0) /
          (contractData?.financialAssets?.[0]?.cost || 0)) *
        100 || 0,

      //Dealer Finance
      baseInterestRate: contractData?.baseInterestRate,
      marginRate: contractData?.marginRate,
      estimatedCommissionSubsidy: contractData?.estimatedCommissionSubsidy,
      establishmentFeeShare: contractData?.establishmentFeeShare,
      // establishmentFeeShare:  Math.abs(
      //   contractData?.financialAssets[0]?.dealerOriginationFee || 0
      // ),
      // defaultUdcEstablishmentFee : Math.abs(
      //   contractData?.financialAssets[0]?.udcEstablishmentFee || 0
      // ),
      // defaultDealerOriginationFee : Math.abs(
      //   contractData?.financialAssets[0]?.dealerOriginationFee || 0
      // )
      amtFinancedTotal: contractData?.financialAssetLease?.amtFinancedTotal,
      amtTotalInterest: contractData?.financialAssetLease?.amtTotalInterest,
      //payment summary
      balloonAmount: contractData?.financialAssetLease.balloonAmount,
      firstPaymentDate: formData?.firstPaymentDate || null,
      paymentAmount: secContractData?.financialAssetLease.paymentAmount,
      loanDate: new Date(contractData?.financialAssetLease.startDate),
      firstLeaseDate: new Date(contractData?.firstPaymentDate),
      paymentAmountIrregular: this?.getIrregular(
        contractData?.financialAssetLease?.financialAssetPriceSegments,
        contractData?.isFixed,
        contractData?.financialAssetLease.balloonAmount
      ),
      leaseDate: new Date(contractData?.financialAssetLease.startDate),
      firstLeasePayment: contractData?.financialAssetLease.paymentAmount,
      numberofPayments: contractData?.financialAssetLease.numberofPayments,
      numberofFlows:
        contractData?.financialAssetLease?.financialAssetPriceSegments?.reduce(
          (sum, ele) => sum + ele?.installments,
          0
        ),
      frequency: contractData?.frequency,
      // baseInterestRate:contractData?.baseInterestRate,
      residualValueDelayDt:
        contractData?.financialAssetLease.residualValueDelayDt,
      totalEstablishmentFee:
        Math.abs(contractData?.financialAssets[0]?.udcEstablishmentFee || 0) +
        Math.abs(contractData?.financialAssets[0]?.dealerOriginationFee || 0),

      /// Asset Summary

      retailPriceValue:
        secContractData?.financialAssetLease?.amtRecommendedRetailPriceCost,
      additionalFundType: contractData?.additionalfundType,
      // additionalFund: Math.abs(
      //   contractData?.financialAssets?.[0]?.additionalFund
      // ),

      // ppsrCount:contractData?.financialAssets?.length,
      financialAssetInsurance: formData?.financialAssetInsurance,

      /// Adds On Accessories
assuredFutureValue:contractData?.financialAssetLease?.residualValue || 0,
afvaPaymentSummaryAmount:contractData?.financialAssetLease?.residualValue || 0,
      financialAssetPriceSegments:contractData?.financialAssetLease?.financialAssetPriceSegments,
       residualValue: contractData?.financialAssetLease?.residualValue || 0,
      afvModel: contractData?.financialAssets[0]?.physicalAsset?.model,
      afvMake: contractData?.financialAssets[0]?.physicalAsset?.make,
      afvYear: contractData?.financialAssets[0]?.physicalAsset?.year,
      afvVariant: contractData?.financialAssets[0]?.physicalAsset?.variant,
      description: contractData?.financialAssets[0]?.physicalAsset?.description,
      features: contractData?.financialAssets[0]?.physicalAsset?.features,
      afvProvider: "UDC Finance Ltd.",
      interestRate: secContractData?.interestRate,
      apiinterestRate: secContractData?.interestRate,
     pctResidualValue:
        (contractData?.financialAssetLease?.residualValue /
          contractData?.financialAssets?.[0]?.cost) *
        100 || 0,
      ...contractData?.usageandExcessAllowanceRequest?.[0],
      // Extract kmAllowance - check top level first (AFV), then usageandExcessAllowanceRequest (OL)
      kmAllowance: Array.isArray(contractData?.kmAllowance) 
        ? contractData?.kmAllowance?.[0] 
        : (Array.isArray(contractData?.usageandExcessAllowanceRequest?.[0]?.kmAllowance) 
          ? contractData?.usageandExcessAllowanceRequest?.[0]?.kmAllowance?.[0] 
          : contractData?.usageandExcessAllowanceRequest?.[0]?.kmAllowance || contractData?.kmAllowance),
      flows: contractData?.flows,
      totalCost: contractData?.financialAssetLease?.totalCost,
      totalAmountBorrowed:
        sessionStorage.getItem("productCode") === "FL" || (sessionStorage.getItem("productCode") === "OL" && formData?.isTaxinclusive)
          ? (contractData?.financialAssetLease?.totalAmountBorrowed || 0) +
          (contractData?.financialAssets?.[0]?.taxesAmt || 0)
          : !contractData?.contractId && formData?.totalCharge
            ? (contractData?.financialAssetLease?.totalAmountBorrowed || 0)
            // +formData.totalCharge
            : contractData?.financialAssetLease?.totalAmountBorrowed || 0,
      //   totalAmountBorrowed:!contractData?.contractId && formData?.totalCharge
      // ? (contractData?.financialAssetLease?.totalAmountBorrowed || 0) + formData.totalCharge
      // : contractData?.financialAssetLease?.totalAmountBorrowed || 0,
      includeGst: contractData?.financialAssets?.[0]?.taxesAmt || 0,
      interestCharges: contractData?.financialAssetLease?.interestCharge || 0,
      actualMaintenanceFee: contractData?.loanMaintenanceFee || 0,
      loanMaintenceFee: contractData?.lMFTotalAmount || 0,
      apiLoanMaintenceFee:
        contractData?.lMFTotalAmount === 0
          ? formData.apiLoanMaintenceFee
          : contractData?.lMFTotalAmount,
      taxOnAsset: contractData?.financialAssets?.[0]?.taxesAmt,
      // originatorName: contractData?.originatorName
      //Dealer Finance
      dealerSubsidy: contractData?.financialAssets[0]?.dealerSubsidy,
      dealerCommission: contractData?.financialAssets[0]?.dealerCommission,
      ppsrFee: contractData?.ppsrFee,
      ppsrPercentageId: contractData?.ppsrPercentageId,
      // ppsrPercentage: Math.abs(contractData?.ppsrPercentage || 0),
      paymentScheduleGST: contractData?.financialAssets[0]?.taxesAmt,
      paymentScheduleTotal: contractData?.financialAssets[0]?.amtFinancedTotal,
      weiveLMF:contractData?.weiveLMF
    };

    if (onChange == "program" || onChange == "asset") {
      // For AFV on program change, preserve user's selected asset type - don't overwrite from preview
      const isAFVProgramChange = onChange == "program" && productCode === "AFV";
      
      DataMapper = {
        ...DataMapper,
        cashPriceValue: contractData?.financialAssets[0]?.cost,
        apicashPriceValue: contractData?.financialAssets[0]?.cost,
        cashPriceFinanceLease: contractData?.financialAssets[0]?.cost,
       conditionDD:
          contractData?.financialAssets[0]?.condition == 0 ? 782 : 781,
        productCode: productCode,
        taxProfile: taxProfile,
        // Skip asset type binding for AFV on program change to preserve user selection
        ...(isAFVProgramChange ? {} : {
          assetTypeId: contractData?.financialAssets[0]?.assetType?.assetTypeId,
          assetTypeDD: contractData?.financialAssets[0]?.assetType?.assetTypeName,
          assetTypeModalValues: contractData?.financialAssets[0]?.assetType?.assetTypePath,
        }),
        registrations: contractData?.financialAssetLease?.registrations,
        /// Adds On Accessories
        accessories: contractData?.financialAssetLease?.accessories,
        servicePlan:combinedData || contractData?.financialAssetLease?.servicePlan,
        other:contractData?.financialAssetLease?.others ,
        financialAssetPriceSegments: [],
        extended:
          contractData?.financialAssetLease?.extendedWarranty?.months ||
            contractData?.financialAssetLease?.extendedWarranty?.amount
            ? "yes"
            : contractData?.contractId
              ? "no"
              : "",
        extendedMonths:
          contractData?.financialAssetLease?.extendedWarranty?.months,
        extendedAmount: Math.abs(
          contractData?.financialAssetLease?.extendedWarranty?.amount || 0
        ),
        extendedProvider:
          contractData?.financialAssetLease?.extendedWarranty?.provider,
        // extendedId:
        //   contractData?.financialAssetLease?.extendedWarranty?.customFlowID,

        mechanicalBreakdownInsurance:
          contractData?.financialAssetLease?.mechanicalBreakdownInsurance
            ?.months ||
            contractData?.financialAssetLease?.mechanicalBreakdownInsurance
              ?.amount
            ? "yes"
            : contractData?.contractId
              ? "no"
              : "",
        mechanicalBreakdownInsuranceMonths:
          contractData?.financialAssetLease?.mechanicalBreakdownInsurance
            ?.months,
        mechanicalBreakdownInsuranceAmount:
          contractData?.financialAssetLease?.mechanicalBreakdownInsurance
            ?.amount,
        mechanicalBreakdownInsuranceProvider:
          contractData?.financialAssetLease?.mechanicalBreakdownInsurance
            ?.provider,
        // mechanicalBreakdownInsuranceId:
        //   contractData?.financialAssetLease?.mechanicalBreakdownInsurance?.customFlowID,
        guaranteedAssetProtection:
          contractData?.financialAssetLease?.guaranteeAssetProtection?.months ||
            contractData?.financialAssetLease?.guaranteeAssetProtection?.amount
            ? "yes"
            : contractData?.contractId
              ? "no"
              : "",
        guaranteedAssetProtectionMonths:
          contractData?.financialAssetLease?.guaranteeAssetProtection?.months,
        guaranteedAssetProtectionAmount: Math.abs(
          contractData?.financialAssetLease?.guaranteeAssetProtection?.amount ||
          0
        ),
        guaranteedAssetProtectionProvider:
          contractData?.financialAssetLease?.guaranteeAssetProtection?.provider,
        // guaranteedAssetProtectionId:
        //   contractData?.financialAssetLease?.guaranteeAssetProtection?.customFlowID,
        motorVehicalInsurance:
          contractData?.financialAssetLease?.motorVehicleInsurance?.months ||
            contractData?.financialAssetLease?.motorVehicleInsurance?.amount
            ? "yes"
            : contractData?.contractId
              ? "no"
              : "",
        motorVehicalInsuranceMonths:
          contractData?.financialAssetLease?.motorVehicleInsurance?.months,
        motorVehicalInsuranceAmount: Math.abs(
          contractData?.financialAssetLease?.motorVehicleInsurance?.amount || 0
        ),
        motorVehicalInsuranceProvider:
          contractData?.financialAssetLease?.motorVehicleInsurance?.provider,
        // motorVehicalInsuranceId:
        //   contractData?.financialAssetLease?.motorVehicleInsurance?.customFlowID,
        contract:
          contractData?.financialAssetLease?.consumerCreditInsurance?.months ||
            contractData?.financialAssetLease?.consumerCreditInsurance?.amount
            ? "yes"
            : contractData?.contractId
              ? "no"
              : "",
        consumerCreditInsurance:
          contractData?.financialAssetLease?.consumerCreditInsurance?.months ||
            contractData?.financialAssetLease?.consumerCreditInsurance?.amount
            ? "yes"
            : contractData?.contractId
              ? "no"
              : "",
        contractMonths:
          contractData?.financialAssetLease?.consumerCreditInsurance?.months,
        contractAmount: Math.abs(
          contractData?.financialAssetLease?.consumerCreditInsurance?.amount
        ),
        contractProvider:
          contractData?.financialAssetLease?.consumerCreditInsurance?.provider,
        totalCharge: this.sumAccessories(contractData),
        taxOnAsset: contractData?.financialAssets?.[0]?.taxesAmt,
        tradeAmountId: contractData?.tradeAmountId,
      };
    }

    if (onChange == "program") {
      DataMapper = {
        ...DataMapper,
        term: contractData?.financialAssetLease?.term,
      };
    }
    return DataMapper;
  }
  async getUsefulLife(effectiveDate: any, assetTypeId: number, depreciationRateCurve: any): Promise<void> {

    const formattedDate = this.datePipe.transform(effectiveDate, 'yyyy-MM-dd');

    const payload = {
      depreciationRateCurve: depreciationRateCurve,
      effectiveDate: formattedDate,
      assetTypeId: assetTypeId
    };

    const response = await this.data
      .post(`Contract/get_useful_life`, payload)
      .pipe(map((res: any) => res?.data))
      .toPromise();
    console.log('Useful Life Response:', response);
    if (response) {
      const usefulLife = response?.usefulLife
      this.setBaseDealerFormData({ usefulLife:  Number(usefulLife) || null });
    }

  }


  sumAccessories(formData) {
    let registrations = formData?.financialAssetLease?.registrations || [];
    let servicePlan = formData?.financialAssetLease?.servicePlan || [];
    let others =
      formData?.financialAssetLease?.others ||
      formData?.financialAssetLease?.other ||
      [];
    let accessories = formData?.financialAssetLease?.accessories || [];

    let extendedWarranty =
      formData?.financialAssetLease?.extendedWarranty || {};
    let motorVehicleInsurance =
      formData?.financialAssetLease?.motorVehicleInsurance || {};
    let guaranteeAssetProtection =
      formData?.financialAssetLease?.guaranteeAssetProtection || {};
    let consumerCreditInsurance =
      formData?.financialAssetLease?.consumerCreditInsurance || {};
    let mechanicalBreakdownInsurance =
      formData?.financialAssetLease?.mechanicalBreakdownInsurance || {};

    let total = 0;
    registrations?.forEach((ele) => {
      total = total + Math.abs(ele?.amount || 0);
    });
    servicePlan?.forEach((ele) => {
      total = total + Math.abs(ele?.amount || 0);
    });
    others?.forEach((ele) => {
      total = total + Math.abs(ele?.amount || 0);
    });
    accessories?.forEach((ele) => {
      total = total + Math.abs(ele?.amount || 0);
    });

    total =
      total +
      Math.abs(extendedWarranty?.amount || 0) +
      Math.abs(motorVehicleInsurance?.amount || 0) +
      Math.abs(guaranteeAssetProtection?.amount || 0) +
      Math.abs(consumerCreditInsurance?.amount || 0) +
      Math.abs(mechanicalBreakdownInsurance?.amount || 0);

    return total;
  }

  async assetSummaryData(formData, exeType?: any) {
    if (exeType == "preview") {
      this.tradeSvc.assetList = [];
      this.tradeSvc.insuranceList = [];
      this.tradeSvc.tradeList = [];
      if (formData?.financialAssets && formData?.financialAssets?.length > 0) {
        let assets = cloneDeep(formData?.financialAssets);
        assets.forEach((ele, index) => {
          if (ele?.physicalAsset?.assetTypes?.assetTypeId) {
            let obj = {
              ...ele.physicalAsset,
              assetPath: ele?.physicalAsset?.assetTypes?.assetTypePath,
              assetTypeId: ele?.physicalAsset?.assetTypes?.assetTypeId,

              // assetName: ele?.physicalAsset?.assetTypes?.assetTypeName,
              assetName: `${ele?.physicalAsset?.year || "-"} ${ele?.physicalAsset?.make || "-"
                } ${ele?.physicalAsset?.model || "-"} ${ele?.physicalAsset?.variant || "-"
                }`.trim(),
              assetType: ele?.physicalAsset?.assetTypes,
              year: ele?.physicalAsset?.year,
              assetLeased:
                ele?.physicalAsset?.assetLeased == "true" ? true : false,
              supplierName: "", //formData.supplierName,
              //supplierName: formData.supplierName,
              assetLocationOfUse: ele?.physicalAsset?.assetLocationOfUse,
              countryFirstRegistered: formData?.countryFirstRegistered,
              colour: ele.colour,
              insurer: formData?.financialAssetInsurance?.[index]?.insurer,
              actions: this.tradeSvc.actions,
              costOfAsset:
                formData?.financialAssets?.length == 1 &&
                  formData?.financialAssets[0]?.physicalAsset
                    ?.childPhysicalAssetItems?.length == 0
                  ? ele?.cost
                  : ele?.physicalAsset?.costOfAsset,
            };
            this.tradeSvc.assetList.push(obj);
          }
        });

        // if (formData?.financialAssetInsurance) {
        //   this.tradeSvc.insuranceList = formData?.financialAssetInsurance;
        //   this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
        // }
        if (
          formData?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems
            ?.length
        ) {
          let insuranceList = [];
          formData?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems?.forEach(
            (child) => {
              if (child.insurancesDetails?.length) {
                insuranceList.push(
                  ...child.insurancesDetails.map((item) => ({
                    broker: item.brokerName || "",
                    //currency: item.currency || { id: 105, name: 'New Zealand Dollar' },
                    assetHdrInsuranceId: item?.assetHdrInsuranceId,
                    insurer: item?.insuranceParty.extName,
                    partyNo: item?.insuranceParty.partyNo || 0,
                    partyId: item?.insuranceParty.partyNo || 0,
                    policyExpiryDate: item?.policyExpiryDate || null,
                    policyNumber: item?.policyNumber || "",
                    sumInsured: item?.sumInsured || 0,
                  }))
                );
              }
              this.tradeSvc.insuranceList = insuranceList;
              this.tradeSvc.insuranceListSubject.next(
                this.tradeSvc.insuranceList
              );
            }
          );
        }

        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
      }
      this.setBaseDealerFormData({
        physicalAsset: this.tradeSvc.assetList,
      });

      if (formData?.tradeInAssetRequest) {
        this.tradeSvc.tradeList = cloneDeep(
          formData?.tradeInAssetRequest.map((obj) => ({
            ...obj,
            tradeName: `${obj?.tradeYear || "-"} ${obj?.tradeMake || "-"} ${obj?.tradeModel || "-"
              } ${obj?.tradeVariant || "-"}`.trim(),

            actions: this.tradeSvc.actions,
          }))
        );
      }
      this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);
    } else {
      if (formData?.financialAssets && formData?.financialAssets?.length > 0) {
        if (
          formData?.financialAssets?.[0]?.physicalAsset?.childPhysicalAssetItems
            ?.length > 0
        ) {
          let phyData = formData?.financialAssets?.[0]?.physicalAsset;
          let finData = formData?.financialAssets?.[0];
          this.tradeSvc.assetList = cloneDeep(
            formData?.financialAssets?.[0]?.physicalAsset?.childPhysicalAssetItems.map(
              (obj) => ({
                ...phyData,
                ...obj,
                make: obj?.make,
                assetId: obj?.assetHdrId,
                vehicleClassId: obj?.vehicle?.assetClassId,
                assetPath: obj?.assetType?.assetTypePath,
                assetTypeId: obj?.assetType?.assetTypeId,
                // assetName: obj?.assetType?.assetTypeName,
                assetName: `${obj?.vehicle?.subModelYear || "-"} ${obj?.make || "-"
                  } ${obj?.model || "-"} ${obj?.variant || "-"}`.trim(),
                assetType: obj?.assetType,
                year: obj?.vehicle?.subModelYear,
                assetLeased: phyData?.assetLeased == "true" ? true : false,
                supplierName: formData?.supplierName,
                assetLocationOfUse: obj?.assetLocationOfUse,
                countryFirstRegistered: formData?.countryFirstRegistered,
                colour: obj?.vehicle?.colour,
                costOfAsset: obj?.amount,
                vin: obj?.vinNo || "",
                insurer:
                obj?.insurancesDetails == null ? "-" :
                  obj?.insurancesDetails?.[0]?.insuranceParty?.extName,
                actions: this.tradeSvc.actions,
              })
            )
          );
        } else {
          this.tradeSvc.assetList = cloneDeep(
            formData?.financialAssets.map((obj) => ({
              ...obj.physicalAsset,
              assetId: obj?.physicalAsset?.id,
              assetPath: obj?.physicalAsset?.assetTypes?.assetTypePath,
              assetTypeId: obj?.physicalAsset?.assetTypes?.assetTypeId,
              //assetName: obj?.physicalAsset?.assetTypes?.assetTypeName,
              assetName: `${obj?.physicalAsset?.year || "-"} ${obj?.physicalAsset?.make || "-"
                } ${obj?.physicalAsset?.model || "-"} ${obj?.physicalAsset?.variant || "-"
                }`.trim(),
              assetType: obj?.physicalAsset?.assetTypes,
              year: obj?.yearOfManufacture,
              assetLeased:
                obj?.physicalAsset?.assetLeased == "true" ? true : false,
              supplierName: formData.supplierName,
              assetLocationOfUse: obj?.physicalAsset?.assetLocationOfUse,
              countryFirstRegistered: formData?.countryFirstRegistered,
              colour: obj.colour,
              insurer: formData?.financialAssetInsurance?.[0]?.insurer,
              actions: this.tradeSvc.actions,
            }))
          );
        }

        if (formData?.financialAssetInsurance) {
          let insuranceList = [];

          if (
            formData?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems
              ?.length
          ) {
            formData?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems.forEach(
              (child) => {
                if (child.insurancesDetails?.length) {
                  insuranceList.push(
                    ...child.insurancesDetails.map((item) => ({
                      broker: item.brokerName || "",
                      //currency: item.currency || { id: 105, name: 'New Zealand Dollar' },
                      assetHdrInsuranceId: item?.assetHdrInsuranceId,
                      insurer: item?.insuranceParty.extName,
                      partyNo: item?.insuranceParty.partyNo || 0,
                      partyId: item?.insuranceParty.partyNo || 0,
                      policyExpiryDate: item?.expiryDt || null,
                      policyNumber: item?.policyNumber || "",
                      sumInsured: item?.sumInsured || 0,
                    }))
                  );
                }
                this.tradeSvc.insuranceList = insuranceList;
                this.tradeSvc.insuranceListSubject.next(
                  this.tradeSvc.insuranceList
                );
              }
            );
          } else {
            if (
              formData?.financialAssets[0]?.physicalAsset
                ?.childPhysicalAssetItems?.length == 0 &&
              formData?.financialAssetInsurance?.length > 0
            ) {
              let insuranceList = [];
              const physicalAsset =
                formData?.financialAssets?.[0]?.physicalAsset;
              if (physicalAsset) {
                const insurance = physicalAsset?.insuranceDetails;

                if (insurance) {
                  insuranceList.push({
                    broker: insurance?.broker || "",
                    assetHdrInsuranceId: insurance?.assetHdrInsuranceId || null,
                    insurer: insurance?.insuranceParty?.extName || "",
                    partyNo: insurance?.insuranceParty?.partyNo || 0,
                    partyId: insurance?.insuranceParty?.partyId || 0,
                    policyExpiryDate: insurance?.policyExpiryDate || null,
                    policyNumber: insurance?.policyNumber || "",
                    sumInsured: insurance?.sumInsured || 0,
                  });
                }
              }

              this.tradeSvc.insuranceList = insuranceList;
              this.tradeSvc.insuranceListSubject.next(
                this.tradeSvc.insuranceList
              );
            }
          }

          await this.brokerDetails(
            formData,
            formData?.financialAssetInsurance?.[0]?.assetHdrId,
            formData?.financialAssetInsurance?.[0]?.insurerhdrId
          );
        }
        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
      }
      // this.standardQuoteSvc.setBaseDealerFormData({
      //   physicalAsset: this.tradeSvc.assetList,
      // });

      if (formData?.tradeInAssetRequest) {
        this.tradeSvc.tradeList = cloneDeep(
          formData?.tradeInAssetRequest.map((obj) => ({
            ...obj,
            tradeName: `${obj?.tradeYear || "-"} ${obj?.tradeMake || "-"} ${obj?.tradeModel || "-"
              } ${obj?.tradeVariant || "-"}`.trim(),
            actions: this.tradeSvc.actions,
          }))
        );
      }
      this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);
      this.tradeSvc.existingTradeListSubject = this.tradeSvc.tradeList;
    }
  }

  async brokerDetails(formData, assetId, insurerId) {
    if (formData?.contractId && assetId && insurerId) {
      let broker = await this.data
        .get(
          `Contract/get_brokerdetails?ContractId=${formData?.contractId}&AssetHdrId=${assetId}&AssetHdrInsuranceId=${insurerId}`
        )
        .pipe(
          map((res) => {
            return res?.data;
          })
        )
        .toPromise();

      if (broker?.brokerName) {
        formData.financialAssetInsurance[0] = {
          ...formData?.financialAssetInsurance[0],
          broker: broker.brokerName,
        };
        this.tradeSvc.insuranceList = formData.financialAssetInsurance;
        this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
      }
    }
  }

  calculateSegmentDate(startDate, frequency, installmentNum) {
    let fdate = new Date(startDate);
    if (frequency?.toLowerCase() == "monthly") {
      fdate.setMonth(fdate.getMonth() + installmentNum);
    } else if (frequency?.toLowerCase() == "weekly") {
      fdate.setDate(fdate.getDate() + installmentNum * 7);
    } else if (frequency?.toLowerCase() == "fortnightly") {
      fdate.setDate(fdate.getDate() + installmentNum * 14);
    } else if (frequency?.toLowerCase() == "semi monthly") {
      if (installmentNum % 2 == 0) {
        fdate.setMonth(fdate.getMonth() + installmentNum / 2);
      } else {
        let thirtyOneMonths = ["0", "2", "4", "6", "7", "9", "11"];
        fdate.setMonth(fdate.getMonth() + (installmentNum - 1) / 2);
        if (thirtyOneMonths.includes(String(fdate.getMonth()))) {
          fdate.setDate(fdate.getDate() + installmentNum * 16);
        } else {
          fdate.setDate(fdate.getDate() + installmentNum * 15);
        }
      }
    } else if (frequency?.toLowerCase() == "four weekly") {
      fdate.setDate(fdate.getDate() + installmentNum * 28);
    }

    return fdate;
  }

  // ----------------------------------------------------------------------------------------------------

  async contractModification(formData: any, isDraft: any, activeStep?: any, isDataModified?:any) {
    if (formData?.physicalAsset?.length == 1 && formData?.physicalAsset[0]?.costOfAsset == 0 && isDataModified == true) {
      return this.toasterService.showToaster({
        severity: "error",
        detail: `Please fill required details for physical asset!`,
      });
    }

    this.onDealerChange.next(false);

    let originalPurchasePrice = 0;
    if (
      formData?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems
        ?.length == 0 &&
      formData?.physicalAsset?.length > 1 &&
      activeStep == 1
    ) {
      originalPurchasePrice = await this.splitAsset(
        formData?.physicalAsset,
        formData?.financialAssets?.[0]?.physicalAsset,
        formData,
        formData?.contractId
      );
      formData.cashPriceValue = originalPurchasePrice;
    }

    if (
      formData?.financialAssets?.[0]?.physicalAsset?.childPhysicalAssetItems
        ?.length > 0 &&
      activeStep == 1
    ) {
      originalPurchasePrice = await this.updateDeleteSplitAsset(
        formData?.physicalAsset,
        formData?.financialAssets?.[0]?.physicalAsset,
        formData
      );
      formData.cashPriceValue = originalPurchasePrice;
    }

    if (
      formData?.contractPartyRoles?.[0]?.contractPartyId &&
      formData?.salePersonDetails?.[0]
    ) {
      formData.salePersonDetails[0]["contractPartyId"] =
        formData?.contractPartyRoles?.[0]?.contractPartyId;
    } else if (
      formData?.contractPartyRoles?.[0]?.contractPartyId &&
      !formData?.salePersonDetails?.[0]
    ) {
      formData.salePersonDetails = [
        { contractPartyId: formData?.contractPartyRoles?.[0]?.contractPartyId },
      ];
    }
    const allServicePlans = formData?.servicePlan || [];
    const servicePlan = allServicePlans
      .filter((sp) => sp.name == "Service Plan")
      .map(sp => ({
        ...sp,
        amount: sp.amount ?? 0
      }));
    const otherItemsObject = allServicePlans.filter(sp => sp.name === "Other Service Plan");
    const firstOtherId = otherItemsObject[0]?.id;
    const other = otherItemsObject.map(item => ({
      ...item,
      id: firstOtherId,
      amount: item.amount ?? 0
    }));
    const newRegistration = formData?.registrations?.map((reg: any) => ({
      ...reg,
      name: "Registration",
      amount: reg.amount ?? 0
    }));
    let request = {
      contractpartyRoles: formData?.salePersonDetails,
      contractEtag: this.stoteSvc.getItem("contractEtag"),
      PRCode: sessionStorage.getItem("productCode"),
      additionalfundType: formData?.additionalFundType || null,
      amoutFinanced: 0,
      asset: null,
      assetInsuranceAmount: 0,
      assetInsuranceMonths: 0,
      assetInsuranceName: null,
      assetInsuranceProvider: null,
      assetLocationOfUse:
        formData?.physicalAsset?.[0]?.assetLocationOfUse || "",
      baseInterestRate: formData?.baseInterestRate,
      marginRate: formData?.marginRate,
      buyRate: 0,
      calculateSettlement: 0,
      conditionOfGood: "",
      contractId: formData?.contractId,
      countryFirstRegistered:
        formData?.physicalAsset?.[0]?.countryFirstRegistered,
      dealerOriginationFee: formData?.dealerOriginationFee || 0,
      deposit: Number(formData?.deposit || 0).toFixed(2),
      downPayment: 0,
      brandName:
        formData?.defaultAsset?.[0]?.IsDefault == false
          ? formData?.defaultAsset?.[0]?.BrandName
          : undefined,
      downPaymentPercent: 0,
      estimatedCommissionSubsidy: formData?.estimateCommissions || 0,
      extendedWarrantyMonth: 0,
      financialAssetInsurance: [],
      loanDate: String(
        this.createDateFormat(formData?.loanDate) ||
        this.createDateFormat(new Date())
      ),
      financialAssets: this.getFinancialAsset(
        formData,
        formData?.financialAssets?.[0]?.id,
        formData?.financialAssets?.[0]?.physicalAsset.id,
        formData?.financialAssets?.[0]?.physicalAsset?.vehicle?.assetClassId
      ),
      financialAssetLease: {
        accessories: (formData?.accessories || []).map(acc => ({ ...acc, amount: acc?.amount || 0 })),
        amtBaseRepayment: 0,
        amtFinancedTotal: 0,
        amtTotalInterest: 0,
        balloonAmount: formData?.balloonAmount || 0,
        balloonDate: new Date().toISOString(),

        balloonPct: formData?.balloonPct || 0,
        charges: 0,
        consumerCreditInsurance:
          formData.contract == ""
            ? null
            : formData?.contractAmount && formData.contract == "yes"
              ? {
                amount: formData?.contractAmount || 0,
                months: String(formData?.contractMonths || 0),
                provider: formData?.contractProvider || "",
                customFlowID: formData?.consumerCreditInsuranceId,
              }
              : {
                customFlowID: formData?.consumerCreditInsuranceId,
                amount: formData?.contractAmount || 0,
                changeAction:
                  formData?.productCode === "OL" &&
                    (!formData?.consumerCreditInsuranceId ||
                      formData?.consumerCreditInsuranceId === 0)
                    ? ""
                    : formData?.contractInsuranceChangeAction,
              },
        dealerOriginationFee: formData?.dealerOriginationFee || 0,
        establishmentFeeShare: 0,
        estimatedCommissionSubsidy: 0,
        extendedWarranty:
          formData.extended == ""
            ? null
            : formData?.extendedAmount && formData.extended == "yes"
              ? {
                amount: formData?.extendedAmount || 0,
                months: String(formData?.extendedMonths || 0),
                provider: formData?.extendedProvider || "",
                customFlowID: formData?.extendedId,
              }
              : {
                customFlowID: formData?.extendedId,
                amount: formData?.extendedAmount || 0,
                changeAction: formData?.extendedWarrantyChangeAction,
              },
        fixed: formData?.fixed || false,
        guaranteeAssetProtection:
          formData.guaranteedAssetProtection == ""
            ? null
            : formData?.guaranteedAssetProtectionAmount &&
              formData.guaranteedAssetProtection == "yes"
              ? {
                amount: formData?.guaranteedAssetProtectionAmount || 0,
                months: String(formData?.guaranteedAssetProtectionMonths || 0),
                provider: formData?.guaranteedAssetProtectionProvider || "",
                customFlowID: formData?.guaranteedAssetProtectionId,
              }
              : {
                customFlowID: formData?.guaranteedAssetProtectionId,
                amount: formData?.guaranteedAssetProtectionAmount || 0,
                changeAction: formData?.guaranteedAssetChangeAction,
              },
        // interestCharge: 10000,
        firstLeasePayment: 0, // For FL, OL
        firstLeasePaymentAmount: 0, // For OL
        lastLeasePayment: 0, // For FL
        totalNoofpaymnets: 0, // For FL
        isFixed: formData?.fixed || false,
        // loanMaintenanceFee: 10000,
        numberofPayments: 0,
        matureDate: new Date().toISOString(),
        mechanicalBreakdownInsurance:
          formData.mechanicalBreakdownInsurance == ""
            ? null
            : formData?.mechanicalBreakdownInsuranceAmount &&
              formData.mechanicalBreakdownInsurance == "yes"
              ? {
                months: String(
                  formData?.mechanicalBreakdownInsuranceMonths || 0
                ),
                amount: formData?.mechanicalBreakdownInsuranceAmount || 0,
                provider: formData?.mechanicalBreakdownInsuranceProvider || "",
                customFlowID: formData?.mechanicalBreakdownInsuranceId,
              }
              : {
                customFlowID: formData?.mechanicalBreakdownInsuranceId,
                amount: formData?.mechanicalBreakdownInsuranceAmount || 0,
                changeAction: formData?.mechanicalBreakdownChangeAction,
              },
        motorVehicleInsurance:
          formData.motorVehicalInsurance == ""
            ? null
            : formData?.motorVehicalInsuranceAmount &&
              formData.motorVehicalInsurance == "yes"
              ? {
                months: String(formData?.motorVehicalInsuranceMonths || 0),
                amount: formData?.motorVehicalInsuranceAmount || 0,
                provider: formData?.motorVehicalInsuranceProvider || "",
                customFlowID: formData?.motorVehicalInsuranceId,
              }
              : {
                customFlowID: formData?.motorVehicalInsuranceId,
                amount: formData?.motorVehicalInsuranceAmount || 0,
                changeAction: formData?.motorVehicalInsuranceChangeAction,
              },
        netTradeAmount: 0,
        // paymentAmount: formData?.paymentAmount || 0,
        // paymentSchedule: 0,
        registrations: newRegistration || [],
        residualValue: formData?.residualValue || 0,
        pctResidualValue: formData?.pctResidualValue || 0,
        //servicePlan: formData?.servicePlan || [],
        servicePlan: servicePlan || [],
        others: other || [],
        SettlementUDCHdrId: formData?.SettlementUDCHdrId || 0,
        settlementAmount: formData?.settlementAmount || 0,
        startDate: null,
        // subTotalAddOns:
        //   (formData?.subTotalServicePlanValue || 0) +
        //   (formData?.subTotalInsuranceRequirementValue || 0) +
        //   (formData?.subTotalAccesoriesValue || 0),
        term: formData?.term || formData?.terms,
        totalAmountBorrowed: 0,
        totalAmountBorrowedIncGST: 0,
        totalAmtFinancedTax: 0,
        totalCost: 0,
        totalEstablishmentFee: formData?.totalEstablishmentFee || 0,
        totalInterest: 0,
        tradeAmount: formData?.tradeAmountPrice || 0,
        udcEstablishmentFee: formData?.udcEstablishmentFee || 0,
        financialAssetPriceSegments: this.mapPriceSegments(
          "update",
          formData?.financialAssetPriceSegments,
          //formData?.financialAssetLease?.financialAssetPriceSegments,
          formData?.financialAssetPriceSegmentsUpdatedId?.financialAssetPriceSegments,
          formData
        ),
        ...(this.productCode === "TL" && {
          additionalFund:
            formData?.financialAssetLease?.additionalFund ||
            formData?.additionalFund,
        }),
        privateSale: Boolean(formData?.privateSales && formData?.privateSales !== '0') || false,
      },
      frequency: formData?.frequency || "",
      inclOfGST: 0,
      insurer: "",
      interestRate: formData?.interestRate || 0,
      intServCount: null,
      isDraft: isDraft,
      isTaxInclusive:
        formData?.productCode == "OL" ? formData?.isTaxinclusive : false,
      lastPayment: "",
      loanAccountDetails: null,
      loanAmount: 0,
      actualMaintenanceFee: formData?.loanMaintenanceFee || 0,
      loanMaintenanceFee: formData?.loanMaintenceFee || 0,
      location: {
        extName: "New Zealand",
        locationId: 176,
        locationType: "Country",
      },
      markUp: null,
      mechanicalBreakdownMonth: 0,
      motivePower: "",
      netTradeAmount: 0,
      // originatorName: formData.originatorName || '',
      originatorNumber: formData.originatorNumber,
      originatorReference: formData.originatorReference || "",

      paymentStructure: formData?.paymentStructure,
      ppsrCount: formData?.ppsrCount || 0,
      operatingUnit: {
        partyNo: formData?.operatingUnit?.partyNo || 10012,
        extName: formData?.operatingUnit?.extName || "MV Dealer",
      },
      ppsrPercentage: formData?.ppsrPercentage || 0,
      ppsrPercentageId: formData?.ppsrPercentageId || 0,

      product: {
        productId: formData?.product?.productId,
        productCode: formData?.product?.productCode,
        extName: formData?.product?.extName,
      },
      program: {
        programId: formData?.program?.programId,
        programCode: formData?.program?.programCode,
        lookupName: formData?.program?.lookupName,
        extName: formData?.program?.extName,
      },
      promotionQuote: String(formData?.promotionQuote ?? ""),
      purposeofLoan: formData?.purposeofLoan || "",
      quoteType: "",
      regoVIN: "VIN No",
      //salesPerson: formData?.salesPerson || '',
      servicePlanMonths: 0,
      SettlementUDCHdrId: formData?.SettlementUDCHdrId || 0,
      settlementAmount: formData?.settlementAmount || 0,
      supplierName: "",
      taxProfile: formData?.taxProfile,
      totalAmountBorrowed: 0,
      totalAmountRepay: "",
      totalTermDays: 0,
      totalTermMonths: 0,
      tradeAmount: 0,
      tradeInAssetRequest: formData?.tradeInAssetRequest || [],
      usageandExcessAllowanceRequest:
        sessionStorage.getItem("productCode") == "OL"
          ? [
            {
              // OL
              usageUnit: formData?.usageUnit || "",
              excessUsageAllowance: formData?.excessUsageAllowance
                ? String(formData?.excessUsageAllowance)
                : null,
              excessUsageAllowancePercentage:
                formData?.excessUsageAllowancePercentage
                  ? String(formData?.excessUsageAllowancePercentage)
                  : null,
              excessUsageCharge: formData?.excessUsageCharge
                ? String(formData?.excessUsageCharge)
                : null,
              rebateAmount: formData?.rebateAmount
                ? String(formData?.rebateAmount)
                : null,
              totalRebateAllowance: formData?.totalRebateAllowance
                ? String(formData?.totalRebateAllowance)
                : null,
              totalRebateAllowancePercent:
                formData?.totalRebateAllowancePercent
                  ? String(formData?.totalRebateAllowancePercent)
                  : null,
              totalUsageAllowance: formData?.totalUsageAllowance
                ? String(formData?.totalUsageAllowance)
                : null,
              usageAllowance: formData?.usageAllowance
                ? String(formData?.usageAllowance)
                : null,
            },
          ]
          : [],
      apiDisbursementDetails: formData.apiDisbursementDetails || [],
      udcEstablishmentFee: formData?.udcEstablishmentFee || 0,
      value: null,
      variant: null,
      weiveLMF: formData?.weiveLMF,
      isStructured: formData?.productCode == "AFV" ? false : true,
      isDealerChange: formData?.isDealerChange ?? false,
      preferredDeliveryMethod: formData?.preferredDeliveryMethod || "",

      noOfRentalsInAdvance: Number(formData?.noOfRentalsInAdvance || 0),
      totalMaintenanceHdrId: formData?.totalMaintenanceHdrId || 0,
      totalMaintenanceAmount: formData?.maintainanceCost,
      financedMaintenanceHdrId: formData?.financedMaintenanceHdrId || 0,
      financedMaintenanceAmount: formData?.financedMaintainanceCharge,
      tracksorTyres: formData?.tracksorTyres
        ? String(formData?.tracksorTyres)
        : "",
      serviceAgent: formData?.serviceAgent,
      maintenanceRequirement: formData?.maintenanceRequirement,

    internalSalespersonParty: (sessionStorage.getItem("externalUserType") == "Internal")?{
		  contractPartyId: 0,
      customerId: formData?.internalSalesperson, 
      customerNo: 0,
      customerRole: "Salesperson"
	    }:null,
    };

    let resp: any = await this.data
      .put(
        `Contract/update_contract?ContractId=${formData?.contractId}`,
        request
      )
      .pipe(
        map(async (res) => {
          return res?.data;
        })
      )
      .toPromise();
    resp = await resp;
    this.isProgramChanged = false;

    if (resp?.contractId) {
      this.isAssetTrade = false;
      let dataMapped = this?.mapConfigData(resp);

      this.setBaseDealerFormData({
        ...dataMapped,
        isDraft: resp?.isDraft,
      });


      this.assetSummaryData(resp, "update");
      this?.forceCalculateBeforeSchedule.next(false);
      if (formData?.isDealerChange) {
        sessionStorage.setItem("dealerPartyNumber", resp?.originatorNumber);
        sessionStorage.setItem("dealerPartyName", resp?.originatorName);
        formData.isDealerChange = false;
      }

      return resp;
    } else {
      return null;
    }
  }

  mapPriceSegments(
    called,
    mappedPriceSegments,
    oldPriceSegments?: any,
    formData?: any
  ) {
    let newPriceSegments = [];
    if (oldPriceSegments) {
      oldPriceSegments?.forEach((ele) => {
        let deleteObj = {
          priceSegmentId: ele.priceSegmentId,
          changeAction: "Delete",
        };
        newPriceSegments.push(deleteObj);
      });
    }
    if (formData.productCode == "FL") {
      let numOfPayments = Math.round(
        Number(formData?.term) *
        this.termFrequencyMultiplier[formData?.frequency]
      );

      const leasePayment = formData?.initialLeasePayment
        ? // && formData?.initialLeasePayment >= 0
        formData.initialLeasePayment //user entry
        : formData.firstLeasePayment;

      // InCase user enterrs a Initial Lease Amount
      // if (formData?.firstLeasePayment)
      if (formData?.initialLeasePayment && formData?.initialLeasePayment > 0) {
        newPriceSegments.push({
          paymentScheduleDate: null,
          paymentScheduleFrequency: formData?.frequency,
          // paymentAmount: formData.firstLeasePayment,
          paymentAmount: formData?.initialLeasePayment,
          isCustomised: true,
          installments: 1,
          segmentType: "Payment Total",
        });

        newPriceSegments.push({
          paymentScheduleDate: null,
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount:
            formData?.calculateFor != "Payment" ? formData?.payment || 0 : 0,
          installments: numOfPayments - 1,
          segmentType: "Installment",
        });

        return newPriceSegments;
      }
    }
    if (formData.productCode == "FL") {
      let numOfPayments = Math.round(
        Number(formData?.term) *
        this.termFrequencyMultiplier[formData?.frequency]
      );
      let priceSegmentObj = {
        priceScheduleId: undefined,
        priceSegmentId: undefined,
        paymentScheduleDate: formData?.firstPaymentDate || null,
        installmentFrequency: formData?.frequency,
        paymentScheduleFrequency: formData?.frequency,
        paymentAmount: 0,
        installments: numOfPayments,
        segmentType: "Installment",
        isCustomised: false,
      };
      newPriceSegments.push(priceSegmentObj);
      return newPriceSegments;
    }
    if (called == "preview" && formData.productCode == "OL") {
      if (formData?.noOfRentalsInAdvance > 0) {
        newPriceSegments.push({
          // paymentScheduleDate: null,
          paymentScheduleFrequency: formData?.frequency,
          // pa}ymentAmount: formData.firstLeasePayment,
          // paymentAmount: formData?.initialLeasePayment ,
          isCustomised: false,
          proportion: formData?.noOfRentalsInAdvance + 1,
          installments: 1,
          installmentFrequency: formData?.frequency,
          segmentType: "Installment",
        });

        newPriceSegments.push({
          // paymentScheduleDate: null,
          paymentScheduleFrequency: formData?.frequency,
          // paymentAmount:
          //   formData?.calculateFor != "Payment" ? formData?.payment || 0 : 0,
          isCustomised: false,
          proportion: 1,
          installments: formData?.term - formData?.noOfRentalsInAdvance - 1,
          installmentFrequency: formData?.frequency,
          segmentType: "Installment",
        });

        newPriceSegments.push({
          // paymentScheduleDate: null,
          paymentScheduleFrequency: formData?.frequency,
          // paymentAmount:
          //   formData?.calculateFor != "Payment" ? formData?.payment || 0 : 0,
          isCustomised: true,
          proportion: 1,
          installments: formData?.noOfRentalsInAdvance,
          installmentFrequency: formData?.frequency,
          segmentType: "Payment Total",
        });

        return newPriceSegments;
      }
    }
    if (formData?.productCode == "OL" && called == "preview") {
      let numOfPayments = Math.round(
        Number(formData?.term) *
        this.termFrequencyMultiplier[formData?.frequency]
      );
      if (formData?.editSchedule) {
        let updatedSegments = (formData?.financialAssetPriceSegments || []).map(
          (ele: any) => ({
            ...ele,
            isCustomised:
              ele?.segmentType === "Payment Total" ? true : ele?.isCustomised,
          })
        );
        newPriceSegments = [...newPriceSegments, ...updatedSegments];
        return newPriceSegments;
      }
      let priceSegmentObj = {
        priceScheduleId: undefined,
        priceSegmentId: undefined,
        paymentScheduleDate: formData?.firstPaymentDate || null,
        installmentFrequency: formData?.frequency,
        paymentScheduleFrequency: formData?.frequency,
        paymentAmount: 0,
        installments: numOfPayments,
        segmentType: "Installment",
        isCustomised: false,
      };
      newPriceSegments.push(priceSegmentObj);
      return newPriceSegments;
    }

    if (formData?.productCode == "OL" && called == "update") {
      if (formData?.noOfRentalsInAdvance > 0) {
        mappedPriceSegments?.forEach((ele) => {
          if (ele.changeAction != "Delete") {
            let priceSegmentObj = {
              priceScheduleId: undefined,
              priceSegmentId: undefined,
              paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
              installmentFrequency:
                ele?.installmentFrequency || ele?.paymentScheduleFrequency,
              paymentScheduleFrequency:
                ele?.installmentFrequency || ele?.paymentScheduleFrequency,
              paymentAmount: ele?.paymentAmount,
              paymentSchedulePayment: ele?.paymentSchedulePayment,
              editPaymentScheduleNumberOfPayments: ele?.installments,
              editPaymentScheduleTotalTerm: String(ele?.installments),
              installments: ele?.installments,
              segmentType: ele?.segmentType,
              isCustomised: ele?.isCustomised,
              proportion: ele?.proportion,
            };
            newPriceSegments.push(priceSegmentObj);
          }
        });

        return newPriceSegments;
      }

      mappedPriceSegments?.forEach((ele) => {
        if (ele.changeAction != "Delete") {
          let priceSegmentObj = {
            priceScheduleId: undefined,
            priceSegmentId: undefined,
            paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
            installmentFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentScheduleFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentAmount: ele?.paymentAmount,
            paymentSchedulePayment: ele?.paymentSchedulePayment,
            editPaymentScheduleNumberOfPayments: ele?.installments,
            editPaymentScheduleTotalTerm: String(ele?.installments),
            installments: ele?.installments,
            segmentType: ele?.segmentType,
            isCustomised: ele?.isCustomised,
          };
          newPriceSegments.push(priceSegmentObj);
        }
      });

      return newPriceSegments;
    }

    let oldFrequency =
      mappedPriceSegments?.[0]?.installmentFrequency ||
      mappedPriceSegments?.[0]?.paymentScheduleFrequency;

    if (
      (oldFrequency != formData?.frequency ||
        this?.changedDefaults?.term ||
        this?.changedDefaults?.paymentStructure) &&
      called == "preview"
    ) {
      let numOfPayments = Math.round(
        Number(formData?.term) *
        this.termFrequencyMultiplier[formData?.frequency]
      );

      if (!formData?.fixed) {
        let priceSegmentObj = {
          priceScheduleId: undefined,
          priceSegmentId: undefined,
          paymentScheduleDate: formData?.firstPaymentDate || null,
          installmentFrequency: formData?.frequency,
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount: 0,
          installments: numOfPayments,
          segmentType: "Installment",
          isCustomised: false,
        };
        newPriceSegments.push(priceSegmentObj);
      } else {
        let priceSegmentObj = {
          priceScheduleId: undefined,
          priceSegmentId: undefined,
          paymentScheduleDate: formData?.firstPaymentDate || null,
          installmentFrequency: formData?.frequency,
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount: 0,
          installments: numOfPayments - 1,
          segmentType: "Installment",
          isCustomised: false,
        };
        newPriceSegments.push(priceSegmentObj);
        let fixedDate = new Date(formData?.firstPaymentDate);
        fixedDate.setMonth(fixedDate.getMonth() + numOfPayments - 1);
        let fixedDateStrng = this.convertDateToString(fixedDate);
        let fixedPriceSegmentObj = {
          priceScheduleId: undefined,
          priceSegmentId: undefined,
          paymentScheduleDate: fixedDateStrng,
          installmentFrequency: formData?.frequency,
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount: 0,
          installments: 1,
          segmentType: "Payment Total",
          isCustomised: true,
        };
        newPriceSegments.push(fixedPriceSegmentObj);
      }
      return newPriceSegments;
    }

    if (!formData?.fixed) {
      mappedPriceSegments?.forEach((ele) => {
        if (ele.changeAction != "Delete") {
          let priceSegmentObj = {
            priceScheduleId: undefined,
            priceSegmentId: undefined,
            paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
            installmentFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentScheduleFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentAmount: ele?.paymentAmount,
            paymentSchedulePayment:
              called != "preview" ? ele?.paymentSchedulePayment : undefined,
            editPaymentScheduleNumberOfPayments:
              called != "preview" ? ele?.installments : undefined,
            editPaymentScheduleTotalTerm:
              called != "preview" ? ele?.installments : undefined,
            installments: ele?.installments,
            segmentType: ele?.segmentType,
            isCustomised:
              ele?.segmentType == "Payment Total" ? true : ele?.isCustomised,
          };
          newPriceSegments.push(priceSegmentObj);
        }
      });
    } else {
      let lastSegment = mappedPriceSegments?.[mappedPriceSegments?.length - 1];
      if (
        lastSegment?.installments == 1 &&
        lastSegment?.paymentSchedulePayment == 0 &&
        lastSegment?.segmentType == "Payment Total"
      ) {
        mappedPriceSegments?.forEach((ele, index) => {
          if (ele.changeAction != "Delete") {
            let priceSegmentObj = {
              priceScheduleId: undefined,
              priceSegmentId: undefined,
              paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
              installmentFrequency:
                ele?.installmentFrequency || ele?.paymentScheduleFrequency,
              paymentScheduleFrequency:
                ele?.installmentFrequency || ele?.paymentScheduleFrequency,
              paymentAmount: ele?.paymentAmount,
              paymentSchedulePayment:
                called != "preview" ? ele?.paymentSchedulePayment : undefined,
              editPaymentScheduleNumberOfPayments:
                called != "preview" ? ele?.installments : undefined,
              editPaymentScheduleTotalTerm:
                called != "preview" ? ele?.installments : undefined,
              installments: ele?.installments,
              segmentType: ele?.segmentType,
              isCustomised:
                ele?.segmentType == "Payment Total" ? true : ele?.isCustomised,
            };
            newPriceSegments.push(priceSegmentObj);
          }
        });
      } else {
        mappedPriceSegments?.forEach((ele, index) => {
          if (ele.changeAction != "Delete") {
            if (index != mappedPriceSegments?.length - 1) {
              let priceSegmentObj = {
                priceScheduleId: undefined,
                priceSegmentId: undefined,
                paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
                installmentFrequency:
                  ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                paymentScheduleFrequency:
                  ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                paymentAmount: ele?.paymentAmount,
                paymentSchedulePayment:
                  called != "preview" ? ele?.paymentSchedulePayment : undefined,
                editPaymentScheduleNumberOfPayments:
                  called != "preview" ? ele?.installments : undefined,
                editPaymentScheduleTotalTerm:
                  called != "preview" ? ele?.installments : undefined,
                installments: ele?.installments,
                segmentType: ele?.segmentType,
                isCustomised:
                  ele?.segmentType == "Payment Total"
                    ? true
                    : ele?.isCustomised,
              };
              newPriceSegments.push(priceSegmentObj);
            } else {
              if (ele?.installments == 1) {
                let priceSegmentObj = {
                  priceScheduleId: undefined,
                  priceSegmentId: undefined,
                  paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
                  installmentFrequency:
                    ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                  paymentScheduleFrequency:
                    ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                  paymentAmount: 0,
                  paymentSchedulePayment:
                    called != "preview"
                      ? ele?.paymentSchedulePayment
                      : undefined,
                  editPaymentScheduleNumberOfPayments:
                    called != "preview" ? ele?.installments : undefined,
                  editPaymentScheduleTotalTerm:
                    called != "preview" ? ele?.installments : undefined,
                  installments: ele?.installments,
                  segmentType: "Payment Total",
                  isCustomised: true,
                };
                newPriceSegments.push(priceSegmentObj);
              } else {
                let priceSegmentObj = {
                  priceScheduleId: undefined,
                  priceSegmentId: undefined,
                  paymentScheduleDate: ele?.calcDt || ele?.paymentScheduleDate,
                  installmentFrequency:
                    ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                  paymentScheduleFrequency:
                    ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                  paymentAmount: ele?.paymentAmount,
                  paymentSchedulePayment:
                    called != "preview"
                      ? ele?.paymentSchedulePayment
                      : undefined,
                  editPaymentScheduleNumberOfPayments:
                    called != "preview" ? ele?.installments : undefined,
                  editPaymentScheduleTotalTerm:
                    called != "preview" ? ele?.installments : undefined,
                  installments: ele?.installments - 1,
                  segmentType: ele?.segmentType,
                  isCustomised:
                    ele?.segmentType == "Payment Total"
                      ? true
                      : ele?.isCustomised,
                };
                newPriceSegments.push(priceSegmentObj);

                let fixedDate = new Date(
                  ele?.calcDt || ele?.paymentScheduleDate
                );
                fixedDate.setMonth(
                  fixedDate.getMonth() + ele?.installments - 1
                );
                let fixedDateStrng = this.convertDateToString(fixedDate);

                let newPriceSegmentObj = {
                  priceScheduleId: undefined,
                  priceSegmentId: undefined,
                  paymentScheduleDate: fixedDateStrng,
                  installmentFrequency:
                    ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                  paymentScheduleFrequency:
                    ele?.installmentFrequency || ele?.paymentScheduleFrequency,
                  paymentAmount: 0,
                  paymentSchedulePayment:
                    called != "preview"
                      ? ele?.paymentSchedulePayment
                      : undefined,
                  editPaymentScheduleNumberOfPayments:
                    called != "preview" ? ele?.installments : undefined,
                  editPaymentScheduleTotalTerm:
                    called != "preview" ? ele?.installments : undefined,
                  installments: 1,
                  segmentType: "Payment Total",
                  isCustomised: true,
                };
                newPriceSegments.push(newPriceSegmentObj);
              }
            }
          }
        });
      }
    }

    return newPriceSegments;
  }

  async splitAsset(
    physicalAssets,
    apiPhysicalAsset,
    formData,
    contractId?: any
  ) {
    var financialAssetInsurance = formData?.financialAssetInsurance;
    let childPhysicalAssetsToCreate = [];
    let originalPrice = 0;
    physicalAssets?.forEach((ele, index) => {
      let obj = {
        AssetHdrId: 0,
        PhysicalAssetType: "Asset",
        ChangeAction: "Create",
        AssetDescription: "",
        OwnerId: apiPhysicalAsset?.id,
        ParentOwnerId: apiPhysicalAsset?.id,
        AssetType: {
          AssetTypeId: ele?.assetType?.assetTypeId || 0,
          AssetTypePath: ele?.assetType?.assetTypeModalValues || "",
          AssetTypeName: ele?.assetType?.assetTypeDD || "",
        },
        Model: ele?.model,
        AssetClassEnum: "Vehicle",
        Reference: "",
        OriginalPurchasePrice: ele?.costOfAsset,
        AssetCondition: ele?.conditionOfGood || "",
        AssetCheckStatus1: "None",
        AssetCheckStatus2: "None",
        Vehicle: {
          AssetClassId: 0,
          VinNo: ele?.vin,
          RegistrationNo: ele?.regoNumber,
          MakeCode: ele?.make,
          Model: ele?.model,
          SubModel: ele?.variant,
          SubModelYear: String(ele?.year),
          ChassisNo: ele?.serialChassisNumber,
          Colour: ele?.colour,
          EngineNo: ele?.engineNumber,
          Odometer: ele?.odometer,
          Make: ele?.make,
          emissionRating: ele?.ccRating || "",
          fuelType: ele?.motivePower || "",
          description: ele?.description || "",
        },
        insuranceDetails:
          financialAssetInsurance?.[index]?.insurer != ""
            ? {
              assetHdrInsuranceId: 0,
              insuranceParty: {
                partyNo: financialAssetInsurance?.[index]?.partyId || 0,
              },
              broker: financialAssetInsurance?.[index]?.broker || "",
              sumInsured: financialAssetInsurance?.[index]?.sumInsured ?? 0,
              policyNumber:
                financialAssetInsurance?.[index]?.policyNumber || "",
              policyExpiryDate:
                financialAssetInsurance?.[index]?.policyExpiryDate || null,
              mobileNumber: "",
              email: "",
            }
            : null,
        customFields: [
          {
            name: "Asset location of use",
            value: ele?.assetLocationOfUse,
          },
          {
            name: "On Leasing",
            value: ele?.assetLeased == false ? "0" : "1",
          },
        ],
      };
      childPhysicalAssetsToCreate.push(obj);
    });
    let request = {
      numberOfPhysicalAssets: physicalAssets?.length,
      isApplyInsuranceToIndividualAssets: false,
      childPhysicalAssetsToCreate: childPhysicalAssetsToCreate,
    };

    let res = await this.data
      .post(
        `AssetType/asset_split?assetHdrId=${apiPhysicalAsset?.id}&contractId=${contractId}`,
        request
      )
      .pipe(
        map((res) => {
          if (res.apiError?.errors?.length > 0) {
            return;
          }
          originalPrice = res?.items?.[0]?.originalPurchasePrice;
          return res?.items?.[0]?.childPhysicalAssetItems;
        })
      )
      .toPromise();

    let arr: [] = cloneDeep(
      res.map((obj, index) => ({
        ...physicalAssets?.[index],
        assetId: obj.assetHdrId,
        actions: this.tradeSvc.actions,
        copyasset: false,
        isEdited: false,
      }))
    );
    this.tradeSvc.assetList = arr;
    this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
    return originalPrice;
  }

  async updateDeleteSplitAsset(physicalAssets, apiPhysicalAsset, formData) {
    let childPhysicalAssetsToCreate = [];
    let financialAssetInsurance = formData?.financialAssetInsurance;
    physicalAssets?.forEach((ele, index) => {
      let obj = {
        AssetHdrId: ele.copyasset ? 0 : ele?.assetId,
        ChangeAction:
          ele.copyasset || ele?.assetId == 0
            ? "Create"
            : ele.isEdited
              ? "Update"
              : "None",
        PhysicalAssetType: "Asset",
        AssetDescription: "",
        OwnerId: ele.copyasset ? 0 : apiPhysicalAsset?.id,
        ParentOwnerId: ele.copyasset ? 0 : apiPhysicalAsset?.id,
        AssetType: {
          AssetTypeId: ele?.assetType?.assetTypeId || 0,
          AssetTypePath: ele?.assetType?.assetTypeModalValues || "",
          AssetTypeName: ele?.assetType?.assetTypeDD || "",
        },
        Model: ele?.model,
        AssetClassEnum: "Vehicle",
        Reference: "",
        OriginalPurchasePrice: ele?.costOfAsset,
        AssetCondition: ele?.conditionOfGood || "",
        AssetCheckStatus1: "None",
        AssetCheckStatus2: "None",
        Vehicle: {
          AssetClassId:
            ele.copyasset || ele?.assetId == 0 ? 0 : ele?.vehicleClassId,
          VinNo: ele?.vin,
          RegistrationNo: ele?.regoNumber,
          MakeCode: ele?.make,
          Model: ele?.model,
          SubModel: ele?.variant,
          SubModelYear: String(ele?.year),
          ChassisNo: ele?.serialChassisNumber,
          Colour: ele?.colour,
          EngineNo: ele?.engineNumber,
          Odometer: ele?.odometer,
          Make: ele?.make,
          emissionRating: ele?.ccRating || "",
          fuelType: ele?.motivePower || "",
          // features: ele?.features || "",
          description: ele?.description || "",
        },
        insuranceDetails:
          financialAssetInsurance?.[index]?.insurer != ""
            ? {
              assetHdrInsuranceId:
                financialAssetInsurance?.[index]?.assetHdrInsuranceId || 0,
              insuranceParty: {
                partyNo: financialAssetInsurance?.[index]?.partyId || 0,
              },
              broker: financialAssetInsurance?.[index]?.broker || "",
              sumInsured: financialAssetInsurance?.[index]?.sumInsured ?? 0,
              policyNumber:
                financialAssetInsurance?.[index]?.policyNumber || "",
              policyExpiryDate:
                financialAssetInsurance?.[index]?.policyExpiryDate || null,
              mobileNumber: "",
              email: "",
            }
            : null,
      };
      childPhysicalAssetsToCreate.push(obj);
    });
    let deletedAssets = [];
    this.tradeSvc?.deleteAssetList?.forEach((ele) => {
      let obj = {
        assetHdrId: ele,
        ChangeAction: "Delete",
      };
      deletedAssets?.push(obj);
    });
    let request = {
      numberOfPhysicalAssets: physicalAssets?.length,
      isApplyInsuranceToIndividualAssets: false,
      childPhysicalAssetsToCreate: [
        ...childPhysicalAssetsToCreate,
        ...deletedAssets,
      ],
    };

    let originalPrice = 0;
    let res = await this.data
      .post(
        `AssetType/asset_split?assetHdrId=${apiPhysicalAsset?.id}&contractId=${formData?.contractId}`,
        request
      )
      .pipe(
        map((res) => {
          if (res.apiError?.errors?.length > 0) {
            return;
          }
          originalPrice = res?.items?.[0]?.originalPurchasePrice;
          return res?.items?.[0]?.childPhysicalAssetItems;
        })
      )
      .toPromise();

    let arr: [] = cloneDeep(
      res?.map((obj, index) => ({
        ...physicalAssets?.[index],
        assetId: obj.assetHdrId,
        actions: this.tradeSvc.actions,
        copyasset: false,
        isEdited: false,
      }))
    );

    this.tradeSvc.assetList = arr;
    this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
    this.tradeSvc.deleteAssetList = [];
    return originalPrice;
  }

  reCustomScheduleDate(formData, fPaymentDate) {
    let segments = cloneDeep(formData?.financialAssetPriceSegments);
    let firstPaymentDate = new Date(fPaymentDate);
    segments?.forEach((ele, index) => {
      if (index == 0) {
        segments[index].paymentScheduleDate =
          this?.convertDateToString(firstPaymentDate);
      } else {
        let currDate = new Date(segments[index - 1].paymentScheduleDate);
        currDate.setMonth(
          currDate.getMonth() + segments[index - 1]?.installments
        );

        segments[index].paymentScheduleDate =
          this?.convertDateToString(currDate);
      }
    });

    this?.setBaseDealerFormData({ financialAssetPriceSegments: segments });
  }

  createDateFormat(value: any) {
    return this.datePipe.transform(value, "yyyy-MM-dd");
  }

  async getPpsrRateFee(): Promise<void> {
    try {
      {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const effectDate = `${year}-${month}-${day}`;

        const payload = { effectDate };
        const response = await this.data
          .post("Contract/get_ppsrrate_fee", payload)
          .toPromise();

        if (response?.data?.ppsR_Amt !== undefined) {
          this.setBaseDealerFormData({
            ppsrPercentRate: response.data.ppsR_Amt,
          });
        }
      }
    } catch (error) {
      console.error("Error calling get_ppsrrate_fee API:", error);
    }
  }
  async getDealerForInternalSales(programId: any){
    const request = {
      parameterValues: ["Dealer Availability", String(programId)],
      procedureName: configure.SPProgramListExtract,
    };
    let response = await this.data.post(
      "LookUpServices/CustomData", request
    ).toPromise();
    this.internalSalesDealersList = response?.data?.table?.map((d: any) => ({
      label: d?.value_text,
      value: d?.value_text,
    }));
    if(!response?.data?.table?.length){
      // let dealerResponseData = await this.getFormData(
      //   "Contract/contract_party_dealer_details_internal"
      // );
      // this.internalSalesDealersList = dealerResponseData?.data?.dealers?.map((d: any) => ({
      //   label: d?.extName,
      //   value: d?.extName,
      // }));
    }
    return this.internalSalesDealersList;
  }

  async getOriginatorNumberByName(partyName: any){
    let response = await this.getFormData(`CustomerDetails/get_partiesdetail?ExteName=${partyName}`);
    return response?.data?.partyNo;
  }

  // Expected Usages API for AFV product
  async getExpectedUsages(params: {
    programId?: number;
    product?: string;
    assetType?: number;
    assetDealType?: string;
    assetCondition?: string;
    locationId?: number;
    businessUnitId?: number;
  }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('PageNo', '1');
      queryParams.append('PageSize', '50');
      
      if (params.programId) queryParams.append('ProgramId', String(params.programId));
      if (params.product) queryParams.append('Product', params.product);
      if (params.assetType) queryParams.append('AssetType', String(params.assetType));
      if (params.assetDealType) queryParams.append('AssetDealType', params.assetDealType);
      if (params.assetCondition) queryParams.append('AssetCondition', params.assetCondition);
      if (params.locationId) queryParams.append('LocationId', String(params.locationId));
      if (params.businessUnitId) queryParams.append('BusinessUnitId', String(params.businessUnitId));

      const response = await this.data
        .get(`Contract/get_expected_usages?${queryParams.toString()}`)
        .pipe(map((res: any) => res?.data?.items || res?.data || res?.items || []))
        .toPromise();

      const expectedUsagesData = response || [];
      
      // Store KM Allowance options in service
      if (expectedUsagesData.length > 0) {
        const usageItem = expectedUsagesData[0];
        const values = usageItem?.values || [];
        this.kmAllowanceOptions = values.map((value: number) => ({
          label: String(value),
          value: String(value)
        }));
        this.kmAllowanceDefaultValue = String(usageItem?.defaultExpectedUsage || '');
      }
      
      // Store in baseFormData using setBaseDealerFormData
      this.setBaseDealerFormData({
        expectedUsages: expectedUsagesData
      });
      
      // Emit to notify components that expectedUsages is loaded
      this.expectedUsagesLoaded.next(expectedUsagesData);
      
      return expectedUsagesData;
    } catch (error) {
      console.error('Error fetching expected usages:', error);
      this.setBaseDealerFormData({
        expectedUsages: []
      });
      return [];
    }
  }
}


