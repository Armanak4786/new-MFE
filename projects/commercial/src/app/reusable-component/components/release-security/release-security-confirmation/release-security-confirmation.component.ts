import { Component, OnInit } from '@angular/core';
import { CloseDialogData, CommonService, ToasterService } from 'auro-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CancelPopupComponent } from '../../cancel-popup/cancel-popup.component';
import { DashboardService } from '../../../../dashboard/services/dashboard.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { ReleaseSecurityAcknowledgementComponent } from '../../release-security-acknowledgement/release-security-acknowledgement.component';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../../../../services/common-setter-getter/common-setter-getter.service';
import {
  AssetDetails,
  ReleaseSecurityRequestBody,
} from '../../../../utils/common-interface';
import { taskPostStaticFields } from '../../../../utils/common-enum';
import { AcknowledgmentPopupComponent } from '../../acknowledgment-popup/acknowledgment-popup.component';

@Component({
  selector: 'app-release-security-confirmation',
  templateUrl: './release-security-confirmation.component.html',
  styleUrls: ['./release-security-confirmation.component.scss'],
})
export class ReleaseSecurityConfirmationComponent implements OnInit {
  public paymentOptions;
  public totalPaymentAmount;
  confirmedAssetsToRelease = [];
  modifyconfirmedAssetsToReleaseArray = [];
  IfSsv: boolean = true;
  scaledSecurityValue;
  referenceNumber;
  partyId;
  assetIdsArray = [];
  releaseReasonArray = [];
  formattedtotalPaymentAmount;
  remarks;
  facilityType: string = '';
  customerName;

  constructor(
    public ref: DynamicDialogRef,
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    private dashSvc: DashboardService,
    private commonApiService: CommonApiService,
    private router: Router,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public toasterService: ToasterService
  ) {}

  // ngOnInit(): void {
  //   let SSV = 0;
  //   //this.partyId = JSON.parse(sessionStorage.getItem('currentParty'));
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty.id;
  //     this.customerName = currentParty.name;
  //   });
  //   const object = this.dynamicDialogConfig.data.mainForm[0].form?.value;
  //   console.log("dfghjgfdsghjgfdobject", object);
  //   this.releaseReasonArray = this.transformToReasonAmount(object);
  //   this.remarks = this.dynamicDialogConfig.data?.remarks || '';
  //   this.totalPaymentAmount =
  //     this.dynamicDialogConfig?.data?.mainForm[0]?.form?.value?.totalPaymentAmt;
  //   if (this.totalPaymentAmount) {
  //     const formattedTotalPaymentAmount = `$${this.totalPaymentAmount.toFixed(
  //       2
  //     )}`;
  //     this.formattedtotalPaymentAmount = formattedTotalPaymentAmount;
  //   }

  //   this.paymentOptions =
  //     this.dynamicDialogConfig.data.mainForm[0].form.value.payOptions;
  //   this.confirmedAssetsToRelease.push(
  //     this.dynamicDialogConfig.data.aasetListToRelease[0]
  //   );
  //   this.modifyconfirmedAssetsToReleaseArray =
  //     this.confirmedAssetsToRelease.flat();

  //   const assetIdsToRlease = this.getAssetIds(
  //     this.modifyconfirmedAssetsToReleaseArray
  //   );
  //   this.assetIdsArray = assetIdsToRlease;
  //   if (this.router.url.includes('/easylink')) {
  //     this.IfSsv = false;
  //   } else {
  //     this.IfSsv = true;
  //   }
  //   if (this.modifyconfirmedAssetsToReleaseArray) {
  //     this.modifyconfirmedAssetsToReleaseArray.forEach((element) => {
  //       SSV += Number(element.ssv) || 0; // force numeric addition
  //     });
  //   }
  //   if (this.router.url.includes('/assetlink')) {
  //     const formattedScaledSecurityValue = `$${SSV.toFixed(2)}`;
  //     this.scaledSecurityValue = formattedScaledSecurityValue;
  //   }
  //   this.facilityType = window.location.pathname.split('/')[2] ?? '';
  //   console.log("this.facilityType = window.location.pathname.split('/')[2] ?? '';", this.facilityType);
  // }

  ngOnInit(): void {
    let SSV = 0;
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.customerName = JSON.parse(sessionStorage.getItem('currentParty'))?.name;

    // Updated to handle both old base-form and new reactive form structures
    let object;
    const mainFormData = this.dynamicDialogConfig.data.mainForm[0];

    console.log('mainFormData received:', mainFormData);

    // Check if it's the old base-form structure or new reactive form structure
    if (mainFormData && mainFormData.form && mainFormData.form.value) {
      // New reactive form structure
      object = mainFormData.form.value;
    } else if (mainFormData && typeof mainFormData === 'object') {
      // Fallback: direct form values
      object = mainFormData;
    } else {
      console.error('Unable to extract form data from:', mainFormData);
      object = {}; // Provide empty object as fallback
    }

    console.log('Extracted form object:', object);

    // Only call transformToReasonAmount if object has data
    if (object && Object.keys(object).length > 0) {
      this.releaseReasonArray = this.transformToReasonAmount(object);
    } else {
      this.releaseReasonArray = [];
      console.warn('No form data available for transformToReasonAmount');
    }

    this.remarks = this.dynamicDialogConfig.data?.remarks || '';

    // Safe access to totalPaymentAmt
    this.totalPaymentAmount = object?.totalPaymentAmt;
    if (this.totalPaymentAmount) {
      const formattedTotalPaymentAmount = `$${this.totalPaymentAmount.toFixed(
        2
      )}`;
      this.formattedtotalPaymentAmount = formattedTotalPaymentAmount;
    }

    // Safe access to payOptions
    this.paymentOptions = object?.payOptions;

    this.confirmedAssetsToRelease.push(
      this.dynamicDialogConfig.data.aasetListToRelease[0]
    );
    this.modifyconfirmedAssetsToReleaseArray =
      this.confirmedAssetsToRelease.flat();
    console.log(
      'modifyconfirmedAssetsToReleaseArray',
      this.modifyconfirmedAssetsToReleaseArray
    );

    const assetIdsToRlease = this.getAssetIds(
      this.modifyconfirmedAssetsToReleaseArray
    );
    this.assetIdsArray = assetIdsToRlease;
    if (this.router.url.includes('/easylink')) {
      this.IfSsv = false;
    } else {
      this.IfSsv = true;
    }
    if (this.modifyconfirmedAssetsToReleaseArray) {
      this.modifyconfirmedAssetsToReleaseArray.forEach((element) => {
        SSV += Number(element.ssv) || 0; // force numeric addition
      });
    }
    if (this.router.url.includes('/assetlink')) {
      const formattedScaledSecurityValue = `$${SSV.toFixed(2)}`;
      this.scaledSecurityValue = formattedScaledSecurityValue;
    }
    const path = window.location.pathname.toLowerCase();
    const facilityMap: { [key: string]: string } = {
      assetlink: 'AssetLink',
      easylink: 'EasyLink',
    };
    const matchedType = Object.keys(facilityMap).find((type) =>
      path.includes(type)
    );
    this.facilityType = matchedType ? facilityMap[matchedType] : '';
    console.log(
      'this.facilityType = window.location.pathname',
      this.facilityType
    );
  }

  getAssetIds(modifyconfirmedAssetsToReleaseArray) {
    // Use map to extract the assetNo property from each object
    return modifyconfirmedAssetsToReleaseArray.map((item) => item.assetNo);
  }

  transformToReasonAmount(myobj) {
    const result = [];

    // Check if InsuranceClaim exists and is true
    if (myobj.InsuranceClaim) {
      result.push({
        reason: 'InsuranceClaim',
        amount: myobj.Amt2,
      });
    }

    // Check if assetSold exists and is true
    if (myobj.assetSold) {
      result.push({
        reason: 'assetSold',
        amount: myobj.Amt1,
      });
    }

    return result;
  }
  mapToAssetDetails(assets: any[]): AssetDetails[] {
    return assets.map((item) => ({
      assetId: item.assetNo?.toString() ?? '',
      assetDescription: item.description ?? '',
      registrationOrSerialOrChassis:
        item.registrationNumber ||
        item.vehicleIdentificationNumber ||
        item.chassisNumber ||
        item.serialNumber ||
        '',
      ssv: Number(item.ssv) || 0,
      loanId: item.contractId ?? 0,
    }));
  }

  // cancel() {
  //   this.svc.dialogSvc
  //     .show(CancelPopupComponent, 'Cancel', {
  //       templates: {
  //         footer: null,
  //       },
  //       data: '',
  //       height: '12vw',
  //       width: '30vw',
  //       contentStyle: { overflow: 'auto' },
  //       styleClass: 'dialogue-scroll',
  //       position: 'center',
  //     })
  //     .onClose.subscribe((data: any) => {
  //       if (data.data == 'cancel') {
  //         this.ref.close();
  //       }
  //     });
  // }

  async submit() {
    const params: ReleaseSecurityRequestBody = {
      party: { partyNo: this.partyId },
      status: taskPostStaticFields.NotStarted,
      taskType: taskPostStaticFields.SelfServiceRequest,
      comments: '',
      subject: 'Release Security Request',
      customerName: `${this.customerName}`,
      externalData: {
        subjectLine: '',
        releaseSecurityRequest: {
          facilityType: this.facilityType,
          assetDetails: this.mapToAssetDetails(
            this.modifyconfirmedAssetsToReleaseArray
          ),
          paymentOption: this.paymentOptions,
          totalPaymentAmount: this.totalPaymentAmount,
          releaseReason: this.releaseReasonArray,
          remarks: this.remarks,
          partyId: this.partyId,
        },
      },
    };
    await this.releaseAssets(params);
  }

  async releaseAssets(params) {
    try {
      this.referenceNumber = await this.commonApiService.postAssetReleaseData(
        params
      );
      const taskId = this.referenceNumber?.taskId;
      const messageToShow = `Your Request has been submitted to UDC Finance for processing and approval. Request Number is: ${taskId}. Security Release Request`;

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
          this.router.navigate([
            `${this.facilityType.toLowerCase()}`,
          ]);
        });
    } catch (error) {
      console.log('Error release error', error);
      this.toasterService.showToaster({
        severity: 'error',
        detail:
          'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832',
      });
    }
  }

  confirm() {
    this.ref.close({ data: 'confirm' });
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
            `${this.facilityType.toLowerCase()}`,
          ]);
        }
      });
    // console.log('Cancel Clicked');
    // this.svc?.ui?.showOkDialog(
    //   'Are you sure you want to cancel? If you Confirm,all details entered will be lost.',
    //   '',
    //   () => {
    //     this.ref.close();
    //     this.router.navigate([`commercial/${this.facilityType}`]);
    //   }
    // );
  }
}
