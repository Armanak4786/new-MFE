import { Component } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-drawdown-request-submit-confirmation',
  templateUrl: './drawdown-request-submit-confirmation.component.html',
  styleUrl: './drawdown-request-submit-confirmation.component.scss',
})
export class DrawdownRequestSubmitConfirmationComponent {
  constructor(
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // console.log('dynamicDialogConfig', this.dynamicDialogConfig);
  }
}
