import { Component, Input } from '@angular/core';
import { CommonService, PrintService } from 'auro-ui';
import { CreditlinesComponentLoaderService } from '../../services/creditlines-component-loader.service';
import { CreditlineDrawdownRequestComponent } from '../creditline-drawdown-request/creditline-drawdown-request.component';
import {
  facilityColumnDefs,
  loansColumnDefs,
  requestHistoryColumnDefs,
} from '../../utils/creditline-header-definition';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { ILoansResponse } from '../../interface/creditline.interface';
import { CommonApiService } from '../../../services/common-api.service';
import {
  AssetsParams,
  RequestHistoryParams,
} from '../../../utils/common-interface';
import { CommonSetterGetterService } from '../../../services/common-setter-getter/common-setter-getter.service';
import {
  filterByFacilityType,
  transformHistoryData,
} from '../../../utils/common-utils';
import { FacilityType } from '../../../utils/common-enum';
@Component({
  selector: 'app-creditline-facility',
  templateUrl: './creditline-facility.component.html',
  styleUrl: './creditline-facility.component.scss',
})
export class CreditlineFacilityComponent {
  @Input() facilityType;
  @Input() selectedSubFacility;
  currentComponent: string | null = null;
  loansColumnDefs = loansColumnDefs;
  loansDataList: ILoansResponse[] = [];
  tableId: string = '';
  columnsFacilityAsset = facilityColumnDefs;
  partyId: number;
  facilityAsssetsDatalist: any;
  requestHistoryDataList: any;
  originalRequestHistoryDatalist;
  requestHistoryColumnDefs = requestHistoryColumnDefs;
  accessGranted;
  partyNo: any;

  constructor(
    public svc: CommonService,
    private componentLoaderService: CreditlinesComponentLoaderService,
    public printSer: PrintService,
    private dashSvc: DashboardService,
    private commonApiService: CommonApiService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  // ngOnInit() {
  //   this.currentComponent = 'Loans';
  //   this.commonSetterGetterSvc.roleBasedActionsData.subscribe((data) => {
  //     const roleData = data?.functions ?? [];
  //     this.accessGranted = roleData.map((fn) => fn.functionName.trim());
  //   });
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  //   const params = {
  //     partyId: this.partyId,
  //     facilityType: 'CreditLine',
  //     subFacilityId: this.selectedSubFacility.id,
  //   };
  //   this.fetchLoans(params);
  // }

  // ngOnInit() {
  //   const current = sessionStorage.getItem('currentComponent');
  //   this.currentComponent = current ? current : 'loans';
  //   sessionStorage.setItem('currentComponent', this.currentComponent);
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

  //   const partyData = sessionStorage.getItem('currentParty');
  //   const party = partyData ? JSON.parse(partyData) : null;

  //   this.partyId = party?.id;
  //   this.partyNo = party?.partyNo;

  //   const storedSubFacility = sessionStorage.getItem(
  //     'selectedCreditlineSubFacility'
  //   );

  //   if (storedSubFacility) {
  //     this.selectedSubFacility = JSON.parse(storedSubFacility);
  //   } else {
  //     const sessionFinancial = sessionStorage.getItem('financialSummaryData');
  //     const financialData = sessionFinancial
  //       ? JSON.parse(sessionFinancial)
  //       : null;

  //     const creditlinesList = financialData?.creditlinesDataList ?? [];

  //     if (creditlinesList.length) {
  //       this.selectedSubFacility = creditlinesList[0];
  //       sessionStorage.setItem(
  //         'selectedCreditlineSubFacility',
  //         JSON.stringify(this.selectedSubFacility)
  //       );
  //     }
  //   }
  //   const params = {
  //     partyId: this.partyId,
  //     facilityType: 'CreditLine',
  //     subFacilityId: this.selectedSubFacility.id,
  //   };

  //   this.fetchLoans(params);
  //   this.componentLoaderService.component$.subscribe((componentName) => {
  //     this.currentComponent = componentName;
  //   });
  // }
  ngOnInit() {
    const validTabs = ['Loans', 'FacilityAssets', 'requestHistory'];
    this.componentLoaderService.component$.subscribe((componentName) => {
      if (validTabs.includes(componentName)) {
        this.currentComponent = componentName;
        sessionStorage.setItem('subfacilityCurrentComponent', componentName);
      }
    });
    this.facilityType = sessionStorage.getItem('currentFacilityType');
    const storedComponent = sessionStorage.getItem(
      'subfacilityCurrentComponent'
    );
    if (storedComponent) {
      this.currentComponent = storedComponent;
    } else {
      this.currentComponent = 'Loans';
      sessionStorage.setItem('subfacilityCurrentComponent',this.currentComponent);
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
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    this.partyNo = partyId?.partyNo;
    this.selectedSubFacility = JSON.parse(
      sessionStorage.getItem('selectedCreditlineSubFacility')
    );

    // const storedCreditline = JSON.parse(sessionStorage.getItem('creditlineFacilityDataList'));

    // if (storedCreditline && storedCreditline.length > 0) {
    //   this.selectedSubFacility = storedCreditline;
    // } else {
    //  const financialList = JSON.parse(sessionStorage.getItem('financialSummaryData')||'[]');
    //  this.selectedSubFacility = financialList?.creditlinesDataList ?? [];
    // }
    if (this.currentComponent === 'requestHistory') {
      const params = { partyNo: this.partyId };
      this.fetchRequestHistory(params);
    }
    if (this.currentComponent === 'FacilityAssets') {
      const params = {
        partyId: this.partyId,
        subFacilityId: this.selectedSubFacility.id,
      };
      this.fetchFacilityAssets(params);
      }
    if (this.currentComponent === 'Loans') {
    const params = {
      partyId: this.partyId,
      facilityType: 'CreditLine',
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchLoans(params);
    }
  }

  // private fetchLoansForSubFacility(): void {
  //   if (!this.partyId || !this.selectedSubFacility?.id) return;

  //   const params = {
  //     partyId: this.partyId,
  //     facilityType: 'CreditLine',
  //     subFacilityId: this.selectedSubFacility.id,
  //   };

  //   this.fetchLoans(params);
  // }

  hasAccess(key) {
    if (!this.accessGranted || !Array.isArray(this.accessGranted)) {
      return true;
    }
    return !this.accessGranted?.includes(key);
  }

  async fetchLoans(params) {
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
      console.log('Error while loading facility data', error);
    }
  }

  showDialogDrawdownRequest() {
    this.svc.dialogSvc
      .show(CreditlineDrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: {
          newLoan: 'newLoanRequest',
          facilityType: this.facilityType,
          subfacility: this.selectedSubFacility,
        },
        height: '32.396vw',
        width: '78vw',
        contentStyle: { overflow: 'auto' },
        styleClass: 'dialogue-scroll',
        position: 'center',
      })
      .onClose.subscribe((data: any) => {});
  }

  showLoans() {
    this.componentLoaderService.loadComponent('Loans');
    const params = {
      partyId: this.partyId,
      facilityType: 'CreditLine',
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchLoans(params);
  }

  showFacilityAssets() {
    this.componentLoaderService.loadComponent('FacilityAssets');
    const params = {
      partyId: this.partyId,
      facilityType: this.facilityType,
      subFacilityId: this.selectedSubFacility.id,
    };
    this.fetchFacilityAssets(params);
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
}
