import {
  CommonService,
  CurrencyService,
  PrintService,
  ToasterService,
} from 'auro-ui';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CreditlinesComponentLoaderService } from '../../services/creditlines-component-loader.service';
import { debounceTime, distinctUntilChanged, map, Subject, take } from 'rxjs';
import {
  IDocuments,
  IFacilityAssetResponse,
  ILoansResponse,
} from '../../interface/creditline.interface';
import { ActivatedRoute } from '@angular/router';
import { CreditlineDashboardService } from '../../services/creditline-dashboard.service';
import {
  accountForecastColumnDefs,
  documentsColumnDefs,
  facilityColumnDefs,
  paymentForecastColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/creditline-header-definition';
import { CreditlineDrawdownRequestComponent } from '../creditline-drawdown-request/creditline-drawdown-request.component';
import { PaymentSummaryAccountForcastComponent } from '../../../reusable-component/components/payment-summary-account-forcast/payment-summary-account-forcast.component';
import {
  AccountForecastParams,
  AssetsParams,
  DocumentByIdParams,
  LoanParams,
  PaymentForcastParams,
  RequestHistoryParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { isEqual } from 'lodash';
import { CommonApiService } from '../../../services/common-api.service';
import {
  base64ToBlob,
  buildSheetData,
  clearUploadedDocuments,
  downloadBase64File,
  filterByFacilityType,
  getMimeTypeFromName,
  print,
  printMultipleTables,
  transformHistoryData,
  updateDataList,
} from '../../../utils/common-utils';
import { CreditlineSetterGetterService } from '../../services/creditline-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { FacilityType } from '../../../utils/common-enum';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { assetlinkLoansColumnDefs } from '../../../assetlink/utils/assetlink-header.util';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-view-creditline',
  templateUrl: './view-creditline.component.html',
  styleUrl: './view-creditline.component.scss',
})
export class ViewCreditlineComponent implements OnInit {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  selectedSubFacility;
  facilityType = FacilityType.CreditLines;
  accountForcastDataList;
  facilityAsssetsDatalist: IFacilityAssetResponse[] = [];
  paymentForcastDataList;
  documentsDataList: IDocuments[] = [];
  loansDataList: ILoansResponse[] = [];
  accountForcastColumnDefs = accountForecastColumnDefs;
  paymentForcastColumnDefs = paymentForecastColumnDefs;
  documentsColumnDefs = documentsColumnDefs;
  columnsFacilityAsset = facilityColumnDefs;
  loansColumnDefs = assetlinkLoansColumnDefs;
  tableId: string = '';
  toDate: string;
  disableDate: boolean = false;
  fromDate: string;
  currentComponent: string | null = null;
  partyId: number;
  frequency: string;
  @ViewChild('PaymentSummaryAccountForcast')
  PaymentSummaryAccountForcast: PaymentSummaryAccountForcastComponent;
  paramChangeSubject = new Subject<any>();
  facilityTypeGroup: string = FacilityType.Creditline_Group;
  creditlineFacilityDataList;
  principalForcastDataList;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  accessGranted;

  constructor(
    private componentLoaderService: CreditlinesComponentLoaderService,
    public printSer: PrintService,
    public route: ActivatedRoute,
    public commonSvc: CommonService,
    public baseSvc: CreditlineDashboardService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public creditSetterGetter: CreditlineSetterGetterService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public translateService: TranslateService
  ) {}
  data: any = [];

  // ngOnInit() {
  //   this.tableId = 'PaymentSummaryAccountForcast';
  //   // Only set default if not navigating from loan dashboard
  //   if (!this.commonSetterGetterSvc.navigateToLoan) {
  //     this.currentComponent = 'PaymentForecast';
  //   } else {
  //     this.currentComponent = 'Loans';
  //   }
  //   // Reset the flag after using
  //   this.commonSetterGetterSvc.navigateToLoan = false;
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   //this.currencyService.initializeCurrency();
  //   if (!this.creditlineFacilityDataList?.length) {
  //     this.dashboardSetterGetterSvc.financialList$
  //       .pipe(take(1))
  //       .subscribe((list) => {
  //         const details = list?.creditlineDetails ?? [];
  //         this.creditlineFacilityDataList = updateDataList(
  //           details,
  //           FacilityType.Creditline_Group
  //         );
  //       });
  //     if (this.creditlineFacilityDataList.length > 0) {
  //       const lastItem = this.creditlineFacilityDataList.pop(); // Remove last item
  //       this.creditlineFacilityDataList.unshift(lastItem); // Add it at index 0
  //     }
  //   }
  //   this.paramChangeSubject
  //     .pipe(
  //       debounceTime(300),
  //       distinctUntilChanged((prev, curr) => isEqual(prev, curr))
  //     )
  //     .subscribe((eventData) => {
  //       const updatedParams = {
  //         ...eventData,
  //         facilityTypeCFname: FacilityType.FacilityType,
  //         facilityType: FacilityType.Creditline_Group,
  //       };
  //       this.fetchPaymentForecast(updatedParams);
  //     });
  //   const params = {
  //     partyId: this.partyId,
  //     facilityType: this.facilityTypeGroup,
  //     subFacilityId: this.creditlineFacilityDataList[0]?.id,
  //   };
  //   this.fetchAccountForecast(params);
  //   const loanParams = {
  //     partyId: this.partyId,
  //     facilityType: FacilityType.Creditline_Group,
  //   };
  //   this.fetchLoans(loanParams);
  //   const principalforecast = {
  //     partyId: this.partyId,
  //     facilityType: this.facilityTypeGroup,
  //     subFacilityId: this.creditlineFacilityDataList[0]?.id,
  //   };
  //   this.fetchPrincipalForecast(principalforecast);
  // }

  ngOnInit() {
    this.tableId = 'PaymentSummaryAccountForcast';

    // if (!sessionStorage.getItem('navigateToLoan')) {
    //   this.currentComponent = 'PaymentForecast';
    // } else {
    //   this.currentComponent = 'Loans';
    //   sessionStorage.removeItem('navigateToLoan');
    // }
    const storedComponent = sessionStorage.getItem('facilityCurrentComponent');
    if (sessionStorage.getItem('navigateToLoan')) {
      this.currentComponent = 'Loans';
      sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
      sessionStorage.removeItem('navigateToLoan');
    } else if (storedComponent) {
      this.currentComponent = storedComponent;
      sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
    } else {
      this.currentComponent = 'PaymentForecast';
      sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
    }
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
    this.commonSetterGetterSvc.navigateToLoan = false;

    this.componentLoaderService.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
      sessionStorage.setItem('facilityCurrentComponent', componentName);
    });

    const partyData = sessionStorage.getItem('currentParty');
    const partyId = partyData ? JSON.parse(partyData) : null;
    this.partyId = partyId?.id;

    const storedSubFacility = sessionStorage.getItem(
      'selectedCreditlineSubFacility'
    );
    this.selectedSubFacility = storedSubFacility
      ? JSON.parse(storedSubFacility)
      : null;

    const sessionCreditline = sessionStorage.getItem(
      'creditlineFacilityDataList'
    );

    if (sessionCreditline) {
      this.creditlineFacilityDataList = JSON.parse(sessionCreditline);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const details = financialData?.creditlineDetails ?? [];

      this.creditlineFacilityDataList = updateDataList(
        details,
        FacilityType.Creditline_Group
      );

      if (this.creditlineFacilityDataList.length > 0) {
        const lastItem = this.creditlineFacilityDataList.pop();
        this.creditlineFacilityDataList.unshift(lastItem);
      }

      sessionStorage.setItem(
        'creditlineFacilityDataList',
        JSON.stringify(this.creditlineFacilityDataList)
      );
    }

    this.paramChangeSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => isEqual(prev, curr))
      )
      .subscribe((eventData) => {
        const updatedParams = {
          ...eventData,
          facilityTypeCFname: FacilityType.FacilityType,
          facilityType: FacilityType.Creditline_Group,
        };
        this.fetchPaymentForecast(updatedParams);
      });

    const params = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      subFacilityId:
        this.selectedSubFacility?.id ??
        this.creditlineFacilityDataList?.[0]?.id,
    };
    this.fetchAccountForecast(params);

    const loanParams = {
      partyId: this.partyId,
      facilityType: FacilityType.Creditline_Group,
    };
    this.fetchLoans(loanParams);

    const principalforecast = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      subFacilityId:
        this.selectedSubFacility?.id ??
        this.creditlineFacilityDataList?.[0]?.id,
    };
    this.fetchPrincipalForecast(principalforecast);
    const assetsParams = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      //subFacilityId: this.creditlineFacilityDataList[0].id,
    };
    this.fetchFacilityAssets(assetsParams);
    const documentParams = { partyId: this.partyId };
    this.fetchDocuments(documentParams);
    if (this.currentComponent === 'requestHistory') {
      const requestParams = { partyNo: this.partyId };
      this.fetchRequestHistory(requestParams);
    }
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
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

  requestHistory() {
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.componentLoaderService.loadComponent('requestHistory');
    this.currentComponent = 'requestHistory';
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = filterByFacilityType(
          data,
          FacilityType.CreditLines
        );
        this.commonSetterGetterSvc.setRequestHistory(
          this.originalRequestHistoryDatalist
        );
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
      }
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
  }

  callPaymentAPI(eventData) {
    this.fetchPaymentForecast(eventData);
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

  async fetchPaymentForecast(params: PaymentForcastParams) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      this.facilityAsssetsDatalist = await this.commonApiService.getAssetsData(
        params
      );
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  async fetchLoans(params: LoanParams) {
    try {
      this.loansDataList = await this.commonApiService.getLoansData(params);
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  showDialogDrawdownRequest() {
    this.commonSvc.dialogSvc
      .show(CreditlineDrawdownRequestComponent, 'New Loan Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility.facilityName,
          loansDataList: this.loansDataList,
        },
        width: '78vw',
      })
      .onClose.subscribe((data: any) => {});
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

  showPaymentAndForecast() {
    this.componentLoaderService.loadComponent('PaymentForecast');
    this.tableId = 'PaymentSummaryAccountForcast';
  }

  showLoans() {
    this.componentLoaderService.loadComponent('Loans');
  }

  showFacilityAssets() {
    this.componentLoaderService.loadComponent('FacilityAssets');
  }

  showDocuments() {
    this.componentLoaderService.loadComponent('Documents');
  }

  onPrint() {
    if (this.currentComponent === 'PaymentForecast') {
      const accountForecasts =
        this.accountForcastDataList?.accountForecasts || [];
      const paymentForecasts =
        this.paymentForcastDataList?.paymentForecasts || [];
      printMultipleTables(
        this.accountForcastColumnDefs,
        this.paymentForcastColumnDefs,
        accountForecasts,
        paymentForecasts,
        this.translateService,
        'portrait'
      );
    }
  }

  export() {
    const dt = this.PaymentSummaryAccountForcast;
    if (!dt) {
      console.error('Data is missing');
      return;
    }

    const workbookData = [];

    if (dt.dt1?.columns && dt.dt1?.dataList) {
      workbookData.push(
        buildSheetData({
          sheetName: 'Account Forcast',
          columns: dt.dt1.columns,
          dataList: dt.dt1.dataList,
          translateService: this.translateService,
        })
      );
    }

    if (dt.dt2?.columns && dt.dt2?.dataList) {
      // Remove 'month' from each row before cleaning
      const dataListWithoutMonth = dt.dt2.dataList.map(
        ({ month, ...rest }) => rest
      );

      workbookData.push(
        buildSheetData({
          sheetName: 'Payment Forcast',
          columns: dt.dt2.columns,
          dataList: dataListWithoutMonth,
          translateService: this.translateService,
          excludedFields: ['month'],
        })
      );
    }

    if (workbookData.length === 0) {
      console.error('No valid sheets to export');
      return;
    }
    this.printSer.export('xlsx', this.currentComponent, workbookData);
  }
}
