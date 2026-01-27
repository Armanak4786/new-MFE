import { Component, OnInit } from '@angular/core';
import { CommonService } from 'auro-ui';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-drawdown-requst-submit-confirmation',
  templateUrl: './drawdown-requst-submit-confirmation.component.html',
  styleUrl: './drawdown-requst-submit-confirmation.component.scss',
})
export class DrawdownRequstSubmitConfirmationComponent implements OnInit {
  constructor(
    public svc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit(): void {}
}
