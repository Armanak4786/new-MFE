import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseCreditlineClass } from '../../base/base-creditline.class';
import { CreditlineDashboardService } from '../../services/creditline-dashboard.service';
import { debounceTime, merge, of, takeUntil } from 'rxjs';
import {
  convertFileToBase64,
  extractSubjectValue,
} from '../../../utils/common-utils';
import {
  NewLoanRequestBody,
  uploadedFiles,
} from '../../../utils/common-interface';
import { RequestAcknowledgmentComponent } from '../../../assetlink/components/request-acknowledgment/request-acknowledgment.component';
import { FacilityType, taskPostStaticFields } from '../../../utils/common-enum';
import { DrawdownServiceService } from '../../../dashboard/services/drawdown-service.service';
import { BaseCommercialService } from '../../../reusable-component/services/base-commercial.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { AcknowledgmentPopupComponent } from '../../../reusable-component/components/acknowledgment-popup/acknowledgment-popup.component';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { DrawdownService } from '../../../drawdown.service';

@Component({
  selector: 'app-creditline-drawdown-request',
  templateUrl: './creditline-drawdown-request.component.html',
  styleUrls: ['./creditline-drawdown-request.component.scss'],
})
export class CreditlineDrawdownRequestComponent
  extends BaseCreditlineClass
  implements OnInit
{
  // facilityType;
  partyId: any;
  facilityTypeOptionList: any[] = [];
  facilityOptions = [];
  facilityWiseContractsList: any[] = [];
  selectedFacility: string;
  selectedSubFacility: string;
  facilityList;
  todayDate;
  // totalDrawdownAmt;
  searchType: any;
  facilityValue: any;
  drawdownDetails: any;
  uploadeddocs;
  remarks: string;
  referenceNumber: any;
  prevFacilityType: string = '';
  prevFacility: string = '';
  customerName;
  drawdownDetailsForm: FormGroup;
  minDate: string;
  subject;
  message;

  override formConfig: GenericFormConfig = {
    headerTitle: 'Dynamic Form',
    cardType: 'border',
    cardBgColor: '',
    bodyClass: 'form-body',
    api: '',
    apiParam: '',
    fields: [
      {
        type: 'dropdown',
        label: 'facility_type',
        labelClass: 'mb-4',
        name: 'facilityType',
        alignmentType: 'vertical',
        cols: 4,
        className: 'pt-0.5 ml-4 mr-4 w-12rem mt-2',
        validators: [Validators.required],
        nextLine: false,
        options: this.facilityTypeOptionList,
        mode: Mode.view,
        sectionName: 'Section3',
      },
      {
        type: 'dropdown',
        label: 'facility',
        name: 'facility',
        labelClass: 'mb-4',
        alignmentType: 'vertical',
        validators: [Validators.required],
        className: 'pt-0.5 ml-6  mr-4 w-12rem mt-2',
        cols: 4,
        nextLine: false,
        hidden: false,
        options: this.facilityOptions,
        mode: Mode.edit,
        sectionName: 'Section3',
        disabled: false,
      },
      {
        type: 'dropdown',
        label: 'loan',
        labelClass: 'mb-4',
        name: 'loan',
        className: 'pt-0.5 ml-6 mr-4 w-12rem mt-2',
        alignmentType: 'vertical',
        cols: 4,
        validators: [Validators.required],
        nextLine: false,
        options: this.facilityWiseContractsList,
        sectionName: 'Section3',
      },
    ],
    sections: [
      {
        sectionName: 'Section3',
        headerTitle: '',
        sectionClass: 'section-class -mt-5 border-round-xl',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 12,
      },
    ],
  };

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: CreditlineDashboardService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public fb: FormBuilder,
    public ref: DynamicDialogRef,
    public drawdownServiceService: DrawdownServiceService,
    public formDataService: DrawdownService,
    public toasterService: ToasterService,
    public commonapiService: CommonApiService,
    public baseCommSvc: BaseCommercialService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {
    super(route, svc, baseSvc);
    this.drawdownDetails = this.fb.group({
      disburseFundsTo: ['Supplier'],
      nominatedAmount: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      disburstmentDetails: this.fb.array([
        this.fb.group({
          stock: [''],
          assetDescription: [''],
        }),
      ]),
      supplierDetails: this.fb.array([
        this.fb.group({
          supplierName: ['', Validators.required],
          amount: [
            '',
            [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
          ],
        }),
      ]),
    });
    this.drawdownDetailsForm = this.fb.group({
      purchasePrice: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      lessDeposit: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      workingCapital: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],

      reqDate: [new Date().toISOString().split('T')[0], [Validators.required]], // 'YYYY-MM-DD'
      payDrawdownDate: [
        new Date().toISOString().split('T')[0],
        [Validators.required],
      ],
      totalDrawdownAmt: [{ value: 0, disabled: true }],
    });
  }

  override async ngOnInit() {
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.customerName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;
    if (this.dynamicDialogConfig?.data) {
      // this.selectedFacility = this.dynamicDialogConfig.data.facilityType;
      this.selectedFacility = sessionStorage.getItem('currentFacilityType');
      this.selectedSubFacility =
        this.dynamicDialogConfig?.data?.subfacility?.facilityType;
      // this.facilityWiseContractsList =
      //   this.dynamicDialogConfig.data.loansDataList?.map(
      //     (item) => item.contractId
      //   );
      this.facilityTypeOptionList.push(this.selectedFacility);
      if (this.selectedSubFacility) {
        this.facilityOptions.push(this.selectedSubFacility);
        this.mainForm?.form?.controls['facility']?.setValue(
          this.facilityOptions
        );
      }
      this.mainForm?.form?.controls['facilityType']?.setValue(
        this.facilityTypeOptionList
      );
    } else {
      // this.facilityTypeOptionList.push('AssetLink', 'EasyLink');
      this.mainForm?.updateList('facilityType', this.facilityTypeOptionList);
      this.mainForm?.updateHidden({ facility: false });
    }

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
    this.drawdownDetails.get('disburseFundsTo')?.setValue('Supplier');
    this.todayDate = new Date();
    this.setupCalculation();
  }

  loadContractsByFacility(facility: string, facilityType: string) {
    this.facilityWiseContractsList?.push({
      label: 'New Loan',
      value: 'New Loan',
    });
    this.mainForm?.updateList('loan', this.facilityWiseContractsList);
  }
  override onFormEvent(event: any): void {
    if (event.name === 'facilityType') {
      this.selectedFacility = event.value;
    }
  }
  onFormChange(event: any): void {
    if (event.facilityType === FacilityType.NonFacilityLoan) {
      this.loadContractsByFacility1(event.facilityType);
    }
  }

  loadFacilityContractsByType(facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
    const financiallist = JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
      const facilityMap = {
        [FacilityType.CreditLines]: financiallist?.creditlineDetails ?? [],
        [FacilityType.NonFacilityLoan]: financiallist?.nonFacilityLoansDetails ?? [],
      };

      const facilityMapDataList = facilityMap[facilityType];

      const details = facilityMapDataList.filter(
        (item) => item.facilityName?.trim().length > 0
      );

      const uniqueFacilityTypes = Array.from(
        new Set(details.map((item) => item.facilityType))
      );

      this.facilityOptions = uniqueFacilityTypes.map((type) => ({
        label: type,
        value: type,
      }));

      this.mainForm?.updateList('facility', this.facilityOptions);
    // });
  }

  onButtonChange(selectedButton: string) {
    this.searchType = selectedButton;
    const nominatedAmountControl = this.drawdownDetails.get('nominatedAmount');
    if (selectedButton == 'Both') {
      nominatedAmountControl?.reset();
      // nominatedAmountControl?.setValidators([Validators.required]);
      nominatedAmountControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]);
      nominatedAmountControl?.enable();

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
      nominatedAmountControl?.clearValidators();
      nominatedAmountControl?.reset();

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
      amountControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]);
      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
    }
    if (selectedButton == 'nominatedBankAccount') {
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());

      // nominatedAmountControl.setValidators([Validators.required]);
      nominatedAmountControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]);
      this.calculateTotal();
      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');
      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
      // this.drawdownDetails.patchValue({
      //   nominatedAmount: this.mainForm?.form?.get('totalDrawdownAmt')?.value,
      // });
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
      amount: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
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

  onTextareaClick(event) {
    this.remarks = (event.target as HTMLTextAreaElement).value;
  }

  override onFormReady() {
    if (this.facilityOptions.length === 1) {
      this.mainForm?.updateProps('facility', {
        mode: 'view',
      });
    }
    if (this.selectedFacility === FacilityType.NonFacilityLoan) {
      this.mainForm?.updateHidden({ facility: true });
    }

    this.mainForm?.form.controls['facilityType']?.setValue(
      this.selectedFacility
    );
    this.mainForm?.form.controls['facility']?.setValue(
      this.selectedSubFacility
    );

    const loanOptions = [
      ...this.facilityWiseContractsList.map((contract) => ({
        label: contract,
        value: contract,
      })),
      { label: 'New Loan', value: 'New Loan' },
    ];

    this.mainForm?.updateList('loan', loanOptions);
    this.mainForm?.form.controls['loan']?.setValue(
      this.facilityWiseContractsList[0]
    );

    this.setupCalculation();
  }
  private setupCalculation(): void {
    const form = this.drawdownDetailsForm;
    if (!form) return;
    merge(
      form.get('purchasePrice')?.valueChanges || of(null),
      form.get('workingCapital')?.valueChanges || of(null),
      form.get('lessDeposit')?.valueChanges || of(null)
    )
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => this.calculateTotal());
    this.calculateTotal();
  }

  private calculateTotal(): void {
    const form = this.drawdownDetailsForm;
    if (!form) return;

    const purchasePrice = Number(form.get('purchasePrice')?.value) || 0;
    const workingCapital = Number(form.get('workingCapital')?.value) || 0;
    const lessDeposit = Number(form.get('lessDeposit')?.value) || 0;

    const total = purchasePrice + workingCapital - lessDeposit;

    this.drawdownDetailsForm
      .get('totalDrawdownAmt')
      ?.setValue(total, { emitEvent: false });

    // Update nominated amount when nominated bank account is selected
    if (
      this.drawdownDetails.get('disburseFundsTo')?.value ===
      'nominatedBankAccount'
    ) {
      this.drawdownDetails.patchValue(
        {
          nominatedAmount: total,
        },
        { emitEvent: false }
      );
    }
  }
  getNominatedAmount(): number {
    const disburseFundsTo = this.drawdownDetails.get('disburseFundsTo')?.value;
    const nominatedAmount = this.drawdownDetails.get('nominatedAmount')?.value;
    if (disburseFundsTo === 'nominatedBankAccount') {
      // Always return the current calculated total
      const currentTotal = this.mainForm?.form?.get('totalDrawdownAmt')?.value;
      return currentTotal || 0;
    } else if (disburseFundsTo === 'Both') {
      // For 'Both' option: show user-entered amount or 0
      return nominatedAmount || 0;
    }
    //return this.drawdownDetails.get('nominatedAmount')?.value || 0;
    return 0;
  }

  override onValueChanges(event: any): void {
    const currentFacilityType = event.facilityType;
    const currentFacility = event.facility;

    // If facilityType changed
    if (currentFacilityType && currentFacilityType !== this.prevFacilityType) {
      this.prevFacilityType = currentFacilityType;

      // Reset dependent fields
      // this.mainForm.form.controls['facility']?.reset();
      this.mainForm?.form.controls['loan']?.reset();

      this.loadFacilityContractsByType(currentFacilityType);
      this.facilityWiseContractsList = []; // Clear old loan list too
      this.mainForm?.updateList('loan', []);
    }

    // If facility changed
    if (currentFacility && currentFacility !== this.prevFacility) {
      this.prevFacility = currentFacility;
      this.loadContractsByFacility(currentFacility, currentFacilityType);
    } else if (
      currentFacility &&
      currentFacility !== this.prevFacility &&
      currentFacilityType === FacilityType.NonFacilityLoan
    ) {
      this.prevFacility = currentFacility;
      this.loadContractsByFacility1(currentFacilityType);
    }
  }
  loadContractsByFacility1(facilityType: string) {
    // Default case – show contract list
    this.facilityWiseContractsList?.push({
      label: 'New Loan',
      value: 'New Loan',
    });
    this.mainForm?.updateList('loan', this.facilityWiseContractsList);
  }

  override onFormDataUpdate(res: any): void {
    if (res.facility == FacilityType.Current_Account) {
      this.facilityValue = FacilityType.Current_Account;
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
      // this.totalDrawdownAmt = res.totalDrawdownAmt;
    }
    if (res?.facilityType?.value != this.baseFormData?.facilityType?.value) {
      this.mainForm?.get('workingCapital')?.patchValue('working');
    }
    if (res?.facilityType?.value) {
    }
  }

  async submitDrawdownData() {
    this.drawdownDetailsForm.markAllAsTouched();
    const mainFormData = this.mainForm?.form.value;
    const drawdownDetailsDataa = this.drawdownDetailsForm?.getRawValue();

    const purchasePrice = drawdownDetailsDataa?.purchasePrice || 0;
    const workingCapital = drawdownDetailsDataa?.workingCapital || 0;
    const lessDeposit = drawdownDetailsDataa?.lessDeposit || 0;
    const requestDate = drawdownDetailsDataa?.reqDate;
    const payDrawdownDate = drawdownDetailsDataa?.payDrawdownDate;

    const facilityTypeValue = mainFormData.facilityType || '';

    const facilityValue = mainFormData.facility?.value ?? mainFormData.facility;
    // const loanValue = mainFormData.facility;
    const loanValue = mainFormData.loan?.value ?? mainFormData.loan;

    const purchaseControl = this.mainForm?.form.get('purchasePrice');
    const workingCapitalControl = this.mainForm?.form.get('workingCapital');
    const lessDepositControl = this.mainForm?.form.get('lessDeposit');
    const requestDateControl = this.mainForm?.form.get('reqDate');
    const facilityControl = this.mainForm?.form.get('facility');
    const loanControl = this.mainForm?.form.get('loan');

    purchaseControl?.clearValidators();
    workingCapitalControl?.clearValidators();
    lessDepositControl?.clearValidators();
    requestDateControl?.clearValidators();

    lessDepositControl?.setErrors(null);
    let hasError = false;

    if (facilityTypeValue === FacilityType.CreditLines && !facilityValue) {
      this.mainForm?.updateProps('facility', {
        errorMessage: 'select_sub_facility',
      });
      facilityControl?.setErrors({ required: true });
      hasError = true;
    } else {
      this.mainForm?.updateProps('facility', { errorMessage: '' });
      facilityControl?.setErrors(null);
    }

    if (!loanValue) {
      this.mainForm?.updateProps('loan', {
        errorMessage: 'please_select_a_loan',
      });
      loanControl?.setErrors({ required: true });
      hasError = true;
    } else {
      this.mainForm?.updateProps('loan', { errorMessage: '' });
      loanControl?.setErrors(null);
    }

    if (this.searchType === 'Supplier' || this.searchType === 'Both') {
      const supplierArray = this.drawdownDetails.get(
        'supplierDetails'
      ) as FormArray;
      supplierArray.controls.forEach((group: AbstractControl) => {
        const nameControl = group.get('supplierName');
        const amountControl = group.get('amount');

        if (!nameControl?.value?.trim()) {
          nameControl?.setErrors({ required: true });
          nameControl?.markAsTouched();
          hasError = true;
        }

        if (!amountControl?.value) {
          amountControl?.setErrors({ required: true });
          amountControl?.markAsTouched();
          hasError = true;
        }
      });
    }

    if (payDrawdownDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(payDrawdownDate);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        this.drawdownDetailsForm
          .get('payDrawdownDate')
          ?.setErrors({ dateInPast: true });
        hasError = true;
      }
    } else {
      this.drawdownDetailsForm
        .get('payDrawdownDate')
        ?.setErrors({ required: true });
      hasError = true;
    }
    // Condition 1: Check if lessDeposit is greater than purchasePrice
    if (purchasePrice > 0 && lessDeposit > 0 && lessDeposit > purchasePrice) {
      this.drawdownDetailsForm
        .get('lessDeposit')
        ?.setErrors({ depositTooHigh: true });
      hasError = true;
    }

    if (
      (!purchasePrice || purchasePrice === 0) &&
      (!workingCapital || workingCapital === 0)
    ) {
      this.drawdownDetailsForm
        .get('purchasePrice')
        ?.setErrors({ required: true });
      hasError = true;
    }
    if (!requestDate) {
      requestDateControl?.setErrors({ required: true });
      hasError = true;
    }

    if (hasError) {
      this.mainForm?.form.markAllAsTouched();
      return;
    }

    if (this.searchType === 'Supplier' || this.searchType === 'Both') {
      const totalDrawdownAmount = drawdownDetailsDataa?.totalDrawdownAmt || 0;
      const supplierArray = this.drawdownDetails.get(
        'supplierDetails'
      ) as FormArray;

      let totalSupplierAmount = 0;
      supplierArray.controls.forEach((group: AbstractControl) => {
        const amountControl = group.get('amount');
        if (amountControl?.value) {
          totalSupplierAmount += parseFloat(amountControl.value) || 0;
        }
      });

      if (this.searchType === 'Both') {
        const nominatedAmount =
          this.drawdownDetails.get('nominatedAmount')?.value || 0;
        totalSupplierAmount += parseFloat(nominatedAmount) || 0;
      }

      if (totalSupplierAmount !== totalDrawdownAmount) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: `The total supplier amount ($${totalSupplierAmount.toFixed(
            2
          )}) in the Disbursement Details does not match the Total Drawdown Amount ($${totalDrawdownAmount.toFixed(
            2
          )}) in Drawdown Details. Please adjust the amounts before submitting.`,
        });
        return;
      }
    }

    const disburseData = this.drawdownDetails.value;
    this.uploadeddocs = await this.getDocumentData();

    const drawdownPostBody: NewLoanRequestBody = {
      party: { partyNo: this.partyId },
      status: taskPostStaticFields.NotStarted,
      taskType: taskPostStaticFields.SelfServiceRequest,
      comments: '',
      customerName: `${this.customerName}`,
      externalData: {
        subjectLine: 'New Loan Request Submission',
        newLoanRequest: {
          facilityType:
            mainFormData.facilityType?.value || mainFormData.facilityType,
          subFacility: mainFormData.facility?.value || mainFormData.facility,
          loan: String(mainFormData.loan?.value || mainFormData.loan || 0),
          newLoanInfo: {
            purchasePriceOfAssets: drawdownDetailsDataa?.purchasePrice,
            lessDepositTradeIn: drawdownDetailsDataa?.lessDeposit || 0,
            workingCapital: drawdownDetailsDataa?.workingCapital,
            requestDate: drawdownDetailsDataa?.reqDate,
            newLoanOutOn: drawdownDetailsDataa?.payDrawdownDate,
            totalNewLoanAmount: drawdownDetailsDataa?.totalDrawdownAmt || 0,
          },
          disbursementInfo: {
            suppliers: disburseData.supplierDetails
              .filter((supplier) => supplier.supplierName && supplier.amount)
              .map((supplier) => ({
                supplierName: supplier.supplierName,
                amountToSupplier: supplier.amount || 0,
              })),
            nominatedBankAccount: {
              amount: disburseData.nominatedAmount || 0,
            },
            assetDetails: disburseData.disburstmentDetails
              .filter((asset) => asset.stock || asset.assetDescription)
              .map((asset) => ({
                stockNumber: asset.stock,
                assetDescription: asset.assetDescription || '',
              })),
            amountToBank: disburseData.nominatedAmount || 0,
          },
          remarks: this.remarks,
        },
      },
      apTaskNoteAttachmentRequest: {
        apAttachmentFiles: this.uploadeddocs,
      },
    };

    try {
      await this.submitDrawdownRequest(drawdownPostBody);
    } catch (error) {
      // On failure – show error dialog
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832.',
        '',
        () => {}
      );
    }
  }

  async submitDrawdownRequest(params: NewLoanRequestBody) {
    try {
      this.referenceNumber = await this.commonapiService.postTaskRequest(
        params
      );
      this.subject = extractSubjectValue(this.referenceNumber?.subject);
      const taskId = this.referenceNumber?.taskId;
      this.message = `Your request has been submitted to UDC Finance for processing and approval. Request Number is: ${taskId}. Approval is subject to UDC’s terms and conditions. To assist us in completing your request, please ensure that the relevant documents sent to you are signed and returned to UDC.`;

      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            message: this.message,
          },

          height: '25vw',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: CloseDialogData) => {
          this.ref.close(data);
        });
    } catch (error) {
      console.log('Error submitting drawdown request', error);
      this.toasterService.showToaster({
        severity: 'error',
        detail:
          'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832',
      });
    }
  }
  getUploadedDocs() {
    return this.baseCommSvc.getBaseCommercialFormData();
  }
  private async getDocumentData(): Promise<any[]> {
    const files = this.getUploadedDocs().getValue().documentsData || [];

    try {
      const binaryFiles = await Promise.all(
        files.map((file) => convertFileToBase64(file.fileData))
      );
      return files.map(
        (file, index): uploadedFiles => ({
          file: binaryFiles[index],
          fileName: file.fileData.name,
          fileType: file.type,
        })
      );
    } catch (error) {
      console.error('Error converting files to binary:', error);
      return [];
    }
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
          this.ref.close();
        }
      });
  }
}
