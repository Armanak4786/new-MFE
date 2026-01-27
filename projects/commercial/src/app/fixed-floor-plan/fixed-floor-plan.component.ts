import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import {
  CommonService,
  CurrencyService,
  PrintService,
  ToasterService,
} from 'auro-ui';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import {
  fixedFloorPlanColumnDefs,
  facilityAssetsColumnDefs,
} from './utils/fixed-floor-plan-header.utils';

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
import { isPlatformBrowser } from '@angular/common';
import { FixedFloorPlanComponentLoaderService } from './services/fixed-floor-plan-component-loader.service';
import {
  DocumentByIdParams,
  DocumentsParams,
  FacilitySummaryParams,
  PaymentRequestParams,
  UploadDocsParams,
} from '../utils/common-interface';
import { CommonApiService } from '../services/common-api.service';
import {
  assetSummaryColDef,
  todaysActivityColDef,
} from '../bailments/utils/bailment-header.utils';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { assetlinkDocumentsColumnDefs } from '../assetlink/utils/assetlink-header.util';
import { FacilitySummaryComponent } from '../reusable-component/components/facility-summary/facility-summary.component';
import { PurchaseAssetRequestComponent } from '../bailments/components/purchase-asset-request/purchase-asset-request.component';
import { FixedFloorPlanDrawdownRequestComponent } from './components/fixed-floor-plan-drawdown-request/fixed-floor-plan-drawdown-request.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fixed-floor-plan',
  //standalone: true,
  //imports: [],
  templateUrl: './fixed-floor-plan.component.html',
  styleUrl: './fixed-floor-plan.component.scss',
})
export class FixedFloorPlanComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @ViewChild(FacilitySummaryComponent)
  facilitySummary: FacilitySummaryComponent;
  isCollapsed = true;
  facilityType: string = FacilityType.FixedFloorPlan_Group;
  options: any;
  data: any;
  platformId = inject(PLATFORM_ID);
  currentSubFacility: string | null = null;
  accountType: string | null = null;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  frequency: any[] = [];
  selectedSubFacility;
  fixedFloorTypeColumnDefs = fixedFloorPlanColumnDefs;
  partyId: number;
  dataListRemainingCount = 0;
  fixedFloorFacilityDataList;
  subFacilityNameList;
  updateDataList: any;
  optionData;
  visibleFixedFloorDataList;
  currentComponent;
  facilityAssetsColDef = facilityAssetsColumnDefs;
  todaysActivityColDef = todaysActivityColDef;
  assetSummaryColDef = assetSummaryColDef;
  facilityAsssetsDatalist = [];
  facilitySummaryDatalist;
  documentsDataList;
  documentsColumnDefs = assetlinkDocumentsColumnDefs;
  visibleItemCount = 5; // Number of items to show when collapsed
  facilityDataList;
  facilityTypeDropdown;
  swapRequestList: any;
  requestHistory_facility = FacilityType.FixedFloorPlan_Group;
  accessGranted;
  fixedFloorSubFacilityTypeColumnDefs = fixedFloorPlanColumnDefs;
  FixedFloorSubFacilityDataList;

  constructor(
    private cd: ChangeDetectorRef,
    public svc: CommonService,
    public printSer: PrintService,
    public router: Router,
    private commonApiService: CommonApiService,
    public commonSetterGetterService: CommonSetterGetterService,
    private componentLoaderService: FixedFloorPlanComponentLoaderService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public translateService: TranslateService
  ) {}

  // ngOnInit() {
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
  //   this.commonSetterGetterService.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   this.commonSetterGetterService.financial.subscribe((data) => {
  //     this.fixedFloorFacilityDataList = data?.fixedFloorplanDetails ?? [];
  //     this.fixedFloorFacilityDataList &&
  //     this.fixedFloorFacilityDataList.length > 5
  //       ? this.fixedFloorFacilityDataList.length - 5
  //       : 0;
  //     if (!this.fixedFloorFacilityDataList.length) {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           const details = list?.fixedFloorplanDetails ?? [];
  //           this.fixedFloorFacilityDataList = generateSummary(details);
  //           this.updateVisibleData();
  //         });
  //     } else {
  //       this.updateVisibleData();
  //     }
  //   });
  //   if (!this.fixedFloorFacilityDataList.length) {
  //     this.svc.router.navigateByUrl('commercial');
  //     return;
  //   }
  //   this.currentComponent = 'FacilitySummary';
  //   this.showFacilitySummary();
  //   this.subFacilityNameList = this.getNonEmptySubFacilityNames(
  //     this.fixedFloorFacilityDataList
  //   );
  //   //this.currencyService.initializeCurrency();
  //   this.selectedSubFacility = this.fixedFloorFacilityDataList[0];
  //   this.initChart();
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.commonSetterGetterService.setCurrentComponent(
  //     FacilityType.FixedFloorPlan
  //   );
  //   this.commonSetterGetterService.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label: FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['FixedFloorPlan'];
  //   });
  // }

  ngOnInit() {
    clearSession([
      'assetlinkDataList',
      'easylinkDataList',
      'creditlineDataList',
      'bailmentDataList',
      'floatingFloorPlanDetails',
      'selectedEasylinkSubFacility',
      'selectedAssetlinkSubFacility',
      'selectedBailmentSubFacility',
      'forecastToDate',
      'forecastFromDate',
      'forecastFrequency',
    ]);
    this.commonSetterGetterService.setDisableParty(false);

    const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
    if (roleBased?.functions && typeof roleBased.functions === 'object') {
      this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
        fn.trim()
      );
    } else {
      this.accessGranted = [];
    }

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionFixedFloor = sessionStorage.getItem(
      'fixedFloorPlanDetails'
    );
    const optionsData = sessionStorage.getItem('optionDataFacilities');

    if (sessionFixedFloor) {
      this.fixedFloorFacilityDataList = JSON.parse(sessionFixedFloor);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const details = financialData?.fixedFloorplanDetails ?? [];
      this.fixedFloorFacilityDataList = generateSummary(details);

      sessionStorage.setItem(
        'fixedFloorPlanDetails',
        JSON.stringify(this.fixedFloorFacilityDataList)
      );
    }

    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown = optionDataFacilities['FixedFloorPlan'];
    }
    this.updateVisibleData();
    this.afterFixedFloorLoad();
  }

  afterFixedFloorLoad() {
    const validTabs = ['FacilitySummary','FacilityAssets','Documents','RequestHistory'];
    const storedComponent = sessionStorage.getItem('facilityCurrentComponent');

    if (storedComponent && validTabs.includes(storedComponent)) {
      this.currentComponent = storedComponent;
      sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
    } else {
      this.currentComponent = 'FacilitySummary';
      sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
    }

    this.commonSetterGetterService.setCurrentComponent(
      FacilityType.FixedFloorPlan
    );
    sessionStorage.setItem('currentFacilityType', FacilityType.FixedFloorPlan_Group);

    const selectedSessionSubFacility = JSON.parse(sessionStorage.getItem('selectedFixedFloorSubFacility'));

    this.subFacilityNameList = this.getNonEmptySubFacilityNames(
      this.fixedFloorFacilityDataList
    );

    if (selectedSessionSubFacility) {
      this.selectedSubFacility = selectedSessionSubFacility;
    } else {
      this.selectedSubFacility = this.fixedFloorFacilityDataList[0];
      sessionStorage.setItem(
        'selectedFixedFloorSubFacility',
        JSON.stringify(this.selectedSubFacility)
      );
    }

    this.initChart();

    if (this.currentComponent === 'FacilitySummary') {
      this.showFacilitySummary();
    } else if (this.currentComponent === 'FacilityAssets') {
      this.showFacilityAssets();
    } else if (this.currentComponent === 'Documents') {
      this.showDocuments();
    }

    this.FixedFloorSubFacilityDataList = [
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
          JSON.stringify(this.optionData)
        );

        this.facilityTypeDropdown = optionDataFacilities['FixedFloorPlan'];
      }
    });

    if (this.currentComponent === 'RequestHistory') {
      this.requestHistory();
    }
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  updateVisibleData() {
    if (!this.fixedFloorFacilityDataList) return;

    const allData = this.fixedFloorFacilityDataList.length;

    if (this.isCollapsed) {
      this.visibleFixedFloorDataList = this.fixedFloorFacilityDataList.slice(
        0,
        this.visibleItemCount
      );
      this.dataListRemainingCount = Math.max(
        0,
        allData - this.visibleItemCount
      );
    } else {
      this.visibleFixedFloorDataList = [...this.fixedFloorFacilityDataList];
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

  getNonEmptySubFacilityNames(dataList) {
    return dataList
      .filter((item) => item.facilityName && item.facilityName.trim() !== '')
      .map((item) => item.facilityName);
  }

  onheaderclick(event) {
    this[event.actionName]();
  }

  requestHistory() {
    this.currentComponent = 'RequestHistory';
    this.componentLoaderService.loadComponent('RequestHistory');
    sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
  }

  async fetchPaymentRequestList(params: PaymentRequestParams) {
    try {
      this.swapRequestList = await this.commonApiService.getPaymentRequestList(
        params
      );
    } catch (error) {
      console.log('Error while loading swap list data', error);
    }
  }

  paymentTransferRequest() {
    this.svc.dialogSvc
      .show(PurchaseAssetRequestComponent, 'Payment Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          selectedSubFacility: this.selectedSubFacility,
          bailmentFacilityDataList: this.fixedFloorFacilityDataList,
        },
        width: '70vw',
        height: '30vw',
      })
      .onClose.subscribe((data: any) => {});
    // this.showFacilityAssets();
  }

  drawdownRequest() {
    this.svc.dialogSvc
      .show(FixedFloorPlanDrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.fixedFloorFacilityDataList,
        },
        width: '78vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  showFacilityAssets() {
    this.currentComponent = 'FacilityAssets';
    const assetParams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      ...(this.selectedSubFacility?.facilityName?.trim() !== '' && {
        subFacilityId: this.selectedSubFacility.id,
      }),
    };
    this.commonApiService.getAssetsData(assetParams).then((data) => {
      if (data) {
        this.facilityAsssetsDatalist = data;
      }
    });
    this.componentLoaderService.loadFixedFloorDashboard('FacilityAssets');
    sessionStorage.setItem('facilityCurrentComponent',this.currentComponent);
  }

  async fetchFacilitySummaryData(params) {
    try {
      this.facilitySummaryDatalist =
        await this.commonApiService.getFacilitySummary(params);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  showFacilitySummary() {
    this.currentComponent = 'FacilitySummary';
    const params: FacilitySummaryParams = {
      partyNo: this.partyId,
      facilityType: FacilityType.FixedFloorPlanGroup,
      subFacilityId: this.selectedSubFacility?.facilityName?.trim()
        ? this.selectedSubFacility.id
        : null,
    };
    this.fetchFacilitySummaryData(params);
    this.componentLoaderService.loadFixedFloorDashboard('FacilitySummary');
  }

  showDocuments() {
    this.currentComponent = 'Documents';
    const documentParams = { partyId: this.partyId };
    this.fetchDocuments(documentParams);
    this.componentLoaderService.loadFixedFloorDashboard('Documents');
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

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const dataItem = this.fixedFloorFacilityDataList[0];
      const availableFunds = dataItem.availableFunds;
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

  onCellClick(event: any) {
    const clickedFacility = event.rowData;
    if (clickedFacility.facilityName) {
      this.FixedFloorSubFacilityDataList = [
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
        'selectedFixedFloorSubFacility',
        JSON.stringify(this.selectedSubFacility)
      );
    }
    this.showFacilitySummary();
  }

  onFrequencyChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`${facilityRoute}`]);
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
  //   const dt = this.facilitySummary;
  //   if (!dt) {
  //     console.error('Data is missing');
  //     return;
  //   }

  //   const workbookData = [];

  //   if (dt.todaysActivityColDef && dt.facilitySummaryDatalist?.todaysActivity) {
  //     const columns1 = dt.todaysActivityColDef
  //       .filter((col) => col.headerName !== 'Action')
  //       .map((col) => ({
  //         ...col,
  //         headerName: this.translateService.instant(col.headerName),
  //       }));

  //     const data1 = dt.facilitySummaryDatalist.todaysActivity;
  //     workbookData.push({
  //       sheetName: 'Today activity',
  //       columns: columns1,
  //       data: data1,
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
  //       data: data2,
  //     });
  //   }

  //   if (workbookData.length === 0) {
  //     console.error('No valid sheets to export');
  //     return;
  //   }

  //   exportWorkbook(this.currentComponent + '.xlsx', workbookData);
  // }

  export() {
    const dt = this.facilitySummary;
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
          excludedFields: ['Action'],
        })
      );
    }

    if (dt.assetSummaryColDef && dt.facilitySummaryDatalist?.assetSummary) {
      workbookData.push(
        buildSheetData({
          sheetName: 'Asset Summary',
          columns: dt.assetSummaryColDef,
          dataList: dt.facilitySummaryDatalist.assetSummary,
          translateService: this.translateService,
          excludedFields: ['Action'],
        })
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
      const todaysActivity = this.facilitySummaryDatalist?.todaysActivity || [];
      const assetSummary = this.facilitySummaryDatalist?.assetSummary || [];
      printMultipleTables(
        this.todaysActivityColDef,
        this.assetSummaryColDef,
        todaysActivity,
        assetSummary,
        this.translateService,
        'portrait'
      );
    }
  }

  ngOnDestroy() {
    clearSession('currentComponent');
    clearSession('facilityCurrentComponent');
    clearSession('fixedFloorPlanDetails');
    clearSession('selectedFixedFloorSubFacility');
    clearSession('currentFacilityType');
  }
}
