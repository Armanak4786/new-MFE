import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
  ToasterService,
} from 'auro-ui';
import { formatDate } from '../../../utils/common-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { CancelPopupComponent } from '../../../reusable-component/components/cancel-popup/cancel-popup.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ContractIdParams,
  ContractNoteBody,
  ContractNotesParams,
  FloatingFloorplanDrawdownRequest,
  FloatingRepaymentRequest,
} from '../../../utils/common-interface';
import { AcknowledgmentPopupComponent } from '../../../reusable-component/components/acknowledgment-popup/acknowledgment-popup.component';
import { CommonApiService } from '../../../services/common-api.service';
import { BaseCommercialClass } from '../../../base-commercial.class';
import { CreditlineDashboardService } from '../../../creditlines/services/creditline-dashboard.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import {
  ContractNotesDropdown_values,
  FacilityType,
} from '../../../utils/common-enum';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-floating-floor-plan-drawdown-request',
  // standalone: true,
  // imports: [],
  templateUrl: './floating-floor-plan-drawdown-request.component.html',
  styleUrl: './floating-floor-plan-drawdown-request.component.scss',
})
export class FloatingFloorPlanDrawdownRequestComponent extends BaseCommercialClass {
  partyId: any;
  selectedFacility: string;
  selectedSubFacility: string;
  userDetails;
  uploadeddocs;
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
  referenceNumber;
  username;
  contractStatus;
  message;
  customerPartyAccount;

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
        sectionName: 'Section1',
      },
      {
        type: 'dropdown',
        label: 'facility',
        name: 'facility',
        labelClass: 'mb-4',
        alignmentType: 'vertical',
        validators: [Validators.required],
        className: 'pt-0.5 ml-6  mr-4 w-15rem mt-2',
        cols: 5,
        nextLine: false,
        options: this.facilityOptions,
        // mode: Mode.view,
        sectionName: 'Section1',
      },
      {
        type: 'dropdown',
        label: 'id_ref',
        labelClass: 'mb-4',
        name: 'loan',
        className: 'pt-0.5 ml-6 mr-4 w-10rem mt-2',
        alignmentType: 'vertical',
        cols: 3,
        validators: [Validators.required],
        nextLine: false,
        options: this.facilityWiseContractsList,
        hidden: false,
        sectionName: 'Section1',
        errorMessage: 'ID Ref is Required',
      },
      {
        type: 'amount',
        name: 'advancerequested',
        label: 'advance_requested',
        labelClass: 'mb-1',
        cols: 2,
        className: 'mt-3 mr-6',
        hidden: false,
        validators: [Validators.required, Validators.min(0.01)],
        sectionName: 'Section2',
        inputType: 'vertical',
      },
      {
        type: 'dates',
        name: 'paydrawdownouton',
        label: 'pay_drawdown_out_on',
        cols: 2,
        validators: [Validators.required],
        className: 'mt-3 mb-5 mr-6 ml-2',
        sectionName: 'Section2',
        inputType: 'vertical',
        default: formatDate(this.today),
      },
    ],
    sections: [
      {
        sectionName: 'Section1',
        headerTitle: '',
        sectionClass: 'section-class -mt-5',
        headerClass: 'text-xs ml-2 font-bold',
        cols: 12,
      },
      {
        sectionName: 'Section2',
        headerTitle: 'drawdown_details',
        sectionClass: 'section-class p-4',
        headerClass: 'text-sm font-bold',
        cols: 12,
      },
    ],
  };

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: CreditlineDashboardService,
    public dynamicDialogConfig: DynamicDialogConfig,
    private commonApiService: CommonApiService,
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
    this.customerName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;
    if (this.dynamicDialogConfig?.data) {
      this.selectedFacility = this.dynamicDialogConfig?.data?.facilityType;
      this.facilityTypeOptionList.push(this.selectedFacility);
      this.facilityType = this.selectedFacility;
      this.selectedSubFacility =
        this.dynamicDialogConfig?.data?.subfacility?.facilityName || '';
      if (this.selectedSubFacility?.trim()) {
        this.facilityOptions.push(this.selectedSubFacility);
        this.loadContractsByFacility(
          this.selectedSubFacility,
          FacilityType.FloatingFloorPlan_Group
        );
      } else {
        this.loadFacilityContractsByType(this.selectedFacility);
      }
    } else {
    }
    let decodedToken = sessionStorage.getItem('accessToken');
    this.username = this.decodeToken(decodedToken)?.sub;
  }

  loadFacilityContractsByType(facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
     const financialList=JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
      const facilityMap = {
        [FacilityType.FloatingFloorPlan_Group]:
          financialList?.floatingFloorplanDetails ?? [],
      };
      const details = facilityMap[facilityType];
      if (facilityType === FacilityType.FloatingFloorPlan_Group) {
        this.facilityOptions = details
          .filter((item) => item.contractId === 0)
          .map((item) => ({
            label: item.facilityName,
            value: item.facilityName,
          }));
      }
    // });
  }

  // onTextareaClick(event) {
  //   const value = (event.target as HTMLTextAreaElement).value;
  //   this.remarks = value;
  // }

  override onFormReady() {
    this.mainForm?.form.controls['facilityType']?.setValue(
      this.selectedFacility
    );
    this.mainForm?.form.controls['facility']?.setValue(
      this.selectedSubFacility
    );
    this.mainForm?.updateList('facility', this.facilityOptions);
    this.mainForm?.updateList('loan', this.facilityWiseContractsList);
    if (this.facilityWiseContractsList?.length === 1) {
      this.mainForm?.form.controls['loan']?.setValue(
        this.facilityWiseContractsList[0]
      );
    }
  }

  override async onValueEvent(event) {
    if (event.name === 'loan') {
      this.mainForm.form.controls['loan']?.setValue(event.data.raw.value);
      const params = {
        ContractId: event.data.raw.value,
      };
      const response = await this.getContractStatus(params);
      this.contractStatus = response.data.contractStatus;
      const responseOfContract =
        await this.commonApiService.getContractIdForFloatingFloorPlan(params);
      this.customerPartyAccount = responseOfContract?.customerPartyAccount;
    }
    if (event.name === 'facility') {
      this.loadContractsByFacility(
        event.data.value,
        FacilityType.FloatingFloorPlan_Group
      );
    }
  }
  loadContractsByFacility(facility: string, facilityType: string) {
    // this.dashboardSetterGetterSvc.financialList$.subscribe((list) => {
     const financialList=JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
      const facilityMap = {
        [FacilityType.FloatingFloorPlan_Group]:
          financialList?.floatingFloorplanDetails ?? [],
      };
      const contracts = facilityMap[facilityType];
      const filteredContracts = contracts.filter(
        (item) =>
          item.facilityName === facility &&
          item.contractId !== 0 &&
          item.facilityType?.trim()
      );

      this.facilityWiseContractsList = filteredContracts.map((contract) => ({
        label: contract.contractId,
        value: contract.contractId,
      }));
      this.mainForm.updateList('loan', this.facilityWiseContractsList);
      if (this.facilityWiseContractsList?.length === 1) {
        this.mainForm?.form.controls['loan']?.setValue(
          this.facilityWiseContractsList[0]
        );
      }
    // });
  }

  async submitDrawdownData() {
    const mainFormData = this.mainForm?.form?.value;

    const drawdowndate = mainFormData.paydrawdownouton;
    const advancerequested = mainFormData.advancerequested;
    const subfacility = mainFormData.facility;
    let hasError = false;

    if (!subfacility || !subfacility.trim()) {
      this.mainForm.updateProps('facility', {
        errorMessage: 'Please Select Facility',
      });
      this.mainForm.get('facility')?.setErrors({ required: true });
      hasError = true;
    } else {
      this.mainForm.updateProps('facility', { errorMessage: '' });
    }
    if (!advancerequested) {
      this.mainForm.updateProps('advancerequested', {
        errorMessage: 'Please Enter Advance Requested Amount',
      });
      this.mainForm.get('advancerequested')?.setErrors({ required: true });
      hasError = true;
    } else {
      this.mainForm.updateProps('advancerequested', { errorMessage: '' });
    }

    if (drawdowndate) {
      const selectedDate = new Date(drawdowndate);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const isDateInPast = selectedDate < today;

      if (isDateInPast) {
        this.mainForm.get('paydrawdownouton')?.setErrors({ dateInPast: true });
        this.mainForm.updateProps('paydrawdownouton', {
          errorMessage: 'payment_date_not_in_the_past',
        });
        hasError = true;
      }
    } else {
      this.mainForm.get('paydrawdownouton')?.setErrors({ required: true });
      this.mainForm.updateProps('paydrawdownouton', {
        errorMessage: 'enter_drawdown_date',
      });
      hasError = true;
    }

    if (hasError) {
      this.mainForm.form.markAllAsTouched();
      return;
    }
    if (this.contractStatus === 'Active') {
      const floatingFloorplanDrawdownRequest: FloatingFloorplanDrawdownRequest =
        {
          drawdownRequest: {
            externalDt: this.mainForm.value.paydrawdownouton,
            internalDt: this.mainForm.value.paydrawdownouton,
            // comments: this.remarks,
            drawdowns: [
              {
                party: {
                  partyId: this.customerPartyAccount?.partyId,
                  partyNo: this.customerPartyAccount?.partyNo,
                  reference: '',
                  extName: '',
                },
                partyAccount: {
                  accountNo: this.customerPartyAccount?.accountNo,
                },
                drawdownAmt: this.mainForm.value.advancerequested,
              },
            ],
          },
        };
      const contractId = {
        contractId: this.mainForm.value.loan,
      };
      await this.submitDrawdownRequest(
        floatingFloorplanDrawdownRequest,
        contractId
      );
    } else {
      this.toasterService.showToaster({
        severity: 'error',
        detail:
          'Your Request could not be completed. Please contact UDC Finance on 0800 500 832.',
      });
      return;
    }
  }
  async submitDrawdownRequest(
    params: FloatingFloorplanDrawdownRequest,
    contractId: ContractIdParams
  ) {
    try {
      this.referenceNumber =
        await this.commonApiService.floatingDrawdownRequest(params, contractId);
      const parameters = {
        ContractId: this.referenceNumber?.data?.contractId,
      };
      this.contractStatus = await this.getContractStatus(parameters);
      const contractNotesParams: ContractNotesParams = {
        facilityTypeRequest:
          ContractNotesDropdown_values.FloatingFloorPlanDrawDown,
      };
      const contractNoteBody: ContractNoteBody = {
        contractId: this.referenceNumber?.data?.contractId,
      };
      this.postContractNotes(contractNotesParams, contractNoteBody);
      const formattedDate = new Date(
        this.mainForm.value.paydrawdownouton
      ).toLocaleDateString('en-GB');
      if (this.contractStatus?.data?.contractStatus === 'Active') {
        this.message = `Floating Floorplan Drawdown Your Request has been submitted to UDC Finance for processing and approval. Request Number is:${this.referenceNumber?.data?.contractRestructureId}`;
      } else {
        this.message = `Floating Floorplan Drawdown Your Request has been submitted successfully. Request Number is: ${this.referenceNumber?.data?.contractRestructureId} The Advance will be direct credited to your nominated bank account on ${formattedDate}.`;
      }

      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: { message: this.message },
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
      return;
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
  async getContractStatus(params) {
    try {
      const response = await this.commonApiService.getContractStatus(params);
      return response;
    } catch (error) {
      console.log('Error getting program defaults:', error);
      return null;
    }
  }
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid Token', error);
      return null;
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
          this.router.navigate([
            `${this.selectedFacility
              .toLowerCase()
              .replace(/\s+/g, '')}`,
          ]);
        }
      });
  }
}
