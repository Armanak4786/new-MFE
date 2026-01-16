import { Component, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  CommonService,
  CurrencyService,
  PrintService,
  ToasterService,
} from 'auro-ui';
import { take } from 'rxjs';
import {
  assetsColumnDefs,
  leaseColumnDefs,
  operatingLeasecolumnDefs,
  operatingLeaseDocumentsColumnDefs,
} from './utils/operatingLease-header-definition';
import { documentActions } from '../creditlines/utils/creditline-header-definition';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/services/dashboard.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { CommonApiService } from '../services/common-api.service';

import {
  base64ToBlob,
  buildSheetData,
  clearUploadedDocuments,
  downloadBase64File,
  getMimeTypeFromName,
  print,
} from '../utils/common-utils';
import { RentalForcastComponent } from './components/rental-forcast/rental-forcast.component';
import {
  DocumentByIdParams,
  DocumentsParams,
  LeaseParams,
  UploadDocsParams,
} from '../utils/common-interface';
import { OlSetterGetterService } from './services/ol-setter-getter.service';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ComponentLoaderService } from '../assetlink/services/component-loader.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-operating-lease',
  templateUrl: './operating-lease.component.html',
  styleUrls: ['./operating-lease.component.scss'],
})
export class OperatingLeaseComponent {
  optionData;
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  platformId = inject(PLATFORM_ID);
  currentComponent: string | null = null;
  leaseColumnDefs = leaseColumnDefs;
  documentsDataList;
  documentsColumnDefs = operatingLeaseDocumentsColumnDefs;
  leaseDataList;
  tableId;
  facilityAsssetsDatalist = [];
  operatingLeasecolumnDefs = operatingLeasecolumnDefs;
  operatingLeaseFacilityDataList = [];
  dashboardValue: any;
  columnsFacilityAsset = assetsColumnDefs;
  documentActions = documentActions;
  facilityType: string = FacilityType.OperatingLease;
  actionForLeaseList = [
    {
      icon: 'fa-solid fa-ellipsis',
    },
  ];
  @ViewChild('rentalForcast') rentalForcast: RentalForcastComponent;
  partyId: number;
  facilityDataList;
  facilityTypeDropdown;

  constructor(
    public svc: CommonService,
    public olSetterGetterService: OlSetterGetterService,
    public commonSvc: CommonService,
    public router: Router,
    private dashSvc: DashboardService,
    public printSer: PrintService,
    public commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public toasterService: ToasterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public dialogService: DialogService,
    public componentLoaderService: ComponentLoaderService,
    public translateService: TranslateService
  ) {}

  // ngOnInit() {
  //   this.tableId = 'rentalForcast';
  //   this.commonSetterGetterSvc.setDisableParty(false);
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.operatingLeaseFacilityDataList = data?.operatingLeaseDetails ?? [];

  //     if (!this.operatingLeaseFacilityDataList?.length) {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           this.operatingLeaseFacilityDataList =
  //             list?.operatingLeaseDetails ?? [];
  //         });
  //     }
  //   });

  //   if (!this.operatingLeaseFacilityDataList.length) {
  //     this.router.navigate(['commercial']);
  //     return;
  //   }

  //   this.dashSvc.setFacilityTpe(this.facilityType);
  //   // this.currencyService.initializeCurrency();
  //   this.currentComponent = this.olSetterGetterService.navigateToLease
  //     ? 'Leases'
  //     : 'RentalForcast';
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label:FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['OperatingLease'];
  //   });
  // }

  ngOnInit() {
    this.tableId = 'rentalForcast';
    this.commonSetterGetterSvc.setDisableParty(false);

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionFinancial = sessionStorage.getItem('financialSummaryData');
    const financialData = sessionFinancial
      ? JSON.parse(sessionFinancial)
      : null;

    this.operatingLeaseFacilityDataList =
      financialData?.operatingLeaseDetails ?? [];

    this.dashSvc.setFacilityTpe(this.facilityType);

    const navigateToLease = sessionStorage.getItem('navigateToLease');
    this.currentComponent = navigateToLease ? 'Leases' : 'RentalForcast';

    if (navigateToLease) {
      sessionStorage.removeItem('navigateToLease');
    }

    this.componentLoaderService.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
    });

    const optionDataSession = sessionStorage.getItem(
      'optionDataOperatingLease'
    );

    if (optionDataSession) {
      this.optionData = JSON.parse(optionDataSession);
      this.facilityTypeDropdown = optionDataFacilities['OperatingLease'];
    } else {
      const facilityListSession = sessionStorage.getItem('facilityList');
      const facilityList = facilityListSession
        ? JSON.parse(facilityListSession)
        : [];

      this.facilityDataList = facilityList;

      this.optionData = this.facilityDataList.map((item) => ({
        label: FacilityTypeDropdown[item.value],
        value:
          optionDataFacilities[item.label as keyof typeof optionDataFacilities],
      }));

      sessionStorage.setItem(
        'optionDataOperatingLease',
        JSON.stringify(this.optionData)
      );

      this.facilityTypeDropdown = optionDataFacilities['OperatingLease'];
    }

    const params: LeaseParams = {
      partyId: this.partyId,
      facilityType: FacilityType.OperatingLease_Group,
    };
    this.fetchLeases(params);

    const documentParams = { partyId: this.partyId };
    this.fetchDocuments(documentParams);

    const assetParams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
    };
    this.fetchFacilityAssets(assetParams);
  }

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
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
      };
      const document = await this.fetchDocumentById(params);
      downloadBase64File(document);
    } else if (event.actionName == 'previewDoc') {
      const params = {
        partyId: this.partyId,
        documentId: event.rowData.documentId,
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

  async fetchLeases(params: LeaseParams) {
    try {
      this.leaseDataList = await this.commonApiService.getLeasesData(params);
    } catch (error) {
      console.log('Error while loading leases data', error);
    }
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

  async fetchFacilityAssets(params) {
    try {
      this.facilityAsssetsDatalist = await this.commonApiService.getAssetsData(
        params
      );
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  onheaderclick(event) {
    this[event.actionName]();
  }

  showLeasesTab() {
    this.currentComponent = 'Leases';
  }

  showDocuments() {
    this.componentLoaderService.loadComponent('Documents');
  }

  showAssetsTab() {
    this.currentComponent = 'Assets';
  }

  showRentalForcastTab() {
    this.currentComponent = 'RentalForcast';
    this.tableId = 'rentalForcast';
  }

  onPrint() {
    print();
  }

  // export() {
  //   let dt: any;
  //   let columns = [];
  //   let data = [];
  //   const tableId = this.tableId;
  //   if (this.tableId == 'rentalForcast') {
  //     dt = this.rentalForcast;
  //     columns = dt.paymentForcastColumnDefs || [];
  //     data = dt.paymentForcastDataList || [];
  //   }
  //   if (!tableId || !dt) {
  //     console.error('Table ID or data is missing');
  //     return;
  //   }
  //   if (columns) {
  //     columns = columns.filter((column) => column.headerName !== 'Action');
  //   }
  //   this.printSer.export('xlsx', tableId, columns, data);
  // }

  export() {
    let dt: any;
    let columns = [];
    let dataListWithoutMonth = [];
    const tableId = this.tableId;

    if (this.tableId === 'rentalForcast') {
      dt = this.rentalForcast;
      columns = dt?.paymentForcastColumnDefs || [];
      dataListWithoutMonth = dt.paymentForcastDataList.map(
        ({ month, ...rest }) => rest
      );
    }

    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    const workbookData = [];

    workbookData.push(
      buildSheetData({
        sheetName: tableId,
        columns: columns,
        dataList: dataListWithoutMonth,
        translateService: this.translateService,
        excludedFields: ['actions', 'month'],
      })
    );

    this.printSer.export('xlsx', tableId, workbookData);
  }

  onFacilityChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }
}
