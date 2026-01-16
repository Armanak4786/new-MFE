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
import { CommonApiService } from '../services/common-api.service';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { FloatingFloorPlanComponentLoaderService } from './services/floating-floor-plan-component-loader.service';
import { take } from 'rxjs';
import {
  base64ToBlob,
  buildSheetData,
  calculatePaymentNotYetAllocated,
  clearSession,
  clearUploadedDocuments,
  downloadBase64File,
  generateSummary,
  getMimeTypeFromName,
  print,
  printTable,
} from '../utils/common-utils';
import { isPlatformBrowser } from '@angular/common';
import {
  floatingFloorPlanColumnDefs,
  todaysActivityColDef,
} from './utils/floating-floor-plan-header-utils';
import {
  DocumentByIdParams,
  DocumentsParams,
  FacilitySummaryParams,
  UploadDocsParams,
} from '../utils/common-interface';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { assetlinkDocumentsColumnDefs } from '../assetlink/utils/assetlink-header.util';
import {
  loansPaymentColumnDefs,
  loanTransactionsColumnDef,
} from '../utils/common-header-definition';
import { RequestRepaymentComponent } from '../reusable-component/components/request-repayment/request-repayment.component';
import { FacilitySummaryComponent } from '../reusable-component/components/facility-summary/facility-summary.component';
import { TranslateService } from '@ngx-translate/core';
import { FloatingFloorPlanDrawdownRequestComponent } from './components/floating-floor-plan-drawdown-request/floating-floor-plan-drawdown-request.component';
@Component({
  selector: 'app-floating-floor-plan',
  //standalone: true,
  //imports: [],
  templateUrl: './floating-floor-plan.component.html',
  styleUrls: ['./floating-floor-plan.component.scss'],
})
export class FloatingFloorPlanComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @ViewChild(FacilitySummaryComponent)
  facilitySummary: FacilitySummaryComponent;
  floatingFloorFacilityDataList;
  isCollapsed = true;
  tableId: string = 'FacilitySummaryList';
  floatingFloorTypeColumnDefs = floatingFloorPlanColumnDefs;
  // optionData = optionDataFacilities;
  optionData;
  platformId = inject(PLATFORM_ID);
  dataListRemainingCount = 0;
  currentSubFacility: string | null = null;
  options: any;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  currentComponent;
  data: {
    labels: string[];
    datasets: { data: any[]; backgroundColor: string[] }[];
  };
  subFacilityNameList: any;
  selectedSubFacility: any;
  visibleFloatingFloorDataList: any;
  todaysActivityColDef = todaysActivityColDef;
  partyId;
  facilityType: string = FacilityType.FloatingFloorPlan_Group;
  facilitySummaryDatalist;
  documentsDataList = [];
  documentsColumnDefs = assetlinkDocumentsColumnDefs;
  transactionsColumnDef = loanTransactionsColumnDef;
  paymentColumnDefs = loansPaymentColumnDefs;
  paymentDataList;
  transactionsDataList;
  overDue;
  paymentNotYetAllocated;
  visibleItemCount = 5; // Number of items to show when collapsed
  facilityDataList;
  facilityTypeDropdown;
  accessGranted;

  constructor(
    private cd: ChangeDetectorRef,
    public svc: CommonService,
    public printSer: PrintService,
    private currencyService: CurrencyService,
    public router: Router,
    private commonApiService: CommonApiService,
    public commonSetterGetterService: CommonSetterGetterService,
    private componentLoaderService: FloatingFloorPlanComponentLoaderService,
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
  //     this.floatingFloorFacilityDataList = data?.floatingFloorplanDetails ?? [];

  //     this.floatingFloorFacilityDataList &&
  //     this.floatingFloorFacilityDataList.length > 5
  //       ? this.floatingFloorFacilityDataList.length - 5
  //       : 0;
  //     if (!this.floatingFloorFacilityDataList.length) {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           const details = list?.floatingFloorplanDetails ?? [];
  //           this.floatingFloorFacilityDataList = generateSummary(details);

  //           this.updateVisibleData();
  //         });
  //     } else {
  //       this.updateVisibleData();
  //     }
  //   });
  //   if (!this.floatingFloorFacilityDataList.length) {
  //     this.svc.router.navigateByUrl('commercial');
  //     return;
  //   }
  //   this.currentComponent = 'FacilitySummary';
  //   this.subFacilityNameList = this.getNonEmptySubFacilityNames(
  //     this.floatingFloorFacilityDataList
  //   );

  //   //this.currencyService.initializeCurrency();
  //   this.selectedSubFacility = this.floatingFloorFacilityDataList[0];
  //   console.log(
  //     'floatingFloorFacilityDataList',
  //     this.floatingFloorFacilityDataList
  //   );
  //   console.log('selectedSubFacility', this.selectedSubFacility);

  //   this.initChart();
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.showFacilitySummary();
  //   this.commonSetterGetterService.setCurrentComponent(
  //     FacilityType.FloatingFloorPlan
  //   );
  //   this.commonSetterGetterService.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label: FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['FloatingFloorPlan'];
  //   });
  // }

  ngOnInit() {
    clearSession([
      'assetlinkDataList',
      'easylinkDataList',
      'creditlineDataList',
      'fixedFloorPlanDetails',
      'selectedEasylinkSubFacility',
      'selectedAssetlinkSubFacility',
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

    const sessionFloatingFloor = sessionStorage.getItem(
      'floatingFloorDataList'
    );
    const optionsData = sessionStorage.getItem('optionDataFloatingFloor');

    if (sessionFloatingFloor) {
      this.floatingFloorFacilityDataList = JSON.parse(sessionFloatingFloor);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const details = financialData?.floatingFloorplanDetails ?? [];
      this.floatingFloorFacilityDataList = generateSummary(details);

      sessionStorage.setItem(
        'floatingFloorDataList',
        JSON.stringify(this.floatingFloorFacilityDataList)
      );
    }

    if (!this.floatingFloorFacilityDataList.length) {
      this.svc.router.navigateByUrl('commercial');
      return;
    }

    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown = optionDataFacilities['FloatingFloorPlan'];
    }

    this.afterFloatingFloorLoad();
    this.updateVisibleData();
  }

  afterFloatingFloorLoad() {
    const current = sessionStorage.getItem('currentComponent');
    this.currentComponent = current ? current : 'FacilitySummary';
    sessionStorage.setItem('currentComponent', this.currentComponent);

    this.subFacilityNameList = this.getNonEmptySubFacilityNames(
      this.floatingFloorFacilityDataList
    );

    this.selectedSubFacility = this.floatingFloorFacilityDataList[0];
    sessionStorage.setItem(
      'selectedFloatingFloorSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );

    this.initChart();
    this.showFacilitySummary();

    this.componentLoaderService.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
    });

    this.commonSetterGetterService.setCurrentComponent(
      FacilityType.FloatingFloorPlan
    );

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
          'optionDataFloatingFloor',
          JSON.stringify(this.optionData)
        );

        this.facilityTypeDropdown = optionDataFacilities['FloatingFloorPlan'];
      }
    });

    const params = { partyId: this.partyId };
    this.fetchDocuments(params);

    const facilitySummaryParams: FacilitySummaryParams = {
      partyNo: this.partyId,
      facilityType: this.facilityType,
      ...(this.selectedSubFacility?.facilityName?.trim() !== '' && {
        subFacilityId: this.selectedSubFacility.id,
      }),
    };
    this.fetchFacilitySummaryData(facilitySummaryParams);

    const transactionFlowParams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      facility_type_cf_name: FacilityType.FacilityType,
      floating_floorplan_facility_name: FacilityType.FloatingFloorPlanGroup,
      credit_line_id: this.selectedSubFacility?.id,
      facility_type: FacilityType.FloatingFloorPlanGroup,
      contractId: 0,
    };
    this.fetchPaymentsTab(transactionFlowParams);
    this.fetchTransactionsTab(transactionFlowParams);
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  onFrequencyChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }

  updateVisibleData() {
    if (!this.floatingFloorFacilityDataList) return;

    const allData = this.floatingFloorFacilityDataList.length;

    if (this.isCollapsed) {
      this.visibleFloatingFloorDataList =
        this.floatingFloorFacilityDataList.slice(0, this.visibleItemCount);
      this.dataListRemainingCount = Math.max(
        0,
        allData - this.visibleItemCount
      );
    } else {
      this.visibleFloatingFloorDataList = [
        ...this.floatingFloorFacilityDataList,
      ];
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
  drawdownRequest() {
    this.svc.dialogSvc
      .show(FloatingFloorPlanDrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility,
          floatingFloorFacilityDataList: this.floatingFloorFacilityDataList,
        },
        height: '42vw',
        width: '78vw',
        contentStyle: { overflow: 'auto' },
        styleClass: 'dialogue-scroll',
        position: 'center',
      })
      .onClose.subscribe((data: any) => {});
  }
  repaymentRequest() {
    this.svc.dialogSvc
      .show(RequestRepaymentComponent, 'Repayment Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility,
        },
        height: '42vw',
        width: '78vw',
        contentStyle: { overflow: 'auto' },
        styleClass: 'dialogue-scroll',
        position: 'center',
      })
      .onClose.subscribe((data: any) => {});
  }
  async showStatements() {
    this.currentComponent = 'TransactionFlow';
    this.componentLoaderService.loadComponent('TransactionFlow');
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

  calculateTotalOutstandingAmount(transactions) {
    let totalOutstanding = 0;

    // Loop through the transactions to sum the outstandingAmount
    transactions.forEach((transaction) => {
      totalOutstanding += transaction.outstandingAmount;
    });

    return totalOutstanding;
  }

  showDocuments() {
    this.currentComponent = 'Documents';
    this.componentLoaderService.loadFloatingFloorDashboard('Documents');
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

  showFacilitySummary() {
    this.currentComponent = 'FacilitySummary';
    this.componentLoaderService.loadFloatingFloorDashboard('FacilitySummary');
  }
  async fetchFacilitySummaryData(params) {
    try {
      this.facilitySummaryDatalist =
        await this.commonApiService.getFacilitySummary(params);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  requestHistory() {
    this.currentComponent = 'RequestHistory';
    this.componentLoaderService.loadComponent('RequestHistory');
  }

  onCellClick(event: any) {
    const clickedFacility = event.rowData;
    if (clickedFacility.facilityName) {
      this.selectedSubFacility = { ...clickedFacility };
    }
    this.showFacilitySummary();
  }

  getNonEmptySubFacilityNames(dataList) {
    return dataList
      .filter((item) => item.facilityName && item.facilityName.trim() !== '')
      .map((item) => item.facilityName);
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const dataItem = this.floatingFloorFacilityDataList[0];
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

  export() {
    const dt = this.facilitySummary;
    if (!dt) {
      console.error('Data is missing');
      return;
    }

    const workbookData = [];

    // Sheet 1: Today's Activity
    if (dt.facilitySummaryDatalist?.todaysActivity && dt.todaysActivityColDef) {
      const columns1 = dt.todaysActivityColDef.filter(
        (column) => column.headerName !== 'Action'
      );
      const data1 = dt.facilitySummaryDatalist.todaysActivity;

      workbookData.push(
        buildSheetData({
          sheetName: "Today's Activity",
          columns: columns1,
          dataList: data1,
          translateService: this.translateService,
          excludedFields: ['Action'],
        })
      );
    }

    if (workbookData.length === 0) {
      console.error('No valid sheets to export');
      return;
    }

    this.printSer.export('xlsx', 'Facility Summary', workbookData);
  }

  onPrint() {
    printTable(
      this.todaysActivityColDef,
      this.facilitySummaryDatalist?.todaysActivity ?? [],
      this.translateService,
      'portrait'
    );
  }

  ngOnDestroy() {
    clearSession('currentComponent');
  }
}
