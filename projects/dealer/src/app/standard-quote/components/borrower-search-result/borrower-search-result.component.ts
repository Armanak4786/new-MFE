import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CloseDialogData, CommonService, Mode } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { IndividualService } from "../../../individual/services/individual.service";
import { TrustService } from "../../../trust/services/trust.service";
import { BusinessService } from "../../../business/services/business";
import { map, takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";
import { SearchCustomerComponent } from "../search-customer/search-customer.component";
import { SoleTradeService } from "../../../sole-trade/services/sole-trade.service";
import { DashboardService } from "../../../dashboard/services/dashboard.service";




@Component({
  selector: "app-borrower-search-result",
  templateUrl: "./borrower-search-result.component.html",
  styleUrl: "./borrower-search-result.component.scss",
})
export class BorrowerSearchResultComponent extends BaseStandardQuoteClass {
  searchType: string = "individual";
  quoteList = [
    { name: "Quote", code: "Quote" },
    { name: "Active Contracts", code: "Active Contracts" },
  ];



  fullContractCounts: { [key: string]: any[] } = {};
  customerQuoteTypes: { [key: string]: string } = {};

  customerContracts: {[customerNo: string] : any } = {};
customerQuoteOptions: { [key: string]: any[] } = {};
  columnDefs: any[] = [];

  quoteColumns: any[] = [
    { field: "quoteId", headerName: "Quote ID" ,format: '<a class="cursor-pointer text-primary">{params}</a>',
       action: "redirectToQuoteDetails",width:'13.3%'
    },
    { field: "purchasePrice", headerName: "Purchase Price", format: "#currency" ,width:'13.3%'},
    { field: "interestRate", headerName: "Interest Rate" ,format: "#percentage",width:'13.3%'},
    { field: "quoteType", headerName: "Quote Type" ,width:'20.3%'},
    { field: "term", headerName: "Term (Months)",width:'13.3%',class:'col-term' },
    { field: "payment", headerName: "Payment", format: "#currency",width:'13.3%',class:'align-left col-payment'},
    { field: "customerRole", headerName: "Customer Role" ,width:'13.3%'},
  ];

  activateLoanColumns: any[] = [
    { field: "startDate", headerName: "Start Date", format: "#date",width:'11.5%' },
    { field: "quoteId", headerName: "Loan No.",format: '<a class="cursor-pointer text-primary">{params}</a>', 
      action: "redirectToCustomerStatement",width:'11.5%', class:'col-loanNo'
    },
    { field: "purchasePrice", headerName: "Amount Financed", format: "#currency" ,width:'11.5%'},
    { field: "term", headerName: "Term (Months)",width:'11.5%', class:'col-term' },
    { field: "loanType", headerName: "Loan Type" ,width:'19%',class:'col-loanType'},
    { field: "originator", headerName: "Originator" ,width:'11.5%',class:'col-originator'},
    { field: "salesperson", headerName: "Salesperson",width:'11.5%' },
    { field: "status", headerName: "Status",width:'11.5%' },
  ];

  // columnDefs: any[] = [
  //   {
  //     field: "quoteId",
  //     headerName: "Quote ID",
  //     format:
  //       '<a class="cursor-pointer text-primary">{}<i class="fa-solid fa-angle-right ml-1"></i></a>',
  //   },
  //   {
  //     field: "purchasePrice",
  //     headerName: "Purchase Price",
  //     format: "#currency",
  //   },
  //   { field: "interestRate", headerName: "Interest Rate" },
  //   { field: "QuoteType", headerName: "Quote Type" },
  //   { field: "Term", headerName: "Term (Months)" },
  //   { field: "Payment", headerName: "Payment", format: "#currency" },
  //   { field: "CustomerRole", headerName: "Customer Role" },
  // ];

  // dataList = [
  //   {
  //     quoteID: "1234543",
  //     purchasePrice: "40000",
  //     interestRate: "10.34%",
  //     quoteType: "CSA <Product Name>",
  //     term: "12",
  //     payment: "3400",
  //     customerRole: "Borrower",
  //   },
  //   {
  //     quoteID: "343545",
  //     purchasePrice: "40000",
  //     interestRate: "11.55%",
  //     quoteType: "CSA <Product Name>",
  //     term: "24",
  //     payment: "3400",
  //     customerRole: "Guarantor",
  //   },
  //   {
  //     quoteID: "4546787",
  //     purchasePrice: "40000",
  //     interestRate: "11.80%",
  //     quoteType: "CSA <Product Name>",
  //     term: "36",
  //     payment: "3400",
  //     customerRole: "Guarantor",
  //   },
  // ];

  dataListCollections = [];
  expandedCustomers: boolean[] = [];
  productCode: string;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private commonSvc: CommonService,
    public individualSvc: IndividualService,
    private trustSvc: TrustService,
    private soleTradeSvc: SoleTradeService,
    private businessSvc: BusinessService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    public dashboardSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
    // this.quotetype = this.quoteList[0];
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.productCode = sessionStorage.getItem("productCode") || "";  
    let params: any = this.route.snapshot.params;
    this.searchType = params.customerType;
    this.expandedCustomers = this.baseSvc.searchCustomerData.map(() => false);
     this.baseSvc.searchCustomerData.forEach(customer => {
     this.customerQuoteOptions[customer.customerNo] = [
    { name: 'Quotes', code: 'Quote' },
    { name: 'Activated Loans', code: 'Active Contracts' }
  ];
  });
    //  this.columnDefs = this.getColumnDefs();

  }


  // getQuoteCounts(customerNo: any): any[] {
  //   if (!this.fullContractCounts[customerNo])
  //     return [
  //       {
  //         name: `Quotes`,
  //         code: "Quote",
  //       },
  //       {
  //         name: `Activated Loans`,
  //         code: "Active Contracts",
  //       },
  //     ];

  //   const quoteCount = this.fullContractCounts[customerNo].filter(
  //     (c) => c.type === "Quote"
  //   ).length;
  //   const contractCount = this.fullContractCounts[customerNo].filter(
  //     (c) => c.type === "Contract"
  //   ).length;

  //   return [
  //     {
  //       name: `Quotes (${quoteCount})`,
  //       code: "Quote",
  //     },
  //     {
  //       name: `Activated Loans (${contractCount})`,
  //       code: "Active Contracts",
  //     },
  //   ];
  // }

  // addCustomer(customerNumber: any) {
  //   this.commonSvc.router.navigateByUrl(
  //     `dealer/${this.searchType}/${Mode.edit}/${this.baseFormData.contractId}/${customerNumber}`
  //   );
  // }

    addCustomer(customerNumber: any) {
    const exists = this.baseFormData?.customerSummary?.some(
      customer => customer?.customerNo === customerNumber
    );

    if (exists) {
      const customer = this.baseFormData.customerSummary.find(
        c => c?.customerNo === customerNumber
      );
      this.toasterSvc.showToaster({
        severity: "error",
        summary: "Customer Already Exist",
        detail: `Customer ${customer?.customerName || customerNumber} already exists.`,
      });
      return; // stop here
    }

    // Only navigate if no match
    this.commonSvc.router.navigateByUrl(
      `dealer/${this.searchType}/${Mode.edit}/${this.baseFormData.contractId}/${customerNumber}`
    );

    if(this.searchType === "individual") {
    this.individualSvc.addingExistingCustomer = true
    }
    else if(this.searchType === "business") {
    this.businessSvc.addingExistingCustomer = true
    }
    else if(this.searchType === "trust") {
    this.trustSvc.addingExistingCustomer = true
    }
    else if(this.searchType === "sole-trade") {
    this.soleTradeSvc.addingExistingCustomer = true
    }
  }

  newCustomer() {
    this.individualSvc.activeStep = 0;
    this.businessSvc.activeStep = 0;
    this.trustSvc.activeStep = 0;
    this.soleTradeSvc.activeStep = 0;
    if(this.searchType === "individual") {
      const isBusiness = this.baseFormData?.purposeofLoan?.toLowerCase() === 'business';
      const path = isBusiness ? 'sole-trade' : 'individual';
      this.searchType = path;
    }
    
    this.commonSvc.router.navigateByUrl(`/dealer/${this.searchType}`);
    this.individualSvc.resetBaseDealerFormData();
    this.businessSvc.resetBaseDealerFormData();
    this.trustSvc.resetBaseDealerFormData();
    this.soleTradeSvc.resetBaseDealerFormData();

    

    if(this.searchType === "individual" && this.baseFormData?.loanPurpose?.toLowerCase() === 'business') {
    this.individualSvc.setBaseDealerFormData({
      firstName: this.baseFormData?.individualFirstName,
      lastName: this.baseFormData?.individualLastName,
      dateOfBirth: this.baseFormData?.individualDateOfBirth,

    });
   }
   else if(this.searchType === "individual") {
    this.individualSvc.setBaseDealerFormData({
      firstName: this.baseFormData?.individualFirstName,
      lastName: this.baseFormData?.individualLastName,
      dateOfBirth: this.baseFormData?.individualDateOfBirth,

    });
   }
    else if(this.searchType === "sole-trade") {
    this.soleTradeSvc.setBaseDealerFormData({
      firstName: this.baseFormData?.individualFirstName,
      lastName: this.baseFormData?.individualLastName,
      dateOfBirth: this.baseFormData?.individualDateOfBirth,

    });
    console.log(this.baseFormData,'st')
   }
   else if(this.searchType === "business") {
    console.log(this.baseFormData,'bd')
     this.businessSvc.setBaseDealerFormData({
       registeredCompanyNumber: this.baseFormData?.businessregisteredNo,
       legalName: this.baseFormData?.businessCompanyName?.target?.value ?? this.baseFormData?.businessCompanyName ?? '',
       tradingName: this.baseFormData?.businesstradingName,
       taxNumber: this.baseFormData?.businessgstNo,
     });
   }
   else if(this.searchType === "trust"){
    this.trustSvc.setBaseDealerFormData({
       trustName: this.baseFormData?.udcTrustName??this.baseFormData?.target?.value??'',
    })
   }

  }

  toggleExpand(index: number) {
    this.expandedCustomers[index] = !this.expandedCustomers[index];
  }

  redirectToHome() {
    this.baseSvc.activeStep = 1;
    this.svc.router.navigateByUrl("/dealer/standard-quote");

    this.svc.dialogSvc
          .show(SearchCustomerComponent, "Search Customer", {
            templates: {
              footer: null,
            },
            width: "60vw",
          })
          .onClose.subscribe((data: CloseDialogData) => {});
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

  //   getColumnDefs(): any[] {
  //   const commonColumns = [
  //     {
  //       field: "quoteId",
  //       headerName: "Quote ID",
  //     },
  //     {
  //       field: "purchasePrice",
  //       headerName: "Purchase Price",
  //     },
  //     { field: "interestRate", headerName: "Interest Rate" },
  //     { field: "quoteType", headerName: "Quote Type" },
  //     { field: "term", headerName: "Term (Months)" },
  //     { field: "payment", headerName: "Payment" },
  //     { field: "customerRole", headerName: "Customer Role" }

  //   ];

  //   if(this.quotetype === "Active Contracts") {
  //     return [
  //       ...commonColumns,
  //       { field: "contractId", headerName: "Contract ID" },
  //       { field: "status", headerName: "Status" },
  //     ];
  //   }
  //   return commonColumns;
  // }

 onQuoteTypeChange(customerNo: string) {
  const selectedType = this.customerQuoteTypes[customerNo];
  let viewType = selectedType === 'Active Contracts' ? 'Contracts' : 'Quotes';
  const payload = {
    customerNo: Number(customerNo),
    viewType: viewType
  };
  this.svc.data
    .post(`CustomerDetails/SearchCustomerById`, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response) => {
        const items = response?.items || [];
        
        const mappedData = items.map(item => ({
          quoteId: item.contractId,
          purchasePrice: item.amtFinanced,
          interestRate: item.interestRate,
          quoteType: item.product,
          term: item.termMonths,
          payment: item.amtFirstInstallment,
          customerRole: item.systemDefsPartyRole,
          
          
          startDate: item.calcDt,
          loanType: item.product,
          originator: item.dealer?.name,
          salesperson: item.contractPartyValues?.[0]?.name || '-',
          status: item.contractState,
          type: viewType === 'Quotes' ? 'Quote' : 'Contract'
        }));
         if (!this.fullContractCounts[customerNo]) {
        this.fullContractCounts[customerNo] = [];
      }
       const currentDataType = viewType === 'Quotes' ? 'Quote' : 'Contract';
        
        const otherTypeData = this.fullContractCounts[customerNo].filter(
          item => item.type !== currentDataType
        );
        
        this.fullContractCounts[customerNo] = [...otherTypeData, ...mappedData];
        this.customerContracts[customerNo] = mappedData;
       const quoteCount = this.fullContractCounts[customerNo].filter(c => c.type === "Quote").length;
        const contractCount = this.fullContractCounts[customerNo].filter(c => c.type === "Contract").length;
        
        this.customerQuoteOptions[customerNo] = [
          { name: `Quotes (${quoteCount})`, code: "Quote" },
          { name: `Activated Loans (${contractCount})`, code: "Active Contracts" }
        ];
        
        this.cdr.detectChanges();
      },
    );
}



  getFilteredContracts(customerNo: string): any[] {
  if (!this.customerContracts[customerNo]) {
    return [];
  }
  
  const selectedType = this.customerQuoteTypes[customerNo];
  
  if (selectedType === 'Quote') {
    return this.customerContracts[customerNo].filter(item => item.type === 'Quote');
  } else if (selectedType === 'Active Contracts') {
    return this.customerContracts[customerNo].filter(item => item.type === 'Contract');
  }
  
  return this.customerContracts[customerNo];
}

  async onCellClick($event){
    if ($event.actionName === "redirectToQuoteDetails") {
    const quoteId = $event.cellData;
    // this.svc.router.navigateByUrl(
    //   `dealer/standard-quote/edit/${quoteId}`
    // );
    // this.baseSvc.mode = 'restricted';
     this.svc.router.navigateByUrl(
       `dealer/standard-quote/edit/${quoteId}`
     );
   }

    if ($event.actionName === "redirectToCustomerStatement") {
       const loanNo = $event.rowData.quoteId; 
       const productCode = this.productCode;
      const customerStatementData =  await this.dashboardSvc.getCustomerStatement(loanNo, productCode);
  const customerStatementSessionData = {
    customerStatementData: customerStatementData,
    productCode: productCode,
    contractId: loanNo,
  };

  sessionStorage.setItem('customerStatementData', JSON.stringify(customerStatementSessionData));
  sessionStorage.setItem('productCode', productCode);
  this.baseSvc.setBaseDealerFormData({
    customerStatementData: customerStatementData,
  });
    this.svc.router.navigate(
      ["/dealer/customer-statement", loanNo],
      { queryParams: { productCode: this.productCode } }
    );
  }
    }

  
  }

  

