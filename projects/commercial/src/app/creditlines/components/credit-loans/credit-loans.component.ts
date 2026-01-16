import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService, CurrencyService, ToasterService } from 'auro-ui';
import { map } from 'rxjs';
import {
  associatedAssetsColumnDefs,
  documentActions,
  documentsColumnDefs,
  interestRateColumnDefs,
  leasePartiesColumnDef,
  paymentSummaryColumnDefs,
  piScheduleColumnDefs,
} from '../../utils/creditline-header-definition';
import {
  IDocuments,
  IFacilityAssetResponse,
  InterestRateData,
  LeasePartiesData,
  PaymentStatements,
} from '../../interface/creditline.interface';
import {
  calculatePaymentNotYetAllocated,
  calculateTotalOutstandingAmount,
  formatDate,
  clearUploadedDocuments,
  handleDocumentAction,
} from '../../../utils/common-utils';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { FacilityType } from '../../../utils/common-enum';
import {
  AssetsParams,
  CurrentPositionParams,
  InterestRateParams,
  LoanPartiesParams,
  PaymentSummaryParams,
  transactionParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { CreditlineSetterGetterService } from '../../services/creditline-setter-getter.service';
import {
  loansPaymentColumnDefs,
  loanTransactionsColumnDef,
} from '../../../utils/common-header-definition';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-credit-loans',
  //standalone: true,
  //imports: [],
  templateUrl: './credit-loans.component.html',
  styleUrls: ['./credit-loans.component.scss'],
})
export class CreditLoansComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  currentComponent = 'PaymentSummary';
  facilityType: string;
  @Output() navigateBack = new EventEmitter<any>();
  toDate: string;
  associatedAssetsDataList;
  associatedAsetscolumnDefs: any[];
  assetsDatalist: IFacilityAssetResponse[] = [];
  paymentSummaryDataList;
  paymentSummaryColumnDefs = paymentSummaryColumnDefs;
  interestRateColumnDefs = interestRateColumnDefs;
  piScheduleDataList;
  piScheduleColumnDefs = piScheduleColumnDefs;
  assetsColumnDef = associatedAssetsColumnDefs;
  loanPartiesData: LeasePartiesData[] = [];
  documentsDataList: IDocuments[] = [];
  documentsColumnDefs = documentsColumnDefs;
  documentActions = documentActions;
  loanPartiesColumnDef = leasePartiesColumnDef;
  interesRateData: InterestRateData[] = [];

  transactionDataList;
  paymentColumnDefs;
  paymentDataList: PaymentStatements[] = [];
  loanData;
  currentPosition;
  partyId: number;
  facilityAsssetsDatalist;
  transactionsColumnDef;
  paymentNotYetAllocated: any;
  overDue: any;
  selectedFacility;
  leaseId: number;
  allProducts: number;
  idParam: any;

  constructor(
    public svc: CommonService,
    public router: Router,
    private currencyService: CurrencyService,
    private dashSvc: DashboardService,
    private commonApiService: CommonApiService,
    public creditSetterGetter: CreditlineSetterGetterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private route: ActivatedRoute,
    public toasterService: ToasterService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    //this.currencyService.initializeCurrency();
    this.toDate = formatDate(new Date());
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    if (!this.partyId) {
      this.router.navigate(['commercial/creditlines']);
    }
    this.idParam = this.route.snapshot.paramMap.get('id');
    const param = { partyId: this.partyId, contractId: this.idParam };
    this.fetchLoans(param);
  }

  checkFacilityAndFetch() {
    // this.loanData = this.creditSetterGetter.getLoansData()?.loan;
    // if (!this.loanData) {
    //   // If no data found, navigate back
    //   this.router.navigate(['commercial/creditlines']);
    // }
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.facilityType = this.dashSvc.getFacilityTpe();
    const params = {
      partyId: this.partyId,
      contractId: this.loanData?.contractId,
      leaseId: this.leaseId,
    };
    if (FacilityType.CreditLines === this.facilityType) {
      this.fetchCurrentPosition(params);
      this.fetchPaymentSummary(params);
      this.fetchLoanParties(params);
      this.fetchInterestRate(params);
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

  async fetchDocuments(params) {
    try {
      this.documentsDataList = await this.commonApiService.getDocumentsData(
        params
      );
    } catch (error) {
      console.log('Error while loading documents data', error);
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
      console.log('Error while loading facility data', error);
    }
  }

  async fetchAssociatedAssets(params: AssetsParams) {
    try {
      this.assetsDatalist = await this.commonApiService.getAssetsData(params);
    } catch (error) {
      console.log('Error while loading facility data', error);
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

  onDocumentClick(event) {
    handleDocumentAction(event, this.dialogService, this.toasterService);
  }

  getDownloadDocById(docId) {
    this.svc.data
      .get(`document`)
      .pipe(
        map((res) => {
          return res; // You can transform the response here if needed
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data, 'document download API call');
        },
        error: (err) => {
          console.error('Error fetching document data', err); // Handle error
        },
      });
  }

  navigateToCreditline() {
    this.router.navigate(['commercial/creditlines']);
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
      this.router.navigate([`commercial/${route}`]);
    } else {
      console.warn('Invalid facility type:', this.facilityType);
    }
  }

  showPaymentSummaryTab() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
      leaseId: this.leaseId,
    };
    this.fetchPaymentSummary(params);
    this.currentComponent = 'PaymentSummary';
  }

  showPiScheduleTab() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchPiSchedule(params);
    this.currentComponent = 'PiSchedule';
  }

  showLoanStatementTab() {
    this.transactionsColumnDef = loanTransactionsColumnDef;
    this.paymentColumnDefs = loansPaymentColumnDefs;
    const subFacilityId =
      this.creditSetterGetter.getLoansData()?.loansData?.currentFacility?.id;
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
      subFacilityId: subFacilityId,
    };
    this.fetchPaymentsTab(params);
    this.fetchTransactionsTab(params);
    this.currentComponent = 'TransactionFlow';
  }

  showAssociatedAssetsTab() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchAssociatedAssets(params);
    this.currentComponent = 'AssociatedAssets';
  }

  showDocumentsTab() {
    const params = {
      partyId: this.partyId,
      contractId: this.loanData.contractId,
    };
    this.fetchDocuments(params);
    this.currentComponent = 'Documents';
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
      this.showDocumentsTab();
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }
}
