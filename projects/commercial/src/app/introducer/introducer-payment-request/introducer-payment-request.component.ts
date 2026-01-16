import { Component, OnInit } from '@angular/core';
import { CloseDialogData, CommonService } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseAssetlinkClass } from '../../assetlink/base-assetlink.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseAssetlinkService } from '../../assetlink/services/base-assetlink.service';
import { ActivatedRoute } from '@angular/router';
import { CancelPopupComponent } from '../../reusable-component/components/cancel-popup/cancel-popup.component';
import { jwtDecode } from 'jwt-decode';
import { CommonApiService } from '../../services/common-api.service';
import { WarningPopupComponent } from '../../reusable-component/components/warning-popup/warning-popup.component';
import { AcknowledgmentPopupComponent } from '../../reusable-component/components/acknowledgment-popup/acknowledgment-popup.component';
import { CUT_OFF_TIME } from '../../utils/common-enum';

@Component({
  selector: 'app-introducer-payment-request',
  // standalone: true,
  // imports: [],
  templateUrl: './introducer-payment-request.component.html',
  styleUrls: ['./introducer-payment-request.component.scss'],
})
export class IntroducerPaymentRequestComponent
  extends BaseAssetlinkClass
  implements OnInit
{
  introducerDataList: any = null;
  currentBalance: number | null = null;
  nextCycleDate;
  introducerDetailsForm: FormGroup;
  useCreditKey: boolean = false;
  username;
  referenceNumber;
  searchPaymentRequestResponse;
  systemTime;
  currentSystemTime;
  paymentDate;

  constructor(
    public override svc: CommonService,
    public override route: ActivatedRoute,
    public override baseSvc: BaseAssetlinkService,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public fb: FormBuilder,
    public commonapiService: CommonApiService
  ) {
    super(route, svc, baseSvc);
    this.introducerDetailsForm = this.fb.group({
      curentBalance: [''],
      nextCycleDate: [''],
      netAmount: [''],
      paymentDate: [''],
    });
  }

  override async ngOnInit() {
    this.introducerDataList = this.dynamicDialogConfig?.data;
    this.currentBalance =
      this.introducerDataList?.introducerFacilityDataList[0]?.currentBalance;
    this.nextCycleDate =
      this.introducerDataList?.introducerFacilityDataList[0]?.day;
    this.useCreditKey = this.currentBalance < 0; //false=Receipt
    let decodedToken = sessionStorage.getItem('accessToken');
    this.username = this.decodeToken(decodedToken)?.sub;
    this.systemTime = sessionStorage.getItem('cutOffTime');
    await this.searchRequestAsset();
    const assetDetails =
      this.searchPaymentRequestResponse?.data?.assetDetails || [];
    const netAmount = assetDetails.reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );
    console.log("currentSystemTimecurrentSystemTime",this.currentSystemTime);
    this.introducerDetailsForm.patchValue({
      curentBalance: this.currentBalance,
      nextCycleDate: this.nextCycleDate,
      netAmount: netAmount,
      paymentDate:this.currentSystemTime?.systemDateTime?.split('T')[0] ?? this.currentSystemTime,
    });
  }

  async submitData() {
    const paymentRequestPayload = {
      paymentRequest: this.searchPaymentRequestResponse?.data?.paymentRequest,
      ids: this.searchPaymentRequestResponse.data.ids,
    };
    if (
      this.useCreditKey === false &&
      (this.searchPaymentRequestResponse.data.paymentRequest
        .paymentInstructionName === 'Cheque Receivable' ||
        this.searchPaymentRequestResponse.data.paymentRequest
          .paymentInstructionName === 'UDC Wholesale DD')
    ) {
      const paymentDate = this.introducerDetailsForm.get('paymentDate')?.value;
      const formattedDate = paymentDate ? new Date(paymentDate).toLocaleDateString('en-GB'):'';
      this.referenceNumber =
        await this.commonapiService.saveIntroducerPaymentRequest(
          paymentRequestPayload
        );
      if (!this.referenceNumber) throw new Error();

      const message = `Approved Payment Request Your request has been submitted successfully.Request Number is: ${this.referenceNumber?.data?.referenceNumber} Repayment will be direct debited from your nominated bank account on ${formattedDate}.`;

      this.svc.dialogSvc
        .show(AcknowledgmentPopupComponent, ' ', {
          templates: { footer: null },
          data: { message },
          height: '25vw',
          width: '50vw',
          contentStyle: { overflow: 'auto' },
          styleClass: 'dialogue-scroll',
          position: 'center',
        })
        .onClose.subscribe((data: CloseDialogData) => {
          this.ref.close(data);
        });
    } else {
      this.svc.dialogSvc.show(WarningPopupComponent, '', {
        templates: { footer: null },
        data: {
          title: 'Submission Error',
          messageKey: 'payment_request_error_pop_up',
          facilityRoute: 'introducer',
        },
        width: '30vw',
        height: 'auto',
      });
      return;
    }
  }

  async searchRequestAsset() {
    try {
      await this.calculateSwapEffectiveDate();
      // const storedDate =this.currentSystemTime|| this.currentSystemTime.systemDateTime.split('T')[0] ;
      const storedDate = typeof this.currentSystemTime === 'string'? this.currentSystemTime : this.currentSystemTime?.systemDateTime?.split('T')[0] || '';
      this.searchPaymentRequestResponse =
        await this.commonapiService.searchPaymentRequestAsset(storedDate);
    } catch (error) {
      console.log('Error Getting Response');
    }
  }
  async calculateSwapEffectiveDate() {
    await this.getCutOffTime();
    const storedTime = JSON.parse(sessionStorage.getItem('cutOffTime') || '{}');
    const sessionTime = new Date(storedTime.systemDateTime);
    const apiTime = new Date(this.currentSystemTime?.systemDateTime);

    const sessionOnlyTime = this.getOnlyTime(sessionTime);
    const apiOnlyTime = this.getOnlyTime(apiTime);
    const latestTime = sessionOnlyTime > apiOnlyTime ? sessionOnlyTime : apiOnlyTime;
    // Build cutoff time = 1:00 PM
    const cutOffTime = new Date(latestTime);
    cutOffTime.setHours(CUT_OFF_TIME.hour, CUT_OFF_TIME.minute, 0, 0);
    // If latest time > cutoff move effective date to next day
    if (latestTime > cutOffTime) {
      this.currentSystemTime = this.getNextDay(latestTime);
    }
  }
  getOnlyTime(date: Date): Date {
    const time = new Date(date);
    time.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
    return time;
  }
  getNextDay(date: Date): string {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  async getCutOffTime() {
    try {
      this.currentSystemTime =
        await this.commonapiService.getCutOffTimeCompare();
    } catch (error) {
      console.log('Error while loading data', error);
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
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          this.ref.close();
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
