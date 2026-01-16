import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonService, CurrencyService } from 'auro-ui';
import { EasylinkDrawdownRequestComponent } from './components/easylink-drawdown-request/easylink-drawdown-request.component';
import { AddAssetComponent } from '../reusable-component/components/add-asset/add-asset.component';
import { ReleaseSecurityComponent } from '../reusable-component/components/release-security/release-security.component';
import { EasylinkComponentLoaderService } from './services/easylink-component-loader.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { Router } from '@angular/router';
import { easylinkFacilityColumnDefs } from './utils/easylink-header-util';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { clearSession, updateDataList } from '../utils/common-utils';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-easylink',
  templateUrl: './easylink.component.html',
  styleUrls: ['./easylink.component.scss'],
})
export class EasylinkComponent {
  optionData;
  options: any;
  data: any;
  facilityType: string = FacilityType.Easylink;
  platformId = inject(PLATFORM_ID);
  currentFacility: string | null = null;
  assetLinkComponent: string | null = null;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  frequency: any[] = [];
  partyId: number;
  easylinkDataList;
  selectedSubFacility;
  easylinkFacilityColumnDefs = easylinkFacilityColumnDefs;
  facilityDataList;
  facilityTypeDropdown;

  constructor(
    private cd: ChangeDetectorRef,
    public svc: CommonService,
    private componentLoaderService: EasylinkComponentLoaderService,
    private dashSvc: DashboardService,
    public router: Router,
    public commonSetterGetterSvc: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {}

  // ngOnInit() {
  //   clearSession([
  //     'assetlinkDataList',
  //     'selectedAssetlinkSubFacility',
  //     'forecastToDate',
  //     'forecastFromDate',
  //     'forecastFrequency',
  //   ]);
  //   this.commonSetterGetterSvc.setDisableParty(false);
  //   this.commonSetterGetterSvc.party$.subscribe((currentParty) => {
  //     this.partyId = currentParty?.id;
  //   });
  //   //Work-around as was not able to set current account to last position
  //   this.commonSetterGetterSvc.financial.subscribe((data) => {
  //     this.easylinkDataList = data?.easyLinkDetails ?? [];
  //     const currentAccountItems = this.easylinkDataList.filter(
  //       (item) => item.facilityType === 'Current Account'
  //     );
  //     const filteredDataList = this.easylinkDataList.filter(
  //       (item) => item.facilityType !== 'Current Account'
  //     );

  //     this.easylinkDataList = [...filteredDataList, ...currentAccountItems];
  //     if (this.easylinkDataList.length) {
  //       this.initChart();
  //     } else {
  //       this.dashboardSetterGetterSvc.financialList$
  //         .pipe(take(1))
  //         .subscribe((list) => {
  //           if(!list){
  //             const sessionFinancial = sessionStorage.getItem('financialSummaryData');
  //             const financialData = sessionFinancial
  //             ? JSON.parse(sessionFinancial)
  //             : null;
  //             list = financialData || [];
  //             // this.easylinkDataList = financialData?.easyLinkDetails || []
  //           }

  //           this.easylinkDataList = updateDataList(
  //             list?.easyLinkDetails,
  //             FacilityType.Easylink_Group
  //           );
  //           if (this.easylinkDataList.length) {
  //             this.initChart();
  //           } else {
  //             this.router.navigate(['commercial']);
  //           }
  //         });
  //     }
  //   });

  //   if (!this.easylinkDataList.length) {
  //     this.svc.router.navigateByUrl('commercial');
  //     return;
  //   }

  //   this.dashSvc.setFacilityTpe(this.facilityType);
  //   this.currentFacility = 'viewEasylink';
  //   this.selectedSubFacility = this.easylinkDataList[0];
  //   this.componentLoaderService.facilityComponent$.subscribe(
  //     (componentName) => {
  //       this.currentFacility = componentName;
  //     }
  //   );
  //   this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
  //     this.facilityDataList = list;

  //     this.optionData = this.facilityDataList.map((item) => ({
  //       label: FacilityTypeDropdown[item.value],
  //       value:
  //         optionDataFacilities[item.label as keyof typeof optionDataFacilities],
  //     }));

  //     this.facilityTypeDropdown = optionDataFacilities['Easylink'];
  //   });
  // }

  ngOnInit() {
    // Clear unrelated session (same as you had)
    clearSession([
      'assetlinkDataList',
      'selectedAssetlinkSubFacility',
      'forecastToDate',
      'forecastFromDate',
      'forecastFrequency',
    ]);

    this.commonSetterGetterSvc.setDisableParty(false);

    const partyData = sessionStorage.getItem('currentParty');
    this.partyId = partyData ? JSON.parse(partyData)?.id : null;

    const sessionEasylink = sessionStorage.getItem('easylinkDataList');
    const optionsData = sessionStorage.getItem('optionDataEasylink');
    if (optionsData) {
      this.facilityTypeDropdown = optionDataFacilities['Easylink'];
      this.optionData = JSON.parse(optionsData);
    }
    if (sessionEasylink) {
      this.easylinkDataList = JSON.parse(sessionEasylink);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const easylinkDetails = financialData?.easyLinkDetails || [];

      this.easylinkDataList = updateDataList(
        easylinkDetails,
        FacilityType.Easylink_Group
      );

      sessionStorage.setItem(
        'easylinkDataList',
        JSON.stringify(this.easylinkDataList)
      );
    }

    if (!this.easylinkDataList?.length) {
      this.router.navigate(['commercial']);
      return;
    }

    this.initChart();
    this.dashSvc.setFacilityTpe(this.facilityType);

    this.selectedSubFacility = this.easylinkDataList[0];
    sessionStorage.setItem(
      'selectedEasylinkSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );

    this.currentFacility = 'viewEasylink';
    this.componentLoaderService.facilityComponent$.subscribe(
      (componentName) => {
        this.currentFacility = componentName;
      }
    );

    this.commonSetterGetterSvc.facilityList$.subscribe((list) => {
      if (!list?.length) return;

      this.facilityDataList = list;
      this.optionData = this.facilityDataList.map((item) => ({
        label: FacilityTypeDropdown[item.value],
        value:
          optionDataFacilities[item.label as keyof typeof optionDataFacilities],
      }));
      if (this.optionData) {
        sessionStorage.setItem(
          'optionDataEasylink',
          JSON.stringify(this.optionData)
        );
      }

      this.facilityTypeDropdown = optionDataFacilities['Easylink'];
    });
  }

  onheaderclick(event) {
    this[event.actionName]();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const dataItem = this.easylinkDataList[0];
      const availableFunds = dataItem?.availableFunds;
      const currentBalance = dataItem?.currentBalance;

      this.data = {
        labels: ['Available Funds', 'Current Balance'],
        datasets: [
          {
            data: [availableFunds, currentBalance],
            backgroundColor: ['#07435F', '#0095C3'],
          },
        ],
      };

      this.options = {
        cutout: '66%',
        layout: {},
        plugins: {
          legend: {
            display: false,
          },
        },
        tooltip: {
          bodyFont: {
            size: 8, // 👈 Smaller font size for hover text
          },
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              return `${value}`;
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  showDialogDrawdownRequest() {
    this.svc.dialogSvc
      .show(EasylinkDrawdownRequestComponent, 'Drawdown Request', {
        templates: {
          footer: null,
        },
        data: 'easylink',
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

  showDialogReleaseSecurity() {
    this.svc.dialogSvc
      .show(ReleaseSecurityComponent, 'Release Security', {
        templates: {
          footer: null,
        },
        data: '',

        width: '70vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  onCellClick(event: any) {
    if (!event.cellData || event.cellData.trim() === '') return;
    const clickedFacility = event.rowData;
    this.selectedSubFacility = { ...clickedFacility }; // clone to avoid reference issue
    sessionStorage.setItem(
      'selectedEasylinkSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );
    const componentToLoad =
      clickedFacility.facilityType === 'Current Account'
        ? 'currentAccount'
        : 'easylinkFacility';

    // Always call even if same component
    this.componentLoaderService.loadComponentOnFacilitySelection(null); // Clear it
    setTimeout(() => {
      this.componentLoaderService.loadComponentOnFacilitySelection(
        componentToLoad
      );
    }, 0); // Force a refresh
  }

  requestSecurity() {
    this.componentLoaderService.loadComponent('requestSecurity');
  }

  onFrequencyChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }

  ngOnDestroy() {
    clearSession('currentComponent');
  }
}
