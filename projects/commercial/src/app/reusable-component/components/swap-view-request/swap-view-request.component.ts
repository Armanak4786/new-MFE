import { Component, Input } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { AssetsParams } from '../../../utils/common-interface';

@Component({
  selector: 'app-swap-view-request',
  //standalone: true,
  //imports: [],
  templateUrl: './swap-view-request.component.html',
  styleUrls: ['./swap-view-request.component.scss'],
})
export class SwapViewRequestComponent {
  @Input() swapDetails;
  @Input() seletedRecoredData;
  partyId: any;
  facilityAsssetsDatalist: any;
  facilityAssset: any;

  constructor(
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['swapDetails']) {
      this.swapDetails = changes?.['swapDetails']?.currentValue?.items[0];
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      });
      if (this.swapDetails) {
        const params = {
          partyId: this.partyId,
          contractId: this.swapDetails?.contractId,
        };
        this.fetchFacilityAssets(params);
      }
    }
  }

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      const data = await this.commonApiService.getAssetsData(params);
      if (data) {
        this.facilityAssset = data.find((item) => {
          return item.assetNo === this.swapDetails.assetHdrId;
        });
      }
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }
}
