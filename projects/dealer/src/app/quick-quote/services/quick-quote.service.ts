import { Injectable, OnInit } from "@angular/core";
import { BaseDealerService } from "../../base/base-dealer.service";
import { BehaviorSubject, map, of } from "rxjs";
import { DataService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { AssetTradeSummaryService } from "../../standard-quote/components/asset-insurance-summary/asset-trade.service";
import { StandardQuoteService } from "../../standard-quote/services/standard-quote.service";
import { DashboardService } from "../../dashboard/services/dashboard.service";
import { cloneDeep } from "lodash";

@Injectable({
  providedIn: "root",
})
export class QuickQuoteService extends BaseDealerService implements OnInit {
  quickQuoteData = [];
  productList: any = [];
  productProgramList: any;
  errorsMessageArray: any = [];
  internalSalesDealerList: any = [];
  internalSalesDealers: any = [];
  hideResult: boolean;

  private selectedOperatingUnits: any;
 
  quickQuote = [
    {
      form: true,
      btnDisabled: true,
    },
    {
      form: false,
      btnDisabled: true,
    },
    {
      form: false,
      btnDisabled: true,
    },
  ];
  //  capturedImage$: any;
  constructor(
    public override data: DataService,
    public override route: ActivatedRoute,
    // public datePipe: DatePipe,
    private standardQuoteService: StandardQuoteService,
    public tradeSvc: AssetTradeSummaryService,
    private dashboardSvs: DashboardService
  ) {
    super(data, route);
       if((sessionStorage.getItem("externalUserType") == "Internal")){
      const selectedOperatingUnit = this.getOperatingUnit();
      if(selectedOperatingUnit){
      this.data?.getCacheableRoutes([`CustomerDetails/get_allparty?partyType=Dealer&operatingUnit=${selectedOperatingUnit[0]?.partyId}`]);
      }
    }
  }

  override ngOnInit(): void {}

  setOperatingUnit(units: any[]) {
    this.selectedOperatingUnits = units;
  }

  getOperatingUnit() {
    return this.selectedOperatingUnits;
  }

  resetData() {
    this.quickQuoteData = [];
  }
  
 copyData(index: number): void {
  this.quickQuoteData[index] = cloneDeep(this.quickQuoteData[index - 1]);
  if (this.quickQuoteData[index]) {
  this.quickQuoteData[index].calculateFor = 'Payment';
  }
  this.quickQuote[index].form = true;
}


  private capturedImageSubject = new BehaviorSubject<string | null>(null);

  // Observable to subscribe to in components
  capturedImage$ = this.capturedImageSubject.asObservable();

  // Method to update the captured image
  setCapturedImage(image: string): void {
    this.capturedImageSubject.next(image);
  }

  // Method to get the current captured image
  getCapturedImage(): string | null {
    return this.capturedImageSubject.getValue();
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
      financialAssetPriceSegments: this.getPriceSegments(formData),
    };
  }

  // NON FL product - keep balloon 
  return {
    balloonAmount: formData?.balloonAmount || 0,
    fixed: formData?.isFixed || false,
    isFixed: formData?.isFixed || false,
    balloonPct: formData?.balloonPct || 0,
    term: formData?.term,
    financialAssetPriceSegments: this.getPriceSegments(formData),
  };
}


  async contractPreview(formData, defaulting, onChange?: any) {
    let productCode = this.productList.filter(
      (item) => item.value === formData?.productId
    );
    productCode = this.dashboardSvs.getCodeByName(productCode[0]?.label);
    let calculateFor;
    if (formData?.calculateFor == "Payment") {
      calculateFor = "Installments";
    } else if (formData?.calculateFor == "Deposit") {
      calculateFor = "Custom Flow";
    } else if (formData?.calculateFor == "Balloon") {
      calculateFor = "Balloon";
    } else if (formData?.calculateFor == "Cash Price") {
      calculateFor = "Purchase Price";
    }
    let request = {};
    if (onChange != "program") {
      request = {
        cashDeposit: Number(formData?.deposit || 0).toFixed(2),
        deposit: Number(formData?.deposit || 0).toFixed(2) || 0,
        countryFirstRegistered: "New Zealand",
        calculationMode: calculateFor,
        payment:
          formData?.calculateFor != "Payment"
            ? formData?.payment || 0
            : undefined,
        frequency: formData?.frequency,
        isStructured: true,
        // financialAssetLease: {
        //   balloonAmount: formData?.balloonAmount || 0,
        //   fixed: formData?.isFixed || false,
        //   isFixed: formData?.isFixed || false,
        //   // balloonDate: new Date().toISOString(),
        //   balloonPct: formData?.balloonPct || 0,
        //   term: formData?.term,
        //   financialAssetPriceSegments: this.getPriceSegments(formData),
        // },
        financialAssetLease: this.buildFinancialAssetLease(productCode, formData),
        financialAssets: [
          {
            assetType: {
              assetTypeId: formData?.assetTypeId || 285,
            },
            cost: formData?.cashPriceValue || 0,
            cashDeposit: Number(formData?.deposit || 0).toFixed(2),
          },
        ],
        interestRate: formData?.interestRate || 0,
        isDraft: false,
        location: {
          extName: "New Zealand",
          locationId: 176,
          locationType: "Country",
        },
        product: {
          productId: formData?.productId,
        },
        program: {
          programId: formData?.programId,
        },
        originatorNumber: sessionStorage.getItem("dealerPartyNumber"),
      };

      if (onChange == "asset") {
        request = {
          ...request,
          financialAssets: [
            {
              assetType: {
                assetTypeId: formData?.assetTypeId || 0,
              },
            },
          ],
        };
      }
    } else if (onChange == "program") {
      request = {
        financialAssetLease: {},
        
        financialAssets: [],
        product: {
          productId: formData?.productId,
        },
        program: {
          programId: formData?.programId,
        },
      };
    }

    // if (
    //   formData?.productExtName?.includes("Direct") ||
    //   formData?.productExtName?.includes("Dir")
    // ) {
    //   request = {
    //     ...request,
    //     operatingUnit: {
    //       partyNo: 10001,
    //       extName: "Direct",
    //     },
    //   };
    // }

    // if (formData?.programExtName?.includes("Commercial Non-Facility")) {
    //   request = {
    //     ...request,
    //     operatingUnit: {
    //       partyNo: 10004,
    //       extName: "Commercial",
    //     },
    //   };
    // }

    // if (formData?.programExtName?.includes("Equipment")) {
    //   request = {
    //     ...request,
    //     operatingUnit: {
    //       partyNo: 10013,
    //       extName: "Equipment Dealer",
    //     },
    //   };
    // }

    let previewRequest = {
      queryArgs: {
        contractDefaultingCriteria: [],
        contractDefaultedDetails: ["Rates"],
      },
      data: {
        ...request,
        PRCode: productCode,
        ...(formData?.calculateFor == "Deposit" && { customFlowHdrId: 69 }),
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

    this.standardQuoteService?.assetSummaryData(previewRes, "preview");
    let dataMapped = this.mapPreviewConfigData(previewRes);
    this.setBaseDealerFormData(dataMapped);
    return dataMapped;

    // let data = {
    //   ...formData,
    //   ...dataMapped,
    // };

    // this.setBaseDealerFormData(data);
    // this.assetSummaryData(previewRes);

    // this.patchDataOnPreview.next({ data: data, onProgramChange: true });
  }
  getPriceSegments(formData: any) {
    let numOfPayments = Math.round(
      Number(formData?.term) *
        this.standardQuoteService?.termFrequencyMultiplier[formData?.frequency]
    );
    let segments = [];

     // InCase user enterrs a Initial Lease Amount 
  if (formData?.firstLeasePayment) {
    segments.push({
      paymentScheduleDate: null,
      paymentScheduleFrequency: formData?.frequency,
      paymentAmount: formData.firstLeasePayment,
      isCustomised: true,
      installments: 1,
      segmentType: "Payment Total",
    });

    segments.push({
      paymentScheduleDate: null,
      paymentScheduleFrequency: formData?.frequency,
      paymentAmount:
        formData?.calculateFor != "Payment" ? formData?.payment || 0 : 0,
      installments: numOfPayments - 1,
      segmentType: "Installment",
    });

    return segments;
  }
    if (!formData?.isFixed) {
      segments = [
        {
          paymentScheduleDate: null,
          //this?.convertDateToString(this?.standardQuoteService?.calculateSegmentDate(new Date(),formData?.frequency, 1 )
          //),
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount:
            formData?.calculateFor != "Payment" ? formData?.payment || 0 : 0,
          installments: numOfPayments,
          segmentType: "Installment",
        },
      ];
    } else {
      let firstDate = this?.standardQuoteService?.calculateSegmentDate(
        new Date(),
        formData?.frequency,
        1
      );
      segments = [
        {
          paymentScheduleDate: this?.convertDateToString(
            this?.standardQuoteService?.calculateSegmentDate(
              new Date(),
              formData?.frequency,
              1
            )
          ),
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount:
            formData?.calculateFor != "Payment" ? formData?.payment || 0 : 0,
          installments: numOfPayments - 1,
          segmentType: "Installment",
        },
        {
          paymentScheduleDate: this?.convertDateToString(
            this?.standardQuoteService?.calculateSegmentDate(
              firstDate,
              formData?.frequency,
              numOfPayments - 1
            )
          ),
          paymentScheduleFrequency: formData?.frequency,
          paymentAmount: 0,
          installments: 1,
          segmentType: "Payment Total",
        },
      ];
    }

    return segments;
  }

  mapPreviewConfigData(contractData) {
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

      let DataMapper = {
        udcEstablishmentFee: Math.abs(
          contractData?.financialAssets[0]?.udcEstablishmentFee || 0
        ),
        dealerOriginationFee: Math.abs(
          contractData?.financialAssets[0]?.dealerOriginationFee || 0
        ),
        deposit: contractData?.financialAssets[0]?.cashDeposit || 0,
        depositPct:
          ((contractData?.financialAssets?.[0]?.cashDeposit || 0) /
            (contractData?.financialAssets?.[0]?.cost || 0)) *
            100 || 0,

        estimatedCommissionSubsidy: contractData?.estimatedCommissionSubsidy,

        //payment summary
        balloonAmount: contractData?.financialAssetLease?.balloonAmount,
        balloonPct: contractData?.financialAssetLease?.balloonPct,
        firstPaymentDate: new Date(contractData?.firstPaymentDate),
        // paymentAmount: contractData?.financialAssetLease.paymentAmount,
        paymentAmount: contractData?.financialAssetLease.amtBaseRepayment,
        loanDate: new Date(contractData?.financialAssetLease.startDate),
        firstLeaseDate: new Date(contractData?.firstPaymentDate),
        leaseDate: new Date(contractData?.financialAssetLease.startDate),
        firstLeasePayment: contractData?.financialAssetLease.paymentAmount,
        numberofPayments: contractData?.financialAssetLease.numberofPayments,
        frequency: contractData?.frequency,
        baseInterestRate:contractData?.baseInterestRate,
        residualValueDelayDt: contractData?.financialAssetLease.residualValueDelayDt,
        totalEstablishmentFee:
          Math.abs(contractData?.financialAssets[0]?.udcEstablishmentFee || 0) +
          Math.abs(contractData?.financialAssets[0]?.dealerOriginationFee || 0),

        /// Asset Summary

        retailPriceValue: contractData?.financialAssetLease?.amtRecommendedRetailPriceCost,
        // additionalFundType: contractData?.additionalfundType,
        // additionalFund:
        //   contractData?.financialAssets?.[0]?.additionalFund == null
        //     ? null
        //     : Math.abs(contractData?.financialAssets?.[0]?.additionalFund),
        additionalFund: Math.abs(
          contractData?.financialAssetLease?.additionalFund?.amount
        ),
        additionalfundPurpose:
          contractData?.financialAssetLease?.additionalFund?.reference,
        //ppsrCount: contractData?.financialAssets?.length,

        /// Adds On Accessories

        financialAssetPriceSegments:
          contractData?.financialAssetLease?.financialAssetPriceSegments,
        residualValue: contractData?.financialAssetLease?.residualValue || 0, //amount
        afvModel: contractData?.financialAssets[0]?.physicalAsset?.model,
        afvMake: contractData?.financialAssets[0]?.physicalAsset?.make,
        afvYear: contractData?.financialAssets[0]?.physicalAsset?.year,
        afvVariant: contractData?.financialAssets[0]?.physicalAsset?.variant,
        afvProvider: "UDC Finance Ltd.",
        interestRate: contractData?.interestRate,
        pctResidualValue: 
        contractData?.financialAssetLease?.pctResidualValue,
        // contractData?.financialAssets?.[0]?.cost) *
        // 100 || 0,
        // pctResidualValue:
        //   (contractData?.financialAssetLease?.residualValue /
        //     contractData?.financialAssets?.[0]?.cost) *
        //     100 || 0,
        ...contractData?.usageandExcessAllowanceRequest?.[0],
        flows: contractData?.flows,
        totalCost: contractData?.financialAssetLease?.totalCost,
        term: contractData?.financialAssetLease?.term,
        // totalAmountBorrowed:
        //   contractData?.financialAssetLease?.totalAmountBorrowed || 0,
        totalAmountBorrowed: productCode === "FL" 
          ? contractData?.amoutFinanced || 0
          :contractData?.financialAssetLease?.totalAmountBorrowed || 0,
        includeGst: contractData?.financialAssets?.[0]?.taxesAmt || 0,
        interestCharges: contractData?.financialAssetLease?.interestCharge || 0,
        accessories: contractData?.financialAssetLease?.accessories,
        servicePlan: contractData?.financialAssetLease?.servicePlan,
        registrations: contractData?.financialAssetLease?.registrations,
        extended:
          contractData?.financialAssetLease?.extendedWarranty?.months ||
          contractData?.financialAssetLease?.extendedWarranty?.amount
            ? "yes"
            : "",
        extendedMonths:
          contractData?.financialAssetLease?.extendedWarranty?.months,
        extendedAmount:
          contractData?.financialAssetLease?.extendedWarranty?.amount,
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
            : "",
        guaranteedAssetProtectionMonths:
          contractData?.financialAssetLease?.guaranteeAssetProtection?.months,
        guaranteedAssetProtectionAmount:
          contractData?.financialAssetLease?.guaranteeAssetProtection?.amount,
        guaranteedAssetProtectionProvider:
          contractData?.financialAssetLease?.guaranteeAssetProtection?.provider,
        // guaranteedAssetProtectionId:
        //   contractData?.financialAssetLease?.guaranteeAssetProtection?.customFlowID,
        motorVehicalInsurance:
          contractData?.financialAssetLease?.motorVehicleInsurance?.months ||
          contractData?.financialAssetLease?.motorVehicleInsurance?.amount
            ? "yes"
            : "",
        motorVehicalInsuranceMonths:
          contractData?.financialAssetLease?.motorVehicleInsurance?.months,
        motorVehicalInsuranceAmount:
          contractData?.financialAssetLease?.motorVehicleInsurance?.amount,
        motorVehicalInsuranceProvider:
          contractData?.financialAssetLease?.motorVehicleInsurance?.provider,
        // motorVehicalInsuranceId:
        //   contractData?.financialAssetLease?.motorVehicleInsurance?.customFlowID,
        consumerCreditInsurance: contractData?.financialAssetLease?.consumerCreditInsurance?.months ||
          contractData?.financialAssetLease?.consumerCreditInsurance?.amount
            ? "yes"
            : "",
        contract:
          contractData?.financialAssetLease?.consumerCreditInsurance?.months ||
          contractData?.financialAssetLease?.consumerCreditInsurance?.amount
            ? "yes"
            : "",
        contractMonths:
          contractData?.financialAssetLease?.consumerCreditInsurance?.months,
        contractAmount:
          contractData?.financialAssetLease?.consumerCreditInsurance?.amount,
        contractProvider:
          contractData?.financialAssetLease?.consumerCreditInsurance?.provider,
        //loanMaintenceFee: contractData?.loanMaintenanceFee || 0,
         loanMaintenceFee: contractData?.lMFTotalAmount || 0,
         apiLoanMaintenceFee: contractData?.lMFTotalAmount || 0,
        cashPriceValue: contractData?.financialAssets[0]?.cost,
        cashPriceFinanceLease: contractData?.financialAssets[0]?.cost,
        conditionDD: contractData?.financialAssets[0]?.condition || 781,
        productCode: productCode,
        taxProfile: taxProfile,
        assetTypeId: contractData?.financialAssets[0]?.assetType?.assetTypeId,
        assetTypeDD: contractData?.financialAssets[0]?.assetType?.assetTypeName,
        assetTypeModalValues:
          contractData?.financialAssets[0]?.assetType?.assetTypePath,
        physicalAssets: [
          {
            ...contractData?.financialAssets[0].physicalAsset,
            assetPath:
              contractData?.financialAssets[0]?.physicalAsset?.assetTypes
                ?.assetTypePath,
            assetTypeId:
              contractData?.financialAssets[0]?.physicalAsset?.assetTypes
                ?.assetTypeId,
            assetName:
              contractData?.financialAssets[0]?.physicalAsset?.assetTypes
                ?.assetTypeName,
            assetType:
              contractData?.financialAssets[0]?.physicalAsset?.assetTypes,
            year: contractData?.financialAssets[0]?.physicalAsset?.year,
            assetLeased:
              contractData?.financialAssets[0]?.assetLeased == "1"
                ? true
                : false,
            //supplierName: "",//contractData?.supplierName,
            supplierName: contractData?.supplierName,
            assetLocationOfUse:
              contractData?.financialAssets[0]?.physicalAsset
                ?.assetLocationOfUse,
            countryFirstRegistered: contractData?.countryFirstRegistered,
            colour: contractData?.financialAssets[0].colour,
            insurer: contractData?.financialAssetInsurance?.[0]?.insurer,
            actions: this.tradeSvc.actions,
          },
        ],
        totalFees: contractData?.totalFees,
        loanAmount:
          productCode === "FL"
            ? contractData?.amoutFinanced
            : contractData?.financialAssets?.[0]?.loanAmountCal, 
        totalAmountPayable:
          productCode === "FL"
            ? contractData?.totalAmountPayable
            : (contractData?.totalFees || 0) +
              (contractData?.financialAssetLease?.interestCharge || 0) +
              (contractData?.financialAssets?.[0]?.loanAmountCal || 0),
        payment: contractData?.financialAssetLease?.paymentAmount,
        totalInterest: contractData?.financialAssetLease?.interestCharge,
        fixed: contractData?.financialAssetLease?.isFixed,
        paymentStructure: "None",
        lastPayment: (() => {
          let filteredInstallments = contractData?.flows?.filter(
            (item) => item?.flowType === "Installment"
          );
          const lastIndex = filteredInstallments?.length - 1;
          const lastItem = filteredInstallments[lastIndex];
          const formattedDate = new Date(lastItem?.calcDt);
          return formattedDate;
        })(),

        programExtName: contractData?.program?.extName,
      };
    return DataMapper;
  }

  // async assetSummaryData(formData) {
  //   this.tradeSvc.assetList = [];
  //   this.tradeSvc.insuranceList = [];
  //   this.tradeSvc.tradeList = [];
  //   if (
  //     formData?.financialAssets &&
  //     formData?.financialAssets?.length > 0
  //   ) {
  //     let assets = cloneDeep(formData?.financialAssets);
  //     assets.forEach((ele) => {
  //       if (ele?.physicalAsset?.assetTypes?.assetTypeId) {
  //         let obj = {
  //           ...ele.physicalAsset,
  //           assetPath: ele?.physicalAsset?.assetTypes?.assetTypePath,
  //           assetTypeId: ele?.physicalAsset?.assetTypes?.assetTypeId,
  //           assetName: ele?.physicalAsset?.assetTypes?.assetTypeName,
  //           assetType: ele?.physicalAsset?.assetTypes,
  //           year: ele?.physicalAsset?.year,
  //           assetLeased: ele?.assetLeased == '1' ? true : false,
  //           supplierName: formData.supplierName,
  //           assetLocationOfUse: ele?.physicalAsset?.assetLocationOfUse,
  //           countryFirstRegistered: formData?.countryFirstRegistered,
  //           colour: ele.colour,
  //           insurer: formData?.financialAssetInsurance?.[0]?.insurer,
  //           actions: this.tradeSvc.actions,
  //         };
  //         this.tradeSvc.assetList.push(obj);
  //       }
  //     });

  //     if (formData?.financialAssetInsurance) {
  //       this.tradeSvc.insuranceList = formData?.financialAssetInsurance;
  //       this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
  //       // await this.brokerDetails(
  //       //   formData?.financialAssetInsurance?.[0]?.assetHdrId,
  //       //   formData?.financialAssetInsurance?.[0]?.insurerhdrId
  //       // );
  //     }
  //     this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
  //   }
  //   this.setBaseDealerFormData({
  //     physicalAsset: this.tradeSvc.assetList,
  //   });

  //   if (formData?.tradeInAssetRequest) {
  //     this.tradeSvc.tradeList = cloneDeep(
  //       formData?.tradeInAssetRequest.map((obj) => ({
  //         ...obj,
  //         actions: this.tradeSvc.actions,
  //       }))
  //     );
  //   }
  //   this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);
  // }
}
