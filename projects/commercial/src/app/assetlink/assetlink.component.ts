import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonService } from 'auro-ui';
import { ComponentLoaderService } from './services/component-loader.service';
import {
  FacilityType,
  FacilityTypeDropdown,
  optionDataFacilities,
} from '../utils/common-enum';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { Router } from '@angular/router';
import { CommonSetterGetterService } from '../services/common-setter-getter/common-setter-getter.service';
import { DashboardSetterGetterService } from '../dashboard/services/dashboard-setter-getter.service';
import { assetlinkFacilityTypeColumnDefs } from './utils/assetlink-header.util';
import { clearSession, updateDataList } from '../utils/common-utils';

@Component({
  selector: 'app-assetlink',
  templateUrl: './assetlink.component.html',
  styleUrls: ['./assetlink.component.scss'],
})
export class AssetlinkComponent {
  optionData;
  facilityType: string = FacilityType.Assetlink;
  options: any;
  data: any;
  platformId = inject(PLATFORM_ID);
  currentSubFacility: string | null = null;
  accountType: string | null = null;
  assetLinkComponent: string | null = null;
  colors: string[] = ['#07435F', '#0095C3', '#0052B4'];
  frequency: any[] = [];
  selectedSubFacility;
  assetlinkDataList;
  assetlinkFacilityTypeColumnDefs = assetlinkFacilityTypeColumnDefs;
  partyId: number;
  facilityDataList;
  facilityTypeDropdown;
  constructor(
    private cd: ChangeDetectorRef,
    public svc: CommonService,
    private componentLoaderService: ComponentLoaderService,
    private dashSvc: DashboardService,
    public router: Router,
    public commonSetterGetterService: CommonSetterGetterService,
    public dashboardSetterGetterSvc: DashboardSetterGetterService
  ) {}

  ngOnInit() {
    const partyData = sessionStorage.getItem('currentParty');
    const partyId = JSON.parse(partyData);
    this.partyId = partyId?.id;
    const sessionAssetLink = sessionStorage.getItem('assetlinkDataList');
    const optionsData = sessionStorage.getItem('optionDataAssetlink');

    if (sessionAssetLink) {
      this.assetlinkDataList = JSON.parse(sessionAssetLink);
    } else {
      const sessionFinancial = sessionStorage.getItem('financialSummaryData');
      const financialData = sessionFinancial
        ? JSON.parse(sessionFinancial)
        : null;

      const assetLinkDetails = financialData?.assetLinkDetails || [];

      this.assetlinkDataList = updateDataList(
        assetLinkDetails,
        FacilityType.Assetlink_Group
      );
    }
    if (optionsData) {
      this.facilityTypeDropdown = optionDataFacilities['Assetlink'];
      this.optionData = JSON.parse(optionsData);
    }
    this.afterAssetLinkLoad();
  }

  storeAssetLinkAndContinue() {
    sessionStorage.setItem(
      'assetlinkDataList',
      JSON.stringify(this.assetlinkDataList)
    );
    this.afterAssetLinkLoad();
  }

  afterAssetLinkLoad() {
    this.initChart();
    this.commonSetterGetterService.setDisableParty(false);
    this.dashSvc.setFacilityTpe(this.facilityType);
    sessionStorage.setItem('currentFacilityType', this.facilityType);
    this.selectedSubFacility = this.assetlinkDataList[0];
    sessionStorage.setItem(
      'selectedAssetlinkSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );
    this.currentSubFacility = 'viewAssetLink';
    this.componentLoaderService.facilityComponent$.subscribe(
      (componentName) => {
        this.currentSubFacility = componentName;
      }
    );

    this.commonSetterGetterService.facilityList$.subscribe((list) => {
      if (list && list.length > 0) {
        this.facilityDataList = list;
        this.optionData = this.facilityDataList.map((item) => ({
          label: FacilityTypeDropdown[item.value],
          value:
            optionDataFacilities[
              item.label as keyof typeof optionDataFacilities
            ],
        }));
        if (this.optionData) {
          sessionStorage.setItem(
            'optionDataAssetlink',
            JSON.stringify(this.optionData)
          );
        }
        this.facilityTypeDropdown = optionDataFacilities['Assetlink'];
      }
    });
  }

  onheaderclick(event) {
    this[event.actionName]();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const dataItem = this.assetlinkDataList[0];
      const availableFunds = dataItem?.availableFunds;
      const currentBalance = dataItem?.currentBalance;
      const total = availableFunds + currentBalance;

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
        },
      };

      this.cd.markForCheck();
    }
  }

  onCellClick(event: any) {
    if (!event.cellData || event.cellData.trim() === '') return;
    const clickedFacility = event.rowData;
    this.selectedSubFacility = { ...clickedFacility }; // clone to avoid reference issue
    sessionStorage.setItem(
      'selectedAssetlinkSubFacility',
      JSON.stringify(this.selectedSubFacility)
    );
    const componentToLoad =
      clickedFacility.facilityType === 'Current Account'
        ? 'currentAccount'
        : 'assetLinkSubfacility';

    // Always call even if same component
    this.componentLoaderService.loadComponentOnFacilitySelection(null); // Clear it
    setTimeout(() => {
      this.componentLoaderService.loadComponentOnFacilitySelection(
        componentToLoad
      );
    }, 0); // Force a refresh
  }

  onFacilityChange(event) {
    const facilityRoute = event.value;
    if (facilityRoute) {
      this.router.navigate([`commercial/${facilityRoute}`]);
    }
  }

  ngOnDestroy() {
    clearSession('currentComponent');
  }
}
