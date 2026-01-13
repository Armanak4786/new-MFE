import { Component } from '@angular/core';
import { BaseTrustClass } from '../../../base-trust.class';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { TrustService } from '../../../services/trust.service';

@Component({
  selector: 'app-trust-balance-info',
  templateUrl: './trust-balance-info.component.html',
  styleUrl: './trust-balance-info.component.scss',
})
export class TrustBalanceInfoComponent extends BaseTrustClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public validationSvc: ValidationService,
    override baseSvc: TrustService
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
        name: 'trustAmountLabel',
        cols: 4,
        className: 'pl-5 col-offset-3 	',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Year Ending',
        name: 'trustYearEndingLabel',
        cols: 3,
        className:'text-center',
        nextLine: true,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Cash Balance',
        // name: 'trustCashBalance',
        name: 'amtCashBalLatestYr',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'trustCashBalanceDate',
        name: 'cashBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'trustDebtorBalance',
        name: 'amtDebtorBalLatestYr',
        label: 'Debtor Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'trustDebtorBalanceDate',
        name: 'debtorBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'trustCreditorBalance',
        name: 'amtCreditorBalLatestYr',
        label: 'Creditor Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'trustCreditorBalanceDate',
        name: 'creditorBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'trustOverDraftBalance',
        name: 'amtOverdraftBalLatestYr',
        label: 'Overdraft Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'trustOverDraftBalanceDate',
        name: 'overdraftBalLastYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
    ],
  };

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    this.trustSvc.updateComponentStatus("Finance Accounts", "TrustBalanceInfoComponent", this.mainForm.form.valid)
  }
 override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  

  private readonly minDate = '1900-01-01';

  override async onFormReady(): Promise<void> {
    super.onFormReady();
    this.normalizeMinDateFields();
    await this.updateValidation("onInit");
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

  private normalizeUiDate(value: any): any {
    return this.isPlaceholderMinDate(value) ? null : value;
  }

  private isPlaceholderMinDate(value: any): boolean {
    const dateStr = this.toDateString(value);
    if (!dateStr) return false;
    return dateStr.slice(0, 10) === this.minDate;
  }

  private normalizeMinDateFields(): void {
    const cashBalanceYearEndingCtrl: any = this.mainForm.get('cashBalLatestYrEndDt');
    const debtorBalanceYearEndingCtrl: any = this.mainForm.get('debtorBalLatestYrEndDt');
    const creditorBalanceYearEndingCtrl: any = this.mainForm.get('creditorBalLatestYrEndDt');
    const overdraftBalanceYearEndingCtrl: any = this.mainForm.get('overdraftBalLastYrEndDt');

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

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  pageCode: string = "TrustFinancialDetailComponent";
  modelName: string = "TrustBalanceInfoComponent";

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
  
  override renderComponentWithNewData(data?: any) {
    super.renderComponentWithNewData(data);
    this.normalizeMinDateFields();
  }
  
}



