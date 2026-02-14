import { Component, OnInit, Injector, effect } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-monthly-volumes',
  templateUrl: './monthly-volumes.component.html',
  styleUrl: './monthly-volumes.component.scss',
})
export class MonthlyVolumesComponent implements OnInit {
  data: any;
  options: any;
  private currentDealerNo?: number;
  private yearInitializedForDealerNo?: number;
  private isYearInitializedFromApi = false;

  private readonly labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private readonly monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  
  timeFilterOptions = [
    { name: 'Today', code: 'Today' },
    { name: 'Month', code: 'Month' },
    { name: 'Year', code: 'Year' },
  ];
  selectedTimeFilter = this.timeFilterOptions[2]; // Default to 'Year'
  year = 2025;

  private documentStyle: CSSStyleDeclaration;

  constructor(
    private dashboardService: DashboardService,
    private injector: Injector
  ) {
    effect(() => {
      const selectedDealer = this.dashboardService.onOriginatorChange();
      const userCode = this.dashboardService.getUserCode();
      if (selectedDealer && selectedDealer.num && userCode) {
        void this.loadData(selectedDealer.num, userCode);
      }
    }, { injector: this.injector });
  }

  ngOnInit(): void {
    this.documentStyle = getComputedStyle(document.documentElement);
    this.initChartOptions();
  }

  async loadData(dealerNum?: number, userCode?: string) {
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

    const timeFilter = this.getTimeFilterValue();

    const payload = {
      userId: userCode,
      dealerId: dealerNum,
      year: timeFilter
    };

    try {
      const response = await this.dashboardService.getMonthlyVolumesOnceAsync(payload);
      this.initializeYearFromApiOnce(response);
      this.data = this.mapToChartData(response, this.year, this.documentStyle);
    } catch {
      // handled by global interceptors / UI state remains unchanged
    }
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


  increment() {
    this.year++;
    this.loadData(); 
  }

  decrement() {
    this.year--;
    this.loadData();
  }
  
  onTimeFilterChange() {
    this.loadData();
  }

  save() {}

  private getTimeFilterValue(): number {
    switch (this.selectedTimeFilter?.code) {
      case 'Today': return 0;
      case 'Month': return 1;
      case 'Year': return 2;
      default: return 2;
    }
  }

  private initChartOptions() {
    const textColor = this.documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');
    const currencyAxisFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    const currencyTooltipFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const countAxisFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false, position: 'right', align: 'start' },
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const datasetLabel = context?.dataset?.label ? `${context.dataset.label}: ` : '';
              const yValue = context?.parsed?.y;
              const numericY = typeof yValue === 'number' ? yValue : Number(yValue);
              const isCurrency = context?.dataset?.yAxisID === 'y' || /amount|financed|\$/i.test(context?.dataset?.label || '');

              if (!Number.isFinite(numericY)) {
                return isCurrency ? `${datasetLabel}$0.00` : `${datasetLabel}0`;
              }
              return isCurrency
                ? `${datasetLabel}$${currencyTooltipFormatter.format(numericY)}`
                : `${datasetLabel}${countAxisFormatter.format(numericY)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxTicksLimit: 12,
            color: textColorSecondary,
            font: { size: 10, weight: 500 },
            padding: 0,
            maxRotation: 0,
            minRotation: 0,
          },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          position: 'left',
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
        y1: {
          position: 'right',
          // ticks: {
          //   color: textColorSecondary,
          //   callback: (value: any) => {
          //     const numeric = typeof value === 'number' ? value : Number(value);
          //     if (!Number.isFinite(numeric)) return '0';
          //     return countAxisFormatter.format(numeric);
          //   }
          // },
          beginAtZero: true,
          ticks:{
            stepSize: 1,
            precision: 0,
            callback: (v) => String(v),
          },
          grid: { drawOnChartArea: false, drawBorder: false },
        }
      },
    };
  }

  private mapToChartData(apiResponse: any, selectedYear: number, documentStyle: CSSStyleDeclaration): any {
    const amountFinancedData = new Array(12).fill(0);
    const loanCountData = new Array(12).fill(0);

    const data = apiResponse?.data;
    if (Array.isArray(data) && data.length > 0) {
      const dealerNo = this.currentDealerNo;
      const yearMatches = data.filter((x: any) => x?.year === selectedYear);
      const yearEntry =
        dealerNo != null ? (yearMatches.find((x: any) => x?.dealerNo === dealerNo) || yearMatches[0]) : yearMatches[0];

      const monthlyGraphData = yearEntry?.monthlyGraphData;
      if (Array.isArray(monthlyGraphData)) {
        monthlyGraphData.forEach((monthItem: any) => {
          const monthIndex = this.monthMap[monthItem?.month];
          if (monthIndex === undefined) return;

          const amountRaw = monthItem?.monthlyVolumeDetails?.totalAmountFinanced;
          const amount = typeof amountRaw === 'number' ? amountRaw : Number(amountRaw);
          amountFinancedData[monthIndex] = Number.isFinite(amount) ? amount : 0;

          const countRaw = monthItem?.monthlyVolumeDetails?.totalContractCount;
          const count = typeof countRaw === 'number' ? countRaw : Number(countRaw);
          loanCountData[monthIndex] = Number.isFinite(count) ? count : 0;
        });
      }
    }

    return {
      labels: this.labels,
      datasets: [
        {
          label: 'Total Amount Financed',
          yAxisID: 'y',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: amountFinancedData,
        },
        {
          label: 'Count of Loans',
          yAxisID: 'y1',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: loanCountData,
        },
      ],
    };
  }
}
