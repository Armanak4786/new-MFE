import { Component, ViewChild } from '@angular/core';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { BailmentComponent } from '../../../dashboard/components/bailment/bailment.component';
import { CommonApiService } from '../../../services/common-api.service';
import { BailmentCurtailmentDetailsComponent } from '../../../bailments/components/bailment-curtailment-details/bailment-curtailment-details.component';
import { CommonService, PrintService, ToasterService } from 'auro-ui';
import { ComponentLoaderService } from '../../../assetlink/services/component-loader.service';
import { DocumentsComponent } from '../documents/documents.component';
import { assetlinkDocumentsColumnDefs } from '../../../assetlink/utils/assetlink-header.util';
import {
  DocumentByIdParams,
  DocumentsParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import {
  base64ToBlob,
  clearUploadedDocuments,
  downloadBase64File,
  getMimeTypeFromName,
} from '../../../utils/common-utils';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import {
  bailmentNotesColumnDefs,
  curtailmentPlanColumnDefs,
  subventionColumnDefs,
  transactionDetailsColumnDefs,
} from '../../../bailments/utils/bailment-header.utils';
import { BailmentComponentLoaderService } from '../../../bailments/services/bailment-component-loader.service';
import { BailmentSetterGetterService } from '../../../bailments/services/bailment-setter-getter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityType } from '../../../utils/common-enum';
import { notesActions } from '../../../utils/common-header-definition';

@Component({
  selector: 'app-asset-details',
  //standalone: true,
  //imports: [],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss',
})
export class AssetDetailsComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  documentsColumnDefs = assetlinkDocumentsColumnDefs;
  documentsDataList;
  bailmentData;
  partyName: any;
  partyId: number;
  assetDetailSummary: any;
  id: number;
  currentComponent: string | null = null;
  selectedAssetId: number;
  Id: number;
  ContractId: number;
  transactionDetailsColumnDefs = transactionDetailsColumnDefs;
  curtailmentPlanName: string = '';
  subventionColumnDefs = subventionColumnDefs;
  curtailmentPlanColumnDefs = curtailmentPlanColumnDefs;
  curtailmentPlans: any[] = [];
  curtailmentDetailsData: any[] = [];
  subventionData: any[] = [];
  bailmentNotesColumnDefs = bailmentNotesColumnDefs;
  transactionDetailsData: any[] = [];
  assetDetailsSummaryList;
  idParam;
  productTransferDisclaimerDataList: any[];
  partyDetail: any;
  receivedData: any;
  notesDataList: any;
  currentModule;

  constructor(
    public svc: CommonService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private commonApiService: CommonApiService,
    public componentloaderservice: BailmentComponentLoaderService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public bailmentSetterGetterService: BailmentSetterGetterService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.currentComponent = 'AssetDetails';
    this.componentloaderservice.bailmentDashboardComponent$.subscribe(
      (componentName) => {
        this.currentComponent = componentName;
      }
    );

    this.partyId = JSON.parse(sessionStorage.getItem('currentParty'))?.id;
    this.commonSetterGetterSvc.partyList$.subscribe((partyDetail) => {
      this.partyDetail = partyDetail;
    });
    this.idParam = this.route.snapshot.paramMap.get('id');

    this.commonSetterGetterSvc.currentComponent$.subscribe((component) => {
      this.currentModule = component;
    });
    this.showAssetDetails();
  }

  showAssetDetails() {
    this.currentComponent = 'AssetDetails';
    this.componentloaderservice.loadComponent('AssetDetailsComponent');
    const params = { id: this.idParam ? +this.idParam : null };
    this.fetchAssetDetailsSummary(params);
  }

  async fetchAssetDetailsSummary(params) {
    try {
      this.assetDetailsSummaryList = await this.commonApiService.getAssetDetail(
        params
      );
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  showCurtailmentDetails() {
    this.currentComponent = 'CurtailmentDetails';
    const params = {
      Id: this.idParam, //this.receivedData.partyId
    };
    this.getWholesaleAssetContractApi(params);
  }

  async getWholesaleAssetContractApi(params) {
    this.commonApiService.getCurtailmentDetails(params).then((data) => {
      this.curtailmentPlans = data;

      if (data && data.length > 0) {
        this.curtailmentPlanName = data[0].curtailmentPlan || '';
      }

      this.curtailmentDetailsData = data.flatMap(
        (plan) => plan.curtailmentDetails || []
      );
      this.subventionData = data.flatMap((plan) => plan.subvention || []);
    });
    this.componentloaderservice.loadComponent(
      'BailmentCurtailmentDetailsComponent'
    );
  }

  showTransactionHistory() {
    this.currentComponent = 'TransactionHistory';
    const params = {
      ContractId: this.idParam,
    };
    this.geTransactiontApi(params);
  }

  async geTransactiontApi(params) {
    try {
      this.transactionDetailsData =
        await this.commonApiService.getAssetTransactionDetails(params);
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
    this.componentloaderservice.loadComponent(
      'BailmentTransactionHistoryComponent'
    );
  }

  showDocuments() {
    this.currentComponent = 'Documents';
    const params = { partyId: this.partyId };
    //const params = { partyId: this.partyId };

    this.fetchDocuments(params);
    this.componentloaderservice.loadComponent('DocumentsComponent');
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

  showNotes() {
    this.currentComponent = 'Notes';
    const params = { ContractId: this.idParam, CSSNote: true };

    this.fetchNotes(params);
  }

  async fetchNotes(params) {
    try {
      const dataList = await this.commonApiService.getNotesDetails(params);

      this.notesDataList = dataList.map((doc) => ({
        ...doc,
        actions: [...notesActions],
        user: doc.user?.name || '',
      }));
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
    this.componentloaderservice.loadComponent('BailmentNotesComponent');
  }

  showDialogViewBailment() {
    //  this.svc.dialogSvc
    //       .show(BailmentComponent, 'Add Asset/s', {
    //         templates: {
    //           footer: null,
    //         },
    //         data: '',
    //         width: '70vw',
    //         // contentStyle: { overflow: 'auto' },
    //         // styleClass: 'dialogue-scroll',
    //         // position: 'center',
    //       })
    //       .onClose.subscribe((data: any) => {});
  }
  showDialogViewModule() {
    if (this.currentModule === FacilityType.Bailment_Group) {
      this.router.navigate([`bailment`]);
    } else if (this.currentModule === FacilityType.FixedFloorPlan) {
      this.router.navigate([`fixedfloorplan`]);
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
        contentStyle: { overflow: 'auto' },
      });
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
}
