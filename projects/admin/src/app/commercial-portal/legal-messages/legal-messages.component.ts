import { Component, OnInit } from '@angular/core';

interface LegalMessage {
    id: string;
    title: string;
    content: string;
    editing: boolean;
}

@Component({
    selector: 'app-commercial-legal-messages',
    templateUrl: './legal-messages.component.html',
    styleUrls: ['./legal-messages.component.scss']
})
export class CommercialLegalMessagesComponent implements OnInit {

    legalMessages: LegalMessage[] = [
        {
            id: 'submission-success',
            title: 'Application Submission- Success',
            content: `Your request has been submitted to UDC Finance for processing and approval
Request Number is: XXXXXXX
Approval is subject to the terms and conditions applicable to your facility. To assist us in completing your request, please ensure that the Assetlink Second Schedule sent to you is signed and returned to UDC.`,
            editing: false
        },
        {
            id: 'submission-failure',
            title: 'Application Submission- Failure',
            content: 'There was an error submitting your Request. Please try again or contact UDC on 0800 500 832.',
            editing: false
        },
        {
            id: 'drawdown-info',
            title: 'Drawdown- Additional Info',
            content: `Upon submission, this drawdown request will be sent to UDC Finance for approval and processing. Approval will be subject to the terms and conditions of your Assetlink Facility Agreement. Upon approval we will send you Assetlink Second Schedule for signing. To assist us in meeting your drawdown date, please ensure that signed Assetlink Second Schedule is returned to UDC before midday on the day funds are required.`,
            editing: false
        },
        {
            id: 'drawdown-warning',
            title: 'Drawdown Request- Warning',
            content: `Please note that this request may exceed either the Facility Limit or the Security Limit (scaled security value) once the assets being purchased have been taken into account. If so, your UDC will contact you to discuss your request. Upon approval we will send you the Assetlink Second Schedule for signing.`,
            editing: false
        }
    ];

    constructor() { }

    ngOnInit(): void { }

    saveMessage(message: LegalMessage): void {
        console.log('Saving Commercial message:', message.id, message.content);
        // API call to save message would go here
    }
}
