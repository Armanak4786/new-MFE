import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { BaseNonFacilityClass } from '../../base-non-facility-loan.class';
import { ActivatedRoute } from '@angular/router';
import { NonFacilityLoanService } from '../../services/non-facility-loan.service';
import { DrawdownService } from '../../../drawdown.service';
import { DrawdownRequestSubmitComponent } from '../../../reusable-component/components/drawdown-request-submit/drawdown-request-submit.component';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';

@Component({
  selector: 'app-non-facility-loan-request',
  templateUrl: './non-facility-loan-request.component.html',
  styleUrl: './non-facility-loan-request.component.scss',
})
export class NonFacilityLoanRequestComponent extends BaseNonFacilityClass {
  searchType: any = '';
  modalType: string = '';
  facilityValue: string = '';
  drawdownDetails: FormGroup;
  requestType: any;
  facilityType: string = '';
  totalDrawdownAmt;
  constructor(
    public fb: FormBuilder,
    public override svc: CommonService,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public override route: ActivatedRoute,
    public override baseSvc: NonFacilityLoanService,
    private commonSvc: CommonService,
    public drawdownService: DrawdownService
  ) {
    super(route, svc, baseSvc);
    this.drawdownDetails = this.fb.group({
      Supplier: [''],
      nominatedBankAccount: [''],
      nominatedAmount: [''],
      disburseFundsTo: ['Supplier'],
      disburstmentDetails: this.fb.array([
        this.fb.group({
          assetDescription: [''],
        }),
      ]),
      supplierDetails: this.fb.array([
        this.fb.group({
          supplierName: [''],
          amount: [''],
        }),
      ]),
    });
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.baseSvc
      .getBaseNonFacilityLoanFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.onFormDataUpdate(res);
        this.baseFormData = res;
        // console.log('this.baseFormData', this.baseFormData);
        if (
          this.baseFormData?.form?.controls['facility']?.value?.value ==
          'CurrentAccount'
        ) {
        }
      });

    this.searchType = 'Supplier';
    this.drawdownDetails
      ?.get('disburseFundsTo')
      ?.valueChanges.subscribe((selectedButton) => {
        this.onButtonChange(selectedButton);
      });
    this.requestType = this.dynamicDialogConfig?.data.newLoan
      ? this.dynamicDialogConfig?.data.newLoan
      : this.dynamicDialogConfig?.data.drawdown;
    this.searchType = 'Supplier';
    this.drawdownDetails?.get('disburseFundsTo')?.setValue('Supplier');
    const totalDrawdownAmountControl = this.drawdownDetails?.get(
      'totalDrawdownAmount'
    );
    totalDrawdownAmountControl?.reset();
    this.drawdownDetails.controls['facilityType']?.patchValue(this.requestType);
    this.drawdownDetails.patchValue({
      facilityType: this.requestType,
    });
    this.drawdownService.drawdown$.subscribe((value) => {
      // console.log('value', value);
    });
  }

  onButtonChange(selectedButton: string) {
    this.searchType = selectedButton;
    if (selectedButton == 'Both') {
      const nominatedAmountControl =
        this.drawdownDetails.get('nominatedAmount');
      nominatedAmountControl?.reset();
      this.supplierDetails.clear();
      this.supplierDetails.push(this.CreatesupplierDetails());
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());
      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');
      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
    }
    if (selectedButton == 'Supplier') {
      this.supplierDetails.clear();
      this.supplierDetails.push(this.CreatesupplierDetails());
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());
      const supplierGroup = this.drawdownDetails.get('supplierDetails') as any;
      const supplierNameControl = supplierGroup.controls[0].get('supplierName');
      const amountControl = supplierGroup.controls[0].get('amount');
      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');
      if (selectedButton === 'Supplier') {
        supplierNameControl.setValidators([Validators.required]);
        amountControl.setValidators([Validators.required]);
      } else {
        supplierNameControl.clearValidators();
        amountControl.clearValidators();
      }
      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
    }
    if (selectedButton == 'nominatedBankAccount') {
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());
      const nominatedBankAccountControl = this.drawdownDetails.get(
        'nominatedBankAccount'
      );
      nominatedBankAccountControl?.reset();
      const nominatedAmountControl =
        this.drawdownDetails.get('nominatedAmount');
      nominatedAmountControl?.reset();
      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');
      nominatedBankAccountControl.setValidators([Validators.required]);
      nominatedAmountControl.setValidators([Validators.required]);

      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }

      if (this.totalDrawdownAmt) {
        this.drawdownDetails.patchValue({
          nominatedAmount: this.totalDrawdownAmt,
        });
      }
    }
  }

  get disburstmentDetails(): FormArray {
    return this.drawdownDetails.get('disburstmentDetails') as FormArray;
  }

  get supplierDetails(): FormArray {
    return this.drawdownDetails.get('supplierDetails') as FormArray;
  }

  addAssets() {
    this.disburstmentDetails.push(this.CreatedisburstmentDetails());
  }

  CreatedisburstmentDetails(): FormGroup {
    return this.fb.group({
      stock: [''],
      assetDescription: [''],
    });
  }

  CreatesupplierDetails(): FormGroup {
    return this.fb.group({
      supplierName: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  removeAccessories(index) {
    this.disburstmentDetails.removeAt(index);
  }
  removeSupplierDetails(index) {
    this.supplierDetails.removeAt(index);
  }

  addSuppliers() {
    this.supplierDetails.push(this.CreatesupplierDetails());
  }

  showDialogSubmitData() {
    this.svc.dialogSvc
      .show(DrawdownRequestSubmitComponent, ' ', {
        templates: {
          footer: null,
        },
        data: '',
        width: '60vw',
      })
      .onClose.subscribe((data: any) => {
        if (data.data == 'confirm') {
          this.ref.close();
        }
      });
  }

  showDialogCancel() {
    this.svc.dialogSvc
      .show(CancelPopupComponent, 'Cancel', {
        templates: {
          footer: null,
        },
        data: '',
        width: '30vw',
        height: '16vw',
      })
      .onClose.subscribe((data: any) => {
        if (data.data == 'cancel') {
          this.ref.close();
        }
      });
  }

  // override onFormReady() {
  //   this.mainForm?.form.valueChanges.subscribe((value) => {
  //     this.formDataService.updateFormData(this.mainForm?.form?.value);
  //   });
  //   if (this.formFieldFlag == 'newLoanRequest') {
  //     this.mainForm?.updateHidden({ purchasePrice: false });
  //     this.mainForm?.updateHidden({ lessDeposit: false });
  //     this.mainForm?.updateHidden({ payNewLoanOutOn: false });
  //     this.mainForm?.updateHidden({ totalNewLoanAmt: false });
  //     this.mainForm?.updateHidden({ payDrawdownOutOn: true });
  //     this.mainForm?.updateHidden({ workingCapital: true });
  //     this.mainForm?.updateHidden({ totalDrawdownAmt: true });

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
  //     const payNewLoanOutOn = selectedDate.toISOString().split('T')[0];
  //     this.mainForm?.form?.controls['payNewLoanOutOn']?.patchValue(
  //       payNewLoanOutOn
  //     );
  //   }
  //   if (this.formFieldFlag == 'drawdownRequest') {
  //     this.mainForm?.updateHidden({ purchasePrice: true });
  //     this.mainForm?.updateHidden({ lessDeposit: true });
  //     this.mainForm?.updateHidden({ payNewLoanOutOn: true });
  //     this.mainForm?.updateHidden({ totalNewLoanAmt: true });
  //     this.mainForm?.updateHidden({ payDrawdownOutOn: false });
  //     this.mainForm?.updateHidden({ workingCapital: false });
  //     this.mainForm?.updateHidden({ totalDrawdownAmt: false });

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
  //     const payDrawdownOutOn = selectedDate.toISOString().split('T')[0];
  //     this.mainForm?.form?.controls['payDrawdownOutOn']?.patchValue(
  //       payDrawdownOutOn
  //     );
  //   }
  // }

  override onFormDataUpdate(res: any): void {
    if (res.facility == 'Current Account') {
      this.facilityValue = 'CurrentAccount';
      // this.mainForm?.updateHidden({ lessDeposit: true });
    }
    if (res.totalDrawdownAmt) {
      if (
        this.drawdownDetails.get('disburseFundsTo')?.value ==
        'nominatedBankAccount'
      ) {
        this.drawdownDetails.patchValue({
          nominatedAmount: res.totalDrawdownAmt,
        });
      }
      this.totalDrawdownAmt = res.totalDrawdownAmt;
    }
    if (res.totalNewLoanAmt) {
      if (
        this.drawdownDetails.get('disburseFundsTo')?.value ==
        'nominatedBankAccount'
      ) {
        this.drawdownDetails.patchValue({
          nominatedAmount: res.totalNewLoanAmt,
        });
      }
      this.totalDrawdownAmt = res.totalNewLoanAmt;
    }
    if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
      this.mainForm?.get('workingCapital')?.patchValue('working');
    }
    if (res?.facilityType?.value) {
    }
  }
}
