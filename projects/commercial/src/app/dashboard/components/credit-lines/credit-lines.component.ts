import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'auro-ui';
import { creditlineFacilityColumnDefs } from '../../utils/dashboard-header.util';
import { CreditlineSetterGetterService } from '../../../creditlines/services/creditline-setter-getter.service';
import { DashboardSetterGetterService } from '../../services/dashboard-setter-getter.service';
import { updateDataList } from '../../../utils/common-utils';
import { FacilityType } from '../../../utils/common-enum';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-credit-lines',
  templateUrl: './credit-lines.component.html',
  styleUrls: ['./credit-lines.component.scss'],
})
export class CreditLinesComponent {
  @Input() financialSummaryData;
  creditlineFacilityColumnDefs = creditlineFacilityColumnDefs;
  creditlinesDataList;
  constructor(
    private router: Router,
    public svc: CommonService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.creditlinesDataList = updateDataList(
        this.financialSummaryData?.creditlineDetails,
        FacilityType.Creditline_Group
      );
    }
  }

  click() {
    this.commonSetterGetterService.updateSection(
      'creditlineDetails',
      this.creditlinesDataList
    );
    sessionStorage.setItem(
      'creditlinesDataList',
      JSON.stringify(this.creditlinesDataList)
    );
    this.router.navigate(['/commercial/creditlines']);
  }

  onheaderclick(event) {
    this[event.actionName]();
  }
}
