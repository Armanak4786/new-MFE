import { Component, ViewChild } from '@angular/core';
import { CreditlinesComponentLoaderService } from '../../../creditlines/services/creditlines-component-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import {
  CommonService,
  CurrencyService,
  GenTableComponent,
  PrintService,
} from 'auro-ui';
import {
  IDocuments,
  IFacilityAssetResponse,
  InterestRateData,
  LeasePartiesData,
  PaymentStatements,
} from '../../../creditlines/interface/creditline.interface';
import {
  associatedAssetsColumnDefs,
  documentActions,
  documentsColumnDefs,
  interestRateColumnDefs,
  leasePartiesColumnDef,
  leaseScheduleColumnDefs,
  leaseSummaryColumnDefs,
  leaseTransactionsColumnDef,
  paymentColumnDefs,
  transactionsDataListColumnDef,
} from '../../../creditlines/utils/creditline-header-definition';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { FacilityType } from '../../../utils/common-enum';
import { NonFacilityGetterSetterService } from '../../../non-facility-loans/services/non-facility-getter-setter.service';
import { CommonApiService } from '../../../services/common-api.service';
import {
  CurrentPositionParams,
  InterestRateParams,
  LoanPartiesParams,
  transactionParams,
} from '../../../utils/common-interface';
import { CreditlineSetterGetterService } from '../../../creditlines/services/creditline-setter-getter.service';
import { loansPaymentColumnDefs } from '../../../utils/common-header-definition';
import {
  buildSheetData,
  calculatePaymentNotYetAllocated,
  calculateTotalOutstandingAmount,
  print,
} from '../../../utils/common-utils';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lease',
  //standalone: true,
  //imports: [],
  templateUrl: './lease.component.html',
  styleUrl: './lease.component.scss',
})
export class LeaseComponent {
  @ViewChild('LeaseSummaryDt') LeaseSummaryDt;
  @ViewChild('LeaseScheduleDt') LeaseScheduleDt;
  currentComponent = 'LeaseSummary';
  leaseData;
  leasePartiesData: LeasePartiesData[] = [];
  interesRateData: InterestRateData[] = [];
  documentsDataList: IDocuments[] = [];
  paymentDataList: PaymentStatements[] = [];
  interestRateColumnDefs;
  transactionDataList;
  leaseScheduleDataList;
  transactionsColumnDef = transactionsDataListColumnDef;
  documentsColumnDefs = documentsColumnDefs;
  documentActions = documentActions;
  paymentColumnDefs: any = paymentColumnDefs;
  leaseScheduleColumnDefs = leaseScheduleColumnDefs;
  leaseSummaryColumnDefs;
  leaseSummaryDataList;
  currentPosition;
  assetsColumnDef = associatedAssetsColumnDefs;
  leasePartiesColumnDef;
  assetsDatalist: IFacilityAssetResponse[] = [];
  partyId: number;
  selectedFacility: any;
  facilityType: string;
  paymentNotYetAllocated: any;
  overDue: any;
  idParam: string;

  constructor(
    private router: Router,
    public svc: CommonService,
    private currencyService: CurrencyService,
    private dashSvc: DashboardService,
    private nonFacilityGetterSetterSvc: NonFacilityGetterSetterService,
    private commonApiService: CommonApiService,
    public creditSetterGetter: CreditlineSetterGetterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public printSer: PrintService,
    private route: ActivatedRoute,
    public translateService: TranslateService
  ) {}

  ngOnInit() {
    //this.currencyService.initializeCurrency();
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.facilityType = this.dashSvc.getFacilityTpe();
    this.loadDataByFacilityType();
  }

  loadDataByFacilityType() {
    this.facilityType = this.dashSvc.getFacilityTpe();
    if (!this.facilityType) {
      // If no data found, navigate back
      this.router.navigate(['creditlines']);
    }
    this.idParam = this.route.snapshot.paramMap.get('id');
    const param = { partyId: this.partyId, contractId: this.idParam };
    this.fetchLoans(param);
    if (this.facilityType === FacilityType.CreditLines) {
      //this.leaseData = this.creditSetterGetter.getLeaseData()?.lease;
      this.selectedFacility =
        this.creditSetterGetter.getLeaseData()?.currentFacility;
    } else if (this.facilityType === FacilityType.NonFacilityLoan) {
      //this.leaseData = this.nonFacilityGetterSetterSvc.getLeaseData()?.lease;
      this.selectedFacility =
        this.nonFacilityGetterSetterSvc.getLeaseData()?.currentFacility;
    }
  }

  getDashbaordData() {
    this.interestRateColumnDefs = interestRateColumnDefs;
    this.leasePartiesColumnDef = leasePartiesColumnDef;
    this.leaseSummaryColumnDefs = leaseSummaryColumnDefs;
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.contractId,
    };
    this.fetchCurrentPosition(params);
    this.fetchInterestRate(params);
    this.fetchLeaseParties(params);
    const summaryParams = {
      partyId: this.partyId,
      leaseId: this.leaseData.contractId,
      Flag: true,
    };
    this.fetchLeaseSummaryData(summaryParams);
  }

  getNonFacilityData() {
    this.interestRateColumnDefs = interestRateColumnDefs;
    this.leasePartiesColumnDef = leasePartiesColumnDef;
    this.leaseSummaryColumnDefs = leaseSummaryColumnDefs;
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.contractId,
    };
    this.fetchCurrentPosition(params);
    this.fetchInterestRate(params);
    this.fetchLeaseParties(params);
    const summaryParams = {
      partyId: this.partyId,
      leaseId: this.leaseData.contractId,
    };
    this.fetchLeaseSummaryData(summaryParams);
  }

  async fetchLoans(params) {
    try {
      const data = await this.commonApiService.getLoansData(params);
      this.leaseData = data[0];
      this.getDashbaordData();
    } catch (error) {
      console.log('Error while loading loans data', error);
    }
  }

  async fetchLeaseSummaryData(params) {
    try {
      this.leaseSummaryDataList =
        await this.commonApiService.getLeaseScheduleData(params);
    } catch (error) {
      console.log('Error while loading lease summary data', error);
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

  async fetchInterestRate(params: InterestRateParams) {
    try {
      this.interesRateData = await this.commonApiService.getInterestRateData(
        params
      );
    } catch (error) {
      console.log('Error while loading Interest data', error);
    }
  }

  async fetchLeaseParties(params: LoanPartiesParams) {
    try {
      this.leasePartiesData = await this.commonApiService.getLoanPartiesData(
        params
      );
    } catch (error) {
      console.log('Error while loading loan parties data', error);
    }
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

  async fetchTransactionsTab(params) {
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

  async fetchLeaseScheduleTab(params) {
    try {
      this.leaseScheduleDataList =
        await this.commonApiService.getLeaseScheduleData(params);
    } catch (error) {
      console.log('Error while loading transaction data', error);
    }
  }

  async fetchAssociatedAssets(params) {
    try {
      this.assetsDatalist = await this.commonApiService.getAssetsData(params);
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  showDocumentsTab() {
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.contractId,
    };
    this.fetchDocuments(params);
    this.currentComponent = 'Documents';
  }

  showAssetsTab() {
    this.currentComponent = 'Assets';
    //this.getFacilityAssetsData(this.leaseData.contractId);
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.contractId,
    };
    this.fetchAssociatedAssets(params);
  }

  showLeaseScheduleTab() {
    this.currentComponent = 'LeaseSchedule';
    const params = {
      partyId: this.partyId,
      leaseId: this.leaseData.contractId,
    };
    this.fetchLeaseScheduleTab(params);
  }

  navigateToFacility() {
    if (this.facilityType === FacilityType.NonFacilityLoan) {
      this.router.navigate(['non-facility-loan']);
    } else if (this.facilityType === FacilityType.CreditLines) {
      this.router.navigate(['creditlines']);
    }
  }

  navigateToLoansDashboard() {
    this.commonSetterGetterSvc.navigateToLoan = true;
    sessionStorage.setItem('navigateToLoan', JSON.stringify(true));
    const routeMap: { [key: string]: string } = {
      CreditLines: 'creditlines',
      'Non-Facility Loan': 'non-facility-loan',
    };

    const route = routeMap[this.facilityType];

    if (route) {
      this.router.navigate([`${route}`]);
    } else {
      console.warn('Invalid facility type:', this.facilityType);
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

  onDocUploadClick(event) {
    console.log(event);
  }

  showLeaseSummaryTab() {
    this.currentComponent = 'LeaseSummary';
  }

  showLeaseStatementTab() {
    this.transactionsColumnDef = leaseTransactionsColumnDef;
    this.paymentColumnDefs = loansPaymentColumnDefs;
    const subFacilityId =
      this.creditSetterGetter.getLeaseData()?.currentFacility?.id;
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.contractId,
      subFacilityId: subFacilityId,
    };
    this.fetchPaymentsTab(params);
    this.fetchTransactionsTab(params);
    this.currentComponent = 'LeaseStatement';
  }

  export() {
    let workbookData = [];

    if (this.currentComponent === 'LeaseSummary') {
      const dt = this.LeaseSummaryDt;
      if (!dt) {
        console.error('LeaseSummary data is missing');
        return;
      }

      workbookData.push(
        buildSheetData({
          sheetName: 'Payment summary',
          columns: dt.leaseSummaryColumnDefs,
          dataList: dt.leaseSummaryDataList,
          translateService: this.translateService,
          excludedFields: ['actions'],
        })
      );
    }

    if (this.currentComponent === 'LeaseSchedule') {
      const dt = this.LeaseScheduleDt;
      if (!dt) {
        console.error('LeaseSchedule data is missing');
        return;
      }

      workbookData.push(
        buildSheetData({
          sheetName: 'Lease Statement',
          columns: dt.leaseScheduleColumnDefs,
          dataList: dt.leaseScheduleDataList.schedules,
          translateService: this.translateService,
          excludedFields: ['actions'],
        })
      );
    }

    if (workbookData.length === 0) {
      console.error('No valid sheets to export');
      return;
    }

    this.printSer.export('xlsx', 'Lease Data Export', workbookData);
  }

  onPrint() {
    print();
  }
}
