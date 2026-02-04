import { Component, OnInit } from '@angular/core';

interface ErrorMessage {
    id: string;
    title: string;
    content: string;
    editing: boolean;
}

@Component({
    selector: 'app-dealer-error-messages',
    templateUrl: './error-messages.component.html',
    styleUrls: ['./error-messages.component.scss']
})
export class DealerErrorMessagesComponent implements OnInit {

    errorMessages: ErrorMessage[] = [
        {
            id: 'edit-payment-schedule',
            title: 'Edit Payment Schedule',
            content: 'The sum of the segment (Number) field must not exceed the loan term.',
            editing: false
        },
        {
            id: 'application-submission-acknowledgement',
            title: 'Application Submission- Acknowledgement',
            content: 'Your application has been received and is being processed. You will receive a confirmation shortly.',
            editing: false
        },
        {
            id: 'drawdown-request-warning',
            title: 'Drawdown Request- Warning',
            content: 'Please ensure all required documents are submitted before proceeding with the drawdown request.',
            editing: false
        }
    ];

    constructor() { }

    ngOnInit(): void { }

    saveMessage(message: ErrorMessage): void {
        console.log('Saving Dealer error message:', message.id, message.content);
        // API call to save message would go here
    }
}
