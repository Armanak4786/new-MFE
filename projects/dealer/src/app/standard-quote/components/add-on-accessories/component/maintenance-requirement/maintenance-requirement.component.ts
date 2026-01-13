import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "auro-ui";
import { StandardQuoteService } from "../../../../services/standard-quote.service";
import { DashboardService } from "../../../../../dashboard/services/dashboard.service";

@Component({
  selector: "app-maintenance-requirement",
  templateUrl: "./maintenance-requirement.component.html",
  styleUrl: "./maintenance-requirement.component.scss",
})
export class MaintenanceRequirementComponent extends BaseStandardQuoteClass {
  tyreCount: any;
  serviceAgentDescription: any;
  specificReturnsDescription: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private cd: ChangeDetectorRef,
    private dashboardSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
  }
isTyresChecked: boolean = false;

onTyresCheckboxChange(event: any) {

}

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.baseFormData) {
      this.mapData();
    }
  }

  mapData() {
      (this.tyreCount = this.baseFormData?.tracksorTyres),
      (this.serviceAgentDescription = this.baseFormData?.serviceAgent),
      (this.specificReturnsDescription = this.baseFormData?.maintenanceRequirement);
  }

  updateMaintenanceData() {
    const payload = {
      tracksorTyres: this.tyreCount,
      serviceAgent: this.serviceAgentDescription,
      maintenanceRequirement: this.specificReturnsDescription,
    };

    this.baseSvc.addsOnAccessoriesData(payload);
  }
}
