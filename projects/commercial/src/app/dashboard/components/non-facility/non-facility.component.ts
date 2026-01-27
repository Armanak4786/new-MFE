import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { nonFacilityLoansColumnDefs } from '../../utils/dashboard-header.util';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { updateDataList } from '../../../utils/common-utils';
import { FacilityType } from '../../../utils/common-enum';

@Component({
  selector: 'app-non-facility-loan',
  templateUrl: './non-facility.component.html',
  styleUrls: ['./non-facility.component.scss'],
})
export class NonFacilityComponent {
  @Input() financialSummaryData;
  nonFacilityLoansColumnDefs = nonFacilityLoansColumnDefs;
  nonFacilityLoanDataList;
  constructor(
    private router: Router,
    public commonSetterGetterService: CommonSetterGetterService
  ) {}

  ngOnChanges(changes) {
    if (changes['financialSummaryData']) {
      this.nonFacilityLoanDataList =
        this.financialSummaryData?.nonFacilityLoansDetails;
      this.nonFacilityLoanDataList = updateDataList(
        this.financialSummaryData?.nonFacilityLoansDetails,
        FacilityType.NonFacilityLoan
      );
    }
  }

  clickData() {
    this.commonSetterGetterService.updateSection(
      'nonFacilityLoansDetails',
      this.nonFacilityLoanDataList
    );
    sessionStorage.setItem(
      'nonFacilityLoanDataList',
      JSON.stringify(this.nonFacilityLoanDataList)
    );
    this.router.navigateByUrl('/non-facility-loan');
  }

  onheaderclick(event) {
    this[event.actionName]();
  }

  calculateRemainingLimit(nonFacilityLoanDataList, targetFacilityName) {
    return nonFacilityLoanDataList.map((data) => {
      if (data.facilityName === targetFacilityName) {
        const limit = parseFloat(data.limit);
        const currentBalance = parseFloat(data.currentBalance);
        const remainingLimit = limit - currentBalance;

        // Return a new object with updated remainingLimit
        return {
          ...data,
          remainingLimit: remainingLimit.toString(),
        };
      }
      return data; // return unchanged loan for others
    });
  }
}
