import { Component, effect, Input, ViewChild } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { CloseDialogData, CommonService, Mode } from "auro-ui";
import { ExportDataComponent } from "../export-data/export-data.component";
import { GenTableComponent } from "auro-ui";
import { QuoteListActionsComponent } from "./quote-list-actions.component";
import { AssignSalespersonComponent } from "../assign-salesperson/assign-salesperson.component";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { PrintService } from "auro-ui";
import { InternalSalesQuoteListActionsComponent } from "./internal-sales-quote-list-actions.component";
import { InternalSalesExpiredQuoteActionsComponent } from "./internal-sales-expired-quote-actions.component";

@Component({
  selector: "app-quote-list",
  templateUrl: "./quote-list.component.html",
  styleUrl: "./quote-list.component.scss",
})
export class QuoteListComponent {
  @ViewChild("dt")
  dt: GenTableComponent;
  @Input() internalSalesQuoteColumns: any;
  @Input() internalSalesExpiredQuoteColumns: any;
  @Input() internalSalesAfvLoanColumns: any;
  @Input() internalSalesActivatedLoansColumns: any;

  accessGranted: any = {};
  filteredList: any = [];
  mode: Mode | string = Mode.create;
  selectedRowData: any;
  selectionMode = false;
  columnsAsset = [];
  searchContractId: any;
  selectedFromDate: any;
  selectedToDate: any;
  rowData: any = [];
  table;
  selectedProducts: any;
  tableId: string = "quote-list"; // Set the ID dynamically here
  internalSalesRowData: any;

  currentListType: string = "";

  isInternalSales: boolean = false;

  listData: any = [
    { name: "Quote", code: "Quote" },
    { name: "AFV Loans", code: "AFVLoan", permission:"afv_list" },
    { name: "Expired Quotes", code: "expiredQuotes" },
    { name: "Active Loans", code: "ActivatedContracts", permission:"activated_contract_list" },
  ];
  internalSalesListData: any = [
    { name: "Quote", code: "internalSalesQuote" },
    { name: "Expired Quote", code: "expiredQuote" },
    { name: "AFV Loans", code: "internalSalesAFVLoan" },
    { name: "Active Loans", code: "activatedLoan" },
  ];

  selecListData = {
    name: "Quote",
    code: "Quote",
  };

  internalSalesSelectListData = {
    name: "Quote",
    code: "internalSalesQuote",
  };

  userRole: any;

  constructor(
    private service: DashboardService,
    public commonSvc: CommonService,
    public standardQuoteSvc: StandardQuoteService,
    private _printSvc: PrintService,
    private dashboardSvc: DashboardService
  ) {
    effect(
      () => {
        const dealer = this.dashboardSvc?.onOriginatorChange();
        if (dealer) {
          this.dashboardSvc.setDealerToLocalStorage(dealer);
        }
      },
      {
        allowSignalWrites: true, // enable writing to signals inside effect
      }
    );
  }

  async ngOnInit(): Promise<void> {
    this.isInternalSales =
     (sessionStorage.getItem("externalUserType") == "Internal") ? true : false
    if (this.isInternalSales) {
      this.columnsAsset = this.internalSalesQuoteColumns;
      this.selecListData = this.internalSalesSelectListData;
      this.service.internalSalesQuoteListing.subscribe((data) => {
        this.rowData = data;
      });
      return;
    }
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");
    const hideAfvLoan = this.userRole?.functions?.includes("afv_list");
    const hideActivatedContracts = this.userRole?.functions?.includes(
      "activated_contract_list"
    );
    const hideQuote = this.userRole?.functions?.includes("quote_list");
    this.listData = [];

  if(!hideQuote){
  this.listData.push({ name: "Quote", code: "Quote" });
  } else {
     
  }
  if (!hideAfvLoan) {
    this.listData.push({ name: "AFV Loan", code: "AFVLoan" });
    
  } else {
    
  }
  this.listData.push({ name: "Expired Quote", code: "expiredQuotes" });
  if (!hideActivatedContracts) {
    this.listData.push({ name: "Active Loans", code: "ActivatedContracts" });
   
  } else {
    
  }

    await this.service.getQuoteList(1, 10);
    this.getActivateContractList();
    this.service.quoteListing.subscribe((data) => {
      this.rowData = data;
    });

    //  this.dashboardSvc?.onOriginatorChange.subscribe(async (dealer) => {
    //   if(dealer){
    //   this.dashboardSvc.setDealerToLocalStorage(dealer)
    //   }
    // })
  }

  eraseData(field) {
    if (field == "id") {
      if (this.selectedFromDate) this.selectedFromDate = null;
      if (this.selectedToDate) this.selectedToDate = null;
    }
    if (field == "date") {
      if (this.searchContractId) this.searchContractId = null;
    }
  }

  async onClickSearch() {
    // this.isQuote = false;
    // // await this.getQuoteListById(this.searchContractId);

    if (this.selectedFromDate && this.selectedToDate) {
      const startDate = this.selectedFromDate;
      const endDate = this.selectedToDate;

      const filteredData = this.rowData.filter((item) => {
        const itemDate = new Date(item.StartDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
      this.rowData = filteredData;
      // this.getActivateContractList();

      // if (this.apiData.length == 0) {
      //   // this.isQuote=true;
      // }
    } else if (this.searchContractId) {
      await this.service.getQuoteListById(this.searchContractId);
      this.getActivateContractList();
      this.service.quoteListing.subscribe((data) => {
        this.rowData = data;
      });

      // if (this.availableData.length == 0) {
      //   this.isQuote = true;
      // }
    }
  }

  async onClickReset() {
    this.searchContractId = undefined;
    this.selectedFromDate = undefined;
    this.selectedToDate = undefined;
    this.selecListData = {
      name: "Active Loans",
      code: "ActivatedContracts",
    };
    await this.service.getQuoteList(1, 10);
    this.getActivateContractList();
    this.service.quoteListing.subscribe((data) => {
      this.rowData = data;
    });
  }

  getActivateContractList() {
    // this.columnsAsset = [
    //   {
    //     field: "id",
    //     headerName: "Id",
    //     class: "hidden",
    //   },
    //   {
    //     field: "StartDate",
    //     headerName: "Start Date",
    //     format: "#date",
    //     dateFormat: "MM/dd/yyyy",
    //   },
    //   { field: "contractId", headerName: "Quote ID" },
    //   { field: "CustomerName", headerName: "Customer Name" },
    //   { field: "LoanAmount", headerName: "Loan Amount", format: "#currency" },
    //   { field: "LoanTerm", headerName: "Loan Term" },
    //   { field: "RepaypemntFrequency", headerName: "Repayment Frequency" },
    //   // { field: 'LoanTerm', headerName: 'Loan Term' },
    //   {
    //     field: "actions",
    //     headerName: "Action",
    //     format: "#icons",
    //     actions: "onCellClicked",
    //   },
    // ];

    this.columnsAsset = [
          {field: "selectCheckbox", headerName: "", format: "#checkbox" },  
          { field: "StartDate", headerName: "Date", format: "#date", dateFormat: "MM/dd/yyyy", columnHeaderClass: "pr-7"  },
          { field: "contractId", headerName: "Quote ID"},
          { field: "CustomerName", headerName: "Name",  columnHeaderClass: "pr-7" },
          { field: "coBorrower", headerName: "Co-borrower Name" },
          { field: "product", headerName: "Product",  columnHeaderClass: "pr-5"},
          { field: "LoanAmount", headerName: "Amount", format: "#currency", columnHeaderClass: "pr-6" },
          { field: "LoanTerm", headerName: "Term(Months)" },
          { field: "originator", headerName: "Originator" },
          { field: "dealerSalesperson", headerName: "Salesperson" },
          { field: "webformCheckbox", headerName: "Webform Checkbox", format: "#checkbox" },
          { field: "workflowStatus", headerName: "Workflow Status" },
          { field: "assignedTo", headerName: "Assigned To" },
          { field: "actions", headerName: "Actions", format: "#icons", overlayPanel : InternalSalesQuoteListActionsComponent }
    ]
  }

  assign(internalSalesRowData?: any) {
    // this.commonSvc.dialogSvc
    //   .show(AssignSalespersonComponent, "Assignee", {
    //     templates: {
    //       footer: null,
    //     },
    //     width: "55vw",
    //   })
    //   .onClose.subscribe((data: CloseDialogData) => {});

    //for internal sales
    //afv product arent allowed to assign salesperson
    if(internalSalesRowData){
      this.commonSvc.dialogSvc
      .show(AssignSalespersonComponent, "Assign", {
        templates: {
          footer: null,
        },
        data: {
          rowData: internalSalesRowData,
        },
        width: "55vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
    }
  }

  onCellClick(event) {
    if (
      event.colName === "actions" &&
      event.rowData &&
      (this.currentListType == "ActivatedContracts" ||
        this.currentListType == "AFVLoan")
    ) {
      this.dashboardSvc.setCurrentRowData(event.rowData);
      return;
    }
  this.dashboardSvc.setCurrentRowData(event.rowData);
    let id = event?.rowData?.contractId;
    this.standardQuoteSvc.activeStep = 0;
    if (event.actionName == "view") {
      this.standardQuoteSvc.accessMode = "view";
      this.standardQuoteSvc.mode = "view";

      this.commonSvc.router.navigateByUrl(
        `/standard-quote/${event.actionName}/${id}`
      );
    } else if (event.actionName == "edit") {
      //fetching productCode from JSON file
      let code = this.dashboardSvc.getCodeByName(event?.rowData?.product);
      sessionStorage.setItem("productCode", JSON.stringify(code));

      this.standardQuoteSvc.accessMode = "edit";
      this.standardQuoteSvc.mode = "edit";
      this.standardQuoteSvc.calculatedOnce = true;
      this.dashboardSvc.userSelectedOption = {
        name: event?.rowData?.dealerName,
        num: Number(event?.rowData?.dealerId),
      };
      this.dashboardSvc.setDealerToLocalStorage(
        this.dashboardSvc.userSelectedOption
      );
      this.standardQuoteSvc.dealerOriginationFeeopenOnEdit = true;
      this.commonSvc.router.navigateByUrl(
        `/standard-quote/${event.actionName}/${id}`
      );
    } else if (event.actionName == "copy") {
      this.standardQuoteSvc.accessMode = "copy";
      this.standardQuoteSvc.mode = "copy";
      this.standardQuoteSvc.calculatedOnce = true;
      this.commonSvc.router.navigateByUrl(
        `/standard-quote/${event.actionName}/${id}`
      );
    }

    if (event.colName === "selectCheckbox" && event.cellData) {
      this.internalSalesRowData = event.rowData;
    }
  }

  showAssetSearchPopup(header) {
    let data = this.dt;

    this.commonSvc.dialogSvc
      .show(ExportDataComponent, header, {
        templates: {
          footer: null,
        },
        data: {
          tableId: this.tableId,
          dt: this.dt,
        },

        width: "55vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
  }

  ChangeDealerList(e) {
    this.currentListType = e.value.code;
    if (e.value.code == "Quote") {
      this.selectionMode = false;

      this.getActivateContractList();

      this.service.quoteListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (e.value.code == "AFVLoan") {
      // this.selectionMode = true;

      // this.columnsAsset = [
      //   {
      //     field: "id",
      //     headerName: "Id",
      //     class: "hidden",
      //   },
      //   {
      //     field: "loanId",
      //     headerName: "Loan ID",
      //     tooltip: "loanId",
      //   },
      //   {
      //     field: "customerName",
      //     headerName: "Customer Name",
      //     tooltip: "customerName",
      //   },
      //   { field: "asset", headerName: "Assets", tooltip: "asset" },
      //   { field: "regNo", headerName: "Rego/ID No." },
      //   {
      //     field: "maxPermittedKM",
      //     headerName: "Maximum Permitted KM",
      //   },
      //   {
      //     field: "futureValDate",
      //     headerName: "Future Value Date",
      //     format: "#date",
      //     dateFormat: "MM/dd/yyyy",
      //   },
      //   {
      //     field: "futureValAmount",
      //     headerName: "Future Value Amount",
      //     format: "#currency",
      //     type: "rightAligned",
      //     headerClass: "header-right",
      //   },

      //   {
      //     field: "loanBalance",
      //     headerName: "Loan Balances",
      //     format: "#currency",
      //     type: "rightAligned",
      //     headerClass: "header-right",
      //   },
      //   {
      //     field: "phone",
      //     headerName: "Phone",
      //   },
      //   { field: "email", headerName: "Email" },

      //   {
      //     field: "actions",
      //     headerName: "Action",
      //     format: "#icons",
      //     overlayPanel: QuoteListActionsComponent,
      //   },
      // ];

      this.columnsAsset = [
    { field: "loanId", headerName: "Loan Id", columnHeaderClass: "pr-2"  },
    { field: "customerName", headerName: "Customer Name" },
    { field: "coBorrower", headerName: "Co-borrower Name" },
    { field: "asset", headerName: "Asset" },
    { field: "regNo", headerName: "Rego",  columnHeaderClass: "pr-4" },
    // { field: "term", headerName: "Term(Months)" },
    // { field: "remainingTerm", headerName: "Remaining Term" },
    // { field: "startDate", headerName: "Start Date" },
    // { field: "product", headerName: "Product" },
    // { field: "regularPaymentAmoun", headerName: "Regular Payment Amount" }, 
    { field: "maxPermittedKm", headerName: "Maximum Permitted KM" },
    { field: "futureValDate", headerName: "Future Value Date", format: "#date", dateFormat: "MM/dd/yyyy" },
    { field: "futureValAmount", headerName: "Future Value Amount" },
    { field: "loanBalance", headerName: "Outstanding Balance" },
    // { field: "interestRate", headerName: "Interest Rate" },
    // { field: "provider", headerName: "Provider" },
    // { field: "customerDecision", headerName: "Customer Decision" },
    { field: "originator", headerName: "Originator" },
    { field: "email", headerName: "Email", columnHeaderClass: "pr-8" },
    { field: "phone", headerName: "Phone", columnHeaderClass: "pr-8" },
    { field: "actions", headerName: "Actions", format: "#icons", overlayPanel : QuoteListActionsComponent }
  ]
      this.service.afvLoanListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (e.value.code == "expiredQuotes") {
      this.selectionMode = false;
      // this.columnsAsset = [
      //   {
      //     field: "id",
      //     headerName: "Id",
      //     class: "hidden",
      //   },
      //   {
      //     field: "StartDate",
      //     headerName: "Start Date",
      //     format: "#date",
      //     dateFormat: "MM/dd/yyyy",
      //   },
      //   { field: "ApplicationID", headerName: "Application ID" },
      //   { field: "CustomerName", headerName: "Customer Name" },
      //   { field: "LoanAmount", headerName: "Loan Amount" },
      //   { field: "LoanTerm", headerName: "Loan Term" },
      //   { field: "RepaypemntFrequency", headerName: "Repayment Frequency" },
      //   { field: "status", headerName: "Status" },
      //   {
      //     field: "actions",
      //     headerName: "Action",
      //     format: "#icons",
      //   },
      // ];
        this.columnsAsset = [
          { field: "StartDate", headerName: "Date", format: "#date", dateFormat: "MM/dd/yyyy", columnHeaderClass: "pr-7"  },
          { field: "contractId", headerName: "Quote ID"},
          { field: "CustomerName", headerName: "Name",  columnHeaderClass: "pr-7" },
          { field: "coBorrower", headerName: "Co-borrower Name" },
          { field: "product", headerName: "Product",  columnHeaderClass: "pr-5" },
          { field: "LoanAmount", headerName: "Amount", format: "#currency", columnHeaderClass: "pr-6" },
          { field: "LoanTerm", headerName: "Term(Months)" },
          { field: "originator", headerName: "Originator" },
          { field: "dealerSalesperson", headerName: "Salesperson" },
          { field: "webformCheckbox", headerName: "Webform Checkbox", format: "#checkbox" },
          { field: "workflowStatus", headerName: "Workflow Status" },
          { 
            field: "assignedTo", 
            headerName: "Assigned To",
            // hidden : (row) => {
            //   return row.assignedTo == "Submitted"
            // }

          },
          { field: "actions", headerName: "Actions",  format: "#icons", overlayPanel : InternalSalesExpiredQuoteActionsComponent}
    ]

      this.service.applicationListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (e.value.code == "ActivatedContracts") {
      this.selectionMode = false;

      // this.columnsAsset = [
      //   {
      //     field: "id",
      //     headerName: "Id",
      //     class: "hidden",
      //   },
      //   {
      //     field: "loanId",
      //     headerName: "Loan ID",
      //     tooltipValueGetter: (params, index) => {
      //       return params;
      //     },
      //     // action: 'redirectToSTnd',
      //   },
      //   {
      //     field: "customerName",
      //     headerName: "Customer Name",
      //     tooltipValueGetter: (params, index) => {
      //       return params;
      //     },
      //   },
      //   { field: "asset", headerName: "Assets", tooltip: "asset" },
      //   { field: "regNo", headerName: "Rego/ID No." },
      //   {
      //     field: "loanAmount",
      //     headerName: "Loan Amount",
      //     format: "#currency",

      //     type: "rightAligned",
      //     headerClass: "header-right",
      //   },
      //   {
      //     field: "maturityDate",
      //     headerName: "Maturity Date",
      //     format: "#date",
      //     dateFormat: "MM/dd/yyyy",
      //   },
      //   { field: "product", headerName: "Product" },

      //   {
      //     field: "loanBalance",
      //     headerName: "Loan Balances",
      //     tooltipForHeader: (field, header) => {
      //       return "pop up message which will be detailed in the FDD";
      //     },
      //   },
      //   {
      //     field: "phone",
      //     headerName: "Phone",
      //   },
      //   { field: "email", headerName: "Email" },

      //   {
      //     field: "actions",
      //     headerName: "Action",
      //     format: "#icons",
      //     overlayPanel: QuoteListActionsComponent,
      //     // data: this.rowData,
      //   },
      // ];

      this.columnsAsset = [
    // {field: "selectCheckbox", headerName: "", format: "#checkbox" },
    { field: "loanId", headerName: "Loan Id" },
    { field: "customerName", headerName: "Customer Name" },
    { field: "coBorrower", headerName: "Co-borrower Name" },
    { field: "asset", headerName: "Asset" },
    { field: "regNo", headerName: "Rego/ID No" },
    { field: "loanAmount", headerName: "Amount Financed", format: "#currency" },
    // { field: "term", headerName: "Term(Months)" },
    // { field: "remainingTerm", headerName: "Remaining Term" },
    // { field: "startDate", headerName: "Start Date" },
    { field: "maturityDate", headerName: "Maturity Date" },
    { field: "product", headerName: "Product", columnHeaderClass: "pr-8" },
    // { field: "regularPaymentAmount", headerName: "Regular Payment Amount" },
    // { field: "finalPaymentAmount", headerName: "Final Payment/Residual Value" },
    // { field: "totalUnitUsage", headerName: "Total Unit Usage" },
    // { field: "interestRate", headerName: "interestRate" },
    { field: "outstandingBalance", headerName: "Outstanding Balance" },
    { field: "originator", headerName: "Originator" },
    { field: "email", headerName: "Email", columnHeaderClass: "pr-8" },
    { field: "phone", headerName: "Phone", columnHeaderClass: "pr-8" },
    { field: "actions", headerName: "Actions", format: "#icons", overlayPanel : QuoteListActionsComponent }
  ]

      this.service.getActivatedContracts().then((allData) => {
        this.totalRecord = allData.length;
        this.rowData = allData.slice(0, this.rows).map((item) => ({
          ...item,
          actions: this.service.actionForActivatedContractList,
        }));
      });

      //     this.service.getActivatedContracts(1, 10);

      // this.service.activatedContractList.subscribe((data) => {
      //   this.rowData = data;
      // });

      // Call API only once to fetch full dataset
    } else if (e.value.code == "internalSalesQuote") {
      this.columnsAsset = this.internalSalesQuoteColumns;
      this.service.internalSalesQuoteListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (e.value.code == "expiredQuote") {
      this.columnsAsset = this.internalSalesExpiredQuoteColumns;
      this.service.internalSalesExpiredQuoteListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (e.value.code == "internalSalesAFVLoan") {
      this.columnsAsset = this.internalSalesAfvLoanColumns;
      this.service.internalSalesAfvLoanListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (e.value.code == "activatedLoan") {
      this.columnsAsset = this.internalSalesActivatedLoansColumns;
      this.service.internalSalesActivatedLoanListing.subscribe((data) => {
        this.rowData = data;
      });
    }
  }

  first: any = 0;
  rows: any = 10;
  totalRecord = 50;
  async onPageChange(event) {
    if (this.currentListType === "Quote") {
      // Existing flow
      await this.service.getQuoteList(event.page + 1, event.rows);
      this.getActivateContractList();
      this.service.quoteListing.subscribe((data) => {
        this.rowData = data;
      });
    } else if (this.currentListType === "ActivatedContracts") {
      // Local pagination only
      let allData = this.service.activatedContractData;
      this.rowData = allData.slice(event.first, event.first + event.rows);
    }
  }

  onPrint() {
    let columns = this.dt.columns || [];
    const data = this.dt.dataList || [];

    if (columns) {
      columns = columns.filter(
        (column) => column.headerName !== "Action" && column.headerName !== "Id"
      );
    }
    if (data) {
      data.forEach((item) => {
        const date = new Date(item.StartDate);
        const formattedDate = `${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
        item.StartDate = formattedDate;
      });
    }
    if (this.selecListData.name) {
      this._printSvc.export("pdf", this.selecListData.name, columns, data);
    } else {
      // console.error('No export format selected');
    }
  }

  // onRefresh() : void {

  // }

  // this.dt.print();
  // this._printSvc.export('csv', 'quote-list', 'table');
}
