import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenTableComponent } from 'auro-ui';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { generateSummary } from '../../../utils/common-utils';
import { floatingFloorPlanColumnDefs } from '../../utils/dashboard-header.util';

@Component({
  selector: 'app-floating-floorplan',
  templateUrl: './floating-floorplan.component.html',
  styleUrl: './floating-floorplan.component.scss',
})
export class FloatingFloorplanComponent {
  @Input() financialSummaryData;
  columnsAsset = [];
  @ViewChild('dt')
  dt: GenTableComponent;
  selectedRowData: any;
  selectionMode = false;
  applicationSearchValue: any;
  selectedFromDate: any;
  selectedToDate: any;
  rowData: any = [];
  table;
  selectedProducts: any;
  tableId: string = 'quote-list'; // Set the ID dynamically here
  floatingFloorPlanDataList;
  floatingFloorPlanColumnDefs = floatingFloorPlanColumnDefs;
  constructor(
    private router: Router,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.floatingFloorPlanDataList = generateSummary(
        this.financialSummaryData?.floatingFloorplanDetails
      );
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'floatingFloorPlanDetails',
      this.floatingFloorPlanDataList
    );
    sessionStorage.setItem(
      'floatingFloorPlanDetails',
      JSON.stringify(this.floatingFloorPlanDataList)
    );
    this.router.navigate(['floatingfloorplan']);
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
