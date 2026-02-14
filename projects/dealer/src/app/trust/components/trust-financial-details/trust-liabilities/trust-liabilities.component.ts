import { Component } from '@angular/core';
import { BaseTrustClass } from '../../../base-trust.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { TrustService } from '../../../services/trust.service';

@Component({
  selector: 'app-trust-liabilities',
  templateUrl: './trust-liabilities.component.html',
  styleUrl: './trust-liabilities.component.scss',
})
export class TrustLiabilitiesComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
     public validationSvc: ValidationService,
    override baseSvc: TrustService
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    headerTitle: '',
    autoResponsive: true,
    cardType: 'non-border',
    api: '',
    goBackRoute: '',
    //cardBgColor: '--background-color-secondary',
    fields: [
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Liabilites Type',
        name: 'liabilitesTypeLabel',
        cols: 4,
        className: ' pl-0	',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Balance / Limit',
        name: 'liabilitesBalanceLimitLabel',
        cols: 3,
        className: '',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Monthly Amount',
        name: 'liabilitesAmountLabel',
        cols: 3,
        className: 'text-center',
        nextLine: true,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Mortgage / Rent',      //Mortgage
        name: 'trustmortgageBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: ' col-5 ',
        default: 0,
        className:'pl-0'
        // hidden: false,
      },
      {
        type: 'amount',
        name: 'trustMortgageRentAmount',
        cols: 3,
        default: 0,
        hidden: false,
      },
      // {
      //   type: 'amount',
      //   inputType: 'horizontal',
      //   label: 'Mortgage/Rent',    //Rent
      //   name: 'trustRentBalance',
      //   cols: 7,
      //   labelClass: 'col-6',
      //   inputClass: ' col-5 ',
      //   default: 0,
      //   hidden: false,
      // }, 
      // {
      //   type: 'amount',
      //   name: 'trustRentAmount',
      //   cols: 3,
      //   default: 0,
      //   hidden: false,
      // },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Loans',
        name: 'trustloansBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: ' col-5 ',
        default : 0,
        className:'pl-0'
      },
      {
        type: 'amount',
        name: 'trustloansAmount',
        cols: 3,
        nextLine: true,
        default: 0,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Credit Cards',
        name: 'trustcreditcardBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: ' col-5 ',
        default : 0,
        className:'pl-0'
      },
      {
        type: 'amount',
        name: 'trustcreditcardAmount',
        cols: 3,
        nextLine: true,
        default: 0,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Other Liabilities\n(Including Overdrafts, Taxes Due etc)',
        name: 'trustotherBalance',
        cols: 7,
        labelClass: 'col-6 multi-line-label',
        inputClass: ' col-5',
        default : 0,
        className:'pl-0'
      },
      {
        type: 'amount',
        name: 'trustotherAmount',
        cols: 3,
        nextLine: true,
        default: 0,
        className: 'mt-2'
      },
      {
        type: 'number',
        name: 'mortageId',
        hidden: true
      },
      // {
      //   type: 'number',
      //   name: 'rentId',
      //   hidden: true
      // },
      {
        type: 'number',
        name: 'creditId',
        hidden: true
      },
      {
        type: 'number',
        name: 'loanId',
        hidden: true
      },
      {
        type: 'number',
        name: 'otherLiabilitiesId',
        hidden: true
      },
      {
        type: 'number',
        name: 'trustfinancialPositionLiabilityId',
        hidden: true
      },
      {
        type: 'number',
        name: 'mortagefinancialPositionLiabilityId',
        hidden: true
      },
      // {
      //   type: 'number',
      //   name: 'rentfinancialPositionLiabilityId',
      //   hidden: true
      // },
      {
        type: 'number',
        name: 'loanfinancialPositionLiabilityId',
        hidden: true
      },
      {
        type: 'number',
        name: 'creditfinancialPositionLiabilityId',
        hidden: true
      },
      {
        type: 'number',
        name: 'otherfinancialPositionLiabilityId',
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
    
    if(this.trustSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }
  }

   override onStepChange(stepperDetails: any): void {
      super.onStepChange(stepperDetails);
      this.trustSvc.updateComponentStatus("Financial Position", "TrustLiabilitiesComponent", this.mainForm.form.valid)
       if(this.trustSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.trustSvc.iconfirmCheckbox.next(invalidPages)
    }
    }

    override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  pageCode: string = "TrustFinancialDetailComponent";
  modelName: string = "TrustLiabilitiesComponent";

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

  // override async ngOnInit(): Promise<void> {
  //    await super.ngOnInit();
  //    console.log(this.baseFormData, this.baseFormData.physicalResidenceType,  "residenceType");
  //    const residenceType = (this.baseFormData.physicalResidenceType || this.baseFormData?.addressDetails?.physicalResidenceType || '').toString().toLowerCase();
  //    console.log(residenceType,  "residenceType");
    
  //     if(residenceType == 'mortgage'){
  //       this.mainForm.updateHidden({
  //         trustRentAmount: true,
  //         trustRentBalance: true,
  //         trustMortgageRentAmount: false,
  //         trustmortgageBalance: false

  //     });
  //     }
  //     else if(residenceType == 'renting'){
  //       this.mainForm.updateHidden({
  //         trustMortgageRentAmount: true,
  //         trustmortgageBalance: true,
  //         trustRentAmount: false,
  //         trustRentBalance: false,
  //     });
  //     // this.cdr.detectChanges();
  //     }
  //     else{
  //       this.mainForm.updateHidden({
  //         trustMortgageRentAmount: true,
  //         trustmortgageBalance: true,
  //         trustRentAmount: true,
  //         trustRentBalance: true,
  //       });
  //     }
     

  // }
  
  // override onValueChanges(event: any): void {
  //   console.log("this.data: ", this.data,"event: ", event,"this.formconfig: ", this.formConfig)
  // }
}
