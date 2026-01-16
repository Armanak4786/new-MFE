import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonService, CurrencyService } from 'auro-ui';
import { CreditlinesComponentLoaderService } from './services/creditlines-component-loader.service';
import { creditlineFacilityColumnDefs } from './utils/creditline-header-definition';
import { ICreditlineFacilityData } from './interface/creditline.interface';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/services/dashboard.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { clearSession, updateDataList } from '../utils/common-utils';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';

@Component({
  selector: 'app-creditlines',
  templateUrl: './creditlines.component.html',
  styleUrls: ['./creditlines.component.scss'],
})
export class CreditlinesComponent {
  selectedSubFacility;
  options: any;
  data: any;
  platformId = inject(PLATFORM_ID);
  currentComponent: string | null = null;
  assetLinkComponent: string | null = null;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  frequency: any[] = [];
  accountType: string | null = null;
  facilityType: string = FacilityType.CreditLines;
  dataList: any[];
  creditlineFacilityColumnDefs = creditlineFacilityColumnDefs;
  creditlineFacilityDataList: ICreditlineFacilityData[] = [];
  dashboardValue: any;
  partyId: number;
  optionData;
  facilityDataList;
  facilityTypeDropdown;

  constructor(
    private cd: ChangeDetectorRef,
    public svc: CommonService,
    private componentLoaderService: CreditlinesComponentLoaderService,
    public currencyService: CurrencyService,
    public commonSvc: CommonService,
    private dashSvc: DashboardService,
    public router: Router,
    public dashboardSetterGetterSvc: DashboardSetterGetterService,
    public commonSetterGetterSvc: CommonSetterGetterService
  ) {}

  // ngOnInit() {
  //   this.commonSetterGetterSvc.setDisableParty(false);
  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.creditlineFacilityDataList = data?.creditlineDetails ?? [];

  //     if (this.creditlineFacilityDataList.length) {
  //       this.initChart();
  //     } else {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           this.creditlineFacilityDataList = updateDataList(
  //             list?.creditlineDetails ?? [],
  //             FacilityType.Creditline_Group
  //           );
  //           if (this.creditlineFacilityDataList.length > 0) {
  //             const lastItem = this.creditlineFacilityDataList.pop(); // Remove last item
  //             this.creditlineFacilityDataList.unshift(lastItem); // Add it at index 0
  //           }
  //           if (this.creditlineFacilityDataList.length) {
  //             this.initChart();
  //           } else {
  //             this.router.navigate(['commercial']);
  //           }
  //         });
  //     }
  //   });

  //   if (!this.creditlineFacilityDataList.length) {
  //     this.svc.router.navigateByUrl('commercial');
  //     return;
  //   }

  //   this.dashSvc.setFacilityTpe(this.facilityType);

  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   this.initChart();
  //   this.accountType = 'viewCreditline';
  //   this.selectedSubFacility = this.creditlineFacilityDataList[0];
  //   this.componentLoaderService.facilityComponent$.subscribe(
  //     (componentName) => {
  //       this.accountType = componentName;
  //     }
  //   );

  //   this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label: FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['CreditLines'];
  //   });
  // }

  ngOnInit() {
    clearSession([
      'assetlinkDataList',
      'easylinkDataList',
      'selectedEasylinkSubFacility',
      'selectedAssetlinkSubFacility',
      'forecastToDate',
      'forecastFromDate',
      'forecastFrequency',
    ]);
    const partyData = sessionStorage.getItem('currentParty');
    const party = partyData ? JSON.parse(partyData) : null;
    this.partyId = party?.id;

    const sessionCreditline = sessionStorage.getItem(
      'creditlineFacilityDataList'
    );
    const optionsData = sessionStorage.getItem('optionDataCreditline');

    if (sessionCreditline) {
      this.creditlineFacilityDataList = JSON.parse(sessionCreditline);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const creditlineDetails = financialData?.creditlineDetails ?? [];

      this.creditlineFacilityDataList = updateDataList(
        creditlineDetails,
        FacilityType.Creditline_Group
      );

      // if (this.creditlineFacilityDataList.length > 0) {
      //   const lastItem = this.creditlineFacilityDataList.pop();
      //   this.creditlineFacilityDataList.unshift(lastItem);
      // }
    }

    if (optionsData) {
      this.optionData = JSON.parse(optionsData);
      this.facilityTypeDropdown = optionDataFacilities['CreditLines'];
    }

    this.afterCreditlineLoad();
  }

  afterCreditlineLoad() {
    this.initChart();
    this.commonSetterGetterSvc.setDisableParty(false);
    this.dashSvc.setFacilityTpe(this.facilityType);

    sessionStorage.setItem(
      'creditlineFacilityDataList',
      JSON.stringify(this.creditlineFacilityDataList)
    );
    sessionStorage.setItem('currentFacilityType', this.facilityType);

    this.selectedSubFacility = this.creditlineFacilityDataList[0];
    sessionStorage.setItem(
      'selectedCreditlineSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );

    this.accountType = 'viewCreditline';
    this.componentLoaderService.facilityComponent$.subscribe(
      (componentName) => {
        this.accountType = componentName;
      }
    );

    this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
      if (list && list.length > 0) {
        this.facilityDataList = list;

        this.optionData = this.facilityDataList.map((item) => ({
          label: FacilityTypeDropdown[item.value],
          value:
            optionDataFacilities[
              item.label as keyof typeof optionDataFacilities
            ],
        }));

        sessionStorage.setItem(
          'optionDataCreditline',
          JSON.stringify(this.optionData)
        );

        this.facilityTypeDropdown = optionDataFacilities['CreditLines'];
      }
    });
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

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const dataItem = this.creditlineFacilityDataList[0];
      const availableFunds = dataItem.availableFunds;
      const currentBalance = dataItem.currentBalance;
      const total = availableFunds + currentBalance;
      this.data = {
        labels: ['Remaining Limit', 'Current Balance'],

        datasets: [
          {
            data: [availableFunds, currentBalance],
            backgroundColor: ['#07435F', '#0095C3'],
          },
        ],
      };

      this.options = {
        cutout: '66%',
        layout: {
          // padding: {
          //   top: 40,
          //   right: 40,
          //   bottom: 40,
          //   left: 40,
          // },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            bodyFont: {
              size: 12, // 👈 Smaller font size for hover text
            },
            callbacks: {
              label: (context: any) => {
                const value = context.raw;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${value} (${percentage}%)`;
              },
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
  onFrequencyChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }

  onCellClick(event: any) {
    if (!event.cellData || event.cellData.trim() === '') return;
    const clickedFacility = event.rowData;
    this.selectedSubFacility = { ...clickedFacility }; // clone to avoid reference issue
    sessionStorage.setItem(
      'selectedCreditlineSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );
    const componentToLoad =
      clickedFacility.facilityType === 'Current Account'
        ? 'currentAccount'
        : 'creditlineFacility';

    // Always call even if same component
    this.componentLoaderService.loadComponentOnFacilitySelection(null); // Clear it
    setTimeout(() => {
      this.componentLoaderService.loadComponentOnFacilitySelection(
        componentToLoad
      );
    }, 0); // Force a refresh
  }
  ngOnDestroy() {
    clearSession('currentComponent');
  }
}
