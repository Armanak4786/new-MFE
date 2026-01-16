// import { Component } from '@angular/core';
// import { Validators } from '@angular/forms';
// import { GenericFormConfig } from 'auro-ui';
// import { BaseDashboardClass } from '../../../base-dashboard.class';

// @Component({
//   selector: 'app-drawdown-details',
//   templateUrl: './drawdown-details.component.html',
//   styleUrls: ['./drawdown-details.component.scss'],
// })
// export class DrawdownDetailsComponent extends BaseDashboardClass {
//   override formConfig: GenericFormConfig = {
//     autoResponsive: true,
//     api: ``,
//     goBackRoute: '',
//     cardType: 'non-border',
//     cardBgColor: '--background-color',
//     fields: [
//       {
//         type: 'amount',
//         name: 'purchasePrice',
//         cols: 6,
//         label: 'purchase_price',
//         inputType: 'vertical',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         className: 'drawdown_details_field pb-4',
//         maxLength: 15,
//         hidden: false,
//         errorMessage: 'Field is required',
//       },
//       {
//         type: 'amount',
//         name: 'lessDeposit',
//         label: 'less_deposite',
//         cols: 6,
//         inputType: 'vertical',
//         className: 'drawdown_details_field pb-4',
//         labelClass: 'drawdowm-details-label drawdown-label ',
//         maxLength: 15,
//         nextLine: false,
//         hidden: false,
//         errorMessageMap: {
//           min: 'Deposit/Trade-in must be less than Purchase Price of Asset(s)',
//         },
//       },
//       {
//         type: 'amount',
//         name: 'workingCapital',
//         label: 'working_capital',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         inputType: 'vertical',
//         className: 'drawdown_details_field pb-4',
//         cols: 6,
//         maxLength: 15,
//         hidden: false,
//         errorMessage: 'Field is required',
//       },
//       {
//         type: 'date',
//         name: 'reqDate',
//         label: 'request_date',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         inputType: 'vertical',
//         validators: [Validators.required],
//         className: 'drawdown_details_field pb-4',
//         hidden: false,
//         cols: 6,
//       },
//       {
//         type: 'date',
//         name: 'payDrawdownDate',
//         label: 'pay_drawdown_out_on',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         inputType: 'vertical',
//         className: 'drawdown_details_field pb-1',
//         validators: [Validators.required],
//         hidden: false,
//         cols: 6,
//       },
//       {
//         type: 'amount',
//         name: 'totalDrawdownAmt',
//         label: 'total_drawdown_amount',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         inputType: 'vertical',
//         className: 'drawdown_details_field pb-1',
//         cols: 6,
//         hidden: false,
//         nextLine: false,
//       },
//       {
//         type: 'date',
//         name: 'payNewLoanOutOn',
//         label: 'pay_new_loan_out_on',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         className: 'drawdown_details_field pb-4',
//         inputType: 'vertical',
//         validators: [Validators.required],
//         hidden: false,
//         cols: 6,
//       },
//       {
//         type: 'amount',
//         name: 'totalNewLoanAmt',
//         label: 'total_new_loan_amount',
//         labelClass: 'drawdowm-details-label drawdown-label',
//         className: 'drawdown_details_field pb-4',
//         inputType: 'vertical',
//         cols: 6,
//         hidden: false,
//         nextLine: false,
//       },
//     ],
//   };

//   override onFormEvent(event) {
//     if (event.name == 'lessDeposit') {
//       if (
//         this.mainForm?.get('purchasePrice')?.value <
//         this.mainForm?.get('lessDeposit')?.value
//       ) {
//         // this.mainForm.form.controls['lessDeposit'].;
//         // this.mainForm
//         //   ?.get('lessDeposit')
//         //   ?.patchValue(this.mainForm?.get('purchasePrice')?.value);
//       }
//     }

//     if (event.name == 'workingCapital') {
//       // if(!this.mainForm.form.controls['purchasePrice'].value){
//       //   this.mainForm.updateValidators('workingCapital', [
//       //     Validators.required,
//       //   ]);
//       //   // this.mainForm.get('workingCapital').updateValueAndValidity();
//       // }
//       // if(!(this.mainForm.get('purchasePrice').value)){
//       //   this.mainForm.updateValidators('purchasePrice', [
//       //     Validators.required,
//       //   ]);
//       //   this.mainForm.get('purchasePrice').updateValueAndValidity();
//       // }
//     }

//     if (event.name == 'purchasePrice') {
//       if (!this.mainForm?.get('workingCapital')?.value) {
//         this.mainForm?.updateValidators('purchasePrice', [Validators.required]);
//       } else {
//         this.mainForm?.removeValidators('purchasePrice', [Validators.required]);
//       }
//     }

//     if (event.name == 'payDrawdownDate') {
//       const reqDate = new Date(this.mainForm?.form?.controls['reqDate']?.value);
//       let payDrawdownDate = new Date(event.value);

//       if (payDrawdownDate < reqDate) {
//         const now = new Date();
//         const currentHour = now.getHours();

//         payDrawdownDate = new Date();
//         if (currentHour >= 12) {
//           payDrawdownDate.setDate(payDrawdownDate.getDate() + 1);
//         }
//       }

//       const updatedPayDrawdownDate = payDrawdownDate
//         .toISOString()
//         .split('T')[0];

//       this.mainForm?.form?.controls['reqDate'].patchValue(
//         updatedPayDrawdownDate
//       );
//     }

//     if (event.name == 'reqDate') {
//       const inputDate = this.mainForm?.form?.controls['reqDate']?.value;
//       // Convert to Date object and clone for comparison
//       const originalDate = new Date(inputDate);
//       const changeDateFormat = new Date(inputDate);

//       // Set specific time (e.g., 12:26:21)
//       changeDateFormat.setHours(12);
//       changeDateFormat.setMinutes(26);
//       changeDateFormat.setSeconds(21);

//       // Get the hour
//       const currentHour = changeDateFormat.getHours();

//       // Clone the date for selection
//       let selectedDate = new Date(changeDateFormat);

//       // If time is after or equal to 12 PM, move to tomorrow
//       if (currentHour >= 12) {
//         selectedDate.setDate(changeDateFormat.getDate() + 1);
//       }

//       // Final safeguard: ensure selectedDate is not less than inputDate
//       if (selectedDate < originalDate) {
//         selectedDate = new Date(originalDate); // reset to input date
//       }
//       const payDrawdownDate = selectedDate.toISOString().split('T')[0];
//       this.mainForm?.form?.controls['payDrawdownDate']?.patchValue(
//         payDrawdownDate
//       );
//       this.mainForm?.form?.controls['payNewLoanOutOn']?.patchValue(
//         payDrawdownDate
//       );
//     }
//     super.onFormEvent(event);
//   }

//   override onFormDataUpdate(res: any): void {
//     if (res?.facilityType == 'Asset Link') {
//       this.mainForm?.updateHidden({ totalNewLoanAmt: true });
//       this.mainForm?.updateHidden({ payNewLoanOutOn: true });
//     }

//     if (res?.facilityType == 'Easy Link') {
//       this.mainForm?.updateHidden({ totalNewLoanAmt: true });
//       this.mainForm?.updateHidden({ payNewLoanOutOn: true });
//       this.mainForm?.updateHidden({ workingCapital: true });

//       if (res.facility !== 'Current Account') {
//         this.mainForm?.updateHidden({ purchasePrice: false });
//         this.mainForm?.updateHidden({ lessDeposit: false });
//         this.mainForm?.updateHidden({ workingCapital: true });
//       } else {
//         this.mainForm?.updateHidden({ purchasePrice: true });
//         this.mainForm?.updateHidden({ lessDeposit: true });
//         this.mainForm?.updateHidden({ workingCapital: false });
//       }
//     }

//     if (res?.facilityType == 'CreditLines') {
//       this.mainForm?.updateHidden({ totalNewLoanAmt: false });
//       this.mainForm?.updateHidden({ payNewLoanOutOn: false });
//       this.mainForm?.updateHidden({ payDrawdownDate: true });
//       this.mainForm?.updateHidden({ totalDrawdownAmt: true });
//       this.mainForm?.updateHidden({ workingCapital: true });

//       if (res.facility !== 'Current Account') {
//         // this.mainForm?.updateHidden({ purchasePrice: false });
//         // this.mainForm?.updateHidden({ lessDeposit: false });
//         // this.mainForm?.updateHidden({ workingCapital: true });
//       } else {
//         this.mainForm?.updateHidden({ purchasePrice: true });
//         this.mainForm?.updateHidden({ lessDeposit: true });
//         this.mainForm?.updateHidden({ workingCapital: false });
//         this.mainForm?.updateHidden({ totalNewLoanAmt: true });
//         this.mainForm?.updateHidden({ totalDrawdownAmt: false });
//         this.mainForm?.updateHidden({ payNewLoanOutOn: true });
//         this.mainForm?.updateHidden({ payDrawdownDate: false });
//       }
//     }

//     if (res?.facilityType == 'Non facility loan') {
//       this.mainForm?.updateHidden({ totalNewLoanAmt: false });
//       this.mainForm?.updateHidden({ payNewLoanOutOn: false });
//       this.mainForm?.updateHidden({ payDrawdownDate: true });
//       this.mainForm?.updateHidden({ totalDrawdownAmt: true });
//       this.mainForm?.updateHidden({ workingCapital: true });
//       // this.mainForm?.updateHidden({ purchasePrice: true });

//       if (res.facility !== 'Current Account') {
//         // this.mainForm?.updateHidden({ purchasePrice: false });
//         // this.mainForm?.updateHidden({ lessDeposit: false });
//         // this.mainForm?.updateHidden({ workingCapital: true });
//       } else {
//         this.mainForm?.updateHidden({ purchasePrice: true });
//         this.mainForm?.updateHidden({ lessDeposit: true });
//         this.mainForm?.updateHidden({ workingCapital: false });
//         this.mainForm?.updateHidden({ totalNewLoanAmt: true });
//         this.mainForm?.updateHidden({ totalDrawdownAmt: false });
//         this.mainForm?.updateHidden({ payNewLoanOutOn: true });
//         this.mainForm?.updateHidden({ payDrawdownDate: false });
//       }
//     }

//     if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
//       this.mainForm?.get('workingCapital')?.patchValue('working');
//     }
//     if (res?.facilityType?.value) {
//       console.log(
//         'call the function if facility type changes',
//         res?.facilityType?.value
//       );
//     }
//     if (res.facility !== 'Current Account') {
//       this.mainForm?.updateHidden({ purchasePrice: false });
//       this.mainForm?.updateHidden({ lessDeposit: false });
//     } else {
//       this.mainForm?.updateHidden({ purchasePrice: true });
//       this.mainForm?.updateHidden({ lessDeposit: true });
//       this.mainForm?.updateHidden({ workingCapital: false });
//     }
//   }

//   override onFormReady() {
//     let temp = new Date();
//     const date = new Date(temp);
//     const formattedDate = date.toISOString().slice(0, 10);
//     this.mainForm?.form?.controls['reqDate']?.patchValue(formattedDate);

//     // Input date string
//     const inputDate = this.mainForm?.form?.controls['reqDate']?.value;

//     // Create a Date object (sets time to midnight by default)
//     const changeDateFormat = new Date(inputDate);

//     // Optional: Set a specific time (e.g., 12:26:21)
//     changeDateFormat.setHours(12);
//     changeDateFormat.setMinutes(26);
//     changeDateFormat.setSeconds(21);

//     // Output in the full date string format

//     const changedDateFormat = new Date(changeDateFormat.toString());
//     const currentHour = changedDateFormat.getHours();

//     // Check if time is after 12 PM (noon)
//     let selectedDate = new Date(changedDateFormat); // Clone current date

//     if (currentHour >= 12) {
//       // If after 12 PM, set to tomorrow
//       selectedDate.setDate(changedDateFormat.getDate() + 1);
//     }

//     // Format the selected date (optional)
//     const paymentDate = selectedDate.toISOString().split('T')[0];
//     if (this.mainForm?.form?.controls['payDrawdownDate']) {
//       this.mainForm?.form?.controls['payDrawdownDate']?.patchValue(paymentDate);
//     } else if (this.mainForm?.form?.controls['payNewLoanOutOn']) {
//       this.mainForm?.form?.controls['payNewLoanOutOn']?.patchValue(paymentDate);
//     }
//   }
// }
