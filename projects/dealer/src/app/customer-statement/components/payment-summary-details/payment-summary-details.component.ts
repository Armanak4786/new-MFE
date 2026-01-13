import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CustomerStatementService } from "../../service/customer-statement.service";
import {
  AssuredFuture,
  LoanDetails,
  OperatingLease,
} from "../../model/customer-statment";
import { ToasterService, ValidationService, CommonService } from "auro-ui";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../../standard-quote/base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-payment-summary-details",
  templateUrl: "./payment-summary-details.component.html",
  styleUrl: "./payment-summary-details.component.scss",
})
export class PaymentSummaryDetailsComponent extends BaseStandardQuoteClass implements OnInit {
  loanDetails: LoanDetails[];
  assuredFuture: AssuredFuture[];
  customerStatementApiData: any;
  operatingLease: OperatingLease[]
  productCode: string;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private customerSvc: CustomerStatementService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.productCode = sessionStorage.getItem('productCode') || '';
    if (this.baseFormData?.customerStatementData) {
      this.customerStatementApiData = this.baseFormData.customerStatementData;
      this.extractPaymentSummaryData();
    } else {
    }
  }
  extractPaymentSummaryData() {
    if (!this.customerStatementApiData) {
      return;
    }
    this.loanDetails = [{
      product: this.customerStatementApiData?.products || '',
      term: this.customerStatementApiData?.loanDetails?.term || 0,
      interestRate: this.customerStatementApiData?.loanDetails?.interestRate || 0,
      loanDate: this.customerStatementApiData?.loanDetails?.loanDate || null,
      maturityDate: this.customerStatementApiData?.loanDetails?.maturityDate || null,
      loanAmount: this.customerStatementApiData?.loanDetails?.loanAmount || 0,
      interestCharge: this.customerStatementApiData?.loanDetails?.interestCharge || 0,
    }];

    // Map AFV specific data (only if product is AFV)
    if (this.productCode === 'AFV') {
      this.assuredFuture = [{
        futureValue: this.customerStatementApiData?.assuredFutureValue?.futureValueAmount || 0,
        futureDate: this.customerStatementApiData?.assuredFutureValue?.futureValueDate || null,
        
      }];
    }
    // Map OL specific data (only if product is OL)
    if (this.productCode === 'OL') {
      this.operatingLease = [{
        residualValueExcl: this.customerStatementApiData?.residualValueExcl || 0,
        gst: this.customerStatementApiData?.gst || 0,
        residualValueIncl: this.customerStatementApiData?.residualValueIncl || 0,
        endDate: this.customerStatementApiData?.endDate || null
      }];
    }if (this.productCode === 'FL') {
      this.operatingLease = [{
        residualValueExcl: this.customerStatementApiData?.residualValueExcl || 0,
        gst: this.customerStatementApiData?.gst || 0,
        residualValueIncl: this.customerStatementApiData?.residualValueIncl || 0,
        endDate: this.customerStatementApiData?.endDate || null
      }];
    }


  }

  pageCode: string = "";
  modelName: string = "";

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
