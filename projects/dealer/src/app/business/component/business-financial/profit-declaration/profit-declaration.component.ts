import { Component } from '@angular/core';
import { BaseBusinessClass } from '../../../base-business.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { BusinessService } from '../../../services/business';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-profit-declaration',
  templateUrl: './profit-declaration.component.html',
  styleUrl: './profit-declaration.component.scss',
})
export class ProfitDeclarationComponent extends BaseBusinessClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: BusinessService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    headerTitle: 'Profit Declaration',
    autoResponsive: true,
    api: '',
    goBackRoute: '',
    cardBgColor: '--background-color-secondary',
    cardType: "non-border",
    fields: [
      {
        type: 'radio',
        label: 'Did you make a net profit last year?',
        // name: 'isProfit',
        name: 'isNetProfitLastYear',
        // validators: [Validators.required],
        cols: 12,
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
        alignmentType: 'horizontal',
        labelClass: 'col-5',
        inputClass: 'col-5',
        nextLine: false,
        default: null, 
      },
      {
        type: 'amount',
        label: 'Net Profit Last Year',
        // name: 'netProfit',
        name: 'amtLastYearNetProfit',
        // validators: [Validators.required],
        cols: 4,
        className : 'px-0',
        nextLine: false,
        default: 0,
        hidden: true
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit()
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

  }

  override onFormEvent(event: any) {
    if (event.name === "isNetProfitLastYear" && event.value === false) {
      this.mainForm.updateHidden({
        amtLastYearNetProfit: true
      });
      this.mainForm.get('amtLastYearNetProfit').patchValue(0);
    }

    if (event.name === "isNetProfitLastYear" && event.value === true) {
      this.mainForm.updateHidden({
        amtLastYearNetProfit: false
      });
    }
    super.onFormEvent(event);

    this.updateValidation('onInit');
   }

  // override onFormDataUpdate(res: any): void {            //For rentntion of value during step change
  //   // console.log(res)
  //   if(res?.isNetProfitLastYear === "false"){
  //   this.mainForm.updateHidden({
  //     amtLastYearNetProfit : true
  //   })
  //   this.mainForm.get('amtLastYearNetProfit').patchValue(0)
  //   // console.log("test",this.mainForm.value)
  // }
  // if(res?.isNetProfitLastYear === "true"){
  //   this.mainForm.updateHidden({
  //     amtLastYearNetProfit : false
  //   })
  //   // this.mainForm.get('amtLastYearNetProfit').setValidators([Validators.required])
  //   }
  // }

  pageCode: string = "BusinessComponent";
  modelName: string = "ProfitDeclarationComponent";

  // override async onFormEvent(event: any): Promise<void> {

  //   super.onFormEvent(event);
  //   // if(event.name === "isNetProfitLastYear"){
  //   // await this.updateValidation("onInit");
  //   // }
    
  // }

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {

    if(event.name === "isNetProfitLastYear"){
      await this.updateValidation(event);
    }
  }

  override async onValueTyped(event: any): Promise<void> {
    if(event.name === "isNetProfitLastYear"){
      await this.updateValidation(event);
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

    // this.mainForm.get("tradingName").removeValidators(Validators.required);

    return responses.status;
  }

  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);

    this.baseSvc.updateComponentStatus(
      "Financial Accounts",
      "ProfitDeclarationComponent",
      this.mainForm.form.valid
    );

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
  }
  
}
