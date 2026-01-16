import { Component, Input, OnInit } from '@angular/core';
import { BaseFormClass, CommonService, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  formatDate,
  getCurrentAccountLoans,
} from '../../../utils/common-utils';
import { FacilityType, taskPostStaticFields } from '../../../utils/common-enum';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { BaseCommercialClass } from '../../../base-commercial.class';
import { CreditlineDashboardService } from '../../../creditlines/services/creditline-dashboard.service';
import {
  FiAccountInfo,
  SettlementQuoteRequestBody,
} from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { RequestAcknowledgmentComponent } from '../request-acknowledgment/request-acknowledgment.component';
import { AcknowledgmentPopupComponent } from '../../../reusable-component/components/acknowledgment-popup/acknowledgment-popup.component';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';

@Component({
  selector: 'app-request-settlement-quote',
  //standalone: true,
  //imports: [],
  templateUrl: './request-settlement-quote.component.html',
  styleUrls: ['./request-settlement-quote.component.scss'],
})
export class RequestSettlementQuoteComponent extends BaseCommercialClass {
  settlementObject: SettlementQuoteRequestBody;
  partyId: any;
  selectedFacility: string;
  selectedSubFacility: string;
  userDetails;
  uploadeddocs;
  fiAccInfo;
  facilityOptions: any[] = [];
  facilityWiseContractsList: any[] = [];
  facilityTypeOptionList: any[] = [];
  disbursementOfFundsTo: string;
  settlementReason: any[] = [
    'Inquiry Only',
    'Clearing Debt',
    'Selling Asset/s',
    'Insurance Write-off',
    'Upgrading Asset/s',
    'Other',
  ];
  customerName;
  today = new Date();
  loanId;
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
        labelClass: 'mb-4 text-sm',
        name: 'facilityType',
        alignmentType: 'vertical',
        cols: 4,
        className: 'pt-0.5 ml-4 mr-4 w-10rem mt-2',
        nextLine: false,
        options: this.facilityTypeOptionList,
        mode: Mode.view,
        sectionName: 'Section3',
      },
      {
        type: 'dropdown',
        label: 'facility',
        name: 'facility',
        labelClass: 'mb-4 text-sm',
        alignmentType: 'vertical',
        className: 'pt-0.5 ml-6  mr-4 w-12rem mt-2',
        cols: 4,
        nextLine: false,
        options: this.facilityOptions,
        mode: Mode.view,
        hidden: true,
        sectionName: 'Section3',
      },
      {
        type: 'dropdown',
        label: 'loan',
        name: 'loan',
        labelClass: 'mb-4 text-sm',
        className: 'pt-0.5 ml-6 mr-4 w-10rem mt-2 ',
        alignmentType: 'vertical',
        cols: 4,
        nextLine: false,
        options: this.facilityWiseContractsList,
        // errorMessage: 'please_select_a_loan',
        mode: Mode.view,
        sectionName: 'Section3',
      },
      {
        type: 'dates',
        name: 'request_date',
        label: 'request_date',
        cols: 3,
        validators: [Validators.required],
        errorMessage: 'request_date_error_msg',
        className: 'mt-5 mb-5 mr-6 ml-2',
        sectionName: 'Section1',
        inputType: 'vertical',
        labelClass: 'mb-2 -mt-3 text-sm',
      },
      {
        type: 'select',
        label: 'select_settlement_reason',
        name: 'select_settlement_reason',
        labelClass: 'mb-2 -mt-3 text-sm',
        validators: [Validators.required],
        alignmentType: 'vertical',
        className: 'ml-6  mr-4 w-15rem mt-3 text-sm',
        cols: 6,
        nextLine: false,
        options: this.settlementReason,
        errorMessage: 'please_select_settlement_reason_for_loan_settlement',
        sectionName: 'Section1',
      },

      {
        type: 'radio',
        name: 'dis',
        cols: 12,
        options: [
          {
            label:
              'Debit my nominated bank account (Required if settling loan)',
            value:
              'Debit my nominated bank account (Required if settling loan)',
          },
          {
            label: 'I would like to pay UDC directly',
            value: 'I would like to pay UDC directly',
          },
        ],
        className: 'text-sm payment-option non-border pt-4',
        validators: [Validators.required],
        errorMessage: 'please_select_a_payment_option',
        sectionName: 'Section2',
      },
      {
        type: 'text',
        name: 'udc_account_number',
        label: 'udc_bank_account_details',
        cols: 6,
        className: 'mt-1',
        hidden: true,
        sectionName: 'Section2',
        mode: Mode.view,
      },
      {
        type: 'text',
        name: 'payment_reference_number',
        label: 'payment_reference_number',
        cols: 6,
        className: 'mt-1',
        hidden: true,
        sectionName: 'Section2',
        mode: Mode.view,
      },
    ],
    sections: [
      {
        sectionName: 'Section3',
        headerTitle: '',
        sectionClass: 'section-class -mt-4 -pb-2 p-2',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 12,
      },
      {
        sectionName: 'Section1',
        headerTitle: 'repayment_details',
        sectionClass: 'section-class -mt-3 p-2 pb-4',
        headerClass: 'text-sm ml-2 font-bold',
        cols: 6,
      },
      {
        sectionName: 'Section2',
        headerTitle: 'payment_options',
        sectionClass: 'section-class -mt-3 p-2 pb-6',
        headerClass: 'text-sm ml-2 font-bold',
        cols: 6,
      },
    ],
  };

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: CreditlineDashboardService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private commonApiService: CommonApiService,
    private router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {
    super(route, svc, baseSvc);
  }
  override async ngOnInit() {
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty.id;
      this.customerName = currentParty.name;
    });
    this.commonSetterGetterSvc.userDetails$.subscribe((userDtl) => {
      this.userDetails = userDtl;
    });
    this.commonSetterGetterSvc.contractIdForSettlementQuote$.subscribe(
      (loanId) => {
        this.loanId = loanId;
        this.facilityWiseContractsList.push(loanId);
      }
    );
    this.commonSetterGetterSvc.facilityMap$.subscribe((map) => {
      this.facilityTypeOptionList.push(map.FacilityType);
      this.fetchSubfacilityByContractId(map.FacilityType);
    });

    this.fetchFiAcc();
  }
  onTextareaClick(event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.settlementObject.externalData.settlementQuoteRequest.remarks = value;
  }

  fetchSubfacilityByContractId(facilityType: string) {
    this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
      const facilityMap = {
        [FacilityType.Assetlink]: list?.assetLinkDetails ?? [],
        [FacilityType.Easylink]: list?.easyLinkDetails ?? [],
      };

      const details = facilityMap[facilityType];
      const matchingSubfacility = details.find(
        (item) => item.contractId === this.loanId
      );
      this.facilityOptions.push(matchingSubfacility.facilityType);
    });
  }

  override onFormReady() {
    if (this.facilityOptions[0].trim().length) {
      this.mainForm?.updateHidden({
        facility: false,
      });
    }
    this.mainForm.form.controls['facilityType']?.setValue(
      this.facilityTypeOptionList[0]
    );
    this.mainForm.form.controls['facility']?.setValue(this.facilityOptions[0]);
    this.mainForm.form.controls['loan']?.setValue(
      this.facilityWiseContractsList[0]
    );
    const maxDate = new Date();
    maxDate.setFullYear(this.today.getFullYear() + 1);

    this.mainForm.updateProps('request_date', {
      minDate: formatDate(this.today),
      maxDate: formatDate(maxDate),
    });
  }

  formatDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  override onValueChanges(event) {
    this.settlementObject = {
      party: {
        partyNo: this.partyId,
      },
      taskType: taskPostStaticFields.SelfServiceRequest,
      customerName: `${this.customerName}`,
      comments: '',
      externalData: {
        subjectLine: '',
        settlementQuoteRequest: {
          facilityType: event.facilityType,
          subFacility: event.facility,
          loan: event.loan,
          requestSettlementDate: event.request_date,
          settlementReason: event.select_settlement_reason,
          paymentOptions: this.disbursementOfFundsTo,
          udcBankAccountDetails: event.udc_account_number
            ? event.udc_account_number
            : null,
          paymentReferenceNumber: event.payment_reference_number
            ? Number(event.payment_reference_number)
            : 0,
          remarks: '',
        },
      },
      apTaskNoteAttachmentRequest: {
        apAttachmentFiles: this.uploadeddocs,
      },
    };
  }

  override onFormEvent(event) {
    if (
      event.name === 'dis' &&
      event.value === 'I would like to pay UDC directly'
    ) {
      this.mainForm?.updateHidden({
        udc_account_number: false,
        payment_reference_number: false,
      });
      this.mainForm?.form?.controls['udc_account_number']?.addValidators(
        Validators.required
      );
      this.mainForm.form.controls['payment_reference_number'].addValidators(
        Validators.required
      );
      this.disbursementOfFundsTo = event.value;
      this.mainForm
        ?.get('udc_account_number')
        .patchValue(this.fiAccInfo?.accountNumber);
      this.mainForm
        ?.get('payment_reference_number')
        .patchValue(this.userDetails?.customerNumber);
      this.mainForm?.updateProps('udc_account_number', { mode: 'view' });
      this.mainForm?.updateProps('payment_reference_number', { mode: 'view' });
    } else if (
      event.name === 'dis' &&
      event.value ===
        'Debit my nominated bank account (Required if settling loan)'
    ) {
      this.mainForm?.updateHidden({
        udc_account_number: true,
        payment_reference_number: true,
      });
      this.mainForm?.clearInput('udc_account_number');
      this.mainForm?.clearInput('payment_reference_number');
      this.mainForm?.form?.controls['udc_account_number']?.removeValidators(
        Validators.required
      );
      this.mainForm?.form?.controls[
        'payment_reference_number'
      ]?.removeValidators(Validators.required);
      this.disbursementOfFundsTo = event.value;
    }
  }

  async fetchFiAcc() {
    const params: FiAccountInfo = { partyId: this.partyId };
    const response = await this.commonApiService.getFiAccountInfo(params);
    this.fiAccInfo = response?.data?.bankDetail;
  }

  async submitData() {
    const statusInvalid = this.validate();
    if (statusInvalid === 'VALID') {
      this.postSettlementRequest(this.settlementObject);
    }
  }

  async postSettlementRequest(settlementObject) {
    try {
      const res = await this.commonApiService.postTaskRequest(settlementObject);
      const taskId = res.taskId;
      //const subject = 'Request Settlement Quote';
      const message =
        'Your Request has been submitted to UDC Finance for processing and approval Request Number is:' +
        taskId;
      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: { message },
          height: '300px',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          // styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: any) => {
          this.router.navigate([
            `commercial/${this.facilityTypeOptionList[0].toLowerCase()}`,
          ]);
        });
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
    this.svc.dialogSvc
      .show(CancelPopupComponent, ' ', {
        templates: {
          footer: null,
        },
        data: '',
        width: '30vw',
        height: '16vw',
      })
      .onClose.subscribe((data: any) => {
        if (data.data == 'cancel') {
          this.router.navigate([
            `commercial/${this.facilityTypeOptionList[0].toLowerCase()}`,
          ]);
        }
      });
  }
}
