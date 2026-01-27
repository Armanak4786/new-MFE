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

@Component({
  selector: 'app-release-security-request',
  templateUrl: './release-security-request.component.html',
  styleUrls: ['./release-security-request.component.scss'],
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

    let SSV = 0;
    let facilityAssetData = this.facilityAsset.getData();
    this.aasetListToRelease = facilityAssetData.flat();

    if (this.router.url.includes('/easylink')) {
      this.IfSsv = false;
    } else {
      this.IfSsv = true;
    }

    this.aasetListToRelease.forEach((element) => {
      let value =
        typeof element.ssv === 'number' ? element.ssv : parseFloat(element.ssv);
      if (!isNaN(value)) {
        SSV += value;
      }
    });

    if (this.router.url.includes('/assetlink')) {
      const formattedValue = `$${SSV.toFixed(2)}`;
      this.scaledSecurityValue = formattedValue + '.';
    }

    this.setupFormListeners();
    this.facilityType = window.location.pathname.split('/')[1] ?? '';
  }

  private setupFormListeners() {
    // Payment Options listener
    this.releaseForm.get('payOptions')?.valueChanges.subscribe((value) => {
      const totalPaymentControl = this.releaseForm.get('totalPaymentAmt');

      if (
        value === 'Debit by nominated bank account' ||
        value === 'I would like to pay UDC directly'
      ) {
        totalPaymentControl?.enable();
        totalPaymentControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]);
      } else {
        totalPaymentControl?.reset();
        totalPaymentControl?.clearValidators();
        totalPaymentControl?.disable();
      }
      totalPaymentControl?.updateValueAndValidity();
    });

    // Asset Sold checkbox listener
    this.releaseForm.get('assetSold')?.valueChanges.subscribe((checked) => {
      const amt1Control = this.releaseForm.get('Amt1');
      if (checked) {
        amt1Control?.enable();
        amt1Control?.setValidators([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]);
      } else {
        amt1Control?.reset();
        amt1Control?.clearValidators();
        amt1Control?.disable();
      }
      amt1Control?.updateValueAndValidity();
    });

    // Insurance Claim checkbox listener
    this.releaseForm
      .get('InsuranceClaim')
      ?.valueChanges.subscribe((checked) => {
        const amt2Control = this.releaseForm.get('Amt2');
        if (checked) {
          amt2Control?.enable();
          amt2Control?.setValidators([
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]);
        } else {
          amt2Control?.reset();
          amt2Control?.clearValidators();
          amt2Control?.disable();
        }
        amt2Control?.updateValueAndValidity();
      });
    this.releaseForm.get('Other')?.valueChanges.subscribe((checked) => {});
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
  }

  override submit() {
    // Update form validity
    this.releaseForm.updateValueAndValidity();

    if (this.releaseForm.valid) {
      const aasetListToRelease = [];
      const mainForm = [];
      aasetListToRelease.push(this.aasetListToRelease);
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
        .onClose.subscribe((data: any) => {});
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
         this.router.navigateByUrl(`/${this.facilityType}`);
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
