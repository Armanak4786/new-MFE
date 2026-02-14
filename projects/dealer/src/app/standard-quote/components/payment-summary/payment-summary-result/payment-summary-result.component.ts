import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import { DatePipe } from "@angular/common";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-payment-summary-result",
  templateUrl: "./payment-summary-result.component.html",
  styleUrl: "./payment-summary-result.component.scss",
  providers: [DatePipe],
})
export class PaymentSummaryResultComponent extends BaseStandardQuoteClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    await super.ngOnInit();

    this.renderData();
  }
  // async ngAfterViewInit() {
  //   await super.ngOnInit();
  // }

  renderData() {
    if (this.baseFormData?.flows || this.baseFormData?.data?.flows) {
      const filteredInstallments = (this.baseFormData?.flows || []).filter(
        (item) => item.flowType === "Installment"
      );
      const lastIndex = filteredInstallments.length - 1;
      const lastItem = filteredInstallments[lastIndex];
      const formattedDate = this.datePipe.transform(
        lastItem?.calcDt,
        "dd/MM/yyyy"
      );

      this.mainForm.form.get("lastPaymentDateValue").patchValue(formattedDate);
      this.mainForm.updateHidden({
        lastPaymentDateValue: false,
      });
    }

    if (this.baseFormData && this.mainForm?.form) {
      if (this.baseFormData.productCode === "FL") {
        this.mainForm.updateHidden({
          totalCostRes: true,
        });
        this.mainForm.updateProps("paymentAmountRes", {
          cols: 4,
          className: "pl-2 leftAlignText payment-amount-label-left-FL",
          inputClass: "leftAlignText pl-2",
        });
        this.mainForm.updateProps("numberofFlows", {
          cols: 4,
          className: "text-center",
        });
        this.mainForm.updateProps("lastPaymentDateValue", {
          cols: 4,
          className: "text-right pr-4",
        });
      } else if (this.baseFormData.productCode === "OL") {
        // For OL, update the number of payments alignment
        this.mainForm.updateProps("numberofFlows", {
          cols: 3,
          className: "p-0 pr-3 m-0 w-13rem text-right",
        });
        this.mainForm.updateProps("lastPaymentDateValue", {
          className:
            "col-fixed m-0 p-0 pl-3 w-7rem ng-star-inserted rightAlignText",
          inputClass: "pr-1",
                  labelClass: "col-fixed pr-0 m-0 pl-3",

        });
        this.mainForm.updateProps("advancePaymentAmountRes", {
          cols: 3,
          className: "p-0 m-0 pl-1 pr-1 subtl-right w-12rem",
          inputClass: "pr-1",
        });
      } else if (this.baseFormData.productCode !== "OL") {
        this.mainForm.updateHidden({
          totalCostRes: false,
        });
      }
      if (this?.baseFormData?.paymentAmountIrregular) {
        this.mainForm.updateProps("paymentAmountRes", {
          type: "text",
        });
        let paymentAmount = this.baseFormData?.paymentAmount;
        // console.log(this?.baseFormData.loanMaintenanceFee);
        let totalCostRes =
          (this?.baseFormData.amtTotalInterest || 0) +
          (this?.baseFormData.amtFinancedTotal || 0) +
          (this?.baseFormData.loanMaintenceFee || 0);
        //((this?.baseFormData.loanMaintenanceFee || 0) * (this.baseFormData?.numberofFlows || 0));
        this.mainForm.get("paymentAmountRes").patchValue("Irregular");
        this.mainForm.get("totalCostRes").patchValue(totalCostRes || 0);
      } else {
        const flow = this.baseSvc.getFirstInstallmentFlow(this.baseFormData);

        let paymentAmount = flow?.amtGross;
        // let paymentAmount  = this.baseFormData?.initialLeasePayment ? this.baseFormData?.initialLeasePayment : flow?.amtGross
        // let paymentAmount = this.baseFormData?.paymentAmount;
        let loanMFee;
        if (this.baseFormData.weiveLMF == "0") {
          loanMFee = this?.baseFormData.loanMaintenceFee;
        } else {
          loanMFee = 0;
        }
        
        let totalCostRes =
          (this?.baseFormData.amtTotalInterest || 0) +
          (this?.baseFormData.amtFinancedTotal || 0) +
          loanMFee;
        // ((this?.baseFormData.loanMaintenanceFee || 0) * (this.baseFormData?.numberofFlows || 0));
        setTimeout(() => {
        this.mainForm.form.get("totalCostRes").patchValue(totalCostRes || 0);
        this.mainForm.form.get("paymentAmountRes").patchValue(paymentAmount);
        this.cdr.detectChanges();
        }, 0);
      
      }

      if (this.baseFormData?.productCode == "OL") {
        let advancePaymentAmount =
          this.baseFormData?.flows?.find(
            (flow) => flow.flowType === "Installment - Final in Advance"
          )?.amtGross || 0;
        this.mainForm
          ?.get("advancePaymentAmountRes")
          ?.patchValue(advancePaymentAmount);
      }
    }
  }

  override onCalledPreview(formData: any): void {
    super.onCalledPreview(formData);
    this.renderData();
  }

  override formConfig: GenericFormConfig = {
    headerTitle: "",
    autoResponsive: true,
    cardType: "non-border",
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary-light",
    bodyClass: "mt-2",
    fields: [
      {
        type: "amount",
        label: "Payment Amount",
        labelClass: "col-fixed pr-0 m-0",
        className: "text-right col-fixed w-8rem m-0 p-0 ml-0 rightAlignText left-padding-0",
        name: "paymentAmountRes",
        inputClass: "text-right pr-2",
        inputType: "vertical",
        disabled: true,
        hidden: false,
        cols: 3,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "First Lease Payment",
        className: "col-fixed w-10rem",
        name: "firstLeasePaymentLabel",
        hidden: true,
      },
      {
        type: "amount",
        label: "Total Amount to Repay",
        labelClass: "col-fixed pr-0 m-0",
        className: "text-right p-0 m-0 ml-2 col-fixed w-11rem pr-2 rightAlignText",
        name: "totalCostRes",
        inputClass: "text-right",
        inputType: "vertical",
        disabled: true,
        hidden: false,
        cols: 3,
        mode: Mode.view,
      },
      {
        type: "number",
        styleType: "labelType",
        label: "Total Number of Payments",
        labelClass: "col-fixed pr-0 m-0",
        name: "numberofFlows",
        cols: 3,
        inputType: "vertical",
        className: "col-fixed w-13rem text-right pr-2 pt-0 pl-0 ",
        inputClass: "text-right",
        disabled: true,
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Last Lease Date",
        name: "lastLeasePaymentLabel",
        hidden: true,
        cols: 3,
      },
      {
        type: "amount",
        styleType: "labelType",
        name: "afvaPaymentSummaryAmount",
        label: "Assured Future Value",
        disabled: true,
        hidden: true,
        cols: 1,
        default: 0,
        labelClass: "col-fixed pr-0 m-0",
        inputType: "vertical",
        className: "col-fixed w-10rem text-left-label-only pl-2 p-0 ml-0 m-0",
        inputClass: "pr-3",
      },
      {
        type: "amount",
        label: "Advance Payment Amount",
        name: "advancePaymentAmountRes",
        inputClass: "text-right",
        labelClass: "col-fixed pr-0 m-0",
        inputType: "vertical",
        className: "col-fixed w-10rem text-right p-0 m-0",
        disabled: true,
        hidden: true,
        cols: 3,
      },
      {
        type: "text",
        label: "Last Payment",
        name: "lastPaymentDateValue",
        labelClass: "col-fixed pr-0 m-0",
        cols: 2,
        disabled: true,
        mode: Mode.view,
        inputType: "vertical",
        className: "col-fixed w-11rem ml-2 text-right pr-0 pt-0 pl-0",
        inputClass: "text-right",
      },
    ],
  };

  override onFormDataUpdate(res: any): void {
    super.onFormDataUpdate(res);
  }

  override onFormEvent(event: any): void {
    super.onFormEvent(event);
  }

  override renderComponentWithNewData() {
    if (this.baseFormData?.data && this.mainForm?.form) {
      this.mainForm.form.patchValue({
        contractId: this.baseFormData?.data.contractId,
      });
    }
    super.renderComponentWithNewData();
    this.cdr.detectChanges();
  }

  pageCode: string = "";
  modelName: string = "";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
    const productCode = sessionStorage.getItem("productCode");
    if (productCode === "OL") {
      // this.mainForm.updateProps("numberofFlows", {
      //   label: "Total Number of Payments",
      // });
      this.mainForm.updateHidden({
        totalCostRes: true,
        advancePaymentAmountRes: false,
      });
    }

    if (productCode == "AFV") {
      
      this.mainForm.updateHidden({
        afvaPaymentSummaryAmount: false,
      });
      this.mainForm.form.get("afvaPaymentSummaryAmount").patchValue(this.baseFormData?.assuredFutureValue || 0);
      this.mainForm.updateProps("totalCostRes", {
        cols: 2,
        className: "text-right p-0 m-0 col-fixed w-10rem pr-0 mr-2",
      });
      this.mainForm.updateProps("paymentAmountRes", {
        cols: 1,
        className: "col-fixed p-0 pr-2 m-0 w-8rem",
        
      });
      this.mainForm.updateProps("numberofFlows", {
        cols: 1,
        className: "col-fixed w-12rem text-right pt-0 pl-0",
      });
      this.mainForm.updateProps("lastPaymentDateValue", {
        cols: 1,
        className:
          "col-fixed m-0 p-0 pl-0 ng-star-inserted last-payment-AFV",
        // inputClass: "pr-1",
                // className: "col-fixed p-0 pr-2 m-0 w-8rem rightAlignText text-right"

      });
    }

    if (productCode === "CSA") {
      this.mainForm.updateProps("lastPaymentDateValue", {
        className: "text-right col-fixed w-10rem pt-0 pr-3 ml-2",
      });
      
    }
    if (productCode === "TL") {
      this.mainForm.updateProps("lastPaymentDateValue", {
        className: "text-right col-fixed w-10rem pt-0 pr-3",
      });
    }
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
