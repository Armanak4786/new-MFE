import { Component, OnInit, Injector, effect } from '@angular/core';
import { BaseStandardQuoteClass } from '../../../standard-quote/base-standard-quote.class';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'auro-ui';
import { StandardQuoteService } from '../../../standard-quote/services/standard-quote.service';
import { DashboardService } from '../../services/dashboard.service';

// type AverageSalesMetric = 'averageSalesPrice' | 'averageCommission' | 'averageAmountFinanced';
type AverageSalesMetric ='averageAmountFinanced'|  'averageCommission' ;

@Component({
  selector: 'app-average-sales',
  templateUrl: './average-sales.component.html',
  styleUrl: './average-sales.component.scss',
})
export class AverageSalesComponent extends BaseStandardQuoteClass implements OnInit {
  override data: any;
  userRole: any = {};
  options: any;
  marginValue: number = 0;
  totalFees: number = 0;
  totalCommission: number = 0;
  private currentDealerNo?: number;
  private yearInitializedForDealerNo?: number;
  private isYearInitializedFromApi = false;

  private readonly labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private readonly monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  
  // Dropdown options for average sales price chart
  averageSalesOptions = [
    // { name: 'Average Sales Price', code: 'averageSalesPrice' },
    { name: 'Average Amount Financed', code: 'averageAmountFinanced' },
    { name: 'Average Commission', code: 'averageCommission' }
  ];
  selectedAverageSalesOption = this.averageSalesOptions[0];
  
  private apiResponse: any;
  private documentStyle: CSSStyleDeclaration;
  year = 2025;

  // Time filter dropdown options for chart
  timeFilterOptions = [
    { name: 'Today', code: 'Today' },
    { name: 'Month', code: 'Month' },
    { name: 'Year', code: 'Year' }
  ];
  selectedTimeFilter = this.timeFilterOptions[2]; // Default to 'Year'

  time = 'Year';
  items = [{ name: 'YTD', code: 'YTD' }];
  commions = [{ name: 'MTD', code: 'MTD' }];

  // Fees and Commission time filter
  feesCommissionTimeOptions = [
    { name: 'YTD', code: 'YTD' },
    { name: 'MTD', code: 'MTD' }
  ];
  selectedFeesCommissionTime = this.feesCommissionTimeOptions[0]; // Default to YTD (Fees & Commission card)

  // Margins time filter (separate from Fees & Commission)
  selectedMarginsTime = this.feesCommissionTimeOptions[0]; // Default to YTD (Margins card)

  constructor(
    public override route: ActivatedRoute, 
    public override svc: CommonService, 
    override baseSvc: StandardQuoteService,
    private dashboardService: DashboardService,
    private injector: Injector
  ) {
    super(route, svc, baseSvc);
    
    effect(() => {
      const selectedDealer = this.dashboardService.onOriginatorChange();
      const userCode = this.dashboardService.getUserCode();
      if (selectedDealer && selectedDealer.num && userCode) {
        this.loadChartData(selectedDealer.num, userCode);
        this.loadFeesCommissionData(selectedDealer.num, userCode);
        this.loadMarginsData(selectedDealer.num, userCode);
      }
    }, { injector: this.injector });
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");
    this.documentStyle = getComputedStyle(document.documentElement);
    this.initChartOptions();
    this.initDefaultChartData();
  }

  private initChartOptions() {
    const textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');
    const currencyAxisFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    const currencyTooltipFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const datasetLabel = context?.dataset?.label ? `${context.dataset.label}: ` : '';
              const yValue = context?.parsed?.y;
              const numericY = typeof yValue === 'number' ? yValue : Number(yValue);
              if (Number.isFinite(numericY)) {
                return `${datasetLabel}$${currencyTooltipFormatter.format(numericY)}`;
              }
              return `${datasetLabel}$0.00`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          ticks: {            
            color: textColorSecondary,
            callback: (value: any) => {
              const numeric = typeof value === 'number' ? value : Number(value);
              if (!Number.isFinite(numeric)) return '$0';
              return `$${currencyAxisFormatter.format(numeric)}`;
            }
          },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    };
  }

  private initDefaultChartData() {
    // Initialize with empty chart data
    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Average Sales Price',
          data: new Array(12).fill(0),
          fill: false,
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };
  }

  onAverageSalesOptionChange() {
    if (this.apiResponse) {
      this.updateChartData();
    }
  }

  onTimeFilterChange() {
    this.loadChartData();
  }

  increment() {
    this.year++;
    this.loadChartData();
  }

  decrement() {
    this.year--;
    this.loadChartData();
  }

  private getTimeFilterValue(): number {
    switch (this.selectedTimeFilter.code) {
      case 'Today': return 0;
      case 'Month': return 1;
      case 'Year': return 2;
      default: return 2;
    }
  }

  private updateChartData() {
    const metric = this.selectedAverageSalesOption.code as AverageSalesMetric;
    this.data = this.mapToChartData(this.apiResponse, this.year, metric, this.documentStyle);
  }

  loadChartData(dealerNum?: number, userCode?: string) {
    if (!dealerNum) dealerNum = this.dashboardService.onOriginatorChange()?.num;
    if (!userCode) userCode = this.dashboardService.getUserCode();
    if (!dealerNum || !userCode) return;

    if (this.yearInitializedForDealerNo !== dealerNum) {
      this.yearInitializedForDealerNo = dealerNum;
      this.isYearInitializedFromApi = false;
    }
    this.currentDealerNo = dealerNum;

    if (!this.documentStyle) {
      this.documentStyle = getComputedStyle(document.documentElement);
    }

    const payload = {
      userId: userCode,
      dealerId: dealerNum,
      year: this.getTimeFilterValue()
    };

    this.dashboardService.getMonthlyVolumesOnce(payload).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.initializeYearFromApiOnce(response);
        this.updateChartData();
      },
      error: (err) => {
        console.error('Failed to load chart data', err);
      }
    });
  }

  private initializeYearFromApiOnce(apiResponse: any) {
    if (this.isYearInitializedFromApi) return;

    const firstYearRaw = apiResponse?.data?.[0]?.year;
    const firstYear = typeof firstYearRaw === 'number' ? firstYearRaw : Number(firstYearRaw);
    if (Number.isFinite(firstYear)) {
      this.year = firstYear;
      this.isYearInitializedFromApi = true;
    }
  }

  loadFeesCommissionData(dealerNum?: number, userCode?: string) {
    if (!dealerNum) dealerNum = this.dashboardService.onOriginatorChange()?.num;
    if (!userCode) userCode = this.dashboardService.getUserCode();
    if (!dealerNum || !userCode) return;
    this.currentDealerNo = dealerNum;

    const payload = {
      userId: userCode,
      dealerId: dealerNum,
      year: this.getFeesCommissionTimeValue()
    };

    this.dashboardService.getMonthlyVolumesOnce(payload).subscribe({
      next: (response) => {
        this.totalFees = this.mapToTotalFeesData(response);
        this.totalCommission = this.mapToTotalCommissionData(response);
      },
      error: (err) => {
        console.error('Failed to load fees/commission data', err);
      }
    });
  }

  onFeesCommissionTimeChange() {
    this.loadFeesCommissionData();
  }

  private getFeesCommissionTimeValue(): number {
    // MTD = 1 (Month), YTD = 2 (Year)
    return this.selectedFeesCommissionTime.code === 'MTD' ? 1 : 2;
  }

  loadMarginsData(dealerNum?: number, userCode?: string) {
    if (!dealerNum) dealerNum = this.dashboardService.onOriginatorChange()?.num;
    if (!userCode) userCode = this.dashboardService.getUserCode();
    if (!dealerNum || !userCode) return;
    this.currentDealerNo = dealerNum;

    const payload = {
      userId: userCode,
      dealerId: dealerNum,
      year: this.getMarginsTimeValue()
    };

    this.dashboardService.getMonthlyVolumesOnce(payload).subscribe({
      next: (response) => {
        this.marginValue = this.mapToMarginData(response);
      },
      error: (err) => {
        console.error('Failed to load margins data', err);
      }
    });
  }

  onMarginsTimeChange() {
    this.loadMarginsData();
  }

  private getMarginsTimeValue(): number {
    // MTD = 1 (Month), YTD = 2 (Year)
    return this.selectedMarginsTime.code === 'MTD' ? 1 : 2;
  }

  private pickYearEntry(apiResponse: any, selectedYear: number): any | null {
    const data = apiResponse?.data;
    if (!Array.isArray(data) || data.length === 0) return null;

    const dealerNo = this.currentDealerNo;
    const matching = data.filter((x: any) => x?.year === selectedYear);
    if (matching.length === 0) return null;

    if (dealerNo != null) {
      const dealerMatch = matching.find((x: any) => x?.dealerNo === dealerNo);
      if (dealerMatch) return dealerMatch;
    }

    return matching[0] || null;
  }

  private pickLatestEntry(apiResponse: any): any | null {
    const data = apiResponse?.data;
    if (!Array.isArray(data) || data.length === 0) return null;

    const dealerNo = this.currentDealerNo;
    const dealerData = dealerNo != null ? data.filter((x: any) => x?.dealerNo === dealerNo) : data;
    if (!Array.isArray(dealerData) || dealerData.length === 0) return null;

    let best = dealerData[0];
    for (const item of dealerData) {
      const bestYear = typeof best?.year === 'number' ? best.year : Number(best?.year);
      const itemYear = typeof item?.year === 'number' ? item.year : Number(item?.year);
      if (Number.isFinite(itemYear) && (!Number.isFinite(bestYear) || itemYear > bestYear)) {
        best = item;
      }
    }
    return best || null;
  }

  private mapToChartData(apiResponse: any, selectedYear: number, metric: AverageSalesMetric, documentStyle: CSSStyleDeclaration): any {
    const chartData = new Array(12).fill(0);

    const yearEntry = this.pickYearEntry(apiResponse, selectedYear);
    const monthlyGraphData = yearEntry?.monthlyGraphData;
    if (Array.isArray(monthlyGraphData)) {
      monthlyGraphData.forEach((monthItem: any) => {
        const monthIndex = this.monthMap[monthItem?.month];
        if (monthIndex === undefined) return;

        const contractCountRaw = monthItem?.monthlyVolumeDetails?.totalContractCount;
        const contractCount = typeof contractCountRaw === 'number' ? contractCountRaw : Number(contractCountRaw);
        const safeContractCount = Number.isFinite(contractCount) && contractCount > 0 ? contractCount : 0;

        switch (metric) {
          // case 'averageSalesPrice': {
          //   const avgRaw = monthItem?.averageData?.averageSalePrice;
          //   const avg = typeof avgRaw === 'number' ? avgRaw : Number(avgRaw);
          //   chartData[monthIndex] = Number.isFinite(avg) ? avg : 0;
          //   break;
          // }
          case 'averageCommission': {
            const avgRaw = monthItem?.averageData?.averageCommission;
            const avg = typeof avgRaw === 'number' ? avgRaw : Number(avgRaw);
            chartData[monthIndex] = Number.isFinite(avg) ? avg : 0;
            break;
          }
          case 'averageAmountFinanced': {
            // Not provided as an explicit average in the latest response; compute from totals.
            const totalRaw = monthItem?.monthlyVolumeDetails?.totalAmountFinanced;
            const total = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw);
            chartData[monthIndex] =
              Number.isFinite(total) && safeContractCount > 0 ? total / safeContractCount : 0;
            break;
          }
        }
      });
    }

    return {
      labels: this.labels,
      datasets: [
        {
          label: this.getMetricLabel(metric),
          data: chartData,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };
  }

  private getMetricLabel(metric: AverageSalesMetric): string {
    switch (metric) {
      // case 'averageSalesPrice':
      //   return 'Average Sales Price';
      case 'averageCommission':
        return 'Average Commission';
      case 'averageAmountFinanced':
        return 'Average Amount Financed';
      default:
        return '';
    }
  }

  private mapToMarginData(apiResponse: any): number {
    const entry = this.pickLatestEntry(apiResponse);
    const totalMarginRaw = entry?.totalMargin;
    const totalMargin = typeof totalMarginRaw === 'number' ? totalMarginRaw : Number(totalMarginRaw);
    if (Number.isFinite(totalMargin)) return totalMargin;
    const yearEntry = this.pickYearEntry(apiResponse, this.year);
    const monthlyGraphData = yearEntry?.monthlyGraphData;
    if (Array.isArray(monthlyGraphData) && monthlyGraphData.length > 0) {
      let sum = 0;
      monthlyGraphData.forEach((monthItem: any) => {
        const marginRaw = monthItem?.marginAndFees?.margine;
        const margin = typeof marginRaw === 'number' ? marginRaw : Number(marginRaw);
        if (Number.isFinite(margin)) sum += margin;
      });
      return sum;
    }

    return 0;
  }

  private mapToTotalFeesData(apiResponse: any): number {
    const entry = this.pickLatestEntry(apiResponse);
    const totalFeesRaw = entry?.totalFess;
    const totalFees = typeof totalFeesRaw === 'number' ? totalFeesRaw : Number(totalFeesRaw);
    if (Number.isFinite(totalFees)) return totalFees;

    // Backwards-compatible fallback: sum monthly fees if totals are not present.
    const yearEntry = this.pickYearEntry(apiResponse, this.year);
    const monthlyGraphData = yearEntry?.monthlyGraphData;
    if (Array.isArray(monthlyGraphData) && monthlyGraphData.length > 0) {
      let sum = 0;
      monthlyGraphData.forEach((monthItem: any) => {
        const feesRaw = monthItem?.marginAndFees?.fees;
        const fees = typeof feesRaw === 'number' ? feesRaw : Number(feesRaw);
        if (Number.isFinite(fees)) sum += fees;
      });
      return sum;
    }

    return 0;
  }

  private mapToTotalCommissionData(apiResponse: any): number {
    const entry = this.pickLatestEntry(apiResponse);
    const totalCommissionRaw = entry?.totalCommission;
    const totalCommission = typeof totalCommissionRaw === 'number' ? totalCommissionRaw : Number(totalCommissionRaw);
    if (Number.isFinite(totalCommission)) return totalCommission;

    const yearEntry = this.pickYearEntry(apiResponse, this.year);
    const monthlyGraphData = yearEntry?.monthlyGraphData;
    if (Array.isArray(monthlyGraphData) && monthlyGraphData.length > 0) {
      let sum = 0;
      monthlyGraphData.forEach((monthItem: any) => {
        const commissionRaw = monthItem?.marginAndFees?.commisionFee;
        const commission = typeof commissionRaw === 'number' ? commissionRaw : Number(commissionRaw);
        if (Number.isFinite(commission)) sum += commission;
      });
      return sum;
    }

    return 0;
  }
  
}
