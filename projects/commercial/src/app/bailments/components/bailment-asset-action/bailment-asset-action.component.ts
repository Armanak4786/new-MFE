import { Component } from '@angular/core';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'auro-ui';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { ProductTransferRequestComponent } from '../product-transfer-request/product-transfer-request.component';
import { FacilityType } from '../../../utils/common-enum';
import { ClickedSubfacility } from '../../../utils/common-interface';
import { PurchaseAssetRequestComponent } from '../purchase-asset-request/purchase-asset-request.component';

@Component({
  selector: 'app-bailment-asset-action',
  templateUrl: './bailment-asset-action.component.html',
  styleUrls: ['./bailment-asset-action.component.scss'],
})
export class BailmentAssetActionComponent {
  filteredAssetsDataList;
  partyId;
  facilityType = FacilityType.Bailment_Group;
  clickedSubfacility: ClickedSubfacility;
  bailmentFacilityDataList;
  subFacilityList;
  selectedSubFacility;
  
  constructor(
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    private router: Router,
    public svc: CommonService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}
  ngOnInit() {
    this.clickedSubfacility = {
      subFacilityType: '',
      subFacilityId: 0,
    };
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty.id;
    });
    this.commonSetterGetterSvc.facilityMap$.subscribe((map) => {
      this.clickedSubfacility.subFacilityType = map.SubfacilityType;
    });
    // this.commonSetterGetterSvc.clearFacilityMap();
    this.commonSetterGetterSvc.contractIdForSettlementQuote$.subscribe((a) => {
      this.clickedSubfacility.subFacilityId = a;
    });
    // this.commonSetterGetterSvc.clearContractIdForSettlementQuote();
    this.commonSetterGetterSvc.financial.subscribe((data) => {
      this.bailmentFacilityDataList = data?.bailmentDetails ?? [];
    });

    this.subFacilityList = this.getUniqueFacilityNames(
      this.bailmentFacilityDataList
    );
    console.log(' this.subFacilityList', this.subFacilityList);

    console.log('clickedSubfacility', this.clickedSubfacility);
  }
  getUniqueFacilityNames(
    dataList: any[]
  ): { label: string; value: string; id: number }[] {
    const facilityMap = new Map<string, number>();
    dataList.forEach((item) => {
      const name = item.facilityName?.trim();
      if (name && name.length > 0 && !facilityMap.has(name)) {
        facilityMap.set(name, item.id);
      }
    });
    return Array.from(facilityMap.entries()).map(([name, id]) => ({
      label: name,
      value: name,
      id: id,
    }));
  }

  showProductTransferRequest() {
    this.svc.dialogSvc
      .show(ProductTransferRequestComponent, 'Product Transfer', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          clickedSubfacility: this.clickedSubfacility,
          subFacilityList: this.subFacilityList,
        },
        width: '78vw',
        height: '40vw',
      })
      .onClose.subscribe((data: any) => {});
  }
  showPurchaseAssetRequest()  
    {
      const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityValue: this.clickedSubfacility.subFacilityType,
      subFacilityId: this.clickedSubfacility.subFacilityId,
      pageFrom: 'purchase-asset',
      typeofnavigation:'actions'
    };
    console.log("showPurchaseAssetRequest",params);
    this.router.navigate(['commercial/bailments/purchase-asset-request'], {
      state: { params: params },
    });
    }

  showSwapRequest() {
    const params = {
      partyId: this.partyId,
      facilityType: 'Bailments',
      subFacilityValue: this.clickedSubfacility.subFacilityType,
      subFacilityId: this.clickedSubfacility.subFacilityId,
      pageFrom: 'swap',
    };
    this.router.navigate(['commercial/bailments/swaps'], {
      state: { params: params },
    });
  }
}
