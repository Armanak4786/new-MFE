import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonService, CurrencyService } from 'auro-ui';
import { NonFacilityLoansComponentLoaderService } from './services/non-facility-loans-component-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard/services/dashboard.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { take } from 'rxjs';
import { clearSession, updateDataList } from '../utils/common-utils';
import { NonFacilityLoansColumnDefs } from './utils/non-facility-header-definition';
@Component({
  selector: 'app-non-facility-loans',
  templateUrl: './non-facility-loans.component.html',
  styleUrls: ['./non-facility-loans.component.scss'],
})
export class NonFacilityLoansComponent {
  platformId = inject(PLATFORM_ID);
  currentComponent: string | null = null;
  leaseDataList;
  options: any;
  data: any;
  facilityType: string = FacilityType.NonFacilityLoan;
  assetLinkComponent: string | null = null;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  facilityAsssetsDatalist = [];
  dashboardValue: any;
  nonFacilityLoanResponseData = [];
  nonFacilityLoansColumnDefs = NonFacilityLoansColumnDefs;
  userInfo;
  selectedSubFacility;
  partyId: number;
  optionData;
  facilityDataList;
  facilityTypeDropdown;

  constructor(
    public svc: CommonService,
    public commonSvc: CommonService,
    private nonFacilityLoansComponentLoaderService: NonFacilityLoansComponentLoaderService,
    private dashSvc: DashboardService,
    public route: ActivatedRoute,
    public router: Router,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterService: CommonSetterGetterService
  ) { }

  // ngOnInit() {
  //   this.commonSetterGetterService.setDisableParty(false);
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });

  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.nonFacilityLoanResponseData = data?.nonFacilityLoansDetails ?? [];

  //     const currentAccountItems = this.nonFacilityLoanResponseData.filter(
  //       (item) => item.facilityType === 'Current Account'
  //     );
  //     const filteredDataList = this.nonFacilityLoanResponseData.filter(
  //       (item) => item.facilityType !== 'Current Account'
  //     );

  //     this.nonFacilityLoanResponseData = [
  //       ...filteredDataList,
  //       ...currentAccountItems,
  //     ];

  //     if (!this.nonFacilityLoanResponseData.length) {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           const details = list?.nonFacilityLoansDetails ?? [];
  //           this.nonFacilityLoanResponseData = updateDataList(
  //             details,
  //             FacilityType.NonFacilityLoan
  //           );
  //         });
  //     }
  //   });

  //   if (!this.nonFacilityLoanResponseData.length) {
  //     this.router.navigate(['commercial']);
  //     return;
  //   }

  //   this.selectedSubFacility = this.nonFacilityLoanResponseData[0];
  //   this.dashSvc.setFacilityTpe(this.facilityType);
  //   //console.log('facilityType', this.facilityType);
  //   //this.currencyService.initializeCurrency();
  //   this.currentComponent = 'reducingLoans';
  //   this.nonFacilityLoansComponentLoaderService.facilityComponent$.subscribe(
  //     (componentName) => {
  //       this.currentComponent = componentName;
  //     }
  //   );
  //   this.commonSetterGetterService.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label: FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['NonFacilityLoan'];
  //   });
  // }

  ngOnInit() {
    this.commonSetterGetterService.setDisableParty(false);

    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionNonFacility = sessionStorage.getItem(
      'nonFacilityLoanDataList'
    );
    const optionsData = sessionStorage.getItem('optionDataNonFacilityLoan');

    if (sessionNonFacility) {
      this.nonFacilityLoanResponseData = JSON.parse(sessionNonFacility);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const details = financialData?.nonFacilityLoansDetails ?? [];

      let processed = updateDataList(details, FacilityType.NonFacilityLoan);

      const currentAccountItems = processed.filter(
        (item) => item.facilityType === 'Current Account'
      );
      const otherItems = processed.filter(
        (item) => item.facilityType !== 'Current Account'
      );

      this.nonFacilityLoanResponseData = [
        ...otherItems,
        ...currentAccountItems,
      ];

      sessionStorage.setItem(
        'nonFacilityLoanDataList',
        JSON.stringify(this.nonFacilityLoanResponseData)
      );
    }

    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown = optionDataFacilities['NonFacilityLoan'];
    }

    this.afterNonFacilityLoad();
  }

  afterNonFacilityLoad() {
    this.selectedSubFacility = this.nonFacilityLoanResponseData[0];

    sessionStorage.setItem(
      'selectedNonFacilityLoanSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );

    this.dashSvc.setFacilityTpe(this.facilityType);

    this.currentComponent = 'reducingLoans';
    this.nonFacilityLoansComponentLoaderService.facilityComponent$.subscribe(
      (componentName) => {
        this.currentComponent = componentName;
      }
    );

    this.commonSetterGetterService.facilityList$.subscribe((list) => {
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
          'optionDataNonFacilityLoan',
          JSON.stringify(this.optionData)
        );

        this.facilityTypeDropdown = optionDataFacilities['NonFacilityLoan'];
      }
    });
  }

  // onCellClick(event: any) {
  //   if (event.rowData.facilityName !== 'Current Account') {
  //     this.selectedSubFacility = event.rowData;
  //     this.nonFacilityLoansComponentLoaderService.loadComponentOnFacilitySelection(
  //       'reducingLoans'
  //     );
  //   } else {
  //     this.selectedSubFacility = event.rowData;
  //     this.nonFacilityLoansComponentLoaderService.loadComponentOnFacilitySelection(
  //       'currentAccount'
  //     );
  //   }
  // }

  onCellClick(event: any) {
    if (!event?.cellData || event.cellData.trim() === '') return;

    const clickedFacility = event.rowData;

    // Clone to avoid reference mutation
    this.selectedSubFacility = { ...clickedFacility };

    // Store in session for refresh / navigation
    sessionStorage.setItem(
      'selectedNonFacilitySubFacility',
      JSON.stringify(this.selectedSubFacility)
    );

    // Decide component
    const componentToLoad =
      clickedFacility.facilityType === 'Current Account'
        ? 'currentAccount'
        : 'reducingLoans';

    // Force reload even if same component
    this.nonFacilityLoansComponentLoaderService.loadComponentOnFacilitySelection(
      null
    );

    setTimeout(() => {
      this.nonFacilityLoansComponentLoaderService.loadComponentOnFacilitySelection(
        componentToLoad
      );
    }, 0);
  }

  onheaderclick(event) {
    this[event.actionName]();
  }
  facilityChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }

  ngOnDestroy() {
    clearSession('currentComponent');
  }
}
