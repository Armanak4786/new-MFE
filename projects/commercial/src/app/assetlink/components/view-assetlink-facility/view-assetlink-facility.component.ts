import { Component, ViewChild } from '@angular/core';
import { AddAssetComponent } from '../../../reusable-component/components/add-asset/add-asset.component';
import { CommonService, PrintService, ToasterService } from 'auro-ui';
import { ComponentLoaderService } from '../../services/component-loader.service';
import { PaymentSummaryAccountForcastComponent } from '../../../reusable-component/components/payment-summary-account-forcast/payment-summary-account-forcast.component';
import { ReleaseSecurityComponent } from '../../../reusable-component/components/release-security/release-security.component';
import {
  base64ToBlob,
  buildSheetData,
  clearUploadedDocuments,
  downloadBase64File,
  filterByFacilityType,
  getMimeTypeFromName,
  printMultipleTables,
  transformHistoryData,
  updateDataList,
} from '../../../utils/common-utils';
import { CommonApiService } from '../../../services/common-api.service';
import {
  accountForcastColumnDefs,
  assetlinkAssetReleasecolumnDefs,
  assetlinkDocumentsColumnDefs,
  assetlinkFacilityAssetsColumnDefs,
  assetlinkLoansColumnDefs,
  paymentForecastColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/assetlink-header.util';
import { debounceTime, distinctUntilChanged, Subject, take } from 'rxjs';
import {
  AssetsParams,
  DocumentByIdParams,
  DocumentsParams,
  RequestHistoryParams,
  UploadDocsParams,
} from '../../../utils/common-interface';

import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DocumentViewComponent } from '../document-view/document-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { isEqual } from 'lodash';
import { DocumentsComponent } from '../../../reusable-component/components/documents/documents.component';
import { FacilityType } from '../../../utils/common-enum';
import { DashboardSetterGetterService } from '../../../dashboard/services/dashboard-setter-getter.service';
import { DrawdownRequestComponent } from '../../../reusable-component/components/drawdown-request/drawdown-request.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-view-assetlink-facility',
  templateUrl: './view-assetlink-facility.component.html',
  styleUrls: ['./view-assetlink-facility.component.scss'],
})
export class ViewAssetlinkFacilityComponent {
  @ViewChild(DocumentsComponent) documentsComponent: DocumentsComponent;
  facilityType = FacilityType.Assetlink;
  selectedSubFacility;
  disableDate: boolean = false;
  assetReleasecolumnDefs = assetlinkAssetReleasecolumnDefs;
  currentComponent: string | null = null;
  @ViewChild('PaymentSummaryAccountForcast')
  PaymentSummaryAccountForcast: PaymentSummaryAccountForcastComponent;
  tableId: string;
  accountForcastColumnDefs = accountForcastColumnDefs;
  accountForcastDataList;
  paymentForecastColumnDefs = paymentForecastColumnDefs;
  paymentForcastDataList;
  loansDataList;
  loansColumnDefs = assetlinkLoansColumnDefs;
  columnsFacilityAsset = assetlinkFacilityAssetsColumnDefs;
  facilityAsssetsDatalist;
  documentsDataList;
  releasedataList;
  documentsColumnDefs = assetlinkDocumentsColumnDefs;
  partyId: number;
  partyNo: number;
  toDate: string;
  fromDate: string;
  frequency: string;
  assetDetailList;
  paramChangeSubject = new Subject<any>();
  facilityTypeGroup: string = FacilityType.Assetlink_Group;
  assetlinkDataList;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  principalForcastDataList;
  accessGranted;

  constructor(
    public svc: CommonService,
    private componentLoaderService: ComponentLoaderService,
    public printSer: PrintService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public toasterService: ToasterService,
    public dialogService: DialogService,
    public translateService: TranslateService
  ) {}

  // ngOnInit() {
  // this.tableId = 'PaymentSummaryAccountForcast';
  
  // // Check if there's a stored current component from a previous session
  // const storedComponent = sessionStorage.getItem('currentComponent');
  
  // if (storedComponent) {
  //   // If component exists in session, restore it (for page refresh)
  //   this.currentComponent = storedComponent;
  // } else {
  //   // First time load - default to PaymentForecast
  //   this.currentComponent = 'PaymentForecast';
  //   sessionStorage.setItem('currentComponent', this.currentComponent);
  // }
  
  // // Handle special navigation flag (if navigating from another page to Loans)
  // if (sessionStorage.getItem('navigateToLoan')) {
  //   this.currentComponent = 'Loans';
  //   sessionStorage.setItem('currentComponent', this.currentComponent);
  //   sessionStorage.removeItem('navigateToLoan');
  // }
  
  // const roleBased = JSON.parse(sessionStorage.getItem('RoleBasedActions'));
  // if (
  //   roleBased &&
  //   roleBased.functions &&
  //   typeof roleBased.functions === 'object'
  // ) {
  //   this.accessGranted = Object.keys(roleBased.functions).map((fn) =>
  //     fn.trim()
  //   );
  // } else {
  //   this.accessGranted = [];
  // }
  
  // this.commonSetterGetterSvc.navigateToLoan = false;
  // this.componentLoaderService.component$.subscribe((componentName) => {
  //   this.currentComponent = componentName;
  //   // Store component changes in session for refresh persistence
  //   sessionStorage.setItem('currentComponent', componentName);
  // });
  
  // const partyData = sessionStorage.getItem('currentParty');
  // const partyId = JSON.parse(partyData);
  // this.partyId = partyId?.id;
  // const stored = sessionStorage.getItem('selectedAssetlinkSubFacility');
  // this.selectedSubFacility = stored ? JSON.parse(stored) : [];
  // const sessionAssetLink = sessionStorage.getItem('assetlinkDataList');
  // if (sessionAssetLink) {
  //   this.assetlinkDataList = JSON.parse(sessionAssetLink);
  // }
  //   this.paramChangeSubject
  //     .pipe(
  //       debounceTime(300),
  //       distinctUntilChanged((prev, curr) => isEqual(prev, curr))
  //     )
  //     .subscribe((eventData) => {
  //       const updatedParams = {
  //         ...eventData,
  //         facilityTypeCFname: FacilityType.FacilityType,
  //         facilityType: FacilityType.Assetlink_Group,
  //       };
  //       this.fetchPaymentForecast(updatedParams);
  //     });

  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.assetlinkDataList = data?.assetLinkDetails ?? [];

  //     if (!this.assetlinkDataList.length) {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           const details = list?.assetLinkDetails ?? [];
  //           this.assetlinkDataList = updateDataList(
  //             details,
  //             FacilityType.Assetlink_Group
  //           );
  //         });
  //     }
  //   });

  //   const params = {
  //     partyId: this.partyId,
  //     facilityType: this.facilityTypeGroup,
  //     subFacilityId: this.selectedSubFacility?.id,
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
  //     subFacilityId: this.selectedSubFacility?.id,
  //   };
  //   this.fetchPrincipalForecast(principalforecast);
  //   const documentParams = { partyId: this.partyId };
  //   this.fetchDocuments(documentParams);
  //   const assetParams = {
  //     partyId: this.partyId,
  //     facilityType: FacilityType.Assetlink_Group,
  //     //subFacilityId: this.selectedSubFacility?.id,
  //   };
  //   this.fetchFacilityAssets(assetParams);
  // }
  ngOnInit() {
    this.tableId = 'PaymentSummaryAccountForcast'; 
    const storedComponent = sessionStorage.getItem('facilityCurrentComponent');
    if (sessionStorage.getItem('navigateToLoan')) {
      this.currentComponent = 'Loans';
      sessionStorage.setItem('facilityCurrentComponent', this.currentComponent);
      sessionStorage.removeItem('navigateToLoan');
    } else if (storedComponent) {
      //restore it (for page refresh)
      this.currentComponent = storedComponent;
    } else {
      //default to PaymentForecast
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
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    const stored = sessionStorage.getItem('selectedAssetlinkSubFacility');
    this.selectedSubFacility = stored ? JSON.parse(stored) : [];
    const sessionAssetLink = sessionStorage.getItem('assetlinkDataList');
    if (sessionAssetLink) {
      this.assetlinkDataList = JSON.parse(sessionAssetLink);
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
          facilityType: FacilityType.Assetlink_Group,
        };
        this.fetchPaymentForecast(updatedParams);
      });

    this.commonSetterGetterSvc.financial.subscribe((data) => {
      this.assetlinkDataList = data?.assetLinkDetails ?? [];

      if (!this.assetlinkDataList.length) {
        this.dashboardSetterGetterSvc.financialList$
          .pipe(take(1))
          .subscribe((list) => {
            const details = list?.assetLinkDetails ?? [];
            this.assetlinkDataList = updateDataList(
              details,
              FacilityType.Assetlink_Group
            );
          });
      }
    });

    const params = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchAccountForecast(params);
    const loanParams = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
    };
    this.fetchLoans(loanParams);
    const principalforecast = {
      partyId: this.partyId,
      facilityType: this.facilityTypeGroup,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchPrincipalForecast(principalforecast);
    const documentParams = { partyId: this.partyId };
    this.fetchDocuments(documentParams);
    const assetParams = {
      partyId: this.partyId,
      facilityType: FacilityType.Assetlink_Group,
      //subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchFacilityAssets(assetParams);
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
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }
  async fetchAccountForecast(params) {
    try {
      this.accountForcastDataList =
        await this.commonApiService.getAccountForcastData(params);
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  async fetchPaymentForecast(params) {
    try {
      this.paymentForcastDataList =
        await this.commonApiService.getPaymentForcastData(params);
    } catch (error) {
      console.log('Error while loading payment forcast data', error);
    }
  }

  callPaymentAPI(eventData) {
    this.fetchPaymentForecast(eventData);
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = filterByFacilityType(
          data,
          FacilityType.Assetlink
        );
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
      }
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  async fetchLoans(params) {
    try {
      this.loansDataList = await this.commonApiService.getLoansData(params);
    } catch (error) {
      console.log('Error while loading loans data', error);
    }
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

  async fetchDocumentById(params: DocumentByIdParams) {
    try {
      const document = await this.commonApiService.getDocumentById(params);
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
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

  onParamsChange(eventData) {
    this.paramChangeSubject.next(eventData);
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
        width: '90vw',
      })
      .onClose.subscribe((data: any) => {
        this.closePopup();
      });
  }

  closePopup() {
    this.svc?.dialogSvc?.ref?.close();
  }

  async showDialogReleaseSecurity() {
    const params = {
      partyId: this.partyId,
      facilityType: FacilityType.Assetlink_Group,
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
        data: {
          assetDetailList,
          assetReleasecolumnDefs,
          facilityType,
        },

        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  requestHistory() {
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.componentLoaderService.loadComponent('requestHistory');
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

  showDocuments() {
    this.componentLoaderService.loadComponent('Documents');
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
