import { ChangeDetectorRef, Component, effect } from "@angular/core";
import { BaseDealerClass } from "../../../base/base-dealer.class";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { map, takeUntil } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";
import configure from "src/assets/configure.json";
import env from "src/assets/api-json/en_US.json";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import { isWorkflowStatusInViewOrEdit } from "../../utils/workflow-status.utils";

@Component({
  selector: "app-dealer-disbursment-details",
  templateUrl: "./dealer-disbursment-details.component.html",
  styleUrls: ["./dealer-disbursment-details.component.scss"],
})
export class DealerDisbursmentDetailsComponent extends BaseDealerClass {
  totalCaluclationOfDisbursmentDetails: number = 0;
  disbursmentLookup: any[] = [];
  disbursmentData = {
    disrbursmentType: {},
    suppliers: [],
  };
  showError: boolean = false;
  formData: any;
  amountFinanced: any;
  payableToUDC = { row: -1, amount: 0 };
  payableToDealer = { row: -1, amount: 0 };
  originatorName: string;
  originatorNameFromApi: boolean = false; // Flag to prevent effect from overwriting API value
  headerText = "Disbursement Details";
  isWorkflowApproved: boolean = false;
  payableToUDCError: boolean = false;
  payableToDealeError: boolean = false;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    override baseSvc: StandardQuoteService,
    public cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public dashsvc: DashboardService
  ) {
    super(route, svc, baseSvc);
    effect(() => {
      let res = this.dashsvc?.onOriginatorChange();
      // Only set if res has a name and originatorName isn't already set from API
      if (res?.name && !this.originatorNameFromApi) {
        this.originatorName = res.name;
      }
    });
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
      });

    // Check API data first - it takes priority over signal
    const disbursementDetails = this.formData?.apiDisbursementDetails ?? [];
    const originatorRow = disbursementDetails.find(
      (d) => d.disbursementType === env.labelData.payableToOriginator
    );
    const supplierName = originatorRow?.supplierName;
    
    if (supplierName && supplierName.trim()) {
      // API has valid supplierName - use it and set flag to prevent effect from overwriting
      this.originatorName = supplierName;
      this.originatorNameFromApi = true;
    }

    if (this.formData?.apiDisbursementDetails) {
      this.bindApiDisbursementDetails();
    }
    if (this.baseFormData.amoutFinanced) {
      this.amountFinanced = this.baseFormData?.amoutFinanced;
    }

    if (this.baseFormData?.data?.amoutFinanced) {
      this.amountFinanced = this.baseFormData?.data?.amoutFinanced;
    }

    this.setMandatoryFieldsForApprovedWorkflow();
    
    const request = {
      parameterValues: ["Disbursement Type"],
      procedureName: configure.SPContractCfdLuExtract,
    };
    await this.svc.data
      .post("LookupServices/CustomData", request)
      .pipe(
        map((res) => {
          this.disbursmentLookup = res.data.slice(1); // Assuming res.data contains the lookup list
          this.disbursmentLookup.forEach((item) => {
            this.disbursmentData.disrbursmentType[item.lookupName] = 0;
            this.cdr.detectChanges();
          });
        })
      )
      .toPromise();
    // if (this.formData.apiDisbursementDetails) {
    //   this.bindApiDisbursementDetails();
    // }
  }

  
 isDisabled() {
    return isWorkflowStatusInViewOrEdit(this.formData?.AFworkflowStatus);
  }

setMandatoryFieldsForApprovedWorkflow(): void {
  const workflowStatus = sessionStorage?.getItem('workFlowStatus');
  if (workflowStatus && workflowStatus.toLowerCase() === 'approved') {
    this.isWorkflowApproved = true;
  }
  else
  {
    this.isWorkflowApproved = false;
  }
}

validateMandatoryFields(): boolean {
  if (this.isWorkflowApproved) {
    this.payableToUDCError = !this.payableToUDC.amount || this.payableToUDC.amount <= 0;
    this.payableToDealeError = !this.payableToDealer.amount || this.payableToDealer.amount <= 0;
    return !this.payableToUDCError && !this.payableToDealeError;
  }
  this.payableToUDCError = false;
  this.payableToDealeError = false;
  return true;
}
 
  // bindApiDisbursementDetails() {
  //   const apiDisbursementDetails = this.formData?.apiDisbursementDetails || [];

  //   apiDisbursementDetails.forEach((detail) => {
  //     if (detail.disbursementType === "Supplier") {
  //       this.disbursmentData.suppliers.push({
  //         supplierName: detail.supplierName || "",
  //         supplierAmount: +detail.payableAmount || 0,
  //       });
  //     }

  //     const matchingDisbursementType = this.disbursmentLookup.find(
  //       (item) => item.lookupName === detail.disbursementType
  //     );

  //     if (matchingDisbursementType) {
  //       this.disbursmentData.disrbursmentType[detail.disbursementType] =
  //         +detail.payableAmount || 0;
  //     }
  //   });

  //   this.calculateTotal();
  //   this.cdr.detectChanges();
  // }
  
  bindApiDisbursementDetails() {
    const apiDisbursementDetails = this.formData?.apiDisbursementDetails || [];

    apiDisbursementDetails.forEach((detail) => {
      switch (detail.disbursementType) {
        case env.labelData.payableToUDCFinance: // Map to payableToUDC
          this.payableToUDC.amount = detail.payableAmount || 0;
          this.payableToUDC.row = detail.rowNo;
          break;

        case env.labelData.payableToOriginator: // Map to payableToDealer
          this.payableToDealer.amount = detail.payableAmount || 0;
          this.payableToDealer.row = detail.rowNo;
          break;

        case env.labelData.payableToSupplier: // Map to suppliers[]
          this.disbursmentData.suppliers.push({
            supplierName: detail.supplierName || "",
            supplierAmount: detail.payableAmount || 0,
            row: detail.rowNo,
            showError: false,
          });
          break;
      }
    });

    this.calculateTotal();
    this.cdr.detectChanges();
  }

  addSupplier() {

     if(isWorkflowStatusInViewOrEdit(this.formData?.AFworkflowStatus)){
        return;
      }

    this.disbursmentData.suppliers.push({
      supplierName: "",
      supplierAmount: 0,
      row: -1,
    });
    
  }

  // removeSupplier(index: number) {
  //   this.disbursmentData.suppliers.splice(index, 1);
  //   this.calculateTotal();
  //   this.getValue();
  // }
  removeSupplier(index: number) {
  const supplier = this.disbursmentData.suppliers[index];
  supplier.changeAction = "Delete";
  this.calculateTotal();
  this.getValue();
}


  // calculateTotal() {
  //   this.totalCaluclationOfDisbursmentDetails = 0;

  //   // Add up all the disbursement type amounts
  //   for (const key in this.disbursmentData.disrbursmentType) {
  //     this.totalCaluclationOfDisbursmentDetails +=
  //       +this.disbursmentData.disrbursmentType[key];
  //   }

  //   // Add up all the suppliers' amounts
  //   this.disbursmentData.suppliers.forEach((supplier) => {
  //     this.totalCaluclationOfDisbursmentDetails += +supplier.supplierAmount;
  //   });

  // }
 
  getValue() {
    this.calculateTotal();

    const apiDisbursementDetails = [];
    // const payableDisbursementDetails =[]
    // payableDisbursementDetails.push({
    //   payableToUDC:this.payableToUDC,
    //   payableToDealer:this.payableToDealer
    // })

    apiDisbursementDetails.push({
      rowNo: this.payableToUDC.row !== -1 ? this.payableToUDC.row : -1,
      disbursementType: env.labelData.payableToUDCFinance,
      supplierName: env.labelData.udcFinance,
      payableAmount: this.payableToUDC?.amount?.toString() || "0",
    });
    apiDisbursementDetails.push({
      rowNo: this.payableToDealer.row !== -1 ? this.payableToDealer.row : -1,
      disbursementType: env.labelData.payableToOriginator,
      supplierName: this.originatorName,
      payableAmount: this.payableToDealer?.amount.toString() || "0",
    });
    // Process suppliers
    if (this.disbursmentData.suppliers?.length) {
      this.disbursmentData.suppliers.forEach((supplier) => {
        apiDisbursementDetails.push({
          rowNo: supplier.row !== -1 ? supplier.row : -1,
          disbursementType: env.labelData.payableToSupplier,
          supplierName: supplier.supplierName || null,
          payableAmount: supplier.supplierAmount.toString(),
          changeAction: supplier.changeAction || null
        });
      });
    }
    // Process disbursement types
    // for (const key in this.disbursmentData.disrbursmentType) {
    //   apiDisbursementDetails.push({
    //     disbursementType: key,
    //     supplierName: null,
    //     payableAmount:
    //       this.disbursmentData.disrbursmentType[key].toString() || "",
    //   });
    // }

    this.baseSvc.setBaseDealerFormData({ apiDisbursementDetails });
  }
  calculateTotal() {
    this.totalCaluclationOfDisbursmentDetails = 0;

    // Add up all the disbursement type amounts
    // const disbursmentData = this.disbursmentData

    for (const key in this.disbursmentData.disrbursmentType) {
      this.totalCaluclationOfDisbursmentDetails +=
        +this.disbursmentData.disrbursmentType[key];
    }

    // Add up all the suppliers' amounts
    this.disbursmentData.suppliers.forEach((supplier) => {
      if (!supplier.showError  && supplier.changeAction !== "Delete") {
        // supplier.supplierAmount = +supplier.supplierAmount;
        this.totalCaluclationOfDisbursmentDetails += +supplier.supplierAmount;
      }
    });
    this.totalCaluclationOfDisbursmentDetails =
      this.totalCaluclationOfDisbursmentDetails +
      +this.payableToUDC.amount +
      +this.payableToDealer.amount;

    // Check if total exceeds the financed amount
    if (
      this.amountFinanced != null &&
      this.totalCaluclationOfDisbursmentDetails > this.amountFinanced
    ) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  // validateSupplierAmount(supplier: any) {
  //   if (supplier.supplierAmount <= 0 || supplier.supplierAmount == null) {
  //     supplier.showError = true;
  //   } else {
  //     supplier.showError = false;
  //   }
  // }
  validateSupplierAmount(supplier: any) {
    if (supplier.supplierAmount == null || supplier.supplierAmount <= 0) {
      supplier.showError = true;
      supplier.errorMessage = "Amount must be greater than 0.";
    } else if (
      supplier.supplierName &&
      supplier.supplierName.trim() !== "" &&
      +supplier.supplierAmount === 0
    ) {
      supplier.showError = true;
      supplier.errorMessage =
        "Amount cannot be 0 when supplier name is entered.";
    } else {
      supplier.showError = false;
      supplier.errorMessage = "";
    }
  }

  validateSupplierName(supplier: any) {
    const name = supplier.supplierName?.trim() || "";

    if (name.length > 50) {
      supplier.nameError = true;
      supplier.nameErrorMessage = "Only 50 characters allowed.";
    } else if (name && !/^[A-Za-z\s]+$/.test(name)) {
      supplier.nameError = true;
      supplier.nameErrorMessage = "Supplier name must contain only alphabets.";
    } else {
      supplier.nameError = false;
      supplier.nameErrorMessage = "";
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
