import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AuroUiFrameWork } from 'auro-ui';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss']
})
export class ErrorMessagesComponent implements OnInit {

  @Input() selectedTab: string = 'quotesAndApps';

  // Quotes and Apps
  paymentScheduleMessage: string = 'The sum of the segment (Number) field must not exceed the loan term.';

  // Retail Self Service
  acknowledgementMessage: string = 'Please acknowledge the terms and conditions before submitting';

  // Customer Information Portal
  drawdownWarningMessage: string = 'Please note that this request may exceed either the Facility Limit or the Security Limit (scaled security value) once the assets being purchased have been taken into account. If so, your UDC will contact you to discuss your request. Upon approval we will send you the Assetlink Second Schedule for signing.';

  constructor() { }

  ngOnInit(): void {
  }

  savePaymentSchedule() {
    console.log('Payment Schedule Message Saved:', this.paymentScheduleMessage);
  }

  saveAcknowledgement() {
    console.log('Acknowledgement Message Saved:', this.acknowledgementMessage);
  }

  saveDrawdownWarning() {
    console.log('Drawdown Warning Message Saved:', this.drawdownWarningMessage);
  }
}
