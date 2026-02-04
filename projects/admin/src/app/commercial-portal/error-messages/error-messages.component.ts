import { Component, OnInit } from '@angular/core';

interface ErrorMessage {
    id: string;
    title: string;
    content: string;
    editing: boolean;
}

@Component({
    selector: 'app-commercial-error-messages',
    templateUrl: './error-messages.component.html',
    styleUrls: ['./error-messages.component.scss']
})
export class CommercialErrorMessagesComponent implements OnInit {

    errorMessages: ErrorMessage[] = [
        {
            id: 'drawdown-request-warning',
            title: 'Drawdown Request- Warning',
            content: 'Please note that this request may exceed either the Facility Limit or the Security Limit (scaled security value) once the assets being purchased have been taken into account. If so, your UDC will contact you to discuss your request. Upon approval we will send you the Assetlink Second Schedule for signing.',
            editing: false
        }
    ];

    constructor() { }

    ngOnInit(): void { }

    saveMessage(message: ErrorMessage): void {
        console.log('Saving Commercial error message:', message.id, message.content);
        // API call to save message would go here
    }
}
