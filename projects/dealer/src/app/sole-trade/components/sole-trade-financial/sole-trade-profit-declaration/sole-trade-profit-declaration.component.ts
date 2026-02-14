import { Component } from '@angular/core';
import { BaseSoleTradeClass } from '../../../base-sole-trade.class';
import { SoleTradeService } from '../../../services/sole-trade.service';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-sole-trade-profit-declaration',
  templateUrl: './sole-trade-profit-declaration.component.html',
  styleUrl: './sole-trade-profit-declaration.component.scss',
})
export class SoleTradeProfitDeclarationComponent extends BaseSoleTradeClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    headerTitle: 'Profit Declaration',
    autoResponsive: true,
    api: '',
    goBackRoute: '',
    //cardBgColor: '--background-color-secondary',
    cardType: 'border',
    fields: [
      {
        type: 'radio',
        label: 'Did you make a Net Profit last year?',
        name: 'soleTradeisNetProfitLastYear',
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
        label: 'Net Profit last year',
        name: 'soleTradeAmtLastYearNetProfit',
        // validators: [Validators.required],
        cols: 4,
        className : 'px-0',
        nextLine: false,
        hidden: true,
        default: 0,
        inputType: 'vertical',
      },
    ],
  };


   override async ngOnInit(): Promise<void> {
    await super.ngOnInit()
    if(this.baseSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }
    if (this.baseFormData.soleTradeisNetProfitLastYear != null) {
    this.mainForm.get("soleTradeisNetProfitLastYear").patchValue(this.baseFormData.soleTradeisNetProfitLastYear);
    }
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
  }

    override onFormEvent(event: any) {
      // console.log(event)
      if(event.name === "soleTradeisNetProfitLastYear" && event.value === false){
      this.mainForm.updateHidden({
        soleTradeAmtLastYearNetProfit : true
      })
      this.mainForm.get('soleTradeAmtLastYearNetProfit').patchValue(0)
      // console.log("test",this.mainForm.value)
    }
    if(event.name === "soleTradeisNetProfitLastYear" && event.value === true){
      this.mainForm.updateHidden({
        soleTradeAmtLastYearNetProfit : false
      })
      // this.mainForm.get("soleTradeAmtLastYearNetProfit").setValidators([Validators.required, Validators.min(1)])
      // this.mainForm.updateProps("soleTradeAmtLastYearNetProfit",  { errorMessage: "Amount is required"})
      }
      super.onFormEvent(event);
      this.updateValidation('onInit');

     }

     pageCode: string = "TrustComponent";
  modelName: string = "TrustProfitDeclarationComponent";

  // override onFormEvent(event: any): void {
  //   super.onFormEvent(event);
  // }

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
  
  override async onValueTyped(event: any): Promise<void> {
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
    this.baseSvc.updateComponentStatus("Financial Position", "SoleTradeProfitDeclarationComponent", this.mainForm.form.valid)
  }
}
