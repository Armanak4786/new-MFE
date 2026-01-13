import { Component, OnDestroy } from '@angular/core';
import { BaseTrustClass } from '../../../base-trust.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig, ValidationService } from 'auro-ui';
import { TrustService } from '../../../services/trust.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trust-turnover-info',
  templateUrl: './trust-turnover-info.component.html',
  styleUrl: './trust-turnover-info.component.scss',
})
export class TrustTurnoverInfoComponent extends BaseTrustClass implements OnDestroy {
  private valueChangesSub: Subscription;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
     public validationSvc: ValidationService,
    override baseSvc: TrustService
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
        name: 'trustTurnOverAmountLabel',
        cols: 4,
        className: 'col-offset-3 text-center',
      },
      {
        type: 'label-only',
        typeOfLabel: 'inline',
        label: 'Year Ending',
        name: 'trusTturnOverYearEndingLabel',
        cols: 3,
        className:'text-center',
        nextLine: true,
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        label: 'Turnover (Latest Year)',
        // name: 'trustTurnoverLatestYear',
        name: 'amtTurnoverLatestYear',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'trustTurnoverLatestDate',
        name: 'turnoverLatestYearEndingDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
      {
        type: 'amount',
        inputType: 'horizontal',
        // name: 'trustTurnoverPreviousYear',
        name: 'amtTurnoverPrevYear',
        label: 'Turnover (Previous Year)',
        cols: 7,
        inputClass: ' col-6 ',
        labelClass: 'col-6',
        default: 0,
      },
      {
        type: 'date',
        // name: 'trustTurnoverPreviousDate',
        name: 'turnoverPrevYearEndingDt',
        cols: 3,
        nextLine: false,
        maxDate: new Date(), 
      },
    ],
  };

  private readonly minDate = '1900-01-01';

  override async onFormReady() {
    super.onFormReady();
    this.normalizeMinDateFields();
    // Store the subscription to unsubscribe later
    this.valueChangesSub = this.mainForm.valueChanges.subscribe();
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

  private normalizeMinDateFields(): void {
    const latestYearEndingCtrl: any = this.mainForm.get('turnoverLatestYearEndingDt');
    const prevYearEndingCtrl: any = this.mainForm.get('turnoverPrevYearEndingDt');

    if (latestYearEndingCtrl) {
      const currentVal = latestYearEndingCtrl.value;
      const nextVal = this.normalizeUiDate(currentVal);
      if (nextVal !== currentVal) {
        latestYearEndingCtrl.patchValue(nextVal, { emitEvent: false });
      }
    }

    if (prevYearEndingCtrl) {
      const currentVal = prevYearEndingCtrl.value;
      const nextVal = this.normalizeUiDate(currentVal);
      if (nextVal !== currentVal) {
        prevYearEndingCtrl.patchValue(nextVal, { emitEvent: false });
      }
    }
  }

  private isPlaceholderMinDate(value: any): boolean {
    const dateStr = this.toDateString(value);
    if (!dateStr) return false;
    return dateStr.slice(0, 10) === this.minDate;
  }

  override onValueChanges(event: any): void {
    // Only proceed if turnoverLatestYearEndingDt changed
    if (event?.turnoverLatestYearEndingDt) {
      const latestDate = new Date(event.turnoverLatestYearEndingDt);
      const prevYearDate = new Date(latestDate);
      prevYearDate.setFullYear(latestDate.getFullYear() - 1);

      // Unsubscribe to prevent loop
      this.valueChangesSub?.unsubscribe();

      // Patch the value
      this.mainForm.get('turnoverPrevYearEndingDt').patchValue(prevYearDate, { emitEvent: false });

      // Resubscribe to value changes
      this.valueChangesSub = this.mainForm.valueChanges.subscribe();
    }
  }

  override ngOnDestroy() {
    this.valueChangesSub?.unsubscribe();
  }

  override renderComponentWithNewData(data?: any) {
    super.renderComponentWithNewData(data);
    this.normalizeMinDateFields();
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    super.onStepChange(quotesDetails);
    this.trustSvc.updateComponentStatus("Finance Accounts", "TrustTurnoverInfoComponent", this.mainForm.form.valid)
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
  
  pageCode: string = "TrustFinancialDetailComponent";
  modelName: string = "TrustTurnoverInfoComponent";

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
  
}



