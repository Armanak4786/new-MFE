import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CloseDialogData, CommonService, ToasterService, ValidationService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { AssetTradeSummaryService } from '../../../standard-quote/components/asset-insurance-summary/asset-trade.service';
import { StandardQuoteService } from '../../../standard-quote/services/standard-quote.service';
import { BaseStandardQuoteClass } from '../../../standard-quote/base-standard-quote.class';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-internal-sales-quote-list-action',
  template: `
    <div class="flex-column cursor-pointer " (click)="onReopenQuote()">
      <div
        class="py-1 flex justify-content-center action-item p-2 "
      
      >
        Reopen Quote
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
export class InternalSalesExpiredQuoteActionsComponent extends BaseStandardQuoteClass {

  @Input() rowData: any;  

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
  }

  onReopenQuote(){
    let rowData = this.dashboardSvc.getCurrentRowData();

    //  this.svc.router.navigateByUrl(
    //     `/dealer/standard-quote/edit/2392`
    //   );
    
  }



}
