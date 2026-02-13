import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormClass, CommonService } from 'auro-ui';
import { FacilityAssetsService } from '../../../../assetlink/services/facility-assets.service';
import { ReleaseSecurityConfirmationComponent } from '../release-security-confirmation/release-security-confirmation.component';
import { CancelPopupComponent } from '../../cancel-popup/cancel-popup.component';
import { PAYMENT_OPTIONS } from '../../../../utils/common-enum';

@Component({
  selector: 'app-release-security-request',
  templateUrl: './release-security-request.component.html',
  styleUrl: './release-security-request.component.scss',
})
export class ReleaseSecurityRequestComponent
  extends BaseFormClass
  implements OnInit
{
  releaseForm: FormGroup;
  aasetListToRelease: any[];
  scaledSecurityValue: string;
  IfSsv: boolean = true;
  remarks: string = '';
  facilityType;

  constructor(
    private fb: FormBuilder,
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public facilityAsset: FacilityAssetsService,
    private router: Router
  ) {
    super(route, svc); // Call parent constructor first
    this.initializeForm();
  }

  private initializeForm() {
    this.releaseForm = this.fb.group(
      {
        payOptions: ['', Validators.required],
        totalPaymentAmt: [{ value: '', disabled: true }],
        assetSold: [false],
        InsuranceClaim: [false],
        Other: [false],
        Amt1: [{ value: '', disabled: true }],
        Amt2: [{ value: '', disabled: true }],
      },
      { validators: this.atLeastOneReasonValidator }
    );
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit(); // Call parent ngOnInit first

    const facilityAssetData = this.facilityAsset.getData();
    this.aasetListToRelease = facilityAssetData.flat();

    this.IfSsv = !this.router.url.includes('/easylink');

    const totalSSV = this.aasetListToRelease.reduce((sum, element) => {
      const value = typeof element.ssv === 'number' ? element.ssv : parseFloat(element.ssv);
      return isNaN(value) ? sum : sum + value;
    }, 0);

    if (this.router.url.includes('/assetlink')) {
      this.scaledSecurityValue = `$${totalSSV.toFixed(2)}.`;
    }

    this.facilityType = window.location.pathname.split('/')[2] ?? '';
    
    // Restore form state from sessionStorage
    this.restoreFormState();
    
    this.setupFormListeners();
    // Subscribe to form changes to save state
    this.subscribeToFormChanges();
  }

   setupFormListeners() {
    // Payment Options listener
    this.releaseForm.get('payOptions')?.valueChanges.subscribe((value) => {
      const requiresPayment =
        value === PAYMENT_OPTIONS.DEBIT_BANK ||
        value === PAYMENT_OPTIONS.PAY_DIRECTLY;
      this.toggleAmountField('totalPaymentAmt', requiresPayment);
    });

    // Checkbox listeners - enable/disable associated amount fields
    this.releaseForm.get('assetSold')?.valueChanges.subscribe((checked) => {
      this.toggleAmountField('Amt1', checked);
    });

    this.releaseForm.get('InsuranceClaim')?.valueChanges.subscribe((checked) => {
      this.toggleAmountField('Amt2', checked);
    });
  }

  /** Enables/disables an amount field with standard validation */
   toggleAmountField(controlName: string, enable: boolean) {
    const control = this.releaseForm.get(controlName);
    if (!control) return;

    if (enable) {
      control.enable();
      control.setValidators([
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]);
    } else {
      control.reset();
      control.clearValidators();
      control.disable();
    }
    control.updateValueAndValidity();
  }

  // Custom validator to ensure at least one reason is selected
  private atLeastOneReasonValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const assetSold = control.get('assetSold')?.value;
    const insuranceClaim = control.get('InsuranceClaim')?.value;
    const other = control.get('Other')?.value;

    return assetSold || insuranceClaim || other
      ? null
      : { atLeastOneRequired: true };
  }

  onTextareaInput(event: Event) {
    this.remarks = (event.target as HTMLTextAreaElement).value;
    sessionStorage.setItem('releaseSecurityRemarks', this.remarks);
  }

   restoreFormState() {
    const savedFormData = sessionStorage.getItem('releaseSecurityFormData');
    const savedRemarks = sessionStorage.getItem('releaseSecurityRemarks');
    const savedAssetList = sessionStorage.getItem('releaseSecurityAssetList');

    if (savedFormData) {
      const formData = JSON.parse(savedFormData);

      this.releaseForm.patchValue({
        payOptions: formData.payOptions ?? '',
        totalPaymentAmt: formData.totalPaymentAmt ?? '',
        assetSold: formData.assetSold ?? false,
        InsuranceClaim: formData.InsuranceClaim ?? false,
        Other: formData.Other ?? false,
        Amt1: formData.Amt1 ?? '',
        Amt2: formData.Amt2 ?? '',
      });
    }

    if (savedRemarks) {
      this.remarks = savedRemarks;
    }

    if (savedAssetList) {
      const assetList = JSON.parse(savedAssetList);
      if (assetList?.length > 0) {
        this.aasetListToRelease = assetList;
      }
    }
  }

   subscribeToFormChanges() {
    this.releaseForm.valueChanges.subscribe((formValue) => {
      sessionStorage.setItem('releaseSecurityFormData', JSON.stringify(formValue));
    });

    if (this.aasetListToRelease?.length > 0) {
      sessionStorage.setItem('releaseSecurityAssetList', JSON.stringify(this.aasetListToRelease));
    }
  }

   clearSessionStorage() {
    sessionStorage.removeItem('releaseSecurityFormData');
    sessionStorage.removeItem('releaseSecurityRemarks');
    sessionStorage.removeItem('releaseSecurityAssetList');
  }

  override submit() {
    // Update form validity
    this.releaseForm.updateValueAndValidity();

    if (this.releaseForm.valid) {
      const aasetListToRelease = [];
      const mainForm = [];
      aasetListToRelease.push(this.aasetListToRelease);
      console.log('aasetListToRelease', this.aasetListToRelease);
      mainForm.push(this.releaseForm.value);
      // Create a mock form object that matches the expected structure
      const mockForm = {
        form: {
          value: this.releaseForm.value,
        },
      };
      mainForm.push(mockForm);
      this.svc.dialogSvc
        .show(ReleaseSecurityConfirmationComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            aasetListToRelease,
            mainForm,
            remarks: this.remarks,
          },
          width: '60vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {
          if (data) {
            this.clearSessionStorage();
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.releaseForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  showDialogCancel() {
    this.svc.dialogSvc
      .show(CancelPopupComponent, '', {
        templates: {
          footer: null,
        },
        data: '',
        width: '30vw',
        height: '16vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          this.router.navigate([`${this.facilityType}`]);
        }
      });
  }

  get payOptions() {
    return this.releaseForm.get('payOptions');
  }
  get totalPaymentAmt() {
    return this.releaseForm.get('totalPaymentAmt');
  }
  get assetSold() {
    return this.releaseForm.get('assetSold');
  }
  get insuranceClaim() {
    return this.releaseForm.get('InsuranceClaim');
  }
  get other() {
    return this.releaseForm.get('Other');
  }
  get amt1() {
    return this.releaseForm.get('Amt1');
  }
  get amt2() {
    return this.releaseForm.get('Amt2');
  }
}
