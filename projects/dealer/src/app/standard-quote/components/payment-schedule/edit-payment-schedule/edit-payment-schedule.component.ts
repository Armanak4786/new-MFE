import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, ToasterService } from "auro-ui";
import { cloneDeep } from "lodash";
import { StandardQuoteService } from "../../../services/standard-quote.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { map } from "rxjs";
import { ValidationService } from "auro-ui";
import { TrusteeComponent } from "../../../../trust/components/trustee-details/trustee/trustee.component";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-edit-payment-schedule",
  templateUrl: "./edit-payment-schedule.component.html",
  styleUrls: ["./edit-payment-schedule.component.scss"],
})
export class EditPaymentScheduleComponent extends BaseStandardQuoteClass {
  primaryContactId = 0;
  editPaymentForm: FormGroup;
  editPaymentData: any[] = [];
  customerId: any;
  showGst = false;
  termMonthAndDays = '';
  numberofFlows = 0;
  taxOnAsset = 0;

  paymentTypeOptions: any = [
    { label: 'Interest Only', value: 'Interest Only' },
    { label: 'Fixed', value: 'Payment Total' },
    { label: 'Normal', value: 'Installment' },
  ];

    flpaymentTypeOptions: any = [
    { label: 'Fixed', value: 'Payment Total' },
    { label: 'Normal', value: 'Installment' },
  ];

  paymentTypeKeys = {
    'Payment Total': 'Fixed',
    'Installment': 'Normal',
    'Interest Only': 'Interest Only',
    'Balloon Payment': 'Balloon Payment'
  }

  productCode : any;
  resetSegmentsArr = []
  disableApplyButton : boolean = true
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    private confirmationService: ConfirmationService
  ) {
    super(route, svc, baseSvc);
    this.editPaymentForm = this.fb.group({
      segments: this.fb.array([]),
    });

  }

  override async ngOnInit(): Promise<void> {
    // await this.getSignatory();
    await super.ngOnInit();
    if (this?.baseFormData?.purposeofLoan?.toLowerCase() == 'business') {
      this.showGst = true;
    }
    this.renderData(this?.baseFormData?.financialAssetPriceSegments, this?.baseFormData);
      this.trackSegmentChanges();
    this.productCode = sessionStorage.getItem('productCode')
  }

  trackSegmentChanges() {
  const segmentsArray = this.editPaymentForm.get('segments') as FormArray;
  this.subscribeToFormChanges()
}
onSegmentTypeChange(index: number) {
  const segmentType = this.segments.at(index).get('segmentType')?.value;
  
  if (segmentType === 'Payment Total') {
    // Set amount to 0 for Fixed type
    this.segments.at(index).get('paymentSchedulePayment')?.patchValue(0);
     this.cdr.detectChanges();
  }
}
onAmountInput(event: any, index: number) {
  const segmentType = this.segments.at(index).get('segmentType')?.value;
 
  const inputValue = event;
  if (segmentType === 'Payment Total') {
    if (inputValue !== 0 && inputValue !== '0' && inputValue !== '') {
      
      const control = this.segments.at(index).get('paymentSchedulePayment');
      setTimeout(() => {
        control?.patchValue(0, { emitEvent: false });
        control?.updateValueAndValidity();
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }, 0);
      
      // this.toasterSvc.showToaster({
      //   severity: "warn",
      //   detail: "Only 0 value is allowed for Fixed payment type."
      // });
    }
  }
}


subscribeToFormChanges() {
  this.editPaymentForm.valueChanges.subscribe((value) => {
   // console.log(value);
    this.disableApplyButton = true;
  });
}
  async renderData(financialAssetPriceSegments, formData) {
  
    if(financialAssetPriceSegments)
   { this.segments?.clear();}
    // this.editPaymentData = financialAssetPriceSegments.map(
    //   (ele) => ({
    //     ...ele,
    //     paymentScheduleDate: new Date(ele?.paymentScheduleDate || null),
    //     segmentType: ele?.segmentType,
    //     keepDisable: false,
    //     paymentSchedulePayment: ele?.origanlamtSegment,
    //     paymentScheduleFrequency:
    //       ele?.paymentScheduleFrequency || ele?.installmentFrequency,
    //   })
    // );

    // this.editPaymentData = financialAssetPriceSegments.map((ele) => {
    //   const flow =
    //     this.baseFormData?.productCode === "FL"
    //       ? this.baseSvc.getFirstInstallmentFlow(
    //           this.baseFormData,
    //           ele?.installments
    //         )
    //       : null;

    //   return {
    //     ...ele,
    //     paymentScheduleDate: new Date(ele?.paymentScheduleDate || null),
    //     segmentType: ele?.segmentType,
    //     keepDisable: false,
    //     paymentSchedulePayment:
    //       this.baseFormData?.productCode === "FL"
    //         ? flow?.amtGross // only for FL
    //         : ele?.origanlamtSegment,
    //     paymentScheduleFrequency:
    //       ele?.paymentScheduleFrequency || ele?.installmentFrequency,
    //   };
    // });
    let flow;
     if (this.baseFormData?.productCode === "FL") {
       this.editPaymentData =financialAssetPriceSegments.map((ele, index) => {

  flow = this.baseFormData?.flows?.find(
  f => f.flowType === "Installment" && f.installmentNo === index + 1
) || null;

// let paymentValue = flow?.amtGross;
  return {
        ...ele,
        paymentScheduleDate: new Date(ele?.paymentScheduleDate || null),
        segmentType: ele?.segmentType,
        keepDisable: false,
        paymentSchedulePayment: flow?.amtGross,
        paymentScheduleFrequency:
          ele?.paymentScheduleFrequency || ele?.installmentFrequency,
      };

})
     }
     else{

       this.editPaymentData = financialAssetPriceSegments?.map((ele) => {
      
      let paymentValue = ele?.origanlamtSegment; 

        return {
        ...ele,
        paymentScheduleDate: new Date(ele?.paymentScheduleDate || null),
        segmentType: ele?.segmentType,
        keepDisable: false,
        paymentSchedulePayment: paymentValue,
        paymentScheduleFrequency:
          ele?.paymentScheduleFrequency || ele?.installmentFrequency,
      };  
    });

     }
   


    
    let lastObj = this.editPaymentData?.[this.editPaymentData?.length - 1];
       

    if (this?.baseFormData?.fixed && lastObj?.segmentType == 'Payment Total' && lastObj?.paymentSchedulePayment == 0) {
      let fixedObj = {
        ...lastObj,
        keepDisable: true
      }
      this.editPaymentData[this.editPaymentData?.length - 1] = fixedObj
    }


    this.editPaymentData.forEach((ele) => {
      this.segments.push(this.createSegmentForm());
    });

    this.segments.patchValue(this.editPaymentData);

    
      
    this.segments.controls.forEach((ctrl: FormGroup) => {
     if (!ctrl.get('customDisable')) {
      ctrl.addControl('customDisable', new FormControl(false));
    }

    if (ctrl.get('segmentType')?.value === 'Payment Total' && sessionStorage.getItem('productCode') === 'FL') {
      ctrl.get('customDisable')?.setValue(true);
    } else {
      ctrl.get('customDisable')?.setValue(false);
    }
     });

    this.termMonthAndDays = cloneDeep(formData?.termMonthAndDays);
    this.taxOnAsset = cloneDeep(formData?.taxOnAsset);
    this.numberofFlows = cloneDeep(formData?.numberofFlows);
    this?.cdr?.detectChanges();

    await this.updateValidation("onInit");
  }

  createSegmentForm(): FormGroup {
    let frequency = null;
    if (this.segments?.value?.[0]) {
      frequency = this.segments?.value?.[0]?.paymentScheduleFrequency;
    }
    let installment = 1;
    let currentSum = this.segments?.value?.reduce((sum, item) => sum + (item.installments || 0), 0);
    let numOfPayments = Math.round(Number(this?.baseFormData?.term) * this.baseSvc?.termFrequencyMultiplier[this?.baseFormData?.frequency]);

    if (currentSum < numOfPayments) {
      installment = numOfPayments - currentSum;
    }

    return this.fb.group({
      priceSegmentId: [],
      priceScheduleId: [],
      isCustomised: [false],
      paymentScheduleDate: [null],
      installments: [installment],
      keepDisable: [false],
      segmentType: ['Installment'],
      paymentScheduleFrequency: [frequency],
      isInterestOnly: [false],
      paymentSchedulePayment: [0],
      paymentAmount:[null],
      customDisable: [false],
    });
  }

  async calculate() {
    let formattedArray = this.segments.value.map((ele) => ({
      ...ele,
      paymentScheduleDate: this.baseSvc?.convertDateToString(
        new Date(ele?.paymentScheduleDate)
      ),
      segmentType: ele.segmentType,
      installmentFrequency: ele.paymentScheduleFrequency,
    }));

    let sum = formattedArray.reduce((sum, item) => sum + (item.installments || 0), 0);
    let numOfPayments = Math.round(Number(this?.baseFormData?.term) * this.baseSvc?.termFrequencyMultiplier[this?.baseFormData?.frequency]);

    if (sum != numOfPayments) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `The sum of the segment (${sum}) field must match the loan term.`,
      });
      return;
    }

    let tempSegments = cloneDeep(this?.baseFormData?.financialAssetPriceSegments);
    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: formattedArray,
      editSchedule : true
    });

    let defaults = [];
    let response = await this.baseSvc.contractPreview(this.baseFormData, defaults, null, null, true);
    this.baseFormData.editSchedule = false

    this.baseSvc.forceToClickCalculate.next(false);
    this.baseSvc.calculatedOnce = true;
    this.baseSvc.changedDefaults = {
      product: false,
      program: false,
      term: false,
      asset: false,
      paymentStructure: false
    };
    this.editPaymentForm = this.fb.group({
      segments: this.fb.array([]),
    });
    this.subscribeToFormChanges();
    this.renderData(response?.financialAssetPriceSegments, response);
    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: tempSegments,
    });
      this.disableApplyButton = false
  }

  async SavePreview(): Promise<boolean>  {
    let formattedArray = this.segments.value.map((ele) => ({
      ...ele,
      paymentScheduleDate: this.baseSvc?.convertDateToString(
        new Date(ele?.paymentScheduleDate)
      ),
      segmentType: ele.segmentType,
      installmentFrequency: ele.paymentScheduleFrequency,
    }));

    let sum = formattedArray.reduce((sum, item) => sum + (item.installments || 0), 0);
    let numOfPayments = Math.round(Number(this?.baseFormData?.term) * this.baseSvc?.termFrequencyMultiplier[this?.baseFormData?.frequency]);

    if (sum > numOfPayments) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `The sum of the segment (${sum}) field must not exceed the loan term`,
      });
      this.disableApplyButton= true
      return false;;
    }

    if (sum < numOfPayments) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `The sum of the segment (${sum}) field should not be less than the loan term`,
      });
      this.disableApplyButton= true
      return false;;
    }
    // let tempSegments = cloneDeep(this?.baseFormData?.financialAssetPriceSegments);

    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: formattedArray,
      editSchedule : true

    });
    let defaults = [];
    let response = await this.baseSvc.contractPreview(this.baseFormData, defaults);



    this.baseFormData.editSchedule = false

    this.baseSvc.forceToClickCalculate.next(false);
    this.baseSvc.calculatedOnce = true;
    this.baseSvc.changedDefaults = {
      product: false,
      program: false,
      term: false,
      asset: false,
      paymentStructure: false
    };
    // this.editPaymentForm = this.fb.group({
    //   segments: this.fb.array([]),
    // });
  this.renderData(response?.financialAssetPriceSegments, response);
    // this.baseSvc.setBaseDealerFormData({
    //   financialAssetPriceSegments: tempSegments,
    // });
return true
  }


onBlur(val, index, field) {
  const segmentType = this.segments.at(index).get('segmentType')?.value;
  
  if (!val) {
    if (field == 'installments') {
      this.segments.at(index).get(field)?.patchValue(1);
    }
    if (field == 'paymentSchedulePayment') {
      this.segments.at(index).get(field)?.patchValue(0);
    }
  }
  
  // Restrict amount to 0 for Fixed type
  if (field === 'paymentSchedulePayment' && segmentType === 'Payment Total' && (this.productCode === 'FL' || this.productCode === 'OL')) {
    if (val !== 0 && val !== null && val !== undefined) {
      this.segments.at(index).get(field)?.patchValue(0);
      this.segments.at(index).get("paymentAmount")?.patchValue(0);
      this.toasterSvc.showToaster({
        severity: "warn",
        detail: "Only 0 value is allowed for Fixed payment type."
      });
    }
  }
}


  onInput(val,index){
       this.segments.at(index).get('paymentAmount')?.patchValue(val);
  }
  removeSegments(index) {
    this.segments.removeAt(index);
  }

  get segments(): FormArray {
    return this.editPaymentForm.get("segments") as FormArray;
  }

  addSegment() {
    if (!this?.baseFormData?.fixed) {
      let previousIndex = this.segments.value.length - 1;
      let previousGroup;
      if (previousIndex >= 0) {
        previousGroup = this.segments.at(previousIndex);
      }
      let group = this.createSegmentForm();

      this.segments.push(group);
      this.setDate(
        previousGroup.value.installments,
        previousGroup.value.paymentScheduleDate,
        previousIndex
      );
    } else {
      let previousIndex = this.segments?.value?.length - 2;
      let previousGroup;
      if (previousIndex >= 0) {
        previousGroup = this.segments.at(previousIndex);
      }
      let group = this.createSegmentForm();
      this.segments.insert(this.segments.value.length - 1, group);
      this.setDate(
        previousGroup.value.installments,
        previousGroup.value.paymentScheduleDate,
        previousIndex
      );
    }
    this.disableApplyButton = true
  }

  closeDialog(event) {
    this.svc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Cancel",
      () => {
        this.ref?.close();
      },
      () => {

      }
    );

  }

  setDate(num, date, index) {
    if (num && date) {
      if (this.segments.at(index + 1)) {
        let fdate = this.baseSvc?.calculateSegmentDate(date, this?.baseFormData?.frequency, num);;
        this.segments
          .at(index + 1)
          .get("paymentScheduleDate")
          .patchValue(fdate);
        if (this.segments.at(index + 1).get("installments").value) {
          this.setDate(
            this.segments.at(index + 1).get("installments").value,
            this.segments.at(index + 1).get("paymentScheduleDate").value,
            index + 1
          );
        }
      }
    }
  }

  override onCalledPreview(mode: any): void {
    // console.log("hjkhkjhkjhkj");

    // this.editPaymentForm = this.fb.group({
    //   segments: this.fb.array([]),
    // });
    // this.renderData();

  }

  async resetSegments() {
    let defaults = [];
    // await this.baseSvc.contractPreview(this.baseFormData, defaults, null, true);

    // this.baseSvc.forceToClickCalculate.next(false);
    // this.baseSvc.calculatedOnce = true;
    // this.baseSvc.changedDefaults = {
    //   product: false,
    //   program: false,
    //   term: false,
    //   asset: false,
    //   paymentStructure: false
    // };
    // this.editPaymentForm = this.fb.group({
    //   segments: this.fb.array([]),
    // });
    this.renderData(this?.baseFormData?.financialAssetPriceSegments, this?.baseFormData);
    this.disableApplyButton = true; 
  }

  async save() {
    if (!this?.baseFormData?.contractId) {
      // await this?.calculate();
      const isValid=await this?.SavePreview();
     if (isValid) {
        this.ref.close();
      }
      // return
    } else if (this?.baseFormData?.contractId) {

    let formattedArray = this.segments.value.map((ele) => ({
      ...ele,
      paymentScheduleDate: this.baseSvc?.convertDateToString(
        new Date(ele?.paymentScheduleDate)
      ),
      segmentType: ele.segmentType,
      installmentFrequency: ele.paymentScheduleFrequency,
    }));

    let sum = formattedArray.reduce((sum, item) => sum + (item.installments || 0), 0);
    if (sum > this?.baseFormData?.term) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `The sum of the segment (${sum}) field must not exceed the loan`,
      });
      return;
    }

    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: formattedArray,
    });

    let resp = await this.baseSvc?.contractModification(
      this.baseFormData,
      false
    );
    this.baseSvc?.patchDataOnPreview.next("update");
        this.ref.close();

  }
  }

  pageCode: string = "EditPaymentScheduleComponent";
  modelName: string = "EditPaymentScheduleComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();

  //    if (this.baseFormData?.productCode === 'FL') {
  //   const segmentsArray = this.editPaymentForm.get('segments') as FormArray;
  //   if (segmentsArray && segmentsArray.controls?.length) {
  //     segmentsArray.controls.forEach(ctrl => {
  //       const segmentTypeCtrl = ctrl.get('segmentType');
  //       if (segmentTypeCtrl) {
  //         segmentTypeCtrl.disable({ emitEvent: false }); // makes dropdown readonly
  //       }
  //     });
  //   }
  // }
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

    const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
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
