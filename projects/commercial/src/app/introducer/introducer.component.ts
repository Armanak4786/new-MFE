import { Component, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
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
  clearSession,
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
  introducerPaymentColDef,
  introducerTransactionColDef,
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
  styleUrl: './introducer.component.scss',
})
export class IntroducerComponent implements OnDestroy {
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
  transactionsColumnDef = introducerTransactionColDef
  paymentColumnDefs = introducerPaymentColDef;

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
    clearSession([
      'assetlinkDataList',
      'easylinkDataList',
      'creditlineDataList',
      'bailmentDataList',
      'fixedFloorPlanDetails',
      'floatingFloorPlanDetails',
      'buybackDataList',
      'selectedEasylinkSubFacility',
      'selectedAssetlinkSubFacility',
      'selectedBailmentSubFacility',
      'selectedFixedFloorSubFacility',
      'selectedFloatingFloorSubFacility',
      'selectedBuybackSubFacility',
      'forecastToDate',
      'forecastFromDate',
      'forecastFrequency',
    ]);
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

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionIntroducer = sessionStorage.getItem('introducerDataList');
    const optionsData = sessionStorage.getItem('optionDataFacilities');

    if (sessionIntroducer) {
      this.introducerFacilityDataList = JSON.parse(sessionIntroducer);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      this.introducerFacilityDataList = financialData?.introducerTransactionDetails ?? [];

      sessionStorage.setItem(
        'introducerDataList',
        JSON.stringify(this.introducerFacilityDataList)
      );
    }

    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown =
        optionDataFacilities['IntroducerTransactionSummary'];
    }

    this.afterIntroducerLoad();
  }

  afterIntroducerLoad() {
    const validTabs = ['TransactionSummary','Documents'];
    const storedComponent = sessionStorage.getItem('facilityCurrentComponent');

    if (storedComponent && validTabs.includes(storedComponent)) {
      this.currentComponent = storedComponent;
      sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
    } else {
      this.currentComponent = 'TransactionSummary';
      sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
    }

    sessionStorage.setItem('currentFacilityType', FacilityType.IntroducerTransactionSummary);

    const storedSubFacility = sessionStorage.getItem('selectedIntroducerSubFacility');
    const selectedSessionSubFacility = storedSubFacility ? JSON.parse(storedSubFacility) : null;

    if (selectedSessionSubFacility) {
      this.selectedSubFacility = selectedSessionSubFacility;
    } else {
      this.selectedSubFacility = this.introducerFacilityDataList[0];
      sessionStorage.setItem(
        'selectedIntroducerSubFacility',
        JSON.stringify(this.selectedSubFacility)
      );
    }

    if (this.currentComponent === 'TransactionSummary') {
      this.showTransactionSummaryTab();
    } else if (this.currentComponent === 'Documents') {
      this.showDocumentsTab();
    }

    this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
      if (list?.length) {
        this.facilityDataList = list;

        this.optionData = this.facilityDataList.map((item) => ({
          label: FacilityTypeDropdown[item.value],
          value:
            optionDataFacilities[item.label as keyof typeof optionDataFacilities],
        }));

        sessionStorage.setItem(
          'optionDataFacilities',
          JSON.stringify(this.optionData)
        );

        this.facilityTypeDropdown =
          optionDataFacilities['IntroducerTransactionSummary'];
      }
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
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchPaymentsTab(transactionFlowParams);
    this.currentComponent = 'TransactionSummary';
    this.componentLoaderService.loadComponent('TransactionFlow');
    this.tableId = 'TransactionFlow';
    sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
  }

  async fetchPaymentsTab(params) {
    try {
      const result = await this.commonApiService.getIntroducerPaymentTransaction(params.partyId)
      this.paymentDataList = result?.paymentExtract
      this.transactionsDataList = result?.transExtract

      sessionStorage.setItem("transactions",JSON.stringify(this.transactionsDataList))
      if (this.paymentDataList) {
        this.paymentNotYetAllocated = calculatePaymentNotYetAllocated(
          this.paymentDataList
        );
      }
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  // async fetchTransactionsTab(params) {
  //   try {
  //     this.transactionsDataList =
  //       await this.commonApiService.getTransactionsTabData(params);
  //     if (this.transactionsDataList) {
  //       this.overDue = this.calculateTotalOutstandingAmount(
  //         this.transactionsDataList
  //       );
  //     }
  //   } catch (error) {
  //     console.log('Error while loading payment forcast data', error);
  //   }
  // }

  calculateTotalOutstandingAmount(transactionsDataList: any): any {
    throw new Error('Method not implemented.');
  }

  showDocumentsTab() {
    const params = { partyId: this.partyId };
    this.fetchDocuments(params);
    this.currentComponent = 'Documents';
    this.componentLoaderService.loadComponent('Documents');
    sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
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
      this.router.navigate([`${facilityRoute}`]);
    }
  }

  ngOnDestroy() {
    clearSession('transactions');
    clearSession('currentComponent');
    clearSession('facilityCurrentComponent');
    clearSession('introducerDataList');
    clearSession('selectedIntroducerSubFacility');
    clearSession('currentFacilityType');
  }
}
