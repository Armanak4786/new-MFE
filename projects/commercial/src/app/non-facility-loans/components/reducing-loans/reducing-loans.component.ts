import { Component, Input, OnDestroy } from '@angular/core';
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
import {
  clearSession,
  filterByFacilityType,
  transformHistoryData,
} from '../../../utils/common-utils';
import { CreditlineDrawdownRequestComponent } from '../../../creditlines/components/creditline-drawdown-request/creditline-drawdown-request.component';
import {
  facilityColumnDefs,
  nonFacilityLoansColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/non-facility-header-definition';
@Component({
  selector: 'app-reducing-loans',
  templateUrl: './reducing-loans.component.html',
  styleUrl: './reducing-loans.component.scss',
})
export class ReducingLoansComponent implements OnDestroy {
  @Input() facilityType;
  @Input() selectedSubFacility;
  loansDataList = [];
  loansColumnDefs = nonFacilityLoansColumnDefs;
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
    const validTabs = ['Loans', 'FacilityAssets', 'Documents', 'requestHistory'];
    const storedComponent = sessionStorage.getItem('reducingLoansCurrentComponent');

    if (storedComponent && validTabs.includes(storedComponent)) {
      this.currentComponent = storedComponent;
    } else {
      this.currentComponent = 'Loans';
      sessionStorage.setItem('reducingLoansCurrentComponent', this.currentComponent);
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

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;
    
    const storedFacilityType = sessionStorage.getItem('currentFacilityType');
    this.facilityType = storedFacilityType || this.facilityType;
    
    const stored = sessionStorage.getItem('selectedNonFacilityLoanSubFacility');
    this.selectedSubFacility = stored ? JSON.parse(stored) : this.selectedSubFacility;

    if (this.currentComponent === 'Loans') {
      this.showLoansTab();
    } else if (this.currentComponent === 'FacilityAssets') {
      this.showAssetsTab();
    } else if (this.currentComponent === 'Documents') {
      this.showDocuments();
    } else if (this.currentComponent === 'requestHistory') {
      this.requestHistory();
    }

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
    this.currentComponent = 'requestHistory';
    const params = { partyNo: this.partyId };
    this.fetchRequestHistory(params);
    this.componentLoaderService.loadComponent('requestHistory');
    sessionStorage.setItem('reducingLoansCurrentComponent', this.currentComponent);
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
    this.currentComponent = 'Loans';
    if (this.partyId) {
      const params = {
        partyId: this.partyId,
        OperatingLeaseProductGroup: FacilityType.OperatingLease_Group,
      };
      this.fetchLoans(params);
    }
    this.componentLoaderService.loadComponent('Loans');
    sessionStorage.setItem('reducingLoansCurrentComponent', this.currentComponent);
  }

  showAssetsTab() {
    this.currentComponent = 'FacilityAssets';
    const params = {
      partyId: this.partyId,
      facilityType: FacilityType.Assetlink_Group,
      subFacilityId: this.selectedSubFacility?.id,
    };
    this.fetchAssociatedAssets(params);
    this.componentLoaderService.loadComponent('FacilityAssets');
    sessionStorage.setItem('reducingLoansCurrentComponent', this.currentComponent);
  }

  showDocuments() {
    this.currentComponent = 'Documents';
    this.componentLoaderService.loadComponent('Documents');
    sessionStorage.setItem('reducingLoansCurrentComponent', this.currentComponent);
  }

  ngOnDestroy() {
    clearSession('reducingLoansCurrentComponent');
  }
}
