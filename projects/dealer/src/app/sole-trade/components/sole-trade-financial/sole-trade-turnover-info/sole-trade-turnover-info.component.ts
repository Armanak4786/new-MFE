import { Component } from '@angular/core';
import { BaseSoleTradeClass } from '../../../base-sole-trade.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { SoleTradeService } from '../../../services/sole-trade.service';

@Component({
  selector: 'app-sole-trade-turnover-info',
  templateUrl: './sole-trade-turnover-info.component.html',
  styleUrl: './sole-trade-turnover-info.component.scss',
})
export class SoleTradeTurnoverInfoComponent extends BaseSoleTradeClass {
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
    headerTitle: 'Turnover Information',
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
        name: 'turnOverAmountLabel',
        cols: 4,
        className: 'pl-5 col-offset-3	',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Year Ending',
        name: 'turnOverYearEndingLabel',
        cols: 3,
        nextLine: true,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Turnover (Latest Year)',
        name: 'soleTradeAmtTurnoverLatestYear',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        name: 'soleTradeturnoverLatestYearEndingDt',
        cols: 3,
        nextLine: false,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        name: 'soleTradeAmtTurnoverPrevYear',
        label: 'Turnover (Previous Year)',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default : 0,
      },
      {
        type: 'date',
        name: 'soleTradeTurnoverPrevYearEndingDt',
        cols: 3,
        nextLine: false,
      },
    ],
  };

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    this.baseSvc.updateComponentStatus("Financial Position", "SoleTradeTurnoverInfoComponent", this.mainForm.form.valid)
  }
     override async onBlurEvent(event): Promise<void> {
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
    const latestYearEndingCtrl: any = this.mainForm.get('soleTradeturnoverLatestYearEndingDt');
    const prevYearEndingCtrl: any = this.mainForm.get('soleTradeTurnoverPrevYearEndingDt');

    if (latestYearEndingCtrl) {
      const latestYearEndingVal = latestYearEndingCtrl.value;
      const nextLatestYearEndingVal = this.normalizeUiDate(latestYearEndingVal);
      if (nextLatestYearEndingVal !== latestYearEndingVal) {
        latestYearEndingCtrl.patchValue(nextLatestYearEndingVal, { emitEvent: false });
      }
    }

    if (prevYearEndingCtrl) {
      const prevYearEndingVal = prevYearEndingCtrl.value;
      const nextPrevYearEndingVal = this.normalizeUiDate(prevYearEndingVal);
      if (nextPrevYearEndingVal !== prevYearEndingVal) {
        prevYearEndingCtrl.patchValue(nextPrevYearEndingVal, { emitEvent: false });
      }
    }
  }

  override renderComponentWithNewData(data?: any) {
    super.renderComponentWithNewData(data);
    this.normalizeMinDateFields();
  }

  
  pageCode: string = "soleTradeFinancialComponent";
  modelName: string = "SoleTradeTrunoverInfoComponent";

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
