import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  DataService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { firstValueFrom, lastValueFrom, map } from "rxjs";
import configure from "../../../../../public/assets/configure.json";
@Component({
  selector: "app-dealer-finance",
  templateUrl: "./dealer-finance.component.html",
  styleUrl: "./dealer-finance.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class DealerFinanceComponent
  extends BaseStandardQuoteClass
  implements OnInit
{
  dealerFinance: any;
  activeIndex: number | undefined = -1;
  commissionSubsidyAmt: any;
  dealerOriginatorFeeAmount: any;
  dealerBaseInterestRate: number;
  establishmentFeeShares: any = 0;
  estimateCommissions: any;
  user_role: any;
  Termoptions: { label: string | number; value: string | number }[] = [
    { label: 0, value: 0 },
  ];
  program: any;
  flag: boolean = false;
  frequencyoptions: any;

  isInternalUser: boolean = false;
  
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
  termSortOrder = [12, 24, 36, 48, 60];
  productCode : any;

  // override roleBasedFunctionName = 'dealer_finance';
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private dataSvc: DataService,
    private cdr: ChangeDetectorRef,
    private validationSvc: ValidationService,
    private toasterService: ToasterService
  ) {
    super(route, svc, baseSvc);

    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config,this.modelName, this.pageCode);
    console.log('dealer-finance.component components ts', filteredValidations);
    this.formConfig = { ...this.formConfig, fields: filteredValidations };


    this.user_role = JSON.parse(sessionStorage.getItem("user_role"));
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookupsLookupSetName=InstallmentFrequency",
    ]);
    this.svc.data.getCacheableRoutes([
      "LookUpServices/lookups?LookupSetName=Frequency",
    ]);
  }

  // @ViewChild('dealer_finance', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  @ViewChildren("container", { read: ElementRef })
  containers!: QueryList<ElementRef>;
  allOptions: any;
  // @ViewChildren('nameee') nameee: QueryList<ElementRef>

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.productCode = sessionStorage.getItem("productCode");
    this.isInternalUser = (sessionStorage.getItem("externalUserType") == "Internal")?true:false;
    let res = await this.baseSvc.getFormData(
      "LookUpServices/lookups?LookupSetName=InstallmentFrequency",
      function (res) {
        return res?.data;
      }
    );

    this.allOptions = res
      ?.map((item) => ({
        label: item.lookupValue,
        value: item.lookupValue,
      }))
      .sort((a, b) => {
        return (
          this.frequencySortOrder.indexOf(a.value) -
          this.frequencySortOrder.indexOf(b.value)
        );
      });

    if (this.baseFormData && this.mainForm?.form) {
      let dealerCommission = Math.abs(this.baseFormData?.dealerCommission) || 0;
      let rawDealerSubsidy = this.baseFormData?.dealerSubsidy;
      let dealerSubsidy = rawDealerSubsidy ? -Math.abs(rawDealerSubsidy) : 0;
      
       if (this.baseFormData?.productCode == "FL") {
      this.estimateCommissions =
        this.baseFormData?.estimatedCommissionSubsidy;
       }
       else{
        this.estimateCommissions =
        dealerCommission === 0 ? dealerSubsidy : dealerCommission;

       }

      this.dealerBaseInterestRate = this.baseFormData.baseInterestRate || 0;
      let term = this.baseFormData?.financialAssetLease?.term;
      if (term) this.mainForm.get("term").patchValue(term);
      this.mainForm.form.patchValue(this.baseFormData);
      this.setFormData(this.baseFormData);
    }

    if (this.baseFormData?.productCode == "AFV") {
      this.mainForm?.updateHidden({
        kmAllowance: false,
        kmAllowanceAnnum: false,
        assuredFutureValue: false,
      });
    } else {
      this.mainForm?.updateHidden({
        kmAllowance: true,
        assuredFutureValue: true,
        kmAllowanceAnnum: true,
      });
    }

    this.baseSvc.udcAndDealerFeeChanged.subscribe((res) => {
      const defaultUdc =
        this.baseSvc?.defautltUDCEstablishmentFee?.defaultudcEstablishmentFee ||
        0;
      const defaultDealer =
        this.baseSvc?.defautltUDCEstablishmentFee
          ?.defaultDealerOriginationFee || 0;

      this.establishmentFeeShares =
        this.calculateEstablishmentFeeShareOnPaymentCalculate(
          res?.udcEstablishmentFee,
          res?.dealerOriginationFee,
          defaultUdc,
          defaultDealer
        );
      this.baseSvc.defautltUDCEstablishmentFee.defaultEstablishmentFeeShare =
        this.establishmentFeeShares;
      this.baseSvc.dealerOriginationFeeopenOnEdit = false;
    });
    await this.updateValidation("onInit");
  }

  showCard: boolean = true;

// Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //   autoResponsive: true,
  //   api: ``,
  //   goBackRoute: "",
  //   cardType: "non-border",
  //   cardBgColor: "--primary-lighter-color",
  //   fields: [
  //     {
  //       type: "number",
  //       label: "Term",
  //       name: "term",
  //       inputType: "vertical",
  //       labelClass: "labels pb-2",
  //       // cols: 3,
  //       //suffix: "Months",
  //       className: "col-fixed w-11rem mr-4 text-left mt-2 ",
  //       nextLine: false,
  //       //default : 12
  //       // disabled: true, //vaidation comment
  //       // hidden: true,
  //       // validators: [Validators.required], //validation comment
  //     },
  //     // {
  //     //   type: 'number',
  //     //   label: 'Term',
  //     //   name: 'terms',
  //     //   cols: 3,
  //     //   maxLength: 3,
  //     //   disabled: true,
  //     //   nextLine: false,
  //     //   validators: [Validators.required],
  //     // },
  //     {
  //       type: "select",
  //       label: "Frequency",
  //       name: "frequency",
  //       alignmentType: "vertical",
  //       labelClass: "labels pb-2",
  //       // cols: 3,
  //       className: "mr-4 col-fixed w-11rem",
  //       nextLine: false,
  //       // disabled: true, //vaidation comment
  //       options: [],
  //       // list$: 'LookUpServices/lookups?LookupSetName=InstallmentFrequency',
  //       // idKey: 'lookupValue',
  //       // idName: 'lookupValue',
  //       // validators: [Validators.required], //validation comment
  //     },
  //     {
  //       type: "percentage",
  //       label: "Base Rate",
  //       name: "baseRate",
  //       cols: 2,
  //       className: "col-fixed w-11rem mr-4 text-left mt-2 ",
  //       labelClass: "labels pb-2",
  //       nextLine: false,
  //       default: 0,
  //       inputType: "vertical",
  //       hidden: true,
  //       mode: Mode.view
  //     },
  //     {
  //       type: "percentage",
  //       label: "Interest Rate",
  //       name: "interestRate",
  //       cols: 2,
  //       className: "col-fixed w-11rem mr-4 text-left mt-2 ",
  //       labelClass: "labels pb-2",
  //       nextLine: true,
  //       default: 0,
  //       inputType: "vertical",

  //       // suffix: '%',
  //       // maxFractionDigits: 2,
  //       // validators: [Validators.required,Validators.max(100),Validators.maxLength(2),//validation comment
  //       // ],
  //     },
  //      {
  //       type: "amount",
  //       label: "Assured Future Value",
  //       name: "assuredFutureValue",
  //       cols: 3,
  //       resetOnHidden: true,
  //       hidden: true,
  //       inputType: "vertical",
  //       labelClass: "labels pb-2",
  //       // cols: 3,
  //       className: "col-fixed w-11rem mr-4 text-left mt-2 ",
  //       disabled: true,
  //       //mode: Mode.view
  //       // suffix: '%',
  //       // maxFractionDigits: 2,
  //       // validators: [Validators.required], //validation comment
  //     },
  //      {
  //       type: "select",
  //       label: "KM Allowance",
  //       name: "kmAllowance",
  //       cols: 3,
  //       hidden: true,
  //       resetOnHidden: true,
  //       alignmentType: "vertical",
  //       labelClass: "labels pb-2",
  //       // cols: 3,
  //       className: "col-fixed w-11rem",
  //       options: [{ label: "10", value: "10" }],
  //       // inputType: "vertical",
  //        //suffix: 'Per Annum',
  //       // validators: [Validators.required], //validation comment
  //     },
  //     {
  //       type: "label-only",
  //       typeOfLabel: "inline",
  //       label: "Per Annum",
  //       name: "kmAllowanceAnnum",
  //       cols: 2,
  //       className: "mt-5 ml-0",

  //       hidden: true,
  //     },
  //   ],
  // };

  override formConfig: any = {
    autoResponsive: true,
    api: ``,
    goBackRoute: "",
    cardType: "non-border",
    cardBgColor: "--primary-lighter-color",
    fields: [],
  };




  async fetchTermOptions() {
    try {
      const res = await firstValueFrom(this.baseSvc.getBaseDealerFormData());

      if (res.programId && this.program !== res.programId) {
        this.program = res.programId;

        const response = await firstValueFrom(
          this.svc.data.post("LookUpServices/CustomData", {
            parameterValues: ["Term Def", String(res.programId)],
            procedureName: configure.SPProgramListExtract,
          })
        );
        if (response?.data?.table && Array.isArray(response?.data?.table)) {
          if (response?.data?.length === 1 && response.data[0].value_id === 0) {
            this.mainForm.updateHidden({ terms: false });
            this.mainForm.updateHidden({ term: true });
          } else {
            this.Termoptions = response?.data
              .map((item) => ({
                label: item.value_text,
                value: item.value_text,
              }))
              .sort((a, b) => {
                const numA = Number(a.value);
                const numB = Number(b.value);

                if (this.termSortOrder.includes(numA)) {
                  if (this.termSortOrder.includes(numB)) {
                    return (
                      this.termSortOrder.indexOf(numA) -
                      this.termSortOrder.indexOf(numB)
                    );
                  }
                  return -1;
                }
                if (this.termSortOrder.includes(numB)) {
                  return 1;
                }

                return numA - numB;
              });

            const found = this.Termoptions.some(
              (option) => option.value === res.term
            );

            if (!this.flag) {
              this.flag = true;

              if (found) {
                this.mainForm.updateList("term", this.Termoptions);

                this.mainForm.get("term").patchValue(res.term);
                this.mainForm.updateHidden({ term: false });
                this.mainForm.updateHidden({ terms: true });
                this.mainForm.get("term").enable();
                this.mainForm.updateList("term", this.Termoptions);
              } else {
                this.mainForm.updateHidden({ terms: false });
                this.mainForm.updateHidden({ term: true });
              }
            } else {
              this.mainForm.updateHidden({ terms: true });
              this.mainForm.updateHidden({ term: false });
              this.mainForm.updateList("term", this.Termoptions);
              this.mainForm.get("term").enable();
              // this.mainForm.get('terms').reset();
            }
          }
        } else {
          this.Termoptions = [];
          this.mainForm.updateHidden({ term: false });
          this.mainForm.updateHidden({ terms: true });
        }
      }
    } catch (error) {
    }
  }

  override async onFormDataUpdate(res: any): Promise<void> {
    if (res?.programId && this.program !== res?.programId) {
      this.program = res.programId;
      if (res.programId) {
        this.mainForm.get("term").enable();
        this.mainForm.get("frequency").enable();
        this.mainForm.get("frequency").patchValue("Monthly");
      }
      await this.setTermOverride(res);
    }

    if (res?.paymentStructure) {
      if (
        res?.paymentStructure === "None" &&
        (res?.frequency === undefined ||
          this.mainForm.form.get("frequency")?.value !== res?.frequency)
      ) {
        // this.mainForm.get("frequency").patchValue("Monthly");
      }
    }

    // this.childComponentData.emit(res);s
    if (res?.changedField?.productId) {
      if (res?.productId && res?.productId === 15) {
        this.showCard = false;
      } else {
        this.showCard = true;
      }
    }
  }

  async setTermOverride(res) {
    this.mainForm.get("frequency").reset();

    await this.svc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["Instalment Freq Override", String(res.programId)],
        procedureName: configure.SPProgramListExtract,
      })
      .pipe(
        map(
          async (response) => {
            this.mainForm.get("frequency").enable();
            if (response?.data?.table && Array.isArray(response?.data?.table)) {
              if (
                response?.data?.table?.length === 1 &&
                response?.data?.table[0]?.value_text === "None"
              ) {
                // Using await to wait for the response
                const lookupRes = await lastValueFrom(
                  this.svc.data.get(
                    "LookUpServices/lookups?LookupSetName=Frequency"
                  )
                );

                if (lookupRes?.data && Array.isArray(lookupRes.data)) {
                  this.frequencyoptions = lookupRes.data
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

                  this.mainForm.updateList("frequency", this.frequencyoptions);
                  this.cdr.detectChanges();
                }
              } else if (response?.data?.table?.length > 0) {
                // Map the response data to Termoptions
                // this.mainForm.updateProps('term', { type: 'select' });

                this.frequencyoptions = response?.data?.table
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

                this.mainForm?.updateList("frequency", this.frequencyoptions);
              } else {
                this.frequencyoptions = this.allOptions;

                this.mainForm.updateList("frequency", this.frequencyoptions);

                this.cdr.detectChanges();
              }
            }
          },
          (error) => {
          }
        )
      )
      .toPromise();

    await this.svc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["Term Override", String(res.programId)],
        procedureName: configure.SPProgramListExtract,
      })
      .pipe(
        map(
          (response) => {
            if (response?.data?.table && Array.isArray(response?.data?.table)) {
              if (
                (response?.data?.table?.length === 1 &&
                  response?.data?.table?.[0]?.value_id === 0) ||
                response?.data?.table?.length == 0
              ) {
                this.mainForm.updateProps("term", { type: "number" });
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
                ].sort(
                  (a, b) =>
                    this.termSortOrder.indexOf(a.value) -
                    this.termSortOrder.indexOf(b.value)
                );

                const termOptionsString = Termoptions.map(
                  (item) => item.label
                ).join(",");

                this.baseSvc.setBaseDealerFormData({
                  termOptions: termOptionsString,
                });
                // this.mainForm.updateProps("term", { type: "select" });
                // this.Termoptions = [
                //   {
                //     label: String(this.mainForm.get("term").value),
                //     value: this.mainForm.get("term").value,
                //   },
                // ];
                // this.mainForm.updateList("term", this.Termoptions);

                this.cdr.detectChanges();
              } else if (response?.data?.table?.length > 0) {
                // Map the response data to Termoptions
                this.mainForm.updateProps("term", {
                  type: "select",
                  alignmentType: "vertical",
                  inputClass: "-mt-1",
                  className: "col-fixed w-11rem mt-0 ",
                });

                this.Termoptions = response?.data?.table
                  .map((item) => ({
                    label: item.value_text,
                    value: Number(item.value_text),
                  }))
                  .sort((a, b) => {
                    const numA = a.value;
                    const numB = b.value;

                    if (this.termSortOrder.includes(numA)) {
                      if (this.termSortOrder.includes(numB)) {
                        return (
                          this.termSortOrder.indexOf(numA) -
                          this.termSortOrder.indexOf(numB)
                        );
                      }
                      return -1;
                    }
                    if (this.termSortOrder.includes(numB)) {
                      return 1;
                    }
                    return numA - numB;
                  });

                this.mainForm.updateList("term", this.Termoptions);
                // this.mainForm.get('term').reset();

                const termOptionsString = response?.data?.table
                  .map((item) => item.value_text)
                  .join(",");
                this.baseSvc.setBaseDealerFormData({
                  termOptions: termOptionsString,
                });

                this.cdr.detectChanges();
              }
            }
          },
          (error) => {
          }
        )
      )
      .toPromise();

    //   setTimeout(() => {

    //     this.mainForm.get('term').patchValue(res.term);
    //     //this.cdr.markForCheck();
    // }, 1000);

    this.mainForm.get("term").patchValue(res.term);
    if (!res.term) {
      this.svc.data
        .post("LookUpServices/CustomData", {
          parameterValues: ["Term Def", String(res.programId)],
          procedureName: configure.SPProgramListExtract,
        })
        .pipe(
          map(
            (response) => {
              if (
                response?.data?.table &&
                Array.isArray(response?.data?.table)
              ) {
                if (
                  response?.data?.table?.length === 1 &&
                  response?.data?.table?.[0].value_id
                ) {
                  this.mainForm
                    .get("term")
                    .patchValue(response?.data?.table?.[0].value_id);
                }
              }
            },
            (error) => {
            }
          )
        )
        .toPromise();
    }
  }
  override async onValueTyped(event: any): Promise<void> {
    if (event.name == "term" || event.name == "frequency" || event.name == "interestRate") {
      this.baseSvc.forceToClickCalculate.next(true);

      this.baseSvc.changedDefaults = {
        ...this.baseSvc.changedDefaults,
        term: true,
      };
    }
    await this.updateValidation(event);
  }
  override onFormEvent(res) {
    if (res.name == "assuredFutureValue") {
      if (res?.value) {
        let amount = this.convertPctToAmount(
          "assuredFutureValueAmount",
          res.value
        );
        this.baseSvc.setBaseDealerFormData({
          pctResidualValue: res.value,
          residualValue: amount,
        });
      }
    }
    if (this.baseFormData) {
      let dealerCommission = Math.abs(this.baseFormData?.dealerCommission) || 0;
      let rawDealerSubsidy = this.baseFormData?.dealerSubsidy;
      let dealerSubsidy = rawDealerSubsidy ? -Math.abs(rawDealerSubsidy) : 0;
      if (this.baseFormData?.productCode == "FL") {
      this.estimateCommissions =
        this.baseFormData?.estimatedCommissionSubsidy;
       }
       else{
        this.estimateCommissions =
        dealerCommission === 0 ? dealerSubsidy : dealerCommission;

       }
      // this.estimateCommissions =
      //   dealerCommission === 0 ? dealerSubsidy : dealerCommission;
      this.dealerBaseInterestRate = this.baseFormData.baseInterestRate || 0;
      if (this.baseSvc.dealerOriginationFeeopenOnEdit) {
        this.establishmentFeeShares = this.baseFormData?.dealerOriginationFee;
      } else {
        if (
          this.baseSvc?.defautltUDCEstablishmentFee
            ?.defaultEstablishmentFeeShare
        ) {
          this.establishmentFeeShares =
            this.baseSvc?.defautltUDCEstablishmentFee?.defaultEstablishmentFeeShare;
        }
      }
    }

    super.onFormEvent(res);
  }
  // Start:component logic

  convertPctToAmount(name, val) {
    if (this.baseFormData.cashPriceValue > 0) {
      let amount = (val / 100) * this.baseFormData.cashPriceValue;
      return amount;
    } else {
      return 0;
    }
  }

  activeIndexChange(index: number) {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }
  pageCode: string = "StandardQuoteComponent";
  modelName: string = "DealerFinanceComponent";
  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();

    if((sessionStorage.getItem("externalUserType") == "Internal" )){
      this.mainForm.updateHidden({baseRate: false});
    }
  }

  override async onBlurEvent(event) {
    // console.log(this.baseFormData);
    
    if(event.name == "interestRate" && this.baseFormData?.AFworkflowStatus == "Ready for Documentation"){
      let currentinterestRate = this.mainForm.get("interestRate").value;
      if(currentinterestRate > this.baseFormData?.apiinterestRate){        
        this.toasterService.showToaster({
          severity: "error",
          detail: "Interest rate cannot be increased in Ready for Documentation state.",
        });
        // return;
      }
    }

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
    if (!responses.status && responses.updatedFields?.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }
  //  override async onStepChange(quotesDetails: any): Promise<void> {
  //   if(quotesDetails.type !== "tabNav"){

  //  var result:any =  await this.updateValidation('onSubmit')

  // //  this.checkValidate()
  // }
  //   super.onStepChange(quotesDetails);
  // }
  // Endd:component logic

  calculateEstablishmentFeeShareOnPaymentCalculate(
    udcFees?: number,
    dealerFees?: number,
    defaultUdc?: number,
    defaultDealer?: number
  ): number {
    const udc = udcFees ?? 0;
    const dealer = dealerFees ?? 0;
    const defaultUdcFee = defaultUdc ?? 0;
    const defaultDealerFee = defaultDealer ?? 0;

    const udcChanged = udc !== defaultUdcFee;
    const dealerChanged = dealer !== defaultDealerFee;

    // Case 1: Both unchanged
    if (!udcChanged && !dealerChanged) {
      return defaultDealerFee;
    }

    //case 2: UDC unchanged, dealer changed and both default fees are 0
    if (
      (!udcChanged && dealerChanged) ||
      (defaultUdcFee === 0 && defaultDealerFee === 0)
    ) {
      return dealer;
    }

    if ((udcChanged && !dealerChanged) || (udcChanged && dealerChanged)) {
      // Case 3: UDC changed, dealer unchanged
      if (defaultUdcFee > udc) {
        const x = defaultUdcFee - udc;
        return dealer - x;
      }else{
        if(udc > defaultUdcFee){
           return dealer;
        }
      }
    }
    return 0;
  }
}
