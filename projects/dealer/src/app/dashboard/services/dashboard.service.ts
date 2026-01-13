import { ChangeDetectorRef, Injectable, signal } from "@angular/core";
import { DataService, StorageService } from "auro-ui";
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  Subject,
} from "rxjs";
import { StandardQuoteService } from "../../standard-quote/services/standard-quote.service";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

export const threeDotIcon = [
  {
    icon: 'fa-solid fa-ellipsis',
  },
];


@Injectable({
  providedIn: "root",
})
export class DashboardService {
  userName: String;
  userSelectedOption: any;
  userSelectedPartyNo: any;
  userOptions: any;
  userCodeName: any;
  dealerAnimate: boolean = false;
  userType: "Internal" | "External" = "Internal";
  introducers: any;

  // public onOriginatorChange = new BehaviorSubject<any>(null);
  public onOriginatorChange = signal<any>(null);
  public quoteRoute = new BehaviorSubject<any>(false);
  public isProductSelected: boolean = false;
  public isDealerCalculated: boolean;
  public programChange$ = new BehaviorSubject<boolean>(false);

  private readonly ACTIVATED_CONTRACT_STATE_LIST = "Complete Activated";
  private readonly ACTIVATED_PRODUCT_LIST = "CSA-C-Assigned,CSA-B-Assigned";

  applicationStatus = [
    { img: "assets/images/icon/card-edit.svg", count: 68, name: "Started" },
    { img: "assets/images/icon/card-tick.svg", count: 42, name: "Submitted" },
    {
      img: "assets/images/icon/wallet-money.svg",
      count: 1080250,
      name: "Applications Value",
    },
  ];

  workFlow = [
    { label: "Quote", amount: 1500, count: 20 },
    { label: "Assessment", amount: 500, count: 10 },
    { label: "Approved", amount: 500, count: 12 },
    { label: "With Customer for Signing", amount: 200, count: 10 },
    { label: "Verification", amount: 300, count: 15 },
    { label: "Settlement", amount: 500, count: 10 },
    { label: "Not Tracked", amount: 500, count: 10 },
  ];

  activatedContractListActions = [
    {
      action: "open",
      name: "open",
      icon: "fa-regular fa-ellipsis",
    },
  ];
  // actions = [
  //   {
  //     action: "edit",
  //     name: "edit",
  //     icon: "fa-regular fa-pen-to-square",
  //     color: "--primary-color",
  //   },
  //   {
  //     action: "copy",
  //     name: "copy",
  //     icon: "fa-regular fa-clone",
  //     color: "--primary-color",
  //   },
  //   {
  //     action: "view",
  //     name: "view",
  //     icon: "fa-regular fa-eye",
  //     color: "--primary-color",
  //   },
  //   {
  //     action: "delete",
  //     name: "delete",
  //     icon: "fa-regular fa-trash-can",
  //     color: "--danger-color",
  //   },
  // ];

  constructor(
    // private service: DashboardService,
    public data: DataService,
    public standardQuoteSvc: StandardQuoteService, // private cd: ChangeDetectorRef // private _printSvc: PrintService
    private router: Router,
    private http: HttpClient,
    private stoteSvc: StorageService
  ) {
    this.loadProducts();
  }

  async getQuoteListById(contractId) {
    let quoteList = await this.standardQuoteSvc.getFormData(
      `Contract/get_allcontract?ContractId=${contractId}`,
      function (res) {
        return res?.data || null;
      }
    );
    this.quoteListingData = this.getBindQuoteTableData(quoteList);
    return this.quoteListingData;
  }

  async getContractDetails(contractId: string) {
    let contractData = await this.standardQuoteSvc.getFormData(
      `Contract/get_contract?ContractId=${contractId}`,
      function (res) {
        return res?.data || null;
      }
    );
    if (contractData?.contractEtag) {
      this.stoteSvc.setItem("contractEtag", contractData?.contractEtag);
    }

    return contractData;
  }

  async getQuoteList(pageNo, pageSize) {
    // ?PageNo=1&PageSize=600
    let quoteList = await this.data
      .get(`Contract/get_allcontract?PageNo=${pageNo}&PageSize=${pageSize}`)
      .pipe(
        map((res) => {
          return res?.data || null;
        })
      )
      .toPromise();

    this.quoteListingData = this.getBindQuoteTableData(quoteList);
    return quoteList;
  }

  getBindQuoteTableData(quoteList: any) {
    let apiData = [];
    quoteList?.forEach((quote) => {
      let obj = {
        StartDate: quote?.calcDt,
        contractId: quote?.contractId,
        // CustomerName: quote?.customerParty?.extName || "--",
        CustomerName:
          quote?.customerParty?.extName || quote?.originatorReference,
        LoanAmount: quote?.amtFinanced,
        LoanTerm: quote?.termMonths,
        RepaypemntFrequency: "--",
        actions: threeDotIcon,
        originator: quote?.dealer?.extName,
        dealerId: quote?.dealer?.partyNo,
        product: quote?.product,
      };
      apiData.push(obj);
      this.quoteListingData = [...apiData];
    });
    // this.apiData.push(this.hardCoded);

    this.quoteListingData = [...apiData];
    this.quoteListing.next(this.quoteListingData);
    // this.cd.detectChanges();
  }

  getUserCode(): string | null {
    const token = sessionStorage.getItem("accessToken");
    const decodedToken = this.decodeToken(token);
    return decodedToken?.preferred_username || decodedToken?.sub || null;
  }

  async getActivatedContracts() {
    const userCode = this.getUserCode();
    const body = {
      userCode: userCode,
      dealerId: null,
      contractStateList: this.ACTIVATED_CONTRACT_STATE_LIST,
      productList: this.ACTIVATED_PRODUCT_LIST,
    };

    let contracts = await this.data
      .post(`Settlement/get_grid_activatedloans`, body)
      .pipe(map((res) => res?.data || []))
      .toPromise();

    this.activatedContractData = this.bindActivatedContracts(contracts);

    // push everything to BehaviorSubject once
    this.activatedContractList.next(this.activatedContractData);
    return this.activatedContractData;
  }

  // bindActivatedContracts(contractList: any) {
  //   let apiData = [];
  //   contractList?.forEach((contract) => {
  //     let obj = {
  //       id: contract?.id,
  //       loanId: contract?.loanId,
  //       customerName: contract?.customerName,
  //       asset: contract?.asset,
  //       regNo: contract?.regNo,
  //       loanAmount: contract?.loanAmount,
  //       maturityDate: contract?.maturityDate,
  //       product: contract?.product,
  //       loanBalance: contract?.loanBalance,
  //       phone: contract?.phone,
  //       email: contract?.email,
  //       actions: this.actions,
  //     };
  //     apiData.push(obj);
  //   });

  //   this.activatedContractData = [...apiData];
  //   this.activatedContractList.next(this.activatedContractData);
  //   return this.activatedContractData;
  // }

  bindActivatedContracts(contractList: any) {
    return (
      contractList?.map((contract) => ({
        id: contract?.id,
        loanId: contract?.loanID,
        customerName: contract?.customerName,
        asset: contract?.asset,
        regNo: contract?.regoNo,
        loanAmount: contract?.amount,
        maturityDate: contract?.maturityDate,
        product: contract?.product,
        loanBalance: contract?.loanBalance,
        phone: contract?.phone,
        email: contract?.email,
        actions: this.actionForActivatedContractList,
      })) || []
    );
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      // console.error('Invalid Token', error);
      return null;
    }
  }

  actionForActivatedContractList = [
    {
      icon: "fa-solid fa-ellipsis",
    },
  ];

  quoteListingData: any = [];
  quoteListing = new BehaviorSubject<any>(this.quoteListingData);

  activatedContractData: any = [];
  activatedContractList = new BehaviorSubject<any>(this.activatedContractData);

  applicationListing = new BehaviorSubject<any>([
    {
      id: 1,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 1",
      LoanAmount: "5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Weekly",
      status: "Pending",
      workflowStatus: "Submitted",
      assignedTo: "John Doe",
      //actions: this.actions,
      actions : threeDotIcon
    },
    {
      id: 2,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 2",
      LoanAmount: "5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      //actions: this.actions,
      actions: threeDotIcon
    },
    {
      id: 3,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 3",
      LoanAmount: "5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: threeDotIcon
      //actions: this.actions,
    },
    {
      id: 4,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 4",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: threeDotIcon
      //actions: this.actions,
    },
    {
      id: 5,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 5",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: threeDotIcon
      //actions: this.actions,
    },
    {
      id: 6,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 6",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: threeDotIcon
      //actions: this.actions,
    },
    {
      id: 7,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 7",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: threeDotIcon
      //actions: this.actions,
    },
  ]);

  activatedContractListing = new BehaviorSubject<any>([
    {
      id: 1,
      loanId: "321321",
      customerName: "David",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 2,
      loanId: "321321",
      customerName: "John",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 3,
      loanId: "321321",
      customerName: "paul",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 4,
      loanId: "321321",
      customerName: "Micky",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 5,
      loanId: "321321",
      customerName: "abc",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 6,
      loanId: "321321",
      customerName: "Customer Name 1",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 7,
      loanId: "3396",
      customerName: "Bh Na",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 8,
      loanId: "3580",
      customerName: "Ani Vin",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
  ]);

  afvLoanListing = new BehaviorSubject<any>([
    {
      id: 1,
      loanId: "321321",
      customerName: "David",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 2,
      loanId: "321321",
      customerName: "John",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 3,
      loanId: "321321",
      customerName: "paul",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 4,
      loanId: "321321",
      customerName: "Micky",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",

      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 5,
      loanId: "321321",
      customerName: "abc",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",

      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 6,
      loanId: "321321",
      customerName: "Customer Name 1",
      maxPermittedKM: "30,000",

      futureValDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 7,
      loanId: "3396",
      customerName: "Customer Name 2",
      maxPermittedKM: "30,000",

      futureValDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
  ]);
  internalSalesQuoteListing = new BehaviorSubject<any>([
  {
    date: new Date("2024-10-21T00:00:00"),
    contractId: "Q12345",
    customerName: "David Johnson",
    coBorrower: "Sarah Johnson",
    product: "CSA-C-Assigned",
    program: "Standard Finance",
    assetType: "Car",
    amount: "25000",
    term: "36",
    originator: "John Doe",
    dealerSalesperson: "Mike Ross",
    salesperson: "Harvey Specter",
    webformCheckbox: true,
    workflowStatus: "Approved",
    assignedTo: "Team A",
    actions: this.actionForActivatedContractList,
  },
  {
    date: new Date("2024-11-05T00:00:00"),
    contractId: "Q98765",
    customerName: "Emily Brown",
    coBorrower: "Tom Brown",
    product: "CSA-C-Direct Fixed",
    program: "Quick Ride",
    assetType: "Bike",
    amount: "12500",
    term: "24",
    originator: "",
    dealerSalesperson: "",
    salesperson: "Monica Geller",
    webformCheckbox: false,
    workflowStatus: "Pending",
    assignedTo: "Team B",
    actions: this.actionForActivatedContractList,
  },
  {
    date: new Date("2024-12-10T00:00:00"),
    contractId: "Q45678",
    customerName: "Michael Smith",
    coBorrower: "Aria Smith",
    product: "Home Loan",
    program: "DreamHouse",
    assetType: "Tipper Truck",
    amount: "15000",
    term: "12",
    originator: "Robert King",
    dealerSalesperson: "Jessica Pearson",
    salesperson: "Louis Litt",
    webformCheckbox: true,
    workflowStatus: "In Progress",
    assignedTo: "Team C",
    actions: this.actionForActivatedContractList,
  },
  {
    date: new Date("2024-09-30T00:00:00"),
    contractId: "Q65432",
    customerName: "Sophia Williams",
    coBorrower: "Dennis Williams",
    product: "Personal Loan",
    program: "Instant Cash",
    assetType: "Car",
    amount: "8000",
    term: "12",
    originator: "Alex Turner",
    dealerSalesperson: "Nina Dobrev",
    salesperson: "Paul Wesley",
    webformCheckbox: false,
    workflowStatus: "Rejected",
    assignedTo: "Team D",
    actions: this.actionForActivatedContractList,
  },
  ])

  internalSalesExpiredQuoteListing = new BehaviorSubject<any>([
     {
    date: new Date("2025-01-15T00:00:00"),
    contractId: "Q11223",
    customerName: "Olivia Parker",
    coBorrower: "Liam Parker",
    product: "Education Loan",
    program: "Future Scholar",
    amount: "45000",
    term: "48",
    originator: "Megan Fox",
    dealerSalesperson: "Jake Peralta",
    salesperson: "Amy Santiago",
    webformCheckbox: true,
    workflowStatus: "Approved",
    assignedTo: "Team X",
    actions: this.actionForActivatedContractList,
  },
  {
    date: new Date("2025-02-03T00:00:00"),
    contractId: "Q33445",
    customerName: "Noah Wilson",
    coBorrower: "Emma Wilson",
    product: "Car Loan",
    program: "Drive Easy",
    amount: "30000",
    term: "36",
    originator: "Charles Boyle",
    dealerSalesperson: "Terry Jeffords",
    salesperson: "Gina Linetti",
    webformCheckbox: false,
    workflowStatus: "Pending",
    assignedTo: "Team Y",
    actions: this.actionForActivatedContractList,
  },
  {
    date: new Date("2025-03-22T00:00:00"),
    contractId: "Q55667",
    customerName: "Ava Thompson",
    coBorrower: "None",
    product: "Home Loan",
    program: "Smart Living",
    amount: "20000",
    term: "60",
    originator: "Holt Raymond",
    dealerSalesperson: "Kevin Cozner",
    salesperson: "Rosa Diaz",
    webformCheckbox: true,
    workflowStatus: "In Progress",
    assignedTo: "Team Z",
    actions: this.actionForActivatedContractList,
  },
  {
    date: new Date("2025-04-10T00:00:00"),
    contractId: "Q77889",
    customerName: "James Anderson",
    coBorrower: "None",
    product: "Personal Loan",
    program: "QuickFunds",
    amount: "10000",
    term: "18",
    originator: "Doug Judy",
    dealerSalesperson: "Captain Holt",
    salesperson: "Jake Peralta",
    webformCheckbox: false,
    workflowStatus: "Rejected",
    assignedTo: "Team W",
    actions: this.actionForActivatedContractList,
  },
  ])

  internalSalesAfvLoanListing = new BehaviorSubject<any>([
     {
    contractId: "Q12345",
    customerName: "David Johnson",
    coBorrower: "Sarah Johnson",
    asset: "Car",
    program: "Standard Finance",
    regoNo: "AB12CD3456",
    maxPermittedKm: "45000",
    futureValueDate: "10/21/2024",
    futureValueAmount: "5000",
    outstandingBalance: "20000",
    originator: "John Doe",
    phone: "+91-9876543210",
    email: "david.johnson@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "Q67890",
    customerName: "Emily Smith",
    coBorrower: "Robert Smith",
    asset: "Bike",
    program: "Quick Ride",
    regoNo: "XY34EF7890",
    maxPermittedKm: "25000",
    futureValueDate: "11/15/2024",
    futureValueAmount: "3000",
    outstandingBalance: "12000",
    originator: "Jane Roe",
    phone: "+91-9988776655",
    email: "emily.smith@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "Q54321",
    customerName: "Michael Brown",
    coBorrower: "Jessica Brown",
    asset: "SUV",
    program: "Premium Auto",
    regoNo: "LM56GH1234",
    maxPermittedKm: "60000",
    futureValueDate: "12/30/2024",
    futureValueAmount: "8000",
    outstandingBalance: "35000",
    originator: "Alan Turing",
    phone: "+91-9123456789",
    email: "michael.brown@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "Q98765",
    customerName: "Sophia Williams",
    coBorrower: "Daniel Williams",
    asset: "Sedan",
    program: "Comfort Drive",
    regoNo: "GH78IJ5678",
    maxPermittedKm: "50000",
    futureValueDate: "01/20/2025",
    futureValueAmount: "6000",
    outstandingBalance: "25000",
    originator: "Lisa Clark",
    phone: "+91-9012345678",
    email: "sophia.williams@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "Q11223",
    customerName: "Liam Davis",
    coBorrower: "Olivia Davis",
    asset: "Truck",
    program: "Heavy Load",
    regoNo: "OP90QR1122",
    maxPermittedKm: "70000",
    futureValueDate: "02/10/2025",
    futureValueAmount: "10000",
    outstandingBalance: "40000",
    originator: "Mark Benson",
    phone: "+91-9345678901",
    email: "liam.davis@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "Q33445",
    customerName: "Ava Wilson",
    coBorrower: "Ethan Wilson",
    asset: "Hatchback",
    program: "City Rider",
    regoNo: "ST12UV3344",
    maxPermittedKm: "30000",
    futureValueDate: "03/25/2025",
    futureValueAmount: "4000",
    outstandingBalance: "18000",
    originator: "Rachel Green",
    phone: "+91-9567890123",
    email: "ava.wilson@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "Q55667",
    customerName: "Noah Martin",
    coBorrower: "Grace Martin",
    asset: "Convertible",
    program: "Luxury Drive",
    regoNo: "WX45YZ5567",
    maxPermittedKm: "55000",
    futureValueDate: "04/12/2025",
    futureValueAmount: "9000",
    outstandingBalance: "30000",
    originator: "Tom Harris",
    phone: "+91-9456123789",
    email: "noah.martin@example.com",
    actions: this.actionForActivatedContractList
  }
  ])
  internalSalesActivatedLoanListing = new BehaviorSubject<any>([
    {
    contractId: "L00123",
    customerName: "David Johnson",
    coBorrower: "Sarah Johnson",
    asset: "Car",
    regoNo: "AB12CD3456",
    amountFinanced: "25000",
    maturityDate: "10/21/2027",
    product: "Auto Loan",
    program: "Standard Finance",
    outstandingBalance: "20000",
    originator: "John Doe",
    phone: "+91-9876543210",
    email: "david.johnson@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "L00456",
    customerName: "Emily Smith",
    coBorrower: "Robert Smith",
    asset: "Bike",
    regoNo: "XY34EF7890",
    amountFinanced: "15000",
    maturityDate: "11/15/2026",
    product: "Two Wheeler Loan",
    program: "Quick Ride",
    outstandingBalance: "12000",
    originator: "Jane Roe",
    phone: "+91-9988776655",
    email: "emily.smith@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "L00789",
    customerName: "Michael Brown",
    coBorrower: "Jessica Brown",
    asset: "SUV",
    regoNo: "LM56GH1234",
    amountFinanced: "50000",
    maturityDate: "12/30/2028",
    product: "Premium Auto Loan",
    program: "Premium Auto",
    outstandingBalance: "35000",
    originator: "Alan Turing",
    phone: "+91-9123456789",
    email: "michael.brown@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "L00987",
    customerName: "Sophia Williams",
    coBorrower: "Daniel Williams",
    asset: "Sedan",
    regoNo: "GH78IJ5678",
    amountFinanced: "30000",
    maturityDate: "01/20/2028",
    product: "Comfort Drive Loan",
    program: "Comfort Drive",
    outstandingBalance: "25000",
    originator: "Lisa Clark",
    phone: "+91-9012345678",
    email: "sophia.williams@example.com",
    actions: this.actionForActivatedContractList
  },
  {
    contractId: "L00234",
    customerName: "Liam Davis",
    coBorrower: "Olivia Davis",
    asset: "Truck",
    regoNo: "OP90QR1122",
    amountFinanced: "70000",
    maturityDate: "02/10/2029",
    product: "Commercial Loan",
    program: "Heavy Load",
    outstandingBalance: "40000",
    originator: "Mark Benson",
    phone: "+91-9345678901",
    email: "liam.davis@example.com",
    actions: this.actionForActivatedContractList
  }
  ])

  async callOriginatorApi() {
    let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.decodeToken(accessToken);
    let sub = decodedToken?.preferred_username || decodedToken?.sub;
    let introducersData = await this.data
      .get(`User/get_introducers?userCode=${sub}`)
      .pipe(
        map((res) => {
          return res?.data || null;
        })
      )
      .toPromise();
    this.introducers =
      introducersData?.introducers.map((item) => ({
        originatorNo: item.originatorNo,
        waive: item.waiveLoanMaintenanceFee,
      })) || [];
    let users = introducersData?.introducers;
   
    let jsonArray = Array.isArray(users)
      ? users
          .map((item) => ({
            label: item.originatorName,
            value: {
              num: item.originatorNo,
              name: item.originatorName,
              id: item.originatorId
            },
            id: item?.originatorId,
            ...item,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
    this.userOptions = jsonArray;
    let defaultUser = users?.find((ele) => {
      return ele.isDefault == true;
    });
   const directSalesTypes = ["Direct Sales", "Direct Sales Management", "ACM", "System Administrators"];

const isSecurityTeam = directSalesTypes.some(type =>
  introducersData.securityTeam?.includes(type)
);
if (isSecurityTeam) {
  sessionStorage.setItem("securityTeam", JSON.stringify(true));
}else{
   sessionStorage.setItem("securityTeam", JSON.stringify(false));
      //sessionStorage.setItem("securityTeam", JSON.stringify(true));

}
    if (introducersData?.externalUserType?.includes("External")) {
      let userSelected;
      this.userType = "External";
      sessionStorage.setItem("externalUserType", this.userType);

      let num = sessionStorage.getItem("dealerPartyNumber");
      let name = sessionStorage.getItem("dealerPartyName");
      let id = sessionStorage.getItem("dealerPartyId");
      if (num && name) {
        userSelected = { name: name, num: Number(num), id: id ? Number(id) : defaultUser?.originatorId };
      }
      if (userSelected) {
        this.userSelectedOption = { name: name, num: Number(num), id: userSelected.id };
        // this.setDealerToLocalStorage(this.userSelectedOption)
      } else {
        this.userSelectedOption = {
          name: defaultUser.originatorName,
          num: defaultUser.originatorNo,
          id: defaultUser.originatorId,
        };
        // this.setDealerToLocalStorage(this.userSelectedOption)
      }
      this.setDealerToLocalStorage(this.userSelectedOption);
      this.isDealerCalculated = false;
    } else {
      sessionStorage.removeItem("dealerPartyNumber");
      sessionStorage.removeItem("dealerPartyName");
      sessionStorage.removeItem("dealerPartyId");
      sessionStorage.setItem("externalUserType", "Internal");
    }
  }

  setDealerToLocalStorage(value) {
    let dealerValue = value?.num;
    let dealerName = value?.name;
    let dealerId = value?.id;

    let currentRoute = this.router.url;
    if (currentRoute == "/dealer/quick-quote" || currentRoute === "/dealer") {
      sessionStorage.setItem("dealerPartyNumber", dealerValue);
      sessionStorage.setItem("dealerPartyName", dealerName);
     if (dealerId) {
      sessionStorage.setItem("dealerPartyId", dealerId.toString());  // Store ID ✅
    }
    }
    if (currentRoute != "/dealer") {
      this.isDealerCalculated = true; // reset calc status
    }
    // this.onOriginatorChange.next(value);
    this.onOriginatorChange.set(value);
 if (this.standardQuoteSvc) {
    this.standardQuoteSvc.setBaseDealerFormData({
      originatorName: dealerName,
      originatorNumber: dealerValue,
      originatorId: dealerId, 
    });
  }
    // const isExternalUser = localStorage.getItem('externalUserType');

    // if (dealerValue && isExternalUser?.includes('External')) {
    //   this.onOriginatorChange.next(dealerValue);
    // }
  }

  private currentRowDataSubject = new BehaviorSubject<any>(null);
  public currentRowData$ = this.currentRowDataSubject.asObservable();

  private quoteActionSelectedSubject = new BehaviorSubject<any>(null);
  public quoteActionSelected$ = this.quoteActionSelectedSubject.asObservable();

  setQuoteActionData(data: any) {
    this.quoteActionSelectedSubject.next(data);
  }

  setCurrentRowData(data: any) {
    this.currentRowDataSubject.next(data);
  }

  getCurrentRowData() {
    return this.currentRowDataSubject.value;
  }
async copyQuote(contractId: string | number): Promise<any> {
  try {
    const url = `Contract/Copy_Quote?contractId=${contractId}`;
    
    const response = await this.data
      .get(url)
      .pipe(
        map((res) => {
          return res?.data || res || null;
        })
      )
      .toPromise();
    
    return response;
    
  } catch (error) {
    throw error;
  }
}

  private products: any[] = [];
  async loadProducts(): Promise<void> {
    if (!this.products || this.products.length === 0) {
      const res = await firstValueFrom(
        this.http.get<any>("assets/api-json/productCode.json")
      );

      this.products = res?.ProductCode || [];
    }
  }

 
getCodeByName(name: string): string | null {
  
  
  if (!this.products || this.products.length === 0) {
    
    return null;
  }
  
  
  let item = this.products.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  
 
  if (!item) {
    item = this.products.find(
      (p) => p.description?.toLowerCase() === name.toLowerCase()
    );
  }
  
  
  if (!item) {
    item = this.products.find(
      (p) => p.description?.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(p.description?.toLowerCase())
    );
  }
  
  
  return item ? item.parentCode : null;
}
async getCustomerStatement(contractId: string | number, productCode: string): Promise<any> {
  try {
    
    const url = `Contract/customer_statement?contractId=${contractId}&PRCode=${productCode}`;
   
    const response = await this.data
      .get(url)
      .pipe(
        map((res) => {
          
          return res?.data || res || null;
        })
      )
      .toPromise();
    
    
    return response;
    
  } catch (error) {
    
    throw error;
  }
}

}
