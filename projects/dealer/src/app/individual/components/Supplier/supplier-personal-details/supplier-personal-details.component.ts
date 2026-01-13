import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { ValidationService, ToasterService } from "auro-ui";
import { Validators } from "@angular/forms";
import { countryCodeOptions } from "../../../../dashboard/utils/internal-sales-header-utils";
import { Output, EventEmitter } from "@angular/core";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-supplier-personal-details",
  templateUrl: "./supplier-personal-details.component.html",
  styleUrls: ["./supplier-personal-details.component.scss"],
})
export class SupplierPersonalDetailsComponent extends BaseIndividualClass {
  @Output() formUpdate = new EventEmitter<any>();

  customerRoleData: any = [{ label: "Supplier", value: 1 }];

  override formConfig: GenericFormConfig = {
    headerTitle: "Personal Details",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    fields: [
      {
        type: "select",
        label: "Title",
        name: "title",
        cols: 2,
        filter: true,
        options: [],
        alignmentType: "vertical",
        labelClass: " -mt-3",
        inputClass: " -mt-1",
        className: " -mt-1",
        validators: [Validators.required],
      },
      {
        type: "name",
        label: "First Name",
        name: "firstName",
        // regexPattern: "[^a-zA-Z]*",
        maxLength: 20,
        cols: 2,
        inputType: "vertical",
        className: "mr-3",
        validators: [Validators.required],
      },
      {
        type: "name",
        label: "Middle Name(s)",
        name: "middleName",
        maxLength: 20,
        cols: 2,
        inputType: "vertical",
        className: "mr-3",
      },
      {
        type: "name",
        label: "Last Name",
        name: "lastName",
        maxLength: 20,
        cols: 2,
        inputType: "vertical",
        className: "mr-3",
        validators: [Validators.required],
      },
      {
        type: "text",
        label: "Known As",
        name: "knownAs",
        cols: 2,
        nextLine: true,
        inputType: "vertical",
        className: "mr-3",
      },

      {
        type: "label-only",
        label: "Contact Details",
        name: "contactDetailsHeader",
        cols: 12,
        className: "text-base font-bold mt-1",
      },
      {
        type: "select",
        label: "Mobile",
        name: "individualSupplierMobile",
        alignmentType: "vertical",
        options: countryCodeOptions,
        className: "-ml-4 mb-2  pl-5 -pr-2 py-0 -mt-4",
        // labelClass: "col-12 -my-4",
        // inputClass: "col-12 -my-5",
        cols: 1,
        filter: true,
      },

      {
        type: "phone",
        name: "individualSupplierAreaCode",
        cols: 1,
        maxLength: 4,
        className: "-ml-2 mr-2 mb-5 pr-4 mt-0 ",
        // inputType: "vertical",
        labelClass: "hidden",
      },
      {
        type: "phone",
        name: "individualSupplierPhoneNumber",
        cols: 2,
        maxLength: 10,
        className: "-ml-3 col-2 mb-5 pr-4 mt-0",
        // inputType: "vertical",
        labelClass: "hidden",
      },
      {
        type: "email",
        label: "Email",
        name: "individualSupplierEmail",
        cols: 3,
        className: "mr-3 ml-6  -mt-3  pr-0 pl-1",
        labelClass: "-mt-3 mb-3",
        inputType: "vertical",
      },
      {
        type: "checkbox",
        name: "noEmail",
        label: "No Email",
        cols: 2,
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

    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=Title",
    ]);
  }

  // override onValueChanges(data: any) {
  //   this.formUpdate.emit(data);
  // }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    await this.updatedropdowndata();
    await this.updateValidation("onInit");
  }

 override async onFormReady(): Promise<void> {
  await super.onFormReady();

 
}


  async updatedropdowndata() {
    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=Title`,
      (res) => {
        const titleList = res.data.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        this.mainForm.updateList("title", titleList);
      }
    );
  }

  async updateValidation(event: string) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event,
      modelName: "SupplierPersonalDetailsComponent",
      pageCode: "SupplierPersonalDetailsComponent",
    };

    const responses = await this.validationSvc.updateValidation(req);

    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }
}
