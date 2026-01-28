import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Validators } from "@angular/forms";
import { CommonService, GenericFormConfig } from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ToasterService, ValidationService } from "auro-ui";

@Component({
  selector: "app-previous-employee ",
  templateUrl: "./previous-employee .component.html",
  styleUrl: "./previous-employee .component.scss",
})
export class PreviousEmploymentComponent extends BaseIndividualClass {
  optionsdata = [{ label: "icashpro", value: "icp" }];
  override formConfig: GenericFormConfig = {
    headerTitle: "Previous Employment",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardBgColor: "--background-color-secondary",
    cardType: "non-border",
    fields: [
      // {
      //   type: "select",
      //   className: "mt-2 ",
      //   label: "Employer Name",
      //   name: "previousEmployer",
      //   cols: 2,
      //   nextLine: false,
      //   filter: true,
      //   list$: "Contract/get_allparties?PageNo=1&PageSize=100",
      //   idKey: "name",
      //   idName: "name",
      //   /* //validators: [
      //     Validators.required,
      //     Validators.maxLength(30),
      //     Validators.pattern('^[a-zA-Z ]*$'),
      //   ],  --Auro */
      // },
      {
        type: "text",
        className: "mt-3 mr-2 ",
        label: "Employer Name",
        labelClass: "ba pb-5 -mb-3",
        inputType: "vertical",
        name: "previousEmployer",
        cols: 2,
        nextLine: false,
        inputClass: "-m-2 mb-0 ml-2",
        /* //validators: [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],  --Auro */
      },
      {
        type: "select",
        label: "Occupation",
        name: "previousOccupation",
        alignmentType: "vertical",
        className: "mt-2 ",
        cols: 2,
        // //validators: [Validators.required],   --Auro
        nextLine: false,
        // list$: "LookUpServices/custom_lookups?LookupSetName=Occupation Code",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        filter: true,
        options: [],
      },
      {
        type: "select",
        label: "Employment Type",
        name: "previousEmploymentType",
        alignmentType: "vertical",
        className: "mt-2 ",
        cols: 2,
        //validators: [Validators.required],
        nextLine: false,
        // list$: "LookUpServices/lookups?LookupSetName=EmploymentStatus",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        filter: true,
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time with Previous employer",
        name: "previousEmployeeYear",
        labelClass: "tce pb-3",
        className: "ml-3 mt-0 py-4 col-fixed w-4rem white-space-nowrap",
        inputClass: "-m-2 mb-0 ml-2",
        //validators: [Validators.required, Validators.max(99)],
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Years",
        name: "year",
        className: "mt-5 py-5 pt-3 col-fixed w-4rem",
      },
      {
        type: "number",
        inputType: "vertical",
        name: "previousEmployeeMonth",

        className:
          "ml-3 py-4 mt-4 col-fixed w-4rem white-space-nowrap timeInBusinessMonthsClass",
        inputClass: "-m-2 mb-0 ml-2",
        //validators: [Validators.max(11)],
        errorMessage: "Value should be less than 12",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-5 py-5 pt-3 col-fixed w-4rem",
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
      "LookUpServices/custom_lookups?LookupSetName=Occupation Code",
      "LookUpServices/lookups?LookupSetName=EmploymentStatus",
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
    
    let params: any = this.route.snapshot.params;

    if(this.baseSvc.EmploymentDetailChangedSlider){
      if (
      (params.mode == "edit" || params.mode == "view") &&
      this.baseFormData?.CopyCurrentEmploymentDetails
    ) {
      // console.log(this.baseFormData, this.mainForm, "previous Employee Oninit")
      this.mainForm
        .get("previousEmployer")
        .patchValue(this.baseFormData?.previousEmployer || this.baseFormData?.CopyCurrentEmploymentDetails?.employerName);
      this.mainForm
        .get("previousOccupation")
        .patchValue(this.baseFormData?.previousOccupation || this.baseFormData?.CopyCurrentEmploymentDetails?.occupationType);
      this.mainForm
        .get("previousEmploymentType")
        .patchValue(this.baseFormData?.previousEmploymentType || this.baseFormData?.CopyCurrentEmploymentDetails?.employmentStatus);

      const duration = this.calculateYearAndMonthDifference(
        this.baseFormData?.CopyCurrentEmploymentDetails?.effectDtFrom,
        this.baseFormData?.CopyCurrentEmploymentDetails?.effectDtTO
      );

      this.mainForm.get("previousEmployeeYear").patchValue(this.baseFormData?.previousEmployeeYear || duration.years);
      this.mainForm.get("previousEmployeeMonth").patchValue(this.baseFormData?.previousEmployeeMonth || duration.months);

    }
    }
    else{
    if (
      (params.mode == "edit" || params.mode == "view") &&
      this.baseFormData?.employementDetails[1]
    ) {
      this.mainForm
        .get("previousEmployer")
        .patchValue(this.baseFormData?.previousEmployer || this.baseFormData?.employementDetails[1]?.employerName);
      this.mainForm
        .get("previousOccupation")
        .patchValue(this.baseFormData?.previousOccupation || this.baseFormData?.employementDetails[1]?.occupationType);
      this.mainForm
        .get("previousEmploymentType")
        .patchValue(this.baseFormData?.previousEmploymentType || this.baseFormData?.employementDetails[1]?.employmentStatus);

      const duration = this.calculateYearAndMonthDifference(
        this.baseFormData?.previousEmployeeYear || this.baseFormData?.employementDetails[1]?.effectDtFrom,
        this.baseFormData?.previousEmployeeMonth || this.baseFormData?.employementDetails[1]?.effectDtTO
      );

      this.mainForm.get("previousEmployeeYear").patchValue(duration.years);
      this.mainForm.get("previousEmployeeMonth").patchValue(duration.months);

      // this.mainForm
      //   .get("previousEmployeeYear")
      //   .patchValue(
      //     this.calculateYearDifference(
      //       this.baseFormData?.employementDetails[1]?.effectDtFrom,
      //       this.baseFormData?.employementDetails[1]?.effectDtTO
      //     )
      //   );
      // this.mainForm
      //   .get("previousEmployeeMonth")
      //   .patchValue(
      //     this.calculateMonthDifference(
      //       this.baseFormData?.employementDetails[1]?.effectDtFrom,
      //       this.baseFormData?.employementDetails[1]?.effectDtTO
      //     )
      //   );
    }
  }
    this.updatedropdowndata();

    if(this.baseSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }
  }

  async updatedropdowndata() {
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=Occupation Code`,
      (res) => {
        let list = res.data;

        const previousOccupationList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));

        this.mainForm.updateList("previousOccupation", previousOccupationList);
        previousOccupationList.sort((a, b) => a.label.localeCompare(b.label));
        return previousOccupationList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=EmploymentStatus`,
      (res) => {
        let list = res.data;

        const previousEmploymentTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));

        this.mainForm.updateList(
          "previousEmploymentType",
          previousEmploymentTypeList
        );
        previousEmploymentTypeList.sort((a, b) => a.label.localeCompare(b.label));
        return previousEmploymentTypeList;
      }
    );
  }


  // override onFormDataUpdate(res: any): void {
  //   const fields = [
  //     "Employer",
  //     "EmployeeYear",
  //     "EmployeeMonth",
  //     "EmploymentType",
  //     "Occupation",
  //   ];
  //   if ( this.baseFormData?.checkPreviousEmployees ) {
  //     setTimeout(() => {
  //       fields.forEach((field) => {
  //         const previousField = this.mainForm?.get(`previous${field}`)?.value;
  //         const currentFieldValue = res[`current${field}`];
  //         if (previousField != currentFieldValue) {
  //           this.mainForm
  //             ?.get(`previous${field}`)
  //             ?.patchValue(currentFieldValue);
  //         }
  //       });
  //     }, 100);
  //   }
  // }


  override onFormEvent(event: any): void {
    super.onFormEvent(event);
    if(event?.name == "previousEmploymentType"){
      this.updateValidation(event);
    }
  }
  // override onFormDataUpdate(res: any): void {
  //   const fields = [
  //     "Employer",
  //     "EmployeeYear",
  //     "EmployeeMonth",
  //     "EmploymentType",
  //     "Occupation",
  //   ];
  //   if (
  //     res?.checkPreviousEmployees &&
  //     this.baseFormData?.checkPreviousEmployeess !=
  //       res?.checkPreviousEmployees &&
  //     res?.previousEmployer != res?.currentEmployer &&
  //     !res?.previousEmployer
  //   ) {
  //     setTimeout(() => {
  //       fields.forEach((field) => {
  //         const previousField = this.mainForm?.get(`previous${field}`)?.value;
  //         const currentFieldValue = res[`current${field}`];
  //         if (previousField != currentFieldValue) {
  //           this.mainForm
  //             ?.get(`previous${field}`)
  //             ?.patchValue(currentFieldValue);
  //         }
  //       });
  //     }, 100);
  //   }
  // }

  // calculateYearDifference(effectDtFrom: string, effectDtTO: string): number {
  //   const fromDate = new Date(effectDtFrom);
  //   const toDate = effectDtTO ? new Date(effectDtTO) : new Date();
  //   let yearDifference = toDate.getFullYear() - fromDate.getFullYear();

  //   // Adjust year difference if the current month/day is before the starting month/day
  //   if (
  //     toDate.getMonth() < fromDate.getMonth() ||
  //     (toDate.getMonth() === fromDate.getMonth() &&
  //       toDate.getDate() < fromDate.getDate())
  //   ) {
  //     yearDifference--;
  //   }
  //   return yearDifference > 0 ? yearDifference : 0;
  // }

  // calculateMonthDifference(effectDtFrom: string, effectDtTo: string): number {
  //   const fromDate = new Date(effectDtFrom);
  //   const toDate = effectDtTo ? new Date(effectDtTo) : new Date();
  //   let monthDifference = toDate.getMonth() - fromDate.getMonth();
  //   if (monthDifference < 0) {
  //     monthDifference += 12;
  //   }
  //   return Math.max(monthDifference, 0);
  // }

  calculateYearAndMonthDifference(
    effectDtFrom: string,
    effectDtTo: string
  ): { years: number; months: number } {
    const fromDate = new Date(effectDtFrom);
    const toDate = effectDtTo ? new Date(effectDtTo) : new Date();

    // Calculate total months difference
    let totalMonths = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    totalMonths += toDate.getMonth() - fromDate.getMonth();

    // Adjust for day of month
    if (toDate.getDate() < fromDate.getDate()) {
      totalMonths--;
    }

    // Calculate years and remaining months
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return {
      years: years,
      months: months,
    };
  }

  calculateNewDate(yearsToSubtract) {
    const currentDate = new Date();
    // Subtract the specified number of years
    currentDate.setFullYear(currentDate.getFullYear() - yearsToSubtract);
    // Format the date to 'YYYY-MM-DDTHH:MM:SS'
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    // Return the formatted date string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  calculateNewDateByMonth(dateString, monthsToSubtract) {
    // Parse the given date string
    const date = new Date(dateString);

    // Subtract the specified number of months
    date.setMonth(date.getMonth() - monthsToSubtract);

    // Format the date to 'YYYY-MM-DDTHH:MM:SS'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Return the formatted date string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  pageCode: string = "EmploymentDetailsComponent";
  modelName: string = "PreviousEmploymentComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
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
    super.onStepChange(quotesDetails);
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      // if (!result?.status) {
      //   this.toasterSvc.showToaster({
      //     severity: "error",
      //     detail: "I7",
      //   });
      // }
    }

    if(!this.baseSvc?.isPreviousEmployeeVisible){
      this.baseSvc?.updateComponentStatus("Employment Details", "PreviousEmploymentComponent", true)
    }else{
      this.baseSvc?.updateComponentStatus("Employment Details", "PreviousEmploymentComponent", this.mainForm.form.valid)
    }

     if(this.baseSvc?.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc?.iconfirmCheckbox.next(invalidPages)
    }
  }
  override onValueTyped(event: any): void {
    this.updateValidation(event);
  }
}
