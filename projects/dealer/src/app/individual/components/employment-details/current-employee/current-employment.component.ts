import { ChangeDetectorRef, Component, EventEmitter, input, Input, Output, SimpleChange, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ToasterService, ValidationService } from "auro-ui";


@Component({
  selector: "app-current-employment",
  templateUrl: "./current-employment.component.html",
  styleUrl: "./current-employment.component.scss",
})
export class CurrentEmploymentComponent extends BaseIndividualClass {
  @Input() checkPreviousEmployees = false;
  @Output() employementYearChange = new EventEmitter<number>();
  override formConfig: GenericFormConfig = {
    headerTitle: "Current Employment",
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
      //   name: "currentEmployer",
      //   cols: 2,
      //   nextLine: false,
      //   filter: true,
      //   list$: "Contract/get_allparties?PageNo=1&PageSize=100",
      //   idKey: "name",
      //   idName: "name",
      //   // maxLength: 30,
      //   // validators: [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],  --Auro
      // },
      {
        type: "text",
        className: "mt-3 mr-2 ",
        inputType: "vertical",
        label: "Employer Name",
        name: "currentEmployer",
        labelClass: "ba pb-5 -mb-3",
        cols: 2,
        nextLine: false,
        inputClass: "-m-2 mb-0 ml-2",
        // maxLength: 30,
        // validators: [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],  --Auro
      },
      {
        type: "checkbox",
        label: "Create new and copy to previous Address",
        name: "checkPreviousEmployee",
        hidden: true,
        default: false,
      },
      {
        type: "select",
        label: "Occupation",
        name: "currentOccupation",
        cols: 2,
        alignmentType: "vertical",
        className: "mt-2 ",
        // validators: [Validators.required],   -- Auro
        nextLine: false,
        // list$: "LookUpServices/custom_lookups?LookupSetName=Occupation Code",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        filter: true,
      },
      {
        type: "select",
        className: "mt-2 ",
        alignmentType: "vertical",
        label: "Employment Type",
        name: "currentEmploymentType",
        cols: 2,
        // validators: [Validators.required],   --Auro
        nextLine: false,
        // list$: "LookUpServices/lookups?LookupSetName=EmploymentStatus",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        filter: true,
        options: [],
      },

      {
        type: "number",
        inputType: "vertical",
        label: "Time with Current Employer",
        name: "currentEmployeeYear",
        labelClass: "tce pb-3",
        className: "ml-3 mt-0 py-4 col-fixed w-4rem white-space-nowrap",
        inputClass: "-m-2 mb-0 ml-2",
        // validators: [Validators.required, Validators.max(99)],   --Auro
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
        name: "currentEmployeeMonth",
        maxLength: 2,
        // validators: [Validators.max(11)],   --Auro
        className:
          "ml-3 py-4 mt-4 col-fixed w-4rem white-space-nowrap timeInBusinessMonthsClass",
        inputClass: "-m-2 mb-0 ml-2",
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
    if(this.baseSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }

    let params: any = this.route.snapshot.params;

    if (
      (params.mode == "edit" || params.mode == "view") &&
      this.baseFormData?.employementDetails[0]
    ) {
      this.mainForm
        .get("currentEmployer")
        .patchValue(
           this.baseFormData?.currentEmployer ||
          this.baseFormData?.employementDetails[0]?.employerName
        );
      this.mainForm
        .get("currentOccupation")
        .patchValue(
          this.baseFormData?.currentOccupation ||
          this.baseFormData?.employementDetails[0]?.occupationType 
        );
      this.mainForm
        .get("currentEmploymentType")
        .patchValue(
          this.baseFormData?.currentEmploymentType ||
          this.baseFormData?.employementDetails[0]?.employmentStatus
        );
      // this.mainForm.get('checkPreviousEmployee').patchValue(!this.baseFormData?.currentEmployment?.isCurrent)

      const duration = this.calculateYearAndMonthDifference(
        this.baseFormData?.employementDetails[0]?.effectDtFrom,
        this.baseFormData?.employementDetails[0]?.effectDtTO
      );

      this.mainForm.get("currentEmployeeYear").patchValue(this.baseFormData?.currentEmployeeYear ?? duration.years ?? null);
      this.mainForm.get("currentEmployeeMonth").patchValue(this.baseFormData?.currentEmployeeMonth ?? duration.months ?? null);

      // this.mainForm
      //   .get("currentEmployeeYear")
      //   .patchValue(
      //     this.calculateYearDifference(
      //       this.baseFormData?.employementDetails[0]?.effectDtFrom,
      //       this.baseFormData?.employementDetails[0]?.effectDtTO
      //     )
      //   );
      // this.mainForm
      //   .get("currentEmployeeMonth")
      //   .patchValue(
      //     this.calculateMonthDifference(
      //       this.baseFormData?.employementDetails[0]?.effectDtFrom,
      //       this.baseFormData?.employementDetails[0]?.effectDtTO
      //     )
      //   );
    }

    this.updatedropdowndata();
    // await this.updateValidation("onInit");
  }

  async updatedropdowndata() {
    await this.baseSvc.getFormData(
      `LookUpServices/custom_lookups?LookupSetName=Occupation Code`,
      (res) => {
        let list = res.data;

        const currentOccupationList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        currentOccupationList?.sort((a, b) => a?.label?.localeCompare(b?.label));
        this.mainForm.updateList("currentOccupation", currentOccupationList);

        return currentOccupationList;
      }
    );

    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=EmploymentStatus`,
      (res) => {
        let list = res.data;

        const currentEmploymentTypeList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));
        currentEmploymentTypeList?.sort((a, b) => a?.label?.localeCompare(b?.label));
        this.mainForm.updateList(
          "currentEmploymentType",
          currentEmploymentTypeList
        );

        return currentEmploymentTypeList;
      }
    );
  }

  override async onFormEvent(event: any): Promise<void> {
    super.onFormEvent(event);
    // if (event?.name == "currentEmployeeYear") {
    //   if (event?.value && event?.value < 3) {
    //     this.baseFormData.previousEmployeeisEnable = true;
    //   } else if (event?.value && event?.value >= 3) {
    //     this.baseFormData.previousEmployeeisEnable = false;
    //     this.baseFormData.previousEmployer = null;
    //   } else if (!event?.value && this.baseFormData.previousEmployeeisEnable) {
    //     this.baseFormData.previousEmployeeisEnable = false;
    //     this.baseFormData.previousEmployer = null;
    //   }
    // }
    if( event?.name == "currentEmploymentType" ){
    await this.updateValidation(event);
    }
  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
  if (changes['checkPreviousEmployees']) {
    this.mainForm.form.patchValue(this.baseFormData);
    if (this.mainForm && this.mainForm.form) {
      await this.updateValidation("onInit");
      if (!changes['checkPreviousEmployees'].currentValue && 
          changes['checkPreviousEmployees'].previousValue) {
        this.mainForm.form.updateValueAndValidity();
      }
    }
  }
}

  override onFormDataUpdate(res: any): void {
    if (
      !res?.previousEmployer &&
      res?.checkPreviousEmployees &&
      this.baseFormData?.checkPreviousEmployees !=
        res?.checkPreviousEmployees &&
      !(this.baseFormData?.employementDetails?.length > 1)
    ) {
      // setTimeout(() => {
      //   this.mainForm.form.reset();
      // }, 100);
    }

    // if (
    //   this.baseSvc.EmploymentDetailChangedSlider
    // ) {
    //   this.mainForm.form.patchValue(this.baseFormData)
    //   this.mainForm
    //     .get("currentOccupation")
    //     .patchValue(
    //       null
    //     );

    //   console.log("slider changed", this.baseFormData);
    // }

  }

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
  //   return Math.max(yearDifference, 0);
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

  calculateMonthDifference(effectDtFrom: string, effectDtTo: string): number {
    const fromDate = new Date(effectDtFrom);
    const toDate = effectDtTo ? new Date(effectDtTo) : new Date();

    // Calculate the total month difference
    let monthDifference =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());

    // Adjust for negative month difference if necessary
    return Math.max(monthDifference, 0);
  }

  pageCode: string = "EmploymentDetailsComponent";
  modelName: string = "CurrentEmploymentComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  

  

  override onValueChanges(event: any): void {
    if(event.currentEmployeeYear !== undefined){
      this.employementYearChange.emit(event.currentEmployeeYear);
    }
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
    if (!this.baseSvc.isPreviousEmployeeVisible) {
      this.baseSvc.updateComponentStatus("Employment Details", "PreviousEmploymentComponent", true);
    }

    this.baseSvc.updateComponentStatus("Employment Details", "CurrentEmploymentComponent", this.mainForm.form.valid);

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
   

  }
  override onValueTyped(event: any): void {
    this.updateValidation(event);
  }
  override onBlurEvent(event: any): void {
    this.updateValidation(event);
  }
  override async onValueEvent(event: any): Promise<void> {
  await this.updateValidation(event);
}
}
