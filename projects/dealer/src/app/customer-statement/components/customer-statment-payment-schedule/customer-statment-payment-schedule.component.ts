import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CustomerStatementService } from "../../service/customer-statement.service";
import { PayementSchedule } from "../../model/customer-statment";
import { ToasterService, ValidationService, CommonService } from "auro-ui";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../../standard-quote/base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-customer-statment-payment-schedule",
  templateUrl: "./customer-statment-payment-schedule.component.html",
  styleUrl: "./customer-statment-payment-schedule.component.scss",
})
export class CustomerStatmentPaymentScheduleComponent extends BaseStandardQuoteClass implements OnInit {
  customerStatementApiData: any;
  
  custcolumns = [
    {
      field: "paymentDate",
      headerName: "Payment date",
      format: "#date",
      dateFormat: "dd/MM/yy",
      sortable:true,
    },
    {
      field: "principalAmount",
      headerName: "Principal Amount",
      format: "#currency",
      sortable:true,
    },
    {
      field: "interestPayment",
      headerName: "Interest Payment",
      format: "#currency",
      sortable:true,
    },
    {
      field: "paymentAmount",
      headerName: "Payment Amount",
      format: "#currency",
      sortable:true,
    },
    {
      field: "principalBalance",
      headerName: "Principal Balance",
      format: "#currency",
      sortable:true,
    },
    {
      field: "remainingInterest",
      headerName: "Remaining Interest",
      format: "#currency",
      sortable:true,
    },
  ];

  custdataList: PayementSchedule[];

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
    if (this.baseFormData?.customerStatementData) {
      this.customerStatementApiData = this.baseFormData.customerStatementData;
      this.extractRepaymentScheduleData();
    } else {
      this.custdataList = [];
    }
  }
  extractRepaymentScheduleData() {
    if (!this.customerStatementApiData) {
      console.warn("No customer statement API data available");
      this.custdataList = [];
      return;
    }
    const repaymentSchedule = this.customerStatementApiData?.repaymentScheduleResponse;
    if (repaymentSchedule && repaymentSchedule.length > 0) {
      this.custdataList = repaymentSchedule.map((item: any) => ({
        paymentDate: item.date,
        principalAmount: item.principal,
        interestPayment: item.interest,
        paymentAmount: item.amount,
        principalBalance: item.principalBalance,
        remainingInterest: item.remainingInterest
      }));
    } else {
      this.custdataList = [];
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
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "I7",
        });
      }
    }
  }
}
