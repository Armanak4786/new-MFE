import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FacilityType } from '../../../utils/common-enum';
import { updateDataList } from '../../../utils/common-utils';

@Component({
  selector: 'app-funds',

  templateUrl: './funds.component.html',

  styleUrl: './funds.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundsComponent {
  @Input() financialSummaryData: any;

  totalLimit: number = 0;

  totalCurrentBalance: number = 0;

  availableFunds: number = 0;

  funds: any;

  private isFirstLoadDone = false;

  async ngOnChanges() {
    if (this.financialSummaryData) {
      this.funds = await this.calculateTotalLimitsAndBalance(
        this.financialSummaryData
      );

      this.mapFundsSummary();

      this.isFirstLoadDone = true;
    }
  }
  //constructor(private cdr: ChangeDetectorRef) {}

  // async ngOnChanges(changes: SimpleChanges) {
  //   if (
  //     changes['financialSummaryData']?.currentValue !==
  //     changes['financialSummaryData']?.previousValue
  //   ) {
  //     const funds = await this.calculateTotalLimitsAndBalance(
  //       this.financialSummaryData
  //     );
  //     this.updateFunds(funds); // Separate method
  //     this.cdr.markForCheck(); // Manual trigger
  //   }
  // }

  private updateFunds(funds: any) {
    this.funds = funds;
    this.totalLimit = funds.totalLimit;
    this.totalCurrentBalance = funds.totalCurrentBalance;
    this.availableFunds = funds.availableFunds;
  }

  mapFundsSummary() {
    this.totalLimit = this.funds?.totalLimit;

    this.totalCurrentBalance = this.funds?.totalCurrentBalance;

    this.availableFunds = this.funds?.availableFunds;
  }

  async calculateTotalLimitsAndBalance(financialSummaryData: any) {
    let totalLimit: number = 0;
    let totalCurrentBalance: number = 0;
    let availableFunds: number = 0;

    const combinedFacilities = [
      ...financialSummaryData.assetLinkDetails,
      ...financialSummaryData.easyLinkDetails,
      ...financialSummaryData.creditlineDetails,
      ...financialSummaryData.introducerTransactionDetails,
      ...financialSummaryData.operatingLeaseDetails,
    ];

    const wholesaleFacilities = [
      ...financialSummaryData.bailmentDetails,
      ...financialSummaryData.fixedFloorplanDetails,
      ...financialSummaryData.floatingFloorplanDetails,
    ];
    let wholesaleFilteredFacilities = wholesaleFacilities.filter(
      (facility) => facility.contractId == 0
    );
    let filteredFacilities = combinedFacilities.filter(
      (facility) =>
        facility.facilityType == FacilityType.Assetlink_Group ||
        facility.facilityType == FacilityType.Easylink_Group ||
        facility.facilityType == FacilityType.Creditline_Group
    );
    const filteredNonFacilityList = updateDataList(
      this.financialSummaryData?.nonFacilityLoansDetails,
      FacilityType.NonFacilityLoan
    )?.map((facility) => ({
      ...facility,
      limit: facility.currentBalance || 0, // Override limit for non-facility
    }));
    const buybackFacility = [...financialSummaryData.buybackDetails];
    filteredFacilities = filteredFacilities
      .concat(filteredNonFacilityList || [])
      .concat(buybackFacility ? buybackFacility : [])
      .concat(wholesaleFilteredFacilities || []);
    for (const facility of filteredFacilities) {
      totalLimit += facility.limit || 0;
      totalCurrentBalance += facility.currentBalance || 0;
      availableFunds += facility.availableFunds || 0;
    }

    totalLimit = Math.round(totalLimit * 100) / 100;

    totalCurrentBalance = Math.round(totalCurrentBalance * 100) / 100;

    availableFunds = Math.round(availableFunds * 100) / 100;

    const summary = {
      totalLimit: totalLimit,

      totalCurrentBalance: totalCurrentBalance,

      availableFunds: availableFunds,
    };
    return summary;
  }
}
