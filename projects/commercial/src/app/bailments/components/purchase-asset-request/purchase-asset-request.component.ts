import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CommonApiService } from '../../../services/common-api.service';
import { bailmentPurchaseAssetRequestColumnDefs } from '../../utils/bailment-header.utils';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { BailmentSetterGetterService } from '../../services/bailment-setter-getter.service';
import {
  AssetsParams,
  SearchPurchaseAssetParams,
} from '../../../utils/common-interface';
import { FacilityType } from '../../../utils/common-enum';
@Component({
  selector: 'app-purchase-asset-request',
  //standalone: true,
  //imports: [],
  templateUrl: './purchase-asset-request.component.html',
  styleUrls: ['./purchase-asset-request.component.scss'],
})
export class PurchaseAssetRequestComponent {
  selectedSubFacility;
  assetToSearch;
  partyId: number;
  facilityType: string;
  subfacilityid: number;
  selectedOption: string;
  showAssetList: boolean = false;
  showTable: boolean = false;
  facilityAsssetsDatalist;
  selectedSubFacilityID;
  subFacilityOptionList = [];
  pageFrom: string = '';
  bailmentPurchaseAssetRequestColumnDefs;
  bailmentsDataList;
  searchedProduct;
  filteredAssetsDataList = [];
  disablebReleaseButtonFlag: boolean = true;
  originalBailmentsDataList: any;
  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private router: Router,
    public ref: DynamicDialogRef,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    private componentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public bailmentSetterGetterService: BailmentSetterGetterService
  ) {}

  ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty?.id;
    // });
    this.partyId=JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.bailmentPurchaseAssetRequestColumnDefs =
      bailmentPurchaseAssetRequestColumnDefs;
    if (
      this.dynamicDialogConfig.data.bailmentFacilityDataList &&
      !this.dynamicDialogConfig.data.selectedSubFacility?.facilityName?.trim()
    ) {
      const subFacilityNameList =
        this.dynamicDialogConfig.data.bailmentFacilityDataList;
      if (subFacilityNameList) {
        this.subFacilityOptionList = subFacilityNameList
          .filter(
            (item) => item.facilityName && item.facilityName.trim() !== ''
          )
          .map((item) => ({
            label: item.facilityName,
            value: item.facilityName,
            id: item.id,
          }));
      }
      // if (this.dynamicDialogConfig.data.selectedSubFacility) {
      //   const subSelectedFacility = {
      //     label: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
      //     value: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
      //     id: this.dynamicDialogConfig.data.selectedSubFacility.id,
      //   };
      //   this.selectedSubFacility = subSelectedFacility.value;
      //   this.selectedSubFacilityID = subSelectedFacility.id;
      //   this.subFacilityOptionList.push(subSelectedFacility);
      // }
    } else if (this.dynamicDialogConfig.data.selectedSubFacility) {
      const subSelectedFacility = {
        label: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
        value: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
        id: this.dynamicDialogConfig.data.selectedSubFacility.id,
      };
      this.selectedSubFacility = subSelectedFacility.value;
      this.selectedSubFacilityID = subSelectedFacility.id;
      this.subFacilityOptionList.push(subSelectedFacility);
      this.showTable = true;
      const params = {
        PartyNo: this.partyId,
        SubfacilityId: this.selectedSubFacilityID,
      };
      this.showFacilityAssets(params);
    }

    if (this.dynamicDialogConfig?.data) {
      this.facilityType = this.dynamicDialogConfig?.data?.facilityType;
      // this.selectedSubFacility =
      //   this.dynamicDialogConfig?.data?.selectedSubFacility;
    }
    console.log("subFacilityOptionList",this.subFacilityOptionList);
  }

  onSubFacilityChange(selectedValue) {
    const selectedObj = this.subFacilityOptionList.find(
      (x) => x.value === selectedValue?.value
    );
    this.selectedSubFacilityID = selectedObj?.id;
    this.selectedSubFacility = selectedObj?.value;
    this.showTable = true;
    const params = {
      PartyNo: this.partyId,
      SubfacilityId: this.selectedSubFacilityID,
    };
    this.showFacilityAssets(params);
  }

  async showFacilityAssets(params: SearchPurchaseAssetParams) {
    try {
      this.bailmentsDataList = await this.commonApiService.getPurchaseAsset(
        params
      );
      this.originalBailmentsDataList = JSON.parse(
        JSON.stringify(this.bailmentsDataList)
      );
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
    // this.componentLoaderService.loadBailmentDashboard('FacilityAssets');
  }

  onSearch() {
    const query = this.assetToSearch?.trim().toLowerCase() || '';
    if (!query) {
      // Reset to original full list
      this.bailmentsDataList = JSON.parse(
        JSON.stringify(this.originalBailmentsDataList)
      );
      return;
    }

    const searchList =
      this.originalBailmentsDataList?.assetDetails ||
      this.originalBailmentsDataList;

    const filteredData = searchList?.filter(
      (item) =>
        item.assetNo?.toString().toLowerCase().includes(query) ||
        (item.registrationNumber?.toLowerCase() || '').includes(query) ||
        (item.vehicleIdentificationNumber?.toLowerCase() || '').includes(query)
    );

    if (this.originalBailmentsDataList?.assetDetails) {
      this.bailmentsDataList = {
        ...this.bailmentsDataList,
        assetDetails: filteredData,
      };
    } else {
      this.bailmentsDataList = filteredData;
    }
  }

  onCellClick(event) {
    if (event.cellData == true) {
      if (!this.filteredAssetsDataList.includes(event.rowData)) {
        this.filteredAssetsDataList.push(event.rowData);
      }
      this.disablebReleaseButtonFlag = false;
    } else if (event.cellData == false) {
      let index = this.filteredAssetsDataList.findIndex(
        (asset) => asset.assetNo === event.rowData.assetNo
      );
      if (index !== -1) {
        this.filteredAssetsDataList.splice(index, 1); // Removes the object at the found index
      }
      if (this.filteredAssetsDataList.length == 0) {
        this.disablebReleaseButtonFlag = true;
      }
    }
  }

  onCancelClick() {
    this.ref.close();
  }

  onProceedClick() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,

      subFacilityValue: this.selectedSubFacility,
      subFacilityId: this.selectedSubFacilityID,
      pageFrom: 'purchase-asset',
      // searchedBy: this.assetToSearch?.length,
    };
    if (this.filteredAssetsDataList) {
      this.bailmentSetterGetterService.setPurchaseRequest({
        filteredAssetsDataList: this.filteredAssetsDataList,
        paymentRequest: this.bailmentsDataList.paymentRequest,
      });
      this.ref.close();
      if (this.facilityType === FacilityType.FixedFloorPlan_Group) {
        this.router.navigate(['commercial/fixedfloorplan/payment-request'], {
          state: { params: params },
        });
      } else {
        // this.bailmentComponentLoaderService.setData(this.filteredAssetsDataList);
        sessionStorage.setItem('filteredAssetsDataList',JSON.stringify(this.filteredAssetsDataList));
        this.router.navigate(['commercial/bailments/purchase-asset-request'], {
          state: { params: params },
        });
      }

      this.ref.close({ data: 'confirm' });
    }
  }

  searchProduct(event) {
    this.searchedProduct = event;
  }
}
