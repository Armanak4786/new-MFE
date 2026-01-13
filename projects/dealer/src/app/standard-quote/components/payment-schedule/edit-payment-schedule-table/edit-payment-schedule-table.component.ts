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

@Component({
  selector: "app-edit-payment-schedule-table",
  templateUrl: "./edit-payment-schedule-table.component.html",
  styleUrl: "./edit-payment-schedule-table.component.scss",
})

export class EditPaymentScheduleTableComponent extends BaseStandardQuoteClass {
  primaryContactId = 0;
  editPaymentForm: FormGroup;
  editPaymentData: any[] = [];
  customerId: any;
  productCode:string;
  taxOnAsset = 0;


  paymentSegmentsGridData = [];

  paymentTypeOptions: any = [
    { label: 'Interest Only', value: 'Interest Only' },
    { label: 'Fixed', value: 'Payment Total' },
    { label: 'Normal', value: 'Installment' },
  ]

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


  filteredInstallments: any = [];
  showGst: boolean;

  log(hell) { }

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
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
    this.editPaymentForm = this.fb.group({
      segments: this.fb.array([]),
    });



  }

  fixedSegment: any;
  balloonSegment: any;

  override async ngOnInit(): Promise<void> {
    // await this.getSignatory();
    await super.ngOnInit();
    this.productCode = sessionStorage.getItem('productCode')
    if (this?.baseFormData?.purposeofLoan?.toLowerCase() == 'business') {
      this.showGst = true;
    }
    this.paymentSegmentsGridData = this.config?.data?.filteredInstallments;

    this.renderData(this?.baseFormData?.financialAssetPriceSegments, this?.baseFormData?.flows);
  }

  async renderData(financialAssetPriceSegments, flows) {
    this.segments?.clear();
    let editPaymentDataTemp = cloneDeep(financialAssetPriceSegments);
    const filteredInstallments = flows?.filter(
      (item) =>
        item.flowType === "Installment" || item.flowType === "Interest Only"
    );

    let balloonObj = flows?.find(
      (item) =>
        item.flowType === "Balloon Payment"
    );

    // Optionally sort filtered installments by installment number
    filteredInstallments.sort(
      (a, b) => a.installmentNo - b.installmentNo
    );
    this.filteredInstallments = filteredInstallments;
    // this.editPaymentData = editPaymentDataTemp.map(
    //   (ele) => ({
    //     ...ele,
    //     paymentScheduleDate: new Date(ele?.calcDt || null),
    //     segmentType: ele?.flowType || 0,
    //     paymentSchedulePayment: ele?.amount || 0,
    //     paymentScheduleFrequency: this?.baseFormData?.frequency,
    //   })
    // );

    let installMentNum = 0;
    this.editPaymentData = [];
    if(editPaymentDataTemp){
    editPaymentDataTemp.forEach(
      (ele, index) => {
        let flowObj;
        for (let num = 1; num <= ele?.installments; num++) {
          installMentNum = installMentNum + 1;
          flowObj = this.filteredInstallments?.find((ele) => ele?.installmentNo == installMentNum);
          if (flowObj) {

            //added for FL
             const paymentValue =
          this.baseFormData?.productCode === "FL"
            ? flowObj?.amtGross
            : flowObj?.amount || 0;


            let obj = {
              ...ele,
              installments: 1,
              paymentScheduleDate: new Date(flowObj?.calcDt || null),
              segmentType: ele?.segmentType,
              //removed for FL
              // paymentSchedulePayment: flowObj?.amount || 0,
              paymentSchedulePayment: paymentValue,
              paymentScheduleFrequency:
                ele?.paymentScheduleFrequency || ele?.installmentFrequency,
            }
            this?.editPaymentData?.push(obj);

          };

        };
        if (!flowObj && this?.baseFormData?.fixed && ele?.segmentType == 'Payment Total' && index == editPaymentDataTemp?.length - 1) {
          let fixedObj = {
            ...ele,
            installments: 1,
            paymentScheduleDate: new Date(ele?.paymentScheduleDate || null),
            segmentType: ele?.segmentType,
            keepDisable: true,
            paymentScheduleFrequency:
              ele?.paymentScheduleFrequency || ele?.installmentFrequency,
          }
          this?.editPaymentData?.push(fixedObj);
        }
      }
    );
    }

    if (balloonObj) {
      // in FL case
       const paymentValue =
          this.baseFormData?.productCode === "FL"
            ? balloonObj?.amtGross
            : balloonObj?.amount || 0;
      this.balloonSegment = {
        ...balloonObj,
        paymentScheduleDate: new Date(balloonObj?.calcDt || null),
        segmentType: balloonObj?.flowType || 0,
        //removed for FL
        // paymentSchedulePayment: balloonObj?.amount || 0,
        paymentSchedulePayment: paymentValue,
        paymentScheduleFrequency: this?.baseFormData?.frequency,
      }
    }

    // this.editPaymentData?.push(balloonSegment);

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

        this.taxOnAsset = cloneDeep(this.baseFormData?.taxOnAsset);

    await this.updateValidation("onInit");
  }

  createSegmentForm(): FormGroup {
    let frequency = null;
    if (this.segments?.value?.[0]) {
      frequency = this.segments?.value?.[0]?.paymentScheduleFrequency;
    }
    return this.fb.group({
      priceSegmentId: [],
      priceScheduleId: [],
      isCustomised: [false],
      paymentScheduleDate: [null],
      keepDisable: [false],
      installments: [1],
      segmentType: ['Installment'],
      paymentScheduleFrequency: [frequency],
      isInterestOnly: [false],
      paymentSchedulePayment: [null],
      customDisable: [false],
      paymentAmount:[null],
    });
  }

  async calculate() {
    // let formattedArray = this.segments.value.map((ele) => ({
    //   ...ele,
    //   paymentScheduleDate: this.baseSvc?.convertDateToString(
    //     new Date(ele?.paymentScheduleDate)
    //   ),
    //   segmentType: ele.segmentType,
    //   installmentFrequency: ele.paymentScheduleFrequency,
    // }));

    let formattedArray = [];

    this.segments.value.forEach((ele, index) => {
      // debugger
      if (index == 0) {
        let obj = {
          ...ele,
          paymentScheduleDate: this.baseSvc?.convertDateToString(
            new Date(ele?.paymentScheduleDate)
          ),
          keepDisable: undefined,
          segmentType: ele.segmentType,
          installmentFrequency: ele.paymentScheduleFrequency
        };

        formattedArray?.push(obj);
      } else {
        let lastObj = formattedArray?.[formattedArray?.length - 1];
        if (ele?.segmentType == lastObj?.segmentType) {
          if (ele?.segmentType == 'Installment' || ele?.segmentType == 'Interest Only') {
            formattedArray[formattedArray?.length - 1] = {
              ...formattedArray?.[formattedArray?.length - 1],
              installments: lastObj?.installments + 1
            }
            console.log(formattedArray);

          } else if (ele?.segmentType == 'Payment Total' && ele?.paymentSchedulePayment == lastObj?.paymentSchedulePayment) {
            formattedArray[formattedArray?.length - 1] = {
              ...formattedArray?.[formattedArray?.length - 1],
              installments: ele?.installments + 1
            }
          } else {
            let newObj = {
              ...ele,
              paymentScheduleDate: this.baseSvc?.convertDateToString(
                new Date(ele?.paymentScheduleDate)
              ),
              keepDisable: undefined,
              segmentType: ele.segmentType,
              installmentFrequency: ele.paymentScheduleFrequency
            };

            formattedArray?.push(newObj);
          }
        } else {
          let obj = {
            ...ele,
            paymentScheduleDate: this.baseSvc?.convertDateToString(
              new Date(ele?.paymentScheduleDate)
            ),
            keepDisable: undefined,
            segmentType: ele.segmentType,
            installmentFrequency: ele.paymentScheduleFrequency
          };

          formattedArray?.push(obj);
        }
      }


    });

    let sum = formattedArray.reduce((sum, item) => sum + (item.installments || 0), 0);
    if (sum > this?.baseFormData?.term) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `The sum of the segment (${sum}) field must not exceed the loan`,
      });
      return;
    }

    let tempSegments = cloneDeep(this?.baseFormData?.financialAssetPriceSegments);

    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: formattedArray,
    });
    let defaults = [];
    let response = await this.baseSvc.contractPreview(this.baseFormData, defaults, null, null, true);

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
    this.renderData(response?.financialAssetPriceSegments, response?.flows);
    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: tempSegments,
    });

  }


  async SavePreview() {

    let formattedArray = [];

    this.segments.value.forEach((ele, index) => {
      // debugger
      if (index == 0) {
        let obj = {
          ...ele,
          paymentScheduleDate: this.baseSvc?.convertDateToString(
            new Date(ele?.paymentScheduleDate)
          ),
          keepDisable: undefined,
          segmentType: ele.segmentType,
          installmentFrequency: ele.paymentScheduleFrequency
        };

        formattedArray?.push(obj);
      } else {
        let lastObj = formattedArray?.[formattedArray?.length - 1];
        if (ele?.segmentType == lastObj?.segmentType) {
          if (ele?.segmentType == 'Installment' || ele?.segmentType == 'Interest Only') {
            formattedArray[formattedArray?.length - 1] = {
              ...formattedArray?.[formattedArray?.length - 1],
              installments: lastObj?.installments + 1
            }
            console.log(formattedArray);

          } else if (ele?.segmentType == 'Payment Total' && ele?.paymentSchedulePayment == lastObj?.paymentSchedulePayment) {
            formattedArray[formattedArray?.length - 1] = {
              ...formattedArray?.[formattedArray?.length - 1],
              installments: ele?.installments + 1
            }
          } else {
            let newObj = {
              ...ele,
              paymentScheduleDate: this.baseSvc?.convertDateToString(
                new Date(ele?.paymentScheduleDate)
              ),
              keepDisable: undefined,
              segmentType: ele.segmentType,
              installmentFrequency: ele.paymentScheduleFrequency
            };

            formattedArray?.push(newObj);
          }
        } else {
          let obj = {
            ...ele,
            paymentScheduleDate: this.baseSvc?.convertDateToString(
              new Date(ele?.paymentScheduleDate)
            ),
            keepDisable: undefined,
            segmentType: ele.segmentType,
            installmentFrequency: ele.paymentScheduleFrequency
          };

          formattedArray?.push(obj);
        }
      }


    });




    let sum = formattedArray.reduce((sum, item) => sum + (item.installments || 0), 0);
    if (sum > this?.baseFormData?.term) {
      this.toasterSvc.showToaster({
        severity: "error",
        detail: `The sum of the segment (${sum}) field must not exceed the loan`,
      });
      return;
    }

    // let tempSegments = cloneDeep(this?.baseFormData?.financialAssetPriceSegments);

    this.baseSvc.setBaseDealerFormData({
      financialAssetPriceSegments: formattedArray,
    });
    let defaults = [];
    let response = await this.baseSvc.contractPreview(this.baseFormData, defaults);

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
    this.renderData(response?.financialAssetPriceSegments, response?.flows);
    // this.baseSvc.setBaseDealerFormData({
    //   financialAssetPriceSegments: tempSegments,
    // });

  }
  onInput(val,index){
       this.segments.at(index).get('paymentAmount')?.patchValue(val);
  }

  removeSegments(index) {
    this.segments.removeAt(index);
  }

  async resetSegments() {
    this.renderData(this?.baseFormData?.financialAssetPriceSegments, this?.baseFormData?.flows);
  }

  get segments(): FormArray {
    return this.editPaymentForm.get("segments") as FormArray;
  }

  addSegment() {
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
  }

  closeDialog() {
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
        let fdate = new Date(date);
        fdate.setMonth(date.getMonth() + num);
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

  async save() {
    if (!this?.baseFormData?.contractId) {
      // await this?.calculate();
      await this?.SavePreview();
      this.ref.close();
      return
    }
    let formattedArray = [];
    this.segments.value.forEach((ele, index) => {
      // debugger
      if (index == 0) {
        let obj = {
          ...ele,
          paymentScheduleDate: this.baseSvc?.convertDateToString(
            new Date(ele?.paymentScheduleDate)
          ),
          keepDisable: undefined,
          segmentType: ele.segmentType,
          installmentFrequency: ele.paymentScheduleFrequency
        };

        formattedArray?.push(obj);
      } else {
        let lastObj = formattedArray?.[formattedArray?.length - 1];
        if (ele?.segmentType == lastObj?.segmentType) {
          if (ele?.segmentType == 'Installment' || ele?.segmentType == 'Interest Only') {
            formattedArray[formattedArray?.length - 1] = {
              ...formattedArray?.[formattedArray?.length - 1],
              installments: lastObj?.installments + 1
            }
            console.log(formattedArray);

          } else if (ele?.segmentType == 'Payment Total' && ele?.paymentSchedulePayment == lastObj?.paymentSchedulePayment) {
            formattedArray[formattedArray?.length - 1] = {
              ...formattedArray?.[formattedArray?.length - 1],
              installments: ele?.installments + 1
            }
          } else {
            let newObj = {
              ...ele,
              paymentScheduleDate: this.baseSvc?.convertDateToString(
                new Date(ele?.paymentScheduleDate)
              ),
              keepDisable: undefined,
              segmentType: ele.segmentType,
              installmentFrequency: ele.paymentScheduleFrequency
            };

            formattedArray?.push(newObj);
          }
        } else {
          let obj = {
            ...ele,
            paymentScheduleDate: this.baseSvc?.convertDateToString(
              new Date(ele?.paymentScheduleDate)
            ),
            keepDisable: undefined,
            segmentType: ele.segmentType,
            installmentFrequency: ele.paymentScheduleFrequency
          };

          formattedArray?.push(obj);
        }
      }


    });

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

  pageCode: string = "EditPaymentScheduleComponent";
  modelName: string = "EditPaymentScheduleComponent";

  override async onFormReady(): Promise<void> {
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
