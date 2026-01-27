import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseCreditlineClass } from '../../base/base-creditline.class';
import { CreditlineDashboardService } from '../../services/creditline-dashboard.service';
import { takeUntil } from 'rxjs';
import { DrawdownService } from '../../../drawdown.service';

@Component({
  selector: 'app-creditline-drawdown-request-details',
  templateUrl: './creditline-drawdown-request-details.component.html',
  styleUrl: './creditline-drawdown-request-details.component.scss',
})
export class CreditlineDrawdownRequestDetailsComponent
  extends BaseCreditlineClass
  implements OnInit
{
  formFieldFlag: any = '';
  constructor(
    public override svc: CommonService,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public override route: ActivatedRoute,
    public override baseSvc: CreditlineDashboardService,
    public formDataService: DrawdownService
  ) {
    super(route, svc, baseSvc);
  }

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: ``,
    goBackRoute: '',
    cardType: 'non-border',
    fields: [
      {
        type: 'amount',
        name: 'purchasePrice',
        cols: 6,
        label: 'purchase_price',
        inputType: 'vertical',
        className: 'drawdown_details_field pb-4',
        labelClass: 'drawdowm-details-label drawdown-label',
        hidden: false,
        errorMessage: 'Field is required',
        nextLine: false,
      },
      {
        type: 'amount',
        name: 'workingCapital',
        cols: 6,
        label: 'working_capital',
        inputType: 'vertical',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field pb-4',
        maxLength: 15,
        hidden: false,
        errorMessage: 'Field is required',
      },
      {
        type: 'amount',
        name: 'lessDeposit',
        label: 'less_deposite',
        cols: 6,
        inputType: 'vertical',
        className: 'drawdown_details_field pb-4',
        labelClass: 'drawdowm-details-label drawdown-label',
        hidden: false,
        errorMessage: 'Less deposite should be less then Purchase Price',
        nextLine: false,
      },
      {
        type: 'date',
        name: 'reqDate',
        label: 'request_date',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field pb-4',
        inputType: 'vertical',
        validators: [Validators.required],
        cols: 6,
      },
      {
        type: 'date',
        name: 'payNewLoanOutOn',
        label: 'pay_new_loan_out_on',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field pb-4',
        inputType: 'vertical',
        validators: [Validators.required],
        hidden: false,
        cols: 6,
      },
      {
        type: 'date',
        name: 'payDrawdownDate',
        label: 'Pay Drawdown Out on',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field pb-4',
        inputType: 'vertical',
        validators: [Validators.required],
        hidden: false,
        cols: 6,
      },
      {
        type: 'amount',
        name: 'totalNewLoanAmt',
        label: 'total_new_loan_amount',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field pb-4',
        inputType: 'vertical',
        cols: 6,
        nextLine: false,
      },
      {
        type: 'amount',
        name: 'totalDrawdownAmt',
        label: 'total_drawdown_amount',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field pb-4',
        inputType: 'vertical',
        cols: 6,
        nextLine: false,
      },
    ],
  };

  override async ngOnInit() {
    super.ngOnInit();
    this.baseSvc?.setBaseCreditlineFormData(this.mainForm);
    this.baseSvc
      .getBaseCreditlineFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.onFormDataUpdate(res);
        this.baseFormData = res;
        if (
          this.baseFormData?.form?.controls['facility']?.value?.value ==
          'CurrentAccount'
        ) {
        }
      });
    this.formFieldFlag = this.dynamicDialogConfig?.data?.newLoan
      ? this.dynamicDialogConfig?.data.newLoan
      : this.dynamicDialogConfig?.data.drawdown;

    if (this.formFieldFlag == 'newLoanRequest') {
      this.mainForm?.updateHidden({ purchasePrice: true });
    }
    this.updateFormFields();
    this.mainForm?.form.valueChanges.subscribe((value) => {
      this.formDataService.updateFormData(this.mainForm?.form?.value);
    });
  }

  updateFormFields() {
    if (this.formFieldFlag == 'newLoanRequest') {
      this.mainForm?.updateHidden({ purchasePrice: true });
    }
  }
  override onButtonClick($event) {}

  override onFormEvent(event) {
    // if(this.mainForm.form.controls['purchasePrice'].value < this.mainForm.form.controls['lessDeposit'].value ){
    //   // this.mainForm.form.controls['lessDeposit'].
    //   this.mainForm.updateValidators('lessDeposit', [
    //           Validators.required,
    //         ]);
    // }
    // if(event.data == 'newLoanRequest'){

    //   this.mainForm.updateHidden({ payDrawdownAmt: true });
    // }

    // if(event.name == 'workingCapital'){
    //   if(!this.mainForm.form.controls['purchasePrice'].value){
    //     this.mainForm.updateValidators('workingCapital', [
    //       Validators.required,
    //     ]);
    //     this.mainForm.get('workingCapital').updateValueAndValidity();
    //   }
    // }

    // if(event.name == 'purchasePrice'){
    //   if(!this.mainForm.form.controls['workingCapital'].value){
    //     this.mainForm.updateValidators('purchasePrice', [
    //       Validators.required,
    //     ]);
    //     this.mainForm.get('purchasePrice').updateValueAndValidity();
    //   }
    // }
    if (event.name == 'payDrawdownDate' || 'payNewLoanOutOn') {
      const reqDate = new Date(this.mainForm?.form?.controls['reqDate']?.value);
      let payDrawdownDate = new Date(event.value);

      if (payDrawdownDate < reqDate) {
        const now = new Date();
        const currentHour = now.getHours();

        payDrawdownDate = new Date();
        if (currentHour >= 12) {
          payDrawdownDate.setDate(payDrawdownDate?.getDate() + 1);
        }
      }

      const PayDate = payDrawdownDate?.toISOString()?.split('T')[0];

      // if (event.name == 'payDrawdownDate') {
      //   this.mainForm?.form?.controls['payDrawdownDate']?.patchValue(PayDate);
      // }
      // if (event.name == 'payNewLoanOutOn') {
      //   this.mainForm?.form?.controls['payNewLoanOutOn']?.patchValue(PayDate);
      // }
    }

    if (event.name == 'reqDate') {
      const inputDate = this.mainForm?.form?.controls['reqDate']?.value;

      // Convert to Date object and clone for comparison
      const originalDate = new Date(inputDate);
      const changeDateFormat = new Date(inputDate);

      // Set specific time (e.g., 12:26:21)
      changeDateFormat.setHours(12);
      changeDateFormat.setMinutes(26);
      changeDateFormat.setSeconds(21);

      // Get the hour
      const currentHour = changeDateFormat.getHours();

      // Clone the date for selection
      let selectedDate = new Date(changeDateFormat);

      // If time is after or equal to 12 PM, move to tomorrow
      if (currentHour >= 12) {
        selectedDate.setDate(changeDateFormat.getDate() + 1);
      }

      // Final safeguard: ensure selectedDate is not less than inputDate
      if (selectedDate < originalDate) {
        selectedDate = new Date(originalDate); // reset to input date
      }

      const payDate = selectedDate.toISOString().split('T')[0];

      this.mainForm?.form?.controls['payDrawdownDate']?.patchValue(payDate);
      this.mainForm?.form?.controls['payNewLoanOutOn']?.patchValue(payDate);
    }

    super.onFormEvent(event);
  }

  override onValueTyped(event) {
    if (event.name == 'lessDeposit') {
      if (
        this.mainForm?.form?.controls['lessDeposit']?.value >
        this.mainForm?.form?.controls['purchasePrice']?.value
      ) {
        this.mainForm?.form?.controls['lessDeposit']?.patchValue(
          this.mainForm?.form?.controls['purchasePrice']?.value
        );
        this.mainForm?.get('lessDeposit')?.updateValueAndValidity();
      }
    }
  }
  override onValueChanges(event) {}
  override onFormReady() {
    this.mainForm?.form.valueChanges.subscribe((value) => {
      this.formDataService.updateFormData(this.mainForm?.form?.value);
    });
    if (this.formFieldFlag == 'newLoanRequest') {
      this.mainForm?.updateHidden({ purchasePrice: false });
      this.mainForm?.updateHidden({ lessDeposit: false });
      this.mainForm?.updateHidden({ payNewLoanOutOn: false });
      this.mainForm?.updateHidden({ totalNewLoanAmt: false });
      this.mainForm?.updateHidden({ payDrawdownDate: true });
      this.mainForm?.updateHidden({ workingCapital: true });
      this.mainForm?.updateHidden({ totalDrawdownAmt: true });

      let temp = new Date();
      const date = new Date(temp);

      const formattedDate = date.toISOString().slice(0, 10);
      this.mainForm?.form?.controls['reqDate']?.patchValue(formattedDate);

      // Input date string
      const inputDate = this.mainForm?.form?.controls['reqDate']?.value;

      // Create a Date object (sets time to midnight by default)
      const changeDateFormat = new Date(inputDate);

      // Optional: Set a specific time (e.g., 12:26:21)
      changeDateFormat.setHours(12);
      changeDateFormat.setMinutes(26);
      changeDateFormat.setSeconds(21);

      // Output in the full date string format

      const changedDateFormat = new Date(changeDateFormat.toString());
      const currentHour = changedDateFormat.getHours();

      // Check if time is after 12 PM (noon)
      let selectedDate = new Date(changedDateFormat); // Clone current date

      if (currentHour >= 12) {
        // If after 12 PM, set to tomorrow
        selectedDate.setDate(changedDateFormat.getDate() + 1);
      }

      // Format the selected date (optional)
      const payNewLoanOutOn = selectedDate.toISOString().split('T')[0];
      this.mainForm?.form?.controls['payNewLoanOutOn']?.patchValue(
        payNewLoanOutOn
      );
    }
    if (this.formFieldFlag == 'drawdownRequest') {
      this.mainForm?.updateHidden({ purchasePrice: true });
      this.mainForm?.updateHidden({ lessDeposit: true });
      this.mainForm?.updateHidden({ payNewLoanOutOn: true });
      this.mainForm?.updateHidden({ totalNewLoanAmt: true });
      this.mainForm?.updateHidden({ payDrawdownDate: false });
      this.mainForm?.updateHidden({ workingCapital: false });
      this.mainForm?.updateHidden({ totalDrawdownAmt: false });

      let temp = new Date();
      const date = new Date(temp);

      const formattedDate = date.toISOString().slice(0, 10);
      this.mainForm?.form?.controls['reqDate']?.patchValue(formattedDate);

      // Input date string
      const inputDate = this.mainForm?.form?.controls['reqDate']?.value;

      // Create a Date object (sets time to midnight by default)
      const changeDateFormat = new Date(inputDate);

      // Optional: Set a specific time (e.g., 12:26:21)
      changeDateFormat.setHours(12);
      changeDateFormat.setMinutes(26);
      changeDateFormat.setSeconds(21);

      // Output in the full date string format

      const changedDateFormat = new Date(changeDateFormat.toString());
      const currentHour = changedDateFormat.getHours();

      // Check if time is after 12 PM (noon)
      let selectedDate = new Date(changedDateFormat); // Clone current date

      if (currentHour >= 12) {
        // If after 12 PM, set to tomorrow
        selectedDate.setDate(changedDateFormat.getDate() + 1);
      }

      // Format the selected date (optional)
      const payDrawdownDate = selectedDate.toISOString().split('T')[0];
      this.mainForm?.form?.controls['payDrawdownDate']?.patchValue(
        payDrawdownDate
      );
    }
  }

  override onFormDataUpdate(res: any): void {
    if (res?.facility?.value == 'CurrentAccount') {
      this.mainForm?.updateHidden({ lessDeposit: true });
    }
    if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
    }
    // super.onFormDataUpdate(res);
  }
}
