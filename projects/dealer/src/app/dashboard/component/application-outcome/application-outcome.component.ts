import {
  Component,
  Input,
  OnInit,
  Injector,
  effect,
  ChangeDetectorRef,
} from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { BaseStandardQuoteClass } from "../../../standard-quote/base-standard-quote.class";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { CommonService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-application-outcome",
  templateUrl: "./application-outcome.component.html",
  styleUrl: "./application-outcome.component.scss",
})
export class ApplicationOutcomeComponent
  extends BaseStandardQuoteClass
  implements OnInit
{
  override data: any; // Chart Data
  applicationStatus: any[] = []; // List Data
  legendItems: Array<{ label: string; color: string }> = [];

  userRole: any = {};
  options: any;
  @Input() isFullWidth2: boolean = false;

  private documentStyle: CSSStyleDeclaration;

  // Configuration for the Doughnut Chart Colors
  private readonly chartColors: Record<string, string> = {
    'Paid Out': '--blue-500',
    'Declined': '--yellow-500',
    'Pending': '--green-500',
    'Expired': '--red-500'
  };

  // Configuration for the Chart Hover Colors
  private readonly hoverColors: Record<string, string> = {
    'Paid Out': '--blue-400',
    'Declined': '--yellow-400',
    'Pending': '--green-400',
    'Expired': '--red-400'
  };

  constructor(
    private scvc: DashboardService,
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private injector: Injector,
    private cd: ChangeDetectorRef,
  ) {
    super(route, svc, baseSvc);

    // Reactive Trigger: Reload data when Dealer changes
    effect(
      () => {
        const selectedDealer = this.scvc.onOriginatorChange();
        const userCode = this.scvc.getUserCode();

        // Guard: Only fetch if we have valid Dealer & User
        if (selectedDealer && selectedDealer.num && userCode) {
          this.loadData(selectedDealer.num, userCode);
        }
      },
      { injector: this.injector },
    );
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");

    // Initialize Styles
    this.documentStyle = getComputedStyle(document.documentElement);

    // Initialize Chart Options (Static)
    this.initChartOptions();

    // Initial Empty State (Prevents UI errors before API loads)
    const initialData = this.mapToUI(null, this.documentStyle);
    this.data = initialData.chartData;
    this.applicationStatus = initialData.onlineStatus;
    this.legendItems = initialData.legendItems;
  }

  loadData(dealerId: number, userId: string) {
    const payload = { dealerId, userId };

    this.scvc.getWorkflowStatusOnce(payload).subscribe({
      next: (response) => {
        // Map API response to UI
        const mapped = this.mapToUI(response, this.documentStyle);

        this.data = mapped.chartData;
        this.applicationStatus = mapped.onlineStatus;
        this.legendItems = mapped.legendItems;

        // Force UI Update
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load application outcome", err);
      },
    });
  }

  private initChartOptions() {
    this.options = {
      cutout: "60%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Custom tooltip to show just the number or label
              return context.label;
            },
          },
        },
      },
    };
  }

  private mapToUI(
    apiResponse: any,
    documentStyle: CSSStyleDeclaration,
  ): { chartData: any; onlineStatus: any[]; legendItems: Array<{ label: string; color: string }> } {
    const rawData = this.extractData(apiResponse);

    // --- 1. Process Chart Data (Application Outcome) ---
    const statusOrder = ["Paid Out", "Declined", "Pending", "Expired"] as const;
    type OutcomeStatus = (typeof statusOrder)[number];

    const chartMap: Record<OutcomeStatus, number> = {
      "Paid Out": 0,
      Declined: 0,
      Pending: 0,
      Expired: 0,
    };

    // --- 2. Process List Data (Online Application Status) ---
    let startedCount = 0;
    let submittedCount = 0;
    let totalOnlineValue = 0;

    rawData.forEach((item: any) => {
      const graphType = item.graphType;
      const status = item.workflowStatus || "";
      const count = item.contractCount || 0;
      const amount = item.totalAmount || 0;

      if (graphType === "Application") {
        // Only map statuses we explicitly support (strict contract in UI layer).
        if (status === "Paid Out" || status === "Declined" || status === "Pending" || status === "Expired") {
          chartMap[status] += count;
        }
      }

      // Logic for List (graphType: "OnlineApplication")
      if (graphType === "OnlineApplication") {
        if (status === "Started") {
          startedCount += count;
          totalOnlineValue += amount;
        } else if (status === "Submitted") {
          submittedCount += count;
          totalOnlineValue += amount;
        }
      }
    });

    const onlineStatus = [
      { img: "assets/images/icon/card-edit.svg", count: startedCount, name: "Started" },
      { img: "assets/images/icon/card-tick.svg", count: submittedCount, name: "Submitted" },
      { img: "assets/images/icon/wallet-money.svg", count: totalOnlineValue, name: "Applications Value" },
    ];

    const fixedLegendColor = (status: OutcomeStatus) =>
      documentStyle.getPropertyValue(this.chartColors[status])?.trim() || "#d9d9d9";

    // Legend should always show all statuses (even when count is 0).
    const legendItems = statusOrder.map((key) => ({
      label: `${key} - ${chartMap[key]}`,
      color: fixedLegendColor(key),
    }));

    const presentStatuses = statusOrder.filter((key) => chartMap[key] > 0);

    // No data: fill doughnut with grey, keep the usual labels (0s) for clarity.
    if (presentStatuses.length === 0) {
      const greyFill =
        documentStyle.getPropertyValue("--surface-300")?.trim() ||
        documentStyle.getPropertyValue("--gray-300")?.trim() ||
        "#d9d9d9";

      return {
        chartData: {
          // Keep chart label minimal; legend explains the breakdown.
          labels: ["No data"],
          datasets: [
            {
              data: [1],
              backgroundColor: [greyFill],
              hoverBackgroundColor: [greyFill],
            },
          ],
        },
        onlineStatus,
        legendItems,
      };
    }

    // Data present: show only the statuses that have data (colors + legend).
    const labels = presentStatuses.map((key) => `${key} - ${chartMap[key]}`);
    const dataValues = presentStatuses.map((key) => chartMap[key]);
    const bgColors = presentStatuses.map((key) =>
      documentStyle.getPropertyValue(this.chartColors[key])?.trim(),
    );
    const hvrColors = presentStatuses.map((key) =>
      documentStyle.getPropertyValue(this.hoverColors[key])?.trim(),
    );

    return {
      chartData: {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: bgColors,
            hoverBackgroundColor: hvrColors,
          },
        ],
      },
      onlineStatus,
      legendItems,
    };
  }

  private extractData(res: any): any[] {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.table)) return res.data.table;
    return [];
  }
}
