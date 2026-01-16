// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonService } from 'auro-ui';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// // import { DrawdownRequestSubmitComponent } from '../drawdown-request-submit/drawdown-request-submit.component';
// import { CancelPopupComponent } from '../../../../reusable-component/components/cancel-popup/cancel-popup.component';
// import { ActivatedRoute } from '@angular/router';
// import { DrawdownServiceService } from '../../../services/drawdown-service.service';
// import { takeUntil } from 'rxjs';
// // import { BaseDashboardClass } from '../../../base-dashboard.class';
// // import { BaseDashboardServiceService } from '../../../services/base-dashboard-service.service';
// import { DrawdownRequestSubmitComponent } from '../../../../reusable-component/components/drawdown-request-submit/drawdown-request-submit.component';

// @Component({
//   selector: 'app-drawdown-request',
//   templateUrl: './drawdown-request.component.html',
//   styleUrls: ['./drawdown-request.component.scss'],
// })
// export class DrawdownRequestComponent
//   extends BaseDashboardClass
//   implements OnInit
// {
//   searchType: any = '';
//   facilityValue;
//   drawdownDetails: FormGroup;
//   todayDate;
//   totalDrawdownAmt;
//   facilityType;

//   constructor(
//     public fb: FormBuilder,
//     public svc: CommonService,
//     public ref: DynamicDialogRef,
//     public dynamicDialogConfig: DynamicDialogConfig,
//     public route: ActivatedRoute,
//     public drawdownServiceService: DrawdownServiceService,
//     public baseSvc: BaseDashboardServiceService
//   ) {
//     super(route, svc, baseSvc);
//     this.drawdownDetails = this.fb.group({
//       disburseFundsTo: ['Supplier'],
//       nominatedAmount: [''],
//       disburstmentDetails: this.fb.array([
//         this.fb.group({
//           stock: [''],
//           assetDescription: [''],
//         }),
//       ]),
//       supplierDetails: this.fb.array([
//         this.fb.group({
//           supplierName: [''],
//           amount: [''],
//         }),
//       ]),
//     });
//   }

//   override async ngOnInit() {
//     super.ngOnInit();
//     this.drawdownServiceService
//       .getbaseCommercialFormData()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((res) => {
//         this.baseFormData = res;
//       });

//     this.searchType = 'Supplier';
//     this.drawdownDetails
//       .get('disburseFundsTo')
//       ?.valueChanges.subscribe((selectedButton) => {
//         this.onButtonChange(selectedButton);
//       });
//     this.todayDate = new Date();
//   }

//   onButtonChange(selectedButton: string) {
//     this.searchType = selectedButton;
//     if (selectedButton == 'Both') {
//       const nominatedBankAccountControl = this.drawdownDetails.get(
//         'nominatedBankAccount'
//       );
//       nominatedBankAccountControl?.reset();
//       const nominatedAmountControl =
//         this.drawdownDetails.get('nominatedAmount');
//       nominatedAmountControl?.reset();
//       this.supplierDetails.clear();
//       this.supplierDetails.push(this.CreatesupplierDetails());
//       this.disburstmentDetails.clear();
//       this.disburstmentDetails.push(this.CreatedisburstmentDetails());
//       const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
//       const stockGroup = bothGroup.controls[0].get('stock');
//       const assetDescriptionGroup =
//         bothGroup.controls[0].get('assetDescription');

//       if (stockGroup) {
//         assetDescriptionGroup.setValidators([Validators.required]);
//       } else {
//         assetDescriptionGroup.clearValidators();
//       }
//     }
//     if (selectedButton == 'Supplier') {
//       this.supplierDetails.clear();
//       this.supplierDetails.push(this.CreatesupplierDetails());
//       this.disburstmentDetails.clear();
//       this.disburstmentDetails.push(this.CreatedisburstmentDetails());
//       const supplierGroup = this.drawdownDetails.get('supplierDetails') as any;
//       const supplierNameControl = supplierGroup.controls[0].get('supplierName');
//       const amountControl = supplierGroup.controls[0].get('amount');
//       const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
//       const stockGroup = bothGroup.controls[0].get('stock');
//       const assetDescriptionGroup =
//         bothGroup.controls[0].get('assetDescription');
//       if (selectedButton === 'Supplier') {
//         supplierNameControl.setValidators([Validators.required]);
//         amountControl.setValidators([Validators.required]);
//       } else {
//         supplierNameControl.clearValidators();
//         amountControl.clearValidators();
//       }
//       if (stockGroup) {
//         assetDescriptionGroup.setValidators([Validators.required]);
//       } else {
//         assetDescriptionGroup.clearValidators();
//       }
//     }
//     if (selectedButton == 'nominatedBankAccount') {
//       this.disburstmentDetails.clear();
//       this.disburstmentDetails.push(this.CreatedisburstmentDetails());
//       const nominatedBankAccountControl = this.drawdownDetails.get(
//         'nominatedBankAccount'
//       );
//       nominatedBankAccountControl?.reset();
//       const nominatedAmountControl =
//         this.drawdownDetails.get('nominatedAmount');
//       nominatedAmountControl?.reset();
//       const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
//       const stockGroup = bothGroup.controls[0].get('stock');
//       const assetDescriptionGroup =
//         bothGroup.controls[0].get('assetDescription');
//       nominatedAmountControl.setValidators([Validators.required]);
//       if (stockGroup) {
//         assetDescriptionGroup.setValidators([Validators.required]);
//       } else {
//         assetDescriptionGroup.clearValidators();
//       }

//       this.drawdownDetails.patchValue({
//         nominatedAmount: this.totalDrawdownAmt,
//       });
//     }
//   }

//   get disburstmentDetails(): FormArray {
//     return this.drawdownDetails.get('disburstmentDetails') as FormArray;
//   }

//   get supplierDetails(): FormArray {
//     return this.drawdownDetails.get('supplierDetails') as FormArray;
//   }

//   addAssets() {
//     this.disburstmentDetails.push(this.CreatedisburstmentDetails());
//   }

//   CreatedisburstmentDetails(): FormGroup {
//     return this.fb.group({
//       stock: [''],
//       assetDescription: [''],
//     });
//   }

//   CreatesupplierDetails(): FormGroup {
//     return this.fb.group({
//       supplierName: ['', Validators.required],
//       amount: ['', Validators.required],
//     });
//   }

//   removeAccessories(index) {
//     this.disburstmentDetails.removeAt(index);
//   }
//   removeSupplierDetails(index) {
//     this.supplierDetails.removeAt(index);
//   }

//   addSuppliers() {
//     this.supplierDetails.push(this.CreatesupplierDetails());
//   }

//   showDialogSubmitData() {
//     this.svc.dialogSvc
//       .show(DrawdownRequestSubmitComponent, ' ', {
//         templates: {
//           footer: null,
//         },
//         data: '',
//         width: '60vw',
//       })
//       .onClose.subscribe((data: any) => {
//         if (data.data == 'confirm') {
//           this.ref.close();
//         }
//       });
//   }

//   showDialogCancel() {
//     this.svc.dialogSvc
//       .show(CancelPopupComponent, 'Cancel', {
//         templates: {
//           footer: null,
//         },
//         data: '',
//         width: '30vw',
//       })
//       .onClose.subscribe((data: any) => {
//         if (data.data == 'cancel') {
//           this.ref.close();
//         }
//       });
//   }

//   override onFormDataUpdate(res: any): void {
//     this.facilityType = res.facilityType;
//     if (res.facility == 'Current Account') {
//       this.facilityValue = 'CurrentAccount';
//     } else {
//       this.facilityValue = res.facility;
//     }
//     if (res.totalDrawdownAmt) {
//       if (
//         this.drawdownDetails.get('disburseFundsTo')?.value ==
//         'nominatedBankAccount'
//       ) {
//         this.drawdownDetails.patchValue({
//           nominatedAmount: res.totalDrawdownAmt,
//         });
//       }
//       this.totalDrawdownAmt = res.totalDrawdownAmt;
//     }
//     if (res.totalNewLoanAmt) {
//       if (
//         this.drawdownDetails.get('disburseFundsTo')?.value ==
//         'nominatedBankAccount'
//       ) {
//         this.drawdownDetails.patchValue({
//           nominatedAmount: res.totalNewLoanAmt,
//         });
//       }
//       this.totalDrawdownAmt = res.totalNewLoanAmt;
//     }
//     if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
//       this.mainForm?.get('workingCapital')?.patchValue('working');
//     }
//     if (res?.facilityType?.value) {
//     }
//   }

//   override onFormReady() {}

//   override onFormEvent(event) {
//     super.onFormEvent(event);
//   }
// }
