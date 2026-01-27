import { Component, Input } from '@angular/core';
import { generateSummary } from '../../../utils/common-utils';
import { fixedFloorPlanColumnDefs } from '../../utils/dashboard-header.util';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { Router } from '@angular/router';
import { FacilityType } from '../../../utils/common-enum';

@Component({
  selector: 'app-fixed-floorplan',
  templateUrl: './fixed-floorplan.component.html',
  styleUrl: './fixed-floorplan.component.scss',
})
export class FixedFloorplanComponent {
  @Input() financialSummaryData;
  fixedFloorPlanDataList;
  fixedFloorPlanColumnDefs = fixedFloorPlanColumnDefs;

  constructor(
    private router: Router,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.fixedFloorPlanDataList = generateSummary(
        this.financialSummaryData?.fixedFloorplanDetails
      );
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'fixedFloorPlanDetails',
      this.fixedFloorPlanDataList
    );

    sessionStorage.setItem(
      'fixedFloorPlanDetails',
      JSON.stringify(this.fixedFloorPlanDataList)
    );

    this.router.navigate(['fixedfloorplan']);
  }

  onHeaderClick(event) {
    this[event.actionName]();
  }
}
