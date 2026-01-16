import { Component } from '@angular/core';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';
import { CommonService } from 'auro-ui';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { SwapAssetTransferComponent } from '../swap-asset-transfer/swap-asset-transfer.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-ws-request-history-actions',
  //standalone: true,
  //imports: [],
  templateUrl: './ws-request-history-actions.component.html',
  styleUrls: ['./ws-request-history-actions.component.scss'],
})
export class WsRequestHistoryActionsComponent {
  swapRowData: {};
  transferRequestDetails: any;
  isDisabled: boolean = false;
  partyName: string;
  constructor(
    private bailmentGetterSetter: BailmentSetterGetterService,
    private commonSvc: CommonService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnInit() {
    // this.commonSetterGetterService.party$.subscribe((currentParty) => {
    //   this.partyName = currentParty?.name;
    // });
    // this.bailmentGetterSetter.reqHisSwapRowData.subscribe((data) => {
    //   this.swapRowData = data;
    //   if (
    //     this.swapRowData['Transfer Request Status (WF)'] ===
    //       'Pending Transfer' ||
    //     this.swapRowData['Original Party'] === this.partyName
    //   ) {
    //     this.isDisabled = true;
    //   }
    // });
  }

  onOptionClicked() {
    this.commonSvc.dialogSvc
      .show(SwapAssetTransferComponent, 'Inventory Transfer Request', {
        templates: {
          footer: null,
        },
        data: '',

        width: '60vw',
      })
      .onClose.subscribe((data: any) => {});
  }
}
