import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { ToasterService, ValidationService } from "auro-ui";
import { Validators } from "@angular/forms";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { IndividualService } from "../../../services/individual.service";

@Component({
  selector: "app-supplier-bank-details",
  templateUrl: "./supplier-bank-details.component.html",
  styleUrls: ["./supplier-bank-details.component.scss"],
})
export class SupplierBankDetailsComponent extends BaseIndividualClass {

  @Output() bankUpdate = new EventEmitter<any>();

  modelName: "SupplierBankDetailsComponent"
  pageCode: "AddSupplierIndividualComponent"

  selectedCustomerRole: string = "Supplier";

// Do not remove below commented code - kept for reference
  // override formConfig: GenericFormConfig = {
  //    headerTitle: "Bank Details",
  //   autoResponsive: true,
  //   api: "",
  //   goBackRoute: "",
  //   cardBgColor: "--background-color-secondary",
  //   cardType: "non-border",

  //   fields: [
  //       {
  //      type: "text",
  //      label: "Account Name",
  //      name: "supplierAccountName",
  //      cols: 3,
  //      inputType: "vertical",
  //      maxLength: 50,
  //      className: "mr-6",
  
  //    },
  // {
  //   type: "text",
  //   label: "Branch Code",
  //   name: "supplierBranchCode",
  //   cols: 3,
  //   inputType: "vertical",
  //   maxLength: 20,
  //   className: "mt-0 ml-8",
   
  // },
  //    {
  //      type: "text",
  //      label: "Account Number",
  //      name: "supplierAccountNumber",
  //      cols: 3,
  //      inputType: "vertical",
  //      maxLength: 30,
  //     className: "ml-6",
 
  //    },
    
  //   ],

  // };

  override formConfig: any = {
    headerTitle: "Bank Details",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    fields: [],
  };

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: IndividualService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    const config = this.validationSvc?.validationConfigSubject.getValue();
    const filteredValidations = this.validationSvc?.filterValidation(
    config, 'SupplierBankDetailsComponent' , 'AddSupplierIndividualComponent');
    this.formConfig = { ...this.formConfig, fields: filteredValidations };
    console.log('Filtered Validations quote originator reference:', filteredValidations);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }

   override async onFormReady(): Promise<void> {
     await this.updateValidation("onInit");
     super.onFormReady();
   }
  
  override onValueChanges(event: any) {
    super.onValueChanges(event);
    // this.bankUpdate.emit(event);
    this.bankUpdate.emit(this.mainForm?.form.value);
  }

   override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation("onInit");
  }

    override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onFormEvent(event: any) {
    await this.updateValidation("onInit");
  }

   override async onBlurEvent(event): Promise<void> {
    await this.updateValidation("onInit");
  }

  override onButtonClick(event: any) {}



  async updateValidation(event: string) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event,
      modelName: "SupplierBankDetailsComponent",
      pageCode: "AddSupplierIndividualComponent"
    };

    const responses = await this.validationSvc.updateValidation(req);
      if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }
    
    return responses.status;
  }
}
