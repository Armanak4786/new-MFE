import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { map, Subject, takeUntil } from "rxjs";

import { StandardQuoteService } from "./services/standard-quote.service";
import { DealerUdcDeclarationComponent } from "./components/dealer-udc-declaration/dealer-udc-declaration.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AssetTradeSummaryService } from "./components/asset-insurance-summary/asset-trade.service";
import { FinancialAsset } from "./models/standardQuote";
import { HttpClient } from "@angular/common/http";
import { QuickQuoteService } from "../quick-quote/services/quick-quote.service";
import { IndividualService } from "../individual/services/individual.service";
import { BusinessService } from "../business/services/business";
import { TrustService } from "../trust/services/trust.service";
import { FinalConfirmationComponent } from "./components/final-confirmation/final-confirmation.component";
import { OriginatorReferenceComponent } from "./components/originator-reference/originator-reference.component";
import {
  AuthenticationService,
  CloseDialogData,
  CommonService,
  MapFunc,
  Mode,
  StorageService,
  ToasterService,
} from "auro-ui";
import configure from "src/assets/configure.json";
import { DashboardService } from "../dashboard/services/dashboard.service";
import { SoleTradeService } from "../sole-trade/services/sole-trade.service";
import { Message } from "primeng/api";
import { LayoutService } from "shared-lib";

@Component({
  selector: "app-standard-quote",
  templateUrl: "./standard-quote.component.html",
  styleUrl: "./standard-quote.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardQuoteComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  // financedata?: any; //todo interface
  mode: Mode | string = Mode.create;
  id: any;
  data: any = {};

  activeStep = 0;
  steps = [
    { label: "Asset Details" },
    { label: "Customer Details" },
    { label: "Post Submission" },
  ];
  formData: any;
  isReady: boolean = false;
  user_role: any;

  //program and product
  productList: any;
  programList: any;
  docLoad: any;
  accessGranted: any;
  activeTab = 0;
  keyInfoId: any;
  //contractpartyRolesDetails: any;
  accessMode = "";
  hideDraft: boolean = false;
  userRole: any;
  showSupplier: boolean = false;
  conditionDDValue: any;

  constructor(
    private standardQuoteSvc: StandardQuoteService,
    public tradeSvc: AssetTradeSummaryService,
    public commonSvc: CommonService,
    public auth: AuthenticationService,
    public router: Router,
    private quickquoteService: QuickQuoteService,
    private assetTradeSvc: AssetTradeSummaryService,
    public route: ActivatedRoute,
    public http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    public individualSvc: IndividualService,
    public businessSvc: BusinessService,
    public soleTradeSvc: SoleTradeService,
    private trustSvc: TrustService,
    private toasterService: ToasterService,
    private layOutSvc: LayoutService,
    private stoteSvc: StorageService,
    private dashboardService: DashboardService
  ) {
    this.commonSvc.data.getCacheableRoutes(["Brand/all_brand_logo"]);
    this.commonSvc.data.postCacheableRoutes(["LookUpServices/CustomData"]);

     this.standardQuoteSvc.formDataCacheableRoute([
     "Contract/contract_party_dealer_details_internal"
    ]);
    //  this.standardQuoteSvc.formDataCacheableRoute([
    //   "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Workflow Steps",
    // ]);

    // this.standardQuoteSvc.getFormData(
    //   `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Workflow Steps`
    // );
  }

  // @ViewChildren('container', { read: ElementRef }) containers!: QueryList<ElementRef>;
  async ngOnInit() {
    this.dashboardService.isDealerCalculated = false;
    /////RBAC
    let params: any = this.route.snapshot.params;
    //    this.mode = params.mode || 'create';
    // this.standardQuoteSvc.mode = this.mode;
    this.mode = this.standardQuoteSvc.mode;
    if (params.mode == "view" || params.mode == "edit") {
      this.standardQuoteSvc.accessMode = params.mode;
    }
    this.standardQuoteSvc.forceToClickCalculate.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.btnStatus = status;
    });

    if (params.mode) this.accessMode = this.standardQuoteSvc.accessMode;
    this.userRole = JSON.parse(sessionStorage.getItem("user_role"));

    this.hideDraft = false;

    this.activeStep = this.standardQuoteSvc?.activeStep;
    // this.activeStep = 2;
    this.standardQuoteSvc?.stepper?.next({
      activeStep: this.activeStep,
    });

    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
        if (this.formData?.keyInfo?.id) {
          this.keyInfoId = this.formData?.keyInfo?.id;
        }
      });

      await this.init();
      await this.getState();
    if (this.formData?.contractId) {
      this.standardQuoteSvc.calculatedOnce = true;
      if (!this.formData.isDealerChange) {
        this.standardQuoteSvc.forceToClickCalculate.next(false);
      }
    }
    // else {
    //   this.standardQuoteSvc.calculatedOnce = false;
    // }

    this.tradeSvc.assetListSubject.subscribe((res) => {
      let assetArr = res.map(({ actions, ...rest }) => rest);
      this.standardQuoteSvc.setBaseDealerFormData({ physicalAsset: assetArr });
    });

    this.tradeSvc.insuranceListSubject.subscribe((res) => {
      this.standardQuoteSvc.setBaseDealerFormData({
        financialAssetInsurance: res,
      });
    });
    this.tradeSvc.tradeListSubject.subscribe((res) => {
      let tradeArr = res.map(({ actions, ...rest }) => rest);
      this.standardQuoteSvc.setBaseDealerFormData({
        tradeInAssetRequest: tradeArr,
      });
    });
    this.standardQuoteSvc.onDealerChange.subscribe(async (dealer) => {
      // this.btnStatus = true;
      if (dealer) {
        await this.resetDataOnchangeDealer();
        return;
      }
      // else
      // {
      //   if (this.activeStep == 1 && this.dashboardService.isDealerCalculated &&  this.router.url != "/dealer" ) {
      //   if (params.mode == "view" || params.mode == "edit") {
      //     // this.standardQuoteSvc.activeStep = 0;
      //     // this.btnStatus = true;

      //     this.commonSvc.router.navigateByUrl(
      //       `/dealer/standard-quote/${params.mode}/${this.formData?.contractId}`
      //     );
      //   } else {
      //     //  this.standardQuoteSvc.activeStep = 0;
      //     //  this.btnStatus = true;

      //     this.commonSvc.router.navigateByUrl(`/dealer/standard-quote`);
      //   }
      // }
      //}
    });


  }
  async getState() {
    if (this.formData?.contractId) {
      let state = await this.commonSvc.data
        .get(
          `WorkFlows/get_workflownamestate?ContractId=${this.formData?.contractId}&WorkflowName=Application`
        )
        .pipe(
          map((res) => {
            return res?.data;
          })
        )
        .toPromise();
      this.standardQuoteSvc?.appStatus?.next({
        currentState: state?.currentState?.name,
        nextState: state?.defaultNextState?.name,
      });
      this.statusChange({
        currentState: state?.currentState?.name,
        nextState: state?.defaultNextState?.name,
      });
      this.standardQuoteSvc.setBaseDealerFormData({ AFworkflowStatus: state.currentState.name, AFworkflowId: state.workflowId })
      this.isReady = true;
      this.changeDetectorRef?.detectChanges();
    } else {
      this.standardQuoteSvc.setBaseDealerFormData({
        workFlowStatus: "Open Quote",
      });
      sessionStorage.setItem("workFlowStatus", "Open Quote");
    }
  }

  hideNext: boolean;
  hideSubmit: boolean;
  customLabel = null;

  statusChange(statusDetails) {
    if (
      !(
        statusDetails?.currentState == "Expired"
        //  ||
        // statusDetails?.currentState == "Quote" ||
        // statusDetails?.currentState == "Draft"
      )
    ) {
      // this.hideNext = true;
      // this.hideDraft = true;
      this.customLabel = "Exit";
      // this.isDisable = true;
    } else {
      // if (this.formData?.contractId && !this.formData?.isDraft) {
      //   this.hideDraft = true;
      // } else {
      //   this.hideDraft = false;
      // }
      // this.hideNext = false;
      // this.customLabel = null;
    }
  }

  async updateState(nextState) {
    let getState = await this.commonSvc.data
      .get(
        `WorkFlows/get_workflownamestate?ContractId=${this.formData?.contractId}&WorkflowName=Application`
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      )
      .toPromise();

    let workflowId = getState.workflowId;
    // let nextState = getState.defaultNextState;
    let request = {
      nextState: nextState,
      isForced: false,
    };
    let state = await this.commonSvc.data
      .put(
        `WorkFlows/update_workflowstate?contractId=${this.formData?.contractId}&workflowName=Application&WorkFlowId=${workflowId}`,
        request
      )
      .pipe(
        map((res) => {
          if (res?.data) {
            return res?.data?.data;
          }
          else if (res?.apiError?.errors.length > 0) {

            let errors = res?.apiError?.errors

            const messages: Message[] = errors.map((err) => ({
              severity: "error",
              detail: err.message,
            }));
            this.toasterService.showMultiple(messages);
            return;
          }
        })
      )
      .toPromise();

    if (state) {
      this.standardQuoteSvc?.appStatus?.next({
        currentState: state?.currentState?.name,
        nextState: state?.defaultNextState?.name,
      });
    }

  }

  ngOnDestroy(): void {
    // Unsubscribe from the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  async init() {
    let params: any = this.route.snapshot.params;

    this.docLoad = params.docLoad;
    this.id = params?.id || null;
    if (this.id) {
      // get FinancialDetail data

      let contractData = await this.standardQuoteSvc.getFormData(
        `Contract/get_contract?ContractId=${this.id}`,
        function (res) {
          return res?.data || null;
        }
      );

      if(sessionStorage.getItem("externalUserType") == "Internal"){
      await this.standardQuoteSvc?.getDealerForInternalSales(contractData?.program?.programId);
      }
      // if(contractData){
      //   this.standardQuoteSvc.updateFieldValuesFromApi(contractData);
      // }


      // let contractData: any;
      // this.commonSvc.data.get(`Contract/get_contract?ContractId=${this.id}`).pipe(map((res) => {
      //   if(res?.data) {
      //   this.standardQuoteSvc.updateFieldValuesFromApi(res?.data);
      //   }
      //   contractData = res?.data;
      //   return res?.data
      // })).toPromise();

      if (contractData?.contractEtag) {
        this.stoteSvc.setItem("contractEtag", contractData?.contractEtag);
      }

      let dataMapped = this.standardQuoteSvc.mapConfigData(contractData);

      this.data = {
        ...this.data,
        ...contractData,
        ...dataMapped,
        programExtName: contractData?.program?.extName || contractData?.programExtName || dataMapped?.programExtName,
        productExtName: contractData?.product?.extName || contractData?.productExtName ||dataMapped?.productExtName,

        status: contractData?.status ||dataMapped?.status ||'Open Quote',
        isDraft: contractData?.isDraft != undefined ? contractData?.isDraft :dataMapped?.isDraft,
        workflowStatus: contractData?.workflowStatus || dataMapped?.workflowStatus ,

        quoteId: contractData?.quoteId || contractData?.contractId || this.id,
        //documentsData:  this.documentsApiData,
        // generatedDocuments:  this.generatedDocumentsApiData,
      };

      if (this.data) {
        this.standardQuoteSvc.setBaseDealerFormData(this.data);
      }
      let currentData;
      this.standardQuoteSvc
        .getBaseDealerFormData()
        .pipe(
          map((res) => {
            currentData = res;
          })
        )
        .toPromise();
      this.getTerm(this.data, currentData?.programId);
      this.standardQuoteSvc?.assetSummaryData(this.formData);
      this.sumAccessories();
      this.getProductCustomFlow(this.formData?.productId);
      
      // For AFV product, call getExpectedUsages API to populate KM Allowance dropdown
      if (this.formData?.productCode === 'AFV' && this.formData?.programId) {
        // Fetch product list to get the dropdown label (name) for the product
        let productName = this.formData?.productName;
        try {
          const productRes = await this.standardQuoteSvc.getFormData(`Product/get_programs_products?introducerId=0`);
          if (productRes?.data?.products) {
            const matchingProduct = productRes.data.products.find(
              (p: any) => p.productId === this.formData?.productId
            );
            if (matchingProduct?.name) {
              productName = matchingProduct.name;
              // Store the correct product name in baseFormData
              this.standardQuoteSvc.setBaseDealerFormData({ productName: matchingProduct.name });
            }
          }
        } catch (e) {
          console.error('Error fetching product list:', e);
        }
        
        this.standardQuoteSvc.getExpectedUsages({
          programId: this.formData?.programId,
          product: productName,
          assetType: this.formData?.assetTypeDD,
          assetDealType: this.formData?.assetDealType,
          assetCondition: this.formData?.condition,
          locationId: this.formData?.location?.locationId,
          businessUnitId: this.formData?.businessUnitId
        });
      }
    }
    if (!this.id) {

      this.isReady = true;
    }
    this.standardQuoteSvc.programChange.next(this.formData.programId);

    this.showSupplier =
      ((sessionStorage.getItem("externalUserType") == "Internal") &&
        this.formData?.privateSales)
        ? true
        : false;
    this.changeDetectorRef.detectChanges(); // Trigger change detection manually
  }

  async getProductCustomFlow(productId) {
    var loanPurpose = await this.standardQuoteSvc.getFormData(
      `Product/get_productCustomFields?productId=${productId}`
    );

    this.standardQuoteSvc.setBaseDealerFormData({
      allowedInsuranceProducts: loanPurpose?.data?.allowedInsuranceProducts,
      purposeofLoan: loanPurpose?.data?.loanPurpose,
    });

    this.standardQuoteSvc.onLoanPurposeChange.next(
      loanPurpose?.data?.loanPurpose
    );
  }

  async getTerm(formData, programId) {
    await this.commonSvc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["Term Override", String(programId)],
        procedureName: configure.SPProgramListExtract,
      })
      .pipe(
        map(
          (response) => {
            if (
              (response?.data?.table?.length === 1 &&
                response?.data?.table?.[0]?.value_id === 0) ||
              response?.data?.table?.length == 0
            ) {
              let Termoptions = [
                {
                  label: "12",
                  value: 12,
                },
                {
                  label: "24",
                  value: 24,
                },
                {
                  label: "36",
                  value: 36,
                },
                {
                  label: "48",
                  value: 48,
                },
                {
                  label: "60",
                  value: 60,
                },
              ];

              const termOptionsString = Termoptions.map(
                (item) => item.label
              ).join(",");

              this.standardQuoteSvc.setBaseDealerFormData({
                termOptions: termOptionsString,
              });
            } else if (response?.data?.table.length > 0) {
              // this.mainForm.get('term').reset();

              const termOptionsString = response?.data?.table
                .map((item) => item.value_text)
                .join(",");

              this.standardQuoteSvc.setBaseDealerFormData({
                termOptions: termOptionsString,
              });
            }
          },
          (error) => { }
        )
      )
      .toPromise();

    this.standardQuoteSvc?.createQuick(this.formData);
  }

  sumAccessories() {
    let registrations = this.formData?.financialAssetLease?.registrations || [];
    let servicePlan = this.formData?.financialAssetLease?.servicePlan || [];
    let others = this.formData?.financialAssetLease?.others || [];
    let accessories = this.formData?.financialAssetLease?.accessories || [];

    let extendedWarranty =
      this.formData?.financialAssetLease?.extendedWarranty || {};
    let motorVehicleInsurance =
      this.formData?.financialAssetLease?.motorVehicleInsurance || {};
    let guaranteeAssetProtection =
      this.formData?.financialAssetLease?.guaranteeAssetProtection || {};
    let consumerCreditInsurance =
      this.formData?.financialAssetLease?.consumerCreditInsurance || {};
    let mechanicalBreakdownInsurance =
      this.formData?.financialAssetLease?.mechanicalBreakdownInsurance || {};

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

    let filteredData = this.formData?.accessories?.filter(
      (item) => item.name !== ""
    );
    this.standardQuoteSvc.setBaseDealerFormData({
      totalCharge: total,
      accessories: filteredData,
    });
  }


  // async assetSummaryData() {
  //   if (
  //     this.formData?.financialAssets &&
  //     this.formData?.financialAssets?.length > 0
  //   ) {
  //     this.tradeSvc.assetList = cloneDeep(
  //       this.formData?.financialAssets.map((obj) => ({
  //         ...obj.physicalAsset,
  //         assetPath: obj?.physicalAsset?.assetTypes?.assetTypePath,
  //         assetTypeId: obj?.physicalAsset?.assetType?.assetTypeId,
  //         assetName: obj?.physicalAsset?.assetTypes?.assetTypeName,
  //         assetType: obj?.physicalAsset?.assetTypes,
  //         year: obj?.yearOfManufacture,
  //         assetLeased: obj?.assetLeased == '1' ? true : false,
  //         supplierName: this.formData.supplierName,
  //         assetLocationOfUse: obj?.physicalAsset?.assetLocationOfUse,
  //         countryFirstRegistered: this.formData?.countryFirstRegistered,
  //         colour: obj.colour,
  //         insurer: this.formData?.financialAssetInsurance?.[0]?.insurer,
  //         actions: this.tradeSvc.actions,
  //       }))
  //     );

  //     if (this.formData?.financialAssetInsurance) {
  //       this.tradeSvc.insuranceList = this.formData?.financialAssetInsurance;
  //       this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
  //       await this.brokerDetails(
  //         this.formData?.financialAssetInsurance?.[0]?.assetHdrId,
  //         this.formData?.financialAssetInsurance?.[0]?.insurerhdrId
  //       );
  //     }
  //     this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
  //   }
  //   this.standardQuoteSvc.setBaseDealerFormData({
  //     physicalAsset: this.tradeSvc.assetList,
  //   });

  //   if (this.formData?.tradeInAssetRequest) {
  //     this.tradeSvc.tradeList = cloneDeep(
  //       this.formData?.tradeInAssetRequest.map((obj) => ({
  //         ...obj,
  //         actions: this.tradeSvc.actions,
  //       }))
  //     );
  //   }
  //   this.tradeSvc.tradeListSubject.next(this.tradeSvc.tradeList);
  // } 

  async onSubmit() {
    // todo

    let params: any = this.route.snapshot.params;
    let additionalData: any = await this.commonSvc.data
      .get(
        `WorkFlows/get_workflowstate?ContractId=${this.formData?.contractId}&workflowName=Application`
      )
      .pipe(
        map((res) => {
          return res?.items;
        })
      )
      .toPromise();

    if (additionalData.length > 0) {
      let customerSummaryData;
      customerSummaryData = this.formData?.customerSummary?.find((ele) => {
        return ele?.customerRole == 1;
      });

      if (!customerSummaryData) {
        this.toasterService.showToaster({
          severity: "error",
          detail: "At least one Borrower must have been added to the quote.",
        });
        return;
      }

      let todoObj = additionalData.find((ele) => {
        return ele?.mandetory && !ele.status;
      });

      if (todoObj) {
        this.toasterService.showToaster({
          severity: "error",
          detail: "Please Complete the To-Dos",
        });
        return;
      }
    }

    if (
      this.formData?.workFlowStatus == "Open Quote" ||
      this.formData?.workFlowStatus == "Quote" ||
      this.formData?.workFlowStatus == "Draft"
    ) {
      this.commonSvc.dialogSvc
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
            await this.updateState("Submitted");
            if (
              this.formData.contractId &&
              data?.btnType == "submit" &&
              data?.data?.formData &&
              data?.data?.formData?.isPrivacyAuthorization &&
              data?.data?.formData?.isFinancialAdvise
            ) {
              // alert(JSON.stringify(data?.data?.formData));
              // todo proceed api
              
              this.commonSvc.dialogSvc
                .show(FinalConfirmationComponent, "", {
                  data: this.formData,
                })
                ?.onClose.subscribe((data: CloseDialogData) => {
                  if (data?.btnType == "submit") {
                    this.standardQuoteSvc.resetBaseDealerFormData();
                    this.individualSvc.resetBaseDealerFormData();
                    this.businessSvc.resetBaseDealerFormData();
                    this.trustSvc.resetBaseDealerFormData();
                    this.standardQuoteSvc.individualDataSubject.unsubscribe();
                    this.assetTradeSvc.resetData();
                    this.quickquoteService.resetData();
                    this.router.navigateByUrl("/dealer");
                    this.standardQuoteSvc.activeStep = 0;
                  }
                });
            } else if (data?.btnType == "submit" && this.formData.contractId) {
              
              this.commonSvc.dialogSvc
                .show(FinalConfirmationComponent, "", {
                  data: {
                    data: this.formData,
                  },
                  templates: {
                    footer: null,
                  },
                  width: "60vw",
                })
                ?.onClose.subscribe((data: CloseDialogData) => {
                  if (data?.btnType == "submit") {
                    this.standardQuoteSvc.resetBaseDealerFormData();
                    this.individualSvc.resetBaseDealerFormData();
                    this.businessSvc.resetBaseDealerFormData();
                    this.trustSvc.resetBaseDealerFormData();
                    this.standardQuoteSvc.individualDataSubject.unsubscribe();
                    this.assetTradeSvc.resetData();
                    this.quickquoteService.resetData();
                    this.router.navigateByUrl("/dealer");
                    this.standardQuoteSvc.activeStep = 0;
                  }
                });
              // alert('Declaration form is unchecked!');
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
  btnStatus: boolean = true;
  cashPrice = 0;
  hasAllMandatoryFields(): boolean {
    return !!(
      this.formData?.productId &&
      this.formData?.programId &&
      this.formData?.originatorReference
    );
  }
  async changeStep(params) {
    if (params.activeStep == 0) {
      this.hideNext = false;
      this.layOutSvc.setActiveTab("asset_details");
    } else if (params.activeStep == 1) {
      this.hideNext = false;
      this.layOutSvc.setActiveTab("customer_details");
    } else if (params.activeStep == 2) {
      this.hideSubmit = true;
      this.layOutSvc.setActiveTab("contract_summary");
    }

    if (params.activeStep == 1) {
      this.showSupplier =
        ((sessionStorage.getItem("externalUserType") == "Internal") && (sessionStorage.getItem("productCode") == "TL")) &&
          this.formData?.privateSales
          ? true
          : false;
    }

    this.cashPrice = this.formData?.cashPriceValue;
    if (params.type == "next") {
      this.standardQuoteSvc?.stepper?.next({
        activeStep: this.activeStep,
        validate: true,
      });

      if (this.accessMode == "view") {
        this.activeStep = params.activeStep;
        this.standardQuoteSvc.activeStep = this.activeStep;
        this.changeDetectorRef.detectChanges(); // Trigger change detection manually
        this.standardQuoteSvc.stepper.next(params);
        return;
      }

      const statusInvalid =
        this.standardQuoteSvc.formStatusArr.includes("INVALID");

      if (!statusInvalid) {
        if (this.formData?.productCode === 'OL') {
          const term = this.formData?.term || this.formData?.terms || 0;
          const usefulLife = this.formData?.usefulLife || 0;

          if (term > usefulLife && usefulLife > 0) {
            this.toasterService.showToaster({
              severity: 'error',
              detail: 'Term cannot exceed useful life.',
            });
            return;
          }
        }
        if (this.formData?.contractId) {
          if (this.activeStep == 0) {
            this.standardQuoteSvc.isDocumentData.next(false);
            if (this.formData?.productCode === "OL") {
              const term = this.formData?.term || this.formData?.terms || 0;
              const usefulLife = this.formData?.usefulLife || 0;

              if (term > usefulLife && usefulLife > 0) {
                this.toasterService.showToaster({
                  severity: "error",
                  detail: "Term cannot exceed useful life.",
                });
                return;
              }
            }
            if (!this.btnStatus) {
              let isDataModified = true;
              let res = await this.contractModification(
                params,
                this.activeStep,
                false,
                isDataModified
              );
            } else {
              this.toasterService.showToaster({
                severity: "error",
                detail: "Please click on Calculate.",
              });
            }
          } else if (this.activeStep == 1) {
            const errors = [];

            let hell = this.formData?.customerSummary?.find((ele) => {
              return ele?.roleName == "Borrower";
            });

            let customerTypeBusiness = this.formData?.customerSummary?.find(
              (type) => {
                return type?.customerType == "Business";
              }
            );

            let customerTypeTrust = this.formData?.customerSummary?.filter(
              (type) => {
                return type?.customerType == "Trust";
              }
            );

            if (this.standardQuoteSvc.updateIndividualCustomerWarning) {
              errors.push({
                severity: "warn",
                detail: "Update individual details",
              });
            }

            // Check 1: Business in Consumer loan
            if (
              this.formData?.purposeofLoan == configure?.LoanPurpose &&
              customerTypeBusiness
            ) {
              // errors.push("business_on_consumerLoanPurpose");
              errors.push({
                severity: "error",
                detail: "business_on_consumerLoanPurpose",
              });
            }

            // Check 2: Trust as Borrower/CoBorrower in Consumer loan
            if (
              this.formData?.purposeofLoan == configure?.LoanPurpose &&
              this.formData?.customerSummary?.find((type) => {
                return type?.customerType == "Trust";
              }) &&
              customerTypeTrust?.some(
                (trust) =>
                  trust?.roleName === "Borrower" ||
                  trust?.roleName === "CoBorrower"
              )
            ) {
              // errors.push("trust_customerType_onConsumerLoanPurpose");
              errors.push({
                severity: "error",
                detail: "trust_customerType_onConsumerLoanPurpose",
              });
            }

            // Check 3: At least one Borrower exists
            if (
              !(
                this.formData?.customerSummary?.length > 0 &&
                this.formData?.customerSummary?.find(
                  (ele) => ele?.roleName == "Borrower"
                )
              )
            ) {
              // errors.push("one_Borrower_exists");
              errors.push({
                severity: "error",
                detail: "one_Borrower_exists",
              });
            }

            const partnershipBorrower = this.formData?.customerSummary?.find(
              (customer) =>
                customer?.isPartnership === true &&
                customer?.customerRole === 1 && // Borrower
                customer?.customerType === "Business"
            );

            if (partnershipBorrower) {
              const coBorrowers = this.formData?.customerSummary?.filter(
                (customer) => customer?.customerRole === 2 // Co-borrower
              );

              if (!coBorrowers || coBorrowers.length < 2) {
                errors.push({
                  severity: "error",
                  detail:
                    "There should be 2 co-borrowers required for partnership",
                });
              }
            }

            // const unconfirmedCustomers = [];
            // let customerSummaryData = this.formData?.customerSummary;
            // let updatedCustomerSummaryData =
            //   this.formData?.updatedCustomerSummary;

            // // Check if customerSummaryData exists and has customer data
            // if (customerSummaryData && Array.isArray(customerSummaryData)) {
            //   // Iterate through all customers in customerSummaryData
            //   customerSummaryData.forEach((customer) => {
            //     if (
            //       customer.isConfirmed === false ||
            //       customer.isConfirmed === null
            //     ) {
            //       unconfirmedCustomers.push(
            //         customer.customerName || "Unknown Customer"
            //       );
            //     }
            //   });
            // }

            // // Check if updatedCustomerSummaryData exists and has customer data
            // if (
            //   updatedCustomerSummaryData &&
            //   Array.isArray(updatedCustomerSummaryData)
            // ) {
            //   // Iterate through all customers in updatedCustomerSummaryData
            //   updatedCustomerSummaryData.forEach((customer) => {
            //     if (customer.showInfoIcon) {
            //       unconfirmedCustomers.push(
            //         customer.customerName || "Unknown Customer"
            //       );
            //     }
            //   });
            // }
            const unconfirmedCustomers: string[] = [];
            const seenCustomers = new Set<string>(); // Track unique key

            let customerSummaryData = this.formData?.customerSummary;
            let updatedCustomerSummaryData =
              this.formData?.updatedCustomerSummary;

            // Check customerSummaryData
            if (customerSummaryData && Array.isArray(customerSummaryData)) {
              customerSummaryData.forEach((customer) => {
                if (
                  customer.isConfirmed === false ||
                  customer.isConfirmed === null
                ) {
                  const key = `${customer.customerNo}-${customer.customerName || "Unknown Customer"
                    }`;
                  if (!seenCustomers.has(key)) {
                    seenCustomers.add(key);
                    unconfirmedCustomers.push(
                      customer.customerName || "Unknown Customer"
                    );
                  }
                }
              });
            }

            // Check updatedCustomerSummaryData
            if (
              updatedCustomerSummaryData &&
              Array.isArray(updatedCustomerSummaryData)
            ) {
              updatedCustomerSummaryData.forEach((customer) => {
                if (customer.showInfoIcon) {
                  const key = `${customer.customerNo}-${customer.customerName || "Unknown Customer"
                    }`;
                  if (!seenCustomers.has(key)) {
                    seenCustomers.add(key);
                    unconfirmedCustomers.push(
                      customer.customerName || "Unknown Customer"
                    );
                  }
                }
              });
            }

            // If there are unconfirmed customers, show error and return
            if (unconfirmedCustomers.length > 0) {
              const customerList = unconfirmedCustomers.join(", ");
              errors.push({
                severity: "error",
                detail: `Please confirm the details for the following customers: ${customerList}`,
              });
            }

            if (errors.length) {
              const messages: Message[] = errors.map((err) => ({
                severity: err.severity,
                detail: err.detail,
              }));
              this.toasterService.showMultiple(messages);
              return;
            }

            // If no errors, proceed with contract modification
            this.contractModification(params, this.activeStep, false);
          } else {
            this.standardQuoteSvc?.changeDetectionForUpdate?.next(true);
            this.activeStep = params.activeStep;
            this.standardQuoteSvc.activeStep = this.activeStep;
            this.changeDetectorRef.detectChanges(); // Trigger change detection manually
            this.standardQuoteSvc.stepper.next(params);
          }
        } else {
          if (this.formData.productCode != "AFV") {
            if (this.formData?.physicalAsset?.length > 0) {
              if (this.formData?.physicalAsset?.[0]?.assetType) {
                // if (
                //   this.mode == "create" &&
                //   !this.keyInfoId &&
                //   this.formData.purposeofLoan == configure.LoanPurpose //"Personal"
                // ) {
                //   this.toasterService.showToaster({
                //     severity: "error",
                //     detail: "Please Open Key Information disclosure.",
                //   });
                // } else {
                //   if (!this.btnStatus) {
                //     this.contractCreation(params, false);
                //   } else {
                //     this.toasterService.showToaster({
                //       severity: "error",
                //       detail: "Please click on Calculate.",
                //     });
                //   }
                // }

                if (!this.btnStatus) {
                  if (sessionStorage.getItem("externalUserType") === "Internal" && !this.formData?.internalSalesperson) {
                    this.toasterService.showToaster({
                      severity: "error",
                      detail: "Internal Salesperson is required.",
                    });
                    return;
                  }
                  this.contractCreation(params, false);
                } else {
                  this.toasterService.showToaster({
                    severity: "error",
                    detail: "Please click on Calculate.",
                  });
                }
              } else {
                this.toasterService.showToaster({
                  severity: "error",
                  detail: "Please add Asset Type in Physical Asset.",
                });
              }
            } else {
              this.toasterService.showToaster({
                severity: "error",
                detail: "Please add an Asset.",
              });
            }
          } else {
            if (!this.btnStatus) {
              if (sessionStorage.getItem("externalUserType") === "Internal" && !this.formData?.internalSalesperson) {
                this.toasterService.showToaster({
                  severity: "error",
                  detail: "Internal Salesperson is required.",
                });
                return;
              }
              this.contractCreation(params, false);
            } else {
              this.toasterService.showToaster({
                severity: "error",
                detail: "Please click on Calculate.",
              });
            }
          }
        }
      }
      this.standardQuoteSvc.formStatusArr.length = 0;
    } else if (params.type === 'draft') {
      this.standardQuoteSvc.formStatusArr.length = 0;
      this.standardQuoteSvc?.stepper?.next({ activeStep: this.activeStep, validate: true });

      const statusInvalid = this.standardQuoteSvc.formStatusArr?.includes('INVALID');


      if (this?.formData?.productId && this?.formData?.programId) {
        if (this.formData?.productCode === "OL") {
          const term = this.formData?.term || this.formData?.terms || 0;
          const usefulLife = this.formData?.usefulLife || 0;

          if (term > usefulLife && usefulLife > 0) {
            this.toasterService.showToaster({
              severity: "error",
              detail: "Term cannot exceed useful life.",
            });
            return;
          }
        }

        if (!this.formData?.originatorReference) {
          this.commonSvc.dialogSvc
            .show(
              OriginatorReferenceComponent,
              'The below information is required to save this quote.',
              {
                templates: {
                  footer: null,
                },
                width: "55vw",
              }
            )
            .onClose.subscribe(async (data: any) => {
              if (data.btnType === 'saveBtn') {
                if (!this.btnStatus) {
                  if (sessionStorage.getItem("externalUserType") === "Internal" && !this.formData?.internalSalesperson) {
                    this.toasterService.showToaster({
                      severity: "error",
                      detail: "Internal Salesperson is required.",
                    });
                    return;
                  }
                  let res = await this.contractCreation(params, true);
                  if (res?.contractId) {
                    this.toasterService.showToaster({
                      severity: 'success',
                      detail: 'Contract Saved Successfully'
                    });
                    this.standardQuoteSvc.forceToClickCalculate.next(false);
                  }
                } else {
                  this.toasterService.showToaster({
                    severity: 'error',
                    detail: 'Please click on Calculate.'
                  });
                }
              }
            });
        }
        else {

          if (this.formData?.contractId) {

            const isDraft = this.formData?.isDraft;
            if (this.activeStep === 0) {
              this.standardQuoteSvc.isDocumentData.next(false);
              if (!this.btnStatus) {
                await this.contractModification(params, this.activeStep, isDraft);
                this.toasterService.showToaster({
                  severity: 'success',
                  detail: 'Contract Updated and Saved Successfully'
                });
              } else {
                this.toasterService.showToaster({
                  severity: 'error',
                  detail: 'Please click on Calculate.'
                });
              }
            } else if (this.activeStep === 1) {
              if (!this.btnStatus) {
                await this.contractModification(params, this.activeStep, isDraft);
                this.toasterService.showToaster({
                  severity: 'success',
                  detail: 'Contract Updated and Saved Successfully'
                });
              } else {
                this.toasterService.showToaster({
                  severity: 'error',
                  detail: 'Please click on Calculate.'
                });
              }
            } else {
              this.standardQuoteSvc?.changeDetectionForUpdate?.next(true);
              this.activeStep = params.activeStep;
              this.standardQuoteSvc.activeStep = this.activeStep;
              this.changeDetectorRef.detectChanges();
              this.standardQuoteSvc.stepper.next(params);
            }
          }

          else {
            if (!this.btnStatus) {
              if (sessionStorage.getItem("externalUserType") === "Internal" && !this.formData?.internalSalesperson) {
                this.toasterService.showToaster({
                  severity: "error",
                  detail: "Internal Salesperson is required.",
                });
                return;
              }
              let res = await this.contractCreation(params, true);
              if (res?.contractId) {
                this.toasterService.showToaster({
                  severity: 'success',
                  detail: 'Contract Saved Successfully'
                });
                this.standardQuoteSvc.forceToClickCalculate.next(false);
              }
            } else {
              this.toasterService.showToaster({
                severity: 'error',
                detail: 'Please click on Calculate.'
              });
            }
          }
        }
      } else {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'Make sure that Program, Product and Originator Reference is filled'
        });
      }

      this.standardQuoteSvc.formStatusArr.length = 0;
    }
    else if (params.type == "tabNav") {
      if (!this.formData.contractId || !this.hasAllMandatoryFields) {
        //console.log('inside if');
        return;
      }
      //console.log('ouytif');
      if (
        this.activeStep == 0 &&
        (params.activeStep == 1 || params.activeStep == 2)
      ) {
        if (this.btnStatus) {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Please click on Calculate.",
          });
          return;
        }
        if (params.activeStep == 1) {
          this.standardQuoteSvc.isDocumentData.next(false);
          await this.contractModification(params, this.activeStep, false);
        }
      }
      this.standardQuoteSvc?.stepper?.next({
        activeStep: this.activeStep,
      });

      if (this.formData?.contractId && params.activeStep == 2) {
        let documentsData = [];
        let generatedDocuments = [];
        try {
          let data = await this.commonSvc.data
            .get(
              `DocumentServices/documents?ContractId=${this.formData.contractId}&PageNo=1&PageSize=100`
            )
            .pipe(
              map((res) => {
                return res.items || [];
              })
            )
            .toPromise();
          // documentsData = data.filter((ele) => ele.source === 'Uploaded');
          generatedDocuments = data.filter((ele) => ele.source === "Generated");
          this.standardQuoteSvc.setBaseDealerFormData({
            // documentsData: documentsData,
            generatedDocuments: generatedDocuments,
          });
        } catch (error) {
          documentsData = [];
          generatedDocuments = [];
        }
      }

      if (this.activeStep == 1 && params.activeStep > this.activeStep) {
        let hell = this.formData?.customerSummary?.find((ele) => {
          return ele?.roleName == "Borrower";
        });

        if (!hell) {
          this.toasterService.showToaster({
            severity: "error",
            detail: "Add a borrower to proceed further.",
          });
          return;
        }

        const partnershipBorrower = this.formData?.customerSummary?.find(
          (customer: any) =>
            customer?.isPartnership === true &&
            customer?.customerRole === 1 && // Borrower
            customer?.customerType === "Business"
        );

        if (partnershipBorrower) {
          const coBorrowers = this.formData?.customerSummary?.filter(
            (customer: any) => customer?.customerRole === 2 // Co-borrower
          );

          if (!coBorrowers || coBorrowers.length !== 2) {
            this.toasterService.showToaster({
              severity: "error",
              detail: "There should be 2 co-borrowers required for partnership",
            });
            return;
          }
        }
      }

      this.activeStep = params.activeStep;
      this.standardQuoteSvc.activeStep = this.activeStep;
      this.changeDetectorRef.detectChanges(); // Trigger change detection manually
      this.standardQuoteSvc.stepper.next(params);
    } else {
      this.standardQuoteSvc?.changeDetectionForUpdate?.next(true);
      this.activeStep = params.activeStep;
      this.standardQuoteSvc.activeStep = this.activeStep;
      this.changeDetectorRef.detectChanges(); // Trigger change detection manually
      this.standardQuoteSvc.stepper.next(params);
    }

    if (this?.id && this.activeStep == 1) {
      this.formData.documentsData = [];
      this.formData.generatedDocuments = [];
      let documentsData = [];
      let generatedDocuments = [];
      let data = await this.standardQuoteSvc.getFormData(
        `DocumentServices/documents?ContractId=${this.id}&PageNo=1&PageSize=100`,
        function (res) {
          return res.items || [];
        }
      );
      documentsData = data?.filter((ele) => ele?.source === "Uploaded" || ele?.source === "e-Signature");
      generatedDocuments = data?.filter((ele) => ele.source === "Generated");
      this.standardQuoteSvc.setBaseDealerFormData({
        documentsData: documentsData,
        generatedDocuments: generatedDocuments,
      });
      this.standardQuoteSvc.isDocumentData.next(true);
    }
  }

  async contractModification(stepParams, currentStep, isDraft, isDataModified?: any) {
    if (currentStep < 2) {
      if (this.activeStep == 0) {
        this.standardQuoteSvc.isDocumentData.next(false);

        if (this.formData?.tradeInAssetRequest?.length > 0) {
          let tradesToValidate = this.formData.tradeInAssetRequest.filter(
            (ele) => ele.changeAction !== "delete"
          );
          let isEveryTradeValid = tradesToValidate?.every((ele) => {
            return (
              ele?.tradeAssetValue &&
              ele?.tradeYear &&
              ele?.tradeMake &&
              ele?.tradeModel &&
              (ele?.tradeRegoNo ||
                ele?.tradeVinNo ||
                ele?.tradeSerialOrChassisNo)
            );
          });

          if (!isEveryTradeValid) {
            this.toasterService.showToaster({
              severity: "error",
              detail: `Please fill required details for every trade!`,
            });
            return;
          }
        }
      }
      let activeStep = stepParams.activeStep;
      let res: any = await this.standardQuoteSvc?.contractModification(
        this.formData,
        isDraft,
        activeStep,
        isDataModified
      );
      if (res?.contractId) {
        this.standardQuoteSvc?.changeDetectionForUpdate?.next(true);
        this.activeStep = stepParams.activeStep;
        this.standardQuoteSvc.activeStep = this.activeStep;
        this.changeDetectorRef.detectChanges(); // Trigger change detection manually
        this.standardQuoteSvc.stepper.next(stepParams);
        await this.getState();
      }
    }
  }

  async putFormData(api: string, payload: any, params?: any) {
    return await this.commonSvc.data
      .put(api, payload, params)
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise();
  }

  async contractCreation(params, isDraft) {
    this.standardQuoteSvc.onDealerChange.next(false);

    this.standardQuoteSvc.setBaseDealerFormData({
      cashPriceValue: this.cashPrice,
    });

    if (params?.steps[0].label === "Asset Details" && this.mode != "edit") {
      if (
        this.formData?.physicalAsset?.length > 0 &&
        this.formData?.productCode != "AFV"
      ) {
        let isEveryAssetValid = this.formData?.physicalAsset?.every((ele) => {
          const assetTypeData = this.standardQuoteSvc.assetTypeData;
          const assetCategory = assetTypeData.find(
            (data) => data.assetTypeId === ele?.assetType?.assetTypeId
          )?.assetCategory;

          switch (assetCategory) {
            case "Plant":
              return (
                ele?.assetName &&
                ele?.make &&
                ele?.model &&
                ele?.year &&
                ele?.conditionOfGood &&
                //ele?.variant &&
                //ele?.serialChassisNumber &&
                ele?.costOfAsset
                //&&
                // ele?.insurer &&
                //ele?.engineNumber
                // ele?.countryFirstRegistered
              );

            case "Marine":
              return (
                ele?.assetName &&
                ele?.make &&
                ele?.model &&
                ele?.year &&
                ele?.conditionOfGood &&
                //ele?.variant &&
                // ele?.vin &&
                // ele?.serialChassisNumber &&
                ele?.costOfAsset
                // ele?.insurer &&
                // ele?.engineNumber
                // ele?.countryFirstRegistered
              );

            case "EV/Clean Tech":
              return (
                ele?.assetName &&
                ele?.make &&
                ele?.model &&
                ele?.year &&
                ele?.conditionOfGood &&
                //ele?.variant &&
                // ele?.vin &&
                // ele?.serialChassisNumber &&
                ele?.costOfAsset
                // ele?.insurer
                // ele?.countryFirstRegistered
              );
            case "Vehicle":
              return (
                ele?.assetName &&
                ele?.make &&
                ele?.model &&
                ele?.year &&
                ele?.conditionOfGood &&
                //ele?.variant &&
                //ele?.regoNumber &&
                // ele?.vin &&
                // ele?.serialChassisNumber &&
                ele?.costOfAsset //&&
                // ele?.insurer &&
                // ele?.engineNumber
                // ele?.countryFirstRegistered
              );

            default:
              return (
                ele?.assetName &&
                ele?.make &&
                ele?.model &&
                ele?.year &&
                ele?.conditionOfGood &&
                // ele?.variant &&
                //ele?.regoNumber &&
                // ele?.vin &&
                // ele?.serialChassisNumber &&
                ele?.costOfAsset
                //&&
                //ele?.insurer &&
                //ele?.engineNumber
                // ele?.countryFirstRegistered
              );
          }
        });

        if (!isDraft || isEveryAssetValid) {
          if (!isEveryAssetValid) {
            return this.toasterService.showToaster({
              severity: "error",
              detail: `Please fill required details for every physical asset!`,
            });
          }
        }

        // if (!isDraft || isEveryAssetValid) {
        //   if (
        //     //this.formData?.physicalAsset?.length == 1 &&
        //     this.formData?.physicalAsset[0].costOfAsset !=
        //     this.formData?.cashPriceValue
        //   ) {
        //     this.toasterService.showToaster({
        //       severity: "error",
        //       detail: `The total of all added asset values needs to match the asset’s cash price`,
        //     });
        //     return;
        //   }
        // }

        if (!isDraft || isEveryAssetValid) {
          let physicalAssets = this.formData?.physicalAsset;
          // Normalize to array if it's a single object
          if (physicalAssets && !Array.isArray(physicalAssets)) {
            physicalAssets = [physicalAssets];
          }
          const totalAssetCost = (physicalAssets || []).reduce((sum, asset) => {
            return sum + (Number(asset?.costOfAsset) || 0);
          }, 0);
          const cashPrice = Number(this.formData?.cashPriceValue) || 0;
          if (totalAssetCost !== cashPrice) {
            this.toasterService.showToaster({
              severity: "error",
              detail: `The total of all added asset values needs to match the asset’s cash price`,
            });
            return;
          }
        }
      }
      const allServicePlans = this.formData?.servicePlan || [];
      const servicePlan = allServicePlans.filter(
        (sp) => sp.name == "Service Plan"
      );
      const otherItemsObject = allServicePlans.filter(sp => sp.name === "Other Service Plan");
      const firstOtherId = otherItemsObject[0]?.id;
      const other = otherItemsObject.map(item => ({
        ...item,
        id: firstOtherId
      }));
      const newRegistration = this.formData?.registrations?.map((reg: any) => ({
        ...reg,
        name: "Registration"
      }));

      let request = {
        contractpartyRoles: this.formData?.salePersonDetails,
        PRCode: sessionStorage.getItem("productCode"),
        //contractpartyRole: this.formData?.contractpartyRole,
        // additionalFund: this.formData?.additionalFund || null,
        additionalFundType: this.formData?.additionalFundType || null,
        amoutFinanced: 0,
        asset: "",
        assetInsuranceAmount: 0,
        assetInsuranceMonths: 0,
        assetInsuranceName: "",
        assetInsuranceProvider: "",
        assetLocationOfUse:
          this.formData?.physicalAsset?.[0]?.assetLocationOfUse || "",
        //baseInterestRate: 0,
        baseInterestRate: this.formData?.baseInterestRate,
        marginRate: this.formData?.marginRate,
        calcDt: new Date().toISOString(),
        calculateSettlement: 0,
        cashDeposit: Number(this.formData?.deposit || 0).toFixed(2),
        conditionOfGood: "",
        countryFirstRegistered:
          this.formData?.physicalAsset?.[0]?.countryFirstRegistered ||
          "New Zealand",
        dealerOriginationFee: this.formData?.dealerOriginationFee || 0,
        deposit: Number(this.formData?.deposit || 0).toFixed(2),
        // establishmentFeeShare: this.formData?.establishmentFeeShares || 0,
        estimatedCommissionSubsidy: this.formData?.estimateCommissions || 0,
        extendedWarrantyMonth: 0,
        financialAssetInsurance: [], //this.formData?.financialAssetInsurance || [],
        financialAssetLease: {
          accessories: this.formData?.accessories || [],
          amtBaseRepayment: 0,
          amtFinancedTotal: 0,
          amtTotalInterest: 0,
          balloonAmount: this.formData?.balloonAmount || 0,
          balloonDate: new Date().toISOString(),
          // balloonDate: '2024-11-13T06:52:07.160Z',
          // ,
          balloonPct: this.formData?.balloonPct || 0,
          charges: 0,
          consumerCreditInsurance: this.formData?.contractAmount
            ? {
              amount: this.formData?.contractAmount || 0,
              months: String(this.formData?.contractMonths || 0),
              provider: this.formData?.contractProvider || "",
              customflowID:
                this.formData.financialAssetLease?.consumerCreditInsurance
                  ?.customflowID || 0,
            }
            : null,
          dealerOriginationFee: this.formData?.dealerOriginationFee || 0,
          establishmentFeeShare: 0,
          //establishmentFeeShare: this.formData?.establishmentFeeShare || 0,
          estimatedCommissionSubsidy: 0,
          extendedWarranty: this.formData?.extendedAmount
            ? {
              amount: this.formData?.extendedAmount || 0,
              months: String(this.formData?.extendedMonths || 0),
              provider: this.formData?.extendedProvider || "",
              customflowID:
                this.formData.financialAssetLease?.extendedWarranty
                  .customflowID || 0,
            }
            : null,
          fixed: this.formData?.fixed || false,
          guaranteeAssetProtection: this.formData
            ?.guaranteedAssetProtectionAmount
            ? {
              amount: this.formData?.guaranteedAssetProtectionAmount || 0,
              months: String(
                this.formData?.guaranteedAssetProtectionMonths || 0
              ),
              provider:
                this.formData?.guaranteedAssetProtectionProvider || "",
              customflowID:
                this.formData.financialAssetLease?.guaranteeAssetProtection
                  .customflowID || 0,
            }
            : null,
          interestCharge: 0,
          firstLeasePayment: 0, // For FL, OL
          firstLeasePaymentAmount: 0, // For OL
          lastLeasePayment: 0, // For FL
          totalNoofpaymnets: 0, // For FL
          isFixed: this.formData?.fixed || false,
          //loanMaintenanceFee: 0,
          numberofPayments: 0,
          matureDate: new Date().toISOString(),
          mechanicalBreakdownInsurance: this.formData
            ?.mechanicalBreakdownInsuranceAmount
            ? {
              months: String(
                this.formData?.mechanicalBreakdownInsuranceMonths || 0
              ),
              amount: this.formData?.mechanicalBreakdownInsuranceAmount || 0,
              provider:
                this.formData?.mechanicalBreakdownInsuranceProvider || "",
              customflowID:
                this.formData.financialAssetLease
                  ?.mechanicalBreakdownInsurance.customflowID || 0,
            }
            : null,
          motorVehicleInsurance: this.formData?.motorVehicalInsuranceAmount
            ? {
              months: String(this.formData?.motorVehicalInsuranceMonths || 0),
              amount: this.formData?.motorVehicalInsuranceAmount || 0,
              provider: this.formData?.motorVehicalInsuranceProvider || "",
              customflowID:
                this.formData.financialAssetLease?.motorVehicleInsurance
                  .customflowID || 0,
            }
            : null,
          netTradeAmount: 0,
          paymentAmount: this.formData?.paymentAmount || 0,
          paymentSchedule: 0,
          registrations: newRegistration || [],
          residualValue: this.formData?.residualValue || 0,
          pctResidualValue: this.formData?.pctResidualValue || 0,
          servicePlan: servicePlan || [],
          other: other || [],
          settlementAmount: this.formData?.settlementAmount || 0,
          startDate: String(
            this.formData?.loanDate || new Date().toISOString()
          ),
          // subTotalAddOns:
          //   (this.formData?.subTotalServicePlanValue || 0) +
          //   (this.formData?.subTotalInsuranceRequirementValue || 0) +
          //   (this.formData?.subTotalAccesoriesValue || 0),
          term: this.formData?.term || this.formData?.terms,
          totalAmountBorrowed: 0,
          totalAmountBorrowedIncGST: 0,
          totalAmtFinancedTax: 0,
          totalCost: this.formData?.retailPriceValue || 0,
          totalEstablishmentFee: this.formData?.totalEstablishmentFee || 0,
          totalInterest: 0,
          tradeAmount: this.formData?.tradeAmountPrice || 0,
          udcEstablishmentFee: this.formData?.udcEstablishmentFee || 0,
          financialAssetPriceSegments: this.standardQuoteSvc?.mapPriceSegments(
            this.formData?.productCode === "OL" ? "update" : "preview",
            this?.formData?.financialAssetPriceSegments,
            null,
            this?.formData
          ),
          ...(this.formData?.productCode === "TL" && {
            additionalFund: this.formData?.additionalFund,
          }),
          //  additionalFund:this.formData?.additionalFund
          privateSale: Boolean(this.formData?.privateSales && this.formData?.privateSales !== '0') || false,
        },
        financialAssets: this.getFinancialAsset(),
        firstPaymentDate: String(this.formData?.firstPaymentDate) || "",
        frequency: this.formData?.frequency,
        inclOfGST: 0,
        insurer: "",
        interestRate: this.formData?.interestRate || 0,
        isDraft: isDraft,
        lastPayment: "",
        loanAmount: 0,
        loanDate: String(this.formData?.loanDate || new Date().toISOString()),
        loanMaintenanceFee: this.formData?.loanMaintenceFee || 0,
        location: {
          extName: "New Zealand",
          locationId: 176,
          locationType: "Country",
        },
        mechanicalBreakdownMonth: 0,
        motivePower: "",
        netTradeAmount: 0,
        // originatorName: this.formData?.originatorName || 'Dealer C',
        // originatorNumber: String(this.formData?.originatorNumber || 11769),
        originatorNumber: this.formData?.originatorNumber,
        originatorReference: this.formData?.originatorReference || this.formData?.originatorReferencee,
        paymentStructure: this.formData?.paymentStructure || "None",
        ppsrCount: this.formData?.ppsrCount || 0,
        ppsrPercentage: Number(this.formData?.ppsrPercentage || 0),
        ppsrPercentageId: this.formData?.ppsrPercentageId || 0,
        product: {
          productId: this.formData?.productId,
          productCode: this.formData?.productCode,
          extName: this.formData?.productExtName,
        },
        program: {
          programId: this.formData?.programId,
          programCode: this.formData?.programCode,
          lookupName:
            this.formData?.programId + "-" + this.formData?.programExtName,
          extName: this.formData?.programExtName,
        },
        operatingUnit: {
          partyNo: this.formData?.operatingUnit?.partyNo || 10012,
          extName: this.formData?.operatingUnit?.extName || "MV Dealer",
        },
        promotionQuote: String(this.formData?.promotionQuote ?? ""),
        purposeofLoan: this.formData?.purposeofLoan || "",
        quoteType: "",
        regoVIN: "",
        //salesPerson: this.formData?.contractpartyRoles?.party?.extName || '',
        servicePlanMonths: 0,
        settlementAmount: this.formData?.settlementAmount || 0,
        supplierName: "",
        taxProfile: this.formData?.taxProfile,
        totalAmountBorrowed: 0,
        totalTermDays: 0,
        totalTermMonths: 0,
        totalAmountToRepay: String(0), // AFV
        kmAllowance: String(this.formData?.kmAllowance || ""), // AFV
        tradeAmount: this.formData?.tradeAmountPrice || 0,
        tradeInAssetRequest: this.formData?.tradeInAssetRequest || [],
        udcEstablishmentFee: this.formData?.udcEstablishmentFee,
        noOfRentalsInAdvance: Number(this.formData?.noOfRentalsInAdvance || 0),
        usageands: [
          {
            // OL
            usageUnit: this.formData?.usageUnit || "",
            excessUsageAllowance: this.formData?.excessUsageAllowance
              ? String(this.formData?.excessUsageAllowance)
              : null,
            excessUsageAllowancePercentage: this.formData
              ?.excessUsageAllowancePercentage
              ? String(this.formData?.excessUsageAllowancePercentage)
              : null,
            excessUsageCharge: this.formData?.excessUsageCharge
              ? String(this.formData?.excessUsageCharge)
              : null,
            rebateAmount: this.formData?.rebateAmount
              ? String(this.formData?.rebateAmount)
              : null,
            totalRebateAllowance: this.formData?.totalRebateAllowance
              ? String(this.formData?.totalRebateAllowance)
              : null,
            totalRebateAllowancePercent: this.formData
              ?.totalRebateAllowancePercent
              ? String(this.formData?.totalRebateAllowancePercent)
              : null,
            totalUsageAllowance: this.formData?.totalUsageAllowance
              ? String(this.formData?.totalUsageAllowance)
              : null,
            usageAllowance: this.formData?.usageAllowance
              ? String(this.formData?.usageAllowance)
              : null,
          },
        ],
        termMonthAndDays: this.formData?.term
          ? this.formData?.term + " months"
          : "null", // OL
        value: "0",
        variant: "Car",
        weiveLMF: this.formData?.weiveLMF,
        isStructured: this.formData?.productCode == "AFV" ? false : true,
        // usefulLife: this.formData?.usefulLife ? Math.round(Number(this.formData.usefulLife)) : null,
        // For FL

        totalMaintenanceHdrId: 0,
        totalMaintenanceAmount: this.formData?.maintainanceCost,
        financedMaintenanceHdrId: 0,
        financedMaintenanceAmount: this.formData?.financedMaintainanceCharge,
        tracksorTyres: this.formData?.tracksorTyres
          ? String(this.formData?.tracksorTyres)
          : "",
        serviceAgent: this.formData?.serviceAgent,
        maintenanceRequirement: this.formData?.maintenanceRequirement,
        isTaxInclusive: this.formData?.isTaxinclusive || false,

        internalSalespersonParty:
          (sessionStorage.getItem("externalUserType") == "Internal")
            ? {
              contractPartyId: 0,
              customerId: this.formData?.internalSalesperson,
              customerNo: 0,
              customerRole: "Salesperson",
            }
            : null,
      };

      let res = await this.commonSvc.data
        .post("Contract/create_contract", request)
        .pipe(
          map(async (res) => {
            if (!res?.data?.contractId) {
            }

            // if (this.keyInfoId && res?.data?.contractId) {
            //   let dataApi = {
            //     // DealerId: '',
            //     MessageID: this.keyInfoId,
            //     QuoteId: res?.data?.contractId,
            //     IsActive: 1,
            //   };
            //   await this.commonSvc.data
            //     ?.post(
            //       `Declaration/save_acceptance_message?MessageID=${this.keyInfoId}&QuoteId=${res?.data?.contractId}&IsActive=1`,
            //       ""
            //     )
            //     ?.pipe(
            //       map(async (res) => {
            //         this.toasterService.showToaster({
            //           severity: "success",
            //           detail: `Key Information Disclosure Added Successfully!`,
            //         });
            //       })
            //     )
            //     .toPromise();
            // }

            return res?.data;
          })
        )
        .toPromise();

      if (res?.contractId) {
        this.standardQuoteSvc.isAssetTrade = false;
        if (this.formData?.physicalAsset?.length > 1) {
          await this.standardQuoteSvc?.splitAsset(
            this.formData?.physicalAsset,
            res?.financialAssets?.[0]?.physicalAsset,
            this.formData,
            res?.contractId
          );
        }
        if (this.formData?.isDealerChange) {
          sessionStorage.setItem("dealerPartyNumber", res?.originatorNumber);
          sessionStorage.setItem("dealerPartyName", res?.originatorName);
          this.formData.isDealerChange = false;
        }
        await this.callContractUpdateAfterCreate(
          res,
          request?.operatingUnit,
          params
        );
      }
      return res;
    }
  }

  async callContractUpdateAfterCreate(createRes, operatingUnit, params) {
    this.standardQuoteSvc.onDealerChange.next(false);
    const servicePlanList = createRes?.financialAssetLease?.servicePlan || [];
    const otherServicePlanList = createRes?.financialAssetLease?.others || [];
    let request = {
      contractId: createRes?.contractId,
      contractEtag: this.stoteSvc.getItem("contractEtag"),
      PRCode: sessionStorage.getItem("productCode"),
      deposit: Number(this.formData?.deposit || 0).toFixed(2),
      countryFirstRegistered: createRes?.countryFirstRegistered,
      financialAssetInsurance: [],
      brandName:
        this?.formData?.defaultAsset?.[0]?.IsDefault == false
          ? this?.formData?.defaultAsset?.[0]?.BrandName
          : undefined,
      financialAssets: [
        {
          ...createRes?.financialAssets?.[0],
          cashDeposit: Number(Number(this.formData?.deposit || 0).toFixed(2)),
          assetLeased: undefined,
          isInputAsPercent: false,
          physicalAsset: {
            ...createRes?.financialAssets?.[0]?.physicalAsset,
            assetLeased:
              createRes?.financialAssets?.[0]?.physicalAsset?.assetLeased ===
                "true"
                ? "1"
                : "0",
          },
        },
      ],
      financialAssetLease: {
        servicePlan: servicePlanList,
        others: otherServicePlanList,
        registrations: this.formData?.registrations?.map((ele, index) => ({
          ...ele,
          name: "Registration",
          customflowID:
            createRes?.financialAssetLease?.registrations?.[index]
              ?.customflowID || 0,
        })),
        consumerCreditInsurance: this.formData?.contractAmount
          ? {
            amount: this.formData?.contractAmount || 0,
            months: String(this.formData?.contractMonths || 0),
            provider: this.formData?.contractProvider || "",
            customFlowID:
              createRes?.financialAssetLease?.consumerCreditInsurance
                ?.customFlowID || 0,
          }
          : null,
        extendedWarranty: this.formData?.extendedAmount
          ? {
            amount: this.formData?.extendedAmount || 0,
            months: String(this.formData?.extendedMonths || 0),
            provider: this.formData?.extendedProvider || "",
            customFlowID:
              createRes?.financialAssetLease?.extendedWarranty
                ?.customFlowID || 0,
          }
          : null,
        guaranteeAssetProtection: this.formData?.guaranteedAssetProtectionAmount
          ? {
            amount: this.formData?.guaranteedAssetProtectionAmount || 0,
            months: String(
              this.formData?.guaranteedAssetProtectionMonths || 0
            ),
            provider: this.formData?.guaranteedAssetProtectionProvider || "",
            customFlowID:
              createRes?.financialAssetLease?.guaranteeAssetProtection
                ?.customFlowID || 0,
          }
          : null,
        mechanicalBreakdownInsurance: this.formData
          ?.mechanicalBreakdownInsuranceAmount
          ? {
            months: String(
              this.formData?.mechanicalBreakdownInsuranceMonths || 0
            ),
            amount: this.formData?.mechanicalBreakdownInsuranceAmount || 0,
            provider:
              this.formData?.mechanicalBreakdownInsuranceProvider || "",
            customFlowID:
              createRes?.financialAssetLease?.mechanicalBreakdownInsurance
                ?.customFlowID || 0,
          }
          : null,
        motorVehicleInsurance: this.formData?.motorVehicalInsuranceAmount
          ? {
            months: String(this.formData?.motorVehicalInsuranceMonths || 0),
            amount: this.formData?.motorVehicalInsuranceAmount || 0,
            provider: this.formData?.motorVehicalInsuranceProvider || "",
            customFlowID:
              createRes?.financialAssetLease?.motorVehicleInsurance
                ?.customFlowID || 0,
          }
          : null,

        //added new fields
        residualValue: this.formData?.residualValue || 0,
        pctResidualValue: this.formData?.pctResidualValue || 0,
        privateSale: Boolean(this.formData?.privateSales && this.formData?.privateSales !== '0') || false,
      },
      isDraft: createRes?.isDraft,
      location: createRes?.location,
      operatingUnit: {
        partyNo: operatingUnit?.partyNo,
        extName: operatingUnit?.extName,
      },
      ppsrPercentage: 0,
      product: createRes?.product,
      program: createRes?.program,
      taxProfile: createRes?.taxProfile,
      isDealerChange: false,
      weiveLMF: this.formData?.weiveLMF,
      loanMaintenanceFee: this.formData?.loanMaintenceFee,
      preferredDeliveryMethod: this.formData?.preferredDeliveryMethod || null,
     
      totalMaintenanceHdrId: createRes?.totalMaintenanceHdrId || 0,
      totalMaintenanceAmount: this.formData?.maintainanceCost,
      financedMaintenanceHdrId: createRes?.financedMaintenanceHdrId || 0,
      financedMaintenanceAmount: this.formData?.financedMaintainanceCharge,
      tracksorTyres: this.formData?.tracksorTyres
        ? String(this.formData?.tracksorTyres)
        : "",
      serviceAgent: this.formData?.serviceAgent,
      maintenanceRequirement: this.formData?.maintenanceRequirement,
      isTaxInclusive: this.formData?.isTaxinclusive,
      internalSalespersonParty:
        (sessionStorage.getItem("externalUserType") == "Internal")
          ? {
            contractPartyId: 0,
            customerId: this.formData?.internalSalesperson,
            customerNo: 0,
            customerRole: "Salesperson",
          }
          : null,
    };

    let updateRes = await this.commonSvc.data
      .put(
        `Contract/update_contract?ContractId=${createRes?.contractId}`,
        request
      )
      .pipe(
        map((res) => {

          // this.standardQuoteSvc.updateFieldValuesFromApi(res?.data);
          return res.data;
        })
      )
      .toPromise();
    let purposeofLoans = this.formData?.purposeofLoan;

    if (updateRes?.contractId) {
      this.router.navigate([
        `/dealer/standard-quote/create/${updateRes?.contractId}`
      ], {replaceUrl:true});
      let dataMapped = this.standardQuoteSvc?.mapConfigData(updateRes);

      this.standardQuoteSvc.setBaseDealerFormData({
        ...updateRes,
        ...dataMapped,
        purposeofLoan: purposeofLoans,
      });


      this.standardQuoteSvc.contractId = updateRes?.contractId;
      this.standardQuoteSvc?.changeDetectionForUpdate?.next(true);
      this.activeStep = params.activeStep;
      this.standardQuoteSvc.activeStep = this.activeStep;
      this.changeDetectorRef.detectChanges(); // Trigger change detection manually
      this.standardQuoteSvc.stepper.next(params);
      this?.standardQuoteSvc?.forceCalculateBeforeSchedule.next(false);
      this.formData.contractId = updateRes?.contractId;
      await this.getState();
      await this.standardQuoteSvc.brokerDetails(
        this.formData,
        createRes?.financialAssetInsurance?.[0]?.assetHdrId,
        createRes?.financialAssetInsurance?.[0]?.insurerhdrId
      );

      if (
        updateRes?.financialAssets?.[0]?.physicalAsset?.childPhysicalAssetItems
          ?.length &&
        this.tradeSvc.assetList?.length
      ) {
        this.tradeSvc.assetList = this.tradeSvc.assetList.map((item, index) => {
          const updateItem =
            updateRes.financialAssets[0].physicalAsset.childPhysicalAssetItems[
            index
            ];
          return {
            ...item,
            vehicleClassId: updateItem?.vehicle?.assetClassId ?? null,
          };
        });
        this.tradeSvc.assetListSubject.next(this.tradeSvc.assetList);
      }
    } else {
      let dataMapped = this.standardQuoteSvc?.mapConfigData(createRes);
      this.standardQuoteSvc.setBaseDealerFormData({
        ...createRes,
        ...dataMapped,
        contractId: createRes?.contractId,
        purposeofLoan: purposeofLoans,
      });
      this.standardQuoteSvc?.changeDetectionForUpdate?.next(true);
      this.activeStep = params.activeStep;
      this.standardQuoteSvc.activeStep = this.activeStep;
      this.changeDetectorRef.detectChanges(); // Trigger change detection manually
      this.standardQuoteSvc.stepper.next(params);
      this?.standardQuoteSvc?.forceCalculateBeforeSchedule.next(false);
      await this.getState();
      await this.standardQuoteSvc.brokerDetails(
        this.formData,
        createRes?.financialAssetInsurance?.[0]?.assetHdrId,
        createRes?.financialAssetInsurance?.[0]?.insurerhdrId
      );
    }

    if (updateRes?.financialAssetInsurance) {
      let insuranceList = [];
      if (
        updateRes?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems
          ?.length
      ) {
        updateRes?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems.forEach(
          (child) => {
            if (child.insurancesDetails?.length) {
              insuranceList.push(
                ...child.insurancesDetails.map((item) => ({
                  broker: item?.brokerName || "",
                  //currency: item.currency || { id: 105, name: 'New Zealand Dollar' },
                  assetHdrInsuranceId: item?.assetHdrInsuranceId,
                  insurer: item?.insuranceParty?.extName,
                  partyNo: item?.insuranceParty.partyNo || "",
                  partyId: item?.insuranceParty.partyNo || 0,
                  policyExpiryDate: item?.expiryDt || null,
                  policyNumber: item?.policyNumber || "",
                  sumInsured: item?.sumInsured || 0,
                }))
              );
            }
            // this.tradeSvc.insuranceList = insuranceList;
            //this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
            //console.log(insuranceList,'insuranceListinsuranceList');
          }
        );
      }
      this.tradeSvc.insuranceList = insuranceList;
      this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
      // console.log(insuranceList, "insuranceListinsuranceList");
      // await this.brokerDetails(
      //   formData,
      //   formData?.financialAssetInsurance?.[0]?.assetHdrId,
      //   formData?.financialAssetInsurance?.[0]?.insurerhdrId
      // );
    }

    if (
      updateRes?.financialAssetInsurance &&
      updateRes?.financialAssets[0]?.physicalAsset?.childPhysicalAssetItems
        ?.length == 0
    ) {
      let insuranceList = [];

      const physicalAsset = updateRes?.financialAssets?.[0]?.physicalAsset;

      if (physicalAsset) {
        const insurance = physicalAsset?.insuranceDetails;

        if (insurance) {
          insuranceList.push({
            broker: insurance?.broker || "",
            assetHdrInsuranceId: insurance?.assetHdrInsuranceId || null,
            insurer: insurance?.insuranceParty?.extName || "",
            partyNo: insurance?.insuranceParty?.partyNo || "",
            partyId: insurance?.insuranceParty?.partyId || 0,
            policyExpiryDate: insurance?.policyExpiryDate || null,
            policyNumber: insurance?.policyNumber || "",
            sumInsured: insurance?.sumInsured || 0,
          });
        }
      }

      this.tradeSvc.insuranceList = insuranceList;
      this.tradeSvc.insuranceListSubject.next(this.tradeSvc.insuranceList);
      await this.standardQuoteSvc.brokerDetails(
        this.formData,
        updateRes?.financialAssetInsurance?.[0]?.assetHdrId,
        updateRes?.financialAssetInsurance?.[0]?.insurerhdrId
      );
    }
  }

  getFinancialAsset(
    finId?: any,
    phyId?: any,
    vehicleId?: any,
    cashDepositId?: any,
    udcEstablishmentFeeId?: any,
    dealerOriginationFeeId?: any
  ) {
    let financialAsset = [];
    if (this.formData?.productCode == "AFV") {
      let obj: FinancialAsset = {
        id: finId || 0,
        amtFinancedTotal: 0,
        assetDescription: "",
        assetId: finId || 0,
        assetName: this.formData?.assetTypeDD,
        assetType: {
          assetTypeId: this.formData?.assetTypeId || 0,
          assetTypePath: this.formData?.assetTypeModalValues || "",
          assetTypeName: this.formData?.assetTypeDD || "",
        },
        cashPriceofAnAsset: this.formData?.cashPriceValue || 0,
        colour: "",
        condition: this.formData?.conditionDD,
        cost:
          this.formData?.cashPriceValue ||
          this.formData?.cashPriceFinanceLease ||
          0,
        serialNo: "",
        taxesAmt: 0,
        yearOfManufacture: this.formData?.afvYear,
        //assetLeased: "0",
        physicalAsset: {
          id: phyId || 0,
          assetId: null,
          assetName: this.formData?.assetTypeDD,
          assetType: {
            assetTypeId: this.formData?.assetTypeId || 0,
            assetTypePath: this.formData?.assetTypeModalValues || "",
            assetTypeName: this.formData?.assetTypeDD || "",
          },
          assetTypes: {
            assetTypeId: this.formData?.assetTypeId || 0,
            assetTypePath: this.formData?.assetTypeModalValues || "",
            assetTypeName: this.formData?.assetTypeDD || "",
          },
          make: this.formData?.afvMake || "",
          model: this.formData?.afvModel || "",
          category: "",
          bodyInfo: "",
          year: this.formData.afvYear || 0,
          conditionOfGood: "",
          variant: this.formData?.afvVariant || "",
          regoNumber: "",
          vin: "",
          odometer: 0,
          serialChassisNumber: "",
          costOfAsset: this.formData?.cashPriceValue || 0,
          ccRating: "",
          engineNumber: "",
          motivePower: "",
          chassisNumber: "",
          assetLocationOfUse: "",
          vehicle: {
            assetClassId: vehicleId || 0,
          },
          features: this.formData?.features,
          description: this.formData?.description,
        },
      };
      financialAsset.push(obj);
      return financialAsset;
      // }
    }
    if (!this.formData?.assetTypeDD) {
      return [];
    }
    if (this.formData?.physicalAsset?.length > 0) {
      let obj: any = {
        id: finId || 0,
        amtFinancedTotal: 0,
        assetDescription: "",
        assetId: finId || 0,
        assetName: this.formData?.assetTypeDD,
        assetType: {
          assetTypeId: this.formData?.assetTypeId || 0,
          assetTypePath: this.formData?.assetTypeModalValues || "",
          assetTypeName: this.formData?.assetTypeDD || "",
        },
        cashPriceofAnAsset: this.formData?.cashPriceValue || 0,
        condition: this.formData?.conditionDD,
        cost:
          this.formData?.cashPriceValue ||
          this.formData?.cashPriceFinanceLease ||
          0,
        serialNo: "",
        taxesAmt: 0,
        cashDeposit: this.formData?.deposit || 0,
        cashDepositId: cashDepositId, //get
        udcEstablishmentFee: this.formData?.udcEstablishmentFee || 0, /// when we create the contarct in resposne
        udcEstablishmentFeeId: udcEstablishmentFeeId, // id get
        dealerOriginationFee: this.formData?.dealerOriginationFee || 0,
        dealerOriginationFeeId: dealerOriginationFeeId,
        isInputAsPercent: false,
        features: this.formData?.features,
        description: this.formData?.description,
        assetLeased: this.formData?.assetLeased ? "1" : "0",
      };
      if (this.formData?.physicalAsset?.length == 1) {
        let phyAsset = this.formData?.physicalAsset?.[0];
        obj = {
          ...obj,
          yearOfManufacture: phyAsset?.year,
          // assetLeased: phyAsset?.assetLeased ? "1" : "0",
          colour: phyAsset?.colour,
          physicalAsset: {
            id: phyId || 0,
            assetId: null,
            assetName: phyAsset?.assetName,
            assetType: phyAsset?.assetType,
            assetTypes: phyAsset?.assetType,
            make: phyAsset?.make || "",
            model: phyAsset?.model || "",
            category: phyAsset?.category || "", //
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
              assetClassId: vehicleId || 0,
              colour: phyAsset?.colour || "",
              odometer: phyAsset?.odometer || 0,
            },
            insuranceDetails:
              this.formData?.financialAssetInsurance[0]?.insurer != ""
                ? {
                  assetHdrInsuranceId: 0,
                  insuranceParty: {
                    partyNo:
                      this.formData?.financialAssetInsurance[0]?.partyId || 0,
                  },
                  broker:
                    this.formData?.financialAssetInsurance[0]?.broker || "",
                  sumInsured:
                    this.formData?.financialAssetInsurance[0]?.sumInsured ??
                    0,
                  policyNumber:
                    this.formData?.financialAssetInsurance[0]?.policyNumber ||
                    "",
                  policyExpiryDate:
                    this.formData?.financialAssetInsurance[0]
                      ?.policyExpiryDate || null,
                  phonecode:
                    this.formData?.financialAssetInsurance[0]?.phoneCode ||
                    "",
                  mobileNumber:
                    this.formData?.financialAssetInsurance[0]?.localNumber ||
                    "",
                  email:
                    this.formData?.financialAssetInsurance[0]?.email || "",
                }
                : null,
            features: phyAsset?.features,
            description: phyAsset?.description,
            assetLeased: phyAsset?.assetLeased ? "1" : "0",
          },
        };
        financialAsset.push(obj);
      } else {
        let phyAssetArr = this.formData?.physicalAsset;

        obj = {
          ...obj,
          // yearOfManufacture: phyAsset?.year,
          // assetLeased: phyAsset?.assetLeased ? '1' : '0',
          // colour: phyAsset?.colour,
          physicalAsset: {
            id: phyId || 0,
            assetId: null,
            assetName: this.formData?.assetTypeDD,
            assetType: {
              assetTypeId: this.formData?.assetTypeId || 0,
              assetTypePath: this.formData?.assetTypeModalValues || "",
              assetTypeName: this.formData?.assetTypeDD || "",
            },
            assetTypes: {
              assetTypeId: this.formData?.assetTypeId || 0,
              assetTypePath: this.formData?.assetTypeModalValues || "",
              assetTypeName: this.formData?.assetTypeDD || "",
            },
            // make: phyAsset?.make || '',
            // model: phyAsset?.model || '',
            // category: phyAsset?.category || '',
            bodyInfo: "",
            // year: phyAsset?.year,
            // conditionOfGood: phyAsset?.conditionOfGood || '',
            // variant: phyAsset?.variant || '',
            // regoNumber: phyAsset?.regoNumber || '',
            // vin: phyAsset?.vin || '',
            // odometer: phyAsset?.odometer || 0,
            // serialChassisNumber: phyAsset?.serialChassisNumber || '',
            costOfAsset:
              phyAssetArr?.reduce((sum, ele) => sum + ele?.costOfAsset, 0) || 0,
            // ccRating: phyAsset?.ccRating || '',
            // engineNumber: phyAsset?.engineNumber || '',
            // motivePower: phyAsset?.motivePower || '',
            // chassisNumber: phyAsset?.serialChassisNumber || '',
            // assetLocationOfUse: phyAsset?.assetLocationOfUse || '',
            vehicle: {
              assetClassId: vehicleId || 0,
              // colour: phyAsset?.colour || '',
              // odometer: phyAsset?.odometer || 0,
            },
          },
        };
        financialAsset.push(obj);
      }
      // });
    } else {
      let obj: FinancialAsset = {
        id: 0,
        amtFinancedTotal: 0,
        assetDescription: "",
        assetId: 0,
        assetName: this.formData?.assetTypeDD,
        assetType: {
          assetTypeId: this.formData?.assetTypeId || 0,
          assetTypePath: this.formData?.assetTypeModalValues || "",
          assetTypeName: this.formData?.assetTypeDD || "",
        },
        cashPriceofAnAsset: this.formData?.cashPriceValue || 0,
        colour: "",
        condition: this.formData?.conditionDD,
        cost: this.formData?.cashPriceValue || 0,
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

  cancel() {
    // todo
    this.commonSvc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Cancel Quote",
      () => {
        this.tradeSvc.resetData();
        this.commonSvc.router.navigateByUrl("/dealer/dashboard");
        this.standardQuoteSvc.resetBaseDealerFormData();
        this.standardQuoteSvc.activeStep = 0;
        this.standardQuoteSvc.onLoanPurposeChange.next(null);
      }
    ); // Ensure the event is passed here
  }

  resetDataOnchangeDealer() {
    this.tradeSvc.resetData();

    this.standardQuoteSvc.resetBaseDealerFormData();
    this.standardQuoteSvc.activeStep = 0;
    this.activeStep = 0;
    this.standardQuoteSvc.showResult = false;
    // this.formData.reset()

    this.individualSvc.resetBaseDealerFormData();

    this.individualSvc.role = 0;
    this.quickquoteService.quickQuoteData = [];

    this.businessSvc.resetBaseDealerFormData();
    this.businessSvc.role = 0;

    this.soleTradeSvc.resetBaseDealerFormData();
    this.soleTradeSvc.role = 0;

    this.trustSvc.resetBaseDealerFormData();
    // if (this.standardQuoteSvc.individualDataSubject) {
    this.standardQuoteSvc.individualDataSubject.unsubscribe();
    // }
    this.assetTradeSvc.resetData();
    this.quickquoteService.resetData();
    this.trustSvc.role = 0;

    this.router.navigateByUrl("/dealer");
    this.standardQuoteSvc.onDealerChange.next(false);
  }
}
