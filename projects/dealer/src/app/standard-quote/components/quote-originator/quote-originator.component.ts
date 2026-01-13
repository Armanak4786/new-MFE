import { ChangeDetectorRef, Component, effect, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import {
  CloseDialogData,
  CommonService,
  DataService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import configure from "../../../../../public/assets/configure.json";
import { QuickQuoteService } from "../../../quick-quote/services/quick-quote.service";
import { catchError, map, of, takeUntil } from "rxjs";
import { AssetTradeSummaryService } from "../asset-insurance-summary/asset-trade.service";
import { Message } from "primeng/api";
import { DealerUdcDeclarationComponent } from "../dealer-udc-declaration/dealer-udc-declaration.component";
import { FinalConfirmationComponent } from "../final-confirmation/final-confirmation.component";
import { IndividualService } from "../../../individual/services/individual.service";
import { BusinessService } from "../../../business/services/business";
import { TrustService } from "../../../trust/services/trust.service";
import { SoleTradeService } from "../../../sole-trade/services/sole-trade.service";

@Component({
  selector: "app-quote-originator",
  templateUrl: "./quote-originator.component.html",
  styleUrls: ["./quote-originator.component.scss"],
})
export class QuoteOriginatorComponent extends BaseStandardQuoteClass {
  override title: string = "Quote Originator";
  programList?: any[];
  programsList: { programId: number; name: string }[] = [];
  productCode: any;
  orginatorName: any = [];
  sessionProductCode: string;
  salePersonData: any;
  loanPurpose: any;
  ppsrRate: any;
  pageCode: string = "StandardQuoteComponent";
  modelName: string = "QuoteOriginatorComponent";
  promotionQuote: boolean = false;
  productList: any = [];
  productProgramList: any;
  originalDealerId: any;
  oldLoanPurpose: any;
  showWithdrawDialog: boolean = false;

  workflowOptions: any[] = [];
  selectedAsset: any;
  selectedAssetOption: any = null;
  showLoanPastDialog = false;
  selectedPastLoanDate?: Date;
  clickCalculateError: boolean;
  private promotionalCheckDone: boolean = false;

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    headerTitle: "",
    cardBgColor: "--surface-a",
    autoResponsive: true,
    api: "quoteOriginator",
    goBackRoute: "quoteOriginator",

    fields: [
      {
        type: "checkbox",
        label: "Promotion Quote",
        name: "promotionQuote",
        cols: 2,
        className: "mr-auto",
      },
      {
        type: "checkbox",
        label: "Private Sales",
        name: "privateSales",
        cols: 3,
        className: "-ml-8 mr-auto",
        hidden: true,
        default: false,
      },
      {
        type: "phone",
        label: "Quote ID: ",
        name: "contractId",
        className: "lg:col-offset pb-0 ml-auto width-9",
        // cols: 2,
        inputType: "horizontal",
        labelClass: "col text-right mr-0 px-0",
        styleType: "labelType",
        inputClass: "mr-1 -my-1 col-1 pl-0",
        hidden: true,
        mode: Mode.view,
      },
      // {
      //   type: "text",
      //   label: "Status : ",
      //   name: "workFlowStatus",
      //   cols: 2,
      //   inputType: "horizontal",
      //   labelClass: "col-4 mt-2 pl-2 text-center pr-0 pb-0 text-white",
      //   inputClass: "col pr-2 pl-0 pb-0 text-white",
      //   className: "status pt-0 pb-2",
      //   // default: 'Open',
      //   disabled: true,
      //   nextLine: true,
      // },

      // {
      //   type: "text",
      //   label: "Status : ",
      //   name: "workFlowStatus",
      //   cols: 2,
      //   inputType: "horizontal",
      //   labelClass: "col-4 pl-2 pr-0 text-center  text-white",
      //   inputClass: "col-8 pr-2 pl-0 text-white text-center",
      //   className: "status",
      //   // default: 'Open',
      //   mode: Mode.label,
      //   disabled: true,
      //   nextLine: true,
      // },
      // {
      //   type: "text-select",
      //   // placeholder: "Asset Type",
      //   name: "workFlowStatus",
      //   label: "Status :",
      //   cols: 2,
      //   nextLine: true,
      //   // className: "",
      //   // labelClass: "w-8",
      //   // inputClass: "w-7",
      //   // //validators: [Validators.required], // validation Comment
      // },
      {
        type: "label-only",
        typeOfLabel: "inline",
        name: "statusLabel",
        label: "Status:",
        cols: 1,
        className: "w-5rem mt-1 pl-2",
      },

      {
        type: "text-select",
        name: "workFlowStatus",
        className: "status w-10rem",
        nextLine: true,
        cols: 2,
        disabled: false,
      },
      // {
      //   type: 'text',
      //   label: 'Product',
      //   name: 'extName',
      //   //validators: [validators.required, validators.pattern('^[a-zA-Z ]*$')],
      //   className: ' ',
      //   disabled: true,
      //   hidden: false,
      // },
      {
        type: "select",
        label: "Product",
        name: "productId",
        alignmentType: "vertical",
        className: " w-1 mt-2",
        options: [],
        //  idKey: "productId",
        filter: true,
        // hidden: false,
      },
      {
        type: "select",
        label: "Program",
        name: "programId",
        alignmentType: "vertical",
        // list$: "Program/get_programs",
        // //validators: [validators.required],
        className: "w-1 mt-2 ",
        options: [],
        // idKey: "programId",
        filter: true,
        // disabled: true,
      },
      {
        type: "text",
        label: "Loan Purpose",
        inputType: "vertical",
        name: "purposeofLoan",
        inputClass: "mr-2 loan-purpose-status",
        labelClass: "lc pb-2",
        // //regexPattern: "[^a-zA-Z ]*",
        maxLength: 20,
        // //validators: [validators.required],
        className: "w-1 mt-3",
        disabled: true,
      },
      // {
      //   type: "select",
      //   label: "Originator Name",
      //   name: "originatorName",
      //   options: [],
      //   className: "w-1 mt-2 ",
      //   // //validators: [validators.required],
      // },
      {
        type: "text",
        label: "Originator Name",
        inputType: "vertical",
        inputClass: "mr-2",
        labelClass: "ld pb-2",
        name: "originatorName",
        className: "w-1 mt-3 ",
        // disabled: true,
        mode: Mode.view,

        // //validators: [validators.required],
      },
      {
        type: "phone",
        label: "Originator Number",
        inputType: "vertical",
        labelClass: "le pb-2",
        name: "originatorNumber",
        className: " w-1 mt-3 ",
        disabled: true,
      },
      {
        type: "select",
        label: "Salesperson",
        name: "salesPerson",
        alignmentType: "vertical",
        // options: [
        //   { label: "Sophie Kihm", value: "Sophie Kihm" },
        //   { label: "John Peter", value: "John Peter" },
        // ],
        options: [],
        // //validators: [validators.required],
        className: "w-1 mt-2",
      },
      {
        type: "text",
        label: "Originator Reference",
        name: "originatorReference",
        inputType: "vertical",
        labelClass: "lf pb-2",
        // //regexPattern: "[^a-zA-Z]*",
        maxLength: 20,
        // //validators: [validators.required],
        className: "w-1 mt-3",
      },
      {
        type: "select",
        label: "Sales Person",
        name: "internalSalesperson",
        alignmentType: "vertical",
        options: [],
        // //validators: [validators.required],
        className: "w-1 mt-2",
        hidden: true,
      },
    ],
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private changeDetectorRef: ChangeDetectorRef,
    private standardService: StandardQuoteService,
    public dashboardService: DashboardService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private toasterSvc: ToasterService,
    private quickquoteService: QuickQuoteService,
    public tradeSvc: AssetTradeSummaryService,
    public indSvc: IndividualService,
    public businessSvc: BusinessService,
    public trustSvc: TrustService,
    public soleTradeSvc: SoleTradeService,
    public dataSvc: DataService
  ) {
    super(route, svc, baseSvc);
    this.baseSvc.formDataCacheableRoute([
      "Product/get_programs_products",
      "CustomerDetails/get_contacts?partyNo=1000000&PageNo=1&PageSize=10",
    ]);

    effect(
      async () => {
        // const dealer = this.dealer(); // make sure you're using toSignal here!
        let dealer = this.dashboardService?.onOriginatorChange();
        if (!dealer && this.router.url === "/dealer") return;

        if (dealer) {
          this.mainForm.form.get("originatorName")?.patchValue(dealer?.name);
          this.mainForm.form.get("originatorNumber")?.patchValue(dealer?.num);

          this.standardService.setBaseDealerFormData({
            originatorName: dealer?.name,
            originatorNumber: dealer?.num,

          });

          if (!this.baseSvc.contractId) {
            sessionStorage.setItem("dealerPartyNumber", dealer?.num);
            sessionStorage.setItem("dealerPartyName", dealer?.name);
          }

          if (dealer.num === this.baseFormData.originalDealerId) {
            this.baseFormData.isDealerChange = false;
          } else {
            this.baseFormData.isDealerChange = true;
            // this.mainForm?.form?.get("salesPerson")?.setValue(null);
            // this.baseFormData.salesPerson = null;
          }

          const currentRoute = this.router.url;
          if (
            currentRoute !== "/dealer/quick-quote" &&
            currentRoute !== "/dealer" &&
            (sessionStorage.getItem("externalUserType") !== "Internal" && sessionStorage.getItem("directSales") !== 'Direct Sales')
          ) {
            await this.getProductProgram();
            await this.checkProductProgram();
          }
        }

      },
      { allowSignalWrites: true }
    );
  }
  override async ngOnInit(): Promise<void> {
    this.promotionalCheckDone = false;
    this.sessionProductCode = sessionStorage.getItem("productCode");
    await super.ngOnInit();
    let params: any = this.route?.snapshot?.params;
    this.mode = params?.mode;

    if ((sessionStorage.getItem("externalUserType") == "Internal")) {
      this.mainForm.updateProps("originatorName", {
        type: "select",
        options: [],
        alignmentType: "vertical",
        mode: Mode.edit,
        className: "w-1 mt-2",
      });


      if (params?.mode === 'edit' || params?.mode === 'create') {
        this.getProductProgramForInternalSales();
        const dealerList = await this.standardService.getDealerForInternalSales(this.baseFormData?.program?.programId);
        await this.mainForm.updateList("originatorName", dealerList);
        this.mainForm?.get("originatorName")?.setValue(this.baseFormData?.originatorName);
        await this.getsalesPerson(this.baseFormData?.originatorNumber);
        this.mainForm?.get("salesPerson")?.patchValue(this.baseFormData?.salesPerson);
      }

      if (this.baseFormData?.programId && !(params?.mode === 'edit' || params?.mode === 'create')) {
        const dealerList = await this.standardService.getDealerForInternalSales(this.baseFormData?.programId);
        this.mainForm.updateList("originatorName", dealerList);
        this.mainForm?.get("originatorName")?.patchValue(this.baseFormData?.dealerId);
        this.getsalesPerson(this.baseFormData?.originatorNumber);
      }
    }

    this.standardService.forceToClickCalculate.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.clickCalculateError = status;
    });

    this.baseSvc?.onLoanPurposeChange.subscribe((loanPurpose) => {
      this.mainForm.get("purposeofLoan").patchValue(loanPurpose);
      this.standardService.setBaseDealerFormData({
        purposeofLoan: loanPurpose,
      });
    });

    if (this.baseFormData && this.mainForm?.form) {
      if (this.baseFormData && this.mode != "edit") {
        this.mainForm
          .get("purposeofLoan")
          .patchValue(
            this.baseFormData?.loanPurpose || this.baseFormData?.purposeofLoan
          );
        this.productCode = this.baseFormData?.productCode;
        if (this.productCode == "FL" || this.productCode == "TL") {
          this.mainForm.get("purposeofLoan").patchValue("Business");
        }

        //sessionStorage.removeItem('dealerPartyNumber');
      } else if (this.baseFormData && this.mode == "edit") {
        this.baseFormData.originalDealerId =
          sessionStorage.getItem("dealerPartyNumber");

        this.oldLoanPurpose = this.baseFormData?.purposeofLoan;
      }

      if (this.baseFormData?.extName) {
        // Implement additional logic here if needed
      }

      if (this.baseFormData?.contractId) {
        this.mainForm.updateHidden({ contractId: false });
        this.mainForm.form
          .get("contractId")
          ?.patchValue(this.baseFormData?.contractId);
        // this.mainForm.updateHidden({ status: false });
      } else {
        this.mainForm.updateHidden({ contractId: true });
      }
    }
    // await this.getOriginatorname();
    if (this.baseFormData && this.mode == "edit") {
      //   const originatorNumber = this.baseFormData?.originatorNumber;
      //   const originatorName = this.baseFormData?.originatorName;
      // sessionStorage.setItem("dealerPartyNumber", originatorNumber);
    }
    this.standardService.onDealerChange.next(false);

    // this.dashboardService?.onOriginatorChange.subscribe(async (dealer) => {
    //   if (!dealer && this.router.url === "/dealer") return;

    //   else if (dealer) {
    //     this.mainForm.form.get("originatorName").patchValue(dealer?.name);
    //     this.mainForm.form.get("originatorNumber").patchValue(dealer?.num);
    //     this.standardService.setBaseDealerFormData({
    //       originatorName: dealer?.name,
    //       originatorNumber: dealer?.num,
    //     });
    //       if(!this.baseSvc.contractId){
    //               sessionStorage.setItem('dealerPartyNumber', dealer?.num);
    //             sessionStorage.setItem('dealerPartyName', dealer?.name);
    //           }
    //     if (dealer.num == this.baseFormData.originalDealerId) {
    //       this.baseFormData.isDealerChange = false;
    //     } else {
    //       this.baseFormData.isDealerChange = true;
    //       this.mainForm?.form?.get("salesPerson")?.setValue(null);
    //       this.baseFormData.salesPerson = null;
    //     }
    //     const currentRoute = this.router.url;
    //     if (
    //       currentRoute != "/dealer/quick-quote" &&
    //       currentRoute != "/dealer"
    //     ) {
    //       //   if(currentRoute.includes("/dealer/standard-quote")){
    //       {
    //         await this.getProductProgram();
    //         // }
    //         await this.checkProductProgram();
    //       }
    //     }
    //   }
    // });

    const originatorNumber = sessionStorage.getItem("dealerPartyNumber");

    if (originatorNumber) {
      this.getsalesPerson(originatorNumber);
    }
    if (this.sessionProductCode === "AFV") {
      if (this.baseFormData?.afvProgramList && this.baseFormData.afvProgramList.length > 0) {


        this.mainForm.updateList('programId', this.baseFormData.afvProgramList);


        if (this.baseFormData.programId) {
          this.mainForm.get('programId')?.patchValue(this.baseFormData.programId);

        }
      }
    }
    if (this.sessionProductCode === "AFV") {
      this.baseSvc.afvProgramsLoaded.pipe(takeUntil(this.destroy$)).subscribe((programList: any[]) => {
        this.mainForm?.get('programId')?.patchValue(null);
        this.mainForm.get('programId')?.clearValidators();
        this.mainForm.get('programId')?.updateValueAndValidity();
        if (programList && programList.length > 0) {
          this.mainForm.updateList('programId', programList);
        } else {
          this.mainForm.updateList('programId', []);

        }
      });
    }

    // await this.getProductProgram();
    // await this.updateValidation("onInit");
  }

  override async onFormReady(): Promise<void> {
    this.productCode = this.baseFormData?.productCode;
    await this.updateValidation("onInit");
    super.onFormReady();
    if (this.sessionProductCode === "AFV") {
      if (this.baseFormData?.programId) {

      } else {
        // Only clear if no program is selected (new quote scenario)
        this.mainForm.updateList('programId', []);
      }
    }
    if ((sessionStorage.getItem("externalUserType") == "Internal")) {
      await this.getProductProgramForInternalSales();
      this.mainForm.updateHidden({ internalSalesperson: false });
      this.mainForm.updateProps("salesPerson", { label: "Dealer Salesperson" });

      if (sessionStorage.getItem("productCode") == "TL") {
        this.mainForm.updateHidden({ privateSales: false });
        this.mainForm?.updateProps("promotionQuote", { className: " " });
      }

      let res = await this.baseSvc?.getFormData(
        `CustomerDetails/get_contacts?partyNo=1000000&PageNo=1&PageSize=10`
      );
      if (res?.data) {
        let internalSalesPersonList = res.data.map((d: any) => ({
          label: d.lastName,
          value: d.customerId,
        }));
        this.mainForm?.updateList(
          "internalSalesperson",
          internalSalesPersonList
        );
      }

      if (this.baseFormData?.originatorName) {
        this.mainForm
          .get("originatorName")
          .patchValue(this.baseFormData?.originatorName);
        // const currentRoute = this.router.url;
        // if (
        //   currentRoute !== "/dealer/quick-quote" &&
        //   currentRoute !== "/dealer" &&
        //   sessionStorage.getItem("externalUserType") === "Internal"
        // ) {
        //   await this.getProductProgramForInternalSales(
        //     this.baseFormData?.originatorName
        //   );
        // }
      }
    }

    this.mainForm
      .get("purposeofLoan")
      .patchValue(
        this.baseFormData?.loanPurpose || this.baseFormData?.purposeofLoan
      );
    if (this.baseFormData?.contractId && this.baseFormData?.programId) {
      await this.checkIfProgramIsPromotional(this.baseFormData.programId);
    }
  }

  introObj = {};

  async getOriginatorname() {
    let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.dashboardService.decodeToken(accessToken);
    let res = await this.baseSvc.getFormData(
      `User/get_introducers?userCode=${decodedToken?.sub}`
    );

    let data = res?.data;
    if (data?.length > 0) {
      data.forEach((ele) => {
        this.introObj[Number(ele?.originatorNo)] = {
          name: ele?.originatorName,
          id: ele?.originatorId
        };
      });
    }
    let jsonArray = Array.isArray(data)
      ? data
        .map((item) => ({
          label: item.originatorName,
          value: {
            originatorNo: item.originatorNo,
            originatorId: item.originatorId,
            originatorName: item.originatorName
          }
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      : [];
    this.mainForm.updateList("originatorName", jsonArray);
  }

  private resetServicePlanForm(): void {
    const resetData = {
      registrations: [
        {
          id: 0,
          customflowID: 0,
          name: "Registrations",
          amount: 0,
          months: null,
          reference: "Registration Fee",
          changeAction: "",
        },
      ],
      servicePlan: [
        {
          id: 0,
          customflowID: 0,
          name: "Service Plan",
          amount: 0,
          months: null,
          description: "",
          reference: "Service Plan",
          changeAction: "",
        },
      ],
      other: [],
      subTotalAccesoriesValue: 0,
    };

    this.baseSvc.onProductProgramChange.next(resetData);
    this.baseSvc.shouldResetServicePlan = true;
  }
  private resetInsuranceValues(): void {
    const insuranceFields = {
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
      subTotalInsuranceRequirementValue: 0,
    };

    const servicePlanFields = {
      servicePlan: [
        {
          id: 0,
          customflowID: 0,
          name: "Service Plan",
          amount: 0,
          months: null,
          description: "",
          reference: "Service Plan",
          changeAction: "",
        },
      ],
      registrations: [
        {
          id: 0,
          customflowID: 0,
          name: "Registrations",
          amount: 0,
          months: null,
          reference: "Registration Fee",
          changeAction: "",
        },
      ],
      other: [],
      subTotalAccesoriesValue: 0,
    };
    const accessoriesFields = {
      accessories: null,
      subTotalServicePlanValue: 0,
    };
    const allResetData = {
      ...insuranceFields,
      ...servicePlanFields,
      ...accessoriesFields,
    };

    this.baseSvc.onProductProgramChange?.next(allResetData);

    const currentBaseData = this.baseSvc.getBaseDealerFormData().getValue();
    this.baseSvc.setBaseDealerFormData({
      ...currentBaseData,
      ...allResetData,
    });

    this.baseSvc.addsOnAccessoriesData(allResetData);

    this.baseSvc.shouldResetInsurance = true;
    this.baseSvc.shouldResetServicePlan = true;
    this.baseSvc.shouldResetAccessories = true;
  }
  override async onValueTyped(event: any): Promise<void> {
    if (event.name == "productId") {
      if (event.data) {
        // Reset promotional quote checkbox when product changes
        this.promotionQuote = false;
        this.mainForm.get("promotionQuote")?.setValue(false, { emitEvent: false });
        this.promotionalCheckDone = false; // Reset the guard flag
        this.resetInsuranceValues();
        this.resetServicePlanForm();
        this.loanPurpose = await this.baseSvc.getFormData(
          `Product/get_productCustomFields?productId=${event?.data}`
        );
        this.mainForm
          .get("purposeofLoan")
          .patchValue(this.loanPurpose?.data?.loanPurpose);

        this.baseSvc.setBaseDealerFormData({
          purposeofLoan: this.loanPurpose?.data?.loanPurpose,
          allowedInsuranceProducts:
            this.loanPurpose?.data?.allowedInsuranceProducts,
        });

        if (this.baseSvc.activeStep == 1) {
          if (this.oldLoanPurpose) {
            if (this.baseFormData?.purposeofLoan !== this.oldLoanPurpose) {
              if (
                this.baseFormData?.purposeofLoan == configure.LoanPurpose &&
                this.baseFormData?.customerSummary?.find((type) => {
                  return (
                    type?.customerType == "Individual" &&
                    type?.roleName == "Borrower"
                  );
                })
              ) {
                this.toasterSvc.showToaster({
                  severity: "warn",
                  detail: "Update individual details",
                });
                this.baseSvc.updateIndividualCustomerWarning = true;
              } else if (
                this.baseFormData?.purposeofLoan ==
                configure.LoanPurposeBusiness &&
                this.baseFormData?.customerSummary?.find((type) => {
                  return (
                    type?.customerType == "Individual" &&
                    type?.roleName == "Borrower"
                  );
                })
              ) {
                this.toasterSvc.showToaster({
                  severity: "warn",
                  detail: "Update individual details",
                });
                this.baseSvc.updateIndividualCustomerWarning = true;
              }
            }
          }
        }
        this.oldLoanPurpose = this.baseFormData?.purposeofLoan;
        this.baseSvc.onLoanPurposeChange.next(
          this.loanPurpose?.data?.loanPurpose
        );
        // Call PPSR rate fee API after product selection
        try {
          if (
            this.sessionProductCode === "CSA" ||
            this.sessionProductCode === "AFV" ||
            this.sessionProductCode === "TL"
          ) {
            await this.baseSvc.getPpsrRateFee();
          }
        } catch (error) {
          console.error("Error calling getPpsrRateFee:", error);
        }

        let product = this.productProgramList.products.find(
          (p) => p?.productId === event?.data
        );
        this.baseSvc.productBusinessModel = product?.businessModel;
      }
      // this.baseSvc.forceToClickCalculate.next(true);
      // this.baseSvc.changedDefaults = {
      //   ...this.baseSvc.changedDefaults,
      //   product: true,
      // };
      await this.setProgram(event?.data);
      this.baseSvc.showResult = false;
    }

    if (event.name == "programId") {
      this.resetInsuranceValues();
      this.resetServicePlanForm();
      // let programOptions;
      // let key = `Program/get_programs?productId=${this.baseFormData?.productId}`;
      // this.svc.data.get(key).subscribe((res) => {
      //   programOptions = res?.data;
      // });
      let programOptions = this.productProgramList.programs.filter(
        (product) => product.productId === this.baseFormData?.productId
      );

      const filteredPrgram = programOptions?.find(
        (item: any) => item.programId === event.data
      );
      if (filteredPrgram) {
        this.standardService.setBaseDealerFormData({
          programExtName: filteredPrgram.extName,
          programCode: filteredPrgram.code,
          programId: filteredPrgram.programId,
        });
      }
      // this.baseSvc.forceToClickCalculate.next(true);

      // this.baseSvc.changedDefaults = {
      //   ...this.baseSvc.changedDefaults,
      //   program: true,
      // };

      let defaults = [];
      this.standardService.programChange.next(event?.data);
      // this.standardService.isProgramChanged = true;
      if (event?.data) {
        await this.baseSvc.contractPreview(
          this.baseFormData,
          defaults,
          "program"
        );
        if (sessionStorage.getItem('productCode') === 'OL' && this.baseFormData) {

          const effectiveDate = this.baseFormData.leaseDate || this.baseFormData.loanDate;
          const assetTypeId = this.baseFormData.assetTypeId || 0;
          const depreciationRateCurve = this.baseFormData.depreciationRateCurve || "IRD ful Life Rates";

          await this.baseSvc.getUsefulLife(effectiveDate, assetTypeId, depreciationRateCurve);

        }
        this.baseSvc.defautltUDCEstablishmentFee = {
          defaultudcEstablishmentFee: this.baseFormData?.udcEstablishmentFee,
          defaultDealerOriginationFee: this.baseFormData?.dealerOriginationFee,
        };
        this.baseSvc.changedProgram.next(event?.data);
        this.baseSvc.showResult = false;
        if (sessionStorage.getItem("externalUserType") === "Internal") {
          const dealerList = await this.standardService.getDealerForInternalSales(event?.data);
          this.mainForm.updateList("originatorName", dealerList);
        }
      }
    }

    if (
      (sessionStorage.getItem("externalUserType") == "Internal") &&
      event.name == "originatorName"
    ) {
      const originatorNumber = await this.standardService.getOriginatorNumberByName(event.data);
      this.mainForm.form.get("originatorNumber")?.setValue(originatorNumber);
      this.getsalesPerson(originatorNumber);
    }
  }

  override async onFormEvent(res: any) {
    if (res.name == "originatorName") {
      const selectedOriginator = this.introObj[Number(res?.value)];

      this.baseSvc.setBaseDealerFormData({
        supplierName: this.introObj[Number(res?.value)],
      });

      this.baseSvc.changedOriginator.next(
        this.mainForm.get("originatorNumber")?.value
      );
    }

    if (res.name == "salesPerson") {
      const filteredProduct = this.salePersonData?.data?.find((item: any) => {
        return item.customerId === res.value;
      });
      if (filteredProduct) {
        let salePersonDetails = [
          {
            party: {
              partyId: filteredProduct?.customerId,
              partyNo: filteredProduct?.customerNo,
            },
            partyRole: "Dealer Salesperson",
          },
        ];
        this.baseSvc.setBaseDealerFormData({
          salePersonDetails: salePersonDetails,
        });
      }
    }

    if (res.name == "productId") {
      // Reset promotional quote
      this.promotionQuote = false;
      this.mainForm.get("promotionQuote")?.setValue(false, { emitEvent: false });
      this.promotionalCheckDone = false;
      let productOptions = await this.mainForm?.getOptions("productId");
      const filteredProduct = productOptions?.find((item: any) => {
        return item.productId === res.value;
      });
      if (res.value) {
        await this.setProgram(res?.value);

        if (this.promotionQuote) {
          this.filterProgramOptionsByPromotions();
        }
      }

      if (filteredProduct) {
        this.standardService.setBaseDealerFormData({
          productExtName: filteredProduct?.extName,
          productId: filteredProduct?.productId,
        });
      }

      // if (!this.mainForm.formViewMode) {
      //   this.mainForm.get("programId").enable();
      // }
    }

    if (res.name == "programId") {
      if (res.value) {
        // let programOptions;
        // let key = `Program/get_programs?productId=${this.baseFormData?.productId}`;
        // this.svc.data.get(key).subscribe((res) => {
        //   programOptions = res?.value;
        // });
        let programOptions = this.productProgramList?.programs?.filter(
          (product) => product.productId === res?.value
        );
        const filteredPrgram = programOptions?.find(
          (item: any) => item.programId === res.value
        );

        if (filteredPrgram) {
          this.standardService.setBaseDealerFormData({
            programExtName: filteredPrgram.extName,
            programCode: filteredPrgram.code,
            programId: filteredPrgram.programId,
          });
        }
      }
    }

    if (res.name == "promotionQuote") {
      if (res.value) {
        this.filterProgramOptionsByPromotions();
        this.promotionQuote = true;
      } else {
        this.promotionQuote = false;
        // this.mainForm.fieldProps["programId"].list$ = "Program/get_programs";
        this.mainForm.fieldProps["programId"].options = this.programList;
        let productId = this.mainForm.get("productId")?.value;
        await this.setProgram(productId);
      }
    }
    super.onFormEvent(res);
  }

  async filterProgramOptionsByPromotions(): Promise<void> {
    const productId = this.mainForm.get("productId")?.value;
    if (!productId) return;

    let programOptions = await this.mainForm.getOptions("programId");
    if (!programOptions || programOptions?.length == 0) {
      // let key = `Program/get_programs?productId=${productId}`;
      // this.svc.data.get(key).subscribe((res) => {
      //   programOptions = res?.data;
      // });
      programOptions = this.productProgramList.programs.filter(
        (product) => product.productId === productId
      );
    }

    const request = {
      parameterValues: [String(productId)],
      procedureName: configure.SPPromotionalProgramExtract,
    };
    const promoResponse = await this.svc.data
      .post("LookupServices/CustomData", request)
      .toPromise();
    const promotionalPrograms = promoResponse?.data?.table || [];

    const filteredOptions = programOptions.filter((option) => {
      return promotionalPrograms.some((program) => {
        return Number(program.program_id) === Number(option.value);
      });
    });
    // let mappedOptions = [];
    // promotionalPrograms?.forEach((ele) => {
    //   let obj = {
    //     label: ele?.name,
    //     value: ele?.program_id,
    //   };
    //   mappedOptions?.push(obj);
    // });
    // this.mainForm.fieldProps["programId"].list$ = null;
    await this.mainForm.updateList("programId", filteredOptions);
  }
  async checkIfProgramIsPromotional(programId: number): Promise<void> {
    // Guard: Prevent duplicate calls
    if (this.promotionalCheckDone) {
      return;
    }

    const productId = this.baseFormData?.productId;

    if (!productId || !programId) {
      return;
    }

    // Mark as done immediately to prevent race conditions
    this.promotionalCheckDone = true;

    try {
      const request = {
        parameterValues: [String(productId)],
        procedureName: configure.SPPromotionalProgramExtract,
      };

      const promoResponse = await this.svc.data
        .post("LookupServices/CustomData", request)
        .toPromise();

      const promotionalPrograms = promoResponse?.data?.table;

      const isProgramPromotional = promotionalPrograms?.some(
        (program: any) => Number(program.program_id) === Number(programId)
      );

      if (isProgramPromotional) {
        this.promotionQuote = true;

        const control = this.mainForm.get("promotionQuote");
        if (control) {
          control.setValue(true, { emitEvent: false });
        }

        await this.filterProgramOptionsByPromotions();

        this.baseSvc.setBaseDealerFormData({
          promotionQuote: true,
        });

        this.changeDetectorRef.detectChanges();

      } else {
        this.promotionQuote = false;
        this.mainForm.get("promotionQuote")?.setValue(false, { emitEvent: false });

        this.baseSvc.setBaseDealerFormData({
          promotionQuote: false,
        });

        this.changeDetectorRef.detectChanges();
      }

    } catch (error) {
      this.promotionQuote = false;
      this.mainForm.get("promotionQuote")?.setValue(false);
    }
  }

  // override async onStatusChange(statusDetails: any): Promise<void> {
  //   if (this.baseFormData?.contractId) {
  //     if (this.baseFormData?.isDraft) {
  //       this.mainForm.get("workFlowStatus").patchValue("Draft");
  //     } else {
  //       console.log("WorkFlow Check StatusDetails: ", statusDetails);

  //   let workFlowStatusMatrixRes = await this.baseSvc.getFormData(
  //     `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Workflow Steps`
  //   );
  //   console.log("WorkFlow Check Response: ", workFlowStatusMatrixRes);
  //       this.mainForm
  //         .get("workFlowStatus")
  //         .patchValue(statusDetails?.currentState);
  //     }
  //   } else {
  //     this.mainForm.get("workFlowStatus").patchValue("Open Quote");
  //   }
  //   super.onStatusChange(statusDetails);
  // }

  override async onStatusChange(statusDetails: any): Promise<void> {

    if (statusDetails) {

      await this.handleWorkflowLogic(statusDetails);
      super.onStatusChange(statusDetails);
    }

  }

  private async handleWorkflowLogic(statusDetails: any): Promise<void> {
    // Handle draft case
    // if (this.baseFormData?.isDraft && this.baseFormData?.contractId) {
    //   this.mainForm.get("workFlowStatus").patchValue("Draft");
    //   this.workflowOptions = [];
    //   return;
    // }

    // Handle new quote case (no contractId)
    if (!this.baseFormData?.contractId) {
      this.mainForm.get("workFlowStatus").patchValue("Open Quote");
      this.workflowOptions = [];
      return;
    }

    // Handle workflow matrix processing
    console.log("WorkFlow Check StatusDetails: ", statusDetails?.currentState);

    const workFlowStatusMatrixRes = await this.baseSvc.getFormData(
      `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Workflow Steps`
    );
    console.log("WorkFlow Check Response: ", workFlowStatusMatrixRes);

    const matchingRow = workFlowStatusMatrixRes?.data?.dataRowList?.find((row: any) =>
      row.customFields?.["Application State"] === statusDetails?.currentState
    );

    if (matchingRow) {
      const dealerPortalState = matchingRow.customFields?.["Dealer Portal State"];
      const allowedTransitions = matchingRow.customFields?.["Portal Allowed Transitions"];

      // this.mainForm.get("workFlowStatus").patchValue(dealerPortalState);

      // Process workflow options
      if (allowedTransitions && allowedTransitions !== "NA") {
        this.workflowOptions = allowedTransitions
          .split(',')
          .map(transition => transition.trim())
          .filter(transition => transition && transition !== "NA");

        this.mainForm.get("workFlowStatus").enable();
      } else {
        this.workflowOptions = [];
        this.mainForm.get("workFlowStatus").disable();
        this.mainForm.updateClass({ workFlowStatus: "status w-10rem disable-workflow" }, "className")
        //  this.mainForm?.updateProps("workFlowStatus", {disabled: true});
        //  this.mainForm.get("workFlowStatus").updateValueAndValidity();
      }

      this.mainForm.get("workFlowStatus").patchValue(dealerPortalState);
    } else {
      // Fallback
      this.mainForm.get("workFlowStatus").patchValue(statusDetails?.currentState);
      this.workflowOptions = [];
      this.mainForm.get("workFlowStatus").disable();
      this.mainForm.updateClass({ workFlowStatus: "status w-10rem disable-workflow" }, "className")
    }


  }

  async onWorkflowOptionSelect(option: string): Promise<void> {
    let currentWorkflowState = this.mainForm.get("workFlowStatus").value;
    console.log(currentWorkflowState, "Current Workflow State");
    console.log(option, this.baseFormData, "Selected Option");


    if (option == "Submit") {
      if (this.baseFormData?.AFworkflowStatus === "Quote") {
        if (this.fieldValidations()) {
          return;
        }
        if (this.checkIfLoanDatePassed()) {
          this.showLoanPastDialog = true;
          // this.getDeclaration();
          return;
        }

        // this.updateState("Submitted");
      }
      let productCode = sessionStorage.getItem("productCode") || this.baseFormData?.productCode;
      if (this.tradeSvc.assetList.length > 1 && productCode == 'CSA') {
        this.toasterSvc.showToaster({
          severity: "warn",
          detail: "CSA Applications should not be used for more than a single asset.",
        });
        // return;
      }
      if (!this.checkIfLoanDatePassed()) {
        this.getDeclaration()
        return;
      }
      // this.updateState("Submitted");
    }
    else if (option == "Withdraw") {
      if (this.fieldValidations()) {
        return;
      }

      if (this.clickCalculate()) {
        return;
      }


      this.showWithdrawDialog = true;
      // this.updateState("Withdrawn");
    }
    else if (option == "Open Quote") {
      if (this.fieldValidations()) {
        return;
      }

      if (this.clickCalculate()) {
        return;
      }

      let updateContractRes = await this.baseSvc.contractModification(this.baseFormData, false);

      if (updateContractRes == null || updateContractRes?.apiError || updateContractRes?.Error?.Message) {
        return;
      }

      this.updateState("Quote");
    }
    else if (option == "Assessment Q") {

      if (this.fieldValidations()) {
        return;
      }

      if (this.clickCalculate()) {
        return;
      }

      let updateContractRes = await this.baseSvc.contractModification(this.baseFormData, false);

      if (updateContractRes == null || updateContractRes?.apiError || updateContractRes?.Error?.Message) {
        return;
      }

      this.updateState("Awaiting Assessment - Retail Lending");
    }
    else if (option == "Generate Docs") {

      if (this.fieldValidations()) {
        return;
      }

      if (this.clickCalculate()) {
        return;
      }

      if (this.baseFormData?.AFworkflowStatus === "Ready for Documentation") {
        if (this.checkIfLoanDatePassed()) {
          this.showLoanPastDialog = true;
          return;
        }
      }
      this.updateState("Generate documents");
    }
    else if (option == "Approved") {

      if (this.fieldValidations()) {
        return;
      }

      if (this.clickCalculate()) {
        return;
      }

      let updateContractRes = await this.baseSvc.contractModification(this.baseFormData, false);

      if (updateContractRes == null || updateContractRes?.apiError || updateContractRes?.Error?.Message) {
        return;
      }

      this.updateState("Ready for Documentation");
    }
    else if (option == "Payout Q") {

      if (this.fieldValidations()) {
        return;
      }

      if (this.clickCalculate()) {
        return;
      }

      let updateContractRes = await this.baseSvc.contractModification(this.baseFormData, false);

      if (updateContractRes == null || updateContractRes?.apiError || updateContractRes?.Error?.Message) {
        return;
      }

      this.updateState("Awaiting Settlement Review");
    }
    else {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Invalid workflow option selected.",
      });
    }
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

  clickCalculate() {
    if (this.clickCalculateError) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Please click on Calculate.",
      });
      return true;
    }
    return false;
  }

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

            if (updateContractRes?.apiError || updateContractRes?.Error?.Message) {
              return;
            }
            else {

              let updateWorkflow = await this.updateState("Submitted");

              if (updateWorkflow !== false &&
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
                      this.standardService.resetBaseDealerFormData();
                      this.indSvc.resetBaseDealerFormData();
                      this.businessSvc.resetBaseDealerFormData();
                      this.trustSvc.resetBaseDealerFormData();
                      this.standardService.individualDataSubject.unsubscribe();
                      this.tradeSvc.resetData();
                      this.quickquoteService.resetData();
                      this.router.navigateByUrl("/dealer");
                      this.standardService.activeStep = 0;
                    }
                  });
              }

              // else if (data?.btnType == "submit" && this.baseFormData.contractId) {

              //   await this.baseSvc.contractModification(this.baseFormData, false);
              //   this.svc.dialogSvc
              //     .show(FinalConfirmationComponent, "", {
              //       data: {
              //         data: this.baseFormData,
              //       },
              //       templates: {
              //         footer: null,
              //       },
              //       width: "60vw",
              //     })
              //     ?.onClose.subscribe((data: CloseDialogData) => {
              //       if (data?.btnType == "submit") {
              //         this.standardService.resetBaseDealerFormData();
              //         this.indSvc.resetBaseDealerFormData();
              //         this.businessSvc.resetBaseDealerFormData();
              //         this.trustSvc.resetBaseDealerFormData();
              //         this.standardService.individualDataSubject.unsubscribe();
              //         this.tradeSvc.resetData();
              //         this.quickquoteService.resetData();
              //         this.router.navigateByUrl("/dealer");
              //         this.standardService.activeStep = 0;
              //       }
              //     });
              //   // alert('Declaration form is unchecked!');
              // }

            }
          }
        });
    } else {
      this.router.navigateByUrl("/dealer");
    }
  }

  checkIfLoanDatePassed(): boolean {
    if (!this.baseFormData?.loanDate) {
      return false;
    }

    const loanDate = new Date(this.baseFormData?.loanDate);
    const today = new Date();

    loanDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (loanDate < today) {
      this.selectedPastLoanDate = loanDate;
      return true;
    }

    return false;
  }

  onLoanYes() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.baseSvc.setBaseDealerFormData({
      loanDate: today
    });
    this.baseSvc?.loanDateSignal.set(today);

    this.showLoanPastDialog = false;

    let productCode = sessionStorage.getItem("productCode") || this.baseFormData?.productCode;
    if (this.tradeSvc.assetList.length > 1 && productCode == 'CSA') {
      this.toasterSvc.showToaster({
        severity: "warn",
        detail: "CSA Applications should not be used for more than a single asset.",
      });
      // return;
    }
    // this.updateState("Submitted");
  }

  onLoanNo() {
    this.showLoanPastDialog = false;
  }

  async onYes() {
    this.showWithdrawDialog = false;

    let updateContractRes = await this.baseSvc.contractModification(this.baseFormData, false);

    if (updateContractRes == null || updateContractRes?.apiError || updateContractRes?.Error?.Message) {
      return;
    }

    this.updateState("Withdrawn");

  }

  onNo() {
    this.showWithdrawDialog = false;
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      const el = document.querySelector(".status input") as HTMLInputElement;

      if (el) {
        el.readOnly = true;
        el.style.cursor = "pointer";
      }
    });
  }

  // async updateState(nextState) {

  //     let request = {
  //       nextState: nextState,
  //       isForced: false,
  //     };
  //     let state = await this.svc.data
  //       .put(
  //         `WorkFlows/update_workflowstate?contractId=${this.baseFormData?.contractId}&workflowName=Application&WorkFlowId=${this.baseFormData?.AFworkflowId}`,
  //         request
  //       )
  //       .pipe(
  //         map((res) => {
  //           if(res?.data?.data){
  //           return res?.data?.data;
  //         }
  //         // else if(res?.apiError?.errors.length > 0){

  //         //   let errors = res?.apiError?.errors

  //         //    const messages: Message[] = errors.map((err) => ({
  //         //       severity: "error",
  //         //       detail: err?.message,
  //         //     }));
  //         //     this.toasterSvc.showMultiple(messages);
  //         //     return;
  //         // }
  //         })
  //       )
  //       .toPromise();

  //       if(state){
  //       this.baseSvc?.appStatus?.next({
  //         currentState: state?.currentState?.name,
  //         nextState: state?.defaultNextState?.name,
  //       });
  //     }
  //   }

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
      if ((response?.apiError?.errors?.length > 0) || (response?.Error?.Message)) {
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
      console.error('Error in updateState:', error);
      return false;
    }
  }


  override renderComponentWithNewData() {
    if (this.baseFormData && this.mainForm?.form) {
      this.mainForm.updateHidden({ contractId: false });
      this.mainForm.form.patchValue({
        contractId: this.baseFormData?.contractId,
      });
      // Check if program is promotional when contract is reopened
      if (this.baseFormData?.contractId && this.baseFormData?.programId) {
        this.checkIfProgramIsPromotional(this.baseFormData.programId);
      }
    }
    super.renderComponentWithNewData();
    this.changeDetectorRef.detectChanges();
  }

  override async onBlurEvent(event) {
    await this.updateValidation(event);
  }

  override async onValueEvent(event) {
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

    // var responses: any = await this.validationSvc.updateValidation(req);
    // if (responses.formConfig && !responses.status) {
    //   this.formConfig = { ...responses.formConfig };
    //   this.changeDetectorRef.detectChanges();
    //   return false;
    // }
    // return true;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    if (quotesDetails?.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");

      // if(!result.status){
      //   this.toasterService.showToaster({
      //     severity: 'error',
      //     detail: 'I7'
      //    })
      // }
    }
  }

  // override proceed(): void {
  //   super.proceed();
  // }

  // override onStepChange(stepperDetails: any): void {
  //   super.onStepChange(stepperDetails);
  // }

  async getsalesPerson(salesPersonId: any) {
    if (salesPersonId) {
      this.salePersonData = await this.baseSvc.getFormData(
        `CustomerDetails/get_contacts?partyNo=${salesPersonId}&PageNo=1&PageSize=10`
      );
      let data = this.salePersonData?.data;
      let arr = Array.isArray(data)
        ? data.map((item) => ({
          label: item.lastName,
          value: item.customerId,
        }))
        : [];
      this.mainForm.updateList("salesPerson", arr);
      this.mainForm.form.get("salesPerson").patchValue(arr[0]?.value);
    }
  }

  async getProductProgram() {
    // this.baseSvc.data.showLoader();
    const originatorNo = this.mainForm.form.get("originatorNumber").value;
    const introducerId = this.dashboardService?.userOptions?.find(
      (dealer) => dealer.value.num === originatorNo
    )?.id;

    if (introducerId) {
      let res = await this.baseSvc.getFormData(
        `Product/get_programs_products?introducerId=${introducerId}`
      );
      if (res?.data) {
        this.productProgramList = res?.data;
        let productdata = res?.data?.products;
        let programData = res?.data?.programs;
        this.productList = Array.isArray(productdata)
          ? productdata
            .map((item) => ({
              label: item.name,
              value: item.productId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
          : [];
        this.programList = Array.isArray(programData)
          ? programData
            .map((item) => ({
              label: item.name,
              value: item.programId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
          : [];
      }
    }

    if (this.productCode || this.sessionProductCode) {
      let productList = this.productProgramList?.products.filter(
        (product) =>
          product.code?.includes(this.productCode) ||
          product.code?.includes(this.sessionProductCode)
      );
      let productJson = Array.isArray(productList)
        ? productList
          .map((item) => ({
            label: item.name,
            value: item.productId,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
        : [];
      await this.mainForm.updateList("productId", productJson);
    } else {
      await this.mainForm.updateList("productId", this.productList);
    }
    if (this.mainForm.form.get("productId")?.value) {
      this.setProgram(this.mainForm.form.get("productId")?.value);
    }
  }

  async getProductProgramForInternalSales() {
    let res = await this.baseSvc.getFormData(
      `Product/get_programs_products?introducerId=${0}`
    );
    if (res?.data) {
      this.productProgramList = res?.data;
      let productdata = res?.data?.products;
      let programData = res?.data?.programs;
      this.productList = Array.isArray(productdata)
        ? productdata
          .map((item) => ({
            label: item.name,
            value: item.productId,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
        : [];
      this.programList = Array.isArray(programData)
        ? programData
          .map((item) => ({
            label: item.name,
            value: item.programId,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
        : [];
    }

    if (this.productCode || this.sessionProductCode) {
      let productList = this.productProgramList?.products.filter(
        (product) =>
          product.code?.includes(this.productCode) ||
          product.code?.includes(this.sessionProductCode)
      );
      let productJson = Array.isArray(productList)
        ? productList
          .map((item) => ({
            label: item.name,
            value: item.productId,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
        : [];
      await this.mainForm.updateList("productId", productJson);
    } else {
      await this.mainForm.updateList("productId", this.productList);
    }
    if (this.mainForm.form.get("productId")?.value) {
      this.setProgram(this.mainForm.form.get("productId")?.value);
    }
  }

  async setProgram(productId) {
    if (this.sessionProductCode === "AFV" || this.productCode === "AFV") {

      return;
    }
    let programOptions = this.productProgramList?.programs?.filter(
      (program) => program.productId === productId
    );
    let programJson = Array.isArray(programOptions)
      ? programOptions
        ?.map((item) => ({
          label: item.name,
          value: item.programId,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      : [];
    if (programJson?.length == 1) {
      //this.mainForm.get("programId").patchValue(programJson[0]?.value);
      // this.mainForm.get("programId").disable();
      // this.standardService.programChange.next(programJson[0]?.value);
    }

    let selectedProduct = this.productProgramList?.products?.find(
      (product) => product.productId === productId
    );
    this.standardService.setBaseDealerFormData({
      businessModel: selectedProduct?.businessModel,
    });
    await this.mainForm.updateList("programId", programJson);
  }

  async checkProductProgram() {
    // this.standardService.onDealerChange.next(false);
    const productId = this.mainForm.form.get("productId")?.value;
    if (productId) {
      const checkProduct = this.productList.some(
        (product) => product.value === productId
      );
      const programId = this.mainForm.form.get("programId")?.value;
      let checkProgram = true;
      if (checkProduct && programId) {
        checkProgram = this.productProgramList?.programs?.some(
          (program) =>
            program.programId === programId && program.productId === productId
        );
      }

      if (!checkProduct || !checkProgram) {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "err_checkProductProgarmMsg",
        });
        this.standardService.onDealerChange.next(true);
        this.standardService.activeStep = 0;
        const originatorNo = Number(
          sessionStorage.getItem("dealerPartyNumber")
        );
        const originatorName = sessionStorage.getItem("dealerPartyName");
        this.mainForm?.form?.get("originatorName")?.patchValue(originatorName);
        this.mainForm?.form?.get("originatorNumber")?.patchValue(originatorNo);
      } else {
        if (this.dashboardService.isDealerCalculated) {
          this.baseSvc.forceToClickCalculate.next(true);
        }
        this.standardService.onDealerChange.next(false);

        // this.standardService.forceToClickCalculate.next(true);

        // if (this.baseFormData?.isDealerChange) {
        //   this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail:"err_calculateMsg",
        // });
        // }
      }
      this.setProgram(productId);
    }
  }
}
