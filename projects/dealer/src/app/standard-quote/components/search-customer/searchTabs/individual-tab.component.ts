import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { CommonService, DataService, GenericFormConfig } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Validators } from "@angular/forms";
import { HttpParams } from "@angular/common/http";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-individual-tab",
  template: `
    <base-form
      #mainForm
      [formConfig]="formConfig"
      [mode]="mode"
      [id]="id"
      [data]="data"
      (valueChanges)="onValueChanges($event)"
      (formEvent)="onFormEvent($event)"
      (formButtonEvent)="onButtonClick($event)"
      (formReady)="onFormReady()"
      (onInput)="onValueTyped($event)"
      (onBlur)="onBlurEvent($event)"
      (onValueChange)="onValueEvent($event)"
    >
    </base-form>
  `,
})
export class IndividualTabComponent extends BaseStandardQuoteClass {
  date = new Date();
  allowedDate = new Date(
    this.date.getMonth() +
      1 +
      "/" +
      this.date.getDate() +
      "/" +
      (this.date.getFullYear() - 18)
  );

  override formConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        label: "Search By",
        name: "searchBy",
        default: "customerName",
        filter: true,

        // cols: 3,
        options: [
          { label: "Customer Name", value: "customerName" },
          { label: "Driver Licence Number", value: "driverLicenceNo" },
          { label: "UDC Customer Number", value: "udcCustomerNumber" },
        ],
        toolTipPosition:'top'
      },
      {
        type: "text",
        label: "First Name",
        resetOnHidden: true,
        name: "firstName",
        //regexPattern: "[^a-zA-Z]*",
        // cols: 3
        hidden: false,
        className: "-mt-2 mr-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "Last Name",
        name: "lastName",
        //regexPattern: "[^a-zA-Z]*",
        resetOnHidden: true,
        hidden: false,
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "Driving Licence Number",
        name: "driverLicenceNo",
        resetOnHidden: true,
        hidden: true,
        cols: 3,
        //regexPattern: "[^a-zA-Z0-9]*",
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },
      {
        type: "text",
        label: "UDC Customer Number",
        name: "udcCustomerNo",
        resetOnHidden: true,
        hidden: true,
        maxLength: 10,
        cols: 6,
        //regexPattern: "[^a-zA-Z0-9]*",
        className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical"
      },

      {
        type: "date",
        label: "Date of Birth",
        name: "dateOfBirth",
        defaultDate: this.allowedDate,
        // resetOnHidden: true,
        cols: 3,
        // maxDate: this.allowedDate,
        // className: "-mt-2",
        labelClass: "mb-0",
        inputType: "vertical",
        className: "-mt-3",
      },
      {
        type: "button",
        label: "Search",
        name: "searchBtn",
        submitType: "submit",
      },
      {
        type: "button",
        label: "Reset",
        name: "resetBtn",
        btnType: "border-btn",
        submitType: "internal",
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    this.mainForm?.form?.reset();
    await super.ngOnInit();
    this.mainForm.get("searchBy").patchValue("customerName");

    await this.updateValidation("onInit");
  }

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public dataSvc: DataService,
    override baseSvc: StandardQuoteService,
    public ref: DynamicDialogRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }

  override onFormEvent(event: any): void {
    // if (event.name == "searchBy") {
    //   if (event.value == "driverLicenceNo") {
    //     this.mainForm.updateHidden({
    //       firstName: true,
    //       lastName: true,
    //       dateOfBirth: true,
    //       driverLicenceNo: false,
    //       udcCustomerNo: true,
    //     });
    //   } else if (event.value == "udcCustomerNumber") {
    //     this.mainForm.updateHidden({
    //       firstName: true,
    //       lastName: true,
    //       dateOfBirth: true,
    //       driverLicenceNo: true,
    //       udcCustomerNo: false,
    //     });
    //   } else {
    //     this.mainForm.updateHidden({
    //       firstName: false,
    //       lastName: false,
    //       dateOfBirth: false,
    //       driverLicenceNo: true,
    //       udcCustomerNo: true,
    //     });
    //   }
    // }
    this.updateValidation('onInit')
    super.onFormEvent(event);
  }
  override async onValueTyped(event: any): Promise<void> {
    if (event.name == "searchBy") {
      if (event.data == "driverLicenceNo") {
        this.mainForm.updateHidden({
          firstName: true,
          lastName: true,
          dateOfBirth: false,
          driverLicenceNo: false,
          udcCustomerNo: true,
        });
        this.mainForm?.form?.get("dateOfBirth").reset();
      } else if (event.data == "udcCustomerNumber") {
        this.mainForm.updateHidden({
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          driverLicenceNo: true,
          udcCustomerNo: false,
        });
        this.mainForm?.form?.get("dateOfBirth")?.reset();
      } else {
        this.mainForm.updateHidden({
          firstName: false,
          lastName: false,
          dateOfBirth: false,
          driverLicenceNo: true,
          udcCustomerNo: true,
        });
      }
    }

    await this.updateValidation(event);
  }
  override async onButtonClick(event: any): Promise<void> {
   if (event?.field?.name == "searchBtn") {
    if ( this.mainForm.form.get("dateOfBirth")?.invalid) {
      this.mainForm.form.get("dateOfBirth")?.setErrors(null);
      this.mainForm.form.get("dateOfBirth")?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    console.log(this.mainForm.form.valid, "mainForm.form.valid");
    console.log(this.mainForm.form, "mainForm.form.value");
    if (this.mainForm.form.valid) {
      this.callCustomerSearchAPI();
    } else {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: "A search criteria field must be completed",
      });
    }
  }

    if (event?.field?.name == "resetBtn") {
      this.mainForm.form.reset();
      this.baseFormData.searchCustomerData.individual = null;
      await this.updateValidation("onInit");
    }
  }

  callCustomerSearchAPI() {
    // [
    //   { label: 'Customer Name', value: 'customerName' },
    //   { label: 'Driver Licence Number', value: 'driverLicenceNo' },
    //   { label: 'UDC Customer Number', value: 'udcCustomerNumber' },
    // ]
    // delete formData?.resetBtn;
    // delete formData?.searchBtn;
    // delete formData?.searchBy;

    // for (const key in formData) {
    //   if (!formData[key]) {
    //     delete formData[key];
    //   }
    // }

    let formData = this.mainForm.form.value;
    let individualData: any;

    switch (formData?.searchBy) {
      case "customerName":
        individualData = {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          dateOfBirth: this.baseFormData?.dateOfBirth,
        };
        break;
      case "driverLicenceNo":
        individualData = {
          driverLicenceNo: formData?.driverLicenceNo,
        };
        break;
      case "udcCustomerNumber":
        individualData = {
          udcCustomerNo: formData?.udcCustomerNo,
        };
        break;
    }

    let payload = {
      individual: individualData,
      business: null,
      trust: null,
    };

    this.baseSvc.setBaseDealerFormData({
      searchCustomerData: payload,
    });

    this.dataSvc
      .post(`CustomerDetails/search_customer`, payload)
      .subscribe((res) => {
        // if (res?.data?.customers?.length > 0) {
        this.baseSvc.searchCustomerData = res?.data?.customers;

        const isBusiness =
          this.baseFormData?.purposeofLoan?.toLowerCase() === "business";
        const path = isBusiness ? "sole-trade" : "individual";
        //console.log(this.baseFormData, path, "isBusiness");
        this.svc.router.navigateByUrl(
          `/dealer/standard-quote/borrower-search-result/${path}`
        );
        this.mainForm.form.reset();
        this.ref.close();
        // }
      });
  }

  override async onSuccess(data: any) {}
  override ngOnDestroy(): void {
    this.baseFormData.individualFirstName = this.baseFormData.firstName;
    this.baseFormData.individualLastName = this.baseFormData.lastName;
    this.baseFormData.individualDateOfBirth = this.baseFormData.dateOfBirth;
    this.baseFormData.individualDriverLicenseNo =
      this.baseFormData.driverLicenceNo;

    this.mainForm.form.reset();

    this.baseFormData.firstName = "";
    this.baseFormData.lastName = "";
    this.baseFormData.dateOfBirth = null;
    this.baseFormData.driverLicenceNo = "";
    this.baseFormData.udcCustomerNo = "";
    this.baseFormData.searchBy = "customerName";
  }

  pageCode: string = "SearchCustomerComponent";
  modelName: string = "IndividualTabComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
    if (this.baseFormData?.searchCustomerData?.individual != null) {
      const individual = this.baseFormData?.searchCustomerData?.individual;

      if (individual?.udcCustomerNo) {
        this.mainForm.get("searchBy").patchValue("udcCustomerNumber");
        this.mainForm.get("udcCustomerNo").patchValue(individual.udcCustomerNo);
        this.mainForm.updateHidden({
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          driverLicenceNo: true,
          udcCustomerNo: false,
        });
      } else if (individual?.driverLicenceNo) {
        this.mainForm.get("searchBy").patchValue("driverLicenceNo");
        this.mainForm
          .get("driverLicenceNo")
          .patchValue(individual.driverLicenceNo);
        this.mainForm.updateHidden({
          firstName: true,
          lastName: true,
          dateOfBirth: false,
          driverLicenceNo: false,
          udcCustomerNo: true,
        });
      } else if (individual?.firstName || individual?.lastName) {
        this.mainForm.get("searchBy").patchValue("customerName");
        this.mainForm.get("firstName").patchValue(individual.firstName);
        this.mainForm.get("lastName").patchValue(individual.lastName);
        const dob = new Date(individual.dateOfBirth);
        this.mainForm.get("dateOfBirth").patchValue(dob);
        this.mainForm.updateHidden({
          firstName: false,
          lastName: false,
          dateOfBirth: false,
          driverLicenceNo: true,
          udcCustomerNo: true,
        });
      }
    } else {
      this.mainForm.get("searchBy").patchValue("customerName");
    }
    await this.updateValidation("onInit");
  }

  override async onBlurEvent(event): Promise<void> {
    if (event.name !== "dateOfBirth") {
      await this.updateValidation(event);
    }
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
