import { Component, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  CommonService,
  CurrencyService,
  PrintService,
  ToasterService,
} from 'auro-ui';
import {
  buybackAccountForecastColumnDefs,
  buyBackFacilityColumnDefs,
  buybackLeasesColumnDefs,
  buybackPaymentForecastColumnDefs,
  byubackDocumentsColumnDefs,
  leaseColumnDefs,
  requestHistoryColumnDefs,
} from './utils/buyback-header.utils';
import { ILeases } from './interface/buyback-interface';

import { BuybackComponentLoaderService } from './services/buyback-component-loader.service';
import { DashboardService } from '../dashboard/services/dashboard.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { Router } from '@angular/router';
import {
  base64ToBlob,
  clearUploadedDocuments,
  downloadBase64File,
  getBuyBackSummaryData,
  getMimeTypeFromName,
  print,
} from '../utils/common-utils';
import { BuybackForcastComponent } from './components/buyback-forcast/buyback-forcast.component';
import { CommonApiService } from '../services/common-api.service';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { debounceTime, Subject, take } from 'rxjs';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import {
  AccountForecastParams,
  DocumentByIdParams,
  PaymentForcastParams,
  UploadDocsParams,
} from '../utils/common-interface';
import { DocumentsComponent } from '../reusable-component/components/documents/documents.component';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-buyback',
  templateUrl: './buyback.component.html',
  styleUrls: ['./buyback.component.scss'],
})
export class BuybackComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  optionData;
  facilityDataList;
  facilityType = FacilityType.Buyback;
  platformId = inject(PLATFORM_ID);
  currentComponent: string | null = null;
  leaseColumnDefs = leaseColumnDefs;
  leaseDataList: ILeases;
  facilityAsssetsDatalist = [];
  leasesDataList;
  buybackLeasesColumnDefs = buybackLeasesColumnDefs;
  byubackDocumentsColumnDefs = byubackDocumentsColumnDefs;
  partyId: number;
  documentsDataList;
  dashboardValue: any;
  buyBackDataList;
  buyBackColDefs = buyBackFacilityColumnDefs;
  @ViewChild('buybackForcast')
  buybackForcast: BuybackForcastComponent;
  tableId;
  paramChangeSubject = new Subject<any>();
  paymentForcastDataList: any;
  accountForcastDataList: any;
  paymentForecastColumnDefs = buybackPaymentForecastColumnDefs;
  accountForcastColumnDefs = buybackAccountForecastColumnDefs;
  selectedSubFacility: any;
  updatedParams: any;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  principalForcastDataList;
  @ViewChild('PaymentSummaryAccountForcast') PaymentSummaryAccountForcast;
  facilityTypeDropdown;

  constructor(
    public svc: CommonService,
    private currencyService: CurrencyService,
    public commonSvc: CommonService,
    public componentLoaderSvc: BuybackComponentLoaderService,
    private dashSvc: DashboardService,
    public router: Router,
    public printSer: PrintService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public translateService: TranslateService
  ) {}

  // ngOnInit() {
  //   this.tableId = 'buybackForcast';
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.buyBackDataList = getBuyBackSummaryData(data?.buybackDetails ?? []);

  //     this.dashboardSetterGetterSvc.financialList$
  //       .pipe(take(1))
  //       .subscribe((list) => {
  //         this.buyBackDataList = getBuyBackSummaryData(
  //           list?.buybackDetails ?? []
  //         );
  //         this.selectedSubFacility = this.buyBackDataList[0];
  //       });
  //   });
  //   if (!this.buyBackDataList.length) {
  //     this.router.navigate(['commercial']);
  //     return;
  //   }
  //   this.dashSvc.setFacilityTpe(this.facilityType);
  //   this.currencyService.initializeCurrency();
  //   this.currentComponent = 'BuybackForecast';
  //   this.componentLoaderSvc.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.paramChangeSubject.pipe(debounceTime(300)).subscribe((eventData) => {
  //     this.updatedParams = {
  //       ...eventData,
  //       facilityTypeCFname: FacilityType.FacilityType,
  //       facilityType: FacilityType.Buyback_Group,
  //     };
  //     this.fetchPaymentForecast(this.updatedParams);
  //   });
  //   const params = {
  //     partyId: this.partyId,
  //     subFacilityId: this.selectedSubFacility?.id,
  //     facilityType: FacilityType.Buyback_Group,
  //   };
  //   this.fetchAccountForecast(params);
  //   const principalforecast = {
  //     partyId: this.partyId,
  //     facilityType: FacilityType.Buyback_Group,
  //     subFacilityId: this.buyBackDataList[0]?.id,
  //   };
  //   this.fetchPrincipalForecast(principalforecast);
  //   this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label: FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['Buyback'];
  //   });
  // }

  ngOnInit() {
    this.tableId = 'buybackForcast';

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionBuyback = sessionStorage.getItem('buybackDataList');
    const optionsData = sessionStorage.getItem('optionDataBuyback');

    if (sessionBuyback) {
      this.buyBackDataList = JSON.parse(sessionBuyback);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const buybackDetails = financialData?.buybackDetails ?? [];
      this.buyBackDataList = getBuyBackSummaryData(buybackDetails);

      sessionStorage.setItem(
        'buybackDataList',
        JSON.stringify(this.buyBackDataList)
      );
    }

    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown = optionDataFacilities['Buyback'];
    }

    this.afterBuybackLoad();
  }

  afterBuybackLoad() {
    this.dashSvc.setFacilityTpe(FacilityType.Buyback_Group);

    this.currencyService.initializeCurrency();

    this.selectedSubFacility = this.buyBackDataList[0];
    sessionStorage.setItem(
      'selectedBuybackSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );

    this.currentComponent = 'BuybackForecast';
    this.componentLoaderSvc.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
    });

    this.paramChangeSubject.pipe(debounceTime(300)).subscribe((eventData) => {
      const updatedParams = {
        ...eventData,
        facilityTypeCFname: FacilityType.FacilityType,
        facilityType: FacilityType.Buyback_Group,
      };
      this.fetchPaymentForecast(updatedParams);
    });

    const params = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacility?.id,
      facilityType: FacilityType.Buyback_Group,
    };
    this.fetchAccountForecast(params);

    const principalforecast = {
      partyId: this.partyId,
      facilityType: FacilityType.Buyback_Group,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchPrincipalForecast(principalforecast);

    this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
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
          'optionDataBuyback',
          JSON.stringify(this.optionData)
        );

        this.facilityTypeDropdown = optionDataFacilities['Buyback'];
      }
    });
    const documentParams = { partyId: this.partyId };
    this.fetchDocuments(documentParams);
    const leaseParams = {
      partyId: this.partyId,
      facilityType: FacilityType.Buyback_Group,
      BuybackfacilityType: FacilityType.Buyback_Group,
    };
    this.fetchLeases(leaseParams);
  }

  async fetchPrincipalForecast(params) {
    try {
      this.principalForcastDataList =
        await this.commonApiService.getPaymentForcastPrincipalData(params);
      console.log(
        'this.principalForcastDataList',
        this.principalForcastDataList
      );
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchAccountForecast(params: AccountForecastParams) {
    try {
      this.accountForcastDataList =
        await this.commonApiService.getAccountForcastData(params);
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  callPaymentAPI(eventData) {
    this.fetchPaymentForecast(eventData);
  }

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
  }

  async fetchPaymentForecast(params: PaymentForcastParams) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchLeases(params) {
    try {
      this.leasesDataList = await this.commonApiService.getLeasesData(params);
    } catch (error) {
      console.log('Error while loading facility data', error);
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

  onheaderclick(event) {
    this[event.actionName]();
  }

  onCellClick(event: any) {
    const clickedFacility = event.rowData;
    this.selectedSubFacility = { ...clickedFacility };
    sessionStorage.setItem(
      'selectedBuybackSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );
    const params = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.showBuybackForcastTab();
    this.fetchAccountForecast(params);
    this.paramChangeSubject.next(this.updatedParams);
  }

  showBuybackForcastTab() {
    this.currentComponent = 'BuybackForecast';
    this.componentLoaderSvc.loadComponent('BuybackForecast');
    this.tableId = 'buybackForcast';
  }

  showDocumentsTab() {
    this.currentComponent = 'Documents';

    this.componentLoaderSvc.loadComponent('Documents');
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

  showLeasesTab() {
    this.currentComponent = 'Leases';
    this.componentLoaderSvc.loadComponent('Leases');
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

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }

  onPrint() {
    print();
  }

  export() {
    const dt = this.PaymentSummaryAccountForcast;

    if (!dt) {
      console.error('Data is missing');
      return;
    }

    const workbookData = [];

    // Prepare Account Forecast sheet
    const accountColumns = (dt.accountForcastColumnDefs || []).filter(
      (col) => col.headerName !== 'Action'
    );
    const accountData = dt.accountForcastDataList?.accountForecasts || [];

    if (accountColumns.length && accountData.length) {
      workbookData.push({
        sheetName: 'Account Forecast',
        columns: accountColumns,
        dataList: accountData,
      });
    }

    // Prepare Payment Forecast sheet
    const paymentColumns = (dt.paymentForcastColumnDefs || [])
      .filter((col) => col.headerName !== 'Action')
      .map((col) => ({
        ...col,
        headerName: this.translateService.instant(col.headerName),
      }));
    const paymentData = dt.paymentForcastDataList?.paymentForecasts || [];

    if (paymentColumns.length && paymentData.length) {
      workbookData.push({
        sheetName: 'Payment Forecasts',
        columns: paymentColumns,
        dataList: paymentData,
      });
    }

    // Stop if there's no valid data to export
    if (workbookData.length === 0) {
      console.error('No valid sheets to export');
      return;
    }

    // Call print service to export all sheets into a single workbook
    this.printSer.export('xlsx', this.currentComponent, workbookData);
  }

  onFacilityChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }
}
