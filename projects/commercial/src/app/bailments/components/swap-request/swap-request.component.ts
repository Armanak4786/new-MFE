import { Component } from '@angular/core';
import { bailmenSwapRequestColumnDefs } from '../../utils/bailment-header.utils';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'auro-ui';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { AssetsParams } from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { CommonApiService } from '../../../services/common-api.service';
import { FacilityType } from '../../../utils/common-enum';

@Component({
  selector: 'app-swap-request',
  templateUrl: './swap-request.component.html',
  styleUrls: ['./swap-request.component.scss'],
})
export class SwapRequestComponent {
  facilityType: string;
  selectedOption: string;
  assetToSearch;
  bailmenSwapRequestColumnDefs = bailmenSwapRequestColumnDefs;
  bailmentsDataList;
  subFailityOptionList = [];
  filteredAssetsDataList = [];
  facilityAssetList = [];
  showAssetList: boolean = false;
  subFacilityValue;
  selectedSubFacility;
  selectedSubFacilityID;
  partyId: number;
  disablebProceedButtonFlag: boolean = false;
  originalBailmentsDataList: any;
  programOptions: any;
  selectedProgram;

  constructor(
    private router: Router,
    public ref: DynamicDialogRef,
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {
    this.selectedOption = 'DEMO';
  }

  ngOnInit() {
    // this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
    //   this.partyId = currentParty?.id;
    // });
    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.facilityType = FacilityType.Bailment_Group;
    if (
      this.dynamicDialogConfig.data.bailmentFacilityDataList &&
      !this.dynamicDialogConfig.data.selectedSubFacility.facilityName?.trim()
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
          this.selectedSubFacilityID = this.subFailityOptionList[0].id;
          this.selectedSubFacility = this.subFailityOptionList;
        }
      }
    } else if (
      this.dynamicDialogConfig.data.selectedSubFacility &&
      this.dynamicDialogConfig.data.selectedSubFacility.facilityName?.trim()
    ) {
      const subSelectedFacility = {
        label: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
        value: this.dynamicDialogConfig.data.selectedSubFacility.facilityName,
        id: this.dynamicDialogConfig.data.selectedSubFacility.id,
      };
      this.selectedSubFacility = subSelectedFacility.value;
      this.selectedSubFacilityID = subSelectedFacility.id;
      this.subFailityOptionList.push(subSelectedFacility);

      const productParams = {
        partyId: this.partyId,
        subFacilityId: this.selectedSubFacilityID,
      };
      this.getProgram(productParams);
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

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      const data = await this.commonApiService.getAssetsData(params);
      if (data) {
        this.bailmentsDataList = data.filter((p) =>
          p.program.includes(this.selectedProgram?.replace(/^\d+\s*-\s*/, ''))
        );
        this.showAssetList = true;
        this.originalBailmentsDataList = JSON.parse(
          JSON.stringify(this.bailmentsDataList)
        );
      }
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  onCancelClick() {
    this.unCheckFilteredAssetsList();
    this.ref.close({ data: 'check' });
  }

  programChange(event) {
    this.selectedProgram = event?.value;
    const param = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacilityID,
    };
    this.fetchFacilityAssets(param);
  }

  onProceedClick() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      exculdeDealTypeId: this.selectedOption,
      subFacilityValue: this.selectedSubFacility,
      subFacilityId: this.selectedSubFacilityID,
      searchedBy: this.assetToSearch?.length,
      pageFrom: 'swap',
      //programId: this.selectedProgram?.value,
      programId: this.selectedProgram.split('-')[0].trim(),
    };
    this.unCheckFilteredAssetsList();
    if (this.filteredAssetsDataList) {
      // this.bailmentComponentLoaderService.setData(this.filteredAssetsDataList);
      sessionStorage.setItem('filteredAssetsDataList',JSON.stringify(this.filteredAssetsDataList));
      this.router.navigate(['bailment/swaps'], {
        state: { params: params },
      });
      this.ref.close({ data: 'confirm' });
    }
  }

  searchInput(event) {
    this.assetToSearch = event;
  }

  subFacilityChange(selectedValue) {
    // this.selectedSubFacilityID = selectedValue?.value?.id;
    const selectedObj = this.subFailityOptionList.find(
      (x) => x.value === selectedValue?.value
    );
    this.selectedSubFacility = selectedObj?.label;
    this.selectedSubFacilityID = selectedObj?.id;

    // this.selectedSubFacility = selectedValue?.value?.value;
    const productParams = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacilityID,
    };
    this.getProgram(productParams);
  }

  async getProgram(params) {
    try {
      const response = await this.commonApiService.getPrograms(params);
      this.programOptions = response.map((item) => ({
        label: item.lookupName,
        value: item.programId,
      }));
    } catch (error) {
      console.log('Error While Getting Data');
    }
  }

  onCellClick(event) {
    if (event.cellData == true) {
      if (!this.filteredAssetsDataList.includes(event.rowData)) {
        this.filteredAssetsDataList.push(event.rowData);
      }
      this.disablebProceedButtonFlag = true;
    } else if (event.cellData == false) {
      let index = this.filteredAssetsDataList.findIndex(
        (asset) => asset.assetNo === event.rowData.assetNo
      );
      if (index !== -1) {
        this.filteredAssetsDataList.splice(index, 1);
      }

      if (this.filteredAssetsDataList.length == 0) {
        this.disablebProceedButtonFlag = false;
      }
    }
  }
  unCheckFilteredAssetsList() {
    this.filteredAssetsDataList.forEach((item) => {
      item.id = false;
    });
  }
}
