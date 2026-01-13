import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { Subject, takeUntil } from 'rxjs';
import { PartnershipService } from './services/partnership.service';

@Component({
  selector: 'app-partnership',
  templateUrl: './partnership.component.html',
  styleUrl: './partnership.component.scss',
})
export class PartnershipComponent {
  destroy$ = new Subject<void>();
  constructor(
    private partnershipSvc: PartnershipService,
    private commonSvc: CommonService
  ) {}

  ngOnInit(): void {
    this.partnershipSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {});
  }

  ngOnDestroy(): void {
    // Unsubscribe from the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    // todo
  }

  activeStep = 0;
  steps = [
    'Partnership Details',
    'Business Individual',
    'Address Details',
    'Empolyment Details',
    'Finance Accounts',
    'Contact Details',
  ];

  changeStep(params) {
    if (params.type == 'next') {
      this.partnershipSvc.stepper.next({
        activeStep: this.activeStep,
        validate: true,
      });
      const statusInvalid =
        this.partnershipSvc.formStatusArr.includes('INVALID');
      if (!statusInvalid) {
        this.activeStep = params.activeStep;
        this.partnershipSvc.activeStep = this.activeStep;
        this.partnershipSvc.stepper.next(params);
      }
      this.partnershipSvc.formStatusArr.length = 0;
    }

    if (params.type == 'tabNav') {
      this.activeStep = params.activeStep;
      this.partnershipSvc.activeStep = this.activeStep;
      this.partnershipSvc.stepper.next(params);
    }
  }

  cancel() {
    // todo
    this.commonSvc.ui.showConfirmation('Any unsaved changes will be lost. Are you sure you want to cancel?');
  }
}
