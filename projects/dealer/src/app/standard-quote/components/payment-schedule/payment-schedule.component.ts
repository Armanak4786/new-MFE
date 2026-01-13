import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "auro-ui";
import { GenericDialogService } from "auro-ui";
import { EditPaymentScheduleComponent } from "./edit-payment-schedule/edit-payment-schedule.component";
import { EditPaymentScheduleTableComponent } from "./edit-payment-schedule-table/edit-payment-schedule-table.component";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { PaymentScheduleService } from "./payment-schedule.service";
import { ToasterService, ValidationService } from "auro-ui";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-payment-schedule",
  templateUrl: "./payment-schedule.component.html",
  styleUrl: "./payment-schedule.component.scss",
})
export class PaymentScheduleComponent extends BaseStandardQuoteClass {
  @Input() customerStatment: any;

  hidden: boolean = true;
  productCode?: any;
  isFinanceLease?: boolean = false;
  value: string = "first";
  firstPaymentDate?: string;
  frequency: any;
  totalNumberOfPayments: number;
  paymentAmount: number;
  totalAmountBorrowed: any;
  term: any;
  interestRate: any;
  editPaymentScheduleNumberOfPayments: any;
  filteredInstallments: any;
  financeLeaseFirstInstallments: any;
  financeLeaseAllInstallments: any;
  paymentSchedule: any[] = [];
  residualValueList: any[] = [];
  financeLeasePaymentRowData: any[] = [];
  residualValuePaymentRowData: any[] = [];
  financeLeaseAllRowData: any[] = [];
  btnStatus: boolean;
  flow;

  // Dynamic labels for header text
  summaryLabel: string = 'Payment Summary';
  scheduleLabel: string = 'Payment Schedule';

  //End:component variables

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private dialogSVC: GenericDialogService,
    private paymentScheduleSvc: PaymentScheduleService,
    private cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    private toasterService: ToasterService
  ) {
    super(route, svc, baseSvc);
  }

  // Getter for dynamic header text based on customerStatment and productCode
  get dynamicHeaderText(): string {
    if (this.customerStatment === 'Customer Statement') {
      return this.summaryLabel;
    } else {
      return this.scheduleLabel;
    }
  }

  private setupDynamicLabels(): void {
    switch (this.productCode) {
      case 'FL':
        this.summaryLabel = 'Lease Summary';
        this.scheduleLabel = 'Lease Schedule';
        break;
      case 'OL':
        this.summaryLabel = 'Rental Summary';
        this.scheduleLabel = 'Rental Schedule';
        break;
      default:
        this.summaryLabel = 'Payment Summary';
        this.scheduleLabel = 'Payment Schedule';
        break;
    }
  }

  columnDefs: any[] = [
    {
      field: "paymentScheduleDate",
      headerName: "Date",
      format: "#date",
      //dateFormat: "MM/dd/yy",
      dateFormat: "dd/MM/yyyy",
    },
    { field: "paymentScheduleNumber", headerName: "Number" },
    { field: "paymentScheduleFrequency", headerName: "Frequency" },
    {
      field: "paymentAmount",
      headerName: "Payment",
      format: "#currency",
      class: 'col-end',
    },
  ];

  financeLeaseColumnDefs: any[] = [
    { field: "number", headerName: "Number" },
    { field: "frequency", headerName: "Frequency" },
    {
      field: "gstExcl",
      headerName: "GST Excl",
      format: "#currency",
    },
    {
      field: "GST",
      headerName: "GST",
      format: "#currency",
    },
    {
      field: "gstIncl",
      headerName: "GST incl",
      format: "#currency",
    },
    {
      field: "date",
      headerName: "Date",
      format: "#date",
      dateFormat: "dd/MM/yy",
    },
  ];

  financeLeaseAllColumnDefs: any[] = [
    { field: "number", headerName: "Number" },
    { field: "frequency", headerName: "Frequency" },
    {
      field: "gstExcl",
      headerName: "GST Excl",
      format: "#currency",
    },
    {
      field: "GST",
      headerName: "GST",
      format: "#currency",
    },
    {
      field: "gstIncl",
      headerName: "GST incl",
      format: "#currency",
    },
    {
      field: "date",
      headerName: "Date",
      format: "#date",
      dateFormat: "dd/MM/yy",
    },
  ];

  residualValueColumnDefs: any[] = [
    {
      field: "residualEndDate",
      headerName: "End Date",
      format: "#date",
      dateFormat: "dd/MM/yy",
    },
    {
      field: "residualGstExcl",
      headerName: "GST Excl",
      format: "#currency",
      class: 'col-end',
    },
    {
      field: "residualGST",
      headerName: "GST",
      format: "#currency",
      class: 'col-end',
    },
    {
      field: "residualGstIncl",
      headerName: "GST incl",
      format: "#currency",
      headerClass: "text-center",
      class: 'col-end',
    },
  ];

  tempValue = "first";
  onClick(event) {
    if (event) {
      this.tempValue = event;
    } else {
      this.value = this.tempValue;
    }
  }

  secondColumnDefs: any[] = [
    {
      field: "date",
      headerName: "Date",
      format: "#date",
      //dateFormat: "MM/dd/yy",
      dateFormat: "dd/MM/yyyy",
      width: "30%",
    },
    { field: "number", headerName: "Number", width: "30%" },
    { field: "frequency", headerName: "Frequency", width: "15%" },
    {
      field: "payment",
      headerName: "Payment",
      format: "#currency",
      width: "25%",
      class: 'col-end',
    },
  ];

  justifyOptions: any[] = [
    { icon: "pi pi-equals", value: "first" },
    { icon: "pi pi-bars", value: "second" },
  ];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.productCode = sessionStorage.getItem("productCode");

    // Setup dynamic labels based on product code
    this.setupDynamicLabels();

    this.loadCustomerStatementData()
    console.log(this.baseFormData, 'dfg')
    if (this.productCode === "FL" && this.paymentSchedule) {
      this.residualValueList = this.paymentSchedule.filter(
        (row) => row.flowName === "Residual Flow"
      );
    }

    this.baseSvc.forceToClickCalculate.subscribe((status) => {
      this.btnStatus = status;
    });
    this.renderData();

    if (this.productCode === "FL" || this.productCode === "OL") {
      this.columnDefs.push(
        {
          field: "paymentScheduleGST", headerName: "GST", format: "#currency",
          class: 'col-end',
        },
        {
          field: "paymentScheduleTotal",
          headerName: "Total Payment",
          format: "#currency",
          class: 'col-end',
        }
      );
    }

    await this.updateValidation("onInit");
  }

  override onStatusChange(statusDetails: any): void {
    if ((configure?.workflowStatus?.view?.includes(statusDetails?.currentState)) || (configure?.workflowStatus?.edit?.includes(statusDetails?.currentState))) {
      this.isDisable = true
    }
  }

  async loadCustomerStatementData() {
    let res: any;
    try {
      if (this.baseFormData?.customerStatementData) {
        const paymentSummary = this.baseFormData?.customerStatementData?.paymentSummary;
        if (paymentSummary && paymentSummary.length > 0) {
          this.paymentSchedule = paymentSummary.map((item: any) => ({
            paymentScheduleDate: item.date,
            paymentScheduleNumber: item.number,
            paymentScheduleFrequency: item.frequency,
            paymentAmount: item.payment,

            ...(this.productCode === "FL" || this.productCode === "OL" ? {
              paymentScheduleGST: 0, // Add if available in API
              paymentScheduleTotal: item.payment
            } : {})
          }));
          this.paymentScheduleSvc.paymentScheduleList = paymentSummary.map((item: any) => ({
            date: item.date,
            number: item.number,
            frequency: item.frequency,
            payment: item.payment
          }));
        } else {
          this.paymentSchedule = [];
          this.paymentScheduleSvc.paymentScheduleList = [];
        }
      }
    } catch (error) {
      this.paymentSchedule = [];
      this.paymentScheduleSvc.paymentScheduleList = [];
    }
  }

  renderData() {
    let params: any = this.route.snapshot.params;
    this.mode = this.baseSvc.mode;

    this.justifyOptions = [
      { icon: "pi pi-equals", value: "first" },
      { icon: "pi pi-bars", value: "second" }
    ];

    if (this.baseFormData?.totalAmountBorrowed) {
      if (this.baseFormData?.flows) {
        const filteredInstallments = (this.baseFormData?.flows || []).filter(
          (item) =>
            item.flowType === "Installment" ||
            item.flowType === "Balloon Payment" ||
            item.flowType === "Interest Only"
        );

        // Optionally sort filtered installments by installment number
        filteredInstallments.sort((a, b) => a.installmentNo - b.installmentNo);
        this.filteredInstallments = filteredInstallments;
      }
      this.totalAmountBorrowed = this.baseFormData?.totalAmountBorrowed;
      let balloonPayment = (this.baseFormData?.flows || []).filter(
        (item) => item.flowType === "Balloon Payment"
      );

      this.viewPaymentSchedule(
        this.baseFormData?.financialAssetPriceSegments,
        this.filteredInstallments,
        balloonPayment
      );
      this.viewPaymentScheduleGrid(
        this.baseFormData.frequency,
        this.filteredInstallments
      );
    }
  }

  override onCalledPreview(formData) {
    // super.onCalledPreview(formData);
    this.renderData();
  }

  override onFormDataUpdate(res: any): void {
    let isUpdating: boolean;

    if (isUpdating) {
      return;
    }
    isUpdating = true;
    try {
      if (res?.productId && res?.productId === 15) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
      if (res?.productCode == "FL") {
        this.isFinanceLease = true;
      } else {
        this.isFinanceLease = false;
      }
    } finally {
      isUpdating = false;
    }
  }

  viewPaymentScheduleGrid(frequency: string, filteredInstallments: any[]) {
    const paymentScheduleList = [];
    for (let i = 0; i < filteredInstallments.length; i++) {
      const installment = filteredInstallments[i];

      const installmentFrequency =
        installment.flowType === "Balloon Payment" ? "Once" : frequency;

      paymentScheduleList.push({
        date: installment.calcDt,
        number: installment.installmentNo,
        frequency: installmentFrequency,
        payment:
          installment.amount == 0 ? installment.amount : installment.amtGross,
        actualMaintenanceFee: this.baseFormData?.actualMaintenanceFee,
      });
    }
    if (paymentScheduleList.length >= 2) {
      const lastIndex = paymentScheduleList.length - 1;
      const lastRow = paymentScheduleList[lastIndex];
      const secondLastRow = paymentScheduleList[lastIndex - 1];

      if (lastRow.number === secondLastRow.number) {
        secondLastRow.payment =
          Number(secondLastRow.payment || 0) + Number(lastRow.payment || 0);

        secondLastRow.actualMaintenanceFee =
          Number(secondLastRow.actualMaintenanceFee || 0) +
          Number(lastRow.actualMaintenanceFee || 0);

        paymentScheduleList.splice(lastIndex, 1);
      }
    }
    let actualMaintenanceFeeSum = 0;
    let index = -1;

    paymentScheduleList.forEach((ele, idx) => {
      if (ele.payment == 0) {
        if (idx !== paymentScheduleList.length - 1) {
          actualMaintenanceFeeSum += Number(ele.actualMaintenanceFee || 0);
        }
      }
    });

    index = paymentScheduleList.findIndex((item) => item.payment !== 0);

    if (index !== -1 && actualMaintenanceFeeSum > 0) {
      paymentScheduleList[index].payment =
        Number(paymentScheduleList[index].payment) + actualMaintenanceFeeSum;
    }

    this.paymentScheduleSvc.paymentScheduleList = paymentScheduleList;
  }

  viewPaymentSchedule(data, filteredInstallments, balloonData) {
    // Clear the current payment schedule
    this.paymentSchedule = [];
    const maxMonths = Math.max(
      ...filteredInstallments.map((item) => item.installmentNo)
    );
    let lastInstallment = filteredInstallments?.find(
      (ele) => ele?.installmentNo == maxMonths && ele?.flowType == "Installment"
    );

    data?.forEach((ele, index) => {
      if (index != data?.length - 1 || !balloonData?.[0]?.amtGross) {

        this.flow = this.baseFormData?.flows?.find(
          f => f.flowType === "Installment" && f.installmentNo === index + 1
        ) || null;

        this.paymentSchedule.push({
          paymentScheduleDate: ele?.paymentScheduleDate,
          paymentScheduleNumber: ele?.installments,
          paymentScheduleFrequency:
            ele?.installmentFrequency || ele?.paymentScheduleFrequency,

          ...(this.productCode === "FL" && this.flow
            ? {
              paymentScheduleGST: this.flow.amtTax,
              paymentScheduleTotal: this.flow.amtGross,
              priceSegmentId: ele?.priceSegmentId,
              priceScheduleId: ele?.priceScheduleId
            }
            : {}),

          ...(this.productCode === "OL" && this.flow
            ? {
              paymentScheduleGST: ele?.paymentAmount != 0 ? this.flow.amtTax : 0,
              paymentScheduleTotal: (ele?.paymentAmount != 0
                ? Number(ele?.paymentAmount) +
                Number(this.baseFormData?.actualMaintenanceFee)
                : ele?.paymentAmount) + (ele?.paymentAmount != 0 ? this.flow.amtTax : 0),
            }
            : {}),

          paymentAmount:
            this.baseFormData?.productCode !== "FL"
              ? (ele?.paymentAmount != 0
                ? Number(ele?.paymentAmount) + Number(this.baseFormData?.actualMaintenanceFee ? this.baseFormData?.actualMaintenanceFee : 0)
                : ele?.paymentAmount)
              : ele?.paymentSchedulePayment,
          actualMaintenanceFee: this.baseFormData?.actualMaintenanceFee,
          segmentType: ele?.segmentType,
          isCustomised:
            ele?.segmentType == "Payment Total" ? true : ele.isCustomised,
        });
      } else {
        if (ele?.installments == 1) {
          this.paymentSchedule.push({
            paymentScheduleDate: ele?.paymentScheduleDate,
            paymentScheduleNumber: ele?.installments,
            paymentScheduleFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentSchedulePayment:
              ele?.paymentSchedulePayment + balloonData?.[0]?.amtGross,

            ...(this.productCode === "FL" && {
              paymentScheduleGST: ele?.paymentScheduleGST,
              paymentScheduleTotal: ele?.paymentScheduleTotal,
              priceSegmentId: ele?.priceSegmentId,
              priceScheduleId: ele?.priceScheduleId
            }),
            paymentAmount:
              ele?.paymentAmount != 0
                ? Number(ele?.paymentAmount) +
                Number(this.baseFormData?.actualMaintenanceFee) +
                Number(balloonData?.[0]?.amtGross)
                : Number(ele?.paymentAmount) +
                Number(balloonData?.[0]?.amtGross),
            actualMaintenanceFee: this.baseFormData?.actualMaintenanceFee,
            segmentType: ele?.segmentType,
          });
        } else {
          this.paymentSchedule.push({
            paymentScheduleDate: ele?.paymentScheduleDate,
            paymentScheduleNumber: ele?.installments - 1,
            paymentScheduleFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentSchedulePayment: ele?.paymentSchedulePayment,

            ...(this.productCode === "FL" && {
              paymentScheduleGST: ele?.paymentScheduleGST,
              paymentScheduleTotal: ele?.paymentScheduleTotal,
              priceSegmentId: ele?.priceSegmentId,
              priceScheduleId: ele?.priceScheduleId
            }),
            paymentAmount:
              ele?.paymentAmount != 0
                ? Number(ele?.paymentAmount) +
                Number(this.baseFormData?.actualMaintenanceFee ? this.baseFormData?.actualMaintenanceFee : 0)
                : ele?.paymentAmount,
            actualMaintenanceFee: this.baseFormData?.actualMaintenanceFee,
            segmentType: ele?.segmentType,
          });

          this.paymentSchedule.push({
            paymentScheduleDate: lastInstallment?.calcDt,
            paymentScheduleNumber: 1,
            paymentScheduleFrequency:
              ele?.installmentFrequency || ele?.paymentScheduleFrequency,
            paymentSchedulePayment:
              lastInstallment?.amtGross + (balloonData?.[0]?.amtGross || 0),

            ...(this.productCode === "FL" && {
              paymentScheduleGST: ele?.paymentScheduleGST,
              paymentScheduleTotal: ele?.paymentScheduleTotal,
              priceSegmentId: ele?.priceSegmentId,
              priceScheduleId: ele?.priceScheduleId
            }),
            paymentAmount:
              lastInstallment?.amtGross + (balloonData?.[0]?.amtGross || 0),
            actualMaintenanceFee: this.baseFormData?.actualMaintenanceFee,
            segmentType: ele?.segmentType,
            isCustomised:
              ele?.segmentType == "Payment Total" ? true : ele.isCustomised,
          });
        }
      }
    });

    let actualMaintenanceFeeSum = 0;
    let index = -1;

    this.paymentSchedule.forEach((ele, idx) => {
      if (ele.paymentAmount === 0) {
        if (this.baseFormData?.fixed) {
          if (idx !== this.paymentSchedule.length - 1) {
            actualMaintenanceFeeSum += Number(ele.actualMaintenanceFee || 0);
          }
        } else {
          if (idx !== this.paymentSchedule.length - 1) {
            actualMaintenanceFeeSum += Number(ele.actualMaintenanceFee || 0);
          }
        }
      }
    });
    index = this.paymentSchedule.findIndex((item) => item.paymentAmount !== 0);

    if (index !== -1 && actualMaintenanceFeeSum > 0) {
      const newItem = {
        paymentScheduleDate: this.paymentSchedule[index]?.paymentScheduleDate,
        paymentScheduleNumber: 1,
        paymentScheduleFrequency:
          this.paymentSchedule[index]?.installmentFrequency || this.paymentSchedule[index]?.paymentScheduleFrequency,
        paymentSchedulePayment:
          this.paymentSchedule[index]?.paymentSchedulePayment,
        paymentAmount:
          Number(this.paymentSchedule[index].paymentAmount) +
          actualMaintenanceFeeSum,
        actualMaintenanceFee: this.baseFormData?.actualMaintenanceFee,
        segmentType: "Payment Total",
        isCustomised: true,
        ...(this.productCode === "FL" && {
          paymentScheduleGST: this.paymentSchedule[index]?.paymentScheduleGST,
          paymentScheduleTotal: this.paymentSchedule[index]?.paymentScheduleTotal,
          priceSegmentId: this.paymentSchedule[index]?.priceSegmentId,
          priceScheduleId: this.paymentSchedule[index]?.priceScheduleId
        }),
      };

      this.paymentSchedule.splice(index, 0, newItem);
      this.paymentSchedule[index + 1].paymentScheduleNumber =
        Number(this.paymentSchedule[index + 1].paymentScheduleNumber) -
        1;

      let paymentDate = filteredInstallments[index + 1]?.calcDt;
      this.paymentSchedule[index + 1].paymentScheduleDate = paymentDate;
    }

    // residual mapping - only for FL
    if (this.productCode === "FL") {
      const residualFlows = (this.baseFormData?.flows || []).filter(
        (f) => f.flowType === "Residual Value"
      );

      this.residualValueList = residualFlows.map((residual) => ({
        residualEndDate: this.baseFormData?.residualValueDelayDt,
        residualGstExcl: residual.gstExclMonthly,
        residualGST: residual.gstMonthly,
        residualGstIncl: residual.gstInclMonthly,
      }));
    }
  }

  showDialogEditPaymentSmall() {
    if (this.btnStatus) {
      this.toasterService.showToaster({
        severity: "error",
        detail: "Please click calculate",
      });
      return;
    }
    this.svc.dialogSvc
      .show(EditPaymentScheduleComponent, "Edit Payment Schedule", {
        templates: {
          footer: null,
        },
        data: {},
        width: "46vw",
      })
      .onClose.subscribe((data: any) => { });
    this.baseSvc?.forceCalculateBeforeSchedule.next(false);
  }

  showDialogEditPaymentLarge() {
    if (this.btnStatus) {
      this.toasterService.showToaster({
        severity: "error",
        detail: "Please click calculate",
      });
      return;
    }
    this.svc.dialogSvc
      .show(EditPaymentScheduleTableComponent, "Edit Payment Schedule", {
        templates: {
          footer: null,
        },
        data: {
          filteredInstallments: this.filteredInstallments,
        },
      })
      .onClose.subscribe((data: any) => { });
  }

  pageCode: string = "PaymentScheduleComponent";
  modelName: string = "PaymentScheduleComponent";

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

  showAllRows: boolean = false;

  toggleRows() {
    this.showAllRows = !this.showAllRows;
  }
}
