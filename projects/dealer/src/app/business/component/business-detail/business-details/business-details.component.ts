import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseBusinessClass } from "../../../base-business.class";
import { BusinessService } from "../../../services/business";
import configure from "../../../../../../public/assets/configure.json";

@Component({
  selector: "app-business-details",

  templateUrl: "./business-details.component.html",
  styleUrl: "./business-details.component.scss",
})
export class BusinessDetailsComponent extends BaseBusinessClass {
  customerRole: any;
  customerRoleForm: FormGroup;
  private organisationTypeOptions: any[] = [];
  override formConfig: GenericFormConfig = {
    headerTitle: "Business Details",
    autoResponsive: true,
    api: "businessDetails",
    goBackRoute: "businessDetails",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    fields: [
      {
        type: "select",
        label: "Organisation Type",
        name: "organisationType",
        alignmentType: "vertical",
        // list$: "LookUpServices/lookups?LookupSetName=BusinessEntityType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        // validators: [Validators.required],
        cols: 2,
        default: "Limited Liability Company",
        className: "-mt-0",
        labelClass: "-mt-2 py-0",
        filter: true,
      },
      {
        type: "text",
        label: "Legal Name",
        name: "legalName",
        inputType: "vertical",
        className: "col-fixed w-2 px-0 mt-2 ml-8 ",
        //regexPattern: "[^a-zA-Z ]*",
        // maxLength: 30,
        // validators: [Validators.required],
        cols: 2,
        default: "",
      },
      {
        type: "text",
        label: "Trading Name",
        name: "tradingName",
        inputType: "vertical",
        //regexPattern: "[^a-zA-Z ]*",
        // maxLength: 30,
        // validators: [Validators.required],
        cols: 2,
        className: "mt-2 ml-6",
        nextLine: true,
      },
      {
        type: "text",
        label: "Registered Company Number",
        name: "registeredCompanyNumber",
        inputType: "vertical",
        //regexPattern: "[^a-zA-Z0-9]*",
        // maxLength: 15,
        // validators: [Validators.required],
        cols: 2,
        className: "mt-2 w-2 ml-2 white-space-nowrap",
        inputClass: "ic customwidth"
      },
      {
        type: "text",
        label: "New Zealand Business Number",
        name: "newZealandBusinessNumber",
        inputType: "vertical",
        //regexPattern: "[^a-zA-Z0-9]*",
        // maxLength: 15,
        // validators: [Validators.required],
        className: "col-fixed w-2 px-0 mt-2 ml-8",
        inputClass: "icc",
        labelClass: "lcc"
      },
      {
        type: "text",
        label: "GST Number",
        name: "taxNumber",
        inputType: "vertical",
        //regexPattern: "[^a-zA-Z0-9]*",
        // maxLength: 15,
        className: "mt-2 ml-6",
        // validators: [Validators.required],
        cols: 2,
        labelClass: "gss",
        inputClass: "gsts",
        nextLine: true,
      },
      {
        type: "textArea",
        label: "Business Description",
        name: "businessDescription",

        //regexPattern: "/[^.?!]/",
        // validators: [Validators.required],
        cols: 4,
        textAreaRows: 2,
        inputType: "vertical",
        textAreaType: "border",
        className: "mt-3",
        inputClass: "w-100 pl-2",
        labelClass: "pl-2",
      },

      {
        type: "select",
        label: "Primary Nature of Business",
        name: "natureOfBusiness",
        alignmentType: "vertical",
        filter: true,
        options: [],
        cols: 2,
        className: "px-0 mt-4 ml-4",
        labelClass: "-mt-3",
      },

      {
        type: "select",
        label: "Source of Wealth",
        name: "sourceOfWealth",
        alignmentType: "vertical",
        className: "mt-4 ml-4",
        filter: true,
        options: [],
        cols: 2,
        labelClass: "-mt-3",
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time In Business",
        name: "timeInBusinessYears",
        // className: "col-fixed w-4rem py-0 mt-3",
        className: "ml-6 py-0 mt-5 col-fixed w-4rem white-space-nowrap",
        inputClass: "-m-2 mb-2",
        labelClass: "mt-2",
        // validators: [Validators.required, Validators.max(99)],
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Years",
        name: "year",
        className: "mt-6 col-fixed w-4rem",
      },
      {
        type: "number",
        inputType: "vertical",
        name: "timeInBusinessMonths",
        // validators: [Validators.max(11), Validators.maxLength(2)],
        // className: "col-fixed mt-3 w-4rem yearmonthClass",
        // className: "col-fixed mt-0 w-4rem yearmonthClass",

        className: "ml-3 py-2 mt-5 col-fixed w-4rem white-space-nowrap timeInBusinessMonthsClass",
        labelClass: "hidden",
        // labelClass:"mt-2",
        inputClass: "-m-2 mb-2 pt-3",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-6 col-fixed w-4rem",
      },
    ],
  };

  customerRoleData: any = [
    { label: "Borrower", value: 1 },
    { label: "Co-Borrower", value: 2 },
    { label: "Guarantor", value: 3 },
  ];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: BusinessService,
    public fb: FormBuilder,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    this.svc.data.postCacheableRoutes(["LookUpServices/CustomData"]);

    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=BusinessEntityType",
    ]);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched()
    }

    // const natureOfBusinessData = this.decodeHtmlEntities(
    //   this.baseFormData?.natureOfBusiness
    // );

    //     if (natureOfBusinessData) {
    //   natureOfBusinessData = this.decodeHtmlEntities(natureOfBusinessData);
    // } else {
    //   natureOfBusinessData = null; // ensures required validator works
    // }

    //     this.baseSvc.setBaseDealerFormData({
    //       natureOfBusiness: natureOfBusinessData,
    //     });

    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    this.customerRoleForm = this.fb.group({
      role: ["", Validators.required],
    });
    if (this.baseFormData?.role) {
      this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role);
    }

    if (this.mode == "create") {
      if (this.baseSvc.role === 1) {
        const valueToRemove = this.baseSvc.role;
        this.customerRoleData = this.customerRoleData?.filter(
          (role) => role.value !== valueToRemove
        );

        if (this.baseFormData?.customerSummary && Array.isArray(this.baseFormData.customerSummary)) {
          // Count co-borrowers (customerRole = 2)
          const coBorrowers = this.baseFormData.customerSummary.filter(
            customer => customer.customerRole === 2
          );

          if (coBorrowers.length >= 2) {
            // If 2 or more co-borrowers exist, set role to guarantor (3)
            this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role || 3);
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 3,
            });
          } else {
            // If less than 2 co-borrowers, set role to co-borrower (2)
            this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role || 2);
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 2,
            });
          }
        }

      } else {
        if (!this.baseFormData.role) {
          this.customerRoleData = this.customerRoleData?.filter(
            (role) => role.value == 1
          )
          this.customerRoleForm.controls["role"].setValue(1);
          this.baseSvc.setBaseDealerFormData({
            role: 1,
          });
        }
      }
    }

    this.customerRoleForm.valueChanges.subscribe((change) => {
      this.baseSvc.setBaseDealerFormData({
        role: change.role,
      });
    });

    // this.getProgramList();
    if (this.mode == "edit") {

      if (this.baseSvc.role === 1) {

        // this.customerRoleData = this.customerRoleData;

        // Check if customerSummary exists and is an array
        if (this.baseFormData?.customerSummary && Array.isArray(this.baseFormData.customerSummary)) {
          // Count co-borrowers (customerRole = 2)
          const coBorrowers = this.baseFormData.customerSummary.filter(
            customer => customer.customerRole === 2
          );

          if (coBorrowers.length >= 2) {
            // If 2 or more co-borrowers exist, set role to guarantor (3)
            this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role || 3);
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 3,
            });
          } else {
            // If less than 2 co-borrowers, set role to co-borrower (2)
            this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role || 2);
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 2,
            });
          }
        }
        // else {
        //   // If customerSummary doesn't exist or is empty, default to co-borrower
        //   this.customerRoleForm.controls["role"].setValue(2);
        // }
      } else {
        if (!this.baseFormData.role) {
          this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role || 1);
          this.baseSvc.setBaseDealerFormData({
            role: this.baseFormData?.role || 1,
          });
        }
      }


      this.mainForm
        ?.get("natureOfBusiness")
        .patchValue(this.baseFormData?.business?.natureOfBusiness);
      this.mainForm
        ?.get("businessDescription")
        .patchValue(
          this.baseFormData?.Business?.business?.businessDescription
        );

      if (this.baseFormData?.tempCustomerNo === this.baseFormData?.customerNo) {
        if (this.baseFormData?.tempCustomerRole) {
          this.customerRoleForm.controls["role"].setValue(this.baseFormData?.tempCustomerRole);
          // this.mainForm.get("role").setValue(this.baseFormData?.tempCustomerRole);
          this.baseSvc.setBaseDealerFormData({
            role: this.baseFormData?.tempCustomerRole
          });
        }
      }
      else {
        this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role);
      }

      // if (this.baseFormData?.role) {
      //   this.customerRoleForm.controls["role"].setValue(
      //     this.baseFormData?.role
      //   );       
      // } 
      // else {
      //   if (this.baseSvc.role === 1) {
      //     const valueToRemove = this.baseSvc.role;

      //     this.customerRoleData = this.customerRoleData.filter(
      //       (role) => role.value !== valueToRemove
      //     );
      //   }
      //   // Handle the case where customerRoles is not available, e.g., set a default value
      //   this.customerRole = null; // or some default value
      // }

    }

    this.updateList();
    this.updateValidation("onInit");
    // console.log(this.mainForm, "buseinss detail init")
  }



  // private setupTimeInBusinessValidation(): void {
  //   setTimeout(() => {
  //     const yearsControl = this.mainForm?.get('timeInBusinessYears');
  //     const monthsControl = this.mainForm?.get('timeInBusinessMonths');

  //     if (yearsControl && monthsControl) {

  //       yearsControl.valueChanges.subscribe(() => {
  //         this.validateTimeInBusiness();
  //       });

  //       monthsControl.valueChanges.subscribe(() => {
  //         this.validateTimeInBusiness();
  //       });


  //       this.validateTimeInBusiness();
  //     }
  //   }, 500);
  // }



  async updateList() {
    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=BusinessEntityType`,
      (res) => {
        if (res.data) {
          const filteredOptions = res.data
            .filter(
              (item: any) =>
                item.lookupValue &&
                !item.lookupValue.includes("Z – Not Applicable") &&
                !item.lookupValue.includes("Trust -")
            )
            .map(({ lookupValue }) => ({
              label: lookupValue,
              value: lookupValue,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));


          this.mainForm.updateList("organisationType", filteredOptions);





          return filteredOptions;
        }
      }
    );

    await this.svc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["Source of Wealth"],
        procedureName: configure?.SPPartyCfdLuExtract,
      })
      .subscribe((res) => {
        if (res) {
          const sourceOfWealthList = res?.data?.table.map((item: any) => ({
            label: item.value_text,
            value: item.value_text,
          }));

          this.mainForm.updateList("sourceOfWealth", sourceOfWealthList);
          return sourceOfWealthList;
        }
      });

    this.svc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["ANZ1993"],
        procedureName: configure?.SPIndustryTypeExtract,
      })
      .subscribe((res) => {
        if (res) {
          const natureOfBusinesslist = res?.data?.table.map((item: any) => ({
            label: item.value_text,
            value: item.value_text,
          }));


          this.mainForm.updateList("natureOfBusiness", natureOfBusinesslist);

        }
      });
  }
  private natureOfBusinessOptions: any[] = [];

  decodeHtmlEntities(value: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = value;
    return txt.value;
  }

  getvalue(value: any) {
    this.baseSvc.setBaseDealerFormData({
      role: value,
    });
  }

  override onStepChange(stepperDetails: any): void {

    super.onStepChange(stepperDetails);
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.customerRoleForm) {
        if (this.customerRoleForm.controls["role"].value === 0) {
          this.customerRoleForm.markAllAsTouched()
          formStatus = "INVALID"
        }
        else {
          formStatus = this.proceedEmailForm();
        }
        // formStatus = this.proceedEmailForm();
        this.baseSvc.formStatusArr.push(formStatus);
      }
    }

    this.baseSvc.updateComponentStatus("Business Details", "BusinessDetailsComponent", (this.mainForm.form.valid && this?.customerRoleForm?.controls["role"].value !== 0))

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
  }
  override onFormDataUpdate(res: any): void { }
  proceedEmailForm() {
    const postData = this.validateEmailData();
    return postData; //valid , invalid
  }
  validateEmailData() {
    // Iterate over the controls within the form
    Object.values(this.customerRoleForm.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    // Check if the form is invalid using the 'status' property
    if (this.customerRoleForm.status === "INVALID") {
      this.svc?.ui?.showError("Please complete the form before submitting");
      // Optionally return false to prevent further actions
      // return false;
    }

    return this.customerRoleForm.status;
  }

  pageCode: string = "BusinessComponent";
  modelName: string = "BusinessDetailsComponent";

  override async onFormEvent(event: any): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormEvent(event?.target?.value || event);
  }

  override async onFormReady(): Promise<void> {


    if (this.customerRoleForm && this.baseSvc.showValidationMessage) {
      if (this.customerRoleForm.controls["role"].value === 0) {
        this.customerRoleForm.markAllAsTouched();
      }
    }

    if (this.baseFormData?.natureOfBusiness) {
      const natureOfBusinessData = this.decodeHtmlEntities(
        this.baseFormData?.natureOfBusiness
      );

      this.baseSvc.setBaseDealerFormData({
        natureOfBusiness: natureOfBusinessData,
      });

      this.mainForm
        .get("natureOfBusiness")
        .patchValue(this.decodeHtmlEntities(this.baseFormData?.natureOfBusiness));
    }
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {

    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {

    await this.updateValidation(event?.target?.value || event);
  }

  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }

  async updateValidation(event) {
    const value = event?.target?.value ?? event;
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: value,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    const responses = await this.validationSvc?.updateValidation(req);
    if (!responses?.status && responses?.updatedFields?.length) {
      await this.mainForm?.applyValidationUpdates(responses);
    }

    this.mainForm.get("tradingName").removeValidators(Validators?.required);


    return responses.status;
  }

  // override async onStepChange(quotesDetails: any): Promise<void> {
  //   if (quotesDetails.type !== 'tabNav') {
  //     var result: any = await this.updateValidation('onSubmit');
  //     if (!result?.status) {
  //       this.toasterSvc.showToaster({
  //         severity: 'error',
  //         detail: 'I7',
  //       });
  //     }
  //   }
  // }
}
