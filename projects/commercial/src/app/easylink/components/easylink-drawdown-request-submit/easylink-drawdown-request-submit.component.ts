import { Component } from '@angular/core';
import { EasylinkDrawdownRequestSubmitConfirmationComponent } from '../easylink-drawdown-request-submit-confirmation/easylink-drawdown-request-submit-confirmation.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from 'auro-ui';

@Component({
  selector: 'app-easylink-drawdown-request-submit',
  templateUrl: './easylink-drawdown-request-submit.component.html',
  styleUrl: './easylink-drawdown-request-submit.component.scss'
})
export class EasylinkDrawdownRequestSubmitComponent {
 constructor(public svc: CommonService,
    public ref: DynamicDialogRef,
   ){}

  showDialogSubmitDataConfirmation(){
    this.svc.dialogSvc
      .show(EasylinkDrawdownRequestSubmitConfirmationComponent, ' ',{
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
