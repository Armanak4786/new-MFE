import { Component } from '@angular/core';
import { BaseAssetlinkClass } from '../../../assetlink/base-assetlink.class';
import { FacilityType } from '../../../utils/common-enum';
import { GenericFormConfig } from 'auro-ui';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-drawdown-details',
  // standalone: true,
  // imports: [],
  templateUrl: './drawdown-details.component.html',
  styleUrls: ['./drawdown-details.component.scss'],
})
export class DrawdownDetailsComponent extends BaseAssetlinkClass {
  facilityType = FacilityType;
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: ``,
    goBackRoute: '',
    cardType: 'non-border',
    cardBgColor: '--background-color',
    fields: [
      {
        type: 'amount',
        name: 'purchasePrice',
        cols: 6,
        label: 'purchase_price',
        inputType: 'vertical',
        labelClass: 'drawdowm-details-label drawdown-label',
        className: 'drawdown_details_field',
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
        className: 'drawdown_details_field',
        labelClass: 'drawdowm-details-label drawdown-label',
        maxLength: 15,
        nextLine: false,
        errorMessageMap: {
          min: 'Deposit/Trade-in must be less than Purchase Price of Asset(s)',
        },
      },
      {
        type: 'amount',
        name: 'workingCapital',
        label: 'working_capital',
        labelClass: 'drawdowm-details-label drawdown-label mt-6',
        inputType: 'vertical',
        className: 'drawdown_details_field',
        cols: 6,
        maxLength: 15,
        errorMessage: 'Field is required',
      },
      {
        type: 'date',
        name: 'reqDate',
        label: 'request_date',
        labelClass: 'drawdowm-details-label drawdown-label mt-6',
        inputType: 'vertical',
        validators: [Validators.required],
        className: 'drawdown_details_field',
        cols: 6,
      },
      {
        type: 'date',
        name: 'payDrawdownAmt',
        label: 'pay_drawdown_out_on',
        labelClass: 'drawdowm-details-label drawdown-label mt-6',
        inputType: 'vertical',
        className: 'drawdown_details_field',
        validators: [Validators.required],
        cols: 6,
      },
      {
        type: 'amount',
        name: 'totalDrawdownAmt',
        label: 'total_drawdown_amount',
        labelClass: 'drawdowm-details-label drawdown-label mt-6',
        inputType: 'vertical',
        className: 'drawdown_details_field',
        cols: 6,
        nextLine: false,
      },
    ],
  };

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }
  override onButtonClick($event) {}

  override onFormEvent(event) {
    if (event.name == 'lessDeposit') {
      if (
        this.mainForm?.get('purchasePrice')?.value <
        this.mainForm?.get('lessDeposit')?.value
      ) {
        // this.mainForm.form.controls['lessDeposit'].;
        // this.mainForm
        //   ?.get('lessDeposit')
        //   ?.patchValue(this.mainForm?.get('purchasePrice')?.value);
      }
    }

    if (event.name == 'workingCapital') {
      // if(!this.mainForm.form.controls['purchasePrice'].value){
      //   this.mainForm.updateValidators('workingCapital', [
      //     Validators.required,
      //   ]);
      //   // this.mainForm.get('workingCapital').updateValueAndValidity();
      // }
      // if(!(this.mainForm.get('purchasePrice').value)){
      //   this.mainForm.updateValidators('purchasePrice', [
      //     Validators.required,
      //   ]);
      //   this.mainForm.get('purchasePrice').updateValueAndValidity();
      // }
    }

    if (event.name == 'purchasePrice') {
      if (!this.mainForm?.get('workingCapital')?.value) {
        this.mainForm?.updateValidators('purchasePrice', [Validators.required]);
        // this.mainForm.get('purchasePrice').updateValueAndValidity();
      } else {
        this.mainForm?.removeValidators('purchasePrice', [Validators.required]);
        // this.mainForm?.controls['purchasePrice']?.removeValidators(Validators.required);
      }
    }

    if (event.name == 'payDrawdownAmt') {
      const reqDate = new Date(this.mainForm?.form?.controls['reqDate']?.value);
      let payDrawdownDate = new Date(event.value);

      // Check if y is less than x
      if (payDrawdownDate < reqDate) {
        const now = new Date();
        const currentHour = now.getHours();

        // If time >= 12 PM, set y to tomorrow; else today
        payDrawdownDate = new Date();
        if (currentHour >= 12) {
          payDrawdownDate.setDate(payDrawdownDate.getDate() + 1);
        }
      }

      // Format y as YYYY-MM-DD for output
      const updatedPayDrawdownDate = payDrawdownDate
        .toISOString()
        .split('T')[0];

      console.log();

      // this.mainForm?.form?.controls['payDrawdownAmt'].patchValue(
      //   updatedPayDrawdownDate
      // );
    }

    if (event.name == 'reqDate') {
      const inputDate = this.mainForm?.form?.controls['reqDate']?.value; // in YYYY-MM-DD format

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

      // Format as YYYY-MM-DD
      const payDrawdownAmtOutonDate = selectedDate.toISOString().split('T')[0];

      console.log('this.mainForm', this.mainForm);

      this.mainForm?.form?.controls['payDrawdownAmt']?.patchValue(
        payDrawdownAmtOutonDate
      );
    }
    super.onFormEvent(event);
  }

  override onFormDataUpdate(res: any): void {
    if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
      this.mainForm?.get('workingCapital')?.patchValue('working');
    }
    if (res?.facilityType?.value) {
      console.log(
        'call the function if facility type changes',
        res?.facilityType?.value
      );
    }
  }
  override onValueTyped(event) {
    // console.log('event.name', event.name);
    // if (event.name == 'lessDeposit') {
    //   const DaystoFirstPaymentControl = this.mainForm.get('lessDeposit');
    //   DaystoFirstPaymentControl.clearValidators();
    //   DaystoFirstPaymentControl.setValidators([Validators.max(44)]);
    //   DaystoFirstPaymentControl.updateValueAndValidity();
    // }
  }
  // override onValueChanges(event) {}

  override onFormReady() {
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
    const payDrawdownAmtOutonDate = selectedDate.toISOString().split('T')[0];
    this.mainForm?.form?.controls['payDrawdownAmt']?.patchValue(
      payDrawdownAmtOutonDate
    );
  }
}
