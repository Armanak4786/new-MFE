import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { AddAssetComponent } from '../../../reusable-component/components/add-asset/add-asset.component';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { Subscription, timer } from 'rxjs';
import { DrawdownRequestComponent } from '../../../assetlink/components/drawdown-request/drawdown-request.component';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
})
export class QuickActionsComponent {
  currentServerTimeA: string;
  private timeSubscription: Subscription;
  currentServerTime: string;
  currentServerDate: any;
  accessGranted: any;
  partyId;
  restrictedKeys = [
    'add_asset',
    'drawdown',
    'release_security',
    'repayment',
    'variation_change_payment_terms',
    'new_drawdown_new_contract_on_a_facility_or_separately',
    'add_new_assets_contracts',
    'swap_assets',
    'transfer_to_dpp_demo',
    'payout',
    'same_day_payout_request',
    'bailment_purchase_asset_request',
    'fixed_floorplan_repay_asset',
  ];
  partyNo: any;

  constructor(
    public svc: CommonService,
    public route: ActivatedRoute,
    public layoutService: LayoutService,
    public commonSetterGetterService: CommonSetterGetterService
  ) { }

  ngOnInit() {
    this.updateServerTime();

    // Update the server time every minute
    this.timeSubscription = timer(0, 60000).subscribe(() => {
      this.updateServerTime();
    });

    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (
      roleBased &&
      roleBased.functions &&
      typeof roleBased.functions === 'object'
    ) {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim()
      );
    } else {
      this.accessGranted = [];
    }

    this.commonSetterGetterService.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
      this.partyNo = currentParty?.partyNo;
    });
  }

  showDialogDrawdownRequest() {
    this.svc.dialogSvc
      .show(DrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: '',
        width: '78vw',
      })
      .onClose.subscribe((data: any) => {
        // console.log('data', data);
      });
  }

  showDialogAddAsset() {
    this.svc.dialogSvc
      .show(AddAssetComponent, 'Add Asset/s', {
        templates: {
          footer: null,
        },
        data: '',
        width: '70vw',
        // contentStyle: { overflow: 'auto' },
        // styleClass: 'dialogue-scroll',
        // position: 'center',
      })
      .onClose.subscribe((data: any) => { });
  }

  private updateServerTime() {
    this.currentServerTimeA = this.layoutService.getCurrentTimeString();
    const dateTime = this.currentServerTimeA.split('|');
    if (dateTime.length === 2) {
      this.currentServerTime = dateTime[0].trim();
      const rawDate = dateTime[1].trim();
      const [day, month, year] = rawDate.split('-').map(Number);
      this.currentServerDate = new Date(year, month - 1, day) as Date; //typecast to Date
    }
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  showDialogDocuments() {
    this.svc.router.navigateByUrl(`/dashboard/documents`);
  }

  showDialogRequestHistory() {
    this.svc.router.navigateByUrl(`/dashboard/request-history`);
  }
}
