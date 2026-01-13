import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { CalculationService } from "../payment-summary/calculation.service";
import { EditPaymentScheduleComponent } from "../payment-schedule/edit-payment-schedule/edit-payment-schedule.component";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-rental-schedule",
  templateUrl: "./rental-schedule.component.html",
  styleUrl: "./rental-schedule.component.scss",
})
export class RentalScheduleComponent extends BaseStandardQuoteClass {
  totalBorrowedAmount: number;
  hidden: boolean = false;
  isResultTrue: boolean;
  emi: number;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public calculationSvc: CalculationService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  headerText = "Rental Schedule";

  standarPaymentRowData: any[] = [
    {
      numberOfRental: 12,
      frequency: "Monthly",
      gstExcluded: 536,
      totalGst: 131.87,
      gstIncluded: 211,
      date: "05/12/2022",
    },
    {
      numberOfRental: 24,
      frequency: "Quaterly",
      gstExcluded: 266,
      totalGst: 674,
      gstIncluded: 443,
      date: "05/12/2022",
    },
    {
      numberOfRental: 36,
      frequency: "Yearly",
      gstExcluded: 177,
      totalGst: 449,
      gstIncluded: 331,
      date: "05/12/2022",
    },
    {
      numberOfRental: 48,
      frequency: "Monthly",
      gstExcluded: 188,
      totalGst: 337,
      gstIncluded: 229,
      date: "05/12/2022",
    },
    {
      numberOfRental: 60,
      frequency: "Quaterly",
      gstExcluded: 661,
      totalGst: 173,
      gstIncluded: 100,
      date: "05/12/2022",
    },
    {
      numberOfRental: 72,
      frequency: "Yearly",
      gstExcluded: 69,
      totalGst: 173,
      gstIncluded: 150,
      date: "05/12/2022",
    },
    {
      numberOfRental: 84,
      frequency: "Quaterly",
      gstExcluded: 611,
      totalGst: 173,
      gstIncluded: 700,
      date: "05/12/2022",
    },
  ];
  columnDefs: any[] = [
    { field: "numberOfRental", headerName: "Number Of Rental", width: "150px" },
    {
      field: "frequency",
      headerName: "Frequency",
      width: "60px",
    },
    {
      field: "gstExcluded",
      headerName: "GST Excl",
      width: "150px",
      format: "#currency",
    },
    {
      field: "totalGst",
      headerName: "GST",
      width: "150px",
      format: "#currency",
    },
    {
      field: "gstIncluded",
      headerName: "GST Incl",
      format: "#currency",
      width: "150px",
    },
    {
      field: "date",
      headerName: "Date",

      width: "50px",
    },
  ];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    await this.updateValidation("onInit");
  }
  showDialogEditPaymentSmall() {
    this.svc.dialogSvc
      .show(EditPaymentScheduleComponent, "Edit Payment Schedule")
      .onClose.subscribe((data: any) => {});
  }
  override onFormDataUpdate(res: any): void {
    if (res?.productId && res?.productId === 15) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }
  override onButtonClick(event: any): void {}

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
