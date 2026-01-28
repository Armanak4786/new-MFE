import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AuroUiFrameWork } from 'auro-ui';

@Component({
  selector: 'app-legal-messages',
  templateUrl: './legal-messages.component.html',
  styleUrls: ['./legal-messages.component.scss']
})
export class LegalMessagesComponent implements OnInit {

  @Input() selectedTab: string = 'quotesAndApps';

  // Quotes and Apps messages
  disclosureMessage: string = 'Disclosure Message';
  successMessage: string = 'Success Message';
  failureMessage: string = 'Failure Message';

  // Customer Information Portal messages
  cipSuccessMessage: string = 'Your request has been submitted to UDC Finance for processing and approval\nRequest Number is: XXXXXXX\nApproval is subject to the terms and conditions applicable to your facility. To assist us in completing your request, please ensure that the Assetlink Second Schedule sent to you is signed and returned to UDC.';
  cipFailureMessage: string = 'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832.';
  drawdownMessage: string = 'Upon submission, this drawdown request will be sent to UDC Finance for approval and processing. Approval will be subject to the terms and conditions of your Assetlink Facility Agreement. Upon approval we will send you Assetlink Second Schedule for signing. To assist us in meeting your drawdown date, please ensure that signed Assetlink Second Schedule is returned to UDC before midday on the day funds are required.';

  constructor() { }

  ngOnInit(): void {
  }

  saveDisclosure() {
    console.log('Disclosure Saved:', this.disclosureMessage);
  }

  saveSuccessMessage() {
    console.log('Success Message Saved:', this.successMessage);
  }

  saveFailureMessage() {
    console.log('Failure Message Saved:', this.failureMessage);
  }

  saveCipSuccessMessage() {
    console.log('CIP Success Message Saved:', this.cipSuccessMessage);
  }

  saveCipFailureMessage() {
    console.log('CIP Failure Message Saved:', this.cipFailureMessage);
  }

  saveDrawdownMessage() {
    console.log('Drawdown Message Saved:', this.drawdownMessage);
  }
}