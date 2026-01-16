import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { AssetsParams } from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { bailmentSameDayPayoutRequestColumnDefs } from '../../utils/bailment-header.utils';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { Router } from '@angular/router';
import { FacilityType } from '../../../utils/common-enum';
// import { FacilityType} from '../utils/common-enum';

@Component({
  selector: 'app-same-day-payout',
  // standalone: true,
  // imports: [],
  templateUrl: './same-day-payout.component.html',
  styleUrls: ['./same-day-payout.component.scss'],
})
export class SameDayPayoutComponent {
  facilityType: 'Bailment';
  selectedSubFacility = null;
  subFacilityList = [];
  subFailityOptionList = [];
  selectedSubFacilityID;
  partyId: number;
  bailmentsDataList;
  filteredAssetsDataList = [];
  assetToSearch;
  bailmentSameDayPayoutRequestColumnDefs =
    bailmentSameDayPayoutRequestColumnDefs;
  showAssetList: boolean = false;
  disablebProceedButtonFlag: boolean = true;
  selectedOption: string;
  originalBailmentsDataList: any;

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private commonApiService: CommonApiService,
    public ref: DynamicDialogRef,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty?.id;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.facilityType = FacilityType.Bailment_Group;
    if (
      this.dynamicDialogConfig.data.bailmentFacilityDataList &&
      !this.dynamicDialogConfig.data.selectedSubFacility?.facilityName?.trim()
    ) {
      const subFacilityNameList =
        this.dynamicDialogConfig.data.bailmentFacilityDataList;
      if (subFacilityNameList) {
        this.subFailityOptionList = subFacilityNameList
          .filter(
            (item) => item.facilityName && item.facilityName.trim() !== ''
          )
          .map((item) => ({
            label: item.facilityName,
            value: item.facilityName,
            id: item.id,
          }));
        if (this.subFailityOptionList.length > 0) {
          this.selectedSubFacilityID =
            this.dynamicDialogConfig.data.selectedSubFacility.id;
          this.selectedSubFacility =
            this.dynamicDialogConfig.data.selectedSubFacility.id;
        }
      }
    } else if (this.dynamicDialogConfig.data.selectedSubFacility) {
      const subSelectedFacility = {
        label: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
        value: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
        id: this.dynamicDialogConfig.data.selectedSubFacility.id,
      };
      this.selectedSubFacility = subSelectedFacility.value;
      this.selectedSubFacilityID = subSelectedFacility.id;
      this.subFailityOptionList.push(subSelectedFacility);
      const params = {
        partyId: this.partyId,
        subFacilityId:this.selectedSubFacilityID,
      };
      this.showAssetList = true;
      this.fetchFacilityAssets(params);
    }
  }

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      this.bailmentsDataList = await this.commonApiService.getAssetsData(
        params
      );
      this.originalBailmentsDataList = JSON.parse(
        JSON.stringify(this.bailmentsDataList)
      );
      // console.log('this.bailmentsDataList', this.bailmentsDataList);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  onSearch() {
    const query = this.assetToSearch?.trim().toLowerCase() || '';

    // When search is empty, reset to full original list
    if (!query) {
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

    // Assign filtered data to the appropriate location
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
      this.disablebProceedButtonFlag = false;
    } else if (event.cellData == false) {
      let index = this.filteredAssetsDataList.findIndex(
        (asset) => asset.assetNo === event.rowData.assetNo
      );
      if (index !== -1) {
        this.filteredAssetsDataList.splice(index, 1); // Removes the object at the found index
      }

      if (this.filteredAssetsDataList.length == 0) {
        this.disablebProceedButtonFlag = true;
      }
    }
  }

  onCancelClick() {
    this.unCheckFilteredAssetsList();
    this.ref.close({ data: 'check' });
  }

  onProceedClick() {
    if (!this.filteredAssetsDataList || this.filteredAssetsDataList.length === 0) {
    return; 
    } 
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      exculdeDealTypeId: this.selectedOption,
      subFacilityValue: this.selectedSubFacility,
      subFacilityId: this.selectedSubFacilityID,
      searchedBy: this.assetToSearch?.length,
      pageFrom: 'same-day-payout',
    };
    this.unCheckFilteredAssetsList();
    if (this.filteredAssetsDataList) {
      // this.bailmentComponentLoaderService.setData(this.filteredAssetsDataList);
      sessionStorage.setItem('filteredAssetsDataList',JSON.stringify(this.filteredAssetsDataList));
      this.router.navigate(['commercial/bailments/same-day-payout'], {
        state: { params: params },
      });

      this.ref.close({ data: 'confirm' });
    }
  }

  searchInput(event) {
    this.assetToSearch = event;
  }

  onRadioChange(event: Event) {
    const selected = (event.target as HTMLInputElement).value;
    this.selectedOption = selected;
  }

  subFacilityChange(event) {
    const selectedObj = this.subFailityOptionList.find(
      (x) => x.value === event?.value
    );
    this.selectedSubFacilityID = selectedObj?.id;
    this.selectedSubFacility = selectedObj?.value;
    const params = {
      partyId: this.partyId,
      subFacilityId:this.selectedSubFacilityID,
    };
    this.showAssetList = true;
    this.fetchFacilityAssets(params);
  }

  unCheckFilteredAssetsList() {
    this.filteredAssetsDataList.forEach((item) => {
      item.id = false;
    });
  }
}
