import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';

@Component({
  selector: 'app-easylink-drawdown-request-submit-confirmation',
  templateUrl: './easylink-drawdown-request-submit-confirmation.component.html',
  styleUrls: ['./easylink-drawdown-request-submit-confirmation.component.scss']
})
export class EasylinkDrawdownRequestSubmitConfirmationComponent {
constructor(public svc: CommonService){}
}
