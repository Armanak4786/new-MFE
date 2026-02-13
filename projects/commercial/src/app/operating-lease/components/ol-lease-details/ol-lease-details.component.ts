import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, CurrencyService, ToasterService } from 'auro-ui';
import { map } from 'rxjs';
import {
  assetsColumnDefs,
  leasePaymentColumnDefs,
  leaseTransactionColumnDefs,
  rentalScheduleColumnDefs,
  rentalSummaryColumnDefs,
} from '../../utils/operatingLease-header-definition';
import {
  IDocuments,
  IFacilityAssetResponse,
  InterestRateData,
  LeasePartiesData,
  PaymentStatements,
} from '../../operating-lease-interface/operatingLease-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import {
  CurrentPositionParams,
  DocumentByIdParams,
  DocumentsParams,
  InterestRateParams,
  LoanPartiesParams,
  transactionParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { OlSetterGetterService } from '../../services/ol-setter-getter.service';
import {
  calculatePaymentNotYetAllocated,
  clearUploadedDocuments,
  downloadDoc,
  handleDocumentAction,
} from '../../../utils/common-utils';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { ComponentLoaderService } from '../../../assetlink/services/component-loader.service';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { FacilityType } from '../../../utils/common-enum';
import { DialogService } from 'primeng/dynamicdialog';
import {
  documentActions,
  documentsColumnDefs,
  interestRateColumnDefs,
  leasePartiesColumnDef,
} from '../../../creditlines/utils/creditline-header-definition';

@Component({
  selector: 'app-ol-lease-details',
  //standalone: true,
  //imports: [],
  templateUrl: './ol-lease-details.component.html',
  styleUrl: './ol-lease-details.component.scss',
})
export class OlLeaseDetailsComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  rentalFlag: Boolean = false;
  currentComponent = 'RentalSummary';
  leaseData;
  leasePartiesData: LeasePartiesData[] = [];
  interesRateData: InterestRateData[] = [];
  documentsDataList: IDocuments[] = [];
  paymentDataList: PaymentStatements[] = [];
  interestRateColumnDefs = interestRateColumnDefs;
  rentalSummaryColumnDefs = rentalSummaryColumnDefs;
  rentalSummaryDataList;
  transactionDataList;
  rentalScheduleDataList;
  transactionsColumnDef = leaseTransactionColumnDefs;
  documentsColumnDefs = documentsColumnDefs;
  documentActions = documentActions;
  paymentColumnDefs = leasePaymentColumnDefs;
  rentalScheduleColumnDefs = rentalScheduleColumnDefs;
  currentPosition;
  assetsColumnDef = assetsColumnDefs;
  leasePartiesColumnDef = leasePartiesColumnDef;
  assetsDatalist: IFacilityAssetResponse[] = [];
  partyId: number;
  facilityType: string;
  overDue: any;
  paymentNotYetAllocated: any;
  leaseId: number;

  constructor(
    public olSetterGetterService: OlSetterGetterService,
    private router: Router,
    public svc: CommonService,
    private currencyService: CurrencyService,
    private commonApiService: CommonApiService,
    private dashSvc: DashboardService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private componentLoaderService: ComponentLoaderService,
    public toasterService: ToasterService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    //this.currencyService.initializeCurrency();
    this.leaseData = this.olSetterGetterService.getLeaseData();
    if (!this.leaseData) {
      // If no data found, navigate back
      this.router.navigate(['commercial/operating-lease']);
    } else {
      this.facilityType = this.dashSvc.getFacilityTpe();
      //this.partyId = JSON.parse(sessionStorage.getItem('currentParty'));
      this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
        this.partyId = currentParty?.id;
      });

      this.rentalFlag = true;

      this.showRentalSummaryAndScheduleData();
      this.currentComponent = 'RentalSummary';
      const params = {
        partyId: this.partyId,
        contractId: this.leaseData?.leaseId,
      };
      this.fetchCurrentPosition(params);
      this.fetchLeaseParties(params);
      this.fetchInterestRate(params);
      // this.getRentalSummaryData();
    }
  }

  // getDocumentsData() {
  //   this.svc.data
  //     .get(`documents`)
  //     .pipe(
  //       map((res) => {
  //         res.data.documentDetails.forEach((doc) => {
  //           doc.actions = this.documentActions;
  //         });
  //         return res;
  //       })
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.documentsDataList = data.data.documentDetails; // Store the response data
  //         console.log(this.documentsDataList, 'second API call');
  //       },
  //       error: (err) => {
  //         console.error('Error fetching documents data', err); // Handle error
  //       },
  //     });
  // }

  // getRentalScheduleData() {
  //   this.svc.data
  //     .get(`PaymentCommercial/rental_schedule`)
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.rentalScheduleDataList = data.data.schedules; // Store the response data
  //       },
  //       error: (err) => {
  //         console.error('Error fetching lease Schedule data', err); // Handle error
  //       },
  //     });
  // }

  async fetchCurrentPosition(params: CurrentPositionParams) {
    try {
      this.currentPosition = await this.commonApiService.getCurrentPositionData(
        params
      );
    } catch (error) {
      console.log('Error while loading current position data', error);
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

  async fetchInterestRate(params: InterestRateParams) {
    try {
      this.interesRateData = await this.commonApiService.getInterestRateData(
        params
      );
    } catch (error) {
      console.log('Error while loading Interest data', error);
    }
  }

  async fetchFacilityAssets(params) {
    try {
      this.assetsDatalist = await this.commonApiService.getAssetsData(params);
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
    } catch (error) {
      console.log('Error while loading transaction data', error);
    }
  }

  showDocumentsTab() {
    this.currentComponent = 'Documents';
    this.getDocuments();
  }

  getDocuments() {
    const params = {
      contractId: this.leaseData.leaseId,
    };
    this.documentsColumnDefs = documentsColumnDefs;
    this.fetchDocuments(params);
  }
  showAssetsTab() {
    this.currentComponent = 'Assets';
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData?.leaseId,
    };
    this.fetchFacilityAssets(params);
    //this.getFacilityAssetsData(this.leaseData.contractId);
  }

  showRentalScheduleTab() {
    this.currentComponent = 'RentalSchedule';
    this.rentalFlag = false;
    this.showRentalSummaryAndScheduleData();
  }

  showRentalSummaryAndScheduleData() {
    if (this.rentalFlag) {
      this.currentComponent = 'RentalSummary';
    } else {
      this.currentComponent = 'RentalSchedule';
    }

    const params = {
      partyId: Number(this.partyId),
      leaseId: Number(this.leaseData?.leaseId),
      Flag: this.rentalFlag,
    };

    this.commonApiService
      .getLeaseScheduleData(params)
      .then((data) => {
        if (this.rentalFlag) {
          this.rentalSummaryDataList = data.rentalSummary;
        } else {
          this.rentalScheduleDataList = data.schedules;
        }
      })
      .catch((err) => {
        console.error('Error fetching summary data:', err);
      });
  }

  navigateToOperatingLease() {
    this.olSetterGetterService.navigateToLease = false;
    this.router.navigate(['commercial/operating-lease']);
  }

  navigateToLoansDashboard() {
    this.olSetterGetterService.navigateToLease = true;
    this.router.navigate([`commercial/operating-lease`]);
  }

  // onDocumentClick(event) {
  //   if (event.action == 'download') {
  //     //this.downloadDoc(event.index); event.rowData.id
  //     this.getDownloadDocById(event.rowData.id);
  //   } else if (event.action == 'view') {
  //     const doc = this.documentsDataList[event.index];
  //   }
  // }

  // getRentalSummaryData() {
  //    this.svc.data
  //     .get(`PaymentCommercial/rental_summary`)
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.rentalSummaryDataList = data.data.rentalSummary; // Store the response data
  //       },
  //       error: (err) => {
  //         console.error('Error fetching lease data', err); // Handle error
  //       },
  //     });
  // }

  onDocUploadClick(event) {
    this.uploadDocs({ contractId: this.leaseData.leaseId }, event);
  }

  async uploadDocs(params: UploadDocsParams, documentBody) {
    try {
      await this.commonApiService.postDocuments(params, documentBody);
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });
      await this.fetchDocuments({ contractId: this.leaseData.leaseId });
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }

  showDocuments() {
    const params = { contractId: this.leaseData.leaseId };

    this.fetchDocuments(params);
    this.componentLoaderService.loadComponent('Documents');
  }

  async fetchDocuments(params: DocumentsParams) {
    try {
      this.documentsDataList = await this.commonApiService.getDocumentsData(
        params
      );
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }

  showRentalSummaryTab() {
    this.currentComponent = 'RentalSummary';
    this.rentalFlag = true;
    this.showRentalSummaryAndScheduleData();
  }

  showLeaseStatementTab() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      contractId: this.leaseData.leaseId,
    };
    this.fetchPaymentsTab(params);
    this.fetchTransactionsTab(params);
    this.currentComponent = 'LeaseStatement';
  }
}
