import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CloseDialogData, CommonService, ToasterService, ValidationService } from 'auro-ui';
import { SettlementDisclosureComponent } from '../../../standard-quote/components/settlement-disclosure/settlement-disclosure.component';
import { SettlementPopupComponent } from '../../../standard-quote/components/settlement-popup/settlement-popup.component';
import { ActivatedRoute } from '@angular/router';
import { AssetTradeSummaryService } from '../../../standard-quote/components/asset-insurance-summary/asset-trade.service';
import { StandardQuoteService } from '../../../standard-quote/services/standard-quote.service';
import { BaseStandardQuoteClass } from '../../../standard-quote/base-standard-quote.class';
import { DashboardService } from '../../services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quote-list-action',
  template: `
    <div class="flex-column cursor-pointer ">
       @if (!userRole?.functions?.includes('generate_settlement_quote')) {
      <div
        class="py-1 flex justify-content-center action-item p-2 "
        (click)="createSettlementQuote($event)"
      >
        Create Settlement Quote
      </div>
       }
       @if (!userRole?.functions?.includes('generate_statement')) {
      <div
        class="py-1 flex justify-content-center action-item p-2 "
        (click)="viewStatement()"
      >
        View Statement
      </div>
       }
      <div
        class="py-1 flex justify-content-center action-item p-2 "
        (click)="emailSchedule()"
      >
        Email P&I Schedule
      </div>
    </div>
  `,
  styles: [
    `
      .action-item {
        transition: background-color 0.3s, color 0.3s;
      }

      .action-item:hover {
        background-color: var(
          --primary-color
        ); /* Change to your desired background color */
        color: white; /* Change to your desired text color */
      }
    `,
  ],
})
export class QuoteListActionsComponent extends BaseStandardQuoteClass {

  @Input() rowData: any;  
  userRole: any;

  constructor(
      public override route: ActivatedRoute,
      public override svc: CommonService,
      public override baseSvc: StandardQuoteService,
      private changeDetectorRef: ChangeDetectorRef,
      public toasterSvc: ToasterService,
      public validationSvc: ValidationService,
      public tradeSvc : AssetTradeSummaryService,
      private dashboardSvc: DashboardService 
    ) {
      super(route, svc, baseSvc);
    }

  override async ngOnInit() {
    this.userRole= JSON.parse(sessionStorage.getItem("user_role") || "{}");
  }


  async settlementQuateDialog() {
    this.rowData = this.dashboardSvc.getCurrentRowData();


  if (!this.rowData) {
    this.toasterSvc.showToaster({
      severity: 'error',
      detail: 'No row selected'
    });
    return;
  }

  const contractId = this.rowData.loanId || this.rowData.contractId;
  if (!contractId) {
    this.toasterSvc.showToaster({
      severity: 'error',
      detail: 'No contract ID found for this row'
    });
    return;
  }


   const contractData = await this.dashboardSvc.getContractDetails(this.rowData.loanId);
   if (!contractData) {
      this.toasterSvc.showToaster({
        severity: 'error',
        detail: 'No contract details found'
      });
      return;
    }



    try {
    

    this.svc.dialogSvc
      .show(SettlementPopupComponent, "Calculate Settlement", {
        templates: {
          footer: null,

        },
        // data:this.rowData,
        data: contractData,

        width: "60vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {
        if (data) {
          this.baseSvc.setBaseDealerFormData({
            getSettlementAmountData: data?.data,
            contractData,
          });
          this.svc.router.navigateByUrl(
            "/dealer/standard-quote/settlement-quote-details"
          );
        }

        if (data.btnType == "submit") {
          this.svc.dialogSvc
            .show(SettlementDisclosureComponent, "Calculate Settlement", {
              data: {
                // okBtnLabel: 'Next',
              },
              width: "60vw",
            })
            .onClose.subscribe((data: CloseDialogData) => {
              this.svc.router.navigateByUrl(
                "/dealer/standard-quote/settlement-quote-details"
              );
              // if(data?.data?.checkboxs)
              // {
              //   this.baseFormData.settlementAmount=data?.data?.checkboxs;
              //   this.mainForm
              //   .get('settlementAmount')
              //   .patchValue(data?.data?.checkboxs);

              //   if(this.baseFormData.netTradeAmount>data?.data?.checkboxs){
              //   this.mainForm
              //   .get('netTradeAmount')
              //   .patchValue(
              //     this.baseFormData?.netTradeAmount - this.baseFormData?.settlementAmount || 0
              //   );
              // }}

              // SettlementDisclosureComponent;

            });
        }
      });
  }

   catch (error) {
      console.error('Error fetching contract details:', error);
      this.toasterSvc.showToaster({
        severity: 'error',
        detail: 'Failed to fetch contract details. Please try again.'
      });
    }
  // override onButtonClick(event: any) {
  //   if (event.field.name == "settlementButton") {
  //     // this.showDialog();
  //     this.settlementQuateDialog();
  //   }
  // }

  
}

createSettlementQuote(event: any) {
    // console.log("event name: ",event.field.name)

    // if (event.field.name == "settlementButton") {
      // this.showDialog();
      this.settlementQuateDialog();
    // }
  }
  emailSchedule() {}

  async viewStatement() {
  this.rowData = this.dashboardSvc.getCurrentRowData(); 
  if (!this.rowData) {
    this.toasterSvc.showToaster({
      severity: 'error',
      detail: 'No row selected. Please try again.'
    });
    return;
  }
  const productName = this.rowData.product;
  if (!productName) {
    this.toasterSvc.showToaster({
      severity: 'error',
      detail: 'Product information not found for this row'
    });
    return;
  }
  const productCode = this.dashboardSvc.getCodeByName(productName);
  const contractId = this.rowData.loanId || this.rowData.contractId;
  const customerStatementData = await this.dashboardSvc.getCustomerStatement(contractId, productCode);

  // Store all necessary data in sessionStorage
  const customerStatementSessionData = {
    customerStatementData: customerStatementData,
    productCode: productCode,
    contractId: contractId,
    rowData: this.rowData
  };

  sessionStorage.setItem('customerStatementData', JSON.stringify(customerStatementSessionData));
  sessionStorage.setItem('productCode', productCode);

  // Also set in service for backwards compatibility
  this.baseSvc.setBaseDealerFormData({
    customerStatementData: customerStatementData,
  });

   this.svc.router.navigate(['/dealer/customer-statement', contractId], {
    state: {
      customerStatementData: customerStatementData,
      productCode: productCode,
      contractId: contractId
    }
  });
}

}
