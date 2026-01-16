import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DrawdownRequestSubmitConfirmationComponent } from '../drawdown-request-submit-confirmation/drawdown-request-submit-confirmation.component';

@Component({
  selector: 'app-drawdown-request-submit',
  templateUrl: './drawdown-request-submit.component.html',
  styleUrls: ['./drawdown-request-submit.component.scss'],
})
export class DrawdownRequestSubmitComponent {
  constructor(public svc: CommonService, public ref: DynamicDialogRef) {}

  showDialogSubmitDataConfirmation() {
    this.svc.dialogSvc
      .show(DrawdownRequestSubmitConfirmationComponent, ' ', {
        templates: {
          footer: null,
        },
        data: '',
        width: '50vw',
      })
      .onClose.subscribe((data: any) => {});
  }

  confirm() {
    this.ref.close({ data: 'confirm' });
  }

  cancel() {
    this.ref.close();
  }
}
