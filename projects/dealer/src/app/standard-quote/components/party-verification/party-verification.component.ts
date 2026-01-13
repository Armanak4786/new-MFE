import {
  Component,
  destroyPlatform,
  effect,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService, MapFunc, ToasterService } from "auro-ui";
import { map } from "rxjs";
import { Overlay } from "primeng/overlay";

@Component({
  selector: "app-party-verification",
  //  template: `
  //   <div class="flex-column cursor-pointer">
  //     <div
  //       class="flex justify-content-center action-item p-1 px-3"
  //       (click)="ManualClick($event)"
  //     >
  //       Manual
  //     </div>
  //     <div
  //       class="flex justify-content-center action-item p-1 px-3"
  //       (click)="electronicClick($event)"
  //     >
  //       Electronic
  //     </div>
  //   </div>
  // `,
  // styles: [
  //   `
  //     .action-item {
  //       transition: background-color 0.3s, color 0.3s;
  //     }

  //     .action-item:hover {
  //       background-color: var(
  //         --primary-color
  //       );
  //       color: white;
  //     }

  //     ::ng-deep {
  //       .p-overlaypanel-content {
  //         padding: 8px;
  //       }
  //       .p-overlaypanel:after {
  //       border: none !important;
  //       }
  //       .p-overlaypanel:before {
  //         border: none !important;
  //       }
  //     }

  //   `,
  // ],
  templateUrl: "./party-verification.component.html",
  styleUrl: "./party-verification.component.scss",
})

// export class PartyVerificationComponent extends BaseStandardQuoteClass{
// customerData:any;
// dynamicDropdownRes:any;
//  constructor(
//      public override route: ActivatedRoute,
//      public override svc: CommonService,
//      public override baseSvc: StandardQuoteService,
//    ) {
//      super(route, svc, baseSvc);

//         //  effect(() => {
//         //     this.customerData = this.baseSvc?.customerRowData();
//         //     // console.log("Customer Data in Party Verification Component:", this.customerData);
//         //     // You can add additional logic here to react to changes in customerData
//         //  });
//    }

//    options : any;

//    override  async ngOnInit(): Promise<void> {
//     await super.ngOnInit();

//     // await this.baseSvc.getFormData(
//     //   `WorkFlows/get_contract_party_workflow_todo?contractId=${this.baseFormData?.contractId}&workflowName=Credit Advice Retail&IsCompleted=false`
//     // ).then((res) => {
//     //   this.creditConditions = res.data.map((item) => ({
//     //     condition: item.name,
//     //     customerName: item.partyName,
//     //   }));
//     // });

//      effect(() => {
//             this.customerData = this.baseSvc?.customerRowData();
//             // console.log("Customer Data in Party Verification Component:", this.customerData);
//             // You can add additional logic here to react to changes in customerData
//          });

//     this.options = [
//       { label: 'Manual', value: 'Manual' },
//       { label: 'Electronic', value: 'Electronic' }
//     ];
//    }

//    onClick(event:any){
//     console.log("Button clicked", event, this.customerData);

//    }

//     // ManualClick(event:any){
//     //   console.log("ManualClick clicked", event);

//     // }

//     // electronicClick(event:any){
//     //   console.log("electronicClick clicked", event);
//     // }

// }
export class PartyVerificationComponent extends BaseStandardQuoteClass {
  customerData: any;
  dynamicDropdownRes: any;
  signatoryCustomerData: any;

  //For Signatory Row Data and logic
  @Input() overlay: any;
  @Input() SignatoryRowData: any;
  @Input() SignatoryParentRowData: any;
  @Output() verificationComplete = new EventEmitter<any>();

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private commonSvc: CommonService,
    public toasterSvc: ToasterService
  ) {
    super(route, svc, baseSvc);

    //  this.baseSvc.formDataCacheableRoute([
    //   "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Workflow",
    // ]);

    effect(() => {
      this.customerData = this.baseSvc?.customerRowData();
      // Update options whenever customerData changes
      if (this.customerData && this.dynamicDropdownRes) {
        this.updateOptions();
      }
    });
  }

  options: any = [];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // console.log("Signatory Row Data:", this.SignatoryRowData, this.SignatoryParentRowData, this.customerData);

    if (this.SignatoryRowData) {
      this.signatoryCustomerData = this.SignatoryRowData;
      this.customerData = undefined;
    }
    // Call the dynamic dropdown API
    await this.loadDynamicDropdownData();
  }

  async loadDynamicDropdownData(): Promise<void> {
    try {
      // Replace with your actual API call
      // this.dynamicDropdownRes = JSON.parse(sessionStorage.getItem('partyIdVerificationDynamicDropdownData') || '{}');

      this.dynamicDropdownRes = await this.baseSvc.getFormData(
        `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Workflow`
      );

      // sessionStorage.setItem("WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Workflow", JSON.stringify(this.dynamicDropdownRes));

      // Update options after API response is received
      if (this.customerData !== undefined) {
        this.updateOptions(); //For Borrowers/Guarantor's section
      } else if (this.signatoryCustomerData) {
        this.updateSignatoryOptions(); //For signatory section
      } else {
        this.setDefaultOptions();
      }
    } catch (error) {
      console.error("Error loading dynamic dropdown data:", error);
      // Fallback to default options
      this.setDefaultOptions();
    }
  }

  updateSignatoryOptions(): void {
    if (
      !this.dynamicDropdownRes?.data?.dataRowList ||
      !this.signatoryCustomerData
    ) {
      return;
    }

    const dataRowList = this.dynamicDropdownRes.data.dataRowList;
    const customerType = (
      this.signatoryCustomerData?.classification || ""
    ).toLowerCase();
    const currentWorkflowStatus = (
      this.signatoryCustomerData["currentWorkflowStatus"] || ""
    ).toLowerCase();

    // console.log('Customer Data:', this.signatoryCustomerData);
    // console.log('Dropdown Data:', dataRowList);

    // Find matching row based on Party Verification Type and Current AF Workflow
    const matchedRow = dataRowList.find((item: any) => {
      const partyTypes = (item.customFields["Party Verification Type"] || "")
        .split(",")
        .map((type: string) => type.trim().toLowerCase());

      const workflowStatuses = (item.customFields["Current AF Workflow"] || "")
        .split(",")
        .map((status: string) => status.trim().toLowerCase());

      // Check if customer type and workflow status match (case-insensitive)
      const typeMatches = partyTypes.includes(customerType);
      const statusMatches = workflowStatuses.includes(currentWorkflowStatus);

      // console.log(`Row ${item.rowNo}:`, {
      //   partyTypes,
      //   workflowStatuses,
      //   customerType,
      //   currentWorkflowStatus,
      //   typeMatches,
      //   statusMatches
      // });

      return typeMatches && statusMatches;
    });

    if (matchedRow) {
      const verificationTypes =
        matchedRow.customFields["App Verification Type"];

      if (verificationTypes && verificationTypes !== "-") {
        // Split comma-separated values and create options array
        const verificationTypeArray = verificationTypes
          .split(",")
          .map((type: string) => type.trim())
          .filter((type: string) => type !== "-" && type !== "");

        this.options = verificationTypeArray.map((type: string) => ({
          label: type,
          value: type,
        }));

        // console.log('Matched row found. Options set to:', this.options);
      } else {
        // console.log('No applicable verification types found, using defaults');
        this.setDefaultOptions();
      }
    } else {
      // console.log('No matching row found, using default options');
      this.setDefaultOptions();
    }
  }

  updateOptions(): void {
    if (!this.dynamicDropdownRes?.data?.dataRowList || !this.customerData) {
      return;
    }

    const dataRowList = this.dynamicDropdownRes.data.dataRowList;
    const customerType = (this.customerData.customerType || "").toLowerCase();
    const currentWorkflowStatus = (
      this.customerData["currentWorkflowStatus"] || ""
    ).toLowerCase();

    // console.log('Customer Data:', this.customerData);
    // console.log('Dropdown Data:', dataRowList);

    // Find matching row based on Party Verification Type and Current AF Workflow
    const matchedRow = dataRowList.find((item: any) => {
      const partyTypes = (item.customFields["Party Verification Type"] || "")
        .split(",")
        .map((type: string) => type.trim().toLowerCase());

      const workflowStatuses = (item.customFields["Current AF Workflow"] || "")
        .split(",")
        .map((status: string) => status.trim().toLowerCase());

      // Check if customer type and workflow status match (case-insensitive)
      const typeMatches = partyTypes.includes(customerType);
      const statusMatches = workflowStatuses.includes(currentWorkflowStatus);

      // console.log(`Row ${item.rowNo}:`, {
      //   partyTypes,
      //   workflowStatuses,
      //   customerType,
      //   currentWorkflowStatus,
      //   typeMatches,
      //   statusMatches
      // });

      return typeMatches && statusMatches;
    });

    if (matchedRow) {
      const verificationTypes =
        matchedRow.customFields["App Verification Type"];

      if (verificationTypes && verificationTypes !== "-") {
        // Split comma-separated values and create options array
        const verificationTypeArray = verificationTypes
          .split(",")
          .map((type: string) => type.trim())
          .filter((type: string) => type !== "-" && type !== "");

        this.options = verificationTypeArray.map((type: string) => ({
          label: type,
          value: type,
        }));

        // console.log('Matched row found. Options set to:', this.options);
      } else {
        // console.log('No applicable verification types found, using defaults');
        this.setDefaultOptions();
      }
    } else {
      // console.log('No matching row found, using default options');
      this.setDefaultOptions();
    }
  }

  setDefaultOptions(): void {
    this.options = [
      { label: "Manual", value: "Manual" },
      { label: "Electronic", value: "Electronic" },
    ];
  }

  // async onClick(event: any) {
  //   console.log("Button clicked", event, this.customerData);

  //   if(event && event.value == 'Manual'){
  //     if(this.customerData?.currentWorkflowStatus == "Start Verification"){
  //       let requestBody = {
  //               nextState: "Awaiting Manual Verification",
  //               isForced: true
  //             }

  //       await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
  //     }
  //     else if(this.customerData?.currentWorkflowStatus == "Awaiting Manual Verification"){
  //       let requestBody = {
  //               nextState: "Start Verification",
  //               isForced: true
  //             }

  //       await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
  //     }
  //   }

  //   if(event && event.value == 'Electronic')
  //   {
  //     if(this.customerData?.email && this.customerData?.phoneNo)
  //     {
  //        if(this.customerData?.currentWorkflowStatus == "Start Verification"){
  //       let requestBody = {
  //               nextState: "Verification in Progress",
  //               isForced: true
  //             }

  //       await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
  //     }
  //     else if(this.customerData?.currentWorkflowStatus == "Awaiting Manual Verification"){
  //       let requestBody = {
  //               nextState: "Start Verification",
  //               isForced: true
  //             }

  //       await this.putFormData(`WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`, requestBody);
  //     }
  //     }
  //     else
  //     {
  //       this.toasterSvc.showToaster({
  //         severity: "error",
  //         detail: "Mobile and/or Email address required for electronic verification."
  //       });
  //     }
  //   }
  // }

  async onClick(event: any, op: Overlay) {
    // console.log("Button clicked", event, this.customerData);
    if (this.overlay) {
      this.overlay.hide(); // CLOSE OVERLAY
    }
    if (this.customerData !== undefined) {
      //Executed When Borrower's Guarantor's Identity Dropdown value is selected

      if (event && event.value == "Start Verification") {
        if (
          this.customerData?.currentWorkflowStatus ==
          "Awaiting Manual Verification"
        ) {
          let requestBody = {
            nextState: "Start Verification",
            isForced: true,
          };

          const response = await this.putFormData(
            `WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`,
            requestBody
          );

          if (
            response?.apiError?.errors &&
            response.apiError.errors.length > 0
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail:
                "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
            });
          } else {
            this.toasterSvc.showToaster({
              severity: "success",
              detail: "Start verification request sent",
            });

            // Update sessionStorage
            this.updateSessionStorage(response?.data?.currentState?.name);
          }
        }
      }

      if (event && event.value == "Manual") {
        if (this.customerData?.currentWorkflowStatus == "Start Verification") {
          let requestBody = {
            nextState: "Awaiting Manual Verification",
            isForced: true,
          };

          const response = await this.putFormData(
            `WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`,
            requestBody
          );

          if (
            response?.apiError?.errors &&
            response.apiError.errors.length > 0
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail:
                "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
            });
          } else {
            this.toasterSvc.showToaster({
              severity: "success",
              detail: "Manual verification request sent",
            });

            // Update sessionStorage
            this.updateSessionStorage(response?.data?.currentState?.name);
          }
        } else if (
          this.customerData?.currentWorkflowStatus ==
          "Awaiting Manual Verification"
        ) {
          let requestBody = {
            nextState: "Start Verification",
            isForced: true,
          };

          const response = await this.putFormData(
            `WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`,
            requestBody
          );

          if (
            response?.apiError?.errors &&
            response.apiError.errors.length > 0
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail:
                "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
            });
          } else {
            this.toasterSvc.showToaster({
              severity: "success",
              detail: "Start verification request sent",
            });

            // Update sessionStorage
            this.updateSessionStorage(response?.data?.currentState?.name);
          }
        }
      }

      if (event && event.value == "Electronic") {
        if (this.customerData?.email && this.customerData?.phoneNo) {
          if (
            this.customerData?.currentWorkflowStatus == "Start Verification"
          ) {
            let requestBody = {
              nextState: "Verification in Progress",
              isForced: true,
            };

            const response = await this.putFormData(
              `WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`,
              requestBody
            );

            if (
              response?.apiError?.errors &&
              response.apiError.errors.length > 0
            ) {
              this.toasterSvc.showToaster({
                severity: "error",
                detail:
                  "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
              });
            } else {
              this.toasterSvc.showToaster({
                severity: "success",
                detail: "Electronic verification request sent",
              });

              // Update sessionStorage
              this.updateSessionStorage(response?.data?.currentState?.name);
            }
          } else if (
            this.customerData?.currentWorkflowStatus ==
            "Awaiting Manual Verification"
          ) {
            let requestBody = {
              nextState: "Start Verification",
              isForced: true,
            };

            const response = await this.putFormData(
              `WorkFlows/update_party_workflowstate?PartyNo=${this.customerData?.customerNo}&WorkflowName=ID Party Verification`,
              requestBody
            );

            if (
              response?.apiError?.errors &&
              response.apiError.errors.length > 0
            ) {
              this.toasterSvc.showToaster({
                severity: "error",
                detail:
                  "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
              });
            } else {
              // Update sessionStorage
              this.updateSessionStorage(response?.data?.currentState?.name);
            }
          }
        } else {
          this.toasterSvc.showToaster({
            severity: "error",
            detail:
              "Mobile and/or Email address required for electronic verification.",
          });
        }
      }
    } else if (this.signatoryCustomerData !== undefined) {
      //When signatory dropdown value is selected

      if (event && event.value == "Start Verification") {
        if (
          this.signatoryCustomerData?.currentWorkflowStatus ==
          "Awaiting Manual Verification"
        ) {
          let requestBody = {
            nextState: "Start Verification",
            isForced: true,
          };

          const response = await this.putFormData(
            `WorkFlows/update_party_workflowstate?PartyNo=${
              this.signatoryCustomerData?.contactPartyNo ||
              this.signatoryCustomerData?.customerNo
            }&WorkflowName=ID Party Verification`,
            requestBody
          );

          if (
            response?.apiError?.errors &&
            response.apiError.errors.length > 0
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail:
                "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
            });
          } else {
            this.toasterSvc.showToaster({
              severity: "success",
              detail: "Start verification request sent",
            });

            // Update sessionStorage
            this.updateSessionStorage(response?.data?.currentState?.name);
          }
        }
      }

      if (event && event.value == "Manual") {
        if (
          this.signatoryCustomerData?.currentWorkflowStatus ==
          "Start Verification"
        ) {
          let requestBody = {
            nextState: "Awaiting Manual Verification",
            isForced: true,
          };

          const response = await this.putFormData(
            `WorkFlows/update_party_workflowstate?PartyNo=${
              this.signatoryCustomerData?.contactPartyNo ||
              this.signatoryCustomerData?.customerNo
            }&WorkflowName=ID Party Verification`,
            requestBody
          );

          if (
            response?.apiError?.errors &&
            response.apiError.errors.length > 0
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail:
                "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
            });
          } else {
            this.toasterSvc.showToaster({
              severity: "success",
              detail: "Manual verification request sent",
            });

            // Update sessionStorage
            this.updateSessionStorage(response?.data?.currentState?.name);
          }
        } else if (
          this.signatoryCustomerData?.currentWorkflowStatus ==
          "Awaiting Manual Verification"
        ) {
          let requestBody = {
            nextState: "Start Verification",
            isForced: true,
          };

          const response = await this.putFormData(
            `WorkFlows/update_party_workflowstate?PartyNo=${
              this.signatoryCustomerData?.contactPartyNo ||
              this.signatoryCustomerData?.customerNo
            }&WorkflowName=ID Party Verification`,
            requestBody
          );

          if (
            response?.apiError?.errors &&
            response.apiError.errors.length > 0
          ) {
            this.toasterSvc.showToaster({
              severity: "error",
              detail:
                "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
            });
          } else {
            this.toasterSvc.showToaster({
              severity: "success",
              detail: "Start verification request sent",
            });

            // Update sessionStorage
            this.updateSessionStorage(response?.data?.currentState?.name);
          }
        }
      }

      if (event && event.value == "Electronic") {

        if(this.signatoryCustomerData && this.signatoryCustomerData.phoneMobile && this.signatoryCustomerData.phoneMobile == ""){
          this.toasterSvc.showToaster({
            severity: "error",
            detail: "Mobile and/or Email address required for electronic verification.",
          });
          return;
        }
        if (
          this.signatoryCustomerData?.email &&
          this.signatoryCustomerData?.phoneNo
        ) {
          if (
            this.signatoryCustomerData?.currentWorkflowStatus ==
            "Start Verification"
          ) {
            let requestBody = {
              nextState: "Verification in Progress",
              isForced: true,
            };

            const response = await this.putFormData(
              `WorkFlows/update_party_workflowstate?PartyNo=${
                this.signatoryCustomerData?.contactPartyNo ||
                this.signatoryCustomerData?.customerNo
              }&WorkflowName=ID Party Verification`,
              requestBody
            );

            if (
              response?.apiError?.errors &&
              response.apiError.errors.length > 0
            ) {
              this.toasterSvc.showToaster({
                severity: "error",
                detail:
                  "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
              });
            } else {
              this.toasterSvc.showToaster({
                severity: "success",
                detail: "Electronic verification request sent",
              });

              // Update sessionStorage
              this.updateSessionStorage(response?.data?.currentState?.name);
            }
          } else if (
            this.signatoryCustomerData?.currentWorkflowStatus ==
            "Awaiting Manual Verification"
          ) {
            let requestBody = {
              nextState: "Start Verification",
              isForced: true,
            };

            const response = await this.putFormData(
              `WorkFlows/update_party_workflowstate?PartyNo=${
                this.signatoryCustomerData?.contactPartyNo ||
                this.signatoryCustomerData?.customerNo
              }&WorkflowName=ID Party Verification`,
              requestBody
            );

            if (
              response?.apiError?.errors &&
              response.apiError.errors.length > 0
            ) {
              this.toasterSvc.showToaster({
                severity: "error",
                detail:
                  "There was an error submitting your request. Please try again or contact UDC on 0800 500 832",
              });
            } else {
              // Update sessionStorage
              this.updateSessionStorage(response?.data?.currentState?.name);
            }
          }
        } else {
          this.toasterSvc.showToaster({
            severity: "error",
            detail:
              "Mobile and/or Email address required for electronic verification.",
          });
        }
      }
    }
  }

  // updateSessionStorage(newStatus: string): void {
  //   try {
  //     const storedData = sessionStorage.getItem("updatedCustomerSummary");
  //     if (storedData) {
  //       const customerSummary = JSON.parse(storedData);

  //       // Find and update the specific customer
  //       const updatedCustomerSummary = customerSummary.map((customer: any) => {
  //         if (customer.customerNo === this.customerData?.customerNo) {
  //           return {
  //             ...customer,
  //             currentWorkflowStatus: newStatus
  //           };
  //         }
  //         return customer;
  //       });

  //       // Save back to sessionStorage
  //       sessionStorage.setItem("updatedCustomerSummary", JSON.stringify(updatedCustomerSummary));

  //         if (updatedCustomerSummary) {
  //           updatedCustomerSummary?.forEach(customer => {
  //             // this.originalRoles.set(customer.customerNo, customer.roleName);
  //             this.baseSvc?.updatedCustomerSummary.set(customer.customerNo, customer);
  //           });
  //         }

  //         this.baseSvc.triggerAfterPartyWorkflowChange.next("test")
  //       console.log("SessionStorage updated for customer:", this.customerData?.customerNo, "with status:", newStatus);
  //     }
  //   } catch (error) {
  //     console.error("Error updating sessionStorage:", error);
  //   }
  // }

  updateSessionStorage(newStatus: string): void {
    try {
      const storedData = sessionStorage.getItem("updatedCustomerSummary");
      if (storedData) {
        const customerSummary = JSON.parse(storedData);

        // Determine which customer data we're working with
        const targetCustomerNo =
          this.customerData?.customerNo ||
          this.signatoryCustomerData?.customerNo;

        if (!targetCustomerNo) {
          console.warn("No customer number found for session storage update");
          return;
        }

        // Find and update the specific customer
        const updatedCustomerSummary = customerSummary.map((customer: any) => {
          if (customer.customerNo === targetCustomerNo) {
            return {
              ...customer,
              currentWorkflowStatus: newStatus,
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
        if (this.signatoryCustomerData) {
          this.verificationComplete.emit({
            customerNo: targetCustomerNo,
            newStatus: newStatus,
            customerData: this.signatoryCustomerData,
          });
        }

        // console.log("SessionStorage updated for customer:", targetCustomerNo, "with status:", newStatus);
      }
    } catch (error) {
      console.error("Error updating sessionStorage:", error);
    }
  }

  async putFormData(api: string, payload: any, mapFunc?: MapFunc) {
    return await this.commonSvc.data
      ?.put(api, payload)
      .pipe(
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
