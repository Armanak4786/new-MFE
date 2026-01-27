import { Component, ViewChild } from '@angular/core';
import { FacilityType } from '../../../utils/common-enum';
import { Router } from '@angular/router';
import {
  CommonService,
  CurrencyService,
  GenTableComponent,
  PrintService,
  ToasterService,
} from 'auro-ui';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { BuybackSetterGetterService } from '../../services/buyback-setter-getter.service';
import {
  buybackFacilityDataColumnDefs,
  buybackLeaseScheduleColumnDefs,
  buybackRentalSummaryColumnDefs,
  byubackDocumentsColumnDefs,
  documentActions,
} from '../../utils/buyback-header.utils';
import { leasePartiesColumnDef } from '../../../creditlines/utils/creditline-header-definition';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AssetsParams,
  CurrentPositionParams,
  DocumentByIdParams,
  LeaseSummaryParams,
  LoanPartiesParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  base64ToBlob,
  buildSheetData,
  clearUploadedDocuments,
  downloadBase64File,
  getMimeTypeFromName,
} from '../../../utils/common-utils';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-buyback-lease',
  //standalone: true,
  //imports: [],
  templateUrl: './buyback-lease.component.html',
  styleUrl: './buyback-lease.component.scss',
})
export class BuybackLeaseComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @ViewChild('LeaseSummaryDt') LeaseSummaryDt;
  @ViewChild('LeaseScheduleDt') LeaseScheduleDt;
  currentComponent = 'LeaseSummary';
  leaseData;
  leasePartiesData = [];
  interesRateData = [];
  documentsDataList = [];
  paymentDataList = [];
  interestRateColumnDefs;
  transactionDataList;
  leaseScheduleDataList;
  buybackLeaseScheduleColumnDefs;
  documentActions = documentActions;
  leaseSummaryColumnDefs;
  leaseSummaryDataList;
  currentPosition;
  leasePartiesColumnDef;
  assetsDatalist = [];
  partyId: number;
  selectedFacility: any;
  facilityType: string;
  documentsColumnDefs;
  associatedAsetscolumnDefs;
  buybackRentalSummaryColumnDefs = buybackRentalSummaryColumnDefs;

  constructor(
    private router: Router,
    public svc: CommonService,
    private currencyService: CurrencyService,
    private dashSvc: DashboardService,
    private buybackSetterGetterSvc: BuybackSetterGetterService,
    public translateService: TranslateService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public printSer: PrintService
  ) {}

  ngOnInit() {
    this.currencyService.initializeCurrency();
    //this.partyId = JSON.parse(sessionStorage.getItem('currentParty'));
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    if (!this.partyId) {
      this.router.navigate(['buyback']);
      return;
    }
    this.facilityType = this.dashSvc.getFacilityTpe();
    this.loadDataByFacilityType();
  }

  loadDataByFacilityType() {
    if (this.facilityType === FacilityType.Buyback) {
      this.leaseData = this.buybackSetterGetterSvc.getLeaseData()?.lease;
      this.selectedFacility =
        this.buybackSetterGetterSvc.getLeaseData()?.currentFacility;
      this.getBuybackData();
    }
  }

  getBuybackData() {
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.leaseId,
    };
    this.leasePartiesColumnDef = leasePartiesColumnDef;
    this.fetchCurrentPosition(params);
    this.fetchLeaseParties(params);
    const summaryParams = {
      partyId: this.partyId,
      leaseId: this.leaseData.leaseId,
    };
    this.fetchLeaseSummaryData(summaryParams);
  }

  async fetchLeaseSummaryData(params: LeaseSummaryParams) {
    try {
      this.leaseSummaryDataList =
        await this.commonApiService.getLeaseSummaryData(params);
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

  async fetchDocuments(params) {
    try {
      this.documentsDataList = await this.commonApiService.getDocumentsData(
        params
      );
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }

  async fetchLeaseSchedule(params) {
    try {
      this.leaseScheduleDataList =
        await this.commonApiService.getLeaseScheduleData(params);
    } catch (error) {
      console.log('Error while loading lease schedule data', error);
    }
  }

  async fetchAssociatedAssets(params: AssetsParams) {
    try {
      this.assetsDatalist = await this.commonApiService.getAssetsData(params);
      console.log(
        this.assetsDatalist + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      );
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  showDocumentsTab() {
    const params = {
      // partyId: this.partyId,
      contractId: this.leaseData.leaseId,
    };
    this.fetchDocuments(params);
    this.currentComponent = 'Documents';
    this.documentsColumnDefs = byubackDocumentsColumnDefs;
  }

  showAssetsTab() {
    this.associatedAsetscolumnDefs = buybackFacilityDataColumnDefs;
    const params = {
      partyId: this.partyId,
      contractId: this.leaseData.leaseId,
    };
    this.fetchAssociatedAssets(params);
    this.currentComponent = 'Assets';
  }

  showLeaseScheduleTab() {
    this.buybackLeaseScheduleColumnDefs = buybackLeaseScheduleColumnDefs;
    const params = {
      partyId: this.partyId,
      leaseId: this.leaseData.leaseId,
      Flag: false,
    };
    this.fetchLeaseSchedule(params);
    this.currentComponent = 'LeaseSchedule';
  }

  navigateToBuyback() {
    this.router.navigate(['buyback']);
  }

  navigateToLoansDashboard() {
    //this.creditService.navigateToLoan = true;
    this.router.navigate([`buyback`]);
  }

  // onDocumentClick(event) {
  //   if (event.action == 'download') {
  //     //this.downloadDoc(event.index); event.rowData.id
  //     //this.getDownloadDocById(event.rowData.id);
  //   } else if (event.action == 'view') {
  //     const doc = this.documentsDataList[event.index];
  //   }
  // }

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
      // downloadBase64File(document);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }
  async onDocumentClick(event) {
    console.log('Event ondoc', event);
    if (event.actionName == 'download') {
      const params = {
        partyId: this.partyId,
        documentId: event.rowData.documentId,
        contractId: this.leaseData.leaseId,
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

  export() {
    let workbookData = [];
    let dt;
    if (this.currentComponent === 'LeaseSummary') {
      dt = this.LeaseSummaryDt;
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
      dt = this.LeaseScheduleDt;
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

    this.printSer.export('xlsx', this.currentComponent, workbookData);
  }

  // onDocUploadClick(event) {}
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

  showLeaseSummaryTab() {
    const summaryParams = {
      partyId: this.partyId,
      leaseId: this.leaseData.leaseId,
    };
    this.fetchLeaseSummaryData(summaryParams);
    this.currentComponent = 'LeaseSummary';
  }
}
