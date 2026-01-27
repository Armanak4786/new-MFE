import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService, CurrencyService, PrintService } from 'auro-ui';
import { NonFacilityLoansComponentLoaderService } from '../../services/non-facility-loans-component-loader.service';
import { IFacilityAssetResponse } from '../../interface/non-facility-loan-interface';
import { CommonApiService } from '../../../services/common-api.service';
import {
  LoanParams,
  RequestHistoryParams,
} from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import { FacilityType } from '../../../utils/common-enum';
import { assetlinkLoansColumnDefs } from '../../../assetlink/utils/assetlink-header.util';
import {
  filterByFacilityType,
  transformHistoryData,
} from '../../../utils/common-utils';
import { CreditlineDrawdownRequestComponent } from '../../../creditlines/components/creditline-drawdown-request/creditline-drawdown-request.component';
import {
  facilityColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/non-facility-header-definition';
@Component({
  selector: 'app-reducing-loans',
  templateUrl: './reducing-loans.component.html',
  styleUrl: './reducing-loans.component.scss',
})
export class ReducingLoansComponent {
  @Input() facilityType;
  @Input() selectedSubFacility;
  loansDataList = [];
  loansColumnDefs = assetlinkLoansColumnDefs;
  facilityAsssetsDatalist: IFacilityAssetResponse[] = [];
  columnsFacilityAsset = facilityColumnDefs;
  currentComponent: string | null = null;
  partyId: number;
  facilityValue: number;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  accessGranted;

  constructor(
    public printSer: PrintService,
    private currencyService: CurrencyService,
    public route: ActivatedRoute,
    public commonSvc: CommonService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService,
    private componentLoaderService: NonFacilityLoansComponentLoaderService // public baseSvc: CreditlineDashboardService,
  ) {}
  data: any = [];

  // ngOnInit() {
  //   this.currentComponent = 'Loans';
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
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //     const params = {
  //       partyId: this.partyId,
  //       OperatingLeaseProductGroup: FacilityType.OperatingLease_Group,
  //     };
  //     this.fetchLoans(params);
  //   });
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  // }

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
    const stored = sessionStorage.getItem('selectedNonFacilitySubFacility');
    this.selectedSubFacility = stored ? JSON.parse(stored) : [];
    if (this.partyId) {
      const params = {
        partyId: this.partyId,
        OperatingLeaseProductGroup: FacilityType.OperatingLease_Group,
      };
      this.fetchLoans(params);
    }

    const params = {
      partyId: this.partyId,
      facilityType: FacilityType.Assetlink_Group,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchAssociatedAssets(params);

    this.componentLoaderService.component$.subscribe((componentName) => {
      this.currentComponent = componentName;
    });
  }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  showNewLoanRequest() {
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

  requestHistory() {
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.componentLoaderService.loadComponent('requestHistory');
  }

  async fetchRequestHistory(params: RequestHistoryParams) {
    try {
      const data = await this.commonApiService.getRequestHistoryList(params);
      if (data) {
        this.originalRequestHistoryDatalist = filterByFacilityType(
          data,
          FacilityType.NonFacilityLoan
        );
        this.requestHistoryDataList = transformHistoryData(
          this.originalRequestHistoryDatalist
        );
      }
    } catch (error) {
      console.log('Error while loading account forcast data', error);
    }
  }

  async fetchAssociatedAssets(params) {
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
      this.loansDataList = this.loansDataList.filter(
        (loan) => loan.contractId >= 0
      );
    } catch (error) {
      console.log('Error while loading facility data', error);
    }
  }

  requestSecurity() {
    this.componentLoaderService.loadComponent('requestSecurity');
  }

  showLoansTab() {
    this.componentLoaderService.loadComponent('Loans');
  }

  showAssetsTab() {
    this.componentLoaderService.loadComponent('FacilityAssets');
  }

  showDocuments() {
    this.componentLoaderService.loadComponent('Documents');
  }
}
