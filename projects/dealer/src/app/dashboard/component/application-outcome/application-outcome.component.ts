import { Component, Input, OnInit } from "@angular/core";
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
export class ApplicationOutcomeComponent extends BaseStandardQuoteClass implements OnInit {
  override data: any;
userRole: any = {};
  options: any;
@Input() isFullWidth2: boolean = false;
  applicationStatus: any;

  constructor(private scvc: DashboardService,
    public override route: ActivatedRoute, 
    public override svc: CommonService, 
    override baseSvc: StandardQuoteService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.userRole = JSON.parse(sessionStorage.getItem("user_role") || "{}");
    this.applicationStatus = this.scvc.applicationStatus;
    const documentStyle = getComputedStyle(document.documentElement);

    this.data = {
      labels: ["Paid Out - 6", "Declined - 3", "Pending - 12", "Expired - 0"],
      datasets: [
        {
          data: [6, 3, 12, 1],
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
          ],
        },
      ],
    };

    this.options = {
      cutout: "60%",

      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
