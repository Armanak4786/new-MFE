import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../../base-standard-quote.class";
import { CommonService } from "auro-ui";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../../services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";
import { cloneDeep } from "lodash";
import { Subject, takeUntil } from "rxjs";
import configure from "../../../../../../../../../public/assets/configure.json";

@Component({
  selector: "app-service-plan",
  templateUrl: "./service-plan.component.html",
  styleUrl: "./service-plan.component.scss",
})
export class ServicePlanComponent extends BaseStandardQuoteClass {
  servicePlanForm: FormGroup;
  sum: any = 0;
  showMonthsHeader: boolean = true;

  showHeader: boolean = true;
  override destroy$ = new Subject<void>();
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private fb: FormBuilder,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    this.servicePlanForm = this.fb.group({
      registrations: this.fb.array([
        this.fb.group({
          id: [0],
          customflowID: [0],
          name: "Registrations",
          amount: [0, [Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")]],
          months: [],
          reference: "Registration Fee",
          changeAction: ""
        }),
      ]),
      servicePlan: this.fb.array([
        this.fb.group({
          id: [0],
          customflowID: [0],
          name: "Service Plan",
          amount: [0, [Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")]],
          months: [],
          reference: "Service Plan",
          changeAction: ""
        }),
      ]),
      other: this.fb.array([]),
    });
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.baseSvc.onProductProgramChange?.pipe(takeUntil(this.destroy$)).subscribe((resetData) => {
      console.log('Service Plan reset triggered with data:', resetData);
      //this.forceResetServicePlanForm(resetData);
    });
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.baseSvc.shouldResetServicePlan) {
          console.log('Forcing reset of service plan values');
          // this.forceResetServicePlanForm();
          this.baseSvc.shouldResetServicePlan = false; // Reset the flag
          return;
        }
        if (!this.isResetting) {
          this.baseFormData = res;
        }
      });

    this.calculationTotal();

    this.servicePlanForm.valueChanges.subscribe((changes) => {
      let sum1 = changes.servicePlan.reduce(
        (accumulator: number, acc: { amount: number }) => {
          return accumulator + acc.amount;
        },
        0
      );

      let sum2 = changes.registrations.reduce(
        (accumulator: number, acc: { amount: number }) => {
          return accumulator + acc.amount;
        },
        0
      );

      // let sum3 = changes.other.reduce(
      //   (accumulator: number, acc: { amount: number }) => {
      //     return accumulator + acc.amount;
      //   },
      //   0
      // );

      this.sum = sum1 + sum2;

      this.baseSvc.addsOnAccessoriesData({
        ...changes,
        subTotalAccesoriesValue: this.sum,
      });
    });
    if (this.baseFormData && !this.isResetting) {
      this.mapData();
    }

    this.baseSvc.accessoriesFormData.subscribe((data) => {
      if (data) {
        Object.values(this.servicePlanForm.controls).forEach((control: any) => {
          control.markAsTouched();
        });
        this.baseSvc.formStatusArr.push(this.servicePlanForm.status);
      }
    });
    //this.subscribeServicePlanAmountChanges();

  }

  isDisabled() {
    if (configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))) {
      return true;
    }
    return false;
  }
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.mainForm?.formViewMode) {
      this.servicePlanForm.disable();
    }
  }

  private isResetting: boolean = false;

  private forceResetServicePlanForm(resetData?: any): void {

    console.log('=== BLOCKING RESET ===');


    this.isResetting = true;


    this.registrations.controls.forEach((control, index) => {
      console.log(`Before reset reg ${index}:`, control.get('amount')?.value);

      control.get('amount')?.setValue(0);
      control.get('months')?.setValue(null);
      control.get('changeAction')?.setValue("");


    });

    this.servicePlan.controls.forEach((control, index) => {


      control.get('amount')?.setValue(0);  // Use setValue
      control.get('months')?.setValue(null);
      control.get('description')?.setValue("");
      control.get('changeAction')?.setValue("");


    });


    const otherArray = this.servicePlanForm.get('other') as FormArray;
    while (otherArray.length > 0) {
      otherArray.removeAt(0);
    }


    this.sum = 0;
    this.showMonthsHeader = true;
    this.showHeader = true;


    this.baseFormData = {
      ...this.baseFormData,
      servicePlan: null,
      registrations: null,
      other: null
    };


    this.cdr.detectChanges();


    setTimeout(() => {
      this.isResetting = false;
      console.log('Reset flag cleared');
    }, 500);


  }



  onServicePlanChange(event: any, index: number) {
    const selectedValue = event.value;
    if (selectedValue === 'Other Service Plan') {
      this.showMonthsHeader = false
    } else {
      this.showMonthsHeader = true

    }
  }

  override validateForm(): boolean {
    if (!this.servicePlanForm) return false;


    this.servicePlan.controls.forEach((group, index) => {
      this.onAmountInput(index);
    });

    return this.servicePlanForm.valid;
  }




  calculationTotal() {
    // throw new Error('Method not implemented.');
    let feeData = this.servicePlanForm.value;

    const sum1 = feeData.servicePlan
      ?.filter((item: any) => item.changeAction !== 'Delete')
      .reduce((total: number, item: any) => {
        return total + (Number(item.amount) || 0);
      }, 0);

    let sum2 = feeData.registrations.reduce(
      (accumulator: number, acc: { amount: number }) => {
        return accumulator + acc.amount;
      },
      0
    );

    // let sum3 = feeData.other.reduce(
    //   (accumulator: number, acc: { amount: number }) => {
    //     return accumulator + acc.amount;
    //   },
    //   0
    // );

    this.sum = sum1 + sum2;
    this.baseSvc.addsOnAccessoriesData({
      ...feeData,
      subTotalAccesoriesValue: this.sum,
    });
  }


  mapData() {
    if (this.isResetting) {
      return;
    }
    let data = cloneDeep(this.baseFormData?.servicePlan);

    let servObj = data?.findIndex((ele) => {
      return ele.name == "Service Plan";
    });
    if (servObj >= 0) {
      this.servicePlan.push(this.createForm("Service Plan"));
      this.servicePlan.at(0).patchValue({
        id: data[servObj]?.id,
        customflowID: data[servObj]?.customflowID,
        name: data[servObj].name,
        amount: Math.abs(data[servObj]?.amount),
        months: data[servObj]?.months,
        reference: "Service Plan",
        changeAction: ""
      });
      data.splice(servObj, 1);
    }
    data?.forEach((ele, index) => {
      if (!this.servicePlan.controls[index + 1]) {
        this.servicePlan.push(this.createForm("Service Plan"));
      }
      // console.log( this.servicePlan)
      this.servicePlan.controls[index + 1].patchValue({
        id: ele?.id,
        customflowID: ele?.customflowID,
        // name:  ele?.name?.toLowerCase() === "Other Service Plan" ? "Others" : ele?.name,
        name: ele?.name,
        amount: Math.abs(ele?.amount),
        description: ele?.description,
        months: ele?.months,
        reference: "Other",
        changeAction: ele?.changeAction,
        planOtherCost: String(ele?.amount) || 0,
        rowNo: ele?.rowNo != null ? ele.rowNo : -1
      });

      const group = this.servicePlan.controls[index + 1] as FormGroup;
      if (group.get('name')?.value === 'Other Service Plan') {
        group.get('amount')?.valueChanges.subscribe(val => {
          group.get('planOtherCost')?.setValue(String(val ?? 0), { emitEvent: false });
        });
      }
      this.onAmountInput(index)
      if (this.servicePlan.controls[index + 1]) {
        const nameValue = this.servicePlan.controls[index + 1].get('name')?.value;
        // console.log("nameValue",nameValue)
        if (nameValue) {
          this.showMonthsHeader = false;
        }
      }
    });

    this.baseFormData?.registrations?.forEach((ele, index) => {
      if (!this.registrations.controls[index]) {
        this.registrations.push(this.createForm("Registration Fee"));
      }
      this.registrations.controls[index].patchValue({
        id: ele?.id,
        customflowID: ele?.customflowID,
        name: "Registrations",
        amount: Math.abs(ele?.amount),
        months: ele?.months,
        reference: "Registration Fee",
        changeAction: ele?.changeAction
      });
    });

    // this.baseFormData?.other?.forEach((ele, index) => {
    //   if (!this.other.controls[index]) {
    //     this.other.push(this.createForm('Other'));
    //   }
    //   this.other.controls[index].patchValue({
    //     name: ele.name,
    //     amount: ele.amount,
    //     months: ele.months,
    //     reference: 'Other',
    //   });
    // });
  }



  createForm(reference: string, id?: number): FormGroup {
    const group = this.fb.group({
      id: [id ?? 0],
      customflowID: [0],
      name: [reference === 'Other' ? 'Other Service Plan' : ''],
      code: [reference === 'Other' ? 'OSP' : ''],
      amount: [0, [Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")]],
      months: [],
      description: [''],
      reference: reference,
      changeAction: '',
      planOtherCost: ['0'],
      rowNo: null
    });

    // Keep planOtherCost in sync with amount for "Other Service Plan"
    if (reference === 'Other') {
      group.get('amount')?.valueChanges.subscribe(val => {
        group.get('planOtherCost')?.setValue(String(val ?? 0), { emitEvent: false });
      });
    }

    return group;
  }


  removeOthers(index) {
    // this.servicePlan.removeAt(index);
    const acc = this.servicePlan.at(index);
    if ((acc.get('rowNo')?.value != null) && (acc.get('rowNo')?.value >= 0)) {
      acc.patchValue({ changeAction: 'Delete' });
      this.calculationTotal();
    } else {
      this.servicePlan.removeAt(index);
    }
    const stillHasOther = this.servicePlan.controls.some(
      (ctrl) =>
        ctrl.get('name')?.value === 'Other Service Plan' && ctrl.get('changeAction')?.value !== 'Delete'
    );
    this.showHeader = stillHasOther;
    //     const control = this.servicePlan.at(index);
    // if (control) {
    //   control.patchValue({
    //     changeAction: "delete"
    //   });
    // }

  }

  get servicePlan(): FormArray {
    return this.servicePlanForm.get("servicePlan") as FormArray;
  }

  get registrations(): FormArray {
    return this.servicePlanForm.get("registrations") as FormArray;
  }

  // get other(): FormArray {
  //   return this.servicePlanForm.get('other') as FormArray;
  // }

  addOtherServicePlan() {
    const activeCount = this.servicePlan.controls.filter(
      acc => acc.get('changeAction')?.value !== 'Delete'
    ).length;
    if (activeCount > 5) {
      return;
    }

    // ✅ Find existing "Other Service Plan"
    const baseOther = this.baseFormData?.servicePlan?.find(
      (sp: any) => sp.name === 'Other Service Plan'
    );

    // ✅ Reuse ID if exists, else 0
    const otherId = baseOther?.id ?? 0;

    this.showHeader = true
    this.servicePlan.push(this.createForm("Other", otherId));
    const hasOther = this.servicePlan.controls.some(
      acc => acc.get('name')?.value === 'Other Service Plan' && acc.get('changeAction')?.value !== 'Delete'
    );
  }


  // onInputAmout(){
  //   console.log(this.servicePlanForm)
  //   alert('hi')
  // }

  subscribeServicePlanAmountChanges() {
    this.servicePlan.controls.forEach((group: FormGroup) => {
      const amountControl = group.get('amount');
      const monthsControl = group.get('months');

      if (amountControl?.value && amountControl.value > 0) {
        monthsControl?.setValidators([Validators.required]);
        monthsControl?.updateValueAndValidity({ emitEvent: false });
      }

      amountControl?.valueChanges.subscribe((amount) => {
        if (amount && amount > 0) {
          monthsControl?.setValidators([Validators.required]);
        } else {
          monthsControl?.clearValidators();
        }
        monthsControl?.updateValueAndValidity({ emitEvent: false });
      });
    });
  }

  onAmountInput(index: number) {
    const group = this.servicePlan.at(index) as FormGroup;
    const amountControl = group.get('amount');
    const monthsControl = group.get('months');
    const nameControl = group.get('name');

    if (!amountControl || !monthsControl) return;

    const amount = amountControl.value;

    if (amount && amount > 0 && nameControl?.value !== 'Other Service Plan') {
      monthsControl.setValidators([Validators.required]);
    } else {
      monthsControl.clearValidators();
    }

    monthsControl.updateValueAndValidity({ emitEvent: false });

    const descControl = group.get('description');

    if (amount && amount > 0 && nameControl?.value == 'Other Service Plan') {
      descControl?.setValidators([Validators.required]);
    } else {
      descControl?.clearValidators();
      descControl?.setValue('');
    }

    descControl?.updateValueAndValidity();
    // console.log(this.servicePlan.at(index))
  }

  getSelectedTooltip(index: number): string {
    const control = this.servicePlan?.at(index)?.get('name');
    const value = control?.value;
    const selected = [{ label: 'Others', value: 'Other Service Plan' }]
      .find(opt => opt.value === value);
    return selected?.label || 'Select Plan';
  }


  pageCode: string = "AddOnAccessoriesComponent";
  modelName: string = "ServicePlanComponent";

  override async onFormReady(): Promise<void> {
    this.forceResetServicePlanForm();
    // Debug initial state
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.cdr.detectChanges();
    }
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails?.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
