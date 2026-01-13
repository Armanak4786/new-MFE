import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CloseDialogData, CommonService, ToasterService, ValidationService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { AssetTradeSummaryService } from '../../../standard-quote/components/asset-insurance-summary/asset-trade.service';
import { StandardQuoteService } from '../../../standard-quote/services/standard-quote.service';
import { BaseStandardQuoteClass } from '../../../standard-quote/base-standard-quote.class';
import { DashboardService } from '../../services/dashboard.service';
import { CancelQuoteConfirmationComponent } from '../cancel-quote-confirmation/cancel-quote-confirmation.component';


@Component({
  selector: 'app-internal-sales-quote-list-action',
  template: `
    <div class="flex-column cursor-pointer ">
      <div
        class="py-1 flex justify-content-center action-item p-1 "
         (click)="onValueClicked('edit')"
      >
        View Quote
      </div>
      <div
        class="py-1 flex justify-content-center action-item p-1 "
       (click)="onValueClicked('cancel')"
      >
        Cancel Quote
      </div>
      <div
        class="py-1 flex justify-content-center action-item p-1"
     (click)="onValueClicked('copy')"
      >
       Copy Quote
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
export class InternalSalesQuoteListActionsComponent extends BaseStandardQuoteClass {

  @Input() rowData: any;  

  constructor(
      public override route: ActivatedRoute,
      public commonSvc: CommonService,
      public override baseSvc: StandardQuoteService,
      private changeDetectorRef: ChangeDetectorRef,
      public toasterSvc: ToasterService,
      public validationSvc: ValidationService,
      public tradeSvc : AssetTradeSummaryService,
       public standardQuoteSvc: StandardQuoteService,
      private dashboardSvc: DashboardService 
    ) {
      super(route, commonSvc, baseSvc);
    }

  override async ngOnInit() {
  }

  async onValueClicked(menu){
this.dashboardSvc.currentRowData$.subscribe((data)=>{
  this.rowData = data;
})
  if (menu == "edit") {
      this.standardQuoteSvc.accessMode = "edit";
      this.standardQuoteSvc.mode = "edit";

      this.commonSvc.router.navigateByUrl(
        `/dealer/standard-quote/${menu}/${this.rowData.contractId}`
      );
    } 
    
    else if (menu == "cancel") {
    
     let rowData = this.dashboardSvc.getCurrentRowData();
     this.svc.dialogSvc
      .show(CancelQuoteConfirmationComponent, "", { 
        templates: {
          footer: null,
        },
        data: rowData,
        width: "24vw",
      }) 
    .onClose.subscribe((data: CloseDialogData) => {}); 
  }
    else if (menu == "copy") {
    
      const copyResponse = await this.dashboardSvc.copyQuote(this.rowData?.contractId);
      
      if ( copyResponse?.contractId) {
        this.standardQuoteSvc.accessMode = "edit";
        this.standardQuoteSvc.mode = "edit";
        this.standardQuoteSvc.calculatedOnce = true;
        this.commonSvc.router.navigateByUrl(
          `/dealer/standard-quote/edit/${copyResponse?.contractId}`
        );
      } 
    
  }
}



}
