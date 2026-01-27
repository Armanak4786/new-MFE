import { Component, Input, ViewChild } from '@angular/core';
import { PaymentSummaryAccountForcastComponent } from '../../../reusable-component/components/payment-summary-account-forcast/payment-summary-account-forcast.component';
import { CommonService, PrintService, ToasterService } from 'auro-ui';
import { AddAssetComponent } from '../../../reusable-component/components/add-asset/add-asset.component';
import { EasylinkComponentLoaderService } from '../../services/easylink-component-loader.service';
import { ReleaseSecurityComponent } from '../../../reusable-component/components/release-security/release-security.component';
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
import {
  easylinkAccountForcastColumnDefs,
  easylinkAssetReleasecolumnDefs,
  easylinkDocumentsColumnDefs,
  easylinkFacilityAssetsColumnDefs,
  easylinkLoansColumnDefs,
  easylinkPaymentForecastColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/easylink-header-util';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AccountForecastParams,
  AssetsParams,
  DocumentByIdParams,
  DocumentsParams,
  LoanParams,
  PaymentForcastParams,
  RequestHistoryParams,
  UploadDocsParams,
} from '../../../utils/common-interface';
import { debounceTime, distinctUntilChanged, Subject, take } from 'rxjs';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DialogService } from 'primeng/dynamicdialog';
import { isEqual } from 'lodash';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { DocumentViewComponent } from '../../../assetlink/components/document-view/document-view.component';
import { FacilityType } from '../../../utils/common-enum';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { DrawdownRequestComponent } from '../../../reusable-component/components/drawdown-request/drawdown-request.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-view-easylink',
  templateUrl: './view-easylink.component.html',
  styleUrl: './view-easylink.component.scss',
})
export class ViewEasylinkComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  @Input() selectedSubFacility;
  facilityType = FacilityType.Easylink;
  currentComponent: string | null = null;
  @ViewChild('PaymentSummaryAccountForcast')
  PaymentSummaryAccountForcast: PaymentSummaryAccountForcastComponent;
  tableId: string;
  accountForcastColumnDefs = easylinkAccountForcastColumnDefs;
  accountForcastDataList;
  paymentForecastColumnDefs = easylinkPaymentForecastColumnDefs;
  paymentForcastDataList;
  loansDataList;
  loansColumnDefs = easylinkLoansColumnDefs;
  facilityAsssetsDatalist;
  columnsFacilityAsset = easylinkFacilityAssetsColumnDefs;
  assetReleasecolumnDefs = easylinkAssetReleasecolumnDefs;
  documentsDataList;
  documentsColumnDefs = easylinkDocumentsColumnDefs;
  assetDetailList;
  partyId: number;
  toDate: string;
  fromDate: string;
  frequency: string;
  paramChangeSubject = new Subject<any>();
  easylinkDataList;
  facilityTypeGroup: string = FacilityType.Easylink_Group;
  principalForcastDataList;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  partyNo: any;
  accessGranted;

  constructor(
    public svc: CommonService,
    private easylinkComponentLoaderService: EasylinkComponentLoaderService,
    public printSer: PrintService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public dialogService: DialogService,
    public toasterService: ToasterService,
    public translateService: TranslateService
  ) {}

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
  //   this.commonSetterGetterSvc.roleBasedActionsData.subscribe((data) => {
  //     const roleData = data?.functions ?? [];
  //     this.accessGranted = roleData.map((fn) => fn.functionName.trim());
  //   });
  //   this.easylinkComponentLoaderService.component$.subscribe(
  //     (componentName) => {
  //       this.currentComponent = componentName;
  //     }
  //   );
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //     this.partyNo = currentParty?.partyNo;
  //   });

  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.easylinkDataList = data?.easyLinkDetails ?? [];

  //     if (!this.easylinkDataList.length) {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           const details = list?.easyLinkDetails ?? [];
  //           this.easylinkDataList = updateDataList(
  //             details,
  //             FacilityType.Easylink_Group
  //           );
  //         });
  //     }
  //   });

  //   this.paramChangeSubject
  //     .pipe(
  //       debounceTime(300),
  //       distinctUntilChanged((prev, curr) => isEqual(prev, curr))
  //     )
  //     .subscribe((eventData) => {
  //       const updatedParams = {
  //         ...eventData,
  //         facilityTypeCFname: FacilityType.FacilityType,
  //         facilityType: FacilityType.Easylink_Group,
  //       };
  //       this.fetchPaymentForecast(updatedParams);
  //     });
  //   const params = {
  //     partyId: this.partyId,
  //     facilityType: this.facilityTypeGroup,
  //     subFacilityId: this.easylinkDataList[0]?.id,
  //   };
  //   this.fetchAccountForecast(params);
  //   const loanParams = {
  //     partyId: this.partyId,
  //     facilityType: this.facilityTypeGroup,
  //   };
  //   this.fetchLoans(loanParams);
  //   const principalforecast = {
  //     partyId: this.partyId,
  //     facilityType: this.facilityTypeGroup,
  //     subFacilityId: this.easylinkDataList[0]?.id,
  //   };
  //   this.fetchPrincipalForecast(principalforecast);
  // }

  ngOnInit() {
    this.tableId = 'PaymentSummaryAccountForcast';
    const storedComponent = sessionStorage.getItem('easylinkCurrentComponent');

   if (sessionStorage.getItem('navigateToLoan')) {
     this.currentComponent = 'Loans';
     sessionStorage.setItem('easylinkCurrentComponent', this.currentComponent);
     sessionStorage.removeItem('navigateToLoan');
   } else if (storedComponent) {
     this.currentComponent = storedComponent;
   } else {
   this.currentComponent = 'PaymentForecast';
   sessionStorage.setItem('easylinkCurrentComponent',this.currentComponent);
   }

    this.commonSetterGetterSvc.navigateToLoan = false;

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

    this.easylinkComponentLoaderService.component$.subscribe(
      (componentName) => {
        this.currentComponent = componentName;
        sessionStorage.setItem('easylinkCurrentComponent', componentName);
      }
    );

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;

    this.partyId = party?.id;
    this.partyNo = party?.partyNo;

    const storedSubFacility = sessionStorage.getItem(
      'selectedEasylinkSubFacility'
    );
    this.selectedSubFacility = storedSubFacility
      ? JSON.parse(storedSubFacility)
      : null;

    const sessionEasylink = sessionStorage.getItem('easylinkDataList');

    if (sessionEasylink) {
      this.easylinkDataList = JSON.parse(sessionEasylink);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const details = financialData?.easyLinkDetails ?? [];

      this.easylinkDataList = updateDataList(
        details,
        FacilityType.Easylink_Group
      );

      sessionStorage.setItem(
        'easylinkDataList',
        JSON.stringify(this.easylinkDataList)
      );
    }
    if (!this.selectedSubFacility) {
      this.selectedSubFacility = this.easylinkDataList[0];
      sessionStorage.setItem(
        'selectedEasylinkSubFacility',
        JSON.stringify(this.selectedSubFacility)
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
          facilityType: FacilityType.Easylink_Group,
        };
        this.fetchPaymentForecast(updatedParams);
      });

    const params = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      subFacilityId: this.selectedSubFacility?.id,
    };

    this.fetchAccountForecast(params);

    this.fetchLoans({
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
    });

    this.fetchPrincipalForecast(params);
    const assetsParams = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      //subFacilityId: this.selectedSubFacility.id,
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

  async fetchPaymentForecast(params: PaymentForcastParams) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  async fetchLoans(params: LoanParams) {
    try {
      this.loansDataList = await this.commonApiService.getLoansData(params);
    } catch (error) {
      console.log('Error while loading loans data', error);
    }
  }

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
  }

  callPaymentAPI(eventData) {
    this.fetchPaymentForecast(eventData);
  }

  async fetchFacilityAssets(params: AssetsParams) {
    try {
      this.facilityAsssetsDatalist = await this.commonApiService.getAssetsData(
        params
      );
    } catch (error) {
      console.log('Error while loading facility assets data', error);
    }
  }

  async fetchAllAssets(params: AssetsParams) {
    try {
      this.assetDetailList = await this.commonApiService.getAssetsData(params);
    } catch (error) {
      console.log('Error while loading facility assets data', error);
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

  showDialogDrawdownRequest() {
    this.svc.dialogSvc
      .show(DrawdownRequestComponent, 'Drawdown Request', {
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

  showDialogAddAsset() {
    this.svc.dialogSvc
      .show(AddAssetComponent, 'Add Asset/s', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
        },
        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  async showDialogReleaseSecurity() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      subFacilityId: this.selectedSubFacility.id,
    };
    await this.fetchAllAssets(params);
    const assetDetailList = this.assetDetailList;
    const assetReleasecolumnDefs = this.assetReleasecolumnDefs;
    const facilityType = this.facilityType;
    this.svc.dialogSvc
      .show(ReleaseSecurityComponent, 'Release Security', {
        templates: {
          footer: null,
        },
        data: { assetDetailList, assetReleasecolumnDefs, facilityType },

        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = filterByFacilityType(
          data,
          FacilityType.Easylink
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

  requestHistory() {
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.easylinkComponentLoaderService.loadComponent('requestHistory');
  }

  showPaymentAndForecast() {
    this.easylinkComponentLoaderService.loadComponent('PaymentForecast');
    this.tableId = 'PaymentSummaryAccountForcast';
  }

  showLoans() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
    };
    this.fetchLoans(params);
    this.easylinkComponentLoaderService.loadComponent('Loans');
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

  showFacilityAssets() {
    this.easylinkComponentLoaderService.loadComponent('FacilityAssets');
  }

  showDocuments() {
    this.easylinkComponentLoaderService.loadComponent('Documents');
  }

  onPrint() {
    if (this.currentComponent === 'PaymentForecast') {
      const paymentData = this.paymentForcastDataList?.paymentForecasts || [];
      const accountData =
        this.accountForcastDataList?.accountForecasts ||
        this.accountForcastDataList ||
        [];

      printMultipleTables(
        this.paymentForecastColumnDefs,
        this.accountForcastColumnDefs,
        paymentData,
        accountData,
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
