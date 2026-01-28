import {
  ChangeDetectorRef,
  Component,
  effect,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import {
  CloseDialogData,
  CommonService,
  MapFunc,
  Mode,
  ToasterService,
} from "auro-ui";
import { ActivatedRoute, Router } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { SearchCustomerComponent } from "../search-customer/search-customer.component";
import { firstValueFrom, forkJoin, map, takeUntil } from "rxjs";
import { InsuranceDisclosureComponent } from "../insurance-disclosure-popup/insurance-disclosure.component";
import { IndividualService } from "../../../individual/services/individual.service";
import { BusinessService } from "../../../business/services/business";
import { TrustService } from "../../../trust/services/trust.service";
import { ValidationService } from "auro-ui";
import { SoleTradeService } from "../../../sole-trade/services/sole-trade.service";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import { PartyVerificationComponent } from "../party-verification/party-verification.component";
import { BankStatementVerificationComponent } from "../bank-statement-verification/bank-statement-verification.component";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-borrowers-guarantors",
  templateUrl: "./borrowers-guarantors.component.html",
  styleUrl: "./borrowers-guarantors.component.scss",
})
export class BorrowersGuarantorsComponent extends BaseStandardQuoteClass {
  @Input() customerStatment: string;
  customerNo?: number;
  customerName;
  private isLoadingBorrowers: boolean = false;
  lastName?: string;
  employmentInfoId?: number;
  firstName: string;
  contractId: any;
  isReady: boolean;
  customerType: string;
  customerID: Number;
  updateroleData: any;
  dataList: any = [];
  isInsuranceDisclosureEnabled: boolean = false;
  insuranceCustomerNumber: any;
  employmentType: any;
  roleKeys = {
    Borrower: 1,
    CoBorrower: 2,
    Guarantor: 3,
  };
  partyStatusListforIconDisable: string[] = [];
  originalRoles: Map<number, string> = new Map(); // customerNo -> original role

  // updatedCustomerSummary: Map<number, any> = new Map();

  
    bankWorkflowDisableStatus: string[] = [
      "awaiting verification",
      "verification with customer",
      "in review",
      "verification complete",
      "verification failed",
      "verification declined",
      "verification not required",
    ];

  customerRoleData: any = [
    { label: "Borrower", value: "Borrower" },
    { label: "Co-Borrower", value: "CoBorrower" },
    { label: "Guarantor", value: "Guarantor" },
  ];

  tableColumns = [
    {
      field: "customerName",
      headerName: "Name",
      format: (row) => {
        // Get customer name
        let fullName = row.customerName || "";
        let displayName =
          fullName.length > 40 ? fullName.substring(0, 37) + "..." : fullName;

        // Build HTML with tooltip using title attribute
        // let html = `<a class="cursor-pointer text-primary" title="${fullName}"> ${displayName}`;
        let html = `<a class="cursor-pointer text-primary">${displayName}`;

        // Add icon if conditions are met
        if (row.showInfoIcon || !row.isConfirmed) {
          html += ` <i class="fa-solid fa-exclamation-circle text-red-700"></i>`;
        }

        html += `</a>`;
        return html;
      },
      tooltipValueGetter: (params) => {
        if (!params) return "";
        return params.length > 40 ? params : "";
      },
      toolTipPosition: "top",
      action: "redirectToCustomer",
      class: "capitalize",
      columnHeaderClass: "justify-content-center",
      width: "100%",
    },

    {
      field: "customerNo",
      headerName: "UDC Number",
      columnHeaderClass: "justify-content-center",
    },
    {
      field: "customerType",
      headerName: "Type",
      columnHeaderClass: "justify-content-center",
      width: "80px",
    },
    {
      field: "roleName",
      headerName: "Role",
      format: "#dropdown",
      action: "changerole",
      options: this.customerRoleData,
      // options: this.filteredCustomerRoles(),
      columnHeaderClass: "justify-content-center",
    },

    {
      field: "financialPosition",
      headerName: "",
      // format:
      //   '<a class="cursor-pointer text-primary">Financial Position<i class="fa-solid fa-angle-right ml-1"></i></a>',
      format: (row) => {
        // Decide the color based on isSharedFinancialPosition
        const linkColorClass = row?.isSharedFinancialPosition
          ? "text-gray-500" // grey (Tailwind)
          : "text-primary"; // your existing primary color

        return `<a class="cursor-pointer ${linkColorClass}">FP</i></a>`;
      },
      action: "redirectToFinancialPosition",
    },

    {
      field: "currentWorkflowStatus",
      // format: "#icons",
      headerName: "ID",
      format: (row) => {
        let iconClass = "fa-solid fa-regular fa-circle-ellipsis";
        let statusClass = "";
        const status = (row.currentWorkflowStatus || "").toLowerCase();

        if (status === "verified successfully") {
          statusClass = "status-verified";
        } else if (status === "start verification") {
          statusClass = "status-start-verification";
        } else {
          statusClass = "status-other";
        }

        return `<i class="${iconClass} ${statusClass}"></i>`;
      },

      // iconLeft: () => {
      //   return "fa-regular fa-circle-ellipsis";
      // },
      tooltipValueGetter: (params) => {
        // console.log(params, 'params,index')
        return params;
      },
      toolTipPosition: "top",
      action: "changerole",
      // class: "text-center",
      columnHeaderClass: "justify-content-center",
      overlayPanel: PartyVerificationComponent,
      width: "40px",
      disabled : (row) => this.partyStatusListforIconDisable.includes(row?.currentWorkflowStatus.toLowerCase()) || this.baseFormData?.AFworkflowStatus === 'Submitted' || configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus),
      // disabled: (row) => row.currentWorkflowStatus.toLowerCase() === "start verification"
    },

    {
      field: "currentBankStatementWorkflowStatus",
      // format: "#icons",
      format: (row) => {
        let iconClass = "fa-solid fa-regular fa-circle-ellipsis";
        let statusClass = "";
        const status = (
          row.currentBankStatementWorkflowStatus || ""
        ).toLowerCase();

        if (status === "verification complete") {
          statusClass = "bankflow-status-verification-complete"; //green
        } else if (status === "start verification" || status === "") {
          statusClass = "bankflow-status-start-verification"; // grey
        } else {
          statusClass = "bankflow-status-other"; // yellow
        }

        return `<i class="${iconClass} ${statusClass}"></i>`;
      },
      headerName: "FP",
      // iconLeft: () => {
      //   return "fa-regular fa-circle-ellipsis";
      // },
      tooltipValueGetter: (params) => {
        // console.log(params, 'params,index')
        if (params == "") {
          return "Select";
        }
        return params;
      },
      toolTipPosition: "top",
      class: "text-center",
      columnHeaderClass: "justify-content-center",
      overlayPanel: BankStatementVerificationComponent,
      // width: "50px"
      disabled : (row) => this.bankWorkflowDisableStatus.includes(row?.currentBankStatementWorkflowStatus.toLowerCase()) || this.baseFormData?.AFworkflowStatus === 'Submitted' || configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus),
    },
    {
      field: "delete",
      headerName: "",
      format: "#icons",
      // mode: this.baseFormData?.AFworkflowStatus === 'Submitted' ? Mode.view : Mode.edit,
    },

    // {
    //   field: "roleName",
    //   headerName: "Verification",
    //   format: "#dropdown",
    //   action: "changerole",
    //   options: this.customerRoleData,
    //   columnHeaderClass: "text-center",
    //   // hidden: true

    // },
  ];

  updateCustRole(event: any, i: number) {
    // console.log(event, 'event')
    if (
      event?.rowData?.customerType === "Individual" &&
      this.baseFormData?.purposeofLoan?.toLowerCase() !== "business"
    ) {
      this.individualService.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    } else if (
      event?.rowData?.customerType === "Individual" &&
      this.baseFormData?.purposeofLoan?.toLowerCase() === "business"
    ) {
      this.soleService.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    } else if (event?.rowData?.customerType === "Business") {
      this.businessService.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    } else if (event?.rowData?.customerType === "Trust") {
      this.trustSvc.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    }

    const idx = event?.index ?? i;
    if (idx === undefined || idx === null) return;

    // const customer = this.baseFormData?.customerSummary[idx];
    const customer = JSON.parse(
      sessionStorage.getItem("updatedCustomerSummary")
    )?.[idx];
    // const newRole = event.value.roleName;
    const newRole = event.value;
    const originalRole = this.originalRoles.get(customer.customerNo);

    // Store the old role for scenario handling
    const oldRole = customer.roleName;

    // Handle Scenario 1: When changing from Borrower to CoBorrower
    if (oldRole === "Borrower" && newRole === "CoBorrower") {
      this.handleBorrowerToCoBorrowerChange(customer);
    }
    // Handle Scenario 2: When changing from Borrower to Guarantor
    else if (oldRole === "Borrower" && newRole === "Guarantor") {
      this.handleBorrowerToGuarantorChange(customer);
    }
    // Handle changing to Borrower (existing logic)
    else if (newRole === "Borrower") {
      this.handleChangeToBorrower(customer);
    }

    // Update the current customer's role
    this.dataList[idx].roleName = newRole;
    this.dataList[idx].showInfoIcon = originalRole !== newRole;

    // Update the backup Map for current customer
    if (this.baseSvc?.updatedCustomerSummary?.has(customer.customerNo)) {
      const updatedCustomer = this.baseSvc?.updatedCustomerSummary.get(
        customer.customerNo
      );
      updatedCustomer.roleName = newRole;
      updatedCustomer.showInfoIcon = originalRole !== newRole;
      // updatedCustomer.isConfirmed = !(originalRole !== newRole);
    } else {
      this.baseSvc?.updatedCustomerSummary.set(customer.customerNo, {
        ...customer,
        roleName: newRole,
        showInfoIcon: originalRole !== newRole,
      });
    }

    this.baseSvc.setBaseDealerFormData({
      updatedCustomerSummary: Array.from(
        this.baseSvc?.updatedCustomerSummary.values()
      ),
    });
    this.cdr.detectChanges();

    sessionStorage.setItem(
      "updatedCustomerSummary",
      JSON.stringify(Array.from(this.baseSvc?.updatedCustomerSummary.values()))
    );

    // this.dataList = this.baseFormData?.updatedCustomerSummary
    // this.dataList = this.baseFormData?.updatedCustomerSummary.map((item: any) => ({
    //              ...item,
    //             delete: this.actions //This is for delete icon
    //           }));
    const storedData = sessionStorage.getItem("updatedCustomerSummary");
    if (storedData) {
      this.dataList = JSON.parse(storedData).map((item: any) => ({
        ...item,
        delete: this.actions,
      }));
    }
  }

  // Helper method for Scenario 1: Borrower -> CoBorrower
  private handleBorrowerToCoBorrowerChange(currentCustomer: any): void {
    // Find the first available candidate to become the new Borrower (prioritize CoBorrower, then Guarantor)
    const candidate = this.findBorrowerCandidate(currentCustomer.customerNo, [
      "CoBorrower",
      "Guarantor",
    ]);

    if (candidate) {
      this.promoteCustomerToBorrower(candidate);
    }
  }

  // Helper method for Scenario 2: Borrower -> Guarantor
  private handleBorrowerToGuarantorChange(currentCustomer: any): void {
    // Find the first available candidate to become the new Borrower (prioritize Guarantor, then CoBorrower)
    const candidate = this.findBorrowerCandidate(currentCustomer.customerNo, [
      "Guarantor",
      "CoBorrower",
    ]);

    if (candidate) {
      this.promoteCustomerToBorrower(candidate);
    }
  }

  // Find the best candidate to become Borrower with custom priority
  private findBorrowerCandidate(
    excludeCustomerNo: number,
    priorityOrder: string[]
  ): any {
    for (const role of priorityOrder) {
      const candidate = this.dataList.find(
        (item: any) =>
          item.roleName === role && item.customerNo !== excludeCustomerNo
      );

      if (candidate) {
        return candidate;
      }
    }

    return null; // No candidate found
  }

  // Helper method for changing to Borrower (existing logic)
  private handleChangeToBorrower(currentCustomer: any): void {
    // Find existing borrower in dataList
    const existingBorrowerIndex = this.dataList.findIndex(
      (item: any) =>
        item.roleName === "Borrower" &&
        item.customerNo !== currentCustomer.customerNo
    );

    // If another borrower exists, change it to CoBorrower
    if (existingBorrowerIndex !== -1) {
      const existingBorrower = this.dataList[existingBorrowerIndex];
      const existingBorrowerOriginalRole = this.originalRoles.get(
        existingBorrower.customerNo
      );

      // Update existing borrower to CoBorrower in dataList
      this.dataList[existingBorrowerIndex].roleName = "CoBorrower";
      this.dataList[existingBorrowerIndex].showInfoIcon =
        existingBorrowerOriginalRole !== "CoBorrower";

      // Update existing borrower in updatedCustomerSummary
      if (
        this.baseSvc?.updatedCustomerSummary.has(existingBorrower.customerNo)
      ) {
        const updatedBorrower = this.baseSvc?.updatedCustomerSummary.get(
          existingBorrower.customerNo
        );
        updatedBorrower.roleName = "CoBorrower";
        updatedBorrower.showInfoIcon =
          existingBorrowerOriginalRole !== "CoBorrower";
        // updatedBorrower.isConfirmed = !(existingBorrowerOriginalRole !== 'CoBorrower');
      } else {
        this.baseSvc?.updatedCustomerSummary.set(existingBorrower.customerNo, {
          ...existingBorrower,
          roleName: "CoBorrower",
          showInfoIcon: existingBorrowerOriginalRole !== "CoBorrower",
        });
      }
    }
  }

  // Helper method to promote a customer to Borrower
  private promoteCustomerToBorrower(customerToPromote: any): void {
    const originalRole = this.originalRoles.get(customerToPromote.customerNo);
    const customerIndex = this.dataList.findIndex(
      (item: any) => item.customerNo === customerToPromote.customerNo
    );

    if (customerIndex !== -1) {
      // Update promoted customer to Borrower in dataList
      this.dataList[customerIndex].roleName = "Borrower";
      this.dataList[customerIndex].showInfoIcon = originalRole !== "Borrower";

      // Update promoted customer in updatedCustomerSummary
      if (
        this.baseSvc?.updatedCustomerSummary.has(customerToPromote.customerNo)
      ) {
        const updatedCustomer = this.baseSvc?.updatedCustomerSummary.get(
          customerToPromote.customerNo
        );
        updatedCustomer.roleName = "Borrower";
        updatedCustomer.showInfoIcon = originalRole !== "Borrower";
        // updatedCustomer.isConfirmed = !(originalRole !== 'Borrower');
      } else {
        this.baseSvc?.updatedCustomerSummary.set(customerToPromote.customerNo, {
          ...customerToPromote,
          roleName: "Borrower",
          showInfoIcon: originalRole !== "Borrower",
        });
      }
    }
  }

  columns = [];

  disabledColumns = [
    {
      field: "customerName",
      headerName: "Name",
      format:
        '<a class="cursor-pointer text-primary">{params}<i class="fa-solid fa-angle-right ml-1"></i></a>',
      action: "redirectToCustomer",
      class: "capitalize",
      columnHeaderClass: "justify-content-center",
      width: "100%"
    },
    {
      field: "customerNo",
      headerName: "UDC Number",
      columnHeaderClass: "justify-content-center",
    },
    { field: "customerType", headerName: "Type", columnHeaderClass: "justify-content-center", width: "80px"},
    {
      field: "roleName",
      headerName: "Role",
      columnHeaderClass: "justify-content-center",
    },

    {
      field: "financialPosition",
      headerName: "",
      format:
        '<a class="cursor-pointer text-primary">Financial Position<i class="fa-solid fa-angle-right ml-1"></i></a>',
      action: "redirectToFinancialPosition",
    },
    {
      field: "currentWorkflowStatus",
      headerName: "ID",
      columnHeaderClass: "justify-content-center",
      width: "40px",
    },
    {
      field: "currentBankStatementWorkflowStatus",
      headerName: "FP",
      columnHeaderClass: "justify-content-center",
    },
    {
      field: "delete",
      headerName: "",
      format: "#icons",
    },
  ];

  columnsBlank = [
    {
      field: "customerName",
      headerName: "Name",
      columnHeaderClass: "justify-content-center",
      width: "100%",
    },
    {
      field: "customerNo",
      headerName: "UDC Number",
      columnHeaderClass: "justify-content-center",
    },
    { field: "customerType", headerName: "Type", columnHeaderClass: "justify-content-center", width: "80px" },
    {
      field: "roleName",
      headerName: "Role",
      columnHeaderClass: "justify-content-center",
    },
    {
      field: "financialPosition",
      headerName: "",
      columnHeaderClass: "justify-content-center",
    },
    {
      field: "currentWorkflowStatus",
      headerName: "ID",
      columnHeaderClass: "justify-content-center",
      width: "40px",
    },
    {
      field: "currentBankStatementWorkflowStatus",
      headerName: "FP",
      columnHeaderClass: "justify-content-center",
    },
    {
      field: "delete",
      headerName: "",
      format: "#icons",
    },
  ];

  actions = [
    {
      action: "delete",
      name: "delete",
      icon: "fa-light fa-trash-can text-lg",
      color: this.baseFormData?.AFworkflowStatus === 'Submitted' ? "--gray-600" : "--red-600",
    },
  ];

  blankData = [
    // {
    //   customerName: "-",
    //   customerNo: "-",
    //   customerType: "-",
    //   roleName: "-",
    //   financialPosition: "-",
    //   currentWorkflowStatus: "-",
    //   currentBankStatementWorkflowStatus: "-",
    //   delete: "-",
    // },
  ];
  //customer-statement
  custcolumns = [
    {
      field: "customerName",
      headerName: "Customer Name",
      format:
        '<a class="cursor-pointer text-primary">{params}<i class="fa-solid fa-angle-right ml-1"></i></a>',
      action: "redirectToCustomer",
    },
    { field: "customerNo", headerName: "UDC Customer Number" },
    { field: "customerType", headerName: "Customer Type" },
    {
      field: "roleName",
      headerName: "Customer Role",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "phone",
      headerName: "Phone",
    },
  ];

  custdataList = [
    // {
    //   customerName: "Michael Jackson",
    //   customerNo: "123456789",
    //   customerType: "Business",
    //   roleName: "CoBorrower",
    //   email: "samplename@gmail.com",
    //   phone: 6341618193,
    // },
  ];
  disableState: boolean;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    override baseSvc: StandardQuoteService,
    private cdr: ChangeDetectorRef,
    private individualService: IndividualService,
    private businessService: BusinessService,
    private trustSvc: TrustService,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    private soleService: SoleTradeService,
    private dashboardService: DashboardService
  ) {
    super(route, svc, baseSvc);

    // effect(() => {
    //   baseSvc.triggerAfterPartyWorkflowChange()
    //   this.init();
    // })
    //Calling All the matrix once to cache the data
    this.baseSvc.formDataCacheableRoute([
      "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Workflow",
    ]);

    this.baseSvc.getFormData(
      `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Workflow`
    );
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.customerStatment === "Customer Statement") {
      await this.loadCustomerStatementBorrowersData();
      return;
    }
    this.individualService.addingExistingCustomer = false;
    this.businessService.addingExistingCustomer = false;
    this.trustSvc.addingExistingCustomer = false;
    this.soleService.addingExistingCustomer = false;
    let params: any = this.route.snapshot.params;
    this.mode = params.mode;

    this.contractId = this.baseFormData?.contractId;

    this.individualService
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.customerID = res?.customerNo;
        // this.formData = res;
        // this.individualDetailsConfirmation = res?.individualDetailsConfirmation;
      });

    this.baseSvc?.triggerAfterPartyWorkflowChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data) => {
        if (data) {
          console.log("Calling triggerAfterPartyWorkflowChange");
          // await this.init()
          await this.partyWorkflowStatus();
        }
      });
    await this.init();
    //    this.svc.data.getCacheableRoutes([`Declaration/get_insurance_disclosure_form?ContractId=${2}&DealerId=2`])


    let partyStatusMatrix = await this.baseSvc.getFormData(
      `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Workflow`
    );

    this.partyStatusListforIconDisable = this.extractWorkflowsForNA(partyStatusMatrix);
    this.baseSvc.partyStatusListforIconDisable = this.partyStatusListforIconDisable;

  }

  private extractWorkflowsForNA(partyStatusMatrix: any): string[] {
    const partyStatusListforIconDisable: string[] = [];

    if (partyStatusMatrix?.data?.dataRowList) {
      partyStatusMatrix.data.dataRowList.forEach((row: any) => {
        const appVerificationType = row.customFields?.["App Verification Type"];

        if (appVerificationType === "NA" || appVerificationType === "-") {
          const currentAFWorkflow = row.customFields?.["Current AF Workflow"];
          if (currentAFWorkflow) {
            const workflows = currentAFWorkflow.split(',').map((workflow: string) => workflow.trim().toLocaleLowerCase());
            partyStatusListforIconDisable.push(...workflows);
          }
        }
      });
    }

    return [...new Set(partyStatusListforIconDisable)];
  }

  partyWorkflowStatus(): void {      //this method is written for real time update of party workflow status icons
    let dataToUse = JSON.parse(
      sessionStorage.getItem("updatedCustomerSummary")
    );
    if (dataToUse) {
      this.dataList = dataToUse.map((item: any) => ({
        ...item,
        delete: this.actions,
      }));
      this.cdr.detectChanges();
    }
  }

  override ngOnDestroy(): void {
    // Priority: updatedCustomerSummary Map -> baseFormData updatedCustomerSummary -> baseFormData customerSummary
    let finalData;
    if (this.baseSvc?.updatedCustomerSummary.size > 0) {
      finalData = Array.from(this.baseSvc?.updatedCustomerSummary.values());
    } else if (this.baseFormData?.updatedCustomerSummary?.length > 0) {
      finalData = this.baseFormData.updatedCustomerSummary;
    } else if (this.baseFormData?.customerSummary?.length > 0) {
      finalData = this.baseFormData.customerSummary;
    }

    if (finalData) {
      sessionStorage.setItem(
        "updatedCustomerSummary",
        JSON.stringify(finalData)
      );
    }

    // this.baseSvc.triggerAfterPartyWorkflowChange.unsubscribe()
  }

  async init() {
    if (this.baseFormData?.contractId) {
      // Check sessionStorage first for existing data
      const storedSummary = sessionStorage?.getItem("updatedCustomerSummary");
      if (
        storedSummary &&
        storedSummary !== "undefined" &&
        storedSummary !== "null"
      ) {
        const parsedSummary = JSON?.parse(storedSummary);
        parsedSummary?.forEach((customer) => {
          // this.originalRoles.set(customer.customerNo, customer.roleName);
          this.baseSvc?.updatedCustomerSummary.set(
            customer.customerNo,
            customer
          );
        });
      }
      let nonSupplierCustomers;
      let customerSummary = await this.baseSvc.getFormData(
        `CustomerDetails/get_contractSummery?ContractId=${this.baseFormData?.contractId || this.contractId
        }`,
        (res) => {
          if (res.data && Array.isArray(res.data)) {
            // Only initialize if we don't have stored data
              nonSupplierCustomers = res.data.filter(
               customer => customer.customerRole !== 7
               );
            nonSupplierCustomers.forEach((customer) => {
              this.originalRoles.set(customer.customerNo, customer.roleName);
              if (!storedSummary) {
                this.baseSvc?.updatedCustomerSummary.set(customer.customerNo, {
                  ...customer,
                  showInfoIcon: false,
                });
              }
            });

            this.baseSvc.searchResultForSupplier.set(res?.data)
          }

          if (
            (storedSummary && storedSummary == "undefined") ||
            storedSummary == "null"
          ) {
            sessionStorage.setItem(
              "updatedCustomerSummary",
              JSON.stringify(nonSupplierCustomers)
            );
          }

          // Handle the merging of baseFormData.updatedCustomerSummary and res.data
          if (
            JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))
              ?.length > 0
          ) {
            // Create a map of existing customer numbers for quick lookup
            const existingCustomerNos = new Set(
              JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))?.map(
                (item) => item.customerNo
              )
            );

            // Find items in res.data that don't exist in updatedCustomerSummary
            const newItemsFromRes =
              nonSupplierCustomers.filter(
                (item) => !existingCustomerNos.has(item.customerNo)
              ) || [];

            // Merge the arrays - existing updatedCustomerSummary plus any new items from res.data
            const mergedData = [
              ...JSON.parse(sessionStorage.getItem("updatedCustomerSummary")),
              ...newItemsFromRes.map((item) => ({
                ...item,
                showInfoIcon: false, // Add default properties for new items
              })),
            ];

            // Update the updatedCustomerSummary Map with merged data
            this.baseSvc?.updatedCustomerSummary.clear();
            mergedData.forEach((customer) => {
              this.baseSvc?.updatedCustomerSummary.set(customer.customerNo, {
                ...customer,
                showInfoIcon: customer.showInfoIcon || false,
              });
            });

            // Update sessionStorage with merged data
            sessionStorage.setItem(
              "updatedCustomerSummary",
              JSON.stringify(mergedData)
            );
          }

          if (res.data && Array.isArray(res.data)) {
            res.data.forEach((item) => {
              if (this.roleKeys?.[item.roleName] === 1) {
                this.isInsuranceDisclosureEnabled = true;
                this.insuranceCustomerNumber = item.customerNo;
              }
            });
          }

          const actions = this.actions;

          if (res.data && Array.isArray(res.data)) {
            const hasRoleOne = res.data.some((element: any) => {
              return this.roleKeys?.[element.roleName] === 1;
            });

            const roleValue = hasRoleOne ? 1 : 0;
            this.individualService.role = roleValue;
            this.trustSvc.role = roleValue;
            this.businessService.role = roleValue;
            this.soleService.role = roleValue;

            // Use updatedCustomerSummary if available, otherwise use res.data
            const dataToUse =
              this.baseSvc?.updatedCustomerSummary.size > 0
                ? Array.from(this.baseSvc?.updatedCustomerSummary.values())
                : nonSupplierCustomers;

            this.dataList = dataToUse
              .map((item: any) => ({
                ...item,
                delete: actions,
              }))
              .filter((item) => item?.customerRole != 7);

            // Update sessionStorage (in case it wasn't updated in the merge logic above)
            if (this.baseSvc?.updatedCustomerSummary.size > 0) {
              sessionStorage.setItem(
                "updatedCustomerSummary",
                JSON.stringify(dataToUse)
              );
            }

            // const storedData = sessionStorage.getItem("updatedCustomerSummary");
            // if (storedData) {
            //   this.dataList = JSON.parse(storedData).map((item: any) => ({
            //     ...item,
            //     delete: this.actions
            //   }));
            // }
          }

          if (this.baseFormData?.purposeofLoan === "Business") {
            this.isInsuranceDisclosureEnabled = false;
          }
          if (
            (this.baseFormData?.contractMonths > 0 ||
              this.baseFormData?.contractProvider) &&
            this.baseFormData?.purposeofLoan !== "Business"
          ) {
            this.isInsuranceDisclosureEnabled = true;
          }
          return nonSupplierCustomers || null;
        }
      );

      this.data = {
        ...this.data,
        customerSummary,
      };

      if (this.data) {
        this.baseSvc.setBaseDealerFormData(this.data);
      }

      this.isReady = true;
      this.cdr.detectChanges();
    }
  }
  //filteredCustomerRoles() {
  //return this.baseFormData?.purposeofLoan ===  configure?.LoanPurpose
  //? this.customerRoleData
  //: this.customerRoleData.filter(item => item.value === "Guarantor");
  //}

  //filteredCustomerRoleData: any = [
  //{ label: "Guarantor", value: "Guarantor" }
  //]

  private updateInsuranceButtonState(): void {
    // For Business loans: always disable the Insurance Disclosure button
    if (this.baseFormData?.purposeofLoan === "Business") {
      this.isInsuranceDisclosureEnabled = false;
    }
    // For Personal loans: enable only if Borrower exists AND at least one insurance product is selected
    else if (this.baseFormData?.purposeofLoan === "Personal") {
      const hasBorrower = this.hasBorrowerInCustomerSummary();
      const hasInsurance = this.hasAnyInsuranceSelected();
      this.isInsuranceDisclosureEnabled = hasBorrower && hasInsurance;
    } else {
      // For unknown/other loan purposes, default to disabled
      this.isInsuranceDisclosureEnabled = false;
    }
  }

  /**
   * Checks if a Borrower (role = 1) exists in the customer summary from the API.
   * Uses baseFormData.customerSummary which is populated from res.data after the API call.
   */
  private hasBorrowerInCustomerSummary(): boolean {
    if (this.baseFormData?.customerSummary?.length > 0) {
      return this.baseFormData.customerSummary.some(
        (customer: any) => this.roleKeys?.[customer.roleName] === 1
      );
    }
    return false;
  }

  override onFormDataUpdate(res: any): void {
    super.onFormDataUpdate(res);
    if (this.baseFormData?.contractId && (this.baseFormData?.purposeofLoan === "Business" || this.baseFormData?.purposeofLoan === "Personal")) {
      this.updateInsuranceButtonState();
    }
  }

  /**
   * Checks if at least one of the 5 insurance products is selected.
   * Returns true as soon as any insurance amount > 0.
   */
  private hasAnyInsuranceSelected(): boolean {
    return (this.baseFormData?.extendedAmount && Number(this.baseFormData.extendedAmount) > 0) ||
           (this.baseFormData?.mechanicalBreakdownInsuranceAmount && Number(this.baseFormData.mechanicalBreakdownInsuranceAmount) > 0) ||
           (this.baseFormData?.guaranteedAssetProtectionAmount && Number(this.baseFormData.guaranteedAssetProtectionAmount) > 0) ||
           (this.baseFormData?.motorVehicalInsuranceAmount && Number(this.baseFormData.motorVehicalInsuranceAmount) > 0) ||
           (this.baseFormData?.contractAmount && Number(this.baseFormData.contractAmount) > 0);
  }

  async loadCustomerStatementBorrowersData() {
    if (this.isLoadingBorrowers) {
      return;
    }
    this.isLoadingBorrowers = true;
    try {
      const res = await firstValueFrom(this.baseSvc.getBaseDealerFormData());
      if (res?.customerStatementData) {
        const customerStatementApiData = res.customerStatementData;
        const contractId = customerStatementApiData?.contractId;
        if (contractId) {
          const contractSummary = await this.baseSvc.getFormData(
            `CustomerDetails/get_contractSummery?ContractId=${contractId}`,
            (response) => {
              return response?.data || null;
            }
          );
          if (contractSummary && Array.isArray(contractSummary)) {
            this.custdataList = contractSummary.map((customer: any) => ({
              customerName: customer.customerName || "",
              customerNo: customer.customerNo || "",
              customerType: customer.customerType || "",
              roleName: customer.roleName || "",
              email: customer.email || "",
              phone: customer.phone || "",
            }));
            this.cdr.detectChanges();
          } else {
            this.custdataList = [];
          }
        } else {
          this.custdataList = [];
        }
      } else {
        this.custdataList = [];
      }
    } catch (error) {
      this.custdataList = [];
    } finally {
      this.isLoadingBorrowers = false;
    }
  }

  async showInsuranceDisclosurePopup() {
    let qupteId;
    if (this.mode == "edit" || this.mode == "view") {
      qupteId = this.contractId;
    } else {
      qupteId = 2;
    }

    forkJoin({
      cellData: this.svc.data.get(
        `Contract/get_insurance_declaration_data?ContractId=${this.contractId}`
      ),
      disclosure: this.svc.data.get(
        `Declaration/get_insurance_disclosure_form`
      ),
    }).subscribe(async ({ cellData, disclosure }) => {
      let requiredData = cellData.data.customFieldGroups.find(
        (group) => group.name === "Insurance Declaration"
      );

      if (disclosure.data.length > 0) {
        this.svc.dialogSvc
          .show(InsuranceDisclosureComponent, "Insurance Disclosure Form", {
            templates: {
              footer: null,
            },
            data: {
              disclosureData: disclosure.data,
              cellData: requiredData,
            },
            width: "80vw",
          })
          .onClose.subscribe((data: CloseDialogData) => {
            if (data?.data?.data != "Record Already Exist" && data?.data) {
              this.toasterService.showToaster({
                severity: "success",
                detail: `Insurance Disclosure Added Successfully!`,
              });
            }
          });
      } else {
        this.toasterService.showToaster({
          severity: "error",
          detail: `Insurance  data not found for Contract Id :${this.contractId}`,
        });
      }
    });
  }

  override onStatusChange(statusDetails: any): void {
    if (statusDetails?.currentState) {
      if (
        (configure?.workflowStatus?.view?.includes(statusDetails?.currentState)) || (configure?.workflowStatus?.edit?.includes(statusDetails?.currentState))
      ) {
        // this?.mainForm?.form?.disable();
        this.disableState = true;
        // this.columns = [...this.disabledColumns];
        this.columns = [...this.tableColumns];
      } else {
        this.disableState = false;
        this.columns = [...this.tableColumns];
      }
    }
  }

  showSearchCustomerPopup() {
    if (this.dashboardService.isDealerCalculated) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "err_calculateMsg",
      });
      return;
    }
    let contractData = {
      contractId: this.baseFormData?.contractId,
      customerNo:
        Array.isArray(this.baseFormData?.customerSummary) &&
          this.baseFormData.customerSummary.length > 0
          ? this.baseFormData.customerSummary[0].customerNo
          : "",
    };
    this.individualService.copyBorrowerAddress.next(contractData);
    this.svc.dialogSvc
      .show(SearchCustomerComponent, "Search Customer", {
        templates: {
          footer: null,
        },
        width: "60vw",
      })
      .onClose.subscribe((data: CloseDialogData) => { });
  }
  // onCellClick(event) {
  //   let id = event?.rowData?.QuoteID;
  //   this.commonSvc.router.navigateByUrl(
  //     `/standard-quote/${event.actionName}/${id}`
  //   );
  // }
  async onCellClick(event) {
    //this.roleKeys?.[event.value.roleName]

    this.baseSvc?.customerRowData?.set(event?.rowData); //Using Signal to pass customer row data to party verification component

    if (this.dashboardService.isDealerCalculated) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "err_calculateMsg",
      });
      return;
    }

    if (
      event?.rowData?.customerType === "Individual" &&
      this.baseFormData?.purposeofLoan?.toLowerCase() !== "business"
    ) {
      this.individualService.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    } else if (
      event?.rowData?.customerType === "Individual" &&
      this.baseFormData?.purposeofLoan?.toLowerCase() === "business"
    ) {
      this.soleService.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    } else if (event?.rowData?.customerType === "Business") {
      this.businessService.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    } else if (event?.rowData?.customerType === "Trust") {
      this.trustSvc.setBaseDealerFormData({
        tempCustomerNo: event?.rowData?.customerNo,
        tempCustomerRole: this.roleKeys?.[event?.rowData?.roleName],
      });
    }
    let mode;
    if (this.disableState) {
      mode = "view";
    } else {
      mode = "edit";
    }
    if (event?.colName == "customerName") {
      if (event?.rowData?.customerType == "Business") {
        this.router.navigateByUrl(
          `dealer/business/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );
        this.businessService.activeStep = 0;
      }
      if (event.rowData.customerType === "Individual") {
        const isBusiness =
          this.baseFormData?.purposeofLoan?.toLowerCase() === "business";
        const path = isBusiness ? "sole-trade" : "individual";

        this.router.navigateByUrl(
          `dealer/${path}/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );

        if (isBusiness) {
          this.soleService.activeStep = 0;
        } else {
          this.individualService.activeStep = 0;
        }
      }

      if (event.rowData.customerType == "Trust") {
        this.router.navigateByUrl(
          `dealer/trust/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );
        this.trustSvc.activeStep = 0;
      }
    }
    if (event.colName == "financialPosition") {
      const soleTrade =
        this.baseFormData?.purposeofLoan?.toLowerCase() === "business";
      const path = soleTrade ? "sole-trade" : "individual";
      if (
        // event.rowData.financialPosition == "Financial Position" &&
        event.rowData.customerType == "Individual" &&
        !soleTrade
      ) {
        this.individualService.activeStep = 3;
        this.router.navigateByUrl(
          `dealer/individual/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );
      } else if (
        // event.rowData.financialPosition == "Financial Position" &&
        event.rowData.customerType == "Individual" &&
        soleTrade
      ) {
        this.soleService.activeStep = 3;
        this.router.navigateByUrl(
          `dealer/sole-trade/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );
      } else if (
        // event.rowData.financialPosition == "Financial Position" &&
        event.rowData.customerType == "Business"
      ) {
        this.businessService.activeStep = 2;
        this.router.navigateByUrl(
          `dealer/business/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );
      } else if (
        // event.rowData.financialPosition == "Financial Position" &&
        event.rowData.customerType == "Trust"
      ) {
        this.trustSvc.activeStep = 2;
        this.router.navigateByUrl(
          `dealer/trust/${Mode?.edit}/${this.baseFormData?.contractId}/${event.rowData.customerNo}`
        );
      }
    }

    if (event.colName == "delete" && event.actionName == "delete") {

      if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
        return;
      }
      if (this.mode != "view") {
        await this.deleteData(event.index);
        this.baseSvc.updateSignatories.next();
      }
    }
  }

  // async deleteData(index) {
  //   // await this.svc.data
  //   //   .delete(
  //   //     `CustomerDetails/delete_CustomerAddressDetails?contractId=${this.baseFormData?.contractId}&CustomerNumber=${this.baseFormData.customerSummary[index]?.customerNo}`
  //   //   )
  //   //   .subscribe((res) => {});

  //   let customerSelectedData = this.baseFormData.customerSummary[index];
  //   let updatedCustomerSelectedData = this.baseFormData?.updatedCustomerSummary[index];
  //   let updatedCustomerSummary = this.baseFormData?.updatedCustomerSummary;
  //   let body = {
  //     contractId: this.baseFormData?.contractId,
  //     customerNo: customerSelectedData?.customerNo,
  //     customerId: customerSelectedData?.customerId,
  //     oldRole: this.roleKeys?.[customerSelectedData?.roleName],
  //   };

  //   let res: any = await this.postFormData(
  //     "CustomerDetails/remove_customer",
  //     body
  //   );

  //   if(res){
  //    updatedCustomerSummary.find((customer)=>{
  //     if(customer == updatedCustomerSelectedData){
  //       //remove that cusotmer from updatedCustomerSelectedData and setbasedealerform as updatedCustomerSummary
  //     }
  //    })
  //   }

  //   this.dataList = [];
  //   this.init();

  //   return res;
  //   // if (this.dataList.length == 0) {
  //   //   this.columns[0].format = undefined;
  //   //   this.columns[3].format = undefined;
  //   // }
  // }

  async deleteData(index) {
    let customerSelectedData = this.baseFormData.customerSummary[index];
    let updatedCustomerSummary = sessionStorage.getItem(
      "updatedCustomerSummary"
    )
      ? JSON.parse(sessionStorage.getItem("updatedCustomerSummary"))
      : this.baseFormData.updatedCustomerSummary;
    if (customerSelectedData?.roleName === "Borrower") {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "Cannot delete borrower. A borrower must always exist.",
      });
      return;
    }
    let body = {
      contractId: this.baseFormData?.contractId,
      customerNo: customerSelectedData?.customerNo,
      customerId: customerSelectedData?.customerId,
      oldRole: this.roleKeys?.[customerSelectedData?.roleName],
    };

    let res: any = await this.postFormData(
      "CustomerDetails/remove_customer",
      body
    );

    if (res) {
      // Filter out the deleted customer from updatedCustomerSummary
      const filteredUpdatedCustomerSummary = updatedCustomerSummary.filter(
        (customer) => customer.customerNo !== customerSelectedData.customerNo
      );

      // Update sessionStorage
      sessionStorage.setItem(
        "updatedCustomerSummary",
        JSON.stringify(filteredUpdatedCustomerSummary)
      );

      // Update the updatedCustomerSummary Map
      // this.baseSvc?.updatedCustomerSummary.delete(customerSelectedData.customerNo);

      // Update the base form data
      this.baseSvc.setBaseDealerFormData({
        updatedCustomerSummary: filteredUpdatedCustomerSummary,
      });
    }

    this.dataList = [];
    await this.init();

    return res;
  }

  async postFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.svc.data
      ?.post(api, payload)
      .pipe(
        map((res) => {
          if (mapFunc) {
            res = mapFunc(res);
          }

          return res; //this.formConfig.data(res);
        })
      )
      .toPromise();
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
