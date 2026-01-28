import { Component } from '@angular/core';
import { BaseBusinessClass } from '../../../base-business.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { BusinessService } from '../../../services/business';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-balance-infomartion',
  templateUrl: './balance-infomartion.component.html',
  styleUrl: './balance-infomartion.component.scss',
})
export class BalanceInfomartionComponent extends BaseBusinessClass {
  private readonly minDate = '1900-01-01';
  private turnoverDateSub: Subscription;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
     public validationSvc: ValidationService,
    override baseSvc: BusinessService
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
        name: 'businessAmountLabel',
        cols: 4,
        className: 'pl-5 col-offset-3	',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Year Ending',
        name: 'businessYearEndingLabel',
        cols: 3,
        className:'text-center',
        nextLine: true,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Cash Balance',
        // name: 'cashBalance',
        name: 'amtCashBalLatestYr',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'cashBalanceDate',
        name: 'cashBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'debtorBalance',
        name: 'amtDebtorBalLatestYr',
        label: 'Debtor Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'debtorBalanceDate',
        name: 'debtorBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'creditorBalance',
        name: 'amtCreditorBalLatestYr',
        label: 'Creditor Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'creditorBalanceDate',
        name: 'creditorBalLatestYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'overDraftBalance',
        name: 'amtOverdraftBalLatestYr',
        label: 'Overdraft Balance',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'overDraftBalanceDate',
        name: 'overdraftBalLastYrEndDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
    ],
  };

  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails);
    this.baseSvc.updateComponentStatus("Financial Accounts", "BalanceInfomartionComponent", this.mainForm.form.valid)
  }

   override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    this.normalizeMinDateFields();
    this.turnoverDateSub = this.baseSvc.turnoverLatestDate$.subscribe(date => {
      if (date) {
        this.populateAllDatesWithTurnoverDate(date);
      }
    });

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

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  override async onValueTyped(event: any): Promise<void> {
    await this.updateValidation(event?.target?.value || event);
  }


  pageCode: string = "businessFinancialComponent";
  modelName: string = "BusinessBalanceInfoComponent";

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
private populateAllDatesWithTurnoverDate(turnoverDate: Date): void {
    const dateFields = [
      'cashBalLatestYrEndDt',
      'debtorBalLatestYrEndDt',
      'creditorBalLatestYrEndDt',
      'overdraftBalLastYrEndDt'
    ];

    dateFields.forEach(fieldName => {
      const control = this.mainForm?.get(fieldName);
      if (control) {
        if (!control.value || this.isPlaceholderMinDate(control.value)) {
          control.patchValue(new Date(turnoverDate), { emitEvent: false });
        }
      }
    });
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
  override ngOnDestroy(): void {
    this.turnoverDateSub?.unsubscribe();
    super.ngOnDestroy();
  }
}
