import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DrawdownRequstSubmitConfirmationComponent } from '../drawdown-requst-submit-confirmation/drawdown-requst-submit-confirmation.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-drawdown-request-submit',
  templateUrl: './drawdown-request-submit.component.html',
  styleUrl: './drawdown-request-submit.component.scss'
})
export class DrawdownRequestSubmitComponent {

  constructor(public svc: CommonService,
    public ref: DynamicDialogRef,
   ){}

  showDialogSubmitDataConfirmation(){
    this.svc.dialogSvc
      .show(DrawdownRequstSubmitConfirmationComponent, ' ',{
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
