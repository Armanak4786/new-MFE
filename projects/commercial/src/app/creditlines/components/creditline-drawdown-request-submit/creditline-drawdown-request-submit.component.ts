import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreditlineDrawdownRequestSubmitConfirmationComponent } from '../creditline-drawdown-request-submit-confirmation/creditline-drawdown-request-submit-confirmation.component';

@Component({
  selector: 'app-creditline-drawdown-request-submit',
  templateUrl: './creditline-drawdown-request-submit.component.html',
  styleUrl: './creditline-drawdown-request-submit.component.scss'
})
export class CreditlineDrawdownRequestSubmitComponent {
constructor(public svc: CommonService,
    public ref: DynamicDialogRef,
   ){}

  showDialogSubmitDataConfirmation(){
    this.svc.dialogSvc
      .show(CreditlineDrawdownRequestSubmitConfirmationComponent, ' ',{
        templates: {
          footer: null,
        },
        data: '',
        width: '50vw',
      })
      .onClose.subscribe((data: any) => {
      });
  }

  confirm(){
    this.ref.close({data: 'confirm'});
  }

  cancel(){
    this.ref.close();
  }
}
