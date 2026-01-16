import { Component } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { AssetsParams } from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-swap-asset-transfer-description',
  //standalone: true,
  //imports: [],
  templateUrl: './swap-asset-transfer-description.component.html',
  styleUrls: ['./swap-asset-transfer-description.component.scss'],
})
export class SwapAssetTransferDescriptionComponent {
  selectedRecord: any;
  partyId: any;
  assetDetails;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public commonSetterGetterSvc: CommonSetterGetterService,
    private commonApiService: CommonApiService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      })
    );

    this.subscriptions.add(
      this.commonSetterGetterSvc.transferRequestContractIdData.subscribe(
        (data) => {
          this.selectedRecord = data;
          if (this.selectedRecord) {
            const params = {
              partyId: this.partyId,
              contractId: this.selectedRecord?.contractId,
            };
            this.fetchFacilityAssets(params);
          }
        }
      )
    );
  }

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      const linkedAssets = await this.commonApiService.getAssetsData(params);

      linkedAssets.forEach((asset) => {
        asset.identifier =
          asset.registrationNumber ||
          asset.vehicleIdentificationNumber ||
          asset.serialNumber ||
          asset.chassisNumber ||
          null;
      });
      this.assetDetails = linkedAssets[0];
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
