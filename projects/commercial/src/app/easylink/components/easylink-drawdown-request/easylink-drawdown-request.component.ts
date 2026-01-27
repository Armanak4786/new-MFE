import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { BaseEasylinkClass } from '../../base-easylink.class';
import { BaseEasylinkService } from '../../services/base-easylink.service';
import { DrawdownServiceService } from '../../../dashboard/services/drawdown-service.service';
import { takeUntil } from 'rxjs';
import { DrawdownRequestSubmitComponent } from '../../../reusable-component/components/drawdown-request-submit/drawdown-request-submit.component';

@Component({
  selector: 'app-easylink-drawdown-request',
  templateUrl: './easylink-drawdown-request.component.html',
  styleUrl: './easylink-drawdown-request.component.scss',
})
export class EasylinkDrawdownRequestComponent
  extends BaseEasylinkClass
  implements OnInit
{
  searchType;
  facilityValue: string = '';
  drawdownDetails: FormGroup;
  totalDrawdownAmt;
  constructor(
    public fb: FormBuilder,
    public override svc: CommonService,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public override route: ActivatedRoute,
    public override baseSvc: BaseEasylinkService,
    public drawdownServiceService: DrawdownServiceService
  ) {
    super(route, svc, baseSvc);
    this.drawdownDetails = this.fb.group({
      nominatedAmount: [''],
      disburseFundsTo: ['Supplier'],
      disburstmentDetails: this.fb.array([
        this.fb.group({
          stock: [''],
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
    this.drawdownServiceService
      .getbaseCommercialFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.baseFormData = res;
      });

    this.searchType = 'Supplier';
    this.drawdownDetails
      .get('disburseFundsTo')
      ?.valueChanges.subscribe((selectedButton) => {
        this.onButtonChange(selectedButton);
      });
    const totalDrawdownAmountControl = this.drawdownDetails.get(
      'totalDrawdownAmount'
    );
    totalDrawdownAmountControl?.reset();
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
      supplierNameControl.setValidators([Validators.required]);
      amountControl.setValidators([Validators.required]);
      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
    }
    if (selectedButton == 'nominatedBankAccount') {
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());
      const nominatedAmountControl =
        this.drawdownDetails.get('nominatedAmount');
      nominatedAmountControl?.reset();
      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');
      nominatedAmountControl.setValidators([Validators.required]);
      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
      this.drawdownDetails.patchValue({
        nominatedAmount: this.totalDrawdownAmt,
      });
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

  override onFormDataUpdate(res: any): void {
    if (res.facility == 'Current Account') {
      this.facilityValue = 'CurrentAccount';
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
    if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
      this.mainForm?.get('workingCapital')?.patchValue('working');
    }
    if (res?.facilityType?.value) {
    }
  }
}
