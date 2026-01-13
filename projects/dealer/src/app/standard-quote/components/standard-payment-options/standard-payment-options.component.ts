import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CommonService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { CalculationService } from "../payment-summary/calculation.service";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-standard-payment-options",
  templateUrl: "./standard-payment-options.component.html",
  styleUrl: "./standard-payment-options.component.scss",
})
export class StandardPaymentOptionsComponent extends BaseStandardQuoteClass {
  totalBorrowedAmount: number;
  hidden: boolean = true;
  isResultTrue: boolean;
  emi: number;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public calculationSvc: CalculationService,
    private cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  headerText = "Standard Payment Option";

  // accordianValue: number = 1;
  standarPaymentRowData: any[] = [];
  columnDefs: any[] = [
    { field: "months", headerName: "Term (Months)", //width: 130 
    },
    {
      field: "kmAllowance",
      headerName: "KM Allowance",
      //width: 150,
      class: "hidden",
      //format: "#currency",
      default: 0
    },
     {
      field: "paymentAmount",
      headerName: "Payment Amount",
      //width: 150,
      format: "#currency",
    },
    {
      field: "weeklyEquivalent",
      headerName: "Weekly Equivalent",
      //width: 150,
      format: "#currency",
    },
  ];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.baseFormData?.standardPaymentOptionValue) {
      this.baseSvc.standardValueAccordianValue = 0;
      this.standarPaymentRowData =
        this.baseFormData?.standardPaymentOptionValue;
      this.cdr.detectChanges();
    }

    this.baseSvc?.standardPaymentOptionsTable?.subscribe((val) => {
      if (val) {
        this.cdr.detectChanges();
      }
    });
  }

  override onFormDataUpdate(res: any): void {
    if (res?.productId) {
      if (res.productCode == 'AFV') {
        this.headerText = "Assured Future Value Options";
        this.columnDefs[1].class = "";
      } else {
        this.headerText = "Standard Payment Option";
        this.columnDefs[1].class = "hidden";
      }
    }
  }
  override onButtonClick(event: any): void {}

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "StandardPaymentOptionsComponent";

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
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
  }

  override async onCalledPreview(
    formData: any,
    isProgramChanged?: any
  ): Promise<void> {}
  activeIndexChange(index: number) {
    this.baseSvc.standardValueAccordianValue = index;
    console.log(this.baseSvc.standardValueAccordianValue);
  }
}
