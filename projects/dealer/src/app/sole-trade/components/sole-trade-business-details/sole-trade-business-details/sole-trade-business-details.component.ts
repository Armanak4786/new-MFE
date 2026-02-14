import { Component, ViewChild } from "@angular/core";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ValidationService } from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import configure from "src/assets/configure.json";
import { SoleTradeCitizenshipDetailComponent } from "../sole-trade-citizenship-detail/sole-trade-citizenship-detail.component";

@Component({
  selector: "app-sole-trade-business-details",

  templateUrl: "./sole-trade-business-details.component.html",
  styleUrl: "./sole-trade-business-details.component.scss",
})
export class SoleTradeBusinessDetailsComponent extends BaseSoleTradeClass {

  @ViewChild(SoleTradeCitizenshipDetailComponent)
  citizenshipComp!: SoleTradeCitizenshipDetailComponent;

  
  optionsdata: any[] = ["aa"];
  privousChecked: any;
  private natureOfBusinessOptions: any[] = [];
  borrowedAmount: any;
  customerRoleData: any = [
    { label: "Borrower", value: "Borrower" },
    { label: "Co-Borrower", value: "co-borrower" },
    { label: "Guaranter", value: "guranter" },
  ];
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    headerTitle: "Business Details",
    api: "soleTradeBusinessDetail",
    goBackRoute: "soleTradeBusinessDetail",
    //cardBgColor: "--background-color-secondary",
    cardType: "border",
    fields: [
      {
        type: "text",
        label: "Trading Name",
        name: "tradingName",
        inputType: "vertical",
        className: "mr-3",
        //validators: [Validators.required],
        cols: 2,
      },
      {
        type: "text",
        label: "GST Number",
        name: "gstNum",
        inputType: "vertical",
        className: "mr-3",
        cols: 2,
        //validators: [Validators.required],

        nextLine: true,
      },
      {
        type: "textArea",
        label: "Business Description",
        name: "businessDescription",
        //validators: [Validators.required],
        cols: 3,
        textAreaRows: 2,
        inputType: "vertical",
        textAreaType: "border",
      },

      {
        type: "select",
        label: "Primary Nature of Business",
        name: "natureOfBusiness",
        alignmentType: "vertical",
        // options: [
        //   { label: "Credit Sales Agreement", value: "creditSalesAgreement" },
        //   {
        //     label: "CSA Business - Direct - Fixed",
        //     value: "CSABusinessDirectFixed",
        //   },
        // ],
        // list$: "LookUpServices/CustomData",
        // apiRequest: {
        //   parameterValues: ["ANZ1993"],
        //   procedureName: configure.SPIndustryTypeExtract, // Assuming configure is imported from the correct path,
        // },
        // idKey: "value_text",
        // idName: "value_text",
        options:[],
        //validators: [Validators.required],
        cols: 3,
        className: "mt-4 ml-1",
        labelClass: " -mt-3",
        inputClass: "mt-1",
      },
      {
        type: "number",
        inputType: "vertical",
        label: "Time In Business",
        name: "timeInBusinessYears",
        className: "ml-6 py-1 mt-5 col-fixed w-4rem",
        labelClass: "alb pb-1 mt-1 white-space-nowrap",
        inputClass: "-m-2 -mt-3 pt-1 pb-3",
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
        className:
          "ml-3 py-0 mt-5 col-fixed w-4rem",
        // labelClass: "hidden",
        labelClass: "alb pb-1 mt-1 white-space-nowrap",
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
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
     public validationSvc: ValidationService,
    public soleTradeSvc: SoleTradeService
  ) {
    super(route, svc, soleTradeSvc);
    this.svc.data.postCacheableRoutes(["LookUpServices/CustomData"]);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    await this.loadNatureOfBusinessOptions();
    if(this.baseSvc.showValidationMessage){
      this.mainForm?.form?.markAllAsTouched()
    }
  }

  async loadNatureOfBusinessOptions(): Promise<void> {
    this.svc.data
      .post("LookUpServices/CustomData", {
        parameterValues: ["ANZ1993"],
        procedureName: configure?.SPIndustryTypeExtract,
      })
      .subscribe((res) => {
        if (res?.data?.table) {
          const natureOfBusinesslist = res.data.table.map((item: any) => ({
            label: item.value_text,
            value: item.value_text,
          }));

          // Store the options
          this.natureOfBusinessOptions = natureOfBusinesslist;
this.mainForm?.updateList("natureOfBusiness", natureOfBusinesslist);

        }
      });
  }
  
 
  
  
  
  override async onFormReady(): Promise<void> {
    this.mainForm?.form?.get("tradingName")?.patchValue(this.baseFormData?.tradingName);
    this.mainForm?.form?.get("timeInBusinessYears")?.patchValue(this.baseFormData?.timeInBusinessYears);
    this.mainForm?.form?.get("timeInBusinessMonths")?.patchValue(this.baseFormData?.timeInBusinessMonths);
    
    if(this.baseFormData?.natureOfBusiness){
      const natureOfBusinessSoleTrade = this.decodeHtmlEntities(
        this.baseFormData?.natureOfBusiness
      );

      this.soleTradeSvc.setBaseDealerFormData({
        natureOfBusiness: natureOfBusinessSoleTrade,
      });

      this.mainForm
        .get("natureOfBusiness")
        .patchValue(this.decodeHtmlEntities(this.baseFormData?.natureOfBusiness));
    }
    await this.loadNatureOfBusinessOptions();
    await this.updateValidation("onInit");
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

      if(this.baseSvc?.showValidationMessage){
       this.mainForm?.form?.markAllAsTouched()
      }
  }
  override onFormEvent(event: any): void {
    super.onFormEvent(event);
  }
  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);
 	this.soleTradeSvc.updateComponentStatus("Business Individual", "SoleTradeBusinessDetailsComponent", this.mainForm?.form?.valid)

  if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
     // If stepper is validating (submit/next)
    if (stepperDetails?.validate) {
      if (this.citizenshipComp) {
        this.citizenshipComp.updateValidation("onSubmit");
      }
    }
  }

  decodeHtmlEntities(value: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = value;
    return txt.value;
  }
override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
    this.checkTimeinBusinessSoleTrade();
  }

  


  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
    this.checkTimeinBusinessSoleTrade();
  }

  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  pageCode: string = "SoleTradeComponent";
  modelName: string = "SoleTradeBusinessDetailComponent";

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
  checkTimeinBusinessSoleTrade(): void {
    const yCtrl = this.mainForm.get("timeInBusinessYears");
    const mCtrl = this.mainForm.get("timeInBusinessMonths");
    const yearValue = yCtrl?.value;
    const monthValue = mCtrl?.value;
    if (yearValue == 0 && monthValue == 0) {
      yCtrl?.setErrors({ required: true });
      mCtrl?.setErrors({ required: true });
    } 
  }
}

