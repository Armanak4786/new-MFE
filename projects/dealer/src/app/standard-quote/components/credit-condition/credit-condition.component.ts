import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CommonService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";

@Component({
  selector: "app-credit-condition",
  templateUrl: "./credit-condition.component.html",
  styleUrl: "./credit-condition.component.scss",
})
export class CreditConditionComponent extends BaseStandardQuoteClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    // this.baseSvc.formDataCacheableRoute([
    //   "LookUpServices/lookups?LookupSetName=ContactType",
    // ]);
  }

  creditConditions: any[] = [];

  override async ngOnInit() {
    await super.ngOnInit();
    // await this.loadCreditConditions();
  }

  async loadCreditConditions() {
    // console.log(this.baseFormData, "Credit OnInit");

    // Check if workflow status includes any of the specified values (case-insensitive)
    const restrictedStatuses = [
      "Declined",
      "Auto Declined",
      "Awaiting Assessment",
      "Performing Assessment",
    ];
    const currentWorkflowStatus = (
      this.baseFormData?.workFlowStatus || ""
    ).toLowerCase();

    // Check if any restricted status is included in the workflow status
    const shouldBeEmpty = restrictedStatuses.some((status) =>
      currentWorkflowStatus.includes(status.toLowerCase())
    );

    if (shouldBeEmpty) {
      this.creditConditions = [];
      this.cdr.detectChanges();
      // console.log('Credit conditions empty due to workflow status:', this.baseFormData?.workFlowStatus);
      return;
    }

    let params: any = this.route.snapshot.params;

    await this.baseSvc
      .getFormData(
        `WorkFlows/get_contract_party_workflow_todo?contractId=${this.baseFormData?.contractId}&workflowName=Credit Advice Retail&IsCompleted=false`
      )
      .then((res) => {
        this.creditConditions = res.data.map((item) => ({
          condition: item.detail,
          customerName: item.partyName,
        }));

        this.cdr.detectChanges();
        // console.log('Credit Conditions Response:', this.creditConditions);
      });
  }
}
