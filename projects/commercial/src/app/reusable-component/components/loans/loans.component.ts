import { Component, Input, ViewChild } from '@angular/core';
import { CommonService, GenTableComponent } from 'auro-ui';
import { PrintService } from 'auro-ui';
import { Router } from '@angular/router';
import { ReleaseSecurityComponent } from '../release-security/release-security.component';
import { IFacilityAssetResponse } from '../../../creditlines/interface/creditline.interface';
import { associatedAssetsColumnDefs } from '../../../creditlines/utils/creditline-header-definition';
import { CreditlinesComponentLoaderService } from '../../../creditlines/services/creditlines-component-loader.service';
import { NonFacilityGetterSetterService } from '../../../non-facility-loans/services/non-facility-getter-setter.service';
import { NonFaciltyApiService } from '../../../non-facility-loans/services/non-facilty-api.service';
import {
  afvProductType,
  FacilityType,
  leaseProductType,
  loanProductType,
} from '../../../utils/common-enum';
import { buildSheetData, printTable } from '../../../utils/common-utils';
import { BuybackSetterGetterService } from '../../../buyback/services/buyback-setter-getter.service';
import { CommonApiService } from '../../../services/common-api.service';
import { AssetlinkSetterGetterService } from '../../../assetlink/services/assetlink-setter-getter.service';
import { CreditlineSetterGetterService } from '../../../creditlines/services/creditline-setter-getter.service';
import { EasylinkSetterGetterService } from '../../../easylink/services/easylink-setter-getter.service';
import { OlSetterGetterService } from '../../../operating-lease/services/ol-setter-getter.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { AssociatedAssetsComponent } from '../associated-assets/associated-assets.component';
import { assetlinkAssetReleasecolumnDefs } from '../../../assetlink/utils/assetlink-header.util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
})
export class LoansComponent {
  @Input() selectedSubFacility;
  @Input() facilityType;
  @Input() loansColumnDefs;
  @Input() loansDataList;
  searchLoanErrorMessage = null;
  searchLoan = '';
  searchLabel;
  filteredLoanDataList;
  @ViewChild('dt')
  dt: GenTableComponent;
  tableId: string = 'LoanAssetList';
  selectionMode: any;
  facilityAsssetsDatalist: IFacilityAssetResponse[] = [];
  searchList: any[] = [];
  partyId: number;
  allProducts = [];

  constructor(
    public printSer: PrintService,
    public svc: CommonService,
    public creditService: CreditlinesComponentLoaderService,
    public creditSetterGetter: CreditlineSetterGetterService,
    public olSetterGetterService: OlSetterGetterService,
    public nonFacilityService: NonFacilityGetterSetterService,
    public assetlinkSetterGetterSvc: AssetlinkSetterGetterService,
    public easylinkSetterGetterSvc: EasylinkSetterGetterService,
    public nonFacilityApiSer: NonFaciltyApiService,
    private commonApiService: CommonApiService,
    private buybackSetterGetterSvc: BuybackSetterGetterService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {
    this.filteredLoanDataList = this.loansDataList;
    this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
      this.partyId = currentParty?.id;
    });
    this.commonSetterGetterSvc.allProductsList.subscribe((products) => {
      this.allProducts = products;
    });
    this.searchLabel = this.getSearchLabel();
    this.commonSetterGetterSvc.setFacilityMap(
      this.facilityType,
      this.selectedSubFacility?.facilityType
    );
  }

  getSearchLabel() {
    switch (this.facilityType) {
      case FacilityType.Assetlink:
      case FacilityType.Easylink:
      case FacilityType.CreditLines:
      case FacilityType.NonFacilityLoan:
        return 'Loan ID :';
      case FacilityType.OperatingLease:
      case FacilityType.Buyback:
        return 'Lease ID :';
      default:
        return ' '; // Fallback label
    }
  }

  ngOnChanges(change) {
    if (change['loansDataList'] || change['selectedSubFacility']) {
      this.filteredLoanDataList = change.loansDataList.currentValue;
    }
  }

  async fetchAssociatedAssets(params) {
    try {
      this.facilityAsssetsDatalist = await this.commonApiService.getAssetsData(
        params
      );
      if (
        this.facilityType === FacilityType.NonFacilityLoan ||
        this.facilityType === FacilityType.CreditLines
      ) {
        this.openAssetsPopup();
      } else {
        this.getReleaseSecurityPopup();
      }
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  onCellClick(event) {
    this.commonSetterGetterSvc.setContractIdForSettlementQuote(
      event.rowData.contractId
    );
    if (FacilityType.Assetlink === this.facilityType) {
      this.getAssetlinkEvaluated(event);
    } else if (FacilityType.Easylink === this.facilityType) {
      this.getEasylinkEvaluated(event);
    } else if (FacilityType.CreditLines === this.facilityType) {
      this.getCreditlineEvaluated(event);
    } else if (FacilityType.OperatingLease === this.facilityType) {
      this.getOperatingLeaseEvaluated(event);
    } else if (FacilityType.NonFacilityLoan === this.facilityType) {
      this.getNonFacilityLoansEvaluated(event);
    } else if (FacilityType.Buyback === this.facilityType) {
      this.getBuybackEvaluated(event);
    }
  }

  getAssetlinkEvaluated(event) {
    if (event.colName == 'contractId') {
      this.assetlinkSetterGetterSvc.setLoanData({
        loan: event.rowData,
        currentFacility: this.selectedSubFacility,
      });
      this.svc.router.navigateByUrl(
        `/commercial/assetlink/loan/${event.rowData.contractId}`
      );
    } else if (event.colName == 'associatedAssets') {
      const params = {
        // partyId: this.partyId,
        // facilityType: this.facilityType,
        contractId: event.rowData.contractId,
      };
      this.fetchAssociatedAssets(params);
    }
  }

  getEasylinkEvaluated(event) {
    if (event.colName == 'contractId') {
      this.easylinkSetterGetterSvc.setLoanData({
        loan: event.rowData,
        currentFacility: this.selectedSubFacility,
      });
      this.svc.router.navigateByUrl(
        `commercial/easylink/loan/${event.rowData.contractId}`
      );
    } else if (event.colName == 'associatedAssets') {
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: event.rowData.contractId,
      };
      this.fetchAssociatedAssets(params);
    }
  }

  getBuybackEvaluated(event) {
    if (event.colName == 'leaseId') {
      this.buybackSetterGetterSvc.setLeaseData({
        lease: event.rowData,
        currentFacility: this.selectedSubFacility,
      });
      this.svc.router.navigateByUrl(
        `commercial/buyback/lease/${event.rowData.leaseId}`
      );
    } else if (event.colName == 'associatedAssets') {
      this.getReleaseSecurityPopup();
    }
  }

  getNonFacilityLoansEvaluated(event) {
    let matchedProduct: any;
    matchedProduct = this.allProducts.find(
      (product) => product.name === event.rowData.productType
    );
    if (matchedProduct) {
      event.rowData.productType = matchedProduct.extName;
    }
    if (event.colName == 'contractId') {
      if (loanProductType.includes(matchedProduct?.code)) {
        this.nonFacilityService.setLoansData(event.rowData);
        this.svc.router.navigateByUrl(
          `commercial/non-facility-loan/loan/${event.rowData.contractId}`
        );
      } else if (leaseProductType.includes(matchedProduct?.code)) {
        this.nonFacilityService.setLeaseData({
          lease: event.rowData,
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/non-facility-loan/lease/${event.rowData.contractId}`
        );
      } else if (afvProductType.includes(matchedProduct?.code)) {
        this.nonFacilityService.setAfvLoanData({
          loan: event.rowData,
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/non-facility-loan/afv-loan/${event.rowData.contractId}`
        );
      }
    } else if (event.colName == 'associatedAssets') {
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: event.rowData.contractId,
      };
      this.fetchAssociatedAssets(params);
    }
  }

  reset() {
    this.searchLoan = '';
    this.searchLoanErrorMessage = '';
    this.filteredLoanDataList = [...this.loansDataList];
  }

  getCreditlineEvaluated(event) {
    let matchedProduct: any;
    matchedProduct = this.allProducts.find(
      (product) => product.name === event.rowData.productType
    );
    if (matchedProduct) {
      event.rowData.productType = matchedProduct.extName;
    }
    if (event.colName == 'contractId') {
      if (loanProductType.includes(matchedProduct?.code)) {
        this.creditSetterGetter.setLoansData({
          loan: event.rowData,
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/creditlines/loan/${event.rowData.contractId}`
        );
      } else if (leaseProductType.includes(matchedProduct?.code)) {
        this.creditSetterGetter.setLeaseData({
          lease: event.rowData,
          currentFacility: this.selectedSubFacility,
        });
        this.svc.router.navigateByUrl(
          `commercial/creditlines/lease/${event.rowData.contractId}`
        );
      }
    } else if (event.colName == 'associatedAssets') {
      const params = {
        partyId: this.partyId,
        facilityType: this.facilityType,
        contractId: event.rowData.contractId,
      };
      this.fetchAssociatedAssets(params);
    }
  }

  getOperatingLeaseEvaluated(event) {
    this.olSetterGetterService.setLeaseData(event.rowData);
    if (event.colName == 'leaseId') {
      // this.olSetterGetterService.setLeaseData(event.rowData);
      this.svc.router.navigateByUrl(
        `commercial/operating-lease/lease/${event.rowData.leaseId}`
      );
    }
  }

  getReleaseSecurityPopup() {
    const data1 = this.facilityAsssetsDatalist;
    const data2 = assetlinkAssetReleasecolumnDefs;
    this.svc.dialogSvc
      .show(ReleaseSecurityComponent, 'Release Security', {
        templates: {
          footer: null,
        },
        // data: { data1, data2 },
        data: {
          assetDetailList: data1,
          assetReleasecolumnDefs: data2,
          facilityType: this.facilityType,
        },

        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  openAssetsPopup() {
    const data1 = this.facilityAsssetsDatalist;
    const data2 = associatedAssetsColumnDefs;

    this.svc.dialogSvc
      .show(AssociatedAssetsComponent, 'Associated Assets Details', {
        templates: {
          footer: null,
        },
        data: {
          assetDetailList: data1,
          assetReleasecolumnDefs: data2,
          facilityType: this.facilityType,
        },
        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  onSearchLoan() {
    const searchLoanValue = this.searchLoan?.trim(); // Trim any whitespace

    if (searchLoanValue) {
      // Check if the input contains only numbers
      if (!/^\d+$/.test(searchLoanValue)) {
        this.searchLoanErrorMessage =
          'The provided search loan value must be numeric.';
        this.filteredLoanDataList = []; // Clear previous results on error
      } else {
        this.searchLoanErrorMessage = ''; // Clear previous error message
        this.filteredLoanDataList = this.loansDataList.filter((item) => {
          const contractId = item.contractId?.toString() || '';
          const leaseId = item.leaseId?.toString() || '';
          return (
            contractId.includes(searchLoanValue) ||
            leaseId.includes(searchLoanValue)
          );
        });
      }
    } else {
      this.searchLoanErrorMessage = '';
      this.filteredLoanDataList = this.loansDataList; // Show all if input is empty
    }
  }

  onGetLoanValue(event) {
    this.searchLoan = event;
  }

  onPrint() {
    // Default (Landscape)
    printTable(
      this.loansColumnDefs,
      this.filteredLoanDataList,
      this.translateService
    );
  }

  export() {
    const tableId = this.tableId;
    const dt = this.dt;

    // const { tableId, dt } = this.config.data || {};
    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }
    const workbookData = [];
    //const filteredData = cleanDataList(dt.columns, dt.dataList);
    workbookData.push(
      buildSheetData({
        sheetName: 'Sheet 1',
        columns: dt.columns,
        dataList: dt.dataList,
        translateService: this.translateService,
        excludedFields: ['action'],
      })
    );
    this.printSer.export('xlsx', tableId, workbookData);
  }

  getFacilityTypeLabel(facilityType: string): string {
    if (!facilityType) return '';
    const type = facilityType;
    switch (type) {
      case 'AssetLink':
        return 'Assetlink Facility';
      case 'EasyLink':
        return 'Easylink Facility';
      case 'CreditLines':
        return 'Creditline Facility';
      case 'OperatingLease':
        return 'Operating Lease';
      default:
        return facilityType;
    }
  }
}
