import { Component, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  CommonService,
  CurrencyService,
  PrintService,
  ToasterService,
} from 'auro-ui';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { IntroducerComponentLoaderService } from './services/introducer-component-loader.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { take } from 'rxjs';
import {
  base64ToBlob,
  calculatePaymentNotYetAllocated,
  clearUploadedDocuments,
  downloadBase64File,
  filterByFacilityType,
  getMimeTypeFromName,
  transformHistoryData,
  updateDataList,
} from '../utils/common-utils';
import {
  introducerColumnDefs,
  introducerDocumentsColumnDefs,
} from './utils/introducer-header.utils';
import { CommonApiService } from '../services/common-api.service';
import {
  DocumentByIdParams,
  DocumentsParams,
  RequestHistoryParams,
  UploadDocsParams,
} from '../utils/common-interface';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IntroducerPaymentRequestComponent } from './introducer-payment-request/introducer-payment-request.component';

@Component({
  selector: 'app-introducer',
  //standalone: true,
  //imports: [],
  templateUrl: './introducer.component.html',
  styleUrls: ['./introducer.component.scss'],
})
export class IntroducerComponent {
  platformId = inject(PLATFORM_ID);
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  currentComponent: string | null = null;
  // optionData = optionDataFacilities;
  optionData;
  introducerFacilityDataList;
  introducerColumnDefs = introducerColumnDefs;
  facilityType: string = FacilityType.IntroducerTransactionSummary;
  partyId: any;
  selectedSubFacility: any;
  paymentDataList: any;
  tableId: string;
  paymentNotYetAllocated: number;
  transactionsDataList: any;
  overDue: any;
  documentsDataList: any;
  documentsColumnDefs = introducerDocumentsColumnDefs;
  facilityDataList;
  facilityTypeDropdown;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  accessGranted;

  constructor(
    public svc: CommonService,
    private currencyService: CurrencyService,
    public commonSvc: CommonService,
    public router: Router,
    public printSer: PrintService,
    public commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public toasterService: ToasterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public dialogService: DialogService,
    public componentLoaderService: IntroducerComponentLoaderService
  ) {}

  ngOnInit() {
    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (
      roleBased &&
      roleBased.functions &&
      typeof roleBased.functions === 'object'
    ) {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim()
      );
    } else {
      this.accessGranted = [];
    }
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.currentComponent = 'TransactionSummary';
    this.commonSetterGetterSvc.financial.subscribe((data) => {
      this.introducerFacilityDataList =
        data?.introducerTransactionDetails ?? [];

      if (!this.introducerFacilityDataList.length) {
        this.dashboardSetterGetterSvc.financialList$
          .pipe(take(1))
          .subscribe((list) => {
            const details = list?.introducerTransactionDetails ?? [];
            this.introducerFacilityDataList = updateDataList(
              details,
              FacilityType.IntroducerTransactionSummary
            );
          });
      }
    });
    this.selectedSubFacility = this.introducerFacilityDataList[0];
    const transactionFlowParams = {
      partyId: this.partyId,
      //facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility?.id,
    };
    //this.fetchPaymentsTab(transactionFlowParams);
    // this.fetchTransactionsTab(transactionFlowParams);
    this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
      this.facilityDataList = list;

      this.optionData = this.facilityDataList.map((item) => ({
        label: FacilityTypeDropdown[item.value],
        value:
          optionDataFacilities[item.label as keyof typeof optionDataFacilities],
      }));

      this.facilityTypeDropdown =
        optionDataFacilities['IntroducerTransactionSummary'];
    });
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  requestHistory() {
    this.currentComponent = 'requestHistory';
  }

  showPaymentRequest() {
    this.svc.dialogSvc
      .show(IntroducerPaymentRequestComponent, 'Payment Request', {
        templates: {
          footer: null,
        },
        data: {
          introducerFacilityDataList: this.introducerFacilityDataList,
        },
        width: '30vw',
        height: '35vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  showTransactionSummaryTab() {
    const transactionFlowParams = {
      partyId: this.partyId,
      //facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchPaymentsTab(transactionFlowParams);
    this.fetchTransactionsTab(transactionFlowParams);
    this.currentComponent = 'TransactionSummary';
    this.componentLoaderService.loadComponent('TransactionFlow');
    this.tableId = 'TransactionFlow';
  }

  async fetchPaymentsTab(params) {
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
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchTransactionsTab(params) {
    try {
      this.transactionsDataList =
        await this.commonApiService.getTransactionsTabData(params);
      if (this.transactionsDataList) {
        this.overDue = this.calculateTotalOutstandingAmount(
          this.transactionsDataList
        );
      }
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  calculateTotalOutstandingAmount(transactionsDataList: any): any {
    throw new Error('Method not implemented.');
  }

  showDocumentsTab() {
    const params = { partyId: this.partyId };
    this.fetchDocuments(params);
    this.currentComponent = 'Documents';
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

  async onDocumentClick(event) {
    if (event.actionName == 'download') {
      const params = {
        partyId: this.partyId,
        documentId: event.rowData.documentId,
        // contractId: this.contractId
      };
      const document = await this.fetchDocumentById(params);
      downloadBase64File(document);
    } else if (event.actionName == 'previewDoc') {
      const params = {
        partyId: this.partyId,
        documentId: event.rowData.documentId,
        // contractId: this.contractId
      };
      const document = await this.fetchDocumentById(params);
      if (!document?.fileContents) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'Document Not Available for Preview',
        });
        return;
      }
      const base64Data = document.fileContents;
      const contentType = getMimeTypeFromName(document.fileDownloadName);
      const previewableTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'images/gif',
      ];

      if (!previewableTypes.includes(contentType)) {
        this.toasterService.showToaster({
          severity: 'error',
          detail: 'Preview not supported for this file type.',
        });
        return;
      }
      const blob = base64ToBlob(base64Data, contentType);
      const url = URL.createObjectURL(blob);

      const ref = this.dialogService.open(DocumentViewComponent, {
        data: {
          displayDoc: url,
          displayDocType: contentType,
        },
        header: 'Document Preview',
        width: '80%',
        height: '80%',
        contentStyle: { overflow: 'auto' }, // Let content determine size
      });
    }
  }

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
      // downloadBase64File(document);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }

  onDocUploadClick(event) {
    this.uploadDocs({ partyId: this.partyId }, event);
  }

  async uploadDocs(params: UploadDocsParams, documentBody) {
    try {
      await this.commonApiService.postDocuments(params, documentBody);
      clearUploadedDocuments(this.documentsComponent.uploadedDocuments);
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Document Uploaded Successfully',
      });
      await this.fetchDocuments({ partyId: this.partyId });
    } catch (error) {
      console.log('Error while loading uploading docs', error);
    }
  }

  onFacilityChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }
}
