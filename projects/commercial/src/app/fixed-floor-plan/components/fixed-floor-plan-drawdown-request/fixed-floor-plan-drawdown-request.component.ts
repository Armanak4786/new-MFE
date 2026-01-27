import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseFormClass,
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from 'auro-ui';
import {
  clearUploadedDocuments,
  convertFileToBase64,
  extractSubjectValue,
  formatDate,
} from '../../../utils/common-utils';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AssetDrawdownRequestBody,
  AssetDrawdownRequestBodyTask,
  ContractNoteBody,
  ContractNotesParams,
  DocumentUploadRequest,
  FixedFloorPlanDrawdownTaskBody,
  UploadDocsParams,
  uploadedFiles,
} from '../../../utils/common-interface';
import { BaseCommercialService } from '../../../reusable-component/services/base-commercial.service';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import {
  ContractNotesDropdown_values,
  FacilityType,
  taskPostStaticFields,
} from '../../../utils/common-enum';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { AcknowledgmentPopupComponent } from '../../../reusable-component/components/acknowledgment-popup/acknowledgment-popup.component';
import { MotocheckComponent } from '../motocheck/motocheck.component';
import { jwtDecode } from 'jwt-decode';
import keys from '../../../../../../../public/assets/api-json/en_US.json';

@Component({
  selector: 'app-fixed-floor-plan-drawdown-request',
  // standalone: true,
  // imports: [],
  templateUrl: './fixed-floor-plan-drawdown-request.component.html',
  styleUrl: './fixed-floor-plan-drawdown-request.component.scss',
})
export class FixedFloorPlanDrawdownRequestComponent
  extends BaseFormClass
  implements OnInit
{
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  selectedProgramAssetType: string = '';
  isMotorVehicle: boolean = false;
  selectedFacility;
  selectedSubFacility;
  subFacilityOptions: any[] = [];
  facilityTypeOptions: any[] = [];
  programOptions: any[] = [];
  partyId;
  drawdownDetails: any;
  todayDate;
  searchType;
  remarks;
  referenceNumber;
  assetForm: FormGroup;
  drawdownForm: FormGroup;
  taxrate;
  uploadeddocs;
  customerName;
  programCustomFields: { name: string; value: string }[] = [];
  assetOptions = [
    { label: 'Vehicle', value: 'vehicle' },
    { label: 'Non MV', value: 'Non-mv' },
  ];
  subject;
  minYear;
  yearRange;
  maxYear;
  message;
  uploadeddocsfortask;
  username;
  form: any;
  submitted: boolean;
  // override formConfig: GenericFormConfig = {
  //   headerTitle: 'Dynamic Form',
  //   cardType: 'border',
  //   cardBgColor: '',
  //   bodyClass: 'form-body',
  //   api: '',
  //   apiParam: '',
  //   fields: [
  //     {
  //       type: 'dropdown',
  //       label: 'facility_type',
  //       labelClass: 'mb-4',
  //       name: 'facilityType',
  //       alignmentType: 'vertical',
  //       cols: 4,
  //       className: 'pt-0.5 ml-4 mr-4 w-12rem mt-2',
  //       validators: [Validators.required],
  //       nextLine: false,
  //       mode: Mode.edit,
  //       options: this.facilityTypeOptions,
  //       sectionName: 'Section1',
  //     },
  //     {
  //       type: 'dropdown',
  //       label: 'facility',
  //       name: 'floorplanname',
  //       labelClass: 'mb-4',
  //       alignmentType: 'vertical',
  //       validators: [Validators.required],
  //       className: 'pt-0.5 ml-6  mr-4 w-12rem mt-2',
  //       cols: 4,
  //       nextLine: false,
  //       mode: Mode.edit,
  //       sectionName: 'Section1',
  //       options: this.subFacilityOptions,
  //       disabled: false,
  //     },
  //     {
  //       type: 'dropdown',
  //       label: 'program',
  //       labelClass: 'mb-4',
  //       name: 'programname',
  //       className: 'pt-0.5 ml-6 mr-4 w-12rem mt-2',
  //       alignmentType: 'vertical',
  //       cols: 4,
  //       nextLine: false,
  //       sectionName: 'Section1',
  //       options: this.programOptions,
  //     },
  //   ],
  //   sections: [
  //     {
  //       sectionName: 'Section1',
  //       headerTitle: '',
  //       sectionClass: 'section-class -mt-5 border-round-xl',
  //       headerClass: 'text-xs ml-2 font-bold',
  //       cols: 12,
  //     },
  //   ],
  // };

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public toasterService: ToasterService,
    public commonapiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    private fb: FormBuilder,
    public baseCommSvc: BaseCommercialService,
  ) {
    super(route, svc);
    this.form = this.fb.group({
      facilityType: ['', Validators.required],
      floorplanname: ['', Validators.required],
      programname: [''],
    });
    this.drawdownDetails = this.fb.group({
      disburseFundsTo: ['nominatedBankAccount'],
      nominatedAmount: ['', Validators.min(0)],
      disburstmentDetails: this.fb.array([
        this.fb.group({
          stock: [''],
          assetDescription: [''],
        }),
      ]),
      supplierDetails: this.fb.array([
        this.fb.group({
          supplierName: ['', Validators.required],
          amount: ['', [Validators.required, Validators.min(0)]],
        }),
      ]),
    });
    this.assetForm = this.fb.group({
      assetType: ['single'],
      amount: [''],
      vehicleDetails: this.fb.group({
        regoNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],
        vin: [
          '',
          [
            Validators.required,
            Validators.minLength(17),
            Validators.maxLength(17),
          ],
        ],
        chassisNo: ['', Validators.required],
        colour: [''],
        make: ['', Validators.required],
        model: ['', Validators.required],
        year: ['', Validators.required],
        registrationDate: ['', Validators.required],
        assetId: [''],
      }),
      multipleAssets: this.fb.array([]),
    });
    this.drawdownForm = this.fb.group({
      invoiceAmount: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      gstType: ['Incl GST', Validators.required],
      advanceRequested: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      payDrawdownOutOn: ['', Validators.required],
    });
    this.setupListeners();
  }

  override async ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty.id;
    //   this.customerName = currentParty.name;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.customerName = JSON.parse(
      sessionStorage.getItem('currentParty'),
    )?.name;

    const params = {
      partyNo: this.partyId,
    };
    await this.GetWholesaleAccounts(params);
    this.subFacilityOptions = (
      this.dynamicDialogConfig?.data?.subfacility || []
    )
      .filter((item) => !!item.facilityName && item.facilityName.trim() !== '')
      .map((item) => ({
        label: item.facilityName,
        value: item.id,
      }));

    // this.mainForm.updateList('floorplanname', this.subFacilityOptions);
    if (this.subFacilityOptions?.length === 1) {
      this.form.patchValue({
        floorplanname: this.subFacilityOptions[0],
      });

      const params = {
        partyId: this.partyId,
        subFacilityId: this.subFacilityOptions[0]?.value,
      };
      await this.GetProgram(params);
    }
    this.searchType = 'Supplier';
    this.drawdownDetails
      .get('disburseFundsTo')
      ?.valueChanges.subscribe((selectedButton) => {
        this.onButtonChange(selectedButton);
      });
    this.todayDate = new Date();

    this.minYear = new Date(1900, 0, 1);
    this.maxYear = new Date(2099, 11, 31);
    this.yearRange = `1900:2099`;
    await this.getTax();

    let decodedToken = sessionStorage.getItem('accessToken');
    this.username = this.decodeToken(decodedToken)?.sub;
  }

  get vehicleDetails(): FormGroup {
    return this.assetForm.get('vehicleDetails') as FormGroup;
  }

  get multipleAssets(): FormArray {
    return this.assetForm.get('multipleAssets') as FormArray;
  }

  get disburstmentDetails(): FormArray {
    return this.drawdownDetails.get('disburstmentDetails') as FormArray;
  }

  get supplierDetails(): FormArray {
    return this.drawdownDetails.get('supplierDetails') as FormArray;
  }

  setupListeners(): void {
    this.assetForm.get('assetType')?.valueChanges.subscribe((value) => {
      if (value === 'single') {
        this.assetForm.get('amount')?.setValidators([Validators.required]);
        this.clearFormArray(this.multipleAssets);
        this.form.get('programname')?.enable();
        // Enable program field for single asset
        // this.mainForm.updateProps('programname', { disabled: false });
      } else if (value === 'multiple') {
        this.assetForm.get('amount')?.clearValidators();
        this.assetForm.get('amount')?.setValue('');
        if (this.multipleAssets.length === 0) this.addMultipleAsset();
        // Disable program field for multiple assets
        this.form.get('programname')?.setValue(null);
        this.form.get('programname')?.disable();
        // this.mainForm.updateProps('programname', { disabled: true });
        this.mainForm.form.get('programname')?.setValue('');
        this.programOptions = [];
        // this.mainForm.updateList('programname', this.programOptions);
        // Reset asset type detection flags
        this.selectedProgramAssetType = '';
        this.isMotorVehicle = false;
      }
      this.assetForm.get('amount')?.updateValueAndValidity();
    });
  }

  onAssetTypeChange(): void {
    this.assetForm.get('assetType')?.valueChanges.subscribe((value) => {
      if (value === 'single') {
        this.assetForm.get('amount')?.setValidators([Validators.required]);
        this.clearFormArray(this.multipleAssets);
      } else {
        this.assetForm.get('amount')?.clearValidators();
        this.assetForm.get('amount')?.setValue('');
        if (this.multipleAssets.length === 0) this.addMultipleAsset();
      }
      this.assetForm.get('amount')?.updateValueAndValidity();
    });
  }

  addMultipleAsset(): void {
    const group = this.fb.group({
      stockNo: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.multipleAssets.push(group);
  }

  removeMultipleAsset(index: number): void {
    this.multipleAssets.removeAt(index);
  }

  clearFormArray(array: FormArray) {
    while (array.length !== 0) {
      array.removeAt(0);
    }
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
      supplierName: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\-&\/.]+$/)],
      ],
      amount: ['', [Validators.required, Validators.min(0)]],
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

  onButtonChange(selectedButton: string) {
    this.searchType = selectedButton;
    const nominatedAmountControl = this.drawdownDetails.get('nominatedAmount');

    if (selectedButton == 'Both') {
      nominatedAmountControl?.reset();
      nominatedAmountControl?.setValidators([Validators.required]);
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

      supplierNameControl.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\-&\/.]+$/),
      ]);
      amountControl.setValidators([Validators.required]);
      supplierNameControl.updateValueAndValidity();
      amountControl.updateValueAndValidity();

      if (stockGroup) {
        assetDescriptionGroup.setValidators([Validators.required]);
      } else {
        assetDescriptionGroup.clearValidators();
      }
    }

    if (selectedButton == 'nominatedBankAccount') {
      this.disburstmentDetails.clear();
      this.disburstmentDetails.push(this.CreatedisburstmentDetails());

      nominatedAmountControl?.setValidators([Validators.required]);
      const calculatedTotal =
        this.mainForm?.form?.get('totalDrawdownAmt')?.value || 0;
      nominatedAmountControl?.setValue(calculatedTotal);

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

    nominatedAmountControl?.updateValueAndValidity();
  }

  override async onFormEvent(event) {
    if (event.name === 'floorplanname') {
      const assetType = this.assetForm.get('assetType')?.value;

      if (assetType === 'multiple') {
        this.programOptions = [];
        // this.mainForm.updateList('programname', this.programOptions);
        // this.mainForm.updateProps('programname', { disabled: true }); // need to check
        this.form.get('programname')?.setValue('');
        this.form.get('programname')?.disable();
        return;
      }

      const params = {
        partyId: this.partyId,
        subFacilityId: event.value?.value,
      };
      await this.GetProgram(params);
    }

    if (event.name === 'programname') {
      const assetType = this.assetForm.get('assetType')?.value;

      if (assetType === 'multiple' || !event.value?.value) {
        return;
      }

      // Get custom fields as before
      const params = { programId: event.value?.value };
      this.programCustomFields = await this.getProgramCustomField(params);
      const programDefaults = await this.getProgramDefault(event.value?.value);

      if (programDefaults && programDefaults.assetTypePath) {
        this.selectedProgramAssetType = programDefaults.assetTypePath;
        this.isMotorVehicle =
          programDefaults.assetTypePath.includes('Motor Vehicles');

        this.vehicleDetails.reset();
      } else {
        // Fallback to the original logic if getProgramDefault fails
        const selectedProgram = this.programOptions.find(
          (program) => program.value === event.value?.value,
        );
        if (selectedProgram && selectedProgram.assetTypePath) {
          this.selectedProgramAssetType = selectedProgram.assetTypePath;
          this.isMotorVehicle =
            selectedProgram.assetTypePath.includes('Motor Vehicles');
          this.vehicleDetails.reset();
        }
      }
    }
  }

  onTextareaClick(event) {
    this.remarks = (event.target as HTMLTextAreaElement).value;
  }

  async taxRateValidation(event: Event) {
    const selectedValue = (event.target as HTMLInputElement).value;
    if (selectedValue === 'Incl GST') {
      this.taxrate = await this.getTax();
    }
  }
  async getProgramDefault(programId: number) {
    try {
      const params = { programId: programId };
      const response = await this.commonapiService.getProgramDefault(params);
      return response?.data || response;
    } catch (error) {
      console.log('Error getting program defaults:', error);
      return null;
    }
  }

  async getProgramCustomField(params) {
    try {
      const response =
        await this.commonapiService.getCustomFieldProgram(params);
      const customFields =
        response?.customFields ?? response?.data?.customFields ?? [];
      const programresponse = customFields.map((field) => ({
        name: field.name,
        value: field.value,
      }));
      return programresponse;
    } catch (error) {
      console.log('Error While Getting Data');
    }
  }

  async getTax() {
    try {
      const response = await this.commonapiService.getTaxRate();
      return response;
    } catch (error) {
      console.log('Error While Getting Data');
    }
  }

  async GetWholesaleAccounts(params) {
    try {
      const response = await this.commonapiService.getWholesaleAccounts(params);

      this.facilityTypeOptions = response.map((item) => ({
        label: item.reference,
        value: item.reference,
        contractId: item.contractId,
      }));
      if (this.facilityTypeOptions?.length === 1) {
        this.form.patchValue({
          facilityType: this.facilityTypeOptions[0],
        });
      }
      // this.mainForm.updateList('facilityType', this.facilityTypeOptions);
    } catch (error) {
      console.log('Error While Getting Data');
    }
  }

  async GetProgram(params) {
    try {
      const response = await this.commonapiService.getPrograms(params);
      this.programOptions = response.map((item) => ({
        label: item.lookupName,
        value: item.programId,
        assetTypePath: item.assetType?.assetTypePath || '',
      }));
      if (this.programOptions?.length === 1) {
        this.form.patchValue({
          programname: this.programOptions[0],
        });
      }
      // Manually trigger the program selection logic
      const assetType = this.assetForm.get('assetType')?.value;
      if (assetType !== 'multiple' && this.programOptions[0]?.value) {
        const programParams = { programId: this.programOptions[0].value };
        this.programCustomFields =
          await this.getProgramCustomField(programParams);
        const programDefaults = await this.getProgramDefault(
          this.programOptions[0].value,
        );

        if (programDefaults && programDefaults.assetTypePath) {
          this.selectedProgramAssetType = programDefaults.assetTypePath;
          this.isMotorVehicle =
            programDefaults.assetTypePath.includes('Motor Vehicles');
          this.vehicleDetails.reset();
        }
      }
      // this.mainForm.updateList('programname', this.programOptions);
    } catch (error) {
      console.log('Error While Getting Data');
    }
  }

  private validateVehicleDetails(): boolean {
    let hasError = false;
    const vehicleDetails = this.vehicleDetails;
    const assetType = this.assetForm.get('assetType')?.value;

    // Only validate if single asset is selected
    if (assetType === 'single') {
      if (this.isMotorVehicle) {
        // Motor Vehicle validation
        const requiredFields = [
          'make',
          'model',
          'year',
          'vin',
          'registrationDate',
        ];

        requiredFields.forEach((field) => {
          const control = vehicleDetails.get(field);
          let isEmpty = false;
          if (field === 'year') {
            isEmpty = !control?.value;
          } else {
            isEmpty = !control?.value || control.value.trim() === '';
          }

          if (control && isEmpty) {
            control.setErrors({ required: true });
            control.markAsTouched();
            hasError = true;
          }
          // VIN validation
          if (field === 'vin' && control.value && control.value.length !== 17) {
            control.setErrors({ ...(control.errors || {}), vinLength: true });
            hasError = true;
          }
        });
      } else {
        // Non-Motor Vehicle validation
        const nonMvRequiredFields = [
          'chassisNo',
          'registrationDate',
          'make',
          'model',
          'year',
        ];

        nonMvRequiredFields.forEach((field) => {
          const control = vehicleDetails.get(field);
          let isEmpty = false;
          if (field === 'year') {
            isEmpty = !control?.value;
          } else {
            isEmpty = !control?.value || control.value.trim() === '';
          }

          if (control && isEmpty) {
            control.setErrors({ required: true });
            control.markAsTouched();
            hasError = true;
          }
        });
      }
    }

    return hasError;
  }

  private validateDisbursementDetails(): boolean {
    let hasError = false;
    const disburseFundsTo = this.drawdownDetails.get('disburseFundsTo')?.value;
    if (disburseFundsTo === 'Supplier' || disburseFundsTo === 'Both') {
      const supplierDetails = this.supplierDetails;

      for (let i = 0; i < supplierDetails.length; i++) {
        const supplierGroup = supplierDetails.at(i);
        const supplierNameControl = supplierGroup.get('supplierName');
        const amountControl = supplierGroup.get('amount');

        if (
          !supplierNameControl?.value ||
          supplierNameControl.value.trim() === ''
        ) {
          supplierNameControl?.setErrors({ required: true });
          supplierNameControl?.markAsTouched();
          hasError = true;
        }

        if (!amountControl?.value) {
          amountControl?.setErrors({ required: true });
          amountControl?.markAsTouched();
          hasError = true;
        } else if (amountControl.value <= 0) {
          amountControl?.setErrors({ min: true });
          amountControl?.markAsTouched();
          hasError = true;
        }
      }
    }

    if (
      disburseFundsTo === 'nominatedBankAccount' ||
      disburseFundsTo === 'Both'
    ) {
      const nominatedAmountControl =
        this.drawdownDetails.get('nominatedAmount');

      if (!nominatedAmountControl?.value || nominatedAmountControl.value <= 0) {
        nominatedAmountControl?.setErrors({ required: true });
        nominatedAmountControl?.markAsTouched();
        hasError = true;
      }
    }

    return hasError;
  }

  async submitDrawdownData() {
    // const mainFormData = this.mainForm?.form?.value;
    this.submitted = true;
    const drawdownDetailsData = this.drawdownDetails.value;
    const assetFormData = this.assetForm.value;
    const drawdownFormData = this.drawdownForm.value;
    // const facilityTypeData = mainFormData.facilityType;
    const facilityTypeData = this.form.get('facilityType').value;
    // const floorplanNameData = mainFormData.floorplanname;
    const floorplanNameData = this.form.get('floorplanname').value;
    // const programNameData = mainFormData.programname;
    const programNameData = this.form.get('programname')?.value;

    const invoiceAmountControl = this.drawdownForm.get('invoiceAmount');
    // const facilityControl = this.mainForm.form.get('facilityType');
    const facilityControl = this.form.get('facilityType');
    // const programControl = this.mainForm.form.get('programname');
    const programControl = this.form.get('programname');
    // const floorplannameprogramControl = this.mainForm.form.get('floorplanname');
    const floorplannameprogramControl = this.form.get('floorplanname');

    let hasError = false;

    if (this.drawdownForm.invalid) {
      this.drawdownForm.markAllAsTouched();
      hasError = true;
    }

    if (drawdownFormData.payDrawdownOutOn) {
      const selectedDate = new Date(drawdownFormData.payDrawdownOutOn);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const isDateInPast = selectedDate < today;

      if (isDateInPast) {
        this.drawdownForm
          .get('payDrawdownOutOn')
          ?.setErrors({ dateInPast: true });
        hasError = true;
      }
    } else {
      this.drawdownForm.get('payDrawdownOutOn')?.setErrors({ required: true });
      hasError = true;
    }

    if (!facilityTypeData) {
      // this.mainForm.updateProps('facilityType', {
      //   errorMessage: 'please_select_a_loan',
      // });
      facilityControl?.setErrors({ required: true });
      hasError = true;
    } else {
      // this.mainForm.updateProps('facilityType', { errorMessage: '' });
      facilityControl?.setErrors(null);
    }

    if (!floorplanNameData) {
      // this.mainForm.updateProps('floorplanname', {
      //   errorMessage: 'Please Select Floorplan Name',
      // });
      floorplannameprogramControl?.setErrors({ required: true });
      hasError = true;
    } else {
      // this.mainForm.updateProps('floorplanname', { errorMessage: '' });
      floorplannameprogramControl?.setErrors(null);
    }

    if (!programNameData && assetFormData.assetType === 'single') {
      this.mainForm.updateProps('programname', {
        errorMessage: 'Please Select Program Name',
      });
      programControl?.setErrors({ required: true });
      hasError = true;
    } else {
      // this.mainForm.updateProps('programname', { errorMessage: '' });
      programControl?.setErrors(null);
    }

    if (drawdownFormData.gstType === 'Incl GST') {
      const invoiceAmount = Number(drawdownFormData.invoiceAmount);
      const advanceAmount = Number(drawdownFormData.advanceRequested);
      const gstRate = Number(this.taxrate);
      const programDrawdownPercent = Number(
        this.programCustomFields.find((field) => field.name === 'Drawdown %')
          ?.value,
      );
      const fundGst = this.programCustomFields.find(
        (field) => field.name === 'Fund GST',
      )?.value;

      const invoiceAmountInc = invoiceAmount;
      const invoiceAmountEx = invoiceAmount / (1 + gstRate / 100);

      let programLevelAmount;

      if (fundGst === 'Inclusive') {
        programLevelAmount = (invoiceAmountInc * programDrawdownPercent) / 100;
      } else {
        programLevelAmount = (invoiceAmountEx * programDrawdownPercent) / 100;
      }

      if (advanceAmount > programLevelAmount) {
        invoiceAmountControl?.setErrors({
          ...invoiceAmountControl?.errors,
          advanceExceedsProgram: {
            message: `Advance (${advanceAmount}) exceeds max (${programLevelAmount.toFixed(
              2,
            )})`,
          },
        });
        invoiceAmountControl?.markAsTouched();
        hasError = true;
      } else {
        const errors = { ...invoiceAmountControl?.errors };
        if (errors) {
          delete errors['advanceExceedsProgram'];
          invoiceAmountControl?.setErrors(
            Object.keys(errors).length ? errors : null,
          );
        }
      }
    } else if (drawdownFormData.gstType === 'Excl GST') {
      const invoiceAmount = Number(drawdownFormData.invoiceAmount);
      const advanceAmount = Number(drawdownFormData.advanceRequested);
      const gstRate = Number(this.taxrate);
      const programDrawdownPercent = Number(
        this.programCustomFields.find((field) => field.name === 'Drawdown %')
          ?.value,
      );
      const fundGst = this.programCustomFields.find(
        (field) => field.name === 'Fund GST',
      )?.value;

      const invoiceAmountEx = invoiceAmount;
      const invoiceAmountInc = invoiceAmount * (1 + gstRate / 100);

      let programLevelAmount;
      if (fundGst === 'Inclusive') {
        programLevelAmount = (invoiceAmountInc * programDrawdownPercent) / 100;
      } else {
        programLevelAmount = (invoiceAmountEx * programDrawdownPercent) / 100;
      }

      if (advanceAmount > programLevelAmount) {
        invoiceAmountControl?.setErrors({
          advanceExceedsProgram: {
            message: `Advance amount (${advanceAmount}) exceeds maximum allowed (${programLevelAmount.toFixed(
              2,
            )})`,
          },
        });
        invoiceAmountControl?.markAsTouched();
        hasError = true;
      } else {
        const errors = { ...invoiceAmountControl?.errors };
        if (errors && errors['advanceExceedsProgram']) {
          delete errors['advanceExceedsProgram'];
          invoiceAmountControl?.setErrors(
            Object.keys(errors).length ? errors : null,
          );
        }
      }
    }
    if (this.validateVehicleDetails()) {
      hasError = true;
    }
    if (this.validateDisbursementDetails()) {
      hasError = true;
    }

    if (hasError) {
      this.form.markAllAsTouched();
      this.drawdownDetails.markAllAsTouched();
      return;
    }
    this.uploadeddocs = await this.getDocumentData();
    if (assetFormData.assetType === 'single') {
      const drawdownPostBody: AssetDrawdownRequestBody = {
        programId: programNameData?.value,
        'FacilityType/WholesaleAccount':
          this.dynamicDialogConfig?.data.facilityType,
        wholesaleAccountId:
          this.facilityTypeOptions.find(
            (option) => option.value === facilityTypeData?.value,
          )?.contractId || null,
        isSupplierDisbursement:
          drawdownDetailsData.disburseFundsTo === 'Supplier' ||
          drawdownDetailsData.disburseFundsTo === 'Both',
        drawdownDetails: {
          invoiceAmount: drawdownFormData.invoiceAmount,
          gstIncluded: drawdownFormData.gstType,
          drawdownAmount: drawdownFormData.advanceRequested,
          payDrawdownOutOn: drawdownFormData.payDrawdownOutOn,
          disburseFundsTo: drawdownDetailsData.disburseFundsTo,
        },
        disbursementDetails: {
          nominatedBankAccount: {
            amount: drawdownDetailsData.nominatedAmount || null,
          },
          assets: drawdownDetailsData.disburstmentDetails.map((item) => ({
            stockNumber: item.stock ? [item.stock] : [],
            description: item.assetDescription || '',
          })),
          suppliers:
            drawdownDetailsData.disburseFundsTo === 'Supplier' ||
            drawdownDetailsData.disburseFundsTo === 'Both'
              ? drawdownDetailsData.supplierDetails.map((supplier) => ({
                  supplierName: supplier.supplierName,
                  amount: supplier.amount,
                }))
              : [],
        },
        assetDetails: {
          isMultipleAsset: '',
          singleAsset:
            assetFormData.assetType === 'single'
              ? {
                  assetType: assetFormData.vehicleDetails?.assetType || '',
                  registrationNumber:
                    assetFormData.vehicleDetails?.regoNo || '',
                  vehicleIdentificationNumber:
                    assetFormData.vehicleDetails?.vin || '',
                  chassisNumber: assetFormData.vehicleDetails?.chassisNo || '',
                  color: assetFormData.vehicleDetails?.colour || '',
                  make: assetFormData.vehicleDetails?.make || '',
                  model: assetFormData.vehicleDetails?.model || '',
                  // year: assetFormData.vehicleDetails?.year || '',
                  year:
                    assetFormData.vehicleDetails?.year?.getFullYear?.() ||
                    assetFormData.vehicleDetails?.year ||
                    '',
                  registrationDate:
                    assetFormData.vehicleDetails?.registrationDate || '',
                  assetId: assetFormData.vehicleDetails?.assetId || '',
                }
              : null,
        },
      };
      const floorplanLabel =
        this.subFacilityOptions.find(
          (option) => option.value === floorplanNameData,
        )?.label || '';
      const drawdownTaskPostBody: FixedFloorPlanDrawdownTaskBody = {
        party: { partyNo: this.partyId },
        taskType: taskPostStaticFields.SelfServiceRequest,
        customerName: this.customerName,
        externalData: {
          subjectLine: 'Asset Drawdown Request',
          assetDrawdownRequest: {
            FacilityType: this.dynamicDialogConfig?.data?.facilityType,
            WholesaleAccount: facilityTypeData.contractId.toString(),
            floorplanName: floorplanLabel,
            programName: programNameData.value.toString(),

            drawdownDetails: {
              invoiceAmount: drawdownFormData.invoiceAmount,
              gst: drawdownFormData.gstType,
              advanceAmount: drawdownFormData.advanceRequested,
              payDrawdownOutOnDate: drawdownFormData.payDrawdownOutOn,
            },

            disbursementDetails: {
              to: drawdownDetailsData.disburseFundsTo,
              suppliers:
                drawdownDetailsData.disburseFundsTo === 'Supplier' ||
                drawdownDetailsData.disburseFundsTo === 'Both'
                  ? drawdownDetailsData.supplierDetails.map((supplier) => ({
                      supplierName: supplier.supplierName,
                      amountToSupplier: supplier.amount,
                    }))
                  : [],
              nominatedBankAccount: {
                amountToNominatedBank: Number(
                  drawdownDetailsData.nominatedAmount,
                ),
              },
            },

            assetDetails:
              assetFormData.assetType === 'single' &&
              assetFormData.vehicleDetails
                ? {
                    singleAsset: [
                      {
                        regoNo: assetFormData.vehicleDetails.regoNo || '',
                        vin: assetFormData.vehicleDetails.vin || '',
                        chassisNo: assetFormData.vehicleDetails.chassisNo || '',
                        colour: assetFormData.vehicleDetails.colour || '',
                        make: assetFormData.vehicleDetails.make || '',
                        model: assetFormData.vehicleDetails.model || '',
                        year:
                          assetFormData.vehicleDetails?.year?.getFullYear?.() ||
                          assetFormData.vehicleDetails?.year ||
                          '',
                        registrationDate:
                          assetFormData.vehicleDetails.registrationDate || '',
                        assetId: assetFormData.vehicleDetails.assetId || '',
                      },
                    ],
                  }
                : null,
          },
        },

        apTaskNoteAttachmentRequest: {
          apAttachmentFiles: this.uploadeddocsfortask,
        },
      };
      // await this.commonapiService.postTaskRequest(drawdownTaskPostBody);
      await this.submitDrawdownRequest(drawdownPostBody, drawdownTaskPostBody);
    } else {
      this.uploadeddocsfortask = await this.getDocumentDataForTask();
      const floorplanLabel =
        this.subFacilityOptions.find(
          (option) => option.value === floorplanNameData,
        )?.label || '';

      const drawdownPostBody: AssetDrawdownRequestBodyTask = {
        party: { partyNo: this.partyId },
        taskType: taskPostStaticFields.SelfServiceRequest,
        customerName: this.customerName,
        externalData: {
          subjectLine: 'Asset Drawdown Request',
          assetDrawdownRequest: {
            // FacilityType: String(facilityTypeData),
            facilityType: this.dynamicDialogConfig?.data?.facilityType,
            floorplanName: floorplanLabel,
            programName: '',
            wholesaleAccount: facilityTypeData.value,

            drawdownDetails: {
              invoiceAmount: drawdownFormData.invoiceAmount,
              gst: drawdownFormData.gstType,
              advanceAmount: drawdownFormData.advanceRequested,
              payDrawdownOutOnDate: drawdownFormData.payDrawdownOutOn,
            },

            disbursementDetails: {
              to: drawdownDetailsData.disburseFundsTo,
              suppliers:
                drawdownDetailsData.disburseFundsTo === 'Supplier' ||
                drawdownDetailsData.disburseFundsTo === 'Both'
                  ? drawdownDetailsData.supplierDetails.map((supplier) => ({
                      supplierName: supplier.supplierName,
                      amountToSupplier: supplier.amount,
                    }))
                  : [],
              nominatedBankAccount: {
                amountToNominatedBank: Number(
                  drawdownDetailsData.nominatedAmount,
                ),
              },
            },
            assetDetails:
              assetFormData.assetType === 'single' &&
              assetFormData.vehicleDetails
                ? {
                    singleAsset: {
                      assetType: assetFormData.vehicleDetails.assetType || '',
                      registrationNumber:
                        assetFormData.vehicleDetails.regoNo || '',
                      vehicleIdentificationNumber:
                        assetFormData.vehicleDetails.vin || '',
                      chassisNumber:
                        assetFormData.vehicleDetails.chassisNo || '',
                      color: assetFormData.vehicleDetails.colour || '',
                      make: assetFormData.vehicleDetails.make || '',
                      model: assetFormData.vehicleDetails.model || '',
                      // year: assetFormData.vehicleDetails.year || '',
                      year:
                        assetFormData.vehicleDetails?.year?.getFullYear?.() ||
                        assetFormData.vehicleDetails?.year ||
                        '',
                      registrationDate:
                        assetFormData.vehicleDetails.registrationDate || '',
                      assetId: assetFormData.vehicleDetails.assetId || '',
                    },
                  }
                : assetFormData.assetType === 'multiple' &&
                    assetFormData.multipleAssets?.length
                  ? {
                      multipleAsset: assetFormData.multipleAssets.map(
                        (asset) => ({
                          stockNumber: asset.stockNo,
                          assetDescription: asset.description,
                        }),
                      ),
                    }
                  : {},

            additionalInformation: this.remarks,
          },
        },
        apTaskNoteAttachmentRequest: {
          apAttachmentFiles: this.uploadeddocsfortask,
        },
      };
      await this.submitDrawdownRequestTask(drawdownPostBody);
    }
  }

  async submitDrawdownRequest(
    params: AssetDrawdownRequestBody,
    drawdownTaskPostBody,
  ) {
    try {
      const newAssetDrawdownRequestResponse =
        await this.commonapiService.newAssetDrawdownRequest();
      const assetDrawdownPayload = {
        wholesaleAssetContract: { ...newAssetDrawdownRequestResponse },
        ...params,
      };
      this.referenceNumber =
        await this.commonapiService.assetDrawdownRequest(assetDrawdownPayload);
      await this.commonapiService.postTaskRequest(drawdownTaskPostBody);
      const taskId = this.referenceNumber?.data.referenceNumber;
      this.message =
        keys.labelData
          .fixed_floorplan_drawdown_request_your_request_has_been_submitted_to_udc_finance_for_processing_and_approval_request_number_is +
        `${taskId} ` +
        keys.labelData
          .approval_is_subject_to_the_terms_and_conditions_applicable_to_your_dealer_floorplan_facility_agreement_fixed_you_can_track_its_progress_in_your_request_history;

      this.uploadeddocs = await this.getDocumentData();
      if (this.uploadeddocs && this.uploadeddocs.length > 0) {
        const parameters = {
          contractId: this.referenceNumber.data.referenceNumber,
        };
        await this.uploadDocs(parameters, this.uploadeddocs);
      }
      const contractNotesParams: ContractNotesParams = {
        facilityTypeRequest:
          ContractNotesDropdown_values.FixedFloorPlanDrawdown,
      };
      const contractNoteBody: ContractNoteBody = {
        contractId: taskId,
        additionalInfo: this.remarks,
        supplierInfo: this.drawdownDetails.value.supplierDetails?.length
          ? this.drawdownDetails.value.supplierDetails
              .filter(
                (supplier: any) => supplier.supplierName || supplier.amount,
              )
              .map((supplier: any) => ({
                supplierName: supplier.supplierName,
                amount: supplier.amount ? Number(supplier.amount) : null,
              }))
          : null,
        nominatedBankInfo: this.drawdownDetails.value.nominatedAmount
          ? { amount: Number(this.drawdownDetails.value.nominatedAmount) }
          : null,
      };
      await this.commonapiService.postContractNotes(
        contractNotesParams,
        contractNoteBody,
      );
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
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your request. Please try again or contact UDC on ',
        '',
        () => {},
      );
      console.log('Error release error', error);
    }
  }

  async submitDrawdownRequestTask(params: AssetDrawdownRequestBodyTask) {
    try {
      this.referenceNumber =
        await this.commonapiService.postTaskRequest(params);
      const taskId = this.referenceNumber?.taskId;
      this.subject = extractSubjectValue(this.referenceNumber?.subject);
      this.message =
        keys.labelData
          .fixed_floorplan_drawdown_request_your_request_has_been_submitted_to_udc_finance_for_processing_and_approval_request_number_is +
        `${taskId} ` +
        keys.labelData
          .approval_is_subject_to_the_terms_and_conditions_applicable_to_your_dealer_floorplan_facility_agreement_fixed_you_can_track_its_progress_in_your_request_history;
      // this.message = `Your Request has been submitted to UDC Finance for processing and approval. Request Number is: ${taskId} Approval is subject to the terms and conditions applicable to your facility.`;

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
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your request. Please try again or contact UDC on ',
        '',
        () => {},
      );
      console.log('Error release error', error);
    }
  }

  async uploadDocs(params: UploadDocsParams, documentBody) {
    try {
      await this.commonapiService.postDocuments(params, documentBody);
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }

  getUploadedDocs() {
    return this.baseCommSvc.getBaseCommercialFormData();
  }

  private async getDocumentData(): Promise<DocumentUploadRequest[]> {
    const files = this.getUploadedDocs().getValue().documentsData || [];

    try {
      const documentData: DocumentUploadRequest[] = await Promise.all(
        files.map(async (file) => {
          const base64Content = await convertFileToBase64(file.fileData);

          return {
            file: base64Content,
            documentId: 0,
            name: file.fileData.name.substring(
              0,
              file.fileData.name.lastIndexOf('.'),
            ),
            category: 'Other Correspondence',
            description: '',
            type: file.fileData.name.split('.').pop()?.toLowerCase() || '',
            loaded: new Date().toISOString(),
            loadedBy: '',
            source: '',
            isDocumentDeleted: false,
            documentProvider: '',
            securityClassification: 'General',
            reference: '',
            generatedDocs: [],
          };
        }),
      );

      return documentData;
    } catch (error) {
      console.error(
        'Error converting files to DocumentUploadRequest format:',
        error,
      );
      return [];
    }
  }
  private async getDocumentDataForTask(): Promise<any[]> {
    const files = this.getUploadedDocs().getValue().documentsData || [];

    try {
      const binaryFiles = await Promise.all(
        files.map((file) => convertFileToBase64(file.fileData)),
      );
      return files.map(
        (file, index): uploadedFiles => ({
          file: binaryFiles[index],
          fileName: file.fileData.name,
          fileType: file.type,
        }),
      );
    } catch (error) {
      console.error('Error converting files to binary:', error);
      return [];
    }
  }

  showDialogCancel() {
    // this.ref.close();
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

  openMotocheck() {
    this.svc.dialogSvc
      .show(MotocheckComponent, 'Search Asset', {
        templates: {
          footer: null,
        },
        data: {
          registrationPlate: this.assetForm?.value?.vehicleDetails?.regoNo,
          vin: this.assetForm?.value?.vehicleDetails?.vin,
          // programId: this.form?.value?.programname,
          programId: this.form.get('programname')?.value?.value,
        },
        height: '25vw',
        width: '42vw',
        contentStyle: { overflow: 'auto' },
        styleClass: 'dialogue-scroll',
        position: 'center',
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.assetForm.get('vehicleDetails')?.patchValue({
            regoNo: data.registrationPlate,
            vin: data.vin,
            chassisNo: data.chassisNumber,
            colour: data.colour,
            make: data.make,
            model: data.model,
            year: data.year,
            registrationDate: data.registrationDate,
          });
        }
      });
  }
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid Token', error);
      return null;
    }
  }
}
