import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { CommonService, ToasterService } from "auro-ui";
import { QuickQuoteService } from "../../../quick-quote/services/quick-quote.service";
import { AssetTradeSummaryService } from "../../../standard-quote/components/asset-insurance-summary/asset-trade.service";
import { IndividualService } from "../../../individual/services/individual.service";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export class NotificationComponent implements OnInit {
  list = [
    { code: "CSA", id: 5, name: "Credit Sale Agreement" },
    { code: "AFV", id: 27, name: "Assured Future Value" },
    { code: "FL", id: 3, name: "Finance Lease" },
    { code: "TL", id: 10, name: "Term Loan" },
    { code: "OL", id: 4, name: "Operating Lease" },
  ];

  list2 = [
    // { code: "CSA", id: 5, name: "Credit Sale Agreement" },
    // { code: "AFV", id: 27, name: "Assured Future Value" },
    // { code: "FL", id: 3, name: "Finance Lease" },
    // { code: "TL", id: 10, name: "Term Loan" },
  ];
  taskmanager = [
    {
      msg: "Scheduled Maintenance: Our portal will be temporarily unavailable on [Date] from [Start Time] to [End Time] (UTC) for essential updates. We appreciate your understanding.",
    },
    {
      msg: "Scheduled Maintenance: Our portal will be temporarily unavailable on [Date] from [Start Time] to [End Time] (UTC) for essential updates. We appreciate your understanding.",
    },
    {
      msg: "Scheduled Maintenance: Our portal will be temporarily unavailable on [Date] from [Start Time] to [End Time] (UTC) for essential updates. We appreciate your understanding.",
    },
  ];

  activeIndex: number = undefined;
  activeSlide: number = 0;
  productData: any;
  formData: unknown;
  userRole: any;
  constructor(
    public router: Router,
    private standardQuoteSvc: StandardQuoteService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonSvc: CommonService,
    private quoteSvc: QuickQuoteService,
    private tradeSvc: AssetTradeSummaryService,
    private indiSvc: IndividualService,
    private dashboardSvc: DashboardService,
    private toasterSvc: ToasterService
  ) {}

  ngOnInit() {
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");
    this.standardQuoteSvc
      .getBaseDealerFormData()
      .pipe()
      .subscribe((res) => {
        this.formData = res;
      });

    // this.init();
  }
  async init() {
    this.commonSvc.data
      .get("Product/get_products?PageNo=1&PageSize=300")
      .subscribe((res) => {
        this.productData = res.data;
      });
    // this.isReady = true;
    this.changeDetectorRef.detectChanges(); // Trigger change detection manually
  }

  onPageChange(event: any): void {
    this.activeSlide = Number(event.page);
  }
  OnClickRedirect(data: any) {
   const isExternalUser = sessionStorage.getItem('externalUserType');
      if (isExternalUser?.includes('External')) {
         if (!this.dashboardSvc.userSelectedOption) {
        this.dashboardSvc.dealerAnimate = true;
        setTimeout(() => {
          this.dashboardSvc.dealerAnimate = false;
        }, 5000);
   
        this.toasterSvc.showToaster({
          detail: 'Please select a dealer.',
        });
        return;
      }
    }

    this.standardQuoteSvc.activeStep = 0;
    this.tradeSvc.resetData();
    this.indiSvc.resetData();

    this.standardQuoteSvc.setBaseDealerFormData({
      taxProfile: data,
      productCode: data.code,
    });

    sessionStorage.setItem("productCode", data.code || null);

    this.standardQuoteSvc.mode = "create";
    this.standardQuoteSvc.accessMode = "create";

    this.router.navigateByUrl("/standard-quote");
    this.standardQuoteSvc.calculatedOnce = false;
  }
  quickquote(data: any) {
     const isExternalUser = sessionStorage.getItem('externalUserType');
      if (isExternalUser?.includes('External')) {
         if (!this.dashboardSvc.userSelectedOption) {
        this.dashboardSvc.dealerAnimate = true;
        setTimeout(() => {
          this.dashboardSvc.dealerAnimate = false;
        }, 5000);
   
        this.toasterSvc.showToaster({
          detail: 'Please select a dealer.',
        });
        return;
      }
    }
    // this.quoteSvc.setBaseDealerFormData({
    //   taxProfile: data,
    //   productCode: data.code,
    // });
    // sessionStorage.setItem("productCode", data.code || null);
    this.router.navigateByUrl("/quick-quote");
    //this.standardQuoteSvc.calculatedOnce = false;
  }
}
