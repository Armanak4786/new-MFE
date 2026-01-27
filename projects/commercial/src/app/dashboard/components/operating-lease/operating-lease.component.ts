import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenTableComponent } from 'auro-ui';
import { operatingLeaseColumnDefs } from '../../utils/dashboard-header.util';
import { DashboardSetterGetterService } from '../../services/dashboard-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-operating-lease',
  templateUrl: './operating-lease.component.html',
  styleUrls: ['./operating-lease.component.scss'],
})
export class OperatingLeaseComponent implements OnChanges {
  columnsAsset = [];
  @ViewChild('dt')
  dt: GenTableComponent;
  selectedProducts: any;
  @Input() financialSummaryData;
  operatingLeasecolumnDefs = operatingLeaseColumnDefs;
  tableId: string = 'quote-list'; // Set the ID dynamically here
  operatingListDataList;

  constructor(
    private router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.operatingListDataList =
        this.financialSummaryData?.operatingLeaseDetails;
    }
  }
  clickData() {
    this.commonSetterGetterService.updateSection(
      'operatingLeaseDetails',
      this.operatingListDataList
    );
    sessionStorage.setItem(
      'operatingLeaseDataList',
      JSON.stringify(this.operatingListDataList)
    );
    this.router.navigateByUrl('/operating-lease');
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
