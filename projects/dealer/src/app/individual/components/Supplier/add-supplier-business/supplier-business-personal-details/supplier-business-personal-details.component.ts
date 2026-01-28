import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseIndividualClass } from "../../../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { IndividualService } from "../../../../services/individual.service";
import { ValidationService, ToasterService } from "auro-ui";
import { Validators } from "@angular/forms";
import { countryCodeOptions } from "../../../../../dashboard/utils/internal-sales-header-utils";

@Component({
  selector: "app-supplier-business-personal-details",
  templateUrl: "./supplier-business-personal-details.component.html",
  styleUrls: ["./supplier-business-personal-details.component.scss"],
})
export class SupplierBusinessPersonalDetailsComponent extends BaseIndividualClass {
// Do not remove below commented code - kept for reference
//  override formConfig: GenericFormConfig = {
//   headerTitle: "Business Details",
//     autoResponsive: true,
//     api: "",
//     goBackRoute: "",
//     cardBgColor: "--background-color-secondary",
//     cardType: "non-border",

//   fields: [

//     {
//       type: "text",
//       name: "legalName",
//       label: "Legal Name ",
//       inputType: "vertical",
//       cols: 3,
//       className: "pr-7",
//     },
//     {
//       type: "text",
//       name: "tradingName",
//       label: "Trading Name ",
//       inputType: "vertical",
//       cols: 3,
//       className: "pr-7",
//     },
//     {
//       type: "text",
//       name: "registeredCompanyNumber",
//       label: "Registered company Number",
//       inputType: "vertical",
//       cols: 3,
//       className: "pr-7",
//     },
//     {
//       type: "text",
//       name: "gstNumber",
//       label: "GST Number",
//       inputType: "vertical",
//       cols: 3,
//       className: "pr-7"
//     },

//     {
//         type: "label-only",
//         label: "Contact Details",
//         name: "contactDetailsHeader",
//         cols: 12,
//         className: "text-base font-bold mt-1",
//       },

//       {
//               type: "select",
//               label: "Mobile",
//               name: "businessSupplierMobile",
//               alignmentType: "vertical",
//               options: countryCodeOptions,
      
//               className: "-ml-4 mb-2  pl-5 -pr-2 py-0 -mt-4",
//               // labelClass: "col-12 -my-4",
//               // inputClass: "col-12 -my-5",
//               cols: 1,
//               filter: true,
   
//             },
      
//             {
//               type: "phone",
//               name: "businessSupplierAreaCode",
//               cols: 1,
//               maxLength: 4,
//               className: "-ml-2 mr-2 mb-5 pr-4 mt-0 ",
//               // inputType: "vertical",
//               labelClass: "hidden",
//             },
//             {
//               type: "phone",
//               name: "businessSupplierPhoneNumber",
//               cols: 2,
//               maxLength: 10,
//               className: "-ml-3 col-2 mb-5 pr-4 mt-0",
//               // inputType: "vertical",
//               labelClass: "hidden",
//             },
//       {
//         type: "email",
//         label: "Email",
//         name: "businessSupplierEmail",
//         cols: 3,
//         className: "mr-3 ml-6  -mt-3  pr-0 pl-1",
//         labelClass: "-mt-3 mb-3",
//         inputType: "vertical",
//       },
//       {
//         type: "checkbox",
//         name: "noEmail",
//         label: "No Email",
//         cols: 2,
//       },
//   ],
// };

	override formConfig: any = {
    headerTitle: "Business Details",
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
    config,'SupplierBusinessPersonalDetailsComponent','AddSupplierBusinessComponent');
    this.formConfig = { ...this.formConfig, fields: filteredValidations };
    console.log('Supplier Business Details fields:', filteredValidations);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.mainForm?.updateList("businessSupplierMobile", countryCodeOptions);
    await this.updateValidation("onInit");
  }

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  async updateValidation(event: string) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event,
      modelName: "SupplierBusinessPersonalDetailsComponent",
      pageCode: "SupplierBusinessPersonalDetailsComponent",
    };

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }
    return responses.status;
  }
}
