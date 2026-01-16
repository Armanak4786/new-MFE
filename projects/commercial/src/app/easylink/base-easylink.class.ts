import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  SecurityContext,
} from '@angular/core';
import { BehaviorSubject, Subject, Subscription, takeUntil, zip } from 'rxjs';
//   import { BaseFormClass, CommonService } from 'lib-shared';
import { ActivatedRoute } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { BaseFormClass, CommonService } from 'auro-ui';
import { BaseEasylinkService } from './services/base-easylink.service';

@Component({
  template: '',
})
export class BaseEasylinkClass
  extends BaseFormClass
  implements OnDestroy, AfterViewInit
{
  destroy$ = new Subject<void>();
  stepperSubcription?: Subscription;
  changeDetectionSubcription?: Subscription;
  isDisable: boolean = false;

  // @Output() childValueChanges: EventEmitter<ChildValueChanges> =
  //   new EventEmitter();
  @Output() childFormEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public baseSvc: BaseEasylinkService
  ) {
    super(route, svc);
  }

  ngAfterViewInit(): void {
    // this.stepperSubcription = this.baseSvc.stepper
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((stepperDetails) => {
    //     this.onStepChange(stepperDetails);
    //   });
    // throw new Error('Method not implemented.');
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.baseSvc
      .getBaseEasylinkFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.onFormDataUpdate(res);
        this.baseFormData = res;
      });

    //   this.changeDetectionSubcription = this.baseSvc.changeDetectionForUpdate
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((data: any) => {
    //       this.renderComponentWithNewData();
    //     });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  arr = [];

  // life cycle hook for step changes

  // life cycle hook for update form data
  onFormDataUpdate(res: any) {
    // console.log("-----------------------")
    // console.log(res);
  }
  override sanitizeInput(input: string): SafeHtml {
    return this.svc.sanitizer.sanitize(SecurityContext.NONE, input);
  }
  setFormData(data: any) {
    let sanitizedData = this.sanitizeInput(data);
    this.baseSvc.setBaseEasylinkFormData(sanitizedData);
  }
  override onFormReady(): void {
    if (this.mainForm?.form && (!this.mode || this.mode == 'create')) {
      // this.baseSvc.setBaseDealerFormData(this.mainForm.form.getRawValue());
      this.patchApiData(this.baseFormData);
    } else {
      this.patchApiData();
    }
  }

  override onValueChanges(event: any) {
    // // this.setFormData(event);
    // let sanitizedData = this.sanitizeInput(event);
    // console.log(sanitizedData);
  }

  // override onValueChanges(event: any) {
  //   // // this.setFormData(event);
  //   // let sanitizedData = this.sanitizeInput(event);
  //   // console.log(sanitizedData);
  // }

  override onFormEvent(event: any) {
    //   if (event?.field?.type == 'date') {
    //     event.value = this.convertDateToString(event.value); // Output the changed date in string format
    //     this.setFormData({
    //       [event.field.name]: event.value,
    //     });
    //   }
    //   else {
    //     this.setFormData({
    //       [event?.field?.name]: event?.value,
    //     });
    //   }

    this.setFormData({
      [event?.field?.name]: event?.value,
    });
  }

  override onChildValueChanges(event: any) {}

  patchApiData(data?: any) {
    this.convertToDateArray();
    this.mainForm?.form.patchValue(data || this.baseFormData);
    this.setFormData(data || this.baseFormData);
  }

  renderComponentWithNewData() {
    if (this.baseFormData && this.mainForm?.form) {
      this.patchApiData();
    }
  }
}
