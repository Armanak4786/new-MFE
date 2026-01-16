import { Component, Input } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { AssetsParams } from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';

@Component({
  selector: 'app-same-day-payout-view-request',
  // standalone: true,
  // imports: [],
  templateUrl: './same-day-payout-view-request.component.html',
  styleUrls: ['./same-day-payout-view-request.component.scss'],
})
export class SameDayPayoutViewRequestComponent {
  @Input() seletedRecoredData;
  originalRecord;
  partyId: any;
  facilityAsssetsDatalist: any;
  facilityAssset: any;

  constructor(
    public commonSetterGetterSvc: CommonSetterGetterService,
    private bailmentGetterSetter: BailmentSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['seletedRecoredData']) {
      this.seletedRecoredData = changes?.['seletedRecoredData']?.currentValue;
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      });
      this.bailmentGetterSetter.reqHisSwapRowData.subscribe((item) => {
        this.originalRecord = item;
      });
    }
  }
}
