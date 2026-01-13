import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  AssuredFuture,
  LoanDetails,
  OperatingLease,
} from "../../model/customer-statment";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { BaseDealerClass } from "../../../base/base-dealer.class";
import { ToasterService, ValidationService } from "auro-ui";
@Component({
  selector: "app-customer-quote",
  templateUrl: "./customer-quote.component.html",
  styleUrl: "./customer-quote.component.scss",
})
export class CustomerQuoteComponent extends BaseDealerClass implements OnInit {
  loanDetails: LoanDetails[];
  productCode: string = '';
  assuredFuture: AssuredFuture[];
  operatingLease: OperatingLease[];
  productType: string;
  customerStatementApiData: any;
  pageCode: string = "";
  modelName: string = "";
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private changeDetectorRef: ChangeDetectorRef,
    private standardService: StandardQuoteService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
override formConfig: GenericFormConfig = {
  cardType: "non-border",
  headerTitle: "",
  cardBgColor: "--surface-a",
  autoResponsive: true,
  api: "quoteOriginator",
  goBackRoute: "quoteOriginator",
  fields: [
    {
      type: "text",
      label: "Product",
      name: "extName",
      inputType: "vertical",
     className: " w-1 mr-2",
        // options: [],
      labelClass: "col-sm-3 col-md-2 col-form-label", // Responsive label column
      inputClass: "col-sm-9 col-md-10", // Responsive input column
      hidden: false,
      disabled:true,
    },
    {
      type: "text",
      label: "Program",
      name: "programId",
      inputType: "vertical",
     className: "",
       // options: [],
      labelClass: "col-sm-3 col-md-2 col-form-label",
      inputClass: "mt-2  mr-2",
      disabled:true,
    },
    {
      type: "text",
      inputType: "horizontal",
      label: "Asset Type",
      name: "assetType",
      className: " w-1   ",
      labelClass: "mb-2",
      inputClass: "pr-2 mr-2",
      disabled:true,
    },
   
    {
      type: "text",
      label: "Originator Name",
      name: "originatorName",
      inputType: "horizontal",
    className: " w-1   ",
      labelClass: "mb-2",
      inputClass: "pr-2 mr-2",
      disabled:true,
    },
   
    {
      type: "phone",
      label: "Originator Number",
      name: "originatorNumber",
      inputType: "horizontal",
     className: " w-1   ",
      labelClass: "mb-2",
      inputClass: "pr-2 mr-2",
      disabled:true,
    },
   
    {
      type: "text",
      inputType: "horizontal",
      label: "Sales Person",
      name: "salesPerson",
    className: " w-1   ",
      labelClass: "mb-2",
      inputClass: "pr-2 mr-2",
      disabled:true,
    },
//     {
//  type: "text",
//  label:"Quote ID",
//  name:"quoteID",
//  //inputClass:"hidden"
//     },
 
    {
  type: "text",
  label: "Quote ID: ",
  name: "contractId",
   className: " -mr-8 ",
   cols:2,
  inputType: "horizontal",
  styleType: "labelType",
 // labelClass: "hidden",
  inputClass: "col-8 quote-id-input",
  hidden: false,
  mode: Mode.view,
 
},
 
   
   {
      type: "text",
      label: "Status : ",
      name: "workFlowStatus",
      cols: 2, // Keep original cols property
      inputType: "horizontal",
      // Use row but preserve original responsive behavior
      className: "row mb-3 status equal-width-field",
      // Keep original Bootstrap col classes that worked
      labelClass: "col-4 pl-2 pr-0 text-center text-white col-form-label",
      inputClass: "col-8 pr-2 pl-0 text-white text-center",
      mode: Mode.label,
      disabled: true,
    },
  ],
};






  // override async ngOnInit(): Promise<void> {
  //   await super.ngOnInit();
   
  //   // Handle contractId visibility and value - extracted from quote-originator
  //   if (this.baseFormData && this.mainForm?.form) {
  //     if (this.baseFormData?.contractId) {
  //       this.mainForm.updateHidden({ contractId: false });
  //       this.mainForm.form
  //         .get("contractId")
  //         ?.patchValue(this.baseFormData?.contractId);
  //     } else {
  //       this.mainForm.updateHidden({ contractId: true });
  //     }
  //   }
      
  // }
 
   override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.productCode = sessionStorage.getItem('productCode') || '';
    if (this.baseFormData?.customerStatementData) {
    this.customerStatementApiData = this.baseFormData.customerStatementData;
    this.populateFormWithApiData();
  }
  }
  populateFormWithApiData() {
    if (!this.customerStatementApiData || !this.mainForm?.form) {
      return;
    }
    this.mainForm.form.patchValue({
      extName: this.customerStatementApiData?.products || '',
      programId: this.customerStatementApiData?.program || '',
      assetType: this.customerStatementApiData?.assetType?.assetTypeName|| '',
      originatorName: this.customerStatementApiData?.originatorName || '',
      originatorNumber: this.customerStatementApiData?.originatorNumber || '',
      salesPerson: this.customerStatementApiData?.salesperson || '',
      contractId: this.customerStatementApiData?.contractId || '',
      workFlowStatus: this.customerStatementApiData?.workFlowStatus || 'Open Quote'
    });
    this.mainForm.updateHidden({ contractId: false });
    this.mainForm.updateHidden({ workFlowStatus: false });
  }

  override async onFormReady(): Promise<void> {
  await this.updateValidation("onInit");
  super.onFormReady();

  // Ensure Quote ID is always set to static value
 

  // Set default status if needed
  if (!this.baseFormData?.workFlowStatus) {
    this.mainForm.get("workFlowStatus")?.patchValue("Open Quote");
  }
}

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  // Status change handler - NO override modifier (doesn't exist in base class)
  onStatusChange(statusDetails: any): void {
    if (this.baseFormData?.contractId) {
      if (this.baseFormData?.isDraft) {
        this.mainForm.get("workFlowStatus").patchValue("Draft");
      } else {
        this.mainForm
          .get("workFlowStatus")
          .patchValue(statusDetails?.currentState);
      }
    } else {
      this.mainForm.get("workFlowStatus").patchValue("Open Quote");
    }
  }

  // Render component with new data - MUST have override modifier (exists in base class)
  override renderComponentWithNewData() {
    if (this.baseFormData && this.mainForm?.form) {
      this.mainForm.updateHidden({ contractId: false });
      this.mainForm.form.patchValue({
        contractId: this.baseFormData?.contractId,
      });
    }
    super.renderComponentWithNewData();
    this.changeDetectorRef.detectChanges();
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
