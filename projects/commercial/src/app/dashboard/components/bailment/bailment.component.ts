import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { bailmentcolumnDefs } from '../../utils/dashboard-header.util';
import { generateSummary } from '../../../utils/common-utils';
import { DashboardSetterGetterService } from '../../services/dashboard-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-bailments',
  templateUrl: './bailment.component.html',
  styleUrl: './bailment.component.scss',
})
export class BailmentComponent {
  @Input() financialSummaryData;
  bailmentDataList;
  bailmentcolumnDefs = bailmentcolumnDefs;

  constructor(
    private router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.bailmentDataList = this.financialSummaryData?.bailmentDetails;
      if (this.bailmentDataList) {
        this.bailmentDataList = generateSummary(this.bailmentDataList);
      }
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'bailmentDetails',
      this.bailmentDataList
    );
    sessionStorage.setItem(
      'bailmentDetails',
      JSON.stringify(this.bailmentDataList)
    );
    this.router.navigateByUrl('/bailment');
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
