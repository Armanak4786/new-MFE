import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { BaseSoleTradeClass } from '../../../base-sole-trade.class';
import {
  CommonService,
  GenericFormConfig,
  ValidationService,
} from 'auro-ui';
import { SoleTradeService } from '../../../services/sole-trade.service';

@Component({
  selector: 'app-sole-trade-liabilities',
  templateUrl: './sole-trade-liabilities.component.html',
  styleUrl: './sole-trade-liabilities.component.scss',
})
export class SoleTradeLiabilitiesComponent extends BaseSoleTradeClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
  }
private originalInputValues: { [key: string]: string } = {};
  override formConfig: GenericFormConfig = {
    headerTitle: '',
    autoResponsive: true,
    cardBgColor: '--background-color-secondary',
    cardType: 'non-border',
    api: '',
    goBackRoute: '',
    fields: [
      // ——— label row ———
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Liabilities Type',
        name: 'liabilitesTypeLabel',
        className: 'mb-3',
        cols: 4,
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Balance/limit',
        name: 'liabilitesBalanceLimitLabel',
        cols: 3,
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Monthly Payment',
        name: 'liabilitesAmountLabel',
        cols: 3,
        className:'text-center',
        nextLine: true,
      },
      // ——— mortgage / rent ———
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Mortgage/Rent',
        name: 'soleTrademortgageBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: 'col-5',
        default: 0,
      },
      {
        type: 'amount',
        name: 'soleTradeMortgageAmount',
        cols: 3,
        default: 0,
      },
      // ——— loans ———
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Loans',
        name: 'soleTradeloansBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: 'col-5',
        default: 0,
      },
      {
        type: 'amount',
        name: 'soleTradeloansAmount',
        cols: 3,
        nextLine: true,
        default: 0,
      },
      // ——— credit cards ———
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Credit Cards',
        name: 'soleTradecreditcardBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: 'col-5',
        default: 0,
      },
      {
        type: 'amount',
        name: 'soleTradecreditcardAmount',
        cols: 3,
        nextLine: true,
        default: 0,
      },
      // ——— other liabilities ———
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Other Liabilities',
        name: 'soleTradeotherBalance',
        cols: 7,
        labelClass: 'col-6',
        inputClass: 'col-5',
        default: 0,
      },
      {
        type: 'amount',
        name: 'soleTradeotherAmount',
        cols: 3,
        nextLine: true,
        default: 0,
      },
      // ——— hidden ids ———
      { type: 'number', name: 'mortageId', hidden: true },
      { type: 'number', name: 'creditId', hidden: true },
      { type: 'number', name: 'loanId', hidden: true },
      { type: 'number', name: 'otherLiabilitiesId', hidden: true },
      { type: 'number', name: 'trustfinancialPositionLiabilityId', hidden: true },
      { type: 'number', name: 'mortagefinancialPositionLiabilityId', hidden: true },
      { type: 'number', name: 'loanfinancialPositionLiabilityId', hidden: true },
      { type: 'number', name: 'creditfinancialPositionLiabilityId', hidden: true },
      { type: 'number', name: 'otherfinancialPositionLiabilityId', hidden: true },
    ],
  };

  // ——— life-cycle ———
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // console.log(' DEBUG - Component initialized');
  // console.log(' DEBUG - Form config:', this.formConfig);
  // console.log(' DEBUG - Show validation message flag:', this.baseSvc.showValidationMessage);
  
    if (this.baseSvc.showValidationMessage) {
      this.mainForm.form.markAllAsTouched();
    }
    this.updateValidation('onInit');
  }

  override async onFormReady(): Promise<void> {
    await this.updateValidation('onFormReady');
  }
   override async onValueEvent(event:any): Promise<void> {
    await this.updateValidation(event);
  }

  override async onFormEvent(event:any): Promise<void> {
    await this.updateValidation(event);

    super.onFormEvent(event)
  }

  // ——— events ———
  override onValueChanges(event: any): void {
    // running total calculation
    const getAmount = (val: any) => Number(val) || 0;
    const total =
      getAmount(event.soleTradeloansAmount) +
      getAmount(event.soleTradecreditcardAmount) +
      getAmount(event.soleTradeotherAmount) +
      getAmount(event.soleTradeRentAmount) +
      getAmount(event.soleTradeMortgageAmount);
    this.baseSvc.totalPaymentAmount.next(total);

    // live validation
    this.updateValidation(event);
  }

  override async onBlurEvent(event: any): Promise<void> {
    await this.updateValidation(event);

     super.onBlurEvent(event)
  }

  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event);
  }


  // ——— stepper ———
  override async onStepChange(step: any): Promise<void> {
    super.onStepChange(step);
    this.baseSvc.updateComponentStatus(
      'Financial Position',
      'SoleTradeLiabilitiesComponent',
      this.mainForm.form.valid
    );
  }

  // ——— validation handler ———
  pageCode = 'SoleTradeFinancialComponent';
  modelName = 'SoleTradeLiabilitiesComponent';

  async updateValidation(event: any) {
  // Handle different event types properly
  let eventParam: any;
  
  if (typeof event === 'string') {
    // Lifecycle events like 'onInit', 'onSubmit'
    eventParam = event;
  } else if (event?.name) {
    // Form field events with name property
    eventParam = event.name;
  } else if (event?.target?.name) {
    // DOM events with target name
    eventParam = event.target.name;
  } else {
    // Fallback to the event itself
    eventParam = event;
  }

  // console.log('DEBUG - Event param being sent:', eventParam);
  
  const req = {
    form: this.mainForm?.form,
    formConfig: this.formConfig,
    event: eventParam,  // ✅ Use processed event parameter
    modelName: this.modelName,
    pageCode: this.pageCode,
  };
  
  // console.log('DEBUG - Validation Request:', req);
  
  const res = await this.validationSvc.updateValidation(req);
  
  if (!res.status && res.updatedFields.length) {
    await this.mainForm.applyValidationUpdates(res);
  }
  
  return res.status;
}

 
}
