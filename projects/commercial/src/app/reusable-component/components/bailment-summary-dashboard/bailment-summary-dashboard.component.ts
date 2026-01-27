import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'auro-ui';

import {
  CUT_OFF_TIME,
  requestType,
  taskPostStaticFields,
} from '../../../utils/common-enum';

import { formatDate, clearSession } from '../../../utils/common-utils';

import { SameDayPayoutRequestBody } from '../../../utils/common-interface';

import { TransferRequestSubmissionComponent } from '../../../bailments/components/transfer-request-submission/transfer-request-submission.component';

import { WarningPopupComponent } from '../warning-popup/warning-popup.component';

import { BailmentComponentLoaderService } from '../../../bailments/services/bailment-component-loader.service';

import { CommonApiService } from '../../../services/common-api.service';

import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';
import { CancelPopupComponent } from '../cancel-popup/cancel-popup.component';
import { AcknowledgmentPopupComponent } from '../acknowledgment-popup/acknowledgment-popup.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-bailment-summary-dashboard',
  templateUrl: './bailment-summary-dashboard.component.html',
  styleUrl: './bailment-summary-dashboard.component.scss',
})
export class BailmentSummaryDashboardComponent implements OnInit, OnDestroy {
  // -------------------- State --------------------
  purchaseAssetDataList;
  dataList;
  purchaseAssetResponse;
  productTransferResponse;
  sameDayPayoutResponse;

  filteredProductTransferDisclaimerList;
  filteredProductTransferResponseList;
  assetDetailsList: any;

  referenceNumber: any;
  receivedData: any;
  currentDate: string;
  effectiveDate: any;

  customerName: any;
  partyDetail: any;
  partyName: any;
  partyId: any;
  productTransferTo: any;
  receiverPartyId: any;
  receiverPartyNo: any;
  receiverPartyName: string = '';
  partyList = [];
  programpartieslist = [];

  requestType: string = requestType.productTransfer;
  searchedBy: string;
  pageFrom: string = '';
  username;
  currentSystemTime;
  systemTime;
  assetServicingRequestResponseSwap;

  constructor(
    private router: Router,
    public svc: CommonService,
    private bailmentComponentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public bailmentSetterGetterService: BailmentSetterGetterService
  ) {}

  // -------------------- Lifecycle --------------------

  ngOnInit() {
    this.initPartyDetails();
    
    // Load receivedData from sessionStorage or router state
    const storedReceivedData = sessionStorage.getItem('bailmentSummaryReceivedData');
    if (storedReceivedData) {
      this.receivedData = JSON.parse(storedReceivedData);
      console.log('this.receivedData (from sessionStorage)', this.receivedData);
    } else {
      this.receivedData = history.state?.params;
      console.log('this.receivedData (from router state)', this.receivedData);
      // Save to sessionStorage for future refreshes
      if (this.receivedData) {
        sessionStorage.setItem('bailmentSummaryReceivedData', JSON.stringify(this.receivedData));
      }
    }
    
    const params = {
      programId: this.receivedData?.programId,
    };

    this.GetProgramsParties(params);

    this.searchedBy = this.receivedData?.searchedBy;
    this.pageFrom = this.receivedData?.pageFrom;

    this.initDataList();
    this.initPartyContext();
    this.initDate();
    let decodedToken = sessionStorage.getItem('accessToken');
    this.username = this.decodeToken(decodedToken)?.sub;
    this.systemTime = sessionStorage.getItem('cutOffTime');
    this.initDate();
    this.newAssetServicingRequest();
  }

  // -------------------- Init Helpers --------------------

  async getCutOffTime() {
    try {
      this.currentSystemTime =
        await this.commonApiService.getCutOffTimeCompare();
      // sessionStorage.setItem(
      //   'cutOffTime',
      //   JSON.stringify(this.currentSystemTime)
      // );
    } catch (error) {
      console.log('Error while loading data', error);
    }
  }
  async newAssetServicingRequest() {
    try {
      if (this.pageFrom === 'swap') {
        this.requestType = requestType.SwapRequest;
        const request = {
          requestType: this.requestType,
          programId: this.receivedData.programId,
        };
        this.assetServicingRequestResponseSwap =
          await this.commonApiService.newAssetServicingRequest(request);
      }
    } catch (error) {
      console.log('Error while loading data', error);
    }
  }

  private initPartyDetails() {
    // this.commonSetterGetterSvc.partyList$.subscribe((partyDetail) => {
    //   this.partyDetail = partyDetail;
    // });
    this.partyDetail=JSON.parse(sessionStorage.getItem('partyDetails') || '[]');;

    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.customerName = currentParty.name;
    // });
    this.customerName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;

  }

  private initDataList() {
    const storedDataList = sessionStorage.getItem('bailmentSummaryDataList');
    
    if (storedDataList) {
      this.dataList = JSON.parse(storedDataList);
      console.log('dataList loaded from sessionStorage', this.dataList);
    } else {
      if (this.pageFrom === 'purchase-asset') {
        if (this.receivedData.typeofnavigation === 'actions') {
          this.dataList = JSON.parse(sessionStorage.getItem('filteredAssetsDataList') || '[]');
        } else {
          this.bailmentSetterGetterService.purchaseRequestData.subscribe(
            (data) => {
              this.dataList = data;
              sessionStorage.setItem('bailmentSummaryDataList', JSON.stringify(this.dataList));
            }
          );
          return;
        }
      } else if (['swap', 'same-day-payout'].includes(this.pageFrom)) {
        this.dataList = JSON.parse(sessionStorage.getItem('filteredAssetsDataList') || '[]');
      }      
      if (this.dataList) {
        sessionStorage.setItem('bailmentSummaryDataList', JSON.stringify(this.dataList));
      }
    }
  }

  private initPartyContext() {
    if (!this.partyDetail?.length) {
      this.router.navigateByUrl('commercial');
      return;
    }

    this.partyName = this.partyDetail.find(
      (item) => item.id === this.receivedData.partyId
    );

    if (this.pageFrom === 'swap') {
      this.requestType = requestType.SwapRequest;
      this.partyList = this.partyDetail.filter(
        (p) => p.id !== this.receivedData.partyId
      );
    }

    if (this.pageFrom === 'same-day-payout') {
      this.requestType = requestType.SameDayPayout;
    }
  }

  // private initDate() {
  //   const date = formatDate(new Date());
  //   this.effectiveDate = date;
  //   this.currentDate = date;
  // }
  private initDate() {
    const stored = sessionStorage.getItem('cutOffTime');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.systemDateTime) {
        const dateObj = new Date(parsed.systemDateTime);
        // Extract only the date part (yyyy-mm-dd)
        this.effectiveDate = dateObj.toISOString().slice(0, 10);
        this.currentDate = this.effectiveDate;
        console.log('Effective date set from session:', this.effectiveDate);
        return;
      }
    }

    // fallback → use system date
    const today = new Date().toISOString().slice(0, 10);
    this.effectiveDate = today;
    this.currentDate = today;
  }

  // -------------------- UI Actions --------------------

  deleteAssets(data, index: number) {
    if (
      this.dataList?.filteredAssetsDataList &&
      Array.isArray(this.dataList.filteredAssetsDataList)
    ) {
      this.dataList.filteredAssetsDataList.splice(index, 1);
    } else if (Array.isArray(this.dataList)) {
      this.dataList.splice(index, 1);
    } else {
      console.warn('Invalid data structure passed to deleteAssets');
    }
    sessionStorage.setItem('bailmentSummaryDataList', JSON.stringify(this.dataList));
  }

  onCancel() {
    this.svc.dialogSvc
      .show(CancelPopupComponent, '', {
        templates: {
          footer: null,
        },
        data: '',
        width: '30vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          clearSession(['bailmentSummaryReceivedData', 'bailmentSummaryDataList']);
          this.router.navigate(['bailment']);
        }
      });
  }

  transferToChange(event: any) {
    const selectedParty = this.programpartieslist?.find(
      (item) => item.id === event.value
    );
    this.receiverPartyNo = selectedParty?.id;
    // this.receiverPartyId = selectedParty?.id;
    this.receiverPartyName = selectedParty?.name;
  }

  async onEffectiveDateChange(event: any) {
    const selectedDate = event?.value || event?.target?.value;
    if (!selectedDate) return;

    const dateObj =
      selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    this.effectiveDate = formatDate(dateObj);
  }

  // -------------------- Submission --------------------

  async onSubmit() {
    this.prepareRequestPayloads();
    this.router.navigate(['bailment']);

    try {
      await this.submitRequest();
      if (
        Array.isArray(this.dataList?.filteredAssetsDataList) &&
        this.pageFrom === 'purchase-asset'
      ) {
        this.filteredProductTransferResponseList =
          this.dataList?.filteredAssetsDataList.map((item) => ({
            assetNo: item.assetNo,
            description: item.description,
            vehicleIdentificationNumber: item.vehicleIdentificationNumber,
            registrationNumber: item.registrationNumber,
            requestDate: this.currentDate,
          }));
      } else if (this.dataList && this.pageFrom === 'swap') {
        this.filteredProductTransferResponseList = this.dataList?.map(
          (item) => ({
            assetNo: item.assetNo,
            description: item.description,
            vehicleIdentificationNumber: item.vehicleIdentificationNumber,
            registrationNumber: item.registrationNumber,
            requestDate: item.invoiceDate,
          })
        );
      } else {
        this.filteredProductTransferResponseList = [];
      }

      console.log(
        'filteredProductTransferResponseList',
        this.filteredProductTransferResponseList
      );

      this.openConfirmationDialog();
    } catch (error) {
      this.handleSubmissionError(error);
    }
  }

  private prepareRequestPayloads() {
    const assetList =
      this.pageFrom === 'purchase-asset'
        ? this.dataList?.filteredAssetsDataList
        : this.dataList;

    this.filteredProductTransferDisclaimerList = assetList.map((item) => ({
      assetNo: item.assetNo,
      contractId: item.contractId,
      currentExpirydate: item.expiryDate,
      totalDueAmount: item.amountToPay,
      newDealTypeId: this.receivedData.exculdeDealTypeId,
    }));

    if (this.pageFrom !== 'purchase-asset') {
      this.assetDetailsList = assetList.map((item) => ({
        Idref: item.contractId,
        AssetDescription: item.description,
        RegVinSerialChassisNumber: item.vehicleIdentificationNumber,
        AssetId: item.assetNo,
        Balance: item.costPrice,
        AmountToPay: item.amountToPay,
        Expirydate: item.expiryDate,
      }));
    }
  }

  private async submitRequest() {
    if (this.pageFrom === 'purchase-asset') {
      await this.calculateSwapEffectiveDate();
      const listContractId = this.dataList?.filteredAssetsDataList?.map(
        (item) => item.id
      );
      if (this.dataList?.paymentRequest) {
        this.dataList.paymentRequest.date = this.effectiveDate;
      }
      const request = {
        ids: listContractId,
        paymentRequest: this.dataList?.paymentRequest,
      };

      this.purchaseAssetResponse =
        await this.commonApiService.postPurchaseAssetRequest(request);
      this.referenceNumber = this.purchaseAssetResponse?.data?.referenceNumber;
      console.log('purchaseAssetResponse', this.purchaseAssetResponse);

      if (!this.referenceNumber) throw new Error();
    }

    if (this.pageFrom === 'swap') {
      const request = {
        partyId: this.receivedData.partyId,
        facilityType: this.receivedData.facilityType,
        subFacilityId: this.receivedData.subFacilityId,
        requestType: this.requestType,
        programId: this.receivedData.programId,
        requestDetails: {
          productTransferTo: this.receivedData.exculdeDealTypeId,
          swapTransferTo: this.receiverPartyNo,
          swapEffectiveDate: this.effectiveDate,
          affectedAssets: this.filteredProductTransferDisclaimerList,
        },
      };

      const swapPayload = {
        ...request,
        newAssetServicingRequestResult:
          this.assetServicingRequestResponseSwap.data,
      };
      this.productTransferResponse =
        await this.commonApiService.saveAssetServicingRequest(swapPayload);
      this.referenceNumber =
        this.productTransferResponse?.data?.referenceNumber;

      if (!this.referenceNumber) throw new Error();
    }

    if (this.pageFrom === 'same-day-payout') {
      this.calculateSwapEffectiveDate();
      const request: SameDayPayoutRequestBody = {
        party: { partyNo: this.receivedData.partyId },
        status: taskPostStaticFields.NotStarted,
        taskType: taskPostStaticFields.SelfServiceRequest,
        comments: '',
        customerName: this.customerName,
        externalData: {
          subjectLine: '',
          assetServiceSameDayPayoutRequest: {
            facilityType: this.receivedData.facilityType,
            subFacility: this.receivedData.subFacilityValue,
            // requestDate: new Date().toISOString().split('T')[0],
            requestDate: this.effectiveDate,
            assetDetails: this.assetDetailsList,
          },
        },
      };

      this.sameDayPayoutResponse = await this.commonApiService.postTaskRequest(
        request
      );
      this.referenceNumber = this.sameDayPayoutResponse?.taskId;
    }
  }

  async calculateSwapEffectiveDate() {
    await this.getCutOffTime();
    const storedTime = JSON.parse(sessionStorage.getItem('cutOffTime') || '{}');
    const sessionTime = new Date(storedTime.systemDateTime);
    const apiTime = new Date(this.currentSystemTime?.systemDateTime);

    const sessionOnlyTime = this.getOnlyTime(sessionTime);
    const apiOnlyTime = this.getOnlyTime(apiTime);
    const latestTime =
      sessionOnlyTime > apiOnlyTime ? sessionOnlyTime : apiOnlyTime;

    // Build cutoff time = 1:00 PM
    const cutOffTime = new Date();
    cutOffTime.setHours(CUT_OFF_TIME.hour, CUT_OFF_TIME.minute, 0, 0);

    // If latest time > cutoff move effective date to next day
    if (latestTime > cutOffTime) {
      this.effectiveDate = this.getNextDay(this.effectiveDate);
    }
  }
  getOnlyTime(date: Date): Date {
    const time = new Date();
    time.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
    return time;
  }

  getNextDay(dateString: string): string {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  private openConfirmationDialog() {
    clearSession(['bailmentSummaryReceivedData', 'bailmentSummaryDataList']);
    
    if (this.pageFrom === 'same-day-payout') {
      const message = `Same Day Payout Request
    Your Request has been submitted to UDC Finance for processing and approval.Request Number is:${this.referenceNumber}.`;

      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            message: message,
          },
          height: '25vw',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe(() => {});
    } else if (this.pageFrom === 'purchase-asset') {
      console.log('receiverPartyName', this.receiverPartyName);
      this.svc.dialogSvc
        .show(TransferRequestSubmissionComponent, ' ', {
          templates: { footer: null },
          data: {
            filteredProductTransferResponseList:
              this.filteredProductTransferResponseList,
            RequestNumber: this.referenceNumber,
            productTransferTo: this.receivedData.exculdeDealTypeId,
            searchedBy: this.searchedBy,
            pageFrom: this.pageFrom,
            receiverParty: this.receiverPartyName,
          },
          width: '50vw',
          height: '30vw',
        })
        .onClose.subscribe(() => {});
    } else if (this.pageFrom === 'swap') {
      const typeofrequest = 'Inventory Transfer Request';
      this.svc.dialogSvc
        .show(TransferRequestSubmissionComponent, ' ', {
          templates: { footer: null },
          data: {
            filteredProductTransferResponseList:
              this.filteredProductTransferResponseList,
            RequestNumber: this.referenceNumber,
            productTransferTo: this.receivedData.exculdeDealTypeId,
            searchedBy: this.searchedBy,
            pageFrom: this.pageFrom,
            receiverParty: this.receiverPartyName,
            typeofrequest: typeofrequest,
          },
          width: '50vw',
          height: '30vw',
        })
        .onClose.subscribe(() => {});
    }
  }

  private handleSubmissionError(error: any) {
    const errorMessage =
      error?.message ||
      'There was an error submitting your request. Please try again or contact UDC on 0800 500 832.';

    this.svc.dialogSvc.show(WarningPopupComponent, '', {
      templates: { footer: null },
      data: {
        title: 'Submission Error',
        messageKey: 'product_transfer_request_error_msg',
        facilityRoute: 'bailments',
      },
      width: '30vw',
      height: 'auto',
    });

    console.error('Submission error:', error);
  }

  async GetProgramsParties(params) {
    try {
      const programList = await this.commonApiService.getProgramsParties(
        params
      );
      this.programpartieslist = programList.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } catch (error) {
      console.log('Error While Getting Data');
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
  
  ngOnDestroy() {
    clearSession(['bailmentSummaryReceivedData', 'bailmentSummaryDataList']);
  }
}
