import { Component, OnInit } from '@angular/core';
import { BaseAssetlinkClass } from '../../../assetlink/base-assetlink.class';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { BaseAssetlinkService } from '../../../assetlink/services/base-assetlink.service';
import { DrawdownServiceService } from '../../../dashboard/services/drawdown-service.service';
import { debounceTime, merge, of, takeUntil } from 'rxjs';
import {
  DrawdownRequestBody,
  uploadedFiles,
} from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import {
  convertFileToBase64,
  extractSubjectValue,
  formatDate,
} from '../../../utils/common-utils';
import { BaseCommercialService } from '../../services/base-commercial.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { FacilityType, taskPostStaticFields } from '../../../utils/common-enum';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { CancelPopupComponent } from '../cancel-popup/cancel-popup.component';
import { AcknowledgmentPopupComponent } from '../acknowledgment-popup/acknowledgment-popup.component';
import { DrawdownService } from '../../../drawdown.service';

@Component({
  selector: 'app-drawdown-request',
  templateUrl: './drawdown-request.component.html',
  styleUrls: ['./drawdown-request.component.scss'],
})
export class DrawdownRequestComponent
  extends BaseAssetlinkClass
  implements OnInit {
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
        errorMessage: 'Facility Type is Required',
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
        // hidden: true,
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
    public override baseSvc: BaseAssetlinkService,
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
      nominatedAmount: [''],
      disburstmentDetails: this.fb.array([
        this.fb.group({
          stock: [''],
          assetDescription: ['', Validators.required],
        }),
      ]),
      supplierDetails: this.fb.array([
        this.fb.group({
          supplierName: ['', Validators.required],
          amount: ['', Validators.required],
        }),
      ]),
    });
    this.drawdownDetailsForm = this.fb.group({
      purchasePrice: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      lessDeposit: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      workingCapital: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],

      reqDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      payDrawdownDate: [
        new Date().toISOString().split('T')[0],
        [Validators.required],
      ],
      totalDrawdownAmt: [{ value: 0, disabled: true }],
    });
  }

  override async ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty.id;
    //   this.customerName = currentParty.name;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.customerName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;

    this.minDate = formatDate(new Date());
    this.todayDate = new Date();

    if (this.dynamicDialogConfig?.data) {
      this.selectedFacility = this.dynamicDialogConfig.data.facilityType;
      this.selectedSubFacility =
        this.dynamicDialogConfig?.data?.subfacility?.facilityType;

      this.facilityWiseContractsList =
        this.dynamicDialogConfig.data.loansDataList?.map(
          (item) => item.contractId
        );

      // Push selected facility and subfacility
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
      // No dialog data → update main form with defaults
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

    // Default selection
    this.drawdownDetails.get('disburseFundsTo')?.setValue('Supplier');

    this.setupCalculation();
  }

  loadContractsByFacility(facility: string, facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
    const financialList = JSON.parse(sessionStorage.getItem('financialSummaryData') || '[]');
    const facilityMap = {
      [FacilityType.Assetlink]: financialList?.assetLinkDetails ?? [],
      [FacilityType.Easylink]: financialList?.easyLinkDetails ?? [],
      default: financialList?.assetLinkDetails ?? [],
    };

    const contracts = facilityMap[facilityType] || facilityMap.default;

    const filteredContracts = contracts.filter(
      (item) =>
        item.facilityType === facility &&
        item.contractId !== 0 &&
        item.facilityName?.trim()
    );

    this.facilityWiseContractsList = filteredContracts.map((contract) => ({
      label: String(contract.contractId),
      value: contract.contractId,
    }));

    if (
      facilityType === FacilityType.Easylink &&
      facility === FacilityType.Current_Account
    ) {
      if (this.facilityWiseContractsList.length) {
        this.mainForm?.updateList('loan', this.facilityWiseContractsList);
        this.mainForm?.form.controls['loan']?.setValue(
          this.facilityWiseContractsList[0].value
        );
      } else {
        this.mainForm?.updateList('loan', []);
        this.mainForm?.form.controls['loan']?.setValue(null);
      }
    } else if (facilityType === FacilityType.Easylink) {
      this.mainForm?.updateList('loan', [
        { label: 'New Loan', value: 'new-loan' },
      ]);
      this.mainForm?.form.controls['loan']?.setValue('new-loan');
    } else if (facility === FacilityType.AssetLink_N_type) {
      const updatedList = [
        ...this.facilityWiseContractsList,
        { label: 'New Loan', value: 'new-loan' },
      ];
      this.mainForm?.updateList('loan', updatedList);
      this.mainForm?.form.controls['loan']?.setValue('new-loan');
    } else {
      this.mainForm?.updateList('loan', this.facilityWiseContractsList);
      if (this.facilityWiseContractsList.length) {
        this.mainForm?.form.controls['loan']?.setValue(
          this.facilityWiseContractsList[0].value
        );
      }
    }
    // });
  }

  loadFacilityContractsByType(facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
    const financialList = JSON.parse(sessionStorage.getItem('financialSummaryData') || '[]');
    const facilityMap = {
      [FacilityType.Assetlink]: financialList?.assetLinkDetails ?? [],
      [FacilityType.Easylink]: financialList?.easyLinkDetails ?? [],
      default: financialList?.assetLinkDetails ?? [],
    };

    const facilityMapDataList =
      facilityMap[facilityType] || facilityMap.default;

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
      // For 'Both' option: reset to empty and make it editable with validation
      nominatedAmountControl?.reset();
      nominatedAmountControl?.setValidators([Validators.required]);
      nominatedAmountControl?.enable(); // Ensure it's enabled for editing

      this.supplierDetails.clear();
      this.supplierDetails.push(this.CreatesupplierDetails());
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());

      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');

      stockGroup.valueChanges.subscribe((value) => {
        if (value) {
          assetDescriptionGroup.setValidators([Validators.required]);
          if (!assetDescriptionGroup.value) {
            assetDescriptionGroup.markAsTouched();
          }
        } else {
          assetDescriptionGroup.clearValidators();
        }

        assetDescriptionGroup.updateValueAndValidity();
      });
    }

    if (selectedButton == 'Supplier') {
      // Clear nominated amount validation for Supplier only
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
      amountControl.setValidators([Validators.required]);

      stockGroup.valueChanges.subscribe((value) => {
        if (value) {
          assetDescriptionGroup.setValidators([Validators.required]);
          if (!assetDescriptionGroup.value) {
            assetDescriptionGroup.markAsTouched();
          }
        } else {
          assetDescriptionGroup.clearValidators();
        }

        assetDescriptionGroup.updateValueAndValidity();
      });
    }

    if (selectedButton == 'nominatedBankAccount') {
      // For nominated bank account only: set calculated total and make non-editable
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());

      nominatedAmountControl?.setValidators([Validators.required]);

      this.calculateTotal();

      const bothGroup = this.drawdownDetails.get('disburstmentDetails') as any;
      const stockGroup = bothGroup.controls[0].get('stock');
      const assetDescriptionGroup =
        bothGroup.controls[0].get('assetDescription');

      stockGroup.valueChanges.subscribe((value) => {
        if (value) {
          assetDescriptionGroup.setValidators([Validators.required]);
          if (!assetDescriptionGroup.value) {
            assetDescriptionGroup.markAsTouched();
          }
        } else {
          assetDescriptionGroup.clearValidators();
        }

        assetDescriptionGroup.updateValueAndValidity();
      });
    }

    // Update validators
    nominatedAmountControl?.updateValueAndValidity();
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
      amount: ['', Validators.required],
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

    this.mainForm?.form.controls['facilityType']?.setValue(
      this.selectedFacility
    );
    this.mainForm?.form.controls['facility']?.setValue(
      this.selectedSubFacility
    );
    if (
      this.selectedFacility === FacilityType.Easylink ||
      this.selectedSubFacility === FacilityType.AssetLink_N_type
    ) {
      if (this.selectedSubFacility === FacilityType.Current_Account) {
        this.mainForm?.updateList('loan', this.facilityWiseContractsList);
        this.mainForm?.form.controls['loan']?.setValue(
          this.facilityWiseContractsList[0]
        );
      } else if (this.selectedSubFacility === FacilityType.AssetLink_N_type) {
        const loanOptions = [
          { label: 'New Loan', value: 'New Loan' },
          ...this.facilityWiseContractsList.map((contract) => ({
            label: contract,
            value: contract,
          })),
        ];
        this.mainForm?.updateList('loan', loanOptions);
        this.mainForm?.form.controls['loan']?.setValue('New Loan');
      } else {
        this.mainForm?.updateList('loan', [
          { label: 'New Loan', value: 'New Loan' },
        ]);
        this.mainForm?.form.controls['loan']?.setValue('New Loan');
      }
    } else if (this.selectedSubFacility === FacilityType.AssetLink_S_type) {
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
    } else {
      this.mainForm?.updateList('loan', this.facilityWiseContractsList);
      this.mainForm?.form.controls['loan']?.setValue(
        this.facilityWiseContractsList[0]
      );
    }
    this.setupCalculation();
  }
  private setupCalculation(): void {
    // const form = this.mainForm?.form;
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

    // Only update nominated amount automatically for 'nominatedBankAccount' mode
    // For 'Both' mode, let user manually enter the amount
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
      // For nominated bank account only: always show calculated total
      const currentTotal = this.mainForm?.form?.get('totalDrawdownAmt')?.value;
      return currentTotal || 0;
    } else if (disburseFundsTo === 'Both') {
      // For 'Both' option: show user-entered amount or 0
      return nominatedAmount || 0;
    }

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
    }
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
      // this.draw = res.totalDrawdownAmt;
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
    const disburseData = this.drawdownDetails.value;
    const drawdownDetailsDataa = this.drawdownDetailsForm?.getRawValue();

    const purchasePrice = drawdownDetailsDataa?.purchasePrice || 0;
    const workingCapital = drawdownDetailsDataa?.workingCapital || 0;
    const lessDeposit = drawdownDetailsDataa?.lessDeposit || 0;
    const requestDate = drawdownDetailsDataa?.reqDate;
    const payDrawdownDate = drawdownDetailsDataa?.payDrawdownDate;

    const facilityValue = mainFormData.facility?.value ?? mainFormData.facility;
    const loanValue = mainFormData.facility;

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

    if (this.drawdownDetailsForm.invalid) {
      this.drawdownDetailsForm.markAllAsTouched();
      hasError = true;
    }

    // Facility validation
    if (!facilityValue) {
      this.mainForm?.updateProps('facility', {
        errorMessage: 'select_sub_facility',
      });
      facilityControl?.setErrors({ required: true });
      hasError = true;
    } else {
      this.mainForm?.updateProps('facility', { errorMessage: '' });
      facilityControl?.setErrors(null);
    }

    // Loan validation
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

    // Supplier details validation
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

    // Nominated amount validation for 'Both' search type
    if (this.searchType === 'Both') {
      const nominatedAmount =
        this.drawdownDetails.get('nominatedAmount')?.value;
      const nominatedAmountControl =
        this.drawdownDetails.get('nominatedAmount');

      if (!nominatedAmount || nominatedAmount <= 0) {
        nominatedAmountControl?.setErrors({ required: true });
        nominatedAmountControl?.markAsTouched();
        hasError = true;
      } else {
        nominatedAmountControl?.setErrors(null);
      }
    }

    // Pay drawdown date validation
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

    // Request date validation
    if (!requestDate) {
      requestDateControl?.setErrors({ required: true });
      hasError = true;
    }

    // Check if lessDeposit is greater than purchasePrice
    if (purchasePrice > 0 && lessDeposit > 0 && lessDeposit > purchasePrice) {
      this.drawdownDetailsForm
        .get('lessDeposit')
        ?.setErrors({ depositTooHigh: true });
      hasError = true;
    }

    // Purchase price and working capital validation
    if (
      (!purchasePrice || purchasePrice === 0) &&
      (!workingCapital || workingCapital === 0)
    ) {
      this.drawdownDetailsForm
        .get('purchasePrice')
        ?.setErrors({ required: true });
      hasError = true;
    }

    if (hasError) {
      this.drawdownDetailsForm.markAllAsTouched();
      this.mainForm?.form.markAllAsTouched();
      return;
    }

    if (!mainFormData.facility?.value && !mainFormData.facility) {
      this.mainForm?.form.get('facility')?.setErrors({ required: true });
      hasError = true;
    }
    if (!mainFormData.loan?.value && !mainFormData.loan) {
      this.mainForm?.form.get('loan')?.setErrors({ required: true });
      hasError = true;
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

    this.uploadeddocs = await this.getDocumentData();

    const drawdownPostBody: DrawdownRequestBody = {
      party: { partyNo: this.partyId },
      status: taskPostStaticFields.NotStarted,
      taskType: taskPostStaticFields.SelfServiceRequest,
      comments: '',
      customerName: `${this.customerName}`,
      externalData: {
        subjectLine: 'Drawdown Request Submission',
        drawdownrequest: {
          facilityType:
            mainFormData.facilityType?.value || mainFormData.facilityType,
          subFacility: mainFormData.facility?.value || mainFormData.facility,
          loan: String(mainFormData.loan?.value || mainFormData.loan || 0),
          drawdownInfo: {
            purchasePriceOfAssets: drawdownDetailsDataa?.purchasePrice || 0,
            lessDepositTradeIn: drawdownDetailsDataa?.lessDeposit || 0,
            workingCapital: drawdownDetailsDataa?.workingCapital || 0,
            requestDate: drawdownDetailsDataa?.reqDate,
            drawdownOutOn: drawdownDetailsDataa?.payDrawdownDate,
            totalDrawdownAmount: drawdownDetailsDataa?.totalDrawdownAmt,
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

    await this.submitDrawdownRequest(drawdownPostBody);
  }

  async submitDrawdownRequest(params: DrawdownRequestBody) {
    try {
      this.referenceNumber = await this.commonapiService.postTaskRequest(
        params
      );
      this.subject = extractSubjectValue(this.referenceNumber?.subject);
      const taskId = this.referenceNumber?.taskId;
      let messageToShow = '';

      if (this.selectedFacility === 'EasyLink') {
        messageToShow = `Your request has been submitted to UDC Finance for processing and approval. Request Number is:  ${taskId}. Approval is subject to the terms and conditions applicable to your facility. To assist us in completing your request, please ensure that the Easylink Second Schedule sent to you is signed and returned to UDC.`;
      } else if (this.selectedFacility === 'AssetLink') {
        messageToShow = `Your request has been submitted to UDC Finance for processing and approval. Request Number is:  ${taskId}. Approval is subject to the terms and conditions applicable to your facility. To assist us in completing your request, please ensure that the Assetlink Second Schedule sent to you is signed and returned to UDC.`;
      } else if (
        (this.selectedFacility === 'AssetLink' &&
          this.mainForm?.form.value.facility === 'Current Account') ||
        (this.selectedFacility === 'EasyLink' &&
          this.mainForm?.form.value.facility === 'Current Account')
      ) {
        messageToShow = `Your request has been submitted to UDC Finance for processing and approval. Request Number is: ${taskId}. Approval is subject to UDC’s terms and conditions.`;
      }
      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            message: messageToShow,
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
