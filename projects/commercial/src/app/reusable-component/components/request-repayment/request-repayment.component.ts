import { Component, ViewChild } from '@angular/core';
import { RequestAcknowledgmentComponent } from '../../../assetlink/components/request-acknowledgment/request-acknowledgment.component';
import {
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from 'auro-ui';
import { Validators } from '@angular/forms';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { BaseCommercialClass } from '../../../base-commercial.class';
import {
  ContractNoteBody,
  ContractNotesParams,
  FiAccountInfo,
  FloatingRepaymentRequest,
  FloatingRepaymentRequestBody,
  RepaymentRequestBody,
  UploadDocsParams,
  uploadedFiles,
} from '../../../utils/common-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditlineDashboardService } from '../../../creditlines/services/creditline-dashboard.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseCommercialService } from '../../services/base-commercial.service';
import {
  convertFileToBase64,
  formatDate,
  getCurrentAccountLoans,
  getMatchingFacilityList,
} from '../../../utils/common-utils';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import {
  ContractNotesDropdown_values,
  FacilityType,
  taskPostStaticFields,
} from '../../../utils/common-enum';
import { CancelPopupComponent } from '../cancel-popup/cancel-popup.component';
import { UploadDocsComponent } from '../upload-docs/upload-docs.component';
import { AcknowledgmentPopupComponent } from '../acknowledgment-popup/acknowledgment-popup.component';
import keys from '../../../../../../../public/assets/api-json/en_US.json';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-request-repayment',
  //standalone: true,
  //imports: [],
  templateUrl: './request-repayment.component.html',
  styleUrls: ['./request-repayment.component.scss'],
})
export class RequestRepaymentComponent extends BaseCommercialClass {
  @ViewChild(UploadDocsComponent) documentsComponent: UploadDocsComponent;

  partyId: any;
  selectedFacility: string;
  selectedSubFacility: string;
  userDetails;
  uploadeddocs;
  repaymentObject: RepaymentRequestBody;
  floatingRepaymentObjectTask: FloatingRepaymentRequestBody;
  floatingRepaymentObject: FloatingRepaymentRequest;
  fiAccInfo;
  facilityOptions = [];
  facilityWiseContractsList: any[] = [];
  facilityList;
  facilityTypeOptionList: any[] = [];
  disbursementOfFundsTo: string;
  customerName;
  today = new Date();
  facilityType: any;
  contractId;
  remarks;
  floatingContractsList;

  override formConfig: GenericFormConfig = {
    headerTitle: 'Dynamic Form',
    cardType: 'border',
    cardBgColor: '',
    bodyClass: 'form-body',
    api: '',
    apiParam: '',
    fields: [
      {
        type: 'select',
        label: 'facility_type',
        labelClass: 'mb-4',
        name: 'facilityType',
        alignmentType: 'vertical',
        cols: 4,
        className: 'pt-0.5 ml-4 mr-4 w-12rem mt-2',
        validators: [Validators.required],
        // nextLine: false,
        options: this.facilityTypeOptionList,
        mode: Mode.view,
        sectionName: 'Section3',
      },
      {
        type: 'select',
        label: 'facility',
        name: 'facility',
        labelClass: 'mb-4',
        alignmentType: 'vertical',
        validators: [Validators.required],
        className: 'my-custom-dropdown pt-0.5 ml-6  mr-4 w-20rem mt-2',
        cols: 5,
        nextLine: false,
        options: this.facilityOptions,
        // mode: Mode.view,
        sectionName: 'Section3',
      },
      {
        type: 'select',
        label: 'loan',
        labelClass: 'mb-4',
        name: 'loan',
        className: 'pt-0.5 ml-6 mr-4 w-10rem mt-2',
        alignmentType: 'vertical',
        cols: 3,
        validators: [Validators.required],
        nextLine: false,
        options: this.facilityWiseContractsList,
        hidden: false,
        sectionName: 'Section3',
      },
      {
        type: 'amount',
        name: 'payment_amount',
        label: 'payment_amount',
        labelClass: 'mb-1',
        cols: 4,
        className: 'mt-3 mr-6',
        hidden: false,
        validators: [Validators.required, Validators.min(0.01)],
        // errorMessage: 'payment_error_msg',
        sectionName: 'Section1',
        inputType: 'vertical',
      },
      {
        type: 'dates',
        name: 'request_date',
        label: 'request_date',
        cols: 5,
        validators: [Validators.required],
        className: 'mt-3 mb-5 mr-6 ml-2',
        sectionName: 'Section1',
        // minDate: this.today,
        // maxDate: this.maxDate,
        inputType: 'vertical',
        default: formatDate(this.today),
      },

      {
        type: 'radio',
        name: 'dis',
        cols: 12,
        options: [
          {
            label: 'Debit my nominated bank account',
            value: 'Debit my nominated bank account',
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
        default: 'Debit my nominated bank account',
      },
      {
        type: 'text',
        name: 'udc_account_number',
        label: 'udc_bank_account_details',
        cols: 6,
        hidden: true,
        className: 'mt-1 opacity-0 h-0',
        sectionName: 'Section2',
        mode: Mode.view,
        labelClass: 'p-dropdown1',
      },
      {
        type: 'text',
        name: 'payment_reference_number',
        label: 'payment_reference_number',
        cols: 6,
        className: 'mt-1 opacity-0 h-0',
        sectionName: 'Section2',
        mode: Mode.view,
        labelClass: 'p-dropdown1',
      },
    ],
    sections: [
      {
        sectionName: 'Section3',
        headerTitle: '',
        sectionClass: 'section-class -mt-5',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 12,
      },
      {
        sectionName: 'Section1',
        headerTitle: 'repayment_details',
        sectionClass: 'section-class p-4 pb-8',
        headerClass: 'text-sm font-bold',
        cols: 6,
      },
      {
        sectionName: 'Section2',
        headerTitle: 'payment_options',
        sectionClass: 'section-class p-4 pb-3 min-h-[200px]',
        headerClass: 'text-sm ml-2 font-bold',
        cols: 6,
      },
    ],
  };

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: CreditlineDashboardService,
    public dynamicDialogConfig: DynamicDialogConfig,
    private commonApiService: CommonApiService,
    private baseCommSvc: BaseCommercialService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public ref: DynamicDialogRef,
    public router: Router,
    public toasterService: ToasterService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty.id;
    //   this.customerName = currentParty.name;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.customerName = JSON.parse(
      sessionStorage.getItem('currentParty')
    )?.name;
    // this.commonSetterGetterSvc.userDetails$.subscribe((userDtl) => {
    //   this.userDetails = userDtl;
    // });
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if (this.dynamicDialogConfig?.data) {
      console.log(
        'this.dynamicDialogConfig?.data',
        this.dynamicDialogConfig?.data
      );
      this.selectedFacility = this.dynamicDialogConfig?.data?.facilityType;
      console.log('this.selectedFacility', this.selectedFacility);
      this.facilityTypeOptionList.push(this.selectedFacility);
      this.facilityType = this.selectedFacility;
      this.selectedSubFacility =
        this.dynamicDialogConfig?.data?.subfacility?.facilityName || '';
      if (this.selectedSubFacility?.trim()) {
        this.facilityOptions.push(this.selectedSubFacility);
      } else {
        this.loadFacilityContractsByType(this.selectedFacility);
      }
    } else {
      this.mainForm?.updateProps('facilityType', { mode: 'edit' });
    }
    if (this.selectedFacility != 'Floating Floorplan') {
            this.loadFacilityContractsByType(this.selectedFacility);
    } 
    // if (this.selectedSubFacility === 'Current Account') {
    //   // this.mainForm.updateList('loan', this.facilityWiseContractsList);
    // }
    // this.commonSetterGetterSvc.facilityList$.subscribe((data) => {
    //   this.facilityList = data;
    // });
    const storedFacilityList = sessionStorage.getItem('facilityList');
    if (storedFacilityList) {
      this.facilityList = JSON.parse(storedFacilityList);
    }

    this.commonSetterGetterSvc.facilityList$.subscribe((data) => {
      if (data?.length) {
        this.facilityList = data;
        sessionStorage.setItem('facilityList', JSON.stringify(data));
      }
    });

    getMatchingFacilityList(
      this.facilityTypeOptionList,
      this.facilityList,
      this.selectedFacility
    );
    this.fetchFiAcc();
  }

  async getContracts(params): Promise<void> {
    try {
      this.floatingContractsList =
        await this.commonApiService.getContractForFloatingRepayment(params);
      // console.log(response);
      // this.facilityWiseContractsList = response;
      // this.facilityWiseContractsList = response.map(
      //   (item: any) => item.contractId
      // );
      // this.mainForm.updateList('loan', this.facilityWiseContractsList);
      // if (this.facilityWiseContractsList?.length === 1) {
      //   this.mainForm?.form.controls['loan']?.setValue(
      //     this.facilityWiseContractsList[0]
      //   );
      // }
    } catch (error) {
      console.log('Error While Getting Data');
    }
  }

  loadFacilityContractsByType(facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
    const financialList = JSON.parse(
      sessionStorage.getItem('financialSummaryData') || '[]'
    );
    const facilityMap = {
      [FacilityType.Assetlink]: financialList?.assetLinkDetails ?? [],
      [FacilityType.Easylink]: financialList?.easyLinkDetails ?? [],
      [FacilityType.CreditLines]: financialList?.creditlineDetails ?? [],
      [FacilityType.FloatingFloorPlan_Group]:
        financialList?.floatingFloorplanDetails ?? [],
      default: financialList?.nonFacilityLoansDetails ?? [],
    };

    const details = facilityMap[facilityType] || facilityMap.default;
    if (facilityType === FacilityType.FloatingFloorPlan_Group) {
      this.facilityOptions = details
        .filter((item) => item.contractId === 0)
        .map((item) => ({
          label: item.facilityName,
          value: item.facilityName,
        }));
    }
    this.facilityWiseContractsList = getCurrentAccountLoans(details);
    // });
  }

  onTextareaClick(event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.remarks = value;

    if (this.selectedFacility === FacilityType.FloatingFloorPlan_Group) {
      this.floatingRepaymentObjectTask.externalData.floatingfloorplanrepaymentRequest.additionalInfo =
        value;
    } else {
      this.repaymentObject.externalData.repaymentRequest.repaymentDetails.settlementReason =
        value;
    }
  }

  override onFormReady() {
    if (this.selectedFacility === FacilityType.FloatingFloorPlan_Group) {
      const loanControl = this.mainForm.form.get('loan');
      loanControl?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(async (value) => {
          if (value) {
            const params = { contractId: value };
            const res = await this.commonApiService.postContractIdForRepayment(
              params
            );

            this.floatingRepaymentObject = {
              ...this.floatingRepaymentObject,
              contract: res,
            };
          }
        });
      this.mainForm?.updateProps('payment_amount', {
        label: 'repayment_amount',
      });
      this.mainForm?.updateProps('loan', {
        label: 'id_ref',
      });
    }
    this.mainForm?.form.controls['facilityType']?.setValue(
      this.selectedFacility
    );
    if (
      this.selectedSubFacility?.trim() &&
      this.selectedFacility != FacilityType.FloatingFloorPlan
    ) {
      this.mainForm?.form.controls['facility']?.setValue(
        this.selectedSubFacility
      );
      this.mainForm?.updateProps('facility', {
        mode: 'view',
      });
    } else {
      this.mainForm?.updateList('facility', this.facilityOptions);
    }
    this.mainForm?.updateList('loan', this.facilityWiseContractsList);
    if (this.facilityWiseContractsList?.length === 1) {
      this.mainForm?.form.controls['loan']?.setValue(
        this.facilityWiseContractsList[0]
      );
    }

    const maxDate = new Date();
    maxDate.setFullYear(this.today.getFullYear() + 1);

    this.mainForm?.updateProps('request_date', {
      minDate: formatDate(this.today),
      maxDate: formatDate(maxDate),
    });
  }

  override async onValueEvent(event) {
    if (event.name === 'loan') {
      this.mainForm.form.controls['loan']?.setValue(event.data.raw);
      // const params = { contractId: event.data.raw };
      // const res = await this.commonApiService.postContractIdForRepayment(
      //   params
      // );
      // this.floatingRepaymentObject = {
      //   ...this.floatingRepaymentObject,
      //   contract: res,
      // };
    }
  }

  override onValueChanges(event) {
    this.loadFacilityContractsByType(event.facilityType);
    this.contractId = event.loan;
    if (this.selectedFacility === FacilityType.FloatingFloorPlan_Group) {
      if (this.disbursementOfFundsTo === 'I would like to pay UDC directly') {
        this.floatingRepaymentObjectTask = {
          party: { partyNo: this.partyId },
          taskType: taskPostStaticFields.SelfServiceRequest,
          customerName: `${this.customerName}`,
          externalData: {
            subjectLine: '',
            floatingfloorplanrepaymentRequest: {
              facilityType: event.facilityType,
              subFacility: event.facility,

              repaymentDetails: {
                paymentAmount: event.payment_amount,
                requestDate: event.request_date,
                paymentOptions: this.disbursementOfFundsTo,
              },
            },
          },
          apTaskNoteAttachmentRequest: {
            apAttachmentFiles: this.uploadeddocs,
          },
        };
      } else {
        this.floatingRepaymentObject = {
          ...this.floatingRepaymentObject,
          amtRepayment: event.payment_amount,
          // contractId: event.loan,
          payDrawdownOutOnDt: event.request_date,
        };
      }
    } else {
      this.repaymentObject = {
        party: { partyNo: this.partyId },
        taskType: taskPostStaticFields.SelfServiceRequest,
        customerName: `${this.customerName}`,
        externalData: {
          subjectLine: '',
          repaymentRequest: {
            partyId: this.partyId,
            facilityType: event.facilityType,
            subFacility: event.facility,
            loan: event.loan,
            repaymentDetails: {
              paymentAmount: event.payment_amount,
              requestDate: event.request_date,
              paymentOptions: this.disbursementOfFundsTo,
            },
            remarks: '',
          },
        },
        apTaskNoteAttachmentRequest: {
          apAttachmentFiles: this.uploadeddocs,
        },
      };
    }
  }

  override async onFormEvent(event) {
    if (
      event.name === 'dis' &&
      event.value === 'I would like to pay UDC directly'
    ) {
      const showFields = event.value === 'I would like to pay UDC directly';

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
      this.mainForm?.updateProps('udc_account_number', {
        className: showFields
          ? 'mt-1 opacity-100 h-auto'
          : 'mt-1 opacity-0 h-0',
      });

      this.mainForm?.updateProps('payment_reference_number', {
        className: showFields
          ? 'mt-1 opacity-100 h-auto'
          : 'mt-1 opacity-0 h-0',
      });

      this.disbursementOfFundsTo = event.value;

      if (showFields) {
        // Set values when showing
        this.mainForm
          ?.get('udc_account_number')
          .patchValue(this.fiAccInfo?.accountNumber);
        this.mainForm
          ?.get('payment_reference_number')
          .patchValue(this.userDetails?.customerNumber);
      }
    } else if (
      event.name === 'dis' &&
      event.value === 'Debit my nominated bank account'
    ) {
      const showFields = event.value === 'Debit my nominated bank account';
      this.mainForm?.clearInput('udc_account_number');
      this.mainForm?.clearInput('payment_reference_number');
      this.mainForm?.form?.controls['udc_account_number']?.removeValidators(
        Validators.required
      );
      this.mainForm?.form?.controls[
        'payment_reference_number'
      ]?.removeValidators(Validators.required);
      this.mainForm?.updateProps('udc_account_number', {
        className: 'mt-1 opacity-0 h-0',
      });

      this.mainForm?.updateProps('payment_reference_number', {
        className: 'mt-1 opacity-0 h-0',
      });
      this.mainForm?.form?.controls['udc_account_number'].disable();
      this.mainForm?.form?.controls['payment_reference_number'].disable();

      // this.mainForm?.updateHidden({
      //   udc_account_number: true,
      //   payment_reference_number: true,
      // });
      this.disbursementOfFundsTo = event.value;
    }
    if (
      this.selectedFacility === FacilityType.FloatingFloorPlan_Group &&
      event.name === 'facility'
    ) {
      await this.getContracts({ partyNo: this.partyId });
      const filteredContracts = this.floatingContractsList
        .filter((item: any) => item.creditLineName.trim() === event.value)
        .map((item: any) => item.contractId);

      this.facilityWiseContractsList = filteredContracts;

      this.mainForm.updateList('loan', this.facilityWiseContractsList);

      if (filteredContracts.length === 1) {
        this.mainForm?.form.controls['loan']?.setValue(filteredContracts[0]);
      }
    }
  }

  getUploadedDocs() {
    return this.baseCommSvc.getBaseCommercialFormData();
  }
  async fetchFiAcc() {
    const params: FiAccountInfo = { partyId: this.partyId };
    const response = await this.commonApiService.getFiAccountInfo(params);
    this.fiAccInfo = response?.data?.bankDetail;
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

  async submitData() {
    this.uploadeddocs = await this.getDocumentData();
    if (this.selectedFacility === FacilityType.FloatingFloorPlan_Group) {
      // this.floatingRepaymentObject.apTaskNoteAttachmentRequest.apAttachmentFiles =
      //   this.uploadeddocs;
    } else {
      this.repaymentObject.apTaskNoteAttachmentRequest.apAttachmentFiles =
        this.uploadeddocs;
    }

    this.mainForm?.updateProps('payment_amount', {
      errorMessage: 'payment_error_msg',
    });
    this.mainForm?.updateProps('request_date', {
      errorMessage: 'request_date_error_msg',
    });
    this.mainForm?.updateProps('loan', {
      errorMessage: 'please_select_a_loan',
    });
    const statusInvalid = this.validate();
    if (statusInvalid === 'VALID') {
      if (this.selectedFacility === FacilityType.FloatingFloorPlan_Group) {
        if (this.disbursementOfFundsTo === 'I would like to pay UDC directly') {
          this.postRepaymentRequest(this.floatingRepaymentObjectTask);
        } else {
          this.submitRepaymentRequest();
        }
      } else {
        this.postRepaymentRequest(this.repaymentObject);
      }
    }
  }
  async submitRepaymentRequest() {
    try {
      const res = await this.commonApiService.postFloatingRepaymentRequest(
        this.floatingRepaymentObject
      );
      const taskId = res.data?.referenceNumber;
      const subject = 'Repayment Request';
      const formattedDate = new Date(
        this.floatingRepaymentObject.payDrawdownOutOnDt
      ).toLocaleDateString('en-GB');
      const message =
        keys.labelData
          .floating_floorplan_repayment_your_request_has_been_submitted_successfully_request_number_is +
        `${taskId} ` +
        keys.labelData
          .repayment_will_be_direct_debited_from_your_nominated_bank_account_on_the +
        ` ${formattedDate}`;
      // const message=`Floating Floorplan Repayment Request Your request has been submitted successfully. Request Number is: ${taskId} Repayment will be direct debited from your nominated bank account on the ${repaymentObj.payDrawdownOutOnDt}`;
      const contractNotesParams: ContractNotesParams = {
        facilityTypeRequest:
          ContractNotesDropdown_values.FloatingFloorPlanRepayment,
      };
      const contractNoteBody: ContractNoteBody = {
        contractId: this.contractId,
      };
      this.postContractNotes(contractNotesParams, contractNoteBody);

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
          this.ref.close();
          this.router.navigate([
            `${this.selectedFacility
              .toLowerCase()
              .replace(/\s+/g, '')}`,
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
  async uploadDocs(params: UploadDocsParams, documentBody) {
    try {
      await this.commonApiService.postDocuments(params, documentBody);
      this.documentsComponent.clearDocuments();
      console.log('documentBody', documentBody);
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }

  async postRepaymentRequest(repaymentObj) {
    try {
      const res = await this.commonApiService.postTaskRequest(repaymentObj);
      const taskId = res?.taskId;
      const subject = 'Repayment Request';
      if (this.selectedFacility === FacilityType.FloatingFloorPlan_Group) {
        const message =
          keys.labelData
            .floating_floorplan_repayment_request_request_number_is +
          `${taskId}` +
          keys.labelData
            .thank_you_for_your_repayment_request_please_make_your_payment_using_the_details_provided_UDC_Bank_account +
          `${this.fiAccInfo?.accountNumber} ` +
          keys.labelData.your_reference_number +
          ` ${this.contractId}`;
        // const message=`Floating Floorplan Repayment Request Request Number is: ${taskId} Thank you for your Repayment Request. Please make your payment using the details provided.UDC Bank Account: ${this.fiAccInfo?.accountNumber} Your Reference Number: ${this.contractId} `
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
            this.ref.close();
            this.router.navigate([
              `${this.selectedFacility
                .toLowerCase()
                .replace(/\s+/g, '')}`,
            ]);
          });
      } else {
        this.svc.dialogSvc
          .show(RequestAcknowledgmentComponent, ' ', {
            templates: {
              footer: null,
            },
            data: { taskId, subject },
            height: '300px',
            width: '50vw',
            contentStyle: { overflow: 'auto' },
            // styleClass: 'dialogue-scroll',
            position: 'center',
          })
          .onClose.subscribe((data: any) => {
            this.ref.close();
            this.router.navigate([
              `${this.selectedFacility
                .toLowerCase()
                .replace(/\s+/g, '')}`,
            ]);
          });
      }
    } catch (error) {
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your request. Please try again or contact UDC on ',
        '',
        () => {}
      );
      console.log('Error release error', error);
    }
  }
  async postContractNotes(
    contractNotesParams: ContractNotesParams,
    contractNoteBody
  ) {
    try {
      await this.commonApiService.postContractNotes(
        contractNotesParams,
        contractNoteBody
      );
    } catch (error) {
      console.log('There was an error submitting your request.', error);
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
        height: '18vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          this.ref.close();
          this.router.navigate([
            `${this.selectedFacility
              .toLowerCase()
              .replace(/\s+/g, '')}`,
          ]);
        }
      });
  }
}
