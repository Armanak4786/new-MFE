import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';

@Component({
  selector: 'app-creditline-drawdown-request-submit-confirmation',
  templateUrl: './creditline-drawdown-request-submit-confirmation.component.html',
  styleUrls: ['./creditline-drawdown-request-submit-confirmation.component.scss']
})
export class CreditlineDrawdownRequestSubmitConfirmationComponent {
constructor(public svc: CommonService){}
}
