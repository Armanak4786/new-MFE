import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  SecurityContext,
} from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { BaseFormClass, CommonService } from 'auro-ui';
import { BaseCommercialService } from './dashboard/services/base-commercial.service';

@Component({
  template: '',
})
export class BaseCommercialClass extends BaseFormClass implements OnDestroy {
  destroy$ = new Subject<void>();
  //stepperSubcription?: Subscription;
  //statusSubcription?: Subscription;

  changeDetectionSubcription?: Subscription;
  isDisable: boolean = false;
  accessGranted: any;

  // @Output() childValueChanges: EventEmitter<ChildValueChanges> =
  //   new EventEmitter();
  @Output() childFormEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public baseSvc: BaseCommercialService
  ) {
    super(route, svc);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.baseSvc
      ?.getbaseCommercialFormData()
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((res) => {
        this.onFormDataUpdate(res);
        this.baseFormData = res;
        // console.log("setteddd the value: ", this, this.baseFormData);
      });

    //   this.stepperSubcription = this.baseSvc?.stepper
    // 	?.pipe(takeUntil(this.destroy$))
    // 	?.subscribe((stepperDetails) => {
    // 	  this.onStepChange(stepperDetails);
    // 	});

    this.changeDetectionSubcription = this.baseSvc?.changeDetectionForUpdate
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((data: any) => {
        this.renderComponentWithNewData();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();

    // if (this.stepperSubcription) {
    //   this.stepperSubcription?.unsubscribe();
    // }
    if (this.changeDetectionSubcription) {
      this.changeDetectionSubcription?.unsubscribe();
    }
  }

  arr = [];

  // life cycle hook for step changes
  onStepChange(stepperDetails) {}

  // life cycle hook for update form data
  onFormDataUpdate(res: any) {}
  override sanitizeInput(input: string): SafeHtml {
    return this.svc.sanitizer.sanitize(SecurityContext.HTML, input);
  }
  override onFormEvent(event: any) {
    if (event?.field?.type == 'date') {
      event.value = this.convertDateToString(event.value); // Output the changed date in string format
      this.setFormData({
        [event.field.name]: event.value,
      });
    } else {
      // console.log("______________________________________________________________", event.value);

      this.setFormData({
        [event?.field?.name]: event?.value,
      });
    }
  }
  setFormData(data: any) {
    let sanitizedData: any;

    if (typeof data === 'string') {
      sanitizedData = this.sanitizeInput(data);
    } else if (typeof data === 'object' && data !== null) {
      // Sanitize string properties of an object, if necessary
      sanitizedData = Object.keys(data).reduce((acc, key) => {
        acc[key] =
          typeof data[key] === 'string'
            ? this.sanitizeInput(data[key])
            : data[key];
        return acc;
      }, {});
    } else {
      sanitizedData = data; // Return data as-is for non-string and non-object types
    }

    this.baseSvc.setBaseCommercialFormData(sanitizedData);
  }
  renderComponentWithNewData() {
    if (this.baseFormData && this.mainForm?.form) {
      this.patchApiData();
    }
  }

  patchApiData(data?: any) {
    this.convertToDateArray();
    this.mainForm?.form.patchValue(data || this.baseFormData);
    this.setFormData(data || this.baseFormData);
  }

  override onFormReady(): void {
    if (this.mainForm?.form && (!this.mode || this.mode == 'create')) {
      // this.baseSvc.setBaseDealerFormData(this.mainForm.form.getRawValue());
      this.patchApiData(this.baseFormData);
    } else {
      this.patchApiData();
    }
  }
}
