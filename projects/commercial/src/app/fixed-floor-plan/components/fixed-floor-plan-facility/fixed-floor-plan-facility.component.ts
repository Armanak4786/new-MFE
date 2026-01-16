import { Component, Input, ViewChild } from '@angular/core';
import {
  base64ToBlob,
  clearUploadedDocuments,
  downloadBase64File,
  getMimeTypeFromName,
} from '../../../utils/common-utils';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import {
  AssetsParams,
  DocumentByIdParams,
  DocumentsParams,
  FacilitySummaryParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonService, ToasterService } from 'auro-ui';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { CommonApiService } from '../../../services/common-api.service';
import { FixedFloorPlanComponentLoaderService } from '../../services/fixed-floor-plan-component-loader.service';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';

@Component({
  selector: 'app-fixed-floor-plan-facility',
  //standalone: true,
  //imports: [],
  templateUrl: './fixed-floor-plan-facility.component.html',
  styleUrls: ['./fixed-floor-plan-facility.component.scss'],
})
export class FixedFloorPlanFacilityComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @Input() facilityType;
  partyId: number;
  @Input() subFacilityNameList;
  currentComponent: string | null = null;
  documentsColumnDefs;
  facilityAssetsColDef;
  @Input() selectedSubFacility;
  @Input() bailmentFacilityDataList;
  bailmentsDataList;
  facilityAsssetsDatalist;
  facilitySummaryDatalist;
  todaysActivityColDef;
  assetSummaryColDef;
  documentsDataList;

  constructor(
    public svc: CommonService,
    private componentLoaderService: FixedFloorPlanComponentLoaderService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public router: Router,
    public toasterService: ToasterService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.currentComponent = 'FacilitySummary';
    // this.componentLoaderService.fixedFloorDashboardComponent$.subscribe(
    //   (componentName) => {
    //     this.currentComponent = componentName;
    //   }
    // );
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.showFacilitySummary();
  }
  productTransferRequest() {
    // this.svc.dialogSvc
    //   .show(ProductTransferRequestComponent, 'Product Transfer', {
    //     templates: {
    //       footer: null,
    //     },
    //     data: {
    //       facilityType: this.facilityType,
    //       selectedSubFacility: this.selectedSubFacility,
    //       bailmentFacilityDataList: this.bailmentFacilityDataList,
    //     },
    //     width: '78vw',
    //     height: '40vw',
    //   })
    //   .onClose.subscribe((data: any) => {});
  }
  showDialogAddAsset() {}

  purchaseAssetRequest() {
    // this.svc.dialogSvc
    //   .show(PurchaseAssetRequestComponent, 'Purchase Asset', {
    //     templates: {
    //       footer: null,
    //     },
    //     data: {
    //       facilityType: this.facilityType,
    //       selectedSubFacility: this.selectedSubFacility,
    //       bailmentFacilityDataList: this.bailmentFacilityDataList,
    //     },
    //     width: '60vw',
    //     height: '30vw',
    //   })
    //   .onClose.subscribe((data: any) => {});
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
    this.componentLoaderService.loadFixedFloorDashboard('FacilitySummary');
  }

  showLoans() {}
  async showFacilityAssets() {
    // this.currentComponent = "FacilityAssets"
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.bailmentFacilityDataList.facilityName,
    };
    try {
      this.facilityAsssetsDatalist = await this.commonApiService.getAssetsData(
        params
      );
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
    this.componentLoaderService.loadFixedFloorDashboard('FacilityAssets');
  }

  showDialogReleaseSecurity() {}
  requestSecurity() {}
  showDocuments() {
    const params = { partyId: this.partyId };
    this.fetchDocuments(params);
    this.componentLoaderService.loadFixedFloorDashboard('Documents');
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
  export() {}
  onPrint() {}

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
