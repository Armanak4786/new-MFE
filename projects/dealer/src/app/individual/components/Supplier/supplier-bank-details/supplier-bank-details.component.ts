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


  customerRoleData: any = [{ label: "Supplier", value: 1 }];


  override formConfig: GenericFormConfig = {
     headerTitle: "Bank Details",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",

    fields: [
        {
       type: "text",
       label: "Account Name",
       name: "supplierAccountName",
       cols: 3,
       inputType: "vertical",
       maxLength: 50,
       className: "mr-6",
  
     },
  {
    type: "text",
    label: "Branch Code",
    name: "supplierBranchCode",
    cols: 3,
    inputType: "vertical",
    maxLength: 20,
    className: "mt-0 ml-8",
   
  },
     {
       type: "text",
       label: "Account Number",
       name: "supplierAccountNumber",
       cols: 3,
       inputType: "vertical",
       maxLength: 30,
      className: "ml-6",
 
     },
    
    ],

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
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // await this.updateValidation("onInit");
  }

   override async onFormReady(): Promise<void> {
     super.onFormReady();
   }
  
override onValueChanges(event: any) {
    super.onValueChanges(event);
    this.bankUpdate.emit(event);
}

  override onFormEvent(event: any) {
    console.log("event",event,this.baseFormData);
  }

  override onButtonClick(event: any) {}

  // async updateValidation(event: string) {
  //   const req = {
  //     form: this.mainForm?.form,
  //     formConfig: this.formConfig,
  //     event,
  //     modelName: "SupplierBankDetailsComponent",
  //     pageCode: "SupplierBankDetailsComponent",
  //   };

  //   const responses = await this.validationSvc.updateValidation(req);
  //   if (!responses.status && responses.updatedFields.length) {
  //     await this.mainForm.applyValidationUpdates(responses);
  //   }
  //   return responses.status;
  // }
}
