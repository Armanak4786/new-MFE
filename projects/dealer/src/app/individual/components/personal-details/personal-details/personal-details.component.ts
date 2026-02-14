import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { StandardQuoteService } from "../../../../standard-quote/services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-personal-details",

  templateUrl: "./personal-details.component.html",
  styleUrl: "./personal-details.component.scss",
  providers: [DatePipe], // Add DatePipe to providers
})
export class PersonalDetailsComponent extends BaseIndividualClass {
  customerRole: any;
  private maritalStatusOptions: any[] = [];
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
    //cardBgColor: "--background-color-secondary",
    cardType: "border",

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
        labelClass: " -mt-3",
        inputClass: " -mt-1",
        className: " -mt-1",

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
        // labelClass: "tab mr-1"
        // validators: [Validators.required],
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
        // maxLength: 20,
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
        labelClass: "-mt-3",
        filter: true,
        excludeValues: ["Z - Not Applicable"],
        alignmentType: "vertical",

        // validators: [Validators.required], //validation comment
      },

      {
        type: "date",
        label: "Date of Birth",
        name: "dateOfBirth",
        cols: 2,

        className: "mr-3",
        // validators: [this.baseSvc.pastDateValidator(), Validators.required],
        //errorMessage: "Birth date must not be a current  date",
        // maxDate: this.allowedDate,
        // maxDate: new Date(),
        // maxDate: this.allowedDate,
        defaultDate: this.allowedDate,
        inputType: "vertical",
      },
      {
        type: "select",
        label: "Marital Status",
        name: "maritalStatus",
        cols: 2,

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
        className: "mx-1 mt-5 white-space-nowrap ",
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

        fields: [
          {
            type: "number",
            name: "age",
            maxLength: 2,
            min: 1,
            className: "dependents-age-array",
            // default:0,
            errorMessage: "Dependants Ages is in an incorrect format.",
            validators: [
              Validators.min(0),
              Validators.pattern(/^[0-9]{1,2}$/),
              Validators.required,
            ], // Prevents negative values
          },
        ],
        templateFormFields: [],
      },
    ],
  };
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
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
    // this.checkStepValidity()
    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }

    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;
    await this.updateValidation("onInit");

    this.customerRoleForm = this.fb.group({
      role: ["", Validators.required],
    });
    if (this.mode == "create") {
      if (this.baseSvc.role === 1) {
        const valueToRemove = this.baseSvc.role;
        this.customerRoleData = this.customerRoleData.filter(
          (role) => role.value !== valueToRemove
        );

        if (
          this.baseFormData?.customerSummary &&
          Array.isArray(this.baseFormData.customerSummary)
        ) {
          // Count co-borrowers (customerRole = 2)
          const coBorrowers = this.baseFormData.customerSummary.filter(
            (customer) => customer.customerRole === 2
          );

          if (coBorrowers.length >= 2) {
            // If 2 or more co-borrowers exist, set role to guarantor (3)
            this.customerRoleForm.controls["role"].setValue(
              this.baseFormData?.role || 3
            );
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 3,
            });
          } else {
            // If less than 2 co-borrowers, set role to co-borrower (2)
            this.customerRoleForm.controls["role"].setValue(
              this.baseFormData?.role || 2
            );
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 2,
            });
          }
        }
      } else {
        if (!this.baseFormData.role) {
          this.customerRoleData = this.customerRoleData.filter(
            (role) => role.value == 1
          );
          this.customerRoleForm.controls["role"].setValue(1);
          this.baseSvc.setBaseDealerFormData({
            role: 1,
          });
        }
      }
    }

    // if (this.mode == "edit") {
    //   if (this.baseSvc.role === 1) {
    //     console.log(this.baseFormData, "When borrower already exist")
    //     this.baseFormData?.customerSummary
    //     // const valueToRemove = this.baseSvc.role;
    //     // this.customerRoleData = this.customerRoleData.filter(
    //     //   (role) => role.value !== valueToRemove
    //     // );
    //     this.customerRoleData = this.customerRoleData
    //   } else {
    //     if (!this.baseFormData.role) {
    //       // this.customerRoleData = this.customerRoleData.filter(
    //       //   (role)=>role.value == 1
    //       // )
    //       this.customerRoleForm.controls["role"].setValue(1);
    //       this.baseSvc.setBaseDealerFormData({
    //         role: 1,
    //       });
    //     }
    //   }
    // }
    if (this.mode == "edit") {
      if (this.baseSvc.role === 1) {
        // this.customerRoleData = this.customerRoleData;

        // Check if customerSummary exists and is an array
        if (
          this.baseFormData?.customerSummary &&
          Array.isArray(this.baseFormData.customerSummary)
        ) {
          // Count co-borrowers (customerRole = 2)
          const coBorrowers = this.baseFormData.customerSummary.filter(
            (customer) => customer.customerRole === 2
          );

          if (coBorrowers.length >= 2) {
            // If 2 or more co-borrowers exist, set role to guarantor (3)
            this.customerRoleForm.controls["role"].setValue(
              this.baseFormData?.role || 3
            );
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 3,
            });
          } else {
            // If less than 2 co-borrowers, set role to co-borrower (2)
            this.customerRoleForm.controls["role"].setValue(
              this.baseFormData?.role || 2
            );
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
          this.customerRoleForm.controls["role"].setValue(
            this.baseFormData?.role || 1
          );
          this.baseSvc.setBaseDealerFormData({
            role: this.baseFormData?.role || 1,
          });
        }
      }
    }

    // this.customerRoleForm.valueChanges.subscribe((change) => {
    //   this.baseSvc.setBaseDealerFormData({
    //     role: change.role,
    //   });
    // });

    if (this.baseFormData?.role) {
      this.customerRoleForm.controls["role"].setValue(this.baseFormData?.role);
    }
    if (this.mode == "edit") {
      // if (this.baseFormData?.role) {
      //   this.customerRoleForm.controls["role"].setValue(
      //     this.baseFormData?.role
      //   );
      // } else {
      //   if (this.baseSvc.role === 1) {
      //     const valueToRemove = this.baseSvc.role;

      //     this.customerRoleData = this.customerRoleData.filter(
      //       (role) => role.value !== valueToRemove
      //     );
      //   }
      //   // Handle the case where customerRoles is not available, e.g., set a default value
      //   this.customerRole = null; // or some default value
      // }

      if (this.baseFormData?.tempCustomerNo === this.baseFormData?.customerNo) {
        if (this.baseFormData?.tempCustomerRole) {
          this.customerRoleForm.controls["role"].setValue(
            this.baseFormData?.tempCustomerRole
          );
          // this.mainForm.get("role").setValue(this.baseFormData?.tempCustomerRole);
          this.baseSvc.setBaseDealerFormData({
            role: this.baseFormData?.tempCustomerRole,
          });
        }
      } else {
        this.customerRoleForm.controls["role"].setValue(
          this.baseFormData?.role
        );
      }

      const formattedDate = this.datePipe.transform(
        this.baseFormData?.personalDetails?.dateOfBirth.split("T")[0],
        "dd/MM/yyyy"
      );

      formattedDate == null
        ? ""
        : this.mainForm?.get("dateOfBirth").patchValue(formattedDate);

      const dependentsAge =
        this.baseFormData?.personalDetails?.dependentsAge || ""; // Fallback if undefined
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
          // formArray.push(new FormGroup({ age: new FormControl("" }));
          formArray.push(this.createDependentFormGroup());
        }
        while (formArray.length > dependentsArray.length) {
          formArray.removeAt(formArray.length - 1);
        }
        // Patch the values
        // formArray.patchValue(dependentsArray);
        dependentsArray.forEach((item, index) => {
          const control = formArray.at(index);
          if (control) {
            control.get("age")?.setValue(item.age || 0);
            control
              .get("age")
              ?.setValidators([
                Validators.min(0),
                Validators.required,
                Validators.pattern(/^[0-9]{1,2}$/),
              ]);
            control.get("age")?.updateValueAndValidity();
            control.get("age")?.markAsTouched();
          }
        });

        // this.mainForm.updateProps("age", {errorMessage: "Age is required and must be a positive number"})
      }
    }

    this.mainForm?.form.valueChanges.subscribe((value) => {
      this.baseSvc.setBaseDealerFormData({
        dependentsAge: value?.noOfDependentArr?.map((item: any) => item.age),
      });
    });

    this.customerRoleForm.valueChanges.subscribe((change) => {
      this.baseSvc.setBaseDealerFormData({
        role: change.role,
        tempCustomerRole: change.role,
      });
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

        const genderList = list
          .filter((item) => item.lookupValue != "Z - Not Applicable")
          .map((item) => ({
            label: item.lookupValue,
            value: item.lookupValue,
          }));

        this.mainForm.updateList("gender", genderList);
        genderList?.sort((a, b) => a?.label?.localeCompare(b?.label));
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

        const selectedValue = this.mainForm?.form?.get("maritalStatus")?.value;

        const sortedList = this.sortMaritalStatusOptions(
          maritalStatusList,
          selectedValue
        );

        this.mainForm.updateList("maritalStatus", sortedList);
        sortedList?.sort((a, b) => a?.label?.localeCompare(b?.label));
        return sortedList;
      }
    );
  }
  //
  private sortMaritalStatusOptions(
    options: any[],
    selectedValue: string | null
  ): any[] {
    if (!selectedValue) {
      return [...options].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      );
    }

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    if (!selectedOption) {
      return [...options].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      );
    }

    const remainingOptions = options
      .filter((opt) => opt.value !== selectedValue)
      .sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      );

    return [selectedOption, ...remainingOptions];
  }

  private setupMaritalStatusValueChange(): void {
    setTimeout(() => {
      this.mainForm?.form
        ?.get("maritalStatus")
        ?.valueChanges.subscribe((selectedValue) => {
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
    // this.emitFormValidity()
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

  // private emitFormValidity(): void {
  //   // this.mainForm.form.markAllAsTouched()
  //   const isValid = this.mainForm.form.valid;

  //   // (this as any).updateComponentValidity(this.currentPageName, this.componentName, isValid);
  //   this.baseSvc.updateComponentValidity(this.currentPageName, this.componentName, isValid);

  // }

  override async onValueTyped(event: any) {
    if (event.name === "dateOfBirth") {
      // this.mainForm.get("dateOfBirth").patchValue(new Date(event.data));
      // this.ValidateDoB();
      //   // Continue with any other validation logic
      await this.updateValidation("blur");
    }
    if (event.name === "age") {
      await this.updateValidation(event);
      this.validateAgeField(event);
    }
    await this.updateValidation(event);
  }
  private validateAgeField(event: any): void {
    const noOfDependentArr = this.mainForm.get(
      "noOfDependentArr"
    ) as unknown as FormArray;

    if (noOfDependentArr && noOfDependentArr.length > 0) {
      for (let i = 0; i < noOfDependentArr.length; i++) {
        const ageControl = noOfDependentArr.at(i).get("age");
        if (ageControl) {
          ageControl.updateValueAndValidity();
        }
      }
    }
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
    super.onStepChange(stepperDetails);
    // this.emitFormValidity()
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.customerRoleForm) {
        if (this.customerRoleForm.controls["role"].value === 0) {
          this.customerRoleForm.markAllAsTouched();
          formStatus = "INVALID";
        } else {
          formStatus = this.proceedEmailForm();
          //  this.mainForm.form.markAllAsTouched();
        }

        this.baseSvc?.formStatusArr?.push(formStatus);
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

    this.baseSvc.updateComponentStatus(
      "Personal Details",
      "PersonalDetailsComponent",
      this.mainForm.form.valid &&
        this.customerRoleForm?.controls["role"].value !== 0
    );

    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
    // this.checkStepValidity()
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

  pageCode: string = "IndividualComponent";
  modelName: string = "PersonalDetailsComponent";

  override async onFormReady(): Promise<void> {
    if (this.customerRoleForm && this.baseSvc.showValidationMessage) {
      if (this.customerRoleForm.controls["role"].value === 0) {
        this.customerRoleForm.markAllAsTouched();
      }
    }
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
