import { Component, Input, ViewChild } from '@angular/core';
import { PaymentSummaryAccountForcastComponent } from '../../../reusable-component/components/payment-summary-account-forcast/payment-summary-account-forcast.component';
import { CommonService, PrintService } from 'auro-ui';
import { AddAssetComponent } from '../../../reusable-component/components/add-asset/add-asset.component';
import { ReleaseSecurityComponent } from '../../../reusable-component/components/release-security/release-security.component';
import { EasylinkComponentLoaderService } from '../../services/easylink-component-loader.service';
import { Router } from '@angular/router';
import {
  filterByFacilityType,
  print,
  transformHistoryData,
} from '../../../utils/common-utils';
import { CommonApiService } from '../../../services/common-api.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import {
  easylinkAssetReleasecolumnDefs,
  easylinkFacilityAssetsColumnDefs,
  easylinkLoansColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/easylink-header-util';
import {
  AssetsParams,
  LoanParams,
  RequestHistoryParams,
} from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DrawdownRequestComponent } from '../../../reusable-component/components/drawdown-request/drawdown-request.component';
import { FacilityType } from '../../../utils/common-enum';
@Component({
  selector: 'app-easylink-sub-facility',
  templateUrl: './easylink-sub-facility.component.html',
  styleUrls: ['./easylink-sub-facility.component.scss'],
})
export class EasylinkSubFacilityComponent {
  @Input() selectedSubFacility;
  @Input() facilityType;
  currentComponent: string | null = null;
  @ViewChild('PaymentSummaryAccountForcast')
  PaymentSummaryAccountForcast: PaymentSummaryAccountForcastComponent;
  loansDataList;
  loansColumnDefs = easylinkLoansColumnDefs;
  tableId: string;
  columnsFacilityAsset = easylinkFacilityAssetsColumnDefs;
  facilityAsssetsDatalist;
  assetReleasecolumnDefs = easylinkAssetReleasecolumnDefs;
  releasedataList;
  partyId: number;
  assetDetailList;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  accessGranted;

  constructor(
    public svc: CommonService,
    private easylinkComponentLoaderService: EasylinkComponentLoaderService,
    public printSer: PrintService,
    public router: Router,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  ngOnInit() {
    const current = sessionStorage.getItem('currentComponent');
    this.currentComponent = current ? current : 'Loans';
    sessionStorage.setItem('currentComponent', this.currentComponent);
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
    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;

    this.partyId = party?.id;
    this.easylinkComponentLoaderService.component$.subscribe(
      (componentName) => {
        this.currentComponent = componentName;
      }
    );
    const params = {
      partyId: this.partyId,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchLoans(params);
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  async fetchLoans(params: LoanParams) {
    try {
      this.loansDataList = await this.commonApiService.getLoansData(params);
    } catch (error) {
      console.log('Error while loading facility data', error);
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

  showDialogDrawdownRequest() {
    this.svc.dialogSvc
      .show(DrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: {
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility,
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
        data: '',
        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  async showDialogReleaseSecurity() {
    const AllAssetparams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    await this.fetchAllAssets(AllAssetparams);
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

  requestHistory() {
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.easylinkComponentLoaderService.loadComponent('requestHistory');
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

  showLoans() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchLoans(params);
    this.easylinkComponentLoaderService.loadComponent('Loans');
  }

  showFacilityAssets() {
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchFacilityAssets(params);
    this.easylinkComponentLoaderService.loadComponent('FacilityAssets');
  }

  showDocuments() {
    this.easylinkComponentLoaderService.loadComponent('Documents');
  }

  onPrint() {
    print();
  }

  export() {
    const tableId = this.tableId;
    const dt = this.PaymentSummaryAccountForcast;
    let columns1 = [];
    let data1 = [];
    let columns2 = [];
    let data2 = [];
    if (dt.dt1) {
      columns1 = dt.dt1.columns || [];
      data1 = dt.dt1.dataList || [];
    }
    if (dt.dt2) {
      columns2 = dt.dt2.columns || [];
      data2 = dt.dt2.dataList || [];
    }
    if (!tableId || !dt) {
      console.error('Table ID or data is missing');
      return;
    }

    if (columns1) {
      columns1 = columns1.filter((column) => column.headerName !== 'Action');
      this.printSer.export('xlsx', tableId, columns1, data1);
    }
    if (columns2) {
      columns2 = columns2.filter((column) => column.headerName !== 'Action');
      this.printSer.export('xlsx', tableId, columns2, data2);
    }
  }
}
