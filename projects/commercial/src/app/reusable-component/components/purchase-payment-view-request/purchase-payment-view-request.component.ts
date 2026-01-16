import { Component, Input } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AssetsParams } from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-purchase-payment-view-request',
  //standalone: true,
  //imports: [],
  templateUrl: './purchase-payment-view-request.component.html',
  styleUrls: ['./purchase-payment-view-request.component.scss'],
})
export class PurchasePaymentViewRequestComponent {
  @Input() seletedRecoredData;
  @Input() purchaseDetails;
  originalRecord;
  partyId: any;
  facilityAssset: any;

  constructor(
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['seletedRecoredData']) {
      this.seletedRecoredData = changes?.['seletedRecoredData']?.currentValue;
      this.purchaseDetails = changes?.['swapDetails']?.currentValue;
    }
  }

  onContractClick(op: OverlayPanel, contractId: string, event: Event): void {
    event.preventDefault();
    op.toggle(event); // Toggle the overlay panel
    if (!contractId) {
      console.warn('No contract ID provided');
      return;
    } else {
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      });
      const params = {
        id: JSON.parse(contractId),
      };
      this.fetchAssetDetailsSummary(params);
    }
  }

  async fetchAssetDetailsSummary(params) {
    try {
      this.facilityAssset = await this.commonApiService.getAssetDetail(params);
      console.log(this.facilityAssset);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }
}
