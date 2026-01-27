import { Component, ViewChild } from '@angular/core';
import { CommonService, ToasterService } from 'auro-ui';
import { ActivatedRoute, Router } from '@angular/router';
import {
  calculatePaymentNotYetAllocated,
  calculateTotalOutstandingAmount,
  clearUploadedDocuments,
  downloadDoc,
  formatDate,
  handleDocumentAction,
} from '../../../utils/common-utils';
import { NonFacilityGetterSetterService } from '../../../non-facility-loans/services/non-facility-getter-setter.service';
import {
  loanPartiesColumnDef,
  loansPaymentColumnDefs,
  loanTransactionsColumnDef,
} from '../../../utils/common-header-definition';
import {
  documentsColumnDefs,
  facilityColumnDefs,
  paymentSummaryColumnDefs,
  piScheduleColumnDefs,
} from '../../../non-facility-loans/utils/non-facility-header-definition';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { FacilityType } from '../../../utils/common-enum';

import { CommonApiService } from '../../../services/common-api.service';
import {
  AssetsParams,
  CurrentPositionParams,
  DocumentByIdParams,
  InterestRateParams,
  LoanPartiesParams,
  PaymentSummaryParams,
  transactionParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { AssetlinkSetterGetterService } from '../../../assetlink/services/assetlink-setter-getter.service';
import {
  assetlinkFacilityAssetsColumnDefs,
  assetlinkPiScheduleColumnDefs,
  interestRateColumnDefs,
} from '../../../assetlink/utils/assetlink-header.util';
import { EasylinkSetterGetterService } from '../../../easylink/services/easylink-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentsComponent } from '../documents/documents.component';
import { easylinkFacilityAssetsColumnDefs } from '../../../easylink/utils/easylink-header-util';

@Component({
  selector: 'app-loan-dashboard',
  //standalone: true,
  //imports: [],
  templateUrl: './loan-dashboard.component.html',
  styleUrl: './loan-dashboard.component.scss',
})
export class LoanDashboardComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  currentComponent = 'PaymentSummary';
  facilityType: string;
  currentPosition;
  assetsDatalist;
  loanPartiesColumnDef = loanPartiesColumnDef;
  piScheduleColumnDefs = [];
  documentsColumnDefs = [];

  actionForAssetList = [
    {
      icon: 'pi pi-ellipsis-h',
    },
  ];
  associatedAssetsDataList;
  associatedAsetscolumnDefs: any[];
  interestRateColumnDefs;
  piScheduleDataList;
  paymentSummaryDataList;
  documentsDataList;
  paymentSummaryColumnDefs = [];
  interesRateData: any;
  loanPartiesData: any;
  toDate: any;
  loanData: any;
  partyId: number;
  loanPaymentColumnDefs;
  loanPaymentDataList;
  transactionsColumnDef: any;
  transactionDataList: any;
  allocatedPayments: any;
  paymentNotYetAllocated: number;
  overDue: any;
  loansDataList: any;
  idParam: any;

  constructor(
    public svc: CommonService,
    public router: Router,
    public nonFacilityService: NonFacilityGetterSetterService,
    private dashSvc: DashboardService,
    private commonApiService: CommonApiService,
    public assetlinkSetterGetterSvc: AssetlinkSetterGetterService,
    public easylinkSetterGetterSvc: EasylinkSetterGetterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const partyData = sessionStorage.getItem('currentParty');
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    this.idParam = this.route.snapshot.paramMap.get('id');
    const param = { partyId: this.partyId, contractId: this.idParam };
    this.fetchLoans(param);
    // this.facilityType = this.dashSvc.getFacilityTpe();
    this.facilityType =
      sessionStorage.getItem('currentFacilityType') || this.facilityType;
  }

  checkFacilityAndFetch() {
    if (this.facilityType === FacilityType.Assetlink) {
      this.getAssetLinkData();
    } else if (this.facilityType === FacilityType.Easylink) {
      this.getEasyLinkData();
    } else if (this.facilityType === FacilityType.NonFacilityLoan) {
      this.getNonFacilityData();
    }
  }

  getNonFacilityData() {
    if (!this.loanData) {
      // If no data found, navigate back
      this.router.navigateByUrl('commercial/non-facility-loan');
    }
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.toDate = formatDate(new Date());
    this.interestRateColumnDefs = interestRateColumnDefs;
    this.paymentSummaryColumnDefs = paymentSummaryColumnDefs;
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
  async fetchLoans(params) {
    try {
      const data = await this.commonApiService.getLoansData(params);
      this.loanData = data[0];
      this.checkFacilityAndFetch();
      console.log(this.loanData);
    } catch (error) {
      console.log('Error while loading loans data', error);
    }
  }

  getPiSchedule() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    if (
      FacilityType.Assetlink == this.facilityType ||
      FacilityType.Easylink == this.facilityType
    ) {
      this.piScheduleColumnDefs = assetlinkPiScheduleColumnDefs;
      this.fetchPiSchedule(params);
    } else if (FacilityType.NonFacilityLoan === this.facilityType) {
      this.piScheduleColumnDefs = piScheduleColumnDefs;
      this.fetchPiSchedule(params);
    }
  }

  getAssociatedAssets() {
    if (FacilityType.Assetlink === this.facilityType) {
      this.associatedAsetscolumnDefs = assetlinkFacilityAssetsColumnDefs;
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: this.loanData.contractId,
      };
      this.fetchAssociatedAssets(params);
    } else if (FacilityType.Easylink === this.facilityType) {
      this.associatedAsetscolumnDefs = easylinkFacilityAssetsColumnDefs;
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: this.loanData.contractId,
      };
      this.fetchAssociatedAssets(params);
    } else if (FacilityType.NonFacilityLoan === this.facilityType) {
      this.associatedAsetscolumnDefs = facilityColumnDefs;
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: this.loanData.contractId,
      };
      this.fetchAssociatedAssets(params);
    }
  }
  async fetchLoansPaymentsTab(params: transactionParams) {
    try {
      this.loanPaymentDataList = await this.commonApiService.getPaymentsTabData(
        params
      );
      if (this.loanPaymentDataList) {
        this.paymentNotYetAllocated = calculatePaymentNotYetAllocated(
          this.loanPaymentDataList
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

  getLoanStatement() {
    if (FacilityType.Assetlink === this.facilityType) {
      this.loanPaymentColumnDefs = loansPaymentColumnDefs;
      this.transactionsColumnDef = loanTransactionsColumnDef;
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: this.loanData.contractId,
      };
      this.fetchLoansPaymentsTab(params);
      this.fetchLoansTransactionsTab(params);
    } else if (FacilityType.Easylink === this.facilityType) {
      this.loanPaymentColumnDefs = loansPaymentColumnDefs;
      this.transactionsColumnDef = loanTransactionsColumnDef;
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: this.loanData.contractId,
      };
      this.fetchLoansPaymentsTab(params);
      this.fetchLoansTransactionsTab(params);
    } else if (FacilityType.NonFacilityLoan === this.facilityType) {
      this.loanPaymentColumnDefs = loansPaymentColumnDefs;
      this.transactionsColumnDef = loanTransactionsColumnDef;
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: this.loanData.contractId,
      };
      this.fetchLoansPaymentsTab(params);
      this.fetchLoansTransactionsTab(params);
    }
  }

  getDocuments() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    if (FacilityType.Assetlink === this.facilityType) {
      this.documentsColumnDefs = documentsColumnDefs;
      this.fetchDocuments(params);
    } else if (FacilityType.Easylink === this.facilityType) {
      this.documentsColumnDefs = documentsColumnDefs;
      this.fetchDocuments(params);
    } else if (FacilityType.NonFacilityLoan === this.facilityType) {
      this.documentsColumnDefs = documentsColumnDefs;
      this.fetchDocuments(params);
    }
  }

  async fetchPiSchedule(params) {
    try {
      this.piScheduleDataList = await this.commonApiService.getPiScheduleData(
        params
      );
    } catch (error) {
      console.log('Error while loading pi-schedule data', error);
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
  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
      downloadDoc(document.file, document.fileName);
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }

  onDocumentClick(event) {
    handleDocumentAction(event, this.dialogService, this.toasterService);
  }

  getEasyLinkData() {
    //this.loanData = this.easylinkSetterGetterSvc.getLoanData().loan;
    if (!this.loanData) {
      // If no data found, navigate back
      this.router.navigate(['easylink']);
    }
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.toDate = formatDate(new Date());
    this.paymentSummaryColumnDefs = paymentSummaryColumnDefs;
    this.interestRateColumnDefs = interestRateColumnDefs;
    this.fetchCurrentPosition(params);
    this.fetchPaymentSummary(params);
    this.fetchLoanParties(params);
    this.fetchInterestRate(params);
  }

  getAssetLinkData() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.toDate = formatDate(new Date());
    this.paymentSummaryColumnDefs = paymentSummaryColumnDefs;
    this.interestRateColumnDefs = interestRateColumnDefs;
    this.fetchCurrentPosition(params);
    this.fetchPaymentSummary(params);
    this.fetchLoanParties(params);
    this.fetchInterestRate(params);
  }

  showPaymentSummaryTab() {
    this.currentComponent = 'PaymentSummary';
  }

  showPiScheduleTab() {
    this.currentComponent = 'PiSchedule';
    this.getPiSchedule();
  }

  showLoanStatementTab() {
    this.currentComponent = 'TransactionFlow';
    this.getLoanStatement();
  }

  showAssociatedAssetsTab() {
    this.currentComponent = 'AssociatedAssets';
    this.getAssociatedAssets();
  }

  showDocumentsTab() {
    this.currentComponent = 'Documents';
    this.getDocuments();
  }

  navigateToFacility() {
    if (this.facilityType === FacilityType.NonFacilityLoan) {
      this.router.navigate(['non-facility-loan']);
    } else if (this.facilityType === 'AssetLink') {
      this.router.navigate(['assetlink']);
    } else if (this.facilityType === 'EasyLink') {
      this.router.navigate(['easylink']);
    }
  }

  navigateToLoansDashboard() {
    this.commonSetterGetterSvc.navigateToLoan = true;
    sessionStorage.setItem('navigateToLoan', JSON.stringify(true));
    const routeMap: { [key: string]: string } = {
      CreditLines: 'creditlines',
      AssetLink: 'assetlink',
      EasyLink: 'easylink',
      'Non-Facility Loan': 'non-facility-loan',
    };

    const route = routeMap[this.facilityType];

    if (route) {
      this.router.navigate([`${route}`]);
    } else {
      console.warn('Invalid facility type:', this.facilityType);
    }
  }

  onDocUploadClick(event) {
    this.uploadDocs({ contractId: this.loanData.contractId }, event);
  }

  async uploadDocs(params: UploadDocsParams, documentBody) {
    try {
      await this.commonApiService.postDocuments(params, documentBody);
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }
}
