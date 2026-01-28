import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ValidationService } from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";

@Component({
  selector: "app-sole-trade-current-employment",
  templateUrl: "./sole-trade-current-employment.component.html",
  styleUrl: "./sole-trade-current-employment.component.scss",
})
export class SoleTradeCurrentEmploymentComponent extends BaseSoleTradeClass {
  optionsdata = [{ name: "icashpro", code: "icp" }];
  privousChecked: boolean = false;
  @Input() checkPreviousEmployees = false;
  @Output() employementYearChange = new EventEmitter<number>();
  // override title: string = 'Address Details';
  override formConfig: GenericFormConfig = {
    headerTitle: "Current Employment",
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "non-border",
    cardBgColor: "--background-color-secondary",
    fields: [
      {
        type: "name",
        label: "Employer Name",
        inputType: "vertical",
        name: "currentEmployer",
        className: "mt-3 mr-2 ",
        inputClass: "-m-2 mb-0 ml-2",
        labelClass: "ba pb-5 -mb-3",
        cols: 2,
        nextLine: false,
        //validators: [validators.required],
      },
      {
        type: "select",
        label: "Occupation",
        alignmentType: "vertical",
        name: "currentOccupation",

        cols: 2,
        className: "mt-2 ",
        //validators: [validators.required],
        nextLine: false,
        // list$: "LookUpServices/custom_lookups?LookupSetName=Occupation Code",
        // idKey: "lookupValue",
        // idName: "lookupValue",
        options: [],
        filter: true,
      },
      {
        type: "select",
        label: "Employment Type",
        alignmentType: "vertical",
        name: "currentEmploymentType",
        cols: 2,
        className: "mt-2 ",
        //validators: [validators.required],
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
        label: "Time with Current Employer",
        labelClass: "tce pb-3 white-space-nowrap",
        name: "currentEmployeeYear",
        className: "ml-3 mt-0 py-4 col-fixed w-4rem",
        inputClass: "-m-2 mb-0 ml-2",
        //validators: [validators.required],
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
        className:
          "ml-3 py-4 mt-4 col-fixed w-4rem timeInBusinessMonthsClass",
        inputClass: "-m-2 mb-0 ml-2",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "Months",
        name: "month",
        className: "mt-5 py-5 pt-3 col-fixed w-4rem",
        nextLine: false,
      },
    ],
  };
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public SoleTradeSvc: SoleTradeService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, SoleTradeSvc);
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

    this.patchValue();
    this.updatedropdowndata();
    
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

        this.mainForm.updateList("currentOccupation", currentOccupationList);
        currentOccupationList?.sort((a, b) => a?.label?.localeCompare(b?.label));
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

        this.mainForm.updateList(
          "currentEmploymentType",
          currentEmploymentTypeList
        );
        currentEmploymentTypeList?.sort((a, b) => a?.label?.localeCompare(b?.label));
        return currentEmploymentTypeList;
      }
    );
  }

  // override title: string = 'Address Details';

  override async onFormEvent(event: any): Promise<void> {
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
    super.onFormEvent(event);
    if (event?.name == "currentEmploymentType") {
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
      setTimeout(() => {
        this.mainForm.form.reset();
      }, 100);
    }
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

  pageCode: string = "SoleTradeEmploymentDetailsComponent";
  modelName: string = "SoleTradeCurrentEmploymentComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    await super.onFormReady();
    // this.mainForm.get("currentEmployeeYear").patchValue(null);
    // this.mainForm.get("currentEmployeeMonth").patchValue(null);
    this.patchValue();
  }

 
  override onValueChanges(event: any): void {
    if(event.currentEmployeeYear !== undefined){
      this.employementYearChange.emit(event.currentEmployeeYear)
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
      this.cdr.detectChanges();
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
     if(!this.baseSvc.isPreviousEmployeeVisible){
      this.baseSvc.updateComponentStatus("Employment Details", "SoleTradePreviousEmploymentComponent", true)
    }
    
    this.baseSvc.updateComponentStatus("Employment Details", "SoleTradeCurrentEmploymentComponent", this.mainForm.form.valid)

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
  }

  patchValue() {
    let params: any = this.route.snapshot.params;

    if (
      (params.mode == "edit" || params.mode == "view") &&
      this.baseFormData?.employementDetails[0]
    ) {
      console.log("this.baseFormData", this.baseFormData);
      console.log("this.mainForm", this.mainForm.form);
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

      this.mainForm.get("currentEmployeeYear").patchValue(this.baseFormData?.currentEmployeeYear || duration.years);
      this.mainForm.get("currentEmployeeMonth").patchValue(this.baseFormData?.currentEmployeeMonth || duration.months);

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
    else {
      this.mainForm.get("currentEmployeeYear").patchValue(this.baseFormData?.currentEmployeeYear || null);
      this.mainForm.get("currentEmployeeMonth").patchValue(this.baseFormData?.currentEmployeeMonth || null);
  } 
}
  override onValueTyped(event: any): void {
    this.updateValidation(event);
  }
  override onBlurEvent(event: any): void {
    this.updateValidation(event);
  }
}
