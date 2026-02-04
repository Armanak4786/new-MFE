import { Component, OnInit } from '@angular/core';

interface LegalMessage {
    id: string;
    title: string;
    content: string;
    editing: boolean;
}

@Component({
    selector: 'app-retail-legal-messages',
    templateUrl: './legal-messages.component.html',
    styleUrls: ['./legal-messages.component.scss']
})
export class RetailLegalMessagesComponent implements OnInit {

    legalMessages: LegalMessage[] = [
        {
            id: 'submission-success',
            title: 'Application Submission- Success',
            content: `Success Message`,
            editing: false
        },
    ];

    constructor() { }

    ngOnInit(): void { }

    saveMessage(message: LegalMessage): void {
        console.log('Saving Retail message:', message.id, message.content);
        // API call to save message would go here
    }
}
