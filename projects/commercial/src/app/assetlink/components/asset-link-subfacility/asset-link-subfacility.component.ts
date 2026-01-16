import { Component, Input } from '@angular/core';
import { AddAssetComponent } from '../../../reusable-component/components/add-asset/add-asset.component';
import { CommonService } from 'auro-ui';
import { ComponentLoaderService } from '../../services/component-loader.service';
import { PrintService } from 'auro-ui';
import { ReleaseSecurityComponent } from '../../../reusable-component/components/release-security/release-security.component';
import {
  filterByFacilityType,
  print,
  transformHistoryData,
} from '../../../utils/common-utils';
import {
  assetlinkAssetReleasecolumnDefs,
  assetlinkFacilityAssetsColumnDefs,
  assetlinkLoansColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/assetlink-header.util';
import {
  AssetsParams,
  LoanParams,
  RequestHistoryParams,
} from '../../../utils/common-interface';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { DrawdownRequestComponent } from '../../../reusable-component/components/drawdown-request/drawdown-request.component';
import { FacilityType } from '../../../utils/common-enum';
@Component({
  selector: 'app-asset-link-subfacility',
  templateUrl: './asset-link-subfacility.component.html',
  styleUrls: ['./asset-link-subfacility.component.scss'],
})
export class AssetLinkSubfacilityComponent {
  selectedSubFacility;
  facilityType = FacilityType.Assetlink;
  assetReleasecolumnDefs = assetlinkAssetReleasecolumnDefs;
  currentComponent: string | null = null;
  loansDataList;
  loansColumnDefs = assetlinkLoansColumnDefs;
  tableId: string;
  columnsFacilityAsset = assetlinkFacilityAssetsColumnDefs;
  facilityAsssetsDatalist;
  assetDetailList;
  partyId: number;
  assetlinkDataList;
  subfacilityType;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  partyNo: any;
  accessGranted;

  constructor(
    public svc: CommonService,
    private componentLoaderService: ComponentLoaderService,
    public printSer: PrintService,
    private commonApiService: CommonApiService,
    public commonSetterGetterService: CommonSetterGetterService
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
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    this.partyNo = partyId?.partyNo;

    const storedAssetlink = JSON.parse(sessionStorage.getItem('assetlinkData'));

    if (storedAssetlink && storedAssetlink.length > 0) {
      this.assetlinkDataList = storedAssetlink;
      this.initializeSubFacilityAndFetch();
    } else {
      this.commonSetterGetterService.financial.subscribe((data) => {
        this.assetlinkDataList = data?.assetLinkDetails ?? [];

        this.initializeSubFacilityAndFetch();
      });
    }

    this.componentLoaderService.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
    });
  }

  initializeSubFacilityAndFetch() {
    if (!this.assetlinkDataList?.length) return;

    // set default selected subfacility
    this.selectedSubFacility = sessionStorage.getItem('selectedSubFacility')
      ? JSON.parse(sessionStorage.getItem('selectedSubFacility'))
      : this.assetlinkDataList[0];

    // prepare params
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
          subfacilityType: this.subfacilityType,
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
          subfacility: this.selectedSubFacility,
        },
        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  async showDialogReleaseSecurity() {
    const AllAssetParams = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    await this.fetchAllAssets(AllAssetParams);
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

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      this.originalRequestHistoryDatalist = filterByFacilityType(
        data,
        FacilityType.Assetlink
      );
      this.commonSetterGetterService.setRequestHistory(
        this.originalRequestHistoryDatalist
      );
      this.requestHistoryDataList = transformHistoryData(
        this.originalRequestHistoryDatalist
      );
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  showLoans() {
    const params = {
      partyId: this.partyId,
      // facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchLoans(params);
    this.componentLoaderService.loadComponent('Loans');
  }

  showFacilityAssets() {
    this.currentComponent = 'FacilityAssets';
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchFacilityAssets(params);
    this.componentLoaderService.loadComponent('FacilityAssets');
  }

  onPrint() {
    print();
  }
}
