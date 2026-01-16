import { Component, Input, input, ViewChild } from '@angular/core';
import { CommonService, PrintService, ToasterService } from 'auro-ui';
import { CommonApiService } from '../../../services/common-api.service';
import { BailmentComponentLoaderService } from '../../services/bailment-component-loader.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  AssetsParams,
  DocumentByIdParams,
  DocumentsParams,
  FacilitySummaryParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import {
  assetSummaryColDef,
  bailmentlinkDocumentsColumnDefs,
  facilityAssetsColumnDefs,
  todaysActivityColDef,
} from '../../utils/bailment-header.utils';
import { ProductTransferRequestComponent } from '../product-transfer-request/product-transfer-request.component';
import { Router } from '@angular/router';
import { PurchaseAssetRequestComponent } from '../purchase-asset-request/purchase-asset-request.component';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { DialogService } from 'primeng/dynamicdialog';
import { SwapRequestComponent } from '../swap-request/swap-request.component';
import {
  base64ToBlob,
  clearUploadedDocuments,
  downloadBase64File,
  getMimeTypeFromName,
} from '../../../utils/common-utils';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { SameDayPayoutComponent } from '../same-day-payout/same-day-payout.component';
@Component({
  selector: 'app-bailment-dashboard',
  templateUrl: './bailment-dashboard.component.html',
  styleUrls: ['./bailment-dashboard.component.scss'],
})
export class BailmentDashboardComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @ViewChild('facilitySummary') facilitySummary;
  @Input() facilityType;
  partyId: number;
  @Input() subFacilityNameList;
  currentComponent: string | null = null;
  documentsColumnDefs = bailmentlinkDocumentsColumnDefs;
  facilityAssetsColDef = facilityAssetsColumnDefs;
  @Input() selectedSubFacility;
  @Input() bailmentFacilityDataList;
  bailmentsDataList;
  facilityAsssetsDatalist;
  facilitySummaryDatalist;
  todaysActivityColDef = todaysActivityColDef;
  assetSummaryColDef = assetSummaryColDef;
  documentsDataList;

  constructor(
    public svc: CommonService,
    private componentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    private dashSvc: DashboardService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public router: Router,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public printSer: PrintService
  ) {}

  ngOnChanges(changes) {
    this.currentComponent = 'FacilitySummary';
    this.componentLoaderService.bailmentDashboardComponent$.subscribe(
      (componentName) => {
        this.currentComponent = componentName;
      }
    );
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });

    if (this.facilityType == 'Bailment') {
      this.showFacilitySummary();
    }
  }

  productTransferRequest() {
    this.svc.dialogSvc
      .show(ProductTransferRequestComponent, 'Product Transfer', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '78vw',
        height: '40vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  sameDayPayoutRequest() {
    this.svc.dialogSvc
      .show(SameDayPayoutComponent, 'same day payout', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '50vw',
        height: '30vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  showDialogAddAsset() {}

  purchaseAssetRequest() {
    this.svc.dialogSvc
      .show(PurchaseAssetRequestComponent, 'Purchase Asset', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '60vw',
        height: '30vw',
      })
      .onClose.subscribe((data: any) => {});
    this.showFacilityAssets();
  }
  swapRequest() {
    this.svc.dialogSvc
      .show(SwapRequestComponent, 'Swaps', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '58vw',
        height: '35vw',
      })
      .onClose.subscribe((data: any) => {});
  }
  showFacilitySummary() {
    this.currentComponent = 'FacilitySummary';
    const params: FacilitySummaryParams = {
      partyNo: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchFacilitySummaryData(params);
  }

  async fetchFacilitySummaryData(params) {
    try {
      this.facilitySummaryDatalist =
        await this.commonApiService.getFacilitySummary(params);
      console.log('this.facilitySummaryDatalist', this.facilitySummaryDatalist);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
    this.componentLoaderService.loadBailmentDashboard('FacilitySummary');
  }

  showLoans() {}
  showFacilityAssets() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.bailmentFacilityDataList.id,
    };
    this.commonApiService.getAssetsData(params).then((data) => {
      if (data) {
        this.facilityAsssetsDatalist = data;
      }
    });
    this.componentLoaderService.loadBailmentDashboard('FacilityAssets');
  }

  showDialogReleaseSecurity() {}
  requestSecurity() {}
  showDocuments() {
    const params = { partyId: this.partyId };
    this.fetchDocuments(params);
    this.componentLoaderService.loadBailmentDashboard('Documents');
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
  async fetchFacilityAssets(params: AssetsParams) {
    try {
      this.facilityAsssetsDatalist = await this.commonApiService.getAssetsData(
        params
      );
      this.facilityType = 'BailmentLink';
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  export() {
    let tableId1;
    let tableId2;
    const dt = this.facilitySummary;
    let columns1 = [];
    let data1 = [];
    let columns2 = [];
    let data2 = [];
    if (dt.assetSummaryColDef) {
      columns1 = dt.assetSummaryColDef || [];
      data1 = dt.facilitySummaryDatalist?.assetSummary || [];
      tableId1 = 'Asset summary';
    }
    if (dt.todaysActivityColDef) {
      columns2 = dt.todaysActivityColDef || [];
      data2 = dt.facilitySummaryDatalist?.todaysActivity || [];
      tableId2 = "Today's activity";
    }

    if (!tableId1 || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    if (columns1) {
      columns1 = columns1.filter((column) => column.headerName !== 'Action');
      this.printSer.export('xlsx', tableId1, columns1, data1);
    }
    if (columns2) {
      columns2 = columns2.filter((column) => column.headerName !== 'Action');
      this.printSer.export('xlsx', tableId2, columns2, data2);
    }
  }

  onPrint() {
    print();
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
}
