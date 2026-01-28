import {
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BaseFormClass,
  CommonService,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { QuickQuoteService } from "../../services/quick-quote.service";
import { AssetTypesComponent } from "../../../components/asset-types/asset-types.component";
import { firstValueFrom, map,  Subject } from "rxjs";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import configure from "../../../../../public/assets/configure.json";
import {  MessageService } from "primeng/api";
import { AfvAssetTypesComponent } from "../../../components/afv-asset-types/afv-asset-types.component";

@Component({
  selector: "app-create-quick-quote",
  templateUrl: "./create-quick-quote.component.html",
  styleUrl: "./create-quick-quote.component.scss",
})
export class CreateQuickQuoteComponent extends BaseFormClass {
  frequencyList: any;
  closeBtn: boolean = false;
  cashPrice = 0;
  selectedAsset: any;

  result: boolean = false;

  // parent to child data
  @Input() quickQuoteData: any;
  @Input() index: number;

  //child to parent data
  @Output() buttonEvent = new EventEmitter<boolean>();
  @Output() dataEmitter = new EventEmitter<boolean>();
  @Output() formSubmitted = new EventEmitter<any>();

  termOptions = [
    { label: "12", value: 12 },
    { label: "24", value: 24 },
    { label: "36", value: 36 },
    { label: "48", value: 48 },
    { label: "60", value: 60 },
  ];
  isLoading: boolean = false;
  isHide: boolean = false;
  ind: number;
  calculatedResult: any;
  standardQuote: any;
  assetFlag: boolean = false;

  programlist: any = [];
  // productList: any = [];
  // productProgramList: any;

  frequencySortOrder = [
    "Daily",
    "Weekly",
    "Fortnightly",
    "Semi Monthly",
    "Four Weekly",
    "Monthly",
    "Quarterly",
    "Semi Annual",
    "Annual",
    "On Maturity",
    "Synch with installment",
    "None",
  ];

  // override formConfig: GenericFormConfig = {
  //   autoResponsive: true,
  //   api: "quickQuote",
  //   goBackRoute: "dashboard",
  //   cardType: "non-border",
  //   fields: [
  //     {
  //       type: "select",
  //       name: "productId",
  //       label: "Product",
  //       placeholder: "--Select--",
  //       alignmentType: "vertical",
  //       cols: 6,
  //       className: "placeholderLabel pl-0 mb-seven",
  //       inputClass: "col-12 px-0",
  //       labelClass: "px-0",
  //       options: [],
  //       // list$: "Product/get_products",
  //       idKey: "productId",
  //       filter: true,
  //     },
  //     {
  //       type: "select",
  //       name: "programId",
  //       label: "Program",
  //       placeholder: "--Select--",
  //       alignmentType: "vertical",
  //       options: this.programlist,
  //       // list$: "Program/get_programs",
  //       cols: 6,
  //       className: "placeholderLabel",
  //       inputClass: "col-12 px-0",
  //       labelClass: "px-0",
  //       idKey: "programId",
  //       filter: true,
  //     },
  //     {
  //       type: "select",
  //       name: "dealerId",
  //       label: "Dealer",
  //       // placeholder: "--Select Dealer--",
  //       cols: 12,
  //       options: this.dealerList,
  //       idKey: "partyId",
  //       labelClass: "col-7 mt-2 px-2 font-bold",
  //       inputClass: "col-5",
  //       alignmentType: "horizontal",
  //       hidden: true,
  //     },
  //     {
  //       type: "text-select",
  //       placeholder: "Asset Type",
  //       label: "Asset Type",
  //       name: "assetTypeDD",
  //       disabled: false,
  //       hidden: true,
  //       cols: 12,
  //       onlyButtonDisable: true,
  //     },

  //     {
  //       type: "select",
  //       label: "Calculate For",
  //       name: "calculateFor",
  //       options: [
  //         { label: "Payment", value: "Payment" },
  //         { label: "Deposit", value: "Deposit" },
  //         { label: "Balloon", value: "Balloon" },
  //         { label: "Cash Price", value: "Cash Price" },
  //       ],
  //       labelClass: "col-7 mt-2 px-2",
  //       inputClass: "col-5",
  //       disabled: true,
  //       hidden: true,
  //       cols: 12,
  //       alignmentType: "horizontal",
  //     },

  //     {
  //       type: "text",
  //       label: "Year",
  //       name: "yearValue",
  //       className: "pb-0",
  //       cols: 12,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2 pb-0",
  //       inputClass: "col-3 ",
  //       hidden: true,
  //     },
  //     {
  //       type: "amount",
  //       label: "Cash Price",
  //       name: "cashPriceValue",
  //       cols: 12,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
  //       hidden: true,
  //       default: 0,

  //       // validators: [Validators.required, Validators.max(9999999)],   //mine comment
  //     },
  //     {
  //       type: "amount",
  //       label: "Initial Lease Amount",
  //       name: "firstLeasePayment",
  //       cols: 12,
  //       className: "pb-0",
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5 pr-0",
  //       hidden: true,
  //       disabled: true,
  //       default: 0,
  //       onlyButtonDisable: true,
  //       // validators: [Validators.min(0),Validators.pattern('^[0-9]{1,7}(\\.[0-9]{1,2})?$'), // Allowing multiple digits
  //       // ],  //mine comment
  //     },

  //     {
  //       type: "percentage",
  //       name: "depositPct",
  //       label: "Deposit",
  //       default: 0,
  //       // suffix: '%',
  //       // maxFractionDigits: 2,
  //       cols: 6,
  //       inputType: "horizontal",
  //       labelClass: "col-6 mt-2",
  //       inputClass: "col-6 px-0 ",
  //       hidden: true,
  //     },

  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "OR",
  //       name: "depositOR",
  //       cols: 1,
  //       className: "my-auto text-center",
  //       hidden: true,
  //     },
  //     {
  //       type: "amount",
  //       name: "deposit",
  //       cols: 5,
  //       nextLine: true,
  //       className: "",
  //       // validators: [Validators.min(0)],    //mine comment
  //       default: 0,
  //       hidden: true,
  //     },
  //     {
  //       type: "percentage",
  //       label: "Interest Rate %",
  //       name: "interestRate",
  //       default: 0,
  //       // suffix: '%',
  //       // maxFractionDigits: 2,
  //       cols: 12,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
  //       hidden: true,
  //       // validators: [Validators.required,Validators.max(99),Validators.maxLength(2),
  //       //],   //mine comment
  //     },
  //     // {
  //     //   type: "select",
  //     //   label: "Termdd (Months)",
  //     //   name: "term",
  //     //   cols: 12,
  //     //   options: this.termOptions,
  //     //   alignmentType: "horizontal",
  //     //   labelClass: "col-7 mt-2",
  //     //   inputClass: "col-5",
  //     //   hidden: true,
  //     // },
  //     {
  //       type: "number",
  //       label: "Terms (Months)",
  //       name: "term",
  //       cols: 12,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
  //       hidden: true,
  //     },

  //     {
  //       //type: "number",
  //       type: "select",
  //       label: "KM Allowance",
  //       name: "kmAllowance",
  //       cols: 12,
  //       default: 0,
  //       hidden: true,
  //       alignmentType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
  //       options: [{ label: "10", value: "10" }],
  //     },

  //     {
  //       type: "select",
  //       label: "Frequency",
  //       name: "frequency",
  //       cols: 12,
  //       // list$: "LookUpServices/lookups?LookupSetName=InstallmentFrequency",
  //       // idKey: "lookupValue",
  //       // idName: "lookupValue",
  //       alignmentType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5",
  //       hidden: true,
  //       resetOnHidden: true,
  //     },

  //     {
  //       type: "amount",
  //       label: "Lease Payment",
  //       name: "leasePayment",
  //       cols: 12,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2 d-flex align-items-center px-0",
  //       inputClass: "col-5 px-0",
  //       hidden: true,
  //       resetOnHidden: true,
  //       // disabled: true,
  //       mode: Mode.label,
  //     },

  //     {
  //       type: "amount",
  //       label: "Payment",
  //       name: "payment",
  //       cols: 12,
  //       labelClass: "col-7 mt-2 px-0",
  //       inputClass: "col-5",
  //       hidden: true,
  //       resetOnHidden: true,
  //       inputType: "horizontal",
  //       mode: Mode.label,
  //       // disabled: true,
  //       // mode: Mode.label,
  //     },

  //     {
  //       type: "percentage",
  //       name: "balloonPct",
  //       // suffix: '%',
  //       label: "Balloon",
  //       // maxFractionDigits: 2,
  //       cols: 5,
  //       // validators: [Validators.max(99), Validators.min(0)],  // //mine comment
  //       inputType: "horizontal",
  //       labelClass: "col-6 mt-2",
  //       inputClass: "col-6 px-0 ",
  //       hidden: true,
  //       default: 0,
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "OR",
  //       name: "balloonOR",
  //       hidden: true,
  //       cols: 1,
  //       className: "my-auto text-center",
  //     },
  //     {
  //       type: "amount",
  //       name: "balloonAmount",
  //       className: "",
  //       cols: 4,
  //       default: 0,
  //       // validators: [Validators.min(0),Validators.pattern('^[0-9]{1,7}(\\.[0-9]{1,2})?$'),
  //       //],  //mine comment
  //       hidden: true,
  //     },

  //     {
  //       type: "percentage",
  //       // name: "residualValue",
  //       name: "pctResidualValue",
  //       // suffix: '%',
  //       label: "Residual Value",
  //       // maxFractionDigits: 2,
  //       className: "pb-0",
  //       cols: 6,
  //       default: 0,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5 px-0 ",
  //       hidden: true,
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "OR",
  //       name: "residualOR",
  //       cols: 1,
  //       hidden: true,
  //       className: "my-auto text-center",
  //     },
  //     {
  //       type: "amount",
  //       hidden: true,
  //       // name: "residualAmount",
  //       name: "residualValue",
  //       className: "",
  //       cols: 5,
  //       default: 0,
  //       // validators: [Validators.pattern('^[0-9]{1,7}(\\.[0-9]{1,2})?$')],  //mine comment
  //     },
  //     {
  //       type: "checkbox",
  //       label: "Fixed",
  //       name: "isFixed",
  //       cols: 2,
  //       className: "mt-2 pl-0 text-right",
  //       hidden: true,
  //     },
  //     {
  //       type: "amount",
  //       label: "Assured Future Value",
  //       name: "assuredFutureValue",
  //       default: 0,
  //       className: "pb-0",
  //       cols: 12,
  //       inputType: "horizontal",
  //       labelClass: "col-6 mt-2",
  //       inputClass: "col-4 px-0",
  //       hidden: true,
  //     },
  //     {
  //       type: "number",
  //       label: "No. of Rentals in Advance",
  //       name: "advanceRent",
  //       className: "pb-0",
  //       maxFractionDigits: 2,
  //       hidden: true,
  //       cols: 12,
  //       // default: 0,
  //       inputType: "horizontal",
  //       labelClass: "col-7 mt-2",
  //       inputClass: "col-5 px-0",
  //       // validators: [Validators.pattern('^[0-9]{1,3}$')],   //mine comment
  //     },
  //     {
  //       type: "button",
  //       label: "Calculate",
  //       name: "submit",
  //       submitType: "internal",
  //       className: "",
  //       cols: 12,
  //       hidden: true,
  //     },
  //     {
  //       type: "text",
  //       name: "assetTypeModalValues",
  //       hidden: true,
  //     },
  //     {
  //       type: "number",
  //       name: "assetTypeId",
  //       hidden: true,
  //     },
  //     {
  //       type: "checkbox",
  //       label: "checkDisable",
  //       name: "createQuickQuote",
  //       hidden: true,
  //       default: false,
  //     },

  //     {
  //       type: "number",
  //       name: "assetTypePath",
  //       hidden: true,
  //     },
  //   ],
  // };

    override formConfig: any = {
    autoResponsive: true,
    api: 'quickQuote',
    goBackRoute: 'dashboard',
    cardType: 'non-border',
    fields: [],
  };

  assetTypeData: any;
  assetTypeModalValues: any;
  productCode: any;
  checkProduct: any;
  termO: any;
  sessionProductCode: string;
  hideQuote: boolean;
  destroy$ = new Subject<void>();

  constructor(
    // public baseSvc: QuickQuoteService,
    public override route: ActivatedRoute,
    public override svc: CommonService,
    private router: Router,
    public baseSvc: QuickQuoteService,
    public stdSvc: StandardQuoteService,
    private cdr: ChangeDetectorRef,
    private validationSvc: ValidationService,
    private dashboardSvc: DashboardService,
    private toasterSvc: ToasterService,
    private messageService: MessageService
  ) {
    super(route, svc);
    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
      config,
      "CreateQuickQuoteComponent",
      "QuickQuoteComponent"
    );
    this.formConfig = { ...this.formConfig, fields: filteredValidations };

    this.baseSvc.formDataCacheableRoute([
      "Product/get_programs_products",
      "AssetType/get_assettype",
    ]);
    this.svc.data.postCacheableRoutes(["LookUpServices/CustomData"]);
    this.svc.data.getCacheableRoutes([
      "LookUpServices/lookups?LookupSetName=InstallmentFrequency",
    ]);

    effect(async () => {
      let dealer = this.dashboardSvc?.onOriginatorChange();
      if (!dealer) return;
      this.hideQuote = false;
      const currentRoute = this.router.url;
      if (currentRoute == "/dealer/quick-quote") {
        await this.getProductProgram();
        await this.checkProductProgram();
      }
    });

    //     if((sessionStorage.getItem("externalUserType") == "Internal" )){
    //    const selectedOperatingUnit = this.baseSvc.getOperatingUnit();
    //    if(selectedOperatingUnit){
    //   this.svc?.data?.getCacheableRoutes([`CustomerDetails/get_allparty?partyType=Dealer&operatingUnit=${selectedOperatingUnit[0]?.partyId}`]);
    //   }
    // }
  }

  override async ngOnInit() {
    this.formConfig.createData = this.baseSvc.quickQuoteData[this.index];
    await super.ngOnInit();
    const calculateForOptionsList = [
      { label: "Payment", value: "Payment" },
      { label: "Deposit", value: "Deposit" },
      { label: "Balloon", value: "Balloon" },
      { label: "Cash Price", value: "Cash Price" },
    ];
    this.mainForm.updateList("calculateFor", calculateForOptionsList);

    this.ind = this.index;

    // sessionStorage.removeItem("productCode");
    this.sessionProductCode = sessionStorage.getItem("productCode");
    // const dealer = this.dashboardSvc?.onOriginatorChange.getValue?.();
    // if (dealer) {
    //   this.getProductProgram();
    //   this.checkProductProgram();
    // }

    // this.dashboardSvc?.onOriginatorChange
    //   .pipe(takeUntil(this.destroy$), skip(1))
    //   .subscribe(async (dealer) => {
    //     if (!dealer) return;
    //     this.hideQuote = false;
    //     const currentRoute = this.router.url;
    //     if (currentRoute == "/dealer/quick-quote") {
    //       await this.getProductProgram();
    //       await this.checkProductProgram();
    //       // const messages: Message[] = this.errorsMessageArray.map(
    //       //   (errorMessage) => ({
    //       //     severity: errorMessage.severity,
    //       //     detail: errorMessage.message,
    //       //   })
    //       // );
    //       // setTimeout(() => {
    //       //   if (this.errorsMessageArray.length > 0) {
    //       //     this.toasterSvc.showMultiple(messages);
    //       //     this.errorsMessageArray = [];
    //       //   }
    //       // }, 1000);
    //     }
    //   });

    if (this.baseSvc.quickQuoteData.length >= 1 && this.ind > 0) {
      this.updateFieldBasedOnCondition();

      if (sessionStorage.getItem("externalUserType") == "Internal") {
        this.mainForm.updateList("productId", this.baseSvc.productList);
        this.mainForm.updateList("dealerId", this.baseSvc.internalSalesDealerList);
        this.mainForm?.form
          ?.get("dealerId")
          ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.dealerId || 0);
      }
      this.mainForm.form
        .get("cashPriceValue")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.cashPriceValue || 0);
      this.mainForm.form
        .get("kmAllowance")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.kmAllowance || 0);
      this.mainForm.form.get("firstLeasePayment")?.setValue(
        // this.baseSvc?.quickQuoteData[this.ind]?.firstLeasePayment || 0
        this.baseSvc?.quickQuoteData[this.ind]?.firstLeasePayment || 0
      );
      this.mainForm.form
        .get("leasePayment")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.leasePayment || 0);
      this.mainForm.form
        .get("assuredFutureValue")
        ?.setValue(
          this.baseSvc?.quickQuoteData[this.ind]?.assuredFutureValue || 0
        );
      this.mainForm.form
        .get("isFixed")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.isFixed || false);
      this.mainForm
        .get("interestRate")
        ?.setValue(
          parseFloat(
            parseFloat(
              this.baseSvc?.quickQuoteData[this.ind]?.interestRate
            ).toFixed(2)
          ) || 0
        );

      this.mainForm.form
        .get("programId")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.programId);

      this.mainForm.get("term").enable();
      // this.mainForm.updateHidden({ term: false, terms: true });
      this.mainForm
        .get("term")
        ?.setValue(
          parseFloat(
            parseFloat(this.baseSvc?.quickQuoteData[this.ind]?.term).toFixed(2)
          ) || 0
        );

      this?.setTermDropDown(this.baseSvc?.quickQuoteData[this.ind]?.programId);

      this.mainForm.form
        .get("depositPct")
        ?.setValue(
          parseFloat(
            (this.baseSvc?.quickQuoteData[this.ind]?.depositPct || 0).toFixed(3)
          )
        );

      this.mainForm.form
        .get("payment")
        ?.setValue(
          parseFloat(
            (this.baseSvc?.quickQuoteData[this.ind]?.payment || 0).toFixed(3)
          )
        );
      this.mainForm.form
        .get("deposit")
        ?.setValue(
          parseFloat(
            (this.baseSvc?.quickQuoteData[this.ind]?.deposit || 0).toFixed(2)
          )
        );

      this.mainForm.form
        .get("calculateFor")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.calculateFor);
      this.mainForm.form
        .get("frequency")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.frequency);

      this.mainForm.form
        .get("productId")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.productId || 0);

      this.mainForm.form
        .get("assetTypeModalValues")
        ?.setValue(
          this.baseSvc?.quickQuoteData[this.ind]?.assetTypeModalValues || 0
        );
      this.mainForm
        .get("assetTypeDD")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.assetTypePath || 0);
      this.mainForm.form
        .get("balloonPct")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.balloonPct);
      this.mainForm
        .get("balloonAmount")
        ?.setValue(
          parseFloat(
            parseFloat(
              this.baseSvc?.quickQuoteData[this.ind]?.balloonAmount
            ).toFixed(2)
          ) || 0
        );
      this.mainForm.form
        .get("pctResidualValue")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.pctResidualValue);
      this.mainForm.form
        .get("residualValue")
        ?.setValue(this.baseSvc?.quickQuoteData[this.ind]?.residualValue);
      this.mainForm.form.updateValueAndValidity();
    }
    this?.updateFieldBasedOnCalcFor();
    if (this.ind == 0) {
      this.mainForm.updateProps("calculateFor", {
        type: "text",
        inputType: "horizontal",
        mode: Mode.label,
        inputClass: "text-right col-5",
        labelClass: "col-7 mt-2 px-0",
      });
      this.mainForm.get("calculateFor").patchValue("Payment");
      // this.baseFormData?.calculateFor = "Payment";
    }
    // await this.updateValidation("onInit");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  async callApi(programId?: string) {
    // const programId = this.mainForm.form.get("programId")?.value;
    this.assetTypeData = await this.baseSvc.getFormData(
      `AssetType/get_assettype?programId=${programId}&PageNo=1&PageSize=500`,
      function (res) {
        return res.data.asset || null;
      }
    );
    await this.loadAssetTypeData();
  }

  updateFieldBasedOnCalcFor() {
    if (this.mainForm.get("calculateFor").value == "Payment") {
      this.mainForm.updateProps("depositPct", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("deposit", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("cashPriceValue", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("balloonPct", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("balloonAmount", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("payment", {
        mode: Mode.label,
        labelClass: "col-7 mt-2 px-0",
      });
      this?.mainForm?.get("isFixed")?.enable();

      if (
        this.mainForm.get("calculateFor").value == "Payment" &&
        this.calculatedResult?.cashPriceValue > 0
      ) {
        this.mainForm
          .get("cashPriceValue")
          ?.patchValue(this.calculatedResult?.cashPriceValue);
      }
    }

    if (this.mainForm.get("calculateFor").value == "Cash Price") {
      this.mainForm.updateProps("depositPct", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("deposit", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("cashPriceValue", {
        mode: Mode.view,
        className: "border-0",
      });
      this.mainForm.updateProps("balloonPct", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("balloonAmount", {
        mode: Mode.edit,
        className: "",
      });

      this.mainForm.updateProps("payment", {
        mode: Mode.edit,
        labelClass: "col-7 mt-2 px-2",
      });
      this?.mainForm?.get("isFixed")?.enable();
      this.mainForm.get("balloonAmount")?.patchValue(0);
      this.mainForm.get("balloonPct")?.patchValue(0);
      this.mainForm.get("deposit")?.patchValue(0);
      this.mainForm.get("depositPct")?.patchValue(0);
      this.mainForm.get("cashPriceValue")?.patchValue(0);
    }
    if (this.mainForm.get("calculateFor").value == "Deposit") {
      this.mainForm.updateProps("depositPct", {
        mode: Mode.view,
        className: "border-0",
      });
      this.mainForm.updateProps("deposit", {
        mode: Mode.view,
        className: "border-0",
      });
      this.mainForm.updateProps("cashPriceValue", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("balloonPct", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("balloonAmount", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("payment", {
        mode: Mode.edit,
        labelClass: "col-7 mt-2 px-2",
      });
      this?.mainForm?.get("isFixed")?.enable();

      //this.mainForm.get("depositPct")?.patchValue(0);
      //this.mainForm.get("deposit")?.patchValue(0);
    }
    if (this.mainForm.get("calculateFor").value == "Balloon") {
      this.mainForm.updateProps("balloonPct", {
        mode: Mode.view,
        className: "border-0",
      });
      this.mainForm.updateProps("balloonAmount", {
        mode: Mode.view,
        className: "border-0",
      });
      this.mainForm.updateProps("depositPct", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("deposit", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("cashPriceValue", {
        mode: Mode.edit,
        className: "",
      });
      this.mainForm.updateProps("payment", {
        mode: Mode.edit,
        className: "",
        labelClass: "col-7 mt-2 px-2",
      });
      this.mainForm.get("balloonAmount")?.patchValue(0);
      this.mainForm.get("isFixed")?.patchValue(false);
      this?.mainForm?.get("isFixed")?.disable();

      this.mainForm.get("balloonPct")?.patchValue(0);
    }
  }

  override async onFormReady(): Promise<void> {
    // await this.getProductProgram();

    if (sessionStorage.getItem("externalUserType") == "Internal") {
      await this.getProductProgramForInternalSales();
      this.mainForm?.updateHidden({ dealerId: false });
      this.cdr.detectChanges();
    }

    this.baseSvc?.getBaseDealerFormData().subscribe((res) => {
      this.productCode = res.productCode;
    });

    await this.updateValidation("onInit");
    super.onFormReady();

    (await this.mainForm.getOptions("frequency")).sort((a, b) => {
      return (
        this.frequencySortOrder.indexOf(a.value) -
        this.frequencySortOrder.indexOf(b.value)
      );
    });
  }

  showSelectAssetType() {
    let asset;
    this.svc.dialogSvc
      .show(AssetTypesComponent, "Asset Type", {
        templates: {
          footer: null,
        },
        data: {
          assetTypeData: this.assetTypeData,
          assetTypeModalValues: this.mainForm.get("assetTypeModalValues").value,
        },
        width: "60vw",
      })
      .onClose.subscribe((data) => {
        if (data?.btnType == "submit") {
          asset = data?.assetTypeData;
          asset;
          this.mainForm
            .get("assetTypeDD")
            .patchValue(data?.assetTypeData || "");
          this.mainForm
            .get("assetTypePath")
            .patchValue(data?.assetTypeData || "");
          this.assetTypeModalValues = data?.assetTypeValues || "";
          this.mainForm
            .get("assetTypeModalValues")
            .patchValue(this.assetTypeModalValues);
          this.mainForm.get("assetTypeId").patchValue(data?.assetTypeId);
        }
      });
  }

  showAfvSelectAssetType() {
    let asset;
    this.svc.dialogSvc
      .show(AfvAssetTypesComponent, "Select Asset ", {
        templates: {
          footer: null,
        },
        data: {
          assetTypeData: this.assetTypeData,
          assetTypeModalValues: this.mainForm.get("assetTypeModalValues").value,
          afvYear: this.baseFormData?.afvYear,
        },
        width: "30vw",
      })
      .onClose.subscribe(async (data) => {
        if (data?.btnType == "submit") {
          this.mainForm
            ?.get("assetTypeDD")
            .patchValue(data?.assetTypeData || "");
          this.assetTypeModalValues = data?.assetTypeValues || "";
          this.mainForm
            ?.get("assetTypeModalValues")
            .patchValue(this.assetTypeModalValues);
          this.mainForm?.get("assetTypeId").patchValue(data?.assetTypeId);

          (this.baseFormData.physicalAsset[0].make = data?.data?.afvMake),
            (this.baseFormData.physicalAsset[0].model = data?.data?.afvModel),
            (this.baseFormData.physicalAsset[0].year = data?.data?.afvYear),
            (this.baseFormData.physicalAsset[0].variant =
              data?.data?.afvVariant);
          let defaults = [];
          (this.baseFormData.afvMake = data?.data?.afvMake),
            (this.baseFormData.afvModel = data?.data?.afvModel),
            (this.baseFormData.afvYear = data?.data?.afvYear),
            (this.baseFormData.afvVariant = data?.data?.afvVariant);
          const programId = this.mainForm.get("programId")?.value;

          if (programId) {
            let defaults = [];
            await this.baseSvc.contractPreview(
              this.baseFormData,
              defaults,
              "asset"
            );
          } else {
          }

          if (this.baseFormData.assetTypeId) {
            const programsLoaded = await this.fetchAfvPrograms();
          }
        }
      });
  }

  async checkCurrentProduct(checkProduct: string) {
    if (checkProduct == "AFV") {
      this.mainForm.updateList("term", this.termOptions);
      this.mainForm?.updateHidden({
        kmAllowance: false,
        assetTypeDD: false,
        assuredFutureValue: false,
        balloonOR: true,
        balloonPct: true,
        balloonAmount: true,
        isFixed: true,
      });

      this.mainForm?.updateClass(
        { kmAllowance: "col-offset-2 col-4" },
        "inputClass"
      );
      this.mainForm?.updateClass(
        { assuredFutureValue: "col-offset-2 col-4" },
        "inputClass"
      );
      this.mainForm?.updateClass(
        { interestRate: "col-offset-2 col-4" },
        "inputClass"
      );
      this.mainForm?.updateClass({ term: "col-offset-2 col-4" }, "inputClass");
      this.mainForm?.updateClass(
        { cashPriceValue: "col-offset-2 col-4" },
        "inputClass"
      );
      this.mainForm?.updateClass({ deposit: "px-2 col-4" }, "className");
      this.mainForm?.updateCols({ depositPct: 7 });
    } else if (checkProduct == "FL") {
      this.mainForm?.updateHidden({
        // kmAllowance: true,
        assetTypeDD: true,
        assuredFutureValue: true,
        balloonOR: true,
        balloonPct: true,
        balloonAmount: true,
        isFixed: true,
        depositOR: true,
        deposit: true,
        depositPct: true,
        advanceRent: true,
        pctResidualValue: false,
        residualValue: false,
        residualOR: false,
        // firstLeasePayment: false,
      });


      this.mainForm?.updateClass(
        { pctResidualValue: "col-offset-1 col-4" },
        "inputClass"
      );
      this.mainForm?.updateClass(
        { firstLeasePayment: "col-offset-1 col-4" },
        "inputClass"
      );
      // this.mainForm?.updateClass({ term: "col-offset-2 col-4" }, "inputClass");
      this.mainForm?.updateClass(
        { interestRate: "col-offset-2 col-4" },
        "inputClass"
      );
      this.mainForm?.updateCols({ pctResidualValue: 7 });
      this.mainForm?.updateClass({ pctResidualValue: "col-5" }, "inputClass");
      this.mainForm?.updateCols({ residualValue: 4 });
      this.mainForm?.updateClass(
        { cashPriceValue: "col-offset-2 col-4" },
        "inputClass"
      );
    } else {
      this.mainForm.get("pctResidualValue").clearValidators();
     
    }
  }
  override async onButtonClick(event: any): Promise<void> {
    if (event.field.name == "assetTypeDD") {
      //this.showSelectAssetType();
      this.showAfvSelectAssetType();
    }

    const defaulting = [];
    if (event.field.label == "Calculate") {
      const validation = this.checkValidate();
      const valiationsubmit = await this.updateValidation(event);
      if (validation != "INVALID" && valiationsubmit) {
        const formValue = this.mainForm.form.value;

        let dataMapped = await this.baseSvc.contractPreview(
          // this.mainForm.form.value,
          formValue,
          defaulting,
          null
        );

        this.calculatedResult = dataMapped;
        // this.mainForm
        //   .get("firstLeasePayment")
        //   .patchValue(this.calculatedResult?.firstLeasePayment);
        // const flow = this.stdSvc.getFirstInstallmentFlow(this.mainForm.form.value);

        const flow =
          this.calculatedResult?.flows?.find(
            (f) => f.flowType === "Installment" && f.installmentNo === 2
          ) || null;

        if (this.sessionProductCode === "FL") {
          const firstLeasePayment = this.mainForm.form.value?.firstLeasePayment;

          const valueToPatch =
            firstLeasePayment && firstLeasePayment > 0
              ? this.calculatedResult?.firstLeasePayment
              : flow?.amtGross;

          this.mainForm.form
            ?.get("firstLeasePayment")
            ?.patchValue(valueToPatch);
          // this.mainForm.form?.get("leasePayment")?.patchValue(valueToPatch);
          this.mainForm.form?.get("leasePayment")?.patchValue(flow?.amtGross);
        } else {
          this.mainForm
            .get("payment")
            ?.patchValue(this.calculatedResult?.paymentAmount);
        }

        this.mainForm
          .get("balloonPct")
          .patchValue(this.calculatedResult?.balloonPct);
        this.mainForm
          .get("balloonAmount")
          .patchValue(this.calculatedResult?.balloonAmount);

        //code addded for deposite and depositpct to be patched after calculation
        if (this.calculatedResult?.deposit > 0) {
          this.mainForm
            .get("deposit")
            .patchValue(this.calculatedResult?.deposit);
          this.mainForm
            .get("depositPct")
            .patchValue(this.calculatedResult?.depositPct);
        }
        // this.mainForm
        //   // .get("payment")
        //   .get("leasePayment")
        //   .patchValue(this.calculatedResult?.paymentAmount);
        this.mainForm
          .get("interestRate")
          .patchValue(this.calculatedResult?.interestRate);
        this.mainForm
          .get("cashPriceValue")
          .patchValue(this.calculatedResult?.cashPriceValue);
        // this.mainForm.get("payment").patchValue(this.calculatedResult?.paymentAmount);
        this.mainForm.get("term").patchValue(this.calculatedResult?.term);

        this.mainForm
          .get("frequency")
          .patchValue(this.calculatedResult?.frequency);

        //For FL
        this.mainForm
          .get("pctResidualValue")
          .patchValue(this.calculatedResult?.pctResidualValue);
        this.mainForm
          .get("residualValue")
          .patchValue(this.calculatedResult?.residualValue);

        this.mainForm.updateProps("calculateFor", {
          inputClass: "col-5",
        });
        this.mainForm.updateProps("calculateFor", {
          type: "select",
          alignmentType: "horizontal",
          inputClass: "text-left col-5",
          labelClass: "col-7 mt-2 px-2",
        });

        this.result = true;
        this.hideQuote = true;
        this.formSubmitted.emit(true);
        if (this.result == true && this.hideQuote == true) {
          // this.mainForm.updateDisable()
          this.buttonEvent.emit(false);
        }
        this.dashboardSvc.isDealerCalculated = false;
      }
      this.updateValidation("onSubmit");
      this.mainForm.get("calculateFor").enable();
    }
  }

  override onValueChanges(event: any): void {
    if (event.productId != null) {
    }

    if (event?.cashPriceValue) {
      this.mainForm
        ?.get("deposit")
        .setValidators([Validators.max(event?.cashPriceValue)]);
      this.mainForm
        ?.get("balloonAmount")
        .setValidators([Validators.max(event?.cashPriceValue)]);
      this.mainForm
        ?.get("residualValue")
        .setValidators([Validators.max(event?.cashPriceValue)]);
      if (this.checkProduct == "FL") {
        // if (this.mainForm.get("cashPriceValue").value > 0) {
        this.mainForm.updateValidators("residualValue", [
          Validators.max(this.mainForm.get("cashPriceValue").value),
        ]);
        //         } else {
        // // this.mainForm.removeValidators("pctResidualValue", [Validators.required, Validators.max(100), Validators.min(1)]);
        // // this.mainForm.updateValidators("pctResidualValue", []);
        // }
      }
    }

    this.baseSvc.quickQuoteData[this.index] = { ...event };
  }

  async setTermDropDown(programValue) {
    const overrideResponse = await firstValueFrom(
      this.svc.data.post("LookUpServices/CustomData", {
        parameterValues: ["Term Override", String(programValue)],
        procedureName: configure.SPProgramListExtract,
      })
    );

    if (
      overrideResponse?.data?.table &&
      Array.isArray(overrideResponse.data.table)
    ) {
      if (
        (overrideResponse.data.table.length === 1 &&
          overrideResponse.data.table[0].value_id === 0) ||
        overrideResponse.data.table.length === 0
      ) {
        this.mainForm.get("term").enable();
        this.mainForm?.updateProps("term", {
          type: "number",
          inputType: "horizontal",
        });
        this.cdr.detectChanges();
      } else {
        this.termOptions = overrideResponse.data.table.map((item) => ({
          label: item.value_text,
          value: item.value_id,
        }));

        // Update form state and populate term options
        this.mainForm.get("term").enable();
        this.mainForm?.updateProps("term", {
          type: "select",
          alignmentType: "horizontal",
        });

        this.mainForm.updateList(
          "term",
          this.termOptions.sort((a, b) => a.value - b.value)
        );
        this.cdr.detectChanges();
      }
    }
    this.setFrequencyOverride(programValue);
  }

  async setFrequencyOverride(programId: number) {
    const response = await firstValueFrom(
      this.svc.data.post("LookUpServices/CustomData", {
        parameterValues: ["Instalment Freq Override", String(programId)],
        procedureName: configure.SPProgramListExtract,
      })
    );

    if (response?.data?.table && Array.isArray(response.data.table)) {
      if (
        response.data.table.length === 1 &&
        response.data.table[0].value_text === "None"
      ) {
        const lookupRes = await firstValueFrom(
          this.svc.data.get(
            "LookUpServices/lookups?LookupSetName=InstallmentFrequency"
          )
        );

        if (lookupRes?.data) {
          this.frequencyList = lookupRes.data
            .map((item) => ({
              label: item.lookupValue,
              value: item.lookupValue,
            }))
            .sort((a, b) => {
              return (
                this.frequencySortOrder.indexOf(a.value) -
                this.frequencySortOrder.indexOf(b.value)
              );
            });
        }
      } else if (response.data.table.length > 0) {
        this.frequencyList = response.data.table
          .map((item) => ({
            label: item.value_text,
            value: item.value_text,
          }))
          .sort((a, b) => {
            return (
              this.frequencySortOrder.indexOf(a.value) -
              this.frequencySortOrder.indexOf(b.value)
            );
          });
      }

      this.mainForm.updateList("frequency", this.frequencyList);
      this.cdr.detectChanges();
    }
  }

 async getProductProgramForInternalSales() {
     await this.baseSvc.getFormData(
        `Product/get_programs_products?introducerId=${0}`,
        (res) => {
          this.baseSvc.productProgramList = res.data;
          let productdata = res.data?.products;

        this.baseSvc.productList = Array.isArray(productdata)
          ? productdata
              .map((item) => ({
                label: item.name,
                value: item.productId,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))
          : [];

        this.mainForm.updateList("productId", this.baseSvc.productList);

        return res.data.asset || null;
      }
    );
  }

  override async onValueTyped(event) {
    this.hideQuote = false;
    // if (this.index == 0) {
    //   if (event.name == "calculateFor") {
    //     this.baseSvc.quickQuoteData[0].calculateFor = event.data;
    //   }
    // }
    // if (this.index == 1) {
    //   if (event.name == "calculateFor") {
    //     this.baseSvc.quickQuoteData[1].calculateFor = event.data;
    //   }
    // }
    // if (this.index == 2) {
    //   if (event.name == "calculateFor") {
    //     this.baseSvc.quickQuoteData[2].calculateFor = event.data;
    //   }
    // }

    if (this.hideQuote == false) {
      this.buttonEvent.emit(true);
    } else {
      this.buttonEvent.emit(false);
    }

    if (event.name === "productId") {
      this.mainForm?.updateHidden({
        calculateFor: true,
        cashPriceValue: true,
        firstLeasePayment: true,
        deposit: true,
        depositOR: true,
        depositPct: true,
        interestRate: true,
        term: true,
        kmAllowance: true,
        frequency: true,
        leasePayment: true,
        pctResidualValue: true,
        residualOR: true,
        residualValue: true,
        payment: true,
        balloonOR: true,
        balloonPct: true,
        balloonAmount: true,
        isFixed: true,
        submit: true,
      });

      if (event.data) {
        const loanPurpose = await this.baseSvc.getFormData(
          `Product/get_productCustomFields?productId=${event?.data}`
        );

        this.stdSvc.setBaseDealerFormData({
          loanPurpose: loanPurpose?.data?.loanPurpose,
          allowedInsuranceProducts: loanPurpose?.data?.allowedInsuranceProducts,
        });

        let programOptions = this.baseSvc.productProgramList.programs.filter(
          (program) => program.productId === event.data
        );

        if (programOptions && programOptions.length > 0) {
          sessionStorage.removeItem("productCode");
          const selectedProduct = this.baseSvc.productList.find(
            (product) => product.value === event.data
          );
          const productLabel = selectedProduct?.label;
          let productCode = this.dashboardSvc.getCodeByName(productLabel);
          sessionStorage.setItem("productCode", productCode);
          this.sessionProductCode = productCode;

          if (this.sessionProductCode === "AFV") {
            const currentProgramId = this.mainForm.get("programId")?.value;
            const currentAssetTypeId = this.mainForm.get("assetTypeId")?.value;

            if (!currentProgramId && !currentAssetTypeId) {
              await this.updateFieldBasedOnCondition();

              this.mainForm.updateList("programId", []);
              await this.callApi("");

              return;
            }
          }

          this.mainForm
            ?.get("programId")
            ?.patchValue(programOptions[0]?.programId);
          
          if(sessionStorage?.getItem("externalUserType")==="Internal"){
              let product = this.baseSvc?.productProgramList?.products?.find(
              (p) => p?.productId === event?.data
              );
            this.stdSvc.productBusinessModel = product?.businessModel;
            this.baseSvc.internalSalesDealerList = await this.stdSvc.getDealerForInternalSales(programOptions[0]?.programId)
            this.mainForm.updateList('dealerId', this.baseSvc.internalSalesDealerList);
          }
          let defaulting = {};
          let dataMapped = await this.baseSvc.contractPreview(
            this.mainForm.form.value,
            defaulting,
            "program"
          );

          await this.updateFieldBasedOnCondition();

          if (dataMapped) {
            this.calculatedResult = dataMapped;
          }
          this.mainForm.form.patchValue(dataMapped);

          if (this.ind === 0) {
            if (this?.mainForm?.get("calculateFor")?.value === "Payment") {
              this?.mainForm?.get("payment")?.patchValue(0);
            }
          }

          try {
            this?.setTermDropDown(programOptions?.[0]?.programId);
          } catch (error) {
            // console.error("Error during term dropdown setup:", error);
          }

          if (!this?.mainForm?.get("calculateFor")?.value && this.index === 0) {
            this?.mainForm?.get("calculateFor")?.patchValue("Payment");
          }

          try {
            if (
              this.sessionProductCode === "CSA" ||
              this.sessionProductCode === "TL"
            ) {
              await this.stdSvc.getPpsrRateFee();
            }
          } catch (error) {
            console.error("Error calling getPpsrRateFee:", error);
          } finally {
            await this.callApi(programOptions?.[0]?.programId);
          }
        }
      }

    if(sessionStorage?.getItem("externalUserType")==="Internal"){
       const product = this.baseSvc?.productProgramList?.products?.
                       find(product => product.productId === event?.data);
    if(product?.businessModel === "Direct"){
      this.mainForm?.updateDisable({'dealerId': true});
      this.mainForm?.updateProps("dealerId", {className: "disable-dealer-dropdown"});
    }
    else if(product?.businessModel === "Introduced"){
       this.mainForm?.updateDisable({'dealerId': false});
      this.mainForm?.updateProps("dealerId", {className: ""});
    }
  }

    }

    if (event.name == "programId") {
      const currentProductId = this.mainForm.form.get("productId")?.value;
      if (currentProductId) {
        sessionStorage.removeItem("productCode");

        const selectedProduct = this.baseSvc.productList.find(
          (product) => product.value === currentProductId
        );

        const productLabel = selectedProduct?.label || "";
      }

      this.mainForm.updateProps("balloonPct", {
        className: "",
      });
      if (event.data) {
        let defaulting = [];
        let dataMapped = await this.baseSvc.contractPreview(
          this.mainForm.form.value,
          defaulting,
          "program"
        );

        await this.updateFieldBasedOnCondition();

        if (dataMapped) {
          this.calculatedResult = dataMapped;
        }

        this.mainForm.form.patchValue(dataMapped);
        this.mainForm.get("payment").patchValue(0);

        try {
          this?.setTermDropDown(event?.data);
        } catch (error) {}

        if (!this?.mainForm?.get("calculateFor")?.value && this.index == 0) {
          this?.mainForm?.get("calculateFor")?.patchValue("Payment");
        }
        this.callApi(event.data);
        this.mainForm.get("calculateFor").disable();
      }

      if(sessionStorage?.getItem("externalUserType")==="Internal"){
          this.baseSvc.internalSalesDealerList = await this.stdSvc.getDealerForInternalSales( event?.data)
          this.mainForm.updateList('dealerId', this.baseSvc.internalSalesDealerList);
      }
    }
    if (event.name == "calculateFor") {
      this?.updateFieldBasedOnCalcFor();
    }

    if (event.name == "cashPriceValue") {
      this.mainForm.get("balloonAmount")?.setValue(0);
      this.mainForm.get("balloonPct").setValue(0);
      this.mainForm.updateValidators("firstLeasePayment", [
        Validators.max(event?.data?.value || 0),
      ]);
      this.mainForm.updateValidators("deposit", [
        Validators.max(event?.data?.value || 0),
      ]);
      this.mainForm.updateValidators("balloonAmount", [
        Validators.max(event?.data?.value || 0),
      ]);
      this.mainForm
        ?.get("residualValue")
        .setValidators([Validators.max(event?.cashPriceValue)]);
      if (
        this.mainForm.get("balloonPct").value &&
        this.mainForm.get("calculateFor").value !== "Balloon"
      )
        this.convertPctToAmount(
          "balloonAmount",
          this.mainForm.get("balloonPct").value
        );
    }
    if (event.name == "depositPct" && this.cashPrice > 0) {
      this.mainForm.get("balloonAmount")?.setValue(0);
      this.mainForm.get("balloonPct").setValue(0);
      this.convertPctToAmount("deposit", event.data.value);
    }

    if (event.name == "deposit" && this.cashPrice > 0) {
      this.mainForm.get("balloonAmount")?.setValue(0);
      this.mainForm.get("balloonPct").setValue(0);
      this.convertAmountToPct("depositPct", event.data);
      this.convertPctToAmount("balloonAmount", event.data, "ballon");
    }

     if(event.name == "dealerId" && sessionStorage?.getItem("externalUserType")==="Internal"){
    const originatorNumber = await this.stdSvc.getOriginatorNumberByName(event?.data)
    this.stdSvc.setBaseDealerFormData({
      originatorNumber: originatorNumber || ''
    });
  }
  
    if (
      (event.name == "deposit" ||
        event.name == "depositPct" ||
        event.name == "balloonAmount" ||
        event.name == "balloonPct") &&
      this.cashPrice == 0
    ) {
      this.mainForm.get("deposit")?.setValue(0);
      this.mainForm.get("depositPct").setValue(0);
      this.mainForm.get("balloonAmount")?.setValue(0);
      this.mainForm.get("balloonPct").setValue(0);
      this.toasterSvc.showToaster({
        severity: "info",
        detail: `Please add cash price`,
      });
      return;
    }

    if (this.mainForm.get("calculateFor").value == "Deposit") {
      this.mainForm.get("deposit")?.setValue(0);
      this.mainForm.get("depositPct").setValue(0);
    }

    if (this.mainForm.get("calculateFor").value != "Balloon") {
      if (event.name == "balloonPct" && this.cashPrice > 0) {
        this.convertPctToAmount("balloonAmount", event.data, "ballon");
      }
      if (event.name == "balloonAmount") {
        this.convertAmountToPct("balloonPct", event.data, "ballon");
      }
    }

    if (event.name == "pctResidualValue" && this.cashPrice > 0) {
      this.convertPctToAmount("residualValue", event.data.value);
    }
    if (event.name == "residualValue") {
      this.convertAmountToPct("pctResidualValue", event.data);
    }
    // //oninit code
    //   if (this.sessionProductCode == "AFV") {
    //     this.mainForm.updateProps("kmAllowance", {
    //       className: "",
    //     });
    //     this.mainForm.updateDisable({ assetTypeDD: false });
    //     this.mainForm.updateValidators("assetTypeDD", [Validators.required]);
    //     this.termOptions = [
    //       { label: "24", value: 24 },
    //       { label: "36", value: 36 },
    //       { label: "48", value: 48 },
    //     ];
    //     this.mainForm.updateList("term", this.termOptions);

    //     this.mainForm?.updateHidden({
    //       // kmAllowance: false,
    //       assetTypeDD: false,
    //       assuredFutureValue: false,
    //       balloonOR: true,
    //       balloonPct: true,
    //       balloonAmount: true,
    //       isFixed: true,
    //     });

    //     this.mainForm.updateValidators("depositPct", [
    //       Validators.max(99),
    //       Validators.required,
    //     ]);

    //     this.mainForm?.updateClass(
    //       { kmAllowance: "col-offset-2 col-4" },
    //       "inputClass"
    //     );
    //     this.mainForm?.updateClass(
    //       { assuredFutureValue: "col-offset-2 col-4" },
    //       "inputClass"
    //     );
    //     this.mainForm?.updateClass(
    //       { interestRate: "col-offset-2 col-4" },
    //       "inputClass"
    //     );
    //     this.mainForm?.updateClass({ term: "col-offset-2 col-4" }, "inputClass");
    //     this.mainForm?.updateClass(
    //       { cashPriceValue: "col-offset-2  col-4" },
    //       "inputClass"
    //     );
    //     this.mainForm?.updateClass({ deposit: "px-2 col-4" }, "className");
    //     this.mainForm?.updateCols({ depositPct: 7 });
    //   }
    //removed to correct AFV changes
    else if (this.sessionProductCode == "FL") {
      this.mainForm?.updateHidden({
        // kmAllowance: true,
        assetTypeDD: true,
        assuredFutureValue: true,
        balloonOR: true,
        balloonPct: true,
        balloonAmount: true,
        isFixed: true,
        depositOR: true,
        deposit: true,
        depositPct: true,
        advanceRent: true,
        // pctResidualValue: false,
        // residualValue: false,
        // residualOR: false,
        // firstLeasePayment: false,
      });

     
      this.mainForm?.updateClass(
        { pctResidualValue: "col-offset-1 col-4" },
        "inputClass"
      );
      this.mainForm?.updateClass(
        // { firstLeasePayment: "col-offset-1 col-4" },
        { firstLeasePayment: "col-5" },
        "inputClass"
      );
      this.mainForm?.updateClass(
        // { term: "col-offset-2 col-4" },
        { term: "col-5" },
        "inputClass"
      );
      this.mainForm?.updateClass(
        // { interestRate: "col-offset-2 col-4" },
        { interestRate: "col-5" },
        "inputClass"
      );
      // this.mainForm?.updateCols({ pctResidualValue: 7 });
      this.mainForm?.updateClass({ pctResidualValue: "col-5" }, "inputClass");
      // this.mainForm?.updateCols({ residualValue: 4 });
      this.mainForm?.updateClass(
        // { cashPriceValue: "col-offset-0 col-4" },
        { cashPriceValue: "col-5" },
        "inputClass"
      );

      this.mainForm.updateValidators("pctResidualValue", [
        Validators.required,
        Validators.max(100),
        // Validators.min(1),
        Validators.min(0),
      ]);

      this.mainForm.updateValidators("residualValue", [
        Validators.max(this.mainForm.get("cashPriceValue").value),
        // Validators.min(1),
        Validators.min(0),
      ]);
    }
    if (this.mainForm.form.valid) {
      this.mainForm.updateProps("submit", { disabled: false });
    } else {
      this.mainForm.updateProps("submit", { disabled: true });
    }
    if (event.name == "programId") {
      this.mainForm.get("calculateFor").disable();
    }

    await this.updateValidation(event);
  }

  override async onFormEvent(event: any) {
    if (event.name == "productId" && event?.value) {
      this.mainForm.get("programId").enable();
      // var url = `Program/get_programs?productId=${event.value}`;
      let programOptions = this.baseSvc.productProgramList.programs.filter(
        (program) => program.productId === event.value
      );
      // this.svc.data.get(url).subscribe((res) => {
      if (programOptions && programOptions.length > 0) {
        const programCode = programOptions[0]?.code;
        if (programCode) {
          if (programCode.includes("CSA")) {
            sessionStorage.setItem("productCode", "CSA");
            this.sessionProductCode = "CSA";
          } else if (programCode.includes("AFV")) {
            sessionStorage.setItem("productCode", "AFV");
            this.sessionProductCode = "AFV";
            const currentProgramId = this.mainForm.get("programId")?.value;
            const currentAssetTypeId = this.mainForm.get("assetTypeId")?.value;
            if (!currentProgramId && !currentAssetTypeId) {
              this.mainForm.updateList("programId", []);
              return;
            }
          } else if (programCode.includes("FL")) {
            sessionStorage.setItem("productCode", "FL");
            this.sessionProductCode = "FL";
          } else if (programCode.includes("TL")) {
            sessionStorage.setItem("productCode", "TL");
            this.sessionProductCode = "TL";
          } else if (programCode.includes("OL")) {
            sessionStorage.setItem("productCode", "OL");
            this.sessionProductCode = "OL";
          }
        }
        programOptions.map((obj) => {
          (obj.label = obj.name), (obj.value = obj.programId);
        });
        this.mainForm.updateList("programId", programOptions);
        if (programOptions?.length == 1) {
        }
      }
    }
    if (event.name == "cashPriceValue") {
      this.cashPrice = event.value;
      this.convertPctToAmount("deposit", this.mainForm.get("depositPct").value);
    }

    // if (
    //   this.mainForm?.form?.value?.calculateFor == "Deposit" &&
    //   this.calculatedResult?.deposit > 0
    // ) {
    //   this.mainForm.get("deposit").patchValue(this.calculatedResult?.deposit);
    //   this.mainForm
    //     .get("depositPct")
    //     .patchValue(this.calculatedResult?.depositPct);
    // }
    super.onFormEvent(event);
  }

  convertPctToAmount(name, val, type?: string) {
    if (this.cashPrice > 0 && type === "ballon") {
      let amount =
        (this.mainForm.form.get("balloonPct").value / 100) *
        // (this.cashPrice - this.mainForm.form.get("deposit").value);
        this.cashPrice;

      if (!isFinite(amount) || isNaN(amount) || amount <= 0) {
        amount = 0;
        this.mainForm.get(name).patchValue(0);
      } else {
        this.mainForm.get(name).patchValue(amount);
      }
    } else if (this.cashPrice > 0 && val > 0) {
      let amount = (val / 100) * this.cashPrice;
      this.mainForm.form.get(name).patchValue(amount);
    } else {
      this.mainForm.form.get(name).patchValue(0);
    }
  }

  convertAmountToPct(name, val, type?: string) {
    if (this.cashPrice > 0 && type === "ballon") {
      let deposit = this.mainForm.form.get("deposit").value;

      // let denominator = this.cashPrice - deposit;
      let denominator = this.cashPrice;

      let pct =
        isFinite(denominator) && denominator !== 0
          ? (val / denominator) * 100
          : 0;

      if (!isFinite(pct) || isNaN(pct) || pct <= 0) {
        pct = 0;
      }

      this.mainForm.get(name).patchValue(pct);
    } else if (this.cashPrice > 0) {
      let pct = (val / this.cashPrice) * 100;

      this.mainForm.get(name).patchValue(pct > 0 ? pct : 0);
    } else {
      this.mainForm.get(name).patchValue(0);
    }
  }

  calculateBallonPct(val) {
    if (
      this.cashPrice > 0 &&
      (this.mainForm.form.get("deposit").value ||
        this.mainForm.get("depositPct").value)
    ) {
      let deposit = this.mainForm.form.get("deposit").value;
      let denominator = this.cashPrice - deposit;
      let pct =
        isFinite(denominator) && denominator !== 0
          ? (deposit / denominator) * 100
          : 0;

      if (pct <= 0) {
        pct = 0;
      }

      this.mainForm.get("balloonPct").patchValue(pct);

      let amount = (pct / 100) * denominator;
      this.mainForm.get("balloonAmount").patchValue(amount > 0 ? amount : 0);
    } else {
      this.mainForm.get("balloonAmount").patchValue(0);
      this.mainForm.get("balloonPct").patchValue(0);
    }
  }

  convertPctToAmounts(val?: number): number {
    let amount = 0;

    if (this.cashPrice > 0 && val > 0) {
      amount = (val / 100) * this.cashPrice;

      if (!isFinite(amount) || isNaN(amount) || amount <= 0) {
        amount = 0; // Reset amount to 0 if it's invalid or non-positive
      }
    }

    return amount;
  }

  closeCard(i: any) {
    this.dataEmitter.emit(i);
    // this.quickQuoteData[i].btnDisabled = true;
    // this.quickQuoteData[i + 1].btnDisabled = true;
  }

  resetForm(ind: any) {
    this.mainForm.form.reset();
    this.result = false;
    this.hideQuote = false;
    this.buttonEvent.emit(true);
    this.mainForm?.updateHidden({
      calculateFor: true,
      cashPriceValue: true,
      firstLeasePayment: true,
      deposit: true,
      depositOR: true,
      depositPct: true,
      interestRate: true,
      term: true,
      kmAllowance: true,
      frequency: true,
      leasePayment: true,
      pctResidualValue: true,
      residualOR: true,
      residualValue: true,
      payment: true,
      balloonOR: true,
      balloonPct: true,
      balloonAmount: true,
      isFixed: true,
      submit: true,
    });
    this.mainForm.get("calculateFor").patchValue("Payment");
    this.updateFieldBasedOnCalcFor();
  }

  async sendDataStandardQuote(res: any) {
    const currentProgramOptions = await this.mainForm.getOptions("programId");
    this.calculatedResult.firstPaymentDate = null;
    this.calculatedResult.totalAmountBorrowed = null;
    let data = {
      ...this.calculatedResult,
      ...this.mainForm.value,
      ...this.calculatedResult?.firstPaymentDate,
      ...this.calculatedResult?.totalAmountBorrowed,
      afvProgramList:
        this.sessionProductCode === "AFV" ? currentProgramOptions : null,
      // frequency: this.calculatedResult?.frequency,
      // taxProfile: { code: "CSABD", id: 5, name: "CSA-B Direct" },
      // productCode: this.productCode,
      // pctResidualValue: this.mainForm.value?.residualValue || 0,
      // pctResidualValue: this.mainForm.value?.pctResidualValue || 0,
      // // term: this.mainForm.value.term || this.mainForm.value.terms,
      // assuredFutureValue: this.mainForm.value?.assuredFutureValue || 0,
      // cashPriceFinanceLease: this.mainForm.value?.cashPriceValue || 0,
      // cashPriceValue: this.mainForm.value?.cashPriceValue || 0,
      // contractId: null,
    };

    this.stdSvc.mode = "create";
    this.buttonEvent.emit(true);
    this.stdSvc.forceToClickCalculate.next(true);
    this.stdSvc.setBaseDealerFormData(data);
    this.stdSvc.showResult = false;
    this.router.navigateByUrl("/standard-quote");
  }

  async selectAsset() {
    let asset = this.selectedAsset;
    this.mainForm?.get("assetTypeDD")?.patchValue(asset?.value);
    this.mainForm?.get("assetTypeModalValues")?.patchValue(asset?.path);
    this.mainForm?.get("assetTypeId")?.patchValue(asset?.id);
    if (this.sessionProductCode === "AFV") {
      this.baseFormData.assetTypeId = asset?.id;
      this.mainForm.get("programId")?.patchValue(null);
      this.mainForm.get("term")?.patchValue(null);
      this.mainForm.get("interestRate")?.patchValue(0);
      this.mainForm.get("cashPriceValue")?.patchValue(0);
      this.mainForm.get("depositPct")?.patchValue(0);
      this.mainForm.get("deposit")?.patchValue(0);
      this.mainForm.get("balloonPct")?.patchValue(0);
      this.mainForm.get("balloonAmount")?.patchValue(0);
      this.mainForm.get("payment")?.patchValue(0);
      this.mainForm.get("frequency")?.patchValue(null);
      this.mainForm.get("kmAllowance")?.patchValue(0);
      this.mainForm.get("assuredFutureValue")?.patchValue(0);
      this.mainForm.get("calculateFor")?.patchValue("Payment");

      this.mainForm.get("programId")?.clearValidators();
      this.mainForm.get("programId")?.updateValueAndValidity();

      await this.fetchAfvPrograms();

      return;
    }
    let defaulting = ["asset type"];

    let dataMapped = await this.baseSvc.contractPreview(
      this.mainForm.form.value,
      defaulting,
      null
    );
    this.mainForm.form.patchValue(dataMapped);
  }
  assetOptionsList = [];

  async loadAssetTypeData() {
    let dd = this.filterAssetTypeData("All Asset Type"); // Dropdown 2
    let optionsList = [];
    let baseAddress = "All Asset Type";
    let basePath = "All Asset Types / All Asset Type";
    dd?.forEach((ele, index) => {
      let itemsList = this.filterAssetTypeData(ele.value); // Dropdown 3

      if (itemsList.length == 0) {
        let fieldValue = ele.value + " / " + baseAddress;
        let path = basePath + " / " + ele.value;
        optionsList.push({
          label: fieldValue,
          value: { value: ele.value, id: ele.id, path: path },
        });
      } else {
        itemsList?.forEach((eleA, indexA) => {
          let itemsList1 = this.filterAssetTypeData(eleA.value); // Dropdown 4
          if (itemsList1.length == 0) {
            let fieldValue =
              eleA.value + " / " + ele.value + " / " + baseAddress;
            let path = basePath + " / " + ele.value + " / " + eleA.value;
            optionsList.push({
              label: fieldValue,
              value: { value: eleA.value, id: eleA.id, path: path },
            });
          } else {
            itemsList1?.forEach((eleB) => {
              let fieldValue =
                eleB.value +
                " / " +
                eleA.value +
                " / " +
                ele.value +
                " / " +
                baseAddress;
              let path =
                basePath +
                " / " +
                ele.value +
                " / " +
                eleA.value +
                " / " +
                eleB.value;

              optionsList.push({
                label: fieldValue,
                value: { value: eleB.value, id: eleB.id, path: path },
              });
            });
          }
        });
      }
    });

    this.assetOptionsList = optionsList;
  }

  filterAssetTypeData(ownerId, assetTypeId?: any) {
    let filteredData = [];
    filteredData = this.assetTypeData?.filter(
      (item) => item.ownerId === ownerId
    );
    let dropDownData = filteredData?.map((item) => ({
      label: item.name,
      value: item.name,
      id: item.assetTypeId,
    }));
    return dropDownData;
  }

  async updateFieldBasedOnCondition() {
    if (this.sessionProductCode == "CSA" || this.sessionProductCode == "TL") {
      this.mainForm.updateProps("kmAllowance", {
        className: "opacity-0 pointer-events-none",
      });
      this.mainForm?.updateHidden({
        calculateFor: false,
        cashPriceValue: false,
        deposit: false,
        depositOR: false,
        depositPct: false,
        interestRate: false,
        term: false,
        kmAllowance: false,
        frequency: false,
        payment: false,
        balloonOR: false,
        balloonPct: false,
        balloonAmount: false,
        isFixed: false,
        submit: false,
        assuredFutureValue: true,
        assetTypeDD: true,
      });
    }
    if (this.sessionProductCode == "FL") {
      this.mainForm.updateProps("kmAllowance", {
        className: "opacity-0 pointer-events-none",
      });
      // this.mainForm.updateProps("calculateFor", {
      //   className: "opacity-0 pointer-events-none",
      // });
      this.mainForm?.updateHidden({
        // calculateFor: false,
        calculateFor: true,
        cashPriceValue: false,
        firstLeasePayment: false,
        deposit: true,
        depositOR: true,
        depositPct: true,
        interestRate: false,
        term: false,
        kmAllowance: false,
        frequency: false,
        leasePayment: false,
        pctResidualValue: false,
        residualOR: false,
        residualValue: false,
        payment: true,
        balloonOR: true,
        balloonPct: true,
        balloonAmount: true,
        isFixed: true,
        submit: false,
      });
    }

    if (this.sessionProductCode == "AFV") {
      // if (this.sessionProductCode == "CSA") {
      this.mainForm?.updateHidden({
        assetTypeDD: false,
        calculateFor: true,
        cashPriceValue: false,
        deposit: false,
        depositOR: false,
        depositPct: false,
        interestRate: false,
        term: false,
        kmAllowance: false,
        frequency: false,
        payment: false,
        assuredFutureValue: false,
        balloonOR: true,
        balloonPct: true,
        balloonAmount: true,
        isFixed: true,
        submit: false,
      });
    }
    this.mainForm.get("cashPriceValue").enable();
    // this.mainForm.get("calculateFor").patchValue("Payment");
    await this.updateValidation("onInit");
  }

  pageCode: string = "QuickQuoteComponent"; // need to check
  modelName: string = "CreateQuickQuoteComponent";


  override async onValueEvent(event) {
    await this.updateValidation(event);
  }

  // override async onValueEvent(event) {
  //   // if (event.name === "productId") {
  //   //   const apiUrl = `Product/get_products?Code=${
  //   //     this.productCode ?? this.sessionProductCode
  //   //   }`;
  //   //   this.svc.data.get(apiUrl).subscribe((res) => {
  //   //     if (res && res.data) {
  //   //       const filteredProducts = res.data.filter(
  //   //         (item: any) => item.productId === event.value
  //   //       );
  //   //       var url = `Program/get_programs?productId=${event.data.value}`;
  //   //       this.svc.data.get(url).subscribe((res) => {
  //   //         if (res && res.data) {
  //   //           res.data.map((obj) => {
  //   //             (obj.label = obj.name), (obj.value = obj.programId);
  //   //           });
  //   //           this.mainForm.updateList("programId", res.data);
  //   //         }
  //   //       });
  //   //       // this.mainForm.updateList('programId', {
  //   //       //   list$: `Program/get_programs?productId=${event.value}`,
  //   //       //   idKey: 'programId',
  //   //       // });
  //   //       if (filteredProducts.length) {
  //   //         const product = filteredProducts[0];
  //   //       }
  //   //     }
  //   //   });
  //   // }
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
  alreadyShownError: false;
  async getProductProgram() {
    const originatorNo = Number(sessionStorage.getItem("dealerPartyNumber"));
    const introducerId = this.dashboardSvc?.userOptions?.find(
      (dealer) => dealer.value.num === originatorNo
    )?.id;
    if (introducerId) {
      await this.baseSvc.getFormData(
        `Product/get_programs_products?introducerId=${introducerId}`,
        (res) => {
          // this.productProgramList = res.data;
          this.baseSvc.productProgramList = res.data;
          let productdata = res.data.products;

          this.baseSvc.productList = Array.isArray(productdata)
            ? productdata
                .map((item) => ({
                  label: item.name,
                  value: item.productId,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
            : [];

          this.mainForm.updateList("productId", this.baseSvc.productList);

          return res.data.asset || null;
        }
      );
    }
  }
  errorsMessageArray = [];
  async fetchAfvPrograms(): Promise<void> {
    try {
      const originatorNo = Number(sessionStorage.getItem("dealerPartyNumber"));
      const introducerId = this.dashboardSvc?.userOptions?.find(
        (dealer) => dealer.value.num === originatorNo
      )?.id;

      const assetTypeId = this.baseFormData?.assetTypeId;

      if (!introducerId || !assetTypeId) {
        return;
      }
      const response = await this.svc.data
        .get(
          `Product/get_programs_products?introducerId=${introducerId}&AssetId=${assetTypeId}`
        )
        .pipe(map((res: any) => res))
        .toPromise();

      if (response?.data?.programs && response?.data?.programs.length > 0) {
        const programList = response.data.programs.map((item) => ({
          label: item.programName || item.extName || item.name,
          value: item.programId,
        }));
        this.mainForm.updateList("programId", programList);
        this.mainForm.get("programId")?.enable();
        if (programList.length === 1) {
          this.mainForm.get("programId")?.patchValue(programList[0].value);
        }
      } else {
        this.mainForm.updateList("programId", []);
      }
    } catch (error) {
      // console.error('Error fetching AFV programs:', error);
    }
  }
  async checkProductProgram() {
    const productId = this.mainForm.form.get("productId")?.value;
    if (productId) {
      const checkProduct = this.baseSvc.productList.some(
        (product) => product.value === productId
      );
      const programId = this.mainForm.form.get("programId")?.value;
      let checkProgram = true;
      if (checkProduct && programId) {
        checkProgram = this.baseSvc.productProgramList?.programs?.some(
          (program) =>
            program.programId === programId && program.productId === productId
        );
      }

      if (!checkProduct || !checkProgram) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "err_checkProductProgarmMsg",
        // });
        this.errorsMessageArray.push({
          message: "err_checkProductProgarmMsg",
          severity: "error",
        });
        this.resetForm("");
        await this.updateValidation("onInit");
        return;
      } else {
        if (programId) {
          let programOptions = this.baseSvc.productProgramList.programs.filter(
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
          this.mainForm.updateList("programId", programJson);
          if (this.dashboardSvc.isDealerCalculated) {
            //    this.toasterSvc.showToaster({
            //   severity: "error",
            //   detail:"err_calculateMsg",
            // }
            this.errorsMessageArray.push({
              message: "err_calculateMsg",
              severity: "error",
            });
          }
        }
      }
    }
  }

}
