import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { buybackFacilityColumnDefs } from '../../utils/dashboard-header.util';
import { FacilityType } from '../../../utils/common-enum';
import {
  getBuyBackSummaryData,
  updateDataList,
} from '../../../utils/common-utils';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-buyback-facility',
  templateUrl: './buyback-facility.component.html',
  styleUrl: './buyback-facility.component.scss',
})
export class BuybackFacilityComponent {
  @Input() financialSummaryData;
  buybackFacilityColumnDefs = buybackFacilityColumnDefs;
  buyBackDataList;
  constructor(
    private router: Router,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.buyBackDataList = getBuyBackSummaryData(
        this.financialSummaryData?.buybackDetails
      );
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'buybackDetails',
      this.buyBackDataList
    );
    sessionStorage.setItem(
      'buybackDetails',
      JSON.stringify(this.buyBackDataList)
    );
    this.router.navigateByUrl('/buyback');
  }
  onheaderclick(event) {
    this[event.actionName]();
  }
}
