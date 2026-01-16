import { Component } from '@angular/core';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { Validators } from '@angular/forms';
import { BaseCommercialClass } from '../../../base-commercial.class';
import { RequestAcknowledgmentComponent } from '../../../assetlink/components/request-acknowledgment/request-acknowledgment.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { CreditlineDashboardService } from '../../../creditlines/services/creditline-dashboard.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { CommonApiService } from '../../../services/common-api.service';
import { BaseCommercialService } from '../../../reusable-component/services/base-commercial.service';
import { convertToBinary } from '../../../utils/common-utils';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-non-facility-repayment-request',
  //standalone: true,
  //imports: [],
  templateUrl: './non-facility-repayment-request.component.html',
  styleUrls: ['./non-facility-repayment-request.component.scss'],
})
export class NonFacilityRepaymentRequestComponent extends BaseCommercialClass {
  selectedFacility: string;
  selectedSubFacility;
  userDetails;
  reason;
  facilityTypeOptions = [
    { label: 'Asset Link', value: 'AssetLink' },
    { label: 'Easy Link', value: 'EasyLink' },
    { label: 'Credit Lines', value: 'CreditLines' },
    { label: 'Non Facility Loan', value: 'NonFacilityLoan' },
  ];
  facilityOptions = [
    { label: 'View Non-facility', value: 1 },
    { label: 'Current-Account', value: 5 },
  ];
  loanOptions = [
    { label: 'Loan 1', value: '1' },
    { label: 'Loan 2', value: '2' },
  ];
  repaymentObject = {
    partyId: null,
    facilityType: '',
    facility: '',
    contractId: null,
    requestType: 'RP',
    requestDetails: {
      paymentAmount: null,
      requestDate: '',
      disburseFundsTo: '',
      paymentDetails: {
        nominatedBankAccount: null,
        fiBankAccount: null,
        contractId: null,
      },
    },
    uploadDocuments: [
      {
        files: null,
        remarks: '',
      },
    ],
  };

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
        label: 'facility',
        name: 'facilityType',
        labelClass: 'drawdown-label',
        alignmentType: 'vertical',
        validators: [Validators.required],
        cols: 3,
        nextLine: false,
        options: [
          { label: 'Assetlink', value: 'AssetLink' },
          { label: 'Easylink', value: 'EasyLink' },
          { label: 'Operating Lease', value: 'OperatingLease' },
          { label: 'Floating Floorplan', value: 'FloatingFloorplan' },
          { label: 'Fixed Floorplan', value: 'FixedFloorplan' },
          { label: 'Bailments', value: 'Bailments' },
          { label: 'Credit Lines', value: 'CreditLines' },
          { label: 'Buyback Facility', value: 'BuybackFacility' },
          { label: 'Non-facility loan', value: 'NonFacilityLoan' },
          { label: 'Originator Account', value: 'OriginatorAccount' },
        ],
        disabled: true,
        sectionName: 'Section3',
      },
      {
        type: 'dropdown',
        label: 'facility_type',
        labelClass: 'drawdown-label',
        name: 'facility',
        className: 'col-offset-1',
        alignmentType: 'vertical',
        cols: 3,
        validators: [Validators.required],
        nextLine: false,
        options: [
          { label: 'Facility: 123', value: 1 },
          { label: 'Facility: 456', value: 2 },
          { label: 'Current Account', value: 5 },
        ],
        disabled: true,
        sectionName: 'Section3',
      },
      {
        type: 'dropdown',
        label: 'loan',
        labelClass: 'drawdown-label',
        name: 'loan',
        className: 'col-offset-1',
        alignmentType: 'vertical',
        cols: 3,
        validators: [Validators.required],
        nextLine: false,
        options: [
          { label: 'New Loan', value: 'New Loan' },
          { label: 907352719, value: 907352719 },
          { label: 936528291, value: 936528291 },
          { label: 9753771961, value: 9753771961 },
        ],
        errorMessage: 'Please select a Loan',
        sectionName: 'Section3',
      },
      {
        type: 'amount',
        name: 'payment_amount',
        label: 'payment_amount',
        cols: 3,
        className: 'mt-4 mb-5',
        hidden: false,
        validators: [Validators.required, Validators.min(0)],
        errorMessage: 'payment_error_msg',
        sectionName: 'Section1',
      },
      {
        type: 'date',
        name: 'request_date',
        label: 'request_date',
        cols: 3,
        validators: [Validators.required],
        errorMessage: 'request_date_error_msg',
        className: 'mt-4 mb-5 col-offset-5',
        sectionName: 'Section1',
      },

      {
        type: 'radio',
        label: 'payment_options',
        name: 'dis',
        cols: 12,
        options: [
          {
            label: 'Debit by nominated bank account',
            value: 'DEBIT_NOMINATED_ACCOUNT',
          },
        ],
        //validators: [Validators.required],
        className: '',
        errorMessage: 'Please select a payment option',
        sectionName: 'Section2',
      },
      {
        type: 'text',
        name: 'nominated_bank_number',
        label: 'nominated_bank_account',
        cols: 12,
        className: 'mt-1 mb-5',
        hidden: false,
        sectionName: 'Section2',
      },
      {
        type: 'radio',
        name: 'udc_acc',
        cols: 12,
        options: [
          {
            label: 'I would like to pay UDC directly',
            value: 'PAY_FI_DIRECTLY',
          },
        ],
        className: '',
        sectionName: 'Section2',
      },
      {
        type: 'text',
        name: 'udc_account_number',
        label: 'udc_bank_account_details',
        cols: 6,
        className: 'mt-1',
        hidden: false,
        sectionName: 'Section2',
      },
      {
        type: 'text',
        name: 'payment_reference_number',
        label: 'payment_reference_number',
        cols: 6,
        className: 'mt-1',
        hidden: false,
        sectionName: 'Section2',
      },
    ],
    sections: [
      {
        sectionName: 'Section3',
        headerTitle: '',
        sectionClass: 'section-class p-2',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 12,
      },
      {
        sectionName: 'Section1',
        headerTitle: 'repayment',
        sectionClass: 'section-class pb-8 p-2',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 6,
      },
      {
        sectionName: 'Section2',
        headerTitle: 'payment_options',
        sectionClass: 'section-class p-2',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 6,
      },
    ],
  };
  partyId: any;

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: CreditlineDashboardService,
    public dynamicDialogConfig: DynamicDialogConfig,
    private dashSvc: DashboardService,
    private commonApiService: CommonApiService,
    private baseCommSvc: BaseCommercialService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    //this.partyId = JSON.parse(sessionStorage.getItem('currentParty'));
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty;
    });
    this.userDetails = this.dashSvc.getUserInfoData()?.userDetails;
    if (this.dynamicDialogConfig?.data) {
      this.selectedFacility = this.dynamicDialogConfig.data.facilityType;
      this.selectedSubFacility = this.dynamicDialogConfig.data.subFacility;
      console.log(this.dynamicDialogConfig.data);
    }
  }

  onTextareaClick(event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.reason = value;
  }

  onFacilityTypeChange(event) {
    console.log(event);
  }

  override onFormReady() {
    console.log(this.mainForm);
    this.mainForm.form.controls['facilityType']?.setValue(
      this.selectedFacility
    );
    this.mainForm.form.controls['facility']?.setValue(
      this.selectedSubFacility.id
    );
    this.mainForm.form.updateValueAndValidity();
  }

  override onValueChanges(event) {
    if (event.udc_acc) {
      event.nominated_bank_account = '';
    } else if (event.nominated_bank_account) {
      event.udc_acc = '';
    }
    this.repaymentObject.requestDetails.paymentAmount = event.payment_amount;
    this.repaymentObject.requestDetails.requestDate = event.request_date;
    this.repaymentObject.requestDetails.disburseFundsTo =
      event.nominated_bank_account
        ? event.nominated_bank_account
        : event.udc_acc;
    this.repaymentObject.requestDetails.paymentDetails.fiBankAccount =
      event.udc_account_number;
    this.repaymentObject.requestDetails.paymentDetails.contractId =
      event.payment_reference_number;
    this.repaymentObject.requestDetails.paymentDetails.nominatedBankAccount =
      event.nominated_bank_number;
    // this.repaymentObject.uploadDocuments;
  }

  override onButtonClick(event) {
    console.log(event);
  }

  override onFormEvent(event) {
    if (event.name == 'udc_acc') {
      event.value &&
        this.mainForm?.form?.controls['udc_account_number']?.addValidators(
          Validators.required
        );
      this.mainForm.form.controls['payment_reference_number'].addValidators(
        Validators.required
      );
      // this.mainForm.get('totalPaymentAmt').updateValueAndValidity();
    } else if (event.name == 'facilityType') {
      this.mainForm.form.controls['facilityType']?.setValue(
        this.selectedFacility
      );
    } else if (event.name == 'facility') {
      this.mainForm.form.controls['facility']?.setValue(
        this.selectedSubFacility.id
      );
    }
  }

  getUploadedDocs() {
    return this.baseCommSvc.getBaseCommercialFormData();
  }

  private async getDocumentData(): Promise<any[]> {
    const files = this.getUploadedDocs().getValue().documentsData || [];

    try {
      const binaryFiles = await Promise.all(
        files.map((file) => convertToBinary(file.fileData))
      );

      return files.map((file, index) => ({
        file: binaryFiles[index],
        category: 'Asset Information',
        name: file.fileData.name,
      }));
    } catch (error) {
      console.error('Error converting files to binary:', error);
      return [];
    }
  }

  async submitData() {
    console.log(this.mainForm);
    const uploadDocuments = await this.getDocumentData();
    // this.repaymentObject = {
    //   partyId: this.partyId,
    //   facilityType: this.selectedSubFacility.facilityName,
    //   facility: this.selectedFacility,
    //   contractId: this.selectedSubFacility.contractId,
    //   // requestType: 'RP',
    //   // requestDetails: {
    //   //   paymentAmount: 0,
    //   //   requestDate: '2025-04-15T07:31:42.862Z',
    //   //   disburseFundsTo: 'string',
    //   //   paymentDetails: {
    //   //     // nominatedBankAccount: 0,
    //   //     fiBankAccount: 0,
    //   //     contractId: 0,
    //   //   },
    //   // },
    //   uploadDocuments: uploadDocuments,
    // };
    this.repaymentObject.contractId = this.selectedSubFacility.contractId;
    this.repaymentObject.partyId = this.partyId;
    this.repaymentObject.facilityType = this.selectedSubFacility.facilityName;
    this.repaymentObject.facility = this.selectedFacility;
    this.repaymentObject.uploadDocuments = uploadDocuments;
    const statusInvalid = this.validate();
    console.log(
      this.repaymentObject + 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
    );
    if (statusInvalid === 'VALID') {
      this.postRepaymentRequest(this.repaymentObject);
    }
  }

  async postRepaymentRequest(repaymentObj) {
    try {
      await this.commonApiService.postRepaymentRequestData(repaymentObj);
      this.svc.dialogSvc
        .show(RequestAcknowledgmentComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            confirmation:
              'Your request has been submitted to UDC Finance for processing and approval',
          },

          height: '25vw',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {});
    } catch (error) {
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your request. Please try again or contact UDC on ',
        '',
        () => {}
      );
      console.log('Error release error', error);
    }
  }

  showDialogCancel() {
    this.svc?.ui?.showOkDialog(
      'Are you sure you want to cancel? If you confirm all details entered will be lost',
      '',
      () => {}
    );
  }

  onFilesUploaded(event) {
    console.log(event);
  }
}
