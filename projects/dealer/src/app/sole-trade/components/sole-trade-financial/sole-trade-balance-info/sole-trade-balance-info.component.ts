import { Component } from '@angular/core';
import { BaseSoleTradeClass } from '../../../base-sole-trade.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { SoleTradeService } from '../../../services/sole-trade.service';

@Component({
  selector: 'app-sole-trade-balance-info',
  templateUrl: './sole-trade-balance-info.component.html',
  styleUrl: './sole-trade-balance-info.component.scss',
})
export class SoleTradeBalanceInfoComponent extends BaseSoleTradeClass {
    private readonly minDate = '1900-01-01';

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
         public validationSvc: ValidationService,
    override baseSvc: SoleTradeService
  ) {
    super(route, svc, baseSvc);
  }
  override formConfig: GenericFormConfig = {
    headerTitle: 'Balance Information',
    autoResponsive: true,
    api: '',
    goBackRoute: '',
    cardBgColor: '--background-color-secondary',
    cardType: 'non-border',
    fields: [
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Amount',
        name: 'balanceInfoAmountLabel',
        cols: 4,
        className: 'pl-5 col-offset-3	',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Year Ending',
        className:'text-center',
        name: 'balanceInfoYearEndingLabel',
        cols: 3,
        nextLine: true,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Cash Balance',
        name: 'soleTradeAmtCashBalLatestYr',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        name: 'soleTradeCashBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        name: 'soleTradeAmtDebtorBalLatestYr',
        label: 'Debtor Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        name: 'soleTradeDebtorBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        name: 'soleTradeAmtCreditorBalLatestYr',
        label: 'Creditor Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        name: 'soleTradeCreditorBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        name: 'soleTradeAmtOverdraftBalLatestYr',
        label: 'Overdraft Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        name: 'soleTradeOverdraftBalLastYrEndDt',
        cols: 3,
        nextLine: false,
      },
    ],
  };

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    this.baseSvc.updateComponentStatus("Financial Position", "SoleTradeBalanceInfoComponent", this.mainForm.form.valid)
  }   override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }
  
  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }
    override async onValueTyped(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }

  override onFormReady(): void {
    super.onFormReady();
    this.normalizeMinDateFields();
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

  private normalizeMinDateFields(): void {
    const cashBalanceYearEndingCtrl: any = this.mainForm.get('soleTradeCashBalLatestYrEndDt');
    const debtorBalanceYearEndingCtrl: any = this.mainForm.get('soleTradeDebtorBalLatestYrEndDt');
    const creditorBalanceYearEndingCtrl: any = this.mainForm.get('soleTradeCreditorBalLatestYrEndDt');
    const overdraftBalanceYearEndingCtrl: any = this.mainForm.get('soleTradeOverdraftBalLastYrEndDt');

    if (cashBalanceYearEndingCtrl) {
      const currentVal = cashBalanceYearEndingCtrl.value;
      const nextVal = this.normalizeUiDate(currentVal);
      if (nextVal !== currentVal) {
        cashBalanceYearEndingCtrl.patchValue(nextVal, { emitEvent: false });
      }
    }

    if (debtorBalanceYearEndingCtrl) {
      const currentVal = debtorBalanceYearEndingCtrl.value;
      const nextVal = this.normalizeUiDate(currentVal);
      if (nextVal !== currentVal) {
        debtorBalanceYearEndingCtrl.patchValue(nextVal, { emitEvent: false });
      }
    }

    if (creditorBalanceYearEndingCtrl) {
      const currentVal = creditorBalanceYearEndingCtrl.value;
      const nextVal = this.normalizeUiDate(currentVal);
      if (nextVal !== currentVal) {
        creditorBalanceYearEndingCtrl.patchValue(nextVal, { emitEvent: false });
      }
    }

    if (overdraftBalanceYearEndingCtrl) {
      const currentVal = overdraftBalanceYearEndingCtrl.value;
      const nextVal = this.normalizeUiDate(currentVal);
      if (nextVal !== currentVal) {
        overdraftBalanceYearEndingCtrl.patchValue(nextVal, { emitEvent: false });
      }
    }
  }

  override renderComponentWithNewData(data?: any) {
    super.renderComponentWithNewData(data);
    this.normalizeMinDateFields();
  }
  pageCode: string = "soleTradeFinancialComponent";
  modelName: string = "SoleTradeBalanceInfoComponent";

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

  private toDateString(value: any): string | null {
    if (value == null) return null;
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const day = value.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (typeof value === 'string') return value;
    return String(value);
  }

  private isPlaceholderMinDate(value: any): boolean {
    const dateStr = this.toDateString(value);
    if (!dateStr) return false;
    return dateStr.slice(0, 10) === this.minDate;
  }

  private normalizeUiDate(value: any): any {
    return this.isPlaceholderMinDate(value) ? null : value;
  }
}
