import { Component, Input, OnInit } from '@angular/core';
import { FacilityAssetsService } from '../../../assetlink/services/facility-assets.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-release-security',
  templateUrl: './release-security.component.html',
  styleUrls: ['./release-security.component.scss'],
})
export class ReleaseSecurityComponent implements OnInit {
  facilityType;
  assetsDataList;
  assetsColumnDefs;
  filteredAssetsDataList;
  filteredAssetsDataListToRelease = [];
  disablebReleaseButtonFlag: boolean = true;
  searchQuery: string = '';
  constructor(
    private router: Router,
    public ref: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    public facilityAsset: FacilityAssetsService
  ) {
    if (this.dynamicDialogConfig?.data) {
      this.filteredAssetsDataList = [];
      this.assetsDataList = this.dynamicDialogConfig.data.assetDetailList;
      this.assetsColumnDefs =
        this.dynamicDialogConfig.data.assetReleasecolumnDefs;
      this.facilityType = this.dynamicDialogConfig.data.facilityType;
    }
  }

  ngOnInit(): void {
    this.filteredAssetsDataList = [...this.assetsDataList];
    this.facilityType = this.dynamicDialogConfig.data.facilityType;
  }

  // onSearchChange() {
  //   // Filter the dataList based on the searchQuery
  //   this.filteredAssetsDataList = this.assetsDataList.filter(
  //     (item) =>
  //       item.assetNo.includes(this.searchQuery) ||
  //       item.regVINSerialChassis.includes(this.searchQuery) ||
  //       item.loanId.includes(this.searchQuery)
  //   );
  // }
  onSearchChange() {
    const query = this.searchQuery?.toLowerCase() || '';

    this.filteredAssetsDataList = this.assetsDataList.filter((item) =>
      (item.assetNo?.toString().toLowerCase().includes(query)) ||
      (item.registrationNumber?.toLowerCase() || '').includes(query) ||
      (item.vehicleIdentificationNumber?.toLowerCase() || '').includes(query) ||
      (item.chassisNumber?.toLowerCase() || '').includes(query) ||
      (item.contractId?.toString().toLowerCase().includes(query))
    );
  }

  releaseRequest() {
    if (this.disablebReleaseButtonFlag === false) {
      this.facilityAsset.setData(this.filteredAssetsDataListToRelease);
      if (this.facilityType == 'AssetLink') {
        this.router.navigate(['commercial/assetlink/releaseSecurityRequest']);
      } else if (this.facilityType == 'EasyLink') {
        this.router.navigate(['commercial/easylink/releaseSecurityRequest']);
      }
      this.ref.close();
    }
  }

  onCellClick(event) {
    if (event.cellData == true) {
      if (!this.filteredAssetsDataListToRelease.includes(event.rowData)) {
        this.filteredAssetsDataListToRelease.push(event.rowData);
      }
      this.disablebReleaseButtonFlag = false;
    } else if (event.cellData == false) {
      let index = this.filteredAssetsDataListToRelease.findIndex(
        (asset) => asset.assetNo === event.rowData.assetNo
      );
      if (index !== -1) {
        this.filteredAssetsDataListToRelease.splice(index, 1); // Removes the object at the found index
      }
      if (this.filteredAssetsDataListToRelease.length == 0) {
        this.disablebReleaseButtonFlag = true;
      }
    }
  }

  onCancelClick() {
    this.ref.close();
  }
}
