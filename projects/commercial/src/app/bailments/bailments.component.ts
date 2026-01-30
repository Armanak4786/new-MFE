import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  CommonService,
  CurrencyService,
  PrintService,
  ToasterService,
} from 'auro-ui';
import {
  assetSummaryColDef,
  bailmentFacilityTypeColumnDefs,
  bailmentSubFacilityTypeColumnDefs,
  facilityAssetsColumnDefs,
  todaysActivityColDef,
} from './utils/bailment-header.utils';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
  WholesaleRequestHistoryType,
} from '../utils/common-enum';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { BailmentComponentLoaderService } from './services/bailment-component-loader.service';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { take } from 'rxjs';
import {
  base64ToBlob,
  buildSheetData,
  clearSession,
  clearUploadedDocuments,
  downloadBase64File,
  generateSummary,
  getMimeTypeFromName,
  printMultipleTables,
} from '../utils/common-utils';
import {
  DocumentByIdParams,
  DocumentsParams,
  PaymentRequestParams,
  SwapRequestParams,
  TransferRequestParams,
  UploadDocsParams,
} from '../utils/common-interface';
import { CommonApiService } from '../services/common-api.service';
import { ProductTransferRequestComponent } from './components/product-transfer-request/product-transfer-request.component';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PurchaseAssetRequestComponent } from './components/purchase-asset-request/purchase-asset-request.component';
import { SwapRequestComponent } from './components/swap-request/swap-request.component';
import { SameDayPayoutComponent } from './components/same-day-payout/same-day-payout.component';
import { assetlinkDocumentsColumnDefs } from '../assetlink/utils/assetlink-header.util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bailments',
  templateUrl: './bailments.component.html',
  styleUrls: ['./bailments.component.scss'],
})
export class BailmentsComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @ViewChild('FacilitySummaryDt') FacilitySummaryDt;
  facilityType: string = FacilityType.Bailment_Group;
  options: any;
  data: any;
  platformId = inject(PLATFORM_ID);
  currentSubFacility: string | null = null;
  accountType: string | null = null;
  assetLinkComponent: string | null = null;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  frequency: any[] = [];
  selectedSubFacility;
  bailmentFacilityTypeColumnDefs = bailmentFacilityTypeColumnDefs;
  bailmentSubFacilityTypeColumnDefs = bailmentSubFacilityTypeColumnDefs;
  bailmentFacilityDataList;
  subFacilityNameList;
  updateDataList: any;
  // optionData = optionDataFacilities;
  optionData;
  currentComponent: string | null = null;
  facilitySummaryDatalist;
  partyId: number;
  todaysActivityColDef = todaysActivityColDef;
  assetSummaryColDef = assetSummaryColDef;
  facilityAsssetsDatalist;
  facilityAssetsColDef = facilityAssetsColumnDefs;
  documentsDataList;
  clickedSubFacility;
  documentsColumnDefs = assetlinkDocumentsColumnDefs;
  isCollapsed = true;
  visibleItemCount = 5; // Number of items to show when collapsed
  visibleBailmentDataList = [];
  dataListRemainingCount = 0;
  facilityDataList;
  facilityTypeDropdown;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist: any;
  swapRequestList: any;
  requestTypeList: any;
  accessGranted;
  bailmentSubFacilityDataList = [];

  constructor(
    private cd: ChangeDetectorRef,
    public svc: CommonService,
    private currencyService: CurrencyService,
    public router: Router,
    public commonSetterGetterService: CommonSetterGetterService,
    public bailmentComponentLoaderService: BailmentComponentLoaderService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    private componentLoaderService: BailmentComponentLoaderService,
    private commonApiService: CommonApiService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public printSer: PrintService,
    public translateService: TranslateService,
  ) {}

  // ngOnInit() {
  //   clearSession([
  //     'assetlinkDataList',
  //     'easylinkDataList',
  //     'creditlineDataList',
  //     'fixedFloorPlanDetails',
  //     'floatingFloorPlanDetails',
  //     'selectedEasylinkSubFacility',
  //     'selectedAssetlinkSubFacility',
  //     'forecastToDate',
  //     'forecastFromDate',
  //     'forecastFrequency',
  //   ]);
  //   const current = sessionStorage.getItem('currentComponent');
  //   this.currentComponent = current ? current : 'FacilitySummary';
  //   sessionStorage.setItem('currentComponent', this.currentComponent);
  //   this.commonSetterGetterService.setDisableParty(false);

  //   const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
  //   if (
  //     roleBased &&
  //     roleBased.functions &&
  //     typeof roleBased.functions === 'object'
  //   ) {
  //     this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
  //       fn.trim()
  //     );
  //   } else {
  //     this.accessGranted = [];
  //   }

  //   const partyData = sessionStorage.getItem('currentParty');
  //   const party = partyData ? JSON.parse(partyData) : null;
  //   this.partyId = party?.id;

  //   const sessionBailment = sessionStorage.getItem('bailmentDataList');
  //   const optionsData = sessionStorage.getItem('optionDataFacilities');

  //   if (sessionBailment) {
  //     this.bailmentFacilityDataList = JSON.parse(sessionBailment);
  //   } else {
  //     const sessionFinancial = sessionStorage.getItem('financialSummaryData');
  //     const financialData = sessionFinancial
  //       ? JSON.parse(sessionFinancial)
  //       : null;

  //     const bailmentDetails = financialData?.bailmentDetails ?? [];
  //     this.bailmentFacilityDataList = generateSummary(bailmentDetails);

  //     sessionStorage.setItem(
  //       'bailmentDataList',
  //       JSON.stringify(this.bailmentFacilityDataList)
  //     );
  //   }
  //   if (optionsData) {
  //     this.optionData = JSON.parse(optionsData);
  //     this.facilityTypeDropdown = optionDataFacilities['Bailment'];
  //   }

  //   this.afterBailmentLoad();
  // }
  ngOnInit() {
    clearSession([
      'assetlinkDataList',
      'easylinkDataList',
      'creditlineDataList',
      'fixedFloorPlanDetails',
      'floatingFloorPlanDetails',
      'selectedEasylinkSubFacility',
      'selectedAssetlinkSubFacility',
      'forecastToDate',
      'forecastFromDate',
      'forecastFrequency',
    ]);
    // Define valid tabs for Bailments
    const validTabs = [
      'FacilitySummary',
      'FacilityAssets',
      'Documents',
      'RequestHistory',
    ];

    const storedComponent = sessionStorage.getItem('facilityCurrentComponent');

    if (storedComponent && validTabs.includes(storedComponent)) {
      this.currentComponent = storedComponent;
      sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
    } else {
      this.currentComponent = 'FacilitySummary';
      sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
    }
    this.commonSetterGetterService.setDisableParty(false);

    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (
      roleBased &&
      roleBased.functions &&
      typeof roleBased.functions === 'object'
    ) {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim(),
      );
    } else {
      this.accessGranted = [];
    }

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionBailment = sessionStorage.getItem('bailmentDataList');
    const optionsData = sessionStorage.getItem('optionDataFacilities');

    if (sessionBailment) {
      this.bailmentFacilityDataList = JSON.parse(sessionBailment);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const bailmentDetails = financialData?.bailmentDetails ?? [];
      this.bailmentFacilityDataList = generateSummary(bailmentDetails);

      sessionStorage.setItem(
        'bailmentDataList',
        JSON.stringify(this.bailmentFacilityDataList),
      );
    }
    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown = optionDataFacilities['Bailment'];
    }

    this.afterBailmentLoad();

    if (this.currentComponent === 'RequestHistory') {
      this.requestHistory();
    }
  }

  afterBailmentLoad() {
    this.updateVisibleData();

    this.commonSetterGetterService.setCurrentComponent(
      FacilityType.Bailment_Group,
    );
    sessionStorage.setItem('currentFacilityType', FacilityType.Bailment_Group);
    const selectedSessionSubFacility = JSON.parse(
      sessionStorage.getItem('selectedBailmentSubFacility'),
    );

    this.commonSetterGetterService.clearFacilityMap();
    this.commonSetterGetterService.clearContractIdForSettlementQuote();

    this.subFacilityNameList = this.getNonEmptySubFacilityNames(
      this.bailmentFacilityDataList,
    );

    this.currencyService.initializeCurrency();

    // Set selected subfacility
    if (selectedSessionSubFacility) {
      this.selectedSubFacility = selectedSessionSubFacility;
    } else {
      this.selectedSubFacility = this.bailmentFacilityDataList[0];
      sessionStorage.setItem(
        'selectedBailmentSubFacility',
        JSON.stringify(this.selectedSubFacility),
      );
    }

    this.initChart();
    this.currentSubFacility = 'bailmentDashboard';

    // Subscribe to component changes with validation
    const validTabs = [
      'FacilitySummary',
      'FacilityAssets',
      'Documents',
      'RequestHistory',
    ];
    this.bailmentComponentLoaderService.component$.subscribe(
      (componentName) => {
        if (validTabs.includes(componentName)) {
          this.currentSubFacility = componentName;
        }
      },
    );

    if (this.currentComponent === 'FacilitySummary') {
      this.showFacilitySummary();
    } else if (this.currentComponent === 'FacilityAssets') {
      this.showFacilityAssets();
    } else if (this.currentComponent === 'Documents') {
      this.showDocuments();
    }
    this.bailmentSubFacilityDataList = [
      {
        id: null,
        contractId: null,
        facilityName: null,
        facilityType: null,
        noOfAssets: null,
      },
      selectedSessionSubFacility,
    ];
    this.commonSetterGetterService.facilityList$.subscribe((list) => {
      if (list?.length) {
        this.facilityDataList = list;
        this.optionData = this.facilityDataList.map((item) => ({
          label: FacilityTypeDropdown[item.value],
          value:
            optionDataFacilities[
              item.label as keyof typeof optionDataFacilities
            ],
        }));

        sessionStorage.setItem(
          'optionDataFacilities',
          JSON.stringify(this.optionData),
        );

        this.facilityTypeDropdown = optionDataFacilities['Bailment'];
      }
    });
  }

  getNonEmptySubFacilityNames(dataList) {
    return dataList
      .filter((item) => item.facilityName && item.facilityName.trim() !== '')
      .map((item) => item.facilityName);
  }

  onheaderclick(event) {
    this[event.actionName]();
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const dataItem = this.bailmentFacilityDataList[0];
      const availableFunds = dataItem?.availableFunds;
      const currentBalance = dataItem.currentBalance;
      const total = availableFunds + currentBalance;

      this.data = {
        labels: ['Available Funds', 'Current Balance'],

        datasets: [
          {
            data: [availableFunds, currentBalance],
            backgroundColor: ['#07435F', '#0095C3'],
          },
        ],
      };

      this.options = {
        cutout: '66%',
        layout: {},
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            bodyFont: {
              size: 8, // 👈 Smaller font size for hover text
            },
            callbacks: {
              label: (context: any) => {
                const value = context.raw;

                return `${value}`;
              },
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  requestHistory() {
    this.currentComponent = 'RequestHistory';
    this.componentLoaderService.loadComponent('RequestHistory');
    sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
  }

  async fetchPaymentRequestList(params: PaymentRequestParams) {
    try {
      this.swapRequestList =
        await this.commonApiService.getPaymentRequestList(params);
    } catch (error) {
      console.log('Error while loading swap list data', error);
    }
  }

  onCellClick(event: any) {
    // if (!event?.cellData || event?.cellData.trim() === '') return;
    const clickedFacility = event.rowData;
    // if (clickedFacility.facilityName) {
    this.bailmentSubFacilityDataList = [
      {
        id: null,
        contractId: null,
        facilityName: null,
        facilityType: null,
        noOfAssets: null,
      },
      clickedFacility,
    ];
    this.selectedSubFacility = { ...clickedFacility };
    sessionStorage.setItem(
      'selectedBailmentSubFacility',
      JSON.stringify(this.selectedSubFacility),
    );
    this.commonSetterGetterService.setFacilityMap(
      this.facilityType,
      clickedFacility.facilityName,
    );
    this.commonSetterGetterService.setContractIdForSettlementQuote(
      event.rowData.id,
    );
    // }
    this.showFacilitySummary();
  }

  onFrequencyChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`${facilityRoute}`]);
    }
  }

  updateVisibleData() {
    if (!this.bailmentFacilityDataList) return;

    const totalItems = this.bailmentFacilityDataList.length;

    if (this.isCollapsed) {
      this.visibleBailmentDataList = this.bailmentFacilityDataList.slice(
        0,
        this.visibleItemCount,
      );
      this.dataListRemainingCount = Math.max(
        0,
        totalItems - this.visibleItemCount,
      );
    } else {
      this.visibleBailmentDataList = [...this.bailmentFacilityDataList];
      this.dataListRemainingCount = 0;
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.updateVisibleData();
  }

  getToggleButtonText(): string {
    if (this.isCollapsed) {
      return `More ${this.dataListRemainingCount}`;
    } else {
      return `Less`;
    }
  }

  getToggleButtonIcon(): string {
    return this.isCollapsed ? 'pi-angle-down' : 'pi-angle-down';
  }

  showFacilitySummary() {
    this.currentComponent = 'FacilitySummary';
    const payload: any = {
      partyNo: this.partyId,
      facilityType: this.facilityType,
      ...(this.selectedSubFacility?.facilityName?.trim() !== '' && {
        subFacilityId: this.selectedSubFacility?.id,
      }),
    };
    this.fetchFacilitySummaryData(payload);
  }
  async fetchFacilitySummaryData(params) {
    try {
      this.facilitySummaryDatalist =
        await this.commonApiService.getFacilitySummary(params);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
    this.componentLoaderService.loadBailmentDashboard('FacilitySummary');
  }

  showFacilityAssets() {
    this.currentComponent = 'FacilityAssets';
    const payload: any = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      ...(this.selectedSubFacility?.facilityName?.trim() !== '' && {
        subFacilityId: this.selectedSubFacility.id,
      }),
    };
    this.commonApiService.getAssetsData(payload).then((data) => {
      if (data) {
        this.facilityAsssetsDatalist = data;
      }
    });
    this.componentLoaderService.loadBailmentDashboard('FacilityAssets');
    sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
  }

  productTransferRequest() {
    this.svc.dialogSvc
      .show(ProductTransferRequestComponent, 'Product Transfer Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '70vw',
        height: '30vw',
        contentStyle: { overflow: 'auto' }
      })
      .onClose.subscribe((data: any) => {});
  }

  purchaseAssetRequest() {
    this.svc.dialogSvc
      .show(PurchaseAssetRequestComponent, 'Purchase Asset Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '70vw',
        height: '30vw',
        contentStyle: { overflow: 'auto' }
      })
      .onClose.subscribe((data: any) => {});
    // this.showFacilityAssets();
  }
  swapRequest() {
    this.svc.dialogSvc
      .show(SwapRequestComponent, 'Swap Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '70vw',
        height: '30vw',
        contentStyle: { overflow: 'auto' }
      })
      .onClose.subscribe((data: any) => {});
  }

  sameDayPayoutRequest() {
    this.svc.dialogSvc
      .show(SameDayPayoutComponent, 'Same Day Payout', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.bailmentFacilityDataList,
        },
        width: '70vw',
        height: '30vw',
        contentStyle: { overflow: 'auto' }
      })
      .onClose.subscribe((data: any) => {});
  }

  showDocuments() {
    this.currentComponent = 'Documents';
    const params = { partyId: this.partyId };
    this.fetchDocuments(params);
    this.componentLoaderService.loadBailmentDashboard('Documents');
    sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
  }

  async fetchDocuments(params: DocumentsParams) {
    try {
      this.documentsDataList =
        await this.commonApiService.getDocumentsData(params);
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

  // export() {
  //   const dt = this.FacilitySummaryDt;
  //   if (!dt) {
  //     console.error('Data is missing');
  //     return;
  //   }
  //   const fixedColumnWidth = 15;

  //   const getFixedWidths = (columns) =>
  //     columns.map(() => ({ wch: fixedColumnWidth }));
  //   const workbookData = [];

  //   if (dt.todaysActivityColDef && dt.facilitySummaryDatalist?.todaysActivity) {
  //     const columns1 = dt.todaysActivityColDef
  //       .filter((col) => col.headerName !== 'Action')
  //       .map((col) => ({
  //         ...col,
  //         headerName: this.translateService.instant(col.headerName),
  //       }));
  //     assetSummaryColDef;
  //     const data1 = dt.facilitySummaryDatalist.todaysActivity;
  //     workbookData.push({
  //       sheetName: 'Today activity',
  //       columns: columns1,
  //       dataList: data1,
  //       fixedColumnWidth: getFixedWidths(columns1),
  //     });
  //   }

  //   if (dt.assetSummaryColDef && dt.facilitySummaryDatalist?.assetSummary) {
  //     const columns2 = dt.assetSummaryColDef
  //       .filter((col) => col.headerName !== 'Action')
  //       .map((col) => ({
  //         ...col,
  //         headerName: this.translateService.instant(col.headerName),
  //       }));
  //     const data2 = dt.facilitySummaryDatalist.assetSummary;
  //     workbookData.push({
  //       sheetName: 'Asset summary',
  //       columns: columns2,
  //       dataList: data2,
  //       fixedColumnWidth: getFixedWidths(columns2),
  //     });
  //   }

  //   if (workbookData.length === 0) {
  //     console.error('No valid sheets to export');
  //     return;
  //   }

  //   this.printSer.export('xlsx', this.currentComponent, workbookData);
  // }

  export() {
    const dt = this.FacilitySummaryDt;
    if (!dt) {
      console.error('Data is missing');
      return;
    }

    const workbookData = [];

    if (dt.todaysActivityColDef && dt.facilitySummaryDatalist?.todaysActivity) {
      workbookData.push(
        buildSheetData({
          sheetName: "Today's Activity",
          columns: dt.todaysActivityColDef,
          dataList: dt.facilitySummaryDatalist.todaysActivity,
          translateService: this.translateService,
        }),
      );
    }

    if (dt.assetSummaryColDef && dt.facilitySummaryDatalist?.assetSummary) {
      workbookData.push(
        buildSheetData({
          sheetName: 'Asset Summary',
          columns: dt.assetSummaryColDef,
          dataList: dt.facilitySummaryDatalist.assetSummary,
          translateService: this.translateService,
        }),
      );
    }

    if (workbookData.length === 0) {
      console.error('No valid sheets to export');
      return;
    }

    this.printSer.export('xlsx', this.currentComponent, workbookData);
  }

  onPrint() {
    if (this.currentComponent === 'FacilitySummary') {
      const todayActivity = this.facilitySummaryDatalist?.todaysActivity || [];
      const assetSummary = this.facilitySummaryDatalist?.assetSummary || [];

      printMultipleTables(
        this.todaysActivityColDef,
        this.assetSummaryColDef,
        todayActivity,
        assetSummary,
        this.translateService,
        'portrait',
      );
    }
  }

  ngOnDestroy() {
    clearSession('currentComponent');
    clearSession('facilityCurrentComponent');
    clearSession('bailmentDataList');
    clearSession('selectedBailmentSubFacility');
    clearSession('currentFacilityType');
  }
}
