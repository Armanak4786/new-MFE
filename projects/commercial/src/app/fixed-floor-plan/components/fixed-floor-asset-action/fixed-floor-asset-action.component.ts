import { Component } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { FacilityType } from '../../../utils/common-enum';
import { ClickedSubfacility } from '../../../utils/common-interface';
import { CommonService } from 'auro-ui';
import { CommonApiService } from '../../../services/common-api.service';
import { PurchaseAssetRequestComponent } from '../../../bailments/components/purchase-asset-request/purchase-asset-request.component';
import {

  generateSummary,

} from '../../../utils/common-utils';
import { take } from 'rxjs';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';

@Component({
  selector: 'app-fixed-floor-asset-action',
  templateUrl: './fixed-floor-asset-action.component.html',
  styleUrl: './fixed-floor-asset-action.component.scss'
})
export class FixedFloorAssetActionComponent {
   filteredAssetsDataList;
    partyId;
    facilityType = FacilityType.FixedFloorPlan;
    clickedSubfacility: ClickedSubfacility;
    fixedFloorFacilityDataList;
    subFacilityList;
    selectedSubFacility;
constructor(
    public svc: CommonService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private commonApiService: CommonApiService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
  ) {}
  ngOnInit() {
   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty.id;
    });
    
  this.commonSetterGetterSvc.setDisableParty(false);
    this.commonSetterGetterSvc.financial.subscribe((data) => {
          this.fixedFloorFacilityDataList = data?.fixedFloorplanDetails ?? [];
          this.fixedFloorFacilityDataList &&
            this.fixedFloorFacilityDataList.length > 5
            ? this.fixedFloorFacilityDataList.length - 5
            : 0;
         
            this.dashboardSetterGetterSvc.financialList$
              .pipe(take(1))
              .subscribe((list) => {
                const details = list?.fixedFloorplanDetails ?? [];
                this.fixedFloorFacilityDataList = generateSummary(details);
              });
          
        });
        if (!this.fixedFloorFacilityDataList.length) {
          this.svc.router.navigateByUrl('commercial');
          return;
        }
       
        
         this.selectedSubFacility = this.fixedFloorFacilityDataList[0];
      }

  paymentTransferRequest() {
      this.svc.dialogSvc
        .show(PurchaseAssetRequestComponent, 'Payment Request', {
          templates: {
            footer: null,
          },
          data: {
            facilityType: this.facilityType,
            selectedSubFacility: this.selectedSubFacility,
            bailmentFacilityDataList: this.fixedFloorFacilityDataList,
          },
          width: '60vw',
          height: '30vw',
        })
        .onClose.subscribe((data: any) => { });
      this.showFacilityAssets();
  }
  showFacilityAssets() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
    
      ...(this.selectedSubFacility?.facilityName?.trim() !== '' && {
        subFacilityId: this.selectedSubFacility.id,
      }),
    };
    this.commonApiService.getAssetsData(params).then((data) => {
      if (data) {
        this.filteredAssetsDataList = data;
      }
    });

  }
}
