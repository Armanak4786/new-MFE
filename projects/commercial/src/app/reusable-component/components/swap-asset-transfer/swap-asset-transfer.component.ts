import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';
import { TransferRequestParams } from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  swaprequestAfterSubmissionColumnDefs,
  transferAssetColumnDefs,
} from '../../../bailments/utils/bailment-header.utils';
import { CommonService, ToasterService } from 'auro-ui';
import { TransferRequestSubmissionComponent } from '../../../bailments/components/transfer-request-submission/transfer-request-submission.component';
import { CancelPopupComponent } from '../cancel-popup/cancel-popup.component';

@Component({
  selector: 'app-swap-asset-transfer',
  //standalone: true,
  //imports: [],
  templateUrl: './swap-asset-transfer.component.html',
  styleUrls: ['./swap-asset-transfer.component.scss'],
})
export class SwapAssetTransferComponent {
  transferAssetColumnDefs;
  selectedRecord: any;
  facilityAssset: any;
  partyId: any;
 data;
  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private commonApiService: CommonApiService,
    private bailmentGetterSetter: BailmentSetterGetterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public svc: CommonService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.bailmentGetterSetter.reqHisSwapRowData.subscribe((data) => {
      this.selectedRecord = data;
    });
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
      
    });
    this.data = this.dynamicDialogConfig?.data
     const params = this.data
    ? { transferRequestId: this.data?.id }
    : { transferRequestId: this.selectedRecord['Request No.'] };
    this.fetchTransferRequestDetails(params);
  }

  async transferAssets(params: TransferRequestParams) {
    try {
      await this.commonApiService.postSwapActOnRequest(params);
       this.commonSetterGetterSvc.triggerDashboardRefresh();
      if (params.action == 'approve') {
        this.facilityAssset = this.facilityAssset.map((record) => ({
          ...record,
          completedDate: this.data['Completed Date']||this.selectedRecord['Completed Date'],
        }));
        this.svc.dialogSvc
          .show(TransferRequestSubmissionComponent, ' ', {
            templates: {
              footer: null,
            },
            data: {
              assetColumnDefs: swaprequestAfterSubmissionColumnDefs,
              filteredProductTransferResponseList: this.facilityAssset,
              RequestNumber: this.data?.id ||this.selectedRecord['Request No.'],
              additionalMsg: true,
            },
            width: '50vw',
            height: '50vw',
          })
          .onClose.subscribe((data: any) => {});
      } else {
        // this.svc.dialogSvc
        //   .show(CancelPopupComponent, '', {
        //     templates: {
        //       footer: null,
        //     },
        //     data: {
        //       confirmation: 'Inventory Transfer Request has been cancelled.',
        //     },
        //     width: '30vw',
        //     height: '15vw',
        //   })
        //   .onClose.subscribe((data: any) => {});
        this.svc?.ui?.showOkDialog(
          'Inventory Transfer Request has been cancelled',
          '',
          () => {}
        );
      }
    } catch (error) {
      console.log('Error while transferring request', error);
      this.toasterService.showToaster({
        severity: 'error',
        detail:
          'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832',
      });
    }
    this.ref.close();
  }

  cancelTransfer() {
    this.svc.dialogSvc
      .show(CancelPopupComponent, '', {
        templates: {
          footer: null,
        },
        data: {
          confirmation:
            'Are you sure you want to reject this Inventory Transfer Request?',
        },
        width: '30vw',
        height: '15vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          this.ref.close();
        }
      });
  }

  async fetchTransferRequestDetails(params) {
    try {
      const data = await this.commonApiService.getTransferRequestList(params);
      data?.items.forEach((asset) => {
        asset.effectiveDate = data.transferRequestHeader.effectiveDt;
      });
      this.facilityAssset = data.items;
      this.transferAssetColumnDefs = transferAssetColumnDefs;
    } catch (error) {
      console.log('Error while loading payment request data', error);
    }
  }

  onCellClick(event) {
    this.commonSetterGetterSvc.setTransferRequestContract(event.rowData);
  }

  rejectTransfer() {
    this.svc.dialogSvc
      .show(CancelPopupComponent, '', {
        templates: {
          footer: null,
        },
        data: {
          confirmation:
            'Are you sure you want to reject this Inventory Transfer Request?',
        },
        width: '30vw',
        height: '15vw',
      })
      .onClose.subscribe((data: any) => {
        if (data?.data == 'cancel') {
          const params = {
            transferRequestId: this.data?.id || this.selectedRecord['Request No.'],
            action: 'Decline',
          };
          this.transferAssets(params);
          this.ref.close();
        }
      });
  }

  acceptTransfer() {
    const params = {
      transferRequestId:this.data?.id || this.selectedRecord['Request No.'],
      action: 'approve',
    };
    this.transferAssets(params);
  }
}
