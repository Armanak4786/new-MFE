import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenTableComponent } from 'auro-ui';
import { easylinkFacilityColumnDefs } from '../../utils/dashboard-header.util';
import { DashboardSetterGetterService } from '../../services/dashboard-setter-getter.service';
import { updateDataList } from '../../../utils/common-utils';
import { FacilityType } from '../../../utils/common-enum';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-easy-link',
  templateUrl: './easy-link.component.html',
  styleUrls: ['./easy-link.component.scss'],
})
export class EasyLinkComponent {
  @ViewChild('dt')
  dt: GenTableComponent;
  @Input() financialSummaryData;
  easylinkDataList;
  easylinkFacilityColumnDefs = easylinkFacilityColumnDefs;
  updateDataList: any;
  updateEasyLinkDetails: any;
  constructor(
    private router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.easylinkDataList = updateDataList(
        this.financialSummaryData?.easyLinkDetails,
        FacilityType.Easylink_Group
      );
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'easyLinkDetails',
      this.easylinkDataList
    );
    sessionStorage.setItem(
      'easylinkDataList',
      JSON.stringify(this.easylinkDataList)
    );
   this.router.navigateByUrl('/easylink');
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
