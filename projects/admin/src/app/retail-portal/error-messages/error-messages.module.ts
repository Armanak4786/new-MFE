import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RetailErrorMessagesComponent } from './error-messages.component';

const routes: Routes = [
    {
        path: '',
        component: RetailErrorMessagesComponent
    }
];

@NgModule({
    declarations: [RetailErrorMessagesComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ]
})
export class RetailErrorMessagesModule { }
