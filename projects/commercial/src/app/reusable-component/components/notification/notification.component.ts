import { Component} from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { SwapAssetTransferComponent } from '../swap-asset-transfer/swap-asset-transfer.component';
import { CommonService } from 'auro-ui';
interface NotificationItem {
  id: number;
  requestType: string;
  description: string;
  date: string;
  time: string;
  status: 'Today' | 'Older'; // Status for grouping
}
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  showNotifications: boolean = false;
  pendingNotifications: any[] = [];
  declinedNotifications: any[] = [];
  completedNotifications: any[] = [];
  notificationSections: any[] = [];
  notificationCount = 0;

  constructor(
    public commonSetterGetter: CommonSetterGetterService,
    private commonSvc: CommonService,
  ) {}

  ngOnInit(): void {
    this.commonSetterGetter.transferRequestsSubject.subscribe((data) => {
      if (data.isClearAll === false) {
        this.pendingNotifications = data.pending;
        this.declinedNotifications = data.declined;
        this.completedNotifications = data.completed;
        this.notificationSections = [
          { label: 'Pending', notifications: this.pendingNotifications },
          { label: 'Declined', notifications: this.declinedNotifications },
          { label: 'Completed', notifications: this.completedNotifications },
        ];
        this.notificationCount = data.countOfNotifi;
        if(this.notificationCount > 0){
          this.showNotifications = true
        }
      }
    });
  }
  viewNotification(notifi: any): void {
    const data = {
      id: notifi.id,
      'Request No.': notifi.values.find(
        (v: any) => v.name === 'TransferRequestHdrId'
      )?.value,
      'Input Date': notifi.values.find((v: any) => v.name === 'InputDt')?.value,
      'Completed Date': notifi.values.find((v: any) => v.name === 'CompletedDt')
        ?.value,
      'Original Party': notifi.values.find(
        (v: any) => v.name === 'OriginalPartyExtName'
      )?.value,
      'New Party': notifi.values.find((v: any) => v.name === 'NewPartyExtName')
        ?.value,
      'Transfer Request Status (WF)': notifi.values.find(
        (v: any) => v.name === 'WFThree'
      )?.value,
    };
    this.commonSvc.dialogSvc
      .show(SwapAssetTransferComponent, 'New Inventory Transfer Request', {
        templates: {
          footer: null,
        },
        data: data,

        width: '60vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  getValue(item: any, fieldName: string): any {
    return item.values.find((v: any) => v.name === fieldName)?.value;
  }

  clearAllNotifications(): void {
    this.showNotifications = false;
    this.commonSetterGetter.transferRequestsSubject.next({ isClearAll: true });
    this.notificationCount = 0;
  }
}
