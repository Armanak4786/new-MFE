import { Component } from '@angular/core';
import { BaseStandardQuoteClass } from '../../../standard-quote/base-standard-quote.class';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { CommonService, ToasterService } from 'auro-ui';
import { StandardQuoteService } from '../../../standard-quote/services/standard-quote.service';
import { map } from 'rxjs';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-cancel-quote-confirmation',
  // standalone: true,
  // imports: [],
  templateUrl: './cancel-quote-confirmation.component.html',
  styleUrl: './cancel-quote-confirmation.component.scss'
})
export class CancelQuoteConfirmationComponent extends BaseStandardQuoteClass {



   constructor(
      public override route: ActivatedRoute,
      public commonSvc: CommonService,
      public override baseSvc: StandardQuoteService,
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      private toasterSvc: ToasterService,
      // private router: Router,
      // private standardQuoteSvc: StandardQuoteService,
      // public toasterSvc: ToasterService,
      // public validationSvc: ValidationService,
      // public cdr: ChangeDetectorRef
    ) {
     super(route, commonSvc, baseSvc);
   }

   override async ngOnInit(): Promise<void> {
      await super.ngOnInit();

      console.log(this.config?.data, "Cancel Quote Data");
   }

   onNo(){
    this.ref.close();
   }

   async onYes(){

     if (this.config?.data?.contractId) {

      this.ref.close();
      let state = await this.commonSvc.data
        .get(
          `WorkFlows/get_workflownamestate?ContractId=${this.config?.data?.contractId}&WorkflowName=Application`
        )
        .pipe(
          map((res) => {
            return res?.data;
          })
        )
        .toPromise();
    

       let request = {
          nextState: "Withdrawn",
          isForced: false,
        };
         let updateState = await this.commonSvc.data
           .put(
             `WorkFlows/update_workflowstate?contractId=${this.config?.data?.contractId}&workflowName=Application&WorkFlowId=${state?.currentState?.id}`,
             request
           )
           .pipe(
             map((res) => {
               if (res?.data) {
                 return res?.data?.data;
               }
               else if (res?.apiError?.errors.length > 0) {
     
                 let errors = res?.apiError?.errors
     
                 const messages: Message[] = errors.map((err) => ({
                   severity: "error",
                   detail: err.message,
                 }));
                 this.toasterSvc.showMultiple(messages);
                 return;
               }
             })
           )
           .toPromise();
          }
   }


}
