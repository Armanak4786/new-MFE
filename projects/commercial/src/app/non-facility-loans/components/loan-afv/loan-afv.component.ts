import { Component } from '@angular/core';
import { FacilityType } from '../../../utils/common-enum';

import {
  calculatePaymentNotYetAllocated,
  calculateTotalOutstandingAmount,
  formatDate,
} from '../../../utils/common-utils';
import {
  documentsColumnDefs,
  facilityColumnDefs,
  paymentSummaryColumnDefs,
  piScheduleColumnDefs,
} from '../../utils/non-facility-header-definition';
import { CommonService, CurrencyService } from 'auro-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { NonFacilityGetterSetterService } from '../../services/non-facility-getter-setter.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import {
  loanPartiesColumnDef,
  loansPaymentColumnDefs,
  loanTransactionsColumnDef,
} from '../../../utils/common-header-definition';
import { interestRateColumnDefs } from '../../../creditlines/utils/creditline-header-definition';
import {
  InterestRateData,
  PaymentStatements,
} from '../../../creditlines/interface/creditline.interface';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AssetsParams,
  CurrentPositionParams,
  InterestRateParams,
  LoanPartiesParams,
  PaymentSummaryParams,
  transactionParams,
} from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';

@Component({
  selector: 'app-loan-afv',
  //standalone: true,
  //imports: [],
  templateUrl: './loan-afv.component.html',
  styleUrls: ['./loan-afv.component.scss'],
})
export class LoanAfvComponent {
  currentComponent = 'PaymentSummary';
  facilityType: string;
  currentPosition;
  assetsDatalist;
  loanPartiesColumnDef = loanPartiesColumnDef;
  interestRateColumnDefs = interestRateColumnDefs;
  interesRateData: InterestRateData[] = [];
  piScheduleColumnDefs = [];
  documentsColumnDefs = [];

  actionForAssetList = [
    {
      icon: 'pi pi-ellipsis-h',
    },
  ];
  associatedAssetsDataList;
  associatedAsetscolumnDefs: any[];
  piScheduleDataList;
  paymentSummaryDataList;
  documentsDataList;
  paymentSummaryColumnDefs = [];
  loanPartiesData: any;
  toDate: any;
  loanData: any;
  partyId: number;

  transactionsColumnDef = loanTransactionsColumnDef;
  transactionDataList;
  paymentColumnDefs = loansPaymentColumnDefs;
  paymentDataList: PaymentStatements[] = [];
  overDue: any;
  paymentNotYetAllocated: number;
  idParam: string;

  constructor(
    public svc: CommonService,
    public router: Router,
    public nonFacilityService: NonFacilityGetterSetterService,
    private dashSvc: DashboardService,
    private currencyService: CurrencyService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //this.currencyService.initializeCurrency();
    this.idParam = this.route.snapshot.paramMap.get('id');
    const param = { partyId: this.partyId, contractId: this.idParam };
    this.fetchLoans(param);
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    if (!this.partyId) {
      this.router.navigate(['commercial/non-facility-loan']);
    }
  }

  checkFacilityAndFetch() {
    this.facilityType = this.dashSvc.getFacilityTpe();
    if (this.facilityType === FacilityType.NonFacilityLoan) {
      this.getNonFacilityData();
    }
  }

  async fetchLoans(params) {
    try {
      const data = await this.commonApiService.getLoansData(params);
      this.loanData = data[0];
      this.checkFacilityAndFetch();
    } catch (error) {
      console.log('Error while loading loans data', error);
    }
  }

  navigateToNonFacility() {
    this.router.navigate(['commercial/non-facility-loan']);
  }

  navigateToLoansDashboard() {
    this.nonFacilityService.navigateToLoan = true;
    this.router.navigate([`commercial/non-facility-loan`]);
  }

  getNonFacilityData() {
    this.toDate = formatDate(new Date());
    this.paymentSummaryColumnDefs = paymentSummaryColumnDefs;
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchCurrentPosition(params);
    this.fetchPaymentSummary(params);
    this.fetchLoanParties(params);
    this.fetchInterestRate(params);
  }

  async fetchDocuments(params) {
    try {
      this.documentsDataList = await this.commonApiService.getDocumentsData(
        params
      );
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }

  async fetchPiSchedule(params) {
    try {
      this.piScheduleDataList = await this.commonApiService.getPiScheduleData(
        params
      );
    } catch (error) {
      console.log('Error while loading payment data', error);
    }
  }

  async fetchInterestRate(params: InterestRateParams) {
    try {
      this.interesRateData = await this.commonApiService.getInterestRateData(
        params
      );
    } catch (error) {
      console.log('Error while loading Interest data', error);
    }
  }

  async fetchLoanParties(params: LoanPartiesParams) {
    try {
      this.loanPartiesData = await this.commonApiService.getLoanPartiesData(
        params
      );
    } catch (error) {
      console.log('Error while loading loan parties data', error);
    }
  }

  async fetchPaymentSummary(params: PaymentSummaryParams) {
    try {
      this.paymentSummaryDataList =
        await this.commonApiService.getPaymentSummaryData(params);
    } catch (error) {
      console.log('Error while loading payment data', error);
    }
  }

  async fetchCurrentPosition(params: CurrentPositionParams) {
    try {
      this.currentPosition = await this.commonApiService.getCurrentPositionData(
        params
      );
    } catch (error) {
      console.log('Error while loading payment data', error);
    }
  }

  async fetchAssociatedAssets(params: AssetsParams) {
    try {
      this.associatedAssetsDataList = await this.commonApiService.getAssetsData(
        params
      );
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  onDocumentClick(event) {
    if (event.action == 'download') {
      //this.downloadDoc(event.index); event.rowData.id
      //this.getDownloadDocById(event.rowData.id);
    } else if (event.action == 'view') {
      const doc = this.documentsDataList[event.index];
    }
  }

  async fetchPaymentsTab(params: transactionParams) {
    try {
      this.paymentDataList = await this.commonApiService.getPaymentsTabData(
        params
      );
      if (this.paymentDataList) {
        this.paymentNotYetAllocated = calculatePaymentNotYetAllocated(
          this.paymentDataList
        );
      }
    } catch (error) {
      console.log('Error while loading payment data', error);
    }
  }

  async fetchLoansTransactionsTab(params: transactionParams) {
    try {
      this.transactionDataList =
        await this.commonApiService.getTransactionsTabData(params);
      if (this.transactionDataList) {
        this.overDue = calculateTotalOutstandingAmount(
          this.transactionDataList
        );
      }
    } catch (error) {
      console.log('Error while loading transaction data', error);
    }
  }

  showPaymentSummaryTab() {
    this.currentComponent = 'PaymentSummary';
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchPaymentSummary(params);
  }

  showPiScheduleTab() {
    this.currentComponent = 'PiSchedule';
    this.piScheduleColumnDefs = piScheduleColumnDefs;
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchPiSchedule(params);
  }

  showLoanStatementTab() {
    this.currentComponent = 'TransactionFlow';
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchPaymentsTab(params);
    this.fetchLoansTransactionsTab(params);
  }

  showAssociatedAssetsTab() {
    this.currentComponent = 'AssociatedAssets';
    this.associatedAsetscolumnDefs = facilityColumnDefs;
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchAssociatedAssets(params);
  }

  showDocumentsTab() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchDocuments(params);
    this.currentComponent = 'Documents';
    this.documentsColumnDefs = documentsColumnDefs;
  }
}
