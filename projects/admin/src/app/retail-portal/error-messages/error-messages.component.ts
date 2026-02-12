import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'auro-ui';

interface ErrorMessage {
    id: string;
    title: string;
    content: string;
    editing: boolean;
}

@Component({
    selector: 'app-retail-error-messages',
    templateUrl: './error-messages.component.html',
    styleUrls: ['./error-messages.component.scss']
})
export class RetailErrorMessagesComponent implements OnInit {

    errorMessages: ErrorMessage[] = [
        {
            id: 'application-submission-acknowledgement',
            title: 'Application Submission- Acknowledgement',
            content: 'Please acknowledge the terms and conditions before submitting',
            editing: false
        },
    ];

    constructor(private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
        this.breadcrumbService.updateCustomBreadcrumb({
            action: 'prepend',
            label: 'Retail Portal',
            icon: '',
            url: '/',
        });
    }

    saveMessage(message: ErrorMessage): void {
        console.log('Saving Retail error message:', message.id, message.content);
        // API call to save message would go here
    }
}
