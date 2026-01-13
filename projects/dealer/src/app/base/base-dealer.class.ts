import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  SecurityContext,
} from "@angular/core";
import { BehaviorSubject, Subject, Subscription, takeUntil } from "rxjs";
import { BaseDealerService } from "./base-dealer.service";
import { ActivatedRoute } from "@angular/router";
import { ChildValueChanges } from "./child-value-changes.model";
import { SafeHtml } from "@angular/platform-browser";
import { BaseFormClass, CommonService } from "auro-ui";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

@Component({
  template: "",
})
export class BaseDealerClass extends BaseFormClass implements OnDestroy {
  destroy$ = new Subject<void>();
  stepperSubcription?: Subscription;
  statusSubcription?: Subscription;

  changeDetectionSubcription?: Subscription;
  isDisable: boolean = false;
  accessGranted: any;

  @Output() childValueChanges: EventEmitter<ChildValueChanges> =
    new EventEmitter();
  @Output() childFormEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public baseSvc: BaseDealerService
  ) {
    super(route, svc);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.baseSvc
      ?.getBaseDealerFormData()
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((res) => {
        this.onFormDataUpdate(res);
        this.baseFormData = res;
      });

    this.stepperSubcription = this.baseSvc?.stepper
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((stepperDetails) => {
        this.onStepChange(stepperDetails);
      });

    this.changeDetectionSubcription = this.baseSvc?.changeDetectionForUpdate
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((data: any) => {
        this.renderComponentWithNewData(data);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the destroy$ subject
    this.destroy$.next();
    this.destroy$.complete();

    if (this.stepperSubcription) {
      this.stepperSubcription?.unsubscribe();
    }
    if (this.changeDetectionSubcription) {
      this.changeDetectionSubcription?.unsubscribe();
    }
  }

  arr = [];

  onStepChange(stepperDetails) {}
  onFormDataUpdate(res: any) {}
  override sanitizeInput(input: string): SafeHtml {
    return this.svc.sanitizer.sanitize(SecurityContext.HTML, input);
  }
  setFormData(data: any) {
    let sanitizedData: any;

    if (typeof data === "string") {
      sanitizedData = this.sanitizeInput(data);
    } else if (typeof data === "object" && data !== null) {
      // Sanitize string properties of an object, if necessary
      sanitizedData = Object.keys(data).reduce((acc, key) => {
        acc[key] =
          typeof data[key] === "string"
            ? this.sanitizeInput(data[key])
            : data[key];
        return acc;
      }, {});
    } else {
      sanitizedData = data;
    }
    this.baseSvc.setBaseDealerFormData(sanitizedData);
  }

  override onFormReady(): void {
    if (this.mainForm?.form && (!this.mode || this.mode == "create")) {
      this.patchApiData();
    } else {
      this.patchApiData();
    }
  }

  override onValueChanges(event: any) {}

  override onFormEvent(event: any) {
    if (event?.field?.type == "date") {
      event.value = this.convertDateToString(event.value);
      this.setFormData({
        [event.field.name]: event.value,
      });
    } else {
      this.setFormData({
        [event?.field?.name]: event?.value,
      });
    }
  }

  override onChildValueChanges(event: any) {}

  patchApiData(data?: any) {
    this.convertToDateArray();
    this.mainForm?.form.patchValue(data || this.baseFormData);
    this.setFormData(data || this.baseFormData);
  }

  renderComponentWithNewData(data?: any) {
    if (this.baseFormData && this.mainForm?.form) {
      this.patchApiData();
    }
  }

  override patchFormValue(data: any): void {
    // Iterate through each field in the data
    Object.keys(data).forEach((fieldName) => {
      const fieldValue = data[fieldName];
      const formControl: any = this.mainForm.get(fieldName);

      // If the field is a normal form control (not an array)
      if (formControl instanceof FormControl) {
        formControl.patchValue(fieldValue);
      }

      // If the field is a FormArray (e.g., 'mobileArr')
      else if (formControl instanceof FormArray) {
        this.patchFormArray(fieldName, fieldValue);
      }
    });
  }

  // Function to patch a FormArray
  override patchFormArray(formArrayName: string, data: any[]): void {
    const formArray = this.getFormArray(formArrayName);

    // Clear the existing FormArray
    formArray.clear();

    // Iterate through each item in the array and add a new FormGroup to the FormArray
    data?.forEach((item) => {
      const fields = Object.keys(item).map((key) => ({
        name: key,
        value: item[key],
      }));

      this.addFormGroupToArray(formArrayName, fields);
    });
  }

  protected override createFormGroup(
    fields: { name: string; type: string; value?: any }[]
  ): FormGroup {
    const group: { [key: string]: FormControl } = {};

    fields.forEach((field) => {
      let control: FormControl;

      control = new FormControl(field.value || "");

      group[field.name] = control;
    });

    return new FormGroup(group);
  }

  // Add a new form group to any specified FormArray
  override addFormGroupToArray(formArrayName: string, fields): void {
    const formArray = this.getFormArray(formArrayName);
    formArray.push(this.createFormGroup(fields));
  }

  // // Get a specific FormArray
  // getFormArray(formArrayName: string): FormArray {
  //   return this.mainForm.get(formArrayName) as FormArray;
  // }

  override getFormArray(formArrayName: any): FormArray {
    const formArray = this.mainForm.get(formArrayName);
    if (formArray instanceof FormArray) {
      return formArray;
    } else {
      throw new Error(`FormArray with name ${formArrayName} not found`);
    }
  }
}
