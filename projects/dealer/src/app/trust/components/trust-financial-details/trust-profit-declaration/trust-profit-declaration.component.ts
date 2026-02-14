import { ChangeDetectorRef, Component } from '@angular/core';
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
    public validationSvc: ValidationService,
     private cdr: ChangeDetectorRef,
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    headerTitle: 'Profit Declaration',
    autoResponsive: true,
    api: '',
    goBackRoute: '',
    //cardBgColor: '--background-color-secondary',
    cardType: "border",
    fields: [
      {
        type: 'radio',
        label: 'Did you make a Net Profit last year?',
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
        nextLine: false,
        inputType:'vertical',
        hidden: true,
        className: 'px-0',
        default: 0,
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

    if(this.trustSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }

    if (this.baseFormData.isNetProfitLastYear != null) {
    this.mainForm.get("isNetProfitLastYear").patchValue(this.baseFormData.isNetProfitLastYear);
    }
  }

    override onFormEvent(event: any) {
    if (event.name === "isNetProfitLastYear" && event.value === false) {
      this.mainForm.updateHidden({
        amtLastYearNetProfit: true
      });
      this.mainForm.get('amtLastYearNetProfit').patchValue(0);
      this.cdr.detectChanges();
    }
    if (event.name === "isNetProfitLastYear" && event.value === true) {
      this.mainForm.updateHidden({
        amtLastYearNetProfit: false
      });
      this.cdr.detectChanges();
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
    this.trustSvc.updateComponentStatus("Financial Position", "TrustProfitDeclarationComponent", this.mainForm.form.valid)

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
    const isNetProfitValue = this.mainForm.get('isNetProfitLastYear')?.value;
    if (isNetProfitValue === true) {
      this.mainForm.updateHidden({
        amtLastYearNetProfit: false
      });
    } else {
      this.mainForm.updateHidden({
        amtLastYearNetProfit: true
      });
    }
    
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

  

    return responses.status;
  }
}

  

