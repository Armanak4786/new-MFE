import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { lastValueFrom, map, takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";
import configure from "../../../../../public/assets/configure.json";

@Component({
  selector: "app-payment-summary-deatils",
  templateUrl: "./payment-summary-deatils.component.html",
  styleUrl: "./payment-summary-deatils.component.scss",
})
export class PaymentSummaryDeatilsComponent extends BaseStandardQuoteClass {
  paymentSummary: any;
  interestRate: number;
  loanDate: Date;
  firstPaymentDate: Date;
  lastPaymentDate: any;
  calculatedInterestRate: number;
  totalAmountToRepay: any;
  term: number;
  formData: any = {};
  frequency: any;
  paymentAmount: number;
  interestCharges: number;
  futureValueDate: Date;
  futureValue: Number;

  loanFee: any;
  gstFee: any;
  cashPriceValue: any;
  totalBorrowedAmount: any;
  totalInstallments: any;
  AFVoptions: any;
  selectedOption: any;
  productCode: any;

  balloonValue:any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private commonSvc: CommonService,
    private cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit;
    await this.fetchData();
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
        this.productCode = res.productCode;
        this.cdr.detectChanges();
      });

    if (this.formData?.data) {
      this.paymentSummary = this.formData?.data;
      this.calculateAmountToRepay(this.paymentSummary.flows);
      this.interestRate = this.paymentSummary?.interestRate;
      this.loanDate = this.paymentSummary?.loanDate;
      this.firstPaymentDate = this.paymentSummary?.firstPaymentDate;
      // this.totalAmountToRepay =
      //   this.paymentSummary?.financialAssetLease?.paymentAmount *
      //   (this.paymentSummary?.financialAssetLease?.term || this.paymentSummary?.financialAssetLease?.totalNoofpaymnets);
      this.term =
        this.paymentSummary?.financialAssetLease?.term ||
        this.paymentSummary?.financialAssetLease?.totalNoofpaymnets;
      this.frequency = this.paymentSummary?.frequency;
      this.paymentAmount =
        this.paymentSummary?.financialAssetLease?.paymentAmount;
      this.interestCharges =
        this.paymentSummary?.financialAssetLease?.totalInterest;
      this.loanFee = this.paymentSummary?.apiLoanMaintenceFee,//this.paymentSummary?.loanMaintenanceFee;
      this.gstFee = this.paymentSummary?.financialAssets?.[0]?.taxesAmt;
      //this.cashPriceValue = this.paymentSummary?.financialAssets?.[0]?.cost;
      this.cashPriceValue = this.paymentSummary?.cashPriceValue
      this.totalBorrowedAmount = this.paymentSummary?.totalAmountBorrowed;
      this.lastPaymentDate = this.getLastCalcDt(this.paymentSummary);
    } else {
      this.paymentSummary = this.formData;
      
      this.calculateAmountToRepay(this.paymentSummary.flows);
      this.interestRate = this.paymentSummary?.interestRate;
      this.loanDate = this.paymentSummary?.loanDate;
      this.firstPaymentDate = this.paymentSummary?.firstPaymentDate;
      // this.totalAmountToRepay =
      //   this.paymentSummary?.financialAssetLease?.paymentAmount *
      //   this.paymentSummary?.financialAssetLease?.term;
      this.term = this.paymentSummary?.financialAssetLease?.term;
      this.frequency = this.paymentSummary?.frequency;
      this.paymentAmount =
        this.paymentSummary?.financialAssetLease?.paymentAmount;
      this.interestCharges =
        this.paymentSummary?.financialAssetLease?.totalInterest;

      this.loanFee = this.paymentSummary?.apiLoanMaintenceFee,//this.paymentSummary?.loanMaintenanceFee;
      this.gstFee = this.paymentSummary?.financialAssets?.[0]?.taxesAmt;

     // this.cashPriceValue = this.paymentSummary?.financialAssets?.[0]?.cost;
      this.cashPriceValue = this.paymentSummary?.cashPriceValue
      // Total borrowed amount
      this.totalBorrowedAmount = this.paymentSummary?.totalAmountBorrowed;

      this.lastPaymentDate = this.getLastCalcDt(this.paymentSummary);

      this.balloonValue = this.paymentSummary?.balloonAmount;
    }
    await this.updateValidation("onInit");
  }

  async fetchData() {
    try {
      const response = await lastValueFrom(
        this.svc.data.post("LookUpServices/CustomData", {
          parameterValues: ["AFV End of Term Option"],
          procedureName: configure.SPContractCfdLuExtract,
        })
      );
      if (response?.data?.table.length > 0) {
        this.AFVoptions = response?.data?.table.map((item) => ({
          label: item.value_text,
          value: item.value_text,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  getLastCalcDt(formData: any): string | undefined {
    if (formData && formData.flows && formData.flows.length > 0) {
      return formData.flows[formData.flows.length - 1].calcDt;
    }
    return undefined;
  }

  calculateAmountToRepay(flows: any) {
    let totalInstallments = 0;
    let totalAmtGross = 0;
    flows?.forEach((flow) => {
      if (flow?.flowType === "Installment" || flow?.flowType === "Balloon Payment") {
        totalInstallments += 1;
        totalAmtGross += flow?.amtGross;
      }
    });

    this.totalAmountToRepay = totalAmtGross?.toFixed(2);
    this.totalInstallments = totalInstallments;
  }

  onOptionSelect($event) {}

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "PaymentSummaryDeatilsComponent";

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
