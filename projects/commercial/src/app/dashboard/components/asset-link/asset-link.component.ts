import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenTableComponent } from 'auro-ui';
import { assetlinkColumnDefs } from '../../utils/dashboard-header.util';
import { DashboardSetterGetterService } from '../../services/dashboard-setter-getter.service';
import { updateDataList } from '../../../utils/common-utils';
import { FacilityType } from '../../../utils/common-enum';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-asset-link',
  templateUrl: './asset-link.component.html',
  styleUrl: './asset-link.component.scss',
})
export class AssetLinkComponent {
  @Input() financialSummaryData;
  @ViewChild('dt')
  dt: GenTableComponent;

  assetlinkColumnDefs = assetlinkColumnDefs;
  assetlinkDataList;

  constructor(
    private router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.assetlinkDataList = updateDataList(
        this.financialSummaryData?.assetLinkDetails,
        FacilityType.Assetlink_Group
      );
      this.addIndexToDataList();
    }
  }

  addIndexToDataList() {
    if (this.assetlinkDataList && Array.isArray(this.assetlinkDataList)) {
      this.assetlinkDataList = this.assetlinkDataList.map((item, index) => ({
        ...item,
        __index: index
      }));
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'assetLinkDetails',
      this.assetlinkDataList
    );
    sessionStorage.setItem(
      'assetlinkDataList',
      JSON.stringify(this.assetlinkDataList)
    );
    this.router.navigateByUrl('/assetlink');
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
