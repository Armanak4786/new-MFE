import { Component } from '@angular/core';
import { BaseTrustClass } from '../../../base-trust.class';
import { TrustService } from '../../../services/trust.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-trust-profit-declaration',
  templateUrl: './trust-profit-declaration.component.html',
  styleUrl: './trust-profit-declaration.component.scss',
})
export class TrustProfitDeclarationComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: TrustService,
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
        inputClass: 'col-3',
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
        nextLine: false,
        hidden: true,
        className: 'px-0',
        default: 0,
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit()

    if(this.trustSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }

    if (this.baseFormData.isNetProfitLastYear != null) {
    this.mainForm.get("isNetProfitLastYear").patchValue(this.baseFormData.isNetProfitLastYear);
    }
  }

    override onFormEvent(event: any) {
      // console.log(event)
      if(event.name === "isNetProfitLastYear" && event.value === false){
      this.mainForm.updateHidden({
        amtLastYearNetProfit : true
      })
      this.mainForm.get('amtLastYearNetProfit').patchValue(0)
      // console.log("test",this.mainForm.value)
    }
    if(event.name === "isNetProfitLastYear" && event.value === true){
      this.mainForm.updateHidden({
        amtLastYearNetProfit : false
      })
      // this.mainForm.get("amtLastYearNetProfit").setValidators([Validators.required, Validators.min(1)])
      // this.mainForm.updateProps("amtLastYearNetProfit",  { errorMessage: "Amount is required"})
      }
      super.onFormEvent(event);
      this.updateValidation('onInit');

     }

    // override onFormDataUpdate(res: any): void {          //For retention of value during step change
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
    //   } 
    // }

    //  override onStepChange(stepperDetails: any): void {
    //    console.log(this.baseFormData, this.mainForm)
    //  }
  
   override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    this.trustSvc.updateComponentStatus("Finance Accounts", "TrustProfitDeclarationComponent", this.mainForm.form.valid)

    if(this.trustSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.trustSvc.iconfirmCheckbox.next(invalidPages)
    }
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
}

  

