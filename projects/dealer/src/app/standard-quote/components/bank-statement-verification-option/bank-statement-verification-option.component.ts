import { Component, effect } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, MapFunc, ToasterService } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { map } from "rxjs";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-bank-statement-verification-option",
  templateUrl: "./bank-statement-verification-option.component.html",
  styleUrl: "./bank-statement-verification-option.component.scss",
})
export class BankStatementVerificationOptionComponent extends BaseStandardQuoteClass {
  customerData: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private commonSvc: CommonService,
    public toasterSvc: ToasterService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    super(route, svc, baseSvc);

    //  effect(() => {
    //       this.customerData = this.baseSvc?.customerRowData();
    //       // Update options whenever customerData changes
    //       // if (this.customerData && this.dynamicDropdownRes) {
    //       //   this.updateOptions();
    //       // }
    //     });
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.customerData = this.config?.data?.customerData;
    // console.log(this.customerData, this.config.data, "BankStatement CustomerRow Data")
  }

  async manualClick() {
    console.log("Manual Clicked", this.customerData);

    let requestBody = {
      contractId: this.baseFormData?.contractId,
      partyNo: this.customerData?.customerNo,
      workflowName: "Verification- Bank Statement",
      workFlowId: 0,
      nextState: "Awaiting Verification",
      subject: `Bank Statement Verification workflow ${this.customerData?.customerName}`,
      comment: "I will upload the documents",
    };

    // const response = await this.postFormData(`WorkFlows/add_bankstatement_workflow`, requestBody)

    this.ref.close({
      // action: "editContact",
      data: "closed",
    });

    this.svc.data
      .post(`WorkFlows/add_bankstatement_workflow`, requestBody)
      .subscribe((res) => {
        // this.ref.close({
        //  // action: "editContact",
        //  data : res
        // });
        if (res && res?.data) {
          this.updateSessionStorage(res?.data?.currentState?.name);
        }
      });
  }

  async electronicClick() {
    console.log("Electronic Clicked");

    let requestBody = {
      contractId: this.baseFormData?.contractId,
      partyNo: this.customerData?.customerNo,
      workflowName: "Verification- Bank Statement",
      workFlowId: 0,
      nextState: "Awaiting Verification",
      subject: `Bank Statement Verification workflow ${this.customerData?.customerName}`,
      comment: "Request electronic verification",
    };

    this.ref.close({
      // action: "editContact",
      data: "closed",
    });

    const response = await this.postFormData(
      `WorkFlows/add_bankstatement_workflow`,
      requestBody
    );

    this.updateSessionStorage(response?.data?.currentState?.name);
  }

  updateSessionStorage(newStatus: string): void {
    try {
      const storedData = sessionStorage.getItem("updatedCustomerSummary");
      if (storedData) {
        const customerSummary = JSON.parse(storedData);

        // Determine which customer data we're working with
        const targetCustomerNo = this.customerData?.customerNo;

        if (!targetCustomerNo) {
          // console.warn("No customer number found for session storage update");
          return;
        }

        // Find and update the specific customer
        const updatedCustomerSummary = customerSummary.map((customer: any) => {
          if (customer.customerNo === targetCustomerNo) {
            return {
              ...customer,
              currentBankStatementWorkflowStatus: newStatus,
            };
          }
          return customer;
        });

        // Save back to sessionStorage
        sessionStorage.setItem(
          "updatedCustomerSummary",
          JSON.stringify(updatedCustomerSummary)
        );

        this.baseSvc?.updatedCustomerSummary.clear();

        // Update the service with the new data
        if (updatedCustomerSummary) {
          updatedCustomerSummary.forEach((customer: any) => {
            this.baseSvc?.updatedCustomerSummary.set(
              customer.customerNo,
              customer
            );
          });
        }
        this.baseSvc.triggerAfterPartyWorkflowChange.next("test");
        this.baseSvc.updateSignatories.next();

        // Emit verification complete event for signatory if applicable
        // if (this.signatoryCustomerData) {
        //   this.verificationComplete.emit({
        //     customerNo: targetCustomerNo,
        //     newStatus: newStatus,
        //     customerData: this.signatoryCustomerData
        //   });
        // }

        // console.log("SessionStorage updated for customer:", targetCustomerNo, "with status:", newStatus);
      }
    } catch (error) {
      console.error("Error updating sessionStorage:", error);
    }
  }

  async postFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.commonSvc.data
      ?.post(api, payload)
      ?.pipe(
        map((res) => {
          if (mapFunc) {
            res = mapFunc(res);
          }

          return res; //this.formConfig.data(res);
        })
      )
      .toPromise();
  }
}
