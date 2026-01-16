import { Component, Input } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';

@Component({
  selector: 'app-w-repayment-view-request',
  //standalone: true,
  //imports: [],
  templateUrl: './w-repayment-view-request.component.html',
  styleUrls: ['./w-repayment-view-request.component.scss'],
})
export class WRepaymentViewRequestComponent {
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
