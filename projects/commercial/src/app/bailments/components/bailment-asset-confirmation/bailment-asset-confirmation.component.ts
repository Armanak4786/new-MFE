import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { bailmentpurchaseAssetConfirmationColumnDefs } from '../../utils/bailment-header.utils';
import { BailmentComponentLoaderService } from '../../../bailments/services/bailment-component-loader.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Router } from '@angular/router';
import { CommonApiService } from '../../../services/common-api.service';
import { TransferRequestSubmissionComponent } from '../transfer-request-submission/transfer-request-submission.component';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-bailment-asset-confirmation',
  // standalone: true,
  // imports: [],
  templateUrl: './bailment-asset-confirmation.component.html',
  styleUrls: ['./bailment-asset-confirmation.component.scss'],
})
export class BailmentAssetConfirmationComponent {
  partyId: number;
  bailmentpurchaseAssetConfirmationColumnDefs =
    bailmentpurchaseAssetConfirmationColumnDefs;
  bailmentsDataList: any;
  purchaseAssetDataList;
  purchaseAssetResponse;
  facilityType: string;
  flag: string;
  filteredAssetsResponseList;

  constructor(
    public ref: DynamicDialogRef,
    private router: Router,
    private commonApiService: CommonApiService,
    public svc: CommonService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dynamicDialogConfig: DynamicDialogConfig
  ) {
    this.purchaseAssetDataList =
      this.dynamicDialogConfig?.data?.bailmentFacilityDataList;
    this.facilityType = this.dynamicDialogConfig?.data.facilityType;
    this.flag = this.dynamicDialogConfig?.data.flag;
  }

  ngOnInit() {
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.purchaseAssetDataList.map((item) => ({
      assetNo: item.assetNo,
      contractId: item.contractId,
      description: item.description,
      currentExpirydate: item.expiryDate,
      totalDueAmount: item.amountToPay,
      vehicleIdentificationNumber: item.vehicleIdentificationNumber,
    }));
    this.bailmentsDataList = this.purchaseAssetDataList;
  }
  onCancelClick() {
    this.ref.close();
  }
  onProceedClick() {
    let purchaseAssetsRequest = {
      contractId: this.bailmentsDataList[0].contractId,
      partyId: this.partyId,
      facilityType: this.facilityType,
    };
    this.router.navigateByUrl('bailment');
    try {
      if (this.flag == 'purchase-asset') {
        // this.purchaseAssetResponse=
        //    this.commonApiService.purchaseAssetRequest(purchaseAssetsRequest );
      } else if (this.flag == 'same-day-payout') {
        this.purchaseAssetResponse =
          this.commonApiService.productTransferRequest(purchaseAssetsRequest);
      }
      this.filteredAssetsResponseList = this.purchaseAssetDataList.map(
        (item) => ({
          assetNo: item.assetNo,
          description: item.description,
          vehicleIdentificationNumber: item.vehicleIdentificationNumber,
          registrationNumber: item.registrationNumber,
        })
      );
      this.svc.dialogSvc
        .show(TransferRequestSubmissionComponent, ' ', {
          templates: {
            footer: null,
          },
          data: {
            filteredProductTransferResponseList:
              this.filteredAssetsResponseList,
            RequestNumber: this.purchaseAssetResponse,
          },
          width: '50vw',
          height: '50vw',
        })
        .onClose.subscribe((data: any) => {});
    } catch (error) {
      this.svc?.ui?.showOkDialog(
        'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832. ',
        '',
        () => {}
      );
      console.log('Error release error', error);
    }
  }
}
