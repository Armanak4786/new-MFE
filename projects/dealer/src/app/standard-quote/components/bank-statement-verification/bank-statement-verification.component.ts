import { Component, effect } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, ToasterService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { BankStatementVerificationOptionComponent } from "../bank-statement-verification-option/bank-statement-verification-option.component";

@Component({
  selector: "app-bank-statement-verification",
  templateUrl: "./bank-statement-verification.component.html",
  styleUrl: "./bank-statement-verification.component.scss",
})
export class BankStatementVerificationComponent extends BaseStandardQuoteClass {
  customerData: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public toasterSvc: ToasterService
  ) {
    super(route, svc, baseSvc);

    effect(() => {
      this.customerData = this.baseSvc?.customerRowData();
      // Update options whenever customerData changes
      // if (this.customerData && this.dynamicDropdownRes) {
      //   this.updateOptions();
      // }
    });
  }

  options: any = [];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    let status = [
      "awaiting verification",
      "verification with customer",
      "in review",
      "verification complete",
      "verification failed",
      "verification declined",
      "verification not required",
    ];

    const currentStatus =
      this.customerData?.currentBankStatementWorkflowStatus?.toLowerCase();

    if (currentStatus && status.includes(currentStatus)) {
      this.options = [];
    } else {
      this.options = [{ label: "Verify", value: "Verify" }];
    }
  }

  onClick(item) {
    this.svc.dialogSvc
      .show(
        BankStatementVerificationOptionComponent,
        "Select a verification method: ",
        {
          templates: {
            footer: null,
          },
          data: {
            customerData: this.customerData,
          },
          width: "30vw",
        }
      )
      .onClose.subscribe((res: any) => {
        console.log(res, "closed");
      });
  }
}
