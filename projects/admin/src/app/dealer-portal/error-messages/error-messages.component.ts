import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'auro-ui';

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
        }
    ];

    constructor(private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
        this.breadcrumbService.updateCustomBreadcrumb({
            action: 'prepend',
            label: 'Dealer Portal',
            icon: '',
            url: '/',
        });
    }

    saveMessage(message: ErrorMessage): void {
        console.log('Saving Dealer error message:', message.id, message.content);
        // API call to save message would go here
    }
}
