import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { ActivatedRoute } from "@angular/router";
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { StandardQuoteService } from "../../../../standard-quote/services/standard-quote.service";

@Component({
  selector: "app-sole-trade-personal-detail",

  templateUrl: "./sole-trade-personal-detail.component.html",
  styleUrl: "./sole-trade-personal-detail.component.scss",
})
export class SoleTradePersonalDetailComponent extends BaseSoleTradeClass {
  private maritalStatusOptions: any[] = [];
  //   optionsdata: any[] = ["aa"];
  //   privousChecked: any;
  //   borrowedAmount: any;
  //   customerRoleForm: FormGroup;
  //   constructor(
  //     public override route: ActivatedRoute,
  //     public override svc: CommonService,
  //     public override baseSvc: SoleTradeService
  //   ) {
  //     super(route, svc, baseSvc);
  //   }
  //   override formConfig: GenericFormConfig = {
  //     headerTitle: "Personal Details",
  //     autoResponsive: true,
  //     api: "",
  //     goBackRoute: "",
  //     fields: [
  //       {
  //         type: "select",
  //         label: "Title",
  //         name: "title",
  //         cols: 2,
  //         options: [
  //           { label: "Mr", value: "Mr" },
  //           { label: "Mrs", value: "Mrs" },
  //           { label: "Dr", value: "Dr" },
  //           { label: "Miss", value: "Miss" },
  //         ],
  //         //validators: [validators.required],
  //       },
  //       {
  //         type: "text",
  //         label: "First Name",
  //         name: "firstName",
  //         cols: 2,
  //         //validators: [validators.required, validators.pattern("^[A-Za-z-]+$")],
  //       },

  //       {
  //         type: "text",
  //         label: "Middle Name(s)",
  //         name: "middleName",
  //         cols: 2,
  //       },
  //       {
  //         type: "text",
  //         label: "Last Name",
  //         name: "lastName",
  //         cols: 2,
  //         //validators: [validators.required, validators.pattern("^[A-Za-z-]+$")],
  //       },

  //       {
  //         type: "text",
  //         label: "known As",
  //         name: "knownAs",
  //         cols: 2,
  //         nextLine: true,
  //       },

  //       {
  //         type: "select",
  //         label: "Gender",
  //         name: "gender",
  //         cols: 2,
  //         // options: [
  //         //   { label: "Male", value: "Male" },
  //         //   { label: "Female", value: "Female" },
  //         // ],
  //         list$: "LookUpServices/lookups?LookupSetName=Gender",
  //         idKey: "lookupValue",
  //         idName: "lookupValue",
  //         className: "mt-4",
  //         filter: true,
  //         excludeValues:['Z - Not Applicable']
  //         //validators: [validators.required],
  //       },

  //       {
  //         type: "date",
  //         label: "Date Of Birth",
  //         name: "dateOfBirth",
  //         cols: 2,
  //         //validators: [validators.required],
  //       },
  //       {
  //         type: "select",
  //         label: "Marriatal Status",
  //        name: "maritalStatus",
  //         cols: 2,
  //        list$: "LookUpServices/lookups?LookupSetName=MaritalStatus",
  //         idKey: "lookupValue",
  //         idName: "lookupValue",
  //         filter: true,

  //         //validators: [validators.required],
  //       },

  //       {
  //         type: "select",
  //         label: "No Of Dependents",
  //         name: "noOfDependents",
  //         cols: 2,
  //         options: [
  //           { label: "0", value: 0 },
  //           { label: "1", value: 1 },
  //           { label: "2", value: 2 },
  //           { label: "3", value: 3 },
  //           { label: "4", value: 4 },
  //           { label: "5", value: 5 },
  //           { label: "6", value: 6 },
  //           { label: "7", value: 7 },
  //           { label: "8", value: 8 },
  //           { label: "9", value: 9 },
  //         ],
  //         //validators: [validators.required],
  //       },
  //       {
  //         type: "array",
  //         name: "noOfDependentArr",
  //         isTemplateFormData: false,
  //         isDelete: false,
  //         label: "Dependents Age(in years)",

  //         isAdd: false,
  //         fields: [
  //           {
  //             type: "text",
  //             name: "age",
  //           },
  //         ],
  //         templateFormFields: [],
  //       },
  //     ],
  //   };

  //    override async ngOnInit(): Promise<void> {
  //     await super.ngOnInit();
  //      let params: any = this.route.snapshot.params;
  //         this.mode = params.mode || Mode.create;
  //     console.log("mainForm",this.mainForm)
  //     console.log("baseFormData",this.baseFormData)

  //     // if (this.mode == "create") {

  //     //   if (this.baseSvc.role === 1) {
  //     //     const valueToRemove = this.baseSvc.role;
  //     //     this.customerRoleData = this.customerRoleData.filter(
  //     //       (role) => role.value !== valueToRemove
  //     //     );
  //     //   }
  //     //   else{
  //     //     if(!this.baseFormData.role){
  //     //       this.customerRoleForm.controls["role"].setValue(1);
  //     //       this.baseSvc.setBaseDealerFormData({
  //     //       role : 1
  //     //      })
  //     //     }
  //     //   }

  //     // }
  //   }
  //   override async onSuccess(data: any) {}

  //   clearFormArray() {
  //     const formArray = this.mainForm.getArrayControls("noOfDependentArr");

  //     // Clear the controls
  //     formArray.clear();

  //     // Alternatively, you can set it to an empty array directly if you prefer
  //     //formArray.setValue([]);
  //   }

  //    override async onFormReady(): Promise<void> {
  //     super.onFormReady();
  //      console.log("mainForm",this.mainForm)
  //     console.log("baseFormData",this.baseFormData)
  //   }
  //   previousDropdownValue: number | null = null;

  //   override onFormEvent(event: any): void {
  //     //this.clearFormArray();

  //     if (event.name === "noOfDependents") {
  //       // Check if the dropdown value has changed
  //       if (event.value !== this.previousDropdownValue) {
  //         // Update the previous value to the current value
  //         this.previousDropdownValue = event.value;

  //         // Clear the FormArray
  //         this.clearFormArray();

  //         // Add new controls based on the new dropdown value
  //         for (let i = 0; i < event.value; i++) {
  //           this.mainForm.addArrayControls("noOfDependentArr");
  //         }
  //       }
  //     }
  //     super.onFormEvent(event);
  //   }
  // }

  customerRole: any;
  date = new Date();
  allowedDate = new Date(
    this.date.getMonth() +
      1 +
      "/" +
      this.date.getDate() +
      "/" +
      (this.date.getFullYear() - 18)
  );
  customerRoleForm: FormGroup;
  override mode: any;
  custRole: any;
  value: any;

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
        // list$: "LookUpServices/lookups?LookupSetName=Title",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        alignmentType: "vertical",
        labelClass: " ic",
       
        className:"py-0",

        // validators: [Validators.required], //validation comment
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
        // validators: [Validators.required],//validation comment
      },

      {
        type: "name",
        label: "Middle Name(s)",
        name: "middleName",
        // regexPattern: "[^a-zA-Z]*",
        maxLength: 20,
        cols: 2,
        inputType: "vertical",
        className: "mr-3",
      },
      {
        type: "name",
        label: "Last Name",
        name: "lastName",
        // regexPattern: "[^a-zA-Z]*",
        maxLength: 20,
        cols: 2,
        inputType: "vertical",
        className: "mr-3",
        // validators: [Validators.required],//validation comment
      },

      {
        type: "text",
        label: "Known As",
        name: "knownAs",
        cols: 2,
        nextLine: true,
        // regexPattern: "[^a-zA-Z]",
        
        inputType: "vertical",
        className: "mr-3",
      },

      {
        type: "select",
        label: "Gender",
        name: "gender",
        cols: 2,
        // list$: "LookUpServices/lookups?LookupSetName=Gender",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        // className: "mt-4",
        filter: true,
        excludeValues: ["Z - Not Applicable"],
        alignmentType: "vertical",
        labelClass: "-mt-3",
        // validators: [Validators.required], //validation comment
      },

      {
        type: "date",
        label: "Date of Birth",
        name: "dateOfBirth",
        cols: 2,
        // className: "mt-4",
        className: "mr-3",
        // validators: [this.baseSvc.pastDateValidator(), Validators.required],
        //errorMessage: "Birth date must not be a current  date",
        // maxDate: this.allowedDate,
        maxDate: new Date(),
        // defaultDate: this.allowedDate,
        inputType: "vertical",
      },
      {
        type: "select",
        label: "Marital Status",
        name: "maritalStatus",
        cols: 2,
        // className: "mt-4",
        labelClass: "-mt-3",
        // list$: "LookUpServices/lookups?LookupSetName=MaritalStatus",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        filter: true,
        alignmentType: "vertical",

        // validators: [Validators.required], //validation comment
      },
      {
        type: "select",
        label: "No. of Dependants",
        alignmentType: "vertical",
        name: "noOfDependents",
        cols: 1,
        // className: "my-2",
        // labelClass: "-my-3",
        labelClass: "-my-3 -mt-3",
        filter: true,
        options: [
          { label: "0", value: "0" },
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
          { label: "6", value: "6" },
          { label: "7", value: "7" },
          { label: "8", value: "8" },
          { label: "9", value: "9" },
        ],
        // validators: [Validators.required], //validation comment
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "(if none enter 0)",
        name: "",
        className: "mx-1 mt-5 white-space-nowrap",
      },
      {
        type: "array",
        name: "noOfDependentArr",
        isTemplateFormData: false,
        isDelete: false,
        isAdd: false,
        hidden: true,
        // validators: [Validators.min(0), Validators.pattern(/^[0-9]{1,2}$/)], // Ensures array is valid
        label: "Dependants Age (in Years)",
        // className: "-mt-0",
        fields: [
          {
            type: "number",
            name: "age",
            maxLength: 2,
            min: 1,
            className: "mt-3 dependents-age-array",
            // default:0,
            errorMessage: "Dependants Ages is in an incorrect format.",
           validators: [Validators.min(0), Validators.pattern(/^[0-9]{1,2}$/),Validators.required], // Prevents negative values
          },
        ],
        templateFormFields: [],
      },
    ],
  };
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    // Inject DatePipe
    public standardQuoteSvc: StandardQuoteService,
    public cdr: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=Title",
      "LookUpServices/lookups?LookupSetName=Gender",
      "LookUpServices/lookups?LookupSetName=MaritalStatus",
    ]);
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

    if(this.baseSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }

    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    await this.updateValidation("onInit");

    this.mainForm?.form.valueChanges.subscribe((value) => {
      // console.log(value);
      this.baseSvc.setBaseDealerFormData({
        dependentsAge: value.noOfDependentArr?.map((item: any) => item.age),
      });
      //  console.log(this.baseFormData.dependentsAge);
    });

    if (this.baseFormData?.dependentsAge) {
      const dependentsAge = this.baseFormData?.dependentsAge || ""; // Fallback if undefined
      // Split by ',' and trim each value to handle spaces
      const dependentsArray = dependentsAge
      .split(",")
      .map((age) => ({ age: age.trim() }));

      // Get the actual FormArray, not its value
      const formArray = this.mainForm?.get(
        "noOfDependentArr"
      ) as unknown as FormArray;

      if (formArray) {
        // Adjust the number of controls in the FormArray
        while (formArray.length < dependentsArray.length) {
          // formArray.push(new FormGroup({ age: new FormControl("") }));
          formArray.push(this.createDependentFormGroup());
          // this.mainForm.form.markAllAsTouched()
        }
        while (formArray.length > dependentsArray.length) {
          formArray.removeAt(formArray.length - 1);
        }

        // Patch the values
        formArray.patchValue(dependentsArray);
      }

      await this.updateValidation("onInit");
    }
    this.updatedropdowndata();
    this.setupMaritalStatusValueChange();
  }


private sortMaritalStatusOptions(options: any[], selectedValue: string | null): any[] {
  if (!selectedValue) {
    
    return [...options].sort((a, b) => 
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
  }

  
  const selectedOption = options.find(opt => opt.value === selectedValue);
  
  if (!selectedOption) {
   
    return [...options].sort((a, b) => 
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
  }

  
  const remainingOptions = options
    .filter(opt => opt.value !== selectedValue)
    .sort((a, b) => 
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );

  
  return [selectedOption, ...remainingOptions];
}
  async updatedropdowndata() {
    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=Title`,
      (res) => {
        let list = res.data;

        const titleList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));

        this.mainForm.updateList("title", titleList);
        titleList?.sort((a, b) => a?.label?.localeCompare(b?.label));

        return titleList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=Gender`,
      (res) => {
        let list = res.data;
 const filteredList = list.filter(item => 
        !item.lookupValue.includes("Z - Not Applicable") && 
        !item.lookupValue.includes("Z-Not Applicable")
      );
        const genderList = filteredList.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        genderList?.sort((a, b) => a?.label?.localeCompare(b?.label));

        this.mainForm.updateList("gender", genderList);

        return genderList;
      }
    );

   await this.baseSvc.getFormData(
    `LookUpServices/lookups?LookupSetName=MaritalStatus`,
    (res) => {
      let list = res.data;

      const maritalStatusList = list.map((item) => ({
        label: item.lookupValue,
        value: item.lookupValue,
      }));

      
      this.maritalStatusOptions = maritalStatusList;

    
      const selectedValue = this.mainForm?.form?.get('maritalStatus')?.value;
      
      
      const sortedList = this.sortMaritalStatusOptions(maritalStatusList, selectedValue);

      this.mainForm.updateList("maritalStatus", sortedList);
      return sortedList;
    }
  );
}
private setupMaritalStatusValueChange(): void {
  setTimeout(() => {
    this.mainForm?.form?.get('maritalStatus')?.valueChanges.subscribe((selectedValue) => {
      if (this.maritalStatusOptions.length > 0) {
        const sortedList = this.sortMaritalStatusOptions(
          this.maritalStatusOptions, 
          selectedValue
        );
        this.mainForm.updateList("maritalStatus", sortedList);
      }
    });
  }, 500);
}
  override clearSearchFilter(dropdown: any) {
    super.clearSearchFilter(dropdown);
  }
  customerRoleData: any = [
    { label: "Borrower", value: 1 },
    { label: "Co-Borrower", value: 2 },
    { label: "Guarantor", value: 3 },
  ];
  clearFormArray() {
    const formArray = this.mainForm.getArrayControls("noOfDependentArr");

    // Clear the controls
    formArray.clear();

    // Alternatively, you can set it to an empty array directly if you prefer
    //formArray.setValue([]);
  }

  previousDropdownValue: number | null = null;

  override onFormEvent(event: any): void {
    if (event.name === "noOfDependents") {
      // Check if the dropdown value has changed
      if (event.value !== this.previousDropdownValue) {
        // Show or hide the array based on the dropdown value
        event.value === "0" || event.value === 0 || !event.value
          ? this.mainForm.updateHidden({ noOfDependentArr: true })
          : this.mainForm.updateHidden({ noOfDependentArr: false });

        // Update the previous value to the current values
        this.previousDropdownValue = event.value;

        // Access the FormArray
        const noOfDependentArr = this.mainForm.get(
          "noOfDependentArr"
        ) as unknown as FormArray;

        // Clear the array if the value is 0 or null
        if (event.value === 0 || !event.value) {
          noOfDependentArr.clear(); // Clears all controls in the array
        } else {
          const currentArrayLength = noOfDependentArr.length;

          // Add or remove controls based on the difference in value
          if (event.value > currentArrayLength) {
            for (let i = currentArrayLength; i < event.value; i++) {
              noOfDependentArr.push(this.createDependentFormGroup());
            }
          } else if (event.value < currentArrayLength) {
            for (let i = currentArrayLength - 1; i >= event.value; i--) {
              noOfDependentArr.removeAt(i); // Removes a control at the specified index
            }
          }

          // After adjusting the array length, check for null values and set them to 0
          // for (let i = 0; i < noOfDependentArr.length; i++) {
          //   const control = noOfDependentArr.at(i);
          //   if (control.get("age")?.value === null) {
          //     control.get("age")?.setValue(0);
          //   }
          // }
        }
      }
    }
    super.onFormEvent(event);
  }

override async onValueTyped(event: any) {
  if (event.name === "dateOfBirth") {
      // this.mainForm.get("dateOfBirth").patchValue(new Date(event.data));
      // this.ValidateDoB();
      //   // Continue with any other validation logic
    await this.updateValidation("blur");
  }

    await this.updateValidation(event);
}

  private createDependentFormGroup(): FormGroup {
    return new FormGroup({
      age: new FormControl(null, [
        Validators.required, // Ensure the field is required
        Validators.min(0), // Ensure no negative values
        Validators.pattern(/^[0-9]{1,2}$/), // Only 1-2 digit positive numbers
      ]),
    });
  }

  getvalue(value: any) {
    this.baseSvc.setBaseDealerFormData({
      role: value,
    });
  }
  override async onStepChange(stepperDetails: any): Promise<void> {
    console.log(this.mainForm.form.valid);
    super.onStepChange(stepperDetails);
    if (stepperDetails?.validate) {
      //  this.mainForm.form.markAllAsTouched();
      let formStatus;
      if (this.customerRoleForm) {
        // formStatus = this.proceedEmailForm();
        // this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    if (stepperDetails?.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      // if (!result.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }
    // super.onStepChange(stepperDetails);

  this.baseSvc.updateComponentStatus("Business Individual", "SoleTradePersonalDetailComponent", this.mainForm.form.valid)

  if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
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
      //  return false;
    }

    return this.customerRoleForm.status;
  }

  // pageCode: string = "IndividualComponent";
  // modelName: string = "PersonalDetailsComponent";
  pageCode: string = "SoleTradeComponent";
  modelName: string = "SoleTradePersonalDetailsComponent";

  override async onFormReady(): Promise<void> {
    // this.mainForm.form.markAllAsTouched();
    if (this.mode === "edit" && this.baseFormData?.personalDetails) {
      // Bind regular fields
      this.mainForm.form.patchValue({
        ...this.baseFormData.personalDetails,
      });
    }
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    // await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
    super.onValueEvent(event);
  }

  private previousDependants: { age: number | null }[] = [];

  override async onValueChanges(event: any): Promise<void> {

  const newValues = (event?.noOfDependentArr || []) as { age: number | null }[];

  if (!newValues || !Array.isArray(newValues) || newValues.length === 0) {
    this.previousDependants = [];
    await super.onValueChanges(event);
    return;
  }
  const arr = this.mainForm.form.get("noOfDependentArr") as FormArray | null;

  if (arr) {
    let changedIndex = -1;

    for (let i = 0; i < newValues.length; i++) {
      const prevAge = this.previousDependants?.[i]?.age ?? null;
      const currAge = newValues[i]?.age ?? null;

      if (prevAge !== currAge) {
        changedIndex = i;
        break;
      }
    }

    if (changedIndex > -1 && arr.at(changedIndex)) {
      const group = arr.at(changedIndex) as FormGroup;
      const ageCtrl = group.get("age");

      if (ageCtrl) {
        ageCtrl.markAsDirty();
        ageCtrl.markAsTouched();
        ageCtrl.updateValueAndValidity({ emitEvent: false });
      }
    }
  }
  this.previousDependants = newValues.map(v => ({ age: v?.age ?? null }));

  await super.onValueChanges(event);
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
}
