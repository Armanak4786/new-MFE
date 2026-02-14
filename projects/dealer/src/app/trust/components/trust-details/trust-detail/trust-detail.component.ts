import { Component } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { TrustService } from "../../../services/trust.service";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../../standard-quote/services/standard-quote.service";
import configure from "src/assets/configure.json";
import { BusinessService } from "../../../../business/services/business";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-trust-detail",

  templateUrl: "./trust-detail.component.html",
  styleUrl: "./trust-detail.component.scss",
})
export class TrustDetailComponent extends BaseTrustClass {
  customerRoleForm: FormGroup;
private primaryNatureTrustOptions: any[] = [];
  customerRoleData: any = [
    { label: "Borrower", value: 1 },
    { label: "Co-Borrower", value: 2 },
    { label: "Guarantor", value: 3 },
  ];

  override formConfig: GenericFormConfig = {
    headerTitle: "Trust Details",
    autoResponsive: true,
    api: "trustAddress",
    goBackRoute: "trustAddress",
    //cardBgColor: "--background-color-secondary",
    cardType: "border",
    fields: [
      {
        type: "select",
        label: "Trust Type ",
        name: "trustType",
        cols: 2,
        className: "mt-0 mr-2 pt-1",
        //Validators: [Validators.required],
        nextLine: false,
        options:[],
        filter: true,
        alignmentType: "vertical",
        labelClass: " mn -mt-3 py-1",
        // list$: "LookUpServices/lookups?LookupSetName=BusinessEntityType",
        // idKey: "lookupValue",
        // idName: "lookupValue",
      },
      {
        type: "text",
        label: "Trust Name ",
        name: "trustName",
        cols: 2,
        //regexPattern: "[^a-zA-Z ]*",
        maxLength: 100,
        //Validators: [Validators.required],
        nextLine: false,
        inputType: "vertical",
        // className: "mt-2 mr-1",
        className: "mr-3",
      },
      {
        type: "text",
        label: "Trading Name ",
        name: "trustTradingName",
        cols: 2,
        //regexPattern: "[^a-zA-Z ]*",
        maxLength: 100,
        //Validators: [Validators.required],
        nextLine: false,
        inputType: "vertical",
        // className: "mt-2 mr-1",
        className: "mr-3",
      },
      {
        type: "text",
        label: "Registered Number ",
        name: "trustRegNum",
        cols: 2,
        maxLength: 15,
        //regexPattern: "[^a-zA-Z0-9]*",
        //Validators: [Validators.required],
        nextLine: false,
        inputType: "vertical",
        // className: "mt-2 mr-1",
        className: "mr-3",
      },
      {
        type: "text",
        label: "GST Number ",
        name: "taxNumber",
        cols: 2,
        //regexPattern: "[^a-zA-Z0-9]*",
        maxLength: 15,
        //Validators: [Validators.required],
        nextLine: true,
        inputType: "vertical",
        // className: "mt-2 -mx-1",
        className: "mr-3",
      },
      {
        type: "textArea",
        label: "Trust Purpose",
        name: "trustPurpose",
        inputType: "vertical",
        textAreaType: "border",
        //regexPattern: "/[^.?!]/",
        //Validators: [Validators.required],
        cols: 2,
        // placeholder: "Enter a brief description of the purpose of the trust",
        // textAreaRows: 2,
        // className: "col col-4 mr-5 ml-1 mt-3 ng-star-inserted ",
        className: "mt-3 pr-2",
        labelClass: "mb-1",
      },
      {
        type: "select",
        label: "Primary Nature of Trust",
        name: "primaryNatureTrust",
        alignmentType: "vertical",
        filter: true,
        // list$: "LookUpServices/CustomData",
        // apiRequest: {
        //   parameterValues: ["ANZ1993"],
        //   procedureName: configure.SPIndustryTypeExtract,
        // },
        // idKey: "value_text",
        // idName: "value_text",
        options:[],
        //Validators: [Validators.required],
        cols: 4,
        // className: "col-2 -mx-4 mt-3 px-2 py-3 ng-star-inserted",
        // labelClass: '-mt-3',
        className: "primary-nature-of-trust col-2 px-2 mt-2 ml-2",
        labelClass: "mb-1",
      },

      {
        type: "select",
        label: "Source of Wealth",
        name: "sourceOfWealth",
        filter: true,
        className: "source-of-wealth col-3 mt-2 px-2 ml-2",
        labelClass: "mb-1",
        list$: "LookUpServices/CustomData",
        apiRequest: {
          parameterValues: ["Source Of Wealth"],
          procedureName: configure.SPPartyCfdLuExtract,
        },
        idKey: "value_text",
        idName: "value_text",
        cols: 2,
        alignmentType: "vertical",
      },

      {
        type: "select",
        label: "Total Assets",
        name: "totalAssets",
        filter: true,

        className: "col-3 mt-2 px-2 ml-2",
        labelClass: "mb-1",
        alignmentType: "vertical",

        options: [
          { label: "Up to $5,000,000", value: "1. Up to $5 Million" },
          {
            label: "$5,000,000 to $20,000,000",
            value: "2. $5M to $20 Million",
          },
          { label: "Over $20,000,000", value: "3. Over $20 Million" },
          { label: "Unknown", value: "4. Unknown" },
        ],
        cols: 2,
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time In Trust",
        name: "timeInTrustYears",
        // className: "col-fixed w-3rem mt-3 py-0",
        className:
          "mt-4 mx-1 px-2 py-0 col-fixed w-5rem white-space-nowrap",
        inputClass: "mx-2 pb-0 pt-2 mb-1 ",
        labelClass: "mr-0 -my-0 required ",

        //Validators: [Validators.required, Validators.max(99)],
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Years",
        name: "year",
        // className: "-mx-3 col col-fixed mr-1 mt-4 ng-star-inserted pt-3 w-3rem",
        className: "-mx-1  mr-1 mt-6 col-fixed pt-3 w-5rem",
      },
      {
        type: "number",
        inputType: "vertical",
        name: "timeInTrustMonths",
        //Validators: [Validators.max(11), Validators.maxLength(2)],
        className: "-mx-2 mt-3 p-1 py-0  col-fixed w-5rem",
        inputClass: "mx-2 mt-5 pt-2 mb-1 ",
        // // labelClass: "mx-2 my-1",
        labelClass: "mr-0 ",

        errorMessage: "Value should be less than 12",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "col mt-5 -mx-1 pt-5 col-fixed w-3rem",
      },
    ],
  };
  customerRole: null;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override trustSvc: TrustService,
    public fb: FormBuilder,
    public basesvc: BusinessService,
    private toasterService: ToasterService,
    public validationSvc: ValidationService,
    public stdsvc: StandardQuoteService
  ) {
    super(route, svc, trustSvc);
    this.svc.data.postCacheableRoutes(["LookUpServices/CustomData"]);

    this.trustSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=BusinessEntityType",
    ]);
    this.customerRoleForm = this.fb.group({
      role: ["", Validators.required],
    });
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
     if (
      (portalWorkflowStatus != 'Open Quote') || (
    this.baseFormData?.AFworkflowStatus &&
    this.baseFormData.AFworkflowStatus !== 'Quote'
    ) )
    {
    this.mainForm?.form?.disable();
    }
    else{ this.mainForm?.form?.enable();}
    
    if(this.trustSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }

    this.stdsvc.getBaseDealerFormData().subscribe((data) => {
      // this.baseFormData = data.purposeofLoan;
      this.trustSvc.setBaseDealerFormData({
        loanPurpose: data.purposeofLoan,
      });
    });
    // const natureOfTrustData = this.decodeHtmlEntities(
    //   this.baseFormData?.primaryNatureTrust
    // );
    // this.trustSvc.setBaseDealerFormData({
    //   primaryNatureTrust: natureOfTrustData,
    // });

    // this.mainForm
    //   .get("primaryNatureTrust")
    //   .patchValue(
    //     this.decodeHtmlEntities(this.baseFormData?.primaryNatureTrust)
    //   );

    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    this.customerRoleForm = this.fb.group({
      role: ["", Validators.required],
    });
    if (this.baseFormData?.role) {
      this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role);
    }
    if (this.mode == "create") {
      if (this.trustSvc.role === 1) {
        const valueToRemove = this.trustSvc.role;
        this.customerRoleData = this.customerRoleData.filter(
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
            (role)=>role.value == 1
          )
          this.customerRoleForm.controls["role"].setValue(1);
          this.trustSvc.setBaseDealerFormData({
            role: 1,
          });
        }
      }
    }

    this.customerRoleForm.valueChanges.subscribe((change) => {
      this.trustSvc.setBaseDealerFormData({
        role: change.role,
      });
    });

    // this.getProgramList();
    if (this.mode == "edit") {

      if (this.trustSvc.role === 1) {
         
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
      
      // if (this.baseFormData?.role) {
      //   this.customerRoleForm.controls["role"].setValue(
      //     this.baseFormData?.role
      //   );
      // } else {
      //   if (this.trustSvc.role === 1) {
      //     const valueToRemove = this.trustSvc.role;

      //     this.customerRoleData = this.customerRoleData.filter(
      //       (role) => role.value !== valueToRemove
      //     );
      //   }
      //   // Handle the case where customerRoles is not available, e.g., set a default value
      //   this.customerRole = null; // or some default value
      // }

       if(this.baseFormData?.tempCustomerNo === this.baseFormData?.customerNo ){
          if(this.baseFormData?.tempCustomerRole){
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
    }
    
    await this.updateList()
  }


  async updateList() {
  await this.trustSvc.getFormData(
    `LookUpServices/lookups?LookupSetName=BusinessEntityType`,
    (res) => {
      if (res.data) {
        const filteredOptions = res.data
          .filter(
            (item: any) =>
              item.lookupValue &&
              !item.lookupValue.includes("Z – Not Applicable") &&
              item.lookupValue.includes("Trust -")
          )
          .map(({ lookupValue }) => ({
            label: lookupValue,
            value: lookupValue,
          }));

        this.mainForm.updateList("trustType", filteredOptions);
        filteredOptions?.sort((a, b) => a?.label?.localeCompare(b?.label));
        return filteredOptions;
      }
    }
  );
  
  this.svc.data
    .post("LookUpServices/CustomData", {
      parameterValues: ["ANZ1993"],
      procedureName: configure.SPIndustryTypeExtract,
    })
    .subscribe((res) => {
      if (res?.data?.table) {
        const natureOfTrustList = res.data.table.map((item: any) => ({
          label: item.value_text,
          value: item.value_text,
        }));

        // Store the options for later use
        this.primaryNatureTrustOptions = natureOfTrustList;

       this.mainForm.updateList("primaryNatureTrust", natureOfTrustList);

      }
    });
}


  decodeHtmlEntities(value: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = value;
    return txt.value;
  }

  get filteredCustomerRoles() {
    return this.baseFormData?.loanPurpose !== configure?.LoanPurpose
      ? this.customerRoleData
      : this.customerRoleData.filter((item) => item.value === 3);
  }

  getvalue(value: any) {
    this.trustSvc.setBaseDealerFormData({
      role: value,
    });
  }
  override onStepChange(stepperDetails: any): void {
    // console.log("onStepChange", stepperDetails.validate);
    // console.log("onStepChange", stepperDetails);
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.customerRoleForm) {
        if(this.customerRoleForm.controls["role"].value === 0){
          this.customerRoleForm.markAllAsTouched()
          formStatus = "INVALID"
        }
        else{
          formStatus = this.proceedEmailForm();
        }
        // formStatus = this.proceedEmailForm();
        this.trustSvc.formStatusArr.push(formStatus);
      }
    }
    super.onStepChange(stepperDetails);

    this.trustSvc.updateComponentStatus("Trust Details", "TrustDetailComponent", (this.mainForm.form.valid && this.customerRoleForm.controls["role"].value !== 0))

    if(this.trustSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.trustSvc.iconfirmCheckbox.next(invalidPages)
    }
  }
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

  pageCode: string = "TrustComponent";
  modelName: string = "TrustDetailComponent";

  override async onFormReady(): Promise<void> {
     if (this.customerRoleForm && this.trustSvc.showValidationMessage) {
        if(this.customerRoleForm.controls["role"].value === 0){
          this.customerRoleForm.markAllAsTouched();
        }
      }

       if(this.baseFormData?.primaryNatureTrust){
        const natureOfTrustData = this.decodeHtmlEntities(
          this.baseFormData?.primaryNatureTrust
        );

       this.trustSvc.setBaseDealerFormData({
          primaryNatureTrust: natureOfTrustData,
        });

        this.mainForm
      .get("primaryNatureTrust")
      .patchValue(
        this.decodeHtmlEntities(this.baseFormData?.primaryNatureTrust)
      );
      }
    await this.updateValidation("onInit");
    // super.onFormReady();

    this.mainForm.updateProps("primaryNatureTrust", {
          errorMessage:
            "Primary Nature of Trust is required.",
        });
  }

  override async onBlurEvent(event): Promise<void> {
    
    await this.updateValidation(event);
    this.checkTimeinTrust();
  }

  override async onValueEvent(event): Promise<void> {

    await this.updateValidation(event);
    this.checkTimeinTrust();
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

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }
  checkTimeinTrust(): void {
    const yCtrl = this.mainForm.get("timeInTrustYears");
    const mCtrl = this.mainForm.get("timeInTrustMonths");
    const yearValue = yCtrl?.value;
    const monthValue = mCtrl?.value;
    if (yearValue == 0 && monthValue == 0) {
      yCtrl?.setErrors({ required: true });
      mCtrl?.setErrors({ required: true });
    } 
  } 
}
