import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreditlineDashboardService } from '../../../creditlines/services/creditline-dashboard.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-non-facility-loan-details',
  templateUrl: './non-facility-loan-details.component.html',
  styleUrls: ['./non-facility-loan-details.component.scss'],
})
export class NonFacilityLoanDetailsComponent {
  formFieldFlag: any = '';
  constructor(
    public svc: CommonService,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public route: ActivatedRoute,
    public baseSvc: CreditlineDashboardService
  ) {
    // super(route, svc, baseSvc);
  }

  formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: ``,
    goBackRoute: '',
    cardType: 'non-border',
    // cardBgColor: '--primary-light-color',
    fields: [
      {
        type: 'amount',
        name: 'purchasePrice',
        cols: 6,
        label: 'purchase_price',
        inputType: 'vertical',
        labelClass: 'drawdowm-details-label drawdown-label pt-4',
        maxLength: 15,
        hidden: false,
        errorMessage: 'Field is required',
      },
      // {
      //   type: 'amount',
      //   name: 'workingCapital',
      //   cols: 6,
      //   label: 'working_capital',
      //   inputType: 'vertical',
      //   labelClass:'drawdowm-details-label drawdown-label',
      //   maxLength: 15,
      //   hidden: false,
      //   errorMessage: 'Field is required',
      // },
      {
        type: 'amount',
        name: 'lessDeposit',
        label: 'less_deposite',
        cols: 6,
        inputType: 'vertical',
        labelClass: 'drawdowm-details-label drawdown-label pt-4',
        maxLength: 15,
        hidden: false,
        errorMessage: 'Less deposite should be less then Purchase Price',
        nextLine: false,
      },
      {
        type: 'date',
        name: 'reqDate',
        label: 'request_date',
        labelClass: 'drawdowm-details-label drawdown-label pt-4',
        inputType: 'vertical',
        validators: [Validators.required],
        cols: 6,
      },
      {
        type: 'date',
        name: 'payNewLoanAmt',
        label: 'pay_new_loan_out_on',
        labelClass: 'drawdowm-details-label drawdown-label pt-4',
        inputType: 'vertical',
        validators: [Validators.required],
        hidden: false,
        cols: 6,
      },
      // {
      //   type: 'date',
      //   name: 'payDrawdownAmt',
      //   label: 'Pay Drawdown Out on',
      //   labelClass:'drawdowm-details-label drawdown-label',
      //   inputType: 'vertical',
      //   validators: [Validators.required],
      //   hidden: false,
      //   cols: 6,
      // },
      {
        type: 'amount',
        name: 'totalNewLoanAmt',
        label: 'total_new_loan_amount',
        labelClass: 'drawdowm-details-label drawdown-label pt-4',
        inputType: 'vertical',
        cols: 6,
        nextLine: false,
      },
      // {
      //   type: 'amount',
      //   name: 'totalDrawdownAmt',
      //   label: 'total_drawdown_amount',
      //   labelClass:'drawdowm-details-label drawdown-label',
      //   inputType: 'vertical',
      //   cols: 6,
      //   nextLine: false,
      // },
    ],
  };

  ngOnInit() {
    //  super.ngOnInit();
    //  this.baseSvc?.setBaseCreditlineFormData(this.mainForm);
    //   this.baseSvc
    //        .getBaseCreditlineFormData()
    //        .pipe(takeUntil(this.destroy$))
    //        .subscribe((res) => {
    //          this.onFormDataUpdate(res);
    //          this.baseFormData = res;
    //         //  console.log("this.baseFormData",this.baseFormData);
    //         if(this.baseFormData?.form?.controls['facility']?.value?.value == 'CurrentAccount'){
    //           // console.log("this.baseFormData.form.controls['facility'].value",this.baseFormData.form.controls['facility'].value.value);
    //           // console.log("this.mainForm",this.mainForm);
    //           // this.facilityType =this.baseFormData.form.controls['facility'].value.value;
    //         }
    //        });
    this.formFieldFlag = this.dynamicDialogConfig?.data;
    // console.log("this.formFieldFlag",this.formFieldFlag);

    if (this.formFieldFlag == 'drawdownRequest') {
      // this.mainForm?.updateHidden({purchasePrice:true});
    }
    // this.updateFormFields();
  }

  //   updateFormFields(){
  //     if(this.formFieldFlag == 'drawdownRequest'){
  //       this.mainForm?.updateHidden({purchasePrice:true});
  //     }
  //   }
  onButtonClick($event) {}

  onFormEvent(event) {
    // console.log("even+++",event);
    // console.log("mainForm",this.mainForm);
    // console.log("this.main",this.mainForm.form.controls['purchasePrice'].value);
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
    // super.onFormEvent(event);
  }

  onValueTyped(event) {
    // if(event.name == 'lessDeposit'){
    //   if(this.mainForm?.form?.controls['lessDeposit']?.value > this.mainForm?.form?.controls['purchasePrice']?.value){
    //     this.mainForm?.form?.controls['lessDeposit']?.patchValue(this.mainForm?.form?.controls['purchasePrice']?.value);
    //     this.mainForm?.get('lessDeposit')?.updateValueAndValidity();
    //   }
    // }
  }
  onValueChanges(event) {}
  onFormReady() {}

  onFormDataUpdate(res: any): void {
    if (res?.facility?.value == 'CurrentAccount') {
      // console.log("this.mainForm",this.mainForm?.updateHidden({ lessDeposit: true }));
      // this.mainForm?.updateHidden({ lessDeposit: true });
    }
    // if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
    // this.mainForm?.get('lessDeposit')?.disable();
    // this.mainForm?.updateHidden({lessDeposit:true});
    // console.log("checking",this.mainForm?.get('lessDeposit')?.value);
    // }
    // super.onFormDataUpdate(res);
  }
}
