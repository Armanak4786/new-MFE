import { Component, Input } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';
import { CommonApiService } from '../../../services/common-api.service';
import { getSingleAssetDisplay } from '../../../utils/common-utils';

@Component({
  selector: 'app-w-drawdown-view-request',
  //standalone: true,
  //imports: [],
  templateUrl: './w-drawdown-view-request.component.html',
  styleUrls: ['./w-drawdown-view-request.component.scss'],
})
export class WDrawdownViewRequestComponent {
  @Input() seletedRecoredData;
  originalRecord;
  partyId: any;
  facilityAsssetsDatalist: any;
  facilityAssset: any;
  assetDetailsSummaryList: any;
  valueOfSingleAsset:any;
  constructor(
    public commonSetterGetterSvc: CommonSetterGetterService,
    private bailmentGetterSetter: BailmentSetterGetterService,
    private commonApiService: CommonApiService
  ) {}

  ngOnInit(){
    this.valueOfSingleAsset = getSingleAssetDisplay(this.seletedRecoredData);
    console.log("seletedRecoredData",getSingleAssetDisplay(this.seletedRecoredData));
  }
  ngOnChanges(changes) {
    if (changes['seletedRecoredData']) {
      this.seletedRecoredData = changes?.['seletedRecoredData']?.currentValue;
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      });
      this.bailmentGetterSetter.reqHisSwapRowData.subscribe((item) => {
        this.originalRecord = item;
      });
      if (this.seletedRecoredData['Contract No.']) {
        const params = { id: this.seletedRecoredData['Contract No.'] };
        this.fetchAssetDetailsSummary(params);
      }
    }
  }

  async fetchAssetDetailsSummary(params) {
    try {
      this.assetDetailsSummaryList = await this.commonApiService.getAssetDetail(
        params
      );
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }
  get disbursement() {
  return this.seletedRecoredData?.externalData?.assetDrawdownRequest?.disbursementDetails;
  }

get toType() {
  return this.disbursement?.to;   // can be "suppliers" | "nominatedBankAccount" | "both"
}

get nominatedAmount() {
  return this.disbursement?.nominatedBankAccount?.amountToNominatedBanK;
}

get hasSingleAssets() {
  return (
    this.originalRecord?.externalData?.assetDrawdownRequest?.assetDetails
      ?.singleAsset?.length > 0
  );
}

get hasMultipleAssets() {
  return (
    this.originalRecord?.externalData?.assetDrawdownRequest?.assetDetails
      ?.multipleAsset?.length > 0
  );
}
}
